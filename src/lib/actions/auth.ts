'use server';

import * as authApi from '@/lib/api/auth';
import type { ResetPasswordPayload } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export async function forgotPasswordAction(email: string): Promise<ActionResult> {
  try {
    await authApi.forgotPassword(email);
    return { success: true, message: 'If that email is registered, a reset link has been sent.' };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Something went wrong.' };
  }
}

export async function resetPasswordAction(payload: ResetPasswordPayload): Promise<ActionResult> {
  try {
    await authApi.resetPassword(payload);
    return { success: true, message: 'Your password has been reset. You can now log in.' };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not reset password.' };
  }
}

export async function resendVerificationAction(): Promise<ActionResult> {
  try {
    await authApi.resendVerificationEmail();
    return { success: true, message: 'A new verification email is on its way.' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof ApiError ? error.message : 'Could not resend the verification email.',
    };
  }
}
