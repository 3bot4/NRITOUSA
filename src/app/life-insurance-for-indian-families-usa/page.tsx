import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  QuickAnswer,
  JumpNav,
  ProseSections,
  NextStep,
  WhichLifePageBlock,
  LifeEEATBox,
  LifeClusterNav,
  AgentCTA,
  CalculatorCTA,
  InsuranceProfessionalsBox,
  TrustNoSellNote,
  LifeTopDisclaimer,
} from "@/components/tools/LifeInsuranceUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  lifeInsuranceArticleJsonLd,
  lifeInsuranceAuthorJsonLd,
  lifeMeta,
} from "@/lib/lifeInsuranceCluster";
import {
  lifePillarFaqs,
  lifeInsuranceSourceLinks,
  lifeInsuranceSourceIntro,
  LIFE_SOURCE_HEADING,
  LIFE_BOTTOM_DISCLAIMER,
} from "@/data/lifeInsuranceData";

const PATH = "/life-insurance-for-indian-families-usa";
const META = lifeMeta(PATH);
const TITLE = "Life Insurance for Indian Families in the U.S.: Term, IUL, and Protection Planning";
const META_TITLE = "Life Insurance for Indian Families in the U.S.";
const DESC =
  "An educational hub on life insurance for Indian and NRI families in the U.S.: why coverage matters after immigrating, common H-1B and green-card protection gaps, term vs permanent insurance, where IUL fits, employer-coverage limits, and every guide in the cluster.";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why it matters here", href: "#why-it-matters" },
  { label: "Protection gaps", href: "#protection-gaps" },
  { label: "How much coverage", href: "#coverage-sizing" },
  { label: "Types of coverage", href: "#coverage-types" },
  { label: "Explore the cluster", href: "#explore" },
  { label: "FAQ", href: "#faq" },
];

const WHY_SECTIONS = [
  {
    h: "Your family's safety net changed when you immigrated",
    body: (
      <p>
        In India, an extended family often absorbs a financial shock — parents, siblings, and property can cushion a
        loss. In the U.S., most immigrant households run on one or two paychecks with no local family backup. If an
        earner dies, the rent or mortgage, childcare, and daily costs continue in dollars, immediately.
      </p>
    ),
  },
  {
    h: "The obligations are bigger, and they are in dollars",
    body: (
      <p>
        A U.S. mortgage, American childcare and college costs, car loans, and support sent to parents in India add up to
        commitments that can easily exceed a decade of income. Savings built over a few U.S. years rarely cover that,
        which is why income replacement — not investment — is the first job of life insurance.
      </p>
    ),
  },
  {
    h: "Families delay it for understandable reasons",
    body: (
      <p>
        Many Indian families prioritize saving aggressively, buying a home, and investing — and treat life insurance as
        &ldquo;later.&rdquo; But coverage is cheapest and easiest to qualify for when you are young and healthy, and it
        becomes expensive or unavailable after a diagnosis. Waiting is itself a risk.
      </p>
    ),
  },
  {
    h: "LIC policies back home usually don't close the gap",
    body: (
      <p>
        Policies bought in India are often sized for Indian-rupee obligations. A family living on a U.S. income
        typically needs coverage sized to U.S. costs — and payable in a way the surviving family can actually use.
        Reviewing existing India policies is a good agent question, not a reason to skip U.S. planning.
      </p>
    ),
  },
];

