'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { suggestProducts, type SearchSuggestion } from '@/lib/api/search';
import { Icon } from '@/components/ui/Icon';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const q = query.trim();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await suggestProducts(q);
        setResults(res.results);
        setHighlight(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  const displayResults = query.trim().length < 2 ? [] : results;

  function goToShop() {
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  }

  function onEnter() {
    if (highlight >= 0 && displayResults[highlight]) {
      setOpen(false);
      router.push(`/product/${displayResults[highlight].slug}`);
    } else if (query.trim().length >= 2) {
      goToShop();
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {!open ? (
        <button
          type="button"
          aria-label="Search products"
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 10);
          }}
          className="flex items-center text-on-surface transition hover:text-brand-gold-dark"
        >
          <Icon name="search" size={22} />
        </button>
      ) : (
        <div className="absolute right-0 top-1/2 z-50 -translate-y-1/2">
          <div className="flex w-[78vw] max-w-sm items-center overflow-hidden rounded-full border border-outline-variant bg-white shadow-lg md:w-80">
            <Icon name="search" size={20} className="ml-3 text-on-surface-variant" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlight((h) => Math.min(displayResults.length - 1, h + 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlight((h) => Math.max(-1, h - 1));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  onEnter();
                }
              }}
              placeholder="Search herbal products..."
              autoComplete="off"
              className="flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setOpen(false)}
              className="pr-3 text-on-surface-variant hover:text-error"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {query.trim().length >= 2 && (
            <div className="absolute right-0 mt-2 w-[78vw] max-w-sm overflow-hidden rounded-xl border border-outline-variant bg-white shadow-xl md:w-80">
              {loading && displayResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-on-surface-variant">Searching…</p>
              ) : displayResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-on-surface-variant">No matches. Press Enter to search all.</p>
              ) : (
                <ul className="max-h-96 overflow-y-auto py-1">
                  {displayResults.map((r, i) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlight(i)}
                        onClick={() => {
                          setOpen(false);
                          router.push(`/product/${r.slug}`);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 px-3 py-2 text-left',
                          highlight === i && 'bg-surface-container',
                        )}
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-brand-cream">
                          {r.image && <Image src={r.image} alt="" fill className="object-cover" sizes="40px" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-on-surface">{r.name}</span>
                          <span className="block text-xs text-on-surface-variant">
                            {r.category ?? 'Ayurvedic'} · ₹{formatMoney(r.on_sale && r.original_price ? r.price : r.price)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={goToShop}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-brand-gold-dark hover:underline"
                    >
                      See all results for “{query.trim()}”
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
