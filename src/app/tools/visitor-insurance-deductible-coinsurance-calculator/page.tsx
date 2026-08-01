import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsuranceDeductibleCoinsuranceCalculator from "@/components/tools/VisitorInsuranceDeductibleCoinsuranceCalculator";
import { getTool } from "@/lib/tools";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceToolBreadcrumb,
  visitorInsuranceWebAppJsonLd,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const tool = getTool("visitor-insurance-deductible-coinsurance-calculator")!;
const PATH = "/tools/visitor-insurance-deductible-coinsurance-calculator";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "How does a visitor insurance deductible work?",
    answer:
      "You generally pay the deductible amount first on eligible costs, then the plan applies coinsurance to what's left. A $250 deductible on a $1,000 bill leaves $750 to run through coinsurance. Whether the deductible resets per policy period, per incident, or per service depends on the certificate.",
  },
  {
    question: "What's the difference between a per-incident and a per-policy deductible?",
    answer:
      "A per-policy deductible is met once for the whole coverage period, no matter how many separate medical events happen. A per-incident deductible can be charged again for each new, unrelated medical event — so multiple incidents on one trip could each carry their own deductible. Use the calculator above with the \"incident label\" field to see the difference.",
  },
  {
    question: "What does 80/20 coinsurance mean?",
    answer:
      "It means the plan pays 80% and you pay 20% of the eligible amount after the deductible. On a $1,500 post-deductible balance, that's a $1,200 insurer payment and a $300 member share. A 90/10 split shifts more of that balance to the insurer.",
  },
  {
    question: "Does copay apply before or after the deductible?",
    answer:
      "It depends entirely on the certificate — there's no universal rule. Some plans apply a flat copay first and run the deductible on what's left; others apply the deductible first and the copay afterward. The order changes how much of a smaller bill you owe, so check the exact sequence in your certificate.",
  },
];

export default function VisitorInsuranceDeductibleCoinsuranceCalculatorPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceWebAppJsonLd({ path: PATH, name: tool.title, description: tool.description }),
    visitorInsuranceArticleJsonLd({ path: PATH, headline: tool.seoTitle, description: tool.seoDescription }),
    faqJsonLd(faq),
    visitorInsuranceToolBreadcrumb(PATH, tool.label)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug={tool.slug}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Visitor Insurance", href: VISITOR_INSURANCE_BASE }, { label: tool.label }]}
        icon={tool.icon}
        category="Visitor Insurance"
        title={tool.title}
        hook="See exactly how your deductible and coinsurance apply to a real bill — per-incident vs per-policy, copay before or after, any coinsurance split."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not an insurance quote or coverage determination."
        disclaimerPoints={[
          "Not an insurance quote — enter terms from your own quote or certificate.",
          "Never invents a deductible, coinsurance split, or copay you did not enter.",
          "The insurer or claims administrator makes the final benefit determination.",
          "Consult the insurer or a licensed agent when it matters to your situation.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5 text-sm leading-relaxed text-teal-900">
                <strong className="font-semibold">Quick answer:</strong> Your deductible is what you pay first on an eligible bill; coinsurance is the percentage split of what&rsquo;s left after that. Enter your certificate&rsquo;s exact deductible amount, frequency,
                and coinsurance split below to see a numbered, line-by-line calculation for one or more bills.
              </p>
            </div>
          </Container>
        </section>

        <section id="deductible-coinsurance-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsuranceDeductibleCoinsuranceCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <details className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How the calculation works &amp; common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    The engine applies copay, deductible, and coinsurance in the exact order your certificate specifies — never a fixed order — then reports the remaining deductible, coinsurance cap, and policy maximum after each claim. Full sequence:{" "}
                    <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</Link>.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Assuming a low deductible always means low total liability, without checking the coinsurance split</li>
                    <li>Not confirming whether the deductible resets per incident during a single trip</li>
                    <li>Assuming a coinsurance cap exists when the certificate doesn&rsquo;t state one</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.healthcare.gov/glossary/deductible/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Deductible</a>,{" "}
                <a href="https://www.healthcare.gov/glossary/co-insurance/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">Coinsurance</a>
                {" "}and your own policy certificate. Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-sm font-semibold text-ink-700">Related visitor insurance tools &amp; guides</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/tools/visitor-insurance-cost-calculator" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Full household liability calculator</p>
                </Link>
                <Link href="/tools/visitor-insurance-policy-maximum-calculator" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Policy maximum vs out-of-pocket maximum</p>
                </Link>
                <Link href="/visitor-insurance/glossary" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Visitor insurance glossary</p>
                </Link>
                <Link href={VISITOR_INSURANCE_BASE} className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">← Visitor Insurance hub</p>
                </Link>
              </div>
              <AuthorReviewLine lastUpdated={VISITOR_INSURANCE_UPDATED_HUMAN} className="mt-6" />
            </div>
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
