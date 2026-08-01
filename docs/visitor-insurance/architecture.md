# Visitor Insurance Cost & Liability Cluster — Architecture

Status: Phase 0 (planning). Written before any cluster code exists. This document is the
single source of truth for how the cluster is structured; update it as phases land instead
of letting it drift.

## 0. Audit summary (why this shape)

- No existing visitor/travel-medical-insurance content exists anywhere in the repo (checked
  `src/app`, `src/data`, `src/lib`, `src/components`, `public`). Nothing to merge or redirect.
- Adjacent, non-competing content to cross-link: `/invitation-letter-for-parents-to-visit-usa`
  (B-2 invitation letters — no insurance content), the domestic **life insurance** cluster
  (`src/lib/lifeInsuranceCluster.ts`, closest tone/compliance analog), and the `insurance` topic
  in `src/lib/topics.ts` / the Footer "Insurance" link (currently points at `/topics/insurance`,
  domestic-only articles) — a future footer/topic update can point toward the hub, but that is
  out of scope for this build (would touch shared nav files unnecessarily).
- Cluster pattern: this repo already has a proven **hub + dynamic-child** shape (`/green-card`
  + `/green-card/[slug]`, `/uscis` + `/uscis/[slug]`, `/visa-bulletin` + `/visa-bulletin/[slug]`)
  and a separate **literal-folder tool** shape (`/tools/<slug>/page.tsx`, registered in
  `src/lib/tools.ts`). This cluster uses both, matching each route to the existing convention
  instead of inventing a third pattern.
- `tsc --noEmit` and `npm test` (902 tests) both pass clean on the pre-cluster baseline; no
  untracked `<name> 2.ts` duplicate-file issue affects `tsconfig`'s included paths.

## 1. Route map

### Content hub + children — literal per-page folders, NOT a dynamic `[slug]`

**Revised from the original sketch below** (kept for the record): a single dynamic
`[slug]/page.tsx` (the `greenCardCluster.ts` pattern) only works when every child page renders
from a markdown-ish `content` string via `ArticleBody`. Three of these six child pages must
embed a genuine interactive React calculator (the comparison engine, the pre-existing analyzer,
the policy-maximum calculator) — `ArticleBody`'s fence syntax has no way to embed a live
component. So each child page is instead its own literal route file, matching the repo's
dominant flat/literal-route convention (CLAUDE.md: "almost entirely top-level routes"):

```
src/app/visitor-insurance/page.tsx                                    → hub (Page 1)
src/app/visitor-insurance/parents-visiting-usa/page.tsx                → Page 4
src/app/visitor-insurance/fixed-benefit-vs-comprehensive/page.tsx      → Page 5
src/app/visitor-insurance/pre-existing-conditions-acute-onset/page.tsx → Page 10
src/app/visitor-insurance/how-much-coverage/page.tsx                   → Page 11
src/app/visitor-insurance/glossary/page.tsx                            → Page 12
src/app/visitor-insurance/methodology/page.tsx                        → Page 13
```

`src/lib/visitorInsuranceCluster.ts` stays as a shared (non-routing) config file: the child-page
metadata array feeding hub cards + sitemap + related-links, JSON-LD builders, shared FAQ/copy
fragments, and the cluster's published/updated date constants — the same role `i140Cluster.ts`
plays for its cluster, just without owning the routing itself. Child slugs (Phase 2–4):

| slug | Page | Phase |
|---|---|---|
| `parents-visiting-usa` | Page 4 — Insurance for parents visiting the USA | 2 |
| `fixed-benefit-vs-comprehensive` | Page 5 — Fixed-benefit vs comprehensive | 2 |
| `pre-existing-conditions-acute-onset` | Page 10 — Pre-existing conditions & acute onset | 3 |
| `how-much-coverage` | Page 11 — How much coverage | 4 |
| `glossary` | Page 12 — Glossary | 4 |
| `methodology` | Page 13 — Methodology | 4 |

### Tools (literal folders, mirrors `/tools/<slug>/page.tsx` + `src/lib/tools.ts` registration)

