import Link from "next/link";
import Container from "@/components/Container";

/**
 * "Start where everyone else does" — the six highest-traffic destinations,
 * shown as tagged cards so the content type (tool / calculator / guide) is
 * obvious before the click. The full catalog lives on /tools; this row stays
 * short on purpose so the homepage reads as a gateway, not a wall of cards.
 */
type Kind = "Calculator" | "Tool" | "Guide" | "Article";

const KIND_STYLE: Record<Kind, string> = {
  Calculator: "bg-brand-50 text-brand-700",
  Tool: "bg-emerald-50 text-emerald-700",
  Guide: "bg-rose-50 text-rose-700",
  Article: "bg-amber-50 text-amber-700",
};

const cards: {
  kind: Kind;
  title: string;
  blurb: string;
  cta: string;
  href: string;
}[] = [
  {
    kind: "Tool",
    title: "Immigration Tracker",
    blurb:
      "The visa bulletin, priority dates, USCIS processing times, and the green card line for India in one personalised dashboard.",
    cta: "Open your dashboard",
    href: "/immigration-tracker",
  },
  {
    kind: "Tool",
    title: "Green Card Wait Time Tracker & Estimator",
    blurb:
      "See where you stand in the EB-1, EB-2, and EB-3 India lines and estimate a realistic green card wait from your priority date.",
    cta: "Check your wait",
    href: "/tools/green-card-tracker",
  },
  {
    kind: "Calculator",
    title: "401(k) Return-to-India: Cash Out vs. Keep",
    blurb:
      "Model the 30% withholding trap, DTAA Article 20, and RNOR status before you touch your U.S. retirement money.",
    cta: "Compare scenarios",
    href: "/calculators/401k-return-to-india",
  },
  {
    kind: "Tool",
    title: "FBAR & FATCA Checker for NRE / NRO Accounts",
    blurb:
      "Check whether your Indian bank accounts, fixed deposits, PPF, or mutual funds trigger FBAR or Form 8938 reporting.",
    cta: "Check your accounts",
    href: "/tools/fbar-fatca-checker",
  },
  {
    kind: "Tool",
    title: "H-1B Sponsor Finder & Salary Data",
    blurb:
      "Which employers actually sponsor H-1B visas for your role and state — with the wages they filed for.",
    cta: "Find sponsors",
    href: "/tools/h1b-sponsor-finder",
  },
  {
    kind: "Guide",
    title: "Trump Account for H-1B Parents",
    blurb:
      "Eligibility, the $1,000 federal contribution, taxes, and how to apply — the pillar guide for immigrant families.",
    cta: "Read the guide",
    href: "/trump-account-h1b-immigrant-families",
  },
];

export default function MostSearched() {
  return (
    <section aria-labelledby="most-searched-h" className="py-14 sm:py-16">
      <Container>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-brand-600">
              Most searched
            </span>
            <h2
              id="most-searched-h"
              className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
            >
              Start where everyone else does
            </h2>
            <p className="mt-1.5 max-w-2xl text-ink-500">
              The tools and guides NRI families reach for first — built for visa
              holders, not 30-year U.S. citizens.
            </p>
          </div>
          <Link
            href="/tools"
            className="shrink-0 border-b border-transparent pb-0.5 text-sm font-semibold text-brand-600 hover:border-brand-600"
          >
            All tools <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-2.5 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-ink-900/20 hover:shadow-card-hover"
            >
              <span
                className={`self-start rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${KIND_STYLE[c.kind]}`}
              >
                {c.kind}
              </span>
              <h3 className="text-lg font-bold leading-snug tracking-tight text-ink-900">
                {c.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-500">
                {c.blurb}
              </p>
              <span className="text-sm font-semibold text-brand-600 group-hover:underline">
                {c.cta} <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
