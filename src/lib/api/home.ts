import { apiFetch } from './client';
import type { ApiResource, HomeData } from '@/types/api';

export async function getHomeData(token?: string): Promise<HomeData> {
  const { data } = await apiFetch<ApiResource<HomeData>>('/home', {
    token,
    // /home is optionally personalized (wishlist_ids differ per user when a
    // token is sent), so only the anonymous response is safe to cache and
    // share across visitors via ISR — an authenticated request must always
    // be fresh, or one user's wishlist could leak into another's cached page.
    ...(token
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 3600, tags: ['home'] } }),
  });
  return data;
}
