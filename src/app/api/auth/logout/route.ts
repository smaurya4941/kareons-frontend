import { NextResponse } from 'next/server';
import { logout } from '@/lib/api/auth';
import { clearSessionToken, isAuthenticated } from '@/lib/auth/session';
import { withApiErrorHandling } from '@/lib/api/routeHandler';

export async function POST() {
  return withApiErrorHandling(async () => {
    if (await isAuthenticated()) {
      // Best-effort: revoke the token server-side, but always clear the
      // cookie even if Laravel is unreachable or the token was already
      // revoked — the user must not get stuck "logged in" locally.
      try {
        await logout();
      } catch {
        // ignore — cookie clear below still logs the user out locally
      }
    }
    await clearSessionToken();
    return NextResponse.json({ message: 'Logged out.' });
  });
}
