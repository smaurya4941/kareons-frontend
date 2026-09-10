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
      <div className="sticky top-20 rounded-xl border border-outline-variant bg-surface p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-3 border-b border-outline-variant p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant">Hello,</p>
            <h3 className="line-clamp-1 text-base font-bold leading-tight text-on-surface">{name}</h3>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink {...LINKS[0]} active={isActive(LINKS[0].href)} />

          <p className="mt-2 flex items-center gap-2.5 px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            <Icon name="person" size={18} className="text-outline" /> Account Settings
          </p>
          {LINKS.filter((l) => l.group === 'settings').map((l) => (
            <SidebarLink key={l.href} {...l} active={isActive(l.href)} indent />
          ))}

          <p className="mt-2 flex items-center gap-2.5 px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            <Icon name="account_balance_wallet" size={18} className="text-outline" /> My Stuff
          </p>
          {LINKS.filter((l) => l.group === 'stuff').map((l) => (
            <SidebarLink key={l.href} {...l} active={isActive(l.href)} indent />
          ))}

          <hr className="my-3 border-outline-variant" />
          <button
            type="button"
            onClick={logout}
            disabled={isPending}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition hover:bg-error-container hover:text-error"
          >
            <Icon name="power_settings_new" size={20} className="text-outline" />
            {isPending ? 'Logging out…' : 'Logout'}
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
