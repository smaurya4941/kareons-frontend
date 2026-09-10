'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { removeFromWishlistAction } from '@/lib/actions/wishlist';
import { useToast } from '@/components/ui/Toast';
import { useCounts } from '@/components/layout/CountsProvider';
import { Icon } from '@/components/ui/Icon';
import { Price } from '@/components/ui/Price';
import { StarRating } from '@/components/ui/StarRating';
import { QuickAddButton } from '@/components/product/QuickAddButton';
import type { ProductCard } from '@/types/api';

interface Entry {
  id: number;
  product: ProductCard;
}

export function WishlistGrid({ entries }: { entries: Entry[] }) {
  const [items, setItems] = useState(entries);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { setWishlist } = useCounts();

  function remove(productId: number) {
    setPendingId(productId);
    startTransition(async () => {
      const result = await removeFromWishlistAction(productId);
      setPendingId(null);
      if (result.success) {
        setItems((list) => list.filter((e) => e.product.id !== productId));
        setWishlist(Math.max(0, items.length - 1));
        toast('Removed from your wishlist.', 'info');
      } else {
        toast(result.message ?? 'Could not remove item.', 'error');
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-soft-border bg-white px-6 py-14 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-herbal-light">
          <Icon name="favorite" size={32} className="text-brand-gold-dark" />
        </div>
        <h3 className="text-xl font-bold text-on-surface">Your wishlist is empty</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
          Save items you love and review them later.
        </p>
        <Link href="/shop" className="btn-primary mt-6">
          <Icon name="storefront" size={18} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map(({ id, product }) => (
        <div
          key={id}
          className="group flex flex-col overflow-hidden rounded-xl border border-soft-border bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
            <Link href={`/product/${product.slug}`}>
              {product.main_image ? (
                <Image
                  src={product.main_image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 90vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Icon name="image" size={36} className="text-outline" />
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => remove(product.id)}
              disabled={isPending && pendingId === product.id}
              title="Remove from wishlist"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-error shadow-sm backdrop-blur-sm transition-colors hover:bg-error hover:text-white disabled:opacity-50"
            >
              <Icon
                name={isPending && pendingId === product.id ? 'progress_activity' : 'delete'}
                size={20}
                className={isPending && pendingId === product.id ? 'animate-spin' : undefined}
              />
            </button>
          </div>

          <div className="flex flex-1 flex-col p-4">
            <Link
              href={`/product/${product.slug}`}
              className="mb-2 line-clamp-2 text-base font-bold text-on-surface transition hover:text-primary"
            >
              {product.name}
            </Link>
            <div className="mb-3">
              <StarRating rating={product.rating_avg} count={product.reviews_count} size={14} />
            </div>
            <div className="mt-auto flex items-center justify-between">
              <Price price={product.price} salePrice={product.sale_price} />
              <QuickAddButton
                productId={product.id}
                productName={product.name}
                isAuthenticated
                inStock={product.in_stock}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
