import Link from "next/link";
import {
  taxComplianceClusterTools,
  TAX_COMPLIANCE_PATH,
} from "@/lib/taxCompliance";

/**
 * Homepage entry point for the India Tax & Compliance hub. A curated, labeled
 * row of the tagged cluster (calculators + tools) plus a link into the hub —
 * distinct from the generic AllToolsGrid above it, which lists everything.
 */
export default function TaxComplianceSpotlight() {
  const items = taxComplianceClusterTools();
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="tax-hub-h">
      <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-xl shadow-sm"
            >
              🧾
            </span>
            <div>
              <h2
                id="tax-hub-h"
                className="text-base font-bold tracking-tight text-ink-900"
              >
                India Tax &amp; Compliance
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Selling property, repatriation, residency, FBAR/FATCA &amp; DTAA
                — calculators, checkers, and guides in one place.
              </p>
            </div>
          </div>
          <Link
            href={TAX_COMPLIANCE_PATH}
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Open the hub →
          </Link>
        </div>

        <Link
          href="/india-tax-compliance/nri-tax-forms-limits"
          className="group mt-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
        >
          <span className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-lg"
            >
              🗂️
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                NRI Tax Forms &amp; Limits Center
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                US &amp; India forms, triggers, thresholds, and deadlines — in two tables.
              </span>
            </span>
          </span>
          <span aria-hidden className="flex-none text-sm font-semibold text-rose-600 group-hover:translate-x-0.5">
            →
          </span>
        </Link>

        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-3.5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${t.accent} text-lg`}
              >
                {t.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {t.label}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-400">
                  {t.kind === "calculator" ? "Calculator" : "Tool"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
