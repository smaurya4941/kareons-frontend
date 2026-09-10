import { apiFetch } from './client';
import type { ApiCollection, Blog, BlogShowResponse } from '@/types/api';

export async function getBlogPosts(page = 1, category?: string) {
  return apiFetch<ApiCollection<Blog>>('/blog', {
    searchParams: { page, category },
    next: { revalidate: 3600, tags: ['blog'] },
  });
}

export interface BlogWithRelated {
  blog: Blog;
  relatedBlogs: Blog[];
}

export async function getBlogPost(slug: string): Promise<BlogWithRelated> {
  const { data } = await apiFetch<BlogShowResponse>(`/blog/${slug}`, {
    next: { revalidate: 3600, tags: ['blog', `blog:${slug}`] },
  });
  return { blog: data.blog, relatedBlogs: data.related_blogs };
}
