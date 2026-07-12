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
  ChecklistBox,
  WarnBox,
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
  lifeIulFaqs,
  agentQuestionsIul,
  lifeInsuranceSourceLinks,
  lifeInsuranceSourceIntro,
  LIFE_SOURCE_HEADING,
  LIFE_BOTTOM_DISCLAIMER,
} from "@/data/lifeInsuranceData";

const PATH = "/indexed-universal-life-iul-for-indian-families-usa";
const META = lifeMeta(PATH);
const TITLE = "Indexed Universal Life Insurance for Indian Families: Benefits, Risks, and Tax Planning";
const META_TITLE = "Indexed Universal Life (IUL) for Indian Families";
const DESC =
  "A plain-English, education-only guide to IUL for Indian and NRI families in the U.S.: how index-linked crediting, caps, floors, and policy charges actually work, what “tax-free” really means, MEC risk, lapse risk, who may consider a review, and who should be cautious.";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "How IUL works", href: "#how-it-works" },
  { label: "Potential benefits", href: "#benefits" },
  { label: "Risks", href: "#risks" },
  { label: "“Tax-free”, really?", href: "#tax-free" },
  { label: "Who may review it", href: "#who-may-review" },
  { label: "Who should be cautious", href: "#be-cautious" },
  { label: "Questions to ask", href: "#iul-questions" },
  { label: "FAQ", href: "#faq" },
];

