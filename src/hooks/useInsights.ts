/**
 * useInsights —— 获取已发布的行业情报（insights）。
 *
 * - 数据来自 Supabase（RLS 已保证只读到 status='published' 且未删除的内容）。
 * - 支持按 category / industry 筛选与分页。
 * - 具备 loading / error 状态；当 Supabase 未配置、连接失败或库为空时，
 *   自动平滑降级到 src/data/mockData 的静态数据（degraded=true 供 UI 提示）。
 */
import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Insight } from "@/data/insights";
import {
  mapDbInsightToInsight,
  FALLBACK_INSIGHTS,
  type InsightRow,
} from "@/lib/mappers";

// 仅选取 UI 需要的列，避免把 embedding 等大字段下发到前端。
const INSIGHT_COLUMNS =
  "id,title,summary,content,category,industry,source,author,published_at,cover_url,view_count,is_featured,key_breakthrough,takeaways,tags,quality_score";

export interface UseInsightsOptions {
  category?: string;
  industry?: string;
  page?: number;
  pageSize?: number;
}

export interface UseInsightsResult {
  data: Insight[];
  loading: boolean;
  error: Error | null;
  degraded: boolean;
  refetch: () => void;
}

export function useInsights(options: UseInsightsOptions = {}): UseInsightsResult {
  const { category, industry, page = 0, pageSize = 12 } = options;
  const [data, setData] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [degraded, setDegraded] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setData(FALLBACK_INSIGHTS);
      setDegraded(true);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("insights")
        .select(INSIGHT_COLUMNS, { count: "exact" })
        .order("published_at", { ascending: false })
        .range(page * pageSize, page * pageSize + pageSize - 1);

      if (category && category !== "全部") {
        query = query.eq("category", category);
      }
      if (industry && industry !== "全部") {
        query = query.eq("industry", industry);
      }

      const { data: rows, error: err } = await query;
      if (err) throw err;

      const mapped =
        (rows as unknown as InsightRow[] | null)?.map(mapDbInsightToInsight) ?? [];

      if (mapped.length === 0) {
        // 库为空（Pipeline 尚未跑过）：降级到静态数据，避免空白页。
        setData(FALLBACK_INSIGHTS);
        setDegraded(true);
      } else {
        setData(mapped);
        setDegraded(false);
      }
    } catch (e) {
      setError(e as Error);
      setData(FALLBACK_INSIGHTS);
      setDegraded(true);
    } finally {
      setLoading(false);
    }
  }, [category, industry, page, pageSize]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, degraded, refetch: () => void fetchData() };
}
