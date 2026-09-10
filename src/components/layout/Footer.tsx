import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/api/settings';
import { getCategories } from '@/lib/api/categories';
import { getPages } from '@/lib/api/pages';
import { isAuthenticated } from '@/lib/auth/session';
import { Icon } from '@/components/ui/Icon';

const SOCIALS: { key: keyof Awaited<ReturnType<typeof getSettings>>['social']; icon: string; label: string }[] = [
  { key: 'instagram_url', icon: 'photo_camera', label: 'Instagram' },
  { key: 'facebook_url', icon: 'thumb_up', label: 'Facebook' },
  { key: 'twitter_url', icon: 'tag', label: 'Twitter' },
  { key: 'youtube_url', icon: 'smart_display', label: 'YouTube' },
  { key: 'linkedin_url', icon: 'work', label: 'LinkedIn' },
];

const PAYMENTS = ['Visa', 'Mastercard', 'UPI', 'RuPay'];

export async function Footer() {
  const [settings, categories, pages, authenticated] = await Promise.all([
    getSettings(),
    getCategories().catch(() => []),
    getPages().catch(() => []),
    isAuthenticated(),
  ]);

  const about = (settings.about_text ?? 'Pure, potent Ayurvedic wellness — 5,000 years of Vedic wisdom, made for modern life.')
    .replace(/<[^>]*>/g, '')
    .slice(0, 130);

  return (
    <footer className="relative w-full overflow-hidden bg-herbal-deep text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-secondary-fixed/70 to-transparent" />

      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-gutter gap-y-6 px-margin-mobile py-8 md:grid-cols-4 md:px-margin-desktop lg:grid-cols-12">
        <div className="col-span-2 md:col-span-4 lg:col-span-4">
          <Link href="/" className="mb-4 inline-block">
            {settings.logo ? (
              <Image
                src={settings.logo}
                alt={`${settings.site_name} logo`}
                width={160}
                height={48}
                className="h-12 w-auto rounded-lg bg-white p-1.5 object-contain"
              />
            ) : (
              <span className="font-display text-xl font-bold">{settings.site_name}</span>
            )}
          </Link>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-white/70">{about}</p>
          <div className="flex gap-2.5">
            {SOCIALS.filter((s) => settings.social[s.key]).map((s) => (
              <a
                key={s.key}
                href={settings.social[s.key]!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-secondary-fixed hover:bg-secondary-fixed hover:text-on-secondary-fixed"
              >
                <Icon name={s.icon} size={18} />
              </a>
            ))}
            {settings.site_email && (
              <a
                href={`mailto:${settings.site_email}`}
                aria-label="Email us"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-secondary-fixed hover:bg-secondary-fixed hover:text-on-secondary-fixed"
              >
                <Icon name="mail" size={18} />
              </a>
            )}
          </div>
        </div>

        <FooterCol title="Shop" className="lg:col-span-2">
          <FooterLink href="/shop">All Products</FooterLink>
          {categories.slice(0, 4).map((c) => (
            <FooterLink key={c.id} href={`/category/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Company" className="lg:col-span-2">
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/blog">Journal</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          {pages.map((p) => (
            <FooterLink key={p.id} href={`/${p.slug}`}>
              {p.title}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Account" className="lg:col-span-2">
          {authenticated ? (
            <>
              <FooterLink href="/account">Dashboard</FooterLink>
              <FooterLink href="/account/orders">My Orders</FooterLink>
              <FooterLink href="/account/wishlist">Wishlist</FooterLink>
            </>
          ) : (
            <>
              <FooterLink href="/login">Sign In</FooterLink>
              <FooterLink href="/register">Create Account</FooterLink>
            </>
          )}
          <FooterLink href="/cart">My Cart</FooterLink>
        </FooterCol>

        <FooterCol title="Contact" className="lg:col-span-2">
          {settings.site_phone && <FooterLink href={`tel:${settings.site_phone}`}>{settings.site_phone}</FooterLink>}
          {settings.site_email && (
            <FooterLink href={`mailto:${settings.site_email}`} className="break-all">
              {settings.site_email}
            </FooterLink>
          )}
          {settings.address && (
            <li className="text-sm leading-relaxed text-white/70">{settings.address}</li>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center justify-between gap-3 px-margin-mobile py-4 sm:flex-row md:px-margin-desktop">
          <p className="text-center text-xs text-white/60 sm:text-left">
            {settings.copyright_text ?? `© ${new Date().getFullYear()} ${settings.site_name}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1.5">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`col-span-1 md:col-span-1 ${className ?? ''}`}>
      <h5 className="mb-3 text-label-sm font-semibold uppercase tracking-widest text-secondary-fixed">{title}</h5>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith('mailto:') || href.startsWith('tel:');
  return (
    <li>
      {external ? (
        <a href={href} className={`footer-link text-sm ${className ?? ''}`}>
          {children}
        </a>
      ) : (
        <Link href={href} className={`footer-link text-sm ${className ?? ''}`}>
          {children}
        </Link>
      )}
    </li>
  );
}
