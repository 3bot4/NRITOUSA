import Link from "next/link";
import Container from "@/components/Container";
import Icon, { type IconName } from "@/components/Icon";

/**
 * Hero entry-point CTAs. "Start Your NRI Wealth Checkup" is the single dominant
 * action (large, filled brand-blue, full-width on its row). The remaining three
 * are visually secondary — lighter outline buttons — so the page has one clear
 * primary action instead of four equally-weighted choices.
 */
const primaryCta: { label: string; href: string; icon: IconName } = {
  label: "Start Your NRI Wealth Checkup",
  href: "/nri-wealth-checkup",
  icon: "chart-arrows",
};

const secondaryCtas: {
  label: string;
  href: string;
  icon: IconName;
}[] = [
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

        {/* Dominant primary CTA */}
        <div className="mt-5 sm:max-w-3xl">
          <Link
            href={primaryCta.href}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand-600 px-6 py-4 text-center text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg sm:text-lg"
          >
            <Icon name={primaryCta.icon} className="h-5 w-5 flex-none" />
            {primaryCta.label}
          </Link>

          {/* New-tool spotlight card, directly under the primary CTA. */}
          <Link
            href="/tools/h1b-sponsor-finder"
            className="group mt-2.5 flex items-center gap-3 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm"
            >
              <Icon name="briefcase" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink-900 sm:text-base">
                  H-1B Sponsor Finder
                </span>
                <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                Which companies sponsor H-1Bs for your role &amp; state — ranked
                by certified LCA volume, with median pay.
              </span>
            </span>
            <Icon
              name="arrow-right"
              className="h-4 w-4 flex-none text-brand-600 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          {/* Trump Account spotlight card, directly under the Sponsor Finder. */}
          <Link
            href="/trump-account-h1b-immigrant-families"
            className="group mt-2.5 flex items-center gap-3 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-indigo-50/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm"
            >
              <Icon name="dollar" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-ink-900 sm:text-base">
                  Trump Account for H-1B Families
                </span>
                <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                  New
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                Can H-1B parents open one for a U.S.-born child? Eligibility, the
                $1,000 contribution, Form 4547, taxes &amp; move-back to India.
              </span>
            </span>
            <Icon
              name="arrow-right"
              className="h-4 w-4 flex-none text-brand-600 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          {/* Secondary CTAs — lighter outline buttons so they don't compete. */}
          <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
            {secondaryCtas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand-700 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
              >
                <Icon name={cta.icon} className="h-4 w-4 flex-none" />
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
