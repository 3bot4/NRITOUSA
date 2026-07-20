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
  experimental: {
    // The H-1B Sponsor Finder's CSV fallback (used when DATABASE_URL is unset)
    // reads data/h1b/sponsors.csv at runtime via a dynamic fs path, which Next's
    // file tracing can't detect. Force-include it in those function bundles so
    // the no-database fallback works on deployments without a database.
    outputFileTracingIncludes: {
      "/api/sponsors": ["./data/h1b/sponsors.csv"],
      "/api/roles": ["./data/h1b/sponsors.csv"],
      "/h1b-sponsors/[socSlug]/[state]": ["./data/h1b/sponsors.csv"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
      // /topics/education duplicated /education/articles exactly — same
      // <title>, same four articles listed, same intent — so the two competed
      // for one query cluster. /education/articles is the winner: it is linked
      // site-wide from the footer (881 inbound internal links vs 5) and lives
      // in the /education hub next to the GPA/grade/SAT/tuition tools. A hard
      // 301 (statusCode, not `permanent`/308) preserves link equity. The topic
      // survives as a taxonomy — see `retiredTo` in lib/topics.
      {
        source: "/topics/education",
        destination: "/education/articles",
        statusCode: 301,
      },
      // The "Visa Bulletin Explained for Indians" legacy article was consolidated
      // into the /visa-bulletin hub, which owns the "visa bulletin for India"
      // intent. A hard 301 (statusCode, not `permanent`/308) preserves the
      // article's link equity and prevents an indexable duplicate. Only this
      // exact legacy URL is redirected.
      {
        source: "/articles/visa-bulletin-explained-for-indians",
        destination: "/visa-bulletin",
        statusCode: 301,
      },
      // The "gifting money from India / cash gift from parents" article was
      // consolidated into the Foreign Gifts, Inheritance & Form 3520 cluster.
      // The cash-gift page owns that intent, so a single-hop hard 301
      // (statusCode 301, not `permanent`/308) preserves link equity and
      // prevents an indexable duplicate. The old article has been removed from
      // articles.ts (so it is absent from the sitemap, search index, and
      // related-guide cards) and every internal link points directly at the
      // destination — no redirect chain. Next.js preserves query strings on
      // redirect because the destination declares none.
      {
        source: "/articles/gifting-money-india-tax-implications",
        destination: "/india-tax-compliance/gift-from-parents-india-to-usa",
        statusCode: 301,
      },
      // /calculators/rent-vs-buy-visa and /calculators/rent-vs-buy-immigrant
      // targeted the same rent-vs-buy-on-a-visa intent with near-identical
      // titles. GA showed rent-vs-buy-immigrant winning traffic (1,676 vs 253
      // views/30d) and its calculator component is the more complete one (visa
      // type, I-140, relocation risk), so it absorbs the weaker page's hub
      // content (quick answer, FAQs, break-even table) and becomes canonical.
      // A hard 301 (statusCode, not `permanent`/308) preserves rent-vs-buy-visa's
      // link equity. The slug has been removed from calculators.ts (so it is
      // absent from the sitemap, search index, and related-tool cards) and
      // every internal link points directly at the destination — no redirect
      // chain. Next.js preserves query strings on redirect because the
      // destination declares none.
      {
        source: "/calculators/rent-vs-buy-visa",
        destination: "/calculators/rent-vs-buy-immigrant",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
