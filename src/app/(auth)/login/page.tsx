import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { getSafeInternalRedirect } from '@/lib/utils/url';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Login', canonicalPath: '/login', isIndexable: false, settings });
}

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const safeRedirect = getSafeInternalRedirect(next, '/account');
  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to your Kare-ons account">
      <LoginForm redirectTo={safeRedirect} />
    </AuthLayout>
  );
}
