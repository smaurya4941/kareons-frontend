import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'Contact Us',
    description: 'Get in touch with the Kare Ons Herbal team for product, order, or wellness enquiries.',
    canonicalPath: '/contact',
    settings,
  });
}

export default async function ContactPage() {
  const settings = await getSettings();

  const details = [
    settings.site_phone && { icon: 'call', label: 'Phone', value: settings.site_phone, href: `tel:${settings.site_phone}` },
    settings.site_email && { icon: 'mail', label: 'Email', value: settings.site_email, href: `mailto:${settings.site_email}` },
    settings.address && { icon: 'location_on', label: 'Address', value: settings.address },
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string }[];

  return (
    <div>
      <div className="bg-brand-forest py-12 text-center text-brand-cream">
        <Container>
          <h1 className="mb-2 font-display text-display-lg-mobile md:text-display-lg">Get in Touch</h1>
          <p className="mx-auto max-w-xl text-body-md text-brand-cream/80">
            Questions about a formulation, your order, or your wellness journey? Our team is here to help.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-4 rounded-xl border border-soft-border bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-herbal-light text-brand-gold-dark">
                  <Icon name={d.icon} size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} className="break-all text-sm font-medium text-on-surface hover:text-brand-gold-dark">
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-sm text-on-surface">{d.value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-soft-border bg-brand-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">Support Hours</p>
              <p className="mt-1 text-sm text-on-surface-variant">Monday – Saturday, 10:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
