'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { removeCartItemAction, updateCartItemAction } from '@/lib/actions/cart';
import { useCounts } from '@/components/layout/CountsProvider';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatMoney } from '@/lib/utils/format';
import type { CartItem } from '@/types/api';

export function CartLineItem({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setCart, bumpCart } = useCounts();
  const { toast } = useToast();

  if (!item.product) return null;
  const product = item.product;
  const max = Math.min(10, product.stock_quantity || 10);

  function setQty(qty: number) {
    if (qty === item.quantity) return;
    bumpCart(qty - item.quantity);
    startTransition(async () => {
      const res = await updateCartItemAction(item.id, qty);
      if (!res.success) toast(res.message ?? 'Could not update quantity.', 'error');
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const res = await removeCartItemAction(item.id);
      if (res.success) {
        if (typeof res.cartCount === 'number') setCart(res.cartCount);
        toast('Item removed from your cart.', 'info');
      } else {
        toast(res.message ?? 'Could not remove item.', 'error');
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:grid sm:grid-cols-12">
      <div className="flex w-full items-center gap-3 sm:col-span-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-soft-border bg-surface-container">
          {product.main_image ? (
            <Image src={product.main_image} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon name="image" size={20} className="text-outline" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 text-sm font-semibold text-on-surface transition hover:text-primary"
          >
            {product.name}
          </Link>
          <div className="mt-2 flex items-center justify-between sm:hidden">
            <span className="text-sm font-bold text-on-surface">₹{formatMoney(item.unit_price)}</span>
            <button type="button" onClick={remove} disabled={isPending} className="flex items-center gap-1 text-xs font-medium text-error hover:underline">
              <Icon name="delete" size={16} /> Remove
            </button>
          </div>
        </div>
      </div>

      <div className="hidden text-center sm:col-span-2 sm:block">
        <span className="text-sm font-medium text-on-surface">₹{formatMoney(item.unit_price)}</span>
      </div>

      <div className="flex w-full justify-center sm:col-span-2 sm:w-auto">
        <QuantityStepper value={item.quantity} onChange={setQty} min={1} max={max} disabled={isPending} />
      </div>

      <div className="hidden flex-col items-end sm:col-span-2 sm:flex">
        <span className="text-sm font-bold text-on-surface">₹{formatMoney(item.line_total)}</span>
        <button type="button" onClick={remove} disabled={isPending} title="Remove item" className="mt-1.5 text-on-surface-variant transition hover:text-error">
          <Icon name="delete" size={18} />
        </button>
      </div>
    </div>
  );
}
