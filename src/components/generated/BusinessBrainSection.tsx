import { Link } from "react-router-dom";
import { FaChartLine, FaChess, FaUsers, FaBullseye, FaMicroscope, FaLightbulb, FaArrowRight } from "react-icons/fa";
import { useLang } from "@/i18n/LangContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "chart-line": FaChartLine,
  chess: FaChess,
  users: FaUsers,
  bullseye: FaBullseye,
  microscope: FaMicroscope,
  lightbulb: FaLightbulb,
};

const colorMap: Record<string, string> = {
  "neon-blue": "text-neon-blue border-neon-blue/20 bg-neon-blue/5",
  "neon-green": "text-neon-green border-neon-green/20 bg-neon-green/5",
  gold: "text-gold border-gold/20 bg-gold/5",
};

export default function BusinessBrainSection() {
  const { t, lang } = useLang();
  const engines = t.businessBrain.engines;

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-section mb-3 text-ink-primary">
            {t.businessBrain.sectionTitle}
          </h2>
          <p className="text-subtitle text-ink-secondary">
            {t.businessBrain.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {engines.map((engine, i) => {
            const Icon = iconMap[engine.icon] || FaChartLine;
            const colorClass = colorMap[["neon-blue", "neon-green", "gold"][i % 3]] || colorMap["neon-blue"];
            const parts = colorClass.split(" ");
            return (
              <Link
                key={i}
                to="/business-brain"
                className="glass-card group flex flex-col p-6"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${parts[1]} ${parts[2]}`}>
                  <Icon className={`text-xl ${parts[0]}`} />
                </div>
                <h3 className="mb-2 text-body font-semibold text-ink-primary">
                  {engine.title}
                </h3>
                <p className="mb-4 flex-1 text-caption leading-relaxed text-ink-secondary">
                  {engine.desc}
                </p>
                <div className="flex items-center gap-1 text-caption font-medium text-neon-blue transition-all group-hover:gap-2">
                  {lang === "zh" ? "立即体验" : "Try Now"}
                  <FaArrowRight className="text-xs" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
