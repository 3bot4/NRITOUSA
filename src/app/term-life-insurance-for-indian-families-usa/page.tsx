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
  ChecklistBox,
  ExampleBox,
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
  lifeTermFaqs,
  agentQuestionsGeneral,
  lifeInsuranceSourceLinks,
  lifeInsuranceSourceIntro,
  LIFE_SOURCE_HEADING,
  LIFE_BOTTOM_DISCLAIMER,
} from "@/data/lifeInsuranceData";

const PATH = "/term-life-insurance-for-indian-families-usa";
const META = lifeMeta(PATH);
const TITLE = "Term Life Insurance for Indian Families in the U.S.: How Much Coverage Do You Need?";
const META_TITLE = "Term Life Insurance for Indian Families in the U.S.";
const DESC =
  "How Indian and NRI families in the U.S. can think about term life insurance: who may need it, a plain-English framework for estimating coverage, choosing a 10/20/30-year term, common mistakes, and questions for a state-licensed agent.";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Who needs it", href: "#who-needs-it" },
  { label: "Coverage framework", href: "#coverage-framework" },
  { label: "Term length", href: "#term-length" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "Mistakes", href: "#mistakes" },
  { label: "Agent questions", href: "#agent-questions" },
  { label: "FAQ", href: "#faq" },
];

const WHO_CARDS = [
  {
    title: "Married couples",
    why: "Either partner's death would change the household's finances — both incomes and both contributions count.",
  },
  {
    title: "Families with children",
    why: "Childcare, schooling, and college represent 15–20+ years of committed costs that don't pause for a crisis.",
  },
  {
    title: "Single-income households",
    why: "The most exposed profile: one paycheck carries everything, so its loss is a total income loss.",
  },
  {
    title: "Mortgage holders",
    why: "A U.S. mortgage runs 15–30 years; coverage lets the family keep the home instead of a forced sale.",
  },
  {
    title: "H-1B families",
    why: "Employer coverage disappears in a layoff, and a surviving dependent spouse may face status and work-authorization limits on top of the income loss.",
  },
  {
    title: "Families supporting parents in India",
    why: "Monthly remittances are a real obligation — a policy can keep that support flowing if the earner dies.",
  },
];