```
src/app/tools/visitor-insurance-cost-calculator/page.tsx           (Page 2, Phase 2)
src/app/tools/visitor-insurance-plan-comparison/page.tsx           (Page 3, Phase 2)
src/app/tools/visitor-insurance-deductible-coinsurance-calculator/page.tsx  (Page 6, Phase 3)
src/app/tools/visitor-insurance-hospital-bill-calculator/page.tsx  (Page 7, Phase 3)
src/app/tools/visitor-insurance-network-cost-calculator/page.tsx   (Page 8, Phase 3)
src/app/tools/visitor-insurance-policy-maximum-calculator/page.tsx (Page 9, Phase 3)
```

Each gets a `ToolMeta` entry in `src/lib/tools.ts` (new `ToolGroup` value:
`"Visitor Insurance"`, added to `toolGroups`) — this auto-populates `sitemap-tools.xml` with
no manual sitemap edit. Each is a server component route file (owns `generateMetadata`/static
`metadata`, breadcrumb, JSON-LD) that renders a client calculator component.

### Sitemap wiring (manual — content pages are not auto-included)

`src/lib/sitemap-data.ts`: add a `visitorInsuranceChildPages.map(...)` block to
`immigrationEntries` (nearest precedent: `invitation-letter-for-parents-to-visit-usa` already
lives there) for the hub + 6 child routes. Tool routes need no manual edit (see above). All
`lastModified` values default to `CONTENT_BASELINE` until a page carries its own real
`updated` date — never `new Date()` (enforced by `sitemap.lastmod.test.ts`).

## 2. Calculator architecture

### Layering (mirrors `src/lib/calc/*` — "financial logic lives in pure, tested functions, not
in components")

```
src/lib/calc/visitorInsurance/
  money.ts                 — integer-cents helpers (see §3)
  money.test.ts
  types.ts                 — shared TS types: PolicyTerms, Claimant, Claim, LedgerLine, ClaimResult, HouseholdResult
  engine.ts                 — pure calculation engine: runClaim(), runHousehold()
  engine.test.ts            — the 50 required test cases (§ Phase 5)
  comprehensive.ts          — comprehensive-plan cost-sharing sequencer (configurable order)
  comprehensive.test.ts
  fixedBenefit.ts           — scheduled-benefit plan math
  fixedBenefit.test.ts
  familyAggregation.ts      — per-traveler vs shared-provision aggregation
  familyAggregation.test.ts
  preExistingAnalyzer.ts    — rule-based policy-language analyzer (non-diagnostic, see §6)
  preExistingAnalyzer.test.ts
  scenarios.ts              — editable illustrative example scenarios (urgent care / ER / hospitalization)
```

No component ever computes money math inline — every calculator page imports from this
directory. This is the "one reusable insurance-cost engine" the spec requires; the six
specialized calculators (Phase 3) are thin UIs over subsets of the same `runClaim`/
`runHousehold` functions, never reimplementations.

### Components

```
src/components/tools/visitorInsurance/
  PolicyTermsForm.tsx        — grouped, progressively-disclosed input form (Quick / Detailed)
  ClaimScenarioForm.tsx      — one-or-more claim/service-line entry
  ResultLedger.tsx           — line-by-line calculation walkthrough (spec: "Calculation walkthrough")
  WhoPaysWhat.tsx            — premium / deductible / copay / coinsurance / balance-billing / non-covered / insurer-payment breakdown
  RemainingBenefitsPanel.tsx — deductible / policy max / sublimit / OOP-max remaining
  UncertaintyPanel.tsx       — missing-input list + confidence label (Higher/Moderate/Limited — never a %)
  NextQuestionsChecklist.tsx — generated from missing/ambiguous inputs
  PrintShareBar.tsx          — print, copy summary, reset, "compare another plan", local save
  FamilyBreakdown.tsx        — per-traveler cards + household aggregate, shared-provision toggle explainer

src/components/tools/VisitorInsuranceCostCalculator.tsx        (Page 2 — Quick + Detailed modes)
src/components/tools/VisitorInsurancePlanComparison.tsx        (Page 3 — up to 3 plans)
src/components/tools/VisitorInsuranceDeductibleCoinsuranceCalculator.tsx (Page 6)
src/components/tools/VisitorInsuranceHospitalBillCalculator.tsx (Page 7 — multi-provider episode)
src/components/tools/VisitorInsuranceNetworkCostCalculator.tsx  (Page 8)
src/components/tools/VisitorInsurancePolicyMaximumCalculator.tsx (Page 9)
src/components/tools/VisitorInsurancePreExistingAnalyzer.tsx    (Page 10 — embeds preExistingAnalyzer.ts)
```

