# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NRITOUSA.com — a large, SEO-driven content site for NRIs (Non-Resident Indians) and new immigrants in the USA: immigration process guides (H-1B, PERM, I-140, EAD, I-485, green card renewal, visa bulletin), NRI tax/finance content, calculators, and editorial content. Next.js 14 App Router, TypeScript, Tailwind CSS. ~185 routes under `src/app`, almost all statically generated. Owner entity: Wealth Building Academy LLC.

The README.md at the repo root describes the original, much smaller starter shape (topics/articles). The site has since grown into ~20 topical "clusters" (H-1B, PERM, prevailing wage, I-140, EAD, I-485, green card renewal, visa bulletin, OCI, life insurance, Trump Account, India investments, government benefits, success stories, etc.) — the sections below describe the current architecture, which supersedes the README's simplified picture.

## Commands

```bash
npm run dev              # dev server (localhost:3000)
npm run build             # production build
npm run start             # serve the production build
npm test                  # vitest run (src/**/*.test.ts + scripts/seo/**/*.test.ts)
npx vitest run path/to/file.test.ts   # run a single test file
npx tsc --noEmit          # typecheck only — the fast, reliable local gate (see Known gotchas)
npm run check:links       # scripts/check-links.js — has known false positives, not a hard gate (see below)
```

`npm run lint` opens an interactive prompt in this environment and cannot be run non-interactively — **do not rely on it as a gate.** The real gates are `tsc --noEmit`, `vitest run`, and a full `next build` (Vercel is the authoritative build check — see Known gotchas).

### SEO tooling

```bash
npm run seo:inventory      # scripts/seo/route-inventory.ts
npm run seo:gsc-import      # scripts/seo/gsc-import.ts -- (import a GSC export)
npm run seo:opportunities   # scripts/seo/opportunities.ts
npm run seo:audit           # scripts/seo/audit.ts -- (reads *rendered build HTML* — run `next build` first)
```

Raw Google Search Console exports are gitignored. `seo-audit.test.ts` reads `.next/server/app` and skips itself when that's absent, so `npm test` stays fast on a clean checkout.

### Other scripts

- `npm run indexnow` — pings IndexNow after publishing new/changed URLs.
- `npm run audit:intent-numbers` / `npm run audit:monthly-numbers` — verify hardcoded numbers/dates in content against source-of-truth data files (see "Verified-numbers system" below).
- `scripts/pipeline/fetch-market.mjs` — the homepage market-data pipeline (see below); the GitHub Actions workflow that used to run this daily has been **retired and removed** (`.github/workflows/` no longer exists) — treat `data/market.json` as manually refreshed unless a new automation is added.
- `scripts/build-h1b-data.py`, `scripts/build-visa-snapshots.mjs` — data ETL for the H-1B sponsor finder and visa bulletin, run manually against upstream source files (not in CI).

## Architecture

### Route structure

`src/app/` is almost entirely top-level routes (`src/app/<slug>/page.tsx`), **not** nested under a shared segment — e.g. `/perm-timeline`, `/i140-processing-time`, `/green-card-renewal-fee` are siblings, not children of a `/immigration` segment. This is a deliberate SEO decision (short, keyword-matching URLs) — don't "clean up" the route tree by nesting them. A few legacy nested segments remain (`/topics/[slug]`, `/articles/[slug]`, `/h1b-sponsors/[socSlug]/[state]`) alongside dedicated sitemap routes (`sitemap.xml`, `sitemap-articles.xml`, `sitemap-pages.xml`, `sitemap-tax.xml`, `sitemap-tools.xml`, `sitemap-immigration.xml`).

### The "cluster" pattern

Most topical areas (H-1B, PERM, prevailing wage, I-140, EAD/AP, I-485, green card renewal, OCI, life insurance, India investments, Trump Account, government benefits, gifts/foreign-gift-rules, ITR, ~~ND~~ NVC, repatriation, passport, etc.) follow the same three-layer shape:

