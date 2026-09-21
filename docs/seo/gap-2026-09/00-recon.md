# Phase 0A — Repository recon

_Compiled 2026-09-16 for the September 2026 competitor keyword-gap build
(`feat/immigration-gap-sep-2026`)._

## Framework and page template

| Thing | Finding |
|---|---|
| Framework | Next.js 14 App Router, TypeScript, Tailwind. ~142 top-level entries under `src/app`. |
| Rendering | Almost everything is statically generated. No ISR, no runtime data fetch on content pages. |
| Styling tokens | `brand-*`, `ink-*` Tailwind scales. `Container` is the width wrapper. |
| Charts | **No charting library, deliberately.** The CSP in `next.config.mjs` allows scripts from self + GA only, so a CDN chart library would be silently blocked in production. All charts are hand-rolled inline SVG with a `viewBox` + `h-auto w-full` (zero CLS). Reference implementations: `src/components/calculators/usd-inr/charts.tsx`, `src/components/tools/CutoffChart.tsx`, `src/components/tools/QueueHistoryChart.tsx`, `src/components/tools/TrackerCharts.tsx`. |
| Diagrams | Same answer — inline SVG, authored per page. No diagram library. |

## How pages are registered

Two shapes coexist, and **both** are legitimate:

1. **Cluster child pages** — a data array in `src/lib/<name>Cluster.ts` holding a
   markdown-ish `content` string, rendered by a single `[slug]/page.tsx`.
   Existing clusters: `uscisCluster`, `uscisFormsCluster`, `myuscisCluster`,
   `uscisLifePlanningCluster`, `h1bCluster`, `greenCardCluster`,
   `visaBulletinCluster`, `visitorInsuranceCluster`, plus the tax/OCI/passport ones.
   Content markup is the `ArticleBody` fence set: `:::summary :::key :::note
   :::info :::good :::bad :::tip :::warn :::compare :::steps :::cta :::quickanswer :::faq`.
2. **Dedicated static routes** — a full `page.tsx` that owns its own metadata,
   JSON-LD and React components. Static segments sit as siblings of the `[slug]`
   segment and win the route match (e.g. `/uscis/receipt-number`,
   `/uscis/case-status` live next to `/uscis/[slug]`).

**Decision for this build:** every page that needs an interactive tool, a chart
or an SVG diagram is built as a **dedicated static route**, because the cluster
`content` field is a plain string and cannot host a React component. Cluster
entries are still used where the page is prose-only.

### Sitemap

`src/lib/sitemap-data.ts` is the single source of truth and is *derived* from the
cluster arrays + `tools.ts` + `calculators.ts`. Adding a cluster child or a tool
entry puts it in the sitemap automatically. A dedicated static route must be
added by hand to the right `*Entries` array.

`lastModified` must come from a page's own date stamp or the `CONTENT_BASELINE`
constant — never `new Date()` (enforced by `src/lib/sitemap.lastmod.test.ts`).

## Component inventory (what to reuse, not rebuild)

| Need | Component | Notes |
|---|---|---|
| Answer-first block | `src/components/FastAnswerSnapshot.tsx` | Verified number + `lastVerified` + sources + CTA. This *is* the site's answer-first primitive. |
| Timeline table | `src/components/EstimatedTimelineTable.tsx` | |
| Source block | `src/components/OfficialSourceNote.tsx`, `src/components/tools/OfficialSourceBox.tsx`, `TrackedSourceBox.tsx` | |
| Tool page shell | `src/components/tools/ToolFirstLayout.tsx` | Mobile-first: breadcrumb → H1 → hook → badges → one-line disclaimer → tool. **Gotcha: `{children}` gets no `Container`** — each section must supply its own. |
| SEO hub prose under a tool | `ToolHub.tsx` (`ToolIntro`, `ToolDeepDive`) + `src/lib/toolHubContent.ts` | |
| FAQ rendering | `src/components/tools/ToolFaq.tsx` | Page owns the FAQ **schema**; the component only renders. |
| Byline / reviewed stamp | `ReviewedByline.tsx`, `ArticleByline.tsx`, `AuthorBioBox.tsx` | |
| Email capture | `src/components/tools/ImmigrationEmailSignup.tsx` (Brevo via `/api/newsletter`) and `src/components/calculators/LeadMagnet.tsx` | Reused for "email me this result". |
| Share / download result | `src/components/ResultActions.tsx` | Canvas PNG, no dependency. |
| Input primitives | `src/components/tools/InputCard.tsx`, `ResultCard.tsx` | |
| Disclaimer | `src/components/tools/BottomDisclaimer.tsx`, `ToolDisclaimer.tsx`, `DisclaimerBox.tsx` | |
| JSON-LD helpers | `src/lib/seo.ts` — `pageMetadata`, `breadcrumbJsonLd`, `faqJsonLd`, `jsonLdGraph`, `absoluteUrl` | |

## Calculation logic

`src/lib/calc/*` holds framework-agnostic pure functions with a co-located
`*.test.ts` (vitest). **All new calculation logic for this build goes there**,
never inline in a component. Shared input guards live in `src/lib/calc/validation.ts`.

## Existing data files relevant to this build

| File | Holds |
|---|---|
| `data/visa-bulletin/current.json` | Current bulletin (**September 2026** at time of writing), all categories × countries, FAD + DFF. |
| `data/visa-bulletin/history.json` | `series` of past cutoffs per category/country — the dataset the month-page chart needs. |
| `src/data/nvcData.ts` | NVC planning ranges, DOS fee amounts, official link set. |
| `src/data/uscisProcessingData.ts` | USCIS processing-time ranges. |
| `src/data/siteWideVerifiedNumbers.ts` | Central verified fees/times with `lastVerified` + source URL. Audited by `npm run audit:monthly-numbers`. |
| `src/lib/premiumProcessing.ts` | I-907 fees per form — matches G-1055 edition 09/09/26 exactly (re-verified this run). |
| `src/data/prevailingWageData.ts` | DOL wage-level structure (no dollar figures). |
| `src/data/divorceImmigrationData.ts` | Divorce-by-stage rules, VAWA gates. |
| `data/citizenship-checklist.json` | N-400 readiness data behind `/tools/citizenship-checklist`. |

## Gates

`npx tsc --noEmit` and `npx vitest run` are the real local gates.
`npm run lint` opens an interactive prompt and cannot run here.
`npm run check:links` reports known false positives for `[slug]` clusters.
Vercel's deploy build is the authoritative correctness check.
