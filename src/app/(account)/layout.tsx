import { unstable_rethrow } from 'next/navigation';
import { getProfile } from '@/lib/api/profile';
import { Container } from '@/components/ui/Container';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { VerifyEmailBanner } from '@/components/account/VerifyEmailBanner';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // getProfile() redirects to /login on a missing/expired session; only a
  // transient API error should fall through to the degraded (null) render.
  const user = await getProfile().catch((e) => {
    unstable_rethrow(e);
    return null;
  });

  return (
    <div className="bg-surface-container-lowest py-6">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row">
          <AccountSidebar name={user?.name ?? 'Account'} />
          <div className="flex-1">
            {user && !user.email_verified_at && <VerifyEmailBanner email={user.email} />}
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
