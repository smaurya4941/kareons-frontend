'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { cn } from '@/lib/utils/cn';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  title?: string;
  action?: { label: string; href: string };
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const PALETTE: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: 'bg-secondary', icon: 'check_circle' },
  error: { bg: 'bg-error', icon: 'error' },
  info: { bg: 'bg-on-surface', icon: 'info' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'success', options: ToastOptions = {}) => {
      const id = nextId.current++;
      setItems((list) => [...list, { id, message, type, ...options }]);
      window.setTimeout(() => dismiss(id), options.duration ?? 3800);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-16 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        {items.map((t) => {
          const palette = PALETTE[t.type];
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-lg',
                palette.bg,
              )}
            >
              <Icon name={palette.icon} size={20} fill className="mt-px shrink-0" />
              <div className="min-w-0 flex-1">
                {t.title && <p className="font-semibold leading-tight">{t.title}</p>}
                <p className={cn('leading-snug', t.title ? 'mt-0.5 text-white/90' : 'font-medium')}>{t.message}</p>
                {t.action && (
                  <Link
                    href={t.action.href}
                    className="mt-1.5 inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-white/80"
                  >
                    {t.action.label}
                    <Icon name="chevron_right" size={16} />
                  </Link>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mr-1 -mt-0.5 shrink-0 text-white/70 hover:text-white"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
