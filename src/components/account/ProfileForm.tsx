'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccountAction, updatePasswordAction, updateProfileAction } from '@/lib/actions/profile';
import { useToast } from '@/components/ui/Toast';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import type { User } from '@/types/api';

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border-card bg-surface-card p-6 shadow-botanical-sm">
      <h2 className="font-display text-lg font-bold text-brand-forest">{title}</h2>
      {description && <p className="mt-1 text-sm text-on-surface-variant">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ProfileForm({ user }: { user: User }) {
  return (
    <div className="max-w-2xl space-y-6">
      <Card title="Personal Information" description="Update your personal details and contact phone number.">
        <ProfileFields user={user} />
      </Card>
      <Card title="Security & Password" description="Ensure your account is using a secure, long password.">
        <PasswordFields />
      </Card>
      <Card title="Danger Zone" description="Permanently delete your Kare-Ons account and all associated order history.">
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
      <Input label="Name" name="name" defaultValue={user.name} required />
      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={user.email}
        required
        helperText={!user.email_verified_at ? 'Email not verified — check your inbox.' : undefined}
      />
      <Input label="Phone" name="phone" type="tel" defaultValue={user.phone ?? ''} required />
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
      <Input label="Current Password" name="current_password" type="password" required />
      <Input label="New Password" name="password" type="password" required minLength={6} />
      <Input label="Confirm New Password" name="password_confirmation" type="password" required minLength={6} />
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
      className="space-y-4 rounded-xl border border-error/30 bg-error/5 p-5"
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
      <p className="text-sm font-medium text-error">
        This action cannot be undone. Please enter your password to confirm permanent account deletion.
      </p>
      <Input name="password" type="password" required placeholder="Enter password to confirm" aria-label="Confirm password to delete account" />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="btn-squish rounded-xl bg-error px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 shadow-sm"
        >
          {isPending ? 'Deleting…' : 'Permanently Delete'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-subtle/80"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
