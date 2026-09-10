import { authedFetch } from './server';

export interface ReviewPayload {
  rating: number;
  title?: string;
  comment: string;
}

/** New reviews are always created pending moderation — not shown until an admin approves them. */
export async function submitReview(productId: number, payload: ReviewPayload): Promise<{ message: string }> {
  return authedFetch(`/products/${productId}/reviews`, { method: 'POST', body: payload });
}
