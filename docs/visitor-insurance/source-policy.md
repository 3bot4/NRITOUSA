# Visitor Insurance Cluster — Source Policy

## Tier hierarchy

**Tier 1 — Official government sources.** Use for general insurance-regulation concepts (what a
deductible/coinsurance/OOP-max *is* as a regulatory matter), ACA terminology definitions, and
any statement about law (No Surprises Act scope, state DOI rules).
- HealthCare.gov (glossary, ACA cost-sharing definitions)
- CMS.gov (regulatory definitions, No Surprises Act scope — note: visitor/travel-medical plans
  are typically *short-term, limited-duration* or fixed-indemnity products and are frequently
  **not** subject to ACA/No Surprises Act protections — this must be verified per-plan, never
  assumed either way; see Non-Negotiable Rule 4)
- NAIC (naic.org) — model regulations, consumer glossaries, state-insurance-department directory
- State departments of insurance — for state-specific rules when a plan/jurisdiction is named
- Official statutes/regulations (Federal Register, state insurance codes) when a legal claim is
  made

**Tier 2 — Official plan documents.** Use for **any plan-specific benefit claim** — this is the
only tier that may ever be cited for "this plan pays X" statements, and only when the actual
document has been read.
- Insurance certificates, policy wordings, schedules of benefit
- Summary-of-benefits (SOB) documents
- Underwriter documents (the insurance company/carrier)
- Network/claims-administrator documents (e.g., TPA certificate riders)
- Official insurer or administrator marketing/product pages **only** when cross-checked against
  the certificate — marketing copy alone is never sufficient (see "Never use" below)

**Tier 3 — Independent research / cost datasets.** Use only for **illustrative** national cost
context (e.g., "a hospital admission commonly runs into five figures" framing), always labeled
as an example/estimate, never presented as what a specific insurer will pay.
- Peer-reviewed or clearly methodologied healthcare-cost research
- Established independent datasets (e.g., published hospital-charge transparency data)

**Never a source for benefit claims:** competitor sales/marketing copy, affiliate-partner
one-pagers, forum posts, AI-generated summaries of a policy. If the only thing available is
sales copy, the cluster says "the policy certificate must be reviewed" rather than repeating the
sales claim as fact — this is the standard the pre-existing/acute-onset analyzer and every
calculator's "Uncertainty Panel" enforce structurally, not just editorially.

## Per-statement citation record

Every plan-specific statement used anywhere in the cluster (a glossary example, a methodology
worked example, a "typical policy" illustrative row) must have a matching entry with:

```
- Plan name:
- Underwriter / insurer:
- Administrator (if different from underwriter):
- Document title:
- Document effective date:
- State / jurisdiction (if relevant):
- Source URL:
- Retrieval date:
- Exact provision being interpreted (quote or precise paraphrase):
- Ambiguity notes (if the wording is unclear, say so — do not resolve ambiguity by guessing):
```

Records live in `src/data/visitorInsuranceSources.ts` (`VisitorInsuranceSource[]`, see that
file for the TS shape) so every citing component/page can pull `id` → renders through
`OfficialSourceNote`/`FastAnswerSnapshot` exactly like every other cluster's verified-numbers
system (`src/data/siteWideVerifiedNumbers.ts`).

## Illustrative vs. real numbers

The three "editable illustrative examples" required on the master calculator (small
urgent-care claim / ER claim / major hospitalization) and every worked example on the
specialized calculators are **user-editable placeholder scenarios**, not claims about what any
named plan pays. They must:
- Be clearly labeled "Example — edit these numbers" or equivalent, never "average" or "typical
  cost in the US" without a Tier 3 citation backing the specific figure
- Never be attributed to a specific named insurer/plan unless that insurer's Tier 2 document
  was actually retrieved and cited per the record format above
- Not double as SEO copy implying real market pricing ("visitor insurance costs $X") — pricing
  language stays in the "no live pricing" disclaimer (Non-Negotiable Rule 1)

## Currently-empty registry, by design

As of Phase 0, `visitorInsuranceSources.ts` is seeded with Tier 1 regulatory/glossary sources
only (HealthCare.gov, CMS, NAIC — general definitions, safe to cite immediately) plus **stub
entries with empty/TODO fields** for the Tier 2 plan-specific citations content pages will need
in Phase 2+. Every content page that makes a plan-specific claim must either (a) attribute it to
a real, retrieved Tier 2 document added to the registry first, or (b) phrase it as a
policy-agnostic educational statement ("many comprehensive plans structure X this way; your
certificate controls") with no source record required, per Non-Negotiable Rule 3 ("never invent
plan benefits ... exclusions, deductibles, acute-onset coverage, or reimbursement amounts").
Rule of thumb used throughout Phase 2–4 drafting: if a sentence can't cite a Tier 1/2/3 source,
it must be phrased generically enough that it doesn't need one.
