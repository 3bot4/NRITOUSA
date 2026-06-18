"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputCard, { Field, fieldClass } from "@/components/tools/InputCard";
import ResultCard, { type ResultTone } from "@/components/tools/ResultCard";
import DataStamp from "@/components/tools/DataStamp";
import { trackToolUsed } from "@/lib/analytics";
import {
  ACCOUNT_TYPE_OPTIONS,
  DATA_STAMP,
  evaluateChecker,
  FATCA_ABROAD_HELPER,
  FATCA_THRESHOLD_TABLE,
  FILING_STATUS_OPTIONS,
  RESIDENCE_OPTIONS,
  taxYearOptions,
  US_PERSON_OPTIONS,
  type AccountTypeId,
  type AttentionLevel,
  type CheckerInputs,
  type FatcaStatus,
  type FbarStatus,
  type FilingStatus,
  type Residence,
  type UsPersonStatus,
  type YesNoUnsure,
} from "@/lib/fbar-fatca";

/* Privacy by design: every value below lives only in React state in the
   user's browser. There is no backend call, no storage, and analytics only
   ever receives a broad result label — never amounts. */

const FBAR_TONE: Record<FbarStatus, ResultTone> = {
  "review-likely": "caution",
  "under-threshold": "positive",
  "more-info": "info",
  "not-us-person": "neutral",
};

const FATCA_TONE: Record<FatcaStatus, ResultTone> = {
  "review-likely": "caution",
  "depends-on-year-end": "caution",
  "under-threshold": "positive",
  "more-info": "info",
  "not-us-person": "neutral",
};

const ATTENTION_TONE: Record<AttentionLevel, ResultTone> = {
  low: "positive",
  medium: "caution",
  high: "attention",
};

const YES_NO_UNSURE: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

function parseUsd(raw: string): number | null {
  const digits = raw.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function formatUsdInput(raw: string): string {
  const n = parseUsd(raw);
  return n === null ? "" : n.toLocaleString("en-US");
}

function UsdField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} help={help}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-400">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 25,000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(formatUsdInput(e.target.value))}
          className={`${fieldClass} pl-7`}
        />
      </div>
    </Field>
  );
}

