/**
 * Supabase 客户端 —— 类型化封装（基于 0001_init_cognition_matrix.sql Migration）。
 *
 * - 使用 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 初始化（匿名只读，受 RLS 约束）。
 * - Database 类型覆盖 insights / tools / knowledge_nodes / knowledge_edges 四张表，
 *   以及 match_insights / match_tools / match_knowledge_nodes 三个向量检索 RPC。
 * - 写入（Pipeline）一律走 service_role 密钥，详见第二步 backend/ingest/db.py。
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

/** 是否已正确配置 Supabase 环境变量（未配置时前端所有数据 Hook 自动降级到静态数据）。 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // 不致命：Hooks 会平滑降级到静态数据，站点功能不受影响。
  console.warn(
    "[supabase] 未检测到 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY，数据相关功能将使用本地静态降级数据。",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

// ---------------------------------------------------------------------------
// 类型定义（与 Migration 0001 严格对齐）
// ---------------------------------------------------------------------------
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type InsightsRow = {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  industry: string | null;
  source: string | null;
  author: string | null;
  published_at: string;
  cover_url: string | null;
  view_count: number;
  is_featured: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  key_breakthrough: string | null;
  takeaways: Json | null;
  tags: string[] | null;
  source_url: string | null;
  content_hash: string | null;
  quality_score: number;
  status: string;
  embedding: number[] | null;
  raw_payload: Json | null;
};

type ToolsRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  tags: string | null;
  download_count: number;
  cover_url: string | null;
  download_url: string | null;
  extract_code: string | null;
  sort_order: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  source: string | null;
  source_url: string | null;
  homepage_url: string | null;
  repo_url: string | null;
  stars: number | null;
  takeaways: Json | null;
  quality_score: number;
  status: string;
  embedding: number[] | null;
  raw_payload: Json | null;
};

type KnowledgeNodesRow = {
  id: string;
  label: string;
  type: string;
  summary: string | null;
  source_ids: string[] | null;
  embedding: number[] | null;
  metadata: Json | null;
  created_at: string;
  updated_at: string;
};

type KnowledgeEdgesRow = {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  weight: number;
  metadata: Json | null;
  created_at: string;
};

type MatchInsightsReturn = {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  source: string | null;
  published_at: string;
  similarity: number;
}[];

type MatchToolsReturn = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  source_url: string | null;
  stars: number | null;
  similarity: number;
}[];

type MatchNodesReturn = {
  id: string;
  label: string;
  type: string;
  summary: string | null;
  similarity: number;
}[];

export type Database = {
  public: {
    Tables: {
      insights: {
        Row: InsightsRow;
        Insert: Partial<InsightsRow>;
        Update: Partial<InsightsRow>;
      };
      tools: {
        Row: ToolsRow;
        Insert: Partial<ToolsRow>;
        Update: Partial<ToolsRow>;
      };
      knowledge_nodes: {
        Row: KnowledgeNodesRow;
        Insert: Partial<KnowledgeNodesRow>;
        Update: Partial<KnowledgeNodesRow>;
      };
      knowledge_edges: {
        Row: KnowledgeEdgesRow;
        Insert: Partial<KnowledgeEdgesRow>;
        Update: Partial<KnowledgeEdgesRow>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_insights: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
          filter_category?: string | null;
        };
        Returns: MatchInsightsReturn;
      };
      match_tools: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
          filter_category?: string | null;
        };
        Returns: MatchToolsReturn;
      };
      match_knowledge_nodes: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
        };
        Returns: MatchNodesReturn;
      };
    };
    Enums: Record<string, never>;
  };
};
