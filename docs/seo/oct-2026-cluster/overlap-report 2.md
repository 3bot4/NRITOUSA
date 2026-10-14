# Phase 1 — Internal content-overlap report

**Branch:** `feat/oct-2026-immigration-cluster`
**Date:** 2026-10-13
**Author:** build pass for the October 2026 Semrush keyword set (8 new pages)

This folder is **not publicly served**. `docs/` sits at the repo root, outside
`public/`, and there is no route or rewrite that exposes it — verified against
`next.config.mjs` (no `docs` references) and `src/app` (no `docs` segment).

---

## 1. Inventory

Two inventories back this report:

| Artefact | What it is | Rows |
| --- | --- | --- |
| `site-inventory.csv` (this folder) | Every URL in every sitemap segment, with the search-index title/description/type for each | 406 |
| `reports/route-inventory.{json,csv}` | `npm run seo:inventory` output: route file → declared canonical, title, description, robots, schema types | 210 route files / 406 sitemap URLs |

Counts from the inventory run: 190 indexable, 12 dynamic-uncounted, 8 noindex.

Titles and H1s for the 40 known-overlap pages were read directly from their
route files and cluster `content` strings rather than from the CSV, because
cluster children keep their H1 in the data file, not the route.

## 2. Topic-term sweep

Case-sensitive, word-boundary greps across `src/**`, `data/**` (`.ts`, `.tsx`,
`.json`, `.md`). Counts are **files**, not occurrences.

| Term | Files | Where, and what it means for the new pages |
| --- | --- | --- |
| `O-1` / `O-1A` / `O-1B` | 20 / 0 / 0 | Only ever a one-line aside ("explore cap-exempt, L-1, O-1") in the H-1B-lottery cluster, plus a row in `uscisFormsCluster` (I-129 covers O-1) and a dropdown option in two tools. **No owner page. No page distinguishes O-1A from O-1B anywhere on the site.** |
| `L-1` / `L-1A` / `L-1B` | 20 / 5 / 2 | Same shape: L-1 appears as a backup option after an H-1B non-selection, as a dual-intent travel note on the I-485 pages, and inside the `8 CFR 245.2(a)(4)(ii)(C)` discussion on `/h1b-denied-entry-airport`. **No owner page.** |
| `A-number` / `alien registration` | 25 / 4 | Mentioned on 25 pages, always as "we never collect your A-number" privacy copy or a single comparison row. `/uscis/online-account-number` owns *online account number vs A-number*; `/uscis/receipt-number` owns *receipt number vs A-number*. **Nothing owns the A-number itself.** |
| `G-325R` | 0 | The 2025/2026 federal alien-registration requirement is **absent from the site entirely**. |
| `I-94` | 63 | Heavily referenced, never explained. `h1bCluster.ts` alone has 32 mentions (240-day rule, 60-day grace, expiry-vs-petition). **No page explains what an I-94 is, how to download it, or how to read the travel history.** |
| `D/S` | 3 | Only in the F-1 cluster (`OptCalc`, `studentClusterData`), and only about the *vacated* fixed-period rule — never defined as a notation. |
| `240-day` | 4 | Owned by `/h1b/extension`. |
| `re-entry permit` | 7 | One sentence each in `/return-to-india`, `/uscis/forms/i-131`, `UscisFormFinder`, `expediteData`. **Nothing explains the I-131 reentry-permit route for an LPR.** |
| `abandonment` | 24 | Almost entirely *I-485* abandonment (travel without advance parole). LPR abandonment of residence appears only in `/return-to-india` §"The part of the move that is hard to undo". |
| `I-407` | 2 | A bare form link in `returnToIndiaStatusData.ts`. |
| `SB-1` | 2 | A bullet label in `/return-to-india` and a comment in `returnToIndiaStatusData.ts`. |
| `secondary inspection` | 9 | **Strongly owned by `/h1b-denied-entry-airport`** (sworn statement I-867A/B, I-860, expedited removal, phone searches, counsel). |
| `deferred inspection` | 3 | **Owned by `/h1b-denied-entry-airport`** via `portOfEntryData.deferredInspectionKinds` — it distinguishes deferral *at entry* from a post-admission Deferred Inspection Site visit. |
| `I-551` / `ADIT` | 14 / 39 | ADIT hits are overwhelmingly the green-card-renewal cluster's ADIT-stamp appointment content. `/green-card-renewal` owns "Expired Green Card: Work, Travel, DMV and Proof of Status". |
| `detention` / `detained` | 1 / 2 | Essentially absent. **No ICE-detention content exists on the site.** |
| `I-102` | 0 | Absent. |
| `reentry permit` (no hyphen) | 0 | Absent. |

