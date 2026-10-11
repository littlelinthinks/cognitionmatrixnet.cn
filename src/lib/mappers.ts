/**
 * 数据契约桥接层。
 *
 * 1) DB Row -> 前端 Insight / Tool（与 src/data/insights.ts、src/data/tools.ts 接口完全兼容）。
 * 2) 静态降级数据：从 src/data/mockData.ts 现有静态数据转换而来，
 *    当 Supabase 未配置 / 连接失败 / 库为空时，Hooks 平滑切回，保证 UI 永不白屏。
 */
import type { Insight } from "@/data/insights";
import type { Tool } from "@/data/tools";
import { insightItems, tools as mockTools } from "@/data/mockData";

/** 与 useInsights 查询时 select 的列一一对应。 */
export interface InsightRow {
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
  key_breakthrough: string | null;
  takeaways: string[] | null;
  tags: string[] | null;
  quality_score: number;
}

/** DB insights 行 -> 前端 Insight（第四步替换数据源时组件零报错）。 */
export function mapDbInsightToInsight(row: InsightRow): Insight {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? "",
    content: row.content ?? "",
    category: row.category,
    industry: row.industry ?? "人工智能",
    source: row.source ?? "",
    author: row.author ?? "",
    published_at: row.published_at,
    cover_url: row.cover_url ?? "",
    view_count: row.view_count ?? 0,
    is_featured: row.is_featured ?? false,
    is_deleted: false,
    created_at: row.published_at,
    updated_at: row.published_at,
  };
}

/** 与 useTools 查询时 select 的列一一对应。 */
export interface ToolRow {
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
  source: string | null;
  source_url: string | null;
  stars: number | null;
  quality_score: number;
}

/** DB tools 行 -> 前端 Tool。注意 tags 仍是逗号分隔字符串（与现有 Tool.tags 类型一致）。 */
export function mapDbToolToTool(row: ToolRow): Tool {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    tags: row.tags ?? "",
    download_count: row.download_count ?? row.stars ?? 0,
    cover_url: row.cover_url ?? "",
    download_url: row.download_url ?? "",
    extract_code: row.extract_code ?? "",
    sort_order: row.sort_order ?? 0,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 静态降级数据（来源于 src/data/mockData.ts 现有静态数据）
// ---------------------------------------------------------------------------
export const FALLBACK_INSIGHTS: Insight[] = insightItems.map((it) => ({
  id: it.id,
  title: it.title,
  summary: it.summary,
  content: it.summary,
  category: it.category,
  industry: "人工智能",
  source: "Cognition Matrix",
  author: "",
  published_at: new Date(it.publishDate).toISOString(),
  cover_url: it.coverUrl,
  view_count: 0,
  is_featured: false,
  is_deleted: false,
  created_at: new Date(it.publishDate).toISOString(),
  updated_at: new Date(it.publishDate).toISOString(),
}));

export const FALLBACK_TOOLS: Tool[] = mockTools.map((it) => ({
  id: it.id,
  title: it.title,
  description: it.description,
  category: it.category,
  tags: it.tags.join(", "),
  download_count: it.downloadCount,
  cover_url: it.coverUrl,
  download_url: it.downloadUrl,
  extract_code: it.extractCode,
  sort_order: 0,
  is_deleted: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));
