# SEO Indexation Audit — nritousa.com

**Date:** 2026-06-23
**Preferred canonical origin:** `https://www.nritousa.com` (https + www, no trailing slash, lowercase, no query params)
**Total indexable URLs in sitemaps:** 280

This audit documents the state of canonical/sitemap/robots/redirect handling and
the changes made to improve Google Search Console indexation (baseline: ~25
indexed; 102 "Discovered – currently not indexed", 5 "Crawled – currently not
indexed", 3 "Duplicate without user-selected canonical", 3 "Page with redirect").

---

## 1. Findings — what was already correct

The codebase was already in good technical-SEO shape. Verified, no change needed:

- **`metadataBase`** is set to `https://www.nritousa.com` in `src/app/layout.tsx`,
  so every relative canonical/og:url resolves to the www + https origin.
- **Self-referencing canonicals**: 77 of 86 `page.tsx` routes build metadata via
  `pageMetadata()` (`src/lib/seo.ts`), which always emits
  `alternates: { canonical: <path> }`. Dynamic routes pass their own path, so
  canonicals are correct on cluster/article/tool pages.
- **No internal links point at redirecting URLs** (checked `/privacy`,
  `/terms-of-use`, `/topics/money-transfer`,
  `/articles/indian-passport-renewal-usa`, `/tools/nri-global-wealth-tax-organizer`).
- **Tool pages are not thin** — e.g. `/tools/priority-date-checker` ships an H1,
  hook, 7 FAQs (with `FAQPage` JSON-LD), a related-guides block, breadcrumbs,
  `WebApplication` + `BreadcrumbList` JSON-LD, and a disclaimer — all
  server-rendered.
- **Homepage links broadly** to hubs and every tool (`AllToolsGrid`, USCIS / tax
  spotlights, popular guides), keeping priority pages within ~2 clicks.

The indexation gap is therefore driven mainly by **crawl budget on a young site
(founded 2026) with ~280 URLs**, not by broken canonicals. The fixes below help
Google prioritize and segment crawling.

---

## 2. Changes made

### Sitemap — split into an index + five section sitemaps
Replaced the single `src/app/sitemap.ts` with:

| Route | Backed by | URLs |
|---|---|---|
| `/sitemap.xml` | sitemap **index** → links the five below | — |
| `/sitemap-pages.xml` | home, hubs, topic landings, legal | 35 |
| `/sitemap-tools.xml` | `/tools/*`, `/calculators/*`, `/education/*` calcs | 37 |
| `/sitemap-articles.xml` | `/articles/*` | 94 |
| `/sitemap-tax.xml` | India tax compliance + ITR/TDS/repat/gift clusters + NRI wealth | 27 |
| `/sitemap-immigration.xml` | USCIS / H-1B / green card / visa bulletin / passport | 87 |

- Single source of truth: `src/lib/sitemap-data.ts` (segment arrays + XML
  serializers). Route handlers are `force-static`.
- All URLs are absolute `https://www.nritousa.com` paths, 200-status,
  self-canonical, deduped (verified 0 duplicates across segments).
- `lastmod` uses each page's real `updated`/`date` where available (articles &
  clusters); evergreen hubs use the build date. The index `lastmod` per segment
  is the newest entry inside it.

### robots.txt
`src/app/robots.ts` now disallows `/api/` (JSON form/data endpoints — no
indexable content) while keeping everything else (`tools`, `articles`, hubs,
JS/CSS) open. `Sitemap:` points to the `/sitemap.xml` index; `host` is the www
origin.

---

## 3. URLs excluded from the sitemap (and why)

| URL / pattern | Reason |
|---|---|
| `/privacy` → `/privacy-policy` | 308 redirect (legacy) |
| `/terms-of-use` → `/terms-and-conditions` | 308 redirect (legacy) |
| `/tools/nri-global-wealth-tax-organizer` → `/nri-wealth-checkup` | 308 redirect (duplicate of canonical tool) |
| `/topics/money-transfer` → `/send-money-to-india` | 308 redirect (`next.config.mjs`) |
| `/articles/indian-passport-renewal-usa` → `/indian-passport-renewal-usa` | 308 redirect (`next.config.mjs`) |
| `/nri-wealth-checkup/{income,assets,profile,dashboard,report}` | App states, `robots: { index:false }` |
| `/api/*` (5 routes) | Internal JSON endpoints, disallowed in robots |
| `/author/[slug]` | Thin profile pages — intentionally not promoted for indexing |

