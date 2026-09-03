import { useState } from "react";
import { FaChartLine, FaChess, FaUsers, FaBullseye, FaMicroscope, FaLightbulb, FaArrowRight, FaRocket } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";
import { brainEngines } from "@/data/mockData";

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

export default function BusinessBrain() {
  const { t, lang } = useLang();
  const [activeEngine, setActiveEngine] = useState<string | null>(null);

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
                        <button className={`mt-3 flex items-center gap-2 rounded-lg ${colors.bg} ${colors.border} border px-4 py-2 text-caption font-medium ${colors.text}`}>
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
        </div>
      </section>
    </>
  );
}
