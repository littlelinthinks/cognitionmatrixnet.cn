// src/db/alipay-isv-api.ts
// **严格照原样写入,不允许改变!**
import { supabase } from '@/lib/supabase';
import type {
  AlipayISVOrder,
  PaymentOrder,
  CreateAlipayISVOrderRequest,
  CreateAlipayISVOrderResponse,
  CreateAlipayISVPagePayOrderRequest,
  CreateAlipayISVPagePayOrderResponse,
  CreateAlipayISVWapPayOrderRequest,
  CreateAlipayISVWapPayOrderResponse,
} from '@/types/alipay-isv-order';

// ============================================================
// 创建支付宝ISV订单 -- 调用 msea-app-baas 后端接口
// 后端端点: POST /toc/alipay-isv/{siteId}/create-order
// syncDB=true：由后端负责写入 payment_orders，前端无需再调 Supabase insert
// ============================================================

export async function createAlipayISVOrder(
  data: CreateAlipayISVOrderRequest
): Promise<CreateAlipayISVOrderResponse> {
  try {
    const response = await fetch(`https://baas-api.wanwang.xin/toc/alipay-isv/${window.__CONFIG__.siteId}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, syncDB: true }),
    });

    // 防御：后端 500 可能返回 HTML，response.json() 会抛异常
    let result: any;
    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        order_no: '',
        qr_code: '',
        error: `服务器错误 (${response.status})，请稍后重试`,
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        order_no: '',
        qr_code: '',
        error: result.error || result.message || `创建订单失败 (${response.status})`,
      };
    }

    return {
      success: true,
      order_no: result.order_no,
      qr_code: result.qr_code,
    };
  } catch (error) {
    console.error('Create alipay-isv order exception:', error);
    return {
      success: false,
      order_no: '',
      qr_code: '',
      error: '创建订单失败，请稍后重试',
    };
  }
}

// ============================================================
// 创建支付宝ISV电脑网站支付订单 -- 调用 msea-app-baas 后端接口
// 后端端点: POST /toc/alipay-isv/{siteId}/create-page-pay-order
// 返回支付宝收银台 URL，前端直接 window.location.href 跳转即可
// syncDB=true：由后端负责写入 payment_orders，前端无需再调 Supabase insert
// ============================================================

export async function createAlipayISVPagePayOrder(
  data: CreateAlipayISVPagePayOrderRequest
): Promise<CreateAlipayISVPagePayOrderResponse> {
  try {
    const response = await fetch(`https://baas-api.wanwang.xin/toc/alipay-isv/${window.__CONFIG__.siteId}/create-page-pay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, syncDB: true }),
    });

    // 防御：后端 500 可能返回 HTML，response.json() 会抛异常
    let result: any;
    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        order_no: '',
        pay_url: '',
        error: `服务器错误 (${response.status})，请稍后重试`,
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        order_no: '',
        pay_url: '',
        error: result.error || result.message || `创建订单失败 (${response.status})`,
      };
    }

    return {
      success: true,
      order_no: result.order_no,
      pay_url: result.pay_url,
    };
  } catch (error) {
    console.error('Create alipay-isv page pay order exception:', error);
    return {
      success: false,
      order_no: '',
      pay_url: '',
      error: '创建订单失败，请稍后重试',
    };
  }
}

// ============================================================
// 创建支付宝ISV手机网站支付订单 -- 调用 msea-app-baas 后端接口
// 后端端点: POST /toc/alipay-isv/{siteId}/create-wap-pay-order
// 返回支付宝收银台 URL，移动端 H5 直接 window.location.href 跳转
// syncDB=true：由后端负责写入 payment_orders，前端无需再调 Supabase insert
// ============================================================

export async function createAlipayISVWapPayOrder(
  data: CreateAlipayISVWapPayOrderRequest
): Promise<CreateAlipayISVWapPayOrderResponse> {
  try {
    const response = await fetch(`https://baas-api.wanwang.xin/toc/alipay-isv/${window.__CONFIG__.siteId}/create-wap-pay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, syncDB: true }),
    });

    // 防御：后端 500 可能返回 HTML，response.json() 会抛异常
    let result: any;
    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        order_no: '',
        pay_url: '',
        error: `服务器错误 (${response.status})，请稍后重试`,
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        order_no: '',
        pay_url: '',
        error: result.error || result.message || `创建订单失败 (${response.status})`,
      };
    }

    return {
      success: true,
      order_no: result.order_no,
      pay_url: result.pay_url,
    };
  } catch (error) {
    console.error('Create alipay-isv wap pay order exception:', error);
    return {
      success: false,
      order_no: '',
      pay_url: '',
      error: '创建订单失败，请稍后重试',
    };
  }
}

// ============================================================
// 查询支付宝ISV订单详情 -- 从统一的 payment_orders 表查询
// 禁止通过后端 HTTP API 查询，后端不存在 query-order 接口
// ============================================================

export async function getAlipayISVOrderByOrderNo(
  orderNo: string
): Promise<AlipayISVOrder | null> {
  try {
    const { data, error } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('order_no', orderNo)
      .eq('platform', 'alipay-isv')
      .single();

    if (error) {
      console.error('Get alipay-isv order error:', error);
      return null;
    }

    // 转换为兼容旧代码的 AlipayISVOrder 格式
    return convertToAlipayISVOrder(data);
  } catch (error) {
    console.error('Get alipay-isv order exception:', error);
    return null;
  }
}

// ============================================================
// 查询用户的所有支付宝ISV订单 -- 从统一的 payment_orders 表查询
// ============================================================

export async function getAlipayISVOrdersByPhone(
  phone: string
): Promise<AlipayISVOrder[]> {
  try {
    const { data, error } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('phone', phone)
      .eq('platform', 'alipay-isv')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get alipay-isv orders error:', error);
      return [];
    }

    // 转换为兼容旧代码的 AlipayISVOrder 格式
    return (data || []).map(convertToAlipayISVOrder);
  } catch (error) {
    console.error('Get alipay-isv orders exception:', error);
    return [];
  }
}


// ============================================================
// 工具函数：将 PaymentOrder 转换为 AlipayISVOrder（兼容层）
// ============================================================

function convertToAlipayISVOrder(paymentOrder: PaymentOrder): AlipayISVOrder {
  const platformData = paymentOrder.platform_data || {};

  return {
    id: paymentOrder.id,
    order_no: paymentOrder.order_no,
    status: paymentOrder.status,
    qr_code: paymentOrder.qr_code_url,
    alipay_trade_no: paymentOrder.platform_trade_no,
    total_amount: paymentOrder.total_amount,
    description: paymentOrder.description,
    // ISV特有字段从 platform_data 提取
    merchant_name: platformData.merchant_name || null,
    merchant_user_id: platformData.merchant_user_id || null,
    paid_at: paymentOrder.paid_at,
    created_at: paymentOrder.created_at,
    updated_at: paymentOrder.updated_at,
  };
}
