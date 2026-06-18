"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import { useOrganizer, currentTaxYear } from "@/lib/nri-tax/storage";
import { useScrollTopOnMount } from "@/lib/nri-tax/useScrollTopOnMount";
import { buildSummary } from "@/lib/nri-tax/rules";
import { sampleAssets, sampleIncome, sampleProfile } from "@/lib/nri-tax/sample";
import {
  assetMeta,
  incomeMeta,
  TOOL_DISCLAIMER,
  type AssetItem,
  type IncomeItem,
  type RuleCategory,
  type RuleOutput,
  type RuleStatus,
  type UserProfile,
} from "@/lib/nri-tax/types";
import {
  FILING_STATUS_OPTIONS,
  INDIA_TAX_STATUS_OPTIONS,
  LIVING_LOCATION_OPTIONS,
  US_STATUS_OPTIONS,
} from "@/lib/nri-tax/types";

const usd = (n: number | null) => (n == null ? "—" : `$${Math.round(n).toLocaleString("en-US")}`);
const optLabel = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

const STATUS_STYLES: Record<RuleStatus, string> = {
  "May be required": "bg-rose-50 text-rose-700 ring-rose-600/20",
  "Review needed": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Not enough information": "bg-slate-100 text-slate-600 ring-slate-500/20",
  "Likely not applicable": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const CATEGORY_ORDER: RuleCategory[] = ["US Reporting", "US Tax", "India Tax", "Planning"];

function RuleCard({ r }: { r: RuleOutput }) {
  return (
    <div className="print-clean rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-ink-900">{r.form}</h4>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[r.status]}`}
        >
          {r.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{r.reason}</p>
      {(r.relatedAssets.length > 0 || r.relatedIncome.length > 0) && (
        <p className="mt-2 text-xs text-ink-400">
          Related: {[...r.relatedAssets, ...r.relatedIncome].join(", ")}
        </p>
      )}
      {r.sourceUrl && (
        <a
          href={r.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Official source ↗
        </a>
      )}
    </div>
  );
}

export default function OrganizerReport() {
  useScrollTopOnMount();
  const org = useOrganizer();
  const router = useRouter();
  const params = useSearchParams();
  const isSample = params.get("sample") === "1";
  const [showClear, setShowClear] = useState(false);

  if (!isSample && !org.ready) {
    return (
      <Container className="py-10">
        <p className="text-ink-500">Loading…</p>
      </Container>
    );
  }

  // Sample mode renders fixed demo data and never reads/writes the user's store.
  const taxYear = isSample ? currentTaxYear() : org.taxYear;
  const profile: UserProfile = isSample ? sampleProfile(taxYear) : org.profile;
  const assets: AssetItem[] = isSample ? sampleAssets(taxYear) : org.assets;
  const income: IncomeItem[] = isSample ? sampleIncome(taxYear) : org.income;
  const summary = isSample ? buildSummary(profile, assets, income) : org.summary;

  const { totals, riskScore, rules, cpaQuestions, documentChecklist, nextYearReminders } = summary;
  const generated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Hide blank income rows from the report/PDF (data is not deleted): only show
  // a row if it has a meaningful amount, tax/TDS, or a note.
  const visibleIncome = income.filter(
    (i) =>
      (i.amount ?? 0) > 0 ||
      (i.taxPaidOrTds ?? 0) > 0 ||
      (i.notes ?? "").trim().length > 0
  );

  const byCategory = (c: RuleCategory) => rules.filter((r) => r.category === c);
  const formsToReview = rules.filter(
    (r) => r.status === "May be required" || r.status === "Review needed"
  );

  const clearData = () => {
    org.resetAll();
    setShowClear(false);
    router.push("/nri-wealth-checkup/dashboard");
  };

  return (
    <Container className="py-8">
      <div className="no-print">
        {!isSample && (
          <OrganizerNav
            taxYear={org.taxYear}
            availableYears={org.availableYears}
            onYearChange={org.setTaxYear}
          />
        )}
      </div>

      {isSample && (
        <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong className="font-semibold">Sample — not your data.</strong> This report uses a
          fictional NRI family to show what the tool produces. Nothing here is saved.{" "}
          <Link href="/nri-wealth-checkup/profile" className="font-semibold underline">
            Start your own checkup →
          </Link>
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            NRI Global Wealth &amp; Tax Organizer — Educational Report
            {isSample && " (Sample)"}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Tax year {taxYear} · Generated {generated}
            {isSample && " · Sample data"}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Download PDF
          </button>
          {!isSample && (
            <>
              <Link
                href="/nri-wealth-checkup/assets"
                className="rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
              >
                Edit Inputs
              </Link>
              <button
                onClick={() => setShowClear(true)}
                className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                Clear Local Data
              </button>
            </>
          )}
        </div>
      </div>

      <span
        className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${
          riskScore === "High"
            ? "bg-rose-50 text-rose-700 ring-rose-600/20"
            : riskScore === "Medium"
              ? "bg-amber-50 text-amber-700 ring-amber-600/20"
              : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
        }`}
      >
        Educational review level: {riskScore}
      </span>
      <p className="mt-2 max-w-2xl text-xs text-ink-500">
        This is not a filing determination. It highlights topics to review with a qualified CPA/CA.
      </p>

      {/* Profile summary */}
      <Section title="Profile summary">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row k="U.S. tax status" v={optLabel(US_STATUS_OPTIONS, profile.usStatus)} />
          <Row k="Filing status" v={optLabel(FILING_STATUS_OPTIONS, profile.filingStatus)} />
          <Row k="Living location" v={optLabel(LIVING_LOCATION_OPTIONS, profile.livingLocationForTax)} />
          <Row k="State" v={profile.state || "—"} />
          <Row k="India tax status" v={optLabel(INDIA_TAX_STATUS_OPTIONS, profile.indiaTaxStatus)} />
          <Row k="Days in India" v={profile.daysInIndia == null ? "—" : String(profile.daysInIndia)} />
        </dl>
      </Section>

      {/* Asset map */}
      <Section title="Asset map">
        <SummaryTable
          head={["Asset", "Type", "Country", "Year-end", "Max", "Tax/TDS"]}
          rows={assets.map((a) => [
            a.institutionOrAssetNickname || "—",
            assetMeta(a.assetType).label,
            a.country,
            usd(a.yearEndValue),
            usd(a.maximumYearValue),
            usd(a.taxPaidOrTds),
          ])}
          empty="No assets entered."
        />
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <Mini k="Total U.S. assets (year-end)" v={usd(totals.usAssets)} />
          <Mini k="Total India assets (year-end)" v={usd(totals.indiaAssets)} />
          <Mini k="Other foreign assets (year-end)" v={usd(totals.otherForeignAssets)} />
          <Mini
            k="Foreign financial accounts — maximum during year"
            v={usd(totals.foreignFinancialAccountsMax)}
          />
          <Mini
            k="Specified foreign financial assets — maximum during year"
            v={usd(totals.specifiedForeignFinancialAssetsMax)}
          />
          <Mini k="India-source income" v={usd(totals.indiaSourceIncome)} />
        </div>
      </Section>

      {/* Income summary */}
      <Section title="Income summary">
        <SummaryTable
          head={["Type", "Source", "Amount", "Tax/TDS"]}
          rows={visibleIncome.map((i) => [
            incomeMeta(i.incomeType).label,
            i.countrySource,
            usd(i.amount),
            usd(i.taxPaidOrTds),
          ])}
          empty="No income entered."
        />
      </Section>

      {/* Reporting & tax checklist by category */}
      {CATEGORY_ORDER.map((cat) => {
        const items = byCategory(cat);
        if (!items.length) return null;
        return (
          <Section key={cat} title={categoryTitle(cat)}>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((r, idx) => (
                <RuleCard key={`${r.form}-${idx}`} r={r} />
              ))}
            </div>
          </Section>
        );
      })}

      {/* Forms that may need review */}
      <Section title="Forms that may need review">
        {formsToReview.length === 0 ? (
          <p className="text-sm text-ink-500">
            No specific forms flagged from the information entered. Still review with a professional.
          </p>
        ) : (
          <ul className="space-y-1.5 text-sm text-ink-700">
            {formsToReview.map((r, i) => (
              <li key={`${r.form}-${i}`} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
                <span>
                  <strong className="font-semibold text-ink-900">{r.form}</strong> — {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* CPA/CA questions */}
      <Section title="Questions to ask your CPA / CA">
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-700">
          {cpaQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </Section>

      {/* Documents to collect */}
      <Section title="Documents to collect">
        <ul className="grid gap-1.5 text-sm text-ink-700 sm:grid-cols-2">
          {documentChecklist.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">☐</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      {/* Next-year reminders */}
      <Section title="Next-year reminders">
        <ul className="space-y-1.5 text-sm text-ink-700">
          {nextYearReminders.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-300" />
              {n}
            </li>
          ))}
        </ul>
      </Section>

      {/* Disclaimer */}
      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-slate-50 p-5 text-xs leading-relaxed text-ink-500">
        <strong className="font-semibold text-ink-700">Disclaimer:</strong> {TOOL_DISCLAIMER}{" "}
        <Link href="/disclaimer" className="text-brand-600 underline">
          Full disclaimer
        </Link>
        .
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Download PDF
        </button>
        <Link
          href={isSample ? "/nri-wealth-checkup/profile" : "/nri-wealth-checkup/dashboard"}
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          {isSample ? "Start your own checkup" : "Back to dashboard"}
        </Link>
      </div>

      {/* Clear-data confirmation modal */}
      {showClear && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink-900">Clear local data?</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              This will remove locally saved entries from this browser only. It cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowClear(false)}
                className="rounded-lg border border-ink-900/15 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
              >
                Cancel
              </button>
              <button
                onClick={clearData}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Clear data
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold tracking-tight text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-ink-900/5 py-1.5">
      <dt className="text-ink-400">{k}</dt>
      <dd className="font-semibold text-ink-900">{v}</dd>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="print-clean rounded-xl border border-ink-900/5 bg-white p-3 shadow-card">
      <p className="text-xs text-ink-400">{k}</p>
      <p className="text-base font-bold text-ink-900">{v}</p>
    </div>
  );
}

function SummaryTable({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: string[][];
  empty: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-ink-400">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-900/5 bg-white shadow-card print-clean">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wider text-ink-400">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-ink-900/5 last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-2.5 ${j === 0 ? "font-semibold text-ink-900" : "text-ink-700"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function categoryTitle(c: RuleCategory): string {
  switch (c) {
    case "US Reporting":
      return "U.S. reporting checklist";
    case "US Tax":
      return "U.S. tax notes";
    case "India Tax":
      return "India tax / ITR notes";
    case "Planning":
      return "Planning notes";
  }
}
