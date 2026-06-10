/**
 * Educational USA ↔ India flight price-pressure model.
 *
 * Deliberately static — no live airline APIs in this version. The estimator
 * scores seasonal demand, booking window, flexibility, and trip purpose into
 * a price-pressure tier, then maps that tier to broad educational fare
 * ranges. It tells users whether quotes they see elsewhere are likely to be
 * high or low for their situation; it never claims to show real prices.
 *
 * API-ready: a future live-fare provider (Amadeus etc.) only needs to swap
 * the body of `estimateFlightPrice` — the input/output contracts and the UI
 * in components/tools/FlightPriceEstimator.tsx stay the same.
 */

/* ------------------------------------------------------------------ *
 * Option catalogs
 * ------------------------------------------------------------------ */

export interface Airport {
  code: string;
  city: string;
}

export const US_AIRPORTS: Airport[] = [
  { code: "JFK", city: "New York" },
  { code: "EWR", city: "Newark" },
  { code: "ORD", city: "Chicago" },
  { code: "SFO", city: "San Francisco" },
  { code: "LAX", city: "Los Angeles" },
  { code: "DFW", city: "Dallas" },
  { code: "IAH", city: "Houston" },
  { code: "ATL", city: "Atlanta" },
  { code: "SEA", city: "Seattle" },
  { code: "IAD", city: "Washington DC" },
  { code: "BOS", city: "Boston" },
];

export const INDIA_AIRPORTS: Airport[] = [
  { code: "DEL", city: "Delhi" },
  { code: "BOM", city: "Mumbai" },
  { code: "HYD", city: "Hyderabad" },
  { code: "BLR", city: "Bengaluru" },
  { code: "MAA", city: "Chennai" },
  { code: "AMD", city: "Ahmedabad" },
  { code: "CCU", city: "Kolkata" },
  { code: "COK", city: "Kochi" },
  { code: "PNQ", city: "Pune" },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type TripType = "one-way" | "round-trip";
export type TravelClass = "economy" | "premium-economy" | "business";
export type BookingWindow = "lt-2w" | "2-4w" | "1-3m" | "3-6m" | "6m-plus";
export type Flexibility = "fixed" | "flex-3d" | "flex-1w" | "flex-2w";
export type TravelReason =
  | "parents"
  | "vacation"
  | "student"
  | "emergency"
  | "festival"
  | "business";

export const TRAVEL_CLASS_OPTIONS: { value: TravelClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium-economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
];

export const BOOKING_WINDOW_OPTIONS: { value: BookingWindow; label: string }[] =
  [
    { value: "lt-2w", label: "Less than 2 weeks" },
    { value: "2-4w", label: "2–4 weeks" },
    { value: "1-3m", label: "1–3 months" },
    { value: "3-6m", label: "3–6 months" },
    { value: "6m-plus", label: "6+ months" },
  ];

export const FLEXIBILITY_OPTIONS: { value: Flexibility; label: string }[] = [
  { value: "fixed", label: "Fixed dates" },
  { value: "flex-3d", label: "Flexible by 3 days" },
  { value: "flex-1w", label: "Flexible by 1 week" },
  { value: "flex-2w", label: "Flexible by 2+ weeks" },
];

export const TRAVEL_REASON_OPTIONS: { value: TravelReason; label: string }[] = [
  { value: "parents", label: "Parents visiting USA" },
  { value: "vacation", label: "Family vacation" },
  { value: "student", label: "Student travel" },
  { value: "emergency", label: "Emergency travel" },
  { value: "festival", label: "Festival / holiday travel" },
  { value: "business", label: "Business / work travel" },
];

/* ------------------------------------------------------------------ *
 * Inputs / outputs
 * ------------------------------------------------------------------ */

export interface FlightInputs {
  origin: string;
  destination: string;
  tripType: TripType;
  /** 0 = January … 11 = December */
  month: number;
  travelClass: TravelClass;
  adults: number;
  children: number;
  bookingWindow: BookingWindow;
  flexibility: Flexibility;
  reason: TravelReason;
}

export type PricePressure = "low" | "moderate" | "high" | "very-high";

export interface FareRange {
  min: number;
  max: number;
  /** Very-high tier has no realistic ceiling — display max as "max+". */
  openEnded: boolean;
}

export interface FlightEstimate {
  pressure: PricePressure;
  pressureLabel: string;
  /** Educational per-person range for the selected class and trip type. */
  perPerson: FareRange;
  /** perPerson × travellers (children priced as adults; real child fares vary). */
  total: FareRange;
  travellers: number;
  bookingAdvice: string;
  flexibilityScore: number;
  flexibilityLabel: string;
  seasonNote: string;
  routeNote: string;
  savingTips: string[];
  /** Emergency travel gets need-first guidance instead of price optimization. */
  emergency: boolean;
}

/* ------------------------------------------------------------------ *
 * Scoring model
 * ------------------------------------------------------------------ */

// Seasonal demand score, Jan → Dec. High-demand months (school summer break
// May–July, Diwali season November, winter holidays December) score 3+;
// shoulder months 2; low season (late January, February, October) 1.
const MONTH_SCORE = [1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 3, 3.5];

const BOOKING_ADJUST: Record<BookingWindow, number> = {
  "lt-2w": 2,
  "2-4w": 1,
  "1-3m": 0,
  "3-6m": -0.5,
  "6m-plus": -0.25,
};

const FLEX_ADJUST: Record<Flexibility, number> = {
  fixed: 0,
  "flex-3d": -0.5,
  "flex-1w": -1,
  "flex-2w": -1.5,
};

const PRESSURE_LABELS: Record<PricePressure, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  "very-high": "Very High",
};

