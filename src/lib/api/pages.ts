import { apiFetch } from './client';
import type { ApiCollection, ApiResource, Page } from '@/types/api';

export interface PageLink {
  id: number;
  title: string;
  slug: string;
}

/** Lightweight list of published CMS pages — used for the footer's Company column. */
export async function getPages(): Promise<PageLink[]> {
  const { data } = await apiFetch<ApiCollection<PageLink>>('/pages', {
    next: { revalidate: 3600, tags: ['pages'] },
  });
  return data;
}

/** CMS pages: privacy, terms, faq, about, etc. */
export async function getPage(slug: string): Promise<Page> {
  const { data } = await apiFetch<ApiResource<Page>>(`/pages/${slug}`, {
    next: { revalidate: 3600, tags: ['pages', `page:${slug}`] },
  });
  return data;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  await apiFetch('/contact', { method: 'POST', body: payload });
}
