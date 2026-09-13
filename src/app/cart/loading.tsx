import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CartLoading() {
  return (
    <Container className="min-h-[60vh] py-8">
      {/* Title */}
      <Skeleton className="mb-6 h-8 w-44" />

      <div className="flex flex-col gap-6 lg:flex-row" aria-hidden="true">
        {/* Cart Items Table */}
        <div className="lg:w-2/3">
          <div className="overflow-hidden rounded-xl border border-soft-border bg-white shadow-sm">
            <div className="hidden grid-cols-12 gap-4 border-b border-soft-border px-5 py-3 sm:grid">
              <Skeleton className="col-span-6 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-12 mx-auto" />
              <Skeleton className="col-span-2 h-4 w-16 mx-auto" />
              <Skeleton className="col-span-2 h-4 w-12 ml-auto" />
            </div>

            <div className="divide-y divide-soft-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4 p-4 sm:grid sm:grid-cols-12">
                  <div className="flex w-full items-center gap-3 sm:col-span-6">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-soft-border">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>

                  <div className="hidden text-center sm:col-span-2 sm:block">
                    <Skeleton className="mx-auto h-4 w-14" />
                  </div>

                  <div className="flex w-full justify-center sm:col-span-2 sm:w-auto">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                  </div>

                  <div className="hidden flex-col items-end sm:col-span-2 sm:flex space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:w-1/3">
          <div className="rounded-xl border border-soft-border bg-white p-5 shadow-sm space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />

            <div className="space-y-3 border-y border-soft-border py-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="flex justify-between pt-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="h-11 w-full rounded-lg" />

            <div className="flex items-center justify-center gap-4 pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
