"use client";

import { useState } from "react";
import {
  NumberField,
  SelectField,
  ResultPanel,
  Stat,
  Row,
  Callout,
  usd,
  num,
} from "./ui";
import ResultActions from "@/components/ResultActions";
import { useUrlState } from "@/lib/useUrlState";

/**
 * Rent vs. Buy calculator built for immigrants and visa holders.
 *
 * Beyond a standard rent-vs-buy model it layers in the three variables that
 * change the math for visa holders: visa clarity, the immigration timeline,
 * and the probability of relocating for the next job. Those feed a "Visa Risk
 * Score" and an immigrant-adjusted break-even that can differ sharply from the
 * textbook number. The "Immigrant Lens" toggle (default ON) switches between
 * the immigration-adjusted view and the plain US-resident calculation.
 *
 * All math runs client-side; nothing is sent anywhere.
 */

const MAX_YEARS = 15;

/* ------------------------------- helpers ------------------------------- */

function Toggle({
  on,
  onChange,
  label,
  hint,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
        on
          ? "border-emerald-300 bg-emerald-50/70"
          : "border-ink-900/10 bg-white"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold text-ink-900">
          🛂 {label}
        </span>
        {hint && <span className="mt-0.5 block text-xs text-ink-500">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition ${
          on ? "bg-emerald-500" : "bg-ink-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/** Yes/No toggle styled like the form fields. */
function YesNoField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      hint={hint}
      options={[
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ]}
    />
  );
}

const RISK_BANDS = [
  { max: 25, label: "Very Low", color: "#10b981", tone: "from-emerald-500 to-teal-600" },
  { max: 50, label: "Low", color: "#eab308", tone: "from-lime-500 to-emerald-600" },
  { max: 75, label: "Elevated", color: "#f97316", tone: "from-amber-500 to-orange-600" },
  { max: 101, label: "High", color: "#ef4444", tone: "from-rose-500 to-red-600" },
] as const;

function riskBand(pct: number) {
  return RISK_BANDS.find((b) => pct < b.max) ?? RISK_BANDS[RISK_BANDS.length - 1];
}

/* ------------------------- immigration scoring ------------------------- */

interface Immigration {
  riskPct: number; // 0..100 visa risk
  effectiveHorizon: number; // reliable years you'll stay
  riskPremiumYears: number; // pushes break-even later
  relocRisk: number; // 0..1 normalised
}

function deriveImmigration(s: Record<string, string>): Immigration {
  const visa = s.visa;
  const yrs = num(s.yrs);

  // --- Visa risk score (0..100) ---
  if (visa === "GC" || visa === "Citizen") {
    return {
      riskPct: 6,
      effectiveHorizon: MAX_YEARS,
      riskPremiumYears: 0,
      relocRisk: 0,
    };
  }

  let score = 0; // higher = riskier
  // Years of remaining clarity
  if (yrs < 2) score += 2;
  else if (yrs < 3) score += 1.2;
  else if (yrs <= 5) score += 0.5;
  // Visa type
  score +=
    visa === "EAD"
      ? -0.5
      : visa === "H-1B"
        ? 0
        : visa === "L-1"
          ? 0.6
          : visa === "O-1"
            ? 0.6
            : visa === "F-1 OPT"
              ? 1.6
              : 0.6; // Other
  // I-140 anchor
  if (s.i140 === "yes") score -= 1;
  // Renewal confidence
  score +=
    s.renew === "Very likely"
      ? -0.5
      : s.renew === "Likely"
        ? 0
        : s.renew === "Uncertain"
          ? 1
          : 1.8; // Unlikely
  // Green card timeline
  score +=
    s.gc === "Under 2 years"
      ? -0.4
      : s.gc === "2-5 years"
        ? 0
        : s.gc === "5-10 years"
          ? 0.4
          : s.gc === "10+ years"
            ? 0.9
            : 0.5; // Unknown

  // Normalise roughly -2..5 → 0..100
  const riskPct = Math.max(4, Math.min(100, ((score + 1.5) / 6) * 100));

  // --- Relocation risk (0..1) ---
  const stab =
    s.jobstab === "Very stable"
      ? 0
      : s.jobstab === "Stable"
        ? 0.2
        : s.jobstab === "Some uncertainty"
          ? 0.5
          : 1; // High uncertainty
  const move =
    s.reloc === "Very unlikely"
      ? 0
      : s.reloc === "Possible"
        ? 0.35
        : s.reloc === "Likely"
          ? 0.7
          : 1; // Very likely
  const relocRisk = Math.min(1, stab * 0.4 + move * 0.6);

  // --- Effective (reliable) horizon ---
  let horizon = yrs > 0 ? yrs : 1;
  // Renting it out after a move preserves more optionality → soften the cap.
  const rentOutRelief = s.rentout === "yes" ? 0.5 : 1;
  if (move >= 1) horizon = Math.min(horizon, 2 + 2 * (1 - rentOutRelief * 0.0));
  else if (move >= 0.7) horizon = Math.min(horizon, 3 + (s.rentout === "yes" ? 1 : 0));
  if (stab >= 1) horizon = Math.min(horizon, 3);
  // An approved I-140 implies 3-year extensions even past the slider.
  if (s.i140 === "yes") horizon = Math.max(horizon, Math.min(yrs + 2, 8));
  horizon = Math.max(1, Math.min(MAX_YEARS, Math.round(horizon)));

  // --- Break-even risk premium (years) ---
  const riskPremiumYears = Math.min(
    4,
    Math.round((riskPct / 100) * 2 + relocRisk * 2.5)
  );

  return { riskPct, effectiveHorizon: horizon, riskPremiumYears, relocRisk };
}

/* ------------------------------- model --------------------------------- */

interface YearPoint {
  year: number;
  netBuy: number;
  netRent: number;
  equity: number;
  endValue: number;
  remaining: number;
  sellingCost: number;
}

interface Model {
  years: YearPoint[];
  standardBE: number | null;
  monthlyBuy: number;
  monthlyRent: number;
  payment: number;
}

function buildModel(s: Record<string, string>): Model {
  const P = num(s.price);
  const dpPct = num(s.down) / 100;
  const i = num(s.rate) / 100 / 12;
  const term = Math.max(1, num(s.term));
  const closingPct = num(s.closing) / 100;
  const propTaxPct = num(s.proptax) / 100;
  const hoa = num(s.hoa);
  const ins = num(s.ins);
  const maintPct = num(s.maint) / 100;
  const apprR = num(s.appr) / 100;
  const sellingPct = num(s.selling) / 100;

  const rent0 = num(s.rent);
  const rentR = num(s.rentinc) / 100;
  const rins = num(s.rins);

  const invR = num(s.invret) / 100;
  const dedRate = (num(s.fed) + num(s.state)) / 100;

  const down = P * dpPct;
  const loan = Math.max(0, P - down);
  const closing = P * closingPct;
  const n = term * 12;
  const payment = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));

  // Month-by-month amortisation for the chart horizon.
  const monthsCap = MAX_YEARS * 12;
  const balAt: number[] = [loan];
  const cumIntAt: number[] = [0];
  let bal = loan;
  let cumInt = 0;
  for (let m = 1; m <= monthsCap; m++) {
    if (m <= n && bal > 0) {
      const interest = bal * i;
      const principal = Math.min(bal, payment - interest);
      bal = Math.max(0, bal - principal);
      cumInt += interest;
    }
    balAt[m] = bal;
    cumIntAt[m] = cumInt;
  }

  const years: YearPoint[] = [];
  let standardBE: number | null = null;

  // Year-1 monthly snapshot for the comparison card.
  const propTaxY1 = P * propTaxPct;
  const maintY1 = P * maintPct;
  const interestY1 = cumIntAt[12];
  const dedY1 = (interestY1 + Math.min(propTaxY1, 10000)) * dedRate;
  const monthlyBuy =
    payment + propTaxY1 / 12 + ins + hoa + maintY1 / 12 - dedY1 / 12;
  const monthlyRent = rent0 + rins;

  for (let Y = 1; Y <= MAX_YEARS; Y++) {
    const m = Y * 12;
    const cumMortgage = payment * Math.min(m, n);
    const remaining = balAt[m];

    // Accumulate appreciating yearly carrying costs and rent.
    let cumPropTax = 0;
    let cumMaint = 0;
    let cumRent = 0;
    let hv = P;
    let mr = rent0;
    for (let y = 0; y < Y; y++) {
      cumPropTax += hv * propTaxPct;
      cumMaint += hv * maintPct;
      cumRent += mr * 12;
      hv *= 1 + apprR;
      mr *= 1 + rentR;
    }
    const cumHoa = hoa * 12 * Y;
    const cumIns = ins * 12 * Y;
    const cumRins = rins * 12 * Y;

    // Mortgage-interest + capped SALT deduction (rough).
    const taxDeduction =
      (cumIntAt[m] + Math.min(cumPropTax, 10000 * Y)) * dedRate;

    const endValue = P * Math.pow(1 + apprR, Y);
    const sellingCost = endValue * sellingPct;
    const equity = endValue - remaining - sellingCost;

    const netBuy =
      down +
      closing +
      cumMortgage +
      cumPropTax +
      cumMaint +
      cumHoa +
      cumIns -
      taxDeduction -
      equity;

    // Renter invests the cash the buyer sank upfront; only the gain offsets rent.
    const invested = down + closing;
    const investGain = invested * (Math.pow(1 + invR, Y) - 1);
    const netRent = cumRent + cumRins - investGain;

    if (standardBE === null && netBuy <= netRent) standardBE = Y;

    years.push({
      year: Y,
      netBuy,
      netRent,
      equity,
      endValue,
      remaining,
      sellingCost,
    });
  }

  return { years, standardBE, monthlyBuy, monthlyRent, payment };
}