Model UI conventions on `TermLifeNeedsCalculator.tsx` (multi-step `InputCard`s, a pure
`compute()` boundary, `MoneyField`, load-example/reset) but delegate `compute()` itself to
`src/lib/calc/visitorInsurance/engine.ts` rather than inlining formulas, since the spec
requires one shared engine across six+ calculators (`TermLifeNeedsCalculator` is a
single-consumer precedent for UI shape only, not for keeping math in the component).

Chrome: `ToolFirstLayout` (breadcrumb, badges, `ToolAnalytics` auto-mount, `BottomDisclaimer`).
Reminder per CLAUDE.md gotcha: `{children}` under `ToolFirstLayout` gets no `Container` —
every section wraps itself.

### Calculation state model

```ts
type PlanType = "comprehensive" | "fixed-benefit" | "hybrid";
type CostSharingStep = "copay" | "serviceDeductible" | "generalDeductible" | "coinsurance";
// order: CostSharingStep[] — user-selected, drives the comprehensive sequencer (spec §B.1)

interface PolicyTerms {
  planType: PlanType;
  costSharingOrder?: CostSharingStep[];       // comprehensive only; default unset → engine refuses to assume
  premiumCents: number;                        // per traveler or per policy, tagged by premiumScope
  premiumScope: "per-traveler" | "per-policy";
  policyMaximum?: { scope: "individual" | "shared"; amountCents: number };
  perIncidentMaximumCents?: number;
  deductible?: { amountCents: number; frequency: "policy" | "incident" | "service"; scope: "individual" | "shared-family" | "embedded-individual" };
  coinsurance?: { inNetworkMemberPct: number; outOfNetworkMemberPct: number; thresholdCents?: number; capCents?: number };
  copay?: { amountCents: number; appliesBeforeDeductible: boolean; services: ServiceCategory[] };
  erRule?: { copayCents?: number; deductibleCents?: number; waivedIfAdmitted: boolean };
  outOfPocketMaximum?: { amountCents: number; scope: "individual" | "shared-family"; countsToward: { premium: boolean; deductible: boolean; copay: boolean; coinsurance: boolean; outOfNetwork: boolean; nonCovered: boolean } }; // absent entirely unless user explicitly enters one — never assumed
  serviceSublimits?: Partial<Record<ServiceCategory, number>>;   // cents
  scheduledBenefits?: Partial<Record<ServiceCategory, number>>;  // fixed-benefit / hybrid only
  preExisting?: PreExistingTerms;               // see preExistingAnalyzer.ts
  evacuationMaximumCents?: number;
  repatriationMaximumCents?: number;
  networkType?: "PPO" | "none-stated" | "unknown";
  unknowns: (keyof PolicyTerms)[];               // explicit "not entered" tracking, feeds UncertaintyPanel — never defaulted silently
}

interface Claimant { id: string; age?: number; }

interface Claim {
  claimantId: string;
  date?: string;
  serviceCategory: ServiceCategory;
  billedChargeCents: number;
  allowedChargeCents?: number;         // absent → engine flags "allowed charge unknown", offers billed-as-base fallback explicitly labeled
  networkStatus: "in-network" | "out-of-network" | "unknown";
  coverageEligibility: "covered" | "excluded" | "unknown";
  notes?: string;
}

interface LedgerLine { step: string; label: string; amountCents: number; runningRemaining?: Record<string, number>; }

interface ClaimResult {
  claimantId: string;
  ledger: LedgerLine[];
  insurerPaymentCents: number;
  memberLiability: { deductibleCents: number; copayCents: number; coinsuranceCents: number; balanceBillingCents: number; nonCoveredCents: number; aboveSublimitCents: number; aboveScheduledBenefitCents: number; abovePolicyMaximumCents: number; totalCents: number };
  remaining: { deductibleCents?: number; policyMaximumCents?: number; sublimits?: Partial<Record<ServiceCategory, number>>; outOfPocketMaximumCents?: number };
  confidence: "higher" | "moderate" | "limited";
  uncappedExposureWarning: boolean;   // drives "Your total exposure may exceed this estimate."
}

interface HouseholdResult {
  perTraveler: ClaimResult[];
  aggregatePremiumCents: number;
  aggregateMedicalLiabilityCents: number;
  aggregateTotalCostCents: number;
  sharedProvisionsApplied: ("deductible" | "outOfPocketMaximum" | "policyMaximum")[]; // only non-empty if user explicitly set scope: "shared-family"
}
```

