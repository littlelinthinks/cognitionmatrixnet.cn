import { useState } from "react";
import { FaCrown, FaCheck, FaTimes, FaStar, FaBolt, FaCheckCircle } from "react-icons/fa";
import { vipBenefits } from "@/data/mockData";
import { useLang } from "@/i18n/LangContext";
import { startPayment } from "@/lib/payment";
import { usePaymentState } from "@/lib/paymentState";

function PricingCard({
  tier,
  price,
  originalPrice,
  features,
  highlighted,
  onSelect,
  disabled,
  disabledLabel,
}: {
  tier: string;
  price: string;
  originalPrice?: string;
  features: string[];
  highlighted?: boolean;
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
          : ""
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-4 py-1">
          <span className="text-xs font-bold text-cyber-bg">{t.vip.mostPopular}</span>
        </div>
      )}

      <div className="mb-4 text-center">
        <h3
          className={`text-lg font-bold ${
            highlighted ? "text-gold" : "text-ink-primary"
          }`}
        >
          {tier}
        </h3>
        <div className="mt-3">
          {originalPrice && (
            <p className="text-caption text-ink-secondary line-through">
              {originalPrice}
            </p>
          )}
          <p
            className={`text-3xl font-bold ${
              highlighted ? "text-gold text-glow-gold" : "text-neon-blue"
            }`}
          >
            {price}
          </p>
        </div>
      </div>

      <div className="mb-6 flex-1 space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-2">
            <FaCheck
              className={`mt-0.5 shrink-0 text-xs ${
                highlighted ? "text-gold" : "text-neon-green"
              }`}
            />
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
              ? "btn-gold animate-glow-pulse bg-gradient-to-r from-gold to-gold-dark text-cyber-bg hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              : "btn-cyber border border-neon-blue/30 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-cyber-bg hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          }`}
        >
          {highlighted ? t.vip.subscribeNow : t.vip.selectPlan}
        </button>
      )}
    </div>
  );
}

export default function VipSection() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState("永久俱乐部会员");
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const { lang, t } = useLang();
  const { isVip, assessmentPaid, isInsiderUnlocked } = usePaymentState();

  const tierPriceMap: Record<string, { amount: number; desc: string; scene: string }> = {
    [t.vip.singleUnlock]: { amount: 19.9, desc: "单篇内参解锁", scene: "insider_unlock" },
    [t.vip.lifetimeMember]: { amount: 99, desc: "Cognition Matrix Net 永久 VIP 会员", scene: "vip" },
    [t.vip.assessmentTrial]: { amount: 9.9, desc: "AI 职场效能评测报告", scene: "assessment" },
  };

  const plans = [
    {
      tier: t.vip.singleUnlock,
      price: "¥19.9",
      features: [
        lang === "zh" ? "解锁单篇内参白皮书" : "Unlock single insider report",
        lang === "zh" ? "获取完整下载链接" : "Get full download link",
        lang === "zh" ? "7 天内有效" : "Valid for 7 days",
      ],
      disabled: isVip,
    },
    {
      tier: t.vip.lifetimeMember,
      price: "¥99",
      originalPrice: t.vip.originalPrice,
      features: vipBenefits.map((b) => `${b.text} (${t.vip.valueLabel} ¥${b.value})`),
      highlighted: true,
      disabled: isVip,
    },
    {
      tier: t.vip.assessmentTrial,
      price: "¥9.9",
      features: [
        lang === "zh" ? "AI 职场效能深度评测" : "AI career efficiency assessment",
        lang === "zh" ? "5000 字个性化分析报告" : "5000-word personalized report",
        lang === "zh" ? "职业发展规划建议" : "Career development recommendations",
      ],
      disabled: isVip || assessmentPaid,
    },
  ];

  const handleSelect = (tier: string) => {
    setSelectedTier(tier);
    setShowPayment(true);
    setPayError(null);
  };

  const handlePay = async () => {
    const config = tierPriceMap[selectedTier];
    if (!config) return;
    setPaying(true);
    setPayError(null);
    const result = await startPayment({
      scene: config.scene as "insider_unlock" | "assessment" | "vip",
      amount: config.amount,
      description: config.desc,
    });
    if (!result.success) {
      setPayError(result.error || (lang === "zh" ? "支付发起失败，请稍后重试" : "Payment failed, please try again"));
      setPaying(false);
    }
  };

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
            <FaStar className="text-xs text-gold" />
            <span className="text-xs text-gold">{t.vip.badge}</span>
          </div>
          <h2 className="text-section mb-3 text-ink-primary">
            {t.vip.sectionTitle}
          </h2>
          <p className="text-subtitle text-ink-primary">
            {t.vip.subtitle}
          </p>
          {isVip && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-neon-green/10 px-4 py-1.5">
              <FaCheckCircle className="text-xs text-neon-green" />
              <span className="text-xs text-neon-green">
                {lang === "zh" ? "VIP 已开通 — 全站资源已解锁" : "VIP Active — All resources unlocked"}
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
              onSelect={() => handleSelect(plan.tier)}
              disabled={plan.disabled}
              disabledLabel={
                plan.tier === t.vip.lifetimeMember
                  ? (lang === "zh" ? "已开通" : "Active")
                  : (lang === "zh" ? "VIP 已包含" : "Included in VIP")
              }
            />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <FaBolt className="text-neon-blue" />
            <span className="text-caption text-ink-primary">
              {t.vip.instant}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCrown className="text-gold" />
            <span className="text-caption text-ink-primary">
              {t.vip.forever}
            </span>
          </div>
        </div>
      </div>

      {showPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="glass-card glass-card-gold w-full max-w-sm animate-slide-up p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-primary">
                {t.vip.modalTitle} {selectedTier}
              </h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-ink-secondary hover:text-ink-primary"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-2 text-body text-ink-primary">{selectedTier}</p>
            <p className="mb-5 text-2xl font-bold text-gold">
              {plans.find((p) => p.tier === selectedTier)?.price}
            </p>
            {payError && (
              <div className="mb-3 rounded-lg bg-red-500/10 p-3">
                <p className="text-center text-caption text-red-400">{payError}</p>
                <p className="mt-1 text-center text-xs text-ink-footer">
                  {lang === "zh" ? "请检查网络连接后重试" : "Please check your network and try again"}
                </p>
              </div>
            )}
            <button
              onClick={handlePay}
              disabled={paying}
              className="btn-gold w-full rounded-xl bg-gold py-3 text-caption font-semibold text-cyber-bg disabled:opacity-50"
            >
              {paying
                ? (lang === "zh" ? "正在跳转支付..." : "Redirecting to payment...")
                : (lang === "zh" ? "支付宝支付" : "Pay with Alipay")}
            </button>
            <p className="mt-3 text-center text-xs text-ink-secondary">
              {t.vip.payHint}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
