import { useState, useMemo } from "react";
import { FaSearch, FaTimes, FaDatabase } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import ToolCards from "@/components/generated/ToolCards";
import { CardSkeleton } from "@/components/common/Skeleton";
import { useTools, type ToolSort } from "@/hooks/useTools";
import { useLang } from "@/i18n/LangContext";

const toolCategories = ["全部", "效率工具", "办公自动化", "数据处理", "设计素材", "开发工具"];

const SORT_OPTIONS: { value: ToolSort; label: Record<"zh" | "en", string> }[] = [
  { value: "sort_order", label: { zh: "推荐排序", en: "Recommended" } },
  { value: "quality_score", label: { zh: "质量优先", en: "Top Quality" } },
  { value: "stars", label: { zh: "Star 最多", en: "Most Stars" } },
  { value: "created_at", label: { zh: "最新发布", en: "Newest" } },
];

export default function ToolLibrary() {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ToolSort>("sort_order");

  // 接入实时数据层：分类走服务端过滤，搜索/标签走 Hook 客户端过滤，降级时自动回退静态数据
  const { data: tools, loading, degraded } = useTools({
    category: activeCategory,
    search: searchQuery,
    sortBy,
    pageSize: 200,
  });

  // 将 DB Tool 映射为 ToolCards 组件期望的本地结构（与改造前完全一致）
  const mappedTools = useMemo(
    () =>
      tools.map((tool) => ({
        id: tool.id,
        title: tool.title,
        description: tool.description,
        category: tool.category,
        tags: tool.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        downloadCount: tool.download_count,
        coverUrl: tool.cover_url,
        downloadUrl: tool.download_url,
        extractCode: tool.extract_code,
      })),
    [tools],
  );

  return (
    <>
      <PageMeta
        title={`${t.tools.sectionTitle} — Cognition Matrix Net`}
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

          {degraded && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/5 px-4 py-2.5 text-caption text-gold">
              <FaDatabase className="text-xs" />
              <span>
                {lang === "zh"
                  ? "正在展示本地缓存 / 示例数据（工具库尚未连接或为空）"
                  : "Showing local cache / sample data (tool library not connected or empty)"}
              </span>
            </div>
          )}

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

            <div className="flex w-full items-center gap-3 sm:w-auto">
              {/* 排序下拉：按推荐 / 质量 / Star / 最新发布 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ToolSort)}
                className="rounded-xl border border-cyber-border bg-cyber-surface px-3 py-2.5 text-caption text-ink-primary outline-none transition-all focus:border-neon-blue"
                aria-label={lang === "zh" ? "排序方式" : "Sort by"}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {lang === "zh" ? opt.label.zh : opt.label.en}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.tools.searchPlaceholder}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-surface px-4 py-2.5 pr-10 text-caption text-ink-primary placeholder-ink-secondary outline-none transition-all focus:border-neon-blue"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary"
                  >
                    <FaTimes size={14} />
                  </button>
                ) : (
                  <FaSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={14} />
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <CardSkeleton count={8} />
          ) : mappedTools.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-body text-ink-secondary">
                {lang === "zh" ? "未找到匹配的工具" : "No tools found"}
              </p>
            </div>
          ) : (
            <ToolCards tools={mappedTools} />
          )}
        </div>
      </div>
    </>
  );
}
