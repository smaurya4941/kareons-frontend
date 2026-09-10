import { apiFetch } from './client';
import { authedFetch } from './server';
import type { ApiResource, AuthResponse, User } from '@/types/api';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
}

/** Called only from Route Handlers (src/app/api/auth/*) — never from a Client Component. */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiFetch<ApiResource<AuthResponse>>('/auth/register', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiFetch<ApiResource<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export async function logout(): Promise<void> {
  await authedFetch('/auth/logout', { method: 'POST' });
}

export async function forgotPassword(email: string): Promise<void> {
  await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiFetch('/auth/reset-password', { method: 'POST', body: payload });
}

export async function resendVerificationEmail(): Promise<void> {
  await authedFetch('/auth/email/resend', { method: 'POST' });
}
