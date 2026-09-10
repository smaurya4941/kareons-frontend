'use server';

import { revalidatePath } from 'next/cache';
import * as profileApi from '@/lib/api/profile';
import type { UpdateProfilePayload } from '@/lib/api/profile';
import { ApiError } from '@/lib/api/client';
import { clearSessionToken } from '@/lib/auth/session';
import type { ActionResult } from './cart';

export async function updateProfileAction(payload: UpdateProfilePayload): Promise<ActionResult> {
  try {
    await profileApi.updateProfile(payload);
    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not update profile.' };
  }
}

export async function updatePasswordAction(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<ActionResult> {
  try {
    await profileApi.updatePassword(payload);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not update password.' };
  }
}

export async function deleteAccountAction(password: string): Promise<ActionResult> {
  try {
    await profileApi.deleteAccount(password);
    await clearSessionToken();
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not delete account.' };
  }
}
