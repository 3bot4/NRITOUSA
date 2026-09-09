"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import {
  CHARGEABILITY_LABELS,
  IV_CATEGORIES,
  IV_CATEGORY_ORDER,
  bulletinMonth,
  diagnoseIvScheduling,
  formatCutoffDate,
  formatMonthGap,
  getIvCutoffs,
  ivSchedulingLinks,
  type Chargeability,
  type DateStatus,
  type IvCategory,
  type IvSchedulingInputs,
} from "@/lib/ivScheduling";

const EMPTY: IvSchedulingInputs = {
  category: "",
  country: "",
  priorityDate: "",
  dqMonth: "",
  postSchedulingMonth: "",
  post: "",
};

/** Posts that handle the bulk of Indian immigrant visa cases, plus an escape. */
const POSTS = [
  "Mumbai",
  "New Delhi",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Other post",
];

const STATUS_LABEL: Record<DateStatus, string> = {
  "no-limit": "No numerical limit",
  "all-current": "Current (C)",
  current: "Your date is current",
  "not-current": "Not yet current",
  unavailable: "Unavailable (U)",
};

const STATUS_STYLE: Record<DateStatus, string> = {
  "no-limit": "bg-emerald-50 text-emerald-700",
  "all-current": "bg-emerald-50 text-emerald-700",
  current: "bg-emerald-50 text-emerald-700",
  "not-current": "bg-amber-50 text-amber-800",
  unavailable: "bg-rose-50 text-rose-700",
};

