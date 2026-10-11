import { useState, useRef, useEffect } from "react";
import {
  FaChartLine, FaChess, FaUsers, FaBullseye, FaMicroscope, FaLightbulb,
  FaArrowRight, FaRocket, FaSpinner, FaStop, FaTrash, FaExternalLinkAlt,
  FaRobot, FaUser, FaDatabase,
} from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";
import { brainEngines } from "@/data/mockData";
import { useRAGChat, type ChatCitation } from "@/hooks/useRAGChat";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "chart-line": FaChartLine,
  chess: FaChess,
  users: FaUsers,
  bullseye: FaBullseye,
  microscope: FaMicroscope,
  lightbulb: FaLightbulb,
};

const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  "neon-blue": { border: "border-neon-blue/30", bg: "bg-neon-blue/10", text: "text-neon-blue" },
  "neon-green": { border: "border-neon-green/30", bg: "bg-neon-green/10", text: "text-neon-green" },
  gold: { border: "border-gold/30", bg: "bg-gold/10", text: "text-gold" },
};

const SUGGESTIONS_ZH = [
  "最近 AI Agent 领域有哪些值得关注的技术突破？",
  "帮我对比几款主流的 AI 编程助手工具",
  "36Kr 近期报道了哪些 AI 商业化案例？",
  "企业落地 RAG 知识库应该注意哪些要点？",
];

