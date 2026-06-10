"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  BOOKING_WINDOW_OPTIONS,
  estimateFlightPrice,
  FLEXIBILITY_OPTIONS,
  formatFareRange,
  INDIA_AIRPORTS,
  MONTHS,
  TRAVEL_CLASS_OPTIONS,
  TRAVEL_REASON_OPTIONS,
  US_AIRPORTS,
  type BookingWindow,
  type Flexibility,
  type FlightInputs,
  type PricePressure,
  type TravelClass,
  type TravelReason,
  type TripType,
} from "@/lib/flight-price";

/**
 * Affiliate-ready comparison card config. Intentionally inactive: no partner
 * deals exist yet, so `partners` stays empty and the card only shows neutral,
 * non-affiliate suggestions. When partnerships launch, add entries here.
 */
const COMPARE_CONFIG: {
  enabled: boolean;
  partners: { label: string; href: string }[];
} = {
  enabled: false,
  partners: [],
};

const PRESSURE_TONE: Record<PricePressure, ResultTone> = {
  low: "positive",
  moderate: "info",
  high: "caution",
  "very-high": "attention",
};

const PRESSURE_BAR: Record<PricePressure, { width: string; color: string }> = {
  low: { width: "w-1/4", color: "bg-emerald-500" },
  moderate: { width: "w-2/4", color: "bg-sky-500" },
  high: { width: "w-3/4", color: "bg-amber-500" },
  "very-high": { width: "w-full", color: "bg-rose-500" },
};

