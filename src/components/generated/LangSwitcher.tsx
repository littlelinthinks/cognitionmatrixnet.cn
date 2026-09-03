import { useLang } from "@/i18n/LangContext";
import { FaGlobe } from "react-icons/fa";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      className="flex items-center gap-1.5 rounded-lg border border-cyber-border px-3 py-1.5 text-caption text-ink-secondary transition-all duration-300 hover:border-neon-blue/50 hover:text-ink-primary"
      aria-label="Switch language"
    >
      <FaGlobe className="text-xs" />
      <span className="font-medium">{lang === "zh" ? "EN" : "中"}</span>
    </button>
  );
}
