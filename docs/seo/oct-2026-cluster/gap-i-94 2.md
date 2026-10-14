# Phase 2 gap analysis — `/uscis/i-94`

Main keywords: **"i-94 travel history"** 5,400/mo KD26 CPC $5.07 · **"i 94 history"** · **"what does d/s mean"**.
Fetched 2026-10-13.

## Competitor outlines, side by side

| cbp.gov "Arrival/Departure Forms: I-94" (~998 w) | i94.cbp.dhs.gov help/FAQ | rjimmigrationlaw.com "'D/S' Notation on Your I-94 Form" (~1,458 w) | visaserve.com "How to Check Your I-94 and Why It Matters" |
| --- | --- | --- | --- |
| Electronic vs paper I-94 | How to get the most recent I-94 | What Does "D/S" Stand For | **403 to every request — not readable.** Search snippet indicates a step-by-step retrieval guide plus "why it matters" |
| Land border: electronic, no paper stub | View Travel History: past ten years only | Associated Nonimmigrant Statuses | |
| Get Most Recent I-94 (site + CBP Link app) | Most land arrivals/departures may not appear | The Importance of Maintaining Status | |
| Requesting a paper form at inspection | Not an official record for legal purposes | Protecting Your Immigration Documents | |
| Surrendering a paper I-94 on departure | Citizens and LPRs cannot use the site — FOIA instead | Citations | |
| Land departures may not be recorded accurately | Travel on an expired passport is still shown | | |
| Over 70 Deferred Inspection Sites | | | |

## Subtopic coverage matrix

| Subtopic | CBP | i94 FAQ | RJ | visaserve | We cover | Our angle |
| --- | --- | --- | --- | --- | --- | --- |
| What an I-94 is | ✓ | ✓ | ✓ | ✓ | ✓ | Framed as the only document that states your authorised period of stay — and, under 8 CFR 264.1, as your registration record |
| Electronic vs paper | ✓ | ✓ | — | ✓ | ✓ | Plus the land-border change and why a paper stub still turns up |
| Get Most Recent I-94, step by step | ✓ | ✓ | — | ✓ | ✓ | Written out as numbered steps with the exact fields each screen asks for, plus the CBP Link app route |
| Travel history, step by step | — | ✓ | — | ✓ | ✓ | Same, as its own sequence — the two lookups are different screens and readers conflate them |
| **How far back: 10 years** | — | ✓ | — | partial | ✓ | Stated with the number. Most third-party guides still say five years, which was correct before CBP extended the module |
| **What is missing from the history** | ✓ (partial) | ✓ | — | — | ✓ | Most land arrivals and departures may be absent; it is expressly not an official record for legal purposes; a land departure on an electronic I-94 may not be recorded at all |
| **Citizens and LPRs can't use it** | — | ✓ | — | — | ✓ | **The biggest practical gap in the whole organic set.** A green-card holder who needs a trip log for N-400 cannot get it here and must file a FOIA request |
| D/S meaning | — | — | ✓ | — | ✓ | Defined, with the classes that get it (F, J, M and their dependents) and the classes that get a date (H, L, O, E, TN) |
| Why D/S is riskier, not safer | — | — | partial | — | ✓ | No date means no mechanical warning: unlawful presence accrues only on a formal finding, which cuts both ways |
| I-94 date vs visa expiry vs I-797 validity | — | — | partial | ✓ | ✓ | Three documents, three jobs, in one table — the visa gets you to the door, the I-94 governs the stay, the I-797 governs the petition |
| Passport-truncated admit-until date | — | — | — | — | summary + link | Owned by `/h1b-denied-entry-airport` (`portOfEntryData.i94Notes`) |
| Fixing an error / deferred inspection | ✓ (mentions 70+ sites) | ✓ | — | ✓ | summary + link | Owned by `/h1b-denied-entry-airport`, which distinguishes deferral at entry from a post-admission correction visit |
| **Form I-102** | — | — | — | — | ✓ | **Nobody covers it.** $560, plus a separate $24 Pub. L. 119-21 I-94 fee, not charged for a lost I-94W or I-95 (G-1055 ed. 10/07/26) |
| 240-day rule | — | — | — | — | summary + link | Owned by `/h1b/extension` |
| 60-day grace period | — | — | ✓ | — | summary + link | Owned by `/h1b/layoff-60-day-grace-period` |
| I-94 on an I-797A approval | — | — | — | ✓ | summary + link | Owned by `/uscis/i-797-notice` and `/uscis/approval-notice` |
| Canada/Mexico trips, automatic revalidation | — | — | — | — | summary + link | Owned by `/automatic-visa-revalidation` |
| Using the history for the Substantial Presence Test | — | — | — | — | ✓ (tool) + link | Nobody connects the two. The explainer stays with `/articles/substantial-presence-test-explained` |
| Using the history for N-400 | — | — | — | — | ✓ (tool) + link | Nobody connects the two. The rule stays with `/green-card/travel-rules` and `/tools/citizenship-checklist` |

Every subtopic covered by ≥2 competitors appears on our page, except those
assigned to owner pages.

## Subtopics nobody covers well — our unique sections

1. **The record is incomplete, and here is exactly how.** Three stacked limits — 10 years, most land crossings missing, not an official record — mean the history is a *starting* document for a day count, not the answer. Every guide that tells you to download it omits that you then have to reconcile it against your passport stamps and boarding passes.
2. **Green-card holders and citizens are locked out.** The reader most likely to need a decade-long trip log, an LPR preparing an N-400, is the one reader the I-94 site will not serve. We say so and give the FOIA route.
3. **Interactive: I-94 travel history day counter.** Paste or type arrival/departure pairs; it returns days present per calendar year, a Substantial Presence Test estimate on the 1 + 1/3 + 1/6 formula, and a flag on any single trip of 180+ days (6–12 months: rebuttable presumption) or 365+ days (breaks continuous residence) for N-400. Browser-only, nothing stored. **No competitor has any tool on this topic.**
4. **The three-document table** (visa / I-94 / I-797) with the "which one expiring hurts you, and when" column — including the case an NRI hits constantly: a valid I-94 with an expired visa, where you can stay but not re-enter.
5. **Form I-102 as a real option**, with its two-part fee.
6. **India-specific:** a land departure to Canada or Mexico that goes unrecorded leaves an apparent overstay on the record for someone whose real trips are to India; and the travel history is the cleanest evidence an Indian consulate or a US employer will accept for a recapture claim on the H-1B six-year cap (links to `/h1b-perm-max-out-calculator`).

## Sources used

| Source | Checked |
| --- | --- |
| cbp.gov, Arrival/Departure Forms: I-94 | 2026-10-13 |
| i94.cbp.dhs.gov FAQ (travel-history depth, exclusions, LPR/citizen exclusion) | 2026-10-13 |
| DHS/CBP/PIA-016(a), I-94 Website Application (5 → 10 year history) | 2026-10-13 |
| Form G-1055 Fee Schedule, edition 10/07/26 (I-102 $560 + $24) | 2026-10-13 |
| 8 CFR 264.1(a)–(b) (the I-94 as registration and evidence of registration), eCFR, issue date 2026-10-08 | 2026-10-13 |
| 8 CFR 316.5(c)(1) (6–12 month and 1-year absence rules), eCFR | 2026-10-13 |
| IRS Publication 519 / 26 U.S.C. 7701(b)(3) substantial presence formula, as already carried in `src/lib/calc/f1Tax.ts` | 2026-10-13 |
| rjimmigrationlaw.com, "D/S" Notation on Your I-94 Form | 2026-10-13 |
| visaserve.com I-94 guide — **403, not readable** | 2026-10-13 |
