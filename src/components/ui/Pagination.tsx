import Link from 'next/link';
import { Icon } from './Icon';
import { cn } from '@/lib/utils/cn';

export function Pagination({
  currentPage,
  lastPage,
  searchParams,
  basePath = '',
}: {
  currentPage: number;
  lastPage: number;
  searchParams: Record<string, string | undefined>;
  basePath?: string;
}) {
  function hrefFor(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') params.set(key, value);
    }
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ''}` || '?';
  }

  const pages: number[] = [];
  const from = Math.max(1, currentPage - 2);
  const to = Math.min(lastPage, from + 4);
  for (let i = from; i <= to; i++) pages.push(i);

  const linkBase = 'flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors';

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={hrefFor(currentPage - 1)} rel="prev" className={cn(linkBase, 'border-soft-border hover:border-brand-gold')}>
          <Icon name="chevron_left" size={18} />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={cn(
            linkBase,
            p === currentPage
              ? 'border-brand-forest bg-brand-forest text-white'
              : 'border-soft-border text-on-surface hover:border-brand-gold',
          )}
        >
          {p}
        </Link>
      ))}
      {currentPage < lastPage && (
        <Link href={hrefFor(currentPage + 1)} rel="next" className={cn(linkBase, 'border-soft-border hover:border-brand-gold')}>
          <Icon name="chevron_right" size={18} />
        </Link>
      )}
    </nav>
  );
}
