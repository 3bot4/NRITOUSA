Builds out the September 2026 competitor keyword gap against abogadolozano.com. Twelve commits: Phase 0, one per item, then QA.

**Do not merge yet** — a preview deployment check is still outstanding (see Mobile below).

## What shipped

| Item | Action | URL |
|---|---|---|
| 1 | NEW | `/uscis/forms/i-864` — affidavit of support + I-864P income checker |
| 2 | NEW | `/uscis/forms/i-751` — removing conditions + filing-window calculator |
| 3 | NEW | `/tools/citizenship-test-practice` — all 128 official civics questions |
| 4 | NEW pattern | `/visa-bulletin/<month>-<year>`, hub at `/visa-bulletin/monthly-update` |
| 5 | EDIT | `/nvc-processing-time` — published DOS timeframes + timeline estimator |
| 6 | EDIT | `/uscis/request-for-evidence-rfe` — deadline calculator |
| 7 | EDIT | `/h1b-lottery-chances` + the calculator — weighted selection |
| 8 | NEW | `/green-card/marriage-interview-questions` — couple practice mode |
| 9 | NEW | `/uscis/expedite-request` — eligibility checker |
| 10 | EDIT | `/divorce-immigration-status`, `/ead-renewal-gap` |
| 11 | NEW | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` |
| — | SKIPPED | L-1A vs L-1B — could not clear the no-thin-page bar |

Every page: answer-first block, a working tool, a diagram, a chart or a documented reason there isn't one, 1,500–2,500 words, 7+ FAQs, a sources block, byline and "not legal advice".

## Two items resolved to EDIT on the evidence

- **Item 7** — `/h1b-lottery-chances` already explained weighted selection, so the command's own decision rule says upgrade it rather than mint `/h1b/weighted-selection` as a duplicate.
- **Item 5** — the "I-130 approved, what next" cluster lands on `/nvc-processing-time` rather than becoming a third page, and "consular processing vs adjustment" is a section there rather than a new URL.

## Accuracy

Every figure comes from an official source with the date it was checked; the report lists all 40 with URLs. Notably the competitor is wrong on two facts this PR gets right: the I-751 fee is $750 paper / $700 online with **no** separate biometrics fee (not "$750 plus $85"), and the receipt notice extends status **48 months**, not 24.

Nothing unverifiable was published — FY 2027 H-1B registration counts, a rumoured October 2026 test redesign, and any I-751 or RFE processing-time figure are all listed as Unverified and left off the pages.

**The October 2026 visa bulletin is not out** (checked 2026-09-16), so the first month page published is September 2026 — the bulletin actually in force. A test asserts `2026-10` is absent from `PUBLISHED_MONTHS`.

## Bugs found and fixed along the way

1. **Six visa-bulletin pages were emitting no `FAQPage` schema at all.** `extractFaq()` needs a `## ` FAQ section with `### ` questions; five pages used `###`/`####` and `annual-limits` had no FAQ heading. The parser silently returned nothing. `annual-limits` went 0 → 7 FAQ entities, the others 0 → 3.
2. **`Math.max(1, NaN)` is `NaN`** — a non-finite beneficiary count propagated to a rendered "NaN%" in the shipped H-1B odds model. `lotteryOdds.ts` had no test file; it now has 20.
3. **`seo-audit.test.ts` did not actually skip without a build** — `describe.skip` still runs its callback, so it threw on a clean checkout instead of skipping, contrary to its own docstring and CLAUDE.md.
4. **Two dead `travel.state.gov` URLs** — the NVC timeframes page has no `/nvc/` segment, and the IV Scheduling Status tool moved to `iv-wait-times.html`.

## Gates

- `npx next build` — exit 0, 934 routes, all 7 new routes in the output
- `npx tsc --noEmit` — clean
- `npx vitest run` — **2,107 passed, 0 skipped**, 97 files (142 new tests across 9 new suites)
- Schema — 13/13 gap pages carry Article + BreadcrumbList + FAQPage, WebApplication on every tool page
- Duplicate scan — 914 pages, **0 duplicate H1s**; the one duplicate title is two 404s
- `npm run lint` — cannot run non-interactively (documented in CLAUDE.md)

## Mobile — partial, and the reason to hold the merge

A real 360px render was **not** performed: the repo ships no headless browser, and adding puppeteer to run one audit isn't a trade worth making silently. Instead the traps a previous site-wide phone audit actually found are encoded as assertions over every new component (fluid SVGs, the 16px input floor, tables wrapped and min-width'd, `ToolFirstLayout` children supplying their own `Container`, no `window.innerWidth`).

**Please check on the preview:** a 360px pass, and the Facebook in-app browser — particularly the **.ics download** in the I-751 calculator, which in-app browsers handle inconsistently and static analysis cannot catch.

## Docs

- `docs/seo/gap-2026-09/` — recon, overlap matrix, 11 per-item competitor gap files, and `REPORT.md` (verified facts, unverified items, recommendations not actioned, IndexNow list)
- `docs/seo/visa-bulletin-monthly-runbook.md` — publishing a month page in ~15 minutes

## After merge

`npm run indexnow` against the 16 production URLs in REPORT.md §8. Do not ping the preview.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
