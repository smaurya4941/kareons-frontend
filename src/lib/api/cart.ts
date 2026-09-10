import { authedFetch } from './server';
import type { AddToCartResponse, ApiResource, Cart, CartItem } from '@/types/api';

/** All cart routes require auth — there is no guest cart (see docs/API.md). */
export async function getCart(): Promise<Cart> {
  const { data } = await authedFetch<ApiResource<Cart>>('/cart', { cache: 'no-store' });
  return data;
}

/**
 * POST /cart returns only the affected line item + running cart_count, not
 * the full cart (see Api\V1\CartController@store) — callers that need the
 * updated totals/shipping should call getCart() again after this resolves.
 */
export async function addToCart(productId: number, quantity: number): Promise<AddToCartResponse> {
  return authedFetch<AddToCartResponse>('/cart', {
    method: 'POST',
    body: { product_id: productId, quantity },
  });
}

export async function updateCartItem(cartItemId: number, quantity: number): Promise<CartItem> {
  const { data } = await authedFetch<ApiResource<CartItem>>(`/cart/${cartItemId}`, {
    method: 'PUT',
    body: { quantity },
  });
  return data;
}

export async function removeCartItem(cartItemId: number): Promise<{ cart_count: number }> {
  return authedFetch<{ message: string; cart_count: number }>(`/cart/${cartItemId}`, {
    method: 'DELETE',
  });
}
