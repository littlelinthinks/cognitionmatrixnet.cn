import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import LangSwitcher from "./LangSwitcher";
import { useLang } from "@/i18n/LangContext";

const navItems = [
  { path: "/", key: "home" },
  { path: "/tools", key: "tools" },
  { path: "/business-brain", key: "businessBrain" },
  { path: "/insights", key: "insights" },
  { path: "/assessment", key: "assessment" },
  { path: "/enterprise", key: "enterprise" },
  { path: "/agent", key: "agent" },
  { path: "/vip", key: "vip" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-cyber-bg/90 shadow-[0_2px_20px_rgba(0,229,255,0.08)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-green">
            <span className="text-xs font-black text-cyber-bg">M</span>
          </div>
          <span className="text-lg font-bold tracking-wider text-ink-primary">
            MATRIX<span className="text-neon-blue"> NET</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-2 text-caption font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-neon-blue/10 text-neon-blue"
                  : "text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
              }`}
            >
              {(t.nav as Record<string, string>)[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher />
          <Link
            to="/vip"
            className="btn-cyber rounded-lg bg-neon-blue/10 px-4 py-2 text-caption font-semibold text-neon-blue transition-all hover:bg-neon-blue hover:text-cyber-bg"
          >
            {t.nav.openVip}
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-xl text-ink-primary lg:hidden"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-cyber-border bg-cyber-bg/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-4 py-3 text-body font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-neon-blue/10 text-neon-blue"
                    : "text-ink-secondary hover:bg-white/5 hover:text-ink-primary"
                }`}
              >
                {(t.nav as Record<string, string>)[item.key]}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3 border-t border-cyber-border pt-4">
              <LangSwitcher />
              <Link
                to="/vip"
                className="btn-cyber flex-1 rounded-lg bg-neon-blue/10 px-4 py-2.5 text-center text-caption font-semibold text-neon-blue"
              >
                {t.nav.openVip}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
