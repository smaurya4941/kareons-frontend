import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/api/auth';
import { setSessionToken } from '@/lib/auth/session';
import { withApiErrorHandling } from '@/lib/api/routeHandler';

/**
 * Proxies to POST /api/v1/auth/login and stores the returned bearer token in
 * an httpOnly cookie — the token itself never reaches client JS. See
 * src/lib/auth/session.ts for why.
 */
export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const body = await request.json();
    const { user, token } = await login(body);
    await setSessionToken(token);
    return NextResponse.json({ data: { user } });
  });
}
