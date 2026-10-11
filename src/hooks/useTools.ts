/**
 * useTools —— 获取已发布的 AI 工具矩阵（tools）。
 *
 * - 数据来自 Supabase（RLS 保证只读到已发布内容）。
 * - 支持按 category 筛选、按 tag 关键字搜索、按 sort_order 或 quality_score 排序。
 * - 具备 loading / error 状态；连接失败或库为空时降级到静态数据（degraded=true）。
 */
import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Tool } from "@/data/tools";
import { mapDbToolToTool, FALLBACK_TOOLS, type ToolRow } from "@/lib/mappers";

const TOOL_COLUMNS =
  "id,title,description,category,tags,download_count,cover_url,download_url,extract_code,sort_order,source,source_url,stars,quality_score";

export type ToolSort = "sort_order" | "quality_score" | "stars" | "created_at";

export interface UseToolsOptions {
  category?: string;
  search?: string;
  sortBy?: ToolSort;
  page?: number;
  pageSize?: number;
}

export interface UseToolsResult {
  data: Tool[];
  loading: boolean;
  error: Error | null;
  degraded: boolean;
  refetch: () => void;
}

export function useTools(options: UseToolsOptions = {}): UseToolsResult {
  const {
    category,
    search,
    sortBy = "sort_order",
    page = 0,
    pageSize = 24,
  } = options;
  const [data, setData] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [degraded, setDegraded] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setData(applyLocalFilters(FALLBACK_TOOLS, { category, search }));
      setDegraded(true);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("tools")
        .select(TOOL_COLUMNS, { count: "exact" })
        // sort_order 为正序（Pipeline 设定的推荐权重），其余均降序（高质量/高 Star/最新在前）
        .order(sortBy, {
          ascending: sortBy === "sort_order",
        })
        .range(page * pageSize, page * pageSize + pageSize - 1);

      if (category && category !== "全部") {
        query = query.eq("category", category);
      }

      const { data: rows, error: err } = await query;
      if (err) throw err;

      const mapped =
        (rows as unknown as ToolRow[] | null)?.map(mapDbToolToTool) ?? [];

      if (mapped.length === 0) {
        setData(applyLocalFilters(FALLBACK_TOOLS, { category, search }));
        setDegraded(true);
      } else {
        // 标签关键字搜索在客户端做（tags 为逗号分隔字符串）。
        setData(applyLocalFilters(mapped, { search }));
        setDegraded(false);
      }
    } catch (e) {
      setError(e as Error);
      setData(applyLocalFilters(FALLBACK_TOOLS, { category, search }));
      setDegraded(true);
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy, page, pageSize]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, degraded, refetch: () => void fetchData() };
}

/** 客户端侧分类 + 标签/标题/描述关键字过滤（与 ToolLibrary 现有交互保持一致）。 */
function applyLocalFilters(
  tools: Tool[],
  opts: { category?: string; search?: string },
): Tool[] {
  let result = tools;
  if (opts.category && opts.category !== "全部") {
    result = result.filter((t) => t.category === opts.category);
  }
  if (opts.search && opts.search.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.toLowerCase().includes(q),
    );
  }
  return result;
}
