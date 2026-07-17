"use client";

/**
 * Household benefits screener — the interactive core of
 * /usa-government-benefits-immigrants.
 *
 * PRIVACY MODEL (non-negotiable, see GB_PRIVACY_NOTE):
 *  • 100% client-side. No fetch, no analytics payload of answers, no server.
 *  • Answers persist to sessionStorage ONLY, so a refresh does not lose work,
 *    and are cleared by "Start over". Never localStorage — we do not want
 *    benefit/immigration answers surviving the session on a shared computer.
 *  • We never collect an SSN, A-number, or any document number, and the form
 *    must never add a field that does.
 *
 * ACCESSIBILITY:
 *  • Every control has a real <label>; groups use <fieldset>/<legend>.
 *  • Results are announced via a polite live region.
 *  • Tier is conveyed by text + icon, never colour alone.
 */

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  screen,
  groupResults,
  STATUS_LABELS,
  usd,
  type Circumstance,
  type ImmigrationStatus,
  type Person,
  type ProgramResult,
  type ScreenerInputs,
  type Tier,
} from "./benefitsScreenerLogic";
import {
  GB_PRIVACY_NOTE,
  GB_SCREENER_NOTE,
  RULES_LAST_VERIFIED_HUMAN,
  POVERTY_GUIDELINE_YEAR,
} from "@/data/governmentBenefitsData";

const TOOL_SLUG = "usa-government-benefits-immigrants-screener";
const STORAGE_KEY = "nritousa:benefits-screener:v1";

/* ------------------------------------------------------------------ *
 * Option lists
 * ------------------------------------------------------------------ */

const STATUS_GROUPS: { label: string; options: ImmigrationStatus[] }[] = [
  { label: "U.S. citizens", options: ["us-citizen", "us-born-child", "naturalized"] },
  { label: "Permanent residents", options: ["lpr", "conditional-lpr"] },
  { label: "Work and study visas", options: ["h1b", "h4", "l1", "l2", "f1", "f2", "j", "o1", "e"] },
  { label: "Humanitarian and other", options: ["tps", "refugee", "asylee", "parolee", "pending-aos", "other-lawful", "no-lawful-status", "prefer-not"] },
];

