import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const guides = [
  {
    category: "Getting Started",
    title:
      "First 30 Days in the USA: Banking, Phone, Credit Card, Apartment",
    excerpt:
      "A week-by-week checklist for everything you need to set up the moment you land.",
    readingTime: 8,
    href: "/topics/finance",
    accent: "from-sky-500 to-blue-600",
  },
  {
    category: "Credit",
    title: "How to Build Credit Score as a New Immigrant",
    excerpt:
      "The exact 12-month playbook to go from no credit file to a 750+ score.",
    readingTime: 9,
    href: "/articles/build-us-credit-score-from-zero",
    accent: "from-violet-500 to-purple-600",
  },
  {
    category: "Housing",
    title: "Should You Rent or Buy a Home in the USA?",
    excerpt:
      "Mortgages on a visa, the real costs of owning, and when buying actually wins.",
    readingTime: 9,
    href: "/articles/buying-first-home-on-visa",
    accent: "from-amber-500 to-orange-600",
  },
  {
    category: "Cars",
    title: "Buying a Car in the USA: Loan, Insurance, Registration",
    excerpt:
      "Finance a car without credit history and avoid getting fleeced at the dealership.",
    readingTime: 8,
    href: "/articles/buy-vs-lease-car-no-credit",
    accent: "from-cyan-500 to-teal-600",
  },
  {
    category: "Retirement",
    title: "401k vs Roth IRA for Immigrants",
    excerpt:
      "Which to prioritize, how the employer match works, and what happens if you move back.",
    readingTime: 7,
    href: "/articles/roth-ira-vs-traditional-nri",
    accent: "from-indigo-500 to-blue-700",
  },
  {
    category: "India-USA Money",
    title: "Sending Money from USA to India: What to Know",
    excerpt:
      "NRE vs. NRO accounts, the best transfer services, and the tax-smart way to remit.",
    readingTime: 7,
    href: "/articles/nre-nro-accounts-explained",
    accent: "from-emerald-500 to-teal-600",
  },
];

export default function PopularGuides() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Most read"
          title="Popular guides"
          description="The articles every newly-arrived immigrant should read first."
          action={{ label: "All guides", href: "/topics" }}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <Link href={guide.href} className="flex h-full flex-col p-6">
                <span
                  className={`w-fit rounded-full bg-gradient-to-r ${guide.accent} px-3 py-1 text-xs font-semibold text-white`}
                >
                  {guide.category}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {guide.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                  {guide.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-ink-900/5 pt-4">
                  <span className="text-xs text-ink-400">
                    {guide.readingTime} min read
                  </span>
                  <span className="text-sm font-semibold text-brand-600">
                    Read guide{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
