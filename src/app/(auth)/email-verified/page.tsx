import Link from 'next/link';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { isAuthenticated } from '@/lib/auth/session';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Icon } from '@/components/ui/Icon';
import { ResendVerificationButton } from '@/components/auth/ResendVerificationButton';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Email Verification', canonicalPath: '/email-verified', isIndexable: false, settings });
}

interface Props {
  searchParams: Promise<{ status?: 'success' | 'invalid' }>;
}

export default async function EmailVerifiedPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const success = status === 'success';
  const authed = await isAuthenticated();

  return (
    <AuthLayout title={success ? 'Email Verified' : 'Verification Link Invalid'}>
      <div className="flex flex-col items-center gap-4 text-center">
        <Icon
          name={success ? 'mark_email_read' : 'error'}
          size={48}
          fill
          className={success ? 'text-secondary' : 'text-error'}
        />
        <p className="text-sm text-on-surface-variant">
          {success
            ? 'Your email address has been verified — all account features are now available.'
            : 'This verification link is invalid or has expired. Request a fresh one below.'}
        </p>
        {!success && authed && <ResendVerificationButton />}
        <Link href={authed ? '/account' : '/login'} className="btn-primary">
          {authed ? 'Go to My Account' : 'Log In'}
        </Link>
      </div>
    </AuthLayout>
  );
}
