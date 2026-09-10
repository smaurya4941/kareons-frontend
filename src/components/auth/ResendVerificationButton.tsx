'use client';

import { useTransition } from 'react';
import { resendVerificationAction } from '@/lib/actions/auth';
import { useToast } from '@/components/ui/Toast';

export function ResendVerificationButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await resendVerificationAction();
          toast(result.message ?? '', result.success ? 'success' : 'error');
        })
      }
      className="rounded-lg border border-brand-forest px-4 py-2 text-sm font-medium text-brand-forest transition hover:bg-brand-forest hover:text-white disabled:opacity-60"
    >
      {isPending ? 'Sending…' : 'Resend verification email'}
    </button>
  );
}
