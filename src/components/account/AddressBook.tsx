'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAddressAction,
  deleteAddressAction,
  updateAddressAction,
} from '@/lib/actions/addresses';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import type { Address } from '@/types/api';
import type { AddressPayload } from '@/lib/api/addresses';

type FormState = 'closed' | 'new' | number; // number = editing that address id

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const [form, setForm] = useState<FormState>(addresses.length === 0 ? 'new' : 'closed');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  function submit(payload: AddressPayload, id?: number) {
    startTransition(async () => {
      const result = id
        ? await updateAddressAction(id, payload)
        : await createAddressAction(payload);
      if (result.success) {
        toast(id ? 'Address updated.' : 'Address saved.', 'success');
        setForm('closed');
        router.refresh();
      } else {
        toast(result.message ?? 'Could not save address.', 'error');
      }
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      const result = await deleteAddressAction(id);
      if (result.success) {
        toast('Address removed.', 'info');
        router.refresh();
      } else {
        toast(result.message ?? 'Could not delete address.', 'error');
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((address) =>
          form === address.id ? (
            <AddressForm
              key={address.id}
              address={address}
              pending={isPending}
              onCancel={() => setForm('closed')}
              onSubmit={(payload) => submit(payload, address.id)}
            />
          ) : (
            <div
              key={address.id}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl border bg-surface-card p-5 text-sm shadow-botanical-sm transition-all',
                address.is_default
                  ? 'border-brand-gold/50 bg-gradient-to-br from-surface-card to-herbal-light/30'
                  : 'border-border-card hover:border-brand-gold/40',
              )}
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest">
                      <Icon name="home" size={16} />
                    </span>
                    <strong className="font-semibold text-on-surface">{address.full_name}</strong>
                  </div>
                  {address.is_default && (
                    <Badge variant="brand" size="sm">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                  <br />
                  {address.city}, {address.state} — {address.postal_code}
                  <br />
                  <span className="font-medium text-on-surface">Phone:</span> {address.phone}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-border-subtle pt-3">
                <button
                  type="button"
                  onClick={() => setForm(address.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-forest hover:text-brand-forest/80 hover:underline"
                >
                  <Icon name="edit" size={15} /> Edit
                </button>
                <span className="text-border-subtle">·</span>
                <button
                  type="button"
                  onClick={() => remove(address.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-error hover:underline disabled:opacity-50"
                >
                  <Icon name="delete" size={15} /> Delete
                </button>
              </div>
            </div>
          ),
        )}

        {form === 'new' && (
          <AddressForm pending={isPending} onCancel={() => setForm('closed')} onSubmit={(payload) => submit(payload)} />
        )}
      </div>

      {form === 'closed' && (
        <button
          type="button"
          onClick={() => setForm('new')}
          className="btn-squish inline-flex items-center gap-2 rounded-xl border border-brand-forest bg-brand-forest/5 px-5 py-2.5 text-sm font-semibold text-brand-forest hover:bg-brand-forest hover:text-white transition-all shadow-botanical-sm"
        >
          <Icon name="add_circle" size={18} /> Add New Address
        </button>
      )}
    </div>
  );
}

function AddressForm({
  address,
  pending,
  onCancel,
  onSubmit,
}: {
  address?: Address;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (payload: AddressPayload) => void;
}) {
  return (
    <form
      className="col-span-full grid grid-cols-1 gap-4 rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-md sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSubmit({
          full_name: String(data.get('full_name')),
          phone: String(data.get('phone')),
          address_line_1: String(data.get('address_line_1')),
          address_line_2: String(data.get('address_line_2') || '') || undefined,
          city: String(data.get('city')),
          state: String(data.get('state')),
          postal_code: String(data.get('postal_code')),
          is_default: data.get('is_default') === 'on',
        });
      }}
    >
      <div className="col-span-full border-b border-border-subtle pb-2">
        <h3 className="font-display text-base font-bold text-brand-forest">
          {address ? 'Edit Address' : 'Add New Delivery Address'}
        </h3>
      </div>
      <Input label="Full Name" name="full_name" required defaultValue={address?.full_name} />
      <Input label="Phone" name="phone" type="tel" required defaultValue={address?.phone} />
      <Input
        label="Address Line 1"
        name="address_line_1"
        required
        defaultValue={address?.address_line_1}
        containerClassName="sm:col-span-2"
      />
      <Input
        label="Address Line 2 (Optional)"
        name="address_line_2"
        defaultValue={address?.address_line_2 ?? ''}
        containerClassName="sm:col-span-2"
      />
      <Input label="City" name="city" required defaultValue={address?.city} />
      <Input label="State" name="state" required defaultValue={address?.state} />
      <Input
        label="PIN Code"
        name="postal_code"
        required
        defaultValue={address?.postal_code}
      />
      <label className="flex items-center gap-2 text-sm text-on-surface-variant sm:col-span-2 cursor-pointer select-none">
        <input type="checkbox" name="is_default" defaultChecked={address?.is_default} className="h-4 w-4 rounded accent-brand-forest" />
        Set as default delivery address
      </label>
      <div className="flex gap-3 sm:col-span-2 pt-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? 'Saving…' : 'Save Address'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-subtle/80"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
