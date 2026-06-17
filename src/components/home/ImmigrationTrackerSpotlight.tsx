import Link from "next/link";

const HIGHLIGHTS = [
  { icon: "📅", text: "EB-1/EB-2/EB-3 India visa bulletin dates" },
  { icon: "📋", text: "I-485 backlog & USCIS processing times" },
  { icon: "🎲", text: "H1B lottery odds & selection history" },
  { icon: "📆", text: "Next visa bulletin countdown" },
];

const BADGES = ["Visa Bulletin", "Green Card", "USCIS", "H1B"];

export default function ImmigrationTrackerSpotlight() {
  return (
    <section aria-labelledby="tracker-spotlight-h">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-xl shadow-sm"
            >
              🛂
            </span>
            <div>
              <h2
                id="tracker-spotlight-h"
                className="text-base font-bold tracking-tight text-ink-900"
              >
                NRI Immigration Tracker
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Track EB-1, EB-2, EB-3 India movement, I-485 backlog, H1B lottery odds, USCIS
                processing times, and the next Visa Bulletin countdown in one place.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BADGES.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/immigration-tracker"
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Open Immigration Tracker →
          </Link>
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-2 rounded-xl border border-ink-900/5 bg-white px-3 py-2.5 shadow-card"
            >
              <span aria-hidden className="text-base">{item.icon}</span>
              <span className="text-xs font-medium text-ink-700">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
