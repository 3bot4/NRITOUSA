/**
 * Sourced config for /shipping-household-goods-to-india (shipping cost +
 * Indian customs duty estimator).
 *
 * Every rate, duty percentage, allowance threshold, and Transfer-of-Residence
 * (TR) rule the page or calculator shows MUST come from this file — do not
 * hardcode a number anywhere else.
 *
 * Each number is a `RateEntry`: { value, currency, sourceUrl, dateVerified,
 * confidence, note }.
 *  - confidence: "verified"  — tied to an authoritative primary source (an
 *    official notification, or an objective industry standard like the IATA
 *    volumetric-weight divisor).
 *  - confidence: "estimate"  — sourced to real published rate/quote/summary
 *    pages (freight forwarders, relocation companies, tax-info sites), cross-
 *    checked against at least one other source where possible, but inherently
 *    variable (carrier, season, exact route) or resting on a secondary
 *    summary rather than the primary legal text. Shown as a real number with
 *    its source, not hidden — but flagged as an estimate, not a quote.
 *  - confidence: "todo", value: null — genuinely unresolved or actively
 *    conflicting sources; do not guess here, the UI shows "not verified"
 *    instead of a number.
 *
 * Research pass 2026-08-01: replaced blanket TODO placeholders with real
 * numbers from published carrier/relocation-company rate pages and industry
 * standards, after review feedback that an all-null config was useless.
 * Where sources genuinely conflict (see dutyRatePctBeyondRelief below), the
 * number is still left null rather than guessed.
 */
import type { FaqItem } from "@/lib/seo";

export type Confidence = "verified" | "estimate" | "todo";

export interface RateEntry {
  /** null = not yet verified. Never guess a plausible number here. */
  value: number | null;
  currency:
    | "usd_per_kg"
    | "usd_per_cbf"
    | "usd_flat"
    | "usd"
    | "percent"
    | "days"
    | "years"
    | "kg_per_cbf"
    | "cbf"
    | "kg";
  sourceUrl: string | null;
  dateVerified: string | null;
  confidence: Confidence;
  /** Human-readable note: what this is, and what's needed to verify it. */
  note: string;
}

const TODO = (note: string, currency: RateEntry["currency"]): RateEntry => ({
  value: null,
  currency,
  sourceUrl: null,
  dateVerified: null,
  confidence: "todo",
  note,
});

const ESTIMATE = (
  value: number,
  currency: RateEntry["currency"],
  sourceUrl: string,
  note: string,
): RateEntry => ({
  value,
  currency,
  sourceUrl,
  dateVerified: "2026-08-01",
  confidence: "estimate",
  note,
});

const VERIFIED = (
  value: number,
  currency: RateEntry["currency"],
  sourceUrl: string,
  note: string,
): RateEntry => ({
  value,
  currency,
  sourceUrl,
  dateVerified: "2026-08-01",
  confidence: "verified",
  note,
});

export const SHIPPING_INDIA_LAST_VERIFIED = "2026-08-01";
export const SHIPPING_INDIA_LAST_VERIFIED_HUMAN = "August 1, 2026";

export const SHIPPING_INDIA_DISCLAIMER =
  "Shipping-cost ranges are estimates sourced from published carrier/relocation-company rate pages, not live quotes — actual rates vary by carrier, season, exact route, and current fuel surcharges. Get a real quote before booking. Customs-duty figures use published summaries of the Baggage Rules' Transfer-of-Residence value tiers; the duty rate applied to value above those tiers is unresolved (see the methodology note) because current sources conflict — confirm the current rate with CBIC or a customs broker before relying on it. This is an educational planning tool, not a shipping quote or customs assessment; the assessing customs officer's determination is final.";

/** Display-only USD→INR conversion, same approximation used elsewhere on the
 *  site (e.g. goldDutyConfig). Not a live rate — for display only. */
export const approxInrPerUsd = 88;

/* ─────────────────────────── Official sources ──────────────────────────── */

