import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import Newsletter from "@/components/Newsletter";
import {
  QuickAnswer,
  JumpNav,
  QuickAnswers,
  ComparisonTable,
  DataTable,
  Callout,
  WarnBox,
  DecisionFlow,
  ScenarioCards,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { author } from "@/lib/author";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  indiaInvestmentsWebPageJsonLd,
  indiaInvestmentsArticleJsonLd,
  indiaInvestmentsHowToJsonLd,
  relatedGuideLinks,
  relatedTools,
  officialSourceLinks,
  INDIA_INVESTMENTS_PUBLISHED,
  INDIA_INVESTMENTS_UPDATED,
  INDIA_INVESTMENTS_UPDATED_HUMAN,
  INDIA_INVESTMENTS_READING_MINUTES,
  OFFICIAL_SOURCES_REVIEWED,
} from "@/lib/indiaInvestmentsCluster";
import {
  keyTakeaways,
  quickAnswerBullets,
  quickAnswers,
  residentVsNriCols,
  residentVsNriRows,
  nreVsNroCols,
  nreVsNroRows,
  dividendStepCols,
  dividendStepRows,
  capitalGainsCols,
  capitalGainsRows,
  instrumentCols,
  instrumentRows,
  moveToUsCols,
  moveToUsRows,
  keepInIndiaCols,
  keepInIndiaRows,
  decisionFlowNodes,
  caseStudies,
  commonMistakes,
  faqs,
  howToSteps,
  II_DISCLAIMER,
  II_DATA_NOTE,
} from "@/data/indiaInvestmentsData";

const PATH = "/india-investments/should-nris-keep-investments-in-india";
const TITLE =
  "Should NRIs Keep Investments in India? India vs US Tax Guide (2026)";
const H1 =
  "Should NRIs Keep Investments in India? The Complete India vs US Guide";
const DESC =
  "A practical, educational guide for NRIs deciding whether to keep investments in India after moving to the US: stocks, mutual funds (PFIC), FDs, NRE vs NRO, dividend and capital-gains tax, DTAA, the foreign tax credit, FBAR/FATCA, currency risk, and returning to India — with tables, case studies, and 40+ FAQs.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
  type: "article",
  socialTitle:
    "Should NRIs Keep Investments in India? Complete India vs US Tax Guide (2026)",
  socialDescription:
    "Stocks, mutual funds (PFIC), FDs, NRE vs NRO, dividend & capital-gains tax, DTAA, foreign tax credit, FBAR/FATCA, currency, and returning to India — explained for NRIs.",
  openGraph: {
    publishedTime: INDIA_INVESTMENTS_PUBLISHED,
    modifiedTime: INDIA_INVESTMENTS_UPDATED,
    authors: [author.name],
  },
});

