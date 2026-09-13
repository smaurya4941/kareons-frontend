import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import type { OrderStatus } from '@/types/api';

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'info',
  packed: 'info',
  shipped: 'info',
  delivered: 'success',
  returned: 'warning',
  cancelled: 'error',
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const variant = STATUS_VARIANT[status] ?? 'neutral';

  return (
    <Badge variant={variant} size="md" className={className}>
      <span className="capitalize">{status}</span>
    </Badge>
  );
}
