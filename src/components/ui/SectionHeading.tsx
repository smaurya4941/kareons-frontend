import Link from 'next/link';
import { Icon } from './Icon';
import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAll?: { label: string; href: string };
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAll,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-6 gap-4 md:mb-8',
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'flex flex-col md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div>
        {eyebrow && (
          <span className="section-eyebrow mb-2 block text-label-sm font-bold uppercase text-brand-gold-dark">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-display-lg-mobile text-brand-forest">{title}</h2>
        {subtitle && <p className="mt-1 text-body-md text-brand-forest/70">{subtitle}</p>}
      </div>
      {viewAll && align === 'left' && (
        <Link
          href={viewAll.href}
          className="flex shrink-0 items-center gap-1 text-label-md font-medium text-brand-gold-dark transition-all hover:gap-2"
        >
          {viewAll.label}
          <Icon name="arrow_forward" size={18} />
        </Link>
      )}
    </div>
  );
}
