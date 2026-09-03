import { Link } from "react-router-dom";
import { FaBuilding, FaRocket, FaHandshake, FaGraduationCap, FaArrowRight, FaChartLine } from "react-icons/fa";
import { useLang } from "@/i18n/LangContext";

const solutionIcons = [FaRocket, FaChartLine, FaHandshake, FaBuilding];

export default function EnterpriseSection() {
  const { t, lang } = useLang();
  const solutions = t.enterprise.solutions;
  const features = t.enterprise.features;
  const featureIcons = [FaRocket, FaBuilding, FaHandshake, FaGraduationCap];

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-section mb-3 text-ink-primary">
            {t.enterprise.sectionTitle}
          </h2>
          <p className="text-subtitle text-ink-secondary">
            {t.enterprise.subtitle}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {t.enterprise.targetCustomers.map((c: string, i: number) => (
            <span
              key={i}
              className="rounded-full border border-neon-blue/20 bg-neon-blue/5 px-4 py-1.5 text-caption text-neon-blue"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {solutions.map((sol, i) => {
            const Icon = solutionIcons[i] || FaRocket;
            return (
              <div key={i} className="glass-card group p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neon-blue/20 bg-neon-blue/5">
                  <Icon className="text-xl text-neon-blue" />
                </div>
                <h3 className="mb-2 text-body font-semibold text-ink-primary">
                  {sol.title}
                </h3>
                <p className="text-caption leading-relaxed text-ink-secondary">
                  {sol.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((f: string, i: number) => {
            const Icon = featureIcons[i] || FaRocket;
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-cyber-border bg-cyber-surface/30 p-4">
                <Icon className="shrink-0 text-neon-green" />
                <span className="text-caption font-medium text-ink-primary">{f}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/enterprise"
            className="btn-gold inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-8 py-3 text-caption font-semibold text-cyber-bg"
          >
            {lang === "zh" ? "获取企业方案" : "Get Enterprise Plan"}
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
