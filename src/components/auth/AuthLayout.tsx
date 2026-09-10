import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/api/settings';

export async function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="relative flex min-h-[calc(100vh-5.5rem)] flex-col items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute right-[-5%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-herbal-light blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[60vw] w-[60vw] rounded-full bg-secondary-fixed/40 blur-[100px]" />
      </div>

      <Link href="/" className="mb-5">
        {settings.logo ? (
          <Image src={settings.logo} alt={settings.site_name} width={160} height={44} className="h-11 w-auto object-contain" />
        ) : (
          <span className="font-display text-xl font-bold text-brand-forest">{settings.site_name}</span>
        )}
      </Link>

      <div className="w-full rounded-xl border border-soft-border bg-white/80 px-6 py-7 shadow-sm backdrop-blur-md sm:max-w-md">
        <h1 className="text-center font-display text-2xl font-bold text-brand-forest">{title}</h1>
        {subtitle && <p className="mt-1 text-center text-sm text-on-surface-variant">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export const authInputClass =
  'w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 text-sm outline-none focus:border-primary';
