/**
 * India Tax & Compliance cluster.
 *
 * This is the single source of truth for the /india-tax-compliance hub and the
 * related-tools strip shown at the foot of every calculator and finance tool.
 *
 * Calculators and tools are pulled by the shared "tax-compliance" tag (set in
 * lib/calculators.ts and lib/tools.ts), so adding a new tagged item surfaces it
 * on the hub AND in every sibling's interlink strip with no extra wiring.
 *
 * The "Tax Topics" article slugs are validated at render time via getArticle()
 * (which returns undefined for unknown slugs), so a typo can never produce a
 * 404 link — the item is simply skipped.
 */

import { calculators } from "@/lib/calculators";
import { liveTools } from "@/lib/tools";

export const TAX_COMPLIANCE_TAG = "tax-compliance";
export const TAX_COMPLIANCE_PATH = "/india-tax-compliance";
export const TAX_COMPLIANCE_TITLE = "India Tax & Compliance";

/** A calculator or tool, normalized into a single shape for cards/links. */
export interface ClusterTool {
  kind: "calculator" | "tool";
  slug: string;
  href: string;
  label: string;
  title: string;
  description: string;
  icon: string;
  /** Tailwind gradient classes for the icon tile. */
  accent: string;
}

export function taxComplianceCalculators() {
  return calculators.filter((c) => c.tags?.includes(TAX_COMPLIANCE_TAG));
}

export function taxComplianceTools() {
  return liveTools.filter((t) => t.tags?.includes(TAX_COMPLIANCE_TAG));
}

/** Calculators first, then tools — the full tagged cluster as ClusterTool[]. */
export function taxComplianceClusterTools(): ClusterTool[] {
  return [
    ...taxComplianceCalculators().map(
      (c): ClusterTool => ({
        kind: "calculator",
        slug: c.slug,
        href: `/calculators/${c.slug}`,
        label: c.label,
        title: c.title,
        description: c.description,
        icon: c.icon,
        accent: c.accent,
      })
    ),
    ...taxComplianceTools().map(
      (t): ClusterTool => ({
        kind: "tool",
        slug: t.slug,
        href: `/tools/${t.slug}`,
        label: t.label,
        title: t.title,
        description: t.description,
        icon: t.icon,
        accent: t.accent,
      })
    ),
  ];
}

/**
 * The cluster members for the related-tools strip on a given page — every
 * tagged calculator/tool EXCEPT the current page. The strip component pads this
 * with the hub link so the foot of the page always shows up to five anchors.
 */
export function relatedClusterTools(currentHref: string): ClusterTool[] {
  return taxComplianceClusterTools().filter((t) => t.href !== currentHref);
}

/**
 * The hub's "Tax Topics" section — every cross-border tax article, grouped.
 * Slugs are resolved through getArticle() at render time, so any slug that
 * isn't a real article is silently dropped (never a dead link).
 */
export interface TaxTopicGroup {
  eyebrow: string;
  title: string;
  description: string;
  slugs: string[];
}

export const TAX_TOPIC_GROUPS: TaxTopicGroup[] = [
  {
    eyebrow: "Residency & filing",
    title: "Tax residency and your first US return",
    description:
      "When you become a US tax resident, when India can still tax you, and how to file the first year right.",
    slugs: [
      "substantial-presence-test-explained",
      "indian-income-us-tax-return",
      "h1b-first-tax-return-guide",
      "best-worst-tax-states-h1b",
    ],
  },
  {
    eyebrow: "Double taxation",
    title: "DTAA & avoiding double taxation",
    description:
      "How the India–US tax treaty, foreign tax credits, and the DTAA keep the same income from being taxed twice.",
    slugs: [
      "double-taxation-dtaa-india-usa",
      "indian-ppf-taxable-usa",
      "selling-indian-shares-us-resident-tax",
    ],
  },
  {
    eyebrow: "Property & repatriation",
    title: "Selling property, repatriation & inheritance",
    description:
      "Capital gains, TDS, the USD 1M repatriation limit, FIRPTA on US homes, and inheriting Indian assets.",
    slugs: [
      "repatriate-india-property-sale-usa",
      "selling-us-home-nri-firpta",
      "inheriting-indian-assets-us-tax",
    ],
  },
  {
    eyebrow: "Foreign-account reporting",
    title: "FBAR, FATCA & the PFIC trap",
    description:
      "Reporting Indian bank accounts, FDs, and mutual funds — and how to catch up cleanly if you missed a year.",
    slugs: [
      "fbar-fatca-nri-guide",
      "catch-up-missed-fbar-streamlined",
      "pfic-indian-mutual-funds-trap",
      "nre-nro-accounts-explained",
    ],
  },
  {
    eyebrow: "Moving money & retirement",
    title: "Transfers, gifts & retirement accounts",
    description:
      "TCS on remittances, gift-tax rules across borders, and what happens to your 401(k)/IRA when you move back.",
    // The "gifting money from India / Form 3520" intent now lives in the
    // Foreign Gifts, Inheritance & Form 3520 cluster (surfaced separately on
    // this hub via GIFT_CLUSTER_SECTION), so the old /articles slug is removed
    // here rather than pointing through a 301.
    slugs: [
      "tcs-india-remittance-tax",
      "what-happens-to-401k-leaving-usa",
      "transfer-401k-to-india-nps-ppf",
    ],
  },
];

/** Flat list of every Tax Topics slug (for schema / counts). */
export const TAX_TOPIC_SLUGS = TAX_TOPIC_GROUPS.flatMap((g) => g.slugs);