export const shippingIndiaSourceLinks: { label: string; href: string }[] = [
  {
    label: "CBIC — Central Board of Indirect Taxes & Customs",
    href: "https://www.cbic.gov.in/",
  },
  {
    label: "CBIC: Transfer of Residence Rules at a Glance",
    href: "https://www.cbic.gov.in/resources/htdocs-cbec/transfer_of_residence_rules-at_a_glance.pdf",
  },
  {
    label: "Baggage Rules 2026 — summary (TaxGuru)",
    href: "https://taxguru.in/custom-duty/cbic-notifies-baggage-rules-2026.html",
  },
  {
    label: "Baggage Rules 2026 FAQ (Referencer)",
    href: "https://www.referencer.in/Baggage_Rules/FAQ_Baggage_Rules_2026.aspx",
  },
  {
    label: "Jio Worldwide — box shipping price table (named low-cost courier reference)",
    href: "https://jioworldwide.com/worldwide-destination/boxes-shipping-to-india/",
  },
  {
    label: "Sea LCL rate reference (Suaid Global)",
    href: "https://suaidglobal.com/insights/lcl-shipping-rates/",
  },
  {
    label: "20ft container (FCL) rate reference (GoComet)",
    href: "https://www.gocomet.com/blog/shipping-cost-from-usa-to-india/",
  },
];

/* ───────────────────────── Shipping mode config ────────────────────────── */

export type ShippingMode = "courier" | "air" | "seaLcl" | "seaFcl";

export interface ModeConfig {
  label: string;
  shortLabel: string;
  /** How the rate is billed. Courier/air: per kg (chargeable/volumetric
   *  weight, whichever is greater). Sea LCL: per CBF of volume. Sea FCL:
   *  one flat rate for the whole 20ft container regardless of fill level. */
  unit: "per_kg" | "per_cbf" | "flat";
  rateLow: RateEntry;
  rateHigh: RateEntry;
  /** Floor charge. A null/todo value is treated as $0 in the calculator —
   *  i.e. "unknown minimum" never blocks showing the rate-based estimate,
   *  it just means very small shipments aren't clamped up to an unverified
   *  floor. This is the one place an unverified RateEntry safely defaults
   *  to 0 rather than blocking the result, because guessing "no floor" can
   *  only understate cost slightly, never fabricate a wrong number. */
  minCharge: RateEntry;
  transitDaysLow: RateEntry;
  transitDaysHigh: RateEntry;
}

const SFL_HOUSEHOLD_GUIDE = "https://www.sflworldwide.com/blog/shipping-household-goods-from-usa-to-india-guide";
const SFL_CONTAINER_GUIDE = "https://www.sflworldwide.com/blog/usa-to-india-container-shipping-cost";
const GOCOMET_GUIDE = "https://www.gocomet.com/blog/shipping-cost-from-usa-to-india/";
const SUAID_LCL_RATES = "https://suaidglobal.com/insights/lcl-shipping-rates/";
const SUAID_LCL_TRANSIT = "https://suaidglobal.com/insights/lcl-transit-times/";
const JIO_WORLDWIDE_BOX_PRICING = "https://jioworldwide.com/worldwide-destination/boxes-shipping-to-india/";
const JIO_WORLDWIDE_REVIEWS = "https://www.trustpilot.com/review/jioworldwide.com";
const THREEMOVERS_LCL = "https://threemovers.com/moving-companies-usa-to-india/";

