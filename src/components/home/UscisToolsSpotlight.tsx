import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/uscis-case-status-meaning",
    icon: "🛂",
    accent: "from-blue-600 to-indigo-600",
    title: "USCIS Status Decoder",
    desc: "Understand status messages like received, actively reviewed, RFE, approved, transferred, and card produced.",
  },
  {
    href: "/tools/priority-date-checker",
    icon: "📅",
    accent: "from-blue-700 to-indigo-600",
    title: "Priority Date Checker",
    desc: "Check how your EB-1, EB-2, or EB-3 India priority date compares with the current visa bulletin.",
  },
  {
    href: "/tools/green-card-stage-finder",
    icon: "🟢",
    accent: "from-green-700 to-emerald-600",
    title: "Green Card Stage Finder",
    desc: "Find your stage in the PERM, I-140, priority date, I-485, EAD, and advance parole process.",
  },
  {
    href: "/tools/h1b-transfer-risk-checklist",
    icon: "📋",
    accent: "from-orange-600 to-amber-500",
    title: "H-1B Transfer Checklist",
    desc: "Review planning risks around H-1B transfer, layoff timing, receipt, premium processing, and travel.",
  },
  {
    href: "/tools/uscis-processing-delay-checker",
    icon: "⏱️",
    accent: "from-blue-600 to-cyan-600",
    title: "Processing Delay Checker",
    desc: "Understand whether your USCIS case may still be in a normal waiting period or needs closer review.",
  },
  {
    href: "/tools/uscis-receipt-number-decoder",
    icon: "🔍",
    accent: "from-indigo-600 to-violet-600",
    title: "Receipt Prefix Decoder",
    desc: "Learn what IOE, LIN, SRC, EAC, WAC, MSC, and other receipt prefixes may indicate about your case.",
  },
];

export default function UscisToolsSpotlight() {
  return (
    <section aria-labelledby="uscis-hub-h">
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl shadow-sm"
            >
              🛂
            </span>
            <div>
              <h2
                id="uscis-hub-h"
                className="text-base font-bold tracking-tight text-ink-900"
              >
                USCIS &amp; Green Card Tools for Indians
              </h2>
              <p className="mt-0.5 text-sm text-ink-500">
                Check your immigration stage, decode case status, estimate delays, and plan your next step — no sensitive personal data needed.
              </p>
            </div>
          </div>
          <Link
            href="/uscis"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Open USCIS Hub →
          </Link>
        </div>

        <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
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
                <span className="block text-sm font-bold tracking-tight text-ink-900 group-hover:text-blue-700">
                  {t.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  {t.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