export default function FbarFatcaChecker() {
  const [usPerson, setUsPerson] = useState<UsPersonStatus>("citizen");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [residence, setResidence] = useState<Residence>("us");
  const [accountsRaw, setAccountsRaw] = useState("");
  const [accountTypes, setAccountTypes] = useState<AccountTypeId[]>([]);
  const [hasOtherAssets, setHasOtherAssets] = useState<YesNoUnsure>("no");
  const [assetsRaw, setAssetsRaw] = useState("");
  const [signatureAuthority, setSignatureAuthority] =
    useState<YesNoUnsure>("no");
  const currentYear = new Date().getFullYear();
  const [taxYear, setTaxYear] = useState(currentYear - 1);
  const [copied, setCopied] = useState(false);

  const inputs: CheckerInputs = useMemo(
    () => ({
      usPerson,
      filingStatus,
      residence,
      maxAccountsUsd: parseUsd(accountsRaw),
      accountTypes,
      hasOtherAssets,
      maxAssetsUsd: parseUsd(assetsRaw),
      signatureAuthority,
      taxYear,
    }),
    [
      usPerson,
      filingStatus,
      residence,
      accountsRaw,
      accountTypes,
      hasOtherAssets,
      assetsRaw,
      signatureAuthority,
      taxYear,
    ]
  );

  const result = useMemo(() => evaluateChecker(inputs), [inputs]);

  // Track only the broad outcome label, debounced — never amounts or answers.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      trackToolUsed({
        tool_name: "fbar_fatca_checker",
        result_type: result.trackedResult,
        category: "money",
        page_slug: "/tools/fbar-fatca-checker",
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [result.trackedResult]);

  const toggleAccountType = (id: AccountTypeId) =>
    setAccountTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const checklistText = useMemo(() => {
    const lines: string[] = [
      `FBAR / FATCA preparation checklist — tax year ${taxYear}`,
      "(Educational only — not tax advice. Generated at nritousa.com/tools/fbar-fatca-checker)",
      "",
      "Documents to gather:",
      ...result.checklist.documents.map((d) => `  [ ] ${d}`),
      "",
      "Questions to ask your CPA:",
      ...result.checklist.cpaQuestions.map((q) => `  [ ] ${q}`),
    ];
    if (result.checklist.accountNotes.length > 0) {
      lines.push(
        "",
        "Accounts to review:",
        ...result.checklist.accountNotes.map(
          (a) => `  [ ] ${a.label} — ${a.note}`
        )
      );
    }
    return lines.join("\n");
  }, [result.checklist, taxYear]);

  const copyChecklist = async () => {
    try {
      await navigator.clipboard.writeText(checklistText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (older browser / permissions) — ignore quietly.
    }
  };

  const inputPanel = (
    <InputCard eyebrow="Step 1" title="Your situation">
      <Field
        label="Are you a US person for tax purposes?"
        help="US citizens, green card holders, and resident aliens are generally US persons"
      >
        <select
          value={usPerson}
          onChange={(e) => setUsPerson(e.target.value as UsPersonStatus)}
          className={fieldClass}
        >
          {US_PERSON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Filing status">
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
            className={fieldClass}
          >
            {FILING_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Form 8938 threshold category"
          help={FATCA_ABROAD_HELPER}
        >
          <select
            value={residence}
            onChange={(e) => setResidence(e.target.value as Residence)}
            className={fieldClass}
          >
            {RESIDENCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tax year">
        <select
          value={taxYear}
          onChange={(e) => setTaxYear(Number(e.target.value))}
          className={fieldClass}
        >
          {taxYearOptions(currentYear).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Field>

      <UsdField
        label="Highest total foreign account value during the year (USD)"
        help="Add the highest combined value of all non-US bank, brokerage, FD, mutual fund, and similar financial accounts at any point during the year — not just December 31. Account income does not determine FBAR; the maximum account balance does."
        value={accountsRaw}
        onChange={setAccountsRaw}
      />

      <Field label="Types of foreign accounts / assets" help="Select all that apply">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {ACCOUNT_TYPE_OPTIONS.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                accountTypes.includes(o.id)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-900/10 bg-white text-ink-600 hover:border-ink-900/20"
              }`}
            >
              <input
                type="checkbox"
                checked={accountTypes.includes(o.id)}
                onChange={() => toggleAccountType(o.id)}
                className="h-4 w-4 rounded border-ink-900/20 text-brand-600 focus:ring-brand-500/30"
              />
              {o.label}
            </label>
          ))}
        </div>
      </Field>

      <Field
        label="Do you own foreign financial assets beyond bank accounts?"
        help="For example certain foreign stocks held outside accounts, or interests in foreign entities"
      >
        <select
          value={hasOtherAssets}
          onChange={(e) => setHasOtherAssets(e.target.value as YesNoUnsure)}
          className={fieldClass}
        >
          {YES_NO_UNSURE.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <UsdField
        label="Highest total foreign financial assets value (USD)"
        help="This may include certain foreign financial assets beyond bank accounts. Rules are complex, especially for FATCA/Form 8938 — leave blank to use your account total above."
        value={assetsRaw}
        onChange={setAssetsRaw}
      />

      <Field
        label="Signature authority over an account you don't own?"
        help="For example a parent's account in India you can operate, or an employer account"
      >
        <select
          value={signatureAuthority}
          onChange={(e) =>
            setSignatureAuthority(e.target.value as YesNoUnsure)
          }
          className={fieldClass}
        >
          {YES_NO_UNSURE.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <p className="border-t border-ink-900/5 pt-3 text-xs leading-relaxed text-ink-400">
        🔒 Everything stays in your browser. No values are stored, sent to a
        server, or included in analytics. Never enter account numbers,
        passwords, SSN, or passport details in any online tool — this one
        doesn&apos;t ask for them.
      </p>
    </InputCard>
  );

  const resultPanel = (
    <div className="space-y-4">
      {/* A. FBAR */}
      <ResultCard
        tone={FBAR_TONE[result.fbar.status]}
        eyebrow="FBAR · FinCEN Form 114"
        title={result.fbar.headline}
        badge={
          result.fbar.status === "review-likely"
            ? "Review likely"
            : result.fbar.status === "under-threshold"
              ? "Likely under threshold"
              : "More info"
        }
      >
        <p>{result.fbar.detail}</p>
        {result.fbar.status === "under-threshold" && (
          <p className="text-xs text-ink-400">
            Still verify if your situation is complex — joint accounts, closed
            accounts, and accounts you can sign on all count toward the
            combined total.
          </p>
        )}
      </ResultCard>

      {/* B. FATCA */}
      <ResultCard
        tone={FATCA_TONE[result.fatca.status]}
        eyebrow="FATCA · IRS Form 8938"
        title={result.fatca.headline}
        badge={
          result.fatca.status === "review-likely"
            ? "Review likely"
            : result.fatca.status === "under-threshold"
              ? "Likely under threshold"
              : result.fatca.status === "depends-on-year-end"
                ? "Check year-end"
                : "More info"
        }
      >
        <p>{result.fatca.detail}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-xs">
            <caption className="pb-2 text-left text-xs font-bold uppercase tracking-wider text-ink-400">
              Simplified Form 8938 thresholds (can change — verify with IRS
              instructions)
            </caption>
            <thead>
              <tr className="border-b border-ink-900/5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <th className="py-2 pr-3">Situation</th>
                <th className="py-2 pr-3">Last day of year</th>
                <th className="py-2">Any time in year</th>
              </tr>
            </thead>
            <tbody>
              {FATCA_THRESHOLD_TABLE.map((row) => {
                const active = result.fatca.applicable?.label === row.label;
                return (
                  <tr
                    key={row.label}
                    className={`border-b border-ink-900/5 last:border-0 ${
                      active ? "bg-brand-50 font-semibold text-ink-900" : "text-ink-600"
                    }`}
                  >
                    <td className="py-2 pr-3">
                      {row.label}
                      {active && (
                        <span className="ml-1 text-brand-600">← you</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      &gt; ${row.endOfYearUsd.toLocaleString("en-US")}
                    </td>
                    <td className="py-2">
                      &gt; ${row.anyTimeUsd.toLocaleString("en-US")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-400">
          Head of household uses the &quot;Single&quot; row. Thresholds depend
          on filing status and where you live, and can change — this table is a
          simplified summary, not the full Form 8938 rules.
        </p>
      </ResultCard>

      {/* D. Attention level (shown before the checklist so it frames it) */}
      <ResultCard
        tone={ATTENTION_TONE[result.attention.level]}
        eyebrow="Overall"
        title={result.attention.label}
        badge={
          result.attention.level === "high"
            ? "High attention"
            : result.attention.level === "medium"
              ? "Medium attention"
              : "Low attention"
        }
      >
        <ul className="space-y-2">
          {result.attention.factors.map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden className="mt-0.5 text-ink-400">
                •
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-ink-400">
          &quot;Attention&quot; means how carefully your situation deserves
          review — it is not a judgment that anything is wrong.
        </p>
      </ResultCard>

      {/* C. Checklist */}
      <ResultCard
        tone="neutral"
        eyebrow="Prepare"
        title={`Your ${taxYear} preparation checklist`}
      >
        {result.checklist.accountNotes.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
              Accounts to review
            </p>
            <ul className="mt-2 space-y-2">
              {result.checklist.accountNotes.map((a) => (
                <li key={a.label} className="flex gap-2">
                  <span aria-hidden className="mt-0.5 text-brand-600">
                    ☐
                  </span>
                  <span>
                    <strong className="font-semibold text-ink-700">
                      {a.label}:
                    </strong>{" "}
                    {a.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Documents to gather
          </p>
          <ul className="mt-2 space-y-2">
            {result.checklist.documents.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden className="mt-0.5 text-brand-600">
                  ☐
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Questions to ask your CPA
          </p>
          <ul className="mt-2 space-y-2">
            {result.checklist.cpaQuestions.map((q) => (
              <li key={q} className="flex gap-2">
                <span aria-hidden className="mt-0.5 text-brand-600">
                  ☐
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-ink-900/5 pt-4">
          <button
            type="button"
            onClick={copyChecklist}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {copied ? "✓ Copied!" : "Copy checklist"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-900/20"
          >
            Print / save as PDF
          </button>
        </div>
      </ResultCard>

      <p className="text-xs leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">Joint ownership note:</strong>{" "}
        Joint ownership rules can change how values are counted, especially for spouses
        filing jointly vs separately. This tool gives an educational estimate; confirm with a CPA.
      </p>
      <p className="text-xs leading-relaxed text-ink-400">
        <strong className="font-semibold text-ink-500">
          Educational only — not tax advice.
        </strong>{" "}
        This checker helps you prepare questions and documents for a qualified
        CPA or tax professional familiar with US–India cross-border reporting.
        It cannot determine your actual filing obligations.
      </p>
      <DataStamp
        lastUpdated={DATA_STAMP.lastUpdated}
        source={DATA_STAMP.source}
        sourceLabel={DATA_STAMP.sourceLabel}
      />
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Official sources</p>
        <ul className="space-y-1 text-xs text-ink-400">
          <li>
            <a href="https://www.irs.gov/fbar" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600">
              IRS — FBAR (FinCEN Form 114)
            </a>
          </li>
          <li>
            <a href="https://www.irs.gov/businesses/comparison-of-form-8938-and-fbar-requirements" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600">
              IRS — Comparison of Form 8938 and FBAR requirements
            </a>
          </li>
          <li>
            <a href="https://www.irs.gov/instructions/i8938" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600">
              IRS — Instructions for Form 8938
            </a>
          </li>
          <li>
            <a href="https://www.irs.gov/businesses/corporations/basic-questions-and-answers-on-form-8938" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-600">
              IRS — Basic questions and answers on Form 8938
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  return <ToolLayout inputs={inputPanel} results={resultPanel} />;
}