export default function IvSchedulingStatusTool() {
  const [inp, setInp] = useState<IvSchedulingInputs>(EMPTY);

  const set = <K extends keyof IvSchedulingInputs>(
    key: K,
    value: IvSchedulingInputs[K],
  ) => setInp((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => diagnoseIvScheduling(inp), [inp]);
  const cutoffs =
    inp.category && inp.country
      ? getIvCutoffs(inp.category as IvCategory, inp.country as Chargeability)
      : null;

  const started = Boolean(inp.category && inp.country && inp.priorityDate);

  return (
    <div id="tool" className="grid gap-5 lg:grid-cols-2">
      {/* ── Inputs ───────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <InputCard eyebrow="Step 1" title="Your case">
          <Field
            label="Immigrant visa category"
            help="From the approved petition — I-130 for family, I-140 for employment."
          >
            <select
              className={fieldClass}
              value={inp.category}
              onChange={(e) => set("category", e.target.value as IvCategory | "")}
            >
              <option value="">Select a category…</option>
              <optgroup label="Immediate relatives (no priority date wait)">
                {IV_CATEGORY_ORDER.filter(
                  (c) => IV_CATEGORIES[c].path === "immediate",
                ).map((c) => (
                  <option key={c} value={c}>
                    {IV_CATEGORIES[c].label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Family preference">
                {IV_CATEGORY_ORDER.filter(
                  (c) => IV_CATEGORIES[c].path === "family",
                ).map((c) => (
                  <option key={c} value={c}>
                    {IV_CATEGORIES[c].label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Employment preference">
                {IV_CATEGORY_ORDER.filter(
                  (c) => IV_CATEGORIES[c].path === "employment",
                ).map((c) => (
                  <option key={c} value={c}>
                    {IV_CATEGORIES[c].label}
                  </option>
                ))}
              </optgroup>
            </select>
          </Field>

          <Field
            label="Country of chargeability"
            help="Usually your country of birth — not citizenship. A spouse born elsewhere may allow cross-chargeability."
          >
            <select
              className={fieldClass}
              value={inp.country}
              onChange={(e) =>
                set("country", e.target.value as Chargeability | "")
              }
            >
              <option value="">Select…</option>
              {(
                ["india", "china", "mexico", "philippines", "row"] as Chargeability[]
              ).map((c) => (
                <option key={c} value={c}>
                  {CHARGEABILITY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Priority date"
            help="PERM filing date for most EB-2/EB-3 cases; I-140 receipt date where no PERM was required; I-130 receipt date for family cases."
          >
            <input
              type="date"
              className={fieldClass}
              value={inp.priorityDate}
              onChange={(e) => set("priorityDate", e.target.value)}
            />
          </Field>
        </InputCard>

        <InputCard eyebrow="Step 2" title="Your place in the post's queue">
          <p className="-mt-1 text-xs text-ink-500">
            These two fields are optional. Without them you still get a visa
            availability verdict; with them you also get a queue position.
          </p>

          <Field
            label="Consular post"
            help="Where the interview will be held."
          >
            <select
              className={fieldClass}
              value={inp.post}
              onChange={(e) => set("post", e.target.value)}
            >
              <option value="">Select…</option>
              {POSTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Month your case became documentarily complete"
            help="The month NVC emailed to say your documents were accepted — not the month you uploaded them."
          >
            <input
              type="month"
              className={fieldClass}
              value={inp.dqMonth}
              onChange={(e) => set("dqMonth", e.target.value)}
            />
          </Field>

          <Field
            label="Month the official tool shows for your post"
            help="Read this off the Department of State IV Scheduling Status Tool — it changes, so check it the day you use this."
          >
            <input
              type="month"
              className={fieldClass}
              value={inp.postSchedulingMonth}
              onChange={(e) => set("postSchedulingMonth", e.target.value)}
            />
          </Field>

          <a
            href={ivSchedulingLinks.tool}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
          >
            Open the official IV Scheduling Status Tool ↗
          </a>
        </InputCard>

        {started && (
          <button
            type="button"
            onClick={() => setInp(EMPTY)}
            className="text-xs font-semibold text-ink-500 underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Result ───────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <ResultCard
          tone={result.tone}
          eyebrow={result.gateLabel}
          title={result.headline}
          badge={result.badge}
        >
          <p>{result.detail}</p>

          {result.nextStep && (
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                What to do next
              </p>
              <p className="mt-1 text-sm text-ink-700">{result.nextStep}</p>
            </div>
          )}

          {result.inquiryReasonable && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              This is one of the few fact patterns where an{" "}
              <Link href="/nvc-public-inquiry" className="font-semibold underline">
                NVC public inquiry
              </Link>{" "}
              is appropriate — but check CEAC for an unanswered document request
              first, because that is the more common explanation.
            </p>
          )}
        </ResultCard>

        {/* Gate 1 detail — the two charts, side by side */}
        {started && cutoffs && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Gate 1 · Visa availability
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {formatCutoffDate(bulletinMonth)} Visa Bulletin ·{" "}
              {inp.country ? CHARGEABILITY_LABELS[inp.country] : ""}
            </p>
            <div className="mt-3 space-y-2">
              <ChartRow
                label="Dates for Filing"
                sub="Governs when NVC invites your documents"
                cutoff={cutoffs.dff}
                status={result.filingStatus}
              />
              <ChartRow
                label="Final Action Dates"
                sub="Governs when an interview can be scheduled and a visa issued"
                cutoff={cutoffs.fad}
                status={result.finalActionStatus}
              />
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Cutoffs from the{" "}
              <Link href="/visa-bulletin" className="underline">
                visa bulletin data
              </Link>{" "}
              this site maintains. Verify against the{" "}
              <a
                href={ivSchedulingLinks.visaBulletin}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                official bulletin
              </a>{" "}
              before acting.
            </p>
          </div>
        )}

        {/* Gate 2 detail */}
        {result.queueGapMonths !== null && (
          <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Gate 2 · The post&rsquo;s DQ queue
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-black tracking-tight text-ink-900">
                {result.queueGapMonths > 0 ? "−" : result.queueGapMonths < 0 ? "+" : ""}
                {formatMonthGap(result.queueGapMonths)}
              </span>
              <span className="text-sm text-ink-500">
                {result.queueGapMonths > 0
                  ? "behind the month being scheduled"
                  : result.queueGapMonths < 0
                    ? "ahead of the month being scheduled"
                    : "— your month is being scheduled"}
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-500">
              Documentarily complete {formatCutoffDate(inp.dqMonth)} · post
              scheduling {formatCutoffDate(inp.postSchedulingMonth)}. A queue gap
              is not a countdown — posts release appointments unevenly, so read
              the official tool two or three months running to see the real pace.
            </p>
          </div>
        )}

        {result.caveats.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              What would change this answer
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
              {result.caveats.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden>·</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartRow({
  label,
  sub,
  cutoff,
  status,
}: {
  label: string;
  sub: string;
  cutoff: string;
  status: DateStatus | null;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink-900/5 bg-ink-50/50 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900">{label}</p>
        <p className="text-xs text-ink-500">{sub}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-ink-900">
          {formatCutoffDate(cutoff)}
        </span>
        {status && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}
          >
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>
    </div>
  );
}