## 3. Ownership map, per new page

The rule applied: **one owner page per subtopic.** "Summary + link" means 2–4
sentences in our own words plus a link — no copied or reworded paragraphs. No
existing page's title, H1 or body text was changed; the only edits to existing
pages are added contextual links and a Related box (Phase 4).

### 3.1 `/o1-visa` — O-1 visa

| Subtopic | Owner | Action |
| --- | --- | --- |
| O-1A vs O-1B vs O-2 vs O-3 | **new** | Write fully |
| O-1A: major award, or 3 of 8 (8 CFR 214.2(o)(3)(iii)) | **new** | Write fully — verbatim criteria + evidence examples |
| O-1B arts: "distinction", 3 of 6 ((o)(3)(iv)) *and* MPTV: "extraordinary achievement", 3 of 6 ((o)(3)(v)) | **new** | Write fully. The two are separate standards; every competitor read collapses them into one "O-1B" |
| Comparable evidence ((o)(3)(iii)(C)) | **new** | Write fully |
| Advisory opinion / consultation ((o)(5)) | **new** | Write fully, incl. the 2-year arts waiver |
| Agent as petitioner, itinerary | **new** | Write fully |
| Validity 3 years, 1-year extensions, 10-day windows ((o)(6), (o)(10), (o)(12)) | **new** | Write fully |
| O-3 dependents: no work authorisation ((o)(6)(iv)) | **new** | Write fully |
| Fees: I-129 O petition, Asylum Program Fee, I-907 | **new** (figures from `G-1055`); premium-processing fee constant reused from `src/lib/premiumProcessing.ts` | Write fully, reuse the constant |
| 60-day grace period after employment ends | `/h1b/layoff-60-day-grace-period` + `portOfEntryData.gracePeriods` | **Summary + link** |
| EB-1A / EB-1B / EB-1C / NIW comparison | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` | **Summary + link** |
| India EB-1 cutoffs and the backlog | `/visa-bulletin/eb1-india`, `/green-card/green-card-backlog-india` | **Summary + link** (live figures read from `src/lib/visa-bulletin`) |
| H-1B lottery odds | `/h1b-lottery-chances` | **Summary + link** |
| Consular stamping in India | `/h1b/stamping-india-after-approval`, `/visa-interview-waiver` | **Summary + link** |
| I-129 as a form | `/uscis/forms/i-129` | **Summary + link** |

Planned subtopics owned elsewhere: 6 of 20 = **30%** → page is written.

### 3.2 `/l1-visa` — L-1 visa

| Subtopic | Owner | Action |
| --- | --- | --- |
| L-1A vs L-1B; managerial/executive/specialized-knowledge definitions ((l)(1)(ii)(B)–(E)) | **new** | Write fully, verbatim |
| 1-year-in-3 rule, and that US time doesn't count ((l)(1)(ii)(A)) | **new** | Write fully |
| Qualifying relationship: parent / branch / subsidiary / affiliate ((l)(1)(ii)(G)–(L)) | **new** | Write fully |
| New-office L-1: 1-year approval, what must be shown ((l)(3)(v)–(vi), (l)(7)(i)(A)(3)) | **new** | Write fully |
| Blanket L: the four thresholds, I-129S, consular finality ((l)(4), (l)(5)) | **new** | Write fully |
| Max stay 5/7 years — **and that H time counts toward it** ((l)(12)) | **new** | Write fully. This is the single most consequential thing competitors omit |
| The 1-year-abroad reset ((l)(12)) | **new** | Write fully |
| Pub. L. 114-113 $4,500 fee, the 50/50 test, and the Sept 9 2026 extension to extension petitions | **new** | Write fully |
| Fraud Prevention and Detection fee, L-1 triggers | **new** | Write fully |
| L-2 / L-2S work authorisation incident to status | **new** | Write fully |
| L-1 Visa Reform Act 2004 off-site placement bar | **new** | Write fully — directly relevant to Indian IT services |
| Dual intent ((l)(16)) | **new** | Write fully |
| L-1A → EB-1C | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` | **Summary + link** |
| India EB-1 queue | `/visa-bulletin/eb1-india` | **Summary + link** |
| H-1B alternative framing / lottery odds | `/h1b-lottery-chances`, `/h1b-lottery-not-selected-options` | **Summary + link** |
| Travelling on L-1 with a pending I-485 | `/uscis/travel-to-india-while-i485-pending`, `/h1b-denied-entry-airport` (8 CFR 245.2(a)(4)(ii)(C)) | **Summary + link** |
| H-1B 6-year cap and AC21 | `/h1b-perm-max-out-calculator`, `/green-card/ac21` | **Summary + link** |