/* Section wrappers ---------------------------------------------------------- */
function AltSection({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
      <Container>
        <div className="mx-auto max-w-4xl">{children}</div>
      </Container>
    </section>
  );
}
function PlainSection({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-12">
      <Container>
        <div className="mx-auto max-w-4xl">{children}</div>
      </Container>
    </section>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-base font-bold text-ink-900">{children}</h3>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-[0.95rem]">{children}</p>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-ink-600">{children}</p>;
}
function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-lg border-l-4 border-brand-400 bg-brand-50/50 px-4 py-2.5 text-sm leading-relaxed text-ink-700">
      <strong className="text-ink-900">Bottom line:</strong> {children}
    </p>
  );
}

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Key takeaways", href: "#key-takeaways" },
  { label: "Resident vs NRI", href: "#compare-status" },
  { label: "What changes", href: "#what-changes" },
  { label: "Stocks", href: "#stocks" },
  { label: "Mutual funds", href: "#mutual-funds" },
  { label: "Fixed deposits", href: "#fd" },
  { label: "NRE vs NRO", href: "#nre-nro" },
  { label: "Dividend tax", href: "#dividends" },
  { label: "Capital gains", href: "#capital-gains" },
  { label: "US tax impact", href: "#us-tax" },
  { label: "Move to US?", href: "#move-us" },
  { label: "Keep in India?", href: "#keep-india" },
  { label: "Returning", href: "#returning" },
  { label: "Mistakes", href: "#mistakes" },
  { label: "Case studies", href: "#cases" },
  { label: "Decision tree", href: "#decision-tree" },
  { label: "By instrument", href: "#instruments" },
  { label: "Tools", href: "#tools" },
  { label: "FAQ", href: "#faq" },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    indiaInvestmentsWebPageJsonLd({
      path: PATH,
      name: TITLE,
      description: DESC,
      datePublished: INDIA_INVESTMENTS_PUBLISHED,
      dateModified: INDIA_INVESTMENTS_UPDATED,
    }),
    indiaInvestmentsArticleJsonLd({
      path: PATH,
      headline: H1,
      description: DESC,
      datePublished: INDIA_INVESTMENTS_PUBLISHED,
      dateModified: INDIA_INVESTMENTS_UPDATED,
    }),
    indiaInvestmentsHowToJsonLd({
      path: PATH,
      name: "How to decide whether to keep your investments in India as an NRI",
      description:
        "A six-step framework NRIs can use to decide, asset by asset, whether to keep or move investments in India after settling in the US.",
      steps: howToSteps,
    }),
    faqJsonLd(faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "NRI Wealth", url: "/long-term-nri-wealth" },
      { name: "India Investments", url: "/india-investments/should-nris-keep-investments-in-india" },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="should-nris-keep-investments-in-india"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "NRI Wealth", href: "/long-term-nri-wealth" },
          { label: "India Investments" },
        ]}
        icon="🇮🇳"
        category="NRI Wealth & Tax"
        title={H1}
        hook="Keep them, move them, or a bit of both? A clear, no-hype walk through the tax, currency, reporting, and life-plan trade-offs — asset by asset, for NRIs in the US."
        badges={[
          `${INDIA_INVESTMENTS_READING_MINUTES}-min read`,
          "Updated 2026",
          "Educational, not advice",
          "40+ FAQs",
        ]}
        accent="from-orange-500 to-emerald-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#quick-answer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Read the quick answer →</a>
            <a href="#decision-tree" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Jump to the decision tree</a>
          </div>
        }
        sourceNote={
          <>
            Last updated {INDIA_INVESTMENTS_UPDATED_HUMAN}. Written &amp; reviewed by{" "}
            <Link href="/about-deepak" className="font-medium text-brand-600 underline underline-offset-2">{author.name}</Link>, {author.credentials}. {OFFICIAL_SOURCES_REVIEWED} official sources reviewed.
          </>
        }
        disclaimerExtra={<p>{II_DISCLAIMER}</p>}
      >
        {/* 1 — Quick answer */}
        <section className="pt-6">
          <Container>
            <div id="quick-answer" className="scroll-mt-24">
              <QuickAnswer
                question="Should NRIs keep their investments in India?"
                answer={
                  <>
                    <p>
                      There is no single right answer — and it is rarely all-or-nothing. Whether to keep an investment
                      in India after moving to the US depends on the <strong>type of asset</strong>, your{" "}
                      <strong>US tax situation</strong>, whether you might <strong>return to India</strong>, your{" "}
                      <strong>currency exposure</strong>, your <strong>liquidity needs</strong>, and your{" "}
                      <strong>goals</strong>.
                    </p>
                    <p>
                      In practice, most NRIs keep some India assets (like NRE deposits or direct stocks) and simplify or
                      exit others (like Indian mutual funds, which are usually PFICs for US tax). Decide asset by asset,
                      measure returns in dollars, and get cross-border advice before large moves.
                    </p>
                  </>
                }
                bullets={quickAnswerBullets}
                ctaText="See the decision tree"
                ctaHref="#decision-tree"
              />
            </div>
          </Container>
        </section>

        {/* Sticky jump nav */}
        <div className="mt-8">
          <JumpNav items={JUMP} />
        </div>

        {/* 2 — Key takeaways */}
        <PlainSection id="key-takeaways">
          <H2>Key takeaways</H2>
          <Lead>The ten things that matter most before you keep, move, or restructure anything.</Lead>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white" aria-hidden>
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-700">{t}</p>
              </li>
            ))}
          </ol>
        </PlainSection>

        {/* Snapshot Q&A (People Also Ask) */}
        <AltSection id="snapshot">
          <H2>Fast answers to the questions NRIs ask first</H2>
          <Lead>Short, snippet-style answers — each links to the full section below.</Lead>
          <div className="mt-5">
            <QuickAnswers items={quickAnswers} />
          </div>
        </AltSection>

        {/* Resident vs NRI comparison */}
        <PlainSection id="compare-status">
          <H2>Resident vs NRI: how the same investment is treated differently</H2>
          <Lead>
            The moment you become an NRI, the rules around the assets you already hold change — even if you touch
            nothing. This table shows the shifts that drive the whole decision. Figures are 2026 illustrations that
            depend on your facts.
          </Lead>
          <div className="mt-5">
            <ComparisonTable
              columns={residentVsNriCols}
              rows={residentVsNriRows}
              keyFeatures={["Mutual funds", "Where you are taxed", "Currency risk"]}
            />
          </div>
        </PlainSection>

        {/* SECTION 1 — What changes after becoming an NRI */}
        <AltSection id="what-changes">
          <H2>1. What changes after becoming an NRI?</H2>
          <Lead>
            NRI status is about your residency under Indian tax and FEMA rules, not your citizenship. Once it applies, a
            handful of things must change — and leaving them unchanged is itself a decision, usually the wrong one.
          </Lead>

          <H3>Bank accounts</H3>
          <P>
            Resident savings and current accounts should be re-designated to <strong>NRO</strong> accounts, and you can
            open <strong>NRE</strong> (rupee) and <strong>FCNR</strong> (foreign-currency) accounts for repatriable
            funds. Keeping an ordinary resident account after you become an NRI is non-compliant under FEMA.
          </P>

          <H3>Demat and broking</H3>
          <P>
            A resident demat account should become an <strong>NRI demat</strong>, and investing shifts to the
            repatriable / non-repatriable framework your broker uses (historically the Portfolio Investment Scheme). A
            stale resident demat can be frozen at the worst possible time.
          </P>

          <H3>Mutual funds</H3>
          <P>
            Your existing Indian mutual funds do not disappear, but from a US perspective they are almost always{" "}
            <strong>PFICs</strong> — the single biggest tax complication for NRIs, covered in{" "}
            <a href="#mutual-funds" className="font-semibold text-brand-700 underline underline-offset-2">Section 3</a>.
          </P>

          <H3>Tax status and reporting</H3>
          <P>
            You may now file in two countries, and — as a US person — you are taxed on <strong>worldwide income</strong>.
            Indian accounts also become reportable to the US via{" "}
            <Link href="/articles/fbar-fatca-nri-guide" className="font-semibold text-brand-700 underline underline-offset-2">FBAR and FATCA</Link>.
          </P>

          <Callout kind="crossborder" title="The core shift">
            <p>
              As a resident you were taxed in India only. As a US person you are taxed on your worldwide income, with the
              India–US treaty and the foreign tax credit working to stop you being taxed twice. Every decision below flows
              from that one change.
            </p>
          </Callout>
        </AltSection>

        {/* SECTION 2 — Indian stocks */}
        <PlainSection id="stocks">
          <H2>2. Should you keep your Indian stocks?</H2>
          <Lead>
            Direct Indian shares are one of the simpler things to hold as an NRI, because they avoid the PFIC problem
            that Indian funds create. The real questions are concentration, currency, and whether you need the money in
            dollars.
          </Lead>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Points in favour</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>• No PFIC issue — direct shares are far simpler than funds.</li>
                <li>• Exposure to India&apos;s long-term growth story.</li>
                <li>• Useful if you may return to India or have rupee goals.</li>
                <li>• You control timing of gains for tax planning.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Points against</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>• Dividends and gains are US-taxable as worldwide income.</li>
                <li>• Currency risk — a weaker rupee erodes dollar returns.</li>
                <li>• Single-country concentration if it&apos;s a big share of your wealth.</li>
                <li>• Extra reporting (FBAR/FATCA) and TDS to reconcile.</li>
              </ul>
            </div>
          </div>

          <H3>How the tax works</H3>
          <P>
            <strong>Dividends</strong> face Indian TDS (see{" "}
            <a href="#dividends" className="font-semibold text-brand-700 underline underline-offset-2">Section 6</a>) and are
            US-taxable, usually with a foreign tax credit. <strong>Capital gains</strong> follow India&apos;s equity
            rules and are also reported in the US (see{" "}
            <a href="#capital-gains" className="font-semibold text-brand-700 underline underline-offset-2">Section 7</a>).
          </P>

          <Takeaway>
            Keeping direct Indian stocks can be perfectly reasonable — it is mainly a portfolio-concentration and
            currency question, not a tax trap like mutual funds. Whether it&apos;s right for you depends on how large the
            holding is and your plans.
          </Takeaway>
        </PlainSection>

        {/* SECTION 3 — Mutual funds / PFIC */}
        <AltSection id="mutual-funds">
          <H2>3. Should you keep your Indian mutual funds?</H2>
          <Lead>
            This is where most NRI portfolios get complicated. For a US person, Indian mutual funds are almost always{" "}
            <strong>PFICs</strong> (Passive Foreign Investment Companies), and PFIC rules are punitive by design.
          </Lead>

          <WarnBox title="Why Indian mutual funds are a US-tax headache">
            <p>
              Each Indian fund is generally a PFIC, reported on <strong>Form 8621</strong>. By default (the Section 1291
              regime), gains and certain distributions can be taxed at the highest ordinary rates with an interest charge
              for &quot;deferred&quot; tax. Elections that soften this (QEF or mark-to-market) usually require information
              Indian funds do not provide, so they are often unavailable.
            </p>
            <p>
              Continuing SIPs makes it worse — every monthly purchase is another PFIC lot to track. This is why many NRIs
              pause new SIPs after moving and redirect contributions to US-based funds.
            </p>
          </WarnBox>

          <H3>India-side taxation still applies too</H3>
          <P>
            Separately from the US treatment, India taxes fund gains: equity funds under the equity capital-gains rules,
            and debt funds (bought on or after 1 April 2023) at your slab rate. So a US person can face India tax{" "}
            <em>and</em> PFIC complexity on the same fund.
          </P>

          <H3>When keeping them might still make sense</H3>
          <P>
            If the amounts are small, if you are about to return to India (changing the US-person analysis), or if selling
            now triggers a large avoidable tax event, a careful hold-and-report approach may beat a rushed exit. This is a
            genuinely individual call.
          </P>

          <Callout kind="mistake" title="Never sell in a panic">
            <p>
              Discovering the PFIC problem often prompts an instinct to liquidate everything at once. That can bunch gains
              into a high bracket and, if past Form 8621 filings were missed, make the reporting harder. Get advice on
              sequencing before you act. Read more in our{" "}
              <Link href="/articles/pfic-indian-mutual-funds-trap" className="font-semibold text-brand-700 underline underline-offset-2">PFIC and Indian mutual funds guide</Link>.
            </p>
          </Callout>
        </AltSection>

        {/* SECTION 4 — Fixed deposits */}
        <PlainSection id="fd">
          <H2>4. Should you keep your fixed deposits?</H2>
          <Lead>
            Fixed deposits are simple to hold, but the tax outcome depends entirely on which account they sit in — and
            &quot;tax-free in India&quot; never means tax-free in the US.
          </Lead>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="text-sm font-bold text-ink-900">NRO fixed deposit</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>• Interest fully taxable in India; TDS commonly ~30% + surcharge/cess.</li>
                <li>• Also fully US-taxable, with a foreign tax credit for the Indian tax.</li>
                <li>• Refund possible via an Indian return if over-withheld.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
              <p className="text-sm font-bold text-ink-900">NRE / FCNR fixed deposit</p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>• Interest exempt in India while you are a non-resident.</li>
                <li>• But fully US-taxable — this surprises many NRIs.</li>
                <li>• Freely repatriable; FCNR avoids rupee conversion risk.</li>
              </ul>
            </div>
          </div>

          <P>
            The honest comparison is <strong>after US tax and after currency</strong>: an NRE deposit&apos;s India-side
            exemption is offset by full US taxation, so compare its net yield to US options like a high-yield savings
            account or Treasuries. Our{" "}
            <Link href="/calculators/fcnr-vs-hysa" className="font-semibold text-brand-700 underline underline-offset-2">FCNR vs US high-yield savings calculator</Link>{" "}
            can help you see the difference.
          </P>

          <Takeaway>
            FDs are easy to keep, but for a US person much of the &quot;tax-free&quot; appeal disappears once US tax is
            applied. Judge them on after-US-tax, after-currency yield versus your US alternatives.
          </Takeaway>
        </PlainSection>

        {/* SECTION 5 — NRE vs NRO */}
        <AltSection id="nre-nro">
          <H2>5. NRE vs NRO: which account for which money</H2>
          <Lead>
            These two accounts do different jobs, and most NRIs end up using both. The distinction drives your India
            tax, your repatriation freedom, and your reporting.
          </Lead>
          <div className="mt-5">
            <ComparisonTable
              columns={nreVsNroCols}
              rows={nreVsNroRows}
              keyFeatures={["India tax on interest", "Repatriation"]}
            />
          </div>
          <P>
            For a deeper walk-through, including converting your old resident accounts, see{" "}
            <Link href="/articles/nre-nro-accounts-explained" className="font-semibold text-brand-700 underline underline-offset-2">NRE vs NRO accounts explained</Link>{" "}
            and{" "}
            <Link href="/articles/convert-resident-account-to-nre-nro" className="font-semibold text-brand-700 underline underline-offset-2">converting your Indian bank accounts after moving</Link>.
          </P>
        </AltSection>

        {/* SECTION 6 — Dividend tax */}
        <PlainSection id="dividends">
          <H2>6. Dividend tax: TDS is not your final bill</H2>
          <Lead>
            Dividends are one of the most misunderstood areas for NRIs, because the tax <em>withheld</em> and the tax you
            actually <em>owe</em> are often different numbers. Here is what really happens, step by step.
          </Lead>
          <div className="mt-5">
            <DataTable columns={dividendStepCols} rows={dividendStepRows} keyRows={["3. Treaty (DTAA) rate", "5. Report on US return"]} />
          </div>

          <Callout kind="note" title="TDS vs actual liability">
            <p>
              TDS is a flat amount withheld at source. Your real Indian liability depends on your total Indian income, and
              the treaty may cap the rate — so you may be owed a refund. Claiming it generally means filing an Indian
              return. On the US side, the foreign tax credit prevents the dividend being taxed twice, subject to limits.
            </p>
          </Callout>

          <P>
            Blanket statements like &quot;NRIs pay 20% on dividends&quot; are misleading. The withholding, the treaty
            rate, your India return, and your US foreign tax credit all interact, and the net result depends on your
            income and paperwork (a Tax Residency Certificate and Form 10F to claim the treaty rate).
          </P>
        </PlainSection>

        {/* SECTION 7 — Capital gains */}
        <AltSection id="capital-gains">
          <H2>7. Capital gains: equity, debt, and property</H2>
          <Lead>
            India revised several capital-gains rules in 2024, so old blog figures may be wrong. This table shows the
            2026 framework for the main assets — always confirm current rates for your situation.
          </Lead>
          <div className="mt-5">
            <DataTable columns={capitalGainsCols} rows={capitalGainsRows} keyRows={["Listed equity & equity mutual funds", "Real estate"]} />
          </div>
          <P>
            On property specifically, the buyer must deduct TDS from an NRI seller — frequently far more than the actual
            tax due — which you can address with a lower-deduction certificate or an Indian return. See{" "}
            <Link href="/articles/repatriate-india-property-sale-usa" className="font-semibold text-brand-700 underline underline-offset-2">repatriating an Indian property sale</Link>{" "}
            and the{" "}
            <Link href="/calculators/india-property-capital-gains" className="font-semibold text-brand-700 underline underline-offset-2">India property capital-gains calculator</Link>.
          </P>
          <Callout kind="reminder" title="Currency changes the US gain">
            <p>
              The US measures your gain in dollars. If you bought when the rupee was stronger and sell when it is weaker,
              your dollar gain can differ substantially from your rupee gain — sometimes for the worse. Track your cost
              basis in dollars, not just rupees.
            </p>
          </Callout>
        </AltSection>

        {/* SECTION 8 — US tax impact */}
        <PlainSection id="us-tax">
          <H2>8. How US taxation actually affects the decision</H2>
          <Lead>
            The reason this decision is different for NRIs than for residents is the US tax system. Six ideas explain
            almost everything.
          </Lead>

          <div className="mt-5 grid gap-3">
            {[
              ["Worldwide taxation", "As a US person, you report income from everywhere — India interest, dividends, rent, and gains all appear on your Form 1040, whether or not you bring the money to the US."],
              ["The foreign tax credit (Form 1116)", "Tax you already paid to India can generally offset your US tax on the same income, so you are not taxed twice. There are limits by income category, and not everything qualifies."],
              ["The DTAA", "The India–US treaty allocates taxing rights and caps certain withholding rates. It is claimed with documentation (TRC, Form 10F), not applied automatically."],
              ["FBAR (FinCEN 114)", "If your foreign accounts together top $10,000 at any point in the year, you must file — separate from your tax return, with severe penalties for missing it."],
              ["FATCA / Form 8938", "Above threshold amounts (which depend on filing status and where you live), you also report specified foreign assets with your return. Many NRIs file both FBAR and 8938."],
              ["PFIC / Form 8621", "Indian mutual funds and many pooled products fall under the punitive PFIC regime — the strongest tax reason NRIs restructure their India holdings."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <p className="text-sm font-bold text-ink-900">{h}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{b}</p>
              </div>
            ))}
          </div>

          <Callout kind="crossborder" title="Currency and reporting mechanics">
            <p>
              You convert everything to US dollars using appropriate exchange rates (the IRS publishes yearly averages),
              and currency movements can themselves create gains or losses on foreign-currency principal in some cases.
              Keep clean records reconciling your India and US figures — mismatches are what draw attention.
            </p>
          </Callout>

          <P>
            For the details, see{" "}
            <Link href="/articles/indian-income-us-tax-return" className="font-semibold text-brand-700 underline underline-offset-2">declaring Indian income on a US return</Link>,{" "}
            <Link href="/articles/double-taxation-dtaa-india-usa" className="font-semibold text-brand-700 underline underline-offset-2">the India–US DTAA</Link>, and the{" "}
            <Link href="/calculators/dtaa-foreign-tax-credit" className="font-semibold text-brand-700 underline underline-offset-2">DTAA / foreign tax credit calculator</Link>.
          </P>
        </PlainSection>

        {/* SECTION 9 — When moving to the US makes sense */}
        <AltSection id="move-us">
          <H2>9. When moving investments to the US tends to make sense</H2>
          <Lead>None of these is decisive alone — treat them as a decision matrix, weighed against Section 10.</Lead>
          <div className="mt-5">
            <DataTable columns={moveToUsCols} rows={moveToUsRows} keyRows={["You hold Indian mutual funds as a US person"]} />
          </div>
        </AltSection>

        {/* SECTION 10 — When keeping in India makes sense */}
        <PlainSection id="keep-india">
          <H2>10. When keeping investments in India tends to make sense</H2>
          <Lead>The mirror image — the factors that argue for keeping rupee assets where they are.</Lead>
          <div className="mt-5">
            <DataTable columns={keepInIndiaCols} rows={keepInIndiaRows} keyRows={["You may return to India"]} />
          </div>
        </PlainSection>

        {/* SECTION 11 — Returning to India */}
        <AltSection id="returning">
          <H2>11. What if you return to India later?</H2>
          <Lead>
            Return plans can flip the whole analysis. When your future expenses will be in rupees, currency risk works in
            your favour, and India assets stay useful rather than being something to unwind.
          </Lead>
          <Callout kind="insight" title="The RNOR window">
            <p>
              On returning, many NRIs qualify as <strong>Resident but Not Ordinarily Resident (RNOR)</strong> — typically
              for up to two to three years, based on their recent non-residence history. During RNOR, foreign income is
              generally not taxed in India, creating a valuable window to reorganise foreign assets, realise certain
              gains, or bring money in more efficiently. Map it <em>before</em> you move.
            </p>
          </Callout>
          <P>
            Because the transition touches both tax systems at once, plan it in advance rather than after you land. Our{" "}
            <Link href="/calculators/rnor-tax-residency" className="font-semibold text-brand-700 underline underline-offset-2">RNOR tax-residency calculator</Link>{" "}
            and{" "}
            <Link href="/return-to-india-checklist" className="font-semibold text-brand-700 underline underline-offset-2">return-to-India checklist</Link>{" "}
            walk through the sequence.
          </P>
        </AltSection>

        {/* SECTION 12 — Common mistakes */}
        <PlainSection id="mistakes">
          <H2>12. Common mistakes NRIs make (and how to avoid them)</H2>
          <Lead>Most costly NRI mistakes are avoidable and come from a handful of misunderstandings. Here are the big ones.</Lead>
          <ol className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2.5 rounded-xl border border-ink-900/10 bg-white p-3.5 text-sm text-ink-700 shadow-card">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rose-100 text-[0.625rem] font-bold text-rose-700" aria-hidden>
                  {i + 1}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </PlainSection>

        {/* SECTION 13 — Case studies */}
        <AltSection id="cases">
          <H2>13. Case studies: how the trade-offs play out</H2>
          <Lead>
            Illustrative, not real people — and not recommendations. They show how the same factors combine differently
            depending on someone&apos;s assets and plans.
          </Lead>
          <div className="mt-5">
            <ScenarioCards scenarios={caseStudies} />
          </div>
        </AltSection>

        {/* SECTION 14 — Decision tree */}
        <PlainSection id="decision-tree">
          <H2>14. A simple decision tree</H2>
          <Lead>
            Run each India holding through this, one asset at a time. It points you to the right analysis — it is not a
            verdict on your specific situation.
          </Lead>
          <div className="mt-5">
            <DecisionFlow title="Should I keep this investment in India?" nodes={decisionFlowNodes} />
          </div>
        </PlainSection>

        {/* SECTION 15 — Instrument comparison */}
        <AltSection id="instruments">
          <H2>15. Instrument-by-instrument comparison</H2>
          <Lead>
            A quick reference across the assets NRIs most often hold — from Indian stocks to US Treasuries, PPF, NPS, and
            gold. &quot;Simple to hold&quot; means the US-tax and reporting friction, not the investment quality.
          </Lead>
          <div className="mt-5">
            <DataTable
              columns={instrumentCols}
              rows={instrumentRows}
              keyRows={["Indian equity mutual funds", "US index funds / ETFs"]}
            />
          </div>
        </AltSection>

        {/* HowTo framework */}
        <PlainSection id="framework">
          <H2>A six-step framework to decide</H2>
          <Lead>When you are ready to work through your own portfolio, this is the order that keeps you out of trouble.</Lead>
          <ol className="mt-5 space-y-3">
            {howToSteps.map((s, i) => (
              <li key={s.name} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{s.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-ink-500">{II_DATA_NOTE}</p>
        </PlainSection>

        {/* SECTION 17 — Related tools / calculators */}
        <AltSection id="tools">
          <H2>Calculators &amp; tools to run the numbers</H2>
          <Lead>Free, no-signup tools on this site that help with the specific decisions above.</Lead>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedTools.map((t) => (
              <Link key={t.href} href={t.href} className="group flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-card-hover">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-50 text-xl" aria-hidden>
                  {t.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink-900 group-hover:text-brand-700">{t.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">{t.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </AltSection>

        {/* Newsletter CTA */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-4xl">
              <Newsletter />
            </div>
          </Container>
        </section>

        {/* SECTION 16 — FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faqs} />
          </Container>
        </section>

        {/* SECTION 18 — Related guides */}
        <PlainSection id="guides">
          <H2>Related guides</H2>
          <Lead>Go deeper on the specific topics this pillar links out to.</Lead>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedGuideLinks.map((l) => (
              <Link key={l.href} href={l.href} className="group rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-card-hover">
                <span className="block text-sm font-bold text-ink-900 group-hover:text-brand-700">{l.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">{l.desc}</span>
              </Link>
            ))}
          </div>
        </PlainSection>

        {/* What to do next */}
        <section className="pb-4">
          <Container>
            <NextStep
              heading="What to do next"
              links={[
                { label: "Organize your India & US accounts", href: "/nri-wealth-checkup", primary: true },
                { label: "Check your FBAR / FATCA exposure", href: "/tools/fbar-fatca-checker" },
                { label: "India Tax Compliance Hub", href: "/india-tax-compliance" },
              ]}
            />
          </Container>
        </section>

        {/* E-E-A-T author box */}
        <section className="py-10">
          <Container>
            <div className="mx-auto max-w-4xl rounded-2xl border border-brand-100 bg-brand-50/40 p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600">About the author &amp; how this was reviewed</p>
              <div className="mt-2 flex items-start gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden>
                  DM
                </span>
                <div>
                  <p className="text-base font-bold text-ink-900">
                    {author.name} <span className="text-sm font-medium text-ink-400">· {author.credentials}</span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Deepak is a Chartered Accountant and Series 65 holder who focuses on cross-border tax and money
                    decisions for Indian families in the US — exactly the NRE/NRO, PFIC, DTAA, and return-to-India
                    questions this guide covers. This page was written and reviewed against official IRS, RBI, and Indian
                    Income Tax Department sources, and every figure is framed as a 2026 illustration rather than a promise.
                  </p>
                  <p className="mt-2 text-xs italic text-ink-400">
                    Educational content only — not personalized tax, legal, or investment advice. Rules change and depend
                    on your facts; verify current guidance and consult a qualified cross-border professional for your
                    situation.
                  </p>
                  <Link href="/about-deepak" className="mt-2 inline-block text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                    Read more about {author.name} →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section id="sources" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox
              title="Official & authoritative sources"
              intro="Verify current rules, rates, thresholds, and treaty positions directly with these sources before you act:"
              links={officialSourceLinks}
            />
          </Container>
        </section>

        {/* Author review line */}
        <section className="pb-12 pt-2">
          <Container>
            <AuthorReviewLine lastUpdated={INDIA_INVESTMENTS_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
