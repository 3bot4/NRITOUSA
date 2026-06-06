import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

const title = "Resources & Checklists for NRIs in the USA";
const description =
  "Free step-by-step checklists for new immigrants — moving to the USA, first apartment, building credit, buying a car, sending money to India, taxes, retirement, and settling your family.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resources" },
  openGraph: { type: "website", url: "/resources", title, description },
  twitter: { title, description },
};

type Resource = {
  icon: string;
  title: string;
  description: string;
  topic: { label: string; href: string };
  steps: string[];
  articles: { label: string; href: string }[];
};

const resources: Resource[] = [
  {
    icon: "🛬",
    title: "New to USA checklist",
    description:
      "Everything to set up in your first weeks — from SSN and bank account to phone plan and credit card.",
    topic: { label: "New to USA guides", href: "/topics/new-to-usa" },
    steps: [
      "Get your SSN (or ITIN) and a US address",
      "Open a checking + savings account",
      "Set up a phone plan and utilities",
      "Apply for your first (secured) credit card",
      "Find temporary, then permanent housing",
    ],
    articles: [
      { label: "First 7 days in the USA", href: "/articles/first-7-days-in-usa" },
      { label: "First 30 days in the USA", href: "/articles/first-30-days-in-usa" },
      { label: "SSN & financial next steps", href: "/articles/ssn-financial-next-steps" },
    ],
  },
  {
    icon: "🏠",
    title: "First apartment checklist",
    description:
      "Rent your first place without a US credit history — and know exactly what to check before you sign.",
    topic: { label: "Housing guides", href: "/topics/housing" },
    steps: [
      "Calculate the rent you can actually afford",
      "Prepare proof of income / offer letter / deposit",
      "Read the lease terms and break-lease clause",
      "Budget for security deposit + renters insurance",
      "Document the apartment's condition at move-in",
    ],
    articles: [
      { label: "First apartment & lease guide", href: "/articles/first-apartment-lease-guide" },
      { label: "Renting with no credit history", href: "/articles/rent-apartment-no-credit-history" },
      { label: "How much rent can you afford?", href: "/articles/how-much-rent-can-you-afford" },
    ],
  },
  {
    icon: "💳",
    title: "Credit score checklist",
    description:
      "Go from an invisible credit file to a 700+ score with the right first moves and habits.",
    topic: { label: "Credit guides", href: "/topics/credit" },
    steps: [
      "Open a secured credit card",
      "Become an authorized user if possible",
      "Keep utilization under 10%",
      "Pay in full and on time, every month",
      "Avoid multiple hard inquiries early on",
    ],
    articles: [
      { label: "Build US credit from zero", href: "/articles/build-us-credit-score-from-zero" },
      { label: "Best secured credit cards", href: "/articles/best-secured-credit-cards-immigrants" },
      { label: "How credit utilization works", href: "/articles/credit-utilization-explained" },
    ],
  },
  {
    icon: "🚗",
    title: "Car buying checklist",
    description:
      "Buy and insure your first car even with thin credit — and avoid the classic newcomer mistakes.",
    topic: { label: "Car guides", href: "/topics/cars" },
    steps: [
      "Set a total budget (price + insurance + fuel)",
      "Decide used vs new vs lease",
      "Get pre-approved or explore no-cosigner options",
      "Compare insurance quotes before you buy",
      "Inspect, test drive, and check the title/history",
    ],
    articles: [
      { label: "Buy vs lease with no credit", href: "/articles/buy-vs-lease-car-no-credit" },
      { label: "Buy a car without a cosigner", href: "/articles/buy-car-without-cosigner" },
      { label: "Cheap insurance on a foreign license", href: "/articles/cheap-car-insurance-foreign-license" },
    ],
  },
  {
    icon: "🔁",
    title: "India–USA money transfer checklist",
    description:
      "Move money between India and the USA the tax-smart, low-fee way using the right accounts.",
    topic: { label: "Transfer guides", href: "/topics/money-transfer" },
    steps: [
      "Choose the cheapest transfer service & rate",
      "Use NRE/NRO accounts correctly",
      "Account for the 1% US remittance fee & TCS",
      "Keep records for tax and FBAR reporting",
      "Plan large transfers around exchange rates",
    ],
    articles: [
      { label: "Cheapest way to send money to India", href: "/articles/cheapest-way-send-money-usa-india" },
      { label: "NRE vs NRO accounts explained", href: "/articles/nre-nro-accounts-explained" },
      { label: "The 1% US remittance fee", href: "/articles/us-1-percent-remittance-fee" },
    ],
  },
  {
    icon: "🧾",
    title: "Tax documents checklist",
    description:
      "Know which forms to save each year so your first US tax return — and FBAR — go smoothly.",
    topic: { label: "Tax guides", href: "/topics/taxes" },
    steps: [
      "Collect W-2s and any 1099s",
      "Track India income and interest",
      "Gather foreign account balances for FBAR",
      "Save investment & brokerage statements",
      "Keep proof of taxes paid in India (for DTAA)",
    ],
    articles: [
      { label: "Your first US tax return", href: "/articles/h1b-first-tax-return-guide" },
      { label: "FBAR & FATCA guide", href: "/articles/fbar-fatca-nri-guide" },
      { label: "India–US double taxation", href: "/articles/double-taxation-dtaa-india-usa" },
    ],
  },
  {
    icon: "🏦",
    title: "Retirement account checklist",
    description:
      "Set up tax-advantaged accounts early — even if you might move back to India one day.",
    topic: { label: "Retirement guides", href: "/topics/retirement" },
    steps: [
      "Capture the full 401(k) employer match",
      "Open a Roth or Traditional IRA",
      "Use an HSA if you have an HDHP",
      "Choose low-cost index funds",
      "Have a plan for accounts if you repatriate",
    ],
    articles: [
      { label: "401(k) match explained", href: "/articles/401k-match-explained-nri" },
      { label: "Roth vs Traditional IRA", href: "/articles/roth-ira-vs-traditional-nri" },
      { label: "401(k) if you leave the USA", href: "/articles/what-happens-to-401k-leaving-usa" },
    ],
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family settlement checklist",
    description:
      "Bring your family and build stability — schools, healthcare, and an emergency fund that fits family life.",
    topic: { label: "Family guides", href: "/topics/families" },
    steps: [
      "Plan dependents' visas and documents",
      "Research school districts before you rent/buy",
      "Set up family health insurance",
      "Build a 3–6 month emergency fund",
      "Budget for visits to India and family support",
    ],
    articles: [
      { label: "Moving to the USA with family", href: "/articles/moving-to-usa-with-family-checklist" },
      { label: "School district basics", href: "/articles/school-district-basics-immigrant-parents" },
      { label: "Emergency fund for families", href: "/articles/emergency-fund-for-families-usa" },
    ],
  },
];

export default function ResourcesPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Resources", url: "/resources" },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Resources
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Checklists &amp; starter guides
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">
            Practical, step-by-step checklists for the biggest decisions new
            immigrants face — paired with the in-depth guides behind each one.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((r) => (
              <div
                key={r.title}
                className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                    {r.icon}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-ink-900">
                    {r.title}
                  </h2>
                </div>
                <p className="mt-4 text-ink-500">{r.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {r.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-700">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                      >
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t border-ink-900/5 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Read the guides
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {r.articles.map((a) => (
                      <li key={a.href}>
                        <Link
                          href={a.href}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                          → {a.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href={r.topic.href}
                    className="inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Open {r.topic.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
