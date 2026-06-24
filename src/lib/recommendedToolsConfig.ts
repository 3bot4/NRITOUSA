/**
 * Config + routing logic for the contextual "Recommended Tool" cards that
 * appear near the bottom of relevant pages (above the footer).
 *
 * These point to NRItoUSA's sibling financial-tool sites (TaxSaveIQ, StockLeo,
 * OptionLeo). They are clearly-labelled, house-style partner cards — not banner
 * ads. Everything about which card shows on which page lives here so the whole
 * network can be re-tuned from one file.
 *
 * Outbound links: open in a new tab, carry UTM tags, and use
 * rel="noopener noreferrer sponsored" (see RecommendedToolsAd.tsx).
 */

export type ToolKey = "taxsaveiq" | "stockleo" | "optionleo";

/**
 * High-level page category. Templates pass the one they know from their own
 * taxonomy (article topic, tool group, homepage). "auto" / undefined falls back
 * to keyword detection on the supplied text.
 */
export type PageCategory =
  | "tax"
  | "investing"
  | "options"
  | "immigration"
  | "education"
  | "home"
  | "generic";

export interface RecommendedTool {
  key: ToolKey;
  name: string;
  /** Bare site URL (no UTM) — UTM is appended by buildToolUrl. */
  url: string;
  /** Small uppercase label shown at the top of the card. */
  label: string;
  title: string;
  description: string;
  cta: string;
  icon: string;
  utmCampaign: string;
  /** Tailwind theme tokens for the card shell + CTA. */
  theme: {
    /** Soft gradient + border for the card body. */
    card: string;
    /** Icon tile gradient. */
    iconTile: string;
    /** Small label colour. */
    label: string;
    /** CTA button. */
    button: string;
  };
}

export const RECOMMENDED_TOOLS: Record<ToolKey, RecommendedTool> = {
  taxsaveiq: {
    key: "taxsaveiq",
    name: "TaxSaveIQ",
    url: "https://www.taxsaveiq.com",
    label: "Recommended Tax Tool",
    title: "Estimate Your U.S. Tax Before Filing",
    description:
      "Run quick tax scenarios for W-2, 1099, credits, deductions, and planning before tax season — free calculators, no signup.",
    cta: "Try TaxSaveIQ",
    icon: "🧾",
    utmCampaign: "nritousa_tax_pages",
    theme: {
      card: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white",
      iconTile: "from-amber-500 to-orange-600",
      label: "text-orange-700",
      button:
        "bg-amber-600 hover:bg-amber-700 focus-visible:outline-amber-600",
    },
  },
  stockleo: {
    key: "stockleo",
    name: "StockLeo",
    url: "https://www.stockleo.com",
    label: "Recommended Investing Tool",
    title: "Check Your Investment Math",
    description:
      "Use free calculators for ETFs, dividends, DCA, capital gains, and portfolio decisions before you commit.",
    cta: "Try StockLeo",
    icon: "📊",
    utmCampaign: "nritousa_investment_pages",
    theme: {
      card: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white",
      iconTile: "from-emerald-500 to-teal-600",
      label: "text-emerald-700",
      button:
        "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600",
    },
  },
  optionleo: {
    key: "optionleo",
    name: "OptionLeo",
    url: "https://www.optionleo.com",
    label: "Options Education",
    title: "Learn Option Income Strategies",
    description:
      "Understand covered calls, cash-secured puts, and option-income basics before trading. Educational only — options involve risk.",
    cta: "Explore OptionLeo",
    icon: "📈",
    utmCampaign: "nritousa_options_pages",
    theme: {
      card: "border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-white",
      iconTile: "from-indigo-500 to-violet-600",
      label: "text-indigo-700",
      button:
        "bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600",
    },
  },
};

/**
 * Build the outbound URL with UTM tracking. `sourcePage` is a coarse,
 * non-identifying slug/path (e.g. "fbar-fatca-checker") used as utm_content.
 */
export function buildToolUrl(key: ToolKey, sourcePage = "nritousa"): string {
  const tool = RECOMMENDED_TOOLS[key];
  const slug = sourcePage.replace(/^\/+/, "").replace(/[^a-z0-9/_-]/gi, "") || "site";
  const params = new URLSearchParams({
    utm_source: "nritousa",
    utm_medium: "house_ad",
    utm_campaign: tool.utmCampaign,
    utm_content: slug,
  });
  return `${tool.url}/?${params.toString()}`;
}

