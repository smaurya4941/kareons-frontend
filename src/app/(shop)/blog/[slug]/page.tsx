import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPost } from '@/lib/api/blog';
import { getSettings } from '@/lib/api/settings';
import { ApiError } from '@/lib/api/client';
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/schema';
import { redirectOrNotFound } from '@/lib/seo/redirectOrNotFound';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { formatDate } from '@/lib/utils/format';

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadPost(slug: string) {
  try {
    return await getBlogPost(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      await redirectOrNotFound(`blog/${slug}`);
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [{ blog }, settings] = await Promise.all([loadPost(slug), getSettings()]);

  return buildMetadata({
    title: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt,
    isIndexable: blog.is_indexable,
    canonicalPath: `/blog/${blog.slug}`,
    ogImage: blog.featured_image,
    ogType: 'article',
    settings,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { blog, relatedBlogs } = await loadPost(slug);
  const shareUrl = `${SITE_URL}/blog/${blog.slug}`;

  return (
    <Container className="py-8">
      <JsonLd
        schema={[
          blogPostingSchema(blog),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: blog.title, path: `/blog/${blog.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: blog.title }]}
        />

        {blog.category && (
          <span className="mb-3 inline-block rounded-full bg-brand-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {blog.category}
          </span>
        )}
        <h1 className="mb-3 font-display text-3xl font-bold leading-tight text-brand-forest md:text-4xl">{blog.title}</h1>
        <div className="mb-6 flex items-center gap-3 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar_today" size={16} />
            {formatDate(blog.published_at)}
          </span>
          {blog.author && <span>· By {blog.author.name}</span>}
        </div>

        {blog.featured_image && (
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="mb-8 aspect-video w-full rounded-xl object-cover"
          />
        )}

        <div
          className="prose max-w-none text-on-surface-variant prose-headings:font-display prose-headings:text-brand-forest prose-a:text-brand-gold-dark"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-10 flex items-center gap-3 border-t border-soft-border pt-6">
          <span className="text-sm font-medium text-on-surface-variant">Share:</span>
          <ShareLink
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            icon="thumb_up"
            label="Share on Facebook"
          />
          <ShareLink
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
            icon="tag"
            label="Share on X"
          />
          <ShareLink
            href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} ${shareUrl}`)}`}
            icon="chat"
            label="Share on WhatsApp"
          />
        </div>
      </article>

      {relatedBlogs.length > 0 && (
        <section className="mx-auto mt-14 max-w-4xl border-t border-soft-border pt-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-brand-forest">Related Articles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-brand-beige bg-brand-cream p-4 transition-all hover:border-brand-gold/40 hover:shadow-md"
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="mb-3 aspect-[4/3] w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <h3 className="line-clamp-2 font-display text-base text-brand-forest transition-colors group-hover:text-brand-gold-dark">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

function ShareLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-soft-border text-on-surface-variant transition-colors hover:border-brand-gold-dark hover:text-brand-gold-dark"
    >
      <Icon name={icon} size={18} />
    </a>
  );
}
