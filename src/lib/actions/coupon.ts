'use server';

import { validateCoupon, type CouponValidation } from '@/lib/api/coupons';
import { getSessionToken } from '@/lib/auth/session';
import { ApiError } from '@/lib/api/client';

export interface ValidateCouponResult {
  success: boolean;
  message?: string;
  coupon?: CouponValidation;
}

/**
 * Runs server-side so the session's bearer token (needed for the API's
 * per-user one-time-usage check) can be attached — a Client Component has
 * no access to the httpOnly auth cookie to do this itself.
 */
export async function validateCouponAction(code: string, subtotal: number): Promise<ValidateCouponResult> {
  try {
    const token = await getSessionToken();
    const coupon = await validateCoupon(code, subtotal, token ?? undefined);
    return { success: true, coupon };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Invalid coupon.' };
  }
}