/* ------------------------------- chart --------------------------------- */

function BreakEvenChart({
  years,
  breakEven,
  horizon,
  showHorizon,
}: {
  years: YearPoint[];
  breakEven: number | null;
  horizon: number;
  showHorizon: boolean;
}) {
  const W = 720;
  const H = 320;
  const padL = 64;
  const padR = 16;
  const padT = 20;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xs = years.map((y) => y.year);
  const minX = 1;
  const maxX = MAX_YEARS;
  const vals = years.flatMap((y) => [y.netBuy, y.netRent]);
  const minV = Math.min(0, ...vals);
  const maxV = Math.max(...vals);
  const span = maxV - minV || 1;

  const x = (year: number) =>
    padL + ((year - minX) / (maxX - minX)) * plotW;
  const y = (val: number) =>
    padT + (1 - (val - minV) / span) * plotH;

  const line = (key: "netBuy" | "netRent") =>
    years.map((p) => `${x(p.year)},${y(p[key])}`).join(" ");

  // Y-axis ticks (~4).
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, t) =>
    minV + (span * t) / ticks
  );

  const zeroY = y(0);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full min-w-[560px]"
        role="img"
        aria-label="Cumulative cost of buying versus renting over 15 years"
      >
        {/* Planning-horizon band */}
        {showHorizon && (
          <>
            <rect
              x={x(Math.max(minX, horizon - 1))}
              y={padT}
              width={x(Math.min(maxX, horizon + 1)) - x(Math.max(minX, horizon - 1))}
              height={plotH}
              fill="#0ea5e9"
              opacity={0.08}
            />
            <text
              x={x(horizon)}
              y={padT + 12}
              textAnchor="middle"
              className="fill-sky-600"
              fontSize="11"
              fontWeight="600"
            >
              your horizon
            </text>
          </>
        )}

        {/* Gridlines + Y labels */}
        {tickVals.map((tv, t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(tv)}
              y2={y(tv)}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={y(tv) + 4}
              textAnchor="end"
              className="fill-ink-400"
              fontSize="10"
            >
              {usd(tv)}
            </text>
          </g>
        ))}

        {/* Zero baseline */}
        {minV < 0 && (
          <line
            x1={padL}
            x2={W - padR}
            y1={zeroY}
            y2={zeroY}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}

        {/* Break-even marker */}
        {breakEven && breakEven <= MAX_YEARS && (
          <g>
            <line
              x1={x(breakEven)}
              x2={x(breakEven)}
              y1={padT}
              y2={padT + plotH}
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <text
              x={x(breakEven)}
              y={padT + plotH + 22}
              textAnchor="middle"
              className="fill-indigo-600"
              fontSize="11"
              fontWeight="700"
            >
              break-even · yr {breakEven}
            </text>
          </g>
        )}

        {/* Rent line */}
        <polyline
          points={line("netRent")}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth={2.5}
        />
        {/* Buy line */}
        <polyline
          points={line("netBuy")}
          fill="none"
          stroke="#10b981"
          strokeWidth={2.5}
        />

        {/* X labels + hover dots */}
        {years.map((p) => (
          <g key={p.year}>
            {(p.year === 1 || p.year % 3 === 0) && (
              <text
                x={x(p.year)}
                y={H - 10}
                textAnchor="middle"
                className="fill-ink-400"
                fontSize="10"
              >
                {p.year}y
              </text>
            )}
            <circle cx={x(p.year)} cy={y(p.netRent)} r={6} fill="transparent">
              <title>{`Year ${p.year} · Rent: ${usd(p.netRent)}`}</title>
            </circle>
            <circle cx={x(p.year)} cy={y(p.netBuy)} r={6} fill="transparent">
              <title>{`Year ${p.year} · Buy: ${usd(p.netBuy)}`}</title>
            </circle>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 px-1 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-full bg-emerald-500" />
          Cumulative cost of buying
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-full bg-sky-500" />
          Cumulative cost of renting
        </span>
        <span className="text-ink-400">Lower line wins. Buying counts recovered equity.</span>
      </div>
    </div>
  );
}

/* ------------------------------- meter --------------------------------- */

function RiskMeter({ pct }: { pct: number }) {
  const band = riskBand(pct);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-800">Your immigration risk level</span>
        <span className="font-bold" style={{ color: band.color }}>
          {band.label}
        </span>
      </div>
      <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500">
        <div
          className="absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-ink-900 ring-2 ring-white"
          style={{ left: `calc(${Math.max(2, Math.min(98, pct))}% - 3px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-ink-400">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

/* ------------------------------- main ---------------------------------- */

export default function RentVsBuyImmigrantCalculator() {
  const [s, set] = useUrlState({
    // A — purchase
    price: "450000",
    down: "20",
    rate: "7.0",
    term: "30",
    closing: "3",
    proptax: "1.2",
    hoa: "0",
    ins: "150",
    maint: "1",
    appr: "3",
    selling: "6",
    // B — rental
    rent: "2200",
    rentinc: "4",
    rins: "20",
    deposit: "2200",
    // C — financial
    invret: "7",
    fed: "22",
    state: "5",
    // D — immigration
    visa: "H-1B",
    yrs: "3",
    i140: "no",
    renew: "Likely",
    gc: "5-10 years",
    // E — career
    jobstab: "Stable",
    reloc: "Possible",
    rentout: "no",
    pmfee: "10",
    // lens
    lens: "on",
  });

  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  const lensOn = s.lens === "on";
  const model = buildModel(s);
  const imm = deriveImmigration(s);
  const { standardBE } = model;

  const immigrantBE =
    standardBE === null ? null : standardBE + imm.riskPremiumYears;

  const horizon = lensOn ? imm.effectiveHorizon : MAX_YEARS;
  const activeBE = lensOn ? immigrantBE : standardBE;

  // Verdict
  type Verdict = "buy" | "close" | "rent";
  let verdict: Verdict;
  if (activeBE === null || activeBE > horizon) verdict = "rent";
  else if (activeBE <= horizon - 2) verdict = "buy";
  else verdict = "close";

  const verdictMeta = {
    buy: {
      emoji: "🟢",
      title: "Buying is likely the smarter move",
      accent: "from-emerald-500 to-teal-600",
      tone: "good" as const,
    },
    close: {
      emoji: "🟡",
      title: "It's close — depends on your risk tolerance",
      accent: "from-amber-500 to-orange-600",
      tone: "note" as const,
    },
    rent: {
      emoji: "🔴",
      title: "Renting wins for your situation",
      accent: "from-rose-500 to-red-600",
      tone: "bad" as const,
    },
  }[verdict];

  const band = riskBand(imm.riskPct);
  const monthlyDiff = model.monthlyBuy - model.monthlyRent;

  // Equity snapshot at the planning horizon (capped to chart range).
  const snapYear = Math.max(1, Math.min(MAX_YEARS, horizon));
  const snap = model.years[snapYear - 1];
  const equityBuilt = snap.endValue - snap.remaining;
  const txnCosts = num(s.price) * (num(s.closing) / 100) + snap.sellingCost;
  const netVsRent = snap.netRent - snap.netBuy;

  const verdictSubtext = lensOn
    ? `Given your ${s.visa} status with about ${num(s.yrs)} year${
        num(s.yrs) === 1 ? "" : "s"
      } of clarity and ${
        imm.relocRisk >= 0.6 ? "high" : imm.relocRisk >= 0.35 ? "some" : "low"
      } relocation risk, your reliable planning horizon is ~${horizon} years. ${
        activeBE === null
          ? "Buying never clears its costs within 15 years here."
          : `Buying breaks even around year ${activeBE} once immigration risk is priced in.`
      }`
    : `Ignoring immigration factors, buying breaks even around year ${
        standardBE ?? "15+"
      } — the textbook number a generic calculator would show.`;

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg leading-relaxed text-ink-600">
          Most rent vs. buy calculators were built for US citizens with a
          30-year horizon. They have no input for{" "}
          <em>&ldquo;my H-1B renewal isn&rsquo;t certain&rdquo;</em> or{" "}
          <em>&ldquo;I might move cities for my next job.&rdquo;</em> This one
          does. Enter your real situation and get a recommendation that accounts
          for the full picture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        {/* ---------------- Inputs ---------------- */}
        <div className="space-y-5">
          <Toggle
            on={lensOn}
            onChange={(v) => set("lens", v ? "on" : "off")}
            label="Immigrant Lens"
            hint={
              lensOn
                ? "ON — adjusting the break-even for your visa & relocation risk."
                : "OFF — showing the plain US-resident calculation."
            }
          />

          <Section title="🏠 Your home purchase">
            <NumberField label="Home price" value={s.price} onChange={(v) => set("price", v)} prefix="$" />
            <NumberField label="Down payment" value={s.down} onChange={(v) => set("down", v)} suffix="%" />
            <NumberField label="Mortgage interest rate" value={s.rate} onChange={(v) => set("rate", v)} suffix="%" step="0.1" />
            <SelectField
              label="Loan term"
              value={s.term}
              onChange={(v) => set("term", v)}
              options={[
                { value: "30", label: "30 years" },
                { value: "20", label: "20 years" },
                { value: "15", label: "15 years" },
              ]}
            />
            <NumberField label="Buying closing costs" value={s.closing} onChange={(v) => set("closing", v)} suffix="%" />
            <NumberField label="Property tax / year" value={s.proptax} onChange={(v) => set("proptax", v)} suffix="%" hint="As a % of home value." />
            <NumberField label="HOA fee / month" value={s.hoa} onChange={(v) => set("hoa", v)} prefix="$" />
            <NumberField label="Home insurance / month" value={s.ins} onChange={(v) => set("ins", v)} prefix="$" />
            <NumberField label="Maintenance / year" value={s.maint} onChange={(v) => set("maint", v)} suffix="%" hint="As a % of home value." />
            <NumberField label="Home appreciation / year" value={s.appr} onChange={(v) => set("appr", v)} suffix="%" />
            <NumberField label="Selling closing costs" value={s.selling} onChange={(v) => set("selling", v)} suffix="%" />
          </Section>

          <Section title="🔑 Your rental situation">
            <NumberField label="Monthly rent" value={s.rent} onChange={(v) => set("rent", v)} prefix="$" />
            <NumberField label="Annual rent increase" value={s.rentinc} onChange={(v) => set("rentinc", v)} suffix="%" />
            <NumberField label="Renter's insurance / month" value={s.rins} onChange={(v) => set("rins", v)} prefix="$" />
            <NumberField label="Security deposit" value={s.deposit} onChange={(v) => set("deposit", v)} prefix="$" />
          </Section>

          <Section title="📈 Your financial profile">
            <NumberField label="Investment return if renting" value={s.invret} onChange={(v) => set("invret", v)} suffix="%" hint="Return on the cash you'd otherwise tie up." />
            <SelectField
              label="Federal marginal tax rate"
              value={s.fed}
              onChange={(v) => set("fed", v)}
              options={["10", "12", "22", "24", "32", "35", "37"].map((r) => ({ value: r, label: `${r}%` }))}
            />
            <NumberField label="State marginal tax rate" value={s.state} onChange={(v) => set("state", v)} suffix="%" />
          </Section>

          <Section
            title="🛂 Immigration & visa profile"
            note="These inputs are unique to our calculator. They adjust the break-even for the real uncertainty in your immigration path."
          >
            <SelectField
              label="Current visa type"
              value={s.visa}
              onChange={(v) => set("visa", v)}
              options={["H-1B", "L-1", "O-1", "F-1 OPT", "EAD", "GC", "Citizen", "Other"].map((v) => ({ value: v, label: v === "GC" ? "Green Card" : v }))}
            />
            <NumberField
              label="Years of clarity on current status"
              value={s.yrs}
              onChange={(v) => set("yrs", v)}
              suffix="yrs"
              hint="How many years you can be confident you'll stay (0–10)."
            />
            <YesNoField label="I-140 approved?" value={s.i140} onChange={(v) => set("i140", v)} />
            <SelectField
              label="Visa renewal confidence"
              value={s.renew}
              onChange={(v) => set("renew", v)}
              options={["Very likely", "Likely", "Uncertain", "Unlikely"].map((v) => ({ value: v, label: v }))}
            />
            <SelectField
              label="Green card timeline estimate"
              value={s.gc}
              onChange={(v) => set("gc", v)}
              options={["Already have GC", "Under 2 years", "2-5 years", "5-10 years", "10+ years", "Unknown"].map((v) => ({ value: v, label: v }))}
            />
          </Section>

          <Section
            title="💼 Career & relocation risk"
            note="The biggest risk most calculators ignore: you might move cities for your next job. Factor that in here."
          >
            <SelectField
              label="Job stability"
              value={s.jobstab}
              onChange={(v) => set("jobstab", v)}
              options={["Very stable", "Stable", "Some uncertainty", "High uncertainty"].map((v) => ({ value: v, label: v }))}
            />
            <SelectField
              label="Likelihood of relocating in 5 years"
              value={s.reloc}
              onChange={(v) => set("reloc", v)}
              options={["Very unlikely", "Possible", "Likely", "Very likely"].map((v) => ({ value: v, label: v }))}
            />
            <YesNoField label="If you relocate, would you rent the home out?" value={s.rentout} onChange={(v) => set("rentout", v)} />
            <NumberField label="Property management fee" value={s.pmfee} onChange={(v) => set("pmfee", v)} suffix="%" hint="Of monthly rent, if you rent it out." />
          </Section>
        </div>

        {/* ---------------- Results ---------------- */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Verdict banner */}
          <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${verdictMeta.accent} p-6 text-white shadow-card`}>
            <p className="text-3xl">{verdictMeta.emoji}</p>
            <h3 className="mt-1 text-2xl font-extrabold leading-tight">
              {verdictMeta.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              {verdictSubtext}
            </p>
          </div>

          {/* Break-even callout */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Standard break-even
              </p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">
                {standardBE ? `${standardBE} yrs` : "15+ yrs"}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">Ignoring immigration</p>
            </div>
            <div className={`rounded-2xl border p-4 shadow-card ${lensOn ? "border-emerald-200 bg-emerald-50/60" : "border-ink-900/5 bg-white opacity-60"}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Immigrant-adjusted
              </p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">
                {immigrantBE === null || immigrantBE > MAX_YEARS ? "15+ yrs" : `${immigrantBE} yrs`}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                +{imm.riskPremiumYears}y risk premium
              </p>
            </div>
          </div>

          {/* Monthly cost comparison */}
          <ResultPanel title="Monthly cost comparison" accent="from-sky-500 to-blue-600">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Cost of buying / mo" value={usd(model.monthlyBuy)} />
              <Stat label="Cost of renting / mo" value={usd(model.monthlyRent)} />
            </div>
            <Callout tone={monthlyDiff > 0 ? "note" : "good"}>
              Buying costs <strong>{usd(Math.abs(monthlyDiff))}</strong>{" "}
              {monthlyDiff > 0 ? "more" : "less"} per month than renting (all-in,
              after the mortgage-interest tax deduction).
            </Callout>
          </ResultPanel>

          {/* Chart */}
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-400">
              Year-by-year cost
            </p>
            <BreakEvenChart
              years={model.years}
              breakEven={lensOn ? immigrantBE : standardBE}
              horizon={horizon}
              showHorizon={lensOn}
            />
          </div>

          {/* Visa risk meter */}
          {lensOn && (
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
              <RiskMeter pct={imm.riskPct} />
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {band.label === "Very Low" &&
                  "Your status is settled. Buy on the financial merits alone — visa risk barely moves your math."}
                {band.label === "Low" &&
                  "Your path is reasonably secure. Buying is on the table if the EMI is near rent and you'll stay in this metro."}
                {band.label === "Elevated" &&
                  "There's real uncertainty in your horizon. Lean toward a modest, parity-priced home you could rent out — and pad your emergency fund first."}
                {band.label === "High" &&
                  "Your reliable horizon is short. A forced sale in a soft market is the main danger — renting and investing the difference is usually safer."}
              </p>
            </div>
          )}

          {/* Equity snapshot */}
          <ResultPanel title={`If you buy and sell in ${snapYear} years`} accent="from-amber-500 to-orange-600">
            <Row label="Equity built" value={usd(equityBuilt)} />
            <Row label="Transaction costs paid" value={usd(txnCosts)} />
            <Row
              label="Net gain/loss vs. renting"
              value={`${netVsRent >= 0 ? "+" : "−"}${usd(Math.abs(netVsRent))}`}
            />
          </ResultPanel>

          {/* Assumptions */}
          <div className="rounded-2xl border border-ink-900/5 bg-white shadow-card">
            <button
              type="button"
              onClick={() => setAssumptionsOpen((o) => !o)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-ink-800"
            >
              Key assumptions
              <span className="text-ink-400">{assumptionsOpen ? "−" : "+"}</span>
            </button>
            {assumptionsOpen && (
              <div className="border-t border-ink-900/5 px-5 py-4 text-sm text-ink-600">
                <ul className="space-y-1.5">
                  <li>Mortgage P&amp;I of <strong>{usd(model.payment)}/mo</strong> over a {num(s.term)}-year term.</li>
                  <li>Down payment + closing costs are invested at {num(s.invret)}% if you rent.</li>
                  <li>Mortgage-interest and property-tax deductions applied at {num(s.fed) + num(s.state)}% combined, SALT capped at $10k/yr.</li>
                  <li>Home appreciates {num(s.appr)}%/yr; rent rises {num(s.rentinc)}%/yr.</li>
                  <li>The Immigrant Lens caps your planning horizon at ~{imm.effectiveHorizon} years and adds a {imm.riskPremiumYears}-year break-even risk premium.</li>
                  <li>Estimates only — excludes PMI, local market swings, and PITI escrow nuances.</li>
                </ul>
              </div>
            )}
          </div>

          <ResultActions
            title="Rent vs Buy for immigrants"
            shareText={`This immigrant rent-vs-buy calculator says: ${verdictMeta.title.toLowerCase()}`}
            fileName="rent-vs-buy-immigrant"
            rows={[
              { label: "Verdict", value: verdictMeta.title },
              { label: "Standard break-even", value: standardBE ? `${standardBE} yrs` : "15+ yrs" },
              { label: "Immigrant-adjusted", value: immigrantBE && immigrantBE <= MAX_YEARS ? `${immigrantBE} yrs` : "15+ yrs" },
              { label: "Planning horizon", value: `${horizon} yrs` },
              { label: "Visa risk", value: band.label },
            ]}
          />
        </div>
      </div>

      {/* Why different */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-ink-900">
          Why this calculator is different
        </h2>
        <p className="mt-3 text-[1.0625rem] leading-8 text-ink-700">
          Standard calculators assume you&rsquo;ll stay. For immigrants, that
          assumption is the single biggest error in the math. We built this tool
          after noticing that visa holders face three unique risks that shift the
          break-even point significantly: <strong>(1)</strong> visa uncertainty
          shortens your reliable horizon, <strong>(2)</strong> the cultural pull
          toward buying a bigger home than you need increases your downside
          exposure, and <strong>(3)</strong> career-driven relocation is far more
          common in immigrant professional paths than in the general US
          population. Factor in all three, and the math looks very different.
        </p>
        <p className="mt-3 text-sm text-ink-500">
          For the full framework — including which home to buy and when — read{" "}
          <a href="/articles/rent-vs-buy-house-immigrants" className="font-medium text-brand-600 underline">
            Rent vs. Buy a US Home: the visa-holder&rsquo;s real math
          </a>
          .
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- input section ---------------------------- */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-6">
      <p className="text-sm font-bold text-ink-900">{title}</p>
      {note && <p className="mt-1 text-xs leading-relaxed text-ink-500">{note}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
