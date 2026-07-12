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
  WhichPageBlock,
  EEATBox,
  TrumpClusterNav,
  ChecklistBox,
  WarnBox,
  DataTable,
  ComparisonTable,
  ExpertCallout,
  DecisionFlow,
  TrustBox,
  QuickAnswers,
  HorizontalTimeline,
  Callout,
  AuthorBio,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  trumpAccountArticleJsonLd,
  trumpAccountAuthorJsonLd,
  trumpAccountHowToJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
} from "@/lib/trumpAccountCluster";
import {
  taxPlanningFaqs,
  trumpAccountSourceLinks,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TAX_ILLUSTRATION_NOTE,
  decisionBoxCols,
  decisionBoxRows,
  ageTimelineCols,
  ageTimelineRows,
  taxScenarioCols,
  taxScenarioRows,
  extraTaxScenarioRows,
  bestAgeCols,
  bestAgeRows,
  multiYearCols,
  multiYearRows,
  bracketCols,
  bracketRows,
  stateTaxCols,
  stateTaxRows,
  immigrantPlanningCols,
  immigrantPlanningRows,
  mixedStatusRow,
  taxPlanningCaseStudies,
  checklistBefore18,
  checklistTurning18,
  checklistBeforeWithdrawal,
  checklistBeforeRoth,
  checklistBeforeOverseas,
  checklistYearEnd,
  fullAccountComparisonColumns,
  fullAccountComparisonRows,
  goalDecisionCols,
  goalDecisionRows,
  planningMistakes15,
  plannedTools,
  pillarQuickAnswers,
  governmentResourceLinks,
  trumpTimelineCols,
  trumpTimelineRows,
  lifeStageStops,
  otherOptionsConsiderations,
  vs529Pair,
  vsRothPair,
  vsCustodialPair,
  vsBrokeragePair,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-tax-planning-immigrant-families";
const TITLE =
  "Trump Account Tax Planning for Immigrant Families: The Complete Decision Guide (Withdrawals, Ages, Scenarios & India Move)";
const META_TITLE = "Trump Account Tax Planning Guide for Immigrant Families";
const DESC =
  "A practical Trump Account planning guide for immigrant and NRI families: a quick decision box, an age-by-age timeline, 25+ tax scenarios, multi-year and bracket planning, state and status-based tables, 20 case studies, and 40+ FAQs.";
const UPDATED_ISO = "2026-07-11";
const UPDATED_HUMAN = "July 11, 2026";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "What it is", href: "#what" },
  { label: "Decision box", href: "#decide" },
  { label: "Age timeline", href: "#timeline" },
  { label: "The age-18 pivot", href: "#age18" },
  { label: "Roth showcase", href: "#roth" },
  { label: "Tax scenarios", href: "#scenarios" },
  { label: "Best age to withdraw", href: "#bestage" },
  { label: "Multi-year", href: "#multiyear" },
  { label: "Brackets", href: "#brackets" },
  { label: "States", href: "#states" },
  { label: "By status", href: "#status" },
  { label: "India move", href: "#india" },
  { label: "Case studies", href: "#cases" },
  { label: "Compare accounts", href: "#compare" },
  { label: "By goal", href: "#goal" },
  { label: "Mistakes", href: "#mistakes" },
  { label: "Checklists", href: "#checklists" },
  { label: "Tools", href: "#tools" },
  { label: "FAQ", href: "#faq" },
];

const HOWTO_STEPS = [
  { name: "Confirm eligibility and records", text: "Check the child's SSN and citizenship, and gather contribution history, cost-basis records, and account statements before making any decision." },
  { name: "Define the goal", text: "Decide whether the money is for college, retirement, a first home, an emergency, or long-term wealth — the goal drives which account and timing to use." },
  { name: "Model the after-tax cost", text: "For any withdrawal, add ordinary income tax on the taxable portion, possible state tax, a possible 10% early-withdrawal penalty before age 59½, and the lost future growth." },
  { name: "Pick low-income years", text: "Time any withdrawal or Roth conversion for lower-income years to reduce the marginal tax rate, and spread large amounts across several years." },
  { name: "Handle cross-border facts", text: "If the family may move to India, plan U.S. account access, U.S.–India treaty treatment, and dual reporting before acting." },
  { name: "Get advice when it is complex", text: "Consult a cross-border tax advisor before large withdrawals, conversions, a move abroad, or abandoning a green card." },
];

