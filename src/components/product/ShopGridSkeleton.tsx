import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ShopGridSkeletonProps {
  count?: number;
}

export function ShopGridSkeleton({ count = 6 }: ShopGridSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} compact />
      ))}
    </div>
  );
}
