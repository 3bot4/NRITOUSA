import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByTopic } from "@/lib/articles";
import { getCalculator } from "@/lib/calculators";
import {
  absoluteUrl,
  articleUrl,
  breadcrumbJsonLd,
  jsonLdGraph,
  pageMetadata,
} from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/send-money-to-india";
const PAGE_TITLE = "Send Money to India";
const title = "Send Money to India: Costs, TCS & Fees";
const description =
  "Compare India–USA transfer costs, understand TCS on outward remittances, and avoid hidden exchange-rate fees — with a true-cost calculator and guides.";

export const metadata: Metadata = pageMetadata({
  title: title,
  description: description,
  path: PATH,
});

export default function SendMoneyToIndiaPage() {
  const remittance = getCalculator("remittance-tcs-cost");
  const guides = getArticlesByTopic("money-transfer");

  const jsonLd = jsonLdGraph(
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(PATH)}#collection`,
      name: title,
      description,
      url: absoluteUrl(PATH),
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...(remittance
            ? [
                {
                  url: absoluteUrl(`/calculators/${remittance.slug}`),
                  name: remittance.title,
                },
              ]
            : []),
          ...guides.map((a) => ({ url: articleUrl(a.slug), name: a.title })),
        ].map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: item.url,
          name: item.name,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: PAGE_TITLE, url: PATH },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/5 bg-gradient-to-br from-blue-700 to-teal-600">
        <div className="absolute inset-0 bg-ink-900/40" />
        <Container className="relative py-12 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/80"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{PAGE_TITLE}</span>
          </nav>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
              💸
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Send Money to India
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            Compare transfer costs, understand TCS, and avoid hidden fees.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {remittance && (
              <Link
                href={`/calculators/${remittance.slug}`}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 shadow-sm hover:bg-white/90"
              >
                Estimate your transfer cost
              </Link>
            )}
            <Link
              href="#guides"
              className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Browse all transfer guides
            </Link>
          </div>
        </Container>
      </section>

      {/* Tools — the Remittance & TCS calculator, featured prominently */}
      {remittance && (
        <section className="bg-white py-10 sm:py-12">
          <Container>
            <SectionHeading
              eyebrow="Calculator"
              title="Start with the true cost of your transfer"
              description="Most transfers lose money to the exchange-rate margin, not the upfront fee. See the net amount that actually lands in India after fees, spread, and TCS."
              action={{ label: "All calculators", href: "/calculators" }}
            />
            <Link
              href={`/calculators/${remittance.slug}`}
              className="group block rounded-2xl border border-ink-900/5 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${remittance.accent} text-2xl shadow-sm`}
                  >
                    {remittance.icon}
                  </span>
                  <div>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
                      Featured calculator
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink-900 group-hover:text-brand-600">
                      {remittance.label}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-500">
                      {remittance.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-700">
                  Open calculator <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* Orientation — what the remittance apps never tell you */}
      <section className="bg-white py-10 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <SectionHeading
                eyebrow="Start here"
                title="The cost of a transfer is the easy part"
                description="Comparison sites answer one question: which app has the best rate today. The questions that actually cost NRIs money are which direction the money is moving, which account it lands in, and who is receiving it. None of those appear on a rate table."
              />
            </div>

            {/* direction */}
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                1. Which direction is the money going?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Nearly every tax question about India&ndash;US transfers has a
                different answer depending on direction, and conflating the two is
                the single most common mistake. India&rsquo;s TCS, for instance,
                belongs to money <em>leaving</em> India under the Liberalised
                Remittance Scheme — it is not something that applies when you send
                dollars home from Ohio.
              </p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10 bg-slate-50/80 text-xs uppercase tracking-wide text-ink-500">
                      <th className="px-4 py-2.5">Direction</th>
                      <th className="px-4 py-2.5">What bites</th>
                      <th className="px-4 py-2.5">Go deeper</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ink-900/5">
                      <td className="px-4 py-3 font-medium text-ink-800">USA → India</td>
                      <td className="px-4 py-3 text-ink-600">
                        No Indian tax on the transfer itself. The exchange-rate
                        margin is your real cost, and a US federal excise now
                        applies to certain remittance transfers depending on how
                        they are funded.
                      </td>
                      <td className="px-4 py-3">
                        <Link href="/articles/cheapest-way-send-money-usa-india" className="font-semibold text-brand-600 underline">
                          True cost
                        </Link>
                        {" · "}
                        <Link href="/articles/us-1-percent-remittance-fee" className="font-semibold text-brand-600 underline">
                          US 1% fee
                        </Link>
                      </td>
                    </tr>
                    <tr className="border-b border-ink-900/5">
                      <td className="px-4 py-3 font-medium text-ink-800">India → USA</td>
                      <td className="px-4 py-3 text-ink-600">
                        This is the harder direction. TCS and the LRS annual cap
                        apply to residents remitting abroad. For an NRO account,
                        current income is generally freely remittable after tax,
                        while balances and other eligible assets use the USD1
                        million per financial year facility. Forms 15CA/15CB are
                        transaction-dependent under Rule 37BB — a chartered
                        accountant&rsquo;s certificate on Form 15CB is not needed
                        for every remittance.
                      </td>
                      <td className="px-4 py-3">
                        <Link href="/articles/tcs-india-remittance-tax" className="font-semibold text-brand-600 underline">
                          TCS
                        </Link>
                        {" · "}
                        <Link href="/tools/form-15ca-15cb-checklist" className="font-semibold text-brand-600 underline">
                          15CA/15CB
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink-800">Property or inheritance proceeds</td>
                      <td className="px-4 py-3 text-ink-600">
                        Its own regime: TDS withheld by the buyer, proceeds paid
                        into an NRO account, then the USD1 million per financial
                        year remittance-of-assets facility and any certification
                        Rule 37BB requires.
                      </td>
                      <td className="px-4 py-3">
                        <Link href="/nri-selling-property-in-india-tds" className="font-semibold text-brand-600 underline">
                          Property TDS
                        </Link>
                        {" · "}
                        <Link href="/articles/repatriate-india-property-sale-usa" className="font-semibold text-brand-600 underline">
                          Repatriation
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* account */}
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                2. Which account does it land in? This one is a door that shuts
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                A transfer app will happily send money to any Indian account you
                name, and it will never mention that the choice decides whether you
                can get that money back out again. Funds in an{" "}
                <strong>NRE</strong> account are freely repatriable — they can
                return to the US without a cap or a certificate. Funds in an{" "}
                <strong>NRO</strong> account follow two different rules. Current
                income such as rent, dividends, interest and pension is generally
                freely remittable after applicable Indian taxes. NRO balances,
                sale proceeds and other eligible assets generally fall within the
                USD1 million per financial year remittance-of-assets facility.
                Forms 15CA/15CB are transaction-dependent under Rule 37BB; both
                forms are not required for every remittance.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">Money you may want back</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Savings, a house deposit you might not use, money parked for
                    rates — send it to an NRE account. You are paying nothing for
                    the option to reverse the decision.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">Money that is being spent in India</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Family support, bills, a loan repayment, an India-sourced
                    obligation — NRO is the right home. Just do not let long-term
                    savings accumulate there by default.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                The trap is drift rather than a decision: years of transfers into
                the account that happened to be convenient, and then a repatriation
                problem when priorities change.{" "}
                <Link href="/articles/nre-nro-accounts-explained" className="font-semibold text-brand-600 underline">
                  How NRE and NRO actually differ →
                </Link>
              </p>
            </div>

            {/* recipient */}
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                3. Who is receiving it? That decides whether it is their income
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Sending money to <em>your own</em> Indian account is not income and
                not a gift — it is your money moving. Sending it to somebody else
                is a gift, and India taxes gifts in the recipient&rsquo;s hands
                under the Income Tax Act rather than the sender&rsquo;s.
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
                <li>
                  <strong className="text-ink-900">To yourself:</strong> not
                  taxable in India. Note the US-side consequence instead — funding
                  your own Indian accounts is what creates FBAR and FATCA reporting
                  obligations once the balances cross the thresholds.{" "}
                  <Link href="/tools/fbar-fatca-checker" className="font-semibold text-brand-600 underline">
                    Check whether you have to report
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-ink-900">To a &ldquo;relative&rdquo;:</strong>{" "}
                  exempt in the recipient&rsquo;s hands, with no ceiling. But the
                  Act defines the term, and it is narrower than family
                  feeling — parents, children, siblings, spouse and certain lineal
                  and in-law relations are in; cousins, for instance, are not.
                </li>
                <li>
                  <strong className="text-ink-900">To anyone else:</strong> the
                  ₹50,000-a-year figure is a <strong>threshold, not an
                  allowance</strong>. Stay at or below it across the year and
                  nothing is taxable; cross it and the <em>entire</em> aggregate
                  becomes taxable to the recipient as income from other sources at
                  their slab rate — not merely the excess. Sending a friend
                  ₹60,000 makes all ₹60,000 taxable for them, not ₹10,000.
                </li>
              </ul>
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-sm leading-relaxed text-ink-600">
                On the US side, a transfer to another person is a gift for US gift
                tax purposes too, and gifts above the annual per-recipient
                exclusion have to be reported on Form 709 even when no tax is
                owed — the lifetime exemption usually absorbs it. Two systems, two
                sets of paperwork, and they do not talk to each other.{" "}
                <Link href="/tools/form-3520-india-gift-checker" className="font-semibold text-brand-600 underline">
                  Gifts coming the other way →
                </Link>
              </div>
            </div>

            {/* checklist */}
            <div className="rounded-2xl border border-ink-900/10 bg-slate-50/60 p-6">
              <h2 className="text-lg font-bold text-ink-900">Before you press send</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
                <li>
                  → Compare the <strong>amount that lands</strong>, not the fee. A
                  &ldquo;zero fee&rdquo; quote with a 1.5% rate margin costs $15 per
                  $1,000.
                </li>
                <li>
                  → Check <strong>how you are funding it</strong>. The funding
                  method, not the destination, is what determines whether the US
                  remittance excise applies.
                </li>
                <li>
                  → Confirm the <strong>account type</strong> at the receiving end,
                  and that the name matches exactly — mismatches are the usual
                  cause of a held or returned transfer.
                </li>
                <li>
                  → For anything large or recurring, keep the{" "}
                  <strong>paper trail</strong>: transfer confirmations and bank
                  statements are what answer a question years later, in either
                  country.
                </li>
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-ink-500">
              Thresholds, rates and reporting limits in this section change with
              each budget and tax year. The linked guides carry the current
              figures and their sources; this page is the map, not the numbers.
            </p>
          </div>
        </Container>
      </section>

      {/* Guides — the money-transfer topic articles */}
      <section id="guides" className="scroll-mt-20 bg-slate-50/60 py-10 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Guides"
            title="Sending money, explained"
            description="The cheapest services, the exchange-rate spread, NRE/NRO accounts, TCS, and how to move money tax-smart in both directions."
          />
          {guides.length > 0 && (
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {guides.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="dense" />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="bg-white pb-16">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-slate-50/60 p-6 text-sm leading-relaxed text-ink-500">
            <strong className="font-semibold text-ink-700">Disclaimer:</strong>{" "}
            Content on {site.name} is for educational purposes only and is not
            financial, legal, tax, immigration, or investment advice. {site.name}{" "}
            is owned by {site.owner}. Transfer fees, exchange rates, and TCS
            rules differ between providers and change over time. Please confirm
            current costs with your provider and consult a qualified
            professional for your situation. See our{" "}
            <Link href="/disclaimer" className="text-brand-600 underline">
              full disclaimer
            </Link>
            .
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
