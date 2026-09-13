import type { ApiErrorBody } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set. Check .env.local.');
}

/**
 * Shared secret identifying this app as the trusted first-party frontend, so
 * the API doesn't rate-limit all of our server-side traffic as one abusive
 * IP. Server-only (never `NEXT_PUBLIC_`) — in the browser bundle this is
 * `undefined`, so the header is simply omitted and those requests fall under
 * the public per-IP limit, which is correct for a real user's browser.
 */
const FRONTEND_API_KEY = process.env.API_INTERNAL_KEY;

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.errors = body.errors;
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return (
      instance !== null &&
      typeof instance === 'object' &&
      'name' in instance &&
      (instance as Error).name === 'ApiError'
    );
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  /** JSON-serializable request body. */
  body?: unknown;
  /** Bearer token to attach, e.g. from the auth cookie. Server-side only. */
  token?: string;
  /** Next.js fetch cache/revalidation options. */
  next?: NextFetchRequestConfig;
  /** Query string params, appended and URL-encoded. */
  searchParams?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, searchParams?: ApiFetchOptions['searchParams']): string {
  const url = new URL(path.replace(/^\//, ''), `${API_BASE_URL}/`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
const READ_TIMEOUT_MS = 12000;
const MUTATION_TIMEOUT_MS = 30000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createCombinedSignal(callerSignal?: AbortSignal | null, timeoutMs = 15000): { signal: AbortSignal; cleanup: () => void } {
  if (typeof AbortSignal !== 'undefined' && 'any' in AbortSignal && typeof AbortSignal.any === 'function') {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const combined = callerSignal ? AbortSignal.any([callerSignal, timeoutSignal]) : timeoutSignal;
    return { signal: combined, cleanup: () => {} };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new Error(`Request timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  if (callerSignal) {
    if (callerSignal.aborted) {
      clearTimeout(timer);
      controller.abort(callerSignal.reason);
    } else {
      callerSignal.addEventListener('abort', () => {
        clearTimeout(timer);
        controller.abort(callerSignal.reason);
      }, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

/**
 * Thin fetch wrapper for the Laravel API. All request/response shape
 * assumptions (JSON body, `{ data: ... }` envelope, error shape) live here
 * so every resource module in lib/api/* stays a one-liner.
 *
 * Transient upstream failures (429 from the API rate limiter, 502/503/504
 * while PHP-FPM restarts) are retried with a short backoff before the error
 * is surfaced — every SSR request originates from a handful of Vercel egress
 * IPs, so a traffic spike can rate-limit the whole site at once otherwise.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, next, searchParams, headers, signal: callerSignal, ...rest } = options;
  const url = buildUrl(path, searchParams);

  // Only replay safe (non-mutating) requests — a retried POST could double it.
  const method = (rest.method ?? 'GET').toUpperCase();
  const retryable = method === 'GET' || method === 'HEAD';
  const maxAttempts = retryable ? MAX_ATTEMPTS : 1;
  const timeoutMs = retryable ? READ_TIMEOUT_MS : MUTATION_TIMEOUT_MS;

  let response!: Response;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { signal, cleanup } = createCombinedSignal(callerSignal, timeoutMs);

    try {
      response = await fetch(url, {
        ...rest,
        signal,
        headers: {
          Accept: 'application/json',
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(FRONTEND_API_KEY ? { 'X-Frontend-Key': FRONTEND_API_KEY } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        next,
      });
    } finally {
      cleanup();
    }

    if (!RETRY_STATUSES.has(response.status) || attempt === maxAttempts) break;
    await sleep(attempt * 400 + Math.random() * 200);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({ message: 'Invalid server response.' }));

  if (!response.ok) {
    throw new ApiError(response.status, payload as ApiErrorBody);
  }

  return payload as T;
}
