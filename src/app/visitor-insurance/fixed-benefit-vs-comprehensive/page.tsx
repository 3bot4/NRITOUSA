import type { Metadata } from "next";
import Link from "next/link";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import FixedVsComprehensiveComparison from "@/components/tools/visitorInsurance/FixedVsComprehensiveComparison";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/fixed-benefit-vs-comprehensive";

export const metadata: Metadata = pageMetadata({
  title: "Fixed-Benefit vs Comprehensive Visitor Insurance: What Changes",
  description:
    "Fixed-benefit (scheduled) vs comprehensive visitor insurance: why two plans with the same policy maximum can pay very different amounts on the same bill. Compare with real numbers.",
  path: PATH,
  type: "article",
});

const faq: FaqItem[] = [
  {
    question: "What is a scheduled or fixed benefit in visitor insurance?",
    answer:
      "A fixed (scheduled) benefit is a flat, pre-set amount the plan pays for a specific service — for example, a set amount for a physician visit — regardless of what the provider actually billed. You owe the difference between the bill and the scheduled amount, subject to any further policy limits.",
  },
  {
    question: "Is a comprehensive plan always better than a fixed-benefit plan?",
    answer:
      "Not necessarily, and this page does not rank one as universally better. A comprehensive plan's deductible and coinsurance can still leave you owing a meaningful share of a large bill, while a fixed-benefit plan's scheduled amounts can be generous for common, lower-cost services. Compare both against your realistic worst-case scenario.",
  },
  {
    question: "Can a plan be part comprehensive and part fixed-benefit?",
    answer:
      "Yes — this is called a hybrid plan. It may apply comprehensive deductible/coinsurance math to some services and a flat scheduled benefit to others. Always check which rule applies to each service category in the certificate.",
  },
  {
    question: "Why do two plans with the same policy maximum pay so differently?",
    answer:
      "The policy maximum only caps the ceiling — it says nothing about how much the plan pays up to that ceiling. A comprehensive plan calculates its payment from the deductible and coinsurance formula; a fixed-benefit plan pays a flat scheduled amount per service. Two very different formulas can both stay under the same $100,000 ceiling while paying very different amounts on the same bill.",
  },
];

export default function FixedVsComprehensivePage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "Fixed-Benefit vs Comprehensive Visitor Insurance: What Changes",
      description: "Why two visitor insurance plans with the same policy maximum can pay very different amounts — scheduled benefits vs deductible/coinsurance, explained with numbers.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "Fixed-Benefit vs Comprehensive")
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
          <span className="text-ink-500">Fixed-Benefit vs Comprehensive</span>
        </nav>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-700 px-3 py-1 text-xs font-semibold text-white">🔀 Plan design</span>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">Fixed-Benefit vs Comprehensive Visitor Insurance: What Changes</h1>
        </div>

        <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            A comprehensive visitor insurance plan applies a deductible and coinsurance percentage to eligible costs, similar to typical US health insurance. A fixed-benefit (scheduled) plan instead pays a flat, pre-set amount for each type of service, and you owe
            the difference between that amount and the actual bill. Two plans can advertise the exact same policy maximum and still pay very differently on the same claim — the formula underneath the maximum is what matters. Neither type is universally better; the
            table below shows both, side by side, on four editable example bills.
          </p>
        </div>

        <section id="comparison-tool" className="scroll-mt-24 mb-10">
          <FixedVsComprehensiveComparison />
        </section>

        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Scheduled benefits</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A scheduled (fixed) benefit is a flat dollar amount the certificate lists for a specific service — for example, a set amount for a physician visit, a set amount for an ER visit, a set daily or total amount for a hospital admission. The plan pays that
              amount (or the actual bill, if lower) — never comprehensive-style deductible/coinsurance math on top of it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Deductible</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Deductibles are a comprehensive-plan concept — the amount you pay before the plan starts sharing eligible costs. Fixed-benefit plans typically don&rsquo;t have one, because the plan&rsquo;s payment for each service is already capped by the schedule
              itself rather than by cost-sharing math.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Coinsurance</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Coinsurance is the percentage split between you and a comprehensive plan after the deductible. It has no equivalent on the fixed-benefit side of a plan — there, the &ldquo;split&rdquo; is simply the gap between the scheduled amount and the actual bill,
              which can be a much larger share on an expensive claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Policy maximum</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Both plan types can carry the same headline policy maximum — the most the plan will pay in total. But the maximum is a ceiling, not a formula. As the table above shows, reaching that ceiling means something different depending on how quickly each
              plan&rsquo;s formula pays out per claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Service limits</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Many plans of both types also cap individual service categories — a sublimit for imaging, a separate cap for prescriptions, a cap on ambulance transport. A generous overall policy maximum does not guarantee a generous limit for the specific service you
              actually need.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Remaining balance</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              On a comprehensive plan, what you owe beyond the deductible and coinsurance is generally limited to whatever the certificate defines (and possibly capped by a true out-of-pocket maximum, if one exists). On a fixed-benefit plan, your remaining balance is
              simply the bill minus the scheduled amount — and unlike coinsurance, it does not shrink as a percentage on a bigger bill, so a large claim can leave a much larger dollar gap.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why two plans with the same policy maximum can pay very different amounts</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              This is the central point of this page. The policy maximum tells you the most a plan will ever pay — it says nothing about how the plan gets there. A comprehensive plan with a low deductible and 80/20 coinsurance will typically pay a high percentage of
              most bills. A fixed-benefit plan with modest scheduled amounts can leave you owing a large fixed dollar gap on the same bill, especially for hospitalization. Always run your own realistic scenarios — start with the{" "}
              <Link href="/tools/visitor-insurance-cost-calculator" className="text-brand-600 underline">Cost &amp; Liability Calculator</Link> or the{" "}
              <Link href="/tools/visitor-insurance-plan-comparison" className="text-brand-600 underline">Plan Comparison Calculator</Link> with your own quotes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Sources</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>
                <a href="https://www.healthcare.gov/glossary/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Glossary</a>
              </li>
              <li>Your own policy certificate, summary of benefits, or underwriter documents</li>
            </ul>
            <p className="mt-2 text-xs text-ink-400">Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}. See the{" "}
              <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">calculator methodology</Link>.</p>
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
          This guide and its calculator are educational only, not insurance advice or a coverage determination. The example numbers above are illustrative, not quotes from any real insurer. The policy certificate controls, and the insurer or claims administrator makes
          the final benefit determination.
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