const CIRCUMSTANCES: { value: Circumstance; label: string }[] = [
  { value: "pregnant", label: "Someone is pregnant" },
  { value: "child-under-5", label: "Child under 5" },
  { value: "school-age-child", label: "School-age child" },
  { value: "age-65-plus", label: "Someone is 65+" },
  { value: "disability", label: "Disability in the household" },
  { value: "recently-lost-job", label: "Recently lost a job" },
  { value: "low-income", label: "Low or no current income" },
  { value: "needs-health-insurance", label: "Needs health insurance" },
  { value: "college-student", label: "College student" },
  { value: "needs-food", label: "Needs food assistance" },
  { value: "needs-housing-utility", label: "Needs utility or housing help" },
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME",
  "MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI",
  "SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const RELATIONS = ["You", "Spouse", "Child", "Parent", "Other"] as const;

/* ------------------------------------------------------------------ *
 * Presentation helpers
 * ------------------------------------------------------------------ */

const tierStyle: Record<Tier, { icon: string; chip: string; label: string }> = {
  strong: { icon: "●", chip: "border-emerald-300 bg-emerald-50 text-emerald-800", label: "Strong possibility" },
  possible: { icon: "◐", chip: "border-amber-300 bg-amber-50 text-amber-900", label: "Possible — more info needed" },
  "state-check": { icon: "◆", chip: "border-sky-300 bg-sky-50 text-sky-800", label: "Your state decides" },
  unlikely: { icon: "○", chip: "border-ink-900/15 bg-ink-50 text-ink-600", label: "Probably unavailable" },
  immigration: { icon: "▲", chip: "border-violet-300 bg-violet-50 text-violet-800", label: "Worth professional review" },
};

/**
 * Public-charge labels.
 *
 * These are legal statements. "Safe", "definitely not counted", "will hurt your
 * green card" and "automatically disqualifying" are all forbidden — the first
 * two because DHS adopted no post-September exclusion list, the last two
 * because no single benefit is ever outcome-determinative. Enforced by tests.
 */
const pcStyle: Record<ProgramResult["publicCharge"], { label: string; cls: string }> = {
  "outside-category": {
    label: "Public charge: generally outside means-tested public-benefit consideration",
    cls: "text-emerald-700",
  },
  "may-consider": {
    label: "Public charge: may be considered — individual review recommended",
    cls: "text-amber-700",
  },
  "not-applicable": { label: "Public charge: does not apply", cls: "text-ink-500" },
};

/* ------------------------------------------------------------------ *
 * Empty state
 * ------------------------------------------------------------------ */

const newPerson = (i: number): Person => ({
  id: `p${i}-${Math.random().toString(36).slice(2, 8)}`,
  label: i === 0 ? "You" : "Spouse",
  status: i === 0 ? "h1b" : "h4",
  age: i === 0 ? 35 : 33,
});

const EMPTY: ScreenerInputs = {
  persons: [newPerson(0)],
  state: "",
  householdSize: 1,
  annualIncome: 0,
  circumstances: [],
  work: { currentlyWorking: true, recentlyLaidOff: false, usWorkYears: 0, paidSsTax: "unknown" },
  tax: { filesUsReturn: "yes", childrenWithSsn: 0, filerHasSsn: "unsure" },
};

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function BenefitsScreener() {
  const uid = useId();
  const [data, setData] = useState<ScreenerInputs>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* Restore session answers (session only — see privacy model above). */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: ScreenerInputs; submitted: boolean };
        if (parsed?.data?.persons?.length) {
          setData(parsed.data);
          setSubmitted(Boolean(parsed.submitted));
        }
      }
    } catch {
      /* ignore malformed session data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, submitted }));
    } catch {
      /* storage unavailable (private mode) — the tool still works */
    }
  }, [data, submitted, hydrated]);

  const set = useCallback(<K extends keyof ScreenerInputs>(k: K, v: ScreenerInputs[K]) => {
    setData((d) => ({ ...d, [k]: v }));
  }, []);

  const setPerson = useCallback((id: string, patch: Partial<Person>) => {
    setData((d) => ({
      ...d,
      persons: d.persons.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const addPerson = useCallback(() => {
    setData((d) => {
      const next = [...d.persons, newPerson(d.persons.length)];
      return { ...d, persons: next, householdSize: Math.max(d.householdSize, next.length) };
    });
  }, []);

  const removePerson = useCallback((id: string) => {
    setData((d) => ({ ...d, persons: d.persons.filter((p) => p.id !== id) }));
  }, []);

  const result = useMemo(() => (submitted ? screen(data) : null), [submitted, data]);
  const groups = useMemo(() => (result ? groupResults(result) : []), [result]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    trackEvent("tool_result", { tool: TOOL_SLUG, household: data.persons.length });
    requestAnimationFrame(() => {
      document.getElementById(`${uid}-results`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const reset = () => {
    setData(EMPTY);
    setSubmitted(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* no-op */
    }
  };

  const anyLpr = data.persons.some((p) => p.status === "lpr" || p.status === "conditional-lpr");

  return (
    <div className="mx-auto max-w-3xl">
      {/*
        The ONE concise notice above the tool. The hero carries a single-line
        version that links to the full disclaimer, and the complete disclaimer
        sits below the article — so this must not restate either of them.
      */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-900">
        <p>
          <span className="font-bold">Educational screening, not a decision. </span>
          {GB_SCREENER_NOTE}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-5">
        {/* ---------------- Household members ---------------- */}
        <fieldset className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <legend className="px-1 text-sm font-bold text-ink-900">
            1. Who are you checking?
          </legend>
          <p className="mt-1 text-sm text-ink-600">
            Add each person you want screened. Everyone is assessed on their own status — one
            person&rsquo;s visa never disqualifies another.
          </p>

          <div className="mt-4 space-y-4">
            {data.persons.map((p, i) => (
              <div key={p.id} className="rounded-xl border border-ink-900/10 bg-ink-50/40 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[8rem] flex-1">
                    <label htmlFor={`${uid}-rel-${p.id}`} className="block text-xs font-semibold text-ink-700">
                      Who is this?
                    </label>
                    <select
                      id={`${uid}-rel-${p.id}`}
                      value={RELATIONS.includes(p.label as (typeof RELATIONS)[number]) ? p.label : "Other"}
                      onChange={(e) => setPerson(p.id, { label: e.target.value })}
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                    >
                      {RELATIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-[10rem] flex-[2]">
                    <label htmlFor={`${uid}-status-${p.id}`} className="block text-xs font-semibold text-ink-700">
                      Immigration status
                    </label>
                    <select
                      id={`${uid}-status-${p.id}`}
                      value={p.status}
                      onChange={(e) => setPerson(p.id, { status: e.target.value as ImmigrationStatus })}
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                    >
                      {STATUS_GROUPS.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.options.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <label htmlFor={`${uid}-age-${p.id}`} className="block text-xs font-semibold text-ink-700">
                      Age
                    </label>
                    <input
                      id={`${uid}-age-${p.id}`}
                      type="number"
                      min={0}
                      max={120}
                      inputMode="numeric"
                      value={p.age ?? ""}
                      onChange={(e) => setPerson(p.id, { age: e.target.value === "" ? undefined : Number(e.target.value) })}
                      className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                    />
                  </div>

                  {data.persons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePerson(p.id)}
                      className="min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 text-sm font-semibold text-ink-600 hover:border-rose-300 hover:text-rose-700"
                    >
                      Remove<span className="sr-only"> {p.label}</span>
                    </button>
                  )}
                </div>

                {/* Green card follow-ups — only where they matter. */}
                {(p.status === "lpr" || p.status === "conditional-lpr") && (
                  <div className="mt-3 grid gap-3 border-t border-ink-900/10 pt-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-gc-${p.id}`} className="block text-xs font-semibold text-ink-700">
                        Years held the green card
                      </label>
                      <input
                        id={`${uid}-gc-${p.id}`}
                        type="number"
                        min={0}
                        max={70}
                        inputMode="numeric"
                        value={p.gcYears ?? ""}
                        onChange={(e) => setPerson(p.id, { gcYears: e.target.value === "" ? undefined : Number(e.target.value) })}
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                      />
                      <p className="mt-1 text-xs text-ink-500">Several programs use a five-year line.</p>
                    </div>
                    <div>
                      <label htmlFor={`${uid}-i864-${p.id}`} className="block text-xs font-semibold text-ink-700">
                        Sponsored on Form I-864?
                      </label>
                      <select
                        id={`${uid}-i864-${p.id}`}
                        value={p.sponsoredI864 ?? "unknown"}
                        onChange={(e) => setPerson(p.id, { sponsoredI864: e.target.value as Person["sponsoredI864"] })}
                        className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                      >
                        <option value="unknown">Not sure</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <label className="flex items-start gap-2 text-sm text-ink-700">
                      <input
                        type="checkbox"
                        checked={Boolean(p.military)}
                        onChange={(e) => setPerson(p.id, { military: e.target.checked })}
                        className="mt-0.5 h-5 w-5 rounded border-ink-900/25"
                      />
                      <span>Qualifying U.S. military service (self, spouse, or parent)</span>
                    </label>
                    <label className="flex items-start gap-2 text-sm text-ink-700">
                      <input
                        type="checkbox"
                        checked={Boolean(p.refugeeBeforeLpr)}
                        onChange={(e) => setPerson(p.id, { refugeeBeforeLpr: e.target.checked })}
                        className="mt-0.5 h-5 w-5 rounded border-ink-900/25"
                      />
                      <span>Was a refugee/asylee (or another exemption) before getting the green card</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPerson}
            className="mt-3 min-h-[44px] rounded-lg border border-brand-200 bg-brand-50 px-4 text-sm font-bold text-brand-700 hover:bg-brand-100"
          >
            + Add another person
          </button>
        </fieldset>

        {/* ---------------- Household facts ---------------- */}
        <fieldset className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <legend className="px-1 text-sm font-bold text-ink-900">2. Your household</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={`${uid}-state`} className="block text-xs font-semibold text-ink-700">
                State
              </label>
              <select
                id={`${uid}-state`}
                value={data.state}
                onChange={(e) => set("state", e.target.value)}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select…</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-ink-500">Many rules are state-set.</p>
            </div>
            <div>
              <label htmlFor={`${uid}-size`} className="block text-xs font-semibold text-ink-700">
                Household size
              </label>
              <input
                id={`${uid}-size`}
                type="number"
                min={1}
                max={12}
                inputMode="numeric"
                value={data.householdSize}
                onChange={(e) => set("householdSize", Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor={`${uid}-income`} className="block text-xs font-semibold text-ink-700">
                Estimated annual household income
              </label>
              <input
                id={`${uid}-income`}
                type="number"
                min={0}
                step={500}
                inputMode="numeric"
                value={data.annualIncome || ""}
                onChange={(e) => set("annualIncome", Number(e.target.value))}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
                placeholder="e.g. 48000"
              />
              <p className="mt-1 text-xs text-ink-500">
                Before tax. Most programs use a figure close to your tax MAGI.
              </p>
            </div>
          </div>
        </fieldset>

        {/* ---------------- Circumstances ---------------- */}
        <fieldset className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <legend className="px-1 text-sm font-bold text-ink-900">
            3. Anything that applies right now
          </legend>
          <p className="mt-1 text-sm text-ink-600">
            These unlock programs that only exist for specific situations.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {CIRCUMSTANCES.map((c) => (
              <label key={c.value} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-ink-900/10 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50/60">
                <input
                  type="checkbox"
                  checked={data.circumstances.includes(c.value)}
                  onChange={(e) =>
                    set(
                      "circumstances",
                      e.target.checked
                        ? [...data.circumstances, c.value]
                        : data.circumstances.filter((x) => x !== c.value),
                    )
                  }
                  className="h-5 w-5 rounded border-ink-900/25"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ---------------- Work + tax ---------------- */}
        <fieldset className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
          <legend className="px-1 text-sm font-bold text-ink-900">4. Work and tax</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-workyears`} className="block text-xs font-semibold text-ink-700">
                Approximate years of U.S. work
              </label>
              <input
                id={`${uid}-workyears`}
                type="number"
                min={0}
                max={60}
                inputMode="numeric"
                value={data.work.usWorkYears || ""}
                onChange={(e) => set("work", { ...data.work, usWorkYears: Number(e.target.value) })}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-ink-500">About 10 years ≈ the 40 credits several rules use.</p>
            </div>
            <div>
              <label htmlFor={`${uid}-sstax`} className="block text-xs font-semibold text-ink-700">
                Was Social Security / Medicare tax paid on that work?
              </label>
              <select
                id={`${uid}-sstax`}
                value={data.work.paidSsTax}
                onChange={(e) => set("work", { ...data.work, paidSsTax: e.target.value as "yes" | "no" | "unknown" })}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              >
                <option value="unknown">Not sure</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-credits`} className="block text-xs font-semibold text-ink-700">
                Social Security credits, if you know them (optional)
              </label>
              <input
                id={`${uid}-credits`}
                type="number"
                min={0}
                max={60}
                inputMode="numeric"
                value={data.work.ssCredits ?? ""}
                onChange={(e) =>
                  set("work", { ...data.work, ssCredits: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-ink-500">
                Your{" "}
                <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="nofollow noopener noreferrer" className="font-semibold text-brand-700 underline underline-offset-2">
                  my Social Security
                </a>{" "}
                account shows this.
              </p>
            </div>
            <div>
              <label htmlFor={`${uid}-filessn`} className="block text-xs font-semibold text-ink-700">
                Does the tax filer have an SSN valid for work (rather than only an ITIN)?
              </label>
              <select
                id={`${uid}-filessn`}
                value={data.tax.filerHasSsn}
                onChange={(e) => set("tax", { ...data.tax, filerHasSsn: e.target.value as "yes" | "no" | "unsure" })}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              >
                <option value="unsure">Not sure</option>
                <option value="yes">Yes — SSN</option>
                <option value="no">No — ITIN only</option>
              </select>
              <p className="mt-1 text-xs text-ink-500">
                This decides several tax credits. We never ask for the number itself.
              </p>
            </div>
            <div>
              <label htmlFor={`${uid}-kids-ssn`} className="block text-xs font-semibold text-ink-700">
                Number of children with an SSN valid for work
              </label>
              <input
                id={`${uid}-kids-ssn`}
                type="number"
                min={0}
                max={12}
                inputMode="numeric"
                value={data.tax.childrenWithSsn || ""}
                onChange={(e) => set("tax", { ...data.tax, childrenWithSsn: Number(e.target.value) })}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-ink-500">U.S.-born children have one.</p>
            </div>
            <div>
              <label htmlFor={`${uid}-files`} className="block text-xs font-semibold text-ink-700">
                Do you file (or expect to file) a U.S. tax return?
              </label>
              <select
                id={`${uid}-files`}
                value={data.tax.filesUsReturn}
                onChange={(e) => set("tax", { ...data.tax, filesUsReturn: e.target.value as "yes" | "no" | "unsure" })}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-3 py-2 text-sm"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Privacy statement — next to the form, per requirement. */}
        <p className="rounded-xl border border-ink-900/10 bg-ink-50/60 px-4 py-3 text-xs leading-relaxed text-ink-600">
          <span className="font-bold text-ink-800">Your privacy.</span> {GB_PRIVACY_NOTE}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="min-h-[48px] flex-1 rounded-xl bg-brand-600 px-6 text-base font-bold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {submitted ? "Update my results" : "Check benefits for my family"}
          </button>
          {submitted && (
            <button
              type="button"
              onClick={reset}
              className="min-h-[48px] rounded-xl border border-ink-900/15 bg-white px-5 text-sm font-bold text-ink-700 hover:bg-ink-50"
            >
              Start over
            </button>
          )}
        </div>
      </form>

      {/* ---------------- Results ---------------- */}
      <div id={`${uid}-results`} aria-live="polite" className="scroll-mt-24">
        {result && (
          <div className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-extrabold tracking-tight text-ink-900">
                What your household may be able to check
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] rounded-lg border border-ink-900/15 bg-white px-3 text-xs font-bold text-ink-700 hover:bg-ink-50 print:hidden"
              >
                Print / save summary
              </button>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Household income is about <strong>{result.fplPct}%</strong> of the{" "}
              {POVERTY_GUIDELINE_YEAR} federal poverty guideline for your household size and state
              group. Programs use different percentages of that figure, so this is a reference point —
              not a pass or fail. Rules verified {RULES_LAST_VERIFIED_HUMAN}.
            </p>

            <div className="mt-6 space-y-8">
              {groups.map((g) => (
                <section key={g.id}>
                  <h4 className="text-base font-extrabold text-ink-900">{g.title}</h4>
                  <p className="mt-0.5 text-sm text-ink-600">{g.blurb}</p>
                  <div className="mt-3 space-y-3">
                    {g.programs.map((p) => (
                      <ProgramCard key={p.id} p={p} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Immigration + sponsor questions */}
            {result.immigrationFlags.length > 0 && (
              <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
                <h4 className="text-base font-extrabold text-violet-900">
                  Immigration and public-charge questions to review
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {result.immigrationFlags.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                      <span aria-hidden className="mt-0.5 flex-none text-violet-500">▲</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-700">
                  These are questions, not verdicts. Consult a qualified immigration attorney or
                  DOJ-accredited representative for immigration consequences. Contact the
                  administering agency or a certified benefits counselor for official eligibility.
                </p>
              </section>
            )}

            {/* Honest maths */}
            <section className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h4 className="text-base font-extrabold text-ink-900">About any numbers above</h4>
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                Do not add these together blindly — several programs interact, and qualifying for
                one can reduce or remove another.
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-500">Assumptions used</p>
              <ul className="mt-1.5 space-y-1.5">
                {result.assumptions.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-600">
                    <span aria-hidden className="mt-0.5 flex-none text-ink-400">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-500">
                Not included in any dollar figure
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {result.notInTotal.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-600">
                    <span aria-hidden className="mt-0.5 flex-none text-ink-400">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={() => document.getElementById(`${uid}-form-top`)?.scrollIntoView({ behavior: "smooth" })}
                className="min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-4 text-sm font-bold text-ink-700 hover:bg-ink-50"
              >
                Edit answers
              </button>
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] rounded-lg border border-ink-900/15 bg-white px-4 text-sm font-bold text-ink-700 hover:bg-ink-50"
              >
                Start over
              </button>
              <Link
                href="#public-charge"
                className="min-h-[44px] inline-flex items-center rounded-lg border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-violet-800 hover:bg-violet-100"
              >
                Read the public-charge section →
              </Link>
            </div>

            {anyLpr && (
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Because your household includes a permanent resident, the{" "}
                <Link href="#five-year" className="font-semibold text-brand-700 underline underline-offset-2">
                  five-year waiting period
                </Link>{" "}
                and the{" "}
                <Link href="#i864" className="font-semibold text-brand-700 underline underline-offset-2">
                  I-864 sponsor section
                </Link>{" "}
                are the two most relevant parts of the guide below.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Program card
 * ------------------------------------------------------------------ */

function ProgramCard({ p }: { p: ProgramResult }) {
  const t = tierStyle[p.tier];
  const pc = pcStyle[p.publicCharge];
  return (
    <details className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card open:shadow-card-hover">
      <summary className="cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900">{p.program}</p>
            {p.who.length > 0 ? (
              <p className="mt-0.5 text-xs text-ink-600">
                May apply to: <strong className="text-ink-800">{p.who.join(", ")}</strong>
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-ink-500">
                No one in the household appears to meet the status test on these facts.
              </p>
            )}
          </div>
          <span className={`inline-flex flex-none items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${t.chip}`}>
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </span>
        </div>
        <span className="mt-2 inline-block text-xs font-semibold text-brand-700 group-open:hidden">
          Show why + how to apply →
        </span>
      </summary>

      <div className="mt-3 space-y-2.5 border-t border-ink-900/10 pt-3 text-sm leading-relaxed text-ink-700">
        <p>{p.why}</p>
        <p>
          <span className="font-semibold text-ink-900">Immigration status:</span> {p.immigrationNote}
        </p>
        {p.incomeNote && (
          <p>
            <span className="font-semibold text-ink-900">Income / work history:</span> {p.incomeNote}
          </p>
        )}
        {p.stateNote && (
          <p>
            <span className="font-semibold text-ink-900">State note:</span> {p.stateNote}
          </p>
        )}
        <p className={`font-semibold ${pc.cls}`}>{pc.label}</p>
        <p className="text-ink-600">{p.publicChargeNote}</p>
        {p.sponsorNote && (
          <p className="rounded-lg border border-ink-900/10 bg-ink-50/60 px-3 py-2 text-ink-600">
            <span className="font-semibold text-ink-800">Sponsor (I-864):</span> {p.sponsorNote}
          </p>
        )}
        {p.estimate && (
          <div className="rounded-lg border border-sky-200 bg-sky-50/60 px-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-800">
              Potential value — {p.estimate.confidence} confidence · {p.estimate.year}
            </p>
            {(p.estimate.annual || p.estimate.monthly || p.estimate.oneTime) && (
              <p className="mt-1 font-bold text-ink-900">
                {p.estimate.annual && <span>{p.estimate.annual} / year</span>}
                {p.estimate.monthly && <span className="ml-2">{p.estimate.monthly} / month</span>}
                {p.estimate.oneTime && <span className="ml-2">{p.estimate.oneTime} one-time</span>}
              </p>
            )}
            <p className="mt-1 text-xs leading-relaxed text-ink-600">{p.estimate.basis}</p>
          </div>
        )}
        <a
          href={p.applyUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex min-h-[44px] items-center rounded-lg border border-brand-200 bg-brand-50 px-4 text-sm font-bold text-brand-700 hover:bg-brand-100"
        >
          Check / apply: {p.applyLabel} ↗
        </a>
      </div>
    </details>
  );
}
