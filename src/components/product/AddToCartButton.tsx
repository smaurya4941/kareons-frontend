'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { addToCartAction } from '@/lib/actions/cart';
import { useToast } from '@/components/ui/Toast';
import { useCounts } from '@/components/layout/CountsProvider';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

interface Props {
  productId: number;
  inStock: boolean;
  stockQuantity: number;
  isAuthenticated: boolean;
}

/** Product-detail add-to-cart: quantity stepper + "Add to Cart" + "Buy Now". */
export function AddToCartButton({ productId, inStock, stockQuantity, isAuthenticated }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { setCart } = useCounts();

  const max = stockQuantity > 0 ? Math.min(stockQuantity, 10) : 1;

  function add(then?: 'checkout') {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    startTransition(async () => {
      const result = await addToCartAction(productId, quantity);
      if (!result.success) {
        toast(result.message ?? 'Could not add to cart.', 'error');
        return;
      }
      if (typeof result.cartCount === 'number') setCart(result.cartCount);
      if (then === 'checkout') {
        // "Buy Now" — straight to checkout, matching the Blade storefront.
        router.push('/checkout');
        return;
      }
      toast(result.message ?? 'Added to your cart.', 'success', {
        title: 'Added to Cart',
        action: { label: 'View Cart', href: '/cart' },
      });
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={max} disabled={!inStock} />

      <Button
        type="button"
        variant="outline"
        onClick={() => add()}
        disabled={!inStock || isPending}
        className="flex-1"
      >
        <Icon name="shopping_bag" size={20} fill />
        {isPending ? 'Adding…' : inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>

      <Button
        type="button"
        variant="primary"
        onClick={() => add('checkout')}
        disabled={!inStock || isPending}
        className="flex-1"
      >
        <Icon name="bolt" size={20} fill />
        Buy Now
      </Button>
    </div>
  );
}
