import type { Metadata } from "next";
import Link from "next/link";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import VisitorInsurancePreExistingAnalyzer from "@/components/tools/VisitorInsurancePreExistingAnalyzer";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/pre-existing-conditions-acute-onset";

export const metadata: Metadata = pageMetadata({
  title: "Visitor Insurance Pre-Existing Conditions & Acute Onset",
  description:
    "Visitor insurance pre-existing conditions and acute onset, explained in plain English — plus a free policy-language analyzer. Educational only, never a coverage guarantee.",
  path: PATH,
  type: "article",
});

const faq: FaqItem[] = [
  {
    question: "Does visitor insurance cover pre-existing conditions?",
    answer:
      "Usually not for routine or ongoing care. Many certificates separately describe a limited \"acute onset\" benefit for a sudden, unexpected complication of a pre-existing condition — but the exact wording, any age cutoff, and the benefit maximum vary by certificate.",
  },
  {
    question: "What does \"acute onset of a pre-existing condition\" mean?",
    answer:
      "It generally refers to a sudden and unexpected worsening of a condition the insured already had, treated as an emergency rather than as ongoing management of that condition. The precise definition, and whether it applies to a specific situation, depends entirely on the certificate's exact wording.",
  },
  {
    question: "Is this tool a medical diagnosis checker?",
    answer:
      "No. It is a policy-language analyzer — it reads what you enter about the certificate and the circumstances of an event, never a diagnosis, and returns one of five fixed educational labels. It never tells you whether a specific condition \"is covered.\"",
  },
  {
    question: "Will my parent's diabetes or high blood pressure be covered if something happens?",
    answer:
      "It depends on the exact certificate wording, the circumstances of the event, age limitations, and the insurer's claim review — not on the name of the diagnosis alone. Use the analyzer above with the certificate's actual wording, and confirm directly with the insurer before travel.",
  },
];

export default function PreExistingConditionsAcuteOnsetPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "Visitor Insurance Pre-Existing Conditions & Acute Onset, Explained",
      description: "An educational policy-language analyzer and guide to pre-existing-condition and acute-onset wording in visitor insurance certificates.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "Pre-Existing Conditions & Acute Onset")
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
          <span className="text-ink-500">Pre-Existing Conditions &amp; Acute Onset</span>
        </nav>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-700 px-3 py-1 text-xs font-semibold text-white">📋 Policy language</span>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">Visitor Insurance Pre-Existing Conditions &amp; Acute Onset, Explained</h1>
        </div>

        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            Most visitor insurance certificates exclude routine or ongoing care for a condition the traveler already had before the policy started. Many separately describe a limited &ldquo;acute onset&rdquo; benefit for a sudden, unexpected complication of that
            condition — this is narrower than full pre-existing-condition coverage, and the exact wording, any age cutoff, and benefit maximum vary by certificate. This page includes a policy-language analyzer below: it reads what you enter about the certificate
            and the circumstances of an event, and returns an educational label — it is never a medical diagnosis tool and never a coverage guarantee.
          </p>
        </div>

        <section id="analyzer" className="scroll-mt-24 mb-10">
          <VisitorInsurancePreExistingAnalyzer />
        </section>

        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Plain-English definition</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A pre-existing condition is generally a health condition that existed, was diagnosed, or was being treated before the insurance policy&rsquo;s effective date. Certificates typically exclude ongoing costs related to that condition, while some describe a
              separate, limited benefit — often called &ldquo;acute onset&rdquo; — for a sudden, unexpected complication of it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Routine care versus unexpected event</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Routine care — a regular check-up, a scheduled medication refill, ongoing monitoring of a known condition — is generally what pre-existing-condition exclusions target. An unexpected, sudden event is the fact pattern an acute-onset provision, if the
              certificate has one, is more likely to address. The line between the two is a factual question about what actually happened, not about the diagnosis name.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Stable versus unstable terminology</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Some certificates ask whether a condition was &ldquo;stable&rdquo; for a period of time before travel — for example, no change in medication or treatment plan for a defined number of months. Whether a specific condition counts as stable is a
              certificate-specific, fact-specific question; the analyzer above asks about this directly rather than assuming an answer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Treatment and medication history</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A recent medication change, a recently scheduled procedure, or treatment recommended before the coverage period began can all affect how a certificate treats an event — often pointing away from &ldquo;sudden and unexpected.&rdquo; Keep an accurate
              record of medication changes and treatment recommendations, since this history matters if a claim is ever reviewed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Age limitations</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Many acute-onset provisions carry their own age cutoff, separate from the plan&rsquo;s general eligibility rules — for example, the benefit might not apply above a stated age even if the traveler is otherwise eligible for the policy. Check this
              specifically; it is easy to miss when comparing plans quickly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Benefit maximum</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              An acute-onset benefit frequently carries its own dollar maximum, separate from and often lower than the plan&rsquo;s overall policy maximum. A generous overall policy maximum does not tell you the acute-onset maximum — look for both numbers
              separately in the certificate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Emergency medical evacuation</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Some certificates include medical evacuation under the acute-onset benefit; others treat evacuation as a fully separate benefit with its own terms, or exclude it from acute-onset situations entirely. Confirm this explicitly — don&rsquo;t assume
              evacuation coverage follows the same rules as the medical benefit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why &ldquo;acute onset&rdquo; is not the same as full pre-existing-condition coverage</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              An acute-onset provision is narrow by design — it is meant to address a sudden, unexpected complication, generally treated as an emergency, usually with its own age cutoff and dollar cap. It is not the same as the plan covering the pre-existing
              condition generally, and it does not extend to routine or ongoing management of that condition. Treat any acute-onset benefit as a limited exception, not full coverage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Questions to ask the insurer</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>Does this certificate exclude pre-existing conditions, and does it separately describe an acute-onset benefit?</li>
              <li>What is the exact acute-onset benefit maximum, and is there an age cutoff?</li>
              <li>How does the certificate define &ldquo;sudden and unexpected,&rdquo; and does it require a stability period beforehand?</li>
              <li>Is medical evacuation included under the acute-onset benefit or handled separately?</li>
              <li>What documentation will the insurer want if a claim like this is filed?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">What records to retain</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>The full certificate or summary of benefits, including the exact pre-existing-condition and acute-onset wording</li>
              <li>A record of medication history and any recent changes</li>
              <li>Notes on how long a condition has been stable before travel</li>
              <li>Any pre-existing-condition disclosure form completed at purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Claim-decision limitations</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The insurer or claims administrator makes the actual coverage determination for any real claim, based on the full medical record, the exact certificate wording, and the specific facts of the event — not on this page or its analyzer. Treat every result
              above as a starting point for a conversation with the insurer, never as a final answer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Educational examples — not coverage guarantees</h2>
            <p className="text-sm leading-relaxed text-ink-600 mb-3">
              The following are examples of the KIND of question that matters for each situation — none of them state whether any real policy covers the condition. Coverage always depends on the exact certificate, the facts, and the insurer&rsquo;s review.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-ink-600">
              <li><strong>Diabetes:</strong> the relevant questions are usually whether the event was a sudden, unexpected complication versus routine management, and whether an age cutoff applies to the acute-onset benefit.</li>
              <li><strong>High blood pressure:</strong> whether the certificate distinguishes controlled from uncontrolled blood pressure, and whether a sudden complication would be treated as acute onset, are certificate-specific questions.</li>
              <li><strong>Heart condition:</strong> cardiac history is one of the areas certificates most often address explicitly by name — read that specific clause rather than assuming a general acute-onset provision covers it.</li>
              <li><strong>Previous cancer treatment:</strong> how a certificate treats a history of cancer — including how long remission or stability must have lasted — varies significantly and should be confirmed directly.</li>
              <li><strong>Recent medication change:</strong> a change shortly before travel can affect whether a condition is considered &ldquo;stable&rdquo; under the certificate&rsquo;s wording.</li>
              <li><strong>Scheduled procedure:</strong> a procedure already scheduled or recommended before the coverage period began generally points away from &ldquo;sudden and unexpected,&rdquo; regardless of the diagnosis involved.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Sources</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>
                <a href="https://www.cms.gov/marketplace/private-health-insurance/short-term-limited-duration" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">CMS.gov — Short-term, limited-duration insurance</a>
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
          This page and its analyzer are educational only — not medical advice, not a diagnosis tool, and not a coverage guarantee. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination based on the full facts
          of any real claim.
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
