import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface TrustBadgeProps {
  icon: string;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrustBadge({
  icon,
  label,
  description,
  size = 'md',
  className,
}: TrustBadgeProps) {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-border-card bg-surface-subtle transition-colors',
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-4 py-2 text-base',
        className,
      )}
    >
      <Icon
        name={icon}
        size={iconSizes[size]}
        fill
        className="shrink-0 text-brand-gold-dark"
      />
      <div className="min-w-0">
        <p className="font-medium leading-tight text-on-surface">{label}</p>
        {description && (
          <p className="text-[11px] leading-tight text-on-surface-variant">{description}</p>
        )}
      </div>
    </div>
  );
}
