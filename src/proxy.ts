import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'kareons_token';

const PROTECTED_PREFIXES = ['/account', '/cart', '/checkout'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/checkout/:path*'],
};
