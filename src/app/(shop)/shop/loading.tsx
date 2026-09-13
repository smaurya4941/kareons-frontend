import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { ShopGridSkeleton } from '@/components/product/ShopGridSkeleton';

export default function ShopLoading() {
  return (
    <Container className="py-6 md:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center gap-2" aria-hidden="true">
        <Skeleton className="h-4 w-12" />
        <span className="text-outline-variant">/</span>
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Heading Skeleton */}
      <div className="mb-6" aria-hidden="true">
        <Skeleton className="mb-2 h-9 w-48 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Skeleton (Desktop) */}
        <aside className="hidden w-full flex-shrink-0 lg:block lg:w-64" aria-hidden="true">
          <div className="rounded-lg border border-soft-border bg-white p-5 shadow-sm space-y-6">
            <div>
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
            <div className="space-y-2 border-t border-soft-border pt-4">
              <Skeleton className="mb-3 h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-2 border-t border-soft-border pt-4">
              <Skeleton className="mb-3 h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="w-full flex-1">
          {/* Top Bar Skeleton */}
          <div
            className="mb-5 flex flex-col items-start justify-between gap-3 border-b border-soft-border pb-3 sm:flex-row sm:items-center"
            aria-hidden="true"
          >
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-28" />
          </div>

          {/* Grid Skeleton */}
          <ShopGridSkeleton count={6} />
        </div>
      </div>
    </Container>
  );
}
