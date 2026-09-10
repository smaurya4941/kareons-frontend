import { apiFetch } from './client';
import type { ApiCollection, Product, ProductCard, ProductShowResponse } from '@/types/api';

export type ProductSort = 'latest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc';

export interface ProductListParams {
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: ProductSort;
  page?: number;
  per_page?: number;
}

export async function getProducts(params: ProductListParams = {}, token?: string) {
  return apiFetch<ApiCollection<ProductCard>>('/products', {
    searchParams: { ...params },
    token,
    // A signed-in request gets a personalized `in_wishlist` per card, so it
    // must never be cached/shared. Anonymous listings get 5-min ISR (balancing
    // stock/price freshness against the shared 60/min API rate limit).
    ...(token
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 300, tags: ['products'] } }),
  });
}

export interface ProductWithRelated {
  product: Product;
  relatedProducts: ProductCard[];
}

export async function getProduct(slug: string, token?: string): Promise<ProductWithRelated> {
  const { data } = await apiFetch<ProductShowResponse>(`/products/${slug}`, {
    token,
    ...(token
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 300, tags: ['products', `product:${slug}`] } }),
  });
  return { product: data.product, relatedProducts: data.related_products };
}
