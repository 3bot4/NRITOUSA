import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "NRITOUSA is a premium, SEO-focused content platform helping NRIs and new immigrants navigate money and life in the USA.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "🎯",
    title: "Practical over theoretical",
    body: "Every guide ends with what to actually do — not just what to know. We write the article we wish we'd had when we landed.",
  },
  {
    icon: "🔍",
    title: "Specific to NRIs",
    body: "Generic US finance advice ignores PFICs, FBAR, NRE/NRO accounts, and the green-card waiting game. We don't.",
  },
  {
    icon: "🤝",
    title: "Honest & independent",
    body: "Educational content first. We tell you when to DIY and when to pay a professional — even when it's the boring answer.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-900/5 bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              About {site.name}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              The guide we wish we&apos;d had when we landed
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-500">
              {site.name} is a premium content platform for NRIs and new
              immigrants in the United States. We turn the confusing, scattered,
              high-stakes decisions of immigrant life — taxes, credit, housing,
              investing, retirement, sending money home — into clear, trustworthy
              playbooks.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-ink-900/5 bg-white p-7 shadow-card"
              >
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-ink-500">{v.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-prose">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">
              Why we built this
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              When you move to a new country, the hardest problems aren&apos;t
              the obvious ones. They&apos;re the small, compounding decisions —
              which card to get, how to file your first return, whether to skip
              the 401(k) match because you &quot;might move back.&quot; Get them
              right early and they compound in your favor for decades. Get them
              wrong and you spend years undoing the damage.
            </p>
            <p className="mt-4 leading-8 text-ink-700">
              We started {site.name} to put those decisions in one trustworthy
              place, written by people who&apos;ve navigated the same questions.
              No jargon, no fear-mongering, no affiliate-driven nonsense — just
              the clearest possible answer to &quot;what should I actually do?&quot;
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/topics"
                className="rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Explore the guides
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 text-center font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
              >
                Get in touch
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
