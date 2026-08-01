/**
 * Source registry for the Visitor Insurance Cost & Liability cluster.
 *
 * This is a CITATION registry, not the site-wide verified-NUMBER registry
 * (`siteWideVerifiedNumbers.ts`) — it exists because visitor-insurance content
 * routinely interprets specific policy provisions, which the site-wide
 * `VerifiedNumber` shape (label/value/lastVerified/sourceName/sourceUrl) has no
 * room to record with enough precision (document title, effective date,
 * jurisdiction, the exact provision being read, ambiguity notes).
 *
 * Every plan-specific claim anywhere in the cluster must resolve to a record
 * here. See docs/visitor-insurance/source-policy.md for the tier definitions
 * and the rule of thumb ("if a sentence can't cite a source, phrase it
 * generically enough that it doesn't need one").
 *
 * Tier 1 (government/regulatory) entries below are pre-seeded and safe to cite
 * immediately for general definitions. Tier 2 (plan-specific certificates) is
 * intentionally EMPTY at Phase 0 — no insurer/plan documents have been
 * retrieved yet. Do not add a Tier 2 record without an actual retrieved
 * document; do not cite a plan-specific benefit without one.
 */

export type SourceTier = "tier1-government" | "tier2-policy-document" | "tier3-independent-research";

export interface VisitorInsuranceSource {
  id: string;
  publisher: string;
  title: string;
  sourceType: SourceTier;
  url: string;
  /** ISO date the document/page took effect, when applicable (plan documents, regulations). */
  effectiveDate?: string;
  /** ISO date this source was actually retrieved/read. */
  retrievedDate: string;
  /** State or jurisdiction the source applies to, if not nationwide. */
  jurisdiction?: string;
  /** Who reviewed/added this citation — initials or role, never a fabricated credential. */
  reviewedBy?: string;
  /** Free text: what this source is used for, ambiguity, caveats. */
  notes?: string;
}

/* ────────────────────────── Tier 1 — government / regulatory ────────────── */
/* Safe to cite for general definitions (what a deductible/coinsurance/OOP-max
 * IS as a regulatory matter). Never sufficient, alone, to support a claim
 * about what a SPECIFIC visitor-insurance plan pays. */

export const visitorInsuranceSources: VisitorInsuranceSource[] = [
  {
    id: "healthcaregov-glossary-deductible",
    publisher: "HealthCare.gov",
    title: "Glossary — Deductible",
    sourceType: "tier1-government",
    url: "https://www.healthcare.gov/glossary/deductible/",
    retrievedDate: "2026-07-29",
    notes:
      "General ACA-market definition of 'deductible'. Visitor/travel-medical plans are typically short-term, limited-duration or fixed-indemnity products and are not ACA-regulated — this source explains the term, not any specific visitor plan's deductible rule.",
  },
  {
    id: "healthcaregov-glossary-coinsurance",
    publisher: "HealthCare.gov",
    title: "Glossary — Coinsurance",
    sourceType: "tier1-government",
    url: "https://www.healthcare.gov/glossary/co-insurance/",
    retrievedDate: "2026-07-29",
  },
  {
    id: "healthcaregov-glossary-out-of-pocket-maximum",
    publisher: "HealthCare.gov",
    title: "Glossary — Out-of-pocket maximum/limit",
    sourceType: "tier1-government",
    url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/",
    retrievedDate: "2026-07-29",
    notes:
      "ACA plans are required to cap in-network out-of-pocket costs; short-term/fixed-indemnity visitor plans generally are not subject to this requirement and may have no true out-of-pocket maximum at all. Never assume a visitor plan has one — see Non-Negotiable Rule 4.",
  },
  {
    id: "healthcaregov-glossary-allowed-amount",
    publisher: "HealthCare.gov",
    title: "Glossary — Allowed amount",
    sourceType: "tier1-government",
    url: "https://www.healthcare.gov/glossary/allowed-amount/",
    retrievedDate: "2026-07-29",
  },
  {
    id: "healthcaregov-glossary-balance-billing",
    publisher: "HealthCare.gov",
    title: "Glossary — Balance billing",
    sourceType: "tier1-government",
    url: "https://www.healthcare.gov/glossary/balance-billing/",
    retrievedDate: "2026-07-29",
  },
  {
    id: "cms-no-surprises-act-overview",
    publisher: "CMS.gov",
    title: "No Surprises Act — Overview",
    sourceType: "tier1-government",
    url: "https://www.cms.gov/nosurprises",
    retrievedDate: "2026-07-29",
    notes:
      "Scope/applicability source. Whether the No Surprises Act's balance-billing protections apply to a given visitor/travel-medical plan depends on how that specific plan is regulated (often it is a short-term or fixed-indemnity product outside ACA group/individual market rules) — must be checked per plan, never assumed either way per Non-Negotiable Rule 4.",
  },
  {
    id: "cms-short-term-limited-duration-plans",
    publisher: "CMS.gov",
    title: "Short-Term, Limited-Duration Insurance",
    sourceType: "tier1-government",
    url: "https://www.cms.gov/marketplace/private-health-insurance/short-term-limited-duration",
    retrievedDate: "2026-07-29",
    notes:
      "Background on the product category many visitor/travel-medical plans fall under and how it differs from ACA-compliant coverage (e.g., medical underwriting, pre-existing exclusions, no guaranteed renewability, no ACA essential-health-benefits mandate).",
  },
  {
    id: "naic-consumer-glossary",
    publisher: "National Association of Insurance Commissioners (NAIC)",
    title: "Consumer insurance glossary / consumer resources",
    sourceType: "tier1-government",
    url: "https://content.naic.org/consumer.htm",
    retrievedDate: "2026-07-29",
  },
  {
    id: "naic-state-doi-directory",
    publisher: "National Association of Insurance Commissioners (NAIC)",
    title: "State insurance department directory",
    sourceType: "tier1-government",
    url: "https://content.naic.org/state-insurance-departments",
    retrievedDate: "2026-07-29",
    notes:
      "Use to point readers to their state's Department of Insurance for state-specific rules or to file a complaint — never as a source for what a specific plan covers.",
  },
];

/* ────────────────────────── Tier 2 — plan-specific documents ────────────── */
/* INTENTIONALLY EMPTY at Phase 0. Add a record here — with a real retrieved
 * document — before citing any specific plan's benefit, exclusion, deductible
 * structure, or acute-onset wording anywhere in the cluster. */

export const visitorInsurancePlanDocumentSources: VisitorInsuranceSource[] = [];

export function getVisitorInsuranceSource(id: string): VisitorInsuranceSource | undefined {
  return (
    visitorInsuranceSources.find((s) => s.id === id) ??
    visitorInsurancePlanDocumentSources.find((s) => s.id === id)
  );
}
