import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/api/blog';
import { getSettings } from '@/lib/api/settings';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: 'Wellness Blog',
    description: 'Explore Ayurvedic wellness articles, herbal remedies, and holistic health tips from Kare Ons Herbal.',
    canonicalPath: '/blog',
    settings,
  });
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { page: pageParam, category } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;
  const { data: posts, meta } = await getBlogPosts(page, category);
  const categories = (meta?.categories as string[] | undefined)?.filter(Boolean) ?? [];

  return (
    <div>
      <div className="bg-surface-container-lowest py-10">
        <Container className="text-center">
          <h1 className="mb-3 font-display text-display-lg-mobile text-brand-forest md:text-display-lg">
            Ayurvedic Wellness Blog
          </h1>
          <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
            Discover ancient wisdom for modern living. Expert articles on herbs, health tips, and holistic wellbeing.
          </p>
        </Container>
      </div>

      <Container className="min-h-[50vh] py-8">
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <CategoryPill href="/blog" label="All Articles" active={!category} />
            {categories.map((c) => (
              <CategoryPill key={c} href={`/blog?category=${encodeURIComponent(c)}`} label={c} active={category === c} />
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <EmptyState
            icon="article"
            title="No Articles Found"
            description="Check back soon for new wellness insights and herbal tips."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm transition-colors hover:border-brand-forest"
              >
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-container">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-outline">
                      <Icon name="article" size={48} />
                    </div>
                  )}
                  {post.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-brand-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {post.category}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-on-surface-variant">
                    <Icon name="calendar_today" size={16} />
                    {formatDate(post.published_at)}
                  </div>
                  <h2 className="mb-2 line-clamp-2 text-lg font-bold text-on-surface transition group-hover:text-brand-forest">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
                    {post.excerpt ?? post.content.replace(/<[^>]*>/g, '').slice(0, 120)}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex items-center gap-1 font-bold text-brand-forest hover:underline"
                  >
                    Read Article <Icon name="arrow_forward" size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {meta && meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            searchParams={{ category }}
            basePath="/blog"
          />
        )}
      </Container>
    </div>
  );
}

function CategoryPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full border px-5 py-1.5 text-sm font-medium transition',
        active
          ? 'border-brand-forest bg-brand-forest text-white'
          : 'border-outline-variant bg-surface text-on-surface hover:bg-surface-container',
      )}
    >
      {label}
    </Link>
  );
}
