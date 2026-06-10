"use client";

import { useEffect, useMemo, useState } from "react";
import DataStamp from "@/components/tools/DataStamp";
import ResultActions from "@/components/ResultActions";
import lottery from "../../../data/h1b-lottery-timeline.json";

/* ----------------------------- data shapes ------------------------------ */

interface Cycle {
  fiscalYear: number;
  label: string;
  registrationStart: string;
  registrationEnd: string;
  selectionBy: string;
  filingStart: string;
  filingEnd: string;
  secondRoundStart: string;
  secondRoundEnd: string;
  startDate: string;
  registrationFee: number;
  registrations: number | null;
  selected: number | null;
  todo?: boolean;
  todoNote?: string;
}

interface Phase {
  id: string;
  label: string;
  icon: string;
  rangeKeys: string[];
  typical: string;
  whatToDo: string[];
  pitfalls: string[];
  appliesWhenNotSelected?: boolean;
}

type Stage = "registering" | "selected" | "not-selected";
type Cap = "regular" | "masters";
type Employment = "cap-subject" | "cap-exempt";

const cycles = lottery.cycles as Cycle[];
const phases = lottery.phases as Phase[];

/* ------------------------------ date utils ------------------------------ */

/** Parse an ISO date as local noon (avoids off-by-one from TZ). */
function d(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day, 12, 0, 0, 0);
}

