import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsurancePlanComparison from "@/components/tools/VisitorInsurancePlanComparison";
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

const tool = getTool("visitor-insurance-plan-comparison")!;
const PATH = "/tools/visitor-insurance-plan-comparison";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Does this tool tell me which visitor insurance plan is best?",
    answer:
      "No. Ranking plans as \"best\" requires a published, transparent scoring methodology and current, verified plan data. Instead, this tool shows category winners (lowest premium, lowest modeled liability for your scenario, most complete entered terms) and an important-tradeoffs list, so you can weigh them yourself.",
  },
  {
    question: "Why do I need to enter each plan's terms manually?",
    answer:
      "This is not a live insurer pricing feed. You enter the premium and certificate terms from each quote or policy document you're comparing, and the tool runs the identical medical scenario through each plan using the same calculation engine.",
  },
  {
    question: "Can I compare a fixed-benefit plan against a comprehensive plan?",
    answer:
      "Yes. Set each plan's type independently — the engine applies scheduled-benefit math to a fixed-benefit plan and deductible/coinsurance math to a comprehensive plan, never mixing the two formulas.",
  },
];

export default function VisitorInsurancePlanComparisonPage() {
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
        hook="Enter Plan A and Plan B's terms and run the same medical bill through both — see a live side-by-side comparison, never a fake best-plan badge."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not a plan ranking or purchase recommendation."
        disclaimerPoints={[
          "Not a plan ranking — no scoring methodology or live plan database backs a \"best plan\" claim here.",
          "Not an insurance quote — enter each plan's terms from your own quotes or certificates.",
          "Never invents plan benefits, exclusions, or reimbursement amounts you did not enter.",
          "The insurer or claims administrator makes the final benefit determination for any real claim.",
          "Consult a licensed agent or the insurer directly before purchasing.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm leading-relaxed text-indigo-900">
                <strong className="font-semibold">Quick answer:</strong> The plan with the lowest premium is not always the plan with the lowest total cost on a real claim. Enter each plan&rsquo;s premium, deductible, coinsurance, and policy maximum below, run the
                same medical scenario through all of them, and compare the modeled liability side by side.
              </p>
            </div>
          </Container>
        </section>

        <section id="visitor-insurance-comparison-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsurancePlanComparison />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <details className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How to read this &amp; common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Each plan runs through the same engine as the{" "}
                    <Link href="/tools/visitor-insurance-cost-calculator" className="text-brand-600 underline">master cost calculator</Link>. More &ldquo;missing terms&rdquo; doesn&rsquo;t mean a worse plan — it means fewer certificate details are entered for it yet.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Comparing premiums without running a real medical scenario through each plan</li>
                    <li>Treating a brochure&rsquo;s &ldquo;up to $X maximum&rdquo; as a true out-of-pocket cap</li>
                    <li>Not checking whether each plan is comprehensive, fixed-benefit, or hybrid before comparing deductibles</li>
                    <li>Ignoring pre-existing-condition and acute-onset wording differences between plans</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.naic.org" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">NAIC</a>
                {" "}and each plan&rsquo;s own certificate. Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}.
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
                  <p className="font-semibold text-ink-900">Calculate your household liability</p>
                  <p className="mt-0.5 text-ink-500">Full detail for one plan across multiple travelers.</p>
                </Link>
                <Link href="/visitor-insurance/fixed-benefit-vs-comprehensive" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Fixed-benefit vs comprehensive</p>
                  <p className="mt-0.5 text-ink-500">Understand the plan-type difference before comparing.</p>
                </Link>
                <Link href="/visitor-insurance/methodology" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Calculator methodology</p>
                  <p className="mt-0.5 text-ink-500">Exactly how every number here is calculated.</p>
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
