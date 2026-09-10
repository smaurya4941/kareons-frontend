'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/lib/actions/auth';
import { authInputClass } from './AuthLayout';

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const email = String(new FormData(event.currentTarget).get('email'));
        startTransition(async () => {
          const result = await forgotPasswordAction(email);
          setMessage(result.message ?? null);
          setIsSuccess(result.success);
        });
      }}
    >
      <label className="text-sm font-medium text-on-surface-variant">
        Email
        <input name="email" type="email" required className={`mt-1 ${authInputClass}`} />
      </label>

      {message && <p className={`text-sm ${isSuccess ? 'text-secondary' : 'text-error'}`}>{message}</p>}

      <button type="submit" disabled={isPending} className="btn-primary mt-1 w-full disabled:opacity-60">
        {isPending ? 'Sending…' : 'Send Reset Link'}
      </button>

      <Link href="/login" className="mt-1 text-center text-sm text-brand-gold-dark hover:underline">
        Back to login
      </Link>
    </form>
  );
}
