'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface ProductGalleryProps {
  mainImage: string | null;
  images: { id: number; url: string }[];
  name: string;
  onSale?: boolean;
}

export function ProductGallery({ mainImage, images, name, onSale }: ProductGalleryProps) {
  const all = [mainImage, ...images.map((i) => i.url)].filter((s): s is string => Boolean(s));
  const [active, setActive] = useState(all[0] ?? null);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-soft-border bg-white p-4 shadow-sm">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #2d5a27 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {active ? (
          <Image
            src={active}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="relative z-10 object-contain p-4 transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <Icon name="image" size={56} className="text-brand-sage" />
        )}
        {onSale && (
          <span className="absolute left-3 top-3 z-20 rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-error backdrop-blur-sm">
            SALE
          </span>
        )}
      </div>

      {all.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {all.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(src)}
              aria-label={`View image ${i + 1} of ${all.length}`}
              aria-pressed={active === src}
              className={cn(
                'aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary',
                active === src ? 'border-brand-gold-dark shadow-sm' : 'border-soft-border hover:border-brand-gold-dark',
              )}
            >
              <Image src={src} alt={`${name} thumbnail ${i + 1}`} width={100} height={100} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
