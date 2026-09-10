import type { Metadata } from 'next';
import type { Settings } from '@/types/api';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export interface BuildMetadataParams {
  /** Page-specific title, without the site name suffix (added automatically). */
  title?: string | null;
  description?: string | null;
  /** Set false (or pass is_indexable: false from the API) to noindex this page. */
  isIndexable?: boolean;
  /** Path only, e.g. "/product/ashwagandha-capsules" — origin is added from NEXT_PUBLIC_SITE_URL. */
  canonicalPath: string;
  ogImage?: string | null;
  /**
   * Next.js's OpenGraph type validates this at runtime and only accepts a
   * handful of values ('website' | 'article' | ...) — passing 'product'
   * (valid per the raw OG protocol, but unsupported by Next) throws during
   * rendering and silently falls back to client-only rendering, defeating
   * SSR SEO entirely. Stick to 'website'/'article' here.
   */
  ogType?: 'website' | 'article';
  settings: Pick<Settings, 'site_name' | 'logo' | 'seo'>;
}

/**
 * Builds a Next.js Metadata object equivalent to the Blade
 * resources/views/components/seo.blade.php component — same title suffix,
 * description fallback, robots directives, OG/Twitter tags. Used from every
 * page's generateMetadata().
 */
export function buildMetadata({
  title,
  description,
  isIndexable = true,
  canonicalPath,
  ogImage,
  ogType = 'website',
  settings,
}: BuildMetadataParams): Metadata {
  const siteName = settings.site_name || 'Kare Ons Herbal';
  const finalTitle = title ? `${title} | ${siteName}` : `${siteName} - Ayurvedic Herbal Products`;
  const finalDescription =
    description || settings.seo.meta_description || 'Discover premium Ayurvedic herbal products at Kare Ons Herbal.';
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const finalOgImage = ogImage || settings.logo || `${SITE_URL}/logo.png`;

  return {
    // { absolute } bypasses the root layout's title.template — buildMetadata
    // already appends the site name suffix itself, so applying the parent
    // template on top would double it up (e.g. "X | Site | Site").
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: canonicalUrl },
    robots: isIndexable
      ? { index: true, follow: true, 'max-image-preview': 'large' as const }
      : { index: false, follow: false },
    openGraph: {
      type: ogType,
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName,
      images: [{ url: finalOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalOgImage],
    },
  };
}

export { SITE_URL };
