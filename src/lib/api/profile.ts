import { authedFetch } from './server';
import type { ApiResource, User } from '@/types/api';

export async function getProfile(): Promise<User> {
  const { data } = await authedFetch<ApiResource<User>>('/profile', { cache: 'no-store' });
  return data;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  email?: string;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await authedFetch<ApiResource<User>>('/profile', {
    method: 'PATCH',
    body: payload,
  });
  return data;
}

export async function updatePassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await authedFetch('/profile/password', { method: 'PUT', body: payload });
}

export async function deleteAccount(password: string): Promise<void> {
  await authedFetch('/profile', { method: 'DELETE', body: { password } });
}
