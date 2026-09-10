import { authedFetch, optionalAuthedFetch } from './server';
import type { ApiCollection, ProductCard } from '@/types/api';

export interface WishlistEntry {
  id: number;
  product: ProductCard;
  created_at: string;
}

/**
 * Pass `{ optional: true }` when reading the wishlist on a page that also
 * renders for guests (the header count): a missing/expired session returns
 * an empty list instead of redirecting the whole page to /login.
 */
export async function getWishlist(opts?: { optional?: boolean }): Promise<WishlistEntry[]> {
  if (opts?.optional) {
    const res = await optionalAuthedFetch<ApiCollection<WishlistEntry>>('/wishlist', { cache: 'no-store' });
    return res?.data ?? [];
  }
  const { data } = await authedFetch<ApiCollection<WishlistEntry>>('/wishlist', { cache: 'no-store' });
  return data;
}

export async function toggleWishlist(
  productId: number,
): Promise<{ status: 'added' | 'removed'; wishlist_count: number }> {
  return authedFetch(`/wishlist/${productId}`, { method: 'POST' });
}

export async function removeFromWishlist(productId: number): Promise<void> {
  await authedFetch(`/wishlist/${productId}`, { method: 'DELETE' });
}