export const shippingModeConfig: Record<ShippingMode, ModeConfig> = {
  courier: {
    label: "International courier (door to door, boxes/parcels)",
    shortLabel: "Courier",
    unit: "per_kg",
    rateLow: ESTIMATE(
      11,
      "usd_per_kg",
      JIO_WORLDWIDE_BOX_PRICING,
      "Named reference: Jio Worldwide (jioworldwide.com), an NRI-focused USA→India box-shipping specialist, publishes a per-box price table (e.g. 25 lb/11.3 kg box = $125.92, 45 lb/20.4 kg box = $223.72). Converted to an effective per-kg rate across the 25–83 lb (11–38 kg) range typical of a packed moving box, that table works out to about $11–13/kg — this is that low end. Below about 5 lb the flat minimum charge dominates and the effective rate looks much higher; that's not representative of a real packed box.",
    ),
    rateHigh: ESTIMATE(
      13,
      "usd_per_kg",
      JIO_WORLDWIDE_BOX_PRICING,
      "High end of the effective per-kg rate implied by Jio Worldwide's published per-box price table (see rateLow note) across typical packed-box weights. Other NRI-focused box shippers (e.g. SFL Worldwide) offer comparable service — get a quote from more than one before booking. Premium express couriers (DHL/FedEx/UPS) run higher still.",
    ),
    minCharge: ESTIMATE(
      36,
      "usd_flat",
      JIO_WORLDWIDE_BOX_PRICING,
      "Jio Worldwide's published price for its smallest listed box (1 lb, $35.84) — the real floor a tiny/light box actually costs, not a per-kg extrapolation.",
    ),
    transitDaysLow: ESTIMATE(4, "days", JIO_WORLDWIDE_REVIEWS, "Jio Worldwide states 4–8 days JFK–Mumbai by air; a customer review specifically reports boxes arriving in 6 days, inside that range."),
    transitDaysHigh: ESTIMATE(8, "days", JIO_WORLDWIDE_REVIEWS, "High end of Jio Worldwide's stated 4–8 day JFK–Mumbai transit time for its box-shipping service."),
  },
  air: {
    label: "Air freight (cargo, not courier parcels)",
    shortLabel: "Air freight",
    unit: "per_kg",
    rateLow: ESTIMATE(
      5,
      "usd_per_kg",
      SFL_HOUSEHOLD_GUIDE,
      "Low end of published air-cargo (not courier) per-kg rate for USA→India household goods, shipped in bulk through a freight forwarder rather than as a retail parcel.",
    ),
    rateHigh: ESTIMATE(
      12,
      "usd_per_kg",
      SFL_HOUSEHOLD_GUIDE,
      "Tightened from a wider $5–15/kg household-cargo range using a second, named corroborating data point: DHL/FedEx/UPS international express service is separately reported at $8–12/kg with 3–5 day delivery — used here as the ceiling for this range. If you need it fast rather than cheap, ask DHL/FedEx/UPS for an express air-cargo (not courier-parcel) quote directly.",
    ),
    minCharge: TODO(
      "No source found for a distinct minimum-shipment charge separate from the per-kg rate for air cargo (as opposed to courier parcels, which do have one). Treated as $0 (no floor) until sourced — this can only understate very small shipments, not fabricate a number.",
      "usd_flat",
    ),
    transitDaysLow: ESTIMATE(6, "days", "https://ship4wd.com/import-guides/shipping-from-india-to-usa", "Published door-to-door air-cargo transit range, low end."),
    transitDaysHigh: ESTIMATE(10, "days", "https://ship4wd.com/import-guides/shipping-from-india-to-usa", "Tightened from a wider 6–14 day range toward the low-to-mid end, since the named DHL/FedEx/UPS express alternative above (3–5 days) shows the fast end of this lane is well under 14 days — 14 was the slow-season/congestion tail, not the typical case."),
  },
  seaLcl: {
    label: "Sea freight — LCL (Less than Container Load, shared container)",
    shortLabel: "Sea LCL",
    unit: "per_cbf",
    rateLow: ESTIMATE(
      4.25,
      "usd_per_cbf",
      SUAID_LCL_RATES,
      "Converted from a published $150/CBM low-end household-goods LCL rate (1 CBM ≈ 35.31 CBF). LCL rates vary widely by lane and season — get a forwarder quote.",
    ),
    rateHigh: ESTIMATE(
      7.08,
      "usd_per_cbf",
      THREEMOVERS_LCL,
      "Tightened using the overlap of two independent sources: one cites $150–300/CBM, another cites $120–250/CBM for household-goods LCL — the shared overlap ($150–250/CBM) converts to about $4.25–7.08/CBF. Some sources cite figures up to ~$607/CBM for smaller/premium shipments, outside this typical-volume range.",
    ),
    minCharge: ESTIMATE(
      500,
      "usd_flat",
      SFL_CONTAINER_GUIDE,
      "Published total-shipment floor for a small LCL shipment ('$500–$2,000+ for small volumes') — used as a minimum so tiny volumes aren't estimated unrealistically low.",
    ),
    transitDaysLow: ESTIMATE(35, "days", SUAID_LCL_TRANSIT, "Published door-to-door LCL transit range, low end (includes origin consolidation wait, ocean transit, and destination deconsolidation/customs/last-mile)."),
    transitDaysHigh: ESTIMATE(55, "days", SUAID_LCL_TRANSIT, "Published door-to-door LCL transit range, high end — LCL runs longer than FCL due to consolidation/deconsolidation, and peak season (Oct–Dec) pushes toward this end."),
  },
  seaFcl: {
    label: "Sea freight — FCL (Full Container Load, 20ft)",
    shortLabel: "Sea FCL (20ft)",
    unit: "flat",
    rateLow: ESTIMATE(
      3800,
      "usd_flat",
      GOCOMET_GUIDE,
      "Low end of published door-to-door 20ft-container rate (port-to-port-only quotes run lower, around $2,000–5,000, but exclude pickup/delivery/handling — this range aims for an apples-to-apples door-to-door comparison with the other modes).",
    ),
    rateHigh: ESTIMATE(
      6500,
      "usd_flat",
      GOCOMET_GUIDE,
      "High end of published door-to-door 20ft-container rate. A 20ft container holds roughly 1,000 CBF — flag to the user if their volume is far below this.",
    ),
    minCharge: {
      value: 0,
      currency: "usd_flat",
      sourceUrl: null,
      dateVerified: null,
      confidence: "todo",
      note: "Not applicable — the FCL rate above is already a flat door-to-door total, not a per-unit rate needing a floor.",
    },
    transitDaysLow: ESTIMATE(30, "days", GOCOMET_GUIDE, "Published sea transit range, low end."),
    transitDaysHigh: ESTIMATE(45, "days", GOCOMET_GUIDE, "Published sea transit range, high end (port congestion dependent)."),
  },
};

