import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getOrders } from '@/lib/api/orders';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge';
import { formatMoney, formatDate } from '@/lib/utils/format';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'My Orders', canonicalPath: '/account/orders', isIndexable: false, settings });
}

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;
  const { data: orders, meta } = await getOrders(page);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold tracking-tight text-on-surface">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon="package_2"
          title="No orders yet"
          description="When you place an order it will show up here with live tracking."
          action={{ label: 'Start Shopping', href: '/shop', icon: 'storefront' }}
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-border-card bg-surface-card p-5 shadow-botanical-sm transition-all hover:border-brand-gold/40 hover:shadow-botanical-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="font-display text-base font-bold text-brand-forest transition-colors hover:text-brand-gold-dark"
                  >
                    #{order.order_number}
                  </Link>
                  <p className="text-xs text-on-surface-variant">Placed on {formatDate(order.created_at)}</p>
                </div>
                <OrderStatusBadge status={order.order_status} />
              </div>

              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="flex -space-x-2.5">
                  {order.items.slice(0, 4).map((item) =>
                    item.product?.main_image ? (
                      <span
                        key={item.id}
                        className="h-12 w-12 overflow-hidden rounded-full border-2 border-surface-card bg-surface-subtle shadow-sm"
                      >
                        <Image
                          src={item.product.main_image}
                          alt={item.product_name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ) : null,
                  )}
                  {order.items.length > 4 && (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-surface-card bg-surface-subtle text-xs font-bold text-brand-forest">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-brand-forest">₹{formatMoney(order.grand_total)}</p>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-forest transition-colors hover:text-brand-gold-dark"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          searchParams={{}}
          basePath="/account/orders"
        />
      )}
    </div>
  );
}
