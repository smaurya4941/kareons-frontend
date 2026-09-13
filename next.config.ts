import type { NextConfig } from 'next';

// Images come from Laravel's image_url() helper: either a Cloudinary URL
// (current uploads) or `{APP_URL}/storage/...` (pre-Cloudinary records) —
// see app/Helpers/*.php `image_url()` in the kare-ons repo. Both hosts must
// be allowed for next/image to optimize them.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
const apiHostname = apiUrl ? new URL(apiUrl).hostname : 'localhost';

// In local dev the API is on http://localhost:8000, whose storage-served
// images resolve to a loopback IP that next/image's SSRF guard blocks.
// Production images come from Cloudinary / the real API domain, so this is
// only ever needed for local development.
const isLocalApi = ['localhost', '127.0.0.1', '::1'].includes(apiHostname);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: apiHostname },
      { protocol: 'https', hostname: apiHostname },
    ],
    ...(isLocalApi ? { dangerouslyAllowLocalIP: true } : {}),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains',
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
