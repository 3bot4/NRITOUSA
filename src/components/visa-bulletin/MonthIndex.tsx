import Link from "next/link";
import {
  PUBLISHED_MONTHS,
  indiaEmploymentMovement,
  monthLabel,
  monthPath,
} from "@/lib/visaBulletinMonths";
import { formatCutoff } from "@/lib/visa-bulletin";

/**
 * Index of every published monthly bulletin page, newest first.
 *
 * Rendered at the top of /visa-bulletin/monthly-update, which keeps its URL and
 * becomes the hub for the month pages. Driven by PUBLISHED_MONTHS, so a month
 * appears here the moment it is published and never before.
 */
export default function MonthIndex() {
  const months = PUBLISHED_MONTHS.slice().sort().reverse();
  if (months.length === 0) return null;

  return (
    <div className="mx-auto mb-10 max-w-[720px] rounded-2xl border border-brand-200 bg-brand-50/40 p-5 sm:p-6">
      <h2 className="text-lg font-black tracking-tight text-ink-900">
        Bulletin by bulletin
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-600">
        A page per published bulletin, newest first — India cutoffs, the
        month-over-month change for every category and country, and which chart
        USCIS is accepting. We publish a month only once the Department of State
        has actually released it; forecasts live on the{" "}
        <Link
          href="/visa-bulletin/october-2026-predictions"
          className="text-brand-700 underline"
        >
          predictions page
        </Link>
        .
      </p>

      <ul className="mt-4 space-y-2">
        {months.map((m) => {
          const india = indiaEmploymentMovement(m);
          const eb2 = india.filter((r) => r.category === "eb2")[0];
          const eb3 = india.filter((r) => r.category === "eb3")[0];
          return (
            <li key={m}>
              <Link
                href={monthPath(m)}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl border border-ink-900/10 bg-white px-4 py-3 transition hover:border-brand-300"
              >
                <span className="text-sm font-bold text-brand-700">
                  {monthLabel(m)} visa bulletin →
                </span>
                <span className="text-xs text-ink-500">
                  {eb2 && <>EB-2 India {formatCutoff(eb2.fad.to)}</>}
                  {eb2 && eb3 && " · "}
                  {eb3 && <>EB-3 India {formatCutoff(eb3.fad.to)}</>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
