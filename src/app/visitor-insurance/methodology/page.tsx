import type { Metadata } from "next";
import Link from "next/link";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/methodology";

export const metadata: Metadata = pageMetadata({
  title: "How the Visitor Insurance Calculators Work: Methodology",
  description:
    "The exact calculation sequence, source hierarchy, rounding method, and known limitations behind every visitor insurance calculator on NRI to USA.",
  path: PATH,
  type: "article",
});

const faq: FaqItem[] = [
  {
    question: "Do these calculators use real insurer pricing?",
    answer:
      "No. Every calculator uses only what you type in from your own quote or certificate. Nothing here fetches live insurer pricing, and nothing invents a plan benefit you did not enter.",
  },
  {
    question: "Why does a calculator sometimes say a term is missing?",
    answer:
      "If you leave a field blank — for example, the out-of-pocket maximum, or the allowed charge — the engine never assumes a default value for it. It flags the field as missing, lowers the confidence label, and, where relevant, warns that your total exposure may exceed the estimate.",
  },
  {
    question: "How do I report an error in a calculation?",
    answer:
      "Email support@nritousa.com with the exact inputs you used and the result you saw. Include which calculator, your entered terms, and what you expected — that lets us reproduce the calculation exactly.",
  },
];

export default function VisitorInsuranceMethodologyPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "How the Visitor Insurance Calculators Work",
      description: "The exact calculation sequence, source hierarchy, rounding method, and known limitations behind every visitor insurance calculator on this site.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "Calculator Methodology")
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
          <span className="text-ink-500">Methodology</span>
        </nav>

        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 px-3 py-1 text-xs font-semibold text-white">🔬 Methodology</span>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">How the Visitor Insurance Calculators Work</h1>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            Every visitor insurance calculator on this site runs on one shared, tested calculation engine — no calculator reimplements its own formula. Money is calculated in integer cents internally to avoid rounding drift across a long chain of steps, every
            optional certificate term you leave blank is tracked as genuinely missing rather than defaulted, and the engine never assumes a benefit (an out-of-pocket maximum, a shared family deductible, out-of-network coverage) that you did not explicitly enter.
          </p>
        </div>

        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Calculation sequence</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              For each claim: start from the billed charge → determine coverage eligibility (excluded services stop here, becoming a non-covered amount) → determine the allowed charge (using the billed charge as a flagged, temporary base if the allowed charge is
              unknown) → calculate potential balance billing for out-of-network care → apply the certificate&rsquo;s cost-sharing steps (copay, service-specific deductible, general deductible, coinsurance) in the exact order you specify — never a fixed order → apply
              service sublimits, per-incident maximum, and policy maximum → apply the out-of-pocket maximum, only if one was entered, by reclassifying qualifying cost-sharing back to the insurer once the running total is reached → report the final insurer payment
              and your total liability, broken into deductible, copay, coinsurance, balance billing, non-covered amount, and any amount above a sublimit, scheduled benefit, or policy maximum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Comprehensive-plan formula</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A comprehensive plan runs the eligible amount through whichever sequence of copay, deductible, and coinsurance steps you select — the engine supports copay-then-deductible, deductible-then-copay, deductible-only, copay-only, and first-dollar (no
              cost-sharing) sequences, plus a coinsurance threshold (100% insurer payment above a stated amount) and a coinsurance cap, when those are entered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Fixed-benefit formula</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A fixed-benefit (scheduled) plan does NOT run comprehensive math. The insurer payment is the lesser of the billed charge and the scheduled benefit for that service category; the member owes the rest, subject to any further sublimit, per-incident, or
              policy-maximum restriction. A hybrid plan applies this formula only to the service categories you&rsquo;ve entered a scheduled benefit for, and comprehensive math to every other category.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Network calculation</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Cost-sharing is calculated against the allowed (negotiated) amount, not the billed amount, whenever the allowed amount is known. For in-network claims, the engine assumes the standard PPO convention that the provider cannot bill above the allowed
              amount. For out-of-network claims, potential balance billing is calculated as billed minus allowed. When network status is unknown, the engine does not assume either direction — it flags the uncertainty instead.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Family aggregation</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              By default, every traveler in a household is calculated completely independently, then the results are added together for the household total. A shared family deductible, shared policy maximum, or shared out-of-pocket maximum activates only when you
              explicitly set that provision&rsquo;s scope — never assumed. An &ldquo;embedded individual&rdquo; deductible tracks both an individual cap per traveler and a shared family pool at the same time, and a traveler&rsquo;s deductible is considered met as
              soon as either one is reached.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Policy maximum treatment</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The policy maximum (and, separately, any per-incident maximum and service sublimits) caps the insurer&rsquo;s payment, not your liability. Any amount the insurer would otherwise have paid above one of these caps is added to your total liability as a
              distinct, separately labeled line — never silently absorbed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Out-of-pocket treatment</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              An out-of-pocket maximum is applied only when you explicitly enter one, and only to the specific expense categories you mark as counting toward it (deductible, copay, coinsurance, out-of-network spending, non-covered amounts — each is a separate
              yes/no you control). If you don&rsquo;t enter an out-of-pocket maximum, the calculators never invent one, and the result carries an explicit warning that your total exposure may exceed the estimate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Rounding method</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              All money is represented internally as integer cents, not floating-point dollars — a deliberate choice for this engine because a single claim can chain 15 or more sequential calculation steps, and float rounding drift compounds across that many steps
              in a way it would not in a single-formula calculator. Dollar inputs are converted to cents at entry; results are formatted back to dollars only for display.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Missing-input treatment</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Every optional certificate term you leave blank is tracked, by name, in the result&rsquo;s list of missing inputs — never silently defaulted to zero, unlimited, or any other assumed value. The Uncertainty Panel on every result lists exactly which terms
              were missing and generates a personalized list of questions to ask your insurer from that list.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Confidence labels</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Every result carries one of three labels — Higher-confidence estimate, Moderate-confidence estimate, or Limited estimate — based on how many required inputs were missing or had to fall back to a flagged assumption (like using the billed charge because
              the allowed charge was unknown). These are qualitative labels, never a manufactured numeric confidence percentage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Illustrative-example policy</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              &ldquo;Load example&rdquo; buttons across these calculators pre-fill round, clearly labeled illustrative numbers — never a real insurer&rsquo;s actual rates — so you can see how the math behaves before entering your own certificate&rsquo;s terms. Every
              example is labeled as an example both on screen and in this document; see{" "}
              <Link href="/visitor-insurance/glossary" className="text-brand-600 underline">the glossary</Link> for term-by-term numeric examples.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Data source hierarchy</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              General insurance-term definitions used in this cluster's copy are sourced from Tier 1 government/regulatory sources (HealthCare.gov, CMS.gov, NAIC). Plan-specific claims are never made without a real, retrieved Tier 2 document (an actual policy
              certificate, summary of benefits, or underwriter document) — this cluster currently makes no plan-specific factual claims because no such document has been cited yet. Competitor marketing copy is never used as a source for what a plan covers. See{" "}
              <code className="rounded bg-ink-900/5 px-1.5 py-0.5 text-xs">docs/visitor-insurance/source-policy.md</code> in the project repository for the full tier definitions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Update schedule</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              This cluster is reviewed for accuracy and freshness periodically; the last review date is shown at the bottom of every page in this cluster. Because these calculators never depend on live pricing data, most updates are to the educational copy,
              examples, and calculator behavior rather than to any numeric fee schedule.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Known limitations</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>The engine models the certificate terms you enter — it cannot verify that you entered them correctly, or that they match your actual certificate</li>
              <li>It does not know whether a specific provider is actually in-network — you must confirm that separately</li>
              <li>The pre-existing/acute-onset analyzer is a policy-language tool, not a medical or claims-adjudication tool</li>
              <li>It cannot predict a real insurer&rsquo;s discretionary claim decisions, appeals outcomes, or processing delays</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Editorial policy</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              This cluster is written and maintained by{" "}
              <Link href="/about-deepak" className="text-brand-600 underline">Deepak Middha</Link>, whose credentials are CA (Chartered Accountant) and Series 65 — he is not a physician, licensed insurance agent, underwriter, or immigration attorney, and nothing on
              this site should be read as claiming otherwise. A named, credentialed insurance reviewer will be added to this cluster when one becomes available; no reviewer byline is shown until then.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Affiliate independence policy</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              No calculation on this page or any visitor-insurance calculator changes based on affiliate compensation. This cluster currently carries no affiliate insurer links; if any are added later, they will be disclosed next to the recommendation itself — see
              the site&rsquo;s general{" "}
              <Link href="/affiliate-disclosure" className="text-brand-600 underline">affiliate disclosure</Link> policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">How to report an error</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Email <a href="mailto:support@nritousa.com" className="text-brand-600 underline">support@nritousa.com</a> with the calculator name, the exact inputs you used, and the result you saw versus what you expected. Include a copy of the relevant certificate
              language if the issue concerns how a specific term was interpreted.
            </p>
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
          This methodology page documents how the calculators compute their estimates — it is not itself insurance, medical, or legal advice. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination.
        </div>

        <Link href={VISITOR_INSURANCE_BASE} className="mb-10 block rounded-xl border border-ink-900/10 bg-white p-4 text-sm hover:border-brand-300">
          <p className="font-semibold text-ink-900">← Back to the Visitor Insurance hub</p>
        </Link>

        <AuthorReviewLine lastUpdated={VISITOR_INSURANCE_UPDATED_HUMAN} className="mb-10" />
      </div>
    </>
  );
}
