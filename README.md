# Kare-ons Web

The customer-facing storefront for Kare-ons Herbal, built with **Next.js 16 (App
Router) + React 19 + Tailwind v4**. It is a headless frontend that talks to the
Laravel API in the sibling `kare-ons` repo (`/api/v1/*`, Sanctum bearer tokens).

The Laravel app now serves **only** the admin panel (`/admin`, Blade) and the
API — its Blade storefront routes are disabled.

## Running locally (two servers)

### 1. API — `kare-ons` (port 8000)

```bash
cd ../kare-ons
# .env must contain:
#   APP_URL=http://localhost:8000
#   FRONTEND_URL=http://localhost:3000
php artisan migrate            # first run only
php artisan serve --port=8000
php artisan queue:work         # separate terminal — order/payment emails
php artisan schedule:work      # separate terminal — auto-cancels unpaid Razorpay orders
```

Razorpay keys are set in **Admin → Settings → Payment** (stored in the DB), not
`.env`. With `MAIL_MAILER=log`, password-reset / verification emails are written
to `storage/logs/laravel.log` and link back to this app.

### 2. Storefront — `kare-ons-web` (port 3000)

```bash
npm install
npm run dev
```

`.env.local` (copy from `.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
AUTH_COOKIE_NAME=kareons_token
```

## Architecture

- `src/lib/api/*` — typed fetch layer over the v1 API (`client.ts` centralises
  the envelope/error shape; `server.ts` attaches the session bearer token).
- `src/lib/actions/*` — server actions for every mutation (cart, checkout,
  reviews, addresses, profile, …).
- `src/lib/auth/session.ts` — the Sanctum token lives only in an httpOnly cookie;
  client components go through `/api/auth/*` route handlers or server actions.
- `src/proxy.ts` — route protection for `/account`, `/cart`, `/checkout`.
- `src/app/globals.css` — the design system (brand palette, fonts, component
  classes) ported from the Blade site's `tailwind.config.js`.
- `src/components/ui/*` — shared primitives (Button, Price, StarRating, Toast, …).

## Build

```bash
npm run build   # every route is server-rendered on demand
```
