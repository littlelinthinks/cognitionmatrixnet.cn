import { useState } from "react";
import { FaRobot, FaIndustry, FaBuilding, FaBullseye, FaSpinner, FaFileAlt, FaChartBar, FaUsers, FaBullhorn, FaListOl, FaCheck } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";

const outputIcons = [FaFileAlt, FaChartBar, FaUsers, FaBullhorn, FaListOl];

export default function AgentCenter() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ industry: "", company: "", goal: "" });
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setResults(null);
    setTimeout(() => {
      setGenerating(false);
      setResults(t.agent.outputs);
    }, 3000);
  };

  return (
    <>
      <PageMeta
        title={lang === "zh" ? "AI Agent中心 — Cognition Matrix Net" : "AI Agent Center — Cognition Matrix Net"}
        description={lang === "zh" ? "输入你的行业和目标，AI自动生成市场报告、竞争分析、客户名单、营销策略、行动计划。" : "Input your industry and goals — AI generates business plans automatically."}
      />
      <section className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/5 px-4 py-1.5">
              <FaRobot className="text-xs text-neon-green" />
              <span className="text-xs text-neon-green">{t.agent.sectionTitle}</span>
            </div>
            <h1 className="text-section mb-3 text-ink-primary">
              {t.agent.sectionTitle}
            </h1>
            <p className="text-subtitle text-ink-secondary">
              {t.agent.subtitle}
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-caption font-medium text-ink-secondary">
                  <FaIndustry className="text-xs" />
                  {t.agent.inputIndustry}
                </label>
                <input
                  type="text"
                  placeholder={t.agent.placeholder.industry}
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-neon-green focus:shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-caption font-medium text-ink-secondary">
                  <FaBuilding className="text-xs" />
                  {t.agent.inputCompany}
                </label>
                <input
                  type="text"
                  placeholder={t.agent.placeholder.company}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-neon-green focus:shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-caption font-medium text-ink-secondary">
                  <FaBullseye className="text-xs" />
                  {t.agent.inputGoal}
                </label>
                <input
                  type="text"
                  placeholder={t.agent.placeholder.goal}
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-neon-green focus:shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={generating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-green/80 py-4 text-body font-bold text-cyber-bg transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {t.agent.generating}
                  </>
                ) : (
                  <>
                    <FaRobot />
                    {t.agent.generate}
                  </>
                )}
              </button>
            </form>

            {results && (
              <div className="mt-8 animate-slide-up border-t border-cyber-border pt-6">
                <h3 className="mb-4 text-body font-semibold text-ink-primary">
                  {lang === "zh" ? "AI已生成以下方案：" : "AI has generated the following:"}
                </h3>
                <div className="space-y-3">
                  {results.map((item, i) => {
                    const Icon = outputIcons[i] || FaCheck;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-neon-green/20 bg-neon-green/5 p-4 transition-all hover:border-neon-green/40"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neon-green/10">
                          <Icon className="text-neon-green" />
                        </div>
                        <span className="text-caption font-medium text-ink-primary">{item}</span>
                        <FaCheck className="ml-auto text-xs text-neon-green" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