Claims for one claimant process **chronologically**, folding running-remaining state
(deductible/coinsurance-cap/sublimit/policy-max/OOP-max) forward per spec §D.17–18. Household
aggregation defaults to fully independent per-traveler runs (spec §E) — shared logic activates
only when `deductible.scope`/`outOfPocketMaximum.scope`/`policyMaximum.scope` is explicitly
`"shared-family"` or `"shared"`.

## 3. Money-safe arithmetic — deliberate deviation from repo convention

Every other calculator in `src/lib/calc/` uses plain floating-point `number` math with
display-time rounding (`Math.round(n*100)/100`, `formatUsd()`), because those are single-formula
calculators (one or two arithmetic steps). This engine chains 15+ sequential steps (copay →
deductible → coinsurance → sublimit → policy-max → running-remaining updates → multi-claim →
multi-traveler aggregation) per the spec's explicit calculation ledger (§D). Float drift
compounds across that many steps in a way it does not in `TermLifeNeedsCalculator` or
`goldDuty.ts`. Per the spec's explicit "do not use uncontrolled binary floating-point math for
currency" requirement, the engine represents **all money internally as integer cents** (`number`,
safe within `Number.MAX_SAFE_INTEGER` for any realistic claim size), converts at the two
boundaries only:
- **Input boundary**: `dollarsToCents(input: string | number): number` in `money.ts` — parses
  user-entered dollar strings/numbers to integer cents, rejects negative/NaN.
- **Output boundary**: `centsToUsd(cents: number): string` wraps the existing `formatUsd()` from
  `src/lib/format.ts` (`formatUsd(cents / 100)`) — display formatting stays centralized, no
  hand-rolled `$`.

No new dependency (no decimal.js/big.js) — integer cents is "another money-safe approach"
per the spec's own allowance, and is the minimal change consistent with the rest of the repo.

## 4. Family logic

