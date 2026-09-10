import type { Metadata } from 'next';
import { getProfile } from '@/lib/api/profile';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { ProfileForm } from '@/components/account/ProfileForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'My Account', canonicalPath: '/account', isIndexable: false, settings });
}

export default async function AccountOverviewPage() {
  const user = await getProfile();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold tracking-tight text-on-surface">Profile Information</h1>
      <ProfileForm user={user} />
    </div>
  );
}
