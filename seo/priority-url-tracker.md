# Priority URL Tracker — nritousa.com

Living index of the site's highest-value URLs for the current SEO push, grouped
by cluster. Use it to prioritise Search Console monitoring, internal-linking,
and refresh work.

- **Domain:** https://www.nritousa.com
- **Last full audit:** 2026-07-05
- **Sitemap:** all URLs below are in `src/lib/sitemap-data.ts` and served via
  `/sitemap.xml` → 5 segment sitemaps.
- **SEO baseline (verified 2026-07-05):** every URL below ships a self-canonical
  URL, indexable robots (site default `index,follow`; only `/api/*` and
  `/*/opengraph-image` are disallowed), a unique title + meta description via
  `pageMetadata()`, an H1, `BreadcrumbList` + (where FAQs exist) `FAQPage` schema
  via `src/lib/seo.ts`, and a visible "last reviewed" line on every page that
  quotes fees/timelines. Gaps are called out per-row in **Notes**.

Legend — **Type:** hub / guide / tool / calculator / checklist ·
**CTA:** soft CTA band (free guide + related tool) present · **Rev:** visible
last-reviewed date present.

---

## Employment green card — PERM / PWD

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /perm-processing-time-calculator | perm processing time | perm timeline 2026, dol perm processing | transactional | calculator | ✅ | ✅ | Cluster hub. Links out to PWD, prevailing-wage, EB2/EB3. |
| /dol-processing-times | dol processing times | dol perm queue, atlanta ncp | informational | guide | – | ✅ | Add soft CTA (backlog). |
| /pwd-processing-time | prevailing wage determination time | pwd processing time, dol pwd | informational | guide | – | ✅ | |
| /perm-timeline | perm timeline | perm steps, perm stages | informational | guide | – | ✅ | |
| /h1b-perm-max-out-calculator | h1b max out perm | 6 year h1b limit, perm before maxout | transactional | calculator | – | ✅ | |
| /eb2-eb3-priority-date-india | eb2 eb3 priority date india | india green card wait | informational | guide | – | ✅ | |

## Prevailing wage

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /prevailing-wage-calculator | prevailing wage calculator | dol wage level, oflc wage | transactional | calculator | – | ✅ | Cluster hub. |
| /dol-wage-levels-explained | dol wage levels | wage level 1 2 3 4 | informational | guide | – | ✅ | |
| /h1b-prevailing-wage | h1b prevailing wage | h1b minimum salary | informational | guide | – | ✅ | |

## I-140

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /i140-processing-time | i140 processing time | i-140 approval time 2026 | informational | guide | ✅ | ✅ | Cluster hub. |
| /i140-premium-processing | i140 premium processing | i-140 premium fee, 15 day | transactional | guide | – | ✅ | Fees via `src/lib/premiumProcessing.ts`. |
| /i140-approved-what-next | i140 approved what next | after i-140 approval | informational | guide | – | ✅ | |

## EAD / Advance Parole

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /ead-processing-time | ead processing time | c09 ead, i-765 timeline | informational | guide | ✅ | ✅ | Cluster hub. |
| /advance-parole-processing-time | advance parole processing time | i-131 timeline | informational | guide | – | ✅ | |
| /ead-renewal-gap | ead renewal gap | ead auto extension 540 day | informational | guide | – | ✅ | |

## I-485 / Adjustment of Status

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /i485-processing-time | i485 processing time | adjustment of status timeline | informational | guide | ✅ | ✅ | Cluster hub. Links green-card-tracker. |
| /i485-timeline | i485 timeline | i-485 steps, aos stages | informational | guide | – | ✅ | |
| /i485-documents-checklist | i485 documents checklist | aos required documents | informational | checklist | – | ✅ | |

## Green Card Renewal (Form I-90)

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /green-card-renewal | green card renewal | renew green card, i-90 | informational | hub | ✅ | ✅ | Cluster hub. |
| /green-card-renewal-processing-time | green card renewal processing time | i-90 processing time | informational | guide | – | ✅ | Has FAQPage schema. |
| /green-card-renewal-fee | green card renewal fee | i-90 fee 2026 | informational | guide | – | ✅ | Flagship Fast Answer page. |
| /renew-green-card-online | renew green card online | file i-90 online | transactional | guide | – | ✅ | |
| /replace-green-card | replace green card | lost green card, i-90 replacement | informational | guide | – | ✅ | |
| /i90-vs-i751 | i90 vs i751 | remove conditions vs renew | informational | guide | – | ✅ | |
| /expired-green-card | expired green card | green card expired travel/work | informational | guide | – | ✅ | |