Owned elsewhere: 5 of 17 = **29%** → page is written.

### 3.3 `/uscis/a-number` — A-Number explained

| Subtopic | Owner | Action |
| --- | --- | --- |
| What an A-number is; A + 8 or 9 digits; zero-padding | **new** | Write fully |
| Where it is printed: green card, EAD, immigrant visa, I-797, other notices | **new** | Write fully, incl. labelled SVG card mocks |
| Receipt number (format, prefixes) | `/uscis/receipt-number` | **Summary + link** |
| USCIS online account number | `/uscis/online-account-number` | **Summary + link** |
| I-797 notice anatomy | `/uscis/i-797-notice` | **Summary + link** |
| I-94 number | `/uscis/i-94` (**new, this build**) | Cross-link |
| SEVIS ID | `/education/sevis-termination-guide` | **Summary + link** |
| Visa control / foil number | **new** (nothing owns it) | Write fully |
| Federal alien registration: INA 262/264, 8 CFR 264.1, Form G-325R, the June 29 2026 final rule | **new** | Write fully — absent from the site |
| Who is already registered (I-94, I-551, EAD…) under 8 CFR 264.1(a)–(b) | **new** | Write fully. This is the question the keyword traffic actually has |
| Long-stay Canadian visitors ("snowbirds") | **new** | Write fully |
| Can't find it / two A-numbers / FOIA G-639 | **new** | Write fully |
| Re-registration at 14 (8 CFR 264.1(g)) | **new** | Write fully |

Owned elsewhere: 4 of 13 = **31%** → page is written.

### 3.4 `/uscis/i-94` — I-94 and travel history

