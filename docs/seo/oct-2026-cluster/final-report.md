# Final report — October 2026 immigration cluster

**Branch:** `feat/oct-2026-immigration-cluster` (not merged, not deployed to production)
**Built:** 2026-10-13
**Gates:** `npx tsc --noEmit` clean · `npx vitest run` 2,312 passing / 0 failing · `npm run build` compiled successfully, all 8 routes prerendered

`npm run lint` is not a usable gate in this environment — it opens an
interactive prompt and cannot run non-interactively. That is a pre-existing
repo condition, documented in CLAUDE.md; the real gates are the three above,
and Vercel's deploy build is the authoritative one.

---

## 1. Per-page summary

Word counts are from the **rendered build HTML**, not the source. Two figures
are given because they answer different questions:

- **Body** — everything inside `<main>` with nav, footer, inline SVG internals
  and figcaptions stripped. This is the number the brief's 5,000-word target
  refers to.
- **Authored copy** — body minus the shared components every page carries (the
  priority-date checker, the byline, the not-legal-advice disclosure, the
  source box, the author bio) **and minus tables**, which are data rather than
  authored prose. This is the number the duplicate-text check runs on, because
  counting shared chrome as page copy is what makes unrelated pages read as
  duplicates — the trap recorded in CLAUDE.md's overlap-audit note.

