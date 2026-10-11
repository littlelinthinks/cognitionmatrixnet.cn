"""Supabase 写入层。

使用 service_role 密钥创建客户端 —— 该角色绕过 RLS，因此后台 Pipeline 可自由写入，
而前端仍受 Step 1 中配置的 RLS 策略约束（仅能读到 status='published' 的内容）。
写入统一走 `upsert` + `on_conflict='source_url'`，实现幂等去重（同链接重复抓取自动刷新）。
"""
from __future__ import annotations

import logging
from typing import Any, Optional

from supabase import Client, create_client

from config import Settings

log = logging.getLogger("ingest.db")


class DB:
    def __init__(self, cfg: Settings) -> None:
        self.cfg = cfg
        self.client: Optional[Client] = None
        if cfg.supabase_url and cfg.supabase_service_role_key:
            self.client = create_client(cfg.supabase_url, cfg.supabase_service_role_key)
        else:
            log.warning("Supabase 凭证缺失，DB 客户端未初始化（dry-run 模式可忽略）")

    def upsert(self, table: str, row: dict, on_conflict: str) -> Optional[Any]:
        if self.client is None:
            log.warning("[dry] 未连接数据库，跳过写入 %s", table)
            return None
        try:
            return self.client.table(table).upsert(row, on_conflict=on_conflict).execute()
        except Exception as ex:  # noqa: BLE001
            log.exception("写入 %s 失败: %s", table, ex)
            return None

    def select_id_by_source_url(self, table: str, source_url: str) -> Optional[str]:
        if self.client is None:
            return None
        try:
            r = (
                self.client.table(table)
                .select("id")
                .eq("source_url", source_url)
                .maybe_single()
                .execute()
            )
            return r.data["id"] if r and r.data else None
        except Exception:  # noqa: BLE001
            return None
