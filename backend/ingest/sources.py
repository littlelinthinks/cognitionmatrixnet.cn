"""多源数据采集：arXiv / GitHub Trending / HuggingFace / RSS。

每个 fetcher 返回统一的 RawItem 列表；单个源失败不会影响整体（异常被捕获并记日志）。
arXiv / RSS 归入 insights（行业情报）；GitHub / HuggingFace 归入 tools（AI 工具矩阵）。
"""
from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

import feedparser
import requests

log = logging.getLogger("ingest.sources")

HEADERS = {"User-Agent": "CognitionMatrixBot/1.0 (+https://cognitionmatrixnet.cn)"}

DEFAULT_RSS = [
    ("OpenAI Blog", "https://openai.com/blog/rss.xml"),
    ("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    ("36Kr 科技", "https://36kr.com/feed"),
]


def _to_iso(val: str) -> str:
    """尽力把各种时间格式规一化为 ISO8601（UTC）。失败则回退当前时间。"""
    if not val:
        return datetime.now(timezone.utc).isoformat()
    try:
        dt = parsedate_to_datetime(val)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()


@dataclass
class RawItem:
    source: str
    source_url: str
    title: str
    content: str = ""
    author: str = ""
    published_at: str = ""
    category_hint: str = ""
    tags: list[str] = field(default_factory=list)
    stars: int = 0
    extra: dict = field(default_factory=dict)

    def stable_url(self) -> str:
        """确保 source_url 非空且唯一，作为数据库幂等去重键（对应 insights/tools 的 unique 约束）。"""
        if self.source_url:
            return self.source_url
        h = hashlib.sha256(f"{self.source}|{self.title}".encode()).hexdigest()[:16]
        return f"{self.source.lower()}://{h}"


# --------------------------------------------------------------------------- #
# 各数据源抓取
# --------------------------------------------------------------------------- #
def fetch_arxiv(limit: int) -> list[RawItem]:
    items: list[RawItem] = []
    try:
        url = (
            "http://export.arxiv.org/api/query?"
            "search_query=all:ai+OR+all:large+language+model+OR+all:agent+OR+all:multimodal&"
            "sortBy=submittedDate&sortOrder=descending&max_results=%d" % limit
        )
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        for e in feed.entries[:limit]:
            items.append(
                RawItem(
                    source="arXiv",
                    source_url=e.get("link", ""),
                    title=e.get("title", "").replace("\n", " ").strip(),
                    content=(e.get("summary", "") or "")[:4000],
                    author=", ".join(a.get("name", "") for a in e.get("authors", [])),
                    published_at=_to_iso(e.get("published", "")),
                    category_hint="技术前沿",
                )
            )
        log.info("arXiv 抓取 %d 条", len(items))
    except Exception as ex:  # noqa: BLE001
        log.exception("arXiv 抓取失败: %s", ex)
    return items


def fetch_github(limit: int, token: str = "") -> list[RawItem]:
    items: list[RawItem] = []
    try:
        since = (datetime.now(timezone.utc) - timedelta(days=30)).strftime("%Y-%m-%d")
        q = f"stars:>50 pushed:>{since} (AI OR LLM OR agent OR generative)"
        headers = {"Accept": "application/vnd.github+json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        resp = requests.get(
            "https://api.github.com/search/repositories",
            params={"q": q, "sort": "stars", "order": "desc", "per_page": limit},
            headers=headers,
            timeout=30,
        )
        resp.raise_for_status()
        for r in resp.json().get("items", [])[:limit]:
            owner = r.get("owner", {}) or {}
            items.append(
                RawItem(
                    source="GitHub",
                    source_url=r.get("html_url", ""),
                    title=r.get("full_name", ""),
                    content=(r.get("description", "") or "")[:2000],
                    author=owner.get("login", ""),
                    published_at=_to_iso(r.get("pushed_at", "")),
                    category_hint="AI工具",
                    tags=r.get("topics", [])[:6],
                    stars=r.get("stargazers_count", 0),
                    extra={
                        "language": r.get("language"),
                        "homepage": r.get("homepage"),
                        "repo_url": r.get("html_url"),
                    },
                )
            )
        log.info("GitHub 抓取 %d 条", len(items))
    except Exception as ex:  # noqa: BLE001
        log.exception("GitHub 抓取失败: %s", ex)
    return items


def fetch_huggingface(limit: int) -> list[RawItem]:
    items: list[RawItem] = []
    try:
        url = f"https://huggingface.co/api/models?sort=downloads&direction=-1&limit={limit}&full=false"
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        for m in resp.json()[:limit]:
            mid = m.get("id", "")
            items.append(
                RawItem(
                    source="HuggingFace",
                    source_url=f"https://huggingface.co/{mid}",
                    title=mid,
                    content=(m.get("description", "") or m.get("pipeline_tag", ""))[:2000],
                    author=mid.split("/")[0] if "/" in mid else "",
                    published_at=_to_iso(m.get("createdAt", "")),
                    category_hint="AI工具",
                    tags=m.get("tags", [])[:6],
                    stars=m.get("downloads", 0),
                    extra={
                        "pipeline_tag": m.get("pipeline_tag"),
                        "downloads": m.get("downloads", 0),
                        "likes": m.get("likes", 0),
                    },
                )
            )
        log.info("HuggingFace 抓取 %d 条", len(items))
    except Exception as ex:  # noqa: BLE001
        log.exception("HuggingFace 抓取失败: %s", ex)
    return items


def fetch_rss(per_feed: int, feeds: str = "") -> list[RawItem]:
    items: list[RawItem] = []
    sources = []
    if feeds.strip():
        for part in feeds.split(","):
            if "|" in part:
                name, u = part.split("|", 1)
                sources.append((name.strip(), u.strip()))
    if not sources:
        sources = DEFAULT_RSS

    for name, url in sources:
        try:
            feed = feedparser.parse(url)
            for e in feed.entries[:per_feed]:
                items.append(
                    RawItem(
                        source=name,
                        source_url=e.get("link", ""),
                        title=e.get("title", "").replace("\n", " ").strip(),
                        content=(e.get("summary") or e.get("description") or "")[:4000],
                        author=e.get("author", ""),
                        published_at=_to_iso(e.get("published") or e.get("updated", "")),
                        category_hint="行业报告",
                    )
                )
            log.info("RSS[%s] 抓取 %d 条", name, min(per_feed, len(feed.entries)))
        except Exception as ex:  # noqa: BLE001
            log.exception("RSS 抓取失败 %s: %s", url, ex)
    return items
