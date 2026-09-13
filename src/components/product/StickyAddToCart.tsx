'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { addToCartAction } from '@/lib/actions/cart';
import { useToast } from '@/components/ui/Toast';
import { useCounts } from '@/components/layout/CountsProvider';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils/format';

interface StickyAddToCartProps {
  productId: number;
  productName: string;
  price: number;
  inStock: boolean;
  isAuthenticated: boolean;
  targetId?: string;
}

export function StickyAddToCart({
  productId,
  productName,
  price,
  inStock,
  isAuthenticated,
  targetId = 'main-buy-box',
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { setCart } = useCounts();

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when the main buy box is scrolled out of view (above viewport)
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  function handleAdd() {
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

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Quick add to cart"
      className="fixed bottom-0 left-0 z-40 w-full border-t border-border-card bg-surface-card/95 p-3 backdrop-blur-md shadow-botanical-lg sm:hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-brand-forest">{productName}</p>
          <p className="text-sm font-bold text-on-surface">₹{formatMoney(price)}</p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!inStock || isPending}
          className="shrink-0"
        >
          <Icon name="shopping_bag" size={16} fill />
          {isPending ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}
