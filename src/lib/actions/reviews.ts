'use server';

import { revalidatePath } from 'next/cache';
import * as reviewsApi from '@/lib/api/reviews';
import type { ReviewPayload } from '@/lib/api/reviews';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export async function submitReviewAction(
  productId: number,
  productSlug: string,
  payload: ReviewPayload,
): Promise<ActionResult> {
  try {
    const result = await reviewsApi.submitReview(productId, payload);
    revalidatePath(`/product/${productSlug}`);
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not submit review.' };
  }
}
