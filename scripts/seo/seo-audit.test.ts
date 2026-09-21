/**
 * SEO invariants as tests, so a regression fails CI instead of quietly
 * shipping and being discovered months later in Search Console.
 *
 * These run against the PRODUCTION BUILD OUTPUT. When .next/server/app is
 * absent the suite skips rather than fails: `npm test` must stay useful
 * without a 3-minute build, while `npm run build && npm test` gets the full
 * gate. Skipping is safe because the checks are also enforced by
 * `npm run seo:audit`, which exits non-zero in CI.
 *
 * Only ERROR-level findings are asserted here. Warnings (thin pages, orphans,
 * pages missing from the sitemap) are real work but are judgement calls that
 * should not block a deploy — they live in reports/seo-audit.json.
 */
import { describe, expect, it } from "vitest";
import { buildExists, loadRendered } from "./lib/rendered";
import { runAudit, type Finding } from "./lib/audit-rules";
import { resolveChains } from "./lib/redirects";

const hasBuild = buildExists();
const d = hasBuild ? describe : describe.skip;

/** Group findings by check so a failure message names every offending URL. */
function byCheck(findings: Finding[]): Map<string, Finding[]> {
  const m = new Map<string, Finding[]>();
  for (const f of findings) m.set(f.check, [...(m.get(f.check) ?? []), f]);
  return m;
}

const format = (fs: Finding[]) =>
  fs.map((f) => `  ${f.route} — ${f.detail}`).join("\n");

/**
 * Loaded lazily, inside the tests.
 *
 * `describe.skip` still RUNS its callback — it only marks the tests it
 * registers as skipped — so reading the build output at describe-body level
 * threw on a clean checkout instead of skipping, which is the opposite of what
 * the header above promises. Deferring the read into the test bodies (memoised,
 * so the audit runs once) makes the documented behaviour real.
 */
let cache: { pages: ReturnType<typeof loadRendered>; grouped: Map<string, Finding[]> } | null =
  null;

function audit() {
  if (!cache) {
    const pages = loadRendered();
    const { findings } = runAudit(pages);
    cache = {
      pages,
      grouped: byCheck(findings.filter((f) => f.level === "error")),
    };
  }
  return cache;
}

d("rendered SEO invariants", () => {
  it("renders a meaningful number of pages", () => {
    // Guards the loader: an empty read would make every check below vacuous.
    expect(audit().pages.length).toBeGreaterThan(100);
  });

  const CHECKS = [
    "missing-canonical",
    "non-absolute-canonical",
    "foreign-canonical",
    "canonical-to-redirect",
    "canonical-to-404",
    "og-url-mismatch",
    "duplicate-title",
    "missing-title",
    "missing-description",
    "missing-h1",
    "redirect-in-sitemap",
    "noindex-in-sitemap",
    "sitemap-url-not-rendered",
    "malformed-jsonld",
    "jsonld-host-mismatch",
    "staging-canonical",
    "non-www-canonical",
  ];

  for (const check of CHECKS) {
    it(`has no ${check}`, () => {
      const fs = audit().grouped.get(check) ?? [];
      expect(fs.length, `\n${format(fs)}\n`).toBe(0);
    });
  }
});

describe("redirects resolve cleanly", () => {
  const chains = resolveChains();

  it("has redirects to check", () => {
    expect(chains.length).toBeGreaterThan(0);
  });

  it("has no redirect loops", () => {
    const looped = chains.filter((c) => c.loop);
    expect(looped.map((c) => c.source)).toEqual([]);
  });

  it("has no multi-hop redirect chains", () => {
    // Each extra hop leaks link equity and is a Search Console "redirect
    // error" waiting to happen. Every source must reach its target in one hop.
    const chained = chains.filter((c) => c.hops.length > 1);
    expect(
      chained.map((c) => `${c.source} → ${c.hops.join(" → ")}`),
    ).toEqual([]);
  });

  it("never redirects to a relative or off-site destination", () => {
    for (const c of chains) {
      expect(c.final.startsWith("/"), `${c.source} → ${c.final}`).toBe(true);
    }
  });
});
