import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'kareons_token';

/** Routes that must never render for a logged-out visitor. */
const PROTECTED_PREFIXES = ['/account', '/cart', '/checkout'];

/**
 * Edge guard against automated vulnerability scanners.
 *
 * Bots spray every site on the internet with requests for known PHP/CMS
 * backdoor paths (`/hiroshi.php`, `/xmlrpc.php`, `/wp-login.php`, `/.env`, …).
 * This app is a headless Next.js frontend — none of those paths can ever be
 * legitimate. Left alone, each one falls through to `app/[...rest]/page.tsx`,
 * which calls the Laravel API's `redirects/lookup`; a burst of scanner hits
 * then trips the API's rate limiter and the *real* pages start returning 500.
 *
 * Answering here with a bare 404 costs one cheap regex test and makes zero
 * API calls, so a scan can no longer take the storefront down. Genuinely
 * unknown URLs (no suspicious extension/prefix) still reach the catch-all
 * and its redirect lookup as before.
 */

// Suspicious file extensions on the final path segment.
const BLOCKED_EXTENSION =
  /\.(php\d?|phtml|phar|asp|aspx|jsp|jspx|cgi|pl|py|rb|sh|bak|old|orig|swp|sql|sqlite|db|env|ini|conf|cfg|log|htaccess|htpasswd|git|svn|DS_Store)$/i;

// Suspicious path prefixes — CMS internals, admin panels, VCS/config dirs.
const BLOCKED_PREFIX =
  /^\/(wp[-/]|wordpress\b|xmlrpc\b|cgi-bin\b|vendor\b|node_modules\b|phpmyadmin\b|pma\b|mysql\b|adminer\b|administrator\b|typo3\b|autodiscover\b|\.git\b|\.svn\b|\.env\b|\.aws\b|\.vscode\b|\.idea\b)/i;

// Numbered sitemap probes (`/sitemap597.xml`) — the real one is `/sitemap.xml`.
const BLOCKED_SITEMAP = /^\/sitemap[\w-]*\d[\w-]*\.xml$/i;

function isJunkRequest(pathname: string): boolean {
  return (
    BLOCKED_EXTENSION.test(pathname) ||
    BLOCKED_PREFIX.test(pathname) ||
    BLOCKED_SITEMAP.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Slam the door on scanner traffic before it can touch the API.
  if (isJunkRequest(pathname)) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'content-type': 'text/plain', 'x-robots-tag': 'noindex' },
    });
  }

  // 2. Bounce logged-out visitors away from account/cart/checkout without
  //    rendering the page. This is a cookie-presence check only — the pages
  //    still verify the token with the API (an expired token 401s and the
  //    server redirects to /login from there).
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (isProtected && !request.cookies.get(COOKIE_NAME)?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and the metadata files that must
  // always resolve. The negative lookahead still lets `/*.php` through to the
  // proxy body (where it gets the 404) — it only exempts the listed paths.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
