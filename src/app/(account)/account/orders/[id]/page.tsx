import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getOrder } from '@/lib/api/orders';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Icon } from '@/components/ui/Icon';
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge';
import { ReturnRequestForm } from '@/components/account/ReturnRequestForm';
import { RetryPaymentButton } from '@/components/account/RetryPaymentButton';
import { formatMoney, formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const settings = await getSettings();
  return buildMetadata({
    title: `Order #${id}`,
    canonicalPath: `/account/orders/${id}`,
    isIndexable: false,
    settings,
  });
}

const STEPS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'] as const;

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const [order, settings] = await Promise.all([getOrder(Number(id)), getSettings()]);

  const cancelled = order.order_status === 'cancelled';
  const returned = order.order_status === 'returned';
  const currentStep = STEPS.indexOf(order.order_status as (typeof STEPS)[number]);
  const timelineByStatus = new Map((order.timelines ?? []).map((t) => [t.status, t]));
  const activeReturn = (order.return_requests ?? [])[0];
  const returnWindowClosed =
    !activeReturn && !order.can_request_return && order.order_status === 'delivered';

  const awaitingPayment =
    order.payment_method === 'razorpay' &&
    order.payment_status !== 'paid' &&
    !['cancelled', 'returned', 'shipped', 'delivered'].includes(order.order_status);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">Order #{order.order_number}</h1>
          <p className="text-sm text-on-surface-variant">Placed on {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.order_status} />
      </div>

      {awaitingPayment && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-amber-800">
            <Icon name="schedule" size={20} />
            <p className="font-semibold">Payment Pending</p>
          </div>
          <RetryPaymentButton orderId={order.id} orderNumber={order.order_number} siteName={settings.site_name} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Status tracker */}
          <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-on-surface-variant">Order Status</h2>
            {cancelled || returned ? (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg p-4',
                  cancelled ? 'bg-error/10 text-error' : 'bg-orange-100 text-orange-800',
                )}
              >
                <Icon name={cancelled ? 'cancel' : 'assignment_return'} size={22} />
                <p className="text-sm font-medium">
                  This order was {order.order_status}
                  {order.notes ? ` — ${order.notes}` : '.'}
                </p>
              </div>
            ) : (
              <ol className="relative ml-3 border-l-2 border-outline-variant">
                {STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const entry = timelineByStatus.get(step);
                  return (
                    <li key={step} className="mb-6 ml-6 last:mb-0">
                      <span
                        className={cn(
                          'absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full',
                          done ? 'bg-primary' : 'bg-outline-variant',
                        )}
                      />
                      <p className={cn('text-sm font-semibold capitalize', done ? 'text-on-surface' : 'text-on-surface-variant')}>
                        {step}
                      </p>
                      {entry && (
                        <p className="text-xs text-on-surface-variant">
                          {formatDate(entry.created_at)}
                          {entry.notes ? ` · ${entry.notes}` : ''}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Items */}
          <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm">
            <h2 className="border-b border-outline-variant px-5 py-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Items
            </h2>
            <ul className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
                    {item.product?.main_image && (
                      <Image
                        src={item.product.main_image}
                        alt={item.product_name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{item.product_name}</p>
                    <p className="text-xs text-on-surface-variant">
                      Qty {item.quantity} · SKU {item.sku}
                    </p>
                    {order.order_status === 'delivered' && item.product?.slug && (
                      <Link
                        href={`/product/${item.product.slug}#reviews`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Write a review
                      </Link>
                    )}
                  </div>
                  <span className="text-sm font-bold text-on-surface">₹{formatMoney(item.total)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Returns */}
          {activeReturn ? (
            <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Return / Replacement
              </h2>
              <p className="text-sm text-on-surface">
                <span className="font-semibold capitalize">{activeReturn.type}</span> request —{' '}
                <span className="capitalize">{activeReturn.status}</span>
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">{activeReturn.reason}</p>
              {activeReturn.admin_note && (
                <p className="mt-2 rounded bg-surface-container p-2 text-xs text-on-surface-variant">
                  {activeReturn.admin_note}
                </p>
              )}
            </section>
          ) : order.can_request_return ? (
            <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Returns &amp; Replacements
              </h2>
              <ReturnRequestForm orderId={order.id} windowDays={order.return_window_days ?? 7} />
            </section>
          ) : (
            returnWindowClosed && (
              <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
                <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  Returns &amp; Replacements
                </h2>
                <p className="text-sm text-on-surface-variant">
                  The {order.return_window_days ?? 7}-day return window for this order has passed. Please contact support
                  if you need assistance.
                </p>
              </section>
            )
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant">Delivery Address</h2>
            <p className="text-sm font-medium text-on-surface">{order.address.full_name}</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {order.address.address_line_1}
              {order.address.address_line_2 ? `, ${order.address.address_line_2}` : ''}
              <br />
              {order.address.city}, {order.address.state} {order.address.postal_code}
              <br />
              {order.address.phone}
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant">Price Details</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${formatMoney(order.subtotal)}`} />
              {order.discount_amount > 0 && (
                <Row
                  label={order.coupon_code ? `Discount (${order.coupon_code})` : 'Discount'}
                  value={`−₹${formatMoney(order.discount_amount)}`}
                  accent="text-error"
                />
              )}
              {order.tax_amount > 0 && <Row label="Tax" value={`₹${formatMoney(order.tax_amount)}`} />}
              <Row
                label="Shipping"
                value={order.shipping_charge === 0 ? 'Free' : `₹${formatMoney(order.shipping_charge)}`}
              />
              <div className="flex justify-between border-t border-outline-variant pt-2 font-bold text-on-surface">
                <dt>Total</dt>
                <dd>₹{formatMoney(order.grand_total)}</dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-outline-variant pt-3 text-xs text-on-surface-variant">
              <p>
                Payment: <span className="font-medium uppercase text-on-surface">{order.payment_method}</span>
              </p>
              <p>
                Status: <span className="font-medium capitalize text-on-surface">{order.payment_status}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className={cn('flex justify-between text-on-surface-variant', accent)}>
      <dt>{label}</dt>
      <dd className={accent ?? 'text-on-surface'}>{value}</dd>
    </div>
  );
}
