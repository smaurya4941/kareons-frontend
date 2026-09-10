'use server';

import * as pagesApi from '@/lib/api/pages';
import type { ContactPayload } from '@/lib/api/pages';
import { ApiError } from '@/lib/api/client';
import type { ActionResult } from './cart';

export async function submitContactAction(payload: ContactPayload): Promise<ActionResult> {
  try {
    await pagesApi.submitContact(payload);
    return { success: true, message: 'Thank you! Your inquiry has been sent.' };
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : 'Could not send your message.' };
  }
}
