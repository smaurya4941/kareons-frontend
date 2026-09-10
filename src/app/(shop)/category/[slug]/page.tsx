import type { Metadata } from 'next';
import { getCategory } from '@/lib/api/categories';
import { getProducts, type ProductSort } from '@/lib/api/products';
import { getSettings } from '@/lib/api/settings';
import { getSessionToken } from '@/lib/auth/session';
import { ApiError } from '@/lib/api/client';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { redirectOrNotFound } from '@/lib/seo/redirectOrNotFound';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCard } from '@/components/product/ProductCard';
import { SortSelect } from '@/components/product/ShopFilters';
import { Pagination } from '@/components/ui/Pagination';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: ProductSort; page?: string }>;
}

async function loadCategory(slug: string) {
  try {
    return await getCategory(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      await redirectOrNotFound(`category/${slug}`);
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [category, settings] = await Promise.all([loadCategory(slug), getSettings()]);

  return buildMetadata({
    title: category.seo_title || category.name,
    description: category.seo_description || category.description,
    isIndexable: category.is_indexable,
    canonicalPath: `/category/${category.slug}`,
    ogImage: category.banner_image || category.image,
    settings,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const token = await getSessionToken();
  const page = sp.page ? Number(sp.page) : 1;

  const [category, { data: products, meta }] = await Promise.all([
    loadCategory(slug),
    getProducts({ category: slug, sort: sp.sort, page }, token ?? undefined),
  ]);

  const banner = category.banner_image || category.image;
  const total = meta?.total ?? products.length;

  return (
    <div>
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />

      <section className="relative overflow-hidden bg-brand-forest text-brand-cream">
        {banner && (
          <>
            <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-forest to-brand-forest/40" />
          </>
        )}
        <Container className="relative py-12 md:py-16">
          <Breadcrumbs
            className="text-brand-cream/70"
            items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: category.name }]}
          />
          <h1 className="font-display text-display-lg-mobile md:text-display-lg">{category.name}</h1>
          {category.description && (
            <p className="mt-2 max-w-2xl text-body-md text-brand-cream/85">{category.description}</p>
          )}
        </Container>
      </section>

      <Container className="py-8">
        <div className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-soft-border pb-3 sm:flex-row sm:items-center">
          <span className="text-sm text-on-surface-variant">
            {total} {total === 1 ? 'product' : 'products'}
          </span>
          <SortSelect activeParams={sp as Record<string, string | undefined>} />
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title="No products in this category yet"
            description="Please check back soon — our herbalists are curating this range."
            action={{ label: 'Browse all products', href: '/shop' }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isAuthenticated={Boolean(token)} compact />
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            searchParams={sp as Record<string, string | undefined>}
            basePath={`/category/${slug}`}
          />
        )}
      </Container>
    </div>
  );
}
