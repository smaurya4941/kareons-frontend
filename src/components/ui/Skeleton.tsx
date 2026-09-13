import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Accessible, reduced-motion-safe skeleton primitive.
 * Pulses gently by default, remains static if the user prefers reduced motion.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-md bg-surface-container motion-safe:animate-pulse',
        className,
      )}
      {...props}
    />
  );
}
