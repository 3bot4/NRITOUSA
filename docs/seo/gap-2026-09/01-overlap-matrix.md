# Phase 0B — Overlap matrix

_Every item in the September 2026 gap command, checked against the live route
tree, the cluster arrays and the three immigration-facing sitemaps before any
page was created. Overlap % is a judgement of how much of the **target topic**
an existing URL already covers._

## Method

```
grep -ril "<form number|main keyword>" src --include=*.ts --include=*.tsx
ls src/app                      # top-level routes
grep -n 'slug:' src/lib/*Cluster.ts   # cluster children
```

Rule applied: **≥50% overlap → edit the existing page. Otherwise → new page.**

---

## Item 1 — I-864 / I-864P

| Existing URL | What it covers today | Overlap |
|---|---|---|
| `/uscis/forms/i-130` | Family petition; names the I-864 as a later step, no income rules | ~8% |
| `/nvc-document-checklist-india` | Lists the I-864 as one line item in the NVC document set | ~10% |
| `/invitation-letter-for-parents-to-visit-usa` | B-2 visitor letters. Different intent (nonimmigrant) | ~2% |
| `/usa-government-benefits-immigrants` | Mentions sponsor deeming for benefits eligibility | ~5% |
| `/green-card` hub | One sentence | ~2% |

**No page owns the I-864 or a single poverty-guideline figure.** 22 files *mention*
"I-864"; none defines the threshold table.
→ **DECISION: NEW PAGE** at `/uscis/forms/i-864` (static route beside `/uscis/forms/[slug]`).

## Item 2 — I-751

| Existing URL | What it covers today | Overlap |
|---|---|---|
| `/i90-vs-i751` | *Which form do I file* — comparison only. Ranks for the comparison intent. | ~25% |
| `/green-card-renewal` (+ `-fee`, `-processing-time`) | Form I-90 cluster. I-751 named only to send people to `/i90-vs-i751` | ~10% |
| `/replace-green-card` | Lost/stolen/damaged card | ~5% |
| `/divorce-immigration-status` | Divorce during the conditional period — the **waiver** branch, one section | ~15% |

The comparison page must keep its comparison intent (hard rule 13: no canonical
or redirect changes). A filing-window calculator, the 48-month extension rule and
the evidence set have no home.
→ **DECISION: NEW PAGE** at `/uscis/forms/i-751`; `/i90-vs-i751` links to it and
keeps its own framing.

## Item 3 — 2026 citizenship test

| Existing URL | What it covers today | Overlap |
|---|---|---|
| `/tools/citizenship-checklist` | N-400 **readiness**: earliest filing date, residency maths, risk flags. Ranks 56–64 for N-400 checklist terms. Names the civics test; contains **zero questions**. | ~12% |
| `/uscis/forms/n-400` | The form itself | ~8% |
| `src/lib/citizenship.ts` + `data/citizenship-checklist.json` | Decides *which* civics version applies from the filing date — reusable logic, not content | — |

`grep -ril "citizenship test"` → **0 files**. Nothing on the site holds the question bank.
→ **DECISION: NEW PAGE** at `/tools/citizenship-test-practice`. Tools section is
right: the primary intent behind "citizenship test questions 2026" is *practice*,
not a guide. `/tools/citizenship-checklist` stays a checklist and cross-links.

## Item 4 — monthly visa bulletin

