# Monthly / Quarterly Refresh Checklist

Pages that quote fees, government timelines, or dated data drift out of date and
must be re-verified on a schedule. Stale numbers hurt trust and rankings.

- **Owner:** content
- **Automation:** run `npm run audit:monthly-numbers` and
  `npm run audit:intent-numbers` first — they flag `NEEDS_UPDATE` sentinels and
  numbers that look stale. Then verify against the official source below.
- After any data edit, bump the page's `*_UPDATED` / last-reviewed constant so
  the visible "Reviewed" line and sitemap `lastmod` update.

---

## Monthly (verify by the 5th, after new government releases)

| Page(s) | What to check | Official source |
|---|---|---|
| /visa-bulletin (+ /visa-bulletin/* cluster) | Final Action + Dates for Filing, India EB rows | travel.state.gov Visa Bulletin |
| /perm-processing-time-calculator, /dol-processing-times, /pwd-processing-time, /perm-timeline | DOL PERM + PWD queue months | flag.dol.gov processing times |
| /prevailing-wage-calculator, /dol-wage-levels-explained | OFLC wage data / methodology | flag.dol.gov |
| /nvc-processing-time, /nvc-case-status | NVC document review + interview scheduling times | travel.state.gov / NVC timeframes |
| /i485-processing-time, /i140-processing-time, /ead-processing-time, /advance-parole-processing-time, /green-card-renewal-processing-time, /tools/processing-times | USCIS processing times by form/field office | egov.uscis.gov processing-times |

## Quarterly

| Page(s) | What to check | Official source |
|---|---|---|
| /green-card-renewal-fee, /green-card-renewal, /renew-green-card-online, /replace-green-card | Form I-90 filing + biometrics fees | uscis.gov fee schedule (G-1055) |
| /i140-premium-processing | I-140 premium processing fee + window | uscis.gov premium processing |
| USCIS fee-bearing pages generally | Any USCIS filing fee quoted | uscis.gov fee schedule |
| /indian-passport-renewal-usa (+ cluster) | Passport/renewal fees + timelines | VFS Global / Indian embassy |
| /oci, /tools/oci-cost-calculator, /tools/oci-timeline-calculator | OCI fees + processing times (never hardcode — `src/lib/oci/config.ts`) | Indian consulate / VFS OCI |
| /tools/h1b-sponsor-finder, /tools/h1b-salaries | Latest OFLC/LCA disclosure file (FY quarter) | dol.gov OFLC performance data |

## Annual / statutory-date pages

| Page(s) | What to check | Trigger |
|---|---|---|
| /india-tax-compliance (+ ITR/TDS clusters) | India ITR due dates, FY thresholds | India Budget / CBDT (Feb–Jul) |
| FBAR / FATCA pages (/tools/fbar-fatca-checker, related) | FBAR (Apr 15 / Oct 15 auto-ext) + FATCA 8938 thresholds | IRS annual |
| US/India tax-deadline mentions | US filing deadlines, treaty items | IRS annual |
| /return-to-india (401k / RNOR content) | 401k early-withdrawal rules, RNOR windows | IRS / India FA changes |
| /send-money-to-india, repatriation cluster | LRS limit, TCS rates | RBI / India Budget |

---

## Refresh procedure (per page)

1. Run the audit scripts; open any `NEEDS_UPDATE` page.
2. Verify each fee/timeline against the official source column.
3. Edit the central data file (never hardcode in the page): e.g.
   `src/data/permProcessingData.ts`, `src/data/greenCardRenewalData.ts`,
   `src/lib/oci/config.ts`, `src/lib/premiumProcessing.ts`.
4. Bump the page's `*_UPDATED` constant → updates the visible "Reviewed" line
   and the sitemap `lastmod`.
5. `npm run indexnow` after deploy so engines re-crawl the freshened pages.
