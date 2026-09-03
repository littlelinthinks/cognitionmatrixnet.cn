import { useState, useEffect, useRef } from "react";
import { FaDownload, FaTimes, FaCopy, FaCheck, FaCloudDownloadAlt } from "react-icons/fa";
import type { ToolItem } from "@/data/mockData";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/i18n/LangContext";

interface ToolCardsProps {
  tools: ToolItem[];
  title?: string;
  showOnlineCount?: boolean;
}

function DownloadModal({
  tool,
  onClose,
}: {
  tool: ToolItem;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useLang();

  const handleCopy = () => {
    navigator.clipboard.writeText(tool.extractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-md animate-slide-up p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-primary">{t.tools.modalTitle}</h3>
          <button
            onClick={onClose}
            className="text-ink-secondary transition-colors hover:text-ink-primary"
          >
            <FaTimes />
          </button>
        </div>
        <p className="mb-4 text-caption text-ink-secondary">
          {t.tools.modalDesc}
        </p>
        <div className="mb-4 rounded-xl border border-neon-blue/20 bg-neon-blue/5 p-4">
          <p className="mb-2 text-caption text-ink-secondary">{t.tools.extractCode}</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xl text-neon-blue tracking-wider">
              {tool.extractCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg bg-neon-blue/10 px-3 py-1.5 text-caption text-neon-blue transition-all hover:bg-neon-blue/20"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? t.tools.copied : t.tools.copy}
            </button>
          </div>
        </div>
        <a
          href={tool.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl bg-neon-blue py-3.5 text-body font-semibold text-cyber-bg"
        >
          <FaCloudDownloadAlt />
          {t.tools.goDownload}
        </a>
      </div>
    </div>
  );
}

function ToolCard({ tool, index }: { tool: ToolItem; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`glass-card group flex flex-col overflow-hidden transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-40 overflow-hidden bg-cyber-bg">
        <img
          src={tool.coverUrl}
          alt={tool.title}
          className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-surface/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-cyber-bg/70 px-2.5 py-1 backdrop-blur-sm">
          <FaDownload className="text-[10px] text-neon-blue" />
          <span className="text-[11px] text-neon-blue font-medium">
            {tool.downloadCount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-body font-semibold leading-snug text-ink-primary line-clamp-2">
          {tool.title}
        </h3>
        <p className="mb-3 flex-1 text-caption leading-relaxed text-ink-secondary line-clamp-2">
          {tool.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tag === "RPA自动化" || tag === "自动化"
                  ? "bg-neon-green/10 text-neon-green"
                  : tag === "AI工具"
                  ? "bg-gold/10 text-gold"
                  : "bg-neon-blue/10 text-neon-blue"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            const event = new CustomEvent("openToolDownload", { detail: tool });
            window.dispatchEvent(event);
          }}
          className="btn-cyber flex w-full items-center justify-center gap-2 rounded-xl bg-neon-blue/10 py-3 text-caption font-semibold text-neon-blue transition-all hover:bg-neon-blue hover:text-cyber-bg hover:shadow-[0_0_15px_rgba(0,229,255,0.5)]"
        >
          <FaDownload />
          {t.tools.download}
        </button>
      </div>
    </div>
  );
}

export default function ToolCards({
  tools,
  title,
  showOnlineCount = true,
}: ToolCardsProps) {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const onlineCount = 18492;
  const { t } = useLang();

  const displayTitle = title || t.tools.sectionTitle;

  useEffect(() => {
    const handler = (e: Event) => {
      const tool = (e as CustomEvent).detail as ToolItem;
      setActiveTool(tool);
    };
    window.addEventListener("openToolDownload", handler);
    return () => window.removeEventListener("openToolDownload", handler);
  }, []);

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title={displayTitle}
          accentColor="green"
          rightContent={
            showOnlineCount ? (
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-breathe rounded-full bg-neon-green" />
                <span className="text-caption" style={{ color: "#39FF14" }}>
                  {t.tools.online}：{onlineCount.toLocaleString()} {t.tools.people}
                </span>
              </div>
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>

      {activeTool && (
        <DownloadModal
          tool={activeTool}
          onClose={() => setActiveTool(null)}
        />
      )}
    </section>
  );
}
