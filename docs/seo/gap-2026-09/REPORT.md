# September 2026 competitor keyword-gap build — report

Branch `feat/immigration-gap-sep-2026`. Twelve commits: Phase 0, then one per item.
Gap source: Semrush keyword gap against abogadolozano.com, US database, exported 2026-09-16.

---

## 1. One row per item

| # | Action | Final URL | Primary keyword | Vol | KD | Overlap decision | Tool | Diagram | Chart | Body words | FAQs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **NEW** | `/uscis/forms/i-864` | i-864p | 5,400 | 23 | No page owned the I-864; 22 files only mentioned it (max ~10% overlap) → new | Sponsor income checker | Decision flow | Income vs requirement + threshold by household size | ~2,100 | 12 |
| 2 | **NEW** | `/uscis/forms/i-751` | remove the conditions on my green card | 2,400 | 13 | `/i90-vs-i751` is a *which-form* comparison (~25%) and keeps that intent → new | Filing-window calculator with .ics | Full timeline + waiver branch | **None — documented** | ~1,700 | 9 |
| 3 | **NEW** | `/tools/citizenship-test-practice` | citizenship test questions 2026 | 5,400 | 33 | `/tools/citizenship-checklist` is N-400 readiness (~12%); `grep "citizenship test"` → 0 files → new | Practice test, 4 modes, 128 questions | Naturalisation path + retest branch | Score by category (session) | ~1,900 | 9 |
| 4 | **NEW PATTERN + hub edit** | `/visa-bulletin/september-2026`, hub at `/visa-bulletin/monthly-update` | visa bulletin [month] [year] | 18,100 | 23 | Hub ~35%, but month-specific intent has no page → new pattern | Existing priority-date checker, embedded | Which chart applies to you | India EB-1/2/3, last 24 bulletins | ~1,500 | 7 |
| 5 | **EDIT** | `/nvc-processing-time` | nvc processing time (we were #45) | 2,900 | 73 | 45% already → edit. "I-130 approved what next" lands here, not a 3rd page | NVC timeline estimator + email | 10-stage consular path | **None — documented** | ~2,200 | 12 |
| 6 | **EDIT** | `/uscis/request-for-evidence-rfe` | response to uscis' RFE was received | 480 | 14 | Three RFE pages confirmed distinct → edit the general one | RFE deadline calculator | RFE flow + 4 endings | **None — documented** | ~1,800 | 10 |
| 7 | **EDIT (no new page)** | `/h1b-lottery-chances` + `/h1b-lottery-chance-calculator` | h1b weighted selection | 1,300 | 33 | Page already explained weighted selection → command's own decision rule says upgrade | Existing calculator upgraded | Registration → weighted entries → caps | Odds by wage level, random vs weighted | ~2,000 | 12 |
| 8 | **NEW** | `/green-card/marriage-interview-questions` | marriage based green card interview questions | 1,600 | 16 | `/uscis/interview-scheduled` covers the *notice* (~15%) → new | Couple practice mode | Interview day + separate-interview branch | **None — documents table instead, as directed** | ~1,900 | 8 |
| 9 | **NEW** | `/uscis/expedite-request` | uscis expedite | 320 | 30 | Premium-processing pages are a different mechanism (~20%) → new | Expedite eligibility checker | Decision tree | **None — documented** | ~1,600 | 7 |
| 10a | **EDIT** | `/divorce-immigration-status` | green card divorce before 2 years | 260 | 13 | Exists and is deep → edit | Status checker (status × stage) | Divorce by stage | **None — existing alimony estimator retained** | +~500 | existing |
| 10b | **EDIT** | `/ead-renewal-gap` | ead automatic extension | 1,900 | 34 | Exists and already correct on the rule → edit | Auto-extension eligibility + end date | Old rule vs current rule | **None — documented** | +~500 | existing |
| 11 | **NEW** | `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` | eb1b vs eb1a | 320 | 6 | No comparison page; `grep "eb1a"` → 1 file (a dropdown) → new | Route finder | Comparison matrix | India EB-1 vs EB-2, last 36 bulletins | ~1,700 | 8 |
| — | **SKIPPED** | L-1A vs L-1B | — | ~1,060 | 2–25 | No L-1 content to extend, no India angle, no dataset, no natural tool | — | — | — | — | — |

**Word counts** are prose only, measured with `scripts/audit/page-words.mjs` (added in this
build). Every page clears the 1,500-word bar; none is padded to reach it.

---

## 2. What we now do better, per item

Across all thirteen competitor URLs fetched: **no tools, no calculators, essentially no
diagrams, and not one cited official source URL.** Several carry stale or wrong figures.
That pattern is the gap.

- **Item 1 — I-864.** Their page says ~$39,000 for a household of four; Form I-864P says
  $41,250. We derive every figure from the published 100% guidelines and pin the result
  against the printed 125% column in a test. They never mention the 3× / 5× / 1× asset
  multiples at all. And nothing anywhere covers the US-domicile question for a sponsor
  living in India.
- **Item 2 — I-751.** They state "$750 plus $85 biometrics" and a 24-month extension. Both
  wrong: $750 paper / $700 online with no separate biometrics fee, and a **48-month**
  extension in force since January 2023. We also surface the fact that matters most to a
  divorced filer — the 90-day window does not restrict a waiver filing.
- **Item 3 — citizenship test.** Their title promises 128 questions and the page lists
  none. We have all 128 from the official USCIS publication, a practice tool that mirrors
  the officer's real stop rule (12 correct or 9 wrong), and the OCI-after-naturalisation
  consequence no competitor touches.
- **Item 4 — visa bulletin.** They publish one month and abandon it. We built a repeatable
  template plus a runbook, so a month ships in minutes, and month pages funnel into the
  category pages already ranking #55 and #88.
- **Item 5 — NVC.** They say "2026". We say NVC is creating cases received 1 Sep 2026 and
  reviewing documents submitted 13 Jul 2026, each with its "as of" date. Their India
  equivalent is Ciudad Juárez; ours is Mumbai.
- **Item 6 — RFE.** They quote "30 to 87 days" without explaining where 87 comes from. We
  give the rule: 84 days maximum, 30 for I-539 and I-601A, +3 for mailed service, and no
  extensions permitted — plus a calculator that applies it.
- **Item 7 — H-1B weighted selection.** They cite no rule. We cite 90 FR 60864 and show the
  finding nobody states: weighting redistributes, so **Level I ends up worse off than the
  old random draw**.
- **Item 8 — marriage interview.** They sell a mock-interview service. We built one that
  runs on a phone and shows only the answers that diverge — plus arranged marriages, Indian
  wedding evidence and the registration-certificate point, none of which they have.
- **Item 9 — expedite.** They quote an I-140 premium fee that does not match the current
  schedule. We lead with the rule that decides most cases — no expedite where premium
  exists — and split premium availability by *category*, not just by form.
- **Item 10 — divorce, EAD.** Both competitor pages cite nothing. Ours carry the Federal
  Register citation and, for the EAD, the two carve-outs the repeal did not touch.
- **Item 11 — EB-1/NIW.** They compare three routes; the searcher is choosing between four.
  And for an India-born applicant the choice is years of waiting, which their page — a
  Texas firm writing for a general audience — never raises.

---

## 3. Verified facts

Every figure below was read from the source named, on the date given. Nothing was taken
from memory or from a competitor page.

| Fact | Value | Source | Checked |
|---|---|---|---|
| I-864P 125% threshold, household of 2, 48 states | $27,050 | uscis.gov/i-864p | 2026-09-16 |
| I-864P edition effective date | 2026-03-01 | uscis.gov/i-864p | 2026-09-16 |
| 2026 HHS poverty guidelines (100%, all three tables) | sizes 1–8 + increments | aspe.hhs.gov + 91 FR notice 2026-00755 | 2026-09-16 |
| I-864 asset multiples | 3× spouse/child of USC, 1× adopted orphan, 5× all other | 8 CFR 213a.2 (govinfo) | 2026-09-16 |
| I-864 tax return requirement | Most recent year mandatory; 3 years optional | 8 CFR 213a.2 | 2026-09-16 |
| USCIS filing fee for I-864 | $0 | G-1055 ed. 09/09/26 | 2026-09-16 |
| I-751 filing fee | $750 paper / $700 online | G-1055 ed. 09/09/26 (PDF) | 2026-09-16 |
| I-751 filing window | 90 days before the card expires | uscis.gov/i-751 | 2026-09-16 |
| I-751 waiver filings not bound by the window | Confirmed | USCIS removing-conditions page | 2026-09-16 |
| I-751 receipt-notice extension | 48 months, since 2023-01-25 | USCIS alert + I-9 Central | 2026-09-16 |
| N-400 fee | $760 paper / $710 online | G-1055 ed. 09/09/26 | 2026-09-16 |
| Premium processing I-129 / I-140 | $2,965 | G-1055 ed. 09/09/26 | 2026-09-16 |
| Premium processing I-765 (OPT/STEM) | $1,780 | G-1055 ed. 09/09/26 | 2026-09-16 |
| Premium processing I-539 (F/J/M) | $2,075 | G-1055 ed. 09/09/26 | 2026-09-16 |
| 2025 civics test format | 128 pool, 20 asked, 12 to pass | USCIS 2025 Civics Test page | 2026-09-16 |
| Officer stops at | 12 correct or 9 incorrect | USCIS 2025 Civics Test page | 2026-09-16 |
| Applies to N-400s filed | on or after 2025-10-20 | USCIS study-for-the-test page | 2026-09-16 |
| 65/20 special consideration | 20 starred, 10 asked, 6 to pass | USCIS M-1778 (09/25) | 2026-09-16 |
| The 128 questions and answers | Full text | USCIS M-1778 (09/25) PDF | 2026-09-16 |
| Naturalisation test attempts / re-test | 2 attempts, re-tested 60–90 days later on the failed portion only | USCIS interview-and-test page | 2026-09-16 |
| Latest published visa bulletin | September 2026 | travel.state.gov | 2026-09-16 |
| NVC case creation | working on cases received 2026-09-01, as of 2026-09-08 | DOS NVC timeframes | 2026-09-16 |
| NVC document review | reviewing documents submitted 2026-07-13, as of 2026-08-31 | DOS NVC timeframes | 2026-09-16 |
| RFE maximum response period | 12 weeks (84 days) | Policy Manual Vol 1 Pt E Ch 6 | 2026-09-16 |
| RFE short-form period | 30 days (I-539, I-601A) | Policy Manual Vol 1 Pt E Ch 6 | 2026-09-16 |
| RFE mailed-service addition | +3 days | Policy Manual Vol 1 Pt E Ch 6 | 2026-09-16 |
| RFE extensions | Prohibited by regulation | Policy Manual Vol 1 Pt E Ch 6 | 2026-09-16 |
| Discretion to deny without RFE/NOID | Effective 2026-08-05 | USCIS policy alert 20260805 | 2026-09-16 |
| H-1B weighted selection rule | 90 FR 60864, pub. 2025-12-29, eff. 2026-02-27, RIN 1615-AD01 | Federal Register API | 2026-09-16 |
| Weighted entries | Level I=1, II=2, III=3, IV=4; one count per beneficiary | Federal Register final rule | 2026-09-16 |
| Expedite criteria (five) | Verbatim | USCIS Expedite Requests page | 2026-09-16 |
| Premium bar on expedites | No expedite where premium available, except IRS nonprofits | USCIS Expedite Requests page | 2026-09-16 |
| Expedite request channels | Online account, Contact Center, Ask Emma, field office | USCIS Expedite Requests page | 2026-09-16 |
| EAD automatic extension removed | Renewals filed on/after 2025-10-30 | FR 2025-19702 | 2026-09-16 |
| Pre-repeal extension length | Up to 540 days | FR 2025-19702 | 2026-09-16 |
| EB-1A criteria | 3 of 10, or one major international award | 8 CFR 204.5(h) | 2026-09-16 |
| EB-1B criteria | 2 of 6 + 3 years + permanent/tenure-track offer | 8 CFR 204.5(i) | 2026-09-16 |
| EB-1C requirement | 1 year managerial/executive abroad in preceding 3 | 8 CFR 204.5(j) | 2026-09-16 |
| NIW framework | Three Dhanasar prongs | Policy Manual Vol 6 Pt F Ch 5 | 2026-09-16 |

---

## 4. Unverified — deliberately left out

- **FY 2027 H-1B registration and selection counts.** USCIS announced the cap was reached
  but has not published the numbers. The page says so instead of quoting a figure, and the
  odds chart is labelled a model with its assumptions printed under it.
- **A further "October 2026" citizenship test redesign.** The competitor asserts one; we
  could not verify it against any USCIS source, so it is not on our page.
- **The $100,000 H-1B fee** the competitor states is "already in effect". Not repeated
  without a citation.
- **Any I-751 or RFE processing-time figure.** No sourced per-form series exists, and
  `src/data/uscisProcessingData.ts` already documents the rule against publishing one.
- **A trend line for NVC's published timeframes.** Two current figures are not a series.
- **Two travel.state.gov URLs** still in `src/data/nvcData.ts` — `nvc-contact-information`
  and `nvc-fees` — sit under the `/immigrate/nvc/` path that proved wrong for two of their
  siblings. Not changed on a guess. Queue them for `npm run ledger:links`.

---

## 5. Recommendations not actioned

No redirects, canonical changes or merges were made, per hard rule 13. These are
recommendations only:

1. **`/uscis/receipt-number` is both a static route and a cluster slug.** The static route
   wins and the cluster child is unreachable. The sitemap already de-duplicates it by hand.
   Worth resolving properly rather than leaving a rendered-once/defined-twice page.
2. **`/visa-bulletin/october-2026-predictions`** should be retired or reframed the moment
   the October 2026 bulletin publishes, or it will contradict the month page.
3. **`/i90-vs-i751`** now has a deeper sibling. Watch Search Console for the two competing
   on "i-751" terms; if they do, the comparison page should be narrowed further rather than
   redirected — it serves a real and distinct intent.
4. **`/tools/citizenship-checklist`** and the new practice test should be watched for
   overlap on N-400 terms. They target different intents today.
5. **`src/data/nvcData.ts` fee amounts** carry `lastVerified: 2026-07-04` and are outside
   the 45-day staleness window used by `audit:monthly-numbers`. Not in this build's scope.

---

## 6. QA checklist

| # | Check | Result |
|---|---|---|
| 1 | `npx tsc --noEmit` | ✅ clean |
| 1 | `npx next build` | ✅ **exit 0, 934 routes.** All 7 new routes present in the build output |
| 1 | `npx vitest run` | ✅ **2,107 passed, 0 skipped, 97 files** (the 18 build-dependent SEO invariants now run) |
| 1 | New calculator unit tests | ✅ 9 new suites, 142 new tests |
| 1 | `npm run lint` | ⚠️ cannot run — opens an interactive prompt (CLAUDE.md). tsc + vitest + build are the real gates |
| 2 | Mobile at 360px | ⚠️ **partially** — see below |
| 3 | Schema on each new/edited URL | ✅ **13/13 gap pages**, via `scripts/audit/schema-scan.mjs` against the build |
| 4 | Duplicate title/H1 scan | ✅ **914 pages, 0 duplicate H1s, 0 real duplicate titles** — see below |
| 5 | No-thin-page checklist | ✅ all 12 pages: answer block, tool, diagram, chart-or-documented-reason, 6+ FAQs, sources |
| 6 | Sitemap entries with real dates | ✅ 6 new URLs + the month pattern, all dated `2026-09-16` or the bulletin month — never build time |
| 7 | Internal links **into** every new page | ✅ listed in §7 |
| 8 | IndexNow URLs | ✅ listed in §8 |

### Gate 1 — `npm run lint`

Cannot run non-interactively in this environment, which CLAUDE.md already documents.
Everything else in gate 1 passed, including a full production build.

### Gate 2 — the mobile check is partial, and that matters

**A real 360px render was not performed.** The repo ships no headless browser, and adding
puppeteer as a dependency to run one audit is not a trade worth making silently.

What was done instead: the traps a previous site-wide phone audit actually found are now
encoded as assertions over every component this build added, in
`src/components/gap-2026-09.mobile.test.ts` (9 tests) —

- every SVG uses a `viewBox` with `h-auto w-full`, and none sets a pixel `width`/`height`
  attribute on the `<svg>` (which would win over the class and force overflow);
- every form control uses the shared `fieldClass` or an explicit `text-base`, so iOS
  cannot focus-zoom (the global 16px floor in `globals.css` backs this up);
- every table is inside an `overflow-x-auto` wrapper and carries a `min-w-[...]`;
- every page using `ToolFirstLayout` supplies its own `<Container>`, because the layout
  renders `{children}` raw;
- nothing reads `window.innerWidth`, which lies about overflow under Chrome's
  shrink-to-fit.

A guard test also fails if a new visual component is added without being listed.

**Still outstanding, and should happen on the preview deploy:** an actual 360px pass and a
Facebook in-app browser check. The one thing genuinely worth exercising by hand is the
**.ics download** in the I-751 window calculator — in-app browsers handle
`Blob` downloads inconsistently, and that is exactly the kind of thing static analysis
cannot catch.

### Gate 4 — the one "duplicate title"

`/_not-found` and `/h1b-sponsors/civil-engineers/gu` both render "Page not found". Both
are 404s, neither is indexable, and the site's own `seo-audit` `duplicate-title` invariant
does not flag them. **Zero duplicate H1s.** The 6 pages with no H1 are the pre-existing
noindex `/nri-wealth-checkup/*` app states and that same 404 — none are from this build.

---

## 6a. A defect found during QA, and fixed

The schema scan surfaced something worth calling out: **six visa-bulletin cluster pages
were emitting no `FAQPage` schema at all**, despite having FAQ content on the page.

`extractFaq()` in `src/lib/seo.ts` looks for a `## ` FAQ section containing `### `
questions. Five pages had written theirs as `### ` with `#### ` questions, and
`/visa-bulletin/annual-limits` had seven questions under no FAQ heading at all. In every
case the parser silently returned an empty array, the page rendered no FAQPage node, and
nothing failed — the content was there, the structured data was not.

Fixed by normalising the heading levels to the convention every other cluster page uses.
Result: `/visa-bulletin/annual-limits` went 0 → 7 FAQ entities, and the other five 0 → 3.

`/visa-bulletin/monthly-update` was in scope for this build anyway (it became the month
hub). The other five were not, but they are the same defect in the same file, and stopping
at the one I happened to touch would have left a known silent bug shipping.

**Worth doing separately:** the same heading convention should be audited across the other
cluster files, and `extractFaq` arguably ought to accept `###`-level FAQ sections rather
than failing silently. Neither is in this build.

---

## 7. Inbound internal links added

| New/edited page | Linked in from |
|---|---|
| `/uscis/forms/i-864` | `/uscis/forms/i-130`, `/nvc-document-checklist-india`, `/green-card`, `/uscis/forms` hub, `/uscis` hub, `/nvc-processing-time`, `/green-card/marriage-interview-questions` |
| `/uscis/forms/i-751` | `/i90-vs-i751`, `/divorce-immigration-status`, `/green-card-renewal`, `/uscis/forms` hub, `/uscis` hub, `/tools/citizenship-test-practice`, `/green-card/marriage-interview-questions` |
| `/tools/citizenship-test-practice` | `/tools` hub (via `tools.ts`), homepage search index |
| `/visa-bulletin/september-2026` | `/visa-bulletin/monthly-update` (the new index) |
| `/nvc-processing-time` | `/uscis/case-approved-what-next` (new I-130 branch), `/uscis/forms/i-864` |
| `/uscis/request-for-evidence-rfe` | `/uscis/forms/i-864`, `/green-card/marriage-interview-questions` (plus its existing cluster links) |
| `/h1b-lottery-chances` | `/h1b-lottery-chance-calculator` (both directions) |
| `/green-card/marriage-interview-questions` | `/uscis/interview-scheduled`, `/i485-documents-checklist` |
| `/uscis/expedite-request` | `/i140-premium-processing`, `/uscis` hub |
| `/ead-renewal-gap` | `/education/opt-calculator`, `/uscis/expedite-request` |
| `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw` | `/green-card/eb2-vs-eb3-india`, `/i140-processing-time`, `/visa-bulletin/eb1-india` |

---

## 8. IndexNow — ping after the production deploy

Production URLs only. **Do not ping the preview.**

```
https://www.nritousa.com/uscis/forms/i-864
https://www.nritousa.com/uscis/forms/i-751
https://www.nritousa.com/tools/citizenship-test-practice
https://www.nritousa.com/visa-bulletin/september-2026
https://www.nritousa.com/visa-bulletin/monthly-update
https://www.nritousa.com/green-card/marriage-interview-questions
https://www.nritousa.com/uscis/expedite-request
https://www.nritousa.com/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw
https://www.nritousa.com/nvc-processing-time
https://www.nritousa.com/uscis/request-for-evidence-rfe
https://www.nritousa.com/h1b-lottery-chances
https://www.nritousa.com/h1b-lottery-chance-calculator
https://www.nritousa.com/divorce-immigration-status
https://www.nritousa.com/ead-renewal-gap
https://www.nritousa.com/uscis/forms
https://www.nritousa.com/uscis
```

`npm run indexnow`

---

## 9. What ships next month

`docs/seo/visa-bulletin-monthly-runbook.md` is the standing procedure. When the October
2026 bulletin publishes: ingest, add one line to `PUBLISHED_MONTHS`, update the four places
that reference the current bulletin, run the gates, push, ping IndexNow. The template is
the deliverable; September 2026 is just its first instance.