// Educational fare bands (USD, per person, economy). Broad on purpose —
// these describe typical historical territory, not live quotes.
const ECONOMY_ONE_WAY: Record<PricePressure, [number, number]> = {
  low: [450, 700],
  moderate: [700, 1000],
  high: [1000, 1400],
  "very-high": [1400, 2000],
};

const ECONOMY_ROUND_TRIP: Record<PricePressure, [number, number]> = {
  low: [800, 1100],
  moderate: [1100, 1500],
  high: [1500, 2200],
  "very-high": [2200, 3200],
};

// Cabin multipliers applied to the economy band ends.
const CLASS_MULTIPLIER: Record<TravelClass, [number, number]> = {
  economy: [1, 1],
  "premium-economy": [1.6, 2.2],
  business: [3.5, 6],
};

// Routes with many nonstop options and deep competition vs. routes that
// usually need a connection (fewer seats, prices spike harder in peaks).
const TRUNK_DESTINATIONS = new Set(["DEL", "BOM"]);
const TRUNK_ORIGINS = new Set(["JFK", "EWR", "SFO", "ORD", "IAD"]);

function airportLabel(code: string, list: Airport[]): string {
  const a = list.find((x) => x.code === code);
  return a ? `${a.city} (${a.code})` : code;
}

function roundFare(value: number): number {
  return Math.round(value / 50) * 50;
}

function pressureFromScore(score: number): PricePressure {
  if (score <= 1) return "low";
  if (score <= 2) return "moderate";
  if (score <= 3.25) return "high";
  return "very-high";
}

function seasonNoteFor(month: number, reason: TravelReason): string {
  const name = MONTHS[month];
  const base: Record<number, string> = {
    0: "January starts expensive (returning holiday traffic in the first week) and then drops into one of the cheapest windows of the year.",
    1: "February is typically a low-demand month on USA–India routes — one of the best windows for fares.",
    2: "March is a shoulder month: demand picks up toward spring break and school-year-end travel, but fares are usually still reasonable.",
    3: "April is a shoulder month with moderate demand — generally cheaper than the summer peak that follows.",
    4: "May begins the summer peak: school vacations in both countries push USA–India demand and fares up sharply.",
    5: "June sits in the heart of the summer peak — family travel to India is at its heaviest and fares reflect it.",
    6: "July is peak summer-vacation season; demand stays heavy and cheap seats sell out earliest.",
    7: "August demand eases as schools restart, but early-August departures still carry summer pricing on many routes.",
    8: "September is a shoulder month — a popular sweet spot between the summer peak and the festival season.",
    9: "October is usually a lower-demand month, though fares begin climbing late in the month as Diwali approaches in some years.",
    10: "November is festival season — Diwali timing drives heavy India-bound demand, though early November can be calmer on some routes.",
    11: "December is the most expensive month on most USA–India routes: winter break, holidays, and wedding season collide.",
  };
  let note = `${name}: ${base[month]}`;
  if (reason === "festival") {
    note +=
      " Festival and holiday travel concentrates demand around specific dates, which pushes price pressure even higher than the month average.";
  }
  return note;
}

