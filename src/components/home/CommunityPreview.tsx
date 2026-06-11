import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const questions = [
  { q: "Is it better to rent for 2 years before buying?", tag: "Housing" },
  { q: "Best credit card for new immigrants?", tag: "Credit" },
  { q: "Should I invest in India after moving to USA?", tag: "Investing" },
  { q: "How much emergency fund should an immigrant family keep?", tag: "Finance" },
  { q: "Should I buy a used car or lease a new car?", tag: "Cars" },
];

export default function CommunityPreview() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Community"
          title="Common questions from new immigrants"
          description="The questions people most often have figuring out money and life in the US."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {questions.map((item) => (
            <Link
              key={item.q}
              href="/topics/community"
              className="group flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg text-brand-600">
                💬
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900 transition-colors group-hover:text-brand-600">
                  {item.q}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-ink-400">
                  <span className="rounded-full bg-ink-900/[0.04] px-2 py-0.5 font-medium text-ink-500">
                    {item.tag}
                  </span>
                </div>
              </div>
              <span
                className="text-ink-300 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          ))}

          {/* CTA card fills the grid's empty slot */}
          <div className="flex flex-col justify-center rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-emerald-600 p-6 text-white shadow-card">
            <p className="text-lg font-bold">Have a question of your own?</p>
            <p className="mt-1 text-sm text-white/80">
              Send it over and we may turn it into a guide that helps others too.
            </p>
            <Link
              href="/contact"
              className="mt-4 w-fit rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-transform hover:-translate-y-0.5"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
