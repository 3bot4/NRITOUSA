/**
 * Route inventory — generated from repository data, never hand-maintained.
 *
 * Two sources are joined:
 *
 *   1. The filesystem (src/app/**\/page.tsx) — every route that EXISTS, including
 *      redirect stubs, noindex app states, and dynamic segments.
 *   2. lib/sitemap-data — every URL we DECLARE as canonical + indexable.
 *
 * The join is the point: a route in (1) but not (2) is either deliberately
 * excluded or accidentally orphaned, and a URL in (2) but not (1) is a sitemap
 * entry pointing at nothing. Both are reported rather than guessed at.
 *
 * Run through vite-node so the `@/` alias and the cluster data modules resolve
 * (see vitest.config.ts). Plain `node` cannot import these.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { sitemapSegments } from "@/lib/sitemap-data";
import { site } from "@/lib/site";

export const REPO_ROOT = join(import.meta.dirname, "..", "..", "..");
const APP_DIR = join(REPO_ROOT, "src", "app");

export type RouteStatus =
  | "indexable"
  | "redirect"
  | "noindex"
  | "dynamic-uncounted"
  | "not-in-sitemap"
  | "sitemap-orphan";

export interface RouteRecord {
  /** Route path as Next.js serves it ("/foo", "/foo/[slug]"). */
  route: string;
  /** Repo-relative source file, or null for sitemap-only URLs. */
  file: string | null;
  /** "static" | "dynamic" | "sitemap-only". */
  routeType: string;
  status: RouteStatus;
  inSitemap: boolean;
  sitemapSegment: string | null;
  /** Path passed to pageMetadata({ path }), i.e. the declared canonical. */
  declaredCanonicalPath: string | null;
  canonicalAbsolute: string | null;
  title: string | null;
  description: string | null;
  robots: string | null;
  redirectTo: string | null;
  schemaTypes: string[];
  /** Names of JSON-LD/schema helpers referenced by the route file. */
  usesPageMetadata: boolean;
  hasGenerateStaticParams: boolean;
  approxSourceBytes: number;
}

/* ------------------------------------------------------------------ *
 * Filesystem walk
 * ------------------------------------------------------------------ */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (name === "page.tsx" || name === "page.ts") {
      out.push(full);
    }
  }
  return out;
}

/**
 * src/app/foo/[slug]/page.tsx → /foo/[slug]
 * Route groups "(marketing)" and parallel/intercepting segments are stripped
 * the way Next.js strips them when building the URL.
 */
function fileToRoute(file: string): string {
  const rel = relative(APP_DIR, file).split(sep).slice(0, -1);
  const segments = rel.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
  return "/" + segments.join("/");
}

/* ------------------------------------------------------------------ *
 * Source extraction
 *
 * These are deliberately regex-based, matching the convention already used by
 * scripts/audit-monthly-numbers.ts: the route files are TSX with JSX and
 * per-page logic, so importing them here would drag in React and Next server
 * internals for no benefit. We only need the metadata *call shape*, which is
 * uniform across the codebase because every page goes through pageMetadata().
 * ------------------------------------------------------------------ */

