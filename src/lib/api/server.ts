import 'server-only';
import { redirect } from 'next/navigation';
import { getSessionToken } from '@/lib/auth/session';
import { apiFetch, ApiError, type ApiFetchOptions } from './client';

/**
 * Like apiFetch, but automatically attaches the current user's bearer token
 * from the httpOnly session cookie. Use this in Server Components and Route
 * Handlers for any authenticated endpoint (cart, wishlist, orders,
 * addresses, checkout, profile). Never call this from a Client Component.
 *
 * If the token is missing or the API rejects it (401), the caller is sent to
 * the login page instead of the request throwing and rendering a 500 — an
 * expired Sanctum token should log the user out, not break the page.
 */
export async function authedFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = await getSessionToken();
  if (!token) redirect('/login');

  try {
    return await apiFetch<T>(path, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/login');
    throw error;
  }
}

/**
 * Like authedFetch, but for non-critical data on pages that also render for
 * guests (e.g. the header cart/wishlist counts in the root layout). A missing
 * or rejected token yields `null` instead of redirecting the whole site to
 * /login — the page still renders, just without the personalised data.
 */
export async function optionalAuthedFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await apiFetch<T>(path, { ...options, token });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null;
    throw error;
  }
}
