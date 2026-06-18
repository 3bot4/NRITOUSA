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
    cta: "Start NRI Wealth Checkup",
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
    cta: "Read NRE/NRO Tax Guide",
    type: "Guide",
    href: "/articles/nre-nro-accounts-explained",
  },
  {
    hook: "Before selling India property, calculate the U.S. + India tax together.",
    support:
      "Estimate capital gains, TDS, repatriation steps, and foreign tax credit questions before making a decision.",
    cta: "Plan India Property Sale",
    type: "Tool/Guide",
    href: "/india-property",
  },
  {
    hook: "After 10 years in the U.S., your financial life needs a cleanup.",
    support:
      "Review accounts, beneficiaries, estate documents, retirement plans, India assets, and compliance risks.",
    cta: "Open 10-Year NRI Checklist",
    type: "Checklist",
    href: "/articles/10-year-nri-wealth-checklist",
  },
  {
    hook: "Your CPA may not understand India. Your CA may not understand the IRS.",
    support:
      "Generate a clean summary of your U.S. and India assets so both advisors can review the same facts.",
    cta: "Create CPA/CA Summary",
    type: "Tool",
    href: "/nri-wealth-checkup",
  },
  {
    hook: "Plan before your parents’ property becomes your tax problem.",
    support:
      "Organize inheritance, nominees, property documents, tax basis, and repatriation questions early.",
    cta: "Review Inheritance Checklist",
    type: "Guide",
    href: "/nri-estate-planning",
  },
  {
    hook: "Retiring in India? Your 401(k), IRA, Social Security, RNOR status, and currency plan must work together.",
    support:
      "Plan U.S. retirement accounts, India residency status, withdrawals, and currency timing before moving.",
    cta: "Start Return-to-India Planner",
    type: "Tool/Guide",
    href: "/return-to-india",
  },
];

export default function CommonNriQuestions() {
  return (
    <section aria-labelledby="nri-questions-h" className="mt-10">
      <div className="mb-5 max-w-2xl">
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
          cross-border now. Here are the questions we hear most — and the free
          tool, guide, or checklist that answers each one.
        </p>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div
            key={c.cta + c.hook.slice(0, 12)}
            className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ring-1 ring-inset ${TYPE_STYLES[c.type]}`}
            >
              {c.type}
            </span>
            <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-ink-900">
              {c.hook}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
              {c.support}
            </p>
            <Link
              href={c.href}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              {c.cta} <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
