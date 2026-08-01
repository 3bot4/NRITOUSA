import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsuranceCostCalculator from "@/components/tools/VisitorInsuranceCostCalculator";
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

const tool = getTool("visitor-insurance-cost-calculator")!;
const PATH = "/tools/visitor-insurance-cost-calculator";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Is this a visitor insurance quote engine?",
    answer:
      "No. This calculator does not fetch or estimate live insurer pricing. You enter the premium and policy terms from a quote, brochure, or certificate you already have, and the tool shows a line-by-line estimate of what the insurer may pay and what you could still owe.",
  },
  {
    question: "How much will visitor insurance pay for my medical bill?",
    answer:
      "It depends on the specific certificate: the deductible, coinsurance percentage, network status, allowed charge, and any sublimits or policy maximum that apply. Enter your plan's terms and an expected bill above to see a line-by-line estimate — the insurer or claims administrator makes the final determination.",
  },
  {
    question: "Why does the calculator ask for the allowed charge, not just the billed charge?",
    answer:
      "Insurers generally share costs based on the allowed (negotiated) amount, not the provider's full billed charge. If you don't know the allowed amount, the calculator will use the billed charge as a temporary base and clearly flag that the real number may differ — including potential balance billing.",
  },
  {
    question: "Does this calculator know what my policy's out-of-pocket maximum is?",
    answer:
      "Only if you enter one. Many visitor insurance plans do not have a true out-of-pocket maximum the way ACA marketplace plans do — the calculator never assumes one exists. If you leave it blank, the tool will say so and flag that your exposure may not be capped.",
  },
  {
    question: "Can I use this for more than one traveler?",
    answer:
      "Yes — add up to six travelers. By default each traveler's deductible, coinsurance, and benefits are calculated independently and then added together. Shared or embedded-family deductibles and maximums only apply if you explicitly enter that provision from your certificate.",
  },
];

export default function VisitorInsuranceCostCalculatorPage() {
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
        hook="Enter the premium, deductible, coinsurance, and policy maximum from your quote or certificate — see what the insurer may pay and what your family could still owe."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not an insurance quote, not a coverage determination."
        disclaimerPoints={[
          "Not an insurance quote — no live insurer pricing is used.",
          "Not a coverage determination — the insurer or claims administrator decides every claim.",
          "Never invents plan benefits, exclusions, or reimbursement amounts you did not enter.",
          "Numbers, forms, and policy rules vary by insurer, state, and certificate — always verify against your own policy documents.",
          "Consult your insurer, administrator, or a licensed agent when it matters to your situation.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm leading-relaxed text-sky-900">
                <strong className="font-semibold">Quick answer:</strong> Visitor insurance pays a share of eligible medical costs after your deductible and coinsurance, up to the policy&rsquo;s benefit limits — the premium alone does not tell you your real financial protection. Enter your plan&rsquo;s
                terms and an expected bill below for a line-by-line estimate of the insurer&rsquo;s payment and your liability.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-8">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">What this calculator estimates</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  <li>Deductible, copay, and coinsurance for the bill you enter</li>
                  <li>Potential balance billing when the allowed amount is known</li>
                  <li>How much of the policy maximum and any sublimits remain</li>
                  <li>Household totals across up to six travelers</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-900">
                <p className="font-semibold">What it cannot determine</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  <li>Whether a specific diagnosis or treatment will be approved</li>
                  <li>The real allowed (negotiated) amount if you don&rsquo;t know it</li>
                  <li>Whether a provider is actually in-network</li>
                  <li>The insurer&rsquo;s final claim decision</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section id="visitor-insurance-cost-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsuranceCostCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <details className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How the calculation works, what to check, common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    For each bill, the engine starts from the billed charge, applies any exclusion, walks through copay/deductible/coinsurance in the order your certificate specifies — never a fixed order — then applies sublimits, per-incident maximum, policy
                    maximum, and your out-of-pocket maximum only if you entered one. Full sequence: <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</Link>.
                  </p>
                  <p>
                    Run at least two scenarios before comparing plans on premium alone: a moderate bill and a severe one. A lower premium with a high deductible and low policy maximum can leave a family owing more than a higher-premium comprehensive plan.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Comparing only the premium and headline policy maximum, without checking deductible or coinsurance</li>
                    <li>Assuming a policy maximum is the same as a true out-of-pocket maximum</li>
                    <li>Not asking whether a specific condition is excluded as pre-existing before travel</li>
                    <li>Not reading whether the deductible resets per incident or once per policy period</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.healthcare.gov/glossary/deductible/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov</a>,{" "}
                <a href="https://www.cms.gov/marketplace/private-health-insurance/short-term-limited-duration" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">CMS.gov</a>
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
                <Link href="/tools/visitor-insurance-plan-comparison" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Compare up to three plans</p>
                  <p className="mt-0.5 text-ink-500">Run the same medical scenario through Plan A, B, and C.</p>
                </Link>
                <Link href="/visitor-insurance/fixed-benefit-vs-comprehensive" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Fixed-benefit vs comprehensive</p>
                  <p className="mt-0.5 text-ink-500">See why two plans with the same maximum can pay very differently.</p>
                </Link>
                <Link href="/visitor-insurance/parents-visiting-usa" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Insurance for parents visiting the USA</p>
                  <p className="mt-0.5 text-ink-500">Age, coverage amount, and pre-existing-condition wording to gather first.</p>
                </Link>
                <Link href="/visitor-insurance/glossary" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Visitor insurance glossary</p>
                  <p className="mt-0.5 text-ink-500">Every certificate term, defined with a numeric example.</p>
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
