/**
 * Pure, framework-free decision logic for the "Should I keep this India
 * investment?" assistant. Kept separate from the React component so it can be
 * unit-tested (vitest, node env) and so the UI stays thin.
 *
 * IMPORTANT (YMYL): this is EDUCATIONAL triage, not advice. It never tells a
 * user to buy or sell. It classifies an asset into one of seven educational
 * result tiers, surfaces the main issue to review, and points to the relevant
 * on-page section and existing site guides. No financial values are ever passed
 * in — only coarse categorical choices.
 */

export type UsPerson = "yes" | "no" | "not-sure";
export type AssetType =
  | "stocks"
  | "mutual-fund"
  | "ulip"
  | "nre-fd"
  | "fcnr"
  | "nro-fd"
  | "real-estate"
  | "ppf"
  | "nps"
  | "gold"
  | "other";
export type ReturnPlan = "within-3" | "3-7" | "uncertain" | "no-plan";
export type Horizon = "under-2" | "2-5" | "over-5" | "no-date";
export type Currency = "usd" | "inr" | "both" | "not-sure";
export type Portion = "under-10" | "10-25" | "over-25" | "not-sure";
export type Reporting = "yes" | "no" | "not-sure" | "na";

export interface AssistantInputs {
  usPerson: UsPerson;
  asset: AssetType;
  returnPlan: ReturnPlan;
  horizon: Horizon;
  currency: Currency;
  portion: Portion;
  reporting: Reporting;
}

export type ResultCategory =
  | "simple-keep"
  | "keep-review"
  | "high-friction"
  | "favor-usd"
  | "return-changes"
  | "pro-review"
  | "more-info";

export type MainIssue =
  | "PFIC"
  | "NRO taxation"
  | "Currency mismatch"
  | "Repatriation"
  | "Concentration"
  | "FBAR/FATCA reporting"
  | "RNOR planning"
  | "Insufficient information";

export interface GuideLink {
  label: string;
  href: string;
}

export interface AssistantResult {
  category: ResultCategory;
  /** Coarse, non-identifying label for analytics only. */
  categoryLabel: string;
  summary: string;
  mainIssue: MainIssue;
  reasons: string[];
  /** Anchor to the most relevant section on THIS page. */
  sectionHref: string;
  sectionLabel: string;
  guideLinks: GuideLink[];
}

export const CATEGORY_LABELS: Record<ResultCategory, string> = {
  "simple-keep": "Comparatively simple to keep and report",
  "keep-review": "Reasonable to keep, but review currency and concentration",
  "high-friction": "High US tax or reporting friction",
  "favor-usd": "May favour US-dollar assets for your stated goals",
  "return-changes": "Return-to-India plans materially change the analysis",
  "pro-review": "Professional cross-border review recommended before acting",
  "more-info": "More information is needed",
};

/* Assets that are rupee-denominated (currency-mismatch relevant vs a USD goal). */
const INR_DENOMINATED: AssetType[] = [
  "stocks",
  "mutual-fund",
  "ulip",
  "nre-fd",
  "nro-fd",
  "real-estate",
  "ppf",
  "nps",
  "gold",
];

const GUIDE = {
  pfic: { label: "PFIC & Indian mutual funds guide", href: "/articles/pfic-indian-mutual-funds-trap" },
  nreNro: { label: "NRE vs NRO accounts guide", href: "/articles/nre-nro-accounts-explained" },
  fbar: { label: "FBAR & FATCA guide", href: "/articles/fbar-fatca-nri-guide" },
  fbarTool: { label: "FBAR / FATCA checker", href: "/tools/fbar-fatca-checker" },
  dtaa: { label: "India–US DTAA guide", href: "/articles/double-taxation-dtaa-india-usa" },
  indianIncome: { label: "Declaring Indian income on a US return", href: "/articles/indian-income-us-tax-return" },
  rnor: { label: "RNOR tax-residency calculator", href: "/calculators/rnor-tax-residency" },
  returnChecklist: { label: "Return to India checklist", href: "/return-to-india-checklist" },
  fcnrHysa: { label: "FCNR vs US high-yield savings", href: "/calculators/fcnr-vs-hysa" },
  property: { label: "Repatriating an Indian property sale", href: "/articles/repatriate-india-property-sale-usa" },
  propertyCalc: { label: "India property capital-gains calculator", href: "/calculators/india-property-capital-gains" },
  organizer: { label: "NRI Wealth & Tax Organizer", href: "/nri-wealth-checkup" },
  hub: { label: "India Tax Compliance Hub", href: "/india-tax-compliance" },
} satisfies Record<string, GuideLink>;

