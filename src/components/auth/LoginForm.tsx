'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { getSafeInternalRedirect } from '@/lib/utils/url';

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setError(null);

        startTransition(async () => {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({ message: 'Login failed.' }));
            setError(body.message ?? 'Login failed.');
            return;
          }

          const target = getSafeInternalRedirect(redirectTo, '/account');
          router.push(target);
          router.refresh();
        });
      }}
    >
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      {error && <p className="text-sm font-medium text-error">{error}</p>}

      <button type="submit" disabled={isPending} className="btn-primary mt-1 w-full disabled:opacity-60">
        {isPending ? 'Logging in…' : 'Log In'}
      </button>

      <div className="mt-1 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-brand-gold-dark hover:underline">
          Forgot password?
        </Link>
        <Link href="/register" className="text-brand-gold-dark hover:underline">
          Create an account
        </Link>
      </div>
    </form>
  );
}