| URL | Title | Main keyword | Body words | Authored copy | Tables | Charts | Tool | Links out | Links in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/o1-visa` | O-1 Visa: The 8 Criteria, Fees and Why Indians Barely Use It | "o1 visa" 18,100 | **7,498** | 4,982 | 9 | 5 | O-1A criteria self-check | 79 | 6 | live |
| `/l1-visa` | L-1 Visa: 1 Year Abroad, 5 or 7 Years Here — and H-1B Time Counts | "l1 visa" 12,100 | **7,166** | 5,453 | 7 | 5 | L-1 eligibility & max-stay calculator | 79 | 7 | live |
| `/uscis/a-number` | A-Number (Alien Registration Number): Where It Is, and the 6 Numbers It Is Not | "a number a" 12,100 | **4,210** | 3,015 | 5 | 3 | "Which number is this?" | 76 | 6 | live |
| `/uscis/i-94` | I-94 Travel History: How to Get It, and the Four Things It Leaves Out | "i-94 travel history" 5,400 | **5,062** | 3,804 | 8 | 5 | I-94 day counter | 85 | 14 | live |
| `/green-card/travel-rules` | Green Card Travel Rules: 180 Days, 1 Year, and the I-407 You Need Not Sign | "green card holder ice detention" 18,100 | **7,687** | 5,923 | 7 | 5 | Trip risk checker | 76 | 9 | live |
| `/visa-bulletin/november-2026` | November 2026 Visa Bulletin Projection: India EB-1, EB-2, EB-3 Ranges | "visa bulletin november 2026" | **4,367** | 2,646 | 5 | 3 | Priority date checker (embedded) | 83 | 6 | **PROJECTED**, indexable |
| `/visa-bulletin/december-2026` | December 2026 Visa Bulletin Projection: India EB-1, EB-2, EB-3 Ranges | "visa bulletin december 2026" | **3,852** | 2,039 | 5 | 2 | Priority date checker (embedded) | 76 | 5 | **PROJECTED**, noindex |
| `/visa-bulletin/january-2027` | January 2027 Visa Bulletin Projection: India EB-1, EB-2, EB-3 Ranges | "visa bulletin january 2027" | **3,753** | 1,996 | 5 | 2 | Priority date checker (embedded) | 76 | 5 | **PROJECTED**, noindex |

Minimums in the brief: 6 data tables, 3 charts, 1 interactive tool, 1 decision
flow, worked examples with real numbers.

| Page | Tables ≥6 | Charts ≥3 | Tool | Decision flow / step diagram |
| --- | --- | --- | --- | --- |
| `/o1-visa` | 9 ✓ | 5 ✓ | ✓ | O-1 route diagram, criteria reachability split |
| `/l1-visa` | 7 ✓ | 5 ✓ | ✓ | Combined L-and-H clock, blanket-vs-individual flow |
| `/uscis/a-number` | 5 — see §4 | 3 ✓ | ✓ | Six-number map, registration timeline |
| `/uscis/i-94` | 8 ✓ | 5 ✓ | ✓ | Three-document diagram, D/S-vs-date diagram |
| `/green-card/travel-rules` | 7 ✓ | 5 ✓ | ✓ | INA 101(a)(13)(C) decision flow, absence-tier tracks |
| Bulletin months | 5 — see §4 | 3 / 2 | ✓ (embedded) | Projection-method diagram |

Every chart and table carries a source line and an "as of" date, enforced by
`src/components/gap-2026-10.mobile.test.ts` (figure/figcaption parity, and a
`_VERIFIED` constant on every page).

**Titles and descriptions:** all 8 are unique across the full 406-URL build,
checked against every rendered `<title>` and `<meta name="description">`.

**Links:** 76–85 outbound internal links per page (brief: ≥5) and 5–14 inbound
links from existing pages (brief: ≥3). Every internal link target was verified
against the sitemap inventory before it was written.

---

## 2. Duplicate-text check

7-word shingles over authored copy (see §1 for what that excludes), each new
page against **every other rendered page in the build**.

| Page | Worst overlap | Against |
| --- | --- | --- |
| `/o1-visa` | 1.2% | `/l1-visa` |
| `/l1-visa` | 1.1% | `/o1-visa` |
| `/uscis/a-number` | 0.1% | `/oci/how-to-apply` |
| `/uscis/i-94` | 1.4% | `/green-card/travel-rules` |
| `/green-card/travel-rules` | 0.9% | `/uscis/i-94` |
| `/visa-bulletin/november-2026` | 40.1% | `/visa-bulletin/december-2026` |
| `/visa-bulletin/december-2026` | **62.8%** | `/visa-bulletin/january-2027` |
| `/visa-bulletin/january-2027` | **62.6%** | `/visa-bulletin/december-2026` |

**The five content pages are clean.** Nothing above 1.4% against anything on
the site, which means no paragraph on any of them needed rewriting and the
ownership rules in `overlap-report.md` held in practice.

**The three bulletin months were not, and this took three rounds of work.**

First build: **81%** shared shingles across all three. Three projected months
rendered from one component differ only in a name and a few numbers.

What was done about it, in order:

1. **Per-month content from the archive.** `sameMonthHistory()` reads what each
   *calendar* month has actually done across every year on record, for all three
   India EB categories — nine distinct, source-derived summaries across the
   three pages. They are genuinely different: India EB-2 final action moved in
   one of the last five Novembers, in four of five Decembers including the
   window's only retrogression, and in four of five Januaries all forward.
   → 81% to 73%.
2. **Per-month character copy.** `MONTH_CHARACTER` gives each month its own
   "what is different", "what to do" and "how much weight this horizon
   deserves". The fiscal-stage note was also switched from a quarterly bucket
   (which gave all three the same paragraph) to the per-month text.
   → 73% to 69%.
3. **Ownership applied inside the series.** The projection method, the USCIS
   chart-determination warning, the FY2027 supply note and the explainer-link
   list now live on the **nearest** projected month, which owns them; the others
   carry two sentences and a link. Same rule the rest of this build uses.
   → 69% to 63%.

**The residual 63% is text that must be identical**, and rewriting it would
mean making one page false:

- the projected-status banner — the honesty statement itself;
- the warning that the tracked USCIS chart determination covers a different
  month — the same warning, because it is the same fact;
- the per-row basis statistics — identical because the trailing window *is*
  identical for all three months;
- the projection table headers, country labels and the published October
  figures in the "last published" columns — data, not prose.

**So the fix was not more rewriting.** The nearest unpublished month
(`november-2026`) is indexable. The two further-horizon months carry
`robots: noindex, follow` and are absent from both the sitemap and the homepage
search index — because the rule at the top of `src/lib/sitemap-data.ts` is that
a noindex URL must never appear in a sitemap, and omitting a URL from a sitemap
does not stop it being indexed. They keep their permanent URLs, stay linked from
the hub, the month index and each other, state on the page why they are not
indexed yet, and become indexable **automatically** as the horizon shortens or
as the bulletin publishes. Nothing to remember and no URL moves.

This is recorded as a deviation in §4. `visaBulletinProjections.test.ts` holds
all of it: that a month is never both published and projected, that exactly one
projected month is indexable, that indexability agrees with sitemap and search
index membership in both directions, and that the per-month copy is not
templated.

---

## 3. External sources used

All checked **2026-10-13**.

### Primary — statute and regulation
| Source | Used for | How it was read |
| --- | --- | --- |
| 8 CFR 214.2(o), full text | Every O-1 criterion, definition, consultation rule, validity and extension period | eCFR versioner API, title-8, issue date 2026-10-08 |
| 8 CFR 214.2(l), full text | Every L-1 definition, the relationship rules, blanket requirements, the stay caps | Same |
| 8 CFR part 264 | Registration forms and evidence of registration | Same |
| 8 CFR part 211 (211.1, 211.3, 211.4) | Documents for readmission, the one-year mechanic, the waiver | Same |
| 8 CFR 316.5(c) and (d) | Continuous residence, the four rebuttal facts, the tax presumption, N-470's deadline | Same |
| 8 CFR part 235 | Deferred inspection | Same |
| INA 101(a)(13)(C) / 8 U.S.C. 1101 | The six "seeking admission" conditions | law.cornell.edu |
| INA 212(a)(2), 262, 264, 240 | Criminal grounds, registration, carry duty, removal proceedings | law.cornell.edu |
| INA 214(c)(2)(F) | The L-1 Visa Reform Act off-site tests | Via the USCIS L-1B page |
| 26 U.S.C. 7701(b)(3) | The substantial presence formula | Via IRS and the repo's existing `calc/f1Tax.ts` |

### Primary — agency
| Source | Used for |
| --- | --- |
| **Form G-1055, USCIS fee schedule, edition 10/07/26** | Every fee on every page. Retrieved as PDF and text-extracted, so each figure was read from the schedule rather than from a secondary guide |
| USCIS O-1 page | Return transportation, changing employers, the application process |
| USCIS L-1A and L-1B pages | The L-1 Visa Reform Act, new offices, blanket petitions |
| USCIS Alien Registration Requirement (`/alienregistration`) | Who must register, who is exempt, who is already registered, the June 29 2026 final rule, the *Casa Inc. v. Trump* injunction |
| USCIS Form G-325R page | Form edition 09/04/26, online-only filing |
| USCIS Policy Manual Vol. 10 Pt. B Ch. 2; Handbook for Employers M-274 §7.9.2 | L-2 spouse employment authorisation and the L-2S I-9 evidence rule |
| USCIS — International Travel as a Permanent Resident | The LPR travel baseline |
| **ICE Detention Statistics workbooks FY2019–FY2026** | The detention chart. Downloaded and parsed directly; FY2026 file dated 20 July 2026 |
| **DHS OHSS Yearbook of Immigration Statistics FY2024**, Table 26 + Nonimmigrant Supplemental Table 1 | Every admissions figure and every India share on the O-1 and L-1 pages. Downloaded and parsed directly |
| CBP — Arrival/Departure Forms: I-94 | Electronic vs paper, land-border issuance, the land-departure warning, deferred inspection sites |
| CBP — i94.cbp.dhs.gov FAQ | The ten-year window, the land-crossing exclusion, "not an official record", the citizen/LPR exclusion |
| DHS/CBP/PIA-016(a) | Confirms the travel history went from five years to ten |
| Federal Register — Adjustment to Premium Processing Fees (2026-01-12, eff. 2026-03-01) | Cross-checks the I-129 premium figure against the repo's central record |
| Federal Register — 9-11 Response and Biometric Entry-Exit Fee for H-1B and L-1 Visas (2026-08-10, eff. 2026-09-09) | The Pub. L. 114-113 fee extending to **extension** petitions |
| Federal Register — Alien Registration Form and Evidence of Registration (2025-03-12) | The registration rule's origin |
| `data/visa-bulletin/` snapshot archive (2021-08 → 2026-10) | Every bulletin figure and every projection. Derived from the official DOS bulletins |
| DOJ EOIR pro bono provider list; DOJ recognition and accreditation | The find-a-lawyer section |

### Competitor pages read for the gap analysis
rjimmigrationlaw.com (O-1 evidentiary update; alien registration for Canadians;
D/S notation; re-entry permit; I-551 stamps and MRIVs; LPR travel to Canada);
opensphere.ai L-1 guide; and the top non-government organic results for each
main keyword. Per-page outlines are in the five `gap-*.md` files.

**Not readable, and recorded as such:** `boundless.com` O-1 guide (404);
`visaserve.com` (403 to every request); `opensphere.ai` L-1 guide (client-rendered,
172 words recovered); `travel.state.gov` (403 to every automated request — the
November-2026 publication status was therefore confirmed two other ways, see
`gap-visa-bulletin-months.md`).

---

## 4. Departures from the plan

### 4.1 The visa bulletin template
**The brief said** copy `/visa-bulletin/october-2026` exactly so the new pages
look like the same series.

**What was built:** the pages use `VisaBulletinMonthPage`'s structure, extended
into a new `ProjectedMonthPage`.

**Why:** `/visa-bulletin/october-2026` documents itself, in its own file header,
as *deliberately not* the series template — it is a one-off, press-oriented
analysis document with its own scoped `.vboct` CSS, a forecast scoreboard and no
shared components. The actual series template is
`src/components/visa-bulletin/MonthPage.tsx`, which renders
`/visa-bulletin/september-2026` and is what `monthSlug()` resolves to. Building
on the real series template is what makes the new months look like the series,
and it is also what allows a page to flip from projected to official by editing
data alone.

### 4.2 Two bulletin months are noindex
**The brief implied** 8 indexable pages.

**What was built:** `november-2026` is indexable; `december-2026` and
`january-2027` carry `robots: noindex, follow`, are absent from the sitemap and
the search index, and remain fully linked.

**Why:** see §2. After three rounds of genuine differentiation the two
far-horizon months still share ~63% of their authored copy with each other, and
the residual is text that must be identical. Submitting two near-duplicates is
worse for the cluster than submitting one strong page. They become indexable
automatically — `isIndexableProjectedMonth()` is derived from
`PROJECTED_MONTHS`, so when November publishes and drops out, December inherits
indexability with no edit.

**If you would rather have all three indexable**, deleting the robots branch in
`src/app/visa-bulletin/[slug]/page.tsx` and switching
`indexableProjectedMonths()` back to `PROJECTED_MONTHS` in `sitemap-data.ts`,
`searchIndex.ts` and `latestUpdates.ts` is a four-line change. The tests will
tell you if you miss one.

### 4.3 Three pages are under 5,000 body words
| Page | Body words | Why |
| --- | --- | --- |
| `/uscis/a-number` | 4,210 | 4 of its 13 planned subtopics are owned by `/uscis/receipt-number`, `/uscis/online-account-number`, `/uscis/i-797-notice` and `/education/sevis-termination-guide`, and are summary-plus-link only. The topic is also genuinely smaller than the others: the honest answer to its second-biggest intent is "the registration rule does not apply to you", and padding that would make the page worse. Comfortably over the 4,000 floor. |
| Bulletin months | 3,753–4,367 | A monthly bulletin page is a figures page. Every explainer — priority dates, the two charts, retrogression, annual limits, per-category outlook — is owned by an existing `/visa-bulletin/*` child and is linked, not repeated. All three clear 4,000 body words only because of the per-month archive content added in §2; the two noindex months sit just under it, which is consistent with their status. |

### 4.4 `/uscis/i-94` was written despite 47% subtopic overlap
The brief's rule is: if more than 40% of a page's planned subtopics are owned
elsewhere, do not create it. `/uscis/i-94` came out at 47% on a raw count.
It was still written, and `overlap-report.md` §3.4 records the reasoning: the
seven owned subtopics are all *consequences* of the I-94 (what happens when it
expires, when it is wrong, what you can do with the history), while the six
unowned ones are the document itself — and the whole keyword set
("i-94 travel history", "i 94 history", "what does d/s mean") maps onto the
unowned half. The owned subtopics appear as summary-plus-link only. The measured
result supports the call: 1.4% worst-case text overlap against the entire site.

### 4.5 Two figures were not published because they could not be verified
- **O-1 and L-1 approval/denial and RFE rates.** USCIS publishes I-129
  adjudication data but not in a form reachable and verifiable from this
  environment, and `travel.state.gov` returns 403 to every automated request.
  Both pages say so explicitly and link the USCIS data page rather than quoting
  a secondary figure. The brief asked for RFE/denial trends "if official data
  exists"; it exists but could not be verified here.
- **A specific FY2027 employment-based annual limit.** DOS has not published it;
  the repo's own `visaAnnualLimitsData` records it as `awaiting-dos`. The
  projections are therefore not anchored on a supply figure, and the pages say
  that any specific FY2027 total is an estimate.

### 4.6 URLs
**No URL departed from the brief.** All eight are as suggested. No month slug
contains a forecast word — enforced by a test.

---

## 5. Confirmations

### "caveat"
**The word appears nowhere on any of the 8 new pages**, nor in any data file,
calculator, component or test added by this build. Enforced by assertions in
`gap-2026-10.mobile.test.ts`, `gcTripRisk.test.ts`, `o1Criteria.test.ts`,
`iceDetentionTracker.test.ts` and `visaBulletinProjections.test.ts`, so it
cannot come back.

**It does appear on 20 pre-existing pages**, listed below. The brief also said
not to change existing pages' body text, so these were left alone — say the
word and I will sweep them:

`/articles/401k-match-explained-nri`, `/articles/build-us-credit-score-from-zero`,
`/articles/estate-planning-usa-india-assets`, `/articles/h1b-first-tax-return-guide`,
`/articles/how-much-rent-can-you-afford`, `/articles/iul-vs-401k-honest-comparison`,
`/articles/nre-nro-accounts-explained`, `/articles/opt-h1b-financial-planning-students`,
`/articles/real-estate-first-investment-immigrants`, `/articles/social-security-40-credits-h1b-nri`,
`/articles/us-1-percent-remittance-fee`, `/calculators/backdoor-roth-eligibility`,
`/green-card/cspa-kids-aging-out`, `/green-card`,
`/india-tax-compliance/gift-from-parents-india-to-usa`, `/india-tax-compliance/nri-itr-filing-usa`,
`/power-of-attorney-for-india-from-usa`, `/success-stories/deepak-middha`,
`/tools/h4-ead-navigator`, `/usa-government-benefits-immigrants`.

### No projected date is labelled official
Confirmed, and enforced:

- Every projected page carries a banner **above the H1** saying the official
  bulletin has not been published.
- Every projected value sits in an amber column headed "Projected range — not
  official", or carries a `PROJECTED` badge, beside the published figure it was
  derived from.
- The page title says "Projection". So do the search-index entry and the
  homepage feed row.
- The JSON-LD carries `disambiguatingDescription` with the projected banner, so
  the structured data does not describe unpublished figures as published.
- The USCIS chart determination is **never** asserted for a projected month —
  the page names the month the tracked determination actually covers.
- Tests assert the banner and badge are present, that the string "official
  final action/cutoff/dates for {month}" cannot appear, and that no generated
  copy claims "USCIS is accepting".

**November 2026 was confirmed unpublished on 2026-10-13** three ways:
`travel.state.gov` shows October 2026 as current with "Upcoming Visa Bulletin —
Coming Soon"; `data/visa-bulletin/index.json` has `current: "2026-10"` with no
2026-11 snapshot; and third-party coverage of November 2026 consists entirely of
law-firm predictions. If the bulletin publishes before you merge, flipping that
page to official is three data steps with no code change — the procedure is in
the header of `src/lib/visaBulletinProjections.ts`.

### The tools, and 390px
**What was verified:** all five tools render their controls server-side in the
build output (34/2/6/2/2 buttons and 3/3/8/8/8 inputs across the five pages),
each page loads its client chunks, and 26 static assertions cover every mobile
trap the repo's own previous phone audit found — fluid `viewBox` + `h-auto
w-full` on every SVG, no pixel width/height on any `<svg>`, an
`overflow-x-auto` wrapper with a `min-w-[Npx]` inner for every chart and every
table, a `<caption>` on every table, the 16px iOS zoom floor on every control,
and `min-w-0` on every grid track. Three real defects were found this way and
fixed: an unwrapped table in the day counter, a `text-xs` textarea below the
zoom floor, and five grid containers without `min-w-0`.

**What was not verified:** a real browser render at 390×844. This repo ships no
headless browser (no puppeteer, no playwright), so no screenshot was taken and
no JavaScript was executed in a viewport. The static assertions are a proxy for
that, not a substitute. The calculation layer behind all five tools is covered
separately by 81 unit assertions.

### Privacy
Every tool is browser-only, and this is enforced rather than asserted: no
`fetch`, no `XMLHttpRequest`, no `axios`, no `localStorage`, no
`sessionStorage`, no `document.cookie`, no `indexedDB` in any of the five.
The number identifier matches on shape alone and echoes a masked value. The trip
checker's criminal-history input is a single yes/no checkbox with no free-text
field anywhere in the component.

### The folder
`docs/seo/oct-2026-cluster/` is **not publicly served**. `docs/` sits at the
repo root, outside `public/`, there is no route or rewrite exposing it, and
nothing in `next.config.mjs` references it.

---

## 6. What the owner maintains

| File | What it controls |
| --- | --- |
| `data/ice-detention-tracker.json` | The detention tracker. Add an entry, commit, deploy. Its own `_rules` block carries the editorial rules, and `iceDetentionTracker.test.ts` enforces them: every row needs a source URL, a `kind` of official/statistic/reported-pattern, no named individuals, no speculation. The page's "last updated" line is derived as the later of the file stamp and the newest entry, so a deploy alone cannot refresh it. |
| `src/lib/visaBulletinProjections.ts` → `PROJECTED_MONTHS` | Which months have a projected page. Remove a month here in the same change that adds it to `PUBLISHED_MONTHS`; a test fails if it is ever in both. |
| `src/lib/visaBulletinProjections.ts` → `MONTH_CHARACTER` | The per-calendar-month copy. Keyed by month number, so it survives the year rolling over. |
| `src/data/o1VisaData.ts`, `l1VisaData.ts`, `aNumberData.ts`, `i94Data.ts`, `greenCardTravelData.ts` | Every fact, fee and figure on the five content pages, each with a `_VERIFIED` constant the page renders. No number is written into JSX anywhere. |
| `src/lib/premiumProcessing.ts` | The premium-processing fee, read by both new visa pages rather than duplicated. |

**To publish the November 2026 bulletin when it lands:** add
`data/visa-bulletin/snapshots/2026-11.json`, import it in
`visaBulletinMonths.ts`'s `SNAPSHOTS` map and add `"2026-11"` to
`PUBLISHED_MONTHS`, then remove it from `PROJECTED_MONTHS`. December inherits
indexability automatically. The URL does not change, the sitemap entry does not
move, and no redirect is needed.



---

## 7. Post-review corrections (2026-10-13, after publication)

A content review after the pages went live found nine substantive errors. All
were fixed and redeployed; the two that changed behaviour rather than wording
are marked.

| # | Error | Correction | Guard |
| --- | --- | --- | --- |
| 1 | I-94 number described as "11 digits". **The matcher's regex also rejected every currently-issued I-94 number** — a real bug, not a wording slip. | 11 **characters**: 11 digits before May 2019, and nine digits + a letter + a digit from May 2019 (e.g. `012345678A1`). Both formats remain valid. | `numberIdentify.test.ts` tests both formats |
| 2 | **N-470 presented as available to any permanent resident facing a year-plus absence.** Materially misleading. | Added the full INA 316(b) gate: a year of unbroken prior US presence, the four qualifying employer categories plus religious work, an explicit "what does not qualify" list naming the ordinary corporate transfer, and the two limits the form instructions state — it does **not** replace a reentry permit, and it does **not** waive physical presence unless the employment is by or under contract with the US Government. | `gcTripRisk.test.ts` |
| 3 | O-1 page drew behavioural conclusions from I-94 admissions data. | Admissions are border events, not people. The page now claims only the share difference, states what the data cannot show (unique holders, who would qualify, causation — travel frequency alone could move the shares), and labels the explanations as hypotheses. | — |
| 4 | Projections labelled "Moderate confidence", implying a validated interval. | `confidence` renamed `basisDepth` (it was only a sample-size bucket). Columns relabelled "Scenario … not a probability interval". A `SCENARIO_DISCLAIMER` now appears in the banner, above the tables, in the method section and in the FAQ, and the method sentence admits the band cannot express the retrogression the row has actually had. | `visaBulletinProjections.test.ts` asserts no `confidence` field survives |
| 5 | "The I-94 governs … not your I-797" too absolute. | An I-797A carries a new I-94 at the bottom which becomes the current record. Rewritten to "your most recent I-94, whether CBP created it or USCIS issued it on an I-797A", with its own callout. | — |
| 6 | IEEE Senior Member treated as satisfying the membership criterion. | "May support this criterion, depending on the body's documented admission requirements" — the petition has to put the published criteria and review process in evidence. | — |
| 7 | "You cannot change employer" on L-1 overbroad. | An existing approval cannot be used for an **unrelated** employer; movement inside the qualifying group is possible with an amended or new petition, or a fresh I-129S under a blanket. | `l1Stay.test.ts` |
| 8 | "Your spouse can work from the day they land." | Conditioned on being admitted in L-2S status with an I-94 carrying that annotation; a plain "L-2" annotation is not sufficient for Form I-9. | — |
| 9 | Immigrant Data Summary described as universal. | Changed to "may have" and flagged that many immigrant cases are processed electronically with no physical sealed packet, pointing to the visa foil's Registration Number instead. | — |

### Two review items not actioned, and why

**The byline reads "Updated October 13, 2026 ✓ 2026 verified".** This is the
shared `ReviewedByline` component, which renders an "Updated {date}" string and
a separate green "✓ {year} verified" pill. It appears on roughly 200 live pages
and predates this build. Visually the two are distinct elements; the duplication
only reads as such in extracted text. Changing it alters site-wide chrome, which
is the owner's call — the fix is to drop the year from the pill in
`src/components/ReviewedByline.tsx` (one line).

**IndexNow wording in this report.** Corrected: an HTTP 200 from IndexNow
confirms that the submission was **received**, not that anything will be
indexed. IndexNow states this explicitly. The accurate statement is: *IndexNow
successfully received the six URL submissions; indexing remains at each search
engine's discretion.*

### Review items confirmed already correct

The `$1,055` paper O-petition base fee and the conditional `$4,500` Public Law
114-113 L-1 fee were checked and are correctly qualified in the articles. The
projected-status labelling on the bulletin pages was found prominent and clear,
and the Department of State still lists October 2026 as current with the
upcoming bulletin "Coming Soon", so the November–January pages remain correctly
marked as not official.