const GAP_CARDS = [
  {
    title: "H-1B families",
    gap: "Employer-only coverage that vanishes in a layoff — exactly when the family may also face a 60-day status clock.",
  },
  {
    title: "Single-income households",
    gap: "One paycheck supports the household, but only that earner is insured — and sometimes not even them.",
  },
  {
    title: "New homeowners",
    gap: "A 30-year dollar mortgage with coverage that would pay for only a year or two of payments.",
  },
  {
    title: "Green-card families",
    gap: "Coverage bought years ago on arrival that was never resized as income, kids, and the house grew.",
  },
  {
    title: "Families supporting parents in India",
    gap: "Monthly support to parents that would stop the day the earner dies — with no plan to replace it.",
  },
  {
    title: "Non-working spouses",
    gap: "No coverage on a spouse whose childcare and household work would cost real money to replace.",
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    lifeInsuranceArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: META.published,
      dateModified: META.modified,
    }),
    lifeInsuranceAuthorJsonLd(),
    faqJsonLd(lifePillarFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Wealth", url: "/long-term-nri-wealth" },
      { name: "Life Insurance", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="life-insurance-for-indian-families-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Wealth", href: "/long-term-nri-wealth" },
          { label: "Life Insurance" },
        ]}
        icon="🛡️"
        category="Wealth · Life Insurance"
        title="Life Insurance for Indian Families in the U.S."
        hook="This is the hub for the cluster: why coverage matters after immigrating, the gaps H-1B and NRI families hit, and how term, permanent, IUL, and employer coverage fit together. Use it to get oriented, then go deep on the page you need."
        accent="from-emerald-600 to-brand-600"
        badges={["Educational hub", "Plain English", "No signup", "Agent-ready"]}
        sourceNote={<>Last updated: {META.modifiedHuman}. Educational overview — policy features and costs vary by state, insurer, and contract.</>}
        disclaimerExtra={<p>{LIFE_BOTTOM_DISCLAIMER}</p>}
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <JumpNav items={JUMP} />
          </div>
        </Container>

        <section className="pt-5">
          <Container>
            <LifeTopDisclaimer />
          </Container>
        </section>

        {/* Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Quick Answer: What Should Indian Families Know?"
              answer={
                <p>
                  If anyone depends on your income — a spouse, children, or parents in India — you likely have a life
                  insurance need, and employer coverage alone is usually not enough. For most families, low-cost term
                  insurance sized to real obligations is the first layer; permanent products like IUL are a separate,
                  more complex decision to review only after the basics are in place.
                </p>
              }
              bullets={[
                "Life insurance replaces income; it is protection first, not an investment.",
                "Employer group coverage is typically 1–2× salary and usually ends when the job does.",
                "Term insurance is generally the lowest-cost way to cover working and child-raising years.",
                "IUL is permanent insurance with cash value — it has real costs and risks and is not for everyone.",
                "Support sent to parents in India is an insurable obligation most calculators ignore.",
                "Coverage amounts, costs, and product choices should be reviewed with a state-licensed insurance professional.",
              ]}
              ctaText="Estimate your coverage gap"
              ctaHref="/term-life-insurance-needs-calculator-indian-families"
            />
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

        {/* Why it matters more after moving */}
        <section id="why-it-matters" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="Why life insurance matters more after moving to the U.S." sections={WHY_SECTIONS} />
          </Container>
        </section>

        {/* Protection gaps */}
        <section id="protection-gaps" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Common protection gaps for H-1B, green card, and NRI families
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                These patterns show up again and again in Indian immigrant households. None is a judgment — they are
                simply gaps worth checking against your own situation.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {GAP_CARDS.map((g) => (
                  <div key={g.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{g.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{g.gap}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Job loss makes several gaps worse at once — employer coverage ends while the family also faces
                immigration deadlines. See the{" "}
                <Link href="/h1b-layoff" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  H-1B layoff guide
                </Link>{" "}
                and the{" "}
                <Link
                  href="/return-to-india-checklist"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  return to India checklist
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* How much coverage — short paragraph, points to term guide + calculator */}
        <section id="coverage-sizing" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How much coverage do you need?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Coverage sizing usually starts with income replacement, mortgage or rent, children&rsquo;s education,
                debts, transition expenses, and any India or home-country family obligations. For a detailed breakdown,
                use the{" "}
                <Link
                  href="/term-life-insurance-for-indian-families-usa"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  term insurance guide
                </Link>{" "}
                and the{" "}
                <Link
                  href="/term-life-insurance-needs-calculator-indian-families"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  needs calculator
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* Calculator CTA */}
        <section className="py-10">
          <Container>
            <CalculatorCTA />
          </Container>
        </section>

        {/* Types of coverage — hub overview */}
        <section id="coverage-types" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The building blocks: how the pieces fit</h2>
              <div className="mt-5 space-y-5">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <h3 className="text-base font-bold text-ink-900">1. Term insurance — the first protection layer</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Term insurance pays a death benefit if you die within a set period (commonly 10, 20, or 30 years) and
                    has no cash value, which makes it the lowest-cost way to buy a large amount of protection for the
                    years your family depends on your income. For most families this is where to start. Read the{" "}
                    <Link
                      href="/term-life-insurance-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      term insurance guide
                    </Link>
                    .
                  </p>
                </div>

                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h3 className="text-base font-bold text-ink-900">2. Permanent insurance — an overview</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Whole life, universal life, and indexed universal life are designed to last your whole life and
                    include a cash-value component. They cost meaningfully more than term for the same death benefit, and
                    they add moving parts that need careful review. Permanent coverage solves a different problem —
                    lifelong needs and estate goals — not the core income-replacement problem term is built for.
                  </p>
                </div>

                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h3 className="text-base font-bold text-ink-900">3. Where IUL may fit</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Indexed universal life is heavily marketed to Indian professionals, often as &ldquo;tax-free
                    wealth.&rdquo; The honest version: it is permanent life insurance with a cash-value feature, real
                    costs, and real risks. It is <strong>not</strong> a replacement for a 401(k) or IRA, and it can fit
                    only some families who already have basic protection. Read the plain-English{" "}
                    <Link
                      href="/indexed-universal-life-iul-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      IUL guide
                    </Link>{" "}
                    and the{" "}
                    <Link
                      href="/term-vs-iul-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      term vs IUL comparison
                    </Link>
                    .
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                  <h3 className="text-base font-bold text-ink-900">4. Employer coverage — useful, but limited</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Group life through work is a helpful bonus, but it is usually only 1–2× salary, rarely portable, and
                    typically ends the day the job ends — including in a layoff, exactly when an H-1B family is under the
                    most pressure. Most planning treats employer coverage as a supplement, not the foundation.
                  </p>
                </div>

                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h3 className="text-base font-bold text-ink-900">5. Don&rsquo;t forget disability insurance</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Life insurance only pays if you die — it does nothing if illness or injury stops your income while
                    you are alive, which is statistically more likely during working years. A complete protection plan
                    usually reviews disability insurance alongside life insurance. Raise it with your licensed
                    professional even though it is outside this cluster&rsquo;s scope.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Agent CTA */}
        <section className="py-10">
          <Container>
            <AgentCTA checklistHref="/term-life-insurance-needs-calculator-indian-families" />
          </Container>
        </section>

        {/* Explore the cluster */}
        <section id="explore" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <LifeClusterNav currentHref={PATH} />
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox title={LIFE_SOURCE_HEADING} intro={lifeInsuranceSourceIntro} links={lifeInsuranceSourceLinks} />
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={lifePillarFaqs} />
          </Container>
        </section>

        {/* For insurance professionals + trust note */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <InsuranceProfessionalsBox />
              <TrustNoSellNote />
            </div>
          </Container>
        </section>

        {/* Next steps */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "How much term coverage do you need?", href: "/term-life-insurance-for-indian-families-usa", primary: true },
                { label: "Estimate your gap (calculator)", href: "/term-life-insurance-needs-calculator-indian-families" },
                { label: "Term vs IUL comparison", href: "/term-vs-iul-for-indian-families-usa" },
              ]}
            />
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