const HOW_SECTIONS = [
  {
    h: "Death benefit",
    body: (
      <p>
        Like any life insurance, an IUL pays a death benefit to your beneficiaries if the policy is in force when you
        die. This is the core of the product — everything else is secondary to keeping this promise funded.
      </p>
    ),
  },
  {
    h: "Cash value",
    body: (
      <p>
        Part of each premium, after charges, goes into a cash-value account inside the policy. Cash value can grow over
        time, can be borrowed against, and is what keeps the policy alive when charges come due.
      </p>
    ),
  },
  {
    h: "Index-linked crediting",
    body: (
      <p>
        The cash value is credited interest based on the movement of a market index (often the S&amp;P 500) — but your
        money is <strong>not invested in the market</strong>. The insurer applies a crediting formula to index changes,
        typically excluding dividends. You get index-linked interest, not index returns.
      </p>
    ),
  },
  {
    h: "Caps, floors, and participation rates",
    body: (
      <p>
        The formula has limits. A <strong>cap</strong> is the most you can be credited in a period even if the index
        soars. A <strong>floor</strong> (often 0%) is the least, so a market crash credits nothing rather than a loss —
        though charges still come out. A <strong>participation rate</strong> is the share of the index gain you receive.
        Insurers can generally change these over time within contract limits.
      </p>
    ),
  },
  {
    h: "Policy charges",
    body: (
      <p>
        Every month the insurer deducts costs from the cash value: the cost of insurance (which rises with age), premium
        loads, administrative fees, and rider charges. A 0% floor does not mean your cash value cannot fall — charges
        can still push it down in flat years.
      </p>
    ),
  },
  {
    h: "Flexible premiums",
    body: (
      <p>
        &ldquo;Flexible premium&rdquo; means you choose how much to pay within limits — it does not mean payment is
        optional. Pay too little for too long and charges drain the cash value until the policy lapses. Pay too much too
        fast and the policy can become a MEC, changing its tax treatment.
      </p>
    ),
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
    faqJsonLd(lifeIulFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Wealth", url: "/long-term-nri-wealth" },
      { name: "Life Insurance", url: "/life-insurance-for-indian-families-usa" },
      { name: "Indexed Universal Life (IUL)", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="indexed-universal-life-iul-for-indian-families-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Wealth", href: "/long-term-nri-wealth" },
          { label: "Life Insurance", href: "/life-insurance-for-indian-families-usa" },
          { label: "IUL" },
        ]}
        icon="📈"
        category="Wealth · Life Insurance"
        title="Indexed Universal Life Insurance for Indian Families"
        hook="IUL is pitched hard to Indian professionals — often as 'tax-free wealth' or a '401(k) alternative.' It is neither. It is permanent life insurance with a cash-value feature, real costs, and real risks. Here is how it actually works, in plain English, so you can have an informed conversation with a licensed agent."
        accent="from-indigo-600 to-brand-600"
        badges={["Educational guide", "Plain English", "No sales pitch", "Agent-ready questions"]}
        sourceNote={<>Last updated: {META.modifiedHuman}. Caps, floors, participation rates, charges, and tax treatment vary by insurer and contract.</>}
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
              question="Quick Answer: What Is IUL, Really?"
              answer={
                <p>
                  IUL is permanent life insurance with a cash-value account credited by an index-linked formula — it is
                  not a simple investment account, not guaranteed tax-free wealth, and not a replacement for a 401(k) or
                  IRA. It can fit some families with permanent-coverage or estate goals who already have basic
                  protection; it is a poor fit for families who mainly need affordable coverage.
                </p>
              }
              bullets={[
                "Your cash value earns index-linked interest limited by caps and participation rates — not market returns.",
                "Policy charges come out every month and rise with age; a 0% floor does not mean the cash value can't fall.",
                "Loans and withdrawals reduce the death benefit and can trigger taxes if the policy lapses.",
                "Overfunding too fast can create a MEC, which loses the favorable loan tax treatment.",
                "Illustrations are projections; only the guaranteed column is promised.",
                "Whether an IUL fits your family is a question for a state-licensed agent and a tax advisor.",
              ]}
              ctaText="Jump to the questions to ask before buying"
              ctaHref="#iul-questions"
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

        {/* Calculator CTA — soft: size basic protection first */}
        <section className="py-8">
          <Container>
            <CalculatorCTA variant="soft" />
          </Container>
        </section>

        {/* 2. How IUL works */}
        <section id="how-it-works" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="How IUL works in plain English" sections={HOW_SECTIONS} />
          </Container>
        </section>

        {/* 3. Potential benefits */}
        <section id="benefits" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Potential benefits</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Every item below is conditional — the benefits exist only when the policy is properly structured, funded
                consistently, and kept in force. None of them is guaranteed.
              </p>
              <div className="mt-5">
                <ChecklistBox
                  title="What a well-managed IUL may offer"
                  items={[
                    "Lifetime coverage — if the policy stays adequately funded and in force.",
                    "Tax-deferred growth of cash value while the policy remains in force.",
                    "Possible tax-advantaged access to cash value through loans and withdrawals, if the policy is structured correctly, is not a MEC, and does not lapse.",
                    "A downside crediting floor (often 0%) that limits index-linked losses, subject to policy terms — while charges still apply.",
                  ]}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Risks */}
        <section id="risks" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Risks and tradeoffs</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Caps limit the upside", d: "In strong market years, your crediting stops at the cap — you do not get the full index gain, and dividends are typically excluded." },
                  { t: "Fees and insurance costs", d: "Cost of insurance rises with age; loads, admin, and rider fees come out monthly whether the index rises or not." },
                  { t: "Loan interest", d: "Policy loans accrue interest. Loans plus flat crediting years can erode cash value faster than illustrations suggest." },
                  { t: "Lapse risk", d: "If cash value can't cover charges — from underfunding, loans, or weak crediting — the policy lapses and coverage ends." },
                  { t: "Tax bill on lapse", d: "If a policy lapses or is surrendered with loans outstanding, gains can become taxable income in that year — a painful surprise." },
                  { t: "Illustration risk", d: "Illustrated growth assumes today's caps and steady crediting for decades. Insurers can change caps and participation rates; the guaranteed column is the only promise." },
                  { t: "Complexity", d: "More moving parts than term insurance — misunderstanding any one of them (funding, loans, MEC limits) can undo the plan." },
                  { t: "Not suitable for every family", d: "A family that needs low-cost protection, or cannot fund the policy consistently for decades, is usually better served elsewhere." },
                ].map((r) => (
                  <div key={r.t} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                    <p className="text-sm font-bold text-amber-900">{r.t}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-700">{r.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 5. What tax-free really means */}
        <section id="tax-free" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What &ldquo;tax-free&rdquo; really means</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The phrase &ldquo;tax-free&rdquo; in IUL marketing compresses five different rules into one word. Here
                they are, separated:
              </p>
              <div className="mt-5 space-y-3">
                {[
                  {
                    n: 1,
                    rule: "The death benefit is generally income-tax-free to beneficiaries",
                    detail: "This is true of life insurance broadly, including term — it is not unique to IUL. (Estate tax is a separate topic for large estates.)",
                  },
                  {
                    n: 2,
                    rule: "Cash value grows tax-deferred",
                    detail: "You do not pay tax on crediting each year while the policy is in force. Deferred is not the same as free — what happens later depends on how money comes out.",
                  },
                  {
                    n: 3,
                    rule: "Loans may be income-tax-free — conditionally",
                    detail: "Policy loans are generally not taxed when taken only if the policy stays in force and is not a MEC. If the policy later lapses with loans outstanding, gains can become taxable that year. The loan also accrues interest and reduces the death benefit.",
                  },
                  {
                    n: 4,
                    rule: "Withdrawals above basis may be taxable",
                    detail: "You can generally withdraw up to what you paid in (your basis) without income tax; amounts above that are typically taxable. Withdrawals also reduce cash value and death benefit.",
                  },
                  {
                    n: 5,
                    rule: "MEC status changes everything above",
                    detail: "In plain English: if too much premium goes in too fast under IRS limits, the policy becomes a modified endowment contract. It keeps its death benefit, but loans and withdrawals are taxed gains-first and may face a 10% penalty before age 59½.",
                  },
                ].map((x) => (
                  <div key={x.n} className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {x.n}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{x.rule}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">{x.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <WarnBox title="The honest summary">
                  <p>
                    IUL offers conditional tax advantages that depend on the policy staying in force, staying under MEC
                    limits, and being managed carefully for decades. That is very different from &ldquo;guaranteed
                    tax-free wealth&rdquo; — and anyone promising the latter is overselling. Tax outcomes are
                    contract-specific: confirm them with a qualified tax advisor.
                  </p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. Who may consider reviewing */}
        <section id="who-may-review" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Who may consider reviewing IUL?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                &ldquo;Review&rdquo; is the right word — not &ldquo;buy.&rdquo; IUL is worth a careful, skeptical look
                for some profiles:
              </p>
              <div className="mt-5">
                <ChecklistBox
                  title="Profiles where a review can make sense"
                  tone="brand"
                  items={[
                    "Families who already have adequate basic protection (usually term) in place.",
                    "Higher-income families who have filled the emergency fund and retirement basics (401(k) match, IRA/Roth options) and still have long-term dollars to allocate.",
                    "People who specifically want coverage that lasts for life, not just working years.",
                    "Families with long-term estate or legacy planning goals where a permanent death benefit has a defined job.",
                  ]}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* 7. Who should be cautious */}
        <section id="be-cautious" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Who should be cautious?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Families who mainly need low-cost protection — term usually does that job at a fraction of the price.",
                  "Anyone who cannot commit to funding the policy consistently for decades — underfunded IULs lapse.",
                  "Anyone expecting guaranteed market returns — caps, participation rates, and charges make that impossible to promise.",
                  "Anyone who does not fully understand the policy charges — if you can't explain the fees, you are not ready to buy.",
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
                If retirement accounts are the real question, read the honest comparison in{" "}
                <Link
                  href="/articles/iul-vs-401k-honest-comparison"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  IUL vs 401(k)
                </Link>{" "}
                — IUL is not a replacement for retirement accounts, and that article explains why.
              </p>
            </div>
          </Container>
        </section>

        {/* Agent CTA */}
        <section className="py-10">
          <Container>
            <AgentCTA checklistHref="#iul-questions" />
          </Container>
        </section>

        {/* 8. Questions before buying */}
        <section id="iul-questions" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Questions to ask before buying IUL</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Take this checklist to the meeting. If an agent dodges the guaranteed column, the fee schedule, or the
                MEC question, that is your answer.
              </p>
              <ol className="mt-5 space-y-3">
                {agentQuestionsIul.map((q, i) => (
                  <li key={q} className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-700">{q}</p>
                  </li>
                ))}
              </ol>
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

        {/* 9. FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={lifeIulFaqs} />
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
                { label: "Term vs IUL: side-by-side", href: "/term-vs-iul-for-indian-families-usa", primary: true },
                { label: "Term coverage framework", href: "/term-life-insurance-for-indian-families-usa" },
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