1. **Data**: `src/data/<name>Data.ts` — the single source of truth for facts, fees, timelines, thresholds. Content components must import from here, never hardcode numbers inline (see "Verified-numbers system").
2. **Cluster logic/config**: `src/lib/<name>Cluster.ts` (or a `src/lib/<name>/` subfolder for larger ones — `h1b/`, `oci/`, `nri-tax/`) — cross-page config, shared copy, FAQ generation, internal-link maps.
3. **Page component**: `src/components/<Name>ClusterPage.tsx` (or `<Name>UI` blocks reused across sibling pages) rendered by the thin `src/app/<slug>/page.tsx` route files, which own `generateMetadata`/JSON-LD.

When adding a new cluster page or extending an existing one, grep for the nearest existing cluster (e.g. `i140Cluster.ts` + `i140ProcessingData.ts` + the `/i140-processing-time` route) and follow its shape rather than inventing a new pattern.

### Verified-numbers system

Numbers (fees, processing times, thresholds) are treated as data, not prose:

- `src/data/siteWideVerifiedNumbers.ts` plus per-cluster data files are the source of truth.
- `FastAnswerSnapshot`, `EstimatedTimelineTable`, `OfficialSourceNote` components (in `src/components/`) render those numbers with a citation/verification affordance — use them instead of writing a number directly into JSX/markdown copy.
- `scripts/audit-user-intent-numbers.ts` / `scripts/audit-monthly-numbers.ts` cross-check content against the data files; monthly-refreshed data (e.g. `permProcessingData.ts`) uses `NEEDS_UPDATE` sentinels flagged by these audits.
- Fee/date-sensitive data files often carry a `feeVerified`-style flag or an explicit "verified as of" field — don't strip these when editing.

### Calculators and tools

- `src/lib/calc/` — pure calculation functions (tax, FCNR/HYSA, 401(k), DTAA/FTC, remittance TCS, RNOR, backdoor Roth, property gains, etc.), each with a co-located `*.test.ts`. These are framework-agnostic and unit-tested directly — put new financial logic here, not inline in a component.
- `src/lib/calculatorContent.ts` + `CalculatorHub.tsx` — data-driven SEO hub wrapper for `/calculators/[slug]` pages (`SoftwareApplication` + `FAQPage` JSON-LD).
- `src/lib/toolHubContent.ts` + `ToolHub.tsx` (`ToolIntro`/`ToolDeepDive`) — the equivalent hub wrapper for `/tools/*` pages.
- A newer mobile-first `ToolFirstLayout` system is being rolled out to individual tool/calculator routes; most existing tool pages are still on the older tall-hero layout — check the route's current file before assuming which layout it uses. **Gotcha:** `{children}` under `ToolFirstLayout` gets no `Container` wrapper, so page content must supply its own; `Tailwind`'s `hidden` attribute loses to a `.grid` class if both are applied to the same element.

### Article content

Long-form articles (as opposed to cluster/calculator pages) use a dense, no-hero, ~720px-wide template with custom markdown-like fences (`:::info`, `:::good`, `:::bad`, `:::compare`, `:::tip`, `:::warn`, `:::steps`, `:::cta`) rendered by `ArticleBody.tsx` — every article should be dense and scannable, not long unbroken prose. Outbound (external) links belong only at the very end of a page (source box / end of article) — top-of-page CTAs and early content must link internally.

### Data flow for site-wide widgets

- **Homepage market ticker**: `data/market.json` (current snapshot, overwritten by the pipeline) + `data/history/YYYY-MM-DD.json` (append-only archive) + `data/homepage-config.json` (manually maintained values: top NRE FD rate, visa bulletin release schedule) are read via `src/lib/market.ts`. The frontend never calls external market APIs directly — only static JSON. See `scripts/pipeline/` for the fetch/fallback/staleness logic per source (full schema and source list are documented in README.md).
- **Visa bulletin**: `data/visa-bulletin/` is the single source of truth, consumed by both the dedicated `/visa-bulletin` cluster and the homepage EB-2 India ticker item — don't build a second parser.
- **H-1B Sponsor Finder** (`/h1b-sponsors/[socSlug]/[state]`, `src/lib/h1b/sponsors.ts`): tries Postgres via `DATABASE_URL` (see `pg` dependency) first, falls back to `data/h1b/sponsors.csv` read at runtime when no database is configured. That CSV path isn't visible to Next's static file tracing, so it's force-included in the relevant API/page bundles via `outputFileTracingIncludes` in `next.config.mjs` — if you add another route that reads the CSV at runtime, add it there too.
- **Indian population by state** pages (`/indian-population-in-<state>`) are generated from `src/data/indianPopulationData.ts`, validated against Census data in a co-located test.

