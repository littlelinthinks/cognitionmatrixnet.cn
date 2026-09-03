import { useState } from "react";
import { FaTimes, FaCheck, FaCrown, FaChartBar, FaLightbulb, FaCalendarAlt } from "react-icons/fa";
import { PageMeta } from "@/components/common/PageMeta";
import { useLang } from "@/i18n/LangContext";
import { startPayment } from "@/lib/payment";
import { usePaymentState } from "@/lib/paymentState";

const positions = ["基层员工", "基层管理", "中层管理", "高层管理", "自由职业"];

export default function Assessment() {
  const { t, lang } = useLang();
  const years = t.assessment.years;
  const areas = t.assessment.areas;
  const industries = t.assessment.industries;
  const { assessmentPaid, isVip, markAssessmentPaid } = usePaymentState();

  const [form, setForm] = useState({
    yearIdx: 0,
    industryIdx: 0,
    positionIdx: 0,
    efficiency: 5,
    procrastination: 5,
    selectedAreas: [] as number[],
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showReport, setShowReport] = useState(assessmentPaid || isVip);
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const toggleArea = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      selectedAreas: prev.selectedAreas.includes(idx)
        ? prev.selectedAreas.filter((i) => i !== idx)
        : [...prev.selectedAreas, idx],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assessmentPaid || isVip) {
      setShowReport(true);
      return;
    }
    setShowPayment(true);
    setPayError(null);
  };

  const handlePay = async () => {
    setPaying(true);
    setPayError(null);
    const result = await startPayment({
      scene: "assessment",
      amount: 9.9,
      description: "AI 职场效能评测报告",
    });
    if (!result.success) {
      setPayError(result.error || (lang === "zh" ? "支付发起失败，请稍后重试" : "Payment failed, please try again"));
      setPaying(false);
    }
  };

  const efficiencyLevel = form.efficiency <= 3 ? (lang === "zh" ? "待提升" : "Needs Improvement") : form.efficiency <= 6 ? (lang === "zh" ? "中等水平" : "Moderate") : (lang === "zh" ? "优秀" : "Excellent");
  const procrastinationLevel = form.procrastination <= 3 ? (lang === "zh" ? "自律型" : "Self-disciplined") : form.procrastination <= 6 ? (lang === "zh" ? "普通" : "Average") : (lang === "zh" ? "需关注" : "Needs Attention");

  const filledCount =
    (form.yearIdx >= 0 ? 1 : 0) +
    (form.selectedAreas.length > 0 ? 1 : 0) +
    (form.industryIdx >= 0 ? 1 : 0) +
    (form.efficiency > 0 ? 1 : 0) +
    (form.procrastination > 0 ? 1 : 0);
  const totalCount = 5;
  const progress = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  return (
    <>
      <PageMeta
        title={`${t.assessment.sectionTitle} — MATRIX NET`}
        description={t.assessment.subtitle}
        keywords={["职场评测", "AI 评测", "职业规划", "效能分析"]}
      />
      <div className="px-4 pt-24 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-section mb-3 text-ink-primary">
              {t.assessment.sectionTitle}
            </h1>
            <p className="text-body text-ink-secondary">
              {t.assessment.subtitle}
            </p>
          </div>

          {(assessmentPaid || isVip) && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-neon-green/20 bg-neon-green/5 p-3">
              {isVip ? <FaCrown className="text-gold" /> : <FaCheck className="text-neon-green" />}
              <span className="text-caption text-neon-green">
                {isVip
                  ? (lang === "zh" ? "VIP 会员 — 评测报告永久免费" : "VIP Member — Free assessment reports forever")
                  : (lang === "zh" ? "已支付 — 可随时查看报告" : "Paid — You can view the report anytime")}
              </span>
            </div>
          )}

          <div className="mb-6 rounded-xl border border-cyber-border bg-cyber-surface/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-caption text-ink-secondary">
                {lang === "zh" ? "填写进度" : "Progress"}
              </span>
              <span className="text-caption text-neon-blue">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cyber-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!showReport ? (
            <form
              onSubmit={handleSubmit}
              className="glass-card space-y-5 p-6"
            >
              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  {t.assessment.workYears}
                </label>
                <select
                  value={form.yearIdx}
                  onChange={(e) => setForm({ ...form, yearIdx: Number(e.target.value) })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-gold focus:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                >
                  {years.map((y, i) => (
                    <option key={i} value={i}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  {t.assessment.industry}
                </label>
                <select
                  value={form.industryIdx}
                  onChange={(e) => setForm({ ...form, industryIdx: Number(e.target.value) })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-gold focus:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                >
                  {industries.map((ind, i) => (
                    <option key={i} value={i}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  {lang === "zh" ? "当前职位层级" : "Current Position Level"}
                </label>
                <select
                  value={form.positionIdx}
                  onChange={(e) => setForm({ ...form, positionIdx: Number(e.target.value) })}
                  className="w-full rounded-xl border border-cyber-border bg-cyber-bg px-4 py-3 text-body text-ink-primary outline-none transition-all focus:border-gold focus:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                >
                  {positions.map((p, i) => (
                    <option key={i} value={i}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  {lang === "zh" ? "工作效率自评（1-10 分）" : "Self-rated Work Efficiency (1-10)"}
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.efficiency}
                  onChange={(e) => setForm({ ...form, efficiency: Number(e.target.value) })}
                  className="w-full accent-neon-blue"
                />
                <div className="mt-1 flex justify-between text-xs text-ink-secondary">
                  <span>1</span>
                  <span className="text-neon-blue font-semibold">{form.efficiency} — {efficiencyLevel}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-caption font-medium text-ink-secondary">
                  {lang === "zh" ? "拖延症倾向自评（1-10 分）" : "Self-rated Procrastination (1-10)"}
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.procrastination}
                  onChange={(e) => setForm({ ...form, procrastination: Number(e.target.value) })}
                  className="w-full accent-neon-blue"
                />
                <div className="mt-1 flex justify-between text-xs text-ink-secondary">
                  <span>1</span>
                  <span className="text-neon-blue font-semibold">{form.procrastination} — {procrastinationLevel}</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-caption font-medium text-ink-secondary">
                  {t.assessment.improveArea}
                </label>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleArea(i)}
                      className={`rounded-full px-4 py-2 text-caption transition-all duration-300 ${
                        form.selectedAreas.includes(i)
                          ? "bg-gold/20 text-gold"
                          : "border border-cyber-border text-ink-secondary hover:border-gold/50"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-gold w-full rounded-xl bg-gold py-4 text-body font-bold text-cyber-bg"
              >
                {assessmentPaid || isVip
                  ? (lang === "zh" ? "查看评测报告" : "View Report")
                  : t.assessment.submitBtn}
              </button>
            </form>
          ) : (
            <div className="glass-card glass-card-gold p-6 animate-slide-up">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                  <FaCheck className="text-success" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-primary">
                    {lang === "zh" ? "您的职场效能分析报告" : "Your Career Efficiency Report"}
                  </h2>
                  <p className="text-caption text-ink-secondary">
                    {lang === "zh" ? "基于您提交的数据生成" : "Generated from your submitted data"}
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-cyber-bg/50 p-3 text-center">
                  <FaChartBar className="mx-auto mb-1 text-lg text-neon-blue" />
                  <p className="text-xs text-ink-secondary">{lang === "zh" ? "效能评分" : "Efficiency"}</p>
                  <p className="text-lg font-bold text-neon-blue">{form.efficiency}/10</p>
                </div>
                <div className="rounded-lg bg-cyber-bg/50 p-3 text-center">
                  <FaLightbulb className="mx-auto mb-1 text-lg text-gold" />
                  <p className="text-xs text-ink-secondary">{lang === "zh" ? "拖延指数" : "Procrastination"}</p>
                  <p className="text-lg font-bold text-gold">{form.procrastination}/10</p>
                </div>
                <div className="rounded-lg bg-cyber-bg/50 p-3 text-center">
                  <FaCalendarAlt className="mx-auto mb-1 text-lg text-neon-green" />
                  <p className="text-xs text-ink-secondary">{lang === "zh" ? "工作年限" : "Experience"}</p>
                  <p className="text-lg font-bold text-neon-green">{years[form.yearIdx]}</p>
                </div>
                <div className="rounded-lg bg-cyber-bg/50 p-3 text-center">
                  <FaCrown className="mx-auto mb-1 text-lg text-gold" />
                  <p className="text-xs text-ink-secondary">{lang === "zh" ? "行业" : "Industry"}</p>
                  <p className="text-sm font-bold text-gold">{industries[form.industryIdx]}</p>
                </div>
              </div>

              <div className="space-y-6 text-body text-ink-primary leading-relaxed">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-neon-blue">
                    {lang === "zh" ? "一、效能现状评估" : "1. Current Efficiency Assessment"}
                  </h3>
                  <p className="text-ink-secondary">
                    {lang === "zh"
                      ? `根据您的自评数据，您当前工作效率评分为 ${form.efficiency}/10（${efficiencyLevel}），拖延症倾向评分为 ${form.procrastination}/10（${procrastinationLevel}）。作为${industries[form.industryIdx]}行业的${positions[form.positionIdx]}，您的${years[form.yearIdx]}工作经验为效能提升提供了坚实基础。数据显示，同行业同层级人群中，约 67% 的人面临类似的效率瓶颈。${form.efficiency <= 4 ? "您的效率评分偏低，建议优先从时间管理和任务拆解两个维度入手改善。" : form.efficiency >= 7 ? "您的效率表现优秀，建议将精力更多投入到战略思考和团队赋能上。" : ""}`
                      : `Based on your self-assessment, your current work efficiency score is ${form.efficiency}/10 (${efficiencyLevel}), and procrastination tendency is ${form.procrastination}/10 (${procrastinationLevel}). As a ${positions[form.positionIdx]} in the ${industries[form.industryIdx]} industry with ${years[form.yearIdx]} experience, you have a solid foundation for improvement. Data shows that ~67% of peers in similar roles face comparable efficiency bottlenecks.`}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-bold text-neon-blue">
                    {lang === "zh" ? "二、拖延症成因分析" : "2. Procrastination Analysis"}
                  </h3>
                  <p className="text-ink-secondary">
                    {lang === "zh"
                      ? `基于认知心理学模型分析，您的拖延倾向（${form.procrastination}/10）可能与以下因素相关：${form.procrastination >= 7 ? "高度拖延倾向通常源于完美主义导致的决策瘫痪、以及对失败的深层恐惧。建议采用「完成优于完美」的认知重构策略。" : form.procrastination >= 4 ? "中等拖延倾向可能与任务拆解能力不足导致的启动困难、以及即时反馈缺失造成的动力衰减有关。建议采用「微习惯」策略，将大任务拆解为 5 分钟可完成的最小行动单元。" : "您的自律能力较强，拖延倾向较低。建议关注「伪勤奋」陷阱 — 用低价值的忙碌回避高价值的深度思考。"}${form.selectedAreas.length > 0 ? ` 您关注的${form.selectedAreas.map((i) => areas[i]).join("、")}领域，均有针对性的改善方案。` : ""}`
                      : `Based on cognitive psychology models, your procrastination tendency (${form.procrastination}/10) may relate to: insufficient task decomposition causing startup difficulty, perfectionism leading to decision paralysis, and lack of immediate feedback causing motivation decay. We recommend the 'micro-habit' strategy — breaking tasks into 5-minute minimum action units.`}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-bold text-neon-blue">
                    {lang === "zh" ? "三、职业发展建议" : "3. Career Development Advice"}
                  </h3>
                  <p className="text-ink-secondary">
                    {lang === "zh"
                      ? `结合您的行业背景（${industries[form.industryIdx]}）与职位层级（${positions[form.positionIdx]}），建议重点关注以下方向：建立系统化的时间管理框架（推荐 GTD 方法论的本地化适配）、利用 AI 自动化工具减少重复性工作占比、以及通过结构化复盘机制持续提升决策质量。${form.positionIdx >= 2 ? "作为管理岗位，团队效能放大是您的核心杠杆 — 建议将个人效率方法论转化为团队 SOP。" : form.positionIdx === 4 ? "作为自由职业者，建议建立客户管理系统和项目流水线，避免收入波动带来的焦虑性拖延。" : ""}`
                      : `Based on your industry background and improvement goals, we recommend focusing on: building a systematic time management framework, leveraging AI automation tools to reduce repetitive work, and establishing structured review mechanisms for continuous decision quality improvement.`}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-bold text-neon-blue">
                    {lang === "zh" ? "四、90 天行动计划" : "4. 90-Day Action Plan"}
                  </h3>
                  <p className="text-ink-secondary">
                    {lang === "zh"
                      ? "短期（1-2 周）：从本站工具库下载适合您岗位的自动化办公工具，优先解决最高频的重复性工作场景。建立每日「三件事」清单习惯，每天只聚焦最重要的三件事。中期（1-3 个月）：建立个人效能仪表盘，每周追踪关键指标变化。完成至少一个效率工具的深度使用，形成稳定的工作流。长期（3-6 个月）：形成稳定的效率系统，将节省的时间投入到高价值的技能提升与人际网络建设中。定期复盘并迭代您的效率系统。"
                      : "Short-term (1-2 weeks): Download automation tools from our library suited to your role. Mid-term (1-3 months): Build a personal efficiency dashboard. Long-term (3-6 months): Form a stable efficiency system, investing saved time into high-value skill development."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowPayment(false)}
        >
          <div
            className="glass-card glass-card-gold w-full max-w-sm animate-slide-up p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink-primary">
                {t.assessment.unlockReport}
              </h3>
              <button
                onClick={() => setShowPayment(false)}
                className="text-ink-secondary hover:text-ink-primary"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-2 text-body text-ink-primary">
              {t.assessment.reportTitle}
            </p>
            <p className="mb-5 text-2xl font-bold text-gold">¥9.9</p>
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
                : (lang === "zh" ? "支付宝支付 ¥9.9" : "Pay with Alipay ¥9.9")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
