import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-herbal-light">
        <Icon name="travel_explore" size={32} className="text-brand-gold-dark" />
      </div>
      <h1 className="font-display text-3xl font-bold text-brand-forest">Page Not Found</h1>
      <p className="max-w-md text-sm text-on-surface-variant">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Explore our Ayurvedic range instead.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className="btn-primary">
          Back Home
        </Link>
        <Link
          href="/shop"
          className="btn-squish inline-flex items-center gap-2 rounded-lg border border-brand-forest px-6 py-2.5 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-white"
        >
          Shop All Products
        </Link>
      </div>
    </Container>
  );
}