## NVC / Consular processing

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /nvc-case-status | nvc case status | ceac case status | informational | hub | ✅ | ✅ | Cluster hub. Links nvc-processing-time. |
| /what-is-nvc-case-number | nvc case number | nvc number format | informational | guide | – | ✅ | |
| /nvc-processing-time | nvc processing time | nvc document review time | informational | guide | – | ✅ | |
| /nvc-document-checklist-india | nvc document checklist india | ds-260 documents india | informational | checklist | – | ✅ | |
| /nvc-public-inquiry | nvc public inquiry | contact nvc, nvc inquiry form | informational | guide | – | ✅ | |

## OCI / NRI compliance tools

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /tools/oci-cost-calculator | oci cost calculator | oci fees usa | transactional | calculator | – | – | Shows fees → add review line (backlog). |
| /tools/oci-eligibility-checker | oci eligibility | oci eligible check | transactional | tool | – | – | |
| /tools/oci-timeline-calculator | oci processing time | oci timeline usa | transactional | calculator | – | – | Shows timelines → add review line (backlog). |
| /tools/fbar-fatca-checker | fbar fatca checker | fbar threshold, fatca 8938 | transactional | tool | ✅ | – | |
| /tools/form-3520-india-gift-checker | form 3520 gift | india gift reporting usa | transactional | tool | ✅ | – | |
| /tools/form-10f-generator | form 10f | form 10f online | transactional | tool | ✅ | – | |
| /tools/form-15ca-15cb-checklist | form 15ca 15cb | 15ca 15cb nri | transactional | checklist | ✅ | – | |
| /tools/nri-tds-refund-checklist | nri tds refund | tds refund nri | transactional | checklist | ✅ | – | |

## H-1B tools

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /tools/h1b-sponsor-finder | h1b sponsors | h1b sponsor companies by state | transactional | tool | – | – | Real FY2026 Q2 DOL data. |
| /tools/h1b-salaries | h1b salary | h1b wage data | transactional | tool | – | – | Shows wage data → add review line (backlog). |
| /tools/h1b-lottery-timeline | h1b lottery timeline | h1b registration dates | informational | tool | – | – | |
| /tools/h1b-transfer-risk-checklist | h1b transfer risk | h1b transfer denial | transactional | checklist | – | ✅ | |
| /tools/h4-ead-navigator | h4 ead | h4 ead eligibility | transactional | tool | – | – | |

## USCIS tools

| URL | Primary keyword | Secondary keywords | Intent | Type | CTA | Rev | Notes |
|---|---|---|---|---|---|---|---|
| /tools/uscis-receipt-number-decoder | uscis receipt number | receipt number meaning | informational | tool | – | – | |
| /tools/uscis-case-status-meaning | uscis case status meaning | case status messages | informational | tool | – | – | |
| /tools/uscis-notice-decoder | uscis notice decoder | uscis notice types | informational | tool | – | – | |
| /tools/uscis-form-finder | uscis form finder | which uscis form | transactional | tool | – | – | |
| /tools/processing-times | uscis processing times | case processing time | transactional | tool | – | – | Shows timelines → add review line (backlog). |
| /tools/priority-date-checker | priority date checker | visa bulletin checker | transactional | tool | – | – | |
| /tools/green-card-tracker | green card tracker | green card backlog inventory | transactional | tool | – | – | |
| /tools/citizenship-checklist | citizenship checklist | n-400 checklist | transactional | checklist | – | – | |

## Core hubs (already established, high authority)

| URL | Primary keyword | Type | Notes |
|---|---|---|---|
| / | nri to usa | hub | Homepage. Links a curated 3–6 tools per section. |
| /immigration | nri immigration usa | hub | |
| /visa-bulletin | visa bulletin 2026 | hub | Monthly refresh. |
| /green-card | green card india | hub | |
| /oci | oci card usa | hub | |
| /india-tax-compliance | nri tax compliance | hub | |
| /uscis | uscis guide | hub | |
| /tools | nri tools | hub | |
| /calculators | nri calculators | hub | |

---

## Backlog (tracked, not yet done)

1. Soft CTA band on remaining cluster support pages (all rows marked `–` under CTA).
2. Visible "last reviewed" line on tool pages that quote fees/timelines/wage data
   (OCI cost + timeline calculators, /tools/processing-times, /tools/h1b-salaries).
3. Extend `SoftCta` usage to the top OCI and tax-compliance tools.

See [search-console-monitoring-checklist.md](./search-console-monitoring-checklist.md)
and [monthly-refresh-checklist.md](./monthly-refresh-checklist.md).
