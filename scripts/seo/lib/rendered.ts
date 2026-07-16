/**
 * Ground-truth page facts, read from the PRODUCTION BUILD OUTPUT
 * (.next/server/app/**\/*.html) rather than from the source.
 *
 * Why not parse src/app? Titles, descriptions and canonicals mostly come from
 * cluster data modules through pageMetadata(), and the title template
 * ("%s | NRI to USA") is applied by the layout. Only the rendered HTML shows
 * what Google actually receives — which is the whole question this audit asks.
 *
 * Requires a prior `next build`. The prerendered .html files exist for every
 * statically generated route (this site is almost entirely static), which is
 * exactly the set we care about for indexing.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { REPO_ROOT } from "./inventory";

const APP_OUT = join(REPO_ROOT, ".next", "server", "app");

export interface RenderedPage {
  /** Route path as served ("/", "/foo/bar"). */
  route: string;
  file: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  ogUrl: string | null;
  ogTitle: string | null;
  h1: string[];
  /** @type values found in JSON-LD, deduped. */
  schemaTypes: string[];
  /** JSON-LD blocks that failed to parse. */
  malformedJsonLd: number;
  /** url/@id values declared inside JSON-LD. */
  jsonLdUrls: string[];
  faqQuestions: string[];
  /** Visible questions rendered in the body (used to validate FAQPage). */
  wordCount: number;
  /** Root-relative internal hrefs found in the page body. */
  internalLinks: string[];
  hasNoindex: boolean;
}

export function buildExists(): boolean {
  return existsSync(APP_OUT);
}

function walkHtml(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** .next/server/app/foo/bar.html → /foo/bar · index.html → / */
function outToRoute(file: string): string {
  const rel = relative(APP_OUT, file).replace(/\.html$/, "");
  const parts = rel.split(sep);
  if (parts.length === 1 && parts[0] === "index") return "/";
  return "/" + parts.join("/");
}

const decode = (s: string): string =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

function meta(html: string, attr: "name" | "property", key: string): string | null {
  // Attribute order varies, so match either name-then-content or the reverse.
  const a = new RegExp(
    `<meta[^>]+${attr}=["']${key}["'][^>]*content=["']([^"']*)["']`,
    "i",
  ).exec(html);
  if (a) return decode(a[1]);
  const b = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${key}["']`,
    "i",
  ).exec(html);
  return b ? decode(b[1]) : null;
}

const stripTags = (s: string) => s.replace(/<[^>]*>/g, " ");

function collectTypes(node: unknown, out: Set<string>, urls: string[]): void {
  if (Array.isArray(node)) {
    for (const n of node) collectTypes(n, out, urls);
    return;
  }
  if (!node || typeof node !== "object") return;
  const o = node as Record<string, unknown>;
  const t = o["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) for (const x of t) if (typeof x === "string") out.add(x);
  for (const k of ["url", "@id", "mainEntityOfPage"]) {
    const v = o[k];
    if (typeof v === "string" && v.startsWith("http")) urls.push(v);
    else if (v && typeof v === "object") {
      const inner = (v as Record<string, unknown>)["@id"];
      if (typeof inner === "string" && inner.startsWith("http")) urls.push(inner);
    }
  }
  for (const v of Object.values(o)) collectTypes(v, out, urls);
}

function extractFaqQuestions(node: unknown, out: string[]): void {
  if (Array.isArray(node)) {
    for (const n of node) extractFaqQuestions(n, out);
    return;
  }
  if (!node || typeof node !== "object") return;
  const o = node as Record<string, unknown>;
  if (o["@type"] === "Question" && typeof o.name === "string") out.push(o.name);
  for (const v of Object.values(o)) extractFaqQuestions(v, out);
}

export function parseHtml(html: string, route: string, file: string): RenderedPage {
  const titleRaw = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? null;
  const canonical =
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1] ??
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i.exec(html)?.[1] ??
    null;

  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(stripTags(m[1])).replace(/\s+/g, " ").trim(),
  );

  const schemaTypes = new Set<string>();
  const jsonLdUrls: string[] = [];
  const faqQuestions: string[] = [];
  let malformedJsonLd = 0;
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(decode(m[1]));
      collectTypes(parsed, schemaTypes, jsonLdUrls);
      extractFaqQuestions(parsed, faqQuestions);
    } catch {
      malformedJsonLd++;
    }
  }

  // Body text only — <head>, scripts and styles would otherwise inflate the count.
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  const text = decode(
    stripTags(
      body
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " "),
    ),
  );
  const wordCount = text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;

  const internalLinks = [...body.matchAll(/<a[^>]+href=["'](\/[^"'#?]*)/gi)].map(
    (m) => m[1].replace(/\/$/, "") || "/",
  );

  const robots = meta(html, "name", "robots");

  return {
    route,
    file,
    title: titleRaw ? decode(stripTags(titleRaw)).trim() : null,
    description: meta(html, "name", "description"),
    canonical,
    robots,
    ogUrl: meta(html, "property", "og:url"),
    ogTitle: meta(html, "property", "og:title"),
    h1,
    schemaTypes: [...schemaTypes].sort(),
    malformedJsonLd,
    jsonLdUrls: [...new Set(jsonLdUrls)],
    faqQuestions,
    wordCount,
    internalLinks: [...new Set(internalLinks)],
    hasNoindex: /noindex/i.test(robots ?? ""),
  };
}

export function loadRendered(): RenderedPage[] {
  if (!buildExists()) {
    throw new Error(
      `No build output at ${relative(REPO_ROOT, APP_OUT)}.\n` +
        `Run \`npx next build\` first — this audit reads the rendered HTML.`,
    );
  }
  return walkHtml(APP_OUT)
    .map((f) => parseHtml(readFileSync(f, "utf8"), outToRoute(f), relative(REPO_ROOT, f)))
    .sort((a, b) => a.route.localeCompare(b.route));
}
