import Link from "next/link";

/**
 * Canonical hub destinations used by the "Related hubs" cards. Keeping the
 * catalog in one place means individual pages reference hubs by key and can
 * never link to a mistyped/404 path. Add new hubs here, not inline.
 */
export const HUBS = {
  immigration: {
    href: "/immigration",
    icon: "🛂",
    title: "Immigration Hub",
    blurb: "H1B, green card, USCIS, visa bulletin & priority dates.",
  },
  uscis: {
    href: "/uscis",
    icon: "📋",
    title: "USCIS Hub",
    blurb: "Case status, receipt numbers, forms & processing times.",
  },
  fbar: {
    href: "/tools/fbar-fatca-checker",
    icon: "🏦",
    title: "FBAR/FATCA Center",
    blurb: "US reporting for NRE/NRO, FDs & Indian mutual funds.",
  },
  tax: {
    href: "/india-tax-compliance",
    icon: "🧾",
    title: "India Tax & Compliance",
    blurb: "FBAR, FATCA, DTAA, ITR, TDS & repatriation in one place.",
  },
  taxRoadmap: {
    href: "/tools/nri-tax-filing-roadmap",
    icon: "🗺️",
    title: "DIY NRI Tax Filing Roadmap",
    blurb: "Your full U.S. + India filing checklist for the year.",
  },
  wealth: {
    href: "/long-term-nri-wealth",
    icon: "🌉",
    title: "NRI Wealth Hub",
    blurb: "India vs US investing, property, retirement & estate.",
  },
  wealthCheckup: {
    href: "/nri-wealth-checkup",
    icon: "🩺",
    title: "NRI Wealth Checkup",
    blurb: "Free organizer for accounts, assets & cross-border tax.",
  },
} as const;

export type HubKey = keyof typeof HUBS;

/**
 * 2–4 "related hub" cards for the foot of a major tool/article. Every card is a
 * crawlable <a href> pointing at a canonical hub, so individual pages always
 * flow link equity up to the right hub.
 */
export default function RelatedHubs({
  hubs,
  title = "Related hubs",
  className = "",
}: {
  hubs: HubKey[];
  title?: string;
  className?: string;
}) {
  const cards = hubs.map((k) => HUBS[k]);
  if (cards.length === 0) return null;

  return (
    <section aria-label={title} className={className}>
      <h2 className="mb-4 text-base font-semibold text-ink-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((hub) => (
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
