import type { Metadata } from 'next';
import { getPage } from '@/lib/api/pages';
import { getSettings } from '@/lib/api/settings';
import { ApiError } from '@/lib/api/client';
import { buildMetadata } from '@/lib/seo/metadata';
import { redirectOrNotFound } from '@/lib/seo/redirectOrNotFound';
import { Container } from '@/components/ui/Container';

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadPage(slug: string) {
  try {
    return await getPage(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      await redirectOrNotFound(slug);
    }
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([loadPage(slug), getSettings()]);

  return buildMetadata({
    title: page.seo_title || page.title,
    description: page.seo_description,
    isIndexable: page.is_indexable,
    canonicalPath: `/${page.slug}`,
    settings,
  });
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await loadPage(slug);

  return (
    <div>
      <div className="border-b border-brand-beige bg-brand-cream py-10">
        <Container>
          <h1 className="font-display text-display-lg-mobile text-brand-forest md:text-display-lg">{page.title}</h1>
        </Container>
      </div>
      <Container className="py-10">
        <article
          className="prose max-w-3xl text-on-surface-variant prose-headings:font-display prose-headings:text-brand-forest prose-a:text-brand-gold-dark"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </Container>
    </div>
  );
}
