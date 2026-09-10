import { authedFetch } from './server';
import type { Address, ApiCollection, ApiResource } from '@/types/api';

export interface AddressPayload {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default?: boolean;
}

export async function getAddresses(): Promise<Address[]> {
  const { data } = await authedFetch<ApiCollection<Address>>('/addresses', { cache: 'no-store' });
  return data;
}

export async function createAddress(payload: AddressPayload): Promise<Address> {
  const { data } = await authedFetch<ApiResource<Address>>('/addresses', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export async function updateAddress(id: number, payload: AddressPayload): Promise<Address> {
  const { data } = await authedFetch<ApiResource<Address>>(`/addresses/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return data;
}

export async function deleteAddress(id: number): Promise<void> {
  await authedFetch(`/addresses/${id}`, { method: 'DELETE' });
}