function routeNoteFor(origin: string, destination: string): string {
  const from = airportLabel(origin, US_AIRPORTS);
  const to = airportLabel(destination, INDIA_AIRPORTS);
  const trunk =
    TRUNK_DESTINATIONS.has(destination) && TRUNK_ORIGINS.has(origin);
  if (trunk) {
    return `${from} → ${to} is a high-competition trunk route with nonstop and one-stop options on several airlines — comparing carriers usually pays off, and nonstops carry a premium.`;
  }
  if (TRUNK_DESTINATIONS.has(destination)) {
    return `${from} → ${to} usually involves a connection in Europe, the Gulf, or another US gateway. Comparing different connection points (and nearby departure airports) can change the fare significantly.`;
  }
  return `${from} → ${to} typically requires a connection, and ${to} has fewer direct international seats than Delhi or Mumbai — fares spike harder in peak months. Checking a Delhi or Mumbai arrival plus a domestic leg is sometimes cheaper.`;
}

function bookingAdviceFor(i: FlightInputs, pressure: PricePressure): string {
  if (i.reason === "emergency") {
    return "For emergency travel, book based on need, not price optimization. Call airlines directly and ask about compassionate or bereavement options, and prioritize changeable tickets.";
  }
  const peak = MONTH_SCORE[i.month] >= 3;
  switch (i.bookingWindow) {
    case "lt-2w":
      return peak
        ? "Booking under 2 weeks out in a peak month is the most expensive combination. If dates can slip even a few days, compare adjacent dates and nearby airports before buying."
        : "Last-minute fares are usually elevated even in low season. Compare one-stop options and nearby departure airports — they often undercut nonstops sharply close to departure.";
    case "2-4w":
      return peak
        ? "2–4 weeks out in a peak month, cheap seats are largely gone. Set fare alerts now and book as soon as you see a fare near the low end of your range — waiting rarely helps this close in."
        : "2–4 weeks out in a quieter month can still find decent fares. Set alerts, compare 2–3 dates, and book when a quote lands in the lower half of your range.";
    case "1-3m":
      return peak
        ? "1–3 months ahead of a peak month is workable but tightening. For May–July or November–December travel, sooner is better — good fares in these months rarely get cheaper as the date approaches."
        : "1–3 months out is a solid booking window for shoulder and low-season travel. Watch fares for a week or two, then book when you see a dip.";
    case "3-6m":
      return "3–6 months ahead is widely considered the sweet spot for USA–India tickets, especially for peak-season travel. Set fare alerts now and be ready to book when a good fare appears.";
    case "6m-plus":
      return "6+ months out, airlines often haven't released their cheapest fares yet. Set alerts and track prices — the best window to actually buy is usually 2–6 months before departure, earlier for December.";
  }
}

function flexibilityScoreFor(i: FlightInputs): {
  score: number;
  label: string;
} {
  const base: Record<Flexibility, number> = {
    fixed: 20,
    "flex-3d": 45,
    "flex-1w": 70,
    "flex-2w": 90,
  };
  const windowBonus: Record<BookingWindow, number> = {
    "lt-2w": -10,
    "2-4w": 0,
    "1-3m": 5,
    "3-6m": 10,
    "6m-plus": 10,
  };
  const score = Math.max(
    0,
    Math.min(100, base[i.flexibility] + windowBonus[i.bookingWindow])
  );
  const label =
    score >= 70 ? "Excellent" : score >= 40 ? "Good" : "Limited";
  return { score, label };
}

