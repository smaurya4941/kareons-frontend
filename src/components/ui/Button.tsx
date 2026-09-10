import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'outline' | 'gold' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-forest text-white hover:bg-brand-gold hover:text-brand-forest border border-transparent',
  outline:
    'border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white bg-transparent',
  gold: 'bg-brand-gold text-brand-forest hover:bg-brand-gold-dark border border-transparent',
  ghost: 'text-brand-gold-dark hover:text-brand-forest bg-transparent border border-transparent',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-7 py-3 text-sm',
};

const base =
  'btn-squish inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  href,
  children,
  ...props
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}
