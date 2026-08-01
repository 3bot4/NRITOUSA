import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import RelatedHubs from "@/components/RelatedHubs";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import IntentRouterGrid from "@/components/tools/visitorInsurance/IntentRouterGrid";
import { getTool } from "@/lib/tools";
import { pageMetadata, faqJsonLd, jsonLdGraph, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_BASE,
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  visitorInsuranceChildPages,
  visitorInsuranceTools,
} from "@/lib/visitorInsuranceCluster";

export const metadata: Metadata = pageMetadata({
  title: "Visitor Insurance USA: Cost, Liability & How It Works (2026)",
  description:
    "Visitor medical insurance for the USA, explained with numbers: premium vs. liability, deductible, coinsurance, policy maximum, networks, and pre-existing-condition wording — plus free calculators.",
  path: VISITOR_INSURANCE_BASE,
  type: "article",
});

const SEVEN_NUMBERS = [
  "Total premium",
  "Policy maximum",
  "Deductible",
  "Coinsurance",
  "Network rules",
  "Service sublimits",
  "Pre-existing-condition language",
];

const faq: FaqItem[] = [
  {
    question: "How much does visitor insurance cost?",
    answer:
      "It depends on age, coverage amount, deductible, trip length, and whether the plan is comprehensive or fixed-benefit — there is no single market price, and this site does not quote live premiums. Use the Cost & Liability Calculator with your own quote to see what a specific plan would mean for a real medical bill.",
  },
  {
    question: "How much will visitor insurance actually pay if something happens?",
    answer:
      "It depends on the deductible, coinsurance percentage, whether the provider is in-network, the allowed charge, and any sublimits or policy maximum in the certificate. Enter those terms from your quote into the Cost & Liability Calculator for a line-by-line estimate — the insurer or claims administrator makes the final determination.",
  },
  {
    question: "Is a higher policy maximum always better?",
    answer:
      "Not by itself. A high policy maximum with a high deductible, high coinsurance, and no out-of-pocket maximum can still leave a family owing a large amount. Compare the full set of terms, not just the headline maximum — see \"Why policy maximum is not the same as out-of-pocket maximum\" below.",
  },
  {
    question: "Does visitor insurance cover pre-existing conditions?",
    answer:
      "Usually not fully, though many certificates describe a limited \"acute onset of a pre-existing condition\" benefit for a sudden, unexpected event. The exact wording, age limits, and benefit maximum vary by certificate — see the Pre-Existing Conditions & Acute Onset guide and use the policy-language analyzer before assuming either way.",
  },
  {
    question: "What's the difference between visitor insurance and travel insurance?",
    answer:
      "\"Visitor insurance\" and \"travel medical insurance\" are generally used for the same product category in this context: short-term medical coverage for someone visiting the USA. General \"travel insurance\" sometimes also bundles trip-cancellation or baggage coverage, which is a different, non-medical benefit — check what a specific product actually includes.",
  },
];

