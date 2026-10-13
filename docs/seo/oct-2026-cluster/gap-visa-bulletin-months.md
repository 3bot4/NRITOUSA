# Phase 2 gap analysis — `/visa-bulletin/november-2026`, `/december-2026`, `/january-2027`

Keywords: **"visa bulletin [month] [year]"** (the comparable January page ran 14,800/mo KD28), **"[month] [year] family visa priority dates"**, **"uscis green card updates [month]"**.

## Status check, 2026-10-13

| Month | Official bulletin published? | Page status |
| --- | --- | --- |
| November 2026 | **No** | PROJECTED |
| December 2026 | No | PROJECTED |
| January 2027 | No | PROJECTED |

Evidence: `travel.state.gov` returns HTTP 403 to every automated request from
this environment, so the check was made two ways and both agree.
(1) A domain-restricted search of travel.state.gov surfaces the October 2026
bulletin as the current one, with "Upcoming Visa Bulletin — Coming Soon" as the
next item and no November 2026 document in the index.
(2) The repo's own data agrees: `data/visa-bulletin/index.json` has
`current: "2026-10"`, `lastUpdated: 2026-09-29`, and the newest snapshot on disk
is `2026-10.json`. There is no 2026-11 snapshot.
(3) Third-party coverage searched on the same date consists entirely of
*predictions* for November 2026 from law firms (Shusterman, Reddy Esq., Alaz
Law, lawofficeimmigration) — which is what the market looks like before a
release, not after.

The State Department normally publishes the following month's bulletin in the
second week of the preceding month, with recent releases slipping into the
third week, so November 2026 is expected imminently. **All three pages are
built as PROJECTED, and flip to OFFICIAL by a data edit alone.**

## Competitor outlines, side by side

| travel.state.gov Visa Bulletin | rjimmigrationlaw.com "January 2026 Visa Bulletin: Updates, Trends, Projections" | rjimmigrationlaw.com "August 2026 Visa Bulletin: Key Employment and Family-Based Updates" | Prediction sites (Shusterman, Reddy Esq., Alaz Law, lawofficeimmigration, trackmyopt) |
| --- | --- | --- |---|
| Section A: statutory numbers | What changed this month | Employment-based updates | "Predictions for [month]" |
| Final Action Dates chart | EB category-by-category | Family-based updates | Per-category guesses, usually in words not dates |
| Dates for Filing chart | Family categories | What it means for applicants | Occasional date ranges |
| USCIS chart determination note | Trends and projections | Next steps | No method stated |
| Section D/E: retrogression and limit notices | Conclusion, citations | Citations | No historical series |

**The competitive weakness is uniform and large: nobody states a method.**
Every prediction page we read asserts movement ("EB-2 India may advance 2–3
weeks") with no stated basis, no historical series, and no distinction between a
projection and a published figure. Several present projected dates in the same
typography as official ones.

## Subtopic coverage matrix

| Subtopic | DOS | RJ monthly posts | Prediction sites | We cover | Our angle |
| --- | --- | --- | --- | --- | --- |
| EB-1/2/3 India final action | ✓ (when published) | ✓ | guesses | ✓ | Projected **ranges**, with a banner, from a stated method |
| EB-1/2/3 India dates for filing | ✓ | partial | rarely | ✓ | Both charts, every month |
| All-chargeability comparison | ✓ | partial | rarely | ✓ | Full table, India rows highlighted |
| Family F1–F4 India | ✓ | ✓ | some | ✓ | Full table |
| Month-over-month movement | — | ✓ (prose) | — | ✓ | Computed, with `C` and `U` handled as states rather than dates |
| 12-month history chart | — | — | — | ✓ | **Nobody charts it.** Inline SVG from the site's own 24-bulletin snapshot archive |
| Which chart USCIS accepts | ✓ (links) | ✓ | rarely | ✓ | Never asserted for an unpublished month — the page names the month the tracked determination actually covers |
| **A stated projection method** | n/a | — | — | ✓ | **The whole differentiator.** See below |
| FY2027 annual limit | ✓ (when published) | — | asserted | ✓ | Stated as *not yet published*; only the 140,000 statutory floor has backing |
| "What this means for you" scenarios | — | partial | — | ✓ | Worked against named priority dates |
| Priority-date explainer | ✓ | ✓ | ✓ | summary + link | Owned by `/visa-bulletin/priority-date` |
| FAD vs DFF explainer | ✓ | ✓ | ✓ | summary + link | Owned by `/visa-bulletin/final-action-date-vs-date-of-filing` |
| Retrogression explainer | ✓ | ✓ | partial | summary + link | Owned by `/visa-bulletin/retrogression` |
| Per-category outlook | — | ✓ | ✓ | summary + link | Owned by `/visa-bulletin/eb1-india`, `/eb2-india`, `/eb3-india` |
| Annual-limit mechanics | ✓ | — | — | summary + link | Owned by `/visa-bulletin/annual-limits` |

## The method — our unique section

Derived in code (`src/lib/visaBulletinProjections.ts`) from the snapshot
archive already in `data/visa-bulletin/`, not typed into copy:

1. **Trailing-12-bulletin movement.** For each category and country, the
   month-over-month change in the cutoff is computed across the last twelve
   published bulletins. Transitions into or out of `C` and `U` are **excluded**,
   because those are states and not dates — treating `U` as an old date is the
   classic way a movement tracker produces a confident "retrogressed 4,000 days".
2. **A range, not a point.** The low bound is no movement. The high bound is the
   75th percentile of the observed positive advances. A category that has shown
   any retrogression in the window also gets an explicit downside note.
3. **Fiscal-year stage.** FY2027 opened on 1 October 2026. Early-year bulletins
   historically advance fastest as the year's numbers become available, and
   late-year bulletins slow, retrogress or go unavailable — which is exactly what
   the India EB-2 series did in FY2026 (advanced to 15 July 2014 by April, then
   retrogressed in June and went Unavailable from July through September before
   resetting at 1 November 2013 in the October 2026 bulletin). The pages show
   that series and say so.
4. **No anchor on an unpublished limit.** DOS has not published the FY2027
   employment-based limit; `visaAnnualLimitsData.fiscalYears` records it as
   `awaiting-dos`. The projection therefore does not claim a supply figure.
5. **USCIS chart choice is never projected.** The tracked determination in
   `data/visa-bulletin/current.json` covers October 2026. The pages name that
   month explicitly rather than asserting a chart for a month USCIS has not
   ruled on.

Everything a projected page shows is marked as projected: a banner above the
fold, a `PROJECTED` badge on every value, and `robots: noindex` is **not** used —
the page is a legitimate, labelled forecast at a permanent URL, which is the
whole point of keeping the forecast word out of the slug.

## Sources used

| Source | Checked |
| --- | --- |
| `data/visa-bulletin/` snapshot archive, 2021-08 → 2026-10 (built from DOS bulletins) | 2026-10-13 |
| `data/visa-bulletin/current.json` (October 2026, USCIS chart determination, verified 2026-09-29) | 2026-10-13 |
| travel.state.gov Visa Bulletin index — **403 to automated fetch**; checked via domain-restricted search | 2026-10-13 |
| `src/data/visaAnnualLimitsData.ts` (INA 201, 202, 203 shares; FY2027 pool unpublished) | 2026-10-13 |
| rjimmigrationlaw.com January 2026 and August 2026 bulletin posts | 2026-10-13 |