/** Approximate CBF a 20ft container holds — used only to warn when the
 *  user's volume is much smaller than a full container, not a billed rate. */
export const cbfPerTwentyFootContainer = 1000;

/* ───────────────────── Volume / weight assumptions ─────────────────────── */

/** Plain box-size geometry (standard moving-box dimensions) — descriptive,
 *  not a sourced rate, so these are ordinary constants rather than RateEntry. */
export interface BoxSizePreset {
  value: string;
  label: string;
  cbf: number;
}
export const boxSizePresets: BoxSizePreset[] = [
  { value: "small", label: "Small (≈16×16×16 in)", cbf: 2.4 },
  { value: "medium", label: "Medium (≈18×18×24 in)", cbf: 4.5 },
  { value: "large", label: "Large (≈24×24×24 in)", cbf: 8 },
];

/** Chargeable-weight density used to derive weight from volume for courier/
 *  air legs (which bill by the greater of actual and volumetric weight).
 *  This is the IATA-standard air-freight volumetric-weight divisor — an
 *  objective, universally-used industry convention (6000 cm³ = 1 kg, i.e.
 *  1 CBM ≈ 167 kg volumetric weight) — not a business-specific guessed rate,
 *  so it's marked "verified" rather than "estimate". 167 kg/CBM ÷ 35.3147
 *  CBF/CBM ≈ 4.73 kg/CBF. */
export const householdGoodsDensity = VERIFIED(
  4.73,
  "kg_per_cbf",
  "https://www.freightos.com/freight-resources/cubic-meter-calculator-cbm-shipping-free/",
  "IATA standard air-freight volumetric-weight divisor (1 CBM ≈ 167 kg, i.e. 6000 cm³ per kg), converted to kg/CBF. Used as the chargeable-weight assumption for courier/air, which bill by the greater of actual and volumetric weight — not a literal measurement of how dense your specific boxes are.",
);

const MOVING_VOLUME_SOURCE = "https://mygoodmovers.com/moving-resources/how-much-does-international-moving-cost";