### Redirects and consolidation

`next.config.mjs` `redirects()` is long and each entry has a comment explaining *why* a page was merged/moved (e.g. topic pages consolidated into cluster hubs, duplicate-intent pages merged, keeping internal link equity). When retiring or merging a page, add a redirect there with the same kind of rationale comment rather than a bare mapping — future edits need the context to know if the redirect is still needed.

### Security headers / CSP

`next.config.mjs` sets a strict CSP allowing only self + Google Analytics (`googletagmanager.com`, `google-analytics.com`). `'unsafe-eval'` is added to `script-src` in dev only (Next Fast Refresh needs it) and is never shipped to production. If you add a new third-party script or embed, it must be added to the CSP explicitly or it will be silently blocked in production.

### Server-only helpers

Files that must not run in the browser use the `server-only` package (e.g. formatting/config helpers used by both server and client components). When adding a helper used from a server component, use `src/lib/format.ts`'s exports rather than importing UI-layer helpers (e.g. `ui.tsx`-style `usd()`); a server-component import of a client-only helper builds fine in `tsc` but fails a full `next build`.

## Known gotchas

- **Local `next build` is not a reliable gate.** Untracked duplicate files following the pattern `<name> 2.ts` / `<name> 2.tsx` (an editor/IDE artifact) fail typecheck if present — check `git status` for untracked ` 2.`-suffixed files before trusting a red build, and quarantine/delete them rather than debugging the "error" as a code issue. One such duplicate directory (`scripts/seo/lib 2/`) exists untracked in this checkout as of this writing; it's outside `tsconfig`'s included paths (`scripts/` is excluded) so it shouldn't affect `tsc`, but remove or ignore it if it ever causes confusion. **Vercel's deploy build is the authoritative correctness check** — `tsc --noEmit` is the fast local proxy for it.
- Dynamic OG/icon routes using `next/og`'s `ImageResponse` (e.g. a dynamic `icon.tsx`/`apple-icon.tsx`) have previously hung both `next dev` (17+ min) and `next build` (times out collecting page data on *every* route, not just the icon's). Verify anything in this area on Vercel rather than waiting out a local hang.
- `scripts/check-links.js` flags every `[slug]`-cluster internal link as broken (it doesn't resolve dynamic segments) — this is a known false-positive pattern per cluster, not a merge gate.
- Sitemap `lastmod` values must come from the `CONTENT_BASELINE` constant in `src/lib/sitemap-data.ts`, never `new Date()` — enforced by `sitemap.lastmod.test.ts`.
- Freshness/"last updated" stamps are safe to bulk-update, but a large number of files hold **event dates that are themselves the data** (e.g. H-4 EAD rule effective dates, an LTCG law effective date, visa bulletin cutoff dates) — never bulk find-and-replace dates across the content tree without checking which ones are facts vs. stamps.
- `uscis.gov` and `travel.state.gov` block automated fetches (403) — use `WebSearch` with `allowed_domains` for those instead of `WebFetch`. `irs.gov` and `federalregister.gov` are directly fetchable. The Census API needs an API key.
- This repo has had git/network reliability issues in some sandboxed environments (fetch/pull hangs). If `git fetch`/`pull` hangs, driving changes through the GitHub REST API (token derived from the remote URL) or the Vercel CLI/API has been the fallback — not a normal-path instruction, just a symptom to recognize if it recurs.
