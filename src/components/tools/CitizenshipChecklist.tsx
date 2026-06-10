"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Field, fieldClass } from "@/components/tools/InputCard";
import ResultActions from "@/components/ResultActions";
import { trackToolUsed } from "@/lib/analytics";
import {
  computeCivicsTest,
  computeEligibility,
  countItems,
  defaultIntake,
  deriveFlags,
  formatDate,
  getBasis,
  LAST_UPDATED,
  readinessBand,
  visibleSections,
  type BasisId,
  type Intake,
  type Sex,
  type YesNoUnsure,
} from "@/lib/citizenship";

/* Personal answers (basis, dates, arrests, tax) live ONLY in component state —
   never in the URL or storage. Only the generic set of checked item ids is
   encoded in the URL so progress is shareable without exposing personal data. */

const YNU: { value: YesNoUnsure; label: string }[] = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "unsure", label: "Not sure" },
];

function ProgressRing({ percent }: { percent: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const tone =
    percent >= 80 ? "#10b981" : percent >= 40 ? "#1e40f5" : "#f59e0b";
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(11,17,32,0.08)" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={tone}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 500ms ease" }}
      />
    </svg>
  );
}

export default function CitizenshipChecklist() {
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["eligibility"])
  );

  // Hydrate checked items from the URL once (shareable progress).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p");
    if (p) setChecked(new Set(p.split(",").filter(Boolean)));
  }, []);

  const eligibility = useMemo(() => computeEligibility(intake), [intake]);
  const civics = useMemo(() => computeCivicsTest(intake.filingDate), [intake.filingDate]);
  const flags = useMemo(() => deriveFlags(intake), [intake]);
  const sections = useMemo(() => visibleSections(intake, flags), [intake, flags]);

  const totalItems = countItems(sections);
  const visibleIds = useMemo(
    () => new Set(sections.flatMap((s) => s.items.map((i) => i.id))),
    [sections]
  );
  const doneCount = useMemo(
    () => Array.from(checked).filter((id) => visibleIds.has(id)).length,
    [checked, visibleIds]
  );
  const percent = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  // Sync checked ids → URL (debounced). No personal answers are ever encoded.
  const firstUrl = useRef(true);
  useEffect(() => {
    if (firstUrl.current) {
      firstUrl.current = false;
      return;
    }
    const t = setTimeout(() => {
      const ids = Array.from(checked).filter((id) => visibleIds.has(id));
      const qs = ids.length ? `?p=${ids.join(",")}` : "";
      window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
    }, 400);
    return () => clearTimeout(t);
  }, [checked, visibleIds]);

  // Broad analytics: readiness band only — never personal answers.
  const firstTrack = useRef(true);
  useEffect(() => {
    if (firstTrack.current) {
      firstTrack.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "citizenship_checklist",
        result_type: readinessBand(percent),
        category: "immigration",
        page_slug: "/tools/citizenship-checklist",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [percent]);

  const set = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setIntake((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSection = (id: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const basis = getBasis(intake.basis);

  /* --------------------------- intake panel --------------------------- */
  const intakePanel = (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
        Step 1 · About you
      </p>
      <h2 className="mb-4 mt-1 text-lg font-bold tracking-tight text-ink-900">
        Personalize your checklist
      </h2>
      <div className="space-y-4">
        <Field label="Your path to citizenship">
          <select
            value={intake.basis}
            onChange={(e) => set("basis", e.target.value as BasisId)}
            className={fieldClass}
          >
            {getBasisOptions()}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Green card 'resident since' date"
            help="On the front of your green card"
          >
            <input
              type="date"
              value={intake.residentSince}
              onChange={(e) => set("residentSince", e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field
            label="N-400 filing date (or planned)"
            help="Decides which civics test applies"
          >
            <input
              type="date"
              value={intake.filingDate}
              onChange={(e) => set("filingDate", e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sex" help="For Selective Service relevance">
            <select
              value={intake.sex}
              onChange={(e) => set("sex", e.target.value as Sex)}
              className={fieldClass}
            >
              <option value="prefer-not">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          <Field label="Age" help="Optional">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={intake.age ?? ""}
              onChange={(e) =>
                set("age", e.target.value ? Number(e.target.value) : null)
              }
              className={fieldClass}
              placeholder="e.g. 34"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-ink-900/10 px-3 py-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={intake.marriedToUsc}
            onChange={(e) => set("marriedToUsc", e.target.checked)}
            className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
          />
          I am married to a US citizen
        </label>

        <div className="border-t border-ink-900/5 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Quick risk check
          </p>
          <p className="mb-3 mt-1 text-xs text-ink-400">
            Answer honestly — this only shapes your checklist and stays in your
            browser. Nothing is stored or shared.
          </p>
          <div className="space-y-3">
            <RiskSelect
              label="Any single trip abroad over 6 months since getting your green card?"
              value={intake.longTripOver6mo}
              onChange={(v) => set("longTripOver6mo", v)}
            />
            <RiskSelect
              label="Ever arrested, cited, or charged — anywhere, even if dismissed?"
              value={intake.arrestsEver}
              onChange={(v) => set("arrestsEver", v)}
            />
            <RiskSelect
              label="Have you filed all required US tax returns for every year as a green card holder?"
              value={intake.allTaxesFiled}
              onChange={(v) => set("allTaxesFiled", v)}
            />
            <RiskSelect
              label="Ever filed US taxes as a 'non-resident' after getting your green card?"
              value={intake.filedAsNonResident}
              onChange={(v) => set("filedAsNonResident", v)}
            />
            <Field label="Court-ordered child support?">
              <select
                value={intake.childSupportCurrent}
                onChange={(e) =>
                  set("childSupportCurrent", e.target.value as Intake["childSupportCurrent"])
                }
                className={fieldClass}
              >
                <option value="na">Not applicable</option>
                <option value="yes">Yes — and I'm current</option>
                <option value="no">Yes — but I'm behind</option>
              </select>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );

  /* ----------------------------- results ------------------------------ */
  const resultsPanel = (
    <div className="space-y-4">
      {/* Eligibility */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Your earliest filing date
        </p>
        {intake.basis === "military" ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {eligibility.militaryNote ??
              "Military naturalization has special rules — verify with USCIS and your JAG office."}
          </p>
        ) : !eligibility.hasDate ? (
          <p className="mt-2 text-sm text-ink-500">
            Enter your green card &ldquo;resident since&rdquo; date to compute
            the earliest day you can file (up to {basis.fileEarlyDays} days
            before your {basis.yearsResidence}-year anniversary).
          </p>
        ) : (
          <>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900">
              {formatDate(eligibility.earliestFilingDate!)}
            </p>
            {eligibility.eligibleNow ? (
              <p className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                ✓ You can file now (window is open)
              </p>
            ) : (
              <p className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {eligibility.daysUntilEligible} days to go
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Based on the {basis.label} path: {basis.yearsResidence}-year
              continuous residence, {eligibility.physicalPresenceMonths} months
              (~{eligibility.physicalPresenceDays} days) physical presence, and{" "}
              {eligibility.stateMonths} months in your state/USCIS district. You
              may file up to {basis.fileEarlyDays} days early.
            </p>
            {(intake.longTripOver6mo === "yes" || intake.longTripOver6mo === "unsure") && (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                ⚠ A trip abroad of 6+ months can reset this clock — verify your
                continuous residence before relying on this date.
              </p>
            )}
          </>
        )}
      </div>

      {/* Civics test */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Which civics test applies to you
        </p>
        <p className="mt-1 text-xl font-bold text-ink-900">{civics.label}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-ink-900/5 px-3 py-1 text-ink-700">
            {civics.poolSize}-question pool
          </span>
          <span className="rounded-full bg-ink-900/5 px-3 py-1 text-ink-700">
            {civics.asked} asked
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            {civics.toPass} correct to pass
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          {civics.explanation}
        </p>
      </div>

      {/* Warnings */}
      {flags.warnings.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Your flagged items — review carefully
          </p>
          <ul className="mt-3 space-y-3">
            {flags.warnings.map((w) => (
              <li key={w.id} className="rounded-xl bg-[#fafafa] p-3">
                <p className="flex items-start gap-2 text-sm font-semibold text-ink-900">
                  <span aria-hidden className={w.severity === "high" ? "text-rose-600" : "text-amber-600"}>
                    {w.severity === "high" ? "●" : "▲"}
                  </span>
                  {w.title}
                </p>
                <p className="mt-1 pl-5 text-xs leading-relaxed text-ink-500">
                  {w.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-400">
            Flagged items aren&apos;t disqualifications — they&apos;re areas to
            prepare and, where serious, discuss with an immigration attorney.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Progress header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={percent} />
            <span className="absolute text-sm font-extrabold text-ink-900">
              {percent}%
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900">Your readiness</p>
            <p className="text-xs text-ink-400">
              {doneCount} of {totalItems} steps done
            </p>
          </div>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-ink-400">
          Tick items as you complete them. Your progress is saved in this
          page&apos;s link — copy it to resume or share later.
        </p>
      </div>

      {/* Intake + results */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        {intakePanel}
        {resultsPanel}
      </div>

      {/* Checklist */}
      <div className="mt-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-400">
          Step 2 · Your interactive checklist
        </p>
        <div className="space-y-3">
          {sections.map((section) => {
            const open = openSections.has(section.id);
            const secDone = section.items.filter((i) => checked.has(i.id)).length;
            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        secDone === section.items.length
                          ? "bg-emerald-500 text-white"
                          : "bg-ink-900/5 text-ink-500"
                      }`}
                    >
                      {secDone === section.items.length ? "✓" : secDone}
                    </span>
                    <span className="font-bold text-ink-900">{section.title}</span>
                    <span className="text-xs text-ink-400">
                      {secDone}/{section.items.length}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`text-ink-400 transition-transform ${open ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <ul className="border-t border-ink-900/5 px-5 py-2">
                    {section.items.map((item) => {
                      const isChecked = checked.has(item.id);
                      return (
                        <li key={item.id} className="border-b border-ink-900/5 py-3 last:border-0">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleItem(item.id)}
                              className="mt-0.5 h-5 w-5 shrink-0 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
                            />
                            <span>
                              <span
                                className={`text-sm font-semibold ${
                                  isChecked ? "text-ink-400 line-through" : "text-ink-900"
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.detail && (
                                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                                  {item.detail}
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary + sharing */}
      <div className="mt-8 rounded-2xl border border-ink-900/5 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
          Your personalized summary
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <SummaryStat
            label="Earliest filing date"
            value={
              intake.basis === "military"
                ? "See military rules"
                : eligibility.earliestFilingDate
                  ? formatDate(eligibility.earliestFilingDate)
                  : "Add your date"
            }
          />
          <SummaryStat label="Your civics test" value={civics.label} />
          <SummaryStat
            label="Readiness"
            value={`${percent}% · ${flags.warnings.length} flagged`}
          />
        </div>
        <div className="mt-5">
          <ResultActions
            title="My US Citizenship (N-400) Readiness"
            shareText="I'm tracking my US citizenship (N-400) readiness with this free checklist for green card holders:"
            fileName="citizenship-n400-readiness"
            footnote="Educational only — not legal advice. Verify against uscis.gov. nritousa.com"
            rows={[
              {
                label: "Earliest filing date",
                value:
                  eligibility.earliestFilingDate && intake.basis !== "military"
                    ? formatDate(eligibility.earliestFilingDate)
                    : "—",
              },
              { label: "Civics test", value: civics.label },
              { label: "Pass bar", value: `${civics.toPass} of ${civics.asked} correct` },
              { label: "Readiness", value: `${percent}% (${doneCount}/${totalItems})` },
              { label: "Flagged items to review", value: String(flags.warnings.length) },
            ]}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          The shareable link saves only your checklist progress — never your
          personal answers (dates, arrests, tax, child support stay in your
          browser). Assumptions last updated{" "}
          <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>. Not legal advice —
          verify everything against{" "}
          <Link href="https://www.uscis.gov/n-400" className="text-brand-600 underline">
            uscis.gov
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- small bits ---------------------------- */

function getBasisOptions() {
  return getBasisList().map((b) => (
    <option key={b.id} value={b.id}>
      {b.label}
    </option>
  ));
}
function getBasisList() {
  return [
    { id: "5-year" as const, label: "5-year permanent resident" },
    { id: "3-year-spouse" as const, label: "3-year spouse of a US citizen" },
    { id: "military" as const, label: "Military service member / veteran" },
  ];
}

function RiskSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNoUnsure;
  onChange: (v: YesNoUnsure) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as YesNoUnsure)}
        className={fieldClass}
      >
        {YNU.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 p-4">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-0.5 text-base font-bold text-ink-900">{value}</p>
    </div>
  );
}
