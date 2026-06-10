"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sparkline from "@/components/tools/Sparkline";
import DataStamp from "@/components/tools/DataStamp";
import ResultActions from "@/components/ResultActions";
import {
  bulletin,
  CATEGORY_SHORT,
  COUNTRY_LABELS,
  estimateWait,
  expandSeries,
  formatCutoff,
  formatMonths,
  getSeries,
  isCurrent,
  type BulletinCountry,
  type EbCategory,
} from "@/lib/visa-bulletin";
import {
  inventoryMeta,
  peopleAhead,
  type AheadResult,
} from "@/lib/i485-inventory";

/** Debounce a fast-changing value (date typing) before re-estimating. */
function useDebounced<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const CATEGORY_OPTIONS: { value: EbCategory; label: string }[] = [
  { value: "eb1", label: "EB-1" },
  { value: "eb2", label: "EB-2" },
  { value: "eb3", label: "EB-3" },
  { value: "eb5", label: "EB-5" },
];

const COUNTRY_OPTIONS: { value: BulletinCountry; label: string }[] = [
  { value: "india", label: "India" },
  { value: "china", label: "China (mainland)" },
  { value: "row", label: "All other countries" },
];

const selectClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

function WaitVerdict({
  estimate,
  compact,
}: {
  estimate: ReturnType<typeof estimateWait>;
  compact?: boolean;
}) {
  const big = compact ? "text-xl" : "text-3xl sm:text-4xl";
  switch (estimate.status) {
    case "current":
      return (
        <div>
          <p className={`font-extrabold tracking-tight text-emerald-600 ${big}`}>
            Your date is current 🎉
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Your priority date is earlier than the Final Action Date — your
            green card can be approved as soon as your case is otherwise ready.
          </p>
        </div>
      );
    case "estimate": {
      const opt = formatMonths(estimate.optimisticMonths!);
      const pess = estimate.capped
        ? "25+ years"
        : formatMonths(estimate.pessimisticMonths!);
      return (
        <div>
          <p className={`font-extrabold tracking-tight text-ink-900 ${big}`}>
            ≈ {opt} – {pess}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Estimated remaining wait, projecting the cutoff&apos;s average
            movement over the last ~30 bulletins ahead. Retrogression can
            reverse progress at any time.
          </p>
        </div>
      );
    }
    case "stalled":
      return (
        <div>
          <p className={`font-extrabold tracking-tight text-amber-600 ${big}`}>
            Movement has stalled
          </p>
          <p className="mt-1 text-xs text-ink-500">
            This cutoff has barely moved recently, so any projected date would
            be misleading. At the current pace the wait is effectively
            open-ended (decades) unless the law or demand changes.
          </p>
        </div>
      );
    case "retrogressing":
      return (
        <div>
          <p className={`font-extrabold tracking-tight text-rose-600 ${big}`}>
            Currently retrogressing
          </p>
          <p className="mt-1 text-xs text-ink-500">
            This cutoff moved backwards in the past year. No honest forward
            projection is possible — watch the next few bulletins.
          </p>
        </div>
      );
    default:
      return (
        <p className="text-sm text-ink-500">
          Not enough historical data to project this category yet.
        </p>
      );
  }
}

/** Provenance + plain caveats shown beneath every "place in line" number. */
function SnapshotCaveat({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-2 text-[11px] text-ink-400">
        Snapshot: {inventoryMeta.snapshotDate} · Source: USCIS — a place in
        line, not a wait time.
      </p>
    );
  }
  return (
    <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-ink-400">
      <p>
        Snapshot: {inventoryMeta.snapshotDate} (published{" "}
        {inventoryMeta.publishedDate}) · Source: {inventoryMeta.sourceLabel}.
        USCIS publishes this in batches, lagging the snapshot date.
      </p>
      <p>
        Counts only people who have{" "}
        <strong className="text-ink-500">already filed Form I-485</strong>, so it
        understates total demand — many with current or future dates
        haven&apos;t filed, and the oldest/most-recent priority dates are grouped
        together. It is a{" "}
        <strong className="text-ink-500">place in line, not a wait time</strong>;
        retrogression or policy changes can change everything.
      </p>
      {inventoryMeta.todo && (
        <p>
          Seeded figures pending cell-by-cell verification against the official
          USCIS spreadsheet.
        </p>
      )}
    </div>
  );
}