const fmt = (iso: string) =>
  d(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/** Range for a phase: [start, end] ISO strings from its rangeKeys. */
function phaseRange(phase: Phase, cycle: Cycle): [string, string] {
  const vals = phase.rangeKeys.map((k) => (cycle as unknown as Record<string, string>)[k]);
  return [vals[0], vals[vals.length - 1]];
}

type PhaseStatus = "done" | "active" | "upcoming";

function statusOf(start: string, end: string, today: Date): PhaseStatus {
  if (today > d(end)) return "done";
  if (today >= d(start)) return "active";
  return "upcoming";
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

/* -------------------------------- styles -------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const STAGE_OPTIONS: { value: Stage; label: string }[] = [
  { value: "registering", label: "Registering / waiting for results" },
  { value: "selected", label: "I've been selected" },
  { value: "not-selected", label: "Not selected (yet)" },
];

const CAP_OPTIONS: { value: Cap; label: string }[] = [
  { value: "regular", label: "Regular cap (bachelor's)" },
  { value: "masters", label: "Advanced-degree (US master's)" },
];

const EMP_OPTIONS: { value: Employment; label: string }[] = [
  { value: "cap-subject", label: "Cap-subject employer" },
  { value: "cap-exempt", label: "Cap-exempt (university / nonprofit research)" },
];

const STATUS_DOT: Record<PhaseStatus, string> = {
  done: "bg-emerald-500 border-emerald-500",
  active: "bg-brand-600 border-brand-600 ring-4 ring-brand-600/20",
  upcoming: "bg-white border-ink-900/20",
};

const STATUS_LABEL: Record<PhaseStatus, string> = {
  done: "Done",
  active: "Happening now",
  upcoming: "Upcoming",
};

const STATUS_BADGE: Record<PhaseStatus, string> = {
  done: "bg-emerald-50 text-emerald-700",
  active: "bg-brand-100 text-brand-700",
  upcoming: "bg-ink-900/5 text-ink-500",
};

/* ------------------------------ component -------------------------------- */

export default function H1bLotteryTimeline() {
  const [fy, setFy] = useState<number>(lottery.currentFiscalYear);
  const [stage, setStage] = useState<Stage>("registering");
  const [cap, setCap] = useState<Cap>("regular");
  const [employment, setEmployment] = useState<Employment>("cap-subject");
  const [open, setOpen] = useState<string | null>(null);
  // Re-render once on mount so the date-relative "now" math runs client-side.
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  // Hydrate state from the URL so a shared link reopens the same scenario.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const qfy = Number(sp.get("fy"));
    if (cycles.some((c) => c.fiscalYear === qfy)) setFy(qfy);
    const qs = sp.get("stage");
    if (STAGE_OPTIONS.some((o) => o.value === qs)) setStage(qs as Stage);
    const qc = sp.get("cap");
    if (qc === "regular" || qc === "masters") setCap(qc);
    const qe = sp.get("emp");
    if (qe === "cap-subject" || qe === "cap-exempt") setEmployment(qe);
  }, []);

  // Mirror state into the URL (debounced) for share/copy-link.
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (fy !== lottery.currentFiscalYear) sp.set("fy", String(fy));
      if (stage !== "registering") sp.set("stage", stage);
      if (cap !== "regular") sp.set("cap", cap);
      if (employment !== "cap-subject") sp.set("emp", employment);
      const qs = sp.toString();
      window.history.replaceState(
        null,
        "",
        qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      );
    }, 350);
    return () => clearTimeout(t);
  }, [fy, stage, cap, employment]);

  const cycle = useMemo(
    () => cycles.find((c) => c.fiscalYear === fy) ?? cycles[0],
    [fy]
  );

  // Phases visible for this scenario. Second round only matters if the user
  // isn't already selected.
  const visiblePhases = useMemo(
    () =>
      phases.filter(
        (p) => !(p.appliesWhenNotSelected && stage === "selected")
      ),
    [stage]
  );

  const rows = useMemo(
    () =>
      visiblePhases.map((p) => {
        const [start, end] = phaseRange(p, cycle);
        return { phase: p, start, end };
      }),
    [visiblePhases, cycle]
  );

  // Date-relative status + countdown — only after mount (today set).
  const computed = useMemo(() => {
    if (!today) return null;
    const withStatus = rows.map((r) => ({
      ...r,
      status: statusOf(r.start, r.end, today),
    }));
    // Next upcoming key date across all phase boundaries.
    const upcomingDates: { iso: string; label: string }[] = [];
    for (const r of rows) {
      for (const k of r.phase.rangeKeys) {
        const iso = (cycle as unknown as Record<string, string>)[k];
        if (d(iso) > today) upcomingDates.push({ iso, label: r.phase.label });
      }
    }
    upcomingDates.sort((a, b) => d(a.iso).getTime() - d(b.iso).getTime());
    const next = upcomingDates[0] ?? null;
    return { withStatus, next };
  }, [rows, cycle, today]);

  /* ----- status-card headline derived from the user's stage + date ----- */

  const statusCard = useMemo(() => {
    if (employment === "cap-exempt") {
      return {
        tone: "emerald",
        title: "No lottery applies to you",
        body: lottery.capExempt.summary,
      };
    }
    switch (stage) {
      case "selected":
        return {
          tone: "brand",
          title: "You're selected — now it's a filing race",
          body: `File the I-129 within your window (by ${fmt(
            cycle.filingEnd
          )}) and decide on premium processing. Your earliest start date is ${fmt(
            cycle.startDate
          )}.`,
        };
      case "not-selected":
        return {
          tone: "amber",
          title: "Not selected in the first round",
          body: `Your registration stays in the pool. If USCIS doesn't reach the cap, a second round can run between ${fmt(
            cycle.secondRoundStart
          )} and ${fmt(cycle.secondRoundEnd)}. Keep your documents ready.`,
        };
      default:
        return {
          tone: "brand",
          title:
            cap === "masters"
              ? "Registered with the master's-cap advantage"
              : "Registered — waiting on the lottery",
          body:
            cap === "masters"
              ? `You get two draws: the regular 65,000 pool first, then the extra 20,000 advanced-degree pool. Selections are posted by ${fmt(
                  cycle.selectionBy
                )}.`
              : `Selections are posted by ${fmt(
                  cycle.selectionBy
                )}. Watch your employer's USCIS account for a "Selected" status.`,
        };
    }
  }, [stage, cap, employment, cycle]);

  const TONE: Record<string, string> = {
    brand: "border-brand-200 bg-brand-50/60",
    emerald: "border-emerald-200 bg-emerald-50/60",
    amber: "border-amber-200 bg-amber-50/70",
  };

  const odds =
    cycle.registrations && cycle.selected
      ? Math.round((cycle.selected / cycle.registrations) * 100)
      : null;

  /* -------------------------------- intake ------------------------------- */

  const intake = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">Cap cycle</span>
        <select
          value={fy}
          onChange={(e) => setFy(Number(e.target.value))}
          className={`mt-1 ${fieldClass}`}
        >
          {cycles.map((c) => (
            <option key={c.fiscalYear} value={c.fiscalYear}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">
          Where are you?
        </span>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as Stage)}
          className={`mt-1 ${fieldClass}`}
          disabled={employment === "cap-exempt"}
        >
          {STAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">Cap type</span>
        <select
          value={cap}
          onChange={(e) => setCap(e.target.value as Cap)}
          className={`mt-1 ${fieldClass}`}
          disabled={employment === "cap-exempt"}
        >
          {CAP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-ink-800">Employer type</span>
        <select
          value={employment}
          onChange={(e) => setEmployment(e.target.value as Employment)}
          className={`mt-1 ${fieldClass}`}
        >
          {EMP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  /* ----------------------------- cap-exempt view ----------------------------- */

  if (employment === "cap-exempt") {
    return (
      <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
        {intake}
        <div className={`mt-6 rounded-2xl border p-5 ${TONE.emerald}`}>
          <h3 className="text-lg font-bold text-ink-900">
            {statusCard.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">
            {statusCard.body}
          </p>
          <ul className="mt-4 space-y-2">
            {lottery.capExempt.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-ink-700">
                <span aria-hidden className="mt-0.5 text-emerald-600">
                  ✓
                </span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <DataStamp
          className="mt-5 border-t border-ink-900/5 pt-4"
          lastUpdated={lottery.lastUpdated}
          source={lottery.source}
          sourceLabel={lottery.sourceLabel}
        />
      </div>
    );
  }

  /* ------------------------------- main view ------------------------------- */

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
      {intake}

      {/* Status + countdown */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className={`rounded-2xl border p-5 md:col-span-2 ${TONE[statusCard.tone]}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Where you are now
          </p>
          <h3 className="mt-1 text-lg font-bold text-ink-900">
            {statusCard.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">
            {statusCard.body}
          </p>
        </div>
        <div className="rounded-2xl border border-ink-900/5 bg-[#fafafa] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Next key date
          </p>
          {!computed ? (
            <p className="mt-1 text-sm text-ink-400">Calculating…</p>
          ) : computed.next ? (
            <>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">
                {Math.max(0, daysBetween(today!, d(computed.next.iso)))} days
              </p>
              <p className="text-sm text-ink-600">
                until {computed.next.label.toLowerCase()}
              </p>
              <p className="mt-1 text-xs text-ink-400">
                {fmt(computed.next.iso)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-ink-500">
              All key dates for this cycle have passed.
            </p>
          )}
        </div>
      </div>

      {odds !== null && (
        <p className="mt-4 rounded-xl bg-ink-900/5 px-4 py-2.5 text-xs text-ink-600">
          <strong className="font-semibold text-ink-800">
            FY{cycle.fiscalYear} odds:
          </strong>{" "}
          ~{cycle.selected!.toLocaleString("en-US")} selected from{" "}
          {cycle.registrations!.toLocaleString("en-US")} eligible registrations
          (~{odds}% per registration).{" "}
          {cycle.todo && (
            <span className="text-ink-400">Figures pending verification.</span>
          )}
        </p>
      )}

      {/* Timeline */}
      <ol className="relative mt-8 space-y-3 border-l-2 border-ink-900/10 pl-6">
        {(computed?.withStatus ?? rows.map((r) => ({ ...r, status: "upcoming" as PhaseStatus }))).map(
          ({ phase, start, end, status }) => {
            const isOpen = open === phase.id;
            const single = phase.rangeKeys.length === 1 || start === end;
            return (
              <li key={phase.id} className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-[31px] top-3 h-4 w-4 rounded-full border-2 ${STATUS_DOT[status]}`}
                />
                <div
                  className={`rounded-2xl border bg-white transition-colors ${
                    status === "active"
                      ? "border-brand-300 shadow-card"
                      : "border-ink-900/5"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : phase.id)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span aria-hidden className="text-xl">
                      {phase.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-ink-900">
                          {phase.label}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE[status]}`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-500">
                        {single ? fmt(start) : `${fmt(start)} – ${fmt(end)}`}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`flex-none text-ink-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-ink-900/5 px-4 py-4 text-sm">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Typical timing
                      </p>
                      <p className="mt-1 text-ink-600">{phase.typical}</p>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
                        What to do
                      </p>
                      <ul className="mt-1 space-y-1.5">
                        {phase.whatToDo.map((w) => (
                          <li key={w} className="flex gap-2 text-ink-700">
                            <span aria-hidden className="mt-0.5 text-brand-600">
                              ✓
                            </span>
                            <span className="leading-relaxed">{w}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Common pitfalls
                      </p>
                      <ul className="mt-1 space-y-1.5">
                        {phase.pitfalls.map((w) => (
                          <li key={w} className="flex gap-2 text-ink-700">
                            <span aria-hidden className="mt-0.5 text-amber-600">
                              ⚠
                            </span>
                            <span className="leading-relaxed">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          }
        )}
      </ol>

      {cycle.todo && (
        <p className="mt-5 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-2.5 text-xs text-ink-600">
          Dates for FY{cycle.fiscalYear} follow USCIS&apos;s usual cap-season
          pattern and are pending verification against the official USCIS
          announcement. Always confirm exact dates on{" "}
          <a
            href={lottery.source}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 underline"
          >
            uscis.gov
          </a>
          .
        </p>
      )}

      <div className="mt-6">
        <ResultActions
          title={`My H-1B FY${cycle.fiscalYear} timeline`}
          shareText={`My H-1B FY${cycle.fiscalYear} cap timeline & next key date:`}
          fileName={`h1b-timeline-fy${cycle.fiscalYear}`}
          footnote="Educational timeline only — not legal advice. nritousa.com"
          rows={[
            { label: "Cap cycle", value: `FY ${cycle.fiscalYear}` },
            {
              label: "Stage",
              value: STAGE_OPTIONS.find((o) => o.value === stage)!.label,
            },
            {
              label: "Cap type",
              value: cap === "masters" ? "Advanced-degree" : "Regular",
            },
            { label: "Registration window", value: `${fmt(cycle.registrationStart)} – ${fmt(cycle.registrationEnd)}` },
            { label: "Earliest start date", value: fmt(cycle.startDate) },
            ...(computed?.next
              ? [{ label: "Next key date", value: `${computed.next.label} · ${fmt(computed.next.iso)}` }]
              : []),
          ]}
        />
      </div>

      <DataStamp
        className="mt-5 border-t border-ink-900/5 pt-4"
        lastUpdated={lottery.lastUpdated}
        source={lottery.source}
        sourceLabel={lottery.sourceLabel}
      />
    </div>
  );
}