| Existing URL | What it covers today | Overlap |
|---|---|---|
| `/visa-bulletin` | Hub: current cutoffs, category links | ~20% of a month page |
| `/visa-bulletin/monthly-update` | A standing "what moved this month" page — **the natural hub for month pages** | ~35% |
| `/visa-bulletin/october-2026-predictions` | Forecast, explicitly not a released bulletin | ~10% |
| `/visa-bulletin/eb1-india`, `/eb2-india`, `/eb3-india` | Per-category deep pages, already ranking (#55 "eb1a priority date india", #88 "current eb2 priority date india") | ~15% |
| `/tools/priority-date-checker` | The checker to embed. **Do not build a second one.** | — |

→ **DECISION: NEW URL PATTERN** `/visa-bulletin/[month]-[year]`, one data file per
month, `/visa-bulletin/monthly-update` converted into the index. Keeps its URL.

⚠️ **The October 2026 bulletin is not published yet** (checked 2026-09-16 — the
State Department page lists September 2026 as the latest; October is the first
FY-2027 bulletin and lands after the fiscal year turns). Per the command's hard
rule, the first month page published is **September 2026**, the bulletin that is
actually live. October follows the runbook the day it is released.

## Item 5 — NVC processing time (EDIT)

| Existing URL | Keep as | Overlap with the target |
|---|---|---|
| `/nvc-processing-time` | **The page being upgraded** | 45% today |
| `/nvc-public-inquiry` | 🔒 **PROTECTED** — ranks #15–20 for "nvc inquiry" (5,400) and "nvc public inquiry form" (1,900). No inquiry-led titles or H2s move onto the processing page. | — |
| `/nvc-case-status` | CEAC status reading | ~12% |
| `/nvc-document-checklist-india` | The document set | ~10% |
| `/what-is-nvc-case-number` | Case-number anatomy | ~5% |
| `/uscis/case-approved-what-next` | **Generic** — covers any approved USCIS case, not I-130 specifically | ~20% |

→ **DECISION: EDIT `/nvc-processing-time`.** The "I-130 approved, what next"
cluster lands **here**, because the searcher's next question is the NVC timeline;
`/uscis/case-approved-what-next` stays generic and links in. **No third page.**
"Consular processing vs adjustment of status" becomes a **section here**, not a
new page — a standalone page would duplicate `/green-card/i-485` and
`/i485-timeline` and could not clear the no-thin-page bar on its own.

## Item 6 — RFE (EDIT + cannibalisation guard)

| URL | Focus after this run |
|---|---|
| `/uscis/request-for-evidence-rfe` | **Primary general page.** What an RFE is, the deadline rule, response process, what the status messages mean. Gets the calculator. |
| `/uscis/rfe-notice` | The **notice document**: decode the fields on the paper in your hand + response checklist. |
| `/h1b/rfe` | **H-1B-specific** RFE types (specialty occupation, employer-employee, LCA). |

All three already exist and already cross-link. Confirmed distinct in Phase 0.
→ **DECISION: EDIT the primary page.** Titles/H1s checked for competition.

## Item 7 — H-1B weighted selection

`/h1b-lottery-chances` **already explains weighted selection properly** — it names
the FY 2027 wage-weighted draw, the Level I = 1 → Level IV = 4 entry weights, and
routes to `/h1b-lottery-chance-calculator`, which already models wage level.

The command's own decision rule fires: *"If `/h1b-lottery-chances` already
explains weighted selection properly, upgrade that page and the calculator."*
→ **DECISION: EDIT `/h1b-lottery-chances` + the calculator. NO new page.**
Creating `/h1b/weighted-selection` would be a textbook duplicate.
🔒 `/h1b-lottery-results` keeps "h1b lottery" / "h1b visa lottery results".

## Item 8 — marriage green card interview questions

| Existing URL | What it covers | Overlap |
|---|---|---|
| `/uscis/interview-scheduled` | The *status message* and what the appointment notice means | ~15% |
| `/i485-documents-checklist` | Documents for the I-485 filing | ~10% |
| `/green-card/i-485` | Adjustment of status generally | ~8% |

`grep -ril "interview questions"` → 1 file, and it is H-1B **visa stamping**.
→ **DECISION: NEW PAGE** at `/green-card/marriage-interview-questions`.

## Item 9 — USCIS expedite

| Existing URL | What it covers | Overlap |
|---|---|---|
| `/i140-premium-processing`, `/h1b/premium-processing`, `/uscis/forms/i-907-premium-processing` | **Premium processing** — the paid, form-specific service | ~20% |
| `/tools/uscis-processing-delay-checker` | Is my case outside normal processing time? | ~15% |
| `/nvc-public-inquiry` | DOS-side inquiry, not USCIS | ~5% |

Nothing covers the **free, criteria-based expedite request**, which is a different
mechanism with different eligibility.
→ **DECISION: NEW PAGE** at `/uscis/expedite-request`.

## Item 10 — quick upgrades

- **10a `/divorce-immigration-status`** — exists, 1,182-line route + 916-line data
  file. → **EDIT**: answer-first block, divorce-by-stage diagram, status checker.
- **10b `/ead-renewal-gap`** — exists and already states the 30 Oct 2025 removal
  correctly. → **EDIT**: add the eligibility/end-date calculator and the
  old-rule-vs-current-rule diagram. `/education/opt-calculator` keeps its focus.

## Item 11 — EB-1A vs EB-1B vs EB-1C vs NIW

| Existing URL | What it covers | Overlap |
|---|---|---|
| `/green-card/eb2-vs-eb3-india` | EB-2 vs EB-3 only | ~10% |
| `/i140-processing-time` | I-140 times; names EB-1A/NIW in a dropdown | ~12% |
| `/visa-bulletin/eb1-india` | EB-1 India cutoffs | ~10% |
| `/green-card/green-card-backlog-india` | Backlog maths | ~8% |

`grep -ril "eb1a"` → 1 file (a calculator option list). No comparison page exists.
→ **DECISION: NEW PAGE** at `/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw`.

**L-1A vs L-1B** — `grep -ril "L-1A"` → 4 files, all passing mentions in tool
option lists. There is no L-1 content to extend, and an L-1A/L-1B page has no
India-specific angle, no data to chart and no natural tool.
→ **DECISION: SKIPPED.** It cannot clear the no-thin-page bar in this run.
Recorded in the report.
