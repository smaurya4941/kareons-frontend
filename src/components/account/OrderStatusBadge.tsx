import { cn } from '@/lib/utils/cn';
import type { OrderStatus } from '@/types/api';

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  returned: 'bg-orange-100 text-orange-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', STYLES[status] ?? 'bg-gray-100 text-gray-700')}>
      {status}
    </span>
  );
}
