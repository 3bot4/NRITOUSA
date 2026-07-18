import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import TrackedSourceBox from "@/components/tools/TrackedSourceBox";
import TrackedLink from "@/components/tools/TrackedLink";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import NriTdsEstimator from "@/components/tools/NriTdsEstimator";
import NriTdsChecklists from "@/components/tools/NriTdsChecklists";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  essentialsArticleJsonLd,
  essentialsSoftwareAppJsonLd,
  otherEssentialsLinks,
  NRI_TDS_PUBLISHED,
  NRI_TDS_UPDATED,
  NRI_TDS_UPDATED_HUMAN,
} from "@/lib/nriEssentialsCluster";
import {
  nriTdsConfig as cfg,
  nriTdsFaqs,
  ltcgTdsRows,
  stcgRow,
  form13Steps,
  threeConcepts,
  ownershipExamples,
  transactionTimeline,
  nriTdsSourceLinks,
  nriTdsSources,
  NRI_TDS_DISCLAIMER,
} from "@/data/nriPropertySaleTdsData";

const PATH = "/nri-selling-property-in-india-tds";
const TITLE = "NRI Selling Property in India: TDS Rates & How to Reduce It (2026)";
const DESC =
  "TDS rates when an NRI sells property in India, how to apply for a lower-TDS certificate (Form 13), capital gains, US tax reporting & repatriation. 2026 guide.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const sourceLink = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline underline-offset-2">
    {label}
  </a>
);

interface Block {
  h3?: string;
  paras: React.ReactNode[];
}
interface Section {
  id: string;
  h2: string;
  blocks: Block[];
}

const SECTIONS_TOP: Section[] = [
  {
    id: "full-sale-price",
    h2: "Why TDS on Sale of Property for NRIs Is Commonly Withheld on the Full Sale Price",
    blocks: [
      {
        paras: [
          <>
            When a <em>resident</em> sells property, the buyer deducts a modest 1% under the familiar rules. When the
            seller is an NRI, a different provision applies — {cfg.sectionOld}, carried forward as {cfg.sectionNew} for
            deductions from April 1, 2026. The law applies to <strong>sums chargeable to tax</strong> — it does not
            declare your entire sale price to be income. In practice, though, without an Assessing Officer&apos;s
            lower/nil certificate or another accepted determination, buyers commonly withhold using the{" "}
            <strong>gross amount payable</strong>, because they cannot independently establish the NRI seller&apos;s
            taxable gain and the shortfall liability would be theirs. Sell a flat for ₹2 crore bought at ₹1.6 crore,
            and the common withholding is roughly ₹26–30 lakh against a true tax bill closer to ₹5–6 lakh on the ₹40
            lakh gain.
          </>,
          <>
            This is a withholding mechanism, not confiscation. India collects up front from the buyer and settles later
            — either through a refund when you file your Indian return, or, far better, by never over-withholding in
            the first place via a lower-TDS certificate (next section). The practical takeaway when you are an NRI
            selling property in India: the TDS question must be planned <em>before</em> the sale agreement is signed,
            because the deduction happens at payment, and getting over-withheld money back means waiting on{" "}
            <Link href="/india-tax-compliance/nri-property-sale-tds-refund" className="font-semibold text-brand-600 underline underline-offset-2">
              the NRI property-sale TDS refund process
            </Link>{" "}
            after year-end.
          </>,
        ],
      },
      {
        h3: "Selling property in India for NRIs: what the buyer will insist on",
        paras: [
          <>
            Expect a well-advised buyer to be cautious to the point of paranoia — the liability for wrong deduction
            sits on them, with interest and penalties. They will ask for your PAN, proof of the holding period, and
            either withhold at the full default rate or ask you to produce a lower-deduction certificate naming them.
            Sellers who treat this as buyer unreasonableness lose deals; sellers who arrive with the certificate close
            faster and at better terms. If the flat was inherited, the previous owner&apos;s holding period and cost
            generally carry over to you — a point worth having your CA document early, since it usually converts the
            sale to long-term treatment.
          </>,
        ],
      },
    ],
  },
  {
    id: "form-13",
    h2: "How to Legally Reduce TDS: the Lower/Nil TDS Certificate (Form 13), Step by Step",
    blocks: [
      {
        paras: [
          <>
            Searches for how to <em>avoid</em> TDS on sale of property by NRI are really asking the wrong question —
            withholding on an NRI sale cannot be lawfully avoided, and schemes that promise otherwise (under-reporting
            the consideration, routing through a resident relative) create real prosecution risk for both sides. What
            the law provides is a way to <strong>align the withholding with your actual expected liability</strong>:
            Form 13 is the principal <em>seller-side</em> route for requesting a lower or nil deduction certificate
            from the Assessing Officer — see the{" "}
            {sourceLink(nriTdsSources.ldcGuidance, "Income Tax Department's official lower/no-deduction guidance")}.
            The buyer should take professional advice about any payer-side determination procedure available under
            current law. Nil is genuinely possible where exemptions (Section 54/54EC reinvestment, treaty positions,
            brought-forward losses) wipe out the taxable gain.
          </>,
        ],
      },
      {
        h3: "The Form 13 timeline, realistically",
        paras: [
          <>
            The steps below reflect practitioner experience as of {NRI_TDS_UPDATED_HUMAN} — there is{" "}
            <strong>no statutory processing deadline</strong>, jurisdictions differ, and the certificate must be in
            hand <em>before</em> the buyer pays, so start the moment a buyer is identified. For the deeper procedural
            walkthrough — documents, portal mechanics, common rejection reasons — see the dedicated{" "}
            <Link href="/india-tax-compliance/form-13-lower-tds-certificate-nri" className="font-semibold text-brand-600 underline underline-offset-2">
              Form 13 lower TDS certificate guide for NRIs
            </Link>
            .
          </>,
        ],
      },
    ],
  },
];

