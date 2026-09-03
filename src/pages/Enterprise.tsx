import { useState } from "react";
import { FaBuilding, FaRocket, FaHandshake, FaGraduationCap, FaCheck, FaShieldAlt, FaHeadset, FaChartLine, FaArrowRight } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";

const solutionIcons = [FaRocket, FaChartLine, FaHandshake, FaBuilding];
const featureIcons = [FaRocket, FaShieldAlt, FaHeadset, FaGraduationCap];

export default function Enterprise() {
  const { t, lang } = useLang();
  const solutions = t.enterprise.solutions;
  const features = t.enterprise.features;

  const [form, setForm] = useState({ company: "", industry: "", phone: "", need: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageMeta
        title={lang === "zh" ? "企业AI解决方案 — MATRIX NET" : "Enterprise AI Solutions — MATRIX NET"}
        description={lang === "zh" ? "为制造企业、外贸公司、创业团队、咨询公司打造专属AI智能决策系统。" : "Build your enterprise's AI-powered decision system."}
      />
      <section className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
              <FaBuilding className="text-xs text-gold" />
              <span className="text-xs text-gold">{t.enterprise.sectionTitle}</span>
            </div>
            <h1 className="text-section mb-3 text-ink-primary">
              {t.enterprise.sectionTitle}
            </h1>
            <p className="text-subtitle text-ink-secondary">
              {t.enterprise.subtitle}
            </p>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {t.enterprise.targetCustomers.map((c: string, i: number) => (
              <span
                key={i}
                className="rounded-full border border-neon-blue/20 bg-neon-blue/5 px-5 py-2 text-caption font-medium text-neon-blue"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {solutions.map((sol, i) => {
              const Icon = solutionIcons[i] || FaRocket;
              return (
                <div key={i} className="glass-card group p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-blue/20 bg-neon-blue/5">
                      <Icon className="text-xl text-neon-blue" />
                    </div>
                    <h3 className="text-lg font-semibold text-ink-primary">{sol.title}</h3>
                  </div>
                  <p className="text-caption leading-relaxed text-ink-secondary">{sol.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((f: string, i: number) => {
              const Icon = featureIcons[i] || FaCheck;
              return (
                <div key={i} className="flex flex-col items-center gap-3 rounded-xl border border-cyber-border bg-cyber-surface/30 p-5 text-center">
                  <Icon className="text-2xl text-neon-green" />
                  <span className="text-caption font-medium text-ink-primary">{f}</span>
                </div>
              );
            })}
          </div>

          <div className="mx-auto max-w-lg">
            <div className="glass-card glass-card-gold p-6">
              <h3 className="mb-5 text-center text-lg font-bold text-ink-primary">
                {lang === "zh" ? "获取企业专属方案" : "Get Enterprise Plan"}
              </h3>
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neon-green/10 mx-auto">
                    <FaCheck className="text-2xl text-neon-green" />
                  </div>
                  <p className="text-body font-medium text-ink-primary">
                    {lang === "zh" ? "提交成功！我们将在24小时内联系您。" : "Submitted! We'll contact you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={lang === "zh" ? "公司名称" : "Company Name"}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="text"
                    placeholder={lang === "zh" ? "所属行业" : "Industry"}
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="tel"
                    placeholder={lang === "zh" ? "联系电话" : "Phone"}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none focus:border-gold"
                    required
                  />
                  <textarea
                    placeholder={lang === "zh" ? "您的需求描述" : "Your requirements"}
                    value={form.need}
                    onChange={(e) => setForm({ ...form, need: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark py-3.5 text-body font-semibold text-cyber-bg"
                  >
                    {lang === "zh" ? "提交咨询" : "Submit"}
                    <FaArrowRight />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
