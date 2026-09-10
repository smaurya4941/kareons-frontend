import { redirectOrNotFound } from '@/lib/seo/redirectOrNotFound';

/**
 * Catches any URL not matched by a real route (including multi-segment legacy
 * paths). Checks the `redirects` table via GET /api/v1/redirects/lookup for a
 * seeded 301/302 before rendering the branded 404 — the headless equivalent of
 * the Blade storefront's NotFoundHttpException render hook. Single-segment
 * unknown paths are handled by (shop)/[slug]; this covers the rest.
 */
export default async function CatchAllPage({ params }: { params: Promise<{ rest: string[] }> }) {
  const { rest } = await params;
  await redirectOrNotFound(rest.join('/'));
}
