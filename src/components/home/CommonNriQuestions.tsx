import Link from "next/link";

/**
 * Conversion-focused block for permanent NRIs / Indian families in the USA.
 * Each card leads with a money question (the "hook"), one supporting sentence,
 * a CTA type label (Tool / Guide / Checklist), and a CTA button to the best
 * existing internal route. Internal links only. Visual language matches the
 * site's card system (rounded-2xl, shadow-card, hover lift) and the
 * NriWealthPlanning section above it.
 */

type CtaType = "Tool" | "Guide" | "Checklist" | "Tool/Guide";

type QuestionCard = {
  hook: string;
  support: string;
  cta: string;
  type: CtaType;
  href: string;
};

/** Badge styling per CTA type so the label is scannable at a glance. */
const TYPE_STYLES: Record<CtaType, string> = {
  Tool: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Guide: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Checklist: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Tool/Guide": "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const CARDS: QuestionCard[] = [
  {
    hook: "You are not just an immigrant anymore — your money is now cross-border.",
    support:
      "Map your U.S. and India assets and see what needs tax, reporting, retirement, or estate attention.",
    cta: "Start Checkup",
    type: "Tool",
    href: "/nri-wealth-checkup",
  },
  {
    hook: "Your India accounts may be creating U.S. tax paperwork.",
    support:
      "Check whether NRE, NRO, FD, brokerage, or mutual fund balances may trigger FBAR, FATCA, or other reporting.",
    cta: "Check FBAR/FATCA Risk",
    type: "Tool",
    href: "/tools/fbar-fatca-checker",
  },
  {
    hook: "NRE interest is tax-free in India, not automatically tax-free in America.",
    support:
      "Understand how U.S. and India tax treatment can differ for NRE, NRO, FD, and India-source income.",
    cta: "Read Tax Guide",
    type: "Guide",
    href: "/articles/nre-nro-accounts-explained",
  },
  {
    hook: "Before selling India property, calculate the U.S. + India tax together.",
    support:
      "Estimate capital gains, TDS, repatriation steps, and foreign tax credit questions before making a decision.",
    cta: "Plan Property Sale",
    type: "Tool/Guide",
    href: "/india-property",
  },
  {
    hook: "After 10 years in the U.S., your financial life needs a cleanup.",
    support:
      "Review accounts, beneficiaries, estate documents, retirement plans, India assets, and compliance risks.",
    cta: "Open Checklist",
    type: "Checklist",
    href: "/articles/10-year-nri-wealth-checklist",
  },
  {
    hook: "Your CPA may not understand India. Your CA may not understand the IRS.",
    support:
      "Generate a clean summary of your U.S. and India assets so both advisors can review the same facts.",
    cta: "Create Summary",
    type: "Tool",
    href: "/nri-wealth-checkup",
  },
  {
    hook: "Plan before your parents’ property becomes your tax problem.",
    support:
      "Organize inheritance, nominees, property documents, tax basis, and repatriation questions early.",
    cta: "Review Checklist",
    type: "Guide",
    href: "/nri-estate-planning",
  },
  {
    hook: "Retiring in India? Your 401(k), IRA, Social Security, RNOR status, and currency plan must work together.",
    support:
      "Plan U.S. retirement accounts, India residency status, withdrawals, and currency timing before moving.",
    cta: "Start Planner",
    type: "Tool/Guide",
    href: "/return-to-india",
  },
];

export default function CommonNriQuestions() {
  return (
    <section
      aria-labelledby="nri-questions-h"
      className="mt-10 grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10"
    >
      {/* Left: sticky intro so the long list on the right doesn't read as a wall. */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-brand-600">
          Real questions, real answers
        </p>
        <h2
          id="nri-questions-h"
          className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
        >
          Common NRI Money Questions We Help You Answer
        </h2>
        <p className="mt-2 text-ink-500">
          If you&apos;re an Indian family settled in the USA, your money is
          cross-border now. Here are the questions we hear most — tap any to see
          the free tool, guide, or checklist that answers it.
        </p>
      </div>

      {/* Right: accordion list. <details>/<summary> keeps every answer and link
          in the DOM (crawlable) while collapsing the visual height. */}
      <div className="divide-y divide-ink-900/5 overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card">
        {CARDS.map((c, i) => (
          <details
            key={c.cta + c.hook.slice(0, 12)}
            name="nri-question"
            open={i === 0}
            className="group px-5"
          >
            <summary className="flex cursor-pointer list-none items-start gap-3 py-4 [&::-webkit-details-marker]:hidden">
              <span
                className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ring-1 ring-inset ${TYPE_STYLES[c.type]}`}
              >
                {c.type}
              </span>
              <h3 className="flex-1 text-base font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
                {c.hook}
              </h3>
              <span
                aria-hidden
                className="mt-1 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="pb-5 pl-0 pr-2">
              <p className="text-sm leading-relaxed text-ink-500">{c.support}</p>
              <Link
                href={c.href}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                {c.cta} <span aria-hidden className="ml-1">→</span>
              </Link>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
