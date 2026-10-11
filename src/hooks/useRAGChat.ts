/**
 * useRAGChat —— /business-brain 站内 RAG 流式问答数据层。
 *
 * 流程（与 Step 3 的检索管线同源，但把「生成」也放在服务端）：
 *   用户输入 -> 调用 Supabase Edge Function `rag-chat`
 *            （服务端生成 Embedding -> match_* 检索 -> 大模型流式生成）
 *            -> 通过 SSE 先下发 citations（引用来源），再逐 token 流式返回回答。
 *
 * 关键：LLM API Key 只在 Edge Function 的服务端 Secrets 中，前端永远不持有。
 *       本 Hook 负责 SSE 流式读取与消息状态管理，不接触任何密钥。
 */
import { useCallback, useRef, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

export type RAGScope = "insights" | "tools" | "both";

export interface ChatCitation {
  id: string;
  title: string;
  summary: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  similarity: number;
  scope: "insight" | "tool";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
  /** 流式生成中标记（用于显示光标/加载态） */
  pending?: boolean;
  /** 大模型未连接时的降级提示 */
  degraded?: boolean;
}

export interface UseRAGChatOptions {
  scope?: RAGScope;
}

export interface UseRAGChatResult {
  messages: ChatMessage[];
  streaming: boolean;
  error: Error | null;
  send: (question: string) => void;
  stop: () => void;
  reset: () => void;
}

const FN_NAME = "rag-chat";

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** 解析一个 SSE block（以 \n\n 分隔），返回 event / data。 */
function parseSSEBlock(block: string): { event: string; data: string } | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const raw of block.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

export function useRAGChat(options: UseRAGChatOptions = {}): UseRAGChatResult {
  const { scope = "both" } = options;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const updateAssistant = useCallback(
    (id: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const send = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q || streaming) return;
      if (!isSupabaseConfigured) {
        setError(new Error("Supabase 未配置，无法使用 RAG 问答。"));
        return;
      }

      const userMsg: ChatMessage = { id: uid(), role: "user", content: q };
      const assistantId = uid();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        pending: true,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      const run = async () => {
        try {
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${FN_NAME}`;
          const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
              apikey: key,
            },
            body: JSON.stringify({ question: q, scope }),
            signal: controller.signal,
          });

          if (!res.ok || !res.body) {
            throw new Error(`RAG 服务异常 (HTTP ${res.status})`);
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buf = "";
          let citations: ChatCitation[] | undefined;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });

            let idx: number;
            while ((idx = buf.indexOf("\n\n")) >= 0) {
              const block = buf.slice(0, idx);
              buf = buf.slice(idx + 2);
              const parsed = parseSSEBlock(block);
              if (!parsed) continue;

              if (parsed.event === "citations") {
                try {
                  citations = JSON.parse(parsed.data) as ChatCitation[];
                  updateAssistant(assistantId, { citations });
                } catch {
                  /* ignore */
                }
              } else if (parsed.event === "token") {
                let tok = "";
                try {
                  tok = JSON.parse(parsed.data) as string;
                } catch {
                  tok = parsed.data;
                }
                if (tok) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + tok }
                        : m,
                    ),
                  );
                }
              } else if (parsed.event === "note") {
                if (parsed.data === "llm_unavailable") {
                  updateAssistant(assistantId, { degraded: true });
                }
              } else if (parsed.event === "error") {
                throw new Error(parsed.data || "RAG 检索失败");
              } else if (parsed.event === "done") {
                /* 结束标记 */
              }
            }
          }
        } catch (e) {
          const err = e as Error;
          if (err.name === "AbortError") {
            updateAssistant(assistantId, { pending: false });
          } else {
            setError(err);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      pending: false,
                      content:
                        m.content ||
                        "抱歉，问答服务暂时不可用，请稍后重试。",
                    }
                  : m,
              ),
            );
          }
        } finally {
          setStreaming(false);
          updateAssistant(assistantId, { pending: false });
          abortRef.current = null;
        }
      };

      void run();
    },
    [streaming, scope, updateAssistant],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, streaming, error, send, stop, reset };
}
