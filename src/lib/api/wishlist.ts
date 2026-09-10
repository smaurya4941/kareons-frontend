import { authedFetch } from './server';
import type { ApiCollection, ProductCard } from '@/types/api';

export interface WishlistEntry {
  id: number;
  product: ProductCard;
  created_at: string;
}

export async function getWishlist(): Promise<WishlistEntry[]> {
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
