import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import RelatedHubs from "@/components/RelatedHubs";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { pageMetadata, faqJsonLd, type FaqItem } from "@/lib/seo";
import {
  VISITOR_INSURANCE_UPDATED_HUMAN,
  visitorInsuranceArticleJsonLd,
  visitorInsuranceBreadcrumb,
  jsonLdGraph,
} from "@/lib/visitorInsuranceCluster";

const PATH = "/visitor-insurance/parents-visiting-usa";

export const metadata: Metadata = pageMetadata({
  title: "Insurance for Parents Visiting the USA: Cost & Age Rules (2026)",
  description:
    "Insurance for parents visiting USA, explained: how age affects availability and premium, coverage amounts, deductible choices, and pre-existing-condition wording — plus a free calculator.",
  path: PATH,
  type: "article",
});

const CHECKLIST = [
  "Exact ages of both parents on the day coverage starts",
  "Planned trip length, including any possible extension",
  "Any known health conditions — diabetes, blood pressure, heart history",
  "Coverage amount (policy maximum) you're considering",
  "Deductible amount you're comfortable paying out of pocket first",
  "Whether the plan is comprehensive or fixed-benefit",
];

const GATHER = [
  "Passport and visa details for each parent (dates of birth matter for age-banded pricing)",
  "Planned arrival and return dates, or a realistic outer range if travel dates are still flexible",
  "A list of current prescription medications and dosages for each parent",
  "Any diagnosed conditions — diabetes, high blood pressure, heart disease — and how long they've been stable",
  "The host address in the USA, to check for nearby in-network providers",
  "A target budget range for premium, separate from how much liability the family can absorb",
];

const SCENARIOS = [
  {
    age: "58",
    label: "Parent, age 58",
    premium: "$1.10/day (illustrative)",
    deductible: "$100",
    coinsurance: "80/20",
    max: "$100,000",
    note: "Younger applicants are more often eligible for a wider range of plans and lower starting premiums.",
  },
  {
    age: "66",
    label: "Parent, age 66",
    premium: "$1.60/day (illustrative)",
    deductible: "$250",
    coinsurance: "80/20",
    max: "$100,000",
    note: "Many insurers step premiums up at defined age bands (e.g., 60, 65, 70) — 66 can price differently than 64.",
  },
  {
    age: "74",
    label: "Parent, age 74",
    premium: "$2.40/day (illustrative)",
    deductible: "$250",
    coinsurance: "70/30",
    max: "$50,000",
    note: "Some plans reduce the maximum coverage amount they'll sell at higher ages, not just raise the price.",
  },
  {
    age: "81",
    label: "Parent, age 81",
    premium: "$3.75/day (illustrative)",
    deductible: "$500",
    coinsurance: "70/30",
    max: "$50,000",
    note: "At advanced ages, some insurers stop offering new policies entirely — availability itself becomes a factor.",
  },
];

const faq: FaqItem[] = [
  {
    question: "Can I buy visitor insurance after my parents already arrived in the USA?",
    answer:
      "Some insurers allow purchase after arrival, sometimes with a waiting period before coverage becomes effective or with different terms than a pre-arrival purchase; others require the policy to be bought before travel. This varies by insurer and is not guaranteed either way — confirm directly with the plan before assuming a post-arrival purchase will be accepted or effective immediately.",
  },
  {
    question: "Do both parents need separate policies?",
    answer:
      "Most visitor insurance is sold as one policy per insured person rather than one shared family policy, so each parent typically gets an individual certificate with its own deductible, coinsurance, and policy maximum. Because pricing and eligibility are often age-based, two parents of different ages can end up with different terms even when bought from the same insurer on the same day — check each certificate separately rather than assuming they match.",
  },
  {
    question: "Does visitor insurance cover a parent's existing diabetes or blood pressure medication?",
    answer:
      "Many certificates limit or exclude routine, ongoing care and medication refills for a condition that existed before the policy started, though some describe a limited benefit if the condition causes a sudden, unexpected complication (often called \"acute onset\"). Diagnosis name alone doesn't determine coverage — the specific wording, any age cutoff, and the benefit maximum in the certificate do. See the Pre-Existing Conditions & Acute Onset guide before assuming either way.",
  },
  {
    question: "Should I choose the plan with the lowest premium for my parents?",
    answer:
      "Not automatically. A lower premium can come with a higher deductible, higher coinsurance share, a lower policy maximum, or narrower network access — any of which can leave the family owing more if a real medical event happens. Compare the full set of terms, ideally by running a realistic bill through the Cost & Liability Calculator, rather than sorting by premium alone.",
  },
  {
    question: "What happens if my parents' trip runs longer than the policy period?",
    answer:
      "Some plans allow an extension or renewal if requested before the current period ends and if the insured is still within the plan's eligible age and health parameters; others do not allow extension at all, or restrict it once a claim has been filed. Ask about extension rules before you buy if there's any chance the visit could run long, and don't assume a plan can simply be renewed on the day it expires.",
  },
];

