// supabase/functions/rag-chat/index.ts
//
// 站内 RAG 流式问答 Edge Function（服务端）。
// 职责：
//   1) 接收用户问题 -> 用服务端密钥生成 Embedding（与 rag-search 共享检索管线）
//   2) 调用 match_insights / match_tools 取得最相关上下文（仅 published 内容）
//   3) 用检索到的上下文 + 问题，调用大模型（OpenAI / DeepSeek 兼容端点）流式生成回答
//   4) 通过 SSE 先下发音 citation 引用来源，再逐 token 流式下发回答
//
// 为什么 LLM 也放在服务端：
//   前端不能持有任何 LLM API Key。rag-search 只做“检索”，本函数额外负责“生成”，
//   二者共用 embedding + match_* 逻辑，但密钥永远留在服务端（Function Secrets）。
//
// 部署：
//   supabase functions deploy rag-chat
//   supabase secrets set OPENAI_API_KEY=sk-xxx
//   supabase secrets set CHAT_MODEL=gpt-4o-mini                 # 可选，默认 gpt-4o-mini
//   supabase secrets set CHAT_BASE_URL=https://api.openai.com/v1 # 可选，可指向 DeepSeek 等兼容端点
//   supabase secrets set EMBEDDING_MODEL=text-embedding-3-small  # 可选
//   supabase secrets set EMBEDDING_BASE_URL=https://api.openai.com/v1  # 可选
//
// 注意：请先执行 0001 Migration，match_insights / match_tools 才会存在。

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SSE_HEADERS = {
  ...corsHeaders,
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
};

interface ChatRequestBody {
  question: string;
  scope?: "insights" | "tools" | "both";
}

interface MatchRow {
  id: string;
  title: string;
  similarity: number;
  scope: "insight" | "tool";
}

interface Citation {
  id: string;
  title: string;
  summary: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  similarity: number;
  scope: "insight" | "tool";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const encoder = new TextEncoder();

  // 把任意错误也以 SSE 形式下发，避免前端挂起。
  const errorStream = (msg: string) =>
    new Response(
      encoder.encode(
        `event: error\ndata: ${JSON.stringify(msg)}\n\nevent: done\ndata: {}\n\n`,
      ),
      { status: 200, headers: SSE_HEADERS },
    );

  try {
    // 使用自动注入的 SUPABASE_ANON_KEY 即可：match_* 为 SECURITY DEFINER，
    // 只返回 status='published' 的行；enrich 阶段按已发布的 id 回查也受 RLS 放行。
    // （无需额外配置 SERVICE_ROLE_KEY，部署更省心）
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    const body: ChatRequestBody = await req.json();
    const question = (body.question || "").trim();
    const scope = body.scope ?? "both";

    if (!question) {
      return new Response(`event: done\ndata: {}\n\n`, {
        status: 200,
        headers: SSE_HEADERS,
      });
    }

    // 1) 生成问题向量
    const embedding = await embed(question);

    // 2) 检索最相关片段
    const matches = await retrieve(supabase, embedding, scope);

    // 3) 回填完整字段，构造 LLM 上下文 + UI 引用卡片
    const { passages, citations } = await enrich(supabase, matches);

    // 4) 流式返回：先 citations，再逐 token，最后 done
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) =>
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );

        // 先下发引用来源（UI 可立即渲染卡片）
        send("citations", citations);

        let answer = "";
        try {
          answer = await streamLLM(question, passages, (tok) =>
            send("token", tok),
          );
        } catch (llmErr) {
          console.error("[rag-chat] LLM 失败，降级为检索摘要:", llmErr);
          answer = synthesize(question, passages);
          send("note", "llm_unavailable");
        }

        send("answer", answer);
        send("done", { ok: true });
        controller.close();
      },
    });

    return new Response(stream, { headers: SSE_HEADERS });
  } catch (err) {
    console.error("[rag-chat] error:", err);
    return errorStream((err as Error).message || "未知错误");
  }
});

