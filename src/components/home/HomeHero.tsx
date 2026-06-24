import Link from "next/link";
import Container from "@/components/Container";
import Icon, { type IconName } from "@/components/Icon";

/**
 * The four primary entry-point CTAs shown directly under the hero copy. All
 * four render as filled brand-blue cards so they read as one prominent set.
 */
const heroCtas: {
  label: string;
  href: string;
  icon: IconName;
}[] = [
  {
    label: "Start Your NRI Wealth Checkup",
    href: "/nri-wealth-checkup",
    icon: "chart-arrows",
  },
  {
    label: "Check FBAR/FATCA Risk",
    href: "/tools/fbar-fatca-checker",
    icon: "shield-check",
  },
  {
    label: "DIY NRI Tax Filings",
    href: "/tools/nri-tax-filing-roadmap",
    icon: "scale",
  },
  {
    label: "Immigration Tracker",
    href: "/immigration-tracker",
    icon: "id-badge",
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

        {/* Primary hero CTAs — four equally-weighted, filled brand-blue cards. */}
        <div className="mt-5 grid gap-2.5 sm:max-w-3xl sm:grid-cols-2 lg:grid-cols-4">
          {heroCtas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-center text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              <Icon name={cta.icon} className="h-4 w-4 flex-none" />
              {cta.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
