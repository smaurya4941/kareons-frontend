import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Reset Password', canonicalPath: '/forgot-password', isIndexable: false, settings });
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset Your Password" subtitle="We'll email you a secure link to set a new password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
