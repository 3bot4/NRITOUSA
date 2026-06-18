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

/** Sub-navigation across the organizer's logged-in screens. */
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
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-ink-900/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-1" aria-label="Organizer sections">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
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
        <label className="flex items-center gap-2 text-sm text-ink-600">
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
  );
}
