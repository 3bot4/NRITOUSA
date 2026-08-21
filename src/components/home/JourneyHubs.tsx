import Link from "next/link";
import Container from "@/components/Container";

/**
 * "One hub for every stage of the journey" — eight crawlable cards routing to
 * the site's top-level hubs. Line-art icons rather than emoji so the row reads
 * as navigation chrome, not content.
 */
type IconKey =
  | "globe"
  | "building"
  | "doc"
  | "trend"
  | "back"
  | "shield"
  | "cap"
  | "grid";

const PATHS: Record<IconKey, React.ReactNode> = {
  globe: (
    <>
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  building: <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  doc: (
    <>
      <path d="M9 7h6M9 11h6M9 15h4" />
      <rect x="5" y="3" width="14" height="18" rx="2" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  back: (
    <>
      <path d="M3 12h13M11 6l-6 6 6 6" />
      <path d="M21 4v16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
      <path d="M12 8v6M9 11h6" />
    </>
  ),
  cap: (
    <>
      <path d="M22 9L12 4 2 9l10 5z" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
};

function Icon({ name }: { name: IconKey }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}

const hubs: { href: string; icon: IconKey; title: string; blurb: string }[] = [
  {
    href: "/immigration",
    icon: "globe",
    title: "Immigration",
    blurb:
      "H-1B, the green card process, PERM, I-140, priority dates, and the visa bulletin decoded.",
  },
  {
    href: "/uscis",
    icon: "building",
    title: "USCIS Hub",
    blurb:
      "Case status, receipt numbers, RFEs, processing times, and forms — tracked for Indian applicants.",
  },
  {
    href: "/india-tax-compliance",
    icon: "doc",
    title: "Tax & Compliance",
    blurb:
      "FBAR, FATCA, DTAA, ITR filing, TDS, and Form 15CA/CB — dual-country filing without the panic.",
  },
  {
    href: "/long-term-nri-wealth",
    icon: "trend",
    title: "Wealth",
    blurb:
      "401(k), Roth IRA, brokerage, India property, and estate planning across two countries.",
  },
  {
    href: "/return-to-india",
    icon: "back",
    title: "Return to India",
    blurb:
      "RNOR status, repatriation, currency timing, and what to do with U.S. accounts when you move back.",
  },
  {
    href: "/visitor-insurance",
    icon: "shield",
    title: "Visitor Insurance",
    blurb:
      "Coverage for parents visiting the USA — plan comparisons, deductibles, and hospital bill math.",
  },
  {
    href: "/education",
    icon: "cap",
    title: "US Education",
    blurb:
      "F-1 and OPT rules, grade finder, GPA and SAT tools, college costs and rankings for NRI kids.",
  },
  {
    href: "/tools",
    icon: "grid",
    title: "All Tools",
    blurb:
      "Browse the full library — 20+ calculators, checkers, trackers, and step-by-step roadmaps.",
  },
];

export default function JourneyHubs() {
  return (
    <section
      aria-labelledby="journey-hubs-h"
      className="border-y border-ink-900/10 bg-white py-14 sm:py-16"
    >
      <Container>
        <div className="mb-7">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-brand-600">
            Explore by topic
          </span>
          <h2
            id="journey-hubs-h"
            className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
          >
            One hub for every stage of the journey
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col gap-2 rounded-2xl border border-ink-900/10 bg-[#FAFBFD] p-5 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">
                <Icon name={hub.icon} />
              </span>
              <h3 className="mt-1 text-base font-bold tracking-tight text-ink-900">
                {hub.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-500">{hub.blurb}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
