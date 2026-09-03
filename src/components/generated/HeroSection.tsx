import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaRocket, FaTh, FaUsers, FaBrain, FaChartLine } from "react-icons/fa";
import { useLang } from "@/i18n/LangContext";

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-neon-blue/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function StatsBar() {
  const { t } = useLang();
  const [counts, setCounts] = useState([0, 0, 0]);
  const targets = [200, 50000, 180000];

  useEffect(() => {
    const timer = setInterval(() => {
      setCounts((prev) =>
        prev.map((c, i) =>
          c < targets[i] ? Math.min(c + Math.ceil(targets[i] / 60), targets[i]) : c
        )
      );
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: `${counts[0]}+`, label: t.hero.statsTools, icon: FaBrain, color: "text-neon-blue" },
    { value: counts[1].toLocaleString(), label: t.hero.statsUsers, icon: FaUsers, color: "text-neon-green" },
    { value: counts[2].toLocaleString(), label: t.hero.statsDownloads, icon: FaChartLine, color: "text-gold" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl border border-cyber-border bg-cyber-surface/50 p-4 backdrop-blur-sm md:gap-8 md:p-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <stat.icon className={`mx-auto mb-2 text-lg ${stat.color}`} />
          <p className={`text-xl font-bold md:text-2xl ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-ink-secondary md:text-caption">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const { t } = useLang();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/tools?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-bg via-cyber-surface/30 to-cyber-bg" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 20%, rgba(0,229,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(57,255,20,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)",
          }}
        />
        <FloatingParticles />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(90vh-4rem)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center md:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 animate-breathe rounded-full bg-neon-blue" />
          <span className="text-xs text-neon-blue">{t.hero.badge}</span>
        </div>

        <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-ink-primary md:text-6xl lg:text-7xl">
          {t.hero.title1}
        </h1>
        <p className="mb-6 text-xl font-medium text-neon-blue text-glow-blue md:text-2xl lg:text-3xl">
          {t.hero.title2}
        </p>
        <p className="mb-10 max-w-2xl text-body leading-relaxed text-ink-secondary md:text-subtitle">
          {t.hero.subtitle}
        </p>

        <form onSubmit={handleSearch} className="mb-8 w-full max-w-xl">
          <div className="glass-card flex items-center overflow-hidden rounded-2xl border-neon-blue/20 p-1.5">
            <FaSearch className="ml-4 shrink-0 text-ink-secondary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="flex-1 bg-transparent px-4 py-3 text-body text-ink-primary outline-none placeholder:text-ink-footer"
            />
            <button
              type="submit"
              className="btn-cyber shrink-0 rounded-xl bg-neon-blue px-6 py-3 text-caption font-semibold text-cyber-bg"
            >
              {t.hero.searchBtn}
            </button>
          </div>
        </form>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/assessment"
            className="btn-gold animate-glow-pulse flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-caption font-semibold text-cyber-bg"
          >
            <FaRocket />
            {t.hero.cta1}
          </Link>
          <Link
            to="/tools"
            className="btn-cyber flex items-center gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-6 py-3 text-caption font-semibold text-neon-blue"
          >
            <FaTh />
            {t.hero.cta2}
          </Link>
        </div>

        <div className="w-full max-w-2xl">
          <StatsBar />
        </div>
      </div>
    </section>
  );
}
