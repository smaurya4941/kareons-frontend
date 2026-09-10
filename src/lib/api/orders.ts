import { authedFetch } from './server';
import type { ApiCollection, ApiResource, Order } from '@/types/api';

export async function getOrders(page = 1) {
  return authedFetch<ApiCollection<Order>>('/orders', {
    searchParams: { page },
    cache: 'no-store',
  });
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await authedFetch<ApiResource<Order>>(`/orders/${id}`, { cache: 'no-store' });
  return data;
}

export interface ReturnRequestPayload {
  type: 'refund' | 'replacement';
  reason: string;
  customer_note?: string;
}

export async function requestReturn(orderId: number, payload: ReturnRequestPayload) {
  return authedFetch<{ message: string }>(`/orders/${orderId}/return`, {
    method: 'POST',
    body: payload,
  });
}

export interface ResumePaymentResponse {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
}

/**
 * Re-open the Razorpay payment for an order that was placed but never paid
 * (customer closed the Razorpay modal). 422 if the order can no longer be
 * paid online (already paid, cancelled by the stale-payment sweep, etc.).
 */
export async function resumeOrderPayment(orderId: number): Promise<ResumePaymentResponse> {
  const { data } = await authedFetch<ApiResource<ResumePaymentResponse>>(`/orders/${orderId}/payment`, {
    method: 'POST',
  });
  return data;
}
