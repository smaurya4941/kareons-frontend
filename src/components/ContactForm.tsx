'use client';

import { useState, useTransition } from 'react';
import { submitContactAction } from '@/lib/actions/contact';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';

const inputClass =
  'w-full rounded-lg border border-soft-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-gold-dark';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-secondary/30 bg-secondary-container/40 p-5 text-sm">
        <Icon name="check_circle" size={22} className="text-secondary" />
        <p className="text-on-surface">Thank you! Your inquiry has been sent — we&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-soft-border bg-surface p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          const result = await submitContactAction({
            name: String(data.get('name')),
            email: String(data.get('email')),
            subject: String(data.get('subject') || ''),
            message: String(data.get('message')),
          });
          if (result.success) {
            setSent(true);
          } else {
            toast(result.message ?? 'Could not send your message.', 'error');
          }
        });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface-variant">Name</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface-variant">Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-on-surface-variant">Subject</label>
        <input name="subject" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-on-surface-variant">Message</label>
        <textarea name="message" required rows={5} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full disabled:opacity-60"
      >
        {isPending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
