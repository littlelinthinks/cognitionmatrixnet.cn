"""LLM 智能提炼 + 0-100 质量打分 + 1536 维 Embedding。

- 摘要/打分：支持 OpenAI 与 DeepSeek（OpenAI 兼容协议），通过 LLM_PROVIDER 切换。
- 向量化：统一走 OpenAI 兼容 Embedding 端点（默认 text-embedding-3-small，1536 维）。
- 全部调用带 tenacity 重试，避免偶发限流导致整批失败。
"""
from __future__ import annotations

import json
import logging
from typing import Any

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from config import Settings
from sources import RawItem

log = logging.getLogger("ingest.llm")

CATEGORIES = ["AI动态", "行业报告", "市场趋势", "技术前沿", "政策监管"]

SYSTEM_PROMPT = """你是一位资深 AI 领域编辑与分析师。请将输入素材提炼为中文结构化情报。
严格要求：仅输出一个 JSON 对象，不要任何额外文字或代码块标记。字段如下：
{
  "title": "中文标题（原文非中文请翻译/改写，保留专有名词）",
  "summary": "一句话总结（≤40字，突出核心价值）",
  "key_breakthrough": "核心突破点（≤80字）",
  "takeaways": ["关键要点1", "关键要点2", "关键要点3"],
  "tags": ["标签1", "标签2", "标签3"],
  "category": "从固定集合选一: AI动态/行业报告/市场趋势/技术前沿/政策监管",
  "quality_score": 0,
  "quality_rationale": "简短打分依据"
}
质量打分 Quality Score (0-100) 三维度：
- 技术创新度 (0-40)：是否提出新方法/架构/突破
- 硬核实用性 (0-30)：是否可落地、有无代码/实验验证
- 商业前景 (0-30)：市场价值与可应用广度
只有信息密度高、对 AI 从业者真正有价值的内容才给 ≥80 分；普通资讯/营销稿 ≤60 分。
"""

USER_TMPL = """【来源】{source}
【原始标题】{title}
【原文内容】{content}
【提示分类】{category_hint}

请按系统要求输出 JSON。"""

ENTITY_SYSTEM = (
    "你是知识图谱构建助手。从给定文本中抽取 2-5 个核心实体"
    "(技术/概念/公司/方法/数据集/工具/人物)。仅输出 JSON: "
    '{"entities":[{"label":"名称","type":"tech|concept|company|method|dataset|tool|person",'
    '"summary":"一句话释义"}]}'
)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _chat_json(client: OpenAI, model: str, system: str, user: str) -> dict[str, Any]:
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    content = resp.choices[0].message.content or "{}"
    # 兜底：去掉可能的 ```json 代码块标记
    content = content.strip().strip("`")
    if content.startswith("json"):
        content = content[4:].strip()
    return json.loads(content)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _embed(client: OpenAI, model: str, text: str) -> list[float]:
    resp = client.embeddings.create(model=model, input=text[:8000])
    return resp.data[0].embedding


class LLMEngine:
    """封装聊天 + 向量化客户端。"""

    def __init__(self, cfg: Settings) -> None:
        self.cfg = cfg
        if cfg.llm_provider == "deepseek":
            self.llm_client = OpenAI(api_key=cfg.deepseek_api_key, base_url=cfg.deepseek_base_url)
            self.llm_model = cfg.llm_model or "deepseek-chat"
        else:
            self.llm_client = OpenAI(api_key=cfg.openai_api_key)
            self.llm_model = cfg.llm_model or "gpt-4o-mini"
        # Embedding 始终走 OpenAI 兼容端点
        self.emb_client = OpenAI(api_key=cfg.embedding_api_key, base_url=cfg.embedding_base_url)
        self.emb_model = cfg.embedding_model

    def process(self, item: RawItem, table: str) -> dict[str, Any]:
        """调用 LLM 提炼并打分，生成 embedding，返回归一化后的结构化 dict。"""
        user = USER_TMPL.format(
            source=item.source,
            title=item.title,
            content=item.content or "(无正文，请基于标题判断)",
            category_hint=item.category_hint or "技术前沿",
        )
        data = _chat_json(self.llm_client, self.llm_model, SYSTEM_PROMPT, user)

        data.setdefault("title", item.title)
        data.setdefault("summary", "")
        data.setdefault("key_breakthrough", "")
        data["takeaways"] = data.get("takeaways") or []
        data["tags"] = data.get("tags") or []
        data["category"] = data.get("category") or item.category_hint or "AI动态"
        if data["category"] not in CATEGORIES:
            data["category"] = item.category_hint or "AI动态"
        try:
            score = int(data.get("quality_score", 0))
        except (TypeError, ValueError):
            score = 0
        data["quality_score"] = max(0, min(100, score))

        emb_text = " ".join(
            [data["title"], data["summary"], data.get("key_breakthrough", ""), " ".join(data["tags"])]
        )
        data["embedding"] = self.embed(emb_text)
        return data

    def embed(self, text: str) -> list[float]:
        return _embed(self.emb_client, self.emb_model, text)

    def extract_entities(self, title: str, summary: str) -> list[dict]:
        try:
            d = _chat_json(
                self.llm_client,
                self.llm_model,
                ENTITY_SYSTEM,
                f"标题：{title}\n摘要：{summary}",
            )
            return d.get("entities", []) or []
        except Exception as ex:  # noqa: BLE001
            log.warning("实体抽取失败: %s", ex)
            return []
