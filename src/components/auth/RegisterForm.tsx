'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setFieldErrors({});
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: String(formData.get('name') ?? '').trim(),
              // The API rejects a non-lowercase email (rule: 'lowercase').
              email: String(formData.get('email') ?? '').trim().toLowerCase(),
              phone: String(formData.get('phone') ?? '').trim(),
              password: formData.get('password'),
              password_confirmation: formData.get('password_confirmation'),
            }),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({ message: 'Registration failed.' }));
            setError(body.message ?? 'Registration failed.');
            setFieldErrors(body.errors ?? {});
            return;
          }

          router.push('/account');
          router.refresh();
        });
      }}
    >
      <Input
        label="Full Name"
        name="name"
        required
        autoComplete="name"
        error={fieldErrors.name?.[0]}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={fieldErrors.email?.[0]}
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        error={fieldErrors.phone?.[0]}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          error={fieldErrors.password?.[0]}
        />
        <Input
          label="Confirm Password"
          name="password_confirmation"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          error={fieldErrors.password_confirmation?.[0]}
        />
      </div>

      {error && <p className="text-sm font-medium text-error">{error}</p>}

      <button type="submit" disabled={isPending} className="btn-primary mt-1 w-full disabled:opacity-60">
        {isPending ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="mt-1 text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-gold-dark hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
