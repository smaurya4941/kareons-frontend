import type { Metadata } from 'next';
import { getCart } from '@/lib/api/cart';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { formatMoney } from '@/lib/utils/format';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Your Cart', canonicalPath: '/cart', isIndexable: false, settings });
}

export default async function CartPage() {
  const cart = await getCart();
  const itemCount = cart.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Container className="min-h-[60vh] py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-forest">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <EmptyState
          icon="shopping_cart"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Discover our natural, Ayurvedic remedies."
          action={{ label: 'Continue Shopping', href: '/shop', icon: 'storefront' }}
        />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="overflow-hidden rounded-xl border border-soft-border bg-white shadow-sm">
              <div className="hidden grid-cols-12 gap-4 border-b border-soft-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:grid">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y divide-soft-border">
                {cart.items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-20 rounded-xl border border-soft-border bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-bold text-on-surface">Order Summary</h2>

              <div className="mb-4 flex items-center gap-2 border-b border-soft-border pb-4 text-xs text-on-surface-variant">
                <Icon name="local_offer" size={18} className="text-brand-gold-dark" />
                <span>Have a coupon? Apply it at checkout.</span>
              </div>

              <div className="mb-4 space-y-3 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-on-surface">₹{formatMoney(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  {cart.shipping === 0 ? (
                    <span className="font-medium text-emerald-600">Free</span>
                  ) : (
                    <span className="font-medium text-on-surface">₹{formatMoney(cart.shipping)}</span>
                  )}
                </div>
              </div>

              <div className="mb-5 border-t border-soft-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-on-surface">Total</span>
                  <span className="font-display text-xl font-bold text-brand-forest">₹{formatMoney(cart.total)}</span>
                </div>
                <p className="mt-1 text-right text-[11px] text-on-surface-variant">Inclusive of all taxes</p>
              </div>

              <ButtonLink href="/checkout" className="w-full">
                <Icon name="lock" size={20} />
                Proceed to Checkout
                <Icon name="arrow_forward" size={20} />
              </ButtonLink>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="lock" size={16} /> Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="local_shipping" size={16} /> Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
