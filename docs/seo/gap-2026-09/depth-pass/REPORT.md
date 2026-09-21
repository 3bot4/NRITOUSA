# Depth pass — report

Branch `feat/immigration-gap-depth-sep-2026`, on top of the merged PR #50.
Eight commits: gap re-analysis, then one per item group.

This pass adds no new URLs. Every change edits a page that already owns its
topic, which settles hard rule 1 — the overlap decisions were made in
[`01-overlap-matrix.md`](../01-overlap-matrix.md) and none of them changed.

---

## 1. What changed, per page

Word counts are prose only, from `scripts/audit/page-words.mjs`, measured on the
page module itself so before and after are directly comparable. Tables and
figures are counted across the page and every module it renders from.

| # | Page | Words | Tables | Figures | FAQs | What was added |
|---|---|---|---|---|---|---|
| 9 | `/uscis/expedite-request` | 1,435 → **2,533** | 1 → **2** | 1 → **3** | 8 → **14** | The four-rung escalation ladder, a ladder diagram, a premium fee-vs-guarantee chart |
| 11 | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` | 1,480 → **1,989** | 0 → **4** | 2 | 8 → **12** | Eight-row route comparison, the 10 EB-1A criteria, the 6 EB-1B criteria, the 3 Dhanasar prongs |
| 6 | `/uscis/request-for-evidence-rfe` | 1,533 → **2,339** | 2 → **5** | 1 → **3** | 10 | RFE reasons by filing, response windows, response package; window chart + four-branch diagram |
| 5 | `/nvc-processing-time` | 2,186 → **2,644** | 2 → **4** | 1 → **2** | 12 | Stage range chart, fee table, seven-row delay table |
| 2 | `/uscis/forms/i-751` | 1,860 → **3,017** | 1 → **4** | 1 → **3** | 9 → **14** | Extension-coverage chart, waiver-ground diagram, cost table, mistakes table, the N-400 overlap |
| 1 | `/uscis/forms/i-864` | 2,605 → **3,728** | 1 → **3** | 3 → **5** | 12 → **18** | Exemptions, document table, three-location chart, obligation diagram |
| 3 | `/tools/citizenship-test-practice` | 1,463 → **2,146** | 1 → **4** | 2 → **3** | 9 → **14** | English portion + exceptions, 2025-vs-2008 table, pool-composition chart |
| 8 | `/green-card/marriage-interview-questions` | 1,896 → **2,468** | 1 → **4** | 1 | 8 → **12** | Question-area index, scrutiny factors, the not-red-flags table, the Stokes section |
| 4 | `/visa-bulletin/[month]-[year]` | 1,598 → **1,881** | 2 → **3** | 2 | 7 | How to read a bulletin cell |
| 4 | `/visa-bulletin/monthly-update` (hub) | — | 1 | — | 3 → **7** | Four FAQs; it was below the six-FAQ bar (see §6a) |
| 7 | `/h1b-lottery-chances` | 2,404 → **2,454** | 1 → **2** | 2 | 12 | Entries and modelled odds by wage level, with a change column |
| 10a | `/divorce-immigration-status` | — | +1 | 1 | existing | The four stages as a grid |
| 10b | `/ead-renewal-gap` | 1,522 → **1,644** | 2 → **3** | 1 | existing | EAD category-code table |

Every page clears the 1,500-word bar on its own module before the data and
component modules it renders from are counted. Nothing was padded: each
addition is a table, a figure or a section answering a question the competitor
answers and we did not.

---

## 2. The five things worth reading the diff for

**The expedite page was a dead end, and that was the largest hole left.** Our own
copy told most readers no criterion applied to them — correctly — and then
stopped at a link to the delay checker. The competitor page is not really an
expedite page at all; it is a delay-escalation page. It has four rungs we had
none of. Those are now on the page as sourced data with a comparison table and
a ladder diagram: the outside-normal-processing-time case inquiry (USCIS states
a general goal of 15 business days to resolve a service request), a
Congressional inquiry and why the Privacy Act release gates it, the CIS
Ombudsman on DHS Form 7001 with its 90-days/60-days prerequisite, and mandamus
under 28 U.S.C. § 1361 at $405 to file. Each rung carries what it can and
cannot do. None of the four is an expedite and none reorders a queue, and the
page says so twice.

**The I-864 exemptions were missing from both pages, and the rule moved.** Four
groups need no affidavit at all. The 40-quarters route is checked far less than
it should be, because most people do not know quarters can be credited from a
spouse during the marriage or from a parent before you turned 18 — which is
exactly the Indian-parent case this site exists for. And the procedure changed
on 10 December 2024: the exemption is requested on Form I-485 now, not by
filing a separate I-864W alongside it. That dates a great deal of otherwise
correct-sounding instruction still circulating.

**EB-1A vs EB-1B turns on one phrase, and no page prints it.** This was the only
gap page with no `<table>` at all, on a page whose primary keyword is literally
"eb1b vs eb1a". The criteria are now quoted from 8 CFR 204.5 rather than
described, and side by side the difference is visible: the EB-1A research
criterion asks for contributions *of major significance* and the EB-1B
equivalent does not. That is why the same record clears one and fails the
other. The competitor compares the categories in prose and never shows it.

**The I-751 and N-400 overlap is the normal case, not an edge one.** A
conditional resident married to a US citizen reaches N-400 eligibility three
years after admission, routinely while the I-751 is still pending. The Policy
Manual answer is better than people expect and nobody states it plainly: filing
is not blocked, only approval, and where an N-400 is pending USCIS adjudicates
the I-751 before or at the same time, often in one combined interview.

**The red-flag lists on this subject do real harm.** Every other page on
marriage interviews has one, and most of them frighten genuine couples about an
age gap, an arranged marriage or a short courtship while saying nothing about
the thing that decides cases. Ours is two tables: six factors that genuinely
draw a closer look with what answers each, and six widely-repeated ones that
are not problems. The page states that no published USCIS checklist exists and
that anyone presenting one as official is guessing.

---

## 3. Newly verified facts

Read on the date shown, from the source named. Nothing from memory, nothing
from a competitor page.

| Fact | Value | Source | Checked |
|---|---|---|---|
| Service request resolution goal | 15 business days from creation | USCIS Policy Manual Vol. 1, Pt. A, Ch. 4 | 2026-09-20 |
| Outside-normal-processing-time test | Receipt date earlier than the published case inquiry date; six months if the form is unlisted | USCIS processing times FAQ + e-Request | 2026-09-20 |
| CIS Ombudsman prerequisite | Contacted USCIS in the last 90 days **and** gave USCIS at least 60 days | dhs.gov/case-assistance | 2026-09-20 |
| CIS Ombudsman form | DHS Form 7001, Request for Case Assistance, no fee | dhs.gov Form 7001 page | 2026-09-20 |
| Privacy Act consent for third-party disclosure | Written consent required | 5 U.S.C. § 552a | 2026-09-20 |
| Mandamus jurisdiction | 28 U.S.C. § 1361 | Cornell LII | 2026-09-20 |
| District court civil filing fee | $350 statutory + $55 administrative = $405 | 28 U.S.C. § 1914(a); uscourts.gov fee schedule (eff. 2023-12-01) | 2026-09-20 |
| I-864 exemption — 40 quarters | Exempt; quarters creditable from a spouse during the marriage or a parent before age 18 | uscis.gov/i-864w; Policy Manual Vol. 8, Pt. G, Ch. 6 | 2026-09-20 |
| I-864 exemption — Child Citizenship Act | Child of a USC acquiring citizenship on admission under INA 320 is exempt | uscis.gov/i-864w | 2026-09-20 |
| How the exemption is claimed | **Since 2024-12-10, requested on Form I-485, not on a separately filed I-864W** | uscis.gov/i-864w | 2026-09-20 |
| 8 CFR 204.5(h)(3) | Ten EB-1A criteria, verbatim | Cornell LII, 8 CFR 204.5 | 2026-09-20 |
| 8 CFR 204.5(i)(3)(i) | Six EB-1B criteria, verbatim | Cornell LII, 8 CFR 204.5 | 2026-09-20 |
| EB-1B experience requirement | At least three years teaching and/or research | 8 CFR 204.5(i)(3)(iii) | 2026-09-20 |
| EB-1B private-employer requirement | Research department employing at least three full-time researchers, with documented accomplishments | 8 CFR 204.5(i)(3)(iv)(C) | 2026-09-20 |
| N-400 while I-751 pending | Filing permitted; approval requires the I-751 decided. USCIS adjudicates the I-751 before or with the N-400; combined interview where applicable | Policy Manual Vol. 12, Pt. G, Ch. 5 | 2026-09-20 |
| Exceptions to that | INA 329 military; INA 319(b) spouses employed abroad by qualifying organisations | Policy Manual Vol. 12, Pt. G, Ch. 5 | 2026-09-20 |
| English exceptions | 50/20, 55/15, 65/20 — measured at filing | uscis.gov exceptions and accommodations | 2026-09-20 |
| Civics under 50/20 and 55/15 | Still required, in the language of your choice | uscis.gov exceptions and accommodations | 2026-09-20 |
| Civics under 65/20 | Reduced question set and lower pass mark | uscis.gov; USCIS M-1778 (09/25) | 2026-09-20 |
| N-648 | Physical/developmental disability or mental impairment lasting or expected to last 12 months; certified only by a US-licensed MD, DO or clinical psychologist | uscis.gov/n-648; Policy Manual Vol. 12, Pt. E, Ch. 3 | 2026-09-20 |
| Civics pool composition | American Government 72, American History 46, Symbols and Holidays 10 | Counted from USCIS M-1778 (09/25) in `data/citizenship-test-2025.json` | 2026-09-20 |

Figures already verified in the September build and reused unchanged — I-864P
thresholds, asset multiples, I-751 fee and 48-month extension, RFE response
periods, premium fees, the 5 August 2026 discretion change, 90 FR 60864 — are
in the [main report](../REPORT.md) §3 and were not re-derived.

---

## 4. Unverified — deliberately left out

- **NVC fee amounts.** `travel.state.gov` returned 403 to every automated
  request on 2026-09-20, as CLAUDE.md documents, and the fee page did not
  surface amounts through search either. The new fee table uses the repo's
  existing `nvcFees` values, which carry `lastVerified: 2026-07-04`, renders
  that date on the page, and links out with an explicit "confirm before
  paying". A ledger item asks for a manual re-verification.
- **Any I-751 or NVC processing-time series.** Unchanged from the September
  position. Two published Department of State figures are not a series, and no
  sourced per-form I-751 series exists. The charts added here draw rules and
  published planning ranges, and say so in the caption.
- **Congressional casework turnaround.** No office publishes one. The table
  says "no published standard" rather than quoting a typical figure.
- **Whether the Ombudsman charges a fee.** Nothing on dhs.gov states it
  explicitly. The page says the request is free because no fee is charged or
  published anywhere in the process; if that is ever contradicted it should be
  corrected.

---

## 5. Recommendations not actioned

Hard rule 13 again: no deletions, redirects or canonical changes in this pass.

1. **`/uscis/expedite-request` now covers escalation as well as expedites.** The
   title and H1 still say expedite, which is right for the primary keyword, but
   the page is broader than its name. Worth watching whether it starts ranking
   for delay and mandamus terms, and if it does, whether the ladder deserves
   its own URL rather than a section. It does not today.
2. **`/uscis/rfe-notice` and `/h1b/rfe`** should be re-read against the general
   RFE page now that it carries a reasons-by-filing table. The three were
   confirmed distinct in September; the general page has grown since.
3. **The `nvcFees` staleness window.** `audit:monthly-numbers` does not cover
   `nvcData.ts`. It should, given the page now renders a fee table.
4. **`ENGLISH_PORTION` and the civics data** live in two places now —
   `data/citizenship-test-2025.json` for the verbatim USCIS bank, and
   `src/data/naturalisationExceptions.ts` for the exceptions. That split is
   deliberate (the JSON is a verbatim transcription of one publication) but
   should be documented wherever a future edition is ingested.

---

## 6. QA

| # | Check | Result |
|---|---|---|
| 1 | `npx tsc --noEmit` | ✅ clean |
| 1 | `npx vitest run` | ✅ 2,107 passed, 97 files |
| 1 | `npx next build` | see §6a |
| 1 | `npm run lint` | ⚠️ cannot run non-interactively — documented in CLAUDE.md |
| 2 | Mobile traps encoded as tests | ✅ `gap-2026-09.mobile.test.ts` extended to the four new visual modules; the unlisted-component guard caught each one before it shipped |
| 2 | Real 360px render | ⚠️ still outstanding — same position as September, and still a preview-deploy job |
| 3 | Schema on each edited URL | see §6a |
| 4 | Duplicate title/H1 scan | see §6a |
| 5 | No-thin-page checklist | ✅ every page: answer block, tool, diagram, chart or documented reason, 6+ FAQs, sources |
| 6 | Sitemap | ✅ unchanged — no new URLs in this pass |
| 7 | Internal links | ✅ new cross-links listed in §7 |
| 8 | IndexNow | ✅ §8 |

### 6a. The gates, run against a real build

`npx next build` — **exit 0, 934 routes**, compiled and typechecked clean.
`npx vitest run` — **2,107 passed, 0 skipped, 97 files**, with the
build-dependent SEO invariants live.

**Schema — 13/13.** `scripts/audit/schema-scan.mjs` against the rendered HTML:

```
OK   /uscis/forms/i-864                        faq=18  WebApplication
OK   /uscis/forms/i-751                        faq=13  WebApplication
OK   /tools/citizenship-test-practice          faq=14  WebApplication
OK   /nvc-processing-time                      faq=12  WebApplication
OK   /uscis/request-for-evidence-rfe           faq=9
OK   /uscis/expedite-request                   faq=14  WebApplication
OK   /green-card/marriage-interview-questions  faq=12  WebApplication
OK   /green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw   faq=12  WebApplication
OK   /h1b-lottery-chances                      faq=13
OK   /divorce-immigration-status               faq=30  WebApplication
OK   /ead-renewal-gap                          faq=10
OK   /visa-bulletin/september-2026             faq=7
OK   /visa-bulletin/monthly-update             faq=7
```

**One real finding, fixed.** The first schema run came back 12/13:
`/visa-bulletin/monthly-update` emitted a valid `FAQPage` with **three**
entries, below this build's own six-FAQ bar. It was in scope for the September
build — it became the month hub — and the bar was missed on it. Fixed by
answering the four questions a hub for month pages should obviously answer and
did not: when the bulletin is released each month, why each month gets a page,
Final Action versus Dates for Filing, and whether cut-off dates only move
forward. Now 7.

Worth noting what caught it: not the FAQ-schema parser, which was reporting
correctly, but the thin-page threshold in the scanner. The September build
fixed `extractFaq()` silently returning nothing; this run found a page where it
returned something and the something was too small.

**Duplicate title/H1 scan — 914 pages, 0 duplicate H1s.** One duplicate title,
`"Page not found"` shared by `/_not-found` and `/h1b-sponsors/civil-engineers/gu`.
Identical to the September result: both are 404s, neither is indexable, and the
site's own `seo-audit` invariant does not flag them. The 6 pages with no `<h1>`
are the pre-existing noindex `/nri-wealth-checkup/*` app states plus that same
404 — none from this build or the last one.

**The mobile guard earned its keep.** `gap-2026-09.mobile.test.ts` failed four
times during this pass, each time because a new visual module was not on its
list — exactly what the unlisted-component guard exists for. All four are now
covered by the viewBox, no-pixel-width, `role="img"`/`aria-label`/`figcaption`
and no-`window.innerWidth` assertions, and every new table is inside an
`overflow-x-auto` wrapper with a `min-w-[...]`.

---

## 7. Internal links added in this pass

No new URLs, so no inbound-link campaign is needed. These are the new
cross-links the added sections created:

| From | To | Why |
|---|---|---|
| `/uscis/expedite-request` | `/immigration-attorney-lawyer-cost` | The mandamus rung — the honest starting point before federal litigation |
| `/uscis/expedite-request` | `/tools/uscis-processing-delay-checker`, `/tools/processing-times` | Rung 1 needs the case inquiry date |
| `/ead-renewal-gap` | `/uscis/expedite-request` | (c)(26) and (c)(9) have no premium option; expedite is the only lever left |
| `/nvc-processing-time` | `/uscis/forms/i-864` | The affidavit is the largest single cause of NVC restarts |
| `/nvc-processing-time` | `/nvc-document-checklist-india` | The India-specific document list, from the delays table |
| `/uscis/forms/i-751` | `/tools/citizenship-test-practice` | From the new N-400-while-pending section |
| `/uscis/request-for-evidence-rfe` | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw`, `/uscis/forms/i-864` | Two rows of the RFE-reasons table |
| `/green-card/marriage-interview-questions` | (existing cluster links retained) | Stokes section links back to the practice tool on the same page |

---

## 8. IndexNow — after the production deploy

Production URLs only. **Do not ping the preview.**

```
https://www.nritousa.com/uscis/expedite-request
https://www.nritousa.com/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw
https://www.nritousa.com/uscis/request-for-evidence-rfe
https://www.nritousa.com/nvc-processing-time
https://www.nritousa.com/uscis/forms/i-751
https://www.nritousa.com/uscis/forms/i-864
https://www.nritousa.com/tools/citizenship-test-practice
https://www.nritousa.com/green-card/marriage-interview-questions
https://www.nritousa.com/h1b-lottery-chances
https://www.nritousa.com/ead-renewal-gap
https://www.nritousa.com/divorce-immigration-status
https://www.nritousa.com/visa-bulletin/september-2026
https://www.nritousa.com/visa-bulletin/monthly-update
```

`npm run indexnow`
