'use server';

import { revalidatePath } from 'next/cache';
import * as addressesApi from '@/lib/api/addresses';
import type { AddressPayload } from '@/lib/api/addresses';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export async function createAddressAction(payload: AddressPayload): Promise<ActionResult> {
  try {
    await addressesApi.createAddress(payload);
    revalidatePath('/account/addresses');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not save address.' };
  }
}

export async function updateAddressAction(id: number, payload: AddressPayload): Promise<ActionResult> {
  try {
    await addressesApi.updateAddress(id, payload);
    revalidatePath('/account/addresses');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not update address.' };
  }
}

export async function deleteAddressAction(id: number): Promise<ActionResult> {
  try {
    await addressesApi.deleteAddress(id);
    revalidatePath('/account/addresses');
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not delete address.' };
  }
}
