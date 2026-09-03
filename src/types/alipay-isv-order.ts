export interface PaymentOrder {
  order_no: string;
  amount: number;
  subject: string;
  status: 'pending' | 'paid' | 'closed';
  created_at: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface AlipayISVOrder {
  order_no: string;
  amount: number;
  subject: string;
  status: 'pending' | 'paid' | 'closed';
  created_at: string;
  [key: string]: unknown;
}

export interface CreateAlipayISVOrderRequest {
  amount: number;
  subject: string;
  resource_id?: string;
  resource_type?: string;
  user_id?: string;
  return_url?: string;
  notify_url?: string;
  [key: string]: unknown;
}

export interface CreateAlipayISVOrderResponse {
  success: boolean;
  order_no: string;
  qr_code: string;
  error?: string;
}

export interface CreateAlipayISVPagePayOrderRequest {
  amount: number;
  subject: string;
  resource_id?: string;
  resource_type?: string;
  user_id?: string;
  return_url?: string;
  notify_url?: string;
  [key: string]: unknown;
}

export interface CreateAlipayISVPagePayOrderResponse {
  success: boolean;
  order_no: string;
  pay_url: string;
  error?: string;
}

export interface CreateAlipayISVWapPayOrderRequest {
  amount: number;
  subject: string;
  resource_id?: string;
  resource_type?: string;
  user_id?: string;
  return_url?: string;
  notify_url?: string;
  [key: string]: unknown;
}

export interface CreateAlipayISVWapPayOrderResponse {
  success: boolean;
  order_no: string;
  pay_url: string;
  error?: string;
}

export interface AlipayIsvResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}
