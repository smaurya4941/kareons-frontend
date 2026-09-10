/**
 * Types mirror the exact JSON shapes returned by app/Http/Resources/*.php and
 * app/Http/Controllers/Api/V1/*.php in the kare-ons Laravel API (verified
 * against the actual PHP source, not just docs/API.md — that doc simplifies
 * some shapes for readability). Keep these in sync whenever a Resource's
 * toArray() or a controller's response changes.
 */

export interface ApiCollection<T> {
  data: T[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: PaginationMeta & Record<string, unknown>;
}

export interface ApiResource<T> {
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

/** Fields shared by every SEO-bearing resource (Product, Category, Blog, Page). */
export interface SeoFields {
  seo_title: string | null;
  seo_description: string | null;
  is_indexable: boolean;
}

export interface Category extends SeoFields {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner_image: string | null;
  parent_id: number | null;
  sort_order: number;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  sort_order: number;
}

export interface Review {
  id: number;
  rating: number;
  title: string | null;
  review: string;
  images: string[] | null;
  is_verified_purchase: boolean;
  admin_reply: string | null;
  user?: { id: number; name: string };
  created_at: string;
}

/** Lightweight shape used in listings/rails — see ProductCardResource. */
export interface ProductCard {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  effective_price: number;
  on_sale: boolean;
  discount_percent: number | null;
  main_image: string | null;
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  rating_avg: number | null;
  reviews_count: number;
  category?: { id: number; name: string; slug: string };
  in_wishlist?: boolean;
  is_indexable: boolean;
}

/** Full detail shape — see ProductResource. Used only on the product page. */
export interface Product extends SeoFields {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  effective_price: number;
  on_sale: boolean;
  stock_quantity: number;
  in_stock: boolean;
  weight: number | null;
  pack_size: string | null;
  main_image: string | null;
  images?: ProductImage[];
  benefits: string | null;
  ingredients: string | null;
  usage_instructions: string | null;
  storage_instructions: string | null;
  precautions: string | null;
  ayurvedic_reference: string | null;
  suitable_for: string | null;
  disclaimer: string | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  category: Category | null;
  brand: Brand | null;
  tax_rate?: number;
  rating_avg: number | null;
  reviews_count: number;
  reviews?: Review[];
  in_wishlist?: boolean;
  created_at: string;
}

export interface ProductShowResponse {
  data: {
    product: Product;
    related_products: ProductCard[];
  };
}

export interface Blog extends SeoFields {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author: { name: string } | null;
  published_at: string | null;
}

export interface BlogShowResponse {
  data: {
    blog: Blog;
    related_blogs: Blog[];
  };
}

export interface Page extends SeoFields {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export interface Banner {
  id: number;
  title: string | null;
  type: string | null;
  desktop_image: string | null;
  mobile_image: string | null;
  link: string | null;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  avatar: string | null;
  content: string;
  rating: number;
}

export interface HomeData {
  banners: Banner[];
  homepage_categories: Category[];
  featured_products: ProductCard[];
  best_sellers: ProductCard[];
  trending_products: ProductCard[];
  new_arrivals: ProductCard[];
  testimonials: Testimonial[];
  blogs: Blog[];
  wishlist_ids: number[];
}

export interface Settings {
  site_name: string;
  site_email: string | null;
  site_phone: string | null;
  logo: string | null;
  favicon: string | null;
  address: string | null;
  about_text: string | null;
  copyright_text: string | null;
  social: {
    facebook_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
  };
  home: {
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_bg: string | null;
    hero_badge: string | null;
    cta_text: string | null;
    cta_link: string | null;
    ingredient_spotlight: {
      bg: string | null;
      title: string | null;
      ingredients: string | null;
    };
    expert: {
      image: string | null;
      quote: string | null;
      name: string | null;
      designation: string | null;
      description: string | null;
    };
  };
  shipping_charge: number;
  free_shipping_amount: number;
  razorpay_key: string | null;
  currency: string;
  timezone: string;
  seo: {
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    google_site_verification: string | null;
  };
  whatsapp_number: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  reward_points: number;
  wallet_balance: number;
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: 'Bearer';
}

export interface Address {
  id: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  product: {
    id: number;
    name: string;
    slug: string;
    main_image: string | null;
    price: number;
    sale_price: number | null;
    stock_quantity: number;
    status: boolean;
  } | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  cart_count: number;
}

/** Response shape from POST /cart — a single line item, not the whole cart. */
export interface AddToCartResponse {
  message: string;
  data: CartItem;
  cart_count: number;
}

export interface CheckoutSummary {
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  shipping: number;
  total: number;
  addresses: Address[];
  payment_methods: { id: number; code: string; name: string }[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  product?: { slug: string; main_image: string | null } | null;
}

export interface OrderTimelineEntry {
  id: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface ReturnRequest {
  id: number;
  type: 'refund' | 'replacement';
  reason: string;
  customer_note: string | null;
  admin_note: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export interface Order {
  id: number;
  order_number: string;
  subtotal: number;
  shipping_charge: number;
  discount_amount: number;
  coupon_code: string | null;
  tax_amount: number;
  grand_total: number;
  payment_method: string;
  payment_status: string;
  order_status: OrderStatus;
  refund_status: string | null;
  notes: string | null;
  address: Address;
  items: OrderItem[];
  items_count?: number;
  timelines?: OrderTimelineEntry[];
  return_requests?: ReturnRequest[];
  /** Only set on the single-order GET /orders/{id} response, not on list responses. */
  can_request_return: boolean | null;
  return_window_days: number | null;
  created_at: string;
}

export interface CheckoutOrderResponse {
  data: {
    order: Order;
    razorpay: { order_id: string; key: string; amount: number } | null;
  };
}

export interface RedirectLookup {
  to_path: string;
  status_code: number;
}
