'use server';

import { revalidatePath } from 'next/cache';
import * as cartApi from '@/lib/api/cart';
import { ApiError } from '@/lib/api/client';

export interface ActionResult {
  success: boolean;
  message?: string;
}

export interface CartActionResult extends ActionResult {
  cartCount?: number;
}

export async function addToCartAction(productId: number, quantity: number): Promise<CartActionResult> {
  try {
    const result = await cartApi.addToCart(productId, quantity);
    revalidatePath('/cart');
    return { success: true, message: result.message, cartCount: result.cart_count };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not add to cart.' };
  }
}

export async function updateCartItemAction(cartItemId: number, quantity: number): Promise<CartActionResult> {
  try {
    await cartApi.updateCartItem(cartItemId, quantity);
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not update quantity.' };
  }
}

export async function removeCartItemAction(cartItemId: number): Promise<CartActionResult> {
  try {
    const result = await cartApi.removeCartItem(cartItemId);
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, cartCount: result.cart_count };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not remove item.' };
  }
}