/** The concrete "how many people are ahead of you" headline panel. */
function PlaceInLine({
  ahead,
  category,
  country,
  priorityDate,
  compact,
}: {
  ahead: AheadResult;
  category: EbCategory;
  country: BulletinCountry;
  priorityDate: string;
  compact?: boolean;
}) {
  const [showCp, setShowCp] = useState(false);
  const big = compact ? "text-3xl" : "text-4xl sm:text-5xl";
  const cat = CATEGORY_SHORT[category];
  const co = COUNTRY_LABELS[country];
  const num = (n: number) => n.toLocaleString("en-US");

  if (ahead.status === "unsupported") {
    if (compact) return null;
    return (
      <div className="rounded-2xl border border-ink-900/5 bg-[#fafafa] p-4 text-sm text-ink-500">
        USCIS doesn&apos;t break out {cat} {co} in the pending I-485 inventory
        report, so a &ldquo;people ahead of you&rdquo; count isn&apos;t
        available for this selection.
      </div>
    );
  }

  if (ahead.status === "not-listed") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
        <p className="text-sm font-bold text-ink-900">
          No I-485 line position yet
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-700">
          USCIS does not yet list {ahead.year} priority dates for {cat} {co}{" "}
          because Dates for Filing hasn&apos;t reached it — you cannot file Form
          I-485 yet, so you are not counted in this inventory. The most recent
          priority year listed is {ahead.maxYear}.
        </p>
        <SnapshotCaveat compact={compact} />
      </div>
    );
  }

  if (ahead.status === "grouped") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Oldest grouped cohort
        </p>
        <p className={`mt-1 font-extrabold tracking-tight text-brand-700 ${big}`}>
          {num(ahead.bucketCount)}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-700">
          Your {ahead.year} priority date falls inside USCIS&apos;s grouped
          &ldquo;{ahead.bucketLabel}&rdquo; bucket of {num(ahead.bucketCount)}{" "}
          {cat} {co} applicants. USCIS doesn&apos;t break this oldest cohort down
          further, so we can&apos;t separate exactly how many are ahead of you
          within it.
        </p>
        <SnapshotCaveat compact={compact} />
      </div>
    );
  }

  // status: "ok"
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
        People ahead of you in line
      </p>
      <p className={`mt-1 font-extrabold tracking-tight text-brand-700 ${big}`}>
        ~{num(ahead.ahead)}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-700">
        As of {inventoryMeta.snapshotDate}, about{" "}
        <strong className="font-semibold text-ink-900">{num(ahead.ahead)}</strong>{" "}
        {co} {cat} applicants have earlier priority dates than yours (
        {formatCutoff(priorityDate)}) in the pending I-485 inventory.
        {ahead.sameYear > 0 && (
          <>
            {" "}
            Another ~{num(ahead.sameYear)} share your {ahead.sameYearLabel}{" "}
            priority year (USCIS doesn&apos;t split this by month).
          </>
        )}
      </p>

      {!compact && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowCp((v) => !v)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {showCp ? "− Hide" : "+ Include estimated consular cases"}
          </button>
          {showCp && (
            <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs leading-relaxed text-ink-600">
              Counting estimated consular-processing cases too, your approximate
              overall place in line is{" "}
              <strong className="font-semibold text-ink-900">
                ~{num(ahead.overallEstimate)}
              </strong>
              . {inventoryMeta.cpRatioNote}
            </p>
          )}
        </div>
      )}

      <SnapshotCaveat compact={compact} />
    </div>
  );
}

