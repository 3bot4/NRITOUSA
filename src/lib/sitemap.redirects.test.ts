/**
 * Regression guard: a submitted sitemap must never contain a URL that
 * redirects, and no topic may be retired in one place but live in another.
 *
 * Why this exists: /topics/money-transfer 301'd to /send-money-to-india in
 * next.config.mjs while sitemap-data.ts still emitted it via
 * `topics.map(...)`. The file's header comment even claimed it was excluded,
 * so the bug survived review — Search Console reported a redirect inside a
 * submitted sitemap. A comment cannot enforce an invariant; this test can.
 *
 * The redirect sources are parsed out of next.config.mjs rather than
 * duplicated here, so adding a redirect there automatically extends coverage.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { sitemapSegments } from "./sitemap-data";
import { topics, liveTopics, topicHubPath } from "./topics";

const ROOT = join(__dirname, "..", "..");
const APP_DIR = join(ROOT, "src", "app");

/** `source` paths from next.config.mjs redirects(). */
function configRedirectSources(): string[] {
  const src = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  return [...src.matchAll(/source:\s*["']([^"']+)["']/g)].map((m) => m[1]);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name === "page.tsx" || name === "page.ts") out.push(full);
  }
  return out;
}

/** Route paths whose page.tsx only calls permanentRedirect(). */
function appRedirectSources(): string[] {
  return walk(APP_DIR)
    .filter((f) => /permanentRedirect\(/.test(readFileSync(f, "utf8")))
    .map((f) => {
      const segs = relative(APP_DIR, f).split(sep).slice(0, -1);
      return "/" + segs.filter((s) => !(s.startsWith("(") && s.endsWith(")"))).join("/");
    });
}

const allRedirectSources = [...configRedirectSources(), ...appRedirectSources()];
const sitemapPaths = sitemapSegments.flatMap(({ entries }) => entries.map((e) => e.path));

describe("sitemap never contains a redirecting URL", () => {
  it("finds redirect sources in both next.config.mjs and app routes", () => {
    // Guards the parsers themselves: if a refactor moves redirects somewhere
    // this test can't see, the assertions below would silently pass on an
    // empty list.
    expect(configRedirectSources().length).toBeGreaterThan(0);
    expect(appRedirectSources().length).toBeGreaterThan(0);
  });

  it.each(allRedirectSources)("%s is not in any sitemap", (source) => {
    expect(sitemapPaths).not.toContain(source);
  });

  it("has no duplicate sitemap entries", () => {
    const dupes = sitemapPaths.filter((p, i) => sitemapPaths.indexOf(p) !== i);
    expect(dupes).toEqual([]);
  });
});

describe("retired topics", () => {
  it("excludes retired topics from liveTopics", () => {
    for (const t of topics) {
      expect(liveTopics.includes(t)).toBe(!t.retiredTo);
    }
  });

  it("points topicHubPath at the destination, never at the 301", () => {
    for (const t of topics) {
      const href = topicHubPath(t.slug);
      if (t.retiredTo) {
        expect(href).toBe(t.retiredTo);
        expect(allRedirectSources).not.toContain(href);
      } else {
        expect(href).toBe(`/topics/${t.slug}`);
      }
    }
  });

  it("declares a redirect for every retired topic's own URL", () => {
    // A retired topic whose URL still 200s would be an indexable duplicate of
    // the page that absorbed it.
    for (const t of topics.filter((x) => x.retiredTo)) {
      expect(allRedirectSources).toContain(`/topics/${t.slug}`);
    }
  });

  it("keeps retired topics usable as a taxonomy", () => {
    // The topic must survive lookup — nine articles carry the money-transfer
    // slug for their chip and breadcrumb.
    const retired = topics.filter((t) => t.retiredTo);
    for (const t of retired) {
      expect(t.title).toBeTruthy();
      expect(t.label).toBeTruthy();
    }
  });
});