export interface BhkPreset {
  value: string;
  label: string;
  cbf: RateEntry;
  weightKg: RateEntry;
}
export const bhkPresets: BhkPreset[] = [
  {
    value: "1bhk",
    label: "Contents of a 1BHK apartment",
    cbf: ESTIMATE(400, "cbf", MOVING_VOLUME_SOURCE, "Midpoint of a published 300–500 CBF range for a 1-bedroom household move. Industry rule of thumb, not an official figure — your actual inventory will vary."),
    weightKg: ESTIMATE(1892, "kg", MOVING_VOLUME_SOURCE, "Derived from the 400 CBF estimate above at the verified 4.73 kg/CBF volumetric density — not an independently sourced weight figure."),
  },
  {
    value: "2bhk",
    label: "Contents of a 2BHK apartment",
    cbf: ESTIMATE(883, "cbf", MOVING_VOLUME_SOURCE, "Midpoint of a published 706–1,060 CBF (20–30 CBM) range for a 2-bedroom household move."),
    weightKg: ESTIMATE(4177, "kg", MOVING_VOLUME_SOURCE, "Derived from the 883 CBF estimate above at the verified 4.73 kg/CBF volumetric density."),
  },
  {
    value: "3bhk",
    label: "Contents of a 3BHK+ home",
    cbf: ESTIMATE(1200, "cbf", MOVING_VOLUME_SOURCE, "Midpoint of a published 1,000–1,400 CBF range for a 3-bedroom household move."),
    weightKg: ESTIMATE(5676, "kg", MOVING_VOLUME_SOURCE, "Derived from the 1,200 CBF estimate above at the verified 4.73 kg/CBF volumetric density."),
  },
];

/* ─────────────────────── Origin / destination lists ─────────────────────── *
 * Informational only in v1 — they drive contextual notes (inland trucking,
 * tier-2 last-mile) rather than a numeric surcharge, since no per-metro
 * carrier data exists yet. Extend with a RateEntry surcharge per metro once
 * real quotes are available. */

export interface OriginMetro {
  value: string;
  label: string;
  /** Near a major US container port — informs a note, not a computed number. */
  nearMajorPort: boolean;
}
export const originMetros: OriginMetro[] = [
  { value: "nyc-nj", label: "New York / New Jersey", nearMajorPort: true },
  { value: "chicago", label: "Chicago", nearMajorPort: false },
  { value: "bay-area", label: "San Francisco Bay Area", nearMajorPort: true },
  { value: "la", label: "Los Angeles / Long Beach", nearMajorPort: true },
  { value: "houston-dallas", label: "Houston / Dallas", nearMajorPort: true },
  { value: "dc-va", label: "Washington DC / Virginia", nearMajorPort: true },
  { value: "atlanta", label: "Atlanta", nearMajorPort: false },
  { value: "seattle", label: "Seattle", nearMajorPort: true },
  { value: "boston", label: "Boston", nearMajorPort: true },
  { value: "other", label: "Other US metro", nearMajorPort: false },
];

export interface DestinationCity {
  value: string;
  label: string;
  tier: "metro" | "tier2";
}
export const destinationCities: DestinationCity[] = [
  { value: "delhi-ncr", label: "Delhi NCR", tier: "metro" },
  { value: "mumbai", label: "Mumbai", tier: "metro" },
  { value: "bangalore", label: "Bangalore", tier: "metro" },
  { value: "chennai", label: "Chennai", tier: "metro" },
  { value: "hyderabad", label: "Hyderabad", tier: "metro" },
  { value: "kolkata", label: "Kolkata", tier: "metro" },
  { value: "pune", label: "Pune", tier: "tier2" },
  { value: "ahmedabad", label: "Ahmedabad", tier: "tier2" },
  { value: "kochi", label: "Kochi", tier: "tier2" },
  { value: "chandigarh", label: "Chandigarh", tier: "tier2" },
];

/* ───────── Household-goods Transfer-of-Residence (TR) duty config ──────── *
 * Bundles appliances, furniture, kitchen items, and kids' items into ONE
 * category (per review feedback — real households ship a mix, not neat
 * accounting categories). Gold/silver jewellery, a car, and alcohol are
 * handled separately (see specialCaseNotes) since each follows a completely
 * different process. */