export default function GreenCardEstimator({
  variant = "full",
}: {
  variant?: "mini" | "full";
}) {
  const [category, setCategory] = useState<EbCategory>("eb2");
  const [country, setCountry] = useState<BulletinCountry>("india");
  const [priorityDate, setPriorityDate] = useState("2019-06-01");
  const debouncedDate = useDebounced(priorityDate);

  const compact = variant === "mini";

  // URL state — full variant only (the mini variant lives on the homepage and
  // must not rewrite "/" with query params). Lets a shared link reopen the
  // same category/country/priority date.
  useEffect(() => {
    if (compact) return;
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("cat");
    const co = sp.get("country");
    const pd = sp.get("pd");
    if (c) setCategory(c as EbCategory);
    if (co) setCountry(co as BulletinCountry);
    if (pd && /^\d{4}-\d{2}-\d{2}$/.test(pd)) setPriorityDate(pd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact]);

  useEffect(() => {
    if (compact) return;
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (category !== "eb2") sp.set("cat", category);
      if (country !== "india") sp.set("country", country);
      sp.set("pd", priorityDate);
      window.history.replaceState(null, "", `${window.location.pathname}?${sp.toString()}`);
    }, 400);
    return () => clearTimeout(t);
  }, [compact, category, country, priorityDate]);

  const estimate = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(debouncedDate)) return null;
    return estimateWait(debouncedDate, category, country);
  }, [debouncedDate, category, country]);

  const ahead = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(debouncedDate)) return null;
    return peopleAhead(category, country, debouncedDate);
  }, [debouncedDate, category, country]);

  const sparkPoints = useMemo(() => {
    const series = getSeries(category, country);
    if (!series) return null;
    return expandSeries(series.fad);
  }, [category, country]);

  const inputs = (
    <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-3"}>
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EbCategory)}
          className={`mt-1 ${selectClass}`}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">
          Country of birth
        </span>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as BulletinCountry)}
          className={`mt-1 ${selectClass}`}
        >
          {COUNTRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className={`block ${compact ? "col-span-2" : ""}`}>
        <span className="text-xs font-semibold text-ink-800">
          Your priority date
        </span>
        <input
          type="date"
          value={priorityDate}
          onChange={(e) => setPriorityDate(e.target.value)}
          className={`mt-1 ${selectClass}`}
        />
      </label>
    </div>
  );

  const results = estimate && (
    <div className={compact ? "mt-4 space-y-3" : "mt-6 space-y-5"}>
      {ahead && (
        <PlaceInLine
          ahead={ahead}
          category={category}
          country={country}
          priorityDate={debouncedDate}
          compact={compact}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-4">
        <div>
          <p className="text-xs text-ink-400">
            {CATEGORY_SHORT[category]} {COUNTRY_LABELS[country]} — Final Action
            Date ({bulletin.month})
          </p>
          <p className="text-lg font-bold text-ink-900">
            {formatCutoff(estimate.fad)}
          </p>
          {!isCurrent(estimate.fad) && estimate.monthsBehind > 0 && (
            <p className="text-xs text-ink-500">
              Your date is {formatMonths(estimate.monthsBehind)} behind the
              cutoff
            </p>
          )}
        </div>
        {sparkPoints && (
          <div className="text-right">
            <Sparkline points={sparkPoints} />
            <p className="text-[10px] text-ink-400">cutoff movement, 3 yrs</p>
          </div>
        )}
      </div>

      <WaitVerdict estimate={estimate} compact={compact} />

      <p
        className={`rounded-xl px-3 py-2 text-xs font-medium ${
          estimate.canFileI485
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {estimate.canFileI485
          ? "✓ Dates for Filing: you could submit an I-485 now (in months USCIS accepts the filing chart)."
          : "✗ Dates for Filing: your priority date is not yet eligible to file an I-485."}
      </p>

      <p className="text-[11px] leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">
          Estimate only — not legal advice.
        </strong>{" "}
        Projections assume past bulletin movement continues; retrogression,
        demand spikes, and policy changes can change everything. Never plan
        around a single date.
      </p>
    </div>
  );

  if (compact) {
    return (
      <div className="relative rounded-3xl border border-ink-900/5 bg-white p-5 shadow-card-hover sm:p-6">
        <div className="flex items-center justify-between border-b border-ink-900/5 pb-4">
          <div>
            <p className="text-sm font-bold text-ink-900">
              Green card wait estimator
            </p>
            <p className="text-xs text-ink-400">
              {bulletin.sourceLabel.replace("U.S. Department of State ", "")}
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 text-sm font-extrabold text-white">
            N
          </span>
        </div>
        <div className="mt-4">{inputs}</div>
        {results}
        <Link
          href="/tools/green-card-tracker"
          className="mt-4 block rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Open full tracker →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      <p className="mb-5 text-xs font-bold uppercase tracking-wider text-ink-400">
        Estimate your wait
      </p>
      {inputs}
      {results}
      {estimate && (
        <div className="mt-5">
          <ResultActions
            title={`Green card line — ${CATEGORY_SHORT[category]} ${COUNTRY_LABELS[country]}`}
            shareText={
              ahead?.status === "ok"
                ? `~${ahead.ahead.toLocaleString("en-US")} people are ahead of me in the ${CATEGORY_SHORT[category]} ${COUNTRY_LABELS[country]} green card line:`
                : `My ${CATEGORY_SHORT[category]} ${COUNTRY_LABELS[country]} green card wait estimate:`
            }
            fileName="green-card-place-in-line"
            footnote="Place in line from USCIS I-485 inventory — not a wait time, not legal advice. nritousa.com"
            rows={[
              ...(ahead?.status === "ok"
                ? [
                    {
                      label: `People ahead (I-485, as of ${inventoryMeta.snapshotDate})`,
                      value: `~${ahead.ahead.toLocaleString("en-US")}`,
                    },
                  ]
                : []),
              { label: "Category", value: `${CATEGORY_SHORT[category]} · ${COUNTRY_LABELS[country]}` },
              { label: "Priority date", value: priorityDate },
              { label: `Final Action Date (${bulletin.month})`, value: formatCutoff(estimate.fad) },
            ]}
          />
        </div>
      )}
      <DataStamp
        className="mt-5 border-t border-ink-900/5 pt-4"
        lastUpdated={bulletin.lastUpdated}
        source={bulletin.source}
        sourceLabel={bulletin.sourceLabel}
      />
    </div>
  );
}