const RE = {
  pageMetadata: /pageMetadata\(\{/,
  /** pageMetadata({ ... path: "/foo" ... }) — the declared canonical. */
  path: /\bpath:\s*["'`]([^"'`]+)["'`]/,
  /** A literal `path:` built from a helper (clusterPath(x), `${BASE}/…`). */
  pathExpr: /\bpath:\s*([A-Za-z_$][\w$]*\([^)]*\)|`[^`]*`|[A-Z_][A-Z0-9_]*)/,
  title: /\btitle:\s*["'`]([^"'`]{3,})["'`]/,
  description: /\bdescription:\s*["'`]([^"'`]{10,})["'`]/,
  permanentRedirect: /permanentRedirect\(\s*["'`]([^"'`]+)["'`]/,
  redirect: /\bredirect\(\s*["'`]([^"'`]+)["'`]/,
  noindex: /index:\s*false/,
  generateStaticParams: /export\s+(?:async\s+)?function\s+generateStaticParams/,
  alternates: /alternates:\s*\{\s*canonical/,
};

/** JSON-LD helper names exported by lib/seo — presence implies that schema. */
const SCHEMA_HELPERS: Record<string, string> = {
  articleJsonLd: "Article",
  blogPostingJsonLd: "BlogPosting",
  breadcrumbJsonLd: "BreadcrumbList",
  breadcrumbsJsonLd: "BreadcrumbList",
  faqJsonLd: "FAQPage",
  faqPageJsonLd: "FAQPage",
  personJsonLd: "Person",
  profilePageJsonLd: "ProfilePage",
  softwareApplicationJsonLd: "SoftwareApplication",
  webApplicationJsonLd: "WebApplication",
  organizationJsonLd: "Organization",
  websiteJsonLd: "WebSite",
  datasetJsonLd: "Dataset",
  howToJsonLd: "HowTo",
  itemListJsonLd: "ItemList",
};

function extractSchemaTypes(src: string): string[] {
  const found = new Set<string>();
  for (const [helper, type] of Object.entries(SCHEMA_HELPERS)) {
    if (new RegExp(`\\b${helper}\\b`).test(src)) found.add(type);
  }
  // Inline JSON-LD: "@type": "X"
  for (const m of src.matchAll(/["']@type["']\s*:\s*["']([A-Za-z]+)["']/g)) {
    found.add(m[1]);
  }
  return [...found].sort();
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

export interface Inventory {
  generatedAt: string;
  siteUrl: string;
  routes: RouteRecord[];
  sitemapPaths: string[];
  counts: Record<string, number>;
}

export function buildInventory(): Inventory {
  /** Declared canonical URLs → segment name. */
  const sitemapPathToSegment = new Map<string, string>();
  for (const { name, entries } of sitemapSegments) {
    for (const e of entries) sitemapPathToSegment.set(e.path, name);
  }

  const files = walk(APP_DIR).sort();
  const routes: RouteRecord[] = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const route = fileToRoute(file);
    const isDynamic = route.includes("[");

    const redirectTo =
      src.match(RE.permanentRedirect)?.[1] ??
      (RE.redirect.test(src) && !RE.pageMetadata.test(src)
        ? (src.match(RE.redirect)?.[1] ?? null)
        : null);

    const declaredCanonicalPath = src.match(RE.path)?.[1] ?? null;
    const inSitemap = declaredCanonicalPath
      ? sitemapPathToSegment.has(declaredCanonicalPath)
      : sitemapPathToSegment.has(route);

    let status: RouteStatus;
    if (redirectTo) status = "redirect";
    else if (RE.noindex.test(src)) status = "noindex";
    else if (isDynamic) status = "dynamic-uncounted";
    else if (inSitemap) status = "indexable";
    else status = "not-in-sitemap";

    routes.push({
      route,
      file: relative(REPO_ROOT, file),
      routeType: isDynamic ? "dynamic" : "static",
      status,
      inSitemap,
      sitemapSegment:
        sitemapPathToSegment.get(declaredCanonicalPath ?? route) ?? null,
      declaredCanonicalPath,
      canonicalAbsolute: declaredCanonicalPath
        ? `${site.url}${declaredCanonicalPath}`
        : null,
      title: src.match(RE.title)?.[1] ?? null,
      description: src.match(RE.description)?.[1] ?? null,
      robots: RE.noindex.test(src) ? "noindex" : "index,follow",
      redirectTo,
      schemaTypes: extractSchemaTypes(src),
      usesPageMetadata: RE.pageMetadata.test(src),
      hasGenerateStaticParams: RE.generateStaticParams.test(src),
      approxSourceBytes: src.length,
    });
  }

  // Sitemap URLs with no route file at all. A static route file is the common
  // case; cluster URLs are served by a dynamic [slug] parent, so only flag a
  // sitemap path when NO static route and NO dynamic parent could serve it.
  const staticRoutes = new Set(
    routes.filter((r) => r.routeType === "static").map((r) => r.route),
  );
  const dynamicParents = routes
    .filter((r) => r.routeType === "dynamic")
    .map((r) => r.route.slice(0, r.route.indexOf("/[")));

  for (const [path, segment] of sitemapPathToSegment) {
    if (staticRoutes.has(path)) continue;
    const servedByDynamic = dynamicParents.some(
      (p) => p !== "" && path.startsWith(p + "/"),
    );
    if (servedByDynamic) continue;
    routes.push({
      route: path,
      file: null,
      routeType: "sitemap-only",
      status: "sitemap-orphan",
      inSitemap: true,
      sitemapSegment: segment,
      declaredCanonicalPath: path,
      canonicalAbsolute: `${site.url}${path}`,
      title: null,
      description: null,
      robots: null,
      redirectTo: null,
      schemaTypes: [],
      usesPageMetadata: false,
      hasGenerateStaticParams: false,
      approxSourceBytes: 0,
    });
  }

  const counts: Record<string, number> = {};
  for (const r of routes) counts[r.status] = (counts[r.status] ?? 0) + 1;
  counts.sitemapUrls = sitemapPathToSegment.size;
  counts.routeFiles = files.length;

  return {
    generatedAt: new Date().toISOString(),
    siteUrl: site.url,
    routes: routes.sort((a, b) => a.route.localeCompare(b.route)),
    sitemapPaths: [...sitemapPathToSegment.keys()].sort(),
    counts,
  };
}
