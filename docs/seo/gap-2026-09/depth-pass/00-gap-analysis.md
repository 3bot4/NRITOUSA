# Depth pass — competitor gap re-analysis (September 2026)

The September 2026 gap build shipped in PR #50: 6 new pages, 6 upgrades, all gates green.
This pass re-fetches the same competitor URLs and asks a narrower question than the first
build did:

> Where does the competitor still cover something we do not, and where is our page
> carrying prose that would read better as a table, a diagram or a chart?

Fetched 2026-09-20. Every competitor page was re-read in full; none had changed since the
16 September read.

---

## The constant across all thirteen competitor URLs

Re-confirmed, and it is worth stating plainly because it frames every row below:

| Dimension | abogadolozano.com | nritousa.com after PR #50 |
|---|---|---|
| Interactive tools | **0** across all 13 pages | 11 |
| Charts | **0** | 6 |
| Diagrams | **0** | 12 |
| Official source URLs cited | **0** | every page, with a checked date |
| Tables | 2 pages have one (EB-1 comparison, NVC stage times) | 12 across 13 pages |
| India / NRI angle | none | every page |

So the gap is not *coverage of the basics* — we win that. The gap that remains is
**coverage of the long tail** (sub-topics they have and we do not) and **presentation
density** (our own prose that should be a table or a picture).

---

## Per-item: what they still have that we do not

### Item 9 — expedite (`/uscis/expedite-request`) — LARGEST GAP

Their page is not really an expedite page. It is a **delay-escalation** page, and it has
four rungs we have zero of:

| Their section | On our page today |
|---|---|
| Premium processing (I-907) | ✅ covered, better (split by category, not form) |
| USCIS expedite requests | ✅ covered, better (five criteria verbatim + checker) |
| **Case inquiry — outside normal processing time** | ❌ **absent** |
| **Congressional inquiry** | ❌ **absent** |
| **CIS Ombudsman (DHS Form 7001)** | ❌ **absent** |
| **Mandamus (federal court)** | ❌ **absent** |
| **"Strategy: which tool to use when"** | ❌ **absent** |

Somebody searching "uscis expedite" whose case simply does not fit a criterion — which is
most of them, and our own page says so — currently reaches the end of our page and has
nothing left to do. That is a real dead end, and it is the single biggest content hole
left in the build.

**Action:** add the full escalation ladder as sourced data, a comparison table, a ladder
diagram and a premium fee-vs-guarantee chart.

### Item 11 — EB-1/NIW (`/green-card/eb1a-vs-eb1b-vs-eb1c-vs-niw`)

They publish a seven-factor comparison chart. **We render our comparison matrix as
definition lists, not a table** — the audit found `<table>` count = 0 on this page, the
only gap page with none. For a page whose primary keyword is literally "eb1b vs eb1a",
the comparison grid is the page.

They also enumerate the EB-1A criteria and the EB-1B criteria. We describe them.

**Action:** real comparison table, the 10 EB-1A criteria and 6 EB-1B criteria as tables,
the three Dhanasar prongs as a table.

### Item 6 — RFE (`/uscis/request-for-evidence-rfe`)

They have **"Common reasons USCIS issues RFEs"**, broken out by case type (family
relationship, H-1B specialty occupation, affidavit-of-support financials, missing
documents, admissibility, medical). We explain the *rules* well and the *reasons* not at
all. They also have a response-package structure (cover letter, organisation, submitting
everything at once).

**Action:** RFE reasons by form type as a table, the response package as a table, and a
chart of the response periods — the 84-day rule against the 30-day forms is sourced data
that reads much faster as a bar.

### Item 5 — NVC (`/nvc-processing-time`)

They publish a **stage-duration table** (transfer 2–4 weeks, welcome letter 1–2 weeks,
fees 1–4 weeks, DQ review 1–3 months, scheduling 1–3 months, total 3–7 months) and a
**common delays** section (missing documents, translations, affidavit problems, expired
documents, address changes). Their numbers are uncited, but the *shape* is right: a
reader wants the whole pipeline in one grid.

We hold the same ranges in `nvcProcessingData` and render them as prose.

**Action:** stage table, fee table, a horizontal cumulative-duration chart, delays table.

### Item 2 — I-751 (`/uscis/forms/i-751`)

They have a seven-step filing process and a "common mistakes and delays" section, and an
FAQ we do not answer: **can I apply for citizenship while the I-751 is pending?** That is
a genuinely important interaction — a conditional resident married to a US citizen hits
N-400 eligibility at three years, often *before* the I-751 is decided.

**Action:** evidence table by strength, filing-cost table, a waiver-ground decision
diagram, an extension-timeline chart, and an N-400-while-pending section sourced to
Policy Manual Vol. 12 Pt. G Ch. 5.

### Item 1 — I-864 (`/uscis/forms/i-864`)

They have a **required-documents** section and two FAQs we do not answer: K-1 fiancé
cases (I-134 vs I-864), and what happens if the sponsor's income drops after filing.
Neither of them mentions the exemptions at all — and the exemption route changed on
10 December 2024, which is exactly the kind of thing our pages exist to catch.

**Action:** documents table, exemption section and table, a three-location threshold
chart, and an obligation-duration timeline diagram.

### Item 3 — citizenship test (`/tools/citizenship-test-practice`)

Their page has nothing we lack on the test itself. But neither page covers the **English
portion** and its exceptions — 50/20, 55/15, 65/20, and the N-648 medical exception —
and that is the thing an older Indian parent naturalising after a family green card
actually needs.

**Action:** 2025-vs-2008 comparison table, English portion and exceptions table, a
question-pool-by-category chart built from the 128-question JSON we already ship.

### Item 8 — marriage interview (`/green-card/marriage-interview-questions`)

They name the **Stokes interview** explicitly and have a "red flags officers look for"
section. We cover the separate-interview branch in the diagram but never use the term
people search for, and we have no red-flags treatment.

**Action:** question-area table, red-flags table, a Stokes section.

### Items 4, 7, 10 — smaller

- **Item 4 (visa bulletin month):** the month-over-month change table the command asked
  for is present. Add a "how to read a cut-off date" table.
- **Item 7 (H-1B weighted):** two charts and a diagram already. Add the entries-and-odds
  table so the numbers behind the chart are readable and copyable.
- **Item 10a (divorce):** stage table.
- **Item 10b (EAD):** eligible-category-code table and an old-rule-vs-new chart.

---

## Overlap re-check (hard rule 1)

No new URLs are created in this pass. Every change edits a page that already owns its
topic, so the overlap question is settled by the original
[`01-overlap-matrix.md`](../01-overlap-matrix.md). Two specific guards:

- The expedite escalation ladder **must not** turn `/uscis/expedite-request` into a
  premium-processing page — `/i140-premium-processing`, `/uscis/forms/i-907-premium-processing`
  and `/h1b/premium-processing` own that intent. Premium stays a single comparison row
  plus links out.
- The I-751 N-400 section **must not** target naturalisation keywords;
  `/tools/citizenship-test-practice` and the N-400 pages own those. It is one section
  answering one interaction, linking out.
