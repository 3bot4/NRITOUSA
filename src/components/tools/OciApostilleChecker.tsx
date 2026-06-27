"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Field, fieldClass } from "@/components/tools/InputCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  APPLICANT_OPTIONS,
  CERTIFIED_OPTIONS,
  DOC_OPTIONS,
  EMPTY_APOSTILLE,
  ISSUED_OPTIONS,
  US_STATES,
  evaluateApostille,
  type ApostilleInputs,
} from "@/lib/oci/apostille";
import { OCI_BASE, OCI_TOOLS } from "@/lib/oci/config";

/* Privacy: every answer lives only in React state in the browser — no backend
   call, no storage. Analytics receives only a coarse result label. */

const NOTE_STYLES: Record<string, string> = {
  info: "border-sky-200 bg-sky-50/60 text-ink-700",
  positive: "border-emerald-200 bg-emerald-50/60 text-ink-700",
  caution: "border-amber-200 bg-amber-50/60 text-ink-700",
  attention: "border-rose-200 bg-rose-50/60 text-ink-700",
  neutral: "border-ink-900/10 bg-slate-50 text-ink-600",
};

export default function OciApostilleChecker() {
  const [inputs, setInputs] = useState<ApostilleInputs>(EMPTY_APOSTILLE);
  const result = useMemo(() => evaluateApostille(inputs), [inputs]);

  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "oci-apostille-need-checker",
      result_type: result.resultType,
      category: "oci",
      page_slug: `${OCI_BASE}/apostille`,
    });
  }, [result.ready, result.resultType]);

  const set = <K extends keyof ApostilleInputs>(
    key: K,
    value: ApostilleInputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      {/* Inputs */}
      <div className="rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-400">
          Your document
        </p>
        <h3 className="mb-4 text-lg font-bold tracking-tight text-ink-900">
          Check what your document needs
        </h3>
        <div className="space-y-4">
          <Field label="Applicant type">
            <select
              className={fieldClass}
              value={inputs.applicant}
              onChange={(e) =>
                set("applicant", e.target.value as ApostilleInputs["applicant"])
              }
            >
              <option value="">Select…</option>
              {APPLICANT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Document type">
            <select
              className={fieldClass}
              value={inputs.docType}
              onChange={(e) =>
                set("docType", e.target.value as ApostilleInputs["docType"])
              }
            >
              <option value="">Select…</option>
              {DOC_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Document issued in">
            <select
              className={fieldClass}
              value={inputs.issuedIn}
              onChange={(e) =>
                set("issuedIn", e.target.value as ApostilleInputs["issuedIn"])
              }
            >
              <option value="">Select…</option>
              {ISSUED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          {inputs.issuedIn === "us" && (
            <Field label="U.S. state that issued it">
              <select
                className={fieldClass}
                value={inputs.usState}
                onChange={(e) => set("usState", e.target.value)}
              >
                <option value="">Select state…</option>
                {US_STATES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field
            label="Is it a certified government copy?"
            help="A hospital certificate or photocopy is usually not enough."
          >
            <div className="grid grid-cols-3 gap-2">
              {CERTIFIED_OPTIONS.map((o) => {
                const active = inputs.certified === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("certified", o.value)}
                    aria-pressed={active}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-ink-900/10 bg-white text-ink-600 hover:border-brand-300"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <button
            type="button"
            onClick={() => setInputs(EMPTY_APOSTILLE)}
            className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Result */}
      <div className="space-y-4">
        <div
          className={`rounded-2xl border bg-white p-6 shadow-card ${
            NOTE_STYLES[result.tone] ?? NOTE_STYLES.neutral
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Guidance
          </p>
          <h3 className="mt-0.5 text-lg font-bold tracking-tight text-ink-900">
            {result.headline}
          </h3>
        </div>

        {result.notes.map((n, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-4 text-sm leading-relaxed ${
              NOTE_STYLES[n.tone] ?? NOTE_STYLES.neutral
            }`}
          >
            {n.text}
          </div>
        ))}

        {result.ready && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-sm text-ink-600">
            Next:{" "}
            <Link
              href={`${OCI_BASE}/how-to-apply`}
              className="font-semibold text-brand-700 underline"
            >
              see the full document list and steps
            </Link>{" "}
            ·{" "}
            <Link
              href={OCI_TOOLS.timeline.path}
              className="font-semibold text-brand-700 underline"
            >
              plan your timeline
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
