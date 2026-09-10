import type { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'About Us',
    description:
      "Learn about Kare Ons Herbal's heritage, our commitment to authentic Ayurvedic formulations, and the quality standards behind every product.",
    canonicalPath: '/about',
    settings,
  });
}

const PILLARS = [
  {
    icon: 'verified',
    title: 'GMP Certified',
    text: 'Manufactured in state-of-the-art, strictly regulated facilities ensuring pharmaceutical-grade hygiene and consistency.',
  },
  {
    icon: 'spa',
    title: 'Authentic Formulations',
    text: 'Recipes drawn directly from ancient Ayurvedic texts, preserved and prepared with utmost respect for the tradition.',
  },
  {
    icon: 'science',
    title: 'Quality Tested',
    text: 'Rigorous lab testing at every stage, from raw material sourcing to final product, to guarantee potency and safety.',
  },
  {
    icon: 'flag',
    title: 'Made in India',
    text: 'Proudly sourced and manufactured in the birthplace of Ayurveda, supporting local farmers and sustainable practices.',
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const about =
    (settings.about_text ?? '').replace(/<[^>]*>/g, '') ||
    'Bridging the ancient wisdom of pure Ayurveda with the rigorous standards of modern clinical manufacturing. We deliver formulations that are both traditionally authentic and scientifically validated.';

  return (
    <Container className="py-8 md:py-10">
      <section className="mb-12">
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden rounded-xl border border-soft-border shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest via-brand-forest/50 to-brand-forest/20" />
          <div className="absolute bottom-0 left-0 w-full p-6 md:w-2/3 md:p-10">
            <span className="section-eyebrow mb-4 inline-block rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-label-sm uppercase text-brand-gold">
              Our Heritage
            </span>
            <h1 className="mb-6 font-display text-display-lg-mobile leading-tight text-brand-cream md:text-display-lg">
              Our Heritage,
              <br />
              <span className="text-brand-gold">Your Wellness</span>
            </h1>
            <p className="max-w-xl text-body-md text-brand-cream/85 md:text-body-lg">{about}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="flex flex-col justify-center md:col-span-5 md:pr-8">
          <h2 className="mb-4 font-display text-headline-md text-on-surface md:text-display-lg">
            The Standard of
            <br />
            Pure Ayurveda
          </h2>
          <div className="mb-6 h-1 w-12 bg-primary" />
          <p className="mb-6 text-body-md text-on-surface-variant">
            At {settings.site_name}, our mission is unequivocally clear: to provide Ayurvedic wellness solutions that
            demand no compromise. We believe that true healing begins with absolute purity.
          </p>
          <p className="text-body-md text-on-surface-variant">
            Every syrup, capsule, and oil is a testament to our commitment to GMP Certified Manufacturing, ensuring that
            the profound efficacy of traditional herbs is delivered with clinical precision and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-7">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group rounded-xl border border-soft-border bg-surface-bright p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_8px_24px_rgba(27,58,24,0.1)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon name={p.icon} size={28} className="text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl text-on-surface">{p.title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
