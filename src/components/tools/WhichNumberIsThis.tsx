"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard from "@/components/tools/ResultCard";
import { identifyNumber, DOCUMENT_CHOICES } from "@/lib/calc/numberIdentify";

/**
 * "Which number is this?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PRIVACY IS THE DESIGN CONSTRAINT.
 *
 * Immigration identifiers are the keys to someone's file. This component:
 *   • never persists anything — no localStorage, no sessionStorage, no cookie;
 *   • never transmits anything — there is no fetch in this file and no server
 *     action, and the matcher in src/lib/calc/numberIdentify.ts looks at SHAPE
 *     only (length, prefix, digit count);
 *   • masks the value back to the reader rather than echoing the digits;
 *   • sets autoComplete="off" and spellCheck={false} so a browser does not
 *     offer to save it.
 *
 * Do not add a case-status lookup, a checksum validator or an analytics event
 * carrying the value. The whole reason someone trusts this input is that the
 * answer is derivable without the number going anywhere.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function WhichNumberIsThis() {
  const [raw, setRaw] = useState("");
  const [doc, setDoc] = useState("");

  const result = useMemo(
    () => identifyNumber(raw, doc || undefined),
    [raw, doc],
  );

  const hasInput = result.normalized.length > 0;
  const tone = !hasInput
    ? "neutral"
    : result.mismatch
      ? "caution"
      : result.matches.length === 0
        ? "attention"
        : result.matches[0].confidence === "exact"
          ? "positive"
          : "info";

  return (
    <div className="mx-auto max-w-4xl">
      {/* min-w-0: a pasted identifier is an unbroken string. */}
      <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
        <InputCard eyebrow="Nothing leaves your browser" title="Identify a number">
          <p className="-mt-2 text-xs leading-relaxed text-ink-500">
            Type the number as it appears on the document. The check reads only
            its <strong>shape</strong> — how many digits, which letters it starts
            with. Nothing is stored, nothing is sent, and what comes back to you
            is masked.
          </p>

          <Field
            label="The number"
            help="Hyphens, spaces and a leading # are ignored."
          >
            <input
              type="text"
              className={`${fieldClass} font-mono tracking-wider`}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="e.g. A000123456"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              inputMode="text"
              aria-describedby="wnit-privacy"
            />
          </Field>

          <Field
            label="Where did you find it? (optional)"
            help="Pick the document and the check will also tell you if the shape does not match what that document carries."
          >
            <select
              className={fieldClass}
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
            >
              <option value="">Not sure / not listed</option>
              {DOCUMENT_CHOICES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          {hasInput && (
            <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.02] px-3.5 py-3">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-ink-400">
                What the check sees
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-ink-700">
                {result.masked}
              </p>
              <p className="mt-1 text-[0.7rem] text-ink-400">
                {result.normalized.length} characters. Only the last three are
                shown back to you.
              </p>
            </div>
          )}

          <p id="wnit-privacy" className="text-[0.7rem] leading-relaxed text-ink-400">
            Never enter a full receipt number or A-number on a site that offers
            to check your case status for a fee. Your own case status is free at
            egov.uscis.gov and in your myUSCIS account.
          </p>

          {hasInput && (
            <button
              type="button"
              onClick={() => {
                setRaw("");
                setDoc("");
              }}
              className="text-xs font-semibold text-ink-400 underline hover:text-ink-600"
            >
              Clear
            </button>
          )}
        </InputCard>

        <div className="space-y-5">
          <ResultCard
            tone={tone}
            eyebrow={hasInput ? "Result" : "Waiting"}
            title={
              !hasInput
                ? "Type a number to identify it"
                : result.matches.length === 0
                  ? "No match on shape"
                  : result.matches.length === 1
                    ? result.matches[0].type.name
                    : `${result.matches.length} identifiers share this shape`
            }
            badge={
              hasInput && result.matches.length > 0
                ? result.matches[0].confidence === "exact"
                  ? "Distinctive shape"
                  : "Ambiguous shape"
                : undefined
            }
          >
            <p>{result.guidance}</p>

            {result.mismatch && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900">
                <strong>Shape does not match that document. </strong>
                {result.mismatch}
              </p>
            )}
          </ResultCard>

          {result.matches.map((m) => (
            <ResultCard
              key={m.type.id}
              tone={m.confidence === "exact" ? "info" : "neutral"}
              eyebrow={m.confidence === "exact" ? "Match" : "Possible match"}
              title={m.type.name}
            >
              <p className="text-xs">{m.why}</p>
              <dl className="mt-3 grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink-700">Identifies</dt>
                  <dd>{m.type.identifies}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-700">Issued by</dt>
                  <dd>{m.type.issuedBy}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-700">Where you find it</dt>
                  <dd>{m.type.whereFound}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink-700">How long it lasts</dt>
                  <dd>{m.type.lifetime}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs">
                <strong className="text-ink-700">Treat as: </strong>
                {m.type.sensitive === "high"
                  ? "highly sensitive. Share it only with your own attorney, your employer's attorney, or the agency asking for it on a form."
                  : "sensitive. Not something to post publicly or hand to a third-party service."}
              </p>
              {m.type.ownerPath && (
                <p className="mt-2 text-xs">
                  <Link href={m.type.ownerPath} className="font-semibold text-brand-600 underline">
                    Full guide to this number &rarr;
                  </Link>
                </p>
              )}
            </ResultCard>
          ))}
        </div>
      </div>
    </div>
  );
}
