import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  essentialsArticleJsonLd,
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
  nriTdsSourceLinks,
  NRI_TDS_DISCLAIMER,
} from "@/data/nriPropertySaleTdsData";

const PATH = "/nri-selling-property-in-india-tds";
const TITLE = "NRI Selling Property in India: TDS Rates & How to Reduce It (2026)";
const DESC =
  "TDS rates when an NRI sells property in India, how to apply for a lower-TDS certificate (Form 13), capital gains, US tax reporting & repatriation. 2026 guide.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

interface Block {
  h3?: string;
  paras: React.ReactNode[];
}
interface Section {
  id: string;
  h2: string;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  {
    id: "full-sale-price",
    h2: "Why TDS on Sale of Property for NRIs Hits the Full Sale Price — Not Your Gain",
    blocks: [
      {
        paras: [
          <>
            When a <em>resident</em> sells property, the buyer deducts a modest 1% under the familiar rules. When the
            seller is an NRI, a different provision applies — {cfg.sectionOld}, carried forward as {cfg.sectionNew} for
            deductions from April 1, 2026 — and it instructs the buyer to deduct tax on the <strong>entire sale
            consideration</strong>, not your profit. Sell a flat for ₹2 crore that you bought for ₹1.6 crore, and the
            buyer&apos;s default obligation is roughly 14.95% of ₹2 crore — about ₹29.9 lakh withheld against a true
            tax bill closer to ₹5–6 lakh on the ₹40 lakh gain.
          </>,
          <>
            This is not the government claiming your principal; it is a withholding mechanism. India cannot easily
            chase a seller who has left the country, so it collects up front from the buyer and settles up later —
            either through a refund when you file your Indian return, or, far better, by never over-deducting in the
            first place via a lower-TDS certificate (next section). The practical takeaway when you are an NRI selling
            property in India: the TDS question must be planned <em>before</em> the sale agreement is signed, because
            the deduction happens at payment, and getting over-deducted money back means waiting on{" "}
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
            either deduct at the full default rate or ask you to produce a lower-deduction certificate naming them.
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
            TDS on an NRI sale cannot be lawfully avoided, and schemes that promise otherwise (under-reporting the
            consideration, routing through a resident relative) create real prosecution risk for both sides. What the
            law does provide is a way to <strong>reduce the deduction to your actual tax liability</strong>: a lower or
            nil deduction certificate issued by the Assessing Officer under the Form 13 process. Nil is genuinely
            possible where exemptions (Section 54/54EC reinvestment, treaty positions, brought-forward losses) wipe out
            the taxable gain.
          </>,
        ],
      },
      {
        h3: "The Form 13 timeline, realistically",
        paras: [
          <>
            The steps and timing below are typical as of {NRI_TDS_UPDATED_HUMAN}; jurisdictions differ, and the
            certificate must be in hand <em>before</em> the buyer pays, so start the moment a buyer is identified. For
            the deeper procedural walkthrough — documents, portal mechanics, common rejection reasons — see the
            dedicated{" "}
            <Link href="/india-tax-compliance/form-13-lower-tds-certificate-nri" className="font-semibold text-brand-600 underline underline-offset-2">
              Form 13 lower TDS certificate guide for NRIs
            </Link>
            .
          </>,
        ],
      },
    ],
  },
  {
    id: "capital-gains",
    h2: "Capital Gains Calculation for NRIs",
    blocks: [
      {
        h3: "Capital gains vs TDS for NRI on sale of property: two different numbers",
        paras: [
          <>
            Property held more than {cfg.ltcgHoldingMonths} months is long-term. For transfers on or after July 23,
            2024, long-term gains are taxed at a flat <strong>{cfg.ltcgBasePct}% without indexation</strong> — the
            Finance (No. 2) Act, 2024 removed the old 20%-with-indexation regime, and the transitional option to choose
            the old computation was limited to resident individuals, so NRIs are generally on the flat {cfg.ltcgBasePct}%
            for pre-2024 purchases too. Your gain is simply sale price minus actual cost (plus improvement costs and
            transfer expenses). Held {cfg.ltcgHoldingMonths} months or less, the gain is short-term and taxed at your
            slab rate. Run your numbers in the{" "}
            <Link href="/calculators/india-property-capital-gains" className="font-semibold text-brand-600 underline underline-offset-2">
              India property capital gains calculator
            </Link>
            .
          </>,
          <>
            Two exemptions matter most, both available to NRIs and both date-stamped here as of{" "}
            {NRI_TDS_UPDATED_HUMAN}: reinvesting the gain in one residential house in India within the statutory window
            (the classic Section 54 route under the 1961 Act — renumbered under the Income-tax Act, 2025, but your CA
            will know it by the old name for years), and investing up to ₹50 lakh of gains in notified capital-gains
            bonds within six months (the Section 54EC route, five-year lock-in). Claimed correctly — ideally inside the
            Form 13 application — they reduce not just your final tax but the TDS itself. Both come with conditions and
            deadlines that are unforgiving, so treat this paragraph as a map, not the territory: verify current section
            numbers, windows, and caps at incometax.gov.in or with your CA.
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
            US rules: cost and sale price translated to dollars at the exchange rates on the respective dates, no
            Indian indexation, and US long-term rates (0/15/20% plus possibly the 3.8% net investment income tax) if
            held over a year. Currency movement alone can make the US-computed gain larger or smaller than the Indian
            one — a rupee that fell between purchase and sale often shrinks the dollar gain.
          </>,
          <>
            Double taxation is generally managed, not automatic: the US–India treaty lets India tax the gain on Indian
            real estate, and the US then allows a <strong>foreign tax credit</strong> for Indian tax actually paid —
            typically claimed on Form 1116. The traps are timing (TDS withheld is not yet &quot;tax paid&quot; — the
            credit ties to the final Indian liability for the right year) and rate mismatch (excess Indian tax above
            the US tax on that income doesn&apos;t refund against US wages). Estimate the interaction with the{" "}
            <Link href="/calculators/dtaa-foreign-tax-credit" className="font-semibold text-brand-600 underline underline-offset-2">
              DTAA foreign tax credit calculator
            </Link>
            , and have a cross-border CPA prepare the actual return — this is squarely their territory. Bank-account
            reporting (FBAR/FATCA) also follows the money: sale proceeds sitting in your NRO account count toward those
            thresholds.
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
            The money path: sale proceeds land in your <strong>NRO account</strong>; from there, RBI rules generally
            permit remitting up to <strong>{cfg.repatriationLimitUsd} per financial year</strong> abroad. The bank will
            want the tax paperwork before wiring anything — a chartered accountant&apos;s certificate (Form 15CB) plus
            your own declaration (Form 15CA), confirming Indian tax on the sale was deducted or paid. (The Income-tax
            Act, 2025 renumbered several forms effective April 2026; banks and CAs are transitioning, so don&apos;t be
            surprised to see new form numbers doing the same job — verify the current ones on incometax.gov.in.)
          </>,
          <>
            Practical sequencing: finish the TDS story first (deduction at the certificate rate, or deduction plus a
            plan for the refund), then start the remittance file. Our{" "}
            <Link href="/india-tax-compliance/repatriating-property-sale-proceeds-india-usa" className="font-semibold text-brand-600 underline underline-offset-2">
              guide to repatriating property sale proceeds from India to the USA
            </Link>{" "}
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
            the deductor. As of {NRI_TDS_UPDATED_HUMAN} that means deducting at the correct rate on each payment
            (including installments and advances), depositing it with the government, filing the quarterly TDS return
            for non-resident payments, and issuing the seller a TDS certificate. Historically you also needed a{" "}
            <strong>TAN</strong> (Tax Deduction Account Number) — a genuine nuisance for one-off home buyers — but that
            requirement is scheduled to end on <strong>{cfg.tanRemovalDate}</strong>, after which buyers can deposit
            against their PAN, mirroring the resident-purchase process. Deducting at 1% &quot;like a normal
            purchase&quot; is the classic, expensive mistake: the shortfall, interest, and penalties land on the buyer.
            When the seller presents a lower-deduction certificate, verify it names you and your PAN, and deduct exactly
            the certificate rate.
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

export default function Page() {
  const jsonLd = jsonLdGraph(
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
        hook="An NRI selling property in India faces TDS on the FULL sale price — often 13–15% withheld against a much smaller real tax bill. Here is exactly how the rates work, how the Form 13 lower-TDS certificate fixes it, what the IRS expects, and how the money comes home."
        accent="from-emerald-600 to-teal-700"
        badges={["Rates as of July 2026", "Form 13 step-by-step", "US reporting covered", "Repatriation path"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tds-rates"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              See the TDS rates →
            </a>
            <a
              href="#form-13"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              How to reduce TDS
            </a>
          </div>
        }
        topDisclaimer={<>Educational information only. Not tax or legal advice.</>}
        sourceNote={
          <>
            Reviewed by Deepak Middha, CA · Last updated {NRI_TDS_UPDATED_HUMAN}. Rates verified against
            incometax.gov.in and the Income-tax Act, 2025 transition — official links at the end of this page.
          </>
        }
        disclaimerPoints={[
          "Indian tax rates, surcharge slabs, section numbers, and forms change with Finance Acts — always verify current figures.",
          "A property sale is a high-value transaction: engage a qualified CA in India and a cross-border CPA in the US.",
          "This guide is educational information, not tax, legal, or investment advice.",
        ]}
        disclaimerExtra={<p>{NRI_TDS_DISCLAIMER}</p>}
      >
        {/* Rates table — the core answer, first */}
        <section id="tds-rates" className="scroll-mt-24 pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">TDS on Sale of Property by NRI: Current Rates</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                As of {NRI_TDS_UPDATED_HUMAN}, buyers must deduct about 13–14.95% of the <strong>full sale value</strong>{" "}
                on long-term sales by NRIs (12.5% base + surcharge by sale-value slab + 4% cess), and roughly 31.2–39%
                on short-term sales.
              </p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {[...ltcgTdsRows, stcgRow].map((r) => (
                  <div key={r.saleValue} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.saleValue}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700">Effective TDS: {r.effectiveRate}</p>
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
                      <th className="p-3 font-semibold">Sale value / holding</th>
                      <th className="p-3 font-semibold">Surcharge</th>
                      <th className="p-3 font-semibold">Effective TDS</th>
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
                Long-term = held more than {cfg.ltcgHoldingMonths} months; base LTCG rate {cfg.ltcgBasePct}% (no
                indexation) for transfers on/after July 23, 2024. Deduction happens under {cfg.sectionOld}, now{" "}
                {cfg.sectionNew} for deductions from April 1, 2026. TDS applies to the full sale consideration unless a
                lower-deduction certificate says otherwise. Verify current rates at incometax.gov.in — link at the end
                of this page.
              </p>

              <h3 className="mt-6 text-base font-bold text-ink-900">
                Short-term sale of property by NRI: TDS at slab rates
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Sell within {cfg.ltcgHoldingMonths} months of buying and the gain is short-term: taxed at your slab
                rate, with buyers commonly instructed to deduct at the top {cfg.stcgBasePct}% (plus surcharge and cess)
                to stay safe. Between the higher rate and the full-sale-value base, short-term exits are punishing —
                if you are anywhere near the {cfg.ltcgHoldingMonths}-month line, the closing date is worth negotiating.
              </p>
            </div>
          </Container>
        </section>

        {/* Guide sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              {SECTIONS.slice(0, 2).map((s) => (
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

        {/* Remaining sections */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              {SECTIONS.slice(2).map((s) => (
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
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={nriTdsFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
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
                  desc: "Already over-deducted? How to reclaim it via your Indian return",
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
        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox
              title="Official tax sources"
              intro="Always verify current TDS rates, forms, and remittance rules directly with the official sources:"
              links={nriTdsSourceLinks}
            />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NRI_TDS_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
