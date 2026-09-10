import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Set New Password', canonicalPath: '/reset-password', isIndexable: false, settings });
}

interface Props {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, email } = await searchParams;

  return (
    <AuthLayout title="Set a New Password">
      {!token || !email ? (
        <p className="text-center text-sm text-error">This password reset link is invalid or incomplete.</p>
      ) : (
        <ResetPasswordForm token={token} email={email} />
      )}
    </AuthLayout>
  );
}
