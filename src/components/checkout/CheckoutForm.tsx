'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { placeOrderAction, verifyPaymentAction } from '@/lib/actions/checkout';
import { validateCouponAction } from '@/lib/actions/coupon';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useCounts } from '@/components/layout/CountsProvider';
import { Icon } from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Address, CheckoutSummary } from '@/types/api';

const EMPTY = {
  full_name: '',
  phone: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
};

type AddressFields = typeof EMPTY;

function fill(address: Address): AddressFields {
  return {
    full_name: address.full_name,
    phone: address.phone,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2 ?? '',
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
  };
}

export function CheckoutForm({
  summary,
  razorpayKey,
  siteName,
}: {
  summary: CheckoutSummary;
  razorpayKey: string | null;
  siteName: string;
}) {
  const defaultAddress = summary.addresses.find((a) => a.is_default) ?? summary.addresses[0];
  const [selectedId, setSelectedId] = useState<number | ''>(defaultAddress?.id ?? '');
  const [fields, setFields] = useState<AddressFields>(defaultAddress ? fill(defaultAddress) : EMPTY);
  const [paymentMethod, setPaymentMethod] = useState(summary.payment_methods[0]?.code ?? 'cod');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setCart } = useCounts();

  const grandTotal = useMemo(() => Math.max(0, summary.total - discount), [summary.total, discount]);

  function chooseSaved(value: string) {
    if (value === '') {
      setSelectedId('');
      setFields(EMPTY);
      return;
    }
    const id = Number(value);
    setSelectedId(id);
    const addr = summary.addresses.find((a) => a.id === id);
    if (addr) setFields(fill(addr));
  }

  function updateField(key: keyof AddressFields, value: string) {
    setSelectedId('');
    setFields((f) => ({ ...f, [key]: value }));
  }

  function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    startTransition(async () => {
      setCouponError(null);
      const result = await validateCouponAction(couponCode.trim(), summary.subtotal);
      if (result.success && result.coupon) {
        setDiscount(result.coupon.discount);
        setAppliedCode(result.coupon.code);
        setCouponMessage(`Coupon applied: −₹${formatMoney(result.coupon.discount)}`);
      } else {
        setDiscount(0);
        setAppliedCode('');
        setCouponError(result.message ?? 'Invalid coupon code.');
      }
    });
  }

  function removeCoupon() {
    setDiscount(0);
    setAppliedCode('');
    setCouponCode('');
    setCouponMessage(null);
    setCouponError(null);
  }

  function placeOrder() {
    const required: (keyof AddressFields)[] = [
      'full_name',
      'phone',
      'address_line_1',
      'city',
      'state',
      'postal_code',
    ];
    if (required.some((k) => !fields[k].trim())) {
      setError('Please complete all required delivery details.');
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await placeOrderAction({
        full_name: fields.full_name.trim(),
        phone: fields.phone.trim(),
        address_line_1: fields.address_line_1.trim(),
        address_line_2: fields.address_line_2.trim() || undefined,
        city: fields.city.trim(),
        state: fields.state.trim(),
        postal_code: fields.postal_code.trim(),
        payment_method: paymentMethod,
        coupon_code: appliedCode || undefined,
      });

      if (!result.success || !result.order) {
        setError(result.message ?? 'Could not place order.');
        return;
      }

      const orderId = result.order.id;

      if (result.razorpay && razorpayKey) {
        openRazorpayCheckout({
          key: razorpayKey,
          amount: result.razorpay.amount,
          currency: 'INR',
          name: siteName,
          order_id: result.razorpay.order_id,
          prefill: { name: fields.full_name, contact: fields.phone },
          handler: (response) => {
            startTransition(async () => {
              const verification = await verifyPaymentAction(response);
              if (verification.success) {
                setCart(0);
                router.push(`/checkout/success?order=${orderId}`);
              } else {
                setError(verification.message ?? 'Payment verification failed.');
              }
            });
          },
          modal: {
            // The order is placed (awaiting payment) — send them to its detail
            // page where the "Complete Payment" button lets them retry.
            ondismiss: () => {
              setCart(0);
              router.push(`/account/orders/${orderId}`);
            },
          },
        });
        return;
      }

      setCart(0);
      router.push(`/checkout/success?order=${orderId}`);
    });
  }

  return (
    <form className="flex flex-col gap-6 lg:flex-row" onSubmit={(e) => e.preventDefault()}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="space-y-6 lg:w-2/3">
        <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest text-xs font-bold text-white">1</span>
            <h2 className="font-display text-lg font-bold text-brand-forest">Delivery Details</h2>
          </div>

          {summary.addresses.length > 0 && (
            <div className="mb-6">
              <Select
                label="Use a Saved Address"
                value={selectedId}
                onChange={(e) => chooseSaved(e.target.value)}
              >
                <option value="">— Enter a new address below —</option>
                {summary.addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name} ({a.postal_code}) — {a.address_line_1}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name" required value={fields.full_name} onChange={(v) => updateField('full_name', v)} />
            <Field label="Phone Number" required type="tel" value={fields.phone} onChange={(v) => updateField('phone', v)} />
            <div className="md:col-span-2">
              <Field
                label="Street Address"
                required
                value={fields.address_line_1}
                onChange={(v) => updateField('address_line_1', v)}
                placeholder="House number and street name"
              />
            </div>
            <div className="md:col-span-2">
              <Field
                label="Apartment, suite, etc. (optional)"
                value={fields.address_line_2}
                onChange={(v) => updateField('address_line_2', v)}
              />
            </div>
            <Field label="Town / City" required value={fields.city} onChange={(v) => updateField('city', v)} />
            <Field label="State" required value={fields.state} onChange={(v) => updateField('state', v)} />
            <Field label="PIN Code" required value={fields.postal_code} onChange={(v) => updateField('postal_code', v)} />
          </div>

          {summary.addresses.length === 0 && (
            <p className="mt-3 text-xs text-on-surface-variant">
              Tip: save addresses in your{' '}
              <Link href="/account/addresses" className="text-primary underline">
                address book
              </Link>{' '}
              for faster checkout next time.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-border-subtle pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest text-xs font-bold text-white">2</span>
            <h2 className="font-display text-lg font-bold text-brand-forest">Payment Method</h2>
          </div>
          <div className="space-y-3">
            {summary.payment_methods.map((pm) => (
              <label
                key={pm.code}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-brand-gold/40 hover:bg-surface-subtle',
                  paymentMethod === pm.code ? 'border-brand-forest bg-surface-subtle ring-1 ring-brand-forest' : 'border-border-card',
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === pm.code}
                    onChange={() => setPaymentMethod(pm.code)}
                    className="h-5 w-5 accent-brand-forest"
                  />
                  <span className="font-semibold text-on-surface">{pm.name}</span>
                </span>
                <Icon
                  name={pm.code === 'cod' ? 'local_shipping' : pm.code === 'razorpay' ? 'account_balance' : 'account_balance_wallet'}
                  size={26}
                  className={paymentMethod === pm.code ? 'text-brand-forest' : 'text-outline'}
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:w-1/3">
        <div className="sticky top-20 rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
          <h2 className="mb-4 border-b border-border-subtle pb-3 font-display text-lg font-bold text-on-surface">Order Summary</h2>

          <div className="mb-6 max-h-[36vh] space-y-4 overflow-y-auto pr-1">
            {summary.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-subtle">
                  {item.product?.main_image ? (
                    <Image src={item.product.main_image} alt={item.product.name ?? ''} width={56} height={56} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-outline">
                      <Icon name="image" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-on-surface">{item.product?.name}</p>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-on-surface-variant">Qty: {item.quantity}</span>
                    <span className="font-bold text-on-surface">₹{formatMoney(item.line_total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 border-t border-outline-variant pt-4">
            <label className="mb-2 block text-sm font-medium text-on-surface-variant">Have a coupon code?</label>
            {appliedCode ? (
              <div className="flex items-center justify-between rounded-lg border border-secondary bg-secondary-container/40 px-4 py-2">
                <span className="text-sm font-medium text-on-surface">
                  Applied: <span className="font-mono font-bold">{appliedCode}</span>
                </span>
                <button type="button" onClick={removeCoupon} className="text-sm font-medium text-error hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border border-outline-variant px-4 py-2 text-sm uppercase outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={isPending}
                  className="rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="mt-2 text-xs text-error">{couponError}</p>}
            {couponMessage && appliedCode && <p className="mt-2 text-xs text-secondary">{couponMessage}</p>}
          </div>

          <dl className="mb-6 space-y-3 text-sm">
            <Row label="Subtotal" value={`₹${formatMoney(summary.subtotal)}`} />
            {summary.tax_amount > 0 && <Row label="Tax (GST)" value={`₹${formatMoney(summary.tax_amount)}`} />}
            <Row
              label="Shipping"
              value={summary.shipping === 0 ? 'Free' : `₹${formatMoney(summary.shipping)}`}
              accent={summary.shipping === 0 ? 'text-emerald-600' : undefined}
            />
            {discount > 0 && <Row label="Discount" value={`−₹${formatMoney(discount)}`} accent="text-error" />}
          </dl>

          <div className="mb-5 border-t border-outline-variant pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-on-surface">Total</span>
              <span className="font-display text-xl font-bold text-brand-forest">₹{formatMoney(grandTotal)}</span>
            </div>
          </div>

          {error && <p className="mb-3 text-sm text-error">{error}</p>}

          <button
            type="button"
            onClick={placeOrder}
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-60"
          >
            <Icon name="lock" size={20} />
            {isPending ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <Input
      label={label}
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className={cn('flex items-center justify-between text-on-surface-variant', accent)}>
      <dt>{label}</dt>
      <dd className={cn('font-medium', accent ?? 'text-on-surface')}>{value}</dd>
    </div>
  );
}
