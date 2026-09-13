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
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-botanical-sm">
          <div className="mb-3 flex items-center gap-2 text-amber-900">
            <Icon name="schedule" size={22} />
            <p className="font-semibold">Payment Pending</p>
          </div>
          <RetryPaymentButton orderId={order.id} orderNumber={order.order_number} siteName={settings.site_name} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Status tracker */}
          <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
            <h2 className="mb-6 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Order Status Timeline</h2>
            {cancelled || returned ? (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl p-4',
                  cancelled ? 'bg-error/10 text-error' : 'bg-amber-500/15 text-amber-900',
                )}
              >
                <Icon name={cancelled ? 'cancel' : 'assignment_return'} size={22} />
                <p className="text-sm font-medium">
                  This order was {order.order_status}
                  {order.notes ? ` — ${order.notes}` : '.'}
                </p>
              </div>
            ) : (
              <div className="relative pl-2">
                <ol className="relative border-l-2 border-border-subtle ml-3 space-y-6">
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const isCurrent = i === currentStep;
                    const entry = timelineByStatus.get(step);
                    const stepIcon =
                      step === 'pending'
                        ? 'hourglass_empty'
                        : step === 'confirmed'
                          ? 'check_circle'
                          : step === 'packed'
                            ? 'inventory_2'
                            : step === 'shipped'
                              ? 'local_shipping'
                              : 'task_alt';

                    return (
                      <li key={step} className="relative pl-6">
                        <span
                          className={cn(
                            'absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors',
                            done
                              ? isCurrent
                                ? 'bg-brand-forest text-white ring-4 ring-brand-gold/30'
                                : 'bg-brand-forest text-white'
                              : 'border border-border-subtle bg-surface-subtle text-on-surface-variant',
                          )}
                        >
                          <Icon name={stepIcon} size={16} />
                        </span>
                        <div>
                          <p className={cn('text-sm font-semibold capitalize', done ? 'text-on-surface' : 'text-on-surface-variant')}>
                            {step}
                          </p>
                          {entry && (
                            <p className="mt-0.5 text-xs text-on-surface-variant">
                              {formatDate(entry.created_at)}
                              {entry.notes ? ` · ${entry.notes}` : ''}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </section>

          {/* Items */}
          <section className="overflow-hidden rounded-2xl border border-border-card bg-surface-card shadow-botanical-sm">
            <h2 className="border-b border-border-subtle bg-surface-subtle/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
              Order Items ({order.items.length})
            </h2>
            <ul className="divide-y divide-border-subtle">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-5 transition-colors hover:bg-surface-subtle/30">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-subtle">
                    {item.product?.main_image ? (
                      <Image
                        src={item.product.main_image}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                        <Icon name="spa" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{item.product_name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Qty {item.quantity} · SKU: {item.sku}
                    </p>
                    {order.order_status === 'delivered' && item.product?.slug && (
                      <Link
                        href={`/product/${item.product.slug}#reviews`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-forest hover:underline mt-1.5"
                      >
                        <Icon name="rate_review" size={14} /> Write a review
                      </Link>
                    )}
                  </div>
                  <span className="text-base font-bold text-brand-forest shrink-0">₹{formatMoney(item.total)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Returns */}
          {activeReturn ? (
            <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                Return / Replacement Status
              </h2>
              <p className="text-sm text-on-surface">
                <span className="font-semibold capitalize">{activeReturn.type}</span> request —{' '}
                <span className="font-semibold capitalize text-brand-forest">{activeReturn.status}</span>
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">{activeReturn.reason}</p>
              {activeReturn.admin_note && (
                <p className="mt-3 rounded-xl bg-surface-subtle p-3 text-xs text-on-surface-variant border border-border-subtle">
                  Note: {activeReturn.admin_note}
                </p>
              )}
            </section>
          ) : order.can_request_return ? (
            <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                Returns &amp; Replacements
              </h2>
              <ReturnRequestForm orderId={order.id} windowDays={order.return_window_days ?? 7} />
            </section>
          ) : (
            returnWindowClosed && (
              <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
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
          <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Delivery Address</h2>
            <div className="rounded-xl bg-surface-subtle/50 p-4 border border-border-subtle">
              <p className="text-sm font-semibold text-on-surface">{order.address.full_name}</p>
              <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
                {order.address.address_line_1}
                {order.address.address_line_2 ? `, ${order.address.address_line_2}` : ''}
                <br />
                {order.address.city}, {order.address.state} — {order.address.postal_code}
                <br />
                <span className="font-medium text-on-surface">Phone:</span> {order.address.phone}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Payment &amp; Price Breakdown</h2>
            <dl className="space-y-2.5 text-sm">
              <Row label="Subtotal" value={`₹${formatMoney(order.subtotal)}`} />
              {order.discount_amount > 0 && (
                <Row
                  label={order.coupon_code ? `Discount (${order.coupon_code})` : 'Discount'}
                  value={`−₹${formatMoney(order.discount_amount)}`}
                  accent="text-error"
                />
              )}
              {order.tax_amount > 0 && <Row label="Tax (GST)" value={`₹${formatMoney(order.tax_amount)}`} />}
              <Row
                label="Shipping"
                value={order.shipping_charge === 0 ? 'Free' : `₹${formatMoney(order.shipping_charge)}`}
              />
              <div className="flex justify-between border-t border-border-subtle pt-3 text-base font-bold text-on-surface">
                <dt>Grand Total</dt>
                <dd className="text-brand-forest">₹{formatMoney(order.grand_total)}</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-xl bg-surface-subtle/50 border border-border-subtle p-3 text-xs text-on-surface-variant space-y-1">
              <p className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold uppercase text-on-surface">{order.payment_method}</span>
              </p>
              <p className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-semibold capitalize text-brand-forest">{order.payment_status}</span>
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