const SECTION = {
  mutualFunds: { href: "#mutual-funds", label: "Should you keep Indian mutual funds?" },
  nreNro: { href: "#nre-nro", label: "NRE vs NRO" },
  fd: { href: "#fd", label: "Should you keep fixed deposits?" },
  stocks: { href: "#stocks", label: "Should you keep Indian stocks?" },
  usTax: { href: "#us-tax", label: "How US taxation affects the decision" },
  capitalGains: { href: "#capital-gains", label: "Capital gains: equity, debt, property" },
  returning: { href: "#returning", label: "What if you return to India?" },
  instruments: { href: "#instruments", label: "Instrument-by-instrument comparison" },
} satisfies Record<string, { href: string; label: string }>;

const ASSET_NOUN: Record<AssetType, string> = {
  stocks: "direct Indian stocks",
  "mutual-fund": "an Indian mutual fund or ETF",
  ulip: "a ULIP / pooled product",
  "nre-fd": "an NRE fixed deposit",
  fcnr: "an FCNR deposit",
  "nro-fd": "an NRO fixed deposit",
  "real-estate": "Indian real estate",
  ppf: "a PPF account",
  nps: "an NPS account",
  gold: "gold / a Sovereign Gold Bond",
  other: "this asset",
};

/** Is any critical input still unknown enough that we cannot triage usefully? */
function tooLittleInfo(i: AssistantInputs): boolean {
  const unsure = [
    i.usPerson === "not-sure",
    i.currency === "not-sure",
    i.portion === "not-sure",
    i.reporting === "not-sure",
  ].filter(Boolean).length;
  return i.usPerson === "not-sure" && unsure >= 3;
}

/**
 * Core triage. Rules are evaluated in priority order (most decision-relevant
 * first) and return early, so the output is deterministic and testable.
 */
