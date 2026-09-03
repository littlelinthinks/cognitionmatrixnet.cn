import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Lang } from "./translations";

type TranslationKeys = typeof translations.zh;

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationKeys;
}

const LangContext = createContext<LangContextValue>({
  lang: "zh",
  setLang: () => {},
  t: translations.zh,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  const value: LangContextValue = {
    lang,
    setLang: useCallback((l: Lang) => setLang(l), []),
    t: translations[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
