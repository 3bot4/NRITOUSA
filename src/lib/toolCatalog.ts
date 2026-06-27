/**
 * Unified, searchable tool catalog for the /tools explorer and the homepage
 * tool finder.
 *
 * This module is a *read-only projection* over the existing source catalogs —
 * it does NOT define new routes, change any slug, or feed the sitemap. It merely
 * merges the live tools, calculators, education calculators, and a few flagship
 * hub entry points into one flat list, and tags each with the cross-cutting
 * "chip" categories used by the search/filter UI.
 *
 * Adding a tool to its source catalog (tools.ts / calculators.ts / education.ts)
 * surfaces it here automatically; only the category mapping below may need a new
 * entry if the slug should appear under a specific filter chip.
 */

import { liveTools } from "@/lib/tools";
import { calculators } from "@/lib/calculators";
import { eduCalcs } from "@/lib/education";

/** Filter-chip categories shown on the tools explorer (order is the chip order). */
export type ChipCategory =
  | "Immigration"
  | "USCIS"
  | "FBAR/FATCA"
  | "Tax"
  | "Wealth"
  | "Property"
  | "Retirement"
  | "Travel"
  | "Education";

export const CHIP_CATEGORIES: ChipCategory[] = [
  "Immigration",
  "USCIS",
  "FBAR/FATCA",
  "Tax",
  "Wealth",
  "Property",
  "Retirement",
  "Travel",
  "Education",
];

/** What kind of thing this is — drives the badge + CTA label on the card. */
export type CatalogKind = "Tool" | "Calculator" | "Checklist" | "Hub";

export interface CatalogItem {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  /** Tailwind gradient for the icon tile. */
  accent: string;
  kind: CatalogKind;
  categories: ChipCategory[];
  /** Extra free-text search terms (slug, synonyms). */
  keywords: string;
}

/** Per-slug chip mapping for the live tools in tools.ts. */
const TOOL_CATEGORIES: Record<string, ChipCategory[]> = {
  "priority-date-checker": ["Immigration"],
  "green-card-stage-finder": ["Immigration"],
  "green-card-tracker": ["Immigration"],
  "h1b-transfer-risk-checklist": ["Immigration"],
  "h1b-lottery-timeline": ["Immigration"],
  "h1b-salaries": ["Immigration", "Wealth"],
  "h4-ead-navigator": ["Immigration"],
  "citizenship-checklist": ["Immigration"],
  "uscis-processing-delay-checker": ["USCIS", "Immigration"],
  "uscis-receipt-number-decoder": ["USCIS", "Immigration"],
  "uscis-life-decision-checklist": ["USCIS", "Immigration"],
  "uscis-form-finder": ["USCIS", "Immigration"],
  "uscis-notice-decoder": ["USCIS", "Immigration"],
  "uscis-case-status-meaning": ["USCIS", "Immigration"],
  "processing-times": ["Immigration", "Travel"],
  "visa-free-countries": ["Travel"],
  "flight-price-guide": ["Travel"],
  "nri-tax-filing-roadmap": ["Tax"],
  "fbar-fatca-checker": ["FBAR/FATCA", "Tax"],
  "form-10f-generator": ["Tax"],
  "nri-tds-refund-checklist": ["Tax"],
  "form-15ca-15cb-checklist": ["Tax"],
  "form-3520-india-gift-checker": ["Tax", "Property"],
  "oci-eligibility-checker": ["Travel", "Immigration"],
  "oci-cost-calculator": ["Travel", "Immigration"],
  "oci-timeline-calculator": ["Travel", "Immigration"],
};

/** Per-slug chip mapping for the calculators in calculators.ts. */
const CALC_CATEGORIES: Record<string, ChipCategory[]> = {
  "rnor-tax-residency": ["Tax"],
  "india-property-capital-gains": ["Property", "Tax"],
  "401k-return-to-india": ["Retirement", "Wealth"],
  "backdoor-roth-eligibility": ["Retirement", "Wealth"],
  "rent-vs-buy-visa": ["Property", "Wealth"],
  "rent-vs-buy-immigrant": ["Property", "Wealth"],
  "remittance-tcs-cost": ["Wealth", "Tax"],
  "fcnr-vs-hysa": ["Wealth", "Tax"],
  "dtaa-foreign-tax-credit": ["Tax"],
};

/** Tools whose slug isn't enough to read as a checklist get classified here. */
function toolKind(slug: string): CatalogKind {
  return /checklist/.test(slug) ? "Checklist" : "Tool";
}

/**
 * Flagship entry points that live outside the tool/calculator catalogs but are
 * the things people most often search for. These are real, crawlable routes
 * that already exist elsewhere on the site.
 */
const FLAGSHIP: CatalogItem[] = [
  {
    label: "NRI Wealth Checkup",
    title: "NRI Wealth Checkup",
    description:
      "Map your U.S. and India assets, income, accounts, and property to generate an educational FBAR, FATCA, PFIC, foreign tax credit, and CPA/CA checklist.",
    href: "/nri-wealth-checkup",
    icon: "🧮",
    accent: "from-brand-600 to-indigo-600",
    kind: "Tool",
    categories: ["Wealth", "Tax", "FBAR/FATCA"],
    keywords: "wealth checkup net worth assets organizer cross-border",
  },
  {
    label: "Immigration Tracker",
    title: "Immigration Tracker",
    description:
      "Track the visa bulletin, priority dates, USCIS processing, and the green card line for India in one personalized dashboard.",
    href: "/immigration-tracker",
    icon: "🛂",
    accent: "from-blue-700 to-indigo-600",
    kind: "Tool",
    categories: ["Immigration", "USCIS"],
    keywords: "immigration tracker dashboard visa bulletin green card line",
  },
];

function buildCatalog(): CatalogItem[] {
  const toolItems: CatalogItem[] = liveTools.map((t) => ({
    label: t.label,
    title: t.title,
    description: t.description,
    href: `/tools/${t.slug}`,
    icon: t.icon,
    accent: t.accent,
    kind: toolKind(t.slug),
    categories: TOOL_CATEGORIES[t.slug] ?? ["Immigration"],
    keywords: `${t.slug} ${t.group} ${(t.tags ?? []).join(" ")}`,
  }));

  const calcItems: CatalogItem[] = calculators.map((c) => ({
    label: c.label,
    title: c.title,
    description: c.description,
    href: `/calculators/${c.slug}`,
    icon: c.icon,
    accent: c.accent,
    kind: "Calculator",
    categories: CALC_CATEGORIES[c.slug] ?? ["Tax"],
    keywords: `${c.slug} ${c.category} ${(c.tags ?? []).join(" ")}`,
  }));

  const eduItems: CatalogItem[] = eduCalcs.map((c) => ({
    label: c.label,
    title: c.title,
    description: c.description,
    href: `/education/${c.slug}`,
    icon: c.icon,
    accent: c.accent,
    kind: "Calculator",
    categories: ["Education"],
    keywords: `${c.slug} school college student`,
  }));

  return [...FLAGSHIP, ...toolItems, ...calcItems, ...eduItems];
}

export const toolCatalog: CatalogItem[] = buildCatalog();

/** Lowercased haystack used for text search across a catalog item. */
export function searchHaystack(item: CatalogItem): string {
  return [
    item.label,
    item.title,
    item.description,
    item.kind,
    item.categories.join(" "),
    item.keywords,
  ]
    .join(" ")
    .toLowerCase();
}
