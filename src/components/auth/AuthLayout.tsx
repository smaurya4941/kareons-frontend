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
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-35">
        <div className="absolute right-[-10%] top-[-10%] h-[55vw] w-[55vw] rounded-full bg-brand-gold/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[60vw] w-[60vw] rounded-full bg-herbal-light/40 blur-[130px]" />
      </div>

      <Link href="/" className="mb-6 transition-transform hover:scale-102">
        {settings.logo ? (
          <Image src={settings.logo} alt={settings.site_name} width={160} height={44} className="h-11 w-auto object-contain" />
        ) : (
          <span className="font-display text-2xl font-bold tracking-tight text-brand-forest">{settings.site_name}</span>
        )}
      </Link>

      <div className="w-full rounded-2xl border border-border-card bg-surface-card/95 p-8 shadow-botanical-lg backdrop-blur-md sm:max-w-md">
        <h1 className="text-center font-display text-2xl font-bold text-brand-forest">{title}</h1>
        {subtitle && <p className="mt-1.5 text-center text-sm text-on-surface-variant leading-relaxed">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

import { inputBaseClass } from '@/components/ui/Input';

export const authInputClass = inputBaseClass;

