import type { Metadata } from 'next';
import { getCart } from '@/lib/api/cart';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { formatMoney } from '@/lib/utils/format';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Your Cart', canonicalPath: '/cart', isIndexable: false, settings });
}

export default async function CartPage() {
  const [cart, settings] = await Promise.all([getCart(), getSettings()]);
  const itemCount = cart.items.reduce((n, i) => n + i.quantity, 0);
  const freeShippingThreshold = settings.free_shipping_amount;
  const qualifiesForFreeShipping = freeShippingThreshold > 0 && cart.subtotal >= freeShippingThreshold;
  const amountToFreeShipping = freeShippingThreshold > 0 && !qualifiesForFreeShipping ? freeShippingThreshold - cart.subtotal : 0;

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
            <div className="overflow-hidden rounded-2xl border border-border-card bg-surface-card shadow-botanical-sm">
              <div className="hidden grid-cols-12 gap-4 border-b border-border-card px-5 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant sm:grid">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y divide-border-subtle">
                {cart.items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-20 rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm space-y-4">
              <h2 className="font-display text-lg font-bold text-on-surface">Order Summary</h2>

              {freeShippingThreshold > 0 && (
                <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3.5">
                  {qualifiesForFreeShipping ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-success">
                      <Icon name="check_circle" size={18} />
                      <span>You unlocked Free Delivery!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Icon name="local_shipping" size={18} className="text-brand-gold-dark shrink-0" />
                      <span>
                        Add <strong className="text-brand-forest">₹{formatMoney(amountToFreeShipping)}</strong> more to qualify for Free Delivery
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 border-b border-border-subtle pb-4 text-xs text-on-surface-variant">
                <Icon name="local_offer" size={18} className="text-brand-gold-dark shrink-0" />
                <span>Have a coupon? You can apply it at checkout.</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-on-surface">₹{formatMoney(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  {cart.shipping === 0 ? (
                    <Badge variant="success" size="sm">Free</Badge>
                  ) : (
                    <span className="font-medium text-on-surface">₹{formatMoney(cart.shipping)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-on-surface">Total</span>
                  <span className="font-display text-2xl font-bold text-brand-forest">₹{formatMoney(cart.total)}</span>
                </div>
                <p className="mt-1 text-right text-[11px] text-on-surface-variant">Inclusive of all taxes</p>
              </div>

              <ButtonLink href="/checkout" variant="primary" className="w-full">
                <Icon name="lock" size={20} />
                Proceed to Checkout
                <Icon name="arrow_forward" size={20} />
              </ButtonLink>

              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="verified_user" size={16} className="text-brand-gold-dark" /> Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="local_shipping" size={16} className="text-brand-gold-dark" /> Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
