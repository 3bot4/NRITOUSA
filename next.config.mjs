/** @type {import('next').NextConfig} */

/**
 * Content-Security-Policy.
 *
 * The only external resource the site loads is Google Analytics (gtag.js from
 * googletagmanager.com, beacons to google-analytics.com). Everything else is
 * same-origin. 'unsafe-inline' is required for now because Next.js injects
 * inline hydration scripts and inline styles without a nonce, and the GA
 * config snippet is inline too — a nonce-based policy (via middleware) would
 * let us drop 'unsafe-inline' from script-src later.
 *
 * Next.js's dev-mode React Fast Refresh evaluates code with eval(), so in
 * development we must add 'unsafe-eval' to script-src or the client bundle
 * throws on init and the page never hydrates (interactive tools go dead).
 * Production builds don't use eval, so 'unsafe-eval' is never shipped to users.
 */
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
  "https://www.googletagmanager.com",
]
  .filter(Boolean)
  .join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The H-1B Sponsor Finder's CSV fallback (used when DATABASE_URL is unset)
    // reads data/h1b/sponsors.csv at runtime via a dynamic fs path, which Next's
    // file tracing can't detect. Force-include it in those function bundles so
    // the no-database fallback works on Vercel previews too.
    outputFileTracingIncludes: {
      "/api/sponsors": ["./data/h1b/sponsors.csv"],
      "/api/roles": ["./data/h1b/sponsors.csv"],
      "/h1b-sponsors/[socSlug]/[state]": ["./data/h1b/sponsors.csv"],
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The money-transfer topic page was consolidated into the
      // /send-money-to-india landing page. Keep old links/bookmarks working.
      {
        source: "/topics/money-transfer",
        destination: "/send-money-to-india",
        permanent: true,
      },
      // The passport article was expanded into a top-level topic cluster
      // (hub at /indian-passport-renewal-usa). Preserve the old /articles URL.
      {
        source: "/articles/indian-passport-renewal-usa",
        destination: "/indian-passport-renewal-usa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
