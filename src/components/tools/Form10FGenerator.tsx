"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import DataStamp from "@/components/tools/DataStamp";
import { trackToolUsed } from "@/lib/analytics";
import {
  buildPlainText,
  buildPrintHtml,
  DATA_STAMP,
  EMPTY_INPUTS,
  evaluateForm10F,
  STATUS_OPTIONS,
  type Form10FInputs,
  type Status,
} from "@/lib/form10f";

/* Privacy by design: every value below lives only in React state in the
   user's browser. There is no backend call, no storage, and analytics only
   ever receives a broad completeness label — never the values typed. */

export default function Form10FGenerator() {
  const [input, setInput] = useState<Form10FInputs>(EMPTY_INPUTS);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof Form10FInputs>(key: K, value: Form10FInputs[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => evaluateForm10F(input), [input]);
  const plainText = useMemo(() => buildPlainText(input), [input]);

  // Track only the broad completeness tier, debounced — never the values.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "form_10f_generator",
        result_type: result.trackedResult,
        category: "money",
        page_slug: "/tools/form-10f-generator",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [result.trackedResult]);

  const isIndividual = input.status === "individual";

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (older browser / permissions) — ignore quietly.
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-10f-draft.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print ONLY the declaration (not the whole page) via an off-screen iframe.
  const printDeclaration = () => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const cleanup = () => iframe.remove();
    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) {
        cleanup();
        return;
      }
      // Print after the iframe document has painted; remove it afterwards.
      win.onafterprint = cleanup;
      win.focus();
      win.print();
      // Fallback cleanup for browsers that don't fire onafterprint.
      setTimeout(cleanup, 60000);
    };

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      cleanup();
      return;
    }
    doc.open();
    doc.write(buildPrintHtml(input));
    doc.close();
  };

  const inputPanel = (
    <InputCard eyebrow="Your details" title="Form 10F particulars">
      <Field
        label="Name of the assessee"
        help="As it appears on your TRC and PAN"
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="e.g. Priya Sharma"
          value={input.name}
          onChange={(e) => set("name", e.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field label="Status">
        <select
          value={input.status}
          onChange={(e) => set("status", e.target.value as Status)}
          className={fieldClass}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="PAN (if allotted)"
        help="Optional — leave blank if you have not been allotted an Indian PAN"
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="e.g. ABCDE1234F"
          value={input.pan}
          onChange={(e) => set("pan", e.target.value.toUpperCase())}
          className={`${fieldClass} uppercase`}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={
            isIndividual ? "Nationality" : "Country of incorporation / registration"
          }
        >
          <input
            type="text"
            autoComplete="off"
            placeholder="e.g. India"
            value={input.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field
          label="Country of residence"
          help="Where you are resident for tax purposes"
        >
          <input
            type="text"
            autoComplete="off"
            placeholder="e.g. USA"
            value={input.countryOfResidence}
            onChange={(e) => set("countryOfResidence", e.target.value)}
            className={fieldClass}
          />
        </Field>
      </div>

      <Field
        label="Tax Identification Number in country of residence"
        help="Your tax ID where you live (in the USA, this is your SSN or ITIN). If there is no TIN, use the unique number that identifies you to that tax authority."
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="e.g. US SSN / ITIN"
          value={input.tin}
          onChange={(e) => set("tin", e.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field
        label="Period the residential status applies (per your TRC)"
        help="Usually the tax year covered by your Tax Residency Certificate"
      >
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={input.periodFrom}
            onChange={(e) => set("periodFrom", e.target.value)}
            className={fieldClass}
            aria-label="Period from"
          />
          <input
            type="date"
            value={input.periodTo}
            onChange={(e) => set("periodTo", e.target.value)}
            className={fieldClass}
            aria-label="Period to"
          />
        </div>
      </Field>

      <Field label="Address in country of residence">
        <textarea
          rows={3}
          autoComplete="off"
          placeholder="Street, city, state, ZIP, country"
          value={input.address}
          onChange={(e) => set("address", e.target.value)}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <p className="border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-400">
        🔒 Everything stays in your browser. No values are stored, sent to a
        server, or included in analytics. This draft is for your convenience
        only — the official Form 10F must be filed electronically on the
        Income-tax e-filing portal.
      </p>
    </InputCard>
  );

  const resultPanel = (
    <div className="space-y-4">
      <ResultCard
        tone={result.isComplete ? "positive" : "info"}
        eyebrow="Form 10F · Rule 21AB"
        title={
          result.isComplete
            ? "All required particulars filled in"
            : "Fill in the remaining particulars"
        }
        badge={result.isComplete ? "Ready to review" : `${result.missingRequired.length} to go`}
      >
        {result.isComplete ? (
          <p>
            Every required field below is complete. Review the draft, copy or
            download it, then enter the same particulars on the official Form
            10F on the Income-tax e-filing portal.
          </p>
        ) : (
          <>
            <p>Still needed before the declaration is complete:</p>
            <ul className="space-y-1.5">
              {result.missingRequired.map((r) => (
                <li key={r.no} className="flex gap-2">
                  <span aria-hidden className="mt-0.5 text-ink-400">
                    •
                  </span>
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </ResultCard>

      {/* Printable Form 10F-style summary */}
      <ResultCard tone="neutral" eyebrow="Draft" title="Form 10F — declaration">
        <div className="rounded-xl border border-ink-900/10 bg-slate-50/60 p-5 text-ink-700">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-ink-500">
            Form No. 10F
          </p>
          <p className="mt-1 text-center text-[0.6875rem] leading-relaxed text-ink-400">
            Information under sub-section (5) of section 90 / 90A of the
            Income-tax Act, 1961 (see rule 21AB)
          </p>

          <p className="mt-4 text-xs leading-relaxed">
            I,{" "}
            <strong className="font-semibold text-ink-900">
              {input.name.trim() || "____________"}
            </strong>
            , provide the following information for the purpose of claiming
            relief under the India–
            {input.countryOfResidence.trim() || "____"} Double Taxation
            Avoidance Agreement:
          </p>

          <dl className="mt-4 space-y-3">
            {result.rows.map((r) => (
              <div key={r.no}>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                  {r.no}. {r.label}
                  {!r.required && (
                    <span className="ml-1 font-normal normal-case text-ink-300">
                      (optional)
                    </span>
                  )}
                </dt>
                <dd
                  className={`mt-0.5 text-sm ${
                    r.filled ? "text-ink-900" : "italic text-ink-300"
                  }`}
                >
                  {r.filled ? r.value : "—"}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-ink-900/10 pt-4 text-xs leading-relaxed">
            <p className="font-semibold text-ink-900">Verification</p>
            <p className="mt-1">
              I, {input.name.trim() || "____________"}, declare that to the best
              of my knowledge and belief the information given above is correct
              and complete.
            </p>
            <p className="mt-3 text-ink-500">
              Place: {input.countryOfResidence.trim() || "____"} &nbsp;·&nbsp;
              Signature: ____________________
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-ink-900/5 pt-4">
          <button
            type="button"
            onClick={copySummary}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {copied ? "✓ Copied!" : "Copy text"}
          </button>
          <button
            type="button"
            onClick={downloadSummary}
            className="rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
          >
            Download .txt
          </button>
          <button
            type="button"
            onClick={printDeclaration}
            className="rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
          >
            Print / save as PDF
          </button>
        </div>
      </ResultCard>

      <p className="text-xs leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">
          Educational only — not tax or legal advice.
        </strong>{" "}
        This generates a self-help draft to help you prepare. The official Form
        10F must be filed electronically on the Income-tax e-filing portal
        (incometax.gov.in), and usually needs a valid Tax Residency Certificate
        (TRC) from your country of residence. Rules change — confirm the current
        requirements with a qualified tax professional.
      </p>
      <DataStamp
        lastUpdated={DATA_STAMP.lastUpdated}
        source={DATA_STAMP.source}
        sourceLabel={DATA_STAMP.sourceLabel}
      />
    </div>
  );

  return <ToolLayout inputs={inputPanel} results={resultPanel} />;
}
