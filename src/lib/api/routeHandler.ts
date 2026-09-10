import { NextResponse } from 'next/server';
import { ApiError } from './client';

/**
 * Wraps a Next.js Route Handler body so an ApiError thrown by the Laravel
 * proxy call is translated into the same JSON error shape the Laravel API
 * itself returns, instead of becoming an unhandled 500.
 */
export async function withApiErrorHandling(handler: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message, errors: error.errors }, { status: error.status });
    }
    throw error;
  }
}
