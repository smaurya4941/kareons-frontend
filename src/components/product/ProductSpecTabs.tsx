'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/types/api';

type TabKey = 'description' | 'benefits' | 'ingredients' | 'usage';

export function ProductSpecTabs({ product }: { product: Product }) {
  const hasUsage = Boolean(
    product.usage_instructions ||
      product.storage_instructions ||
      product.ayurvedic_reference ||
      product.suitable_for ||
      product.precautions ||
      product.disclaimer,
  );

  const tabs = (
    [
      { key: 'description', label: 'Product Description', show: Boolean(product.description) },
      { key: 'benefits', label: 'Health Benefits', show: Boolean(product.benefits) },
      { key: 'ingredients', label: 'Ingredients', show: Boolean(product.ingredients) },
      { key: 'usage', label: 'Usage & Context', show: hasUsage },
    ] as { key: TabKey; label: string; show: boolean }[]
  ).filter((t) => t.show);

  const [active, setActive] = useState<TabKey>(tabs[0]?.key ?? 'description');

  if (tabs.length === 0) return null;

  return (
    <section className="mx-auto mb-12 max-w-6xl">
      <h2 className="mb-8 font-display text-2xl font-bold text-on-surface">Product Specifications &amp; Details</h2>

      <div className="flex flex-col overflow-hidden rounded-xl border border-soft-border bg-white shadow-sm md:flex-row">
        <div className="hide-scrollbar flex overflow-x-auto border-b border-soft-border bg-surface md:w-1/4 md:flex-col md:border-b-0 md:border-r">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                'whitespace-nowrap px-6 py-5 text-left text-sm font-bold transition-colors md:text-base',
                active === tab.key
                  ? 'border-brand-gold-dark bg-white text-brand-gold-dark md:border-l-4'
                  : 'text-on-surface-variant hover:bg-white/50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[320px] p-6 md:w-3/4 md:p-8">
          {active === 'description' && product.description && (
            <p className="whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant">
              {product.description}
            </p>
          )}
          {active === 'benefits' && product.benefits && (
            <p className="whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant">
              {product.benefits}
            </p>
          )}
          {active === 'ingredients' && product.ingredients && (
            <div
              className="prose prose-sm max-w-none text-on-surface-variant"
              dangerouslySetInnerHTML={{ __html: product.ingredients }}
            />
          )}
          {active === 'usage' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {(product.usage_instructions || product.storage_instructions) && (
                  <SpecCard icon="menu_book" title="Directions">
                    {product.usage_instructions && (
                      <SpecBlock label="How to Use" html={product.usage_instructions} />
                    )}
                    {product.storage_instructions && (
                      <SpecBlock label="Storage" html={product.storage_instructions} />
                    )}
                  </SpecCard>
                )}
                {(product.ayurvedic_reference || product.suitable_for) && (
                  <SpecCard icon="spa" title="Ayurvedic Info">
                    {product.ayurvedic_reference && (
                      <SpecBlock label="Ayurvedic Reference" html={product.ayurvedic_reference} />
                    )}
                    {product.suitable_for && <SpecBlock label="Suitable For" html={product.suitable_for} />}
                  </SpecCard>
                )}
              </div>

              {product.precautions && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-on-surface">
                    <Icon name="warning" size={20} className="text-error" /> Precautions
                  </h3>
                  <div
                    className="prose prose-sm max-w-none rounded-lg border border-error/20 bg-error/5 p-4 text-error"
                    dangerouslySetInnerHTML={{ __html: product.precautions }}
                  />
                </div>
              )}

              {product.disclaimer && (
                <div className="border-t border-soft-border pt-4">
                  <strong className="mb-1 block text-sm uppercase tracking-wider text-on-surface">Disclaimer</strong>
                  <div
                    className="prose prose-sm max-w-none italic text-on-surface-variant"
                    dangerouslySetInnerHTML={{ __html: product.disclaimer }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SpecCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-soft-border bg-surface/50 p-6">
      <h3 className="mb-4 flex items-center gap-2 border-b border-soft-border pb-2 text-lg font-bold text-on-surface">
        <Icon name={icon} size={20} className="text-brand-gold-dark" /> {title}
      </h3>
      {children}
    </div>
  );
}

function SpecBlock({ label, html }: { label: string; html: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <strong className="mb-1 block text-sm uppercase tracking-wider text-brand-gold-dark">{label}</strong>
      <div className="prose prose-sm max-w-none text-on-surface-variant" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
