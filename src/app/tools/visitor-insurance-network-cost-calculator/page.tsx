import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsuranceNetworkCostCalculator from "@/components/tools/VisitorInsuranceNetworkCostCalculator";
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

const tool = getTool("visitor-insurance-network-cost-calculator")!;
const PATH = "/tools/visitor-insurance-network-cost-calculator";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "What's the difference between in-network and out-of-network visitor insurance?",
    answer:
      "In-network (PPO) providers have agreed to a negotiated allowed amount with the insurer, so your coinsurance is generally calculated off that lower amount and you cannot be balance-billed for the difference. Out-of-network providers haven't agreed to that discount — coinsurance is often a higher percentage, and you may owe the gap between the billed charge and whatever the insurer allows, called balance billing.",
  },
  {
    question: "What is the \"allowed amount\" in visitor insurance?",
    answer:
      "The allowed amount (also called the negotiated or eligible amount) is what the insurer actually recognizes for a covered service — not the provider's full billed charge. Deductible and coinsurance are usually calculated from the allowed amount, not the billed charge. If you don't know it, this calculator uses the billed charge as a clearly flagged temporary base.",
  },
  {
    question: "What is balance billing on a visitor insurance policy?",
    answer:
      "Balance billing happens when an out-of-network provider bills you for the difference between their charge and the insurer's allowed amount, on top of your normal deductible and coinsurance. In-network PPO providers generally cannot do this because they've agreed to accept the negotiated amount as payment in full.",
  },
  {
    question: "Does a PPO network guarantee lower visitor insurance costs?",
    answer:
      "Not automatically — it depends on whether the specific provider you use is actually in that PPO's network, and on your plan's specific in-network vs out-of-network coinsurance percentages and deductible. This calculator lets you compare both scenarios for the same bill using your plan's actual entered terms.",
  },
  {
    question: "How much more could an out-of-network visitor insurance claim cost me?",
    answer:
      "It varies by plan and by how large the gap is between the billed and allowed charge. Enter your policy's in-network and out-of-network coinsurance percentages and a sample bill above to see a side-by-side estimate for your specific certificate — this tool does not use a fixed industry average.",
  },
];

export default function VisitorInsuranceNetworkCostCalculatorPage() {
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
        hook="Enter one medical bill and your plan's terms — see the in-network and out-of-network estimate side by side, including potential balance billing."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not an insurance quote, not a coverage or network-participation determination."
        disclaimerPoints={[
          "Not an insurance quote — no live insurer pricing is used.",
          "Not a network-participation determination — only your insurer or the provider can confirm in-network status for a specific visit.",
          "Never invents an allowed amount, coinsurance percentage, or network status you did not enter.",
          "Numbers, forms, and network rules vary by insurer, state, and certificate — always verify against your own policy documents.",
          "Consult your insurer, administrator, or a licensed agent when it matters to your situation.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm leading-relaxed text-sky-900">
                <strong className="font-semibold">Quick answer:</strong> Visitor insurance plans with a PPO network usually share costs off a lower, negotiated &ldquo;allowed amount&rdquo; when you use an in-network provider, and cannot balance-bill you for the difference. Out-of-network care
                often means a higher coinsurance percentage and possible balance billing on top of it. Enter one bill and your plan&rsquo;s terms below to see both outcomes for the same charge.
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
                  <li>The same bill's estimated liability treated as in-network vs out-of-network</li>
                  <li>Potential balance billing when the allowed amount is known</li>
                  <li>How your plan's network-specific coinsurance percentages change the split</li>
                  <li>The dollar difference between the two scenarios</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-900">
                <p className="font-semibold">What it cannot determine</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  <li>Whether a specific provider is actually in this plan's PPO network</li>
                  <li>The real allowed (negotiated) amount if you don&rsquo;t know it</li>
                  <li>Whether the visit or service is covered at all</li>
                  <li>The insurer&rsquo;s final claim decision</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section id="visitor-insurance-network-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsuranceNetworkCostCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <details className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How the calculation works &amp; common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    This calculator runs the same billed charge through the engine twice — once in-network, once out-of-network — with everything else identical. If you know the allowed amount, the out-of-network run shows balance billing (billed minus allowed);
                    otherwise both use the billed charge as a flagged temporary base. Full sequence: <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</Link>.
                  </p>
                  <p>
                    A PPO network is a list of providers who&rsquo;ve agreed to accept a negotiated allowed amount as full payment. In-network, coinsurance is calculated off that lower amount and the provider generally can&rsquo;t bill you the rest. Out-of-network,
                    the gap between the billed and allowed amount can become balance billing you owe directly, on top of typically higher coinsurance.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Assuming every provider is in-network just because the plan says &ldquo;PPO&rdquo;</li>
                    <li>Not asking for the allowed amount after a claim, only seeing the billed charge</li>
                    <li>Assuming &ldquo;no network stated&rdquo; behaves the same as an out-of-network PPO claim</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.healthcare.gov/glossary/allowed-amount/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">Allowed amount</a>,{" "}
                <a href="https://www.healthcare.gov/glossary/balance-billing/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">Balance billing</a>
                {" "}(HealthCare.gov) and your own policy certificate. Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}.
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
                  <p className="font-semibold text-ink-900">Cost & liability calculator</p>
                  <p className="mt-0.5 text-ink-500">The full household calculator behind this tool's engine.</p>
                </Link>
                <Link href="/tools/visitor-insurance-policy-maximum-calculator" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Policy maximum calculator</p>
                  <p className="mt-0.5 text-ink-500">Policy maximum vs out-of-pocket maximum — they aren't the same thing.</p>
                </Link>
                <Link href="/visitor-insurance/methodology" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">Calculator methodology</p>
                  <p className="mt-0.5 text-ink-500">The exact calculation sequence and source hierarchy.</p>
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
