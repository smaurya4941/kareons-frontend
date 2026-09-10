'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toggleWishlistAction } from '@/lib/actions/wishlist';
import { useToast } from '@/components/ui/Toast';
import { useCounts } from '@/components/layout/CountsProvider';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface WishlistButtonProps {
  productId: number;
  initialInWishlist: boolean;
  isAuthenticated: boolean;
  /** 'icon' = floating circular heart (product cards); 'button' = bordered square (PDP). */
  variant?: 'icon' | 'button';
  className?: string;
}

export function WishlistButton({
  productId,
  initialInWishlist,
  isAuthenticated,
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { setWishlist } = useCounts();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (!result.success) {
        toast(result.message ?? 'Could not update wishlist.', 'error');
        return;
      }
      const added = result.status === 'added';
      setInWishlist(added);
      if (typeof result.wishlistCount === 'number') setWishlist(result.wishlistCount);
      toast(
        added ? 'Saved to your wishlist.' : 'Removed from your wishlist.',
        added ? 'success' : 'info',
        added ? { title: 'Added to Wishlist', action: { label: 'View Wishlist', href: '/account/wishlist' } } : { title: 'Removed from Wishlist' },
      );
    });
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={inWishlist}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={cn(
          'btn-squish flex h-12 w-12 items-center justify-center rounded-lg border transition-colors',
          inWishlist
            ? 'border-brand-gold-dark bg-brand-gold/10 text-brand-gold-dark'
            : 'border-soft-border text-on-surface-variant hover:border-brand-gold-dark hover:text-brand-gold-dark',
          className,
        )}
      >
        <Icon name="favorite" size={24} fill={inWishlist} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={inWishlist}
      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white',
        className,
      )}
    >
      <Icon
        name="favorite"
        size={20}
        fill={inWishlist}
        className={inWishlist ? 'text-brand-gold-dark' : 'text-brand-forest/50 hover:text-brand-gold-dark'}
      />
    </button>
  );
}
