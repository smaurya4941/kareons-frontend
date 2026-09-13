import React from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeVariant =
  | 'brand'
  | 'gold'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const VARIANTS: Record<BadgeVariant, string> = {
  brand: 'bg-brand-forest/10 text-brand-forest border-brand-forest/20',
  gold: 'bg-brand-gold/15 text-brand-gold-dark border-brand-gold-dark/25',
  success: 'bg-success-container text-on-success-container border-success/20',
  warning: 'bg-warning-container text-on-warning-container border-warning/25',
  error: 'bg-error-container/60 text-on-error-container border-error/25',
  info: 'bg-info-container text-on-info-container border-info/20',
  neutral: 'bg-surface-container text-on-surface-variant border-soft-border',
};

const SIZES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] font-semibold',
  md: 'px-3 py-1 text-xs font-semibold',
};

export function Badge({ variant = 'neutral', size = 'md', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border leading-tight transition-colors',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
