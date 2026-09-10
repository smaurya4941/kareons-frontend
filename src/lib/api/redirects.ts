import { apiFetch, ApiError } from './client';
import type { ApiResource, RedirectLookup } from '@/types/api';

/**
 * Looks up a manually-seeded 301/302 for an old/changed URL (see
 * GET /api/v1/redirects/lookup and App\Models\Redirect in the Laravel repo).
 * Called from src/app/not-found.tsx before rendering a hard 404, so legacy
 * indexed links redirect instead of dying — this is the piece the Blade
 * storefront's own equivalent behaves like, ported for a headless frontend.
 */
export async function lookupRedirect(path: string): Promise<RedirectLookup | null> {
  try {
    const { data } = await apiFetch<ApiResource<RedirectLookup>>('/redirects/lookup', {
      searchParams: { path },
      cache: 'no-store',
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
