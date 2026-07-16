/**
 * SEO invariant rules, applied to the rendered production build.
 *
 * Imported by scripts/seo/audit.ts (the CLI) and by the vitest suite, so the
 * same rules gate CI and the report.
 *
 * Every check here is derived from the HTML Google actually receives, so a
 * finding is a fact about the deployed site rather than an inference about the
 * source. Findings are graded:
 *
 *   error → a signal that actively misdirects crawlers (canonical to a
 *           redirect, sitemap URL that 404s, duplicate canonical targets)
 *   warn  → a quality/discovery problem that costs traffic but sends no
 *           contradictory signal (thin page, missing from sitemap)
 */
import { site } from "@/lib/site";
import { buildInventory } from "./inventory";
import type { RenderedPage } from "./rendered";
import { redirectMap } from "./redirects";

export type Level = "error" | "warn";

export interface Finding {
  level: Level;
  check: string;
  route: string;
  detail: string;
}

/** Canonical URL → path, for comparing against route/sitemap paths. */
function canonicalPath(c: string | null): string | null {
  if (!c) return null;
  try {
    const u = new URL(c);
    const p = u.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return null;
  }
}

export function runAudit(pages: RenderedPage[]) {
  const findings: Finding[] = [];
  const add = (level: Level, check: string, route: string, detail: string) =>
    findings.push({ level, check, route, detail });

  const inv = buildInventory();
  const sitemapPaths = new Set(inv.sitemapPaths);
  const redirects = redirectMap();

  /** Routes that genuinely render (the build emitted HTML for them). */
  const rendered = new Map(pages.map((p) => [p.route, p]));

  /** Pages that are indexable: rendered, not noindex, not a redirect stub. */
  const indexable = pages.filter((p) => !p.hasNoindex && !redirects.has(p.route));

  /* ── Canonical integrity ─────────────────────────────────────────── */
  for (const p of indexable) {
    const cp = canonicalPath(p.canonical);
    if (!p.canonical) {
      add("error", "missing-canonical", p.route, "no <link rel=canonical>");
      continue;
    }
    if (!p.canonical.startsWith("http")) {
      add("error", "non-absolute-canonical", p.route, p.canonical);
    }
    if (!p.canonical.startsWith(site.url)) {
      add(
        "error",
        "foreign-canonical",
        p.route,
        `canonical points off-domain: ${p.canonical}`,
      );
    }
    if (cp && redirects.has(cp)) {
      add(
        "error",
        "canonical-to-redirect",
        p.route,
        `canonical ${cp} is itself a redirect → ${redirects.get(cp)}`,
      );
    }
    if (cp && !rendered.has(cp) && !redirects.has(cp)) {
      add("error", "canonical-to-404", p.route, `canonical ${cp} renders no page`);
    }
    if (cp && cp !== p.route) {
      // Legitimate only if this page deliberately consolidates into another.
      add(
        "warn",
        "cross-canonical",
        p.route,
        `canonical points to a different URL: ${cp}`,
      );
    }
    if (p.ogUrl) {
      const og = canonicalPath(p.ogUrl);
      if (og && cp && og !== cp) {
        add("error", "og-url-mismatch", p.route, `og:url ${og} ≠ canonical ${cp}`);
      }
    }
  }

  /* ── Duplicate metadata ──────────────────────────────────────────── */
  const group = <K extends keyof RenderedPage>(key: K) => {
    const m = new Map<string, string[]>();
    for (const p of indexable) {
      const v = p[key];
      if (typeof v !== "string" || !v.trim()) continue;
      const k = v.trim().toLowerCase();
      m.set(k, [...(m.get(k) ?? []), p.route]);
    }
    return m;
  };

  for (const [title, routes] of group("title")) {
    if (routes.length > 1) {
      add(
        "error",
        "duplicate-title",
        routes[0],
        `${routes.length} pages share the title "${title}": ${routes.join(", ")}`,
      );
    }
  }
  for (const [desc, routes] of group("description")) {
    if (routes.length > 1) {
      add(
        "warn",
        "duplicate-description",
        routes[0],
        `${routes.length} pages share a meta description: ${routes.join(", ")}`,
      );
    }
  }

  const h1Map = new Map<string, string[]>();
  for (const p of indexable) {
    if (p.h1.length === 0) {
      add("error", "missing-h1", p.route, "page renders no <h1>");
    } else if (p.h1.length > 1) {
      add("warn", "multiple-h1", p.route, `${p.h1.length} <h1>: ${p.h1.join(" | ")}`);
    }
    const k = p.h1[0]?.toLowerCase();
    if (k) h1Map.set(k, [...(h1Map.get(k) ?? []), p.route]);
  }
  for (const [h1, routes] of h1Map) {
    if (routes.length > 1) {
      add("warn", "duplicate-h1", routes[0], `${routes.length} pages share H1 "${h1}": ${routes.join(", ")}`);
    }
  }

  for (const p of indexable) {
    if (!p.description?.trim()) {
      add("error", "missing-description", p.route, "no meta description");
    }
    if (!p.title?.trim()) add("error", "missing-title", p.route, "no <title>");
  }

  /* ── Sitemap integrity ───────────────────────────────────────────── */
  for (const path of sitemapPaths) {
    if (redirects.has(path)) {
      add(
        "error",
        "redirect-in-sitemap",
        path,
        `sitemap lists a redirect → ${redirects.get(path)}`,
      );
      continue;
    }
    const p = rendered.get(path);
    if (!p) {
      // Dynamic routes render at request time; only flag when nothing could serve it.
      const servedByDynamic = inv.routes.some(
        (r) => r.routeType === "dynamic" && path.startsWith(r.route.slice(0, r.route.indexOf("/["))+"/"),
      );
      if (!servedByDynamic) {
        add("error", "sitemap-url-not-rendered", path, "sitemap URL has no build output");
      }
      continue;
    }
    if (p.hasNoindex) {
      add("error", "noindex-in-sitemap", path, "sitemap lists a noindex page");
    }
  }

  /* Indexable, rendered pages that the sitemap omits → discovery gap. */
  for (const p of indexable) {
    if (sitemapPaths.has(p.route)) continue;
    const cp = canonicalPath(p.canonical);
    // A page that canonicalises elsewhere is meant to be absent from the sitemap.
    if (cp && cp !== p.route) continue;
    add("warn", "missing-from-sitemap", p.route, "indexable page not in any sitemap");
  }

  /* ── Internal links ──────────────────────────────────────────────── */
  const inboundCount = new Map<string, number>();
  for (const p of pages) {
    for (const href of p.internalLinks) {
      if (href === p.route) continue;
      inboundCount.set(href, (inboundCount.get(href) ?? 0) + 1);
      if (redirects.has(href)) {
        add(
          "warn",
          "internal-link-to-redirect",
          p.route,
          `links to ${href} which 301s → ${redirects.get(href)}`,
        );
      }
    }
  }
  for (const p of indexable) {
    if (!sitemapPaths.has(p.route)) continue;
    if ((inboundCount.get(p.route) ?? 0) === 0 && p.route !== "/") {
      add("warn", "orphan-page", p.route, "no internal links point to this page");
    }
  }

  /* ── Structured data ─────────────────────────────────────────────── */
  for (const p of indexable) {
    if (p.malformedJsonLd > 0) {
      add("error", "malformed-jsonld", p.route, `${p.malformedJsonLd} unparseable JSON-LD block(s)`);
    }
    const cp = canonicalPath(p.canonical);
    for (const u of p.jsonLdUrls) {
      if (u.startsWith(site.url)) continue;
      // Person/Organization @ids may legitimately reference other entities;
      // only a same-site URL with the WRONG host is a real conflict.
      if (/^https?:\/\//.test(u) && new URL(u).host.includes("nritousa")) {
        add("error", "jsonld-host-mismatch", p.route, `JSON-LD URL on wrong host: ${u}`);
      }
    }
    if (p.schemaTypes.includes("FAQPage") && p.faqQuestions.length === 0) {
      add("warn", "faq-schema-without-questions", p.route, "FAQPage schema declares no questions");
    }
    void cp;
  }

  /* ── Staging / host hygiene ──────────────────────────────────────── */
  for (const p of pages) {
    if (p.canonical && /vercel\.app|localhost|127\.0\.0\.1/.test(p.canonical)) {
      add("error", "staging-canonical", p.route, `canonical leaks a non-production host: ${p.canonical}`);
    }
    if (p.canonical?.startsWith("https://nritousa.com")) {
      add("error", "non-www-canonical", p.route, `canonical drops www: ${p.canonical}`);
    }
  }

  return { findings, indexableCount: indexable.length, pageCount: pages.length };
}
