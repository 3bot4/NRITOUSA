import Link from "next/link";
import Container from "@/components/Container";
import Icon, { type IconName } from "@/components/Icon";

/**
 * The four "who are you?" entry points shown directly under the hero CTA. Each
 * routes a visitor straight to the hub/tool that matches their situation.
 */
const personas: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  accent: string;
}[] = [
  {
    title: "Just moved to the US?",
    description: "Banking, driving, housing — start here",
    href: "/topics/new-to-usa",
    icon: "plane-arrival",
    accent: "from-sky-500 to-blue-600",
  },
  {
    title: "On H-1B and waiting for your green card?",
    description: "See your wait time, visa bulletin, and salary data",
    href: "/tools/green-card-tracker",
    icon: "id-badge",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Managing India money from the US?",
    description: "Property sale tax, FBAR, repatriation calculators",
    href: "/india-tax-compliance",
    icon: "chart-arrows",
    accent: "from-rose-500 to-pink-600",
  },
  {
    title: "Moving back to India?",
    description: "401(k) cashout, RNOR status, currency timing",
    href: "/calculators/401k-return-to-india",
    icon: "home-move",
    accent: "from-amber-500 to-orange-600",
  },
];

/**
 * Compact value-prop hero + the single primary CTA. The "Check your Green Card
 * date" button is the largest, most prominent action on the page (full-width,
 * bigger padding/font than anything below it). A 2×2 grid of persona entry
 * cards sits below it, and the tools grid renders beneath that on the home page.
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-900/5 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_75%_-10%,rgba(53,99,255,0.08),transparent)]" />
      <Container className="relative py-3.5 sm:py-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
            Free immigration, wealth, tax, and money tools for{" "}
            <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
              Indians in the USA
            </span>
          </h1>
          <p className="mt-2 text-sm text-ink-500 sm:text-base">
            Free calculators, checklists, and guides for Indian families
            managing U.S. income, India assets, taxes, retirement, property,
            inheritance, and return-to-India decisions.
          </p>
          <p className="mt-1.5 text-[13px] text-ink-400">
            20+ free tools · 50+ guides · Data updated daily
          </p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-ink-400">
            Built for Indian immigrants, NRIs, H-1B workers, green card
            applicants, students, and families navigating life between India and
            the USA.
          </p>
        </div>

        {/* Primary + secondary hero CTAs. Primary (wealth checkup) is the
            largest, most prominent action; the secondary FBAR/FATCA risk check
            sits beside it on desktop and stacks below on mobile. */}
        <div className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <Link
            href="/nri-wealth-checkup"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 px-8 py-5 text-lg font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg sm:flex-[3] sm:text-xl"
          >
            <Icon name="chart-arrows" className="h-6 w-6" />
            Start Your NRI Wealth Checkup
          </Link>
          <Link
            href="/tools/fbar-fatca-checker"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-brand-200 bg-white px-6 py-5 text-base font-bold text-brand-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg sm:flex-[2]"
          >
            <Icon name="shield-check" className="h-5 w-5" />
            Check FBAR/FATCA Risk
          </Link>
          <Link
            href="/tools/nri-tax-filing-roadmap"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-brand-200 bg-white px-6 py-5 text-base font-bold text-brand-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg sm:flex-[2]"
          >
            <Icon name="scale" className="h-5 w-5" />
            Start tax roadmap
          </Link>
        </div>

        {/* Persona entry cards — 2×2 grid mirroring the hub sub-tool cards. */}
        <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2">
          {personas.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${p.accent} text-white shadow-sm`}
                >
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h2 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
                  {p.title}
                </h2>
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-500">
                {p.description}
              </p>
              <span className="mt-2.5 text-xs font-semibold text-brand-600">
                Start{" "}
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
      </Container>
    </section>
  );
}
