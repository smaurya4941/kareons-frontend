import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getSettings } from '@/lib/api/settings';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { CountsProvider } from '@/components/layout/CountsProvider';
import { getSessionToken } from '@/lib/auth/session';
import { getCart } from '@/lib/api/cart';
import { getWishlist } from '@/lib/api/wishlist';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seo.meta_title || `${settings.site_name} - Ayurvedic Herbal Products`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.seo.meta_description ?? undefined,
    keywords: settings.seo.meta_keywords ?? undefined,
    // The favicon is managed from the admin (Settings → Browser Favicon) and
    // comes back as a Cloudinary URL. There is deliberately no app/favicon.ico
    // in the repo — a static file there would always win over this and pin the
    // Next.js default icon on the live site.
    icons: settings.favicon
      ? { icon: settings.favicon, shortcut: settings.favicon, apple: settings.favicon }
      : undefined,
    verification: settings.seo.google_site_verification
      ? { google: settings.seo.google_site_verification }
      : undefined,
  };
}

async function getInitialCounts(): Promise<{ cart: number; wishlist: number }> {
  if (!(await getSessionToken())) return { cart: 0, wishlist: 0 };
  const [cart, wishlist] = await Promise.all([
    getCart({ optional: true }).catch(() => null),
    getWishlist({ optional: true }).catch(() => []),
  ]);
  return { cart: cart?.cart_count ?? 0, wishlist: wishlist.length };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [settings, counts] = await Promise.all([getSettings(), getInitialCounts()]);

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-on-surface">
        <JsonLd schema={[organizationSchema(settings), websiteSchema(settings)]} />
        <ToastProvider>
          <CountsProvider initial={counts}>
            <Header />
            <main className="flex-1 pt-[88px]">{children}</main>
            <Footer />
          </CountsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
