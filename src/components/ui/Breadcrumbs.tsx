import Link from 'next/link';
import { Icon } from './Icon';
import { cn } from '@/lib/utils/cn';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-6 text-sm text-on-surface-variant', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-brand-gold-dark">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && 'font-medium text-on-surface')} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <Icon name="chevron_right" size={16} className="text-on-surface-variant" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