const SECTIONS_BOTTOM: Section[] = [
  {
    id: "capital-gains",
    h2: "Capital Gains Calculation for NRIs",
    blocks: [
      {
        h3: "Capital gains vs TDS for NRI on sale of property: two different numbers",
        paras: [
          <>
            Immovable property held more than {cfg.ltcgHoldingMonths} months is long-term. For transfers{" "}
            <strong>on or after July 23, 2024</strong>, long-term gains are taxed at a flat{" "}
            <strong>{cfg.ltcgBasePct}% without indexation</strong> — and the transitional option to compute under the
            older 20%-with-indexation method was limited to <em>resident</em> individuals and HUFs, so nonresidents
            generally do not get it, even for property bought long before 2024. Transfers <strong>before</strong> July
            23, 2024 followed the older regime — different math entirely, reviewed with your CA. Your gain is sale
            price minus acquisition cost, documented improvement cost, and transfer expenses — each evaluated
            separately. This is confirmed in the{" "}
            {sourceLink(nriTdsSources.itr2ValidationRules, "CBDT's ITR-2 validation rules (AY 2025-26)")}. Run your
            numbers in the{" "}
            <Link href="/calculators/india-property-capital-gains" className="font-semibold text-brand-600 underline underline-offset-2">
              India property capital gains calculator
            </Link>{" "}
            or the estimator above.
          </>,
          <>
            Two exemptions matter most, both available to NRIs, both date-stamped here as of {NRI_TDS_UPDATED_HUMAN}:
            reinvesting the gain in one residential house in India within the statutory window (the Section 54 route),
            and investing gains up to the statutory cap in notified capital-gains bonds within six months (the Section
            54EC route, with a lock-in). Claimed correctly — ideally inside the Form 13 application — they reduce not
            just your final tax but the withholding itself. Both carry unforgiving conditions and deadlines: verify the
            current windows, caps, and section numbering under the Income-tax Act, 2025 with your CA before committing
            money.
          </>,
        ],
      },
    ],
  },
  {
    id: "us-tax",
    h2: "NRI Selling Property in India — Tax Implications in US: Reporting the Sale on Your Return",
    blocks: [
      {
        paras: [
          <>
            If you are a US citizen, green card holder, or otherwise a US tax resident, the IRS taxes your worldwide
            income — the India property sale goes on your US return for the year of sale. The gain is recomputed under
            US rules: purchase and sale amounts translated to dollars at their own historical exchange rates, no Indian
            indexation in the US basis, and US long-term rates if held over a year. Currency movement alone can make
            the US-computed gain larger or smaller than the Indian one. If the property was ever rented,{" "}
            <strong>depreciation recapture</strong> may apply — US rules assume allowable depreciation whether or not
            you claimed it. And your state may tax the gain on its own terms, without foreign tax credits.
          </>,
          <>
            Double taxation is generally managed, not automatic: the US–India treaty lets India tax the gain on Indian
            real estate, and the US then allows a <strong>foreign tax credit</strong> for Indian tax actually paid —
            typically claimed via {sourceLink(nriTdsSources.irs1116, "Form 1116")}, subject to its{" "}
            {sourceLink(nriTdsSources.irsFtc, "limitation rules")}. The traps are timing (withheld TDS is not yet
            &quot;tax paid&quot; — the credit ties to the final Indian liability for the right year) and rate mismatch.
            One reporting nuance: directly held foreign real estate is not itself an FBAR-reportable account — FBAR and
            Form 8938 concern foreign financial <em>accounts and assets</em> — but the sale proceeds landing in your
            NRO account absolutely count toward those account thresholds. Estimate the interaction with the{" "}
            <Link href="/calculators/dtaa-foreign-tax-credit" className="font-semibold text-brand-600 underline underline-offset-2">
              DTAA foreign tax credit calculator
            </Link>
            , and have a cross-border CPA prepare the actual return.
          </>,
        ],
      },
    ],
  },
  {
    id: "repatriation",
    h2: "Repatriating Sale Proceeds to the USA",
    blocks: [
      {
        paras: [
          <>
            The money path: sale proceeds land in your <strong>NRO account</strong>; from there, RBI&apos;s FEMA
            framework generally permits remitting up to <strong>{cfg.repatriationLimitUsd} per financial year</strong>{" "}
            of eligible balances and sale proceeds — see the {sourceLink(nriTdsSources.rbi, "RBI's remittance rules")}{" "}
            (Master Direction on Remittance of Assets). Treat it as a facility, not a promise: repatriation is subject
            to bank review, source documentation, tax compliance, and the applicable FEMA conditions — not every sale
            amount can automatically be wired the week after closing.
          </>,
          <>
            The bank&apos;s file typically includes <strong>Form 15CA</strong> (your declaration — its applicable part
            depends on the payment circumstances) and, where required, <strong>Form 15CB</strong> (a CA&apos;s
            certificate). 15CB is <em>not</em> automatically required for every remittance — requirements depend on
            taxability, amount, and the remittance rules — so let your CA and bank map the exact paperwork. Practical
            sequencing: finish the TDS story first (withholding at the certificate rate, or withholding plus a refund
            plan), then start the remittance file. Our{" "}
            <TrackedLink
              href="/india-tax-compliance/repatriating-property-sale-proceeds-india-usa"
              eventName="repatriation_guide_clicked"
              toolSlug="nri-selling-property-in-india-tds"
              className="font-semibold text-brand-600 underline underline-offset-2"
            >
              guide to repatriating property sale proceeds from India to the USA
            </TrackedLink>{" "}
            walks the bank-side process, and the{" "}
            <Link href="/tools/form-15ca-15cb-checklist" className="font-semibold text-brand-600 underline underline-offset-2">
              Form 15CA/15CB checklist tool
            </Link>{" "}
            assembles the document list. If the sale is part of a permanent move back, coordinate it with the{" "}
            <Link href="/return-to-india" className="font-semibold text-brand-600 underline underline-offset-2">
              Return to India Playbook
            </Link>{" "}
            — residency timing changes both countries&apos; tax treatment. And if some of the wealth will travel as
            jewellery rather than wire transfers, know{" "}
            <Link href="/gold-limit-usa-to-india" className="font-semibold text-brand-600 underline underline-offset-2">
              how much gold you can carry between the USA and India
            </Link>{" "}
            before booking flights.
          </>,
        ],
      },
    ],
  },
  {
    id: "buyer-obligations",
    h2: "Buyer's Obligations When Purchasing From an NRI",
    blocks: [
      {
        h3: "TDS on sale of property, NRI seller: the buyer's five duties",
        paras: [
          <>
            Buyers search these terms too, usually in mild panic — so, briefly: buying from an NRI makes <em>you</em>{" "}
            the deductor. As of {NRI_TDS_UPDATED_HUMAN} that means (1) confirming the seller&apos;s nonresident status,
            (2) deducting at the correct or certificate rate on <em>each</em> payment — advances and installments
            included, (3) depositing the tax on time, (4) filing the required TDS statement, and (5) issuing the seller
            a TDS certificate. Deducting 1% &quot;like a normal purchase&quot; is the classic, expensive mistake: the
            shortfall, interest, and penalties land on the buyer. When the seller presents a lower-deduction
            certificate, verify it names you and your PAN, and deduct exactly the certificate rate.
          </>,
        ],
      },
    ],
  },
  {
    id: "buying",
    h2: "Can an NRI Buy Property in India?",
    blocks: [
      {
        paras: [
          <>
            Yes — NRIs and OCI holders can generally buy residential and commercial property in India freely under
            FEMA; agricultural land, plantations, and farmhouses are the notable exclusions. Payment must come through
            Indian banking channels (NRE/NRO/FCNR funds), and the buying decision has its own tax and repatriation
            angles — TDS you must deduct from <em>your</em> seller, rental income taxation if you let it out, and how
            the eventual exit is taxed, which is everything above. The buying side deserves its own full treatment;
            until that guide ships, start with the{" "}
            <Link href="/india-property" className="font-semibold text-brand-600 underline underline-offset-2">
              India property planning hub for NRIs
            </Link>{" "}
            — sell-vs-hold, inheritance, and US-kids-with-India-property scenarios included.
          </>,
        ],
      },
    ],
  },
];

