import { getSettings } from '@/lib/api/settings';
import { getCategories } from '@/lib/api/categories';
import { isAuthenticated } from '@/lib/auth/session';
import { HeaderClient } from './HeaderClient';

export async function Header() {
  const [settings, categories, authenticated] = await Promise.all([
    getSettings(),
    getCategories().catch(() => []),
    isAuthenticated(),
  ]);

  return (
    <HeaderClient
      logo={settings.logo}
      siteName={settings.site_name}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      authenticated={authenticated}
    />
  );
}
