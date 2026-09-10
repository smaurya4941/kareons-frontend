import { apiFetch } from './client';
import type { ApiCollection, ApiResource, Category } from '@/types/api';

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiFetch<ApiCollection<Category>>('/categories', {
    next: { revalidate: 3600, tags: ['categories'] },
  });
  return data;
}

export async function getCategory(slug: string): Promise<Category> {
  const { data } = await apiFetch<ApiResource<Category>>(`/categories/${slug}`, {
    next: { revalidate: 3600, tags: ['categories', `category:${slug}`] },
  });
  return data;
}
