import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { site } from "@/lib/site";

const title = "About NRI to USA";
const description =
  "NRI to USA, owned by Wealth Building Academy LLC, helps NRIs, Indian immigrants, students, and families understand practical life and money decisions in the United States.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { type: "website", url: "/about", title, description },
  twitter: { title, description },
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
              Why this website exists
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

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Who we help
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              {site.name} is written for NRIs, Indian immigrants, international
              students, H-1B and L-1 workers, green card holders, and families
              planning a move to — or already building a life in — the United
              States. Whether you landed last week or five years ago, our guides
              meet you where you are.
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Topics we cover
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-ink-700">
              <li>Getting started: your first days, banking, phone, and SSN</li>
              <li>Banking, credit cards, and building a US credit score</li>
              <li>US taxes, FBAR/FATCA, and India–US double taxation</li>
              <li>Housing, renting, mortgages, and buying a home</li>
              <li>Cars, financing, insurance, and driving licenses</li>
              <li>Investing, 401(k), Roth IRA, and retirement planning</li>
              <li>India–USA money transfers, NRE/NRO accounts, and property</li>
              <li>Insurance, students, families, and community life</li>
            </ul>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              What we do not provide
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              We publish educational content only. We are not financial advisors,
              CPAs, attorneys, or immigration consultants, and nothing on this
              site is personalized financial, tax, legal, immigration, or
              investment advice. For decisions specific to your situation, please
              consult a licensed professional. See our{" "}
              <Link href="/disclaimer" className="text-brand-600 underline">
                disclaimer
              </Link>
              .
            </p>

            <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink-900">
              Ownership
            </h2>
            <p className="mt-4 leading-8 text-ink-700">
              {site.name} is owned and operated by{" "}
              <strong>{site.owner}</strong>, founded by{" "}
              <Link href="/about-deepak" className="text-brand-600 underline">
                Deepak Middha
              </Link>
              , a Chartered Accountant and Series 65 holder who writes and
              reviews the guides on this site. You can reach us anytime through
              our{" "}
              <Link href="/contact" className="text-brand-600 underline">
                contact page
              </Link>
              .
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