export default function ParentsVisitingUsaPage() {
  const jsonLd = jsonLdGraph(
    visitorInsuranceArticleJsonLd({
      path: PATH,
      headline: "Insurance for Parents Visiting the USA: Cost, Coverage & Age Rules",
      description:
        "How age affects visitor insurance availability and premium for parents visiting the USA, plus coverage amount, deductible, and pre-existing-condition considerations.",
    }),
    faqJsonLd(faq),
    visitorInsuranceBreadcrumb(PATH, "Insurance for Parents Visiting the USA")
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Emotional hero band */}
      <div className="border-b border-ink-900/5 bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/visitor-insurance" className="hover:text-brand-600">Visitor Insurance</Link>
            <span aria-hidden>/</span>
            <span className="text-ink-500">Parents Visiting the USA</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white">
            👪 Visitor Insurance
          </span>
          <h1 className="mt-4 text-[2rem] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[2.75rem]">
            Buying insurance for your parents can be confusing.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            You want to get it right, but the certificates are dense and the stakes feel personal. Two questions usually matter more than any brochure:
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-card">
              <p className="text-sm font-bold text-ink-900">❤️ &ldquo;What if my father has chest pain?&rdquo;</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">Or a fall. Or a fever that won&rsquo;t break. What actually happens next — medically and financially?</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-card">
              <p className="text-sm font-bold text-ink-900">💰 &ldquo;What happens financially?&rdquo;</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">Which parts does the plan pay, which parts land on your family, and how would you actually know in advance?</p>
            </div>
          </div>

          <Link href="/tools/visitor-insurance-cost-calculator" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700">
            See what a real bill could mean for your family →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
        {/* Quick Answer */}
        <div className="mb-8 mt-10 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-2">Quick answer</p>
          <p className="text-sm leading-relaxed text-ink-800">
            Insurance for parents visiting the USA is generally sold as an individual policy per parent, and both availability and premium are heavily driven by age — an 81-year-old parent can face a higher premium, a lower deductible option, a lower maximum coverage
            amount, or fewer plan choices than a 58-year-old parent. The lowest-premium plan is not automatically the best one for an older parent or a parent with a health condition like diabetes or high blood pressure, because a low premium can pair with a high
            deductible, a low policy maximum, or limited network access that leaves the family owing more. Gather each parent&rsquo;s exact age, trip length, and health background first, then compare deductible, coinsurance, and coverage amount side by side — not premium
            alone.
          </p>
        </div>

        {/* Checklist card */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <p className="font-semibold text-amber-900">Parent insurance checklist — nail these down before buying</p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="mt-0.5 text-amber-600">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Calculator CTA */}
        <div className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
          <p className="font-semibold text-ink-900">See what a real bill could mean for your parent</p>
          <p className="mt-1 text-sm text-ink-600">Enter the premium, deductible, coinsurance, and policy maximum from your parent&rsquo;s own quote or certificate for a line-by-line estimate of what the insurer may pay and what your family could still owe.</p>
          <Link href="/tools/visitor-insurance-cost-calculator" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Open the Cost &amp; Liability Calculator →
          </Link>
        </div>

        {/* What to gather */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-ink-900 mb-2">What to gather before comparing plans</h2>
          <p className="text-sm leading-relaxed text-ink-600 mb-3">
            Comparing quotes goes faster, and more accurately, when you have real numbers in hand rather than estimates. Before requesting quotes for medical insurance for parents visiting the USA, collect:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-600">
            {GATHER.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>

        {/* ============ DEEP GUIDE CONTENT ============ */}
        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why age affects plan availability and premium</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Visitor insurance for parents is typically priced and underwritten by age band, and many insurers set firmer rules around age than typical US health coverage does. Some plans reduce the coverage amounts they&rsquo;re willing to sell as age increases, some
              raise the premium at defined thresholds (a 66-year-old and a 65-year-old can price differently even a year apart), and a smaller number of insurers stop offering new policies above a maximum issue age entirely. Don&rsquo;t assume the plan your family used
              for a 58-year-old parent last year will be available, at the same price, for an 81-year-old parent this year — check current age rules for each parent separately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why the lowest premium may create greater liability</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A lower premium is often paired with a higher deductible, a higher coinsurance share, a lower policy maximum, or narrower network rules — any of which shifts more of a real bill onto the family. When comparing plans for a parent visiting the USA, treat
              premium as only one line item, not the deciding factor. Run the actual deductible, coinsurance, and policy maximum for each option through the{" "}
              <Link href="/tools/visitor-insurance-cost-calculator" className="text-brand-600 underline">Cost &amp; Liability Calculator</Link> to see the full picture before choosing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Coverage amount considerations</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The coverage amount (policy maximum) is generally the most the plan will pay in total, not a number that guarantees any specific claim is covered. A larger maximum gives the plan more room to keep paying on a serious, high-cost event — but it says nothing
              about the deductible, coinsurance, network rules, or pre-existing-condition wording that determine how much of a smaller, routine bill the family pays. Choose a coverage amount based on what your family could realistically absorb if the plan reached its
              maximum, not on the largest number available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">$50,000 vs $100,000 vs $250,000 policy maximum</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              These are common maximum-coverage tiers offered across the visitor insurance market — this page does not state real current prices for any of them, since pricing varies by insurer, age, deductible, and state. Conceptually: the larger the maximum, the more
              the plan can pay toward eligible costs before the family becomes responsible for the rest, which matters most for a genuinely severe hospitalization. But a bigger number should not be the only factor — a $250,000-maximum plan with a high deductible and a
              50/50 coinsurance split can still leave a family owing more on a mid-size bill than a $100,000-maximum plan with a lower deductible and 80/20 coinsurance. Compare the whole set of terms together; the maximum only matters once the smaller cost-sharing terms
              are already accounted for.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Deductible choices</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Many plans let you pick from a range of deductible amounts, trading a higher deductible for a lower premium or the reverse. For an older parent, or a parent with a health condition, a lower deductible can mean the plan starts sharing costs sooner on a
              claim that&rsquo;s more likely to occur — but confirm whether the deductible applies once per policy period or separately per incident, since a per-incident deductible can be charged more than once during a single trip.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Comprehensive versus fixed-benefit coverage</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A comprehensive plan applies a deductible and coinsurance to eligible costs, closer to typical US health insurance. A fixed-benefit (scheduled) plan instead pays a flat, pre-set amount for each type of service regardless of the actual bill, and the family
              owes the difference. For a parent visiting the USA, this distinction can matter a lot on a large hospital bill — see the full comparison:{" "}
              <Link href="/visitor-insurance/fixed-benefit-vs-comprehensive" className="text-brand-600 underline">Fixed-benefit vs comprehensive</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Parents with diabetes</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Many certificates limit or exclude routine care, ongoing monitoring, and medication refills for a known condition like diabetes. Ask specifically whether an acute, unexpected complication of diabetes — not the diabetes itself — would be considered under
              any acute-onset provision, and what age cutoffs or benefit caps apply to that provision. See the{" "}
              <Link href="/visitor-insurance/pre-existing-conditions-acute-onset" className="text-brand-600 underline">Pre-Existing Conditions &amp; Acute Onset</Link> guide before assuming coverage either way.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Parents with high blood pressure</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              The same general pattern applies to high blood pressure: many certificates limit or exclude routine management of a pre-existing diagnosis, while a sudden, unexpected complication may fall under a separate acute-onset benefit if the certificate has one.
              The exact wording — including whether &ldquo;controlled&rdquo; versus &ldquo;uncontrolled&rdquo; blood pressure is treated differently — varies by insurer, so read the certificate rather than assuming a stable diagnosis is automatically excluded or included.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Parents with heart conditions</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A known heart condition is one of the areas where pre-existing-condition wording matters most, because a cardiac event can be both expensive and, in some certificates, explicitly addressed by name. Never assume a heart condition is automatically covered
              or automatically excluded by diagnosis name alone — ask the insurer directly how a specific parent&rsquo;s cardiac history would be treated, and confirm whether any acute-onset benefit has its own dollar cap separate from the main policy maximum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Routine care versus unexpected emergencies</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Visitor insurance is generally built around unexpected, sudden medical events during the trip — not routine or preventive care like an annual physical, dental cleaning, or eyeglasses. If a parent needs ongoing routine management of a known condition
              during the visit, check whether the certificate addresses that at all before assuming it&rsquo;s covered the way emergency care would be.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Prescription medication</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Prescription coverage on visitor plans, when it exists at all, often has its own sublimit, copay structure, or restriction to medication tied to a covered acute event rather than an ongoing prescription a parent already takes. Don&rsquo;t assume a parent&rsquo;s
              existing daily medication will be reimbursed — ask specifically whether the plan has a prescription benefit and what it covers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Emergency-room treatment</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              ER visits typically generate several separate charges — the facility fee, the treating physician, imaging, and lab work — each of which may be processed against the deductible and coinsurance independently. Ask whether the plan has a separate ER copay
              and whether it&rsquo;s waived if the visit results in an admission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Hospitalization</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Inpatient hospitalization is usually where the policy maximum matters most, since a multi-day stay can accumulate charges quickly. Check whether the certificate sets a per-day room-and-board sublimit in addition to the overall policy maximum — a plan can
              have a large maximum but still cap what it pays per day of hospital stay.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Ambulance</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Ambulance transport frequently carries its own sublimit or flat benefit amount separate from the general coinsurance terms, and ground versus air ambulance can be treated very differently. Confirm the specific ambulance benefit rather than assuming it
              falls under the same coinsurance as hospital care.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Medical evacuation</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Some visitor plans include a separate medical evacuation or repatriation benefit — covering transport to a better-equipped facility or, in some cases, returning a parent to India — often with its own dollar cap and specific conditions for when it applies.
              This is a distinct benefit from general medical coverage; confirm whether it&rsquo;s included at all before assuming it is.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Network access near the host&rsquo;s home</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              A plan&rsquo;s network can look strong nationally while having thin coverage in a specific city or suburb. Before buying, check whether hospitals and urgent care centers near where the parent will actually be staying are in-network, since out-of-network
              care can mean a higher coinsurance share and potential balance billing on top of it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Trip duration</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Buy coverage for the full realistic length of the visit, not just the initially planned dates — some families buy short and try to extend later, which isn&rsquo;t always possible. Certain plans also set a maximum trip length tied to age, so a plan that
              covers a six-month visitor insurance period for a younger parent may not offer the same length for an older one.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Extension and renewal questions</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              If there&rsquo;s any chance the trip could run longer than planned, ask before buying: Can this policy be extended, and by how much? Does extension require no claims filed yet? Does the premium or deductible change on renewal? Some insurers don&rsquo;t
              allow extension once a claim is open, which can leave a family without continuing coverage exactly when it&rsquo;s needed most.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Individual policies for two parents</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Visitor insurance is generally sold as one policy per insured person, not one shared policy for both parents. Each parent typically gets an individual certificate with its own deductible, coinsurance, and policy maximum — a claim by one parent generally
              doesn&rsquo;t reduce the coverage available to the other, which is different from how a shared family deductible works on some domestic US health plans. Don&rsquo;t assume the policies are linked unless the certificate specifically says so.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Why two parents may have different plan terms</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Because pricing and eligibility are age-based, a 66-year-old parent and an 81-year-old parent bought from the same insurer on the same day can end up with different premiums, different available deductible options, different maximum coverage amounts, or
              even different plan eligibility altogether. Review each parent&rsquo;s certificate separately rather than assuming that because one parent is covered on a given plan, the other automatically qualifies for the same terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Buying before travel versus after arrival</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Buying before departure is generally the more straightforward path and gives you time to compare terms without time pressure — it also pairs naturally with preparing other travel paperwork, such as the{" "}
              <Link href="/invitation-letter-for-parents-to-visit-usa" className="text-brand-600 underline">invitation letter for parents visiting the USA</Link>{" "}
              on a B-2 visa. Some insurers do allow purchase after a parent has already arrived, sometimes with a waiting period before the coverage becomes effective; this is not universal, so confirm directly with the insurer if a pre-trip purchase wasn&rsquo;t possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Questions children should ask when buying for parents</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>Is this parent&rsquo;s exact age within the plan&rsquo;s eligible issue-age range for the full trip length?</li>
              <li>What is the deductible, and does it apply per policy period or per incident?</li>
              <li>What is the coinsurance split in-network and out-of-network, and is there a cap?</li>
              <li>Exactly how does the certificate treat this parent&rsquo;s specific known condition — routine care and any acute-onset wording?</li>
              <li>Can the policy be extended if the trip runs long, and under what conditions?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Documents to save</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>The full policy certificate or summary of benefits, not just a confirmation email</li>
              <li>Proof of purchase and payment (date, amount, method)</li>
              <li>A copy of each parent&rsquo;s passport and visa page used for enrollment</li>
              <li>Contact information and a claims phone number for the insurer or third-party administrator</li>
              <li>Any pre-existing-condition or acute-onset disclosure forms submitted at purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Claims preparation</h2>
            <p className="text-sm leading-relaxed text-ink-600">
              If a parent needs care, contact the insurer or administrator as soon as reasonably possible — some certificates require notice within a set number of days. Keep every itemized bill, discharge summary, and receipt; ask the treating facility for an
              itemized statement rather than only a balance-due summary, since claims processing generally needs the itemized detail.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Mistakes families make</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>Choosing the lowest premium without checking the deductible, coinsurance, and coverage amount</li>
              <li>Assuming one parent&rsquo;s plan terms automatically apply to the other parent</li>
              <li>Not confirming a specific known condition&rsquo;s treatment under the certificate before travel</li>
              <li>Buying coverage for only the initially planned dates, with no cushion for delays</li>
              <li>Waiting until after arrival to shop, narrowing the available plan options</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Scenario examples by age</h2>
            <p className="text-sm leading-relaxed text-ink-600 mb-3">
              The figures below are an <strong>illustrative example only, not a real quote</strong> — they exist to show that plan terms commonly vary by age band, not to state what any real insurer charges. Actual premiums, deductibles, coinsurance splits, and policy
              maximums vary by insurer, state, health history, and the exact plan chosen, and these age brackets are not universal across the market.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-3">Parent</th>
                    <th className="px-4 py-3">Illustrative premium</th>
                    <th className="px-4 py-3">Illustrative deductible</th>
                    <th className="px-4 py-3">Illustrative coinsurance</th>
                    <th className="px-4 py-3">Illustrative maximum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {SCENARIOS.map((s) => (
                    <tr key={s.age}>
                      <td className="px-4 py-3 font-semibold text-ink-900">{s.label}</td>
                      <td className="px-4 py-3 text-ink-600">{s.premium}</td>
                      <td className="px-4 py-3 text-ink-600">{s.deductible}</td>
                      <td className="px-4 py-3 text-ink-600">{s.coinsurance}</td>
                      <td className="px-4 py-3 text-ink-600">{s.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SCENARIOS.map((s) => (
                <div key={s.age} className="rounded-2xl border border-ink-900/5 bg-white p-4 text-sm text-ink-600">
                  <p className="font-semibold text-ink-900">{s.label}</p>
                  <p className="mt-1">{s.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Again: these numbers are made up for illustration and are not a real quote from any insurer. Enter your parent&rsquo;s actual quoted terms into the{" "}
              <Link href="/tools/visitor-insurance-cost-calculator" className="text-brand-600 underline">Cost &amp; Liability Calculator</Link> for a real estimate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900 mb-2">Sources</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-600">
              <li>
                <a href="https://www.healthcare.gov/glossary/" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">HealthCare.gov — Glossary</a>
              </li>
              <li>
                <a href="https://www.cms.gov/newsroom/fact-sheets/short-term-limited-duration-insurance-and-independent-noncoordinated-excepted-benefits-coverage-cms" target="_blank" rel="nofollow noopener noreferrer" className="text-brand-600 underline">CMS.gov — Short-term, limited-duration insurance</a>
              </li>
              <li>Your own policy certificate, summary of benefits, or underwriter documents</li>
            </ul>
            <p className="mt-2 text-xs text-ink-400">
              Last reviewed {VISITOR_INSURANCE_UPDATED_HUMAN}. See the full{" "}
              <Link href="/visitor-insurance/methodology" className="text-brand-600 underline">source hierarchy and methodology</Link>, or the{" "}
              <Link href="/visitor-insurance/glossary" className="text-brand-600 underline">visitor insurance glossary</Link> for term-by-term definitions.
            </p>
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
          This guide and its calculator are educational only, not insurance, medical, or legal advice, a quote, or a coverage determination. Visitor insurance terms vary enormously by insurer, state, and certificate, and every parent&rsquo;s health situation is
          different. The policy certificate controls, and the insurer or claims administrator makes the final benefit determination. Always verify the exact terms with the insurer before purchasing.
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
