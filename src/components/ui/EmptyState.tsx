import { Icon } from './Icon';
import { ButtonLink } from './Button';
import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: { label: string; href: string; icon?: string };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-soft-border bg-white px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-herbal-light">
        <Icon name={icon} size={32} className="text-brand-gold-dark" />
      </div>
      <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">{description}</p>
      )}
      {action && (
        <ButtonLink href={action.href} className="mt-6">
          {action.icon && <Icon name={action.icon} size={18} />}
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