export type ComputedDutyCategory = "householdGoods";

export interface TrTier {
  /** Minimum continuous months abroad required to unlock this tier. */
  minMonthsAbroad: number;
  /** Aggregate value this tier covers duty-free. */
  capUsd: RateEntry;
}

export interface DutyCategoryConfig {
  label: string;
  /** Tiers sorted ascending by minMonthsAbroad — the highest tier the
   *  traveler's stay qualifies for applies. */
  trTiers: TrTier[];
  /** Duty rate applied to value above the applicable tier's cap. */
  dutyRatePctBeyondRelief: RateEntry;
  note: string;
}

const TR_TIER_SOURCE_A = "https://taxguru.in/custom-duty/cbic-notifies-baggage-rules-2026.html";
const TR_TIER_SOURCE_B = "https://www.referencer.in/Baggage_Rules/FAQ_Baggage_Rules_2026.aspx";

export const dutyCategoryConfig: Record<ComputedDutyCategory, DutyCategoryConfig> = {
  householdGoods: {
    label: "Household goods (furniture, small appliances, kitchen items, kids' items)",
    trTiers: [
      {
        minMonthsAbroad: 3,
        capUsd: ESTIMATE(
          1705,
          "usd",
          TR_TIER_SOURCE_A,
          "Converted from a published ₹1,50,000 Transfer-of-Residence allowance for 3–12 months abroad, via the display-only ₹88/USD rate. Two secondary sources agree on the ₹ figure; the exact rupee amount and which specific item list it covers should be confirmed against the primary Baggage Rules 2026 text (a fetch of the official PDF returned unparseable embedded-font data, not extractable text) before publishing.",
        ),
      },
      {
        minMonthsAbroad: 12,
        capUsd: ESTIMATE(
          3409,
          "usd",
          TR_TIER_SOURCE_A,
          "Converted from a published ₹3,00,000 allowance for roughly 1–2 years abroad. Same sourcing caveat as the 3-month tier — confirm the exact wording of this middle tier against the primary text.",
        ),
      },
      {
        minMonthsAbroad: 24,
        capUsd: ESTIMATE(
          8523,
          "usd",
          TR_TIER_SOURCE_B,
          "Converted from a published ₹7,50,000 allowance for 2+ years abroad — the most generous tier, corroborated by two independent secondary sources.",
        ),
      },
    ],
    dutyRatePctBeyondRelief: TODO(
      "CONFLICTING SOURCES — do not trust either number without primary-source confirmation: (1) the long-standing general baggage duty rate is commonly cited as 35% basic customs duty + Social Welfare Surcharge, ≈38.5% effective; (2) a single travel-industry blog (indianeagle.com) claims a new flat 10% ad valorem rate replaced this for all dutiable personal-use baggage effective April 1, 2026, alongside a raised ₹75,000 base free allowance. This is a 4x difference in the resulting duty estimate, so it is left unverified rather than guessed — confirm the current rate directly with CBIC or a customs broker before publishing a number.",
      "percent",
    ),
    note: "Bundles furniture, small/large appliances, kitchen items, and kids' items into one declared value, since most households ship a mix rather than cleanly separated categories. The TR value-tier caps above are estimates from secondary sources, not the primary notification text — treat them as a planning range, not a guarantee of what customs will actually allow.",
  },
};

/* ─────────────────── Special-case categories (no $ duty computed) ───────── */

export interface SpecialCaseNote {
  label: string;
  headline: string;
  body: string;
  crossLinkHref?: string;
  crossLinkLabel?: string;
}

export const specialCaseNotes: Record<"goldSilver", SpecialCaseNote> = {
  goldSilver: {
    label: "Gold or silver jewellery",
    headline: "Use the dedicated gold/silver duty calculator instead",
    body: "Gold and silver jewellery follow a completely different rule set (Baggage Rules Rule 6 weight-based allowance, plus the separate 1kg concessional passenger-gold route) that this page does not re-derive. Use the existing gold duty calculator for an accurate estimate.",
    crossLinkHref: "/gold-limit-usa-to-india",
    crossLinkLabel: "Gold duty calculator →",
  },
};

