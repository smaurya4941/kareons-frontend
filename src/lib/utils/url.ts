/**
 * Validates that a redirect path is a safe, internal same-origin relative path.
 * Strictly prevents Open Redirect attacks (e.g. `//evil.com`, `https://evil.com`, `javascript:`, `\evil.com`).
 */
export function getSafeInternalRedirect(url?: string | null, fallback = '/account'): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Must begin with single forward slash and not a protocol, double slash, or backslash
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.includes('\\') &&
    !trimmed.includes('\0') &&
    !/^\/[a-zA-Z0-9]+:/.test(trimmed)
  ) {
    return trimmed;
  }

  return fallback;
}
