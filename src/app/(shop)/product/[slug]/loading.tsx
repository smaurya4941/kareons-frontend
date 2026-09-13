import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <Container className="max-w-7xl py-6 md:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center gap-2" aria-hidden="true">
        <Skeleton className="h-4 w-12" />
        <span className="text-outline-variant">/</span>
        <Skeleton className="h-4 w-16" />
        <span className="text-outline-variant">/</span>
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12" aria-hidden="true">
        {/* Gallery Skeleton */}
        <div className="md:col-span-5">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-soft-border bg-white p-4 shadow-sm">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg border border-soft-border bg-white">
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col justify-start py-2 md:col-span-7 space-y-4">
          {/* Badge Chips */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          {/* Title */}
          <Skeleton className="h-8 w-4/5" />

          {/* Rating & SKU */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Short Description */}
          <div className="space-y-2 py-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Buy Card Skeleton */}
          <div className="rounded-xl border border-soft-border bg-white p-5 shadow-sm space-y-4">
            <Skeleton className="h-5 w-36 rounded-full" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>

          {/* Trust points */}
          <div className="flex items-center gap-6 border-t border-soft-border pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </Container>
  );
}
