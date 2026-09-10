'use server';

import { revalidatePath } from 'next/cache';
import * as ordersApi from '@/lib/api/orders';
import type { ReturnRequestPayload } from '@/lib/api/orders';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export async function requestReturnAction(orderId: number, payload: ReturnRequestPayload): Promise<ActionResult> {
  try {
    await ordersApi.requestReturn(orderId, payload);
    revalidatePath(`/account/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not submit return request.' };
  }
}

export interface ResumePaymentResult extends ActionResult {
  razorpay?: ordersApi.ResumePaymentResponse;
}

export async function resumeOrderPaymentAction(orderId: number): Promise<ResumePaymentResult> {
  try {
    const razorpay = await ordersApi.resumeOrderPayment(orderId);
    return { success: true, razorpay };
  } catch (error) {
    return {
      success: false,
      message: error instanceof ApiError ? error.message : 'Could not reopen the payment.',
    };
  }
}
