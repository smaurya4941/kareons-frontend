'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { requestReturnAction } from '@/lib/actions/orders';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';

const REASONS = [
  'Product damaged or defective',
  'Wrong item received',
  'Item not as described',
  'Quality not as expected',
  'Received extra item',
  'Other',
];

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm outline-none focus:border-primary';

export function ReturnRequestForm({ orderId, windowDays = 7 }: { orderId: number; windowDays?: number }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'refund' | 'replacement'>('refund');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  if (!open) {
    return (
      <div>
        <p className="mb-3 text-xs text-on-surface-variant">
          Eligible for return within {windowDays} days of delivery.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-squish inline-flex items-center gap-2 rounded-lg border border-brand-forest px-4 py-2 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-white"
        >
          <Icon name="assignment_return" size={18} /> Request Return / Replacement
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await requestReturnAction(orderId, {
            type,
            reason: String(data.get('reason')),
            customer_note: String(data.get('customer_note') || '') || undefined,
          });
          if (result.success) {
            toast('Your return request has been submitted.', 'success');
            router.refresh();
          } else {
            toast(result.message ?? 'Could not submit request.', 'error');
          }
        });
      }}
    >
      <div>
        <span className="mb-2 block text-sm font-medium text-on-surface-variant">Request type</span>
        <div className="flex gap-4">
          {(['refund', 'replacement'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm capitalize">
              <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} className="accent-primary" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <label className="block text-sm font-medium text-on-surface-variant">
        Reason
        <select name="reason" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Select a reason
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-on-surface-variant">
        Additional note (optional)
        <textarea name="customer_note" rows={3} maxLength={1000} className={inputClass} />
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
          {isPending ? 'Submitting…' : 'Submit Request'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-outline-variant px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
