import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsurancePolicyMaximumCalculator from "@/components/tools/VisitorInsurancePolicyMaximumCalculator";
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

const tool = getTool("visitor-insurance-policy-maximum-calculator")!;
const PATH = "/tools/visitor-insurance-policy-maximum-calculator";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Is a visitor insurance policy maximum the same as an out-of-pocket maximum?",
    answer:
      "No — this is the single most important thing to understand before buying. A policy maximum is the most the insurer's plan will pay in total. An out-of-pocket maximum caps what you personally pay, but only if your certificate explicitly includes one. Many visitor insurance plans have a policy maximum with no true out-of-pocket maximum at all.",
  },
  {
    question: "What happens after visitor insurance reaches its policy maximum?",
    answer:
      "Once the policy maximum is used up, the plan stops paying for that person's covered care for the rest of the policy period (or per incident, if the maximum is per-incident). Any further eligible cost becomes the traveler's responsibility, in addition to whatever deductible and coinsurance already applied below the maximum.",
  },
  {
    question: "Is $50,000 or $100,000 enough visitor insurance coverage?",
    answer:
      "It depends entirely on the scenario — a minor illness rarely approaches either figure, but a serious hospitalization, surgery, or ICU stay can exceed $100,000 in the US. This calculator doesn't recommend a specific number; enter a policy maximum and a sample bill to see how much of a specific claim it would cover and how much would remain your responsibility.",
  },
  {
    question: "Does every visitor insurance plan have an out-of-pocket maximum?",
    answer:
      "No. Unlike ACA marketplace plans, many visitor and travel-medical insurance certificates do not include a true out-of-pocket maximum. This calculator never assumes one exists — it only applies one if you explicitly enter it, and it clearly labels the result differently when none was entered.",
  },
  {
    question: "How is my maximum possible liability calculated on visitor insurance?",
    answer:
      "This calculator will not show a single \"worst case\" dollar figure unless your certificate has a real out-of-pocket maximum you entered — doing so without one would be misleading, since your exposure could keep growing with a larger bill. Instead it labels the result \"no contractual cost-sharing ceiling entered\" so you know the risk is open-ended.",
  },
];

export default function VisitorInsurancePolicyMaximumCalculatorPage() {
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
        hook="A policy maximum caps what the plan pays. An out-of-pocket maximum caps what you pay — and only if your certificate actually has one. See which applies to your plan."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not an insurance quote, not a coverage determination."
        disclaimerPoints={[
          "Not an insurance quote — no live insurer pricing is used.",
          "Not a coverage determination — the insurer or claims administrator decides every claim.",
          "Never assumes an out-of-pocket maximum, unlimited coverage, or any benefit you did not enter.",
          "Never shows a single \"worst case\" liability number unless a true out-of-pocket maximum was entered.",
          "Consult your insurer, administrator, or a licensed agent when it matters to your situation.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl space-y-3">
              <p className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm leading-relaxed text-sky-900">
                <strong className="font-semibold">Quick answer:</strong> A visitor insurance <strong>policy maximum</strong> is the most the insurer&rsquo;s plan will pay in total — it is not automatically a cap on what you could owe. A visitor insurance{" "}
                <strong>out-of-pocket maximum</strong> is what limits your personal liability, and it only exists if your certificate explicitly states one. Most visitor plans have a policy maximum; not all of them have a true out-of-pocket maximum. Enter your plan&rsquo;s terms and
                a sample bill below to see exactly which one your certificate gives you.
              </p>
              <p className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-xs font-semibold leading-relaxed text-amber-900">
                Do not assume these two limits are the same thing when comparing plans — a plan advertising a large policy maximum can still leave your personal liability uncapped.
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
                  <li>How much of the policy maximum remains after the claims you enter</li>
                  <li>The amount above the policy maximum on those claims</li>
                  <li>Whether your entered terms give you a real, contractual cost-sharing ceiling</li>
                  <li>Deductible and coinsurance for each claim, in the order it occurred</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-900">
                <p className="font-semibold">What it cannot determine</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  <li>Whether your certificate actually has an out-of-pocket maximum, if you don&rsquo;t know and don&rsquo;t enter one</li>
                  <li>A single finite &ldquo;worst case&rdquo; dollar amount when no out-of-pocket maximum was entered</li>
                  <li>Whether a specific diagnosis or treatment will be approved</li>
                  <li>The insurer&rsquo;s final claim decision</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <section id="visitor-insurance-policy-max-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsurancePolicyMaximumCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <h2 className="text-lg font-bold text-ink-900">Policy maximum vs out-of-pocket maximum: the exact distinction</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  A <strong>policy maximum</strong> limits the insurer&rsquo;s payout — the total (or per-incident) amount the plan will ever pay. It says nothing about what you owe below that ceiling. An <strong>out-of-pocket maximum</strong> limits your
                  cost-sharing — once your deductible, copay, and coinsurance reach that amount, the insurer covers 100% of further eligible costs for the rest of the period. Commonly on visitor insurance, only a policy maximum exists with no out-of-pocket
                  maximum at all. This calculator only applies an out-of-pocket maximum if you explicitly entered one — never assumed.
                </p>
              </div>

              <details className="mt-3 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How the calculation works &amp; common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Each claim runs through the engine in order, folding the policy maximum&rsquo;s remaining balance forward from one claim to the next. Deductible and coinsurance apply first; whatever the insurer would otherwise pay above what&rsquo;s left of
                    the policy maximum becomes your liability instead. Full sequence: <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</Link>.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Assuming a large policy maximum automatically caps your own liability at some smaller number</li>
                    <li>Comparing plans by policy maximum alone, without checking for a true out-of-pocket maximum</li>
                    <li>Not asking whether the policy maximum applies per person, per incident, or shared across the trip</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Out-of-pocket maximum/limit</a>
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
                  <p className="font-semibold text-ink-900">Cost & liability calculator</p>
                  <p className="mt-0.5 text-ink-500">The full household calculator behind this tool's engine.</p>
                </Link>
                <Link href="/tools/visitor-insurance-network-cost-calculator" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">In-network vs out-of-network calculator</p>
                  <p className="mt-0.5 text-ink-500">See how network status changes your liability on the same bill.</p>
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
