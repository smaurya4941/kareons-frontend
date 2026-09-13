import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';

interface ProductCardSkeletonProps {
  compact?: boolean;
}

export function ProductCardSkeleton({ compact = false }: ProductCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-xl border border-brand-beige bg-white shadow-sm"
    >
      {/* Product Image Placeholder */}
      <div className="aspect-square w-full bg-brand-cream/60">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Card Content */}
      <div className={cn('flex flex-1 flex-col', compact ? 'p-3' : 'p-4')}>
        {/* Category Eyebrow */}
        <Skeleton className="mb-2 h-2.5 w-16" />

        {/* Product Title */}
        <Skeleton className="mb-2 h-4 w-4/5" />

        {/* Star Rating */}
        <div className="mb-3 flex items-center gap-1">
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Footer: Price + QuickAdd */}
        <div className="mt-auto flex items-center justify-between border-t border-brand-beige pt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