export default function VisitorInsuranceHubPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: VISITOR_INSURANCE_BASE,
      headline: "Visitor Insurance USA: Cost, Liability & How It Works",
      description: "Complete guide to visitor medical insurance for the USA — premium vs. liability, deductible, coinsurance, policy maximum, networks, and pre-existing conditions.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(VISITOR_INSURANCE_BASE, "Visitor Insurance")
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero band — wider, gradient, dashboard-style */}
      <div className="border-b border-ink-900/5 bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-500">Visitor Insurance</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white">
            🩺 Visitor Insurance
          </span>
          <h1 className="mt-4 max-w-3xl text-[2.25rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[3rem]">
            Understand what you&rsquo;d actually pay — before something happens.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            The premium alone doesn&rsquo;t tell you your real financial protection. Deductible, coinsurance, policy maximum, network rules, and pre-existing-condition wording decide how much of a real bill you&rsquo;d actually owe. Tell us why you&rsquo;re here, and
            we&rsquo;ll take you straight to the right tool.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">What brings you here today?</p>
            <IntentRouterGrid />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        {/* What it can and cannot do */}
        <div className="mb-8 mt-10 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">What visitor insurance can do</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              <li>Share eligible medical costs after your deductible and coinsurance</li>
              <li>Cap the insurer&rsquo;s payment at a policy maximum and any sublimits</li>
              <li>Sometimes include a limited benefit for the acute onset of a pre-existing condition</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-900">
            <p className="font-semibold">What it usually cannot do</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              <li>Guarantee a specific claim will be approved</li>
              <li>Cap your total liability unless the certificate states a true out-of-pocket maximum</li>
              <li>Cover routine or ongoing care for a known pre-existing condition</li>
            </ul>
          </div>
        </div>

        {/* Seven numbers card */}
        <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <p className="font-semibold text-amber-900">Before comparing plans, find these seven numbers</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {SEVEN_NUMBERS.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="mt-0.5 text-amber-600">✓</span>
                {n}
              </li>
            ))}
          </ul>
        </div>

        {/* Calculator directory */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Every visitor insurance calculator</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visitorInsuranceTools.map((t) => (
              <Link key={t.slug} href={t.path} className="group flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-card-hover">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-3xl">{t.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-sky-700">{t.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{getTool(t.slug)?.description ?? ""}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Guide directory */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Explore the visitor insurance guide</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {visitorInsuranceChildPages.map((p) => (
              <Link key={p.slug} href={p.path} className="group flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-card-hover">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-3xl">{p.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-ink-900 group-hover:text-sky-700">{p.navLabel}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ DEEP GUIDE CONTENT ============ */}
        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">How visitor insurance works</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              You (or a family member) pay a premium for a fixed coverage period. If a covered medical event happens during that period, the plan shares eligible costs with you according to the certificate&rsquo;s deductible, copay, and coinsurance rules, up to
              the policy maximum and any sublimits. The insurer or a third-party administrator processes claims and pays providers directly or reimburses you, depending on the plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Who usually purchases it</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Common buyers include international visitors on tourist or business visas, parents visiting adult children in the USA, new immigrants in a waiting period before other coverage starts, and students or scholars on visas that don&rsquo;t include US health
              coverage. Requirements and available plans vary by visa type, age, and trip length.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Premium versus medical liability</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The premium is what you pay regardless of whether you file a claim. Your medical liability is what you could still owe if something happens — deductible, copay, coinsurance, balance billing, non-covered amounts, and anything above a sublimit or policy
              maximum. A lower premium plan can produce a much higher medical liability on the same bill. Run a real scenario through the{" "}
              <Link href="/tools/visitor-insurance-cost-calculator" className="text-brand-600 underline">Cost &amp; Liability Calculator</Link> before comparing premiums alone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Comprehensive versus fixed-benefit coverage</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A comprehensive plan applies a deductible and coinsurance to eligible costs, similar to typical US health insurance. A fixed-benefit (scheduled) plan instead pays a flat, pre-set amount for each type of service regardless of the actual bill — you owe the
              difference. Two plans with the same policy maximum can pay very different amounts on the same claim. See the full comparison: {" "}
              <Link href="/visitor-insurance/fixed-benefit-vs-comprehensive" className="text-brand-600 underline">Fixed-benefit vs comprehensive</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Deductible, explained with numbers</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              If a plan has a $250 deductible and you have a $1,000 eligible bill, you generally pay the first $250 and the plan considers the remaining $750 for coinsurance. A $0-deductible plan skips straight to coinsurance. Deductibles can apply once per policy
              period, per incident, or per service — the certificate controls which.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Copay, explained with numbers</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A copay is a flat amount for a specific service — for example, a $50 copay for a physician visit — charged before or after the deductible depending on the certificate. A $50 copay on a $200 bill leaves $150 to run through the deductible and coinsurance
              steps that follow.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Coinsurance, explained with numbers</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Coinsurance is the percentage split between you and the plan after the deductible. On an 80/20 plan, the plan pays 80% and you pay 20% of the post-deductible eligible amount — so $1,500 remaining after a deductible becomes a $300 member share and a
              $1,200 insurer payment. Some certificates cap your coinsurance at a fixed dollar amount; use the{" "}
              <Link href="/tools/visitor-insurance-deductible-coinsurance-calculator" className="text-brand-600 underline">Deductible &amp; Coinsurance Calculator</Link> to see your own numbers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Policy maximum, explained</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The policy maximum is generally the most the plan will pay in total, across the covered period (or per incident, if stated that way). Once the plan has paid up to that amount, you generally owe the rest of any further eligible costs, subject to whatever
              the certificate says.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why policy maximum is not the same as out-of-pocket maximum</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A policy maximum caps what the <em>insurer</em> pays. An out-of-pocket maximum, when a certificate has one, caps what <em>you</em> pay in specified covered cost-sharing. Many visitor insurance plans do not have a true out-of-pocket maximum at all — do
              not assume one exists. See{" "}
              <Link href="/tools/visitor-insurance-policy-maximum-calculator" className="text-brand-600 underline">Policy Maximum vs Out-of-Pocket Maximum</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">In-network versus out-of-network</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              In-network providers have agreed to a negotiated (allowed) charge and generally cannot bill you above it. Out-of-network providers may bill their full charge, and the gap between the billed and allowed amount can become your responsibility as balance
              billing, on top of any higher out-of-network coinsurance. See{" "}
              <Link href="/tools/visitor-insurance-network-cost-calculator" className="text-brand-600 underline">In-Network vs Out-of-Network</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Allowed charge versus billed charge</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The billed charge is the provider&rsquo;s full price. The allowed (or negotiated) charge is the amount the plan actually uses in its calculation — usually lower, for in-network care. If you don&rsquo;t know the allowed charge, treat any calculator
              result using the billed charge as a temporary, less certain estimate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Balance billing</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Balance billing is when a provider bills you for the difference between their charge and the plan&rsquo;s allowed amount — most common out-of-network. Whether this is capped depends on the certificate and, in some cases, state or federal rules; visitor
              plans are frequently outside those protections. Confirm directly with the insurer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Hospital and ER claims</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A single hospital or ER visit can generate several separate bills — the facility, the ER physician, imaging, lab work, and any specialists — each potentially processed differently. Model a full episode of care with the{" "}
              <Link href="/tools/visitor-insurance-hospital-bill-calculator" className="text-brand-600 underline">Hospital &amp; ER Bill Calculator</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Urgent care, ambulance &amp; prescriptions</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Urgent care is usually a lower-cost alternative to the ER for non-life-threatening issues, often with its own copay. Ambulance transport and prescription medication frequently have their own sublimits or coinsurance rules — check the certificate for
              each service category rather than assuming the general terms apply uniformly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Pre-existing conditions</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Most visitor plans exclude routine or ongoing treatment for a condition that existed before the coverage started. Some certificates separately describe a limited benefit for the &ldquo;acute onset&rdquo; of a pre-existing condition — a sudden,
              unexpected complication. See{" "}
              <Link href="/visitor-insurance/pre-existing-conditions-acute-onset" className="text-brand-600 underline">Pre-Existing Conditions &amp; Acute Onset</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Acute-onset language</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              &ldquo;Acute onset&rdquo; wording varies significantly between certificates — the exact definition, any age cutoff, and the benefit maximum all matter. This is not the same as full pre-existing-condition coverage. Use the policy-language analyzer on the
              acute-onset guide page rather than relying on the name of a diagnosis alone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Individual versus family calculations</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              By default, every calculator on this site treats each insured traveler independently and then adds up the household totals. A shared family deductible, shared policy maximum, or shared out-of-pocket maximum is only applied when you explicitly enter
              that provision from the certificate — never assumed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Trip duration</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Coverage periods, extension rules, and age-based eligibility can all interact with trip length. A policy bought for a fixed period generally cannot be extended indefinitely, and some plans have age-based maximum trip lengths — confirm directly with the
              insurer before assuming a plan can simply be renewed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Questions to ask before buying</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>What is the exact deductible amount, and does it apply per policy or per incident?</li>
              <li>What is the coinsurance percentage in-network and out-of-network, and is there a cap?</li>
              <li>Is there a true out-of-pocket maximum, and which expenses count toward it?</li>
              <li>What is the exact pre-existing-condition and acute-onset wording, including any age cutoff?</li>
              <li>What is the policy maximum, and is it per person or shared across the policy?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Common buying mistakes</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>Choosing the lowest premium without checking the deductible and coinsurance</li>
              <li>Assuming the policy maximum caps total personal liability</li>
              <li>Not asking whether a parent&rsquo;s specific health condition is excluded before travel</li>
              <li>Assuming every hospital and doctor is in-network</li>
              <li>Buying at the airport instead of comparing terms in advance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Sources</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>
                <a href="https://www.healthcare.gov/glossary/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Glossary</a>
              </li>
              <li>
                <a href="https://www.cms.gov/marketplace/private-health-insurance/short-term-limited-duration" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">CMS.gov — Short-term, limited-duration insurance</a>
              </li>
              <li>
                <a href="https://content.naic.org/consumer.htm" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">NAIC — Consumer insurance resources</a>
              </li>
              <li>Your own policy certificate, summary of benefits, or underwriter documents</li>
            </ul>
            <p className="mt-2 text-xs text-ink-400">Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}. See the full{" "}
              <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">source hierarchy and methodology</Link>.</p>
          </section>
        </article>

        {/* FAQ */}
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

        {/* Disclaimer */}
        <div className="mb-10 rounded-2xl border border-ink-900/5 bg-ink-50/50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="font-semibold text-ink-700">A quick note: </strong>
          This guide and its calculators are educational only, not insurance advice, a quote, or a coverage determination. Visitor insurance terms vary enormously by insurer, state, and certificate. The policy certificate controls, and the insurer or claims
          administrator makes the final benefit determination. Always verify the exact terms with the insurer before purchasing.
        </div>

        <AuthorReviewLine lastUpdated={VISITOR_INSURANCE_UPDATED_HUMAN} className="mb-10" />
      </div>

      <section className="py-12 sm:py-14">
        <Container>
          <RelatedHubs hubs={["immigration", "tax"]} />
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
