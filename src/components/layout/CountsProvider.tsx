'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface Counts {
  cart: number;
  wishlist: number;
}

interface CountsContextValue extends Counts {
  setCart: (n: number) => void;
  setWishlist: (n: number) => void;
  bumpCart: (delta: number) => void;
}

const CountsContext = createContext<CountsContextValue | null>(null);

/** Header cart/wishlist badges. Seeded server-side, updated optimistically by
 *  client actions so the badge reacts instantly without a full revalidate. */
export function useCounts() {
  const ctx = useContext(CountsContext);
  if (!ctx) throw new Error('useCounts must be used within <CountsProvider>');
  return ctx;
}

export function CountsProvider({ initial, children }: { initial: Counts; children: React.ReactNode }) {
  const [cart, setCart] = useState(initial.cart);
  const [wishlist, setWishlist] = useState(initial.wishlist);

  const bumpCart = useCallback((delta: number) => setCart((c) => Math.max(0, c + delta)), []);

  const value = useMemo<CountsContextValue>(
    () => ({ cart, wishlist, setCart, setWishlist, bumpCart }),
    [cart, wishlist, bumpCart],
  );

  return <CountsContext.Provider value={value}>{children}</CountsContext.Provider>;
}
