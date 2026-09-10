'use server';

import { revalidatePath } from 'next/cache';
import * as checkoutApi from '@/lib/api/checkout';
import type { PlaceOrderPayload, VerifyPaymentPayload } from '@/lib/api/checkout';
import { ApiError } from '@/lib/api/client';
import type { CheckoutOrderResponse } from '@/types/api';

export interface PlaceOrderResult {
  success: boolean;
  message?: string;
  order?: CheckoutOrderResponse['data']['order'];
  razorpay?: CheckoutOrderResponse['data']['razorpay'];
}

export async function placeOrderAction(payload: PlaceOrderPayload): Promise<PlaceOrderResult> {
  try {
    const { order, razorpay } = await checkoutApi.placeOrder(payload);
    // The order-placement transaction clears the server-side cart.
    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidatePath('/account/orders');
    return { success: true, order, razorpay };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not place order.' };
  }
}

export interface VerifyPaymentResult {
  success: boolean;
  message?: string;
}

export async function verifyPaymentAction(payload: VerifyPaymentPayload): Promise<VerifyPaymentResult> {
  try {
    await checkoutApi.verifyRazorpayPayment(payload);
    revalidatePath('/account/orders');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Payment verification failed.' };
  }
}
