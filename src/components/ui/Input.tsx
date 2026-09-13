import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  containerClassName?: string;
}

export const inputBaseClass =
  'w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-container disabled:opacity-60';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className, containerClassName, required, disabled, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? (label ? `input-${generatedId}` : undefined);
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-on-surface-variant">
          {label}
          {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          inputBaseClass,
          error && 'border-error focus:border-error focus:ring-error',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-error">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-on-surface-variant">
          {helperText}
        </p>
      )}
    </div>
  );
});
