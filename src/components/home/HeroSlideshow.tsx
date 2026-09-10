'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface HeroSlide {
  desktop: string;
  mobile: string;
  link: string | null;
  title: string | null;
}

const INTERVAL_MS = 6000;

/**
 * Crossfading background slideshow for the homepage hero. Renders only the
 * images + scrim; the headline/CTA sit on top of it (server-rendered in
 * page.tsx) and stay put while the pictures cycle. Auto-advances every 6s,
 * pauses on hover/focus and when the tab is hidden, and honours
 * `prefers-reduced-motion` (no auto-advance, instant swap).
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const go = useCallback(
    (next: number) => setActive((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion.current) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length, paused, active]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const img = (
          <picture>
            {slide.mobile && <source media="(max-width: 768px)" srcSet={slide.mobile} />}
            <img
              src={slide.desktop}
              alt={slide.title ?? ''}
              className="h-full w-full object-cover"
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </picture>
        );
        return (
          <div
            key={i}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.link ? (
              <a href={slide.link} tabIndex={i === active ? 0 : -1} className="block h-full w-full">
                {img}
              </a>
            ) : (
              img
            )}
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-r from-brand-forest via-brand-forest/80 to-brand-forest/30" />

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-6 bg-brand-gold' : 'w-2 bg-brand-cream/50 hover:bg-brand-cream/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
