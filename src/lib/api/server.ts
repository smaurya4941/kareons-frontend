import 'server-only';
import { getSessionToken } from '@/lib/auth/session';
import { apiFetch, type ApiFetchOptions } from './client';

/**
 * Like apiFetch, but automatically attaches the current user's bearer token
 * from the httpOnly session cookie. Use this in Server Components and Route
 * Handlers for any authenticated endpoint (cart, wishlist, orders,
 * addresses, checkout, profile). Never call this from a Client Component.
 */
export async function authedFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = await getSessionToken();
  return apiFetch<T>(path, { ...options, token: token ?? undefined });
}