function renderSection(s: Section) {
  return (
    <div key={s.id} id={s.id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-ink-900">{s.h2}</h2>
      <div className="mt-3 space-y-6">
        {s.blocks.map((b, i) => (
          <div key={i}>
            {b.h3 && <h3 className="text-base font-bold text-ink-900">{b.h3}</h3>}
            <div className="mt-1.5 space-y-3">
              {b.paras.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-ink-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const jsonLd = jsonLdGraph(
    essentialsSoftwareAppJsonLd({
      path: PATH,
      name: "NRI Property Sale TDS & Capital Gains Estimator",
      description:
        "Free educational estimator separating an NRI seller's estimated capital gain, estimated final Indian tax, and illustrative TDS withholding — with every assumption listed.",
      applicationCategory: "FinanceApplication",
    }),
    essentialsArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: NRI_TDS_PUBLISHED,
      dateModified: NRI_TDS_UPDATED,
    }),
    faqJsonLd(nriTdsFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "India Property", url: "/india-property" },
      { name: "NRI Selling Property: TDS", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nri-selling-property-in-india-tds"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "India Property", href: "/india-property" },
          { label: "NRI Selling Property: TDS" },
        ]}
        icon="🏠"
        category="NRI Tax & Property"
        title="NRI Selling Property in India: TDS, Capital Gains Tax & Repatriation Guide (2026)"
        hook="An NRI selling property in India commonly sees 13–15% of the FULL sale price withheld against a much smaller real tax bill. Here is how withholding, capital gains, and final tax differ, how the Form 13 lower-TDS certificate aligns them, what the IRS expects, and how the money comes home."
        accent="from-emerald-600 to-teal-700"
        badges={["Rates as of July 2026", "Form 13 step-by-step", "Educational estimator", "US reporting covered"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tds-rates"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              See the TDS rates →
            </a>
            <a
              href="#tds-estimator"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              Try the estimator
            </a>
          </div>
        }
        topDisclaimer={<>Educational information only. Not tax or legal advice.</>}
        sourceNote={
          <>
            Reviewed by Deepak Middha, CA · Last updated {NRI_TDS_UPDATED_HUMAN}. Rates verified against Income Tax
            Department sources and the Income-tax Act, 2025 transition — official links throughout and at the end of
            this page.
          </>
        }
        disclaimerPoints={[
          "Indian tax rates, surcharge rules, section numbers, and forms change with Finance Acts — always verify current figures.",
          "Surcharge depends on the seller's income circumstances; joint ownership needs seller-by-seller analysis.",
          "A property sale is a high-value transaction: engage a qualified CA in India and a cross-border CPA in the US.",
          "This guide and estimator are educational — they file nothing and replace no professional.",
        ]}
        disclaimerExtra={<p>{NRI_TDS_DISCLAIMER}</p>}
      >
        {/* Three concepts — the framing everything else depends on */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Three Numbers People Conflate — Rate, Withholding, and Final Tax</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Most confusion about TDS for NRI property sales comes from treating these as one number. They are not
                automatically identical — the entire strategy below is about closing the gap between them.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {threeConcepts.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <p className="text-sm font-bold text-ink-900">{c.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Rates table */}
        <section id="tds-rates" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">TDS on Sale of Property by NRI: Current Rates</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                As of {NRI_TDS_UPDATED_HUMAN}: long-term base rate {cfg.ltcgBasePct}% plus surcharge and {cfg.cessPct}%
                cess; short-term commonly withheld around 31.2–39%.{" "}
                <strong>
                  The rows below are illustrative withholding assumptions keyed to the payment amount — the surcharge
                  the law actually requires depends on the seller&apos;s status and aggregate income circumstances, not
                  the property&apos;s price.
                </strong>{" "}
                Assumed: individual nonresident seller, no certificate, single seller.
              </p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {[...ltcgTdsRows, stcgRow].map((r) => (
                  <div key={r.saleValue} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.saleValue}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">Illustrative withholding: {r.effectiveRate}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                      <span className="font-semibold text-ink-500">Surcharge:</span> {r.surcharge}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.note}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Payment / holding</th>
                      <th className="p-3 font-semibold">Surcharge (assumed)</th>
                      <th className="p-3 font-semibold">Illustrative withholding</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {[...ltcgTdsRows, stcgRow].map((r) => (
                      <tr key={r.saleValue} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.saleValue}</td>
                        <td className="p-3 text-ink-600">{r.surcharge}</td>
                        <td className="p-3 font-medium text-emerald-700">{r.effectiveRate}</td>
                        <td className="p-3 text-ink-600">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Long-term = held more than {cfg.ltcgHoldingMonths} months; {cfg.ltcgBasePct}% (no indexation) applies
                to transfers on/after July 23, 2024. Deduction happens under {cfg.sectionOld}, now {cfg.sectionNew} for
                deductions from April 1, 2026. Foreign companies and other entity sellers have different structures.{" "}
                <strong>Joint ownership and multiple sellers require seller-by-seller calculations</strong> — see the
                examples below. Verify current rates at incometax.gov.in.
              </p>
            </div>
          </Container>
        </section>

        {/* Estimator */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold text-ink-900">NRI Property TDS Estimator</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                An educational estimator that keeps the three numbers separate — and shows a range instead of false
                precision when your aggregate income is unknown.
              </p>
              <div className="mt-4">
                <NriTdsEstimator />
              </div>
              <div className="mt-4 rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Methodology &amp; assumptions</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">
                  Long-term = held &gt;{cfg.ltcgHoldingMonths} months; LTCG at {cfg.ltcgBasePct}% (no indexation) for
                  sales on/after July 23, 2024, plus surcharge (from aggregate income when provided; otherwise a
                  nil-to-{cfg.ltcgSurchargeCapPct}% range) and {cfg.cessPct}% cess. Short-term shown as a slab-taxed
                  planning band. Withholding without a certificate is an illustration of common buyer practice (gross
                  payment × rate, surcharge assumed from payment size). Per-seller math via the ownership percentage.
                  Section 54/54EC inputs are user estimates. The tool computes locally in your browser, sends no
                  entered data anywhere, files nothing, and does not replace a CA. Last verified {NRI_TDS_UPDATED_HUMAN}.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Top guide sections + Form 13 steps */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              {SECTIONS_TOP.map((s) => (
                <div key={s.id}>
                  {renderSection(s)}
                  {s.id === "form-13" && (
                    <div className="mt-5 space-y-3">
                      {form13Steps.map((st) => (
                        <div key={st.step} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-bold text-ink-900">{st.step}</p>
                            <p className="text-xs font-semibold text-emerald-700">{st.timing}</p>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{st.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* TAN change status box */}
        <section className="pb-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
              <p className="text-sm font-bold text-ink-900">📌 Buyer paperwork is changing on {cfg.tanChangeDate}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Transactions through September 30, 2026</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    Follow the currently applicable process: the buyer obtains a TAN, deposits the deducted tax, and
                    files the nonresident TDS statement (Form 27Q), then issues the TDS certificate.
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Eligible transactions from October 1, 2026</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    A <strong>resident individual/HUF buyer</strong> purchasing immovable property from a nonresident
                    may be able to use a PAN-based challan-cum-statement process (the Finance Act 2026 amendment to
                    Section 397(1)(c) of the Income-tax Act, 2025), subject to the enacted provision, effective date,
                    prescribed statement, and operational rules. Company, firm, and LLP buyers still need TAN + Form
                    27Q. Confirm the live process with a professional before relying on it.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Remaining guide sections */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">{SECTIONS_BOTTOM.map(renderSection)}</div>
          </Container>
        </section>

        {/* Joint ownership examples */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Joint Ownership &amp; Multiple Parties: Six Common Scenarios</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Compliance is generally <strong>seller-specific and payment-specific</strong> — each seller&apos;s
                share and each payment event carries its own analysis.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ownershipExamples.map((ex) => (
                  <div key={ex.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{ex.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{ex.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Transaction timeline */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The Transaction Timeline, Start to Finish</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The sequence matters more than the speed — most expensive mistakes are steps done out of order. No
                rigid deadlines are implied except where the law prescribes them.
              </p>
              <ol className="mt-4 space-y-3">
                {transactionTimeline.map((t, i) => (
                  <li key={t.phase} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{t.phase}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* Checklists */}
        <section className="py-10 sm:py-12">
          <Container>
            <NriTdsChecklists />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-12 sm:py-16">
          <Container>
            <ToolFaq items={nriTdsFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related NRI property & tax guides"
              links={[
                {
                  href: "/india-tax-compliance/form-13-lower-tds-certificate-nri",
                  label: "Form 13 Lower TDS Certificate for NRIs",
                  desc: "The application process in depth — documents, portal, timelines",
                },
                {
                  href: "/india-tax-compliance/nri-property-sale-tds-refund",
                  label: "NRI Property Sale TDS Refund",
                  desc: "Already over-withheld? How to reclaim it via your Indian return",
                },
                {
                  href: "/india-property",
                  label: "India Property Planning Hub",
                  desc: "Sell vs hold, inheritance, and NRI buying property in India",
                },
                {
                  href: "/calculators/india-property-capital-gains",
                  label: "India Property Capital Gains Calculator",
                  desc: "Estimate your gain and the tax on it",
                },
                ...otherEssentialsLinks(PATH),
              ]}
            />
          </Container>
        </section>

        {/* Official sources — external links live here, at the end */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrackedSourceBox
              title="Official tax sources"
              intro="Always verify current TDS rates, certificate procedures, forms, and remittance rules directly with the official sources:"
              links={nriTdsSourceLinks}
              eventName="official_tax_source_clicked"
              toolSlug="nri-selling-property-in-india-tds"
            />
          </Container>
        </section>

        <section className="py-10 pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NRI_TDS_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
