import Link from "next/link";

/**
 * Homepage repositioning section: frames NRItoUSA as a wealth / tax / India-money
 * planning resource (not only an immigration-tools site). Six grouped category
 * cards — five money/planning pillars plus Immigration Tools as one category
 * among them. Each bullet deep-links to an existing article, calculator, or tool
 * where one exists; the card CTA points at the matching hub. Visual style mirrors
 * the existing spotlight cards (rounded-2xl, shadow-card, gradient icon chips).
 */

type Bullet = { label: string; href?: string };

type Group = {
  title: string;
  icon: string;
  accent: string; // gradient for the icon chip
  ring: string; // card border / tint
  bullets: Bullet[];
  cta: { label: string; href: string };
};

const GROUPS: Group[] = [
  {
    title: "NRI Wealth Checkup",
    icon: "📊",
    accent: "from-brand-500 to-indigo-600",
    ring: "border-brand-200 from-brand-50",
    bullets: [
      { label: "10-year NRI wealth checklist", href: "/articles/10-year-nri-wealth-checklist" },
      { label: "Asset map", href: "/nri-wealth-checkup" },
      { label: "Retirement readiness", href: "/articles/nri-retirement-usa-india-currency-risk" },
      { label: "Estate planning checklist", href: "/articles/estate-planning-usa-india-assets" },
    ],
    cta: { label: "Start Wealth Checkup", href: "/nri-wealth-checkup" },
  },
  {
    title: "India Money & Tax",
    icon: "🧾",
    accent: "from-rose-500 to-pink-600",
    ring: "border-rose-200 from-rose-50",
    bullets: [
      { label: "FBAR / FATCA", href: "/tools/fbar-fatca-checker" },
      { label: "DTAA / foreign tax credit", href: "/calculators/dtaa-foreign-tax-credit" },
      { label: "NRE / NRO / FD tax", href: "/articles/nre-nro-accounts-explained" },
      { label: "India rental income", href: "/india-tax-compliance" },
      { label: "Indian mutual funds / PFIC", href: "/articles/pfic-indian-mutual-funds-trap" },
    ],
    cta: { label: "Check Tax & Reporting Risk", href: "/tools/fbar-fatca-checker" },
  },
  {
    title: "India Property",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
    ring: "border-amber-200 from-amber-50",
    bullets: [
      { label: "Sell vs hold", href: "/articles/sell-india-property-before-retirement-usa" },
      { label: "Capital gains", href: "/calculators/india-property-capital-gains" },
      { label: "TDS", href: "/calculators/india-property-capital-gains" },
      { label: "Repatriation", href: "/articles/repatriate-india-property-sale-usa" },
      { label: "Inheritance", href: "/articles/inheriting-indian-assets-us-tax" },
    ],
    cta: { label: "Plan India Property", href: "/india-property" },
  },
  {
    title: "Retirement & Return to India",
    icon: "✈️",
    accent: "from-emerald-500 to-teal-600",
    ring: "border-emerald-200 from-emerald-50",
    bullets: [
      { label: "401(k)", href: "/articles/what-happens-to-401k-leaving-usa" },
      { label: "IRA", href: "/articles/roth-ira-vs-traditional-nri" },
      { label: "Social Security", href: "/articles/social-security-benefits-leaving-us" },
      { label: "RNOR", href: "/calculators/rnor-tax-residency" },
      { label: "Currency planning", href: "/articles/nri-retirement-usa-india-currency-risk" },
    ],
    cta: { label: "Plan Return to India", href: "/return-to-india" },
  },
  {
    title: "Family & Legacy",
    icon: "👪",
    accent: "from-violet-500 to-purple-600",
    ring: "border-violet-200 from-violet-50",
    bullets: [
      { label: "Wills", href: "/articles/estate-planning-usa-india-assets" },
      { label: "Trusts", href: "/articles/estate-planning-usa-india-assets" },
      { label: "Beneficiaries", href: "/nri-estate-planning" },
      { label: "Children as U.S. citizens", href: "/articles/us-kids-india-property-problems" },
      { label: "Parents in India", href: "/articles/inheriting-indian-assets-us-tax" },
    ],
    cta: { label: "Review Legacy Checklist", href: "/nri-estate-planning" },
  },
  {
    title: "Immigration Tools",
    icon: "🛂",
    accent: "from-sky-500 to-blue-600",
    ring: "border-sky-200 from-sky-50",
    bullets: [
      { label: "Green card wait-time tracker", href: "/tools/green-card-tracker" },
      { label: "Visa bulletin & priority dates", href: "/tools/priority-date-checker" },
      { label: "H-1B salaries & lottery timeline", href: "/tools/h1b-salaries" },
      { label: "USCIS case status & forms", href: "/uscis" },
      { label: "Passport renewal in the USA", href: "/indian-passport-renewal-usa" },
    ],
    cta: { label: "View Immigration Tools", href: "/tools" },
  },
];

export default function NriWealthPlanning() {
  return (
    <section aria-labelledby="nri-planning-h" className="mt-10">
      <div className="mb-5 max-w-2xl">
        <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-brand-600">
          Plan your whole financial life
        </p>
        <h2
          id="nri-planning-h"
          className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
        >
          NRI Wealth, Tax &amp; India-Money Planning
        </h2>
        <p className="mt-2 text-ink-500">
          Everything Indian families in the USA need to manage money across both
          countries — wealth, taxes, property, retirement, and legacy — plus the
          immigration tools you already know us for.
        </p>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div
            key={g.title}
            className={`flex flex-col rounded-2xl border bg-gradient-to-br to-white p-5 ${g.ring}`}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br ${g.accent} text-xl shadow-sm`}
              >
                {g.icon}
              </span>
              <h3 className="mt-1 text-base font-bold tracking-tight text-ink-900">
                {g.title}
              </h3>
            </div>

            <ul className="mt-4 flex-1 space-y-1.5 text-sm">
              {g.bullets.map((b, i) => (
                <li key={`${b.label}-${i}`} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-ink-300" />
                  {b.href ? (
                    <Link
                      href={b.href}
                      className="text-ink-600 underline-offset-2 transition-colors hover:text-brand-700 hover:underline"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-ink-600">{b.label}</span>
                  )}
                </li>
              ))}
            </ul>

            <Link
              href={g.cta.href}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              {g.cta.label} <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
