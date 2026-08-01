import type { Metadata } from "next";
import Link from "next/link";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsurancePolicyMaximumCalculator from "@/components/tools/VisitorInsurancePolicyMaximumCalculator";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/how-much-coverage";

export const metadata: Metadata = pageMetadata({
  title: "How Much Visitor Insurance Coverage Do You Need?",
  description:
    "How much visitor insurance coverage do you need? A decision framework — not a fixed number — based on age, trip length, health history, and what your family could absorb.",
  path: PATH,
  type: "article",
});

const faq: FaqItem[] = [
  {
    question: "Is $100,000 enough visitor insurance coverage?",
    answer:
      "It depends entirely on age, trip length, existing health concerns, and what your family could absorb above the plan's maximum — there is no single amount that fits every situation. Use the decision framework and calculator on this page rather than picking a round number by habit.",
  },
  {
    question: "Should I buy $50,000, $100,000, or $250,000 in coverage?",
    answer:
      "A larger maximum gives the plan more room to keep paying on a genuinely severe event, which matters most for older travelers or anyone with a higher medical risk. But the maximum is only one factor — a high-maximum plan with a high deductible and no out-of-pocket cap can still leave real exposure. Weigh the maximum together with the deductible, coinsurance, and whether a true out-of-pocket maximum exists.",
  },
  {
    question: "Does a higher policy maximum mean lower liability?",
    answer:
      "Not by itself. The policy maximum is a ceiling on what the insurer pays, not a formula for how much of a specific bill you'll owe. Two plans with the same maximum can produce very different real-world liability — see Fixed-benefit vs comprehensive for why.",
  },
];

export default function HowMuchCoveragePage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "How Much Visitor Insurance Coverage Do You Need?",
      description: "A decision framework for choosing a visitor insurance policy maximum, based on age, trip length, health history, and financial capacity — not a fixed recommended number.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "How Much Coverage")
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pt-8 mb-5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span aria-hidden>/</span>
          <Link href={VISITOR_INSURANCE_BASE} className="hover:text-brand-600">Visitor Insurance</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-500">How Much Coverage</span>
        </nav>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white">🧭 Decision framework</span>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">How Much Visitor Insurance Coverage Do You Need?</h1>
        </div>

        <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            There is no single coverage amount that fits every visitor — the right policy maximum depends on age, trip length, destination, existing health concerns, financial capacity, plan type, and how much risk your family is comfortable holding. This page is a
            decision framework, not a fixed recommendation. Use the policy-maximum calculator below to see how a specific maximum behaves against real claim amounts before you decide.
          </p>
        </div>

        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">A framework, not a fixed number</h2>
            <p className="text-sm leading-relaxed text-ink-600">Weigh these factors together rather than picking a round number by habit:</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li><strong>Age</strong> — older travelers generally face a higher likelihood of a costly medical event, which argues for a larger maximum where available and affordable.</li>
              <li><strong>Trip duration</strong> — a longer stay increases the window during which something could happen.</li>
              <li><strong>Destination</strong> — regional medical costs and network availability can vary; check network access near where the traveler will actually be.</li>
              <li><strong>Existing health concerns</strong> — even where routine care is excluded, an acute-onset benefit's own age cutoff and dollar cap may matter more than the overall policy maximum.</li>
              <li><strong>Financial capacity</strong> — realistically, what could the family absorb if a bill exceeded the plan's maximum, or if there's no out-of-pocket maximum at all?</li>
              <li><strong>Plan type</strong> — comprehensive and fixed-benefit plans reach their maximum very differently on the same bill; see{" "}
                <Link href="/visitor-insurance/fixed-benefit-vs-comprehensive" className="text-brand-600 underline">Fixed-benefit vs comprehensive</Link>.</li>
              <li><strong>Evacuation coverage</strong> — a separate, often lower-cap benefit that can matter enormously if it's ever needed.</li>
              <li><strong>Risk tolerance</strong> — some families intentionally buy more coverage than the statistical average trip needs, specifically to reduce the chance of a catastrophic gap.</li>
            </ul>
          </section>

          <section id="policy-maximum-tool" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-ink-900 mb-2">See how a specific maximum behaves</h2>
            <p className="text-sm leading-relaxed text-ink-600 mb-4">
              Enter a policy maximum (and, if your certificate states one, an out-of-pocket maximum) alongside a realistic claim amount to see the remaining benefit, whether any amount falls above the maximum, and whether this plan has a genuine contractual ceiling
              on your liability at all.
            </p>
            <VisitorInsurancePolicyMaximumCalculator />
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Sources</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>
                <a href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Out-of-pocket maximum/limit</a>
              </li>
              <li>Your own policy certificate, summary of benefits, or underwriter documents</li>
            </ul>
            <p className="mt-2 text-xs text-ink-400">Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}.</p>
          </section>
        </article>

        <section className="my-10">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <div key={f.question} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <p className="font-semibold text-ink-900">{f.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">A quick note: </strong>
          This page is educational only, not insurance or financial advice, and does not recommend a specific coverage amount for any individual situation. The policy certificate controls, and the insurer or claims administrator makes the final benefit
          determination.
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          <Link href={VISITOR_INSURANCE_BASE} className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
            <p className="font-semibold text-ink-900">← Back to the Visitor Insurance hub</p>
          </Link>
          <Link href="/visitor-insurance/parents-visiting-usa" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
            <p className="font-semibold text-ink-900">Insurance for parents visiting the USA</p>
          </Link>
        </div>

        <AuthorReviewLine lastUpdated={VISITOR_INSURANCE_UPDATED_HUMAN} className="mb-10" />
      </div>
    </>
  );
}
