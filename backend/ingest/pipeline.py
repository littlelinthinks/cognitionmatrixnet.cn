"""Cognition Matrix 自动摄入 Pipeline —— 主入口。

流程：多源并发抓取 → LLM 结构化提炼 + 0-100 质量打分 → 生成 1536 维 Embedding
      → 按 Quality Gate（>=80）upsert 进 Supabase（service_role）→ 可选构建知识图谱。

运行：
  pip install -r requirements.txt
  python pipeline.py                 # 生产：读取环境变量真实写入
  python pipeline.py --dry-run       # 只跑流程、打印结果，不写库（本地验证用）
  python pipeline.py --limit 3       # 每源上限 3 条（快速冒烟测试）
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import Settings
from db import DB
from llm import LLMEngine
from sources import RawItem, fetch_arxiv, fetch_github, fetch_huggingface, fetch_rss

log = logging.getLogger("ingest")


def setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )


def _build_insight_row(it: RawItem, d: dict, cfg: Settings) -> dict:
    return {
        "title": d["title"],
        "summary": d["summary"],
        "content": it.content,
        "key_breakthrough": d.get("key_breakthrough", ""),
        "takeaways": d.get("takeaways", []),
        "tags": d.get("tags", []),
        "category": d.get("category", "AI动态"),
        "industry": it.extra.get("industry", "人工智能"),
        "source": it.source,
        "source_url": it.stable_url(),
        "author": it.author,
        "cover_url": it.extra.get("cover_url", ""),
        "published_at": it.published_at or None,
        "is_featured": d["quality_score"] >= 90,
        "quality_score": d["quality_score"],
        "status": "published" if d["quality_score"] >= cfg.quality_threshold else "draft",
        "embedding": d["embedding"],
        "raw_payload": {"original": it.__dict__},
    }


def _build_tool_row(it: RawItem, d: dict, cfg: Settings) -> dict:
    return {
        "title": d["title"],
        "description": d["summary"],
        "category": d.get("category", "AI工具"),
        "tags": ", ".join(d.get("tags", [])),
        "source": it.source,
        "source_url": it.stable_url(),
        "homepage_url": it.extra.get("homepage", ""),
        "repo_url": it.extra.get("repo_url", it.source_url),
        "stars": it.stars or it.extra.get("downloads", 0),
        "download_url": it.source_url,
        "takeaways": d.get("takeaways", []),
        "quality_score": d["quality_score"],
        "status": "published" if d["quality_score"] >= cfg.quality_threshold else "draft",
        "sort_order": 0,
        "embedding": d["embedding"],
        "raw_payload": {"original": it.__dict__},
    }


def _graph_from_insight(db: DB, engine: LLMEngine, insight_id: str, row: dict, d: dict):
    """抽取实体 → knowledge_nodes（去重 upsert）→ 实体间共现边 knowledge_edges。

    返回 (新增节点数, 新增边数)。
    """
    nodes, edges = 0, 0
    try:
        ents = engine.extract_entities(row["title"], row["summary"])
        node_ids: list[str] = []
        for e in ents:
            etype = e.get("type", "concept")
            label = e.get("label", "").strip()
            if not label:
                continue
            emb = engine.embed(f'{label} {e.get("summary", "")}')
            db.upsert(
                "knowledge_nodes",
                {
                    "label": label,
                    "type": etype,
                    "summary": e.get("summary", ""),
                    "embedding": emb,
                    "source_ids": [insight_id],
                },
                on_conflict="label,type",
            )
            r = (
                db.client.table("knowledge_nodes")
                .select("id,source_ids")
                .eq("label", label)
                .eq("type", etype)
                .maybe_single()
                .execute()
            )
            if r and r.data:
                nid = r.data["id"]
                node_ids.append(nid)
                sids = set(r.data.get("source_ids") or [])
                sids.add(insight_id)
                db.client.table("knowledge_nodes").update({"source_ids": list(sids)}).eq(
                    "id", nid
                ).execute()
                nodes += 1
        # 同一情报内实体两两建共现边
        for i in range(len(node_ids)):
            for j in range(i + 1, len(node_ids)):
                db.upsert(
                    "knowledge_edges",
                    {
                        "source_id": node_ids[i],
                        "target_id": node_ids[j],
                        "relation": "relates_to",
                        "weight": 0.6,
                    },
                    on_conflict="source_id,target_id,relation",
                )
                edges += 1
    except Exception as ex:  # noqa: BLE001
        log.warning("图谱构建异常（已跳过该条）: %s", ex)
    return nodes, edges


def _dedupe(items: list[RawItem]) -> list[RawItem]:
    seen, out = set(), []
    for it in items:
        u = it.stable_url()
        if u in seen:
            continue
        seen.add(u)
        out.append(it)
    return out


def main() -> None:
    setup_logging()
    parser = argparse.ArgumentParser(description="Cognition Matrix 自动摄入 Pipeline")
    parser.add_argument("--dry-run", action="store_true", help="只跑流程不写库")
    parser.add_argument("--limit", type=int, default=0, help="覆盖每源上限")
    args = parser.parse_args()

    cfg = Settings()
    if args.dry_run:
        cfg.dry_run = True
    if args.limit:
        cfg.max_items_per_source = args.limit
    if cfg.dry_run:
        log.info("=== DRY RUN 模式：不会写入 Supabase ===")

    errs = cfg.validate()
    if errs:
        for e in errs:
            log.error("配置缺失: %s", e)
        if not cfg.dry_run:
            sys.exit(1)

    engine = LLMEngine(cfg)
    db = DB(cfg)

    # 1) 抓取
    log.info("开始多源抓取 …")
    raw_insights: list[RawItem] = []
    raw_insights += fetch_arxiv(cfg.max_items_per_source)
    raw_insights += fetch_rss(cfg.max_items_per_source, cfg.rss_feeds)
    raw_tools: list[RawItem] = []
    raw_tools += fetch_github(cfg.max_items_per_source, cfg.github_token)
    raw_tools += fetch_huggingface(cfg.max_items_per_source)

    raw_insights = _dedupe(raw_insights)
    raw_tools = _dedupe(raw_tools)
    total = min(cfg.max_items_total, len(raw_insights) + len(raw_tools))
    log.info("抓取完成：insights=%d, tools=%d（本次处理上限 %d）", len(raw_insights), len(raw_tools), total)

    stats = {
        "insights_published": 0,
        "insights_draft": 0,
        "tools_published": 0,
        "tools_draft": 0,
        "failed": 0,
        "nodes": 0,
        "edges": 0,
    }
    processed = 0

    # 2) 处理 insights（arXiv / RSS）
    for it in raw_insights:
        if processed >= total:
            break
        processed += 1
        try:
            d = engine.process(it, "insights")
            row = _build_insight_row(it, d, cfg)
            if not cfg.dry_run:
                db.upsert("insights", row, on_conflict="source_url")
                insight_id = db.select_id_by_source_url("insights", row["source_url"])
                if cfg.enable_knowledge_graph and insight_id:
                    nn, ee = _graph_from_insight(db, engine, insight_id, row, d)
                    stats["nodes"] += nn
                    stats["edges"] += ee
            if d["quality_score"] >= cfg.quality_threshold:
                stats["insights_published"] += 1
                tag = "PUB"
            else:
                stats["insights_draft"] += 1
                tag = "draft"
            log.info("INSIGHT [%s] score=%d %s", tag, d["quality_score"], d["title"][:40])
        except Exception as ex:  # noqa: BLE001
            log.exception("处理 insight 失败: %s", ex)
            stats["failed"] += 1

    # 3) 处理 tools（GitHub / HuggingFace）
    for it in raw_tools:
        if processed >= total:
            break
        processed += 1
        try:
            d = engine.process(it, "tools")
            row = _build_tool_row(it, d, cfg)
            if not cfg.dry_run:
                db.upsert("tools", row, on_conflict="source_url")
            if d["quality_score"] >= cfg.quality_threshold:
                stats["tools_published"] += 1
                tag = "PUB"
            else:
                stats["tools_draft"] += 1
                tag = "draft"
            log.info("TOOL    [%s] score=%d %s", tag, d["quality_score"], d["title"][:40])
        except Exception as ex:  # noqa: BLE001
            log.exception("处理 tool 失败: %s", ex)
            stats["failed"] += 1

    log.info("=== 运行结束 === %s", json.dumps(stats, ensure_ascii=False))


if __name__ == "__main__":
    main()
