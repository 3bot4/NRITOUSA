import Link from "next/link";

const BADGES = ["60-day window", "I-94 / I-797", "H-1B transfer", "I-140", "H-4 family"];

/**
 * Homepage card routing recently laid-off H-1B workers into the Indian
 * immigrant-focused layoff checklist. Lives in the immigration/tools band of
 * the homepage — deliberately not the hero.
 */
export default function H1bLayoffSpotlight() {
  return (
    <section aria-labelledby="h1b-layoff-spotlight-h">
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 text-xl shadow-sm"
            >
              ⚡
            </span>
            <div>
              <h2
                id="h1b-layoff-spotlight-h"
                className="text-base font-bold tracking-tight text-ink-900"
              >
                Laid off on H-1B?
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Start with an Indian immigrant-focused checklist: 60-day planning, I-94, I-797,
                H-1B transfer, I-140, H-4 dependents, money runway, and LayoffNext tools.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BADGES.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-orange-100 bg-white px-2 py-0.5 text-[11px] font-semibold text-orange-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/h1b-layoff"
            className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
          >
            Open H-1B Layoff Checklist →
          </Link>
        </div>
      </div>
    </section>
  );
}
