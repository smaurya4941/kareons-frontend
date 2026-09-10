import { apiFetch } from './client';
import type { ApiResource } from '@/types/api';

export interface CouponValidation {
  code: string;
  type: 'percentage' | 'flat';
  discount: number;
}

/**
 * Optionally authenticated — pass a token to also enforce the one-time-
 * per-user usage check. Rate-limited to 10/min per IP (see docs/API.md).
 */
export async function validateCoupon(
  code: string,
  subtotal: number,
  token?: string,
): Promise<CouponValidation> {
  const { data } = await apiFetch<ApiResource<CouponValidation>>('/coupons/validate', {
    method: 'POST',
    body: { code, subtotal },
    token,
    cache: 'no-store',
  });
  return data;
}
