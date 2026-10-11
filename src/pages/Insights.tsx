import { useState, useEffect, useMemo } from "react";
import { FaCalendar, FaArrowRight, FaFire, FaDatabase } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";
import { useInsights } from "@/hooks/useInsights";
import type { Insight } from "@/data/insights";

const CATEGORY_MAP: Record<string, string> = {
  "AI动态": "AI动态",
  "行业报告": "行业报告",
  "市场趋势": "市场趋势",
  "技术前沿": "技术前沿",
  "政策监管": "政策监管",
  "AI Trends": "AI Trends",
  "Industry Report": "Industry Report",
  "Market Trends": "Market Trends",
  "Tech Frontier": "Tech Frontier",
  "Policy": "Policy",
};

const VISIBLE_STEP = 8;

export default function Insights() {
  const { t, lang } = useLang();
  const categories = t.insights.categories;
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [visible, setVisible] = useState(VISIBLE_STEP);

  // 接入实时数据层：默认拉取全量已发布情报（RLS 已保证只返回 published 且未删除）。
  const { data: insights, loading, degraded } = useInsights({ pageSize: 200 });

  useEffect(() => {
    setVisible(VISIBLE_STEP);
  }, [activeCategory, activeIndustry, insights]);

  // 分类 + 产业联动筛选（保留原 UI 交互，逻辑仍在客户端，保证降级数据也同样可用）
  const filtered = useMemo(() => {
    let list = insights;
    if (activeCategory !== categories[0]) {
      list = list.filter((item: Insight) => {
        const cat = CATEGORY_MAP[item.category] || item.category;
        return cat === activeCategory;
      });
    }
    if (activeIndustry) {
      list = list.filter((item: Insight) => item.industry === activeIndustry);
    }
    return list;
  }, [insights, activeCategory, activeIndustry, categories]);

  // 从已加载数据派生产业选项（产业为自由标签，故动态生成）
  const industries = useMemo(() => {
    const set = new Set<string>();
    insights.forEach((i: Insight) => i.industry && set.add(i.industry));
    return Array.from(set);
  }, [insights]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <PageMeta
        title={lang === "zh" ? "行业情报中心 — Cognition Matrix Net" : "Industry Insights — Cognition Matrix Net"}
        description={lang === "zh" ? "AI驱动的行业洞察与趋势分析，覆盖AI前沿、商业趋势、行业报告、政策解读。" : "AI-driven industry insights and trend analysis."}
      />
      <section className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
              <FaFire className="text-xs text-gold" />
              <span className="text-xs text-gold">{t.insights.sectionTitle}</span>
            </div>
            <h1 className="text-section mb-3 text-ink-primary">
              {t.insights.sectionTitle}
            </h1>
            <p className="text-subtitle text-ink-secondary">
              {t.insights.subtitle}
            </p>
          </div>

          {/* 降级提示：Supabase 未连接 / 连接失败 / 库为空时优雅提示 */}
          {degraded && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/5 px-4 py-2.5 text-caption text-gold">
              <FaDatabase className="text-xs" />
              <span>
                {lang === "zh"
                  ? "正在展示本地缓存 / 示例数据（知识库尚未连接或为空）"
                  : "Showing local cache / sample data (knowledge base not connected or empty)"}
              </span>
            </div>
          )}

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-caption font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-neon-blue text-cyber-bg"
                    : "border border-cyber-border bg-cyber-surface/30 text-ink-secondary hover:border-neon-blue/30 hover:text-ink-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 产业筛选（与分类联动） */}
          {industries.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveIndustry(null)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  activeIndustry === null
                    ? "bg-neon-green/20 text-neon-green"
                    : "border border-cyber-border text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {lang === "zh" ? "全部产业" : "All Industries"}
              </button>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setActiveIndustry(ind)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    activeIndustry === ind
                      ? "bg-neon-green/20 text-neon-green"
                      : "border border-cyber-border text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <div className="h-48 bg-cyber-surface/50 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-cyber-surface/50 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-cyber-surface/50 rounded animate-pulse w-full" />
                    <div className="h-4 bg-cyber-surface/50 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {shown.map((item) => (
                <article key={item.id} className="glass-card group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-neon-blue/20 px-3 py-1 text-xs font-medium text-neon-blue backdrop-blur-sm">
                        {CATEGORY_MAP[item.category] || item.category}
                      </span>
                      {item.industry && (
                        <span className="rounded-full bg-neon-green/15 px-3 py-1 text-xs font-medium text-neon-green backdrop-blur-sm">
                          {item.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-body font-semibold text-ink-primary line-clamp-2 group-hover:text-neon-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="mb-4 text-caption leading-relaxed text-ink-secondary line-clamp-2">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-ink-footer">
                        <span className="flex items-center gap-1">
                          <FaCalendar className="text-[10px]" />
                          {formatDate(item.published_at)}
                        </span>
                        <span>{item.source}</span>
                      </div>
                      <span className="flex items-center gap-1 text-caption font-medium text-neon-blue transition-all group-hover:gap-2">
                        {t.insights.readMore}
                        <FaArrowRight className="text-xs" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-body text-ink-secondary">
                {lang === "zh" ? "该分类暂无内容" : "No content in this category"}
              </p>
            </div>
          )}

          {/* 分页（加载更多）：DAL 已支持服务端分页，此处按客户端筛选结果分批展示 */}
          {!loading && hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + VISIBLE_STEP)}
                className="flex items-center gap-2 rounded-full border border-neon-blue/40 px-6 py-2.5 text-caption font-medium text-neon-blue transition-all hover:bg-neon-blue/10"
              >
                {lang === "zh" ? `加载更多（剩余 ${filtered.length - visible} 条）` : `Show more (${filtered.length - visible} left)`}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