// ---------------------------------------------------------------------------
// 检索：调用 match_* 向量 RPC（SECURITY DEFINER，仅返回 published 内容）
// ---------------------------------------------------------------------------
async function retrieve(
  supabase: ReturnType<typeof createClient>,
  embedding: number[],
  scope: "insights" | "tools" | "both",
): Promise<MatchRow[]> {
  const threshold = 0.72;
  const limit = 5;
  const rows: MatchRow[] = [];

  if (scope === "insights" || scope === "both") {
    const { data, error } = await supabase.rpc("match_insights", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });
    if (error) throw error;
    for (const r of data ?? []) {
      rows.push({
        id: r.id,
        title: r.title,
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
      rows.push({
        id: r.id,
        title: r.title,
        similarity: r.similarity,
        scope: "tool",
      });
    }
  }

  rows.sort((a, b) => b.similarity - a.similarity);
  return rows;
}

// ---------------------------------------------------------------------------
// 回填完整字段：构造给 LLM 的上下文段落 + 给 UI 的引用卡片
// ---------------------------------------------------------------------------
async function enrich(
  supabase: ReturnType<typeof createClient>,
  matches: MatchRow[],
): Promise<{ passages: string; citations: Citation[] }> {
  const insightIds = matches
    .filter((m) => m.scope === "insight")
    .map((m) => m.id);
  const toolIds = matches.filter((m) => m.scope === "tool").map((m) => m.id);

  const enriched = new Map<string, Citation>();

  if (insightIds.length) {
    const { data } = await supabase
      .from("insights")
      .select(
        "id,title,summary,content,key_breakthrough,takeaways,source,source_url,category",
      )
      .in("id", insightIds);
    for (const row of data ?? []) {
      enriched.set(row.id, {
        id: row.id,
        title: row.title,
        summary: row.summary ?? row.content?.slice(0, 200) ?? null,
        source: row.source ?? null,
        source_url: row.source_url ?? null,
        category: row.category ?? null,
        similarity: matches.find((m) => m.id === row.id)?.similarity ?? 0,
        scope: "insight",
      });
    }
  }

  if (toolIds.length) {
    const { data } = await supabase
      .from("tools")
      .select("id,title,description,source_url,source,category")
      .in("id", toolIds);
    for (const row of data ?? []) {
      enriched.set(row.id, {
        id: row.id,
        title: row.title,
        summary: row.description ?? null,
        source: row.source ?? null,
        source_url: row.source_url ?? null,
        category: row.category ?? null,
        similarity: matches.find((m) => m.id === row.id)?.similarity ?? 0,
        scope: "tool",
      });
    }
  }

  // 按相似度排序，构造上下文段落
  const ordered = matches
    .map((m) => enriched.get(m.id))
    .filter(Boolean) as Citation[];

  const passages = ordered
    .map((c, i) => {
      if (c.scope === "insight") {
        return `[资料${i + 1}｜情报] 《${c.title}》${c.source ? `（来源：${c.source}）` : ""}\n${c.summary ?? ""}`;
      }
      return `[资料${i + 1}｜工具] ${c.title}${c.category ? `（分类：${c.category}）` : ""}\n${c.summary ?? ""}`;
    })
    .join("\n\n");

  return { passages, citations: ordered };
}

// ---------------------------------------------------------------------------
// 调用大模型流式生成（OpenAI / DeepSeek 兼容端点）
// ---------------------------------------------------------------------------
async function streamLLM(
  question: string,
  passages: string,
  onToken: (tok: string) => void,
): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY 未配置");

  const baseUrl = Deno.env.get("CHAT_BASE_URL") || "https://api.openai.com/v1";
  const model = Deno.env.get("CHAT_MODEL") || "gpt-4o-mini";

  const systemPrompt =
    "你是 Cognition Matrix 的「认知矩阵商业大脑」AI 助手。请严格基于【检索到的资料】用简体中文回答用户问题。" +
    "要求：1) 回答专业、结构化、带要点；2) 若资料不足以回答，如实说明，不要编造；3) 可适当引用资料中的具体信息，但不得脱离资料臆测。" +
    "若资料为空，请礼貌告知用户当前知识库暂无相关内容。";

  const userPrompt = passages
    ? `【检索到的资料】\n${passages}\n\n【用户问题】\n${question}`
    : `【用户问题】\n${question}\n\n（注：当前知识库未检索到相关资料，请基于常识礼貌作答并说明局限性）`;

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.3,
    }),
  });

  if (!resp.ok || !resp.body) {
    const detail = await resp.text();
    throw new Error(`LLM 请求失败: ${resp.status} ${detail}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return full;
      try {
        const j = JSON.parse(payload);
        const delta: string | undefined = j.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onToken(delta);
        }
      } catch {
        // 忽略不完整分片
      }
    }
  }
  return full;
}

// 无 LLM Key 时的降级：直接拼接检索摘要作为回答
function synthesize(question: string, passages: string): string {
  if (!passages.trim()) {
    return "当前知识库尚未检索到与您问题相关的资料，建议先浏览【行业情报】与【AI 工具矩阵】，或稍后再试。";
  }
  return (
    `（知识库已检索到相关资料，但大模型暂未连接，以下为检索摘要）\n\n` +
    `针对「${question}」，我们为你找到了以下相关资料：\n\n` +
    passages
  );
}

// ---------------------------------------------------------------------------
// 生成 Embedding（与 rag-search 完全一致，密钥在服务端）
// ---------------------------------------------------------------------------
async function embed(text: string): Promise<number[]> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY 未配置（Embedding 所需）");
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
