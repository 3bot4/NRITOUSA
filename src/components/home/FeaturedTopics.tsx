import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const featured = [
  {
    icon: "🛬",
    title: "New to USA",
    description:
      "Your first-week checklist: SSN, bank account, phone plan, and finding an apartment.",
    href: "/topics/finance",
    accent: "from-sky-500 to-blue-600",
  },
  {
    icon: "💳",
    title: "Banking & Credit",
    description:
      "Open the right accounts and build a 750+ US credit score from absolute zero.",
    href: "/topics/credit",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: "🚗",
    title: "Cars & Insurance",
    description:
      "Buy vs. lease, financing with no credit history, and getting insured affordably.",
    href: "/topics/cars",
    accent: "from-cyan-500 to-teal-600",
  },
  {
    icon: "🏠",
    title: "Renting vs Buying",
    description:
      "Leases, deposits, and the real math on when buying a home actually makes sense.",
    href: "/topics/housing",
    accent: "from-amber-500 to-orange-600",
  },
  {
    icon: "🏦",
    title: "401k & Roth IRA",
    description:
      "Capture the employer match, pick Roth vs. traditional, and plan for moving back.",
    href: "/topics/retirement",
    accent: "from-indigo-500 to-blue-700",
  },
  {
    icon: "🔁",
    title: "India ↔ USA Money Transfers",
    description:
      "NRE/NRO accounts, best transfer services, and moving money tax-efficiently.",
    href: "/topics/money-transfer",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    icon: "📈",
    title: "Investing in India vs USA",
    description:
      "Index funds, brokerage accounts, and the PFIC trap every NRI must avoid.",
    href: "/topics/investing",
    accent: "from-green-500 to-emerald-600",
  },
  {
    icon: "✨",
    title: "Community Stories",
    description:
      "First-person journeys from H-1B to green card — the wins, setbacks, and lessons.",
    href: "/topics/stories",
    accent: "from-fuchsia-500 to-pink-600",
  },
];

export default function FeaturedTopics() {
  return (
    <section id="topics" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Browse by topic"
          title="Featured topics"
          description="Pick a track and go deep — each one is a complete playbook."
          action={{ label: "View all topics", href: "/topics" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-2xl shadow-sm`}
              >
                {topic.icon}
              </span>
              <h3 className="text-base font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                {topic.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                {topic.description}
              </p>
              <span className="mt-4 text-sm font-semibold text-brand-600">
                Explore guide{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
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