// --- Keyword routing -------------------------------------------------------

const KW = {
  tax: [
    "tax",
    "fbar",
    "fatca",
    "nre",
    "nro",
    "itr",
    "income-tax",
    "8938",
    "schedule-b",
    "foreign-account",
    "dtaa",
    "tds",
    "15ca",
    "15cb",
    "10f",
    "3520",
    "capital-gain",
    "rnor",
    "residency",
    "pfic",
    "repatriation",
    "double-tax",
    "property-sale",
    "gift",
    "inheritance-tax",
  ],
  invest: [
    "401k",
    "ira",
    "roth",
    "brokerage",
    "etf",
    "dividend",
    "mutual-fund",
    "portfolio",
    "investing",
    "investment",
    "fcnr",
    "hysa",
    "wealth",
    "rent-vs-buy",
    "real-estate",
    "property",
    "estate",
    "inheritance",
    "financial-planning",
    "remittance",
    "retire",
    "retirement",
    "emergency-fund",
    "stock",
  ],
  options: [
    "option",
    "covered-call",
    "cash-secured",
    "premium-yield",
    "wheel-strategy",
    "high-iv",
    "income-strategy",
    "cash-flow",
  ],
  immigration: [
    "h1b",
    "h-1b",
    "h4",
    "uscis",
    "visa",
    "green-card",
    "greencard",
    "i-140",
    "i-485",
    "priority-date",
    "citizenship",
    "ead",
    "perm",
    "lottery",
    "case-status",
    "rfe",
    "layoff",
    "grace-period",
  ],
  education: ["student", "college", "sat", "education", "school", "child", "parent", "family", "tuition"],
};

const hit = (hay: string, words: string[]) => words.some((w) => hay.includes(w));

/** Keyword-detect a category from free text (slug + title + excerpt). */
export function detectCategory(text: string): PageCategory {
  const h = text.toLowerCase();
  // Finance signals win over immigration so finance tools that merely mention
  // "visa" (e.g. rent-vs-buy-visa) still route correctly.
  if (hit(h, KW.tax)) return "tax";
  if (hit(h, KW.invest)) return "investing";
  if (hit(h, KW.options)) return "options";
  if (hit(h, KW.immigration)) return "immigration";
  if (hit(h, KW.education)) return "education";
  return "generic";
}

/** Map a tool/calculator slug (+title) to its page category. */
export function categoryForToolSlug(slug: string, title = ""): PageCategory {
  return detectCategory(`${slug} ${title}`);
}

export interface ResolveArgs {
  /** Explicit category from a template's own taxonomy; omit/"" to auto-detect. */
  category?: PageCategory;
  /** Free text (slug + title + excerpt) used to detect cross-cutting context. */
  text?: string;
  /** Max cards to show (default 2). */
  max?: number;
}

/**
 * Resolve the ordered list of tools to show for a page. Returns [] when nothing
 * is relevant (generic/immigration-only pages with no finance context).
 */
export function resolveRecommendedTools({
  category,
  text = "",
  max = 2,
}: ResolveArgs): ToolKey[] {
  const hay = text.toLowerCase();
  const cat: PageCategory = category ?? detectCategory(hay);

  const taxCtx = hit(hay, KW.tax);
  const investCtx = hit(hay, KW.invest);
  const optionsCtx = hit(hay, KW.options);
  const financeCtx = taxCtx || investCtx || optionsCtx;

  let list: ToolKey[] = [];
  switch (cat) {
    case "home":
      list = ["taxsaveiq", "stockleo"];
      break;
    case "tax":
      list = ["taxsaveiq"];
      if (investCtx || optionsCtx) list.push("stockleo");
      break;
    case "investing":
      list = ["stockleo"];
      if (optionsCtx) list.push("optionleo");
      else if (taxCtx) list.push("taxsaveiq");
      break;
    case "options":
      list = ["optionleo", "stockleo"];
      break;
    case "immigration":
      // Immigration-only pages get no ad. Only show finance cards when the page
      // genuinely carries tax/financial-planning context. Never OptionLeo here.
      if (taxCtx) list.push("taxsaveiq");
      if (investCtx) list.push("stockleo");
      break;
    case "education":
      // Students/family pages only when finance/tax context exists.
      if (financeCtx) {
        if (taxCtx) list.push("taxsaveiq");
        if (investCtx) list.push("stockleo");
      }
      break;
    case "generic":
    default:
      list = [];
  }

  return Array.from(new Set(list)).slice(0, max);
}
