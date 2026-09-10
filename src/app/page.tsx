import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getHomeData } from '@/lib/api/home';
import { getSettings } from '@/lib/api/settings';
import { getSessionToken } from '@/lib/auth/session';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils/format';
import type { ProductCard as ProductCardType } from '@/types/api';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({ canonicalPath: '/', settings });
}

const CERTS = [
  { icon: 'verified', label: 'GMP Certified' },
  { icon: 'workspace_premium', label: 'ISO 9001:2015' },
  { icon: 'eco', label: 'AYUSH Premium' },
  { icon: 'public', label: 'PAN INDIA' },
  { icon: 'inventory_2', label: 'FDA Compliant' },
];

const ETHOS = [
  { icon: 'shield_person', title: 'Integrity', text: 'Absolute transparency in sourcing and manufacturing for unwavering trust.' },
  { icon: 'groups', title: 'Teamwork', text: 'Collaborative intelligence of scientists, vaidyas, and process engineers.' },
  { icon: 'eco', title: 'Pure Ayurveda', text: 'Upholding the sanctity of ancient recipes with pharmaceutical precision.' },
  { icon: 'psychology_alt', title: 'Innovation', text: 'Continuous R&D to improve bioavailability and therapeutic delivery.' },
];

const FAQS = [
  {
    q: 'What is Kare-ons Herbal?',
    a: 'Kare-ons Herbal is a premium Ayurvedic and botanical medicine brand dedicated to bridging 5,000 years of Vedic wisdom with modern clinical validation for everyday wellness and personal care.',
  },
  {
    q: 'What types of products do you offer?',
    a: "We offer a curated range of Ayurvedic products, including targeted solutions for women's health, natural skin and hair care formulated with pure botanicals, and daily wellness supplements.",
  },
  {
    q: 'Are your products made with natural ingredients?',
    a: 'Yes, our products are formulated using carefully selected, high-grade raw herbs and botanical ingredients, ensuring strict adherence to AYUSH and pharmaceutical standards for maximum purity and potency.',
  },
];

