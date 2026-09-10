'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccountAction, updatePasswordAction, updateProfileAction } from '@/lib/actions/profile';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';
import type { User } from '@/types/api';

const inputClass =
  'mt-1 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm outline-none focus:border-primary';

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-bold text-on-surface">{title}</h2>
      {description && <p className="mt-1 text-sm text-on-surface-variant">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProfileForm({ user }: { user: User }) {
  return (
    <div className="max-w-2xl space-y-6">
      <Card title="Profile Information" description="Update your account's name, email and phone number.">
        <ProfileFields user={user} />
      </Card>
      <Card title="Update Password" description="Use a long, random password to stay secure.">
        <PasswordFields />
      </Card>
      <Card title="Delete Account" description="Permanently delete your account and all of its data.">
        <DeleteAccount />
      </Card>
    </div>
  );
}

function ProfileFields({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await updateProfileAction({
            name: String(data.get('name')).trim(),
            // API rule: email must be lowercase; phone is required.
            email: String(data.get('email')).trim().toLowerCase(),
            phone: String(data.get('phone')).trim(),
          });
          toast(result.success ? 'Profile updated.' : result.message ?? 'Could not update profile.', result.success ? 'success' : 'error');
        });
      }}
    >
      <label className="block text-sm font-medium text-on-surface-variant">
        Name
        <input name="name" defaultValue={user.name} required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-on-surface-variant">
        Email
        <input name="email" type="email" defaultValue={user.email} required className={inputClass} />
        {!user.email_verified_at && (
          <span className="mt-1 block text-xs text-amber-600">Email not verified — check your inbox.</span>
        )}
      </label>
      <label className="block text-sm font-medium text-on-surface-variant">
        Phone
        <input name="phone" type="tel" required defaultValue={user.phone ?? ''} className={inputClass} />
      </label>
      <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}

function PasswordFields() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          const result = await updatePasswordAction({
            current_password: String(data.get('current_password')),
            password: String(data.get('password')),
            password_confirmation: String(data.get('password_confirmation')),
          });
          if (result.success) {
            toast('Password updated.', 'success');
            form.reset();
          } else {
            toast(result.message ?? 'Could not update password.', 'error');
          }
        });
      }}
    >
      <label className="block text-sm font-medium text-on-surface-variant">
        Current Password
        <input name="current_password" type="password" required className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-on-surface-variant">
        New Password
        <input name="password" type="password" required minLength={6} className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-on-surface-variant">
        Confirm New Password
        <input name="password_confirmation" type="password" required minLength={6} className={inputClass} />
      </label>
      <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? 'Saving…' : 'Update Password'}
      </button>
    </form>
  );
}

function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-squish inline-flex items-center gap-2 rounded-lg bg-error px-5 py-2.5 text-sm font-medium text-white hover:bg-error/90"
      >
        <Icon name="delete_forever" size={18} /> Delete Account
      </button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-lg border border-error/30 bg-error/5 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await deleteAccountAction(String(data.get('password')));
          if (result.success) {
            router.push('/');
            router.refresh();
          } else {
            toast(result.message ?? 'Could not delete account.', 'error');
          }
        });
      }}
    >
      <p className="text-sm text-error">
        This cannot be undone. Enter your password to permanently delete your account.
      </p>
      <input name="password" type="password" required placeholder="Password" className={inputClass} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? 'Deleting…' : 'Permanently Delete'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-outline-variant px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
