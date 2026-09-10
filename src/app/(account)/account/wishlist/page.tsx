import type { Metadata } from 'next';
import { getWishlist } from '@/lib/api/wishlist';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { WishlistGrid } from '@/components/account/WishlistGrid';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'My Wishlist', canonicalPath: '/account/wishlist', isIndexable: false, settings });
}

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold tracking-tight text-on-surface">My Wishlist</h1>
      <WishlistGrid entries={wishlist.map((e) => ({ id: e.id, product: e.product }))} />
    </div>
  );
}
