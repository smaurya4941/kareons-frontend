# Kare-Ons Herbal — Project Conventions

> This document describes the technical and structural conventions for the Kare-Ons Herbal project.
> It reflects the verified production codebase.

---

# 1. PROJECT OVERVIEW

Kare-Ons Herbal is a headless ecommerce and wellness platform.

```text
Frontend (kare-ons-web)
    ↓ Next.js 16.3.4 (App Router) + React 19.2.8 + Tailwind CSS v4
Backend API (kare-ons)
    ↓ Laravel 11+ REST API (routes/api.php, Sanctum token auth)
Database
    ↓ Backend-managed database (MySQL / PostgreSQL)
```

---

# 2. TECHNOLOGY STACK

- **Framework**: Next.js 16.3.4 (App Router)
- **UI Library**: React 19.2.8
- **Language**: TypeScript 5 (Strict Mode, bundler resolution)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`, `@theme` in `globals.css`)
- **Icons**: Material Symbols Outlined (encapsulated in `src/components/ui/Icon.tsx`)
- **Motion**: CSS / Tailwind transitions (`.card-lift`, `.btn-squish`, `.hover-electric`)
- **HTTP Client**: Native `fetch` with exponential retry backoff in `src/lib/api/client.ts`
- **Mutations**: React 19 Server Actions (`'use server'` in `src/lib/actions/*`)
- **Payments**: Razorpay client integration (`next/script`) with Laravel server-side verification
- **Edge Routing / Guard**: `src/proxy.ts` (scanner bot firewall + `/account`, `/cart`, `/checkout` auth guard)

---

# 3. DIRECTORY STRUCTURE

```text
src/
├── app/                  # Next.js App Router routes
│   ├── (account)/        # Protected customer account routes (orders, addresses, wishlist)
│   ├── (auth)/           # Customer authentication (login, register, reset-password)
│   ├── (shop)/           # Public storefront (catalog, PDP, blog, CMS pages)
│   ├── [...rest]/        # Catch-all route with database 301/302 redirect lookup
│   ├── api/auth/         # Route handlers proxying Sanctum cookies
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout funnel & Razorpay flow
│   ├── globals.css       # Design tokens and component styles
│   ├── layout.tsx        # Root layout with providers, header, footer, SEO schemas
│   └── proxy.ts          # Edge proxy guard
├── components/
│   ├── account/          # Account-specific components
│   ├── auth/             # Authentication forms
│   ├── cart/             # Cart line items and controls
│   ├── checkout/         # Checkout multi-step form
│   ├── home/             # Homepage hero slideshow
│   ├── layout/           # Header, Footer, SearchBox, Providers
│   ├── product/          # ProductCard, Gallery, Tabs, Filters, Buttons
│   └── ui/               # Core design system primitives (Button, Input, Select, Badge, Icon, etc.)
├── lib/
│   ├── actions/          # Server Actions ('use server')
│   ├── api/              # Strongly typed API endpoints matching Laravel Resources
│   ├── auth/             # session.ts (httpOnly cookie read/write/clear via server-only)
│   ├── razorpay.ts       # Razorpay modal checkout handler
│   ├── seo/              # Metadata & schema generators
│   └── utils/            # cn.ts, format.ts
└── types/
    └── api.ts            # Canonical data types matching Laravel Eloquent API resources
```

---

# 4. LARAVEL API & AUTHENTICATION CONVENTIONS

- **Authentication**: Laravel Sanctum Bearer tokens.
- **Storage**: The token is stored strictly in an `httpOnly` cookie (`AUTH_COOKIE_NAME` / `kareons_token`). It never enters the client JavaScript bundle.
- **SSR Exemption**: Server-side requests send `X-Frontend-Key` (matching `FRONTEND_API_KEY` in Laravel) to bypass egress rate-limiting.
- **Policy**: Cart, wishlist, checkout, and orders are authenticated endpoints behind `auth:sanctum`. Guest users are redirected to login upon attempting cart or wishlist actions.

---

# 5. REUSABLE UI PRIMITIVES

Always import and use the standard UI primitives in `src/components/ui/`:
- `Button` / `ButtonLink`: `src/components/ui/Button.tsx`
- `Input`: `src/components/ui/Input.tsx`
- `Select`: `src/components/ui/Select.tsx`
- `Badge`: `src/components/ui/Badge.tsx`
- `EmptyState`: `src/components/ui/EmptyState.tsx`
- `Icon`: `src/components/ui/Icon.tsx`
- `Price`: `src/components/ui/Price.tsx`
- `StarRating`: `src/components/ui/StarRating.tsx`
- `QuantityStepper`: `src/components/ui/QuantityStepper.tsx`
- `Toast`: `src/components/ui/Toast.tsx`
- `Container`: `src/components/ui/Container.tsx`
- `Breadcrumbs`: `src/components/ui/Breadcrumbs.tsx`
- `Pagination`: `src/components/ui/Pagination.tsx`
- `SectionHeading`: `src/components/ui/SectionHeading.tsx`