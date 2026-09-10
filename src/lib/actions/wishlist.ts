'use server';

import { revalidatePath } from 'next/cache';
import * as wishlistApi from '@/lib/api/wishlist';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export interface ToggleWishlistResult extends ActionResult {
  status?: 'added' | 'removed';
  wishlistCount?: number;
}

export async function toggleWishlistAction(productId: number): Promise<ToggleWishlistResult> {
  try {
    const result = await wishlistApi.toggleWishlist(productId);
    revalidatePath('/account/wishlist');
    return { success: true, status: result.status, wishlistCount: result.wishlist_count };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not update wishlist.' };
  }
}

export async function removeFromWishlistAction(productId: number): Promise<ActionResult> {
  try {
    await wishlistApi.removeFromWishlist(productId);
    revalidatePath('/account/wishlist');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not remove item.' };
  }
}
