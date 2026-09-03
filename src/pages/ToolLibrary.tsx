import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import ToolCards from "@/components/generated/ToolCards";
import { CardSkeleton } from "@/components/common/Skeleton";
import { getTools, type Tool } from "@/data/tools";
import { useLang } from "@/i18n/LangContext";

const toolCategories = ["全部", "效率工具", "办公自动化", "数据处理", "设计素材", "开发工具"];

export default function ToolLibrary() {
  const { t, lang } = useLang();
  const [tools, setTools] = useState<Array<{
    id: string; title: string; description: string; category: string;
    tags: string[]; downloadCount: number; coverUrl: string;
    downloadUrl: string; extractCode: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTools()
      .then((result: Tool[]) => {
        if (cancelled) return;
        setTools(result.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          tags: t.tags.split(",").map((s) => s.trim()).filter(Boolean),
          downloadCount: t.download_count,
          coverUrl: t.cover_url,
          downloadUrl: t.download_url,
          extractCode: t.extract_code,
        })));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredTools = useMemo(() => {
    let result = tools;
    if (activeCategory !== "全部") {
      result = result.filter((tool) => tool.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.title.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [tools, activeCategory, searchQuery]);

  return (
    <>
      <PageMeta
        title={`${t.tools.sectionTitle} — MATRIX NET`}
        description={lang === "zh" ? "零门槛自动化办公技术资源，限时免费下载" : "Zero-threshold automation office technology resources, free download for limited time"}
        keywords={["效率工具", "办公自动化", "数据处理", "设计素材"]}
      />
      <div className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-section mb-3 text-ink-primary">
              {t.tools.sectionTitle}
            </h1>
            <p className="text-body text-ink-secondary">
              {lang === "zh" ? "零门槛自动化办公技术资源，限时免费下载" : "Zero-threshold automation office technology resources, free download for limited time"}
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {toolCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-caption transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-neon-blue/20 text-neon-blue"
                      : "border border-cyber-border text-ink-secondary hover:border-neon-blue/50 hover:text-ink-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.tools.searchPlaceholder}
                className="w-full rounded-xl border border-cyber-border bg-cyber-surface px-4 py-2.5 pr-10 text-caption text-ink-primary placeholder-ink-secondary outline-none transition-all focus:border-neon-blue"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary"
                >
                  <FaTimes size={14} />
                </button>
              )}
              <FaSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={14} />
            </div>
          </div>

          {loading ? (
            <CardSkeleton count={8} />
          ) : filteredTools.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-body text-ink-secondary">
                {lang === "zh" ? "未找到匹配的工具" : "No tools found"}
              </p>
            </div>
          ) : (
            <ToolCards tools={filteredTools} />
          )}
        </div>
      </div>
    </>
  );
}
