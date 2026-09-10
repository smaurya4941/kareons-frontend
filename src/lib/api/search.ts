import { apiFetch } from './client';

export interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  on_sale: boolean;
}

export interface SearchSuggestResponse {
  query: string;
  results: SearchSuggestion[];
  total: number;
}

/** Live autocomplete — min 2 chars server-side, max 6 results. Client-only, never cached. */
export async function suggestProducts(query: string): Promise<SearchSuggestResponse> {
  return apiFetch<SearchSuggestResponse>('/search/suggest', {
    searchParams: { q: query },
    cache: 'no-store',
  });
}
