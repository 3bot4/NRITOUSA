import Link from "next/link";

/**
 * Curated "Popular guides for Indians in the USA" row on the home page —
 * high-intent internal links to the guides and tools Indians in the USA search
 * for most. Sits directly under the hero/persona cards and above the major hub
 * sections.
 *
 * Some targets are planned articles that may not exist yet; the links are kept
 * here intentionally so the pages can be created later without touching layout.
 */
const guides: { title: string; href: string; description: string }[] = [
  {
    title: "India Visa from USA",
    href: "/india-visa-from-usa",
    description:
      "Which visa you need — eVisa, tourist, business, entry visa or OCI — with estimated fees, times, and documents.",
  },
  {
    title: "Indian Passport Renewal in USA",
    href: "/articles/indian-passport-renewal-usa",
    description:
      "VFS process, documents, fees, photos, processing time, and common mistakes.",
  },
  {
    title: "Visa Bulletin Explained for Indians",
    href: "/articles/visa-bulletin-explained-for-indians",
    description:
      "Learn how priority dates, final action dates, and dates for filing work.",
  },
  {
    title: "H1B Lottery Results 2026/2027",
    href: "/h1b-lottery-results",
    description:
      "How to check H1B lottery results, what Selected / Submitted / Not Selected mean, second-lottery chances, and next steps for F-1 OPT, H-4, and families.",
  },
  {
    title: "EB-2 India Green Card Wait Time",
    href: "/tools/green-card-tracker",
    description:
      "Check your estimated green card wait time using visa bulletin data.",
  },
  {
    title: "FBAR for NRE/NRO Accounts",
    href: "/articles/fbar-nre-nro-accounts",
    description:
      "Understand when Indian bank accounts may need FBAR or FATCA reporting.",
  },
  {
    title: "Moving to USA from India Checklist",
    href: "/articles/moving-to-usa-from-india-checklist",
    description:
      "Banking, housing, phone, credit, driving, insurance, and first-month setup.",
  },
  {
    title: "Indian Population in USA",
    href: "/indian-population-in-usa",
    description:
      "Explore how many Indians live in America — by state and city, income, occupations, students, H-1B trends, green card status, and community patterns.",
  },
];

export default function PopularGuidesForIndians() {
  return (
    <section aria-labelledby="popular-guides-h" className="mb-10">
      <div className="flex items-end justify-between gap-3">
        <h2
          id="popular-guides-h"
          className="text-lg font-bold tracking-tight text-ink-900"
        >
          Popular guides for Indians in the USA
        </h2>
        <Link
          href="/education/articles"
          className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View all guides <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group flex flex-col rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <h3 className="text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
              {g.title}
            </h3>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-500">
              {g.description}
            </p>
            <span className="mt-2.5 text-xs font-semibold text-brand-600">
              Read{" "}
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
