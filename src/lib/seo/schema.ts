import type { Blog, Product, Settings } from '@/types/api';
import { SITE_URL } from './metadata';

/**
 * JSON-LD builders ported from the Blade @push('schema') blocks in
 * resources/views/home.blade.php and resources/views/product/show.blade.php.
 * Each returns a plain object to be serialized by components/seo/JsonLd.tsx.
 */

export function organizationSchema(settings: Pick<Settings, 'site_name' | 'logo' | 'social'>) {
  const sameAs = Object.values(settings.social).filter((url): url is string => Boolean(url));

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_name,
    url: SITE_URL,
    logo: settings.logo ?? undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteSchema(settings: Pick<Settings, 'site_name'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.site_name,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function productSchema(product: Product) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    sku: product.sku,
    image: product.main_image ?? undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.effective_price,
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  if (product.reviews_count > 0 && product.rating_avg !== null) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating_avg,
      reviewCount: product.reviews_count,
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((review) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: review.rating },
      author: { '@type': 'Person', name: review.user?.name ?? 'Anonymous' },
      reviewBody: review.review,
    }));
  }

  return schema;
}

export function blogPostingSchema(blog: Blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt ?? undefined,
    image: blog.featured_image ?? undefined,
    datePublished: blog.published_at ?? undefined,
    author: blog.author ? { '@type': 'Person', name: blog.author.name } : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
  };
}
