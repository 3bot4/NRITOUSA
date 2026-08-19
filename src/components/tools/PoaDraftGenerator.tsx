"use client";

import { useMemo, useRef, useState } from "react";
import {
  DOC_TYPES,
  EMPTY_POA_DRAFT,
  PASSPORT_TYPE_OPTIONS,
  RELATION_OPTIONS,
  buildPoaDraft,
  draftProgress,
  poaDraftFilename,
  poaDraftText,
  type PoaDocType,
  type PoaDraftFields,
} from "@/lib/poaDraft";
import { buildPrintHtml } from "@/lib/invitationLetter";
import { buildLetterPdf } from "@/lib/letterPdf";
import { trackEvent } from "@/lib/analytics";

const TOOL_SLUG = "power-of-attorney-for-india-from-usa";

/**
 * Fill-in-the-blanks POA draft generator.
 *
 * PRIVACY, and it is not a footnote here: this form asks for a passport
 * number, PAN, Aadhaar, a bank account and two home addresses. Every value
 * lives in React state in this tab and nothing else — no fetch, no storage,
 * no query string. Analytics receives the document type and coarse flags
 * ONLY; no entered value is ever passed to trackEvent.
 */

const inputCls =
  "w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-base text-ink-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 sm:text-sm";

function F({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-800">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-ink-900/10 bg-white p-4">
      <legend className="px-1 text-xs font-bold uppercase tracking-wider text-ink-400">{title}</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function PoaDraftGenerator() {
  const [type, setType] = useState<PoaDocType>("sale");
  const [f, setF] = useState<PoaDraftFields>(EMPTY_POA_DRAFT);
  const [copied, setCopied] = useState(false);
  const startedRef = useRef(false);

  const set = <K extends keyof PoaDraftFields>(k: K, val: PoaDraftFields[K]) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("poa_draft_started", { tool_slug: TOOL_SLUG, doc_type: type });
    }
    setF((prev) => ({ ...prev, [k]: val }));
  };

  const text = useMemo(() => poaDraftText(type, f), [type, f]);
  const progress = useMemo(() => draftProgress(type, f), [type, f]);
  const current = DOC_TYPES.find((d) => d.value === type)!;

  const isSale = type === "sale";
  const isPurchase = type === "purchase";
  const isManage = type === "manage";
  const isRevocation = type === "revocation";
  const isProperty = isSale || isPurchase || isManage;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      trackEvent("poa_draft_copied", { tool_slug: TOOL_SLUG, doc_type: type });
    } catch {
      /* clipboard blocked — the draft is selectable on screen either way */
    }
  };

  const downloadPdf = () => {
    const bytes = buildLetterPdf(buildPoaDraft(type, f));
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${poaDraftFilename(type)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackEvent("poa_draft_pdf_downloaded", { tool_slug: TOOL_SLUG, doc_type: type });
  };

  const printDraft = () => {
    const html = buildPrintHtml(buildPoaDraft(type, f));
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    }
    setTimeout(() => document.body.removeChild(frame), 1000);
    trackEvent("poa_draft_printed", { tool_slug: TOOL_SLUG, doc_type: type });
  };

  const reset = () => {
    setF(EMPTY_POA_DRAFT);
    trackEvent("poa_draft_cleared", { tool_slug: TOOL_SLUG, doc_type: type });
  };

  return (
    <div id="formats" className="scroll-mt-24">
      <h2 className="text-xl font-bold text-ink-900">
        Power of Attorney Format for Property Sale in India — Free Draft Generator
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
        Fill in what you know and the draft below builds itself. Anything you leave blank stays as an
        obvious bracketed placeholder, so you can hand a partly-filled draft to your advocate and let
        them complete it. Download it as a PDF, print it, or copy the text.
      </p>

      <div
        role="alert"
        className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-sm leading-relaxed text-ink-700"
      >
        <strong className="font-bold text-ink-900">Do not sign what this produces.</strong> A filled
        draft looks finished, which is exactly why this warning matters more here than on a blank
        template. The operative wording, the stamp article, the schedule format and the attestation
        clause are decided by the law and registry practice of the Indian state where your property
        sits. An advocate in that state must settle the deed for your facts before anyone signs. Every
        copy, download and print carries this warning on the document itself.
      </div>

      {/* Document type */}
      <div className="mt-5 flex flex-wrap gap-2">
        {DOC_TYPES.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setType(d.value)}
            aria-pressed={type === d.value}
            className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
              type === d.value
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-ink-900/10 bg-white text-ink-700 hover:border-amber-300"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{current.blurb}</p>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100"
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Draft completeness"
        >
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-ink-500">
          {progress.filled}/{progress.total} key fields
        </span>
      </div>

      {/* Form */}
      <div className="mt-4 space-y-3">
        <Group title="You (the Principal)">
          <F label="Full name — exactly as on the title deed">
            <input className={inputCls} value={f.principalName} onChange={(e) => set("principalName", e.target.value)} />
          </F>
          <F label="Relationship descriptor">
            <select className={inputCls} value={f.principalRelation} onChange={(e) => set("principalRelation", e.target.value)}>
              {RELATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o} of…</option>
              ))}
            </select>
          </F>
          <F label="Father's / husband's name">
            <input className={inputCls} value={f.principalParent} onChange={(e) => set("principalParent", e.target.value)} />
          </F>
          <F label="Age">
            <input className={inputCls} inputMode="numeric" value={f.principalAge} onChange={(e) => set("principalAge", e.target.value)} />
          </F>
          <F label="Passport type">
            <select className={inputCls} value={f.passportType} onChange={(e) => set("passportType", e.target.value)}>
              {PASSPORT_TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </F>
          {f.passportType === "Other" && (
            <F label="Country that issued the passport" hint="Printed into the deed instead of the word &quot;Other&quot;.">
              <input className={inputCls} value={f.passportCountry} onChange={(e) => set("passportCountry", e.target.value)} />
            </F>
          )}
          <F label="Passport number">
            <input className={inputCls} value={f.passportNo} onChange={(e) => set("passportNo", e.target.value)} />
          </F>
          <F label="OCI card number" hint="Leave blank if you don't hold one — the clause is omitted.">
            <input className={inputCls} value={f.ociNo} onChange={(e) => set("ociNo", e.target.value)} />
          </F>
          <F label="PAN" hint="Omitted from the draft if blank.">
            <input className={inputCls} value={f.pan} onChange={(e) => set("pan", e.target.value)} />
          </F>
          <F label="Your full US address">
            <input className={inputCls} value={f.usAddress} onChange={(e) => set("usAddress", e.target.value)} />
          </F>
        </Group>

        <Group title={isRevocation ? "The attorney you are removing" : "Your attorney in India"}>
          <F label="Full name">
            <input className={inputCls} value={f.attorneyName} onChange={(e) => set("attorneyName", e.target.value)} />
          </F>
          <F label="Relationship to you" hint="Spouse, parent, child or sibling usually means nominal stamp duty.">
            <input className={inputCls} value={f.attorneyRelationship} onChange={(e) => set("attorneyRelationship", e.target.value)} />
          </F>
          {!isRevocation && (
            <>
              <F label="Age">
                <input className={inputCls} inputMode="numeric" value={f.attorneyAge} onChange={(e) => set("attorneyAge", e.target.value)} />
              </F>
              <F label="Aadhaar number">
                <input className={inputCls} value={f.attorneyAadhaar} onChange={(e) => set("attorneyAadhaar", e.target.value)} />
              </F>
              <F label="PAN">
                <input className={inputCls} value={f.attorneyPan} onChange={(e) => set("attorneyPan", e.target.value)} />
              </F>
            </>
          )}
          <F label="Full Indian address">
            <input className={inputCls} value={f.attorneyAddress} onChange={(e) => set("attorneyAddress", e.target.value)} />
          </F>
        </Group>

        {isProperty && (
          <Group title="The property">
            <div className="sm:col-span-2">
              <F
                label="Schedule of property"
                hint="Copy this from the title deed, word for word: flat/plot no., survey or CTS no., area, boundaries, khata no., village/taluka/district, and the registered document no. under which you hold title."
              >
                <textarea
                  className={`${inputCls} min-h-[110px]`}
                  value={f.propertySchedule}
                  onChange={(e) => set("propertySchedule", e.target.value)}
                />
              </F>
            </div>
            {!isManage && (
              <F label="Sub-Registrar office" hint="Where the deed will be presented for registration.">
                <input className={inputCls} value={f.subRegistrar} onChange={(e) => set("subRegistrar", e.target.value)} />
              </F>
            )}
          </Group>
        )}

        {isProperty && (
          <Group title="Money and limits">
            {isSale && (
              <F label="Minimum sale price" hint="In words and figures — this is your floor.">
                <input className={inputCls} value={f.minPrice} onChange={(e) => set("minPrice", e.target.value)} />
              </F>
            )}
            {isPurchase && (
              <F label="Maximum purchase price" hint="In words and figures — this is your cap.">
                <input className={inputCls} value={f.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} />
              </F>
            )}
            {isManage && (
              <>
                <F label="Minimum monthly rent">
                  <input className={inputCls} value={f.rentMin} onChange={(e) => set("rentMin", e.target.value)} />
                </F>
                <F label="Maximum lease term (months)" hint="11 months is the common leave-and-licence term.">
                  <input className={inputCls} inputMode="numeric" value={f.leaseMonths} onChange={(e) => set("leaseMonths", e.target.value)} />
                </F>
                <F label="Repair spending cap per instance">
                  <input className={inputCls} value={f.repairCap} onChange={(e) => set("repairCap", e.target.value)} />
                </F>
              </>
            )}
            {!isPurchase && (
              <>
                <F label="Bank name" hint="Money may only go to your own NRO account.">
                  <input className={inputCls} value={f.bankName} onChange={(e) => set("bankName", e.target.value)} />
                </F>
                <F label="Branch">
                  <input className={inputCls} value={f.bankBranch} onChange={(e) => set("bankBranch", e.target.value)} />
                </F>
                <F label="NRO account number">
                  <input className={inputCls} value={f.nroAccount} onChange={(e) => set("nroAccount", e.target.value)} />
                </F>
              </>
            )}
          </Group>
        )}

        {isRevocation && (
          <Group title="The power of attorney you are revoking">
            <F label="Date of the original POA">
              <input className={inputCls} value={f.originalPoaDate} onChange={(e) => set("originalPoaDate", e.target.value)} />
            </F>
            <F label="Its registration number" hint="Leave blank if it was never registered.">
              <input className={inputCls} value={f.originalPoaRegNo} onChange={(e) => set("originalPoaRegNo", e.target.value)} />
            </F>
            <F label="Sub-Registrar office where it was registered">
              <input className={inputCls} value={f.originalPoaRegOffice} onChange={(e) => set("originalPoaRegOffice", e.target.value)} />
            </F>
            <F label="Revocation effective from">
              <input className={inputCls} value={f.revocationEffective} onChange={(e) => set("revocationEffective", e.target.value)} />
            </F>
            <F label="Newspaper for the public notice">
              <input className={inputCls} value={f.newspaper} onChange={(e) => set("newspaper", e.target.value)} />
            </F>
          </Group>
        )}

        {!isRevocation && (
          <Group title="How long it lasts">
            <F label="In force from">
              <input className={inputCls} value={f.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </F>
            <F label="Expires on" hint="Never leave this open. 6–12 months matches a real transaction.">
              <input className={inputCls} value={f.endDate} onChange={(e) => set("endDate", e.target.value)} />
            </F>
          </Group>
        )}

        <Group title="Signing in the USA">
          <F label="City where you will sign">
            <input className={inputCls} value={f.executionCity} onChange={(e) => set("executionCity", e.target.value)} />
          </F>
          <F label="State">
            <input className={inputCls} value={f.executionState} onChange={(e) => set("executionState", e.target.value)} />
          </F>
          <F label="Date of signing">
            <input className={inputCls} value={f.executionDate} onChange={(e) => set("executionDate", e.target.value)} />
          </F>
          <div className="hidden sm:block" />
          <F label="Witness 1 — name" hint="Not your spouse or a blood relative.">
            <input className={inputCls} value={f.witness1Name} onChange={(e) => set("witness1Name", e.target.value)} />
          </F>
          <F label="Witness 1 — address">
            <input className={inputCls} value={f.witness1Address} onChange={(e) => set("witness1Address", e.target.value)} />
          </F>
          <F label="Witness 2 — name">
            <input className={inputCls} value={f.witness2Name} onChange={(e) => set("witness2Name", e.target.value)} />
          </F>
          <F label="Witness 2 — address">
            <input className={inputCls} value={f.witness2Address} onChange={(e) => set("witness2Address", e.target.value)} />
          </F>
        </Group>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadPdf}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700"
        >
          <span aria-hidden>⬇️</span> Download PDF
        </button>
        <button
          type="button"
          onClick={printDraft}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-amber-300"
        >
          <span aria-hidden>🖨️</span> Print
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-amber-300"
        >
          <span aria-hidden>📋</span> {copied ? "Copied" : "Copy text"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-500 transition hover:border-rose-300 hover:text-rose-600"
        >
          Clear form
        </button>
      </div>

      {/* Live draft */}
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink-400">Live draft</p>
      <div className="mt-2 max-h-[32rem] overflow-auto rounded-2xl border border-ink-900/10 bg-ink-50/50 shadow-card">
        <pre className="min-w-0 whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed text-ink-700 sm:p-5 sm:text-xs">
          {text}
        </pre>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        <strong className="font-semibold text-ink-600">Nothing you type here leaves your browser.</strong>{" "}
        The passport, PAN, Aadhaar, bank account and addresses you enter are held in this tab only —
        never sent to a server, never stored, never put in the page URL. Closing the tab discards
        them. Download or print the draft before you navigate away.
      </p>
    </div>
  );
}