export default function BusinessBrain() {
  const { t, lang } = useLang();
  const tx = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [activeEngine, setActiveEngine] = useState<string | null>(null);

  const { messages, streaming, error, send, stop, reset } = useRAGChat({ scope: "both" });
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q || streaming) return;
    send(q);
    setInput("");
  };

  // 点击引擎「开始分析」：预填问题并聚焦对话区
  const handleTryEngine = (engineTitle: string) => {
    const topic = engineTitle.replace("AI", "").replace(" ai", "");
    setInput(tx(`请基于认知矩阵知识库，帮我分析${topic}相关的问题：`, `Based on the Cognition Matrix knowledge base, help me analyze ${topic}:`));
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      <PageMeta
        title={lang === "zh" ? "AI商业大脑 — Cognition Matrix Net" : "AI Business Brain — Cognition Matrix Net"}
        description={lang === "zh" ? "六大AI分析引擎，驱动商业决策。市场分析、竞争分析、客户画像、销售策略、行业研究、商业机会发现。" : "Six AI analysis engines driving business decisions."}
      />
      <section className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 px-4 py-1.5">
              <FaRocket className="text-xs text-neon-blue" />
              <span className="text-xs text-neon-blue">{t.businessBrain.sectionTitle}</span>
            </div>
            <h1 className="text-section mb-3 text-ink-primary">
              {t.businessBrain.sectionTitle}
            </h1>
            <p className="text-subtitle text-ink-secondary">
              {t.businessBrain.subtitle}
            </p>
          </div>

          {/* 六大分析引擎展示（保留原有交互） */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brainEngines.map((engine) => {
              const Icon = iconMap[engine.icon] || FaChartLine;
              const colors = colorMap[engine.color] || colorMap["neon-blue"];
              const isActive = activeEngine === engine.id;
              return (
                <div
                  key={engine.id}
                  className={`glass-card group cursor-pointer p-6 transition-all ${isActive ? `${colors.border} ${colors.bg}` : ""}`}
                  onClick={() => setActiveEngine(isActive ? null : engine.id)}
                >
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border ${colors.border} ${colors.bg}`}>
                    <Icon className={`text-2xl ${colors.text}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-ink-primary">
                    {engine.title}
                  </h3>
                  <p className="mb-4 text-caption leading-relaxed text-ink-secondary">
                    {engine.desc}
                  </p>
                  <div className={`flex items-center gap-1 text-caption font-medium ${colors.text} transition-all group-hover:gap-2`}>
                    {t.businessBrain.tryNow}
                    <FaArrowRight className="text-xs" />
                  </div>

                  {isActive && (
                    <div className="mt-4 animate-slide-up border-t border-cyber-border pt-4">
                      <div className="rounded-xl bg-cyber-bg/50 p-4">
                        <p className="text-caption text-ink-secondary">
                          {lang === "zh"
                            ? `输入您的${engine.title.replace("AI", "")}需求，AI将自动分析并生成专业报告。`
                            : `Input your ${engine.title.replace(" AI", "")} needs, AI will analyze and generate professional reports.`}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTryEngine(engine.title); }}
                          className={`mt-3 flex items-center gap-2 rounded-lg ${colors.bg} ${colors.border} border px-4 py-2 text-caption font-medium ${colors.text}`}
                        >
                          {lang === "zh" ? "开始分析" : "Start Analysis"}
                          <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ============ 流式 RAG 智能问答 ============ */}
          <div ref={chatRef} className="mt-16">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/5 px-4 py-1.5">
                  <FaRobot className="text-xs text-neon-green" />
                  <span className="text-xs text-neon-green">
                    {tx("认知矩阵 · 站内 RAG 问答", "Cognition Matrix · In-site RAG Q&A")}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-ink-primary">
                  {tx("用全站知识库，实时回答你的问题", "Ask anything, powered by the live knowledge base")}
                </h2>
                <p className="mt-2 text-caption text-ink-secondary">
                  {tx(
                    "基于行业情报与 AI 工具矩阵的语义检索，先匹配最相关资料再生成回答，并附引用来源。",
                    "Retrieves the most relevant insights & tools by semantic search, then generates an answer with citations.",
                  )}
                </p>
              </div>

              {/* 错误 / 未配置提示 */}
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-caption text-red-300">
                  {tx("问答服务暂不可用：", "Q&A service unavailable: ")}
                  {error.message}
                </div>
              )}

              {/* 对话区 */}
              <div className="glass-card flex h-[520px] flex-col">
                <div className="flex-1 space-y-5 overflow-y-auto p-5">
                  {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <FaRobot className="mb-4 text-4xl text-neon-green/50" />
                      <p className="mb-6 max-w-md text-caption text-ink-secondary">
                        {tx(
                          "向认知矩阵提问吧。例如：最近 AI Agent 有哪些技术突破？",
                          "Ask Cognition Matrix anything. e.g. What are the latest breakthroughs in AI Agents?",
                        )}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {SUGGESTIONS_ZH.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setInput(s); inputRef.current?.focus(); }}
                            className="rounded-full border border-cyber-border bg-cyber-surface/40 px-3 py-1.5 text-xs text-ink-secondary transition-all hover:border-neon-green/40 hover:text-ink-primary"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          m.role === "user" ? "bg-neon-blue/20 text-neon-blue" : "bg-neon-green/20 text-neon-green"
                        }`}
                      >
                        {m.role === "user" ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
                      </div>
                      <div className={`max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-caption leading-relaxed ${
                            m.role === "user"
                              ? "bg-neon-blue/15 text-ink-primary"
                              : "border border-cyber-border bg-cyber-surface/40 text-ink-secondary"
                          }`}
                        >
                          {m.content ? (
                            <span className="whitespace-pre-wrap">{m.content}</span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-ink-footer">
                              <FaSpinner className="animate-spin text-xs" />
                              {tx("正在检索知识库并生成回答…", "Retrieving & generating…")}
                            </span>
                          )}
                          {m.pending && m.content && (
                            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-neon-green align-middle" />
                          )}
                        </div>

                        {/* 引用来源卡片 */}
                        {m.citations && m.citations.length > 0 && (
                          <div className="mt-2 w-full space-y-2">
                            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-footer">
                              {tx("引用来源 · Citations", "Citations")}
                            </div>
                            {m.citations.map((c: ChatCitation) => (
                              <CitationCard key={c.id} c={c} lang={lang} />
                            ))}
                          </div>
                        )}

                        {m.degraded && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-gold">
                            <FaDatabase className="text-[10px]" />
                            {tx("大模型未连接，已降级为检索摘要", "LLM unavailable — degraded to retrieved summary")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* 输入区 */}
                <div className="border-t border-cyber-border p-4">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      rows={1}
                      placeholder={tx("输入你的问题，回车发送（Shift+Enter 换行）", "Type your question, Enter to send (Shift+Enter for newline)")}
                      className="max-h-32 flex-1 resize-none rounded-xl border border-cyber-border bg-cyber-surface px-4 py-2.5 text-caption text-ink-primary placeholder-ink-secondary outline-none transition-all focus:border-neon-green"
                    />
                    {streaming ? (
                      <button
                        onClick={stop}
                        className="flex h-10 items-center gap-1.5 rounded-xl border border-red-500/40 px-4 text-caption font-medium text-red-300 transition-all hover:bg-red-500/10"
                      >
                        <FaStop className="text-xs" />
                        {tx("停止", "Stop")}
                      </button>
                    ) : (
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="flex h-10 items-center gap-1.5 rounded-xl bg-neon-green px-5 text-caption font-medium text-cyber-bg transition-all hover:opacity-90 disabled:opacity-40"
                      >
                        {tx("发送", "Send")}
                        <FaArrowRight className="text-xs" />
                      </button>
                    )}
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={reset}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-footer transition-colors hover:text-ink-secondary"
                    >
                      <FaTrash className="text-[10px]" />
                      {tx("清空对话", "Clear chat")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** 引用来源卡片：点击跳转至原文 / 详情 */
function CitationCard({ c, lang }: { c: ChatCitation; lang: "zh" | "en" }) {
  const href = c.source_url || (c.scope === "insight" ? "/insights" : "/tools");
  const isExternal = !!c.source_url;
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block rounded-xl border border-cyber-border bg-cyber-surface/40 p-3 transition-all hover:border-neon-green/40"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            c.scope === "insight"
              ? "bg-neon-blue/15 text-neon-blue"
              : "bg-gold/15 text-gold"
          }`}
        >
          {c.scope === "insight"
            ? lang === "zh" ? "情报" : "Insight"
            : lang === "zh" ? "工具" : "Tool"}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-footer">
          {(c.similarity * 100).toFixed(0)}% 相关
          <FaExternalLinkAlt className="text-[9px]" />
        </span>
      </div>
      <div className="line-clamp-1 text-caption font-medium text-ink-primary group-hover:text-neon-green">
        {c.title}
      </div>
      {c.summary && (
        <div className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ink-secondary">
          {c.summary}
        </div>
      )}
      {c.source && (
        <div className="mt-1 text-[10px] text-ink-footer">来源：{c.source}</div>
      )}
    </a>
  );
}