---

## 4. Redirects (all 308 permanent — kept working, kept out of sitemap)

- `/topics/money-transfer` → `/send-money-to-india` *(next.config.mjs)*
- `/articles/indian-passport-renewal-usa` → `/indian-passport-renewal-usa` *(next.config.mjs)*
- `/privacy` → `/privacy-policy` *(permanentRedirect)*
- `/terms-of-use` → `/terms-and-conditions` *(permanentRedirect)*
- `/tools/nri-global-wealth-tax-organizer` → `/nri-wealth-checkup` *(permanentRedirect)*

These account for GSC's "Page with redirect" status — expected and correct.

---

## 5. Canonical fixes

No broken canonicals were found in code; all indexable routes self-canonicalize
via `pageMetadata()`. The **host-level** www/https consolidation (non-www → www,
http → https) is enforced at the **Vercel domain / DNS layer**, not in the repo.

**Manual verification required (see §8):** confirm in the Vercel project that
`nritousa.com` 308-redirects to `www.nritousa.com` and that http → https is
forced. If both already happen, GSC's "Duplicate without user-selected
canonical" entries will resolve as Google recrawls.

---

## 6. Noindex pages (correct — leave as-is)

`/nri-wealth-checkup/income`, `/assets`, `/profile`, `/dashboard`, `/report`
— interactive organizer states, `robots: { index:false, follow:true }`.

No tool, calculator, guide, hub, or article is noindexed.

---

## 7. Top 25 priority URLs to submit / inspect in Search Console

Submit the **sitemap index** (`/sitemap.xml`) first, then use URL Inspection →
Request Indexing on these hubs/pillars (priority 0.9–1.0):

1. https://www.nritousa.com/
2. https://www.nritousa.com/tools
3. https://www.nritousa.com/topics
4. https://www.nritousa.com/education
5. https://www.nritousa.com/long-term-nri-wealth
6. https://www.nritousa.com/india-tax-compliance
7. https://www.nritousa.com/india-tax-compliance/nri-tax-forms-limits
8. https://www.nritousa.com/nri-wealth-checkup
9. https://www.nritousa.com/india-property
10. https://www.nritousa.com/return-to-india
11. https://www.nritousa.com/nri-estate-planning
12. https://www.nritousa.com/send-money-to-india
13. https://www.nritousa.com/uscis
14. https://www.nritousa.com/uscis/case-status
15. https://www.nritousa.com/uscis/receipt-number
16. https://www.nritousa.com/uscis/processing-times
17. https://www.nritousa.com/uscis/forms
18. https://www.nritousa.com/uscis/life-planning
19. https://www.nritousa.com/h1b
20. https://www.nritousa.com/green-card
21. https://www.nritousa.com/visa-bulletin
22. https://www.nritousa.com/indian-passport-renewal-usa
23. https://www.nritousa.com/immigration-tracker
24. https://www.nritousa.com/free-immigrant-wealth-guide
25. https://www.nritousa.com/resources

---

## 8. Manual / follow-up items

- **Vercel domain redirect** — verify `nritousa.com` → `www.nritousa.com` (308)
  and http → https are enforced at the platform level (see §5).
- **Submit the five section sitemaps** in GSC (or just the index — Google reads
  children automatically).
- **Re-inspect the 3 "Duplicate without user-selected canonical" URLs** after
  the next crawl; if any persist, capture which URLs GSC names — they should now
  carry a self-canonical.
- **Content depth spot-check** — most tools are rich; if any newer tool ships as
  a bare widget, mirror the `/tools/priority-date-checker` template (intro,
  who-it's-for, how-it-works, example, FAQs, related, disclaimer).
- The "Discovered – currently not indexed" backlog will shrink over weeks as
  crawl budget grows for the young domain; the segmented sitemaps + internal
  linking accelerate it but indexation is ultimately Google-paced.
