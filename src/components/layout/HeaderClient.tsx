'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Category } from '@/types/api';
import { Icon } from '@/components/ui/Icon';
import { SearchBox } from './SearchBox';
import { CartBadge, WishlistBadge } from './CartBadge';
import { cn } from '@/lib/utils/cn';

interface HeaderClientProps {
  logo: string | null;
  siteName: string;
  categories: Pick<Category, 'id' | 'name' | 'slug'>[];
  authenticated: boolean;
}

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function HeaderClient({ logo, siteName, categories, authenticated }: HeaderClientProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center">
          {logo ? (
            <Image src={logo} alt={`${siteName} logo`} width={140} height={36} className="h-9 w-auto object-contain" />
          ) : (
            <span className="font-display text-lg font-bold text-brand-forest">{siteName}</span>
          )}
        </Link>

        <div className="hidden h-full items-center gap-6 md:flex">
          <NavItem href="/" label="Home" active={isActive('/')} />
          <NavItem href="/shop" label="Shop" active={pathname === '/shop'} />

          <div className="group relative flex h-full items-center">
            <button className="flex items-center gap-1 text-sm font-medium text-on-surface transition-colors hover:text-brand-gold-dark">
              Categories
              <Icon name="expand_more" size={16} />
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-64 overflow-hidden rounded-b-lg border border-outline-variant bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col py-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container hover:text-brand-gold-dark"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavItem href="/about" label="About" active={isActive('/about')} />
          <NavItem href="/blog" label="Blog" active={isActive('/blog')} />
          <NavItem href="/contact" label="Contact" active={isActive('/contact')} />
        </div>

        <div className="flex items-center gap-4">
          <SearchBox />

          <Link
            href="/account/wishlist"
            className="relative text-on-surface transition hover:text-brand-gold-dark"
            aria-label="Wishlist"
          >
            <Icon name="favorite" size={22} />
            <WishlistBadge />
          </Link>

          <Link href="/cart" className="relative text-on-surface transition hover:text-brand-gold-dark" aria-label="Cart">
            <Icon name="shopping_cart" size={22} />
            <CartBadge />
          </Link>

          {authenticated ? (
            <Link
              href="/account"
              className="ml-1 flex items-center gap-1 text-on-surface transition hover:text-brand-gold-dark"
            >
              <Icon name="account_circle" size={22} />
              <span className="hidden text-sm font-medium md:inline">Account</span>
            </Link>
          ) : (
            <div className="ml-1 hidden items-center gap-4 md:flex">
              <Link href="/login" className="flex items-center gap-1 text-on-surface transition hover:text-brand-gold-dark">
                <Icon name="login" size={20} />
                <span className="text-sm font-medium">Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 rounded-md bg-brand-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-gold hover:text-brand-forest"
              >
                <Icon name="person_add" size={18} />
                Register
              </Link>
            </div>
          )}

          <button
            className="ml-1 text-on-surface md:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 top-14 h-[calc(100vh-56px)] w-full overflow-y-auto border-t border-outline-variant bg-white shadow-lg md:hidden">
          <div className="flex flex-col px-margin-mobile py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'border-b border-surface-container py-3 text-sm font-medium',
                  isActive(item.href) ? 'text-brand-forest' : 'text-on-surface',
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-b border-surface-container py-3">
              <p className="mb-2 text-sm font-medium text-on-surface">Categories</p>
              <div className="flex flex-col gap-3 pl-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-on-surface-variant hover:text-brand-gold-dark"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            {!authenticated && (
              <div className="flex gap-3 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md border border-brand-forest py-2 text-center text-sm font-medium text-brand-forest"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-brand-forest py-2 text-center text-sm font-medium text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-full items-center px-1 text-sm font-medium transition-colors',
        active ? 'nav-link-active' : 'text-on-surface hover:text-brand-gold-dark',
      )}
    >
      {label}
    </Link>
  );
}
