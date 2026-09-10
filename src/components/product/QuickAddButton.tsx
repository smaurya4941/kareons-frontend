'use client';

import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { addToCartAction } from '@/lib/actions/cart';
import { useToast } from '@/components/ui/Toast';
import { useCounts } from '@/components/layout/CountsProvider';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface QuickAddButtonProps {
  productId: number;
  productName: string;
  isAuthenticated: boolean;
  inStock?: boolean;
  className?: string;
}

/** Circular icon-only add-to-cart used on product cards. */
export function QuickAddButton({
  productId,
  productName,
  isAuthenticated,
  inStock = true,
  className,
}: QuickAddButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { setCart } = useCounts();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    startTransition(async () => {
      const result = await addToCartAction(productId, 1);
      if (!result.success) {
        toast(result.message ?? 'Could not add to cart.', 'error');
        return;
      }
      if (typeof result.cartCount === 'number') setCart(result.cartCount);
      toast(result.message ?? 'Added to your cart.', 'success', {
        title: 'Added to Cart',
        action: { label: 'View Cart', href: '/cart' },
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || !inStock}
      title={`Add ${productName} to cart`}
      aria-label={`Add ${productName} to cart`}
      className={cn(
        'btn-squish flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-forest text-brand-cream shadow-sm transition-colors hover:bg-brand-gold hover:text-brand-forest disabled:opacity-50',
        className,
      )}
    >
      <Icon name={isPending ? 'progress_activity' : 'add_shopping_cart'} size={20} className={isPending ? 'animate-spin' : undefined} />
    </button>
  );
}
