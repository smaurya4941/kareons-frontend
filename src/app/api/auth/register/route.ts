import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/api/auth';
import { setSessionToken } from '@/lib/auth/session';
import { withApiErrorHandling } from '@/lib/api/routeHandler';

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const body = await request.json();
    const { user, token } = await register(body);
    await setSessionToken(token);
    return NextResponse.json({ data: { user } }, { status: 201 });
  });
}
