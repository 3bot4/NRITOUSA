import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsuranceHospitalBillCalculator from "@/components/tools/VisitorInsuranceHospitalBillCalculator";
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

const tool = getTool("visitor-insurance-hospital-bill-calculator")!;
const PATH = "/tools/visitor-insurance-hospital-bill-calculator";

export const metadata: Metadata = pageMetadata({
  title: tool.seoTitle,
  description: tool.seoDescription,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Will I get one bill or several bills for a hospital or ER visit?",
    answer:
      "Usually several. The facility (hospital or ER), the treating physician, radiology, lab, anesthesiologist, and surgeon are frequently billed by separate entities, sometimes with different network status even at the same hospital. Budget for multiple statements, not one combined bill.",
  },
  {
    question: "Is my ER copay waived if I'm admitted to the hospital?",
    answer:
      "Only if your certificate says so. Some plans waive the separate ER copay or ER-specific deductible when the visit results in an inpatient admission; many do not. Check the \"ER charge waived after hospital admission\" wording specifically — don't assume it applies.",
  },
  {
    question: "Does visitor insurance cover an ambulance?",
    answer:
      "Many plans include ambulance transport, but frequently with its own sublimit or flat benefit separate from general coinsurance — and ground versus air ambulance can be treated very differently. Confirm the specific benefit rather than assuming it's included at the same rate as hospital care.",
  },
  {
    question: "Can a single hospitalization use up my whole policy maximum?",
    answer:
      "Yes, particularly a multi-day ICU stay or major surgery. Add up every line item in a realistic worst-case episode and compare the total against the policy maximum — the calculator above tracks how much of the maximum remains after each bill in the sequence.",
  },
];

export default function VisitorInsuranceHospitalBillCalculatorPage() {
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
        hook="Model a full episode of care as the separate bills it usually is — ambulance, ER facility, ER physician, imaging, lab, hospital room, and more."
        accent={tool.accent}
        topDisclaimer="Educational estimate only — not an insurance quote or coverage determination."
        disclaimerPoints={[
          "Not an insurance quote — enter terms from your own quote or certificate.",
          "A medical episode may generate multiple separate bills, not one combined claim — this tool models that.",
          "Never invents plan benefits, sublimits, or reimbursement amounts you did not enter.",
          "The insurer or claims administrator makes the final benefit determination for every line item.",
        ]}
      >
        <section className="pt-6 pb-4">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5 text-sm leading-relaxed text-rose-900">
                <strong className="font-semibold">Quick answer:</strong> A hospital or ER visit is rarely one bill — the facility, the treating physician, imaging, lab, and any specialists are usually billed separately, sometimes with different network status.
                Check every line item that applies below to see the full episode of care, not just the facility charge.
              </p>
            </div>
          </Container>
        </section>

        <section id="hospital-bill-tool" className="scroll-mt-24 pb-12">
          <Container>
            <VisitorInsuranceHospitalBillCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <details className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
                <summary className="cursor-pointer text-sm font-bold text-ink-900">How the calculation works &amp; common mistakes</summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Every checked line item is processed as its own claim, in order, sharing one per-incident maximum (if your certificate has one) — how a real episode of care is usually adjudicated. Full sequence:{" "}
                    <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">methodology page</Link>.
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Budgeting for only the facility bill and being surprised by separate physician, anesthesiologist, or surgeon bills</li>
                    <li>Assuming every provider involved is in-network just because the hospital itself is</li>
                    <li>Not checking whether the ER charge is waived on admission</li>
                    <li>Not adding the full episode against the policy maximum before assuming it&rsquo;s enough</li>
                  </ul>
                </div>
              </details>
              <p className="mt-3 text-xs text-ink-400">
                Sources:{" "}
                <a href="https://www.healthcare.gov/glossary/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov</a>
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
                <Link href="/tools/visitor-insurance-network-cost-calculator" className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
                  <p className="font-semibold text-ink-900">In-network vs out-of-network</p>
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