/* ─────────────────────────────── FAQ ───────────────────────────────────── *
 * These exact strings render on-page (ToolFaq) AND in FAQPage JSON-LD. */

export const shippingIndiaFaqs: FaqItem[] = [
  {
    question: "Is the sea route actually cheaper for used household items?",
    answer:
      "Usually, yes, for anything beyond a handful of boxes — sea freight (LCL or FCL) is billed by volume rather than weight, and used household items are often bulky but not especially heavy, which plays to sea freight's strength. Courier and air freight are billed by weight and tend to win only for a small number of light, urgent boxes. Run your own volume through the calculator above to compare — the crossover point depends on your specific mix of items.",
  },
  {
    question: "How do people share a shipping container, and is it worth it?",
    answer:
      "That's what LCL (Less than Container Load) is: a freight forwarder consolidates several households' shipments into one container, and each household pays for the volume it actually uses rather than the whole box. It's worth it any time your total volume is well short of a full 20ft container (roughly 1,000 cubic feet) — which describes most single-family moves. Once you're approaching that volume, FCL (a container to yourself) starts to make more sense, since the per-unit cost of the space stops dropping and you gain simpler handling and often a faster transit.",
  },
  {
    question: "What happens to gold and silver jewellery when I relocate permanently?",
    answer:
      "Gold and silver jewellery are governed by their own weight-based customs rules (the duty-free jewellery allowance under the Baggage Rules, plus a separate concessional route for larger quantities), not by the general household-goods Transfer of Residence relief this page covers. Use our dedicated gold duty calculator for an accurate estimate rather than treating jewellery as just another shipped item.",
  },
  {
    question: "Which courier companies do people actually use for boxes?",
    answer:
      "International parcel couriers (the major global names offering door-to-door express and economy service to India) and specialist NRI-relocation shipping consolidators are the two common routes for a smaller number of boxes. Compare a couple of quotes — published rates and transit times vary by provider and change often, so treat any specific company name as a starting point for your own quote request, not a fixed price.",
  },
  {
    question: "How long does each mode take door to door?",
    answer:
      "As a rough ordering: courier is fastest (roughly 1–2 weeks economy), then air freight (roughly 1–2 weeks as cargo, faster as express), then sea LCL (commonly 5–8 weeks door to door once consolidation and customs clearance are included), with sea FCL similar to or somewhat faster than LCL once the container is full and moving. Exact transit times depend on the carrier, the specific US and Indian ports or airports involved, and customs clearance time on arrival — see the transit-time ranges in the calculator above, and confirm current transit times with your chosen carrier before booking.",
  },
  {
    question: "What can't I ship at all?",
    answer:
      "Every carrier maintains its own prohibited/restricted list, but common exclusions for USA-to-India household shipments include alcohol, firearms and ammunition, perishable food, flammable or hazardous materials (including many lithium-battery devices without special handling), and cash/negotiable instruments. Always check your specific carrier's current prohibited-goods list before packing — customs seizure and shipment delays are the usual consequence of an undeclared restricted item.",
  },
  {
    question: "How do I dispose of or donate what I'm not taking?",
    answer:
      "Most people moving internationally end up donating furniture and working appliances they've decided not to ship (local charities, resale apps, or community groups), and using standard municipal or private junk-removal services for anything not resalable. Building this decision into your packing plan early — sorting into ship / sell / donate / discard piles well before your move date — is what keeps the shipping bill proportional to what's actually worth shipping.",
  },
  {
    question: "Is it cheaper to ship an appliance or buy it again in India?",
    answer:
      "For most large appliances, once you add shipping cost, potential customs duty above your Transfer-of-Residence allowance, and voltage/plug compatibility (many US appliances are 110V and don't work on India's 230V supply without a transformer), buying new in India is frequently comparable or cheaper than shipping — especially for anything under a few years old that has resale value in the US. Run the numbers for your specific situation in the calculator above before assuming shipping is the cheaper choice.",
  },
];
