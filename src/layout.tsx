import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";
import Header from "@/components/generated/Header";
import Footer from "@/components/generated/Footer";
import { useLang } from "@/i18n/LangContext";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t } = useLang();

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-cyber-border bg-cyber-surface/90 text-ink-secondary backdrop-blur-md transition-all duration-300 hover:border-neon-blue hover:text-neon-blue hover:shadow-[0_0_12px_rgba(0,229,255,0.3)] md:bottom-6"
      aria-label={t.common.backToTop}
    >
      <FaArrowUp className="text-sm" />
    </button>
  );
}

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-cyber-bg">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
