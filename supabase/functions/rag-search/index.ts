// supabase/functions/rag-search/index.ts
//
// 站内 RAG 检索 Edge Function（服务端）。
// 职责：接收用户自然语言 query -> 用服务端密钥生成 Embedding ->
//       调用 match_insights / match_tools 向量检索 -> 返回最相关上下文。
// 前端 useRAGQuery 通过 supabase.functions.invoke('rag-search', ...) 调用。
//
// 部署：
//   supabase functions deploy rag-search
//   supabase secrets set OPENAI_API_KEY=sk-xxx
//   supabase secrets set EMBEDDING_MODEL=text-embedding-3-small   # 可选，默认即此
//   supabase secrets set EMBEDDING_BASE_URL=https://api.openai.com/v1  # 可选，支持通义千问等兼容端点
//
// 注意：请先在 Supabase 执行 0001 Migration，match_insights / match_tools 才会存在。

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RAGRequestBody {
  query: string;
  scope?: "insights" | "tools" | "both";
  threshold?: number;
  limit?: number;
}

Deno.serve(async (req: Request) => {
  // CORS 预检
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const body: RAGRequestBody = await req.json();
    const query = (body.query || "").trim();
    const scope = body.scope ?? "both";
    const threshold = body.threshold ?? 0.78;
    const limit = body.limit ?? 6;

    if (!query) {
      return new Response(JSON.stringify({ contexts: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1) 服务端生成 Embedding（密钥不暴露给前端）
    const embedding = await embed(query);

    // 2) 调用向量检索 RPC（match_* 为 SECURITY DEFINER，可访问 embedding 列）
    const contexts: unknown[] = [];

    if (scope === "insights" || scope === "both") {
      const { data, error } = await supabase.rpc("match_insights", {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
      });
      if (error) throw error;
      for (const r of data ?? []) {
        contexts.push({
          id: r.id,
          title: r.title,
          summary: r.summary,
          content: null,
          source: r.source,
          source_url: null,
          category: r.category,
          similarity: r.similarity,
          scope: "insight",
        });
      }
    }

    if (scope === "tools" || scope === "both") {
      const { data, error } = await supabase.rpc("match_tools", {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
      });
      if (error) throw error;
      for (const r of data ?? []) {
        contexts.push({
          id: r.id,
          title: r.title,
          summary: r.description,
          content: null,
          source: null,
          source_url: r.source_url,
          category: r.category,
          similarity: r.similarity,
          scope: "tool",
        });
      }
    }

    // 按相似度降序
    contexts.sort(
      (a, b) =>
        (b as { similarity: number }).similarity -
        (a as { similarity: number }).similarity,
    );

    return new Response(JSON.stringify({ contexts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[rag-search] error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message, contexts: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

async function embed(text: string): Promise<number[]> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY 未配置（请在 Supabase Function Secrets 中设置）");
  const baseUrl = Deno.env.get("EMBEDDING_BASE_URL") || "https://api.openai.com/v1";
  const model = Deno.env.get("EMBEDDING_MODEL") || "text-embedding-3-small";

  const resp = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: text.slice(0, 8000), model }),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Embedding 请求失败: ${resp.status} ${detail}`);
  }
  const json = await resp.json();
  return json.data[0].embedding as number[];
}
