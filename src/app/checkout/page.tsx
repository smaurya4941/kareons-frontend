import type { Metadata } from 'next';
import { getCheckoutSummary } from '@/lib/api/checkout';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Checkout', canonicalPath: '/checkout', isIndexable: false, settings });
}

export default async function CheckoutPage() {
  const [summary, settings] = await Promise.all([getCheckoutSummary(), getSettings()]);

  return (
    <Container className="min-h-screen py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-forest">Checkout</h1>
      {summary.items.length === 0 ? (
        <EmptyState
          icon="shopping_cart"
          title="Your cart is empty"
          description="Add a few Ayurvedic essentials before checking out."
          action={{ label: 'Continue Shopping', href: '/shop', icon: 'storefront' }}
        />
      ) : (
        <CheckoutForm summary={summary} razorpayKey={settings.razorpay_key} siteName={settings.site_name} />
      )}
    </Container>
  );
}
