"""配置与环境变量加载。

所有密钥（OPENAI_API_KEY / DEEPSEEK_API_KEY / SUPABASE_SERVICE_ROLE_KEY 等）
均通过环境变量传入，不在代码中硬编码。
"""
from __future__ import annotations

import os
import sys

# 保证同目录模块可被直接 import（无论 cwd 在哪）
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Pipeline 运行配置，全部从环境变量读取。"""

    def __init__(self) -> None:
        # —— Supabase ——
        self.supabase_url: str = os.getenv("SUPABASE_URL", "")
        self.supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        # —— LLM（摘要 + 打分）provider ——
        self.llm_provider: str = os.getenv("LLM_PROVIDER", "openai").lower()
        self.openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
        self.deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
        self.deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
        self.llm_model: str = os.getenv(
            "LLM_MODEL",
            "gpt-4o-mini" if self.llm_provider == "openai" else "deepseek-chat",
        )

        # —— Embedding provider（OpenAI 兼容端点）——
        self.embedding_api_key: str = os.getenv("EMBEDDING_API_KEY", self.openai_api_key)
        self.embedding_base_url: str = os.getenv("EMBEDDING_BASE_URL", "https://api.openai.com/v1")
        self.embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
        self.embedding_dim: int = int(os.getenv("EMBEDDING_DIM", "1536"))

        # —— 抓取 / 处理控制 ——
        self.max_items_per_source: int = int(os.getenv("MAX_ITEMS_PER_SOURCE", "8"))
        self.max_items_total: int = int(os.getenv("MAX_ITEMS_TOTAL", "40"))
        self.quality_threshold: int = int(os.getenv("QUALITY_THRESHOLD", "80"))
        self.enable_knowledge_graph: bool = os.getenv("ENABLE_KNOWLEDGE_GRAPH", "true").lower() not in (
            "0", "false", "no",
        )
        self.dry_run: bool = os.getenv("DRY_RUN", "false").lower() in ("1", "true", "yes")
        self.rss_feeds: str = os.getenv("RSS_FEEDS", "")
        self.github_token: str = os.getenv("GITHUB_TOKEN", "")

    def validate(self) -> list[str]:
        """返回缺失的必要配置错误列表。"""
        errs: list[str] = []
        if not self.supabase_url:
            errs.append("SUPABASE_URL 缺失")
        if not self.supabase_service_role_key:
            errs.append("SUPABASE_SERVICE_ROLE_KEY 缺失（用于写入，绕过 RLS）")
        if self.llm_provider == "openai" and not self.openai_api_key:
            errs.append("OPENAI_API_KEY 缺失（LLM_PROVIDER=openai）")
        if self.llm_provider == "deepseek" and not self.deepseek_api_key:
            errs.append("DEEPSEEK_API_KEY 缺失（LLM_PROVIDER=deepseek）")
        if not self.embedding_api_key:
            errs.append("EMBEDDING_API_KEY / OPENAI_API_KEY 缺失（用于向量化）")
        return errs
