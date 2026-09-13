'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

import { useFocusTrap } from '@/hooks/useFocusTrap';

interface Props {
  categories: { id: number; name: string; slug: string }[];
  activeParams: Record<string, string | undefined>;
  /** Hide the category control (used on /category/[slug] where it's fixed). */
  hideCategories?: boolean;
}

const CERT_CHIPS = ['GMP Certified', 'Ayush Certified', '100% Vegan'];

export function ShopFilters({ categories, activeParams, hideCategories = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const filterDrawerRef = useFocusTrap<HTMLDivElement>({
    active: mobileOpen,
    onClose: () => setMobileOpen(false),
    lockScroll: true,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-expanded={mobileOpen}
        aria-controls="mobile-filter-drawer"
        className="inline-flex items-center gap-1.5 rounded-xl border border-border-card bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-forest shadow-botanical-sm hover:border-brand-gold/50 transition-colors lg:hidden"
      >
        <Icon name="tune" size={18} />
        Filter &amp; Refine
      </button>

      <aside className="hidden w-full flex-shrink-0 lg:block lg:w-64">
        <div className="sticky top-24 rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
          <FilterForm categories={categories} activeParams={activeParams} hideCategories={hideCategories} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div
            id="mobile-filter-drawer"
            ref={filterDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-surface-card p-6 shadow-botanical-lg"
          >
            <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-display text-base font-bold text-brand-forest">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-subtle hover:text-on-surface"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <FilterForm
              categories={categories}
              activeParams={activeParams}
              hideCategories={hideCategories}
              onApply={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

function FilterForm({
  categories,
  activeParams,
  hideCategories,
  onApply,
}: Props & { onApply?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(activeParams.search ?? '');
  const [minPrice, setMinPrice] = useState(activeParams.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState(activeParams.max_price ?? '');

  const [prevParams, setPrevParams] = useState(activeParams);
  if (
    prevParams.search !== activeParams.search ||
    prevParams.min_price !== activeParams.min_price ||
    prevParams.max_price !== activeParams.max_price
  ) {
    setPrevParams(activeParams);
    setSearch(activeParams.search ?? '');
    setMinPrice(activeParams.min_price ?? '');
    setMaxPrice(activeParams.max_price ?? '');
  }

  function applyParams(overrides: Record<string, string | undefined>) {
    const next = new URLSearchParams();
    const merged = { ...activeParams, ...overrides, page: undefined };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    onApply?.();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Search</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyParams({ search: search || undefined });
          }}
          className="relative"
        >
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search herbal blends..."
            className="w-full rounded-xl border border-border-card bg-surface-subtle/50 py-2 pl-9 pr-3 text-sm text-on-surface outline-none transition-colors focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
          />
        </form>
      </div>

      {!hideCategories && (
        <>
          <hr className="border-border-subtle" />
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Categories</h3>
            <div className="space-y-2">
              <CategoryRadio
                label="All Formulations"
                checked={!activeParams.category}
                onChange={() => applyParams({ category: undefined })}
              />
              {categories.map((c) => (
                <CategoryRadio
                  key={c.id}
                  label={c.name}
                  checked={activeParams.category === c.slug}
                  onChange={() => applyParams({ category: c.slug })}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-border-subtle" />
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Price Range (₹)</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min ₹"
              className="w-full rounded-xl border border-border-card bg-surface-subtle/50 px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max ₹"
              className="w-full rounded-xl border border-border-card bg-surface-subtle/50 px-3 py-2 text-sm text-on-surface outline-none transition-colors focus:border-brand-forest focus:ring-1 focus:ring-brand-forest"
            />
          </div>
          <button
            type="button"
            onClick={() => applyParams({ min_price: minPrice || undefined, max_price: maxPrice || undefined })}
            className="btn-squish w-full rounded-xl bg-brand-forest/10 border border-brand-forest/20 py-2 text-xs font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-white"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      <hr className="border-border-subtle" />
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold-dark">Quality Standards</h3>
        <div className="flex flex-wrap gap-1.5">
          {CERT_CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                i === 0
                  ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-gold-dark'
                  : 'border-border-subtle bg-surface-subtle text-on-surface-variant',
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand-gold-dark"
      />
      <span
        className={cn(
          'text-sm transition-colors',
          checked ? 'font-medium text-brand-gold-dark' : 'text-on-surface-variant group-hover:text-brand-gold-dark',
        )}
      >
        {label}
      </span>
    </label>
  );
}

export function SortSelect({ activeParams }: { activeParams: Record<string, string | undefined> }) {
  const router = useRouter();
  const pathname = usePathname();

  const options = [
    { value: 'latest', label: 'Latest Arrivals' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="hidden text-sm text-on-surface-variant sm:block">
        Sort by:
      </label>
      <select
        id="sort"
        value={activeParams.sort ?? 'latest'}
        onChange={(e) => {
          const next = new URLSearchParams();
          for (const [k, v] of Object.entries({ ...activeParams, sort: e.target.value, page: undefined })) {
            if (v) next.set(k, v as string);
          }
          router.push(`${pathname}?${next.toString()}`);
        }}
        className="cursor-pointer border-0 bg-transparent pr-8 text-sm font-medium text-brand-gold-dark outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
