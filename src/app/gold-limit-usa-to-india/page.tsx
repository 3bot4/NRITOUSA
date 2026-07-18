import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
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
  goldDutyRateRows,
  goldCustomsSourceLinks,
  GOLD_DISCLAIMER,
} from "@/data/goldCustomsData";

const PATH = "/gold-limit-usa-to-india";
const TITLE = "How Much Gold Can I Carry From USA to India? (2026 Limits)";
const DESC =
  "Duty-free gold limits for men, women & children flying USA to India, customs duty rates, declaration rules, and a free duty calculator. Updated 2026.";

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
            weight-based answer since February 2026. The duty-free allowance applies to{" "}
            <strong>gold jewellery only</strong>, and only if you have lived outside
            India for <strong>more than one year</strong>. As of the Baggage Rules 2026 (in force since February 2,
            2026), a woman returning to India can carry up to <strong>40 grams</strong> of gold jewellery duty-free, and
            every other passenger up to <strong>20 grams</strong>. These are weight-only limits — the older rule that
            also capped the value at ₹1,00,000 and ₹50,000 respectively was dropped when the 2026 rules replaced the
            Baggage Rules 2016, which matters at today&apos;s gold prices where even 20 grams is worth far more than the
            old rupee caps ever allowed.
          </>,
          <>
            Three conditions trip people up. First, the allowance is personal: it attaches to the passenger, not the
            family (more on that below). Second, it covers ornaments you are genuinely bringing as personal effects —
            wearing twelve bangles fresh from a US dealer with receipts in the bag can still draw questions, because the
            officer assesses whether it is bona fide personal jewellery. Third, the one-year-abroad condition is about
            your stay, not your visa type — a green card holder visiting India after eight months abroad does not
            qualify, while an H-1B family returning after three years does. When any condition fails, the full weight is
            dutiable, typically at the concessional rate if you still meet the six-month test.
          </>,
        ],
      },
      {
        h3: "How Much Gold Can I Take to India From USA?",
        paras: [
          <>
            &quot;How much gold I can take to India from USA&quot; is the other phrasing of the same question, and the
            answer counts both the duty-free and the duty-paid routes: an eligible passenger — an Indian passport holder or
            person of Indian origin returning after at least six months abroad — can take up to <strong>1 kilogram</strong>{" "}
            of gold in total (jewellery plus coins or bars) by paying customs duty on everything beyond the jewellery
            allowance, per Notification No. 45/2025-Customs (October 24, 2025). The duty on that concessional route must
            be paid in convertible foreign currency — dollars, not rupees. Whether the gold travels on your person, in
            hand baggage, or in checked baggage does not change the customs math, though checked baggage is a poor place
            for gold: airline liability for valuables is limited and recovery after theft is rare.
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
            As of {GOLD_UPDATED_HUMAN}, gold beyond your duty-free allowance is charged at roughly{" "}
            <strong>{cfg.concessionalRatePct}%</strong> if you qualify as an eligible passenger (at least{" "}
            {cfg.minMonthsAbroadForConcession} months abroad, up to 1 kg, duty paid in foreign currency), and at the
            standard baggage rate of roughly <strong>{cfg.standardRatePct}%</strong> if you do not. The concessional
            rate comes from Notification No. 45/2025-Customs, which consolidated the old notification 50/2017 regime;
            rates like these change by notification, so treat every figure here as &quot;as of the latest CBIC
            notification we verified&quot; and confirm before a high-value trip.
          </>,
          <>
            One valuation detail worth knowing: customs does not assess duty on what you paid your US jeweller. Officers
            use CBIC-notified tariff values and exchange rates, updated periodically, so the assessed value can differ
            from your receipt in either direction. Our calculator above uses your own USD estimate for simplicity and
            says so — treat its output as a planning number, not the officer&apos;s number.
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
            penalties. If you are moving serious bullion as part of relocating wealth to or from India, plan it as a
            financial transaction, not a suitcase decision — our{" "}
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
            <strong> Coins, bars, and biscuits get no duty-free allowance at all</strong> — not one gram. The 40 g / 20
            g allowance in the Baggage Rules 2026 is explicitly for ornaments; gold in any other form is excluded. So a
            passenger carrying a single 24-karat 50 g bar owes duty on all 50 grams, even after five years in the US,
            while the same passenger could wear 20–40 g of jewellery duty-free.
          </>,
          <>
            Bullion is still allowed — it just always pays. Within the 1 kg cap, an eligible passenger pays the
            concessional rate (≈{cfg.concessionalRatePct}% as of {GOLD_UPDATED_HUMAN}) on coins and bars, declared at
            the Red Channel, duty settled in foreign currency. American Gold Eagles, Canadian Maple Leafs, and
            branded bars from US dealers are all treated as bullion — the mint or brand does not matter, the form does.
            If your plan is to convert US savings into family gold, run the numbers first: after duty, making the
            purchase in India is often comparable, without the airport risk. For context on moving the money instead,
            see{" "}
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
            The real question is never how much gold you can bring to India — it is how much of it you declared. The
            Green Channel is for passengers with nothing dutiable: personal jewellery within your allowance can
            walk through. The <strong>Red Channel is mandatory</strong> the moment you carry anything beyond the
            allowance — extra jewellery, any coins or bars, or gold you intend to pay duty on. The Baggage Rules 2026
            also introduced an electronic baggage declaration (Form CBD-I): if you answer yes to carrying dutiable
            goods, you report to the Red Channel and the declaration follows you there.
          </>,
          <>
            Walking the Green Channel with undeclared excess gold is the single most expensive mistake on this page. It
            converts a ~{cfg.concessionalRatePct}% duty bill into potential seizure of the gold, a penalty, and in
            serious cases prosecution — customs treats it as smuggling, not a paperwork slip. If you are unsure which
            side of the line you are on, declare. The officer can only charge you duty for gold you declared; the
            downside of over-declaring is a few minutes, the downside of under-declaring can be the gold itself.
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
            cannot be pooled.</strong> A couple where the wife carries 40 g and the husband 20 g is fine (each within
            their own allowance, both over a year abroad). The same couple carrying one 60 g necklace in the wife&apos;s
            bag is not — she is 20 g over <em>her</em> allowance, and his unused 20 g cannot cover it. Each traveler&apos;s
            eligibility is also personal: a spouse who joined you in the US eight months ago has no duty-free allowance
            yet, even if you have been abroad a decade.
          </>,
          <>
            Children are a genuine gray zone under the 2026 rules: the earlier Baggage Rules 2016 expressly gave a child
            who had lived abroad over a year the same gender-based allowance, while the 2026 rules speak of passengers
            without carving out children. Families routinely carry small jewellery for kids without issue, but if a
            child&apos;s allowance is load-bearing for your plan, verify with CBIC or declare and ask. And if the family
            trip runs the other direction — parents coming to see you in the States — our{" "}
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
            <strong>purchase receipts</strong> for anything bought in the US (they establish value and provenance);
            an <strong>appraisal or invoice showing weight and purity</strong> for older pieces without receipts; and,
            for jewellery you originally took out of India, an <strong>export certificate</strong> obtained from Indian
            customs at departure — it lets you bring those pieces back without duty or allowance questions on any
            future trip, and it is free to get at the airport before you leave India.
          </>,
          <>
            Two more practical notes. Duty on the concessional route must be paid in convertible foreign currency, so
            land with a working international card or dollars. And if you are carrying gold as part of a permanent move
            back — shipping household goods, closing US accounts, repatriating savings — read the{" "}
            <Link href="/return-to-india" className="font-semibold text-brand-600 underline underline-offset-2">
              Return to India planning hub
            </Link>{" "}
            first; transfer-of-residence rules interact with the gold limits and the rest of your cross-border
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
      name: "Gold Duty Calculator — USA to India",
      description:
        "Free calculator estimating Indian customs duty on gold carried from the USA: duty-free portion, dutiable portion, and estimated duty in ₹ and USD.",
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
        hook="How much gold can I carry from USA to India? As of the Baggage Rules 2026: up to 40 g of duty-free gold jewellery for women and 20 g for other passengers after a year abroad — and up to 1 kg total if you pay duty. Here are the limits, the rates, and a calculator."
        accent="from-amber-500 to-orange-600"
        badges={["Updated for Baggage Rules 2026", "Free duty calculator", "No signup"]}
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
            Reviewed by Deepak Middha, CA · Last updated {GOLD_UPDATED_HUMAN}. Limits and rates verified against CBIC
            notifications (Baggage Rules 2026; Notification No. 45/2025-Customs) — official links at the end of this
            page.
          </>
        }
        disclaimerPoints={[
          "Customs limits, duty rates, and tariff values change by CBIC notification — always verify before travel.",
          "The assessing officer's determination of eligibility, value, and duty is final at the airport.",
          "This page and calculator are educational planning aids, not customs, tax, or legal advice.",
        ]}
        disclaimerExtra={<p>{GOLD_DISCLAIMER}</p>}
      >
        {/* Quick answer + limits table */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Quick Answer: How Much Gold Can I Carry From USA to India?"
              answerLabel="Duty-free gold jewellery (Baggage Rules 2026)"
              answer="40 g women · 20 g other passengers"
              rows={[
                { label: "Woman (1+ year abroad)", value: "40 g jewellery", note: "Weight-only — no ₹ value cap since Feb 2026.", highlight: true },
                { label: "Man (1+ year abroad)", value: "20 g jewellery", note: "Weight-only — no ₹ value cap since Feb 2026." },
                { label: "Coins / bars / biscuits", value: "0 g duty-free", note: "Bullion always pays duty." },
                { label: "Max with duty paid", value: "1 kg per passenger", note: `≈ ${cfg.concessionalRatePct}% duty if 6+ months abroad.` },
              ]}
              badges={["Per person — no pooling", "Jewellery only", "Declare excess at Red Channel"]}
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
              <h2 className="text-xl font-bold text-ink-900">Gold Limits at a Glance</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                As of {GOLD_UPDATED_HUMAN}, the duty-free allowance is 40 g of jewellery for women and 20 g for other
                passengers after more than a year abroad — coins and bars always pay duty.
              </p>

              {/* Mobile cards */}
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

              {/* Table */}
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
            </div>
          </Container>
        </section>

        {/* Calculator */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="sr-only">Gold Duty Calculator (USA to India)</h2>
              <GoldDutyCalculator />
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
                As of {GOLD_UPDATED_HUMAN}, eligible passengers pay about {cfg.concessionalRatePct}% on gold beyond the
                free allowance (up to 1 kg) and everyone else about {cfg.standardRatePct}%.
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
            <OfficialSourceBox
              title="Official customs sources"
              intro="Always verify current gold limits, duty rates, and declaration rules directly with Indian customs:"
              links={goldCustomsSourceLinks}
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
