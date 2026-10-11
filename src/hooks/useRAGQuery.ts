/**
 * useRAGQuery —— 站内 RAG 检索数据层（供 /business-brain 智能问答使用）。
 *
 * 流程：用户输入文本 -> 调用 Supabase Edge Function `rag-search`
 *       （服务端用密钥生成 Embedding，再调用 match_insights / match_tools RPC）
 *       -> 返回最相关的上下文片段（含相似度），供对话/答案生成使用。
 *
 * 说明：Embedding 生成必须在服务端完成（涉及 API Key，绝不能放到前端），
 * 因此本 Hook 依赖 `supabase/functions/rag-search` 这个 Edge Function。
 * 若尚未部署该 Function，query() 会抛出明确错误，便于排查。
 */
import { useCallback, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type RAGScope = "insights" | "tools" | "both";

export interface RAGContext {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  similarity: number;
  scope: "insight" | "tool";
}

export interface UseRAGQueryOptions {
  scope?: RAGScope;
  threshold?: number;
  limit?: number;
}

export interface UseRAGQueryResult {
  contexts: RAGContext[];
  loading: boolean;
  error: Error | null;
  /** 触发一次检索，返回相关上下文（也可用于非 Hook 场景）。 */
  query: (question: string) => Promise<RAGContext[]>;
}

const DEFAULT_FN = "rag-search";

export function useRAGQuery(options: UseRAGQueryOptions = {}): UseRAGQueryResult {
  const { scope = "both", threshold = 0.78, limit = 6 } = options;
  const [contexts, setContexts] = useState<RAGContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const query = useCallback(
    async (question: string): Promise<RAGContext[]> => {
      const q = question.trim();
      if (!q) {
        setContexts([]);
        return [];
      }
      setLoading(true);
      setError(null);
      try {
        if (!isSupabaseConfigured) {
          throw new Error("Supabase 未配置，无法执行 RAG 检索。");
        }
        const { data, error: fnErr } = await supabase.functions.invoke(DEFAULT_FN, {
          body: { query: q, scope, threshold, limit },
        });
        if (fnErr) throw fnErr;
        const ctx = (data?.contexts as RAGContext[]) ?? [];
        setContexts(ctx);
        return ctx;
      } catch (e) {
        setError(e as Error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [scope, threshold, limit],
  );

  return { contexts, loading, error, query };
}

/**
 * 非 Hook 版检索函数，便于在第四步的流式对话逻辑中直接调用
 * （例如：先 retrieveRAGContexts(question) 拿到上下文，再拼接进 LLM prompt）。
 */
export async function retrieveRAGContexts(
  question: string,
  opts: UseRAGQueryOptions = {},
): Promise<RAGContext[]> {
  const { scope = "both", threshold = 0.78, limit = 6 } = opts;
  const q = question.trim();
  if (!q || !isSupabaseConfigured) return [];
  const { data, error } = await supabase.functions.invoke(DEFAULT_FN, {
    body: { query: q, scope, threshold, limit },
  });
  if (error) {
    console.error("[useRAGQuery] 检索失败:", error);
    return [];
  }
  return (data?.contexts as RAGContext[]) ?? [];
}
