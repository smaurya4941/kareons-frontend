'use client';

import { Icon } from './Icon';
import { cn } from '@/lib/utils/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        'flex items-center overflow-hidden rounded-lg border border-soft-border bg-surface',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Icon name="remove" size={18} />
      </button>
      <span className="w-10 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2 text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Icon name="add" size={18} />
      </button>
    </div>
  );
}
