'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCounts } from '@/components/layout/CountsProvider';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

const LINKS = [
  { href: '/account/orders', label: 'My Orders', icon: 'package_2', group: 'main' },
  { href: '/account', label: 'Profile Information', icon: 'person', group: 'settings' },
  { href: '/account/addresses', label: 'Manage Addresses', icon: 'home_pin', group: 'settings' },
  { href: '/account/wishlist', label: 'My Wishlist', icon: 'favorite', group: 'stuff' },
];

export function AccountSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setCart, setWishlist } = useCounts();

  const isActive = (href: string) =>
    href === '/account' ? pathname === '/account' : pathname.startsWith(href);

  function logout() {
    startTransition(async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCart(0);
      setWishlist(0);
      router.push('/');
      router.refresh();
    });
  }

  return (
    <aside className="w-full flex-shrink-0 lg:w-72">
      <div className="sticky top-20 rounded-2xl border border-border-card bg-surface-card p-4 shadow-botanical-sm">
        <div className="mb-4 flex items-center gap-3 border-b border-border-subtle p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-forest text-base font-bold text-brand-cream shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-medium text-on-surface-variant">Welcome back,</p>
            <h3 className="line-clamp-1 font-display text-base font-bold text-brand-forest">{name}</h3>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink {...LINKS[0]} active={isActive(LINKS[0].href)} />

          <p className="mt-3 flex items-center gap-2 px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-brand-sage-dark">
            <Icon name="person" size={16} className="text-brand-sage-dark" /> Account Settings
          </p>
          {LINKS.filter((l) => l.group === 'settings').map((l) => (
            <SidebarLink key={l.href} {...l} active={isActive(l.href)} indent />
          ))}

          <p className="mt-3 flex items-center gap-2 px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-brand-sage-dark">
            <Icon name="favorite" size={16} className="text-brand-sage-dark" /> Saved &amp; Wishlist
          </p>
          {LINKS.filter((l) => l.group === 'stuff').map((l) => (
            <SidebarLink key={l.href} {...l} active={isActive(l.href)} indent />
          ))}

          <hr className="my-3 border-border-subtle" />
          <button
            type="button"
            onClick={logout}
            disabled={isPending}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-error-container/40 hover:text-error"
          >
            <Icon name="logout" size={18} className="text-outline" />
            {isPending ? 'Logging out…' : 'Sign Out'}
          </button>
        </nav>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
  indent,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition',
        indent && 'ml-2',
        active
          ? 'bg-surface-container-high text-primary'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon name={icon} size={20} className={active ? 'text-primary' : 'text-outline'} />
        {label}
      </span>
      <Icon name="chevron_right" size={18} />
    </Link>
  );
}
