import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const topics = [
  { icon: "🏦", label: "Banking", href: "/topics/finance" },
  { icon: "💳", label: "Credit Cards", href: "/topics/credit" },
  { icon: "🧾", label: "Taxes", href: "/topics/taxes" },
  { icon: "📊", label: "401k", href: "/topics/retirement" },
  { icon: "🌱", label: "Roth IRA", href: "/topics/retirement" },
  { icon: "🩺", label: "HSA", href: "/topics/finance" },
  { icon: "🛟", label: "Emergency Fund", href: "/topics/finance" },
  { icon: "🛡️", label: "Insurance", href: "/topics/insurance" },
  { icon: "📈", label: "US Investing", href: "/topics/investing" },
  { icon: "🇮🇳", label: "India Investing", href: "/topics/investing" },
];

export default function FinanceHub() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Finance hub"
          title="Money Topics Every Immigrant Should Understand"
          description="The building blocks of a strong financial life in the US — start anywhere."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {topics.map((topic) => (
            <Link
              key={topic.label}
              href={topic.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition-transform group-hover:scale-110">
                {topic.icon}
              </span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-brand-600">
                {topic.label}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
