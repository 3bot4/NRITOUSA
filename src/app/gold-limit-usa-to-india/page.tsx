import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import TrackedSourceBox from "@/components/tools/TrackedSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import GoldDutyCalculator from "@/components/tools/GoldDutyCalculator";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  essentialsArticleJsonLd,
  essentialsSoftwareAppJsonLd,
  otherEssentialsLinks,
  GOLD_PUBLISHED,
  GOLD_UPDATED,
  GOLD_UPDATED_HUMAN,
} from "@/lib/nriEssentialsCluster";
import {
  goldDutyConfig as cfg,
  goldFaqs,
  goldLimitRows,
  goldFormRows,
  goldDutyRateRows,
  goldCustomsSourceLinks,
  goldCustomsSources,
  GOLD_DISCLAIMER,
} from "@/data/goldCustomsData";

const PATH = "/gold-limit-usa-to-india";
const TITLE = "How Much Gold Can I Carry From USA to India? (2026 Limits)";
const DESC =
  "Duty-free jewellery limits for eligible passengers flying USA to India, customs duty rates, declaration rules, and a free duty calculator. Updated 2026.";

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
    id: "without-duty",
    h2: "How Much Gold Can You Carry to India Without Paying Duty?",
    blocks: [
      {
        paras: [
          <>
            &quot;How much gold I can carry to India&quot; — the way most travelers actually type it — has had a
            weight-based answer since February 2026, but the answer belongs only to <strong>eligible passengers</strong>.
            Rule 6 of the Baggage Rules, 2026 allows duty-free clearance of jewellery to{" "}
            <em>&quot;a resident or tourist of Indian origin residing abroad for more than one year, on return to
            India&quot;</em> — up to <strong>40 grams for a female passenger</strong> and up to{" "}
            <strong>20 grams for a passenger other than a female passenger</strong>, carried in bona fide baggage. A
            tourist of foreign origin, or anyone abroad less than a year, does not receive this allowance at all. The
            gold jewellery limit from USA to India is therefore a per-passenger, eligibility-tested allowance — not an
            automatic right of every international traveler.
          </>,
          <>
            Three details matter. First, the rules use the word <strong>jewellery</strong>, defined as articles of
            adornment ordinarily worn by a person, made of gold, silver, platinum or other precious metals, whether
            studded or not — so the allowance is a jewellery allowance, not a blanket gold allowance. Second, the 2026
            rules made the limit weight-only: the old ₹50,000 / ₹1,00,000 value caps from the 2016 rules were not
            carried forward, which matters at today&apos;s prices where 20 grams is worth far more than the old caps
            allowed. Third, the allowance attaches to each passenger individually — your family cannot combine
            allowances, a point the rules make explicitly for free allowances.
          </>,
        ],
      },
      {
        h3: "How Much Gold Can I Take to India From USA?",
        paras: [
          <>
            &quot;How much gold I can take to India from USA&quot; is the other phrasing of the same question, and the
            answer counts both routes: the duty-free jewellery allowance if you qualify, plus up to{" "}
            <strong>1 kilogram of gold in total</strong> for an <strong>eligible passenger</strong> — a person of
            Indian origin or valid Indian passport holder returning after at least six months abroad — on payment of
            duty in convertible foreign currency, under Notification No. 45/2025-Customs (October 24, 2025). Whether
            the gold travels on your person, in hand baggage, or in checked baggage does not change the customs math,
            though checked baggage is a poor place for gold: airline liability for valuables is limited and recovery
            after theft is rare.
          </>,
        ],
      },
    ],
  },
  {
    id: "duty-rates",
    h2: "Duty Rates If You Exceed the Free Allowance",
    blocks: [
      {
        paras: [
          <>
            As of {GOLD_UPDATED_HUMAN}, an eligible passenger pays duty of about <strong>6%</strong> on gold beyond the
            jewellery allowance — made up of <strong>{cfg.concessionalBcdPct}% customs duty</strong> under the
            passenger-gold entries of Notification No. 45/2025-Customs (G.S.R. 781(E), dated October 24, 2025) plus{" "}
            <strong>{cfg.concessionalAidcPct}% Agriculture Infrastructure and Development Cess</strong>. The entries
            cover gold bars bearing a manufacturer&apos;s or refiner&apos;s engraved serial number, gold coins of at
            least 99.5% purity, and gold in other forms including tola bars and ornaments —{" "}
            <em>excluding ornaments studded with stones or pearls</em>. The conditions: Indian origin or a valid Indian
            passport, at least {cfg.minMonthsAbroadForConcession} months abroad, no more than 1 kg, duty paid in
            convertible foreign currency, and declaration on arrival.
          </>,
          <>
            A passenger who does not meet those conditions faces the general baggage/import assessment instead, which
            is <strong>substantially higher</strong> — commonly cited around {cfg.standardRatePctIllustrative}%, though
            we could not tie that figure to a single current official entry, so confirm the applicable rate with
            Customs before you fly. One valuation detail applies either way: customs does not assess duty on what you
            paid your US jeweller. Officers use <strong>CBIC-notified tariff values</strong> and notified exchange
            rates, updated periodically, so the assessed value can differ from your receipt in either direction.
          </>,
        ],
      },
      {
        h3: "Worked example (illustrative figures)",
        paras: [
          <>
            Say an eligible passenger, three years in the US, lands with 100 g of gold jewellery she values at $10,000.
            Rule 6 clears her first 40 g free. The remaining 60 g is dutiable: customs determines its assessable value
            from the notified tariff value for gold on that date — suppose that works out to $6,100 for the 60 g (not
            her $6,000 receipt figure). Duty ≈ $6,100 × ({cfg.concessionalBcdPct}% + {cfg.concessionalAidcPct}%) ≈{" "}
            <strong>$366, paid in dollars at the airport</strong>. Every number after &quot;40 g free&quot; is
            illustrative — the tariff value, exchange rate, and the officer&apos;s classification control the real
            assessment. Our calculator above shows this same formula against your own value estimate.
          </>,
        ],
      },
      {
        h3: "How Much Gold Can Be Taken to India in Total? The 1 kg Cap",
        paras: [
          <>
            The eligible-passenger route is capped at <strong>1 kg of gold per passenger</strong> per arrival. Above
            that, the passenger-baggage route simply is not available — quantities beyond 1 kg belong in commercial
            import channels with their own licensing and duty structure. Travelers occasionally assume they can pay a
            higher duty and carry 2 kg through the airport; in practice the excess risks detention or seizure, plus
            penalties. If you are moving serious bullion as part of relocating wealth, plan it as a financial
            transaction, not a suitcase decision — our{" "}
            <Link href="/nri-selling-property-in-india-tds" className="font-semibold text-brand-600 underline underline-offset-2">
              NRI selling property in India TDS and repatriation guide
            </Link>{" "}
            covers the banking side of moving large sums between the US and India.
          </>,
        ],
      },
    ],
  },
  {
    id: "coins-bars",
    h2: "How Much Gold Can Be Carried From USA to India as Coins, Bars, or Biscuits?",
    blocks: [
      {
        paras: [
          <>
            The rules treat jewellery and bullion very differently, and this is where most surprise duty bills happen.
            <strong> Coins, bars, and biscuits get no duty-free jewellery allowance at all</strong> — not one gram.
            Rule 6 covers jewellery only, and the rules elsewhere exclude &quot;gold or silver in any form other than
            ornaments&quot; from the free-allowance provisions. So a passenger carrying a single 24-karat 50 g bar owes
            duty on all 50 grams, even after five years in the US, while the same passenger could wear 20–40 g of
            jewellery duty-free if eligible.
          </>,
          <>
            Bullion is still allowed — it just always pays. Within the 1 kg cap, an eligible passenger pays the
            concessional ≈{cfg.concessionalRatePct}% on coins and bars, declared at the Red Channel, duty settled in
            foreign currency. For gold coins from USA to India, customs duty treatment turns on purity: coins of at
            least 99.5% gold content sit squarely in the concessional entry. American Gold Eagles (91.7% purity) are
            the classic trap — a US-iconic coin that may fall outside the ≥99.5% coin entry, so ask customs how it will
            be classified before you fly with one. If your plan is to convert US savings into family gold, run the
            numbers first: after duty, buying in India is often comparable, without the airport risk. For context on
            moving the money instead, see{" "}
            <Link href="/send-money-to-india" className="font-semibold text-brand-600 underline underline-offset-2">
              sending money to India from the USA
            </Link>
            .
          </>,
        ],
      },
    ],
  },
  {
    id: "declaration",
    h2: "Declaration at Customs: Red Channel vs Green Channel",
    blocks: [
      {
        paras: [
          <>
            India airport customs gold declaration works on a simple split. The Green Channel is for passengers with
            nothing dutiable: personal jewellery within your allowance can walk through. The{" "}
            <strong>Red Channel is mandatory</strong> the moment you carry anything beyond the allowance — extra
            jewellery, any coins or bars, or gold you intend to pay duty on. The customs baggage declaration (Form
            CBD-I) can be filed electronically before you land, which speeds up the Red Channel conversation.
          </>,
          <>
            And no — <strong>wearing jewellery does not avoid customs duty</strong>. The allowance is measured by
            weight and eligibility, not by whether the gold is on your body or in your bag. Officers at major airports
            see the wear-it-through strategy daily; heavy, clearly-new jewellery walked through the Green Channel is
            exactly what draws secondary screening. Walking the Green Channel with undeclared excess gold converts a
            ~{cfg.concessionalRatePct}% duty bill into potential seizure of the gold, a penalty, and in serious cases
            prosecution — customs treats it as smuggling, not a paperwork slip.
          </>,
        ],
      },
      {
        h3: "What to do at the Red Channel",
        paras: [
          <>
            The process is mundane when you arrive prepared: <strong>(1)</strong> file or complete the customs baggage
            declaration; <strong>(2)</strong> present the gold with your receipts or appraisal; <strong>(3)</strong>{" "}
            the officer weighs it, checks your passport stamps against the residency conditions, and values the gold at
            the CBIC-notified tariff value; <strong>(4)</strong> you pay the assessed duty — in convertible foreign
            currency for the concessional route, so land with a working international card or dollars;{" "}
            <strong>(5)</strong> keep the duty receipt, which is your proof the gold entered India lawfully. The whole
            exchange typically takes minutes, and declaring costs you nothing but the duty you owed anyway.
          </>,
        ],
      },
    ],
  },
  {
    id: "family",
    h2: "Carrying Gold for Family Members: How Much Gold We Can Carry From USA to India",
    blocks: [
      {
        paras: [
          <>
            Families often total up their gold and ask whether &quot;we&quot; are under the limit. Customs does not see
            a family — it sees individual passengers. <strong>Every limit on this page is per person, and allowances
            cannot be pooled</strong> — the Baggage Rules 2026 state expressly that a passenger&apos;s free allowance
            cannot be pooled with another passenger&apos;s. A couple where the wife carries 40 g and the husband 20 g
            is fine (each within their own allowance, both eligible). The same couple carrying one 60 g necklace in the
            wife&apos;s bag is not — she is 20 g over <em>her</em> allowance, and his unused 20 g cannot cover it. Each
            traveler&apos;s eligibility is also personal: a spouse who joined you in the US eight months ago has no
            jewellery allowance yet, even if you have been abroad a decade.
          </>,
          <>
            Children are a genuine gray zone: the 2016 rules expressly gave a child abroad over a year the same
            gender-based allowance, while Rule 6 of the 2026 rules speaks of passengers without a child carve-out.
            Families routinely carry small jewellery for kids without issue, but if a child&apos;s allowance is
            load-bearing for your plan, verify with CBIC or declare and ask. And if the family trip runs the other
            direction — parents coming to see you in the States — our{" "}
            <Link href="/invitation-letter-for-parents-to-visit-usa" className="font-semibold text-brand-600 underline underline-offset-2">
              invitation letter for parents to visit USA generator
            </Link>{" "}
            handles the B-2 paperwork side.
          </>,
        ],
      },
    ],
  },
  {
    id: "documents",
    h2: "Documents to Carry When Bringing Gold to India",
    blocks: [
      {
        paras: [
          <>
            Paperwork turns customs conversations from adversarial to administrative. Carry:{" "}
            <strong>purchase receipts</strong> for anything bought in the US (they establish provenance and support
            your value estimate, even though assessment uses tariff values); an{" "}
            <strong>appraisal or invoice showing weight and purity</strong> for older pieces without receipts; and
            proof of your stay abroad if your eligibility might be questioned (visa stamps and boarding passes usually
            suffice).
          </>,
        ],
      },
      {
        h3: "Carrying old jewellery to India — get an export certificate first",
        paras: [
          <>
            For jewellery you originally took <em>out</em> of India, Rule 4 of the Baggage Rules 2026 gives a cleaner
            route than the allowance: articles declared to customs at departure re-enter free of duty, subject to the
            officer matching them to your declaration. That departure declaration — commonly issued as an{" "}
            <strong>export certificate</strong> — is free, takes minutes at the airport before an international flight
            out of India, and permanently removes those pieces from every future allowance calculation. If your family
            regularly travels with heirloom jewellery, it is the single most useful piece of paper you can hold. If you
            are carrying gold as part of a permanent move back, read the{" "}
            <Link href="/return-to-india" className="font-semibold text-brand-600 underline underline-offset-2">
              Return to India planning hub
            </Link>{" "}
            first — transfer-of-residence rules interact with the gold limits and the rest of your cross-border
            checklist.
          </>,
        ],
      },
    ],
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    essentialsSoftwareAppJsonLd({
      path: PATH,
      name: "India Gold Customs Duty Calculator — USA to India",
      description:
        "Free calculator estimating Indian customs duty on gold carried from the USA: duty-free jewellery portion, dutiable portion, the duty formula, and estimated duty in ₹ and USD.",
      applicationCategory: "FinanceApplication",
    }),
    essentialsArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: GOLD_PUBLISHED,
      dateModified: GOLD_UPDATED,
    }),
    faqJsonLd(goldFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Gold Limit USA to India", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="gold-limit-usa-to-india"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gold Limit USA to India" }]}
        icon="🪙"
        category="Travel & Customs"
        title="How Much Gold Can You Carry From USA to India? Duty-Free Limits & Customs Rules (2026)"
        hook="How much gold can I carry from USA to India? Under the Baggage Rules 2026: an eligible passenger of Indian origin returning after more than a year abroad gets a duty-free jewellery allowance — 40 g for a female passenger, 20 g for another passenger — and eligible passengers can bring up to 1 kg by paying duty. Here are the exact rules, the rates, and a calculator."
        accent="from-amber-500 to-orange-600"
        badges={["Verified against Baggage Rules 2026", "Free duty calculator", "No signup"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#gold-duty-calculator"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700"
            >
              Calculate my duty →
            </a>
            <a
              href="#gold-limits-table"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
            >
              See the limits table
            </a>
          </div>
        }
        topDisclaimer={<>Educational estimate only. Not tax, legal, or customs advice.</>}
        sourceNote={
          <>
            Reviewed by Deepak Middha, CA · Last updated {GOLD_UPDATED_HUMAN}. Verified against the Baggage Rules 2026
            gazette text and Notification No. 45/2025-Customs — official links at the end of this page.
          </>
        }
        disclaimerPoints={[
          "Customs limits, duty rates, and tariff values change by CBIC notification — always verify before travel.",
          "The assessing officer's determination of eligibility, value, and duty is final at the airport.",
          "This page and calculator are educational planning aids, not customs, tax, or legal advice.",
        ]}
        disclaimerExtra={<p>{GOLD_DISCLAIMER}</p>}
      >
        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Quick Answer: How Much Gold Can I Carry From USA to India?"
              answerLabel="Duty-free jewellery — eligible passengers only (Rule 6, Baggage Rules 2026)"
              answer="40 g female · 20 g other eligible passenger"
              rows={[
                { label: "Eligible female passenger (Indian origin, 1+ yr abroad)", value: "40 g jewellery", note: "Weight-only — no ₹ value cap since Feb 2026.", highlight: true },
                { label: "Other eligible passenger (Indian origin, 1+ yr abroad)", value: "20 g jewellery", note: "Weight-only — no ₹ value cap since Feb 2026." },
                { label: "Coins / bars / bullion", value: "0 g duty-free", note: "Never covered by the jewellery allowance." },
                { label: "Max with duty paid (eligible passenger)", value: "1 kg per passenger", note: `≈ ${cfg.concessionalRatePct}% duty if 6+ months abroad.` },
              ]}
              badges={["Eligibility-tested — not automatic", "Per passenger — no pooling", "Declare excess at Red Channel"]}
              lastVerified={cfg.lastVerified}
              disclaimer={GOLD_DISCLAIMER}
              ctaText="Estimate my duty"
              ctaHref="#gold-duty-calculator"
              accent="amber"
            />
          </Container>
        </section>

        {/* Limits table */}
        <section id="gold-limits-table" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Gold Limit Per Passenger, India: at a Glance</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                As of {GOLD_UPDATED_HUMAN}, Rule 6 of the Baggage Rules 2026 gives an eligible passenger — a resident
                or tourist of Indian origin, abroad more than one year — a weight-only jewellery allowance; coins and
                bars always pay duty.
              </p>

              <div className="mt-4 space-y-3 sm:hidden">
                {goldLimitRows.map((r) => (
                  <div key={r.traveler} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.traveler}</p>
                    <p className="mt-1 text-xs font-semibold text-amber-700">{r.dutyFree}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                      <span className="font-semibold text-ink-500">Condition:</span> {r.condition}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.notes}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Traveler</th>
                      <th className="p-3 font-semibold">Duty-free allowance</th>
                      <th className="p-3 font-semibold">Condition</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {goldLimitRows.map((r) => (
                      <tr key={r.traveler} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.traveler}</td>
                        <td className="p-3 font-medium text-amber-700">{r.dutyFree}</td>
                        <td className="p-3 text-ink-600">{r.condition}</td>
                        <td className="p-3 text-ink-600">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-ink-500">
                Source: Rule 6 and Rule 2(1)(f), Baggage Rules 2026 —{" "}
                <a
                  href={goldCustomsSources.baggageRules2026Pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-600 underline underline-offset-2"
                >
                  official gazette PDF
                </a>
                . Last verified {GOLD_UPDATED_HUMAN}.
              </p>
            </div>
          </Container>
        </section>

        {/* Calculator */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Gold Duty Calculator (USA to India)</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                An India gold customs duty calculator built directly on the current rules — it applies the Rule 6
                jewellery allowance only where the traveler qualifies, never to coins or bullion, and shows the duty
                formula rather than a bare number.
              </p>
              <div className="mt-4">
                <GoldDutyCalculator />
              </div>
              <div className="mt-4 rounded-xl border border-ink-900/10 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Methodology &amp; assumptions</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">
                  Allowances: Rule 6, Baggage Rules 2026 ({cfg.freeJewelleryGramsFemale} g female /{" "}
                  {cfg.freeJewelleryGramsOther} g other eligible passenger, jewellery only, &gt;1 year abroad).
                  Concessional duty: {cfg.concessionalBcdPct}% (Notification No. 45/2025-Customs passenger-gold
                  entries) + {cfg.concessionalAidcPct}% AIDC, requiring ≥{cfg.minMonthsAbroadForConcession} months
                  abroad and ≤1 kg, duty paid in convertible foreign currency. Non-eligible scenarios use an
                  illustrative {cfg.standardRatePctIllustrative}% standard assessment (confirm with Customs). Duty in ₹
                  converts at an assumed ₹{cfg.approxInrPerUsd}/USD for display. The calculator uses your value
                  estimate — actual assessment uses CBIC-notified tariff values, which this tool does not fetch. Last
                  verified {GOLD_UPDATED_HUMAN}.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Guide sections */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              {SECTIONS.map((s) => (
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

                  {/* Jewellery vs bullion comparison table lives in the coins/bars section */}
                  {s.id === "coins-bars" && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-ink-900">
                        What the jewellery allowance does and doesn&apos;t cover:
                      </p>
                      <div className="mt-3 space-y-3 sm:hidden">
                        {goldFormRows.map((r) => (
                          <div key={r.item} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                            <p className="text-sm font-bold text-ink-900">{r.item}</p>
                            <p className="mt-1 text-xs font-semibold text-amber-700">{r.allowanceApplies}</p>
                            <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.note}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                              <th className="p-3 font-semibold">Item</th>
                              <th className="p-3 font-semibold">Duty-free jewellery allowance applies?</th>
                              <th className="p-3 font-semibold">Declaration / duty note</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-900/5 bg-white">
                            {goldFormRows.map((r) => (
                              <tr key={r.item} className="align-top">
                                <td className="p-3 font-semibold text-ink-900">{r.item}</td>
                                <td className="p-3 font-medium text-amber-700">{r.allowanceApplies}</td>
                                <td className="p-3 text-ink-600">{r.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Duty-rate table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Gold Duty Rates: USA to India</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                As of {GOLD_UPDATED_HUMAN}, eligible passengers pay {cfg.concessionalBcdPct}% duty +{" "}
                {cfg.concessionalAidcPct}% AIDC ≈ {cfg.concessionalRatePct}% on gold beyond the free allowance (up to 1
                kg); everyone else faces the general baggage assessment, which is substantially higher.
              </p>
              <div className="mt-4 space-y-3 sm:hidden">
                {goldDutyRateRows.map((r) => (
                  <div key={r.scenario} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.scenario}</p>
                    <p className="mt-1 text-xs font-semibold text-amber-700">{r.rate}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{r.conditions}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Scenario</th>
                      <th className="p-3 font-semibold">Duty rate</th>
                      <th className="p-3 font-semibold">Conditions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {goldDutyRateRows.map((r) => (
                      <tr key={r.scenario} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.scenario}</td>
                        <td className="p-3 font-medium text-amber-700">{r.rate}</td>
                        <td className="p-3 text-ink-600">{r.conditions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verify before your flight */}
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <p className="text-sm font-bold text-ink-900">✈️ Verify before your flight</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                  This page was last verified against official sources on <strong>{GOLD_UPDATED_HUMAN}</strong>.
                  Customs notifications change with budgets and mid-year amendments. In the week before you travel,
                  re-check: (1) the jewellery allowance in the Baggage Rules, (2) the concessional passenger-gold rate
                  and its conditions, and (3) the current tariff value for gold — all via the official links at the end
                  of this page. Two minutes of checking beats an airport dispute.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16">
          <Container>
            <ToolFaq items={goldFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related US–India money & travel guides"
              links={[
                ...otherEssentialsLinks(PATH),
                { href: "/return-to-india", label: "Return to India Planning Hub", desc: "The full playbook for moving assets and family back" },
                { href: "/send-money-to-india", label: "Send Money to India", desc: "Transfers, limits, and tax reporting between the US and India" },
              ]}
            />
          </Container>
        </section>

        {/* Official sources — external links live here, at the end */}
        <section className="py-10 sm:py-12">
          <Container>
            <TrackedSourceBox
              title="Official customs sources"
              intro="Always verify current gold limits, duty rates, tariff values, and declaration rules directly with Indian customs:"
              links={goldCustomsSourceLinks}
              eventName="customs_source_clicked"
              toolSlug="gold-limit-usa-to-india"
            />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={GOLD_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
