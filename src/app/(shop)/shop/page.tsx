import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, type ProductSort } from '@/lib/api/products';
import { getSettings } from '@/lib/api/settings';
import { getSessionToken } from '@/lib/auth/session';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/seo/metadata';
import { ApiError } from '@/lib/api/client';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ProductCard } from '@/components/product/ProductCard';
import { ShopFilters, SortSelect } from '@/components/product/ShopFilters';
import { Pagination } from '@/components/ui/Pagination';

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    sort?: ProductSort;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const settings = await getSettings();

  return buildMetadata({
    title: params.search ? `Search results for "${params.search}"` : 'Shop Herbal Products',
    description: 'Shop natural Ayurvedic formulations for complete healthcare support.',
    canonicalPath: '/shop',
    isIndexable: Object.keys(params).length === 0,
    settings,
  });
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = await getSessionToken();
  const page = params.page ? Number(params.page) : 1;

  let products: Awaited<ReturnType<typeof getProducts>>['data'] = [];
  let meta: Awaited<ReturnType<typeof getProducts>>['meta'];
  let filterError: string | null = null;

  try {
    const result = await getProducts(
      {
        search: params.search,
        category: params.category,
        brand: params.brand,
        min_price: params.min_price ? Number(params.min_price) : undefined,
        max_price: params.max_price ? Number(params.max_price) : undefined,
        sort: params.sort,
        page,
      },
      token ?? undefined,
    );
    products = result.data;
    meta = result.meta;
  } catch (error) {
    // e.g. min_price > max_price, or a price above the API's 100000 cap → 422.
    if (error instanceof ApiError && error.status === 422) {
      filterError = 'Those filters aren’t valid. Try a different price range.';
    } else {
      throw error;
    }
  }

  const categories =
    (meta?.categories as { id: number; name: string; slug: string }[] | undefined) ?? [];
  const activeCategory = categories.find((c) => c.slug === params.category);

  const heading = params.search
    ? `Search results for "${params.search}"`
    : activeCategory
      ? activeCategory.name
      : 'Shop All Products';
  const intro = params.search
    ? 'Explore our Ayurvedic formulations matching your search query.'
    : activeCategory
      ? `Discover pure, potent Ayurvedic remedies crafted for ${activeCategory.name.toLowerCase()}.`
      : 'Natural Ayurvedic formulations for complete healthcare support. Crafted with traditional wisdom and modern precision.';

  const from = meta?.from ?? 0;
  const to = meta?.to ?? 0;
  const total = meta?.total ?? products.length;

  function removeFilterParam(keys: string | string[]) {
    const next = new URLSearchParams();
    const keySet = new Set(Array.isArray(keys) ? keys : [keys]);
    for (const [k, v] of Object.entries(params)) {
      if (v && !keySet.has(k) && k !== 'page') {
        next.set(k, v);
      }
    }
    const qs = next.toString();
    return qs ? `/shop?${qs}` : '/shop';
  }

  return (
    <Container className="py-6 md:py-8">
      <JsonLd
        schema={[
          breadcrumbSchema(
            activeCategory
              ? [
                  { name: 'Home', path: '/' },
                  { name: 'Shop', path: '/shop' },
                  { name: activeCategory.name, path: `/shop?category=${activeCategory.slug}` },
                ]
              : [
                  { name: 'Home', path: '/' },
                  { name: 'Shop', path: '/shop' },
                ],
          ),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            url: `${SITE_URL}/shop`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${SITE_URL}/product/${p.slug}`,
                name: p.name,
              })),
            },
          },
        ]}
      />

      <Breadcrumbs
        items={
          activeCategory
            ? [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: activeCategory.name }]
            : [{ label: 'Home', href: '/' }, { label: 'Shop' }]
        }
      />

      <div className="mb-6">
        <h1 className="mb-2 font-display text-display-lg-mobile text-brand-forest md:text-display-lg">{heading}</h1>
        <p className="max-w-2xl text-body-md text-on-surface-variant">{intro}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ShopFilters categories={categories} activeParams={params} />

        <div className="w-full flex-1">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-on-surface-variant">
              Showing <span className="font-semibold text-on-surface">{from}-{to}</span> of <span className="font-semibold text-on-surface">{total}</span> formulations
            </span>
            <SortSelect activeParams={params} />
          </div>

          {/* Active Filter Chips */}
          {(params.search || params.category || params.min_price || params.max_price) && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                Active:
              </span>
              {params.search && (
                <Link
                  href={removeFilterParam('search')}
                  className="inline-flex items-center gap-1 rounded-full border border-border-card bg-surface-card px-3 py-1 text-xs font-medium text-on-surface shadow-botanical-sm hover:border-error/40 transition-colors"
                >
                  <span>Search: &ldquo;{params.search}&rdquo;</span>
                  <Icon name="close" size={14} className="text-on-surface-variant" />
                </Link>
              )}
              {activeCategory && (
                <Link
                  href={removeFilterParam('category')}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-gold-dark shadow-botanical-sm hover:border-error/40 transition-colors"
                >
                  <span>{activeCategory.name}</span>
                  <Icon name="close" size={14} />
                </Link>
              )}
              {(params.min_price || params.max_price) && (
                <Link
                  href={removeFilterParam(['min_price', 'max_price'])}
                  className="inline-flex items-center gap-1 rounded-full border border-border-card bg-surface-card px-3 py-1 text-xs font-medium text-on-surface shadow-botanical-sm hover:border-error/40 transition-colors"
                >
                  <span>₹{params.min_price || '0'} – ₹{params.max_price || '∞'}</span>
                  <Icon name="close" size={14} className="text-on-surface-variant" />
                </Link>
              )}
              <Link
                href="/shop"
                className="text-xs font-semibold text-error hover:underline ml-1"
              >
                Clear all
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <EmptyState
              icon="inventory_2"
              title={filterError ? 'Invalid filters' : 'No products found'}
              description={
                filterError ??
                "We couldn't find any products matching your current filters. Try adjusting your search criteria."
              }
              action={{ label: 'Clear all filters', href: '/shop' }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} isAuthenticated={Boolean(token)} compact />
              ))}
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              searchParams={params as Record<string, string | undefined>}
              basePath="/shop"
            />
          )}
        </div>
      </div>
    </Container>
  );
}
