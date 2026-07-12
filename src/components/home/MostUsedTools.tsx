import Link from "next/link";

/**
 * "Most Used Tools" — a tight, curated set of the 8 highest-traffic tools shown
 * on the homepage. The full catalog now lives on the /tools hub; the homepage
 * deliberately shows only these to stay a clean gateway rather than a wall of
 * cards. A "Browse all tools" link routes to the complete index.
 */
const tools: {
  title: string;
  href: string;
  description: string;
  icon: string;
}[] = [
  {
    title: "NRI Wealth Checkup",
    href: "/nri-wealth-checkup",
    description: "Map U.S. + India assets into an FBAR/FATCA/tax action list.",
    icon: "🧮",
  },
  {
    title: "FBAR / FATCA Checker",
    href: "/tools/fbar-fatca-checker",
    description: "See if your NRE/NRO, FDs or mutual funds need U.S. reporting.",
    icon: "🏦",
  },
  {
    title: "DIY NRI Tax Filing Roadmap",
    href: "/tools/nri-tax-filing-roadmap",
    description: "A step-by-step map of the forms and deadlines for your year.",
    icon: "🧭",
  },
  {
    title: "H-1B Sponsor Finder",
    href: "/tools/h1b-sponsor-finder",
    description: "Which companies sponsor H-1Bs for your role & state.",
    icon: "💼",
  },
  {
    title: "Green Card Wait Tracker",
    href: "/tools/green-card-tracker",
    description: "Estimate your EB-2 / EB-3 India wait from visa-bulletin data.",
    icon: "🟢",
  },
  {
    title: "Immigration Tracker",
    href: "/immigration-tracker",
    description: "Visa bulletin, priority dates and USCIS in one dashboard.",
    icon: "🛂",
  },
  {
    title: "India Property Sale Calculator",
    href: "/calculators/india-property-capital-gains",
    description: "Capital-gains tax, TDS and repatriation on an India sale.",
    icon: "🏘️",
  },
  {
    title: "401(k) Return to India",
    href: "/calculators/401k-return-to-india",
    description: "Cash out vs keep your 401(k) when moving back to India.",
    icon: "🏦",
  },
];

export default function MostUsedTools() {
  return (
    <section aria-labelledby="most-used-tools-h" className="py-8 sm:py-10">
      <div className="flex items-end justify-between gap-3">
        <h2
          id="most-used-tools-h"
          className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
        >
          Most used tools
        </h2>
        <Link
          href="/tools"
          className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Browse all tools <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
          >
            <span aria-hidden className="text-2xl leading-none">
              {t.icon}
            </span>
            <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
              {t.title}
            </h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-500">
              {t.description}
            </p>
            <span className="mt-2.5 text-xs font-semibold text-brand-600">
              Open{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
