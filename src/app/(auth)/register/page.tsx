import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ title: 'Create Account', canonicalPath: '/register', isIndexable: false, settings });
}

export default function RegisterPage() {
  return (
    <AuthLayout title="Create an Account" subtitle="Join Kare-ons for a faster checkout and order tracking">
      <RegisterForm />
    </AuthLayout>
  );
}
