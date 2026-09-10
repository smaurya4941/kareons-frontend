import { authedFetch } from './server';
import type { ApiResource, CheckoutOrderResponse, CheckoutSummary, Order } from '@/types/api';

export async function getCheckoutSummary(): Promise<CheckoutSummary> {
  const { data } = await authedFetch<ApiResource<CheckoutSummary>>('/checkout/summary', {
    cache: 'no-store',
  });
  return data;
}

/**
 * The API (Api\V1\Requests\CheckoutRequest) always creates a NEW Address row
 * from these flat fields — it does not accept a saved `address_id`. The
 * checkout UI pre-fills them from a saved address for convenience.
 */
export interface PlaceOrderPayload {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  payment_method: string; // payment method `code`, e.g. 'cod' | 'razorpay'
  coupon_code?: string;
}

/**
 * COD: `razorpay` in the response is null and the order is placed
 * immediately. Razorpay: open Checkout.js with the returned
 * order_id/key/amount, then call verifyRazorpayPayment on success.
 */
export async function placeOrder(payload: PlaceOrderPayload) {
  const { data } = await authedFetch<CheckoutOrderResponse>('/checkout', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyRazorpayPayment(payload: VerifyPaymentPayload): Promise<Order> {
  const { data } = await authedFetch<ApiResource<Order>>('/checkout/verify-payment', {
    method: 'POST',
    body: payload,
  });
  return data;
}