export default function FlightPriceEstimator() {
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("DEL");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [month, setMonth] = useState(11); // December — the classic NRI travel month
  const [travelClass, setTravelClass] = useState<TravelClass>("economy");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [bookingWindow, setBookingWindow] = useState<BookingWindow>("1-3m");
  const [flexibility, setFlexibility] = useState<Flexibility>("fixed");
  const [reason, setReason] = useState<TravelReason>("vacation");

  const inputs: FlightInputs = useMemo(
    () => ({
      origin,
      destination,
      tripType,
      month,
      travelClass,
      adults,
      children,
      bookingWindow,
      flexibility,
      reason,
    }),
    [
      origin,
      destination,
      tripType,
      month,
      travelClass,
      adults,
      children,
      bookingWindow,
      flexibility,
      reason,
    ]
  );

  const estimate = useMemo(() => estimateFlightPrice(inputs), [inputs]);

  // Track broad usage (pressure tier only — never routes/dates/party details),
  // debounced so rapid input changes send a single event.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "flight_price_guide",
        result_type: `pressure_${estimate.pressure.replace("-", "_")}`,
        category: "travel",
        page_slug: "/tools/flight-price-guide",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [estimate.pressure]);

  const tone = PRESSURE_TONE[estimate.pressure];
  const bar = PRESSURE_BAR[estimate.pressure];

  const inputPanel = (
    <InputCard eyebrow="Step 1" title="Describe your trip">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Departure city (USA)">
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className={fieldClass}
          >
            {US_AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Arrival city (India)">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={fieldClass}
          >
            {INDIA_AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Trip type">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "round-trip", label: "Round-trip" },
              { value: "one-way", label: "One-way" },
            ] as { value: TripType; label: string }[]
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setTripType(o.value)}
              aria-pressed={tripType === o.value}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                tripType === o.value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-900/10 bg-white text-ink-500 hover:border-ink-900/20"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Travel month">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={fieldClass}
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Travel class">
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value as TravelClass)}
            className={fieldClass}
          >
            {TRAVEL_CLASS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Adults" help="Age 12+">
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className={fieldClass}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Children" help="Under 12 — child fares vary by airline">
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className={fieldClass}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="How far ahead are you booking?"
          help="Time between buying the ticket and flying"
        >
          <select
            value={bookingWindow}
            onChange={(e) => setBookingWindow(e.target.value as BookingWindow)}
            className={fieldClass}
          >
            {BOOKING_WINDOW_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Date flexibility"
          help="Flexible dates usually lower the price you can find"
        >
          <select
            value={flexibility}
            onChange={(e) => setFlexibility(e.target.value as Flexibility)}
            className={fieldClass}
          >
            {FLEXIBILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Travel reason">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as TravelReason)}
          className={fieldClass}
        >
          {TRAVEL_REASON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <p className="border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-400">
        Results update instantly as you change inputs. Nothing you enter is
        stored or sent anywhere.
      </p>
    </InputCard>
  );

  const resultPanel = (
    <div className="space-y-4">
      <ResultCard
        tone={tone}
        eyebrow="Your estimate"
        title={`Price pressure: ${estimate.pressureLabel}`}
        badge={estimate.pressureLabel}
      >
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-ink-900/5"
          role="img"
          aria-label={`Price pressure ${estimate.pressureLabel}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${bar.width} ${bar.color}`}
          />
        </div>

        {estimate.emergency && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            Emergency travel: book based on need, not price optimization. Call
            airlines directly, ask about compassionate fares, and choose
            changeable tickets — getting there matters more than the fare tier
            below.
          </p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#fafafa] p-4">
            <p className="text-xs text-ink-400">
              Educational fare range · per person ·{" "}
              {tripType === "round-trip" ? "round-trip" : "one-way"}
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
              {formatFareRange(estimate.perPerson)}
            </p>
          </div>
          <div className="rounded-xl bg-[#fafafa] p-4">
            <p className="text-xs text-ink-400">
              All {estimate.travellers}{" "}
              {estimate.travellers === 1 ? "traveller" : "travellers"}{" "}
              (children priced as adults)
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
              {formatFareRange(estimate.total)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Best booking timing
          </p>
          <p className="mt-1">{estimate.bookingAdvice}</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Flexibility score
            </p>
            <p className="text-xs font-semibold text-ink-700">
              {estimate.flexibilityScore}/100 · {estimate.flexibilityLabel}
            </p>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-900/5">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${estimate.flexibilityScore}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-400">
            The more your dates can move, the more likely you are to land in
            the lower part of the fare range.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Seasonal demand
          </p>
          <p className="mt-1">{estimate.seasonNote}</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Your route
          </p>
          <p className="mt-1">{estimate.routeNote}</p>
        </div>

        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ Now is a good time to compare prices: with your range above as a
          benchmark, any live quote near or below its low end is worth acting
          on.
        </p>
      </ResultCard>

      <ResultCard tone="neutral" eyebrow="Save money" title="Money-saving checklist">
        <ul className="space-y-2">
          {estimate.savingTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-emerald-600">
                ✓
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      {/* Affiliate-ready comparison card — inactive until partners exist. */}
      <ResultCard tone="neutral" eyebrow="Next step" title="Compare flight options">
        {COMPARE_CONFIG.enabled && COMPARE_CONFIG.partners.length > 0 ? (
          <ul className="space-y-2">
            {COMPARE_CONFIG.partners.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="font-semibold text-brand-600 underline"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p>
              This tool doesn&apos;t sell tickets and has no booking partners.
              To check live prices, compare the same dates on a fare aggregator
              (such as Google Flights), then verify on the airline&apos;s own
              website before booking — prices, baggage rules, and change fees
              can differ between platforms.
            </p>
            <p className="text-xs text-ink-400">
              No affiliate links on this page. If partner links are added in
              the future they will be clearly labelled.
            </p>
          </>
        )}
      </ResultCard>

      <p className="text-xs leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">
          Educational estimate — not live prices.
        </strong>{" "}
        Ranges describe typical historical territory for USA–India fares and
        update only with the logic above, never with airline inventory. Always
        compare real quotes before deciding.
      </p>
    </div>
  );

  return <ToolLayout inputs={inputPanel} results={resultPanel} />;
}
