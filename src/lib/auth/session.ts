import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'kareons_token';

/**
 * The bearer token issued by Laravel Sanctum (POST /auth/login|register)
 * lives only in an httpOnly cookie — it is never sent to client JS, which
 * mitigates XSS token theft. Server Components and Route Handlers read it
 * via this module; Client Components must go through a Route Handler
 * (src/app/api/**) for anything that needs the token.
 */

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionToken()) !== null;
}

/** Call only from a Route Handler or Server Action. */
export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Matches Laravel's SANCTUM_TOKEN_EXPIRATION default (30 days). There is
    // no refresh-token flow — once this expires the user must log in again.
    maxAge: 60 * 60 * 24 * 30,
  });
}

/** Call only from a Route Handler or Server Action. */
export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