| Subtopic | Owner | Action |
| --- | --- | --- |
| What the I-94 is; electronic vs paper; land-border electronic issuance | **new** | Write fully |
| Downloading the most recent I-94 and the travel history, step by step | **new** | Write fully |
| Travel history depth (10 years) and what is missing from it (most land crossings; citizens and LPRs cannot use the site at all) | **new** | Write fully — the strongest gap on this page |
| D/S meaning, and which classes get it | **new** | Write fully |
| I-94 date vs visa expiry vs I-797 validity | **new** | Write fully |
| Passport-truncated admit-until dates | `/h1b-denied-entry-airport` (`portOfEntryData.i94Notes`) | **Summary + link** |
| Deferred inspection to fix an I-94 error | `/h1b-denied-entry-airport` (`deferredInspectionKinds`) | **Summary + link** |
| Form I-102 (replacement/initial I-94) and its fee | **new** | Write fully — absent from the site |
| 240-day rule | `/h1b/extension` | **Summary + link** |
| 60-day grace period | `/h1b/layoff-60-day-grace-period` | **Summary + link** |
| I-94 on change/extension of status (I-797A tear-off) | `/uscis/i-797-notice`, `/uscis/approval-notice` | **Summary + link** |
| Canada/Mexico trips, automatic revalidation | `/automatic-visa-revalidation` | **Summary + link** |
| Substantial Presence Test mechanics | `/articles/substantial-presence-test-explained`, `/education/f1-tax-calculator` | **Summary + link**; the day counter computes the estimate but does not re-explain the test |
| N-400 continuous residence and trips | `/tools/citizenship-checklist`, `/uscis/forms/n-400` | **Summary + link** |
| Registration: the I-94 *is* evidence of registration | `/uscis/a-number` (**new, this build**) | Cross-link |

