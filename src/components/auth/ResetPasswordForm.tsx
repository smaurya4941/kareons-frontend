'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetPasswordAction } from '@/lib/actions/auth';
import { authInputClass } from './AuthLayout';

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await resetPasswordAction({
            token,
            email,
            password: String(formData.get('password')),
            password_confirmation: String(formData.get('password_confirmation')),
          });
          setMessage(result.message ?? null);
          setIsSuccess(result.success);
          if (result.success) setTimeout(() => router.push('/login'), 1500);
        });
      }}
    >
      <p className="text-xs text-on-surface-variant">Resetting password for {email}</p>
      <label className="text-sm font-medium text-on-surface-variant">
        New Password
        <input name="password" type="password" required minLength={6} autoComplete="new-password" className={`mt-1 ${authInputClass}`} />
      </label>
      <label className="text-sm font-medium text-on-surface-variant">
        Confirm New Password
        <input
          name="password_confirmation"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={`mt-1 ${authInputClass}`}
        />
      </label>

      {message && <p className={`text-sm ${isSuccess ? 'text-secondary' : 'text-error'}`}>{message}</p>}

      <button type="submit" disabled={isPending} className="btn-primary mt-1 w-full disabled:opacity-60">
        {isPending ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  );
}