function savingTipsFor(i: FlightInputs, pressure: PricePressure): string[] {
  const tips: string[] = [
    "Compare the same dates across at least 2–3 airlines and one metasearch site before booking.",
    "Check fares from a nearby alternate airport — large hubs often price lower than smaller ones.",
  ];
  if (i.flexibility === "fixed") {
    tips.push(
      "If your dates can move even ±3 days, re-check fares — mid-week departures (Tue–Thu) often price lower than weekends."
    );
  } else {
    tips.push(
      "Use your date flexibility: view a whole-month fare calendar and anchor your trip on the cheapest departure day."
    );
  }
  if (i.tripType === "round-trip") {
    tips.push(
      "Price the round-trip on one airline against two one-ways (or two different airlines) — on India routes the round-trip usually wins, but not always."
    );
  } else {
    tips.push(
      "One-way international fares are often more than half a round-trip. If a return is even loosely planned, price the round-trip too."
    );
  }
  if (i.travelClass !== "economy") {
    tips.push(
      "For premium cabins, compare premium economy on one airline against business on another — and watch for upgrade offers after booking economy."
    );
  }
  if (i.children > 0) {
    tips.push(
      "Ask about child fares and seat-selection fees — some carriers discount child tickets on international routes, and family seating fees add up."
    );
  }
  if (i.reason === "parents") {
    tips.push(
      "For parents, weigh refundable or low-change-fee fares — visa appointment dates and health plans change, and change fees can erase any savings."
    );
  }
  if (i.reason === "student") {
    tips.push(
      "Check student fares (extra baggage, flexible dates) offered by several airlines and student travel programs — bring proof of enrollment."
    );
  }
  if (pressure === "high" || pressure === "very-high") {
    tips.push(
      "If fares look extreme, compare arriving at a nearby Indian metro plus a cheap domestic connection on a separate ticket (leave a generous layover)."
    );
  }
  tips.push(
    "Always check baggage allowance and change rules before buying — a 'cheaper' fare with fewer bags or rigid rules can cost more overall."
  );
  return tips;
}

/* ------------------------------------------------------------------ *
 * Main estimator
 * ------------------------------------------------------------------ */

export function estimateFlightPrice(i: FlightInputs): FlightEstimate {
  let score = MONTH_SCORE[i.month] ?? 2;
  score += BOOKING_ADJUST[i.bookingWindow];
  score += FLEX_ADJUST[i.flexibility];
  if (i.reason === "festival") score += 1;
  // Emergency travel is usually booked close-in with no flexibility; the
  // booking-window adjustment already captures that, so no extra bump.

  const pressure = pressureFromScore(score);

  const economyBand =
    i.tripType === "round-trip"
      ? ECONOMY_ROUND_TRIP[pressure]
      : ECONOMY_ONE_WAY[pressure];
  const [mLow, mHigh] = CLASS_MULTIPLIER[i.travelClass];
  const perPerson: FareRange = {
    min: roundFare(economyBand[0] * mLow),
    max: roundFare(economyBand[1] * mHigh),
    openEnded: pressure === "very-high",
  };

  const travellers = Math.max(1, i.adults) + Math.max(0, i.children);
  const total: FareRange = {
    min: perPerson.min * travellers,
    max: perPerson.max * travellers,
    openEnded: perPerson.openEnded,
  };

  const flex = flexibilityScoreFor(i);

  return {
    pressure,
    pressureLabel: PRESSURE_LABELS[pressure],
    perPerson,
    total,
    travellers,
    bookingAdvice: bookingAdviceFor(i, pressure),
    flexibilityScore: flex.score,
    flexibilityLabel: flex.label,
    seasonNote: seasonNoteFor(i.month, i.reason),
    routeNote: routeNoteFor(i.origin, i.destination),
    savingTips: savingTipsFor(i, pressure),
    emergency: i.reason === "emergency",
  };
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatFareRange(range: FareRange): string {
  return `${formatUsd(range.min)} – ${formatUsd(range.max)}${
    range.openEnded ? "+" : ""
  }`;
}