Implemented in `familyAggregation.ts`. Default: `runHousehold()` calls `runClaim()`
independently per claimant and sums for display only — never mutates a shared "family pool"
unless `PolicyTerms.deductible.scope === "shared-family"` (or the equivalent
`outOfPocketMaximum.scope` / `policyMaximum.scope`), in which case a `SharedPool` running-total
is threaded across claimants in claim-chronological order across the whole household, not just
within one claimant. UI (`FamilyBreakdown.tsx`) always shows per-traveler cards first, aggregate
second, and a visible label distinguishing "household total" from "family maximum" — the latter
word is only used when the policy record explicitly says so (spec §E, "never label the
household sum a 'family maximum' unless the contract provides a family maximum").

## 5. Pre-existing / acute-onset analyzer

`preExistingAnalyzer.ts` is a **pure rule-based function**, not a lookup table of conditions.
Input: the questionnaire in spec §F (exclusion present?, acute-onset mentioned?, benefit max,
age, age cutoff, "sudden and unexpected" wording present?, treatment/medication history,
stability, emergency vs routine, evacuation-under-acute-onset?, term undefined/ambiguous?).
Output is restricted to a closed enum of five strings (spec §F) — the function's return type
literally cannot express "covered" / "not covered" / a diagnosis name, which is the structural
guard against scope creep here (a TS union type, not just a copy convention). Always renders the
user's own entered provision text beside the result (spec: "show the exact user-entered policy
provision beside the educational result").

## 6. Keyword ownership

See `keyword-map.md` for the full URL↔keyword table (one primary intent per URL, cannibalization
check). Source keyword list: SEMrush volumes supplied in the build brief.

## 7. Internal-linking map

- Hub (`/visitor-insurance`) → links to all 6 content children + all 6 tools, with unique
  descriptive copy per card (not a bare list).
- Every content child → links back to hub + to Methodology + Glossary + the most relevant
  calculator (contextual anchor text, never "click here").
- Every calculator → links to Methodology, Glossary, Parents guide, Fixed-vs-comprehensive
  guide, and Pre-existing-conditions guide when the scenario touches it.
- `RelatedVisitorInsuranceTools` component (new, `src/components/tools/visitorInsurance/`) —
  context-specific "related tools" strip, parameterized per page (not identical everywhere),
  same spirit as the existing `RelatedHubs`/`RecommendedToolsAd` components but scoped to this
  cluster's own pages so it doesn't dilute into unrelated tool recommendations.
- Existing-site cross-links (one-way, cluster → existing page, not the reverse — out of scope
  to edit shared nav/footer/topics files in this build): `/invitation-letter-for-parents-to-visit-usa`
  from the parents page; general "insurance" topic left alone.

## 8. Source hierarchy

See `source-policy.md` and `src/data/visitorInsuranceSources.ts` for the full tiered policy and
registry. Summary: Tier 1 government (HealthCare.gov, CMS, NAIC, state DOIs) > Tier 2 actual
policy certificates/SOBs/underwriter docs > Tier 3 independent research/medical-cost datasets.
Competitor sales copy is never a source for benefit claims.

## 9. Editorial requirements

- Author: `author` object from `src/lib/author.ts` ("Deepak Middha, CA, Series 65") via
  `ReviewedByline`/`AuthorBioBox` — never described as a physician, licensed insurance agent,
  underwriter, or immigration attorney (none of those claims exist in `author.ts`; do not add
  them).
- No `reviewer` field/byline until a real qualified insurance reviewer is named — do not
  fabricate one. Track this as an open item in Future expansion notes.
- Every calculator result must carry, near the number (not just in `BottomDisclaimer`): "This
  tool provides educational estimates based on the information you enter. The policy certificate
  controls, and the insurer or claims administrator makes the final benefit determination."
- `AffiliateDisclosureNotice` placed next to the first compensated recommendation if/when any
  insurer link is ever monetized — none is wired in Phase 2–4; this build ships with zero
  affiliate links unless later explicitly requested, since no monetization terms were supplied.
- No fake reviews/ratings/`AggregateRating`/`Review` schema, ever (site-wide rule, restated here
  because insurance content is a common place these get added by mistake).

## 10. Assumptions (explicit, revisit if wrong)

- No live insurer pricing/API integration in this build — Detailed Policy Mode only (spec's own
  Non-Negotiable Rule 1–2). "Quick Estimate" mode still requires the user to type in a quoted
  premium/maximum/deductible; it never fabricates a market premium.
- `/calculators/[slug]` (the dynamic finance-calculator hub) is **not** used for this cluster —
  these are `/tools/*` (matches the spec's own explicit routes) and get the `ToolFirstLayout`
  treatment, not `CalculatorHub`.
- New `ToolGroup` value `"Visitor Insurance"` added to `src/lib/tools.ts`'s union type — additive,
  does not touch existing groups.
- Analytics: extend `src/lib/analytics.ts` with typed wrappers for the spec's event list
  (`calculator_start`, `plan_added`, `scenario_selected`, `calculation_complete`,
  `comparison_complete`, etc.) following the existing `trackEvent(event, params)` pattern —
  broad labels only, never entered dollar amounts, medical categories, or full state (matches
  the file's existing privacy-by-construction comment).
- Local storage only for saved calculator state (spec Rule 16); no new privacy-architecture work
  needed since none of the existing tools use server-side storage either.
- Money math deviates from repo's float convention by design — see §3.

## 11. Future expansion notes (explicitly out of scope now)

- A named, credentialed insurance reviewer byline — add when a real person is available; do not
  block launch on it (spec allows "add later").
- Doorway pages per age/trip-length/condition — explicitly forbidden by the spec; the long-tail
  keyword list is covered via headings/FAQs on the 13 canonical pages only.
- Footer/`topics.ts` "Insurance" nav slot currently points at the domestic `/topics/insurance`
  page; linking it (or a new nav entry) to `/visitor-insurance` is a reasonable low-risk follow-up
  but touches shared global nav — flagged here, not done in this build without separate sign-off.
- Plan-ranking ("best plan") — explicitly forbidden without a published methodology and live
  verified plan data; Plan Comparison (Page 3) reports category winners (lowest premium, lowest
  modeled cost for entered scenarios, etc.), never a single "best overall" badge.