Owned elsewhere: 7 of 15 = **47%** — over the 40% threshold on a raw count.
**Decision: still write the page.** The threshold exists to stop a page that is
mostly a rehash. Here the seven owned subtopics are all *consequences* of the
I-94 (what happens when it expires, what happens when it's wrong, what you can
do with the history), while the six unowned ones are the document itself —
what it is, how to get it, how deep the history goes, what D/S means, how to
replace it. The keyword set ("i-94 travel history", "i 94 history", "what does
d/s mean") maps entirely onto the unowned half. Owned subtopics appear as
summary + link only, and are excluded from the body word count. Recorded as a
deviation in `final-report.md`.

### 3.5 `/green-card/travel-rules` — green card travel rules + ICE detention tracker

| Subtopic | Owner | Action |
| --- | --- | --- |
| Absence tiers: <6 months, 6–12 months, >1 year; 8 CFR 211.1(a)(2), 211.3 | **new** | Write fully |
| Reentry permit: who, when, the "must file from inside the US" trap, validity, fee | **new** (fee from `G-1055`) | Write fully. `/uscis/forms/i-131` keeps the *form*; this page keeps the *LPR travel decision* |
| N-470 preservation of residence, and its before-one-year filing deadline (8 CFR 316.5(d)(1)) | **new** | Write fully — absent from the site and from every competitor read |
| SB-1 returning resident visa | **new** | Write fully |
| N-400 continuous residence: 6–12 months rebuttable, ≥1 year breaks, the four rebuttal facts, "4 years and 1 day" (8 CFR 316.5(c)(1)) | **new** | Write fully. `/tools/citizenship-checklist` flags a 6-month trip; it does not explain the rule |
| Claiming nonresident alien status for tax (8 CFR 316.5(c)(2)) | **new** | Write fully |
| "Seeking admission" under INA 101(a)(13)(C) | **new** | Write fully — the legal hinge of the whole page, absent everywhere |
| Documents to carry, by situation | **new** | Write fully |
| Expired card travel, I-751 receipt rule (8 CFR 211.1(a)(5)) | `/green-card-renewal`, `/replace-green-card` | **Summary + link** (the 211.1(a)(5) mechanic itself is new) |
| I-551 / ADIT stamp | `/green-card-renewal` | **Summary + link** |
| Secondary inspection; what CBP can ask; devices; counsel | `/h1b-denied-entry-airport` | **Summary + link** |
| Form I-407 — and that you are not obliged to sign it at the airport | **new** | Write fully |
| Pending I-485 and advance parole | `/uscis/travel-to-india-while-i485-pending` | **Summary + link** |
| ICE detention tracker (2025–2026 policy changes + reported case patterns) | **new** | Write fully, from `data/ice-detention-tracker.json` |
| ICE detention population over time | **new** | Write fully, from ICE's own FY19–FY26 workbooks |
| Know your rights | **new** | Write fully |
| Long India trips (parents' care, weddings) | **new** framing; links to `/return-to-india` | Write fully |
| Keeping vs giving up the card on a permanent move; exit tax | `/return-to-india` | **Summary + link** |
| H-1B family members travelling to India | `/h1b/travel-to-india` | **Summary + link** |

Owned elsewhere: 6 of 19 = **32%** → page is written.

### 3.6–3.8 `/visa-bulletin/november-2026`, `/december-2026`, `/january-2027`

These are series pages, so the ownership question is different: everything
*explanatory* is already owned by the evergreen `/visa-bulletin/*` children and
must not be re-explained.

| Subtopic | Owner | Action |
| --- | --- | --- |
| That month's EB-1/2/3 India final action + dates for filing | **new** (per month) | Write fully |
| All-chargeability comparison; family F1–F4 India | **new** (per month) | Write fully |
| Month-over-month movement; 12-month history chart | **new** (per month) | Write fully |
| Projection method and ranges | **new** | Write fully |
| What a priority date means | `/visa-bulletin/priority-date` | **Summary + link** |
| Final action vs dates for filing | `/visa-bulletin/final-action-date-vs-date-of-filing` | **Summary + link** |
| Retrogression | `/visa-bulletin/retrogression` | **Summary + link** |
| Per-category outlook | `/visa-bulletin/eb1-india`, `/eb2-india`, `/eb3-india` | **Summary + link** |
| Annual limits / 7% per-country | `/visa-bulletin/annual-limits` | **Summary + link** |
| Which chart USCIS accepts | `data/visa-bulletin/current.json` via `getApplicableChart()` | Reuse, never assert a chart for an unpublished month |
| Priority-date checking | `/tools/priority-date-checker` | Reuse the component |

## 4. URL decisions

| Suggested | Built | Why |
| --- | --- | --- |
| `/o1-visa` | **`/o1-visa`** | Matches the site's deliberate flat, keyword-matching top-level pattern (`/h1b-prevailing-wage`, `/i140-processing-time`). Also matches how the existing H-1B cluster spells classifications without hyphens in slugs (`/h1b...`). |
| `/l1-visa` | **`/l1-visa`** | Same. |
| `/uscis/a-number` | **`/uscis/a-number`** | `/uscis/*` is the established home for "what is this USCIS number/notice" intent: `/uscis/receipt-number`, `/uscis/online-account-number`, `/uscis/i-797-notice`. Served by `uscisCluster` siblings but needs its own static route (charts, SVG mocks and a tool, which a cluster `content` string cannot host — the same reason `/uscis/forms/i-864` and `/uscis/expedite-request` are static routes). |
| `/uscis/i-94` | **`/uscis/i-94`** | Same segment, same reasoning. |
| `/green-card/travel-rules` | **`/green-card/travel-rules`** | `/green-card/*` holds the LPR-lifecycle children (`/green-card/ac21`, `/green-card/cspa-kids-aging-out`). Static route, for the same reason as above. |
| `/visa-bulletin/november-2026` etc. | **unchanged** | These are the slugs `monthSlug()` already generates, so a page flips from projected to official with no URL change. No forecast word appears in any of the three URLs. |

**No URL departed from the brief.**

## 5. Note on the visa-bulletin template

The brief says to copy `/visa-bulletin/october-2026` exactly. That route is
documented in its own file header as *deliberately not* the series template: it
is a one-off, press-oriented analysis document with scoped `.vboct` CSS, a
forecast scoreboard, and no shared components. The actual series template is
`VisaBulletinMonthPage` (`src/components/visa-bulletin/MonthPage.tsx`), which
renders `/visa-bulletin/september-2026` and is what `monthSlug()` resolves to.

The three new months are built on **`VisaBulletinMonthPage`**, extended to
handle projected status, so they are visually and structurally one series with
the existing month pages and a page flips to official by editing data only.
Recorded as a deviation in `final-report.md`.