const COVERAGE_ROWS = [
  {
    item: "Income replacement",
    how: "A common educational starting point is enough to replace your take-home income for the years your family would need to adjust — often sized around 10–15 years of income, adjusted to your situation.",
  },
  {
    item: "Mortgage or rent",
    how: "The remaining mortgage balance, or enough years of rent for the family to stay stable where they live.",
  },
  {
    item: "Childcare",
    how: "What full-time care would cost until each child is school-aged — especially if the surviving parent works.",
  },
  {
    item: "College planning",
    how: "A target amount per child toward future education costs, sized to your goals rather than a fixed rule.",
  },
  {
    item: "Debts",
    how: "Car loans, personal loans, credit cards, and any family loans that would fall on the survivor.",
  },
  {
    item: "Emergency transition fund",
    how: "A cushion — often several months to a year of expenses — so the family makes no rushed decisions.",
  },
  {
    item: "Support for spouse / parents",
    how: "Ongoing support for a non-working spouse and monthly support sent to parents in India, for as long as you intend it to continue.",
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
    faqJsonLd(lifeTermFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Wealth", url: "/long-term-nri-wealth" },
      { name: "Life Insurance", url: "/life-insurance-for-indian-families-usa" },
      { name: "Term Life Insurance", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="term-life-insurance-for-indian-families-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Wealth", href: "/long-term-nri-wealth" },
          { label: "Life Insurance", href: "/life-insurance-for-indian-families-usa" },
          { label: "Term Life" },
        ]}
        icon="⏳"
        category="Wealth · Life Insurance"
        title="Term Life Insurance for Indian Families in the U.S."
        hook="Term insurance is the workhorse of family protection: a large death benefit, for the years your family depends on your income, at the lowest cost. The hard part is sizing it. Here is a plain-English framework — and the mistakes Indian families most often make."
        accent="from-emerald-600 to-brand-600"
        badges={["Educational guide", "Plain English", "No signup", "Agent-ready questions"]}
        sourceNote={<>Last updated: {META.modifiedHuman}. Costs vary by age, health, state, and insurer — this page quotes no prices.</>}
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

        {/* 1. Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Quick Answer: Term Insurance Is Usually the First Protection Layer"
              answer={
                <p>
                  For most families with dependents, term life insurance is the first policy to review — it buys the
                  most protection per dollar during the years that matter most. Size it to your real obligations
                  (income, housing, children, debts, and family support in two countries), match the term length to how
                  long those obligations last, and treat employer coverage as a bonus, not the plan.
                </p>
              }
              bullets={[
                "Term = pure protection for a set period; no cash value, which keeps it inexpensive.",
                "Size coverage to obligations, not to a round number an ad suggested.",
                "Match term length to kids' independence, the mortgage, and remaining earning years.",
                "Employer group life usually ends with the job — including layoffs.",
                "Both spouses often need coverage, including a non-working spouse.",
                "Exact amounts and products are a conversation for a state-licensed agent.",
              ]}
              ctaText="Jump to the coverage framework"
              ctaHref="#coverage-framework"
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

        {/* 2. Who may need term insurance */}
        <section id="who-needs-it" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Who may need term insurance?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The common thread: someone else would carry a financial burden if you died. If any of these describes
                your household, a coverage review is worth the hour it takes.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {WHO_CARDS.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{c.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{c.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Coverage framework */}
        <section id="coverage-framework" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How to estimate your coverage need</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Add up the seven pieces below, subtract savings and any coverage you already have, and you get a
                starting estimate to pressure-test with a licensed agent. This is an educational framework, not a
                formula that fits every family.
              </p>
              <div className="mt-5 space-y-3">
                {COVERAGE_ROWS.map((r, i) => (
                  <div key={r.item} className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{r.item}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">{r.how}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Calculator CTA */}
        <section className="py-10">
          <Container>
            <CalculatorCTA />
          </Container>
        </section>

        {/* 4. Term length */}
        <section id="term-length" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Choosing a term length: 10, 20, or 30 years</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  The idea is simple: the policy should outlast the need. Three anchors do most of the work — the years
                  until your children are financially independent, the years left on your mortgage, and the earning
                  years left before retirement savings can support your spouse on their own.
                </p>
                <p>
                  A family with a newborn and a new 30-year mortgage usually looks at longer terms; a family whose kids
                  are in high school and whose mortgage is mostly paid may need far less. Some families layer two
                  policies of different lengths so coverage steps down as obligations shrink — an option worth asking an
                  agent to price both ways.
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { t: "10-year", fit: "Shorter remaining needs: older kids, a small mortgage balance, or bridging until savings mature." },
                  { t: "20-year", fit: "The common middle: covers most of the child-raising years and a good part of a mortgage." },
                  { t: "30-year", fit: "Young families: a newborn, a new mortgage, and decades of earning years to protect." },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-brand-700">{x.t}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{x.fit}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Scenarios */}
        <section id="scenarios" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Three example scenarios</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Illustrations of how the framework plays out — generic numbers for education, not quotes, promises, or
                recommendations.
              </p>
              <div className="mt-5 space-y-4">
                <ExampleBox title="Scenario 1: H-1B single-income family, mortgage, two kids">
                  <p>
                    One earner supports a spouse and two young children, with a large mortgage balance and school years
                    ahead. The framework points to a bigger number than most people expect — income replacement for a
                    decade or more, plus the mortgage, childcare, and college goals — often adding up to many multiples
                    of annual income, typically carried on a 20–30 year term.
                  </p>
                  <p>
                    Because the spouse may face work-authorization limits, this family would also ask the agent how the
                    coverage amount should reflect a survivor who cannot immediately replace income.
                  </p>
                </ExampleBox>
                <ExampleBox title="Scenario 2: Dual-income couple, one child">
                  <p>
                    Both incomes matter, so both partners review coverage — sized so that either survivor could keep the
                    household stable: their share of the mortgage or rent, childcare so the survivor can keep working,
                    and a college goal for the child.
                  </p>
                  <p>
                    Dual-income families often underinsure the lower earner or a parent doing most of the childcare;
                    replacing that care has a real cost the framework should include.
                  </p>
                </ExampleBox>
                <ExampleBox title="Scenario 3: New immigrant family, renting, supporting parents in India">
                  <p>
                    No mortgage yet, but real obligations: rent runway for the family, an emergency transition fund, and
                    the monthly support sent to parents in India — which would otherwise stop entirely. The framework
                    sizes coverage to keep both households, in two countries, stable for the years intended.
                  </p>
                  <p>
                    New arrivals are often the healthiest and youngest they will ever be in the U.S. — which is when
                    coverage is easiest to qualify for.
                  </p>
                </ExampleBox>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Mistakes */}
        <section id="mistakes" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Common mistakes</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Relying only on employer insurance — it usually ends the day the job does, including layoffs.",
                  "Buying too little because a round number 'sounded like a lot' in rupees.",
                  "Waiting until a health change makes coverage expensive or unavailable.",
                  "Ignoring spouse coverage — including a non-working spouse whose work has replacement cost.",
                  "Never reviewing beneficiaries after marriage, children, or a move.",
                  "Forgetting the support sent to parents in India when sizing coverage.",
                ].map((m) => (
                  <div key={m} className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                    <span className="mt-0.5 flex-none text-rose-500" aria-hidden>
                      ✕
                    </span>
                    <p className="text-sm leading-relaxed text-ink-700">{m}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                The layoff scenario deserves special attention for H-1B families — see the{" "}
                <Link href="/h1b-layoff" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                  H-1B layoff guide
                </Link>{" "}
                for what happens to benefits and status when a job ends.
              </p>
            </div>
          </Container>
        </section>

        {/* Agent CTA */}
        <section className="py-10">
          <Container>
            <AgentCTA checklistHref="#agent-questions" />
          </Container>
        </section>

        {/* 6. Agent questions */}
        <section id="agent-questions" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Questions to ask an insurance agent</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Use this as your discussion checklist. Ask for the answers that matter — especially about moving abroad
                and conversion options — in writing.
              </p>
              <div className="mt-5">
                <ChecklistBox
                  title="Term insurance discussion checklist"
                  tone="brand"
                  items={[
                    ...agentQuestionsGeneral,
                    "Does this term policy include a conversion option to permanent coverage, and until when?",
                    "Can the policy continue if we later move back to India, and what are the payment rules from abroad?",
                    "Would laddering two policies of different lengths cost less than one large policy?",
                  ]}
                />
              </div>
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

        {/* 7. FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={lifeTermFaqs} />
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
                { label: "Term vs IUL comparison", href: "/term-vs-iul-for-indian-families-usa", primary: true },
                { label: "How IUL works (and its risks)", href: "/indexed-universal-life-iul-for-indian-families-usa" },
                { label: "Main life insurance guide", href: "/life-insurance-for-indian-families-usa" },
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