export default async function HomePage() {
  const token = await getSessionToken();
  const [home, settings] = await Promise.all([getHomeData(token ?? undefined), getSettings()]);
  const authed = Boolean(token);
  const wishlistIds = new Set(home.wishlist_ids);

  const heroBanner = home.banners.find((b) => b.type === 'hero') ?? home.banners[0];
  const heroDesktop = heroBanner?.desktop_image ?? settings.home.hero_bg;
  const heroMobile = heroBanner?.mobile_image ?? heroDesktop;
  const heroTitle = settings.home.hero_title ?? 'Scientific Ayurveda for <span class="text-brand-gold">Modern Wellness</span>';
  const heroSubtitle =
    settings.home.hero_subtitle ??
    'Harmonizing elemental nature with diagnostic precision. We bridge 5,000 years of Vedic wisdom with contemporary clinical validation.';
  const ingredients = (settings.home.ingredient_spotlight.ingredients ?? 'Neem,Tulsi,Ashwagandha,Amla')
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
  const expert = settings.home.expert;

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] w-full items-center overflow-hidden bg-brand-forest">
        {heroDesktop && (
          <div className="absolute inset-0 z-0">
            <picture>
              {heroMobile && <source media="(max-width: 768px)" srcSet={heroMobile} />}
              <img src={heroDesktop} alt="" className="h-full w-full object-cover" fetchPriority="high" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-forest via-brand-forest/80 to-brand-forest/30" />
          </div>
        )}
        <Container className="relative z-10 py-12 lg:py-16">
          <div className="max-w-2xl">
            <div className="section-eyebrow mb-4 inline-flex items-center gap-2 rounded-full bg-brand-gold px-3.5 py-1 text-label-sm font-semibold uppercase text-brand-forest shadow-sm">
              <Icon name="spa" size={15} fill />
              {settings.home.hero_badge ?? 'Since 1999'}
            </div>
            <h1
              className="mb-4 font-display text-display-lg-mobile leading-tight text-brand-cream md:text-display-lg"
              dangerouslySetInnerHTML={{ __html: heroTitle }}
            />
            <p
              className="mb-6 max-w-xl text-body-md leading-relaxed text-brand-cream/85 md:text-body-lg"
              dangerouslySetInnerHTML={{ __html: heroSubtitle }}
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href={settings.home.cta_link || '/shop'}
                className="btn-squish rounded-full bg-brand-gold px-6 py-2.5 text-label-md font-medium text-brand-forest transition-all hover:bg-brand-gold-dark hover:shadow-lg"
              >
                {settings.home.cta_text || 'Shop Now'}
              </Link>
              <Link
                href="/about"
                className="btn-squish rounded-full border border-brand-cream/60 px-6 py-2.5 text-label-md font-medium text-brand-cream transition-all hover:bg-brand-cream hover:text-brand-forest"
              >
                Learn Our Process
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Certifications */}
      <section className="border-b border-brand-beige bg-brand-cream py-6">
        <Container className="text-center">
          <p className="section-eyebrow mb-4 text-label-sm uppercase text-brand-sage-dark">
            Standard of Excellence Certifications
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CERTS.map((c) => (
              <div key={c.label} className="group flex items-center gap-2.5">
                <Icon
                  name={c.icon}
                  size={28}
                  fill
                  className="text-brand-forest transition-transform group-hover:scale-110 group-hover:text-brand-gold-dark"
                />
                <span className="text-label-md text-brand-forest">{c.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Category grid */}
      {home.homepage_categories.length > 0 && (
        <section className="bg-brand-beige py-10 md:py-14">
          <Container>
            <SectionHeading
              eyebrow="Curated Care"
              title="Explore Solutions"
              subtitle="Targeted botanical care for your unique physiological needs."
              viewAll={{ label: 'View All Categories', href: '/shop' }}
            />
            <div className="grid grid-cols-2 gap-4 md:gap-gutter lg:grid-cols-4">
              {home.homepage_categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-brand-forest shadow-sm transition-all hover:shadow-xl"
                >
                  {(cat.banner_image || cat.image) && (
                    <img
                      src={(cat.banner_image || cat.image)!}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest via-brand-forest/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3 className="mb-1 font-display text-lg leading-tight text-brand-cream md:text-headline-sm">
                      {cat.name}
                    </h3>
                    <span className="section-eyebrow inline-flex items-center gap-1 text-label-sm uppercase text-brand-gold opacity-0 transition-all group-hover:opacity-100">
                      Explore <Icon name="arrow_forward" size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ProductRail title="Featured Products" eyebrow="Handpicked" products={home.featured_products} authed={authed} wishlistIds={wishlistIds} bg="bg-white border-y border-brand-beige" />
      <ProductRail title="Trending Products" eyebrow="Popular Now" products={home.trending_products} authed={authed} wishlistIds={wishlistIds} bg="bg-white" />
      <ProductRail title="New Arrivals" eyebrow="Just In" products={home.new_arrivals} authed={authed} wishlistIds={wishlistIds} bg="bg-brand-cream border-t border-brand-beige" viewAllHref="/shop?sort=latest" />

      {/* Ingredient spotlight */}
      {settings.home.ingredient_spotlight.bg && (
        <section className="relative h-[300px] w-full overflow-hidden md:h-[450px]">
          <img
            src={settings.home.ingredient_spotlight.bg}
            alt={settings.home.ingredient_spotlight.title ?? 'Ingredient spotlight'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-forest/60 to-transparent p-8 md:p-16">
            <Container>
              <span className="section-eyebrow mb-2 block text-label-sm uppercase text-brand-gold">Ingredient Spotlight</span>
              <h2 className="mb-4 font-display text-display-lg-mobile text-brand-cream md:text-display-lg">
                {settings.home.ingredient_spotlight.title ?? 'The Essence of Vedic Wisdom'}
              </h2>
              <div className="flex flex-wrap gap-4 md:gap-8">
                {ingredients.map((ing) => (
                  <div key={ing} className="flex items-center gap-2 text-brand-cream/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                    <span className="text-label-sm uppercase tracking-wider">{ing}</span>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>
      )}

      {/* Expert quote */}
      {expert.quote && (
        <section className="relative overflow-hidden bg-brand-forest text-brand-cream">
          <div className="flex w-full flex-col md:min-h-[400px] md:flex-row">
            <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-brand-forest-dark md:w-1/3">
              {expert.image && <img src={expert.image} alt={expert.name ?? 'Expert'} className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-forest/80 md:to-brand-forest" />
            </div>
            <div className="relative flex w-full flex-col justify-center px-margin-mobile py-12 md:w-2/3 md:px-16 md:py-16">
              <Icon name="format_quote" size={48} fill className="mb-4 text-brand-gold opacity-50" />
              <h3 className="mb-8 max-w-3xl font-display text-headline-sm italic leading-relaxed md:text-headline-md">
                “{expert.quote}”
              </h3>
              <div className="mt-2 border-t border-brand-gold/20 pt-6">
                <p className="font-display text-headline-sm text-brand-cream">{expert.name}</p>
                {expert.designation && (
                  <p className="mt-1 text-xs uppercase tracking-widest text-brand-gold">{expert.designation}</p>
                )}
                {expert.description && <p className="mt-2 text-label-md text-brand-cream/70">{expert.description}</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ethos */}
      <section className="bg-brand-cream py-10 md:py-14">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="What Drives Us"
            title="Our Ethos"
            subtitle="The core principles that guide our clinical excellence and pharmaceutical integrity."
          />
          <div className="grid grid-cols-2 gap-4 md:gap-gutter lg:grid-cols-4">
            {ETHOS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-brand-beige bg-white p-4 text-center transition-all hover:border-brand-gold/40 hover:shadow-md md:p-5"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-brand-sage/30 bg-brand-sage/15">
                  <Icon name={item.icon} size={28} fill className="text-brand-forest" />
                </div>
                <h4 className="mb-2 font-display text-lg text-brand-forest md:text-headline-sm">{item.title}</h4>
                <p className="text-label-md leading-relaxed text-brand-forest/70">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {home.testimonials.length > 0 && (
        <section className="bg-brand-beige py-10 md:py-14">
          <Container>
            <SectionHeading align="center" eyebrow="Real Results" title="What Our Patients Say" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-gutter lg:grid-cols-3">
              {home.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col justify-between rounded-xl border border-brand-beige bg-white p-5 shadow-sm transition-all hover:border-brand-gold/40 hover:shadow-md"
                >
                  <div>
                    <StarRating rating={t.rating} showValue={false} size={20} className="mb-3" />
                    <p className="mb-6 text-body-md italic leading-relaxed text-brand-forest/80">“{t.content}”</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-forest">{t.name}</p>
                    {t.role && <p className="text-sm text-brand-gold-dark">{t.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Latest blogs */}
      {home.blogs.length > 0 && (
        <section className="border-t border-brand-beige bg-white py-10 md:py-14">
          <Container>
            <SectionHeading eyebrow="Ayurvedic Wisdom" title="Latest Articles" viewAll={{ label: 'Read All', href: '/blog' }} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {home.blogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-brand-beige bg-brand-cream p-4 transition-all hover:border-brand-gold/40 hover:shadow-md"
                >
                  <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-brand-beige">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-brand-sage-dark">
                        <Icon name="article" size={40} />
                      </div>
                    )}
                  </div>
                  <span className="mb-2 block text-label-sm font-bold uppercase text-brand-gold-dark">
                    {formatDate(post.published_at)}
                  </span>
                  <h3 className="mb-2 line-clamp-2 font-display text-lg text-brand-forest transition-colors group-hover:text-brand-gold-dark md:text-xl">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-body-md text-brand-forest/70">
                    {post.excerpt ?? post.content.replace(/<[^>]*>/g, '').slice(0, 120)}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-brand-beige bg-white py-10 md:py-14">
        <Container className="max-w-3xl">
          <SectionHeading align="center" eyebrow="Common Questions" title="Frequently Asked Questions" />
          <div className="space-y-6">
            {FAQS.map((f) => (
              <article
                key={f.q}
                className="rounded-xl border border-brand-beige bg-brand-cream p-5 transition-all hover:border-brand-gold/40"
              >
                <h3 className="mb-2 font-display text-lg text-brand-forest">{f.q}</h3>
                <p className="text-body-md text-brand-forest/70">{f.a}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* SEO copy */}
      <section className="border-t border-brand-beige bg-brand-cream py-12 md:py-16">
        <Container className="max-w-5xl">
          <h2 className="mb-6 text-center font-display text-2xl text-brand-forest md:text-3xl">
            Discover Kare-ons Herbal: Premium Ayurvedic &amp; Botanical Medicine
          </h2>
          <div className="space-y-4 text-left text-sm leading-relaxed text-brand-forest/80 md:text-center md:text-base">
            <p>
              At <strong>Kare-ons Herbal</strong>, we believe that true healing begins with nature. For over two decades,
              we have dedicated ourselves to bridging the 5,000-year-old wisdom of Ayurveda with modern clinical
              research — premium, authentic botanical medicine that addresses the root cause of health imbalances.
            </p>
            <p>
              Whether you are looking for specialized women&apos;s health solutions, potent natural skincare, or daily
              wellness supplements, every Kare-ons product is meticulously crafted from the highest-grade raw herbs and
              meets rigorous AYUSH and pharmaceutical standards for purity, potency, and safety.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

function ProductRail({
  title,
  eyebrow,
  products,
  authed,
  wishlistIds,
  bg,
  viewAllHref = '/shop',
}: {
  title: string;
  eyebrow: string;
  products: ProductCardType[];
  authed: boolean;
  wishlistIds: Set<number>;
  bg: string;
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className={`py-10 md:py-14 ${bg}`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} viewAll={{ label: 'View All', href: viewAllHref }} />
        <div className="grid grid-cols-2 gap-4 md:gap-gutter lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} isAuthenticated={authed} inWishlist={wishlistIds.has(p.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}
