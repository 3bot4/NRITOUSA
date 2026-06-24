import Link from "next/link";

/**
 * Top-level hub navigation for the homepage. Five crawlable cards that route
 * visitors into the site's main hubs (immigration, tax, FBAR/FATCA, wealth) plus
 * the full tools index. Kept deliberately simple — labels + one-liners — so the
 * homepage reads as a clear table of contents.
 */
const hubs = [
  {
    href: "/immigration",
    icon: "🛂",
    title: "Immigration Hub",
    blurb: "H1B, green card, USCIS, visa bulletin & priority dates.",
  },
  {
    href: "/india-tax-compliance",
    icon: "🧾",
    title: "India Tax & Compliance Hub",
    blurb: "FBAR, FATCA, DTAA, ITR, TDS, repatriation & calculators.",
  },
  {
    href: "/tools/fbar-fatca-checker",
    icon: "🏦",
    title: "FBAR/FATCA Center",
    blurb: "US reporting for NRE/NRO, FDs & Indian mutual funds.",
  },
  {
    href: "/long-term-nri-wealth",
    icon: "🌉",
    title: "NRI Wealth Hub",
    blurb: "India vs US investing, property, retirement & estate.",
  },
  {
    href: "/return-to-india",
    icon: "🛬",
    title: "Return to India Hub",
    blurb: "401(k), RNOR status, currency timing & moving-back checklist.",
  },
  {
    href: "/tools",
    icon: "🧰",
    title: "All Tools",
    blurb: "Every free calculator and checklist in one place.",
  },
] as const;

export default function HubCards() {
  return (
    <section aria-labelledby="home-hubs-h" className="py-8 sm:py-10">
      <h2
        id="home-hubs-h"
        className="mb-5 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl"
      >
        Explore by hub
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover"
          >
            <span aria-hidden className="text-2xl leading-none">
              {hub.icon}
            </span>
            <h3 className="mt-3 text-sm font-bold tracking-tight text-ink-900 group-hover:text-brand-700">
              {hub.title}
            </h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-500">
              {hub.blurb}
            </p>
            <span className="mt-3 text-xs font-semibold text-brand-600">
              Explore{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
