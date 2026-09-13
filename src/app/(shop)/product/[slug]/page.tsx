import type { Metadata } from 'next';
import Link from 'next/link';
import { getProduct } from '@/lib/api/products';
import { getSettings } from '@/lib/api/settings';
import { getSessionToken } from '@/lib/auth/session';
import { ApiError } from '@/lib/api/client';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, productSchema } from '@/lib/seo/schema';
import { redirectOrNotFound } from '@/lib/seo/redirectOrNotFound';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { WishlistButton } from '@/components/product/WishlistButton';
import { ProductSpecTabs } from '@/components/product/ProductSpecTabs';
import { ReviewList } from '@/components/product/ReviewList';
import { StickyAddToCart } from '@/components/product/StickyAddToCart';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { formatMoney, discountPercent } from '@/lib/utils/format';

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string) {
  const token = await getSessionToken();
  try {
    return await getProduct(slug, token ?? undefined);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      await redirectOrNotFound(`product/${slug}`);
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [{ product }, settings] = await Promise.all([loadProduct(slug), getSettings()]);

  return buildMetadata({
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_description,
    isIndexable: product.is_indexable,
    canonicalPath: `/product/${product.slug}`,
    ogImage: product.main_image,
    settings,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [{ product, relatedProducts }, token, settings] = await Promise.all([
    loadProduct(slug),
    getSessionToken(),
    getSettings(),
  ]);
  const authed = Boolean(token);

  const onSale = product.on_sale;
  const percent = discountPercent(product.price, product.sale_price);

  return (
    <Container className="max-w-7xl py-6 md:py-8">
      <JsonLd
        schema={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
            ...(product.category ? [{ name: product.category.name, path: `/category/${product.category.slug}` }] : []),
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          ...(product.category
            ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
            : [{ label: 'Shop', href: '/shop' }]),
          { label: product.name },
        ]}
      />

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <ProductGallery
            mainImage={product.main_image}
            images={(product.images ?? []).map((i) => ({ id: i.id, url: i.url }))}
            name={product.name}
            onSale={onSale}
          />
        </div>

        <div className="flex flex-col justify-start py-2 md:col-span-7">
          <div className="mb-3 flex gap-2">
            <Badge variant="gold" size="sm">
              Ayurvedic
            </Badge>
            <Badge variant="brand" size="sm">
              GMP Certified
            </Badge>
          </div>

          <h1 className="mb-2 font-display text-2xl font-bold leading-tight text-on-surface">{product.name}</h1>

          <div className="mb-4 flex flex-col gap-1">
            <StarRating rating={product.rating_avg ?? 0} count={product.reviews_count} size={16} />
            <div className="mt-1 space-x-2 text-xs font-medium text-on-surface-variant">
              <span>SKU: {product.sku}</span>
              {product.brand && (
                <>
                  <span className="text-outline">|</span>
                  <span>
                    Brand: <span className="font-bold text-on-surface">{product.brand.name}</span>
                  </span>
                </>
              )}
              {product.pack_size && (
                <span>
                  | Pack Size: <span className="font-bold text-on-surface">{product.pack_size}</span>
                </span>
              )}
            </div>
          </div>

          {product.short_description && (
            <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
              {product.short_description}
            </p>
          )}

          <div className="mb-6 flex items-end gap-3">
            <span className="font-display text-2xl font-bold text-on-surface">
              ₹{formatMoney(product.effective_price)}
            </span>
            {onSale && (
              <>
                <span className="mb-0.5 text-lg font-medium text-on-surface-variant line-through">
                  ₹{formatMoney(product.price)}
                </span>
                {percent !== null && (
                  <span className="mb-1 rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-bold text-error">
                    {percent}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          <div id="main-buy-box" className="mb-5 rounded-2xl border border-border-card bg-surface-card p-5 shadow-botanical-sm md:p-6">
            <div className="mb-4">
              {product.stock_quantity > 10 ? (
                <Badge variant="success" size="sm">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />
                  In Stock &amp; Ready to Ship
                </Badge>
              ) : product.stock_quantity > 0 ? (
                <Badge variant="warning" size="sm">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-warning" />
                  Limited Stock (Only {product.stock_quantity} left)
                </Badge>
              ) : (
                <Badge variant="error" size="sm">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-error" />
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex-1">
                <AddToCartButton
                  productId={product.id}
                  inStock={product.in_stock}
                  stockQuantity={product.stock_quantity}
                  isAuthenticated={authed}
                />
              </div>
              <WishlistButton
                productId={product.id}
                initialInWishlist={Boolean(product.in_wishlist)}
                isAuthenticated={authed}
                variant="button"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border-card pt-5">
            <TrustBadge
              icon="local_shipping"
              label={
                settings.free_shipping_amount > 0
                  ? `Free shipping over ₹${settings.free_shipping_amount}`
                  : 'Fast Delivery'
              }
              size="sm"
            />
            <TrustBadge icon="verified" label="100% Authentic Formulation" size="sm" />
            <TrustBadge icon="eco" label="Direct From Apothecary" size="sm" />
          </div>
        </div>
      </section>

      <ProductSpecTabs product={product} />

      <ReviewList
        reviews={product.reviews ?? []}
        ratingAvg={product.rating_avg}
        reviewsCount={product.reviews_count}
        productId={product.id}
        productSlug={product.slug}
        isAuthenticated={authed}
      />

      <StickyAddToCart
        productId={product.id}
        productName={product.name}
        price={product.effective_price}
        inStock={product.in_stock}
        isAuthenticated={authed}
      />

      {relatedProducts.length > 0 && (
        <section className="border-t border-soft-border pt-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-on-surface">Complementary Care</h2>
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="flex items-center gap-1 font-medium text-brand-gold-dark transition-colors hover:underline"
              >
                View All <Icon name="arrow_forward" size={18} />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} isAuthenticated={authed} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
