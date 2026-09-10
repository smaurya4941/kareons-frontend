import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '@/lib/api/orders';
import { getSettings } from '@/lib/api/settings';
import { ApiError } from '@/lib/api/client';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { formatMoney, formatDate } from '@/lib/utils/format';

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'Order Placed',
    canonicalPath: '/checkout/success',
    isIndexable: false,
    settings,
  });
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderParam } = await searchParams;
  const orderId = Number(orderParam);

  if (!orderId || Number.isNaN(orderId)) {
    redirect('/account/orders');
  }

  let order;
  try {
    order = await getOrder(orderId);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      redirect('/account/orders');
    }
    throw error;
  }

  const isCod = order.payment_method === 'cod';
  const paidOnline = order.payment_status === 'paid';

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg">
        <Icon name="check_circle" size={56} fill />
      </div>

      <h1 className="mb-3 font-display text-3xl font-bold text-brand-forest">Order Placed Successfully!</h1>
      <p className="mb-8 max-w-md text-body-md text-on-surface-variant">
        Thank you for your purchase. Your order has been received and will be processed within 24 hours.
      </p>

      <div className="mb-8 w-full max-w-md rounded-xl border border-outline-variant bg-surface-container p-5 text-left shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 border-b border-outline-variant pb-3 font-bold text-on-surface">
          <Icon name="receipt_long" size={20} className="text-primary" />
          Order Details
        </h2>
        <Row label="Order Number" value={`#${order.order_number}`} strong />
        <Row label="Order Date" value={formatDate(order.created_at)} />
        <Row
          label="Payment Method"
          value={isCod ? 'Cash on Delivery' : paidOnline ? 'Paid Online' : 'Online — awaiting confirmation'}
        />
        <Row label="Order Total" value={`₹${formatMoney(order.grand_total)}`} />
        <Row label="Estimated Delivery" value="5–7 Business Days" last />
      </div>

      {isCod && (
        <div className="mb-8 w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <Icon name="info" size={20} className="mt-0.5 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Cash on Delivery Order</p>
              <p className="mt-1 text-sm text-amber-700">
                Please keep exact change ready at delivery. Our delivery partner will contact you before arriving.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`/account/orders/${order.id}`} variant="outline">
          <Icon name="receipt_long" size={18} />
          View Order
        </ButtonLink>
        <Link
          href="/shop"
          className="btn-squish inline-flex items-center gap-2 rounded-lg bg-brand-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-forest/90"
        >
          <Icon name="storefront" size={18} />
          Continue Shopping
        </Link>
      </div>
    </Container>
  );
}

function Row({
  label,
  value,
  strong,
  last,
}: {
  label: string;
  value: string;
  strong?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex justify-between text-sm ${last ? '' : 'mb-3'}`}>
      <span className="font-medium text-on-surface-variant">{label}</span>
      <span className={strong ? 'font-bold text-primary' : 'font-medium text-on-surface'}>{value}</span>
    </div>
  );
}
