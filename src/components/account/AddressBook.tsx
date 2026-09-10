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
import type { Address } from '@/types/api';
import type { AddressPayload } from '@/lib/api/addresses';

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm outline-none focus:border-primary';

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
    <div className="space-y-4">
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
            <div key={address.id} className="rounded-xl border border-outline-variant bg-surface p-4 text-sm shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <strong className="text-on-surface">{address.full_name}</strong>
                {address.is_default && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    Default
                  </span>
                )}
              </div>
              <p className="text-on-surface-variant">
                {address.address_line_1}
                {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                <br />
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.phone}
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(address.id)}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Icon name="edit" size={15} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(address.id)}
                  disabled={isPending}
                  className="flex items-center gap-1 text-xs font-medium text-error hover:underline"
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
          className="btn-squish inline-flex items-center gap-2 rounded-lg border border-brand-forest px-4 py-2 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-white"
        >
          <Icon name="add" size={18} /> Add New Address
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
      className="col-span-full grid grid-cols-1 gap-3 rounded-xl border border-outline-variant bg-surface p-4 shadow-sm sm:grid-cols-2"
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
      <input name="full_name" required placeholder="Full name" defaultValue={address?.full_name} className={inputClass} />
      <input name="phone" required placeholder="Phone" defaultValue={address?.phone} className={inputClass} />
      <input
        name="address_line_1"
        required
        placeholder="Address line 1"
        defaultValue={address?.address_line_1}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        name="address_line_2"
        placeholder="Address line 2 (optional)"
        defaultValue={address?.address_line_2 ?? ''}
        className={`${inputClass} sm:col-span-2`}
      />
      <input name="city" required placeholder="City" defaultValue={address?.city} className={inputClass} />
      <input name="state" required placeholder="State" defaultValue={address?.state} className={inputClass} />
      <input
        name="postal_code"
        required
        placeholder="PIN code"
        defaultValue={address?.postal_code}
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-on-surface-variant sm:col-span-2">
        <input type="checkbox" name="is_default" defaultChecked={address?.is_default} className="accent-primary" />
        Set as default address
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? 'Saving…' : 'Save Address'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-outline-variant px-4 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
