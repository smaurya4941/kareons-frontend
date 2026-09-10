'use client';

import { useCounts } from './CountsProvider';

export function CartBadge() {
  const { cart } = useCounts();
  if (cart <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-forest">
      {cart}
    </span>
  );
}

export function WishlistBadge() {
  const { wishlist } = useCounts();
  if (wishlist <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-forest">
      {wishlist}
    </span>
  );
}
