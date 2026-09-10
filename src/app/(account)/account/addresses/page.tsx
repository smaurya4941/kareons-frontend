import type { Metadata } from 'next';
import { getAddresses } from '@/lib/api/addresses';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { AddressBook } from '@/components/account/AddressBook';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'My Addresses', canonicalPath: '/account/addresses', isIndexable: false, settings });
}

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold tracking-tight text-on-surface">Manage Addresses</h1>
      <AddressBook addresses={addresses} />
    </div>
  );
}
