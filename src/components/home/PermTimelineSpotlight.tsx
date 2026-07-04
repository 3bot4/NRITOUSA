import Link from "next/link";

const HIGHLIGHTS = [
  { icon: "💵", text: "PWD & recruitment estimate" },
  { icon: "🔎", text: "PERM decision month + audit" },
  { icon: "📄", text: "I-140 window & premium timing" },
  { icon: "⏰", text: "H-1B max-out / extension risk" },
];

const BADGES = ["PERM", "PWD", "DOL times", "I-140", "H-1B"];

export default function PermTimelineSpotlight() {
  return (
    <section aria-labelledby="perm-spotlight-h" className="mt-8">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 text-xl shadow-sm"
            >
              ⏳
            </span>
            <div>
              <h2 id="perm-spotlight-h" className="text-base font-bold tracking-tight text-ink-900">
                PERM Processing Time Calculator
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Estimate your PWD, recruitment, PERM approval, I-140, priority date, and H-1B max-out risk timeline.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BADGES.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-blue-100 bg-white px-2 py-0.5 text-[11px] font-semibold text-blue-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/perm-processing-time-calculator"
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Check PERM Timeline →
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
