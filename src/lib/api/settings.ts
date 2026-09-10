import { apiFetch } from './client';
import type { ApiResource, Settings } from '@/types/api';

/**
 * Global site settings (name, contact, social, shipping, SEO defaults,
 * public Razorpay key). Changes rarely — cached for an hour, matching the
 * API's own home-page cache window.
 */
export async function getSettings(): Promise<Settings> {
  const { data } = await apiFetch<ApiResource<Settings>>('/settings', {
    cache: 'no-store',
  });
  return data;
}
