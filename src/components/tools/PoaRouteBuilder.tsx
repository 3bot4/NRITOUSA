"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Field, fieldClass } from "@/components/tools/InputCard";
import { trackToolUsed } from "@/lib/analytics";
import {
  CONSULATE_OPTIONS,
  EMPTY_POA_ROUTE,
  PASSPORT_OPTIONS,
  PURPOSE_OPTIONS,
  RELATIVE_OPTIONS,
  evaluatePoaRoute,
  type PoaRouteInputs,
} from "@/lib/poaRoute";

/* Privacy: every answer lives only in React state in the browser — no backend
   call, no storage. Analytics receives a coarse purpose:passport label only. */

const NOTE_STYLES: Record<string, string> = {
  info: "border-sky-200 bg-sky-50/60 text-ink-700",
  positive: "border-emerald-200 bg-emerald-50/60 text-ink-700",
  caution: "border-amber-200 bg-amber-50/60 text-ink-700",
  attention: "border-rose-200 bg-rose-50/60 text-ink-700",
  neutral: "border-ink-900/10 bg-slate-50 text-ink-600",
};

export default function PoaRouteBuilder() {
  const [inputs, setInputs] = useState<PoaRouteInputs>(EMPTY_POA_ROUTE);
  const result = useMemo(() => evaluatePoaRoute(inputs), [inputs]);

  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!result.ready) return;
    if (lastTracked.current === result.resultType) return;
    lastTracked.current = result.resultType;
    trackToolUsed({
      tool_name: "nri-poa-route-builder",
      result_type: result.resultType,
      category: "india-property",
      page_slug: "/power-of-attorney-for-india-from-usa",
    });
  }, [result]);

  const set = <K extends keyof PoaRouteInputs>(key: K, value: PoaRouteInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <div id="poa-builder" className="scroll-mt-24">
      <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
          Free · no signup · nothing leaves your browser
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900">
          Which power of attorney do you need, and how do you execute it from the USA?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
          Four questions. You get the instrument to ask your advocate for, whether the consular or
          apostille route applies to you, whether it has to be registered in India, your stamp-duty
          exposure, and the document checklist to take to the counter.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="1. What do you hold?" help="This decides whether an apostille is optional or mandatory.">
            <select
              className={fieldClass}
              value={inputs.passport}
              onChange={(e) => set("passport", e.target.value as PoaRouteInputs["passport"])}
            >
              <option value="">Select…</option>
              {PASSPORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="2. What must your attorney do in India?" help="Grant one POA per purpose — never one wide POA for everything.">
            <select
              className={fieldClass}
              value={inputs.purpose}
              onChange={(e) => set("purpose", e.target.value as PoaRouteInputs["purpose"])}
            >
              <option value="">Select…</option>
              {PURPOSE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="3. Is your attorney a close relative?" help="Spouse, parent, child or sibling. This is the biggest cost variable.">
            <select
              className={fieldClass}
              value={inputs.attorneyIsCloseRelative}
              onChange={(e) =>
                set("attorneyIsCloseRelative", e.target.value as PoaRouteInputs["attorneyIsCloseRelative"])
              }
            >
              <option value="">Select…</option>
              {RELATIVE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="4. Can you reach an Indian consular centre?" help="If not, the apostille route works entirely by mail.">
            <select
              className={fieldClass}
              value={inputs.canVisitConsulate}
              onChange={(e) => set("canVisitConsulate", e.target.value as PoaRouteInputs["canVisitConsulate"])}
            >
              <option value="">Select…</option>
              {CONSULATE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Result — min-height reserved so the answer does not shift the page. */}
        <div className="mt-6 min-h-[7rem]">
          {!result.ready ? (
            <div className="rounded-2xl border border-dashed border-ink-900/15 bg-ink-50/40 p-5 text-center">
              <p className="text-sm text-ink-500">
                Answer the first two questions to see your route, your checklist and your stamp-duty
                exposure.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Ask your advocate for
                </p>
                <p className="mt-1 text-base font-bold text-ink-900">{result.instrument}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Authentication route
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink-900">{result.route}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{result.routeWhy}</p>
                  </div>
                  <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      Registration in India
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink-900">
                      {result.mustRegister ? "Yes — treat as compulsory" : "Usually not compulsory"}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{result.registerWhy}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-ink-900/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Stamp-duty exposure
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{result.stampExposure}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <p className="text-sm font-bold text-ink-900">Your US-side document checklist</p>
                <ul className="mt-3 space-y-2">
                  {result.documents.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                      <span aria-hidden className="mt-0.5 shrink-0 text-brand-600">
                        ☐
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Checklists differ by Mission and by whether you walk in or mail it. Confirm against
                  your own consulate&apos;s published list before you courier anything.
                </p>
              </div>

              <div className="space-y-2">
                {result.notes.map((n) => (
                  <p
                    key={n.text}
                    className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${NOTE_STYLES[n.tone] ?? NOTE_STYLES.neutral}`}
                  >
                    {n.text}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="#formats"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  See the specimen wording →
                </a>
                <Link
                  href="/nri-selling-property-in-india-tds"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  Selling? Plan the TDS first
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
