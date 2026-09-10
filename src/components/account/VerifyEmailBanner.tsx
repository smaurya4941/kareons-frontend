'use client';

import { useState, useTransition } from 'react';
import { resendVerificationAction } from '@/lib/actions/auth';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';

export function VerifyEmailBanner({ email }: { email: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  if (dismissed) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Icon name="mark_email_unread" size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Your email <span className="font-medium">{email}</span> isn&apos;t verified yet. Check your inbox for the
          confirmation link.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await resendVerificationAction();
              toast(result.message ?? '', result.success ? 'success' : 'error');
            })
          }
          className="rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
        >
          {isPending ? 'Sending…' : 'Resend email'}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-amber-600 hover:text-amber-800"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
