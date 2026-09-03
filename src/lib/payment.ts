import { createAlipayISVPagePayOrder } from '@/db/alipay-isv-api';

export type PaymentScene = 'insider_unlock' | 'assessment' | 'vip';

export interface PaymentConfig {
  scene: PaymentScene;
  amount: number;
  description: string;
  resourceId?: string;
}

export interface PaymentResult {
  success: boolean;
  orderNo?: string;
  error?: string;
}

export async function startPayment(config: PaymentConfig): Promise<PaymentResult> {
  const { scene, amount, description, resourceId } = config;
  const orderNo = `MN-${scene.toUpperCase()}-${Date.now()}`;
  const returnUrl = `${window.location.origin}/payment-result?order_no=${orderNo}&scene=${scene}&resource_id=${resourceId || ''}`;

  try {
    const result = await createAlipayISVPagePayOrder({
      amount,
      description,
      outTradeNo: orderNo,
      returnUrl,
      systemUserId: resourceId,
    });

    if (result.success && result.pay_url) {
      window.location.href = result.pay_url;
      return { success: true, orderNo };
    }

    return {
      success: false,
      error: result.error || '支付发起失败',
    };
  } catch (err) {
    console.error('Payment error:', err);
    return {
      success: false,
      error: '网络异常，请稍后重试',
    };
  }
}