/* Reusable section wrappers -------------------------------------------------- */
function AltSection({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
      <Container>
        <div className="mx-auto max-w-5xl">{children}</div>
      </Container>
    </section>
  );
}
function PlainSection({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-12">
      <Container>
        <div className="mx-auto max-w-5xl">{children}</div>
      </Container>
    </section>
  );
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{children}</h2>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600">{children}</p>;
}
function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-3xl rounded-lg border-l-4 border-brand-400 bg-brand-50/50 px-4 py-2 text-sm leading-relaxed text-ink-700">
      <strong className="text-ink-900">Key takeaway:</strong> {children}
    </p>
  );
}

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: TRUMP_ACCOUNT_PUBLISHED,
      dateModified: UPDATED_ISO,
    }),
    trumpAccountAuthorJsonLd(),
    trumpAccountHowToJsonLd({
      path: PATH,
      name: "How to plan a Trump Account withdrawal for an immigrant family",
      description:
        "A six-step framework immigrant families can use to decide whether, when, and how much to withdraw from a Trump Account while managing tax, penalty, and cross-border issues.",
      steps: HOWTO_STEPS,
    }),
    faqJsonLd(taxPlanningFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Tax Planning for Immigrant Families", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-tax-planning-immigrant-families"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Tax Planning" },
        ]}
        icon="🧮"
        category="Trump Account · Planning Guide"
        title="Trump Account Tax Planning for Immigrant Families"
        hook="Not a law lecture — a decision guide. Use the quick decision box, the age-by-age timeline, 25+ tax scenarios, and 20 family case studies to answer one question: what should my family actually do with this account?"
        accent="from-indigo-600 to-brand-600"
        sourceNote={<>Last updated: {UPDATED_HUMAN}. Educational planning guide — verify current IRS / Treasury guidance.</>}
        disclaimerExtra={
          <p>
            This guide is educational only and is not personalized tax, legal, immigration, or investment advice. Every
            dollar figure in the examples is a simplified illustration, not an official Trump Account figure. Rules may
            change; verify current IRS guidance and consult a qualified professional.
          </p>
        }
      >
        <Container>
          <div className="mx-auto max-w-5xl">
            <JumpNav items={JUMP} />
          </div>
        </Container>

        {/* P1 — Updated-for-2026 trust box */}
        <section className="pt-6">
          <Container>
            <TrustBox updated={UPDATED_HUMAN} />
          </Container>
        </section>

        {/* Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Quick Answer: How should my family use a Trump Account?"
              answer={
                <p>
                  Treat it as a decades-long, retirement-style investment account — not a savings jar the child raids at
                  18. The real money decisions are about <strong>when and how much to withdraw</strong>, whether to use a
                  529 for college instead, whether a low-income-year Roth conversion helps, and — for immigrant families —
                  visa status, residency, and a possible move back to India.
                </p>
              }
              bullets={[
                "The most expensive thing most families do is cash out at 18 — tax, penalty, and lost compounding.",
                "Withdrawals of the taxable portion are usually ordinary income; a ~10% penalty may apply before age 59½.",
                "For college, a 529 is often more tax-efficient; use the Trump Account for the gap or for the long term.",
                "Low-income years (gap year, college, between jobs) are the cheapest time to withdraw or convert.",
                "Immigrant families must also weigh visa status, U.S. account access, India residency, and cross-border reporting.",
                "When two countries' tax systems could apply, get cross-border advice before acting.",
              ]}
              ctaText="Jump to the quick decision box"
              ctaHref="#decide"
            />
            {/* A1 — sticky compounding anchor line */}
            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-card">
              <p className="text-sm leading-relaxed text-ink-800 sm:text-base">
                <span className="mr-2 text-lg" aria-hidden>
                  📈
                </span>
                <strong>A single early contribution, left untouched, can grow into a six-figure balance by
                retirement</strong>{" "}
                — which is exactly why cashing out at 18 is the costliest move most families make.
              </p>
              <p className="mt-1 text-xs text-ink-400">
                Illustrative only, based on long-run compounding assumptions — not an official Trump Account figure or a
                guaranteed return.
              </p>
            </div>
            {/* P8 — Quick answers */}
            <div className="mt-4">
              <QuickAnswers items={pillarQuickAnswers} />
            </div>
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={UPDATED_HUMAN} />
            </div>
          </Container>
        </section>

        {/* SECTION 1 — What is a Trump Account? */}
        <AltSection id="what">
          <H2>What is a Trump Account (in one minute)?</H2>
          <Lead>
            A Trump Account is a type of traditional IRA opened for a child, with the child as the owner. A parent or
            responsible party manages it while the child is a minor, money grows tax-deferred, and the investments are
            restricted to low-cost index funds during the growth period. In plain terms: it is a long-term wealth engine
            for a kid, not a college fund and not a spending account.
          </Lead>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <ChecklistBox
              title="Who qualifies"
              tone="brand"
              items={[
                "A child under 18 (by year-end) with a valid SSN.",
                "For the $1,000 seed: a U.S.-citizen child, valid SSN, born in the 2025–2028 window.",
                "A parent/guardian of any visa status can act as the responsible party.",
              ]}
            />
            <ChecklistBox
              title="Who may benefit most"
              items={[
                "Families staying in the U.S. long-term who want early compounding.",
                "Parents who already fund a 529 and want extra tax-deferred room.",
                "Families wanting a flexible account not tied to a U.S. school.",
                "Newborns eligible for the one-time federal seed.",
              ]}
            />
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Who may NOT benefit</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                {[
                  "Families whose only goal is college (a 529 is usually more tax-efficient).",
                  "Families likely to leave the U.S. soon and over-fund before doing so.",
                  "Children with only an ITIN (they do not qualify).",
                  "Anyone without an emergency fund in place first.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-none text-rose-500" aria-hidden>
                      ✕
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* P4 — who may want to consider other options */}
          <div className="mt-6">
            <h3 className="text-base font-bold text-ink-900">Who may want to consider other options</h3>
            <p className="mt-2 max-w-3xl text-sm text-ink-600">
              A Trump Account isn&apos;t the right first stop for every family. These are considerations, not verdicts:
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {otherOptionsConsiderations.map((o) => (
                <div key={o.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                  <p className="text-sm font-bold text-ink-900">{o.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-ink-600">
            New here? Start with the{" "}
            <Link href="/trump-account-h1b-immigrant-families" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              main H-1B guide
            </Link>{" "}
            or check{" "}
            <Link href="/trump-account-1000-eligibility" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              $1,000 eligibility
            </Link>
            . This page assumes the account exists and focuses on planning decisions.
          </p>
        </AltSection>

        {/* SECTION 2 — Quick decision box */}
        <PlainSection id="decide">
          <H2>Quick decision box: should we open one, and how should we use it?</H2>
          <Lead>
            Answer these seven questions honestly. There is no single right answer for every family — this points you to
            the strategy that usually fits.
          </Lead>
          <div className="mt-5">
            <DataTable
              columns={decisionBoxCols}
              rows={decisionBoxRows}
              keyRows={["Is college the main goal?", "Might you move back to India?"]}
            />
          </div>
          <Takeaway>
            If college is the goal, fund a 529 first; if a move back to India is likely, plan access and cross-border tax
            before you leave. Those two answers change the plan the most.
          </Takeaway>
          <div className="mt-5">
            <WarnBox title="Rule of thumb">
              <p>
                Open early if your child qualifies and you plan to stay in the U.S., fund a 529 first if college is the
                goal, and never treat the account as a source of spending money. If a move back to India is likely, keep
                contributions modest and plan access and cross-border tax before you leave.
              </p>
            </WarnBox>
          </div>
        </PlainSection>

        {/* SECTION 3 — Age timeline */}
        <AltSection id="timeline">
          <H2>The age-by-age timeline: control, withdrawals, tax & mistakes</H2>
          <Lead>
            The account changes character as the child grows. This timeline shows who controls it, what is possible at
            each age, the tax and penalty reality, and the mistake families most often make at that stage.
          </Lead>
          {/* P6 — visual life-stage timeline */}
          <div className="mt-5 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card sm:p-5">
            <HorizontalTimeline stops={lifeStageStops} />
          </div>
          <div className="mt-5">
            <DataTable columns={ageTimelineCols} rows={ageTimelineRows} keyRows={["18"]} />
          </div>
          <Takeaway>
            Age 18 is the pivot. Everything before it is about contributing and compounding; everything after is about
            resisting the urge to withdraw.
          </Takeaway>
        </AltSection>

        {/* A2 + A3 — The age-18 pivot */}
        <PlainSection id="age18">
          <H2>The age-18 pivot: what actually happens (and what doesn&apos;t)</H2>
          <Lead>
            This is the single most misunderstood moment. Based on current IRS guidance, the account generally becomes a
            traditional IRA — but that does not mean anything has to be withdrawn.
          </Lead>
          <div className="mt-4">
            <WarnBox title="The exact trigger: a calendar year, not a birthday">
              <p>
                Amounts generally cannot be withdrawn before <strong>January 1 of the calendar year in which the child
                turns 18</strong>. So a child with a December birthday can generally access the account from January 1 of
                that same year — not twelve months later. After that point the account is generally treated as a
                traditional IRA, subject to the usual traditional-IRA rules. Confirm the exact timing against current IRS
                guidance before acting.
              </p>
            </WarnBox>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">What changes at 18</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                {[
                  "Control generally shifts to the now-adult child.",
                  "Withdrawals become possible (taxable, with a possible penalty before 59½).",
                  "Growth-period investment restrictions generally ease.",
                  "The adult child handles their own tax reporting from here.",
                  "A Roth conversion generally becomes possible starting this year (confirm current rules).",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-none text-amber-600" aria-hidden>
                      →
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ChecklistBox
              title="What stays the same (the reassuring part)"
              items={[
                "Nothing forces a withdrawal at 18 — doing nothing is a valid choice.",
                "Tax basis and after-tax contribution tracking carry over.",
                "The full account history and records are retained.",
                "The money keeps compounding if you leave it invested.",
                "Same custodian unless the child chooses to transfer it.",
              ]}
            />
          </div>
          <Takeaway>
            At 18 the child gains control and access — but the most powerful option is usually to do nothing and let the
            account keep compounding.
          </Takeaway>
          {/* P6 — decision flow */}
          <div className="mt-6 max-w-md">
            <DecisionFlow
              title="The age-18 decision, one step at a time"
              nodes={[
                { text: "Child reaches the access year (18)", kind: "start" },
                { text: "Do you have a real, immediate need for the cash?", kind: "decision", branch: "No → hold" },
                { text: "Is this a low-income year?", kind: "decision", branch: "Yes → consider" },
                { text: "Model tax + penalty + lost growth before acting", kind: "action", branch: "Then" },
                { text: "Otherwise: leave invested (or convert a little to Roth)", kind: "end" },
              ]}
            />
          </div>
          <p className="mt-4 max-w-3xl text-sm text-ink-600">
            Want just this topic in one focused page? See{" "}
            <Link
              href="/trump-account-age-18-withdrawal-roth-conversion"
              className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              Trump Account at 18: withdrawal rules &amp; Roth conversion
            </Link>
            .
          </p>
        </PlainSection>

        {/* A4 — Roth conversion showcase */}
        <AltSection id="roth">
          <H2>Roth conversion showcase: convert in a low-income year vs. never convert</H2>
          <Lead>
            Initial guidance indicates a Trump Account can generally be converted to a Roth IRA starting the year the
            child turns 18. Here is why a single low-income-year conversion can matter over a lifetime.
          </Lead>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Convert $20,000 in a low-income college year
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                <li>Tax now: much of it absorbed by the standard deduction → roughly $0–$1,200 tax that year.</li>
                <li>Then grows <strong>tax-free</strong> inside a Roth for decades.</li>
                <li>Qualified withdrawals later are tax-free; no RMDs for the original owner.</li>
                <li className="font-semibold text-emerald-800">Illustrative lifetime tax on that $20k: near $0.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                Never convert — withdraw at 40 in a 32% year
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                <li>The same money (now grown) is taxed as ordinary income at a high rate.</li>
                <li>On a grown balance, that can be <strong>thousands more</strong> in tax.</li>
                <li>RMDs may later force taxable distributions you did not need.</li>
                <li className="font-semibold text-rose-800">Illustrative lifetime tax: far higher.</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <WarnBox title="Before you rely on this">
              <p>
                Every figure here is illustrative, not an official amount. Confirm that a Trump Account qualifies for Roth
                conversion under current rules, and weigh financial-aid impact, state tax, and filing status — a
                conversion adds to that year&apos;s taxable income. It is one option to review in a low-income year, not
                an automatic move.
              </p>
            </WarnBox>
          </div>
          <Takeaway>
            A modest conversion in a low-income year can turn decades of future tax into little or nothing — but only when
            the numbers and the rules line up, so verify first.
          </Takeaway>
        </AltSection>

        {/* SECTION 4 — Tax scenarios */}
        <PlainSection id="scenarios">
          <H2>25+ tax-planning scenarios (with illustrative numbers)</H2>
          <Lead>
            The single most useful part of this guide. Each row shows a realistic situation, an illustrative withdrawal,
            the rough federal tax and possible penalty, what lands in hand, and the strategy we would generally use.
          </Lead>
          <div className="mt-4">
            <WarnBox title="Read this before the numbers">
              <p>{TAX_ILLUSTRATION_NOTE}</p>
            </WarnBox>
          </div>
          <div className="mt-5">
            <DataTable
              columns={taxScenarioCols}
              rows={[...taxScenarioRows, ...extraTaxScenarioRows]}
              keyRows={["College at 18, small draw", "High-salary first job", "Large account, big draw"]}
            />
          </div>
          <Takeaway>
            The pattern across every row: small draws in low-income years cost the least, a high-earning year is the worst
            time to withdraw, and a large balance should never come out as a single lump sum.
          </Takeaway>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <ExpertCallout scenario="for a child attending medical school">
              <p>
                Tuition-heavy years with little income are exactly when a small draw is cheapest — but I&apos;d still
                lean on student loans and aid first and use the account only for the gap, so decades of tax-deferred
                growth aren&apos;t traded for a bill that financing can cover.
              </p>
            </ExpertCallout>
            <ExpertCallout scenario="for a scholarship recipient">
              <p>
                If a scholarship covers school, there&apos;s usually no reason to withdraw at all. I&apos;d look at
                whether that low-income year is a good moment for a small Roth conversion instead of spending — turning a
                &ldquo;don&apos;t need it&rdquo; year into a tax-free-growth head start.
              </p>
            </ExpertCallout>
          </div>
        </PlainSection>

        {/* P2 — Best time to withdraw */}
        <AltSection id="bestage">
          <H2>When is the best time to withdraw?</H2>
          <Lead>
            The same withdrawal costs very different amounts depending on the age you take it. This compares the common
            windows on tax, growth given up, penalty, and typical use.
          </Lead>
          <div className="mt-5">
            <DataTable columns={bestAgeCols} rows={bestAgeRows} keyRows={["18", "59½+ (retirement)"]} />
          </div>
          <Takeaway>
            Broadly: 18–21 in a low-income year is the cheapest early window but forfeits the most growth; 59½+ is the
            most valuable overall (no penalty, full compounding). Peak-earning years are the worst.
          </Takeaway>
        </AltSection>

        {/* Middle CTA */}
        <section className="py-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 text-center shadow-card sm:p-8">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-500">Free download</span>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
                Get the Free Immigrant Wealth Guide
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
                How immigrant families can think about taxes, investing, retirement accounts, India planning, and
                long-term wealth decisions — in one place.
              </p>
              <div className="mt-4">
                <Link
                  href="/free-immigrant-wealth-guide"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  Download the free guide →
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 5 — Multi-year planning */}
        <AltSection id="multiyear">
          <H2>Multi-year withdrawal planning: spread it out</H2>
          <Lead>
            The same balance can cost very different amounts of tax depending on how fast you take it out. Here is how a
            hypothetical $100,000 balance compares across timelines.
          </Lead>
          <div className="mt-5">
            <DataTable
              columns={multiYearCols}
              rows={multiYearRows}
              keyRows={["Withdraw all at once ($100k)", "Leave invested until 59½+"]}
            />
          </div>
          <Takeaway>
            A lump sum is almost always the most expensive option; leaving the balance invested until 59½ is almost always
            the cheapest. Everything else is a spectrum between them.
          </Takeaway>
        </AltSection>

        {/* SECTION 6 — Bracket planning */}
        <PlainSection id="brackets">
          <H2>Tax-bracket planning: why low-income years win</H2>
          <Lead>
            A withdrawal is taxed at your marginal rate, so the same $10,000 taxable draw costs very different amounts
            depending on the year you take it. This is why a gap year or an early-career year is a planning gift.
          </Lead>
          <div className="mt-5">
            <DataTable columns={bracketCols} rows={bracketRows} keyRows={["10%", "32%", "35%"]} />
          </div>
          <Takeaway>
            The 10% (student/no-job) year is the cheapest time to withdraw or convert; the 32–35% years are the most
            expensive — time the decision, don&apos;t force it.
          </Takeaway>
        </PlainSection>

        {/* SECTION 7 — State tax */}
        <AltSection id="states">
          <H2>State tax comparison</H2>
          <Lead>
            Federal tax is only part of the bill. Where the child lives when they withdraw can add — or save — thousands.
            No-income-tax states are the friendliest for large or early draws.
          </Lead>
          <div className="mt-5">
            <DataTable columns={stateTaxCols} rows={stateTaxRows} keyRows={["California", "Texas", "Florida"]} />
          </div>
          <Takeaway>
            California is one of the costliest states for an early withdrawal; no-income-tax states like Texas and Florida
            are the friendliest. Where the child lives when they withdraw can move the bill by thousands.
          </Takeaway>
        </AltSection>

        {/* SECTION 8 — Immigrant planning by status */}
        <PlainSection id="status">
          <H2>Immigrant tax planning by status</H2>
          <Lead>
            This is where immigrant families differ from the standard advice. Your visa or residency status changes the
            advantages, the risks, and when professional advice is worth it.
          </Lead>
          <div className="mt-5">
            <DataTable
              columns={immigrantPlanningCols}
              rows={[...immigrantPlanningRows, mixedStatusRow]}
              keyRows={["H-1B parent", "Returning to India"]}
            />
          </div>
          <Takeaway>
            For most of our readers the H-1B-parent and returning-to-India rows are the ones to study — they carry the
            biggest cross-border risks and the clearest need for advice.
          </Takeaway>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <ExpertCallout scenario="if I were an H-1B family planning to stay permanently">
              <p>
                I&apos;d treat it as a true long-hold account: fund it consistently, invest fully, and avoid withdrawals
                entirely. With a long U.S. horizon, the tax-deferred compounding is the whole point — and I&apos;d layer a
                529 on top only if college is a named goal.
              </p>
            </ExpertCallout>
            <ExpertCallout scenario="if I were returning to India in about five years">
              <p>
                I&apos;d keep contributions modest, lock in U.S. provider access and 2-factor before leaving, and decide
                deliberately whether a low-income U.S. year before departure is a good time to draw or convert. Above all,
                I&apos;d get cross-border advice before the move — not after.
              </p>
            </ExpertCallout>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              { label: "H-1B main guide →", href: "/trump-account-h1b-immigrant-families" },
              { label: "SSN vs ITIN rules →", href: "/trump-account-ssn-itin-child" },
              { label: "Tax rules for immigrants →", href: "/trump-account-tax-rules-immigrants" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </PlainSection>

        {/* SECTION 9 — Returning to India */}
        <AltSection id="india">
          <H2>Returning to India: the decisions that actually matter</H2>
          <Lead>
            A U.S. move-back is the highest-stakes moment for cross-border families. The account can stay open, but the
            timing of withdrawals, U.S. access, and dual taxation need a plan before you leave — not after.
          </Lead>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Questions to settle before you fly</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                {[
                  "Keep the account open, or withdraw before leaving? (Usually keep — but model both.)",
                  "Would a low-income U.S. year before departure be a cheaper time to draw or convert?",
                  "Will the provider allow logins, 2-factor, and access from an Indian address?",
                  "How will U.S. tax on U.S.-source income and the U.S.–India treaty apply to future draws?",
                  "How does India tax the account once the child is an Indian resident?",
                  "What are the estate, inheritance, and beneficiary implications across both countries?",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-none text-brand-500">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ChecklistBox
              title="Before you move: paperwork"
              tone="brand"
              items={[
                "Save the SSN card, passport/CRBA, and Form 4547 confirmation.",
                "Download every yearly statement and basis record.",
                "Confirm the provider's foreign-address and 2-factor policy.",
                "Keep a U.S. bank link and mailing address if possible.",
                "Line up a cross-border (U.S.–India) tax advisor.",
                "Decide keep / convert / withdraw deliberately, not by default.",
              ]}
            />
          </div>
          <div className="mt-5">
            <WarnBox title="Exchange rate & double-tax caution">
              <p>
                Withdrawing in dollars and spending in rupees exposes you to exchange-rate swings, and a withdrawal can be
                taxable in both countries. The U.S.–India treaty may relieve double tax, but outcomes depend on your
                residency and current law. This is exactly where a cross-border professional earns their fee.
              </p>
            </WarnBox>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Move-back-to-India guide →", href: "/trump-account-moving-back-to-india" },
              { label: "Return to India guide →", href: "/return-to-india" },
              { label: "Return to India checklist →", href: "/return-to-india-checklist" },
              { label: "India tax compliance →", href: "/india-tax-compliance" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </AltSection>

        {/* SECTION 10 — Case studies */}
        <PlainSection id="cases">
          <H2>20 family case studies</H2>
          <Lead>
            Realistic, anonymized profiles across visa statuses, incomes, and goals. Each shows the situation, the action
            we would generally take, the tax reality, and the recommendation. Numbers are illustrative.
          </Lead>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {taxPlanningCaseStudies.map((c) => (
              <div key={c.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <p className="text-sm font-bold text-ink-900">{c.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[c.visa, c.income, `Child ${c.childAge}`].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-ink-900/10 bg-slate-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-500"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <dl className="mt-3 space-y-1.5 text-xs leading-relaxed text-ink-600">
                  <div className="flex gap-2">
                    <dt className="w-20 flex-none font-semibold uppercase tracking-wide text-ink-400">Goal</dt>
                    <dd>{c.goal}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 flex-none font-semibold uppercase tracking-wide text-ink-400">Balance</dt>
                    <dd>{c.balance}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 flex-none font-semibold uppercase tracking-wide text-ink-400">Action</dt>
                    <dd>{c.action}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 flex-none font-semibold uppercase tracking-wide text-ink-400">Tax</dt>
                    <dd>{c.taxes}</dd>
                  </div>
                </dl>
                <p className="mt-3 rounded-lg bg-brand-50/70 px-3 py-2 text-xs font-medium text-brand-800">
                  ✓ {c.recommendation}
                </p>
              </div>
            ))}
          </div>
        </PlainSection>

        {/* SECTION 11 — Account comparison */}
        <AltSection id="compare">
          <H2>Account comparison: Trump Account vs 529, IRA, Roth & more</H2>
          <Lead>
            Six accounts, one matrix. Use it to see at a glance which account wins on tax treatment, education,
            retirement, flexibility, and control.
          </Lead>
          <div className="mt-5">
            <ComparisonTable
              columns={fullAccountComparisonColumns}
              rows={fullAccountComparisonRows}
              keyFeatures={["Best use case"]}
            />
          </div>
          <Takeaway>
            Read down the highlighted Trump Account column, then across the &ldquo;Best use case&rdquo; row: each account
            wins at one job. The Trump Account&apos;s job is early, long-hold, flexible child wealth — not college.
          </Takeaway>

          {/* A5 — 529-vs-Trump college-bill walkthrough */}
          <div className="mt-6 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
              Worked example: one $60,000 college bill
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-sm text-ink-700">
                <p className="font-bold text-emerald-800">Pay it from a 529</p>
                <ul className="mt-2 space-y-1.5">
                  <li>Qualified tuition is a qualified 529 expense.</li>
                  <li>Growth comes out <strong>tax-free</strong>.</li>
                  <li className="font-semibold">Federal tax on the withdrawal: $0.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-ink-700">
                <p className="font-bold text-amber-800">Pay it from a Trump Account</p>
                <ul className="mt-2 space-y-1.5">
                  <li>The taxable portion is ordinary income.</li>
                  <li>An education exception may waive the 10% penalty — but <strong>not the income tax</strong>.</li>
                  <li className="font-semibold">
                    Illustrative tax at 22%: roughly $13,000 on a fully-taxable $60k draw.
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Same bill, and the 529 route can save on the order of <strong>$10,000+</strong> in tax — which is why, for a
              specific college expense, a 529 usually wins. Use the Trump Account for the gap after 529 and aid, or leave
              it invested. Figures are illustrative.
            </p>
            <p className="mt-3 text-sm text-ink-600">
              Deep dive:{" "}
              <Link
                href="/trump-account-vs-529-for-h1b-families"
                className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                Trump Account vs 529 for H-1B families
              </Link>
              .
            </p>
          </div>

          {/* P5 — focused 1-to-1 comparisons */}
          <h3 className="mt-8 text-lg font-bold text-ink-900">Focused 1-to-1 comparisons</h3>
          <p className="mt-2 max-w-3xl text-sm text-ink-600">
            Prefer a head-to-head? Each table below compares a Trump Account against one alternative on purpose, tax,
            flexibility, withdrawals, control, and who it may suit.
          </p>
          <div className="mt-4 space-y-6">
            <div>
              <p className="mb-2 text-sm font-bold text-ink-800">Trump Account vs 529 Plan</p>
              <ComparisonTable columns={vs529Pair.columns} rows={vs529Pair.rows} />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-ink-800">Trump Account vs Roth IRA</p>
              <ComparisonTable columns={vsRothPair.columns} rows={vsRothPair.rows} />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-ink-800">Trump Account vs Custodial Account (UTMA/UGMA)</p>
              <ComparisonTable columns={vsCustodialPair.columns} rows={vsCustodialPair.rows} />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-ink-800">Trump Account vs Taxable Brokerage</p>
              <ComparisonTable columns={vsBrokeragePair.columns} rows={vsBrokeragePair.rows} />
            </div>
          </div>
        </AltSection>

        {/* SECTION 12 — Goal-based decision */}
        <PlainSection id="goal">
          <H2>If my goal is… (pick the right account)</H2>
          <Lead>Start from what you actually want the money to do, and the best-fit account usually becomes obvious.</Lead>
          <div className="mt-5">
            <DataTable columns={goalDecisionCols} rows={goalDecisionRows} keyRows={["College", "Generational wealth"]} />
          </div>
          <Takeaway>
            The two most common goals split cleanly: for college, lead with a 529; for generational wealth, the Trump
            Account is the natural fit.
          </Takeaway>
        </PlainSection>

        {/* SECTION 13 — Mistakes (P7: why / consequence / better) */}
        <AltSection id="mistakes">
          <H2>Top 15 planning mistakes</H2>
          <Lead>
            Most Trump Account tax pain is self-inflicted. For each mistake: why it happens, what it can cost, and the
            better approach.
          </Lead>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {planningMistakes15.map((m, i) => (
              <div key={m.mistake} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-ink-900">{m.mistake}</p>
                </div>
                <dl className="mt-2.5 space-y-1.5 text-xs leading-relaxed">
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-ink-400">Why it happens</dt>
                    <dd className="text-ink-600">{m.why}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-rose-500">Consequence</dt>
                    <dd className="text-ink-600">{m.consequence}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold uppercase tracking-wide text-emerald-600">Better approach</dt>
                    <dd className="text-ink-700">{m.better}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </AltSection>

        {/* P10 — Planning checklists */}
        <PlainSection id="checklists">
          <H2>Planning checklists (save these)</H2>
          <Lead>
            A stage-by-stage set you can revisit as the child grows and your plans change. Work top to bottom at each
            milestone.
          </Lead>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ChecklistBox title="Before age 18" tone="brand" items={checklistBefore18} />
            <ChecklistBox title="Turning 18" tone="brand" items={checklistTurning18} />
            <ChecklistBox title="Before any withdrawal" items={checklistBeforeWithdrawal} />
            <ChecklistBox title="Before a Roth conversion" items={checklistBeforeRoth} />
            <ChecklistBox title="Before moving overseas" items={checklistBeforeOverseas} />
            <ChecklistBox title="Year-end review" items={checklistYearEnd} />
          </div>
          <p className="mt-4 max-w-3xl text-sm text-ink-600">
            Moving abroad? Pair this with our{" "}
            <Link href="/return-to-india-checklist" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              return-to-India checklist
            </Link>{" "}
            and{" "}
            <Link href="/india-tax-compliance" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              India tax compliance (FBAR/FATCA)
            </Link>{" "}
            guide.
          </p>
        </PlainSection>

        {/* SECTION 15 — Tools placeholders */}
        <PlainSection id="tools">
          <H2>Planning tools (coming soon)</H2>
          <Lead>
            We are building interactive calculators to make these decisions concrete. Until they launch, use the tables
            above and confirm the numbers with a professional.
          </Lead>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plannedTools.map((t) => (
              <div key={t.name} className="rounded-2xl border border-dashed border-ink-900/20 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-900">{t.name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-ink-400">
                    Soon
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </PlainSection>

        {/* SECTION 17 — Internal linking / related guides */}
        <AltSection>
          <H2>Related planning guides</H2>
          <Lead>Go deeper on the topics this decision touches.</Lead>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Trump Account at 18: withdrawals & Roth conversion", href: "/trump-account-age-18-withdrawal-roth-conversion" },
              { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families" },
              { label: "Tax rules for immigrants", href: "/trump-account-tax-rules-immigrants" },
              { label: "Generational wealth + calculator", href: "/trump-account-generational-wealth-for-kids" },
              { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
              { label: "SSN vs ITIN for the child", href: "/trump-account-ssn-itin-child" },
              { label: "$1,000 seed eligibility", href: "/trump-account-1000-eligibility" },
              { label: "Gift tax & NRI estate planning", href: "/nri-estate-planning" },
              { label: "FBAR / FATCA & cross-border tax", href: "/india-tax-compliance" },
              { label: "Long-term NRI wealth", href: "/long-term-nri-wealth" },
              { label: "Return to India", href: "/return-to-india" },
              { label: "Education & college planning", href: "/education" },
              { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </AltSection>

        {/* P3 — Trump Account timeline */}
        <PlainSection id="timeline-changes">
          <H2>Trump Account timeline: what has happened so far</H2>
          <Lead>Verified milestones from federal legislation and official guidance. We update this as new guidance is issued.</Lead>
          <div className="mt-5">
            <DataTable columns={trumpTimelineCols} rows={trumpTimelineRows} />
          </div>
          <Callout kind="note" title="Educational commentary vs official guidance">
            <p>
              The rows above are verified milestones from official sources. Everything else on this page is our
              educational commentary and illustrative planning — always defer to the official IRS and Treasury guidance
              linked below.
            </p>
          </Callout>
        </PlainSection>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <OfficialSourceBox
                intro="Trump Account rules, amounts, and tax treatment are set by the IRS and Treasury and can change. The tax figures on this page are illustrations, not official amounts — verify current guidance with the official sources:"
                links={trumpAccountSourceLinks}
              />
              {/* P2 — Official government resources */}
              <OfficialSourceBox
                title="Official government resources"
                intro="Authoritative federal resources for further reading. These are government sources — distinct from our educational commentary above:"
                links={governmentResourceLinks}
              />
            </div>
          </Container>
        </section>

        {/* Cluster nav */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={taxPlanningFaqs} />
          </Container>
        </section>

        {/* Next steps */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families", primary: true },
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
                { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
              ]}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_SHORT_DISCLAIMER}</p>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_DISCLAIMER}</p>
          </Container>
        </section>

        {/* P13 — Author bio (E-E-A-T) */}
        <section className="pb-6">
          <Container>
            <AuthorBio />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
