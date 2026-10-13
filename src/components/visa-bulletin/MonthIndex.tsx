import Link from "next/link";
import {
  PUBLISHED_MONTHS,
  indiaEmploymentMovement,
  monthLabel,
  monthPath,
} from "@/lib/visaBulletinMonths";
import { formatCutoff } from "@/lib/visa-bulletin";
import {
  PROJECTED_MONTHS,
  indiaEbProjections,
} from "@/lib/visaBulletinProjections";

/**
 * Index of every monthly bulletin page, newest first.
 *
 * Rendered at the top of /visa-bulletin/monthly-update, which keeps its URL and
 * becomes the hub for the month pages.
 *
 * TWO LISTS, KEPT VISIBLY APART. PUBLISHED_MONTHS are released bulletins with
 * real cutoffs. PROJECTED_MONTHS are forecast pages at the same clean month
 * URLs, which become the official page for their month on release. They are
 * grouped and styled separately, and each projected row says so, because a
 * single undifferentiated list is how a reader comes away thinking a forecast
 * was a bulletin.
 */
export default function MonthIndex() {
  const months = PUBLISHED_MONTHS.slice().sort().reverse();
  const projected = PROJECTED_MONTHS.slice().sort().reverse();
  if (months.length === 0 && projected.length === 0) return null;

  return (
    <div className="mx-auto mb-10 max-w-[720px] rounded-2xl border border-brand-200 bg-brand-50/40 p-5 sm:p-6">
      <h2 className="text-lg font-black tracking-tight text-ink-900">
        Bulletin by bulletin
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-600">
        A page per published bulletin, newest first — India cutoffs, the
        month-over-month change for every category and country, and which chart
        USCIS is accepting. We publish a month only once the Department of State
        has actually released it. The FY2027 reset gets its own analysis on the{" "}
        <Link
          href="/visa-bulletin/october-2026"
          className="text-brand-700 underline"
        >
          October 2026 bulletin page
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

      {projected.length > 0 && (
        <>
          <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-amber-700">
            Not yet published
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            A page per upcoming month, at the URL it will keep. Each one carries
            projected <strong>ranges</strong> built from the published archive,
            with the method and the sample size stated, and becomes the official
            bulletin page for that month on release.
          </p>
          <ul className="mt-3 space-y-2">
            {projected.map((m) => {
              const india = indiaEbProjections(m);
              const eb2 = india.filter((r) => r.category === "eb2")[0];
              const eb3 = india.filter((r) => r.category === "eb3")[0];
              return (
                <li key={m}>
                  <Link
                    href={monthPath(m)}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 transition hover:border-amber-400"
                  >
                    <span className="text-sm font-bold text-amber-800">
                      {monthLabel(m)} projection →
                    </span>
                    <span className="text-xs text-ink-500">
                      {eb2 && <>EB-2 India {eb2.fad.rangeLabel}</>}
                      {eb2 && eb3 && " · "}
                      {eb3 && <>EB-3 India {eb3.fad.rangeLabel}</>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
