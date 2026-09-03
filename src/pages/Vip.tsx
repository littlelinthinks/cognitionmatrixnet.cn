import { useState } from "react";
import { FaCrown, FaCheck, FaTimes, FaStar, FaBolt, FaCheckCircle, FaChevronDown, FaRocket, FaBuilding } from "react-icons/fa";
import { vipBenefits } from "@/data/mockData";
import { useLang } from "@/i18n/LangContext";
import { startPayment } from "@/lib/payment";
import { usePaymentState } from "@/lib/paymentState";
import { PageMeta } from "@/components/common/PageMeta";

function PricingCard({
  tier,
  price,
  originalPrice,
  features,
  highlighted,
  isEnterprise,
  onSelect,
  disabled,
  disabledLabel,
}: {
  tier: string;
  price: string;
  originalPrice?: string;
  features: string[];
  highlighted?: boolean;
  isEnterprise?: boolean;
  onSelect: () => void;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const { t } = useLang();

  return (
    <div
      className={`glass-card relative flex flex-col p-6 transition-all duration-300 ${
        highlighted
          ? "glass-card-gold scale-100 border-gold/40 md:scale-105"
          : isEnterprise
          ? "border-neon-green/30"
          : ""
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1">
          <span className="text-xs font-bold text-cyber-bg">{t.vip.mostPopular}</span>
        </div>
      )}

      <div className="mb-4 text-center">
        <h3 className={`text-lg font-bold ${highlighted ? "text-gold" : isEnterprise ? "text-neon-green" : "text-ink-primary"}`}>
          {tier}
        </h3>
        <div className="mt-3">
          {originalPrice && (
            <p className="text-caption text-ink-secondary line-through">{originalPrice}</p>
          )}
          <p className={`text-3xl font-bold ${highlighted ? "text-gold text-glow-gold" : isEnterprise ? "text-neon-green" : "text-neon-blue"}`}>
            {price}
          </p>
        </div>
      </div>

      <div className="mb-6 flex-1 space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <FaCheck className={`mt-0.5 shrink-0 text-xs ${highlighted ? "text-gold" : "text-neon-green"}`} />
            <span className="text-caption text-ink-secondary">{f}</span>
          </div>
        ))}
      </div>

      {disabled ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/5 py-3 text-caption font-semibold text-neon-green">
          <FaCheckCircle />
          {disabledLabel}
        </div>
      ) : (
        <button
          onClick={onSelect}
          className={`w-full rounded-xl py-3 text-caption font-semibold transition-all duration-300 ${
            highlighted
              ? "btn-gold bg-gradient-to-r from-gold to-gold-dark text-cyber-bg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              : isEnterprise
              ? "border border-neon-green/30 bg-neon-green/10 text-neon-green hover:bg-neon-green hover:text-cyber-bg"
              : "btn-cyber border border-neon-blue/30 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-cyber-bg"
          }`}
        >
          {highlighted ? t.vip.subscribeNow : t.vip.selectPlan}
        </button>
      )}
    </div>
  );
}

export default function Vip() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Pro会员");
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { lang, t } = useLang();
  const { isVip } = usePaymentState();

  const plans = [
    {
      tier: t.vip.freeTier,
      price: t.vip.freePrice,
      features: lang === "zh"
        ? ["浏览AI工具库", "基础认知测试", "公开行业文章", "免费分析报告"]
        : ["Browse AI tools", "Basic assessment", "Public articles", "Free reports"],
    },
    {
      tier: t.vip.proTier,
      price: t.vip.proPrice,
      originalPrice: t.vip.originalPrice,
      features: vipBenefits.map((b) => `${b.text}`),
      highlighted: true,
      disabled: isVip,
    },
    {
      tier: t.vip.enterpriseTier,
      price: t.vip.enterprisePrice,
      features: lang === "zh"
        ? ["企业AI知识库", "销售AI助手", "行业分析系统", "员工AI培训", "专属客户经理"]
        : ["Enterprise AI knowledge base", "Sales AI assistant", "Industry analysis", "Employee AI training", "Dedicated manager"],
      isEnterprise: true,
    },
  ];

  const faqData = t.vip.faqData;

  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    const result = await startPayment({
      scene: "vip",
      amount: 299,
      description: "MATRIX NET Pro会员",
    });
    if (!result.success) {
      setPayError(result.error || (lang === "zh" ? "支付发起失败，请稍后重试" : "Payment failed"));
      setPaying(false);
    }
  };

  return (
    <>
      <PageMeta
        title={lang === "zh" ? "会员中心 — MATRIX NET" : "Membership — MATRIX NET"}
        description={lang === "zh" ? "选择适合你的AI时代成长方案。免费用户、Pro会员、企业版三档权益。" : "Choose your AI-era growth plan."}
      />
      <section className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
              <FaStar className="text-xs text-gold" />
              <span className="text-xs text-gold">{t.vip.badge}</span>
            </div>
            <h1 className="text-section mb-3 text-ink-primary">{t.vip.sectionTitle}</h1>
            <p className="text-subtitle text-ink-secondary">{t.vip.subtitle}</p>
            {isVip && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-neon-green/10 px-4 py-1.5">
                <FaCheckCircle className="text-xs text-neon-green" />
                <span className="text-xs text-neon-green">
                  {lang === "zh" ? "Pro会员已开通" : "Pro Active"}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard
                key={plan.tier}
                tier={plan.tier}
                price={plan.price}
                originalPrice={plan.originalPrice}
                features={plan.features}
                highlighted={plan.highlighted}
                isEnterprise={plan.isEnterprise}
                onSelect={() => {
                  if (plan.isEnterprise) {
                    window.location.href = "/enterprise";
                    return;
                  }
                  setSelectedTier(plan.tier);
                  setShowPayment(true);
                }}
                disabled={plan.disabled}
                disabledLabel={lang === "zh" ? "已开通" : "Active"}
              />
            ))}
          </div>

          <div className="mt-16">
            <h3 className="mb-6 text-center text-lg font-bold text-ink-primary">{t.vip.faq}</h3>
            <div className="space-y-3">
              {faqData.map((item, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <span className="text-caption font-medium text-ink-primary">{item.q}</span>
                    <FaChevronDown className={`shrink-0 text-xs text-ink-secondary transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-cyber-border px-4 pb-4 pt-3">
                      <p className="text-caption leading-relaxed text-ink-secondary">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
          <div className="glass-card glass-card-gold w-full max-w-sm animate-slide-up p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-primary">{t.vip.modalTitle}</h3>
              <button onClick={() => setShowPayment(false)} className="text-ink-secondary hover:text-ink-primary"><FaTimes /></button>
            </div>
            <p className="mb-2 text-body text-ink-primary">{selectedTier}</p>
            <p className="mb-5 text-2xl font-bold text-gold">{plans.find((p) => p.tier === selectedTier)?.price}</p>
            {payError && (
              <div className="mb-3 rounded-lg bg-red-500/10 p-3">
                <p className="text-center text-caption text-red-400">{payError}</p>
              </div>
            )}
            <button onClick={handlePay} disabled={paying} className="btn-gold w-full rounded-xl bg-gold py-3 text-caption font-semibold text-cyber-bg disabled:opacity-50">
              {paying ? (lang === "zh" ? "正在跳转..." : "Redirecting...") : (lang === "zh" ? "支付宝支付" : "Pay with Alipay")}
            </button>
            <p className="mt-3 text-center text-xs text-ink-secondary">{t.vip.payHint}</p>
          </div>
        </div>
      )}
    </>
  );
}
