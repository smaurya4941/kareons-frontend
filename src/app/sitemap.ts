import type { MetadataRoute } from 'next';
import { getCategories } from '@/lib/api/categories';
import { getProducts } from '@/lib/api/products';
import { getBlogPosts } from '@/lib/api/blog';
import { getPages } from '@/lib/api/pages';
import { SITE_URL } from '@/lib/seo/metadata';

// Generated on-demand (needs the live API); never prerendered at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

/**
 * Next-native equivalent of app/Http/Controllers/Web/SitemapController.php.
 * Only indexable content is listed — matching the Laravel API's
 * `indexable()` scopes (status + is_indexable) enforced server-side.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.6 },
  ];

  const categories = await getCategories().catch(() => []);
  for (const category of categories) {
    if (!category.is_indexable) continue;
    entries.push({ url: `${SITE_URL}/category/${category.slug}`, changeFrequency: 'weekly', priority: 0.7 });
    for (const child of category.children ?? []) {
      if (!child.is_indexable) continue;
      entries.push({ url: `${SITE_URL}/category/${child.slug}`, changeFrequency: 'weekly', priority: 0.7 });
    }
  }

  // Walk every product page (48/page cap matches the API's max per_page).
  let page = 1;
  for (;;) {
    const { data: products, meta } = await getProducts({ page, per_page: 48 }).catch(() => ({
      data: [],
      meta: undefined,
    }));
    for (const product of products) {
      if (!product.is_indexable) continue;
      entries.push({ url: `${SITE_URL}/product/${product.slug}`, changeFrequency: 'weekly', priority: 0.8 });
    }
    if (!meta || page >= meta.last_page) break;
    page += 1;
  }

  let blogPage = 1;
  for (;;) {
    const { data: posts, meta } = await getBlogPosts(blogPage).catch(() => ({ data: [], meta: undefined }));
    for (const post of posts) {
      if (!post.is_indexable) continue;
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.published_at ?? undefined,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
    if (!meta || blogPage >= meta.last_page) break;
    blogPage += 1;
  }

  // CMS pages (privacy / terms / faq / …). GET /pages only lists published
  // pages; per-page `is_indexable` is enforced when the page itself renders.
  const pages = await getPages().catch(() => []);
  for (const cmsPage of pages) {
    entries.push({ url: `${SITE_URL}/${cmsPage.slug}`, changeFrequency: 'monthly', priority: 0.4 });
  }

  return entries;
}
