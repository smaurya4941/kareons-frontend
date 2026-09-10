'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface Props {
  categories: { id: number; name: string; slug: string }[];
  activeParams: Record<string, string | undefined>;
  /** Hide the category control (used on /category/[slug] where it's fixed). */
  hideCategories?: boolean;
}

const CERT_CHIPS = ['GMP Certified', 'Ayush Certified', '100% Vegan'];

export function ShopFilters({ categories, activeParams, hideCategories = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-1 text-sm font-medium text-brand-gold-dark lg:hidden"
      >
        <Icon name="filter_list" size={20} />
        Filters
      </button>

      <aside className="hidden w-full flex-shrink-0 lg:block lg:w-64">
        <div className="sticky top-20 rounded-lg border border-soft-border bg-white p-5 shadow-sm">
          <FilterForm categories={categories} activeParams={activeParams} hideCategories={hideCategories} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/25" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-on-surface">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
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

  useEffect(() => {
    setSearch(activeParams.search ?? '');
    setMinPrice(activeParams.min_price ?? '');
    setMaxPrice(activeParams.max_price ?? '');
  }, [activeParams.search, activeParams.min_price, activeParams.max_price]);

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
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface">Search Products</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyParams({ search: search || undefined });
          }}
          className="relative"
        >
          <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Kare Ons..."
            className="w-full rounded border border-soft-border py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-gold-dark"
          />
        </form>
      </div>

      {!hideCategories && (
        <>
          <hr className="border-soft-border" />
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface">Categories</h3>
            <div className="space-y-2.5">
              <CategoryRadio
                label="All Products"
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

      <hr className="border-soft-border" />
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min ₹"
              className="w-full rounded border border-soft-border px-3 py-2 text-sm outline-none focus:border-brand-gold-dark"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max ₹"
              className="w-full rounded border border-soft-border px-3 py-2 text-sm outline-none focus:border-brand-gold-dark"
            />
          </div>
          <button
            type="button"
            onClick={() => applyParams({ min_price: minPrice || undefined, max_price: maxPrice || undefined })}
            className="w-full rounded border border-soft-border bg-surface-container py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      <hr className="border-soft-border" />
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface">Certifications</h3>
        <div className="flex flex-wrap gap-2">
          {CERT_CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                i < 2
                  ? 'border-brand-gold/20 bg-herbal-light text-brand-gold-dark'
                  : 'border-soft-border bg-surface-container text-on-surface-variant',
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
