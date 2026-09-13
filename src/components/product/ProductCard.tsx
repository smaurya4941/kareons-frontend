import Link from 'next/link';
import Image from 'next/image';
import type { ProductCard as ProductCardType } from '@/types/api';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { StarRating } from '@/components/ui/StarRating';
import { WishlistButton } from './WishlistButton';
import { QuickAddButton } from './QuickAddButton';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: ProductCardType;
  isAuthenticated?: boolean;
  /** Explicit wishlist state — overrides `product.in_wishlist` (e.g. home page
   *  uses `wishlist_ids`, the wishlist page is always `true`). */
  inWishlist?: boolean;
  /** Tighter paddings for the shop grid. */
  compact?: boolean;
}

export function ProductCard({
  product,
  isAuthenticated = false,
  inWishlist,
  compact = false,
}: ProductCardProps) {
  const href = `/product/${product.slug}`;
  const saved = inWishlist ?? Boolean(product.in_wishlist);

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-border-card bg-surface-card shadow-botanical-sm transition-all duration-300 hover:border-brand-gold/40 hover:shadow-botanical-md',
      )}
    >
      {product.on_sale && (
        <div className="absolute left-3 top-3 z-10">
          <Badge variant="error" size="sm" className="font-bold tracking-wider">
            SALE
          </Badge>
        </div>
      )}

      <div className="absolute right-3 top-3 z-20">
        {isAuthenticated ? (
          <WishlistButton productId={product.id} initialInWishlist={saved} isAuthenticated />
        ) : (
          <Link
            href="/login"
            aria-label="Log in to save to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-forest/50 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-gold-dark"
          >
            <Icon name="favorite" size={20} />
          </Link>
        )}
      </div>

      <Link href={href} className="block aspect-square overflow-hidden bg-brand-cream/40">
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.name}
            width={480}
            height={480}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-cream/40 text-brand-sage">
            <Icon name="image" size={48} />
          </div>
        )}
      </Link>

      <div className={cn('flex flex-1 flex-col', compact ? 'p-3' : 'p-4')}>
        <span className="mb-1 text-[11px] font-medium uppercase tracking-wider text-brand-sage-dark">
          {product.category?.name ?? 'Ayurvedic'}
        </span>
        <Link
          href={href}
          className="mb-1.5 line-clamp-1 font-display text-base font-semibold leading-tight text-brand-forest transition-colors hover:text-brand-gold-dark"
        >
          {product.name}
        </Link>

        <div className="mb-2 flex h-5 items-center">
          <StarRating rating={product.rating_avg} count={product.reviews_count} />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border-card pt-3 transition-colors group-hover:border-brand-gold/30">
          <Price price={product.price} salePrice={product.sale_price} />
          <QuickAddButton
            productId={product.id}
            productName={product.name}
            isAuthenticated={isAuthenticated}
            inStock={product.in_stock}
          />
        </div>
      </div>
    </div>
  );
}
