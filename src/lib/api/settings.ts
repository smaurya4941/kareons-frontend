import { apiFetch } from './client';
import type { ApiResource, Settings } from '@/types/api';

/**
 * Global site settings (name, contact, social, shipping, SEO defaults,
 * public Razorpay key). Changes rarely, but is read on nearly every request
 * (root layout, header, footer, every page's generateMetadata), so it is
 * cached with a short revalidation window instead of `no-store` — otherwise
 * every single page view is an uncached round-trip to the API. Purge on
 * demand from the admin via the `settings` tag when values change.
 */
export async function getSettings(): Promise<Settings> {
  const { data } = await apiFetch<ApiResource<Settings>>('/settings', {
    next: { revalidate: 300, tags: ['settings'] },
  });
  return data;
}
