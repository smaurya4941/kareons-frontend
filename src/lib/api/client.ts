import type { ApiErrorBody } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set. Check .env.local.');
}

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

/**
 * Thin fetch wrapper for the Laravel API. All request/response shape
 * assumptions (JSON body, `{ data: ... }` envelope, error shape) live here
 * so every resource module in lib/api/* stays a one-liner.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, next, searchParams, headers, ...rest } = options;

  const response = await fetch(buildUrl(path, searchParams), {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    next,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({ message: 'Invalid server response.' }));

  if (!response.ok) {
    throw new ApiError(response.status, payload as ApiErrorBody);
  }

  return payload as T;
}
