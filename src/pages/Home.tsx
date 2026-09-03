import { useState, useEffect } from "react";
import HeroSection from "@/components/generated/HeroSection";
import ToolCards from "@/components/generated/ToolCards";
import BusinessBrainSection from "@/components/generated/BusinessBrainSection";
import EnterpriseSection from "@/components/generated/EnterpriseSection";
import VipSection from "@/components/generated/VipSection";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowUp } from "react-icons/fa";
import { getTools } from "@/data/tools";
import type { Tool } from "@/data/tools";
import type { ToolItem } from "@/data/mockData";

function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />
    </div>
  );
}

function MobileStickyCta() {
  return (
    <div className="sticky-bottom-cta">
      <a
        href="/vip"
        className="btn-gold flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-gold to-gold-dark py-3.5 text-caption font-semibold text-cyber-bg"
      >
        开通Pro会员 — 全站AI工具无限使用
      </a>
    </div>
  );
}

export default function Home() {
  const [toolItems, setToolItems] = useState<ToolItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    getTools()
      .then((tools: Tool[]) => {
        if (cancelled) return;
        setToolItems(tools.map((t: Tool) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          tags: t.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
          downloadCount: t.download_count,
          coverUrl: t.cover_url,
          downloadUrl: t.download_url,
          extractCode: t.extract_code,
        })));
      })
      .catch(() => {
        if (!cancelled) setToolItems([]);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <PageMeta
        title="Cognition Matrix Net — AI时代的智能决策系统"
        description="发现隐藏机会，提升工作效率，建立未来竞争优势。Cognition Matrix Net提供AI工具矩阵、AI商业大脑、行业情报、企业AI解决方案等全方位智能决策服务。"
        keywords="AI工具,AI商业大脑,智能决策,AI Agent,企业AI,行业情报,Cognition Matrix Net"
      />
      <HeroSection />
      <SectionDivider />
      <ToolCards tools={toolItems} />
      <SectionDivider />
      <BusinessBrainSection />
      <SectionDivider />
      <EnterpriseSection />
      <SectionDivider />
      <VipSection />
      <MobileStickyCta />
      <BackToTop />
    </>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-neon-blue/30 bg-cyber-surface/80 text-neon-blue backdrop-blur-sm transition-all hover:bg-neon-blue hover:text-cyber-bg md:bottom-6"
    >
      <FaArrowUp />
    </button>
  );
}
