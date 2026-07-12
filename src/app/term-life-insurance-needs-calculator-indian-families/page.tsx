import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import TermLifeNeedsCalculator from "@/components/tools/TermLifeNeedsCalculator";
import {
  ProseSections,
  WarnBox,
  NextStep,
  WhichLifePageBlock,
  LifeEEATBox,
  LifeClusterNav,
  LifeTopDisclaimer,
  TrustNoSellNote,
} from "@/components/tools/LifeInsuranceUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  lifeInsuranceArticleJsonLd,
  lifeInsuranceAuthorJsonLd,
  lifeInsuranceWebAppJsonLd,
  lifeMeta,
} from "@/lib/lifeInsuranceCluster";
import {
  lifeCalcFaqs,
  lifeInsuranceSourceLinks,
  lifeInsuranceSourceIntro,
  LIFE_SOURCE_HEADING,
  LIFE_BOTTOM_DISCLAIMER,
} from "@/data/lifeInsuranceData";

const PATH = "/term-life-insurance-needs-calculator-indian-families";
const META = lifeMeta(PATH);
const TITLE = "Term Life Insurance Needs Calculator for Indian Families in the U.S.";
const META_TITLE = "Term Life Insurance Needs Calculator for Indian Families";
const DESC =
  "Educational calculator to estimate term life insurance needs for Indian and NRI families in the U.S., including income replacement, mortgage, children's education, and India/home-country obligations.";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const WHY_TWO_COUNTRY_SECTIONS = [
  {
    h: "U.S. calculators miss half of an NRI family's balance sheet",
    body: (
      <p>
        A typical American needs calculator counts income, mortgage, and children — and stops. Indian immigrant families
        often carry a second set of obligations: monthly support to parents, a home loan in India, a sibling&apos;s
        education, or medical care back home. If the earner dies, those commitments don&apos;t pause. This calculator
        counts them.
      </p>
    ),
  },
  {
    h: "Income replacement is the anchor",
    body: (
      <p>
        The single biggest number for most families is simply income × years. Ten to fifteen years of income replacement
        is a common educational starting range — enough for a surviving spouse to stabilize, re-plan, and keep the
        children&apos;s life on track. Your years may be fewer or more; that is exactly what the input is for.
      </p>
    ),
  },
  {
    h: "Subtract honestly, not optimistically",
    body: (
      <p>
        The calculator subtracts savings, existing policies, employer coverage, and expected spouse income. Two of those
        deserve skepticism: employer coverage usually vanishes with the job, and a surviving spouse&apos;s income can be
        interrupted by grief, childcare, or — for H-1B/H-4 households — work-authorization limits. When in doubt, enter
        smaller resource numbers; the result gets more conservative, not less.
      </p>
    ),
  },
  {
    h: "The result is a conversation starter, not a verdict",
    body: (
      <p>
        The gap and the 80%–120% range are educational framing for a meeting with a state-licensed insurance
        professional — the person who can actually evaluate your health, state rules, product options, and price. Bring
        the printed result and the agent checklist above to that meeting.
      </p>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    lifeInsuranceWebAppJsonLd({
      path: PATH,
      name: TITLE,
      description: DESC,
    }),
    lifeInsuranceArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: META.published,
      dateModified: META.modified,
    }),
    lifeInsuranceAuthorJsonLd(),
    faqJsonLd(lifeCalcFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Wealth", url: "/long-term-nri-wealth" },
      { name: "Life Insurance", url: "/life-insurance-for-indian-families-usa" },
      { name: "Term Insurance Calculator", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="term-life-insurance-needs-calculator-indian-families"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Wealth", href: "/long-term-nri-wealth" },
          { label: "Life Insurance", href: "/life-insurance-for-indian-families-usa" },
          { label: "Term Insurance Calculator" },
        ]}
        icon="🧮"
        category="Wealth · Life Insurance"
        title="Term Life Insurance Needs Calculator for Indian Families in the U.S."
        hook="Estimate your family's protection gap before speaking with a licensed insurance professional — counting the obligations most U.S. calculators skip: monthly support to parents in India, a home loan back home, and other home-country commitments."
        badges={["Educational estimate", "No signup", "Nothing stored", "Two-country obligations"]}
        sourceNote={<>Last updated: {META.modifiedHuman}. Educational estimate only — no premiums, no product or insurer recommendations.</>}
        disclaimerExtra={<p>{LIFE_BOTTOM_DISCLAIMER}</p>}
      >
        <section className="pt-5">
          <Container>
            <LifeTopDisclaimer />
          </Container>
        </section>

        {/* The calculator, first — tool-first layout */}
        <section className="pt-6">
          <Container>
            <TermLifeNeedsCalculator />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichLifePageBlock currentHref={PATH} />
              <LifeEEATBox lastUpdated={META.modifiedHuman} currentHref={PATH} />
            </div>
          </Container>
        </section>

        {/* Why include both countries */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections
              heading="Why Indian families should count U.S. and India obligations"
              sections={WHY_TWO_COUNTRY_SECTIONS}
            />
          </Container>
        </section>

        {/* How the math works + what it is not */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How the estimate is calculated</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  <strong>Total family need</strong> = income replacement (annual income × years) + mortgage + other
                  U.S. debts + children&apos;s education goal + childcare/spouse transition fund + final expenses +
                  relocation/travel fund + India/home-country support (monthly × 12 × years) + India property debt +
                  other home-country obligations.
                </p>
                <p>
                  <strong>Available resources</strong> = savings and investments your family could use + existing
                  individual life insurance + employer life insurance + expected spouse income support.
                </p>
                <p>
                  <strong>Estimated coverage gap</strong> = total need − available resources (never below zero). The
                  80% / 100% / 120% range simply brackets that gap for discussion.
                </p>
              </div>
              <div className="mt-5">
                <WarnBox title="What this calculator deliberately does not do">
                  <p>
                    It does not quote premiums or prices, recommend a coverage amount, insurer, or product, or
                    illustrate IUL or any cash-value policy. Those decisions belong in a conversation with a
                    state-licensed insurance professional. If you are weighing term against permanent coverage, read{" "}
                    <Link
                      href="/term-vs-iul-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      term vs IUL
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href="/indexed-universal-life-iul-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      plain-English IUL guide
                    </Link>{" "}
                    first.
                  </p>
                </WarnBox>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Two scenarios deserve extra care when you pick the inputs: a possible layoff (see the{" "}
                <Link href="/h1b-layoff" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  H-1B layoff guide
                </Link>{" "}
                — the moment employer coverage disappears) and a future move home (see the{" "}
                <Link
                  href="/return-to-india-checklist"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  return to India checklist
                </Link>
                ). For the broader money picture, the{" "}
                <Link
                  href="/free-immigrant-wealth-guide"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  free Immigrant Wealth Guide
                </Link>{" "}
                covers investing, retirement, and cross-border planning.
              </p>
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox title={LIFE_SOURCE_HEADING} intro={lifeInsuranceSourceIntro} links={lifeInsuranceSourceLinks} />
          </Container>
        </section>

        {/* Cluster nav */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <LifeClusterNav currentHref={PATH} />
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={lifeCalcFaqs} />
          </Container>
        </section>

        {/* Next steps */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Main life insurance guide", href: "/life-insurance-for-indian-families-usa", primary: true },
                { label: "Term life coverage guide", href: "/term-life-insurance-for-indian-families-usa" },
                { label: "Term vs IUL comparison", href: "/term-vs-iul-for-indian-families-usa" },
              ]}
            />
            <div className="mt-4">
              <TrustNoSellNote />
            </div>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={META.modifiedHuman} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
