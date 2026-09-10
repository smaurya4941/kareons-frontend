import { notFound, redirect, permanentRedirect } from 'next/navigation';
import { lookupRedirect } from '@/lib/api/redirects';

/**
 * Call this instead of notFound() wherever a page's slug lookup comes back
 * empty. Checks the `redirects` table (via GET /api/v1/redirects/lookup) for
 * a manually seeded 301/302 first, so legacy indexed URLs redirect instead
 * of 404ing — equivalent to the Blade storefront's NotFoundHttpException
 * render hook in bootstrap/app.php, ported for a headless frontend.
 *
 * Wired from: the product / category / blog / CMS-page dynamic routes on a
 * 404 from the API, and src/app/[...rest]/page.tsx for every other unmatched
 * URL (including multi-segment legacy paths).
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  const match = await lookupRedirect(path);

  if (match) {
    if (match.status_code === 301) {
      permanentRedirect(match.to_path);
    }
    redirect(match.to_path);
  }

  notFound();
}
