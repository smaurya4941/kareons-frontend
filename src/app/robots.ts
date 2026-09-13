import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

/** Mirrors the Disallow list served by Laravel's routes/web.php robots.txt closure. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/account',
        '/cart',
        '/checkout',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/email-verified',
        '/api',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
