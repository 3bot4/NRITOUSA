"use client";

import Link from "next/link";
import Container from "@/components/Container";
import OrganizerNav from "./OrganizerNav";
import { useOrganizer } from "@/lib/nri-tax/storage";
import {
  assetMeta,
  incomeMeta,
  TOOL_DISCLAIMER,
  type RuleCategory,
  type RuleOutput,
  type RuleStatus,
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
  const org = useOrganizer();
  if (!org.ready) {
    return (
      <Container className="py-10">
        <p className="text-ink-500">Loading…</p>
      </Container>
    );
  }

  const { profile, assets, income, summary } = org;
  const { totals, riskScore, rules, cpaQuestions, documentChecklist, nextYearReminders } = summary;
  const generated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const byCategory = (c: RuleCategory) => rules.filter((r) => r.category === c);
  const formsToReview = rules.filter(
    (r) => r.status === "May be required" || r.status === "Review needed"
  );

  return (
    <Container className="py-8">
      <div className="no-print">
        <OrganizerNav
          taxYear={org.taxYear}
          availableYears={org.availableYears}
          onYearChange={org.setTaxYear}
        />
      </div>

      {/* Title block */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            NRI Global Wealth &amp; Tax Organizer — Educational Report
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Tax year {org.taxYear} · Generated {generated}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Download PDF
          </button>
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
        Review level: {riskScore}
      </span>

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
          head={["Asset", "Type", "Country", "Year-end", "Max", "TDS"]}
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
          <Mini k="Total U.S. assets" v={usd(totals.usAssets)} />
          <Mini k="Total India assets" v={usd(totals.indiaAssets)} />
          <Mini k="Other foreign assets" v={usd(totals.otherForeignAssets)} />
        </div>
      </Section>

      {/* Income summary */}
      <Section title="Income summary">
        <SummaryTable
          head={["Type", "Source", "Amount", "TDS"]}
          rows={income.map((i) => [
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
          href="/nri-wealth-checkup/dashboard"
          className="rounded-xl border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-900/5"
        >
          Back to dashboard
        </Link>
      </div>
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
