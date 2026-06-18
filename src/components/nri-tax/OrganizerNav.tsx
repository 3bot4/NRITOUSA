"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/nri-wealth-checkup/dashboard", label: "Dashboard" },
  { href: "/nri-wealth-checkup/profile", label: "Profile" },
  { href: "/nri-wealth-checkup/assets", label: "Assets" },
  { href: "/nri-wealth-checkup/income", label: "Income & TDS" },
  { href: "/nri-wealth-checkup/report", label: "Report" },
];

/** The 4 numbered steps of the wizard (Dashboard is an overview, not a step). */
const STEPS: { href: string; label: string }[] = [
  { href: "/nri-wealth-checkup/profile", label: "Profile" },
  { href: "/nri-wealth-checkup/assets", label: "Assets" },
  { href: "/nri-wealth-checkup/income", label: "Income & TDS" },
  { href: "/nri-wealth-checkup/report", label: "Report" },
];

/** Sub-navigation across the organizer's screens. */
export default function OrganizerNav({
  taxYear,
  availableYears,
  onYearChange,
}: {
  taxYear?: number;
  availableYears?: number[];
  onYearChange?: (y: number) => void;
}) {
  const pathname = usePathname();
  const stepIndex = STEPS.findIndex((s) => s.href === pathname);

  return (
    <div className="mb-6 border-b border-ink-900/10 pb-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs — horizontally scrollable on mobile, no wrap. */}
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Organizer sections"
        >
          {TABS.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        {taxYear != null && availableYears && onYearChange && (
          <label className="flex flex-none items-center gap-2 text-sm text-ink-600">
            <span className="font-semibold">Tax year</span>
            <select
              value={taxYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="rounded-lg border border-ink-900/15 bg-white px-2.5 py-1.5 text-sm font-semibold text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Step indicator + autosave note */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        {stepIndex >= 0 ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex].label}
          </p>
        ) : (
          <span />
        )}
        <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <span aria-hidden>✓</span> Changes save automatically in this browser.
        </p>
      </div>
    </div>
  );
}