export function evaluateAsset(i: AssistantInputs): AssistantResult {
  const isUs = i.usPerson === "yes";
  const isPficAsset = i.asset === "mutual-fund" || i.asset === "ulip";
  const returnsSoon = i.returnPlan === "within-3";
  const returnsMid = i.returnPlan === "3-7";
  const usdGoal = i.currency === "usd";
  const inrDenominated = INR_DENOMINATED.includes(i.asset);
  const largePosition = i.portion === "over-25";
  const shortHorizon = i.horizon === "under-2" || i.horizon === "2-5";

  const reasons: string[] = [];
  const push = (r: string) => {
    if (!reasons.includes(r)) reasons.push(r);
  };

  // Shared reason builders (added regardless, then sliced to 3–5).
  if (isUs) push("As a US person, income from this asset is taxable on your US return (worldwide income), usually with a foreign tax credit for Indian tax.");
  if (usdGoal && inrDenominated) push(`Your goal is in US dollars but ${ASSET_NOUN[i.asset]} is rupee-denominated, so the USD/INR rate affects your real return.`);
  if (i.currency === "inr") push("Your goal is mostly in rupees, so keeping a rupee asset reduces currency risk for that goal.");
  if (returnsSoon) push("You may return to India within about 3 years, which can favour keeping rupee assets and using the RNOR window on return.");
  else if (returnsMid) push("You may return to India in 3–7 years, so future rupee goals partly offset the case for moving money out now.");
  if (largePosition) push("This asset is more than a quarter of your portfolio, so concentration risk matters as much as tax.");
  if (shortHorizon) push("You may need this money within a few years, so liquidity and near-term currency risk weigh more heavily.");

  // Generic educational reminders used only to guarantee a minimum of three
  // reasons when a branch is reached with very few specific ones.
  const FILLERS = [
    "Compare the after-tax and after-currency outcome against a US-based alternative before deciding.",
    "The right answer is asset-by-asset — this looks at one holding, not your whole portfolio.",
    "Whatever you decide, keep documentation and confirm the current rules, which change over time.",
  ];

  const finalize = (
    category: ResultCategory,
    summary: string,
    mainIssue: MainIssue,
    section: { href: string; label: string },
    guideLinks: GuideLink[],
    extraReasons: string[] = [],
  ): AssistantResult => {
    extraReasons.forEach(push);
    for (const f of FILLERS) {
      if (reasons.length >= 3) break;
      push(f);
    }
    return {
      category,
      categoryLabel: CATEGORY_LABELS[category],
      summary,
      mainIssue,
      reasons: reasons.slice(0, 5),
      sectionHref: section.href,
      sectionLabel: section.label,
      guideLinks,
    };
  };

  // 0) Not enough to say anything useful.
  if (tooLittleInfo(i)) {
    return finalize(
      "more-info",
      "There isn't enough information yet to give a useful read on this asset.",
      "Insufficient information",
      SECTION.usTax,
      [GUIDE.organizer, GUIDE.hub],
      ["A few key facts are still marked “not sure” — your US-person status, currency goal, and portfolio share drive most of the analysis."],
    );
  }

  // 1) US-person + unreported foreign assets = compliance gap first.
  if (isUs && i.reporting === "no") {
    return finalize(
      "pro-review",
      "Before any keep-or-move decision, the priority is getting foreign-asset reporting current.",
      "FBAR/FATCA reporting",
      SECTION.usTax,
      [GUIDE.fbar, GUIDE.fbarTool, ...(isPficAsset ? [GUIDE.pfic] : [])],
      [
        "You indicated foreign accounts/assets may not be reported yet; FBAR and FATCA (and PFIC forms, if relevant) should be brought current with professional help.",
        "Selling in a hurry before fixing reporting can make the tax and compliance position worse.",
      ],
    );
  }

  // 2) PFIC assets held by a US person.
  if (isPficAsset && isUs) {
    return finalize(
      "high-friction",
      `As a US person, ${ASSET_NOUN[i.asset]} usually carries heavy US-tax friction under the PFIC rules.`,
      "PFIC",
      SECTION.mutualFunds,
      [GUIDE.pfic, GUIDE.indianIncome],
      [
        "Indian mutual funds and pooled products are usually PFICs; US holders generally must file Form 8621, with a punitive default (Section 1291) regime.",
        "Any exit should be sequenced with advice — never a panic sale in a single high-income year.",
      ],
    );
  }

  // 3) PFIC asset but US-person status unclear — status decides everything.
  if (isPficAsset && i.usPerson === "not-sure") {
    return finalize(
      "pro-review",
      "Whether this pooled product is a problem depends entirely on your US-person status, which is unclear.",
      "PFIC",
      SECTION.mutualFunds,
      [GUIDE.pfic],
      ["If you are a US person, this is likely a PFIC (Form 8621, punitive default tax); if you are not, it is far simpler. Confirm your status first."],
    );
  }

  // 4) PPF / NPS held by a US person — uncertain US treatment.
  if ((i.asset === "ppf" || i.asset === "nps") && isUs) {
    return finalize(
      "pro-review",
      `${ASSET_NOUN[i.asset]} is tax-favoured in India, but its US treatment is uncertain and needs specialist review.`,
      "FBAR/FATCA reporting",
      SECTION.instruments,
      [GUIDE.fbar, GUIDE.indianIncome],
      ["“Tax-free in India” does not mean tax-free in the US; annual growth may be US-taxable and reporting treatment is debated."],
    );
  }

  // 5) NRO fixed deposit held by a US person — taxed both sides.
  if (i.asset === "nro-fd" && isUs) {
    const heavy = largePosition;
    return finalize(
      heavy ? "high-friction" : "keep-review",
      "An NRO deposit is simple to hold but its interest is taxed in India and again in the US.",
      "NRO taxation",
      SECTION.fd,
      [GUIDE.nreNro, GUIDE.dtaa],
      ["NRO interest faces Indian TDS and is also US-taxable (with a foreign tax credit); confirm you are not over-withheld and can recover excess by filing in India."],
    );
  }

  // 6) Real estate — repatriation & liquidity dominate.
  if (i.asset === "real-estate") {
    if (largePosition) {
      return finalize(
        "pro-review",
        "A large Indian property is worth a planned, advised exit rather than a quick decision.",
        "Repatriation",
        SECTION.capitalGains,
        [GUIDE.property, GUIDE.propertyCalc],
        ["Buyer TDS on an NRI seller is often over-withheld, sale needs 15CA/15CB to repatriate, and the US taxes the gain in dollars — all worth sequencing with advice."],
      );
    }
    return finalize(
      "keep-review",
      "Indian property can be reasonable to keep, but weigh liquidity, repatriation, and currency.",
      "Repatriation",
      SECTION.capitalGains,
      [GUIDE.property, GUIDE.propertyCalc],
      ["Property is illiquid; on eventual sale, TDS, 15CA/15CB paperwork, and USD-measured gains all apply."],
    );
  }

  // 7) Return-to-India plans materially change the picture (non-PFIC assets).
  if (returnsSoon && (i.currency === "inr" || i.currency === "both")) {
    return finalize(
      "return-changes",
      "Because you may return to India soon with rupee goals, keeping this asset can make more sense than the tax view alone suggests.",
      "RNOR planning",
      SECTION.returning,
      [GUIDE.rnor, GUIDE.returnChecklist],
      ["Map the RNOR window before you move — it can shelter foreign income for a period and change the best timing for any changes."],
    );
  }

  // 8) Currency mismatch: USD goal, rupee asset, needed reasonably soon.
  if (usdGoal && inrDenominated && shortHorizon && i.returnPlan !== "within-3") {
    return finalize(
      "favor-usd",
      "For a US-dollar goal you may need fairly soon, a rupee asset adds currency risk that US-dollar holdings avoid.",
      "Currency mismatch",
      SECTION.usTax,
      [GUIDE.fcnrHysa, GUIDE.organizer],
      ["This is about matching the asset's currency to the goal's currency — not a verdict that the investment is bad."],
    );
  }

  // 9) Simple-to-hold assets (NRE/FCNR deposits, small direct stock).
  if (i.asset === "nre-fd" || i.asset === "fcnr") {
    if (usdGoal && i.asset === "nre-fd" && shortHorizon) {
      return finalize(
        "keep-review",
        "An NRE deposit is simple to hold, but it is rupee-denominated against your US-dollar goal.",
        "Currency mismatch",
        SECTION.fd,
        [GUIDE.fcnrHysa, GUIDE.nreNro],
      );
    }
    return finalize(
      "simple-keep",
      `${ASSET_NOUN[i.asset]} is comparatively simple to hold and report as an NRI.`,
      i.asset === "fcnr" ? "Currency mismatch" : "NRO taxation",
      SECTION.fd,
      [GUIDE.nreNro, GUIDE.fcnrHysa],
      ["It is India-tax-free but fully US-taxable, so compare its after-US-tax yield to a US savings/Treasury alternative."],
    );
  }

  if (i.asset === "stocks") {
    if (largePosition || usdGoal) {
      return finalize(
        "keep-review",
        "Direct Indian stocks are simple to hold (no PFIC issue), but weigh concentration and currency.",
        largePosition ? "Concentration" : "Currency mismatch",
        SECTION.stocks,
        [GUIDE.indianIncome, GUIDE.dtaa],
      );
    }
    return finalize(
      "simple-keep",
      "Direct Indian stocks are comparatively simple to keep and report — the main work is US reporting and TDS reconciliation.",
      "FBAR/FATCA reporting",
      SECTION.stocks,
      [GUIDE.indianIncome, GUIDE.fbar],
    );
  }

  // 10) Gold and everything else — general review.
  return finalize(
    "keep-review",
    `${ASSET_NOUN[i.asset]} can be reasonable to keep, but review the US tax, reporting, and currency for your goals.`,
    inrDenominated ? "Currency mismatch" : "FBAR/FATCA reporting",
    SECTION.instruments,
    [GUIDE.indianIncome, GUIDE.hub],
  );
}
