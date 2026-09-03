import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaRedo, FaClock, FaReceipt } from 'react-icons/fa';
import { PageMeta } from '@/components/common/PageMeta';
import { getAlipayISVOrderByOrderNo } from '@/db/alipay-isv-api';
import type { AlipayISVOrder } from '@/types/alipay-isv-order';
import { useLang } from '@/i18n/LangContext';
import { usePaymentState } from '@/lib/paymentState';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get('order_no') || '';
  const scene = searchParams.get('scene') || '';
  const resourceId = searchParams.get('resource_id') || '';
  const [order, setOrder] = useState<AlipayISVOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(false);
  const [stateSynced, setStateSynced] = useState(false);
  const { lang } = useLang();
  const { unlockInsider, activateVip, markAssessmentPaid } = usePaymentState();

  const MAX_POLL = 20;

  const syncPaymentState = useCallback((o: AlipayISVOrder | null) => {
    if (!o || o.status !== 'paid' || stateSynced) return;
    
    if (scene === 'insider_unlock' && resourceId) {
      unlockInsider(resourceId);
    }
    if (scene === 'vip') {
      activateVip();
    }
    if (scene === 'assessment') {
      markAssessmentPaid();
    }
    setStateSynced(true);
  }, [scene, resourceId, unlockInsider, activateVip, markAssessmentPaid, stateSynced]);

  useEffect(() => {
    if (!orderNo) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    const check = async () => {
      const o = await getAlipayISVOrderByOrderNo(orderNo);
      if (!cancelled) {
        setOrder(o);
        setLoading(false);
        syncPaymentState(o);
      }
    };

    check();

    const timer = setInterval(async () => {
      setPollCount((prev) => {
        if (prev >= MAX_POLL) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });

      const o = await getAlipayISVOrderByOrderNo(orderNo);
      if (!cancelled) {
        setOrder(o);
        syncPaymentState(o);
        if (o?.status === 'paid') {
          clearInterval(timer);
        }
      }
    }, 3000);

    return () => { cancelled = true; clearInterval(timer); };
  }, [orderNo, syncPaymentState]);

  const handleManualRefresh = useCallback(async () => {
    if (!orderNo) return;
    setManualRefresh(true);
    const o = await getAlipayISVOrderByOrderNo(orderNo);
    setOrder(o);
    syncPaymentState(o);
    setManualRefresh(false);
  }, [orderNo, syncPaymentState]);

  const sceneLabels: Record<string, { zh: string; en: string; backPath: string; backLabelZh: string; backLabelEn: string }> = {
    insider_unlock: { zh: '内参解锁', en: 'Insider Unlock', backPath: '/insider', backLabelZh: '查看已解锁内参', backLabelEn: 'View Unlocked Insider' },
    assessment: { zh: '评测报告', en: 'Assessment Report', backPath: '/assessment', backLabelZh: '查看评测报告', backLabelEn: 'View Assessment Report' },
    vip: { zh: 'VIP 会员', en: 'VIP Membership', backPath: '/vip', backLabelZh: '进入会员中心', backLabelEn: 'Go to VIP Center' },
  };

  const label = sceneLabels[scene] || { zh: '支付', en: 'Payment', backPath: '/', backLabelZh: '返回首页', backLabelEn: 'Back to Home' };

  const formatTime = (iso: string | null) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');
    } catch {
      return iso;
    }
  };

  return (
    <>
      <PageMeta
        title={lang === 'zh' ? '支付结果' : 'Payment Result'}
        description={lang === 'zh' ? '支付结果页面' : 'Payment result page'}
        keywords={[]}
      />
      <div className="flex min-h-[70vh] items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md text-center">
          {loading ? (
            <div className="glass-card p-8">
              <FaSpinner className="mx-auto mb-4 text-4xl text-neon-blue animate-spin" />
              <p className="text-body text-ink-secondary">
                {lang === 'zh' ? '正在确认支付状态...' : 'Confirming payment status...'}
              </p>
              <p className="mt-2 text-xs text-ink-footer">
                {lang === 'zh' ? '首次查询可能需要几秒' : 'First query may take a few seconds'}
              </p>
            </div>
          ) : order?.status === 'paid' ? (
            <div className="glass-card p-8">
              <FaCheckCircle className="mx-auto mb-4 text-5xl text-neon-green" />
              <h1 className="mb-2 text-2xl font-bold text-ink-primary">
                {lang === 'zh' ? '支付成功' : 'Payment Successful'}
              </h1>
              <p className="mb-2 text-body text-ink-secondary">
                {lang === 'zh' ? `${label.zh}支付已完成` : `${label.en} payment completed`}
              </p>
              <p className="mb-4 text-lg font-bold text-gold">
                ¥{order.total_amount}
              </p>

              <div className="mb-6 space-y-2 rounded-lg bg-cyber-bg/50 p-3 text-left">
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <FaReceipt className="shrink-0 text-xs text-neon-blue" />
                  <span className="truncate">{order.order_no}</span>
                </div>
                {order.paid_at && (
                  <div className="flex items-center gap-2 text-caption text-ink-secondary">
                    <FaClock className="shrink-0 text-xs text-neon-green" />
                    <span>{formatTime(order.paid_at)}</span>
                  </div>
                )}
                {order.alipay_trade_no && (
                  <div className="flex items-center gap-2 text-caption text-ink-secondary">
                    <FaReceipt className="shrink-0 text-xs text-gold" />
                    <span className="truncate">{lang === 'zh' ? '交易号：' : 'Trade: '}{order.alipay_trade_no}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to={label.backPath}
                  className="btn-gold rounded-xl bg-gold py-3 text-caption font-semibold text-cyber-bg"
                >
                  {lang === 'zh' ? label.backLabelZh : label.backLabelEn}
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyber-border py-3 text-caption text-ink-secondary hover:border-neon-blue/50 hover:text-ink-primary"
                >
                  <FaArrowLeft />
                  {lang === 'zh' ? '返回首页' : 'Back to Home'}
                </Link>
              </div>
            </div>
          ) : order?.status === 'pending' ? (
            <div className="glass-card p-8">
              <FaSpinner className="mx-auto mb-4 text-5xl text-gold animate-pulse" />
              <h1 className="mb-2 text-2xl font-bold text-ink-primary">
                {lang === 'zh' ? '等待支付确认' : 'Waiting for Payment'}
              </h1>
              <p className="mb-4 text-body text-ink-secondary">
                {lang === 'zh' ? '支付完成后页面将自动刷新' : 'Page will auto-refresh after payment'}
              </p>

              <div className="mb-6 space-y-2 rounded-lg bg-cyber-bg/50 p-3 text-left">
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <FaReceipt className="shrink-0 text-xs text-neon-blue" />
                  <span className="truncate">{order.order_no}</span>
                </div>
                <div className="flex items-center gap-2 text-caption text-ink-secondary">
                  <FaClock className="shrink-0 text-xs text-gold" />
                  <span>{lang === 'zh' ? '创建时间：' : 'Created: '}{formatTime(order.created_at)}</span>
                </div>
              </div>

              {pollCount >= MAX_POLL && (
                <p className="mb-4 text-caption text-gold">
                  {lang === 'zh' ? '查询次数已达上限，请手动刷新' : 'Poll limit reached, please refresh manually'}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleManualRefresh}
                  disabled={manualRefresh}
                  className="flex items-center justify-center gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-6 py-3 text-caption font-semibold text-neon-blue hover:bg-neon-blue hover:text-cyber-bg disabled:opacity-50"
                >
                  <FaRedo className={manualRefresh ? 'animate-spin' : ''} />
                  {manualRefresh
                    ? (lang === 'zh' ? '查询中...' : 'Checking...')
                    : (lang === 'zh' ? '手动刷新状态' : 'Refresh Status')}
                </button>
                <Link
                  to={label.backPath}
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyber-border px-6 py-3 text-caption text-ink-secondary hover:border-neon-blue/50 hover:text-ink-primary"
                >
                  <FaArrowLeft />
                  {lang === 'zh' ? '先返回看看' : 'Go back first'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8">
              <FaTimesCircle className="mx-auto mb-4 text-5xl text-red-500" />
              <h1 className="mb-2 text-2xl font-bold text-ink-primary">
                {lang === 'zh' ? '支付未完成' : 'Payment Incomplete'}
              </h1>
              <p className="mb-6 text-body text-ink-secondary">
                {lang === 'zh' ? '未找到支付记录或支付已取消' : 'Payment record not found or cancelled'}
              </p>
              <div className="flex flex-col gap-3">
                {orderNo && (
                  <button
                    onClick={handleManualRefresh}
                    disabled={manualRefresh}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-6 py-3 text-caption font-semibold text-neon-blue hover:bg-neon-blue hover:text-cyber-bg disabled:opacity-50"
                  >
                    <FaRedo className={manualRefresh ? 'animate-spin' : ''} />
                    {manualRefresh
                      ? (lang === 'zh' ? '查询中...' : 'Checking...')
                      : (lang === 'zh' ? '重新查询' : 'Retry Query')}
                  </button>
                )}
                <Link
                  to={label.backPath}
                  className="btn-cyber rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-6 py-3 text-caption font-semibold text-neon-blue hover:bg-neon-blue hover:text-cyber-bg"
                >
                  {lang === 'zh' ? '重新操作' : 'Try Again'}
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyber-border py-3 text-caption text-ink-secondary hover:border-neon-blue/50 hover:text-ink-primary"
                >
                  <FaArrowLeft />
                  {lang === 'zh' ? '返回首页' : 'Back to Home'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
