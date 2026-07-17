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
  DataTable,
  Callout,
  WarnBox,
  DecisionFlow,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { TocRail, TocInline, BackToTop } from "@/components/government-benefits/PillarToc";
import StatusMatrix from "@/components/government-benefits/StatusMatrix";
import BenefitsTimeline from "@/components/government-benefits/BenefitsTimeline";
import BenefitsScreener from "@/components/government-benefits/BenefitsScreener";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  GB_PATH,
  GB_PUBLISHED,
  GB_UPDATED,
  GB_UPDATED_HUMAN,
  GB_READING_MINUTES,
  gbArticleJsonLd,
  gbWebAppJsonLd,
  gbWebPageJsonLd,
  relatedGuideLinks,
} from "@/lib/governmentBenefitsCluster";
import {
  faqs,
  publicCharge,
  benefitFacts,
  povertyGuidelinesFact,
  statusTableCols,
  statusTableRows,
  programCatalogCols,
  programCatalogRows,
  documentsChecklist,
  denialSteps,
  officialSourceLinks,
  stateExamples,
  STATE_EXAMPLES_NOTE,
  OFFICIAL_SOURCES_REVIEWED,
  RULES_LAST_VERIFIED_HUMAN,
  GB_DISCLAIMER,
} from "@/data/governmentBenefitsData";

const TITLE = "Government Benefits for Immigrants: Visa, Green Card & Citizen Guide";
const H1 = "USA Government Benefits for Immigrants: What Can You Qualify For?";
const DESC =
  "Check which U.S. benefits may be available to visa holders, Green Card holders, citizens and mixed-status families based on state, income, work history and household.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: GB_PATH,
  type: "article",
  socialTitle: "Government Benefits for Immigrants: Visa, Green Card & Citizen Guide (2026)",
  openGraph: {
    publishedTime: GB_PUBLISHED,
    modifiedTime: GB_UPDATED,
    authors: ["Deepak Middha"],
    section: "Immigration",
    tags: [
      "government benefits",
      "public charge",
      "green card",
      "H-1B",
      "mixed-status families",
      "Medicaid",
      "SNAP",
    ],
  },
});

/* ------------------------------------------------------------------ *
 * Table of contents. Every id here MUST exist on the page —
 * enforced by anchors.test.ts.
 * ------------------------------------------------------------------ */
const JUMP = [
  { id: "quick-answer", label: "Quick answer by status" },
  { id: "screener", label: "Check your household" },
  { id: "whats-changing", label: "What's changing in 2026–27" },
  { id: "status-table", label: "Compare by immigration status" },
  { id: "citizens", label: "U.S. citizen benefits" },
  { id: "green-card", label: "Green card holder benefits" },
  { id: "visa-holders", label: "H-1B, H-4, L-1, F-1 benefits" },
  { id: "citizen-children", label: "U.S.-citizen children of visa holders" },
  { id: "mixed-status", label: "Mixed-status family rules" },
  { id: "healthcare", label: "Healthcare benefits" },
  { id: "food", label: "Food and child benefits" },
  { id: "unemployment", label: "Unemployment after a job loss" },
  { id: "social-security", label: "Social Security and Medicare" },
  { id: "tax-credits", label: "Tax credits" },
  { id: "college", label: "College aid and FAFSA" },
  { id: "housing", label: "Housing and utilities" },
  { id: "five-year", label: "The five-year waiting period" },
  { id: "public-charge", label: "Public charge explained" },
  { id: "i864", label: "I-864 sponsor repayment" },
  { id: "state-benefits", label: "Why your state changes the answer" },
  { id: "applying-safely", label: "Applying safely" },
  { id: "documents", label: "Documents you need" },
  { id: "denied", label: "If you are denied" },
  { id: "sources", label: "Official sources" },
  { id: "faq", label: "FAQs" },
];

/* ------------------------------------------------------------------ *
 * Small local presentational helpers
 * ------------------------------------------------------------------ */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-extrabold tracking-tight text-ink-900">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-ink-700">{children}</p>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
      {children}
    </Link>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
    >
      {children}
    </a>
  );
}

function FactChip({ f }: { f: typeof benefitFacts.ctcMax }) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink-900">{f.value}</p>
      <p className="mt-1 text-xs text-ink-600">
        {f.year} · {f.jurisdiction}
      </p>
      {f.note && <p className="mt-2 text-xs leading-relaxed text-ink-600">{f.note}</p>}
      <p className="mt-2 text-xs text-ink-500">
        <Ext href={f.sourceUrl}>{f.sourceName} ↗</Ext> · verified {f.lastVerified}
      </p>
    </div>
  );
}

export default function Page() {
  const jsonLd = jsonLdGraph(
    gbWebPageJsonLd(),
    gbArticleJsonLd(),
    gbWebAppJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Government Benefits for Immigrants", url: GB_PATH },
    ]),
    faqJsonLd(faqs),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="usa-government-benefits-immigrants"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Government Benefits" },
        ]}
        icon="🧭"
        category="Immigration · Benefits"
        title={H1}
        hook="Eligibility is per person, not per household — and a U.S.-citizen child's options do not depend on their parents' visa."
        badges={["Free & private", "No signup", "No SSN or A-number", "Every rule sourced"]}
        accent="from-brand-600 to-violet-600"
        sourceNote={
          <>
            Rules last verified <strong>{RULES_LAST_VERIFIED_HUMAN}</strong> against{" "}
            {OFFICIAL_SOURCES_REVIEWED} official sources. Several rules change between{" "}
            October 2026 and January 2027 — see{" "}
            <Link href="#whats-changing" className="font-semibold text-brand-700 underline underline-offset-2">
              what&rsquo;s changing
            </Link>
            .
          </>
        }
        topDisclaimer="Educational screening only — not legal, tax, or benefits advice. Agencies make all final decisions."
        disclaimerIntro={GB_DISCLAIMER}
        disclaimerPoints={[
          "This tool does not determine eligibility. Only the benefit agency can do that.",
          "Public charge, I-864 sponsor reimbursement, and program eligibility are three different things. This page keeps them separate on purpose.",
          "Deepak Middha is a CA and Series 65 holder who reviews the financial and tax explanations on this site. He is not an immigration attorney or a government-benefits specialist, and nothing here is immigration advice.",
          "For immigration consequences, consult a qualified immigration attorney or DOJ-accredited representative. For official eligibility, contact the administering agency or a certified benefits counselor.",
        ]}
      >
        {/*
          PAGE SHELL.

          ToolFirstLayout renders {children} raw — its header is wrapped in a
          <Container> but the body is not — so a page MUST supply its own. The
          first version of this page didn't, which is why the article ran the
          full width of the viewport and why the shared ArticleToc's `-mx-4`
          mobile bar bled 16px past the document edge at every width.

          The <Container> here is the same max-w-6xl used by the header above,
          so the shell's edges line up with the hero exactly. At xl the TOC gets
          its OWN grid column (it can no longer overlap anything by
          construction), and the article column carries `min-w-0` so the wide
          status table can shrink inside it instead of forcing the grid open.
        */}
        <Container className="py-8 sm:py-10">
          <div className="xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8">
            <aside className="hidden xl:block">
              <TocRail items={JUMP} />
            </aside>

            {/* Not a <main>: the root layout already renders one. */}
            <div data-article-main className="min-w-0 space-y-12">
              <div className="xl:hidden">
                <TocInline items={JUMP} />
              </div>

          {/* ---------------- Answer first ---------------- */}
          <section id="quick-answer" className="scroll-mt-24">
            <QuickAnswer
              question="Which U.S. government benefits might my family qualify for?"
              answer={
                <>
                  <p>
                    It depends on six things, and immigration status is only the first: your status,
                    your state, household income, age, disability or pregnancy, work history and tax
                    filing — and, for some federal programs, how long someone has held a green card.
                    There is no single national answer, because states set the limits on the biggest
                    programs. The most common and costly mistake is assuming the whole household is
                    excluded because one adult holds a temporary visa. Each person is assessed
                    separately.
                  </p>
                </>
              }
              bullets={[
                <>
                  <strong>U.S. citizens</strong> generally have the broadest access, subject to each
                  program&rsquo;s income and state rules.
                </>,
                <>
                  <strong>Green card holders</strong> may qualify for many programs, but several
                  federal ones involve a{" "}
                  <Link href="#five-year" className="font-semibold text-brand-700 underline underline-offset-2">
                    waiting period
                  </Link>{" "}
                  or exceptions.
                </>,
                <>
                  <strong>Temporary visa holders</strong> (H-1B, H-4, L-1, F-1) are usually outside
                  federal means-tested programs — but often still reach Marketplace insurance, tax
                  credits, emergency care, school programs, some state help, and sometimes
                  unemployment.
                </>,
                <>
                  A <strong>U.S.-citizen child can have completely different eligibility</strong>{" "}
                  from their noncitizen parents.
                </>,
                <>
                  Applying for a benefit <strong>for an eligible family member</strong> is not the
                  same as the immigrant applicant receiving it.
                </>,
                <>
                  <strong>Public charge is narrower and more fact-specific</strong> than the common
                  claim that &ldquo;any government benefit hurts your green card.&rdquo;
                </>,
              ]}
            />

            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap gap-3">
              <Link
                href="#screener"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-bold text-white transition hover:bg-brand-700"
              >
                Check benefits for my family →
              </Link>
              <Link
                href="#status-table"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-brand-200 bg-white px-5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                Compare by immigration status
              </Link>
            </div>

            {/* Your fastest path — four destinations, no prose. */}
            <nav
              aria-label="Your fastest path"
              className="mx-auto mt-4 max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
                Your fastest path
              </p>
              <ol className="mt-2 grid gap-2 sm:grid-cols-2">
                {[
                  { href: "#screener", n: "1", label: "Check your household", desc: "Per-person results in about a minute" },
                  { href: "#whats-changing", n: "2", label: "Review upcoming rule changes", desc: "Three changes land by January 2027" },
                  { href: "#status-table", n: "3", label: "Compare immigration statuses", desc: "Nine statuses × ten programs" },
                  { href: "#public-charge", n: "4", label: "Understand public charge", desc: "What actually counts, and when" },
                ].map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl border border-ink-900/10 px-3 py-2 transition hover:border-brand-300 hover:bg-brand-50/40"
                    >
                      <span
                        aria-hidden
                        className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                      >
                        {s.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-ink-900">{s.label}</span>
                        <span className="block text-xs text-ink-500">{s.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </section>

          {/* ---------------- The tool ---------------- */}
          <section id="screener" data-screener className="scroll-mt-24">
            <h2 className="sr-only">Benefits eligibility screener</h2>
            <BenefitsScreener />
          </section>

          {/* ---------------- What's changing ---------------- */}
          <section id="whats-changing" className="scroll-mt-24 space-y-4">
            <H2 id="whats-changing-h">What&rsquo;s changing in 2026 and 2027</H2>
            <P>
              This is an unusually active period. Four federal changes land between January 2026 and
              January 2027, and three of them narrow eligibility for specific immigrant groups. If
              you read an article about immigrant benefits written before 2026, assume parts of it
              are now wrong.
            </P>
            <BenefitsTimeline />

            <Callout kind="tip" title="Already filed?">
              {publicCharge.filingDateProtection} That is a rule about your{" "}
              <strong>filing date</strong>. A separate rule covers your{" "}
              <strong>receipt date</strong>: benefits received before September 18, 2026 are
              treated consistently with the 2022 rule. The two are different tests — see{" "}
              <A href="#public-charge">public charge explained</A>.
            </Callout>

            <Callout kind="note" title="Why this page keeps saying 'before' and 'after' September 18, 2026">
              Because the public-charge rule genuinely has two regimes, and which one applies to you
              depends on when you received a benefit and when you file. Getting that distinction
              right is the difference between an accurate answer and a scary, wrong one.
            </Callout>
          </section>

          {/* ---------------- Status table ---------------- */}
          <section id="status-table" className="scroll-mt-24 space-y-4">
            <H2 id="status-table-h">Benefits by immigration status</H2>
            <P>
              Read this as a starting point, not a verdict. The labels are deliberately hedged
              because the underlying law is conditional — a yes/no grid would be easier to read and
              more often wrong. Income and state rules still decide most outcomes.
            </P>
            <StatusMatrix
              columns={statusTableCols}
              rows={statusTableRows}
              caption="Labels: 'Often eligible' means the status usually clears the status test, subject to income and state rules. 'May be eligible' means it depends on facts we can't see. 'Usually not eligible' means the status test is generally not met — exceptions in the last column. 'State-dependent' and 'work-history dependent' mean exactly what they say."
              emphasise={["Green card holder, under 5 years", "H-1B / L-1 and dependents (H-4, L-2)"]}
            />
            <Callout kind="mistake" title="The mistake this table exists to prevent">
              Families look at the H-1B row, see &ldquo;usually not eligible&rdquo; across the
              means-tested columns, and conclude the household gets nothing. Then look at the last
              row. The same household&rsquo;s U.S.-citizen children are often eligible for Medicaid,
              CHIP, SNAP, WIC and school meals. Two rows, one family, completely different answers.
            </Callout>
          </section>

          {/* ---------------- Citizens ---------------- */}
          <section id="citizens" className="scroll-mt-24 space-y-4">
            <H2 id="citizens-h">U.S. citizen benefits</H2>
            <P>
              U.S. citizens — whether born here or naturalized — have the broadest access. There is
              no public-charge test, no five-year waiting period, and no qualified-immigrant test.
              What remains are the ordinary rules everyone faces: income limits, state rules, work
              history for earned benefits, and program-specific tests.
            </P>
            <P>
              Naturalized citizens are treated identically to U.S.-born citizens for every benefit
              program. Nothing about benefit use before naturalization carries forward, and lawfully
              receiving a benefit you qualified for is not a bar to naturalization in the first
              place.
            </P>
            <Callout kind="insight" title="The one thing that still matters after naturalizing">
              If you signed a Form I-864 to sponsor a relative, becoming a citizen does not end{" "}
              <em>your</em> obligation as a sponsor. It ends when the person you sponsored
              naturalizes or is credited with 40 qualifying quarters — see the{" "}
              <A href="#i864">sponsor section</A>.
            </Callout>
          </section>

          {/* ---------------- Green card ---------------- */}
          <section id="green-card" className="scroll-mt-24 space-y-4">
            <H2 id="green-card-h">Green card holder benefits</H2>
            <P>
              Permanent residents are &ldquo;qualified immigrants,&rdquo; which opens the door to
              most federal programs. The door is not always open on day one. Several programs apply
              a five-year waiting period from the date you got qualified status, and{" "}
              <strong>SSI applies a harder rule still</strong>.
            </P>
            <P>
              The programs that do <em>not</em> make you wait are the ones you earned or claim
              through tax: Social Security, Medicare, unemployment, and tax credits all turn on your
              work record or your tax return, not on how long you have held the card.
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactChip f={benefitFacts.fiveYearBar} />
              <FactChip f={benefitFacts.i864End} />
            </div>
            <Callout kind="mistake" title="Green card renewal is not an immigration application">
              Renewing with Form I-90 is a document replacement. You are already a permanent
              resident, you are not seeking admission, and there is no public-charge test. Read{" "}
              <A href="/green-card-renewal">the renewal guide</A> if that is your actual question.
            </Callout>
          </section>

          {/* ---------------- Visa holders ---------------- */}
          <section id="visa-holders" className="scroll-mt-24 space-y-4">
            <H2 id="visa-holders-h">Benefits for H-1B, H-4, L-1, F-1 and other visa holders</H2>
            <P>
              Work and student visa holders are <strong>lawfully present</strong> but are not{" "}
              <strong>qualified immigrants</strong>. That single distinction explains almost
              everything. &ldquo;Lawfully present&rdquo; is the test for Marketplace insurance.
              &ldquo;Qualified immigrant&rdquo; is the test for SNAP, Medicaid, TANF and SSI. Visa
              holders clear the first and not the second.
            </P>
            <P>So what is actually available? More than most H-1B families assume:</P>
            <ul className="space-y-2">
              {[
                "Marketplace health insurance — you are lawfully present, so you can buy a plan.",
                "Premium tax credits for 2026, if household income is at least 100% of the poverty guideline. This changes on January 1, 2027.",
                "Social Security and Medicare credits — you pay the payroll taxes, and those credits are yours.",
                "Tax credits including the Child Tax Credit, if you file with a valid SSN and your child has one.",
                "Emergency Medicaid, WIC, school meals and community health centers — none of these use the qualified-immigrant test.",
                "Unemployment, in some circumstances and some states — see the unemployment section for the real obstacle.",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-[15px] leading-relaxed text-ink-700">
                  <span aria-hidden className="mt-1 flex-none text-brand-500">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <WarnBox title="Time-sensitive for H-1B, H-4, L-1, L-2, F-1 and J families">
              For tax years beginning after December 31, 2026, the premium tax credit is limited to
              green card holders, Cuban/Haitian entrants, and COFA residents. Work and student visa
              families can still buy a Marketplace plan — at full price. If your household relies on
              an ACA subsidy, build that into your 2027 budget now, and read the{" "}
              <A href="/h1b-layoff">H-1B layoff checklist</A> if your job situation is also uncertain.
            </WarnBox>
          </section>

          {/* ---------------- Citizen children ---------------- */}
          <section id="citizen-children" className="scroll-mt-24 space-y-4">
            <H2 id="citizen-children-h">Benefits for U.S.-citizen children of visa holders</H2>
            <P>
              A child born in the United States is a U.S. citizen. Their benefit eligibility is
              assessed on <em>their</em> status — not their parents&rsquo;. An H-1B parent and an
              H-4 parent can be outside every federal means-tested program while their citizen
              children are squarely inside Medicaid, CHIP, SNAP, WIC and school meals, if household
              income qualifies.
            </P>
            <P>
              This is the single most valuable thing on this page for a work-visa family, and it is
              the thing families most often get wrong — usually because someone told them
              &ldquo;immigrants can&rsquo;t get benefits&rdquo; and they never checked whether that
              applied to their children.
            </P>
            <Callout kind="example" title="How this plays out — an educational illustration">
              Consider an H-1B parent, an H-4 spouse, and two U.S.-citizen children. On the
              parents&rsquo; side: no SNAP, no federal Medicaid, no SSI — but Marketplace coverage,
              Social Security credits accruing, and the Child Tax Credit if they file with valid
              SSNs. On the children&rsquo;s side: potentially Medicaid or CHIP, potentially SNAP,
              WIC while under 5, and school meals — all decided by household income and state rules.
              Same household, same income, two different answers. This is an illustration of how the
              rules interact, not a statement that any particular family qualifies — only the agency
              can determine that.
            </Callout>
            <Callout kind="note" title="Applying only for your child">
              Agencies ask about the immigration status of the person seeking benefits. When you
              apply only for your child, that is the child. Non-applicant parents are generally
              asked for identity and income information so the agency can size the household and
              verify income — not for their own immigration status.
            </Callout>
          </section>

          {/* ---------------- Mixed status ---------------- */}
          <section id="mixed-status" className="scroll-mt-24 space-y-4">
            <H2 id="mixed-status-h">Mixed-status immigrant family rules</H2>
            <P>
              A mixed-status family is one household containing people with different immigration
              statuses — which, in practice, describes a large share of immigrant families. The
              governing principle is simple and worth repeating: <strong>eligibility is
              individual</strong>. One ineligible adult does not make an eligible child ineligible.
            </P>
            <P>
              Three practical consequences. First, apply for the people who may qualify rather than
              for &ldquo;the household.&rdquo; Second, an ineligible member&rsquo;s income usually
              still counts toward the household income calculation even though they cannot receive
              the benefit — that is written into the SNAP statute directly. Third, some programs
              prorate: federal housing assistance, for example, can be reduced in proportion to the
              eligible members rather than refused outright.
            </P>
          </section>

          {/* ---------------- Healthcare ---------------- */}
          <section id="healthcare" className="scroll-mt-24 space-y-4">
            <H2 id="healthcare-h">Healthcare benefits for immigrants</H2>
            <P>
              Healthcare is where immigration status matters most, and where the 2026–27 changes
              bite hardest. There are really five separate doors, and they have different locks.
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactChip f={povertyGuidelinesFact} />
              <FactChip f={benefitFacts.medicareResidency} />
            </div>
            <h3 className="pt-2 text-lg font-bold text-ink-900">Marketplace (ACA) and the premium tax credit</h3>
            <P>
              The Marketplace door is open to anyone lawfully present — including every work and
              student visa category. The subsidy door is narrowing. For 2026, a lawfully present
              household with income at or above 100% of the poverty guideline can generally claim
              the premium tax credit. Below 100%, the pathway that used to help was repealed
              effective for tax years beginning after December 31, 2025 — so very low income now
              means <em>no</em> credit rather than more help. From tax year 2027, only green card
              holders, Cuban/Haitian entrants and COFA residents remain eligible for the credit at all.
            </P>
            <h3 className="pt-2 text-lg font-bold text-ink-900">Medicaid and CHIP</h3>
            <P>
              Medicaid uses the qualified-immigrant test plus, for many adults, the five-year bar,
              and then a state-set income limit on top. Many states take the federal option to cover
              lawfully residing children and pregnant people without the wait. From October 1, 2026,
              federal Medicaid payment is limited to citizens, green card holders, Cuban/Haitian
              entrants and COFA residents — with Emergency Medicaid and the children/pregnancy state
              option expressly preserved.
            </P>
            <h3 className="pt-2 text-lg font-bold text-ink-900">Emergency Medicaid and health centers</h3>
            <P>
              Emergency Medicaid covers treatment of an emergency condition regardless of
              immigration status, and community health centers see patients on a sliding scale with
              no status test at all. Nobody should avoid emergency care over an immigration concern.
            </P>
            <h3 className="pt-2 text-lg font-bold text-ink-900">Medicare</h3>
            <P>
              Medicare is earned. At 65+ with 40 quarters of covered work, a green card holder gets
              premium-free Part A on the same terms as a citizen. Short of 40 quarters, a green card
              holder aged 65+ with five years of continuous permanent residence can generally buy in
              by paying a Part A premium.
            </P>
          </section>

          {/* ---------------- Food ---------------- */}
          <section id="food" className="scroll-mt-24 space-y-4">
            <H2 id="food-h">Food and child benefits</H2>
            <P>
              SNAP changed substantially on July 4, 2025, and this is the change most articles
              still have wrong. SNAP now requires <strong>two</strong> things at the same time. First,
              a status on a narrow list: U.S. citizen or national, green card holder, Cuban/Haitian
              entrant, or COFA resident. Second, an exception to the five-year bar — being under 18,
              having 40 qualifying quarters, military service, receiving disability benefits, or five
              years as a qualified immigrant.
            </P>
            <P>
              The practical effect is blunt: refugees, asylees, people granted withholding, and
              parolees are no longer eligible for SNAP by virtue of those statuses, even though they
              remain qualified immigrants for other programs. Adjusting to a green card can restore
              eligibility.
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactChip f={benefitFacts.snapQuarters} />
            </div>
            <Callout kind="insight" title="WIC and school meals do not ask about status">
              WIC has no immigration status requirement, and school meals are available to enrolled
              children — federal law preserves that access for anyone eligible for public education.
              On public charge: WIC and school meals received before September 18, 2026 are excluded
              under the 2022 framework. Beginning September 18, the rule no longer provides a
              categorical regulatory exclusion for means-tested programs, but receipt still does not
              automatically produce a public-charge finding, and benefits received by a child
              generally are not treated as benefits received by a parent.
            </Callout>
            <WarnBox title="Do not cancel nutrition assistance based on general online information">
              The rule does not direct or require anyone to disenroll from means-tested public
              benefits. If the adjustment applicant personally receives a means-tested benefit that
              will continue after September 18, obtain individualized advice before making a change
              — do not act on a web page alone.
            </WarnBox>
            <P>
              TANF is the exception in this section. It is <strong>cash assistance</strong>, one of
              the limited categories USCIS considers under the 2022 framework and a means-tested
              benefit that may be considered under the framework beginning September 18, 2026.
              Receipt is one factor and does not automatically result in denial. If anyone in the
              household has an admission or adjustment filing ahead, get individualized advice
              before applying for cash aid specifically.
            </P>
          </section>

          {/* ---------------- Unemployment ---------------- */}
          <section id="unemployment" className="scroll-mt-24 space-y-4">
            <H2 id="unemployment-h">Unemployment after an H-1B or other visa job loss</H2>
            <P>
              Unemployment insurance is an earned, state-run benefit funded by employer taxes. It is
              not means-tested public assistance, it has no five-year bar, and it is not counted
              under the public-charge rule. Green card holders and citizens who meet the ordinary
              tests generally qualify.
            </P>
            <P>
              For H-1B and other work-visa holders the answer is genuinely
              &ldquo;state-dependent,&rdquo; and understanding <em>why</em> helps. There are two
              tests. The first — was the work performed while lawfully present and authorized? — is
              usually satisfied. The second is the obstacle: you must be able, available, and{" "}
              <strong>legally authorized to work now</strong>. When an H-1B job ends, work
              authorization typically ends with it unless you are within a grace period or have a
              pending change of status. That is why many states deny.
            </P>
            <Callout kind="tip" title="What to actually do">
              File the claim and let the state agency decide. An assumption is not a determination,
              the rules vary by state, and a denial costs you nothing but time. In parallel, treat
              the status question as the urgent one — the job loss affects your immigration status
              directly, which matters far more than the benefit. Start with the{" "}
              <A href="/h1b-layoff">H-1B layoff checklist</A>.
            </Callout>
          </section>

          {/* ---------------- Social Security ---------------- */}
          <section id="social-security" className="scroll-mt-24 space-y-4">
            <H2 id="social-security-h">Social Security and Medicare for immigrants</H2>
            <P>
              These are earned benefits. You paid in through payroll taxes and you draw out based on
              your own record. There is no five-year bar, no means test, and no public-charge
              consequence. If you have worked in the U.S. and paid Social Security tax under an SSN
              valid for work, you have been building credits.
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactChip f={benefitFacts.ssQuarters} />
              <FactChip f={benefitFacts.medicareResidency} />
            </div>
            <P>
              Disability and survivor benefits work off the same record. SSDI can require fewer
              credits depending on your age when you became disabled, and survivor benefits pay a
              worker&rsquo;s family from the worker&rsquo;s record. These are different from SSI —
              which despite the similar name is means-tested, is much harder for immigrants, and{" "}
              <strong>is</strong> counted under public charge.
            </P>
            <Callout kind="crossborder" title="For Indian nationals specifically">
              The United States and India do not currently have a totalization agreement in force.
              That means U.S. and Indian coverage cannot be combined to reach 40 credits, and it is
              a common source of disappointment for people who split a career between the two
              countries. If you are planning a return, the{" "}
              <A href="/india-tax-compliance">tax and compliance hub</A> covers the wider picture.
            </Callout>
          </section>

          {/* ---------------- Tax credits ---------------- */}
          <section id="tax-credits" className="scroll-mt-24 space-y-4">
            <H2 id="tax-credits-h">Tax credits available to immigrant families</H2>
            <P>
              Tax credits are claimed through the tax system rather than traditional benefit
              agencies. Under the 2022 public-charge rule, tax credits were not considered.
              Beginning September 18, 2026, however, DHS permits officers to consider means-tested
              tax credits received by an applicant as one factor in the totality of the
              circumstances. Claiming a tax credit does not automatically result in a public-charge
              finding.
            </P>
            <P>
              Eligibility itself is unchanged: tax credits follow tax rules, not the
              qualified-immigrant test — which is why an H-1B family that cannot get SNAP can often
              claim the Child Tax Credit.
            </P>
            <Callout kind="note" title="Two separate questions">
              Tax eligibility and public-charge treatment are separate questions. A family may
              legally qualify for a credit even when its receipt could be reviewed in a later
              public-charge determination. DHS also notes that means-tested credits reach both
              low- and middle-income families and &ldquo;may not always be indicative of a lack of
              self-sufficiency&rdquo; — consideration of tax credits is, in the rule&rsquo;s own
              words, &ldquo;just one aspect of one consideration in the totality of the
              circumstances.&rdquo; See the final rule&rsquo;s discussion of tax credits in its
              response to comments (section on Tax Credits),{" "}
              <Ext href={publicCharge.ruleUrl}>DHS final rule {publicCharge.ruleDocNumber}</Ext>.
            </Callout>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactChip f={benefitFacts.ctcMax} />
              <FactChip f={benefitFacts.actcMax} />
              <FactChip f={benefitFacts.eitcMax3Kids} />
            </div>
            <P>
              The gate for most of these is the Social Security number. The Child Tax Credit needs a
              child with an SSN valid for employment — a child with an ITIN is not a qualifying
              child — and, beginning with tax year 2025, the filer needs a valid SSN too (on a joint
              return, at least one spouse). The EITC is stricter: SSNs valid for employment for the
              filer, the spouse, and every qualifying child. ITIN filers cannot claim the EITC.
            </P>
            <Callout kind="reminder" title="An ITIN household is not shut out">
              The EITC and CTC have hard SSN requirements. Several other credits do not — the Child
              and Dependent Care Credit, education credits, and the Saver&rsquo;s Credit follow
              different rules. Do not assume an ITIN means no credits at all. Have a preparer check.
            </Callout>
          </section>

          {/* ---------------- College ---------------- */}
          <section id="college" className="scroll-mt-24 space-y-4">
            <H2 id="college-h">College aid and FAFSA eligibility</H2>
            <P>
              Federal student aid uses its own list — &ldquo;eligible noncitizens&rdquo; — which is
              narrower than lawfully present but is not the qualified-immigrant test either. Green
              card holders and conditional permanent residents are eligible noncitizens, as are
              people whose I-94 shows Refugee, Asylum Granted, or Parolee, plus certain T-visa
              holders. There is no five-year bar for federal student aid: a new green card holder can
              file the FAFSA immediately.
            </P>
            <P>
              F-1, J-1, H-1B, H-4 and L-1 students are not eligible noncitizens and generally cannot
              get federal grants or loans. That does not end the conversation. Institutional and
              private scholarships set their own rules, and <strong>in-state tuition is state
              law</strong> — several states grant it based on where the student attended high school
              rather than on immigration status. The{" "}
              <A href="/education">education hub</A> has the wider college-cost picture.
            </P>
          </section>

          {/* ---------------- Housing ---------------- */}
          <section id="housing" className="scroll-mt-24 space-y-4">
            <H2 id="housing-h">Housing and utility assistance</H2>
            <P>
              Federal rental assistance — Housing Choice Vouchers and public housing — is run by
              local housing agencies and uses its own eligible-status list. Mixed-status families can
              often receive prorated assistance based on the eligible members rather than being
              refused outright.
            </P>
            <P>
              Be realistic about the practical barrier: waiting lists are long, frequently closed,
              and often measured in years. That is a bigger obstacle than eligibility for most
              families. LIHEAP, which helps with energy bills, is state-run with its own income test
              and a funding pot that commonly runs out — apply as early in the season as possible.
              Neither is counted under the 2022 public-charge rule.
            </P>
          </section>

          {/* ---------------- Five year ---------------- */}
          <section id="five-year" className="scroll-mt-24 space-y-4">
            <H2 id="five-year-h">The green card five-year waiting period and exceptions</H2>
            <P>
              The five-year bar makes many qualified immigrants wait five years from the date they
              obtained qualified status before receiving certain federal means-tested benefits —
              principally Medicaid and SNAP. It comes from the 1996 welfare law, and it is the
              source of the widespread belief that green card holders &ldquo;get nothing for five
              years.&rdquo; That belief is too pessimistic.
            </P>
            <P>The bar does not apply to:</P>
            <ul className="space-y-2">
              {[
                "Earned benefits — Social Security, Medicare, unemployment. These follow your work record.",
                "Tax credits — these follow your tax return.",
                "Marketplace coverage — this follows lawful presence.",
                "Federal student aid — a new green card holder can file the FAFSA immediately.",
                "Emergency Medicaid, WIC, school meals, community health centers.",
                "Children under 18, for SNAP specifically.",
                "People credited with 40 qualifying quarters of work.",
                "Military-connected families — veterans, active duty, and their spouses and dependent children.",
                "Refugees and asylees, who are exempt from the bar (though SNAP now excludes them on other grounds).",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-[15px] leading-relaxed text-ink-700">
                  <span aria-hidden className="mt-1 flex-none text-emerald-500">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <WarnBox title="SSI is the exception to the exceptions">
              SSI is harder than everything else here. A green card holder who entered on or after
              August 22, 1996 is generally not eligible for SSI for the first five years as a
              permanent resident <em>even with 40 quarters</em>. Most permanent residents reach SSI
              only through 40 qualifying quarters (where a spouse&rsquo;s or parent&rsquo;s work can
              count) or through military service. SSI is also cash — so it is counted under public
              charge, and it is reimbursable by an I-864 sponsor.
            </WarnBox>
          </section>

          {/* ---------------- PUBLIC CHARGE ---------------- */}
          <section id="public-charge" className="scroll-mt-24 space-y-4">
            <H2 id="public-charge-h">Could using benefits affect my green card or visa?</H2>
            <P>
              Usually far less than people fear — and the honest answer right now has two halves,
              because the rule is mid-transition.
            </P>
            <P>
              Public charge is a ground of inadmissibility used to determine whether someone
              applying for <strong>admission</strong> or <strong>adjustment of status</strong> is
              likely at any time to become a public charge. Beginning September 18, 2026, officers
              will make an individualized determination based on the totality of the
              applicant&rsquo;s circumstances, without the 2022 rule&rsquo;s &ldquo;primarily
              dependent&rdquo; standard. It is not a test applied to green card renewal, and it is
              not applied at naturalization.
            </P>
            <P>
              Lawfully receiving a benefit does not automatically make someone deportable.
              Public-charge inadmissibility and the separate, narrowly defined public-charge
              deportability provisions are different legal issues.
            </P>

            <h3 className="pt-2 text-lg font-bold text-ink-900">Who it applies to, and who is exempt</h3>
            <P>
              It applies to people seeking admission or filing adjustment of status. Congress
              exempted several categories outright — refugees, asylees, VAWA self-petitioners, T and
              U nonimmigrants, and others. If you are in an exempt category, benefit use should not
              create a public-charge problem for that application.
            </P>
            <P>
              Lawfully receiving a benefit does not automatically make someone deportable.
              Public-charge inadmissibility and the separate, narrowly defined public-charge
              deportability provisions are different legal issues.
            </P>

            <h3 className="pt-2 text-lg font-bold text-ink-900">
              Benefits received before September 18, 2026
            </h3>
            <P>
              The 2022 framework governs, and it is narrow. Only two categories are considered —
              and even then, receipt is one factor and is not automatically decisive:
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                  Considered under the 2022 framework
                </p>
                <ul className="mt-2 space-y-1.5">
                  {publicCharge.countedBefore.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-ink-700">
                      <span aria-hidden className="mt-0.5 flex-none text-rose-500">✕</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Excluded under the 2022 framework
                </p>
                <ul className="mt-2 space-y-1.5">
                  {publicCharge.excludedUnder2022.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-ink-700">
                      <span aria-hidden className="mt-0.5 flex-none text-emerald-500">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 className="pt-2 text-lg font-bold text-ink-900">
              Benefits received on or after September 18, 2026
            </h3>
            <P>
              DHS removes the 2022 rule&rsquo;s regulations and does{" "}
              <strong>not replace them with a new list</strong>. Officers make an individualized,
              case-by-case assessment of the totality of the circumstances, weighing the statutory
              minimum factors — {publicCharge.statutoryFactors.join(", ").toLowerCase()} — plus any
              Form I-864, plus an applicant&rsquo;s receipt of means-tested public benefits. There is
              no regulatory definition of which benefits count, and{" "}
              <strong>no single benefit automatically determines the outcome</strong>.
            </P>
            <P>
              Non-means-tested earned benefits — {publicCharge.earnedOutsideCategory.join(", ")} —
              remain outside that means-tested category.
            </P>
            <Callout kind="tip" title="How to read any 'what counts after September 2026' list you find online">
              Skeptically. DHS deliberately declined to define which means-tested benefits officers
              may weigh — that discretion is the point of the rule. Any site publishing a confident
              counts/doesn&rsquo;t-count table for the new framework is telling you something the
              government has not said.
            </Callout>

            <h3 className="pt-2 text-lg font-bold text-ink-900">
              Two different transition rules — do not mix them up
            </h3>
            <P>
              People routinely merge these. They are separate tests answering separate questions.
            </P>
            <DataTable
              columns={[
                { key: "q", label: "Which date?" },
                { key: "what", label: "What it decides", highlight: true },
                { key: "rule", label: "The rule" },
              ]}
              rows={[
                {
                  q: "Your FILING date",
                  what: "Which framework governs your application",
                  rule: "An adjustment application properly postmarked or electronically submitted and accepted before September 18, 2026 continues under the 2022 rule — even if it is still pending long after that date.",
                },
                {
                  q: "Your RECEIPT date",
                  what: "Which benefits an officer may weigh",
                  rule: "Benefits received before September 18, 2026 are treated consistently with the 2022 rule. Receipt of means-tested benefits by the applicant on or after that date may be considered in the totality of the circumstances.",
                },
              ]}
              caption="A family can be protected by one of these and not the other. Read them separately."
            />

            <WarnBox title="The protection most coverage misses">
              The rule states that receipt of means-tested benefits{" "}
              <strong>before the effective date will be considered consistently with the 2022
              Final Rule</strong>. With the single exception of Medicaid-funded long-term
              institutionalization, officers will not consider non-cash benefits received before
              September 18, 2026 — including applications or approvals from before that date. There
              is one caveat worth understanding: where someone was approved for benefits covering a
              period extending past the effective date and there is no evidence of disenrollment or
              withdrawal, receipt occurring on or after the date can be considered. If that describes
              you and you have a filing coming up, that is a question for an attorney — not a reason
              to panic-cancel coverage your family needs.
            </WarnBox>

            <h3 className="pt-2 text-lg font-bold text-ink-900">Whose benefits count?</h3>
            <P>
              Generally only the applicant&rsquo;s own. DHS states officers are not directed to
              consider a family member&rsquo;s receipt of public benefits unless that family member
              is themselves applying and subject to public charge. So benefits received by your
              U.S.-citizen child are generally not weighed against you.
            </P>
            <P>
              There is one indirect route to understand rather than fear: your own income is a
              mandatory factor, so if the record shows that family members you are legally obliged to
              support receive means-tested benefits <em>because your income falls below a
              threshold</em>, that fact can inform the assessment of your financial status. That is a
              judgment about your income — not a penalty for your child&rsquo;s benefit.
            </P>

            <WarnBox title="A filing detail that matters more than the benefit">
              The revised Form I-485 instructions require applicants to{" "}
              <strong>exclude</strong> income received from means-tested public benefits when
              reporting household income. Incorrectly including that income may raise a
              misrepresentation issue. Applicants should follow the current form instructions or
              obtain individualized legal assistance. Note also that USCIS is issuing a revised Form
              I-485; older editions will not be accepted on or after the effective date.
            </WarnBox>

            <h3 className="pt-2 text-lg font-bold text-ink-900">Returning after a long trip abroad</h3>
            <P>
              A permanent resident returning from a brief trip is generally not treated as seeking a
              new admission. An extended absence can change that analysis. If you have been outside
              the U.S. for a long stretch and have used benefits, get individualized advice before
              you travel back rather than after you land.
            </P>

            <h3 className="pt-2 text-lg font-bold text-ink-900">A short decision tree</h3>
            <DecisionFlow
              title="Is public charge actually your question?"
              nodes={[
                { text: "Are you applying for admission, a visa, or adjustment of status?", kind: "start", branch: "No → public charge does not apply. Renewal and naturalization are outside it." },
                { text: "Are you in an exempt category (refugee, asylee, VAWA, T/U, and others)?", kind: "decision", branch: "Yes → exempt from the public-charge ground." },
                { text: "Who is actually receiving the benefit?", kind: "decision", branch: "A family member who is not applying → generally not considered." },
                { text: "Is the benefit cash assistance (SSI, TANF, General Assistance) or long-term institutional care?", kind: "decision", branch: "No, and received before Sept 18, 2026 → not counted under the 2022 rule." },
                { text: "Is an I-864 sponsor reimbursement question mixed in? It is a separate issue — a debt, not an admissibility bar.", kind: "action" },
                { text: "Have an immigration attorney or DOJ-accredited representative review the facts.", kind: "end" },
              ]}
            />

            <Callout kind="note" title="Please read this before you cancel anything">
              Do not avoid healthcare, food, or children&rsquo;s benefits out of fear alone. The
              chilling effect of misunderstanding these rules has historically done more harm to
              immigrant families than the rules themselves — most often to U.S.-citizen children who
              were entitled to help all along. Learn the actual rule, and take an uncertain case to a
              qualified immigration attorney or DOJ-accredited representative.
            </Callout>
          </section>

          {/* ---------------- I-864 ---------------- */}
          <section id="i864" className="scroll-mt-24 space-y-4">
            <H2 id="i864-h">Form I-864 sponsor-repayment risk</H2>
            <P>
              This is a different thing from public charge, and conflating the two causes real
              confusion. A sponsor who signs Form I-864 makes a legally enforceable contract with the
              U.S. government promising to support the immigrant. If the sponsored immigrant receives
              a federal means-tested public benefit, the agency that paid it can ask the sponsor to
              reimburse it — and can sue if the sponsor refuses.
            </P>
            <DataTable
              columns={[
                { key: "q", label: "Question" },
                { key: "pc", label: "Public charge", highlight: true },
                { key: "i864", label: "I-864 sponsor reimbursement", highlight: true },
              ]}
              rows={[
                { q: "What is it?", pc: "A ground of inadmissibility — whether an applicant is likely at any time to become a public charge, judged on the totality of their circumstances", i864: "A contract debt — a sponsor's promise to repay certain benefits" },
                { q: "Who decides?", pc: "USCIS or a consular officer", i864: "The benefit-granting agency, and ultimately a court" },
                { q: "When?", pc: "At admission or adjustment of status — looking forward", i864: "After a benefit has been paid — looking backward" },
                { q: "Who bears it?", pc: "The immigrant applicant", i864: "The sponsor" },
                { q: "Consequence", pc: "The application can be denied — but no single benefit automatically causes denial", i864: "The sponsor may owe money. It cannot block a green card" },
                { q: "Which benefits?", pc: "Cash aid + long-term institutional care for receipt before Sept 18, 2026; means-tested benefits may be considered for receipt on or after, as one factor", i864: "Federal means-tested benefits — commonly SNAP, non-emergency Medicaid, SSI, TANF, CHIP" },
                { q: "When does it end?", pc: "It is a one-time test at the application", i864: "At citizenship, 40 qualifying quarters, death, or loss of LPR status + departure" },
              ]}
              caption="Two different legal tracks that families routinely merge into one fear. You can face one, both, or neither."
            />
            <Callout kind="mistake" title="Divorce does not end an I-864 obligation">
              This surprises sponsors constantly. The contract is with the U.S. government, not with
              the spouse. It ends at citizenship, 40 qualifying quarters, death, or the immigrant
              losing permanent residence and departing — not at divorce.
            </Callout>
          </section>

          {/* ---------------- State ---------------- */}
          <section id="state-benefits" className="scroll-mt-24 space-y-4">
            <H2 id="state-benefits-h">Why your state can change the answer</H2>
            <P>
              States can spend their own money on people federal rules exclude, and they can also
              narrow a program federal rules would allow. That is why a national answer to
              &ldquo;can immigrants get X?&rdquo; is close to useless, and why this page routes you
              to your state rather than guessing.
            </P>
            <P>
              Below are three specific, verified illustrations — one program each. We do not label
              any state &ldquo;generous&rdquo; or &ldquo;strict&rdquo;, because the first example
              shows the same state being broader for one group and narrower for another in the same
              year.
            </P>
            <div className="space-y-3">
              {stateExamples.map((s) => (
                <div key={s.state + s.program} className="rounded-2xl border border-ink-900/10 bg-white p-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                      {s.state}
                    </span>
                    <span className="text-sm font-bold text-ink-900">{s.program}</span>
                    <span className="text-xs text-ink-400">· {s.year}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    <span className="font-semibold text-ink-800">Who: </span>
                    {s.who}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{s.detail}</p>
                  <p className="mt-2 break-words text-xs text-ink-500">
                    <Ext href={s.sourceUrl}>{s.sourceName} ↗</Ext> · verified {s.lastVerified}
                  </p>
                </div>
              ))}
            </div>
            <Callout kind="note" title="Read these as examples, not summaries">
              {STATE_EXAMPLES_NOTE} Other things that vary by state and are worth checking directly:
              TANF design, LIHEAP application windows, child care subsidies, and in-state tuition —
              which several states key to where a student attended high school rather than to
              immigration status.
            </Callout>
          </section>

          {/* ---------------- Applying safely ---------------- */}
          <section id="applying-safely" className="scroll-mt-24 space-y-4">
            <H2 id="applying-safely-h">How to apply without giving sensitive information to unofficial websites</H2>
            <P>
              Every program on this page has an official application route, and every one of them is
              free to apply for. Sites that charge you to apply for a free benefit, or that harvest
              your details to sell as leads, are a real problem in this space.
            </P>
            <ul className="space-y-2">
              {[
                "Apply through .gov sites and your state agency — every link in the sources box below goes to one.",
                "Never pay to apply for a free benefit. Applications for SNAP, Medicaid, CHIP, WIC and unemployment are free.",
                "A benefit agency will not ask for your A-number to enroll a child who is a citizen.",
                "Be wary of anyone promising an eligibility 'guarantee' — no website can determine your eligibility, including this one.",
                "For immigration questions, use an attorney or a DOJ-accredited representative. Avoid notarios and unlicensed consultants.",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-[15px] leading-relaxed text-ink-700">
                  <span aria-hidden className="mt-1 flex-none text-brand-500">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- Documents ---------------- */}
          <section id="documents" className="scroll-mt-24 space-y-4">
            <H2 id="documents-h">Documents you commonly need</H2>
            <P>
              Gather these before you start. Incomplete applications are the most common reason for
              delay — more common than any eligibility problem.
            </P>
            <ul className="space-y-2">
              {documentsChecklist.map((t) => (
                <li key={t} className="flex gap-2 text-[15px] leading-relaxed text-ink-700">
                  <span aria-hidden className="mt-1 flex-none text-brand-500">☐</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------- Denied ---------------- */}
          <section id="denied" className="scroll-mt-24 space-y-4">
            <H2 id="denied-h">What to do if an application is denied</H2>
            <P>
              A denial is not the end, and it is frequently a paperwork problem rather than a status
              problem. Filing an appeal is not an immigration act and is not counted under public
              charge.
            </P>
            <ol className="space-y-2">
              {denialSteps.map((t, i) => (
                <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------- Program reference ---------------- */}
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
              Every program on this page, at a glance
            </h2>
            <DataTable
              columns={programCatalogCols}
              rows={programCatalogRows}
              caption="The public-charge column reflects the 2022 rule, which governs benefits received before September 18, 2026. After that date there is no regulatory list — see the public-charge section."
              keyRows={["TANF", "SSI"]}
            />
          </section>

          {/* ---------------- Sources ---------------- */}
          <section id="sources" className="scroll-mt-24 space-y-4">
            <H2 id="sources-h">Official sources and last verification date</H2>
            <P>
              Every rule on this page was checked against a primary government source on{" "}
              <strong>{RULES_LAST_VERIFIED_HUMAN}</strong>. Where a 2026 figure was not yet final, we
              show the year that applies rather than guessing. When a number matters to a decision,
              click through and confirm it.
            </P>
            <Callout kind="note" title="Guidance still to come">
              {publicCharge.guidanceNotice} The primary source for everything on this page about the
              new framework is{" "}
              <Ext href={publicCharge.ruleUrl}>
                DHS final rule {publicCharge.ruleDocNumber} (full text)
              </Ext>
              , which publishes in the Federal Register on {publicCharge.rulePublicationDate} at{" "}
              <Ext href={publicCharge.ruleFrUrl}>federalregister.gov/d/{publicCharge.ruleDocNumber}</Ext>
              . The statutory ground itself is{" "}
              <Ext href={publicCharge.statuteUrl}>INA §212(a)(4), 8 U.S.C. §1182(a)(4)</Ext>.
            </Callout>
            <OfficialSourceBox
              title="Official government sources"
              intro="Every link goes to a government agency or official program page — never to a commercial site that charges for a free application:"
              links={officialSourceLinks}
            />
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section id="faq" className="scroll-mt-24">
            <ToolFaq items={faqs} />
          </section>

          {/* ---------------- Next steps + related ---------------- */}
          <NextStep
            heading="What to do next"
            links={[
              { label: "Check your household", href: "#screener", primary: true },
              { label: "H-1B layoff checklist", href: "/h1b-layoff" },
              { label: "Green card renewal", href: "/green-card-renewal" },
              { label: "Immigration hub", href: "/immigration" },
            ]}
          />

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
              Related guides
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedGuideLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-card-hover"
                >
                  <p className="font-bold text-ink-900">{l.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{l.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <Callout kind="note" title="Get individual help">
            Consult a qualified immigration attorney or DOJ-accredited representative for
            immigration consequences. Contact the administering agency or a certified benefits
            counselor for official eligibility. The Department of Justice publishes a{" "}
            <Ext href="https://www.justice.gov/eoir/list-pro-bono-legal-service-providers">
              list of free and low-cost legal service providers
            </Ext>
            .
          </Callout>

          <AuthorReviewLine lastUpdated={GB_UPDATED_HUMAN} />

          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-ink-500">
            Reading time about {GB_READING_MINUTES} minutes. {OFFICIAL_SOURCES_REVIEWED} official
            sources reviewed. Financial and tax explanations on this site are reviewed by Deepak
            Middha, CA, Series 65 — credentials in accounting and investment advice, not immigration
            law or government-benefits administration. Nothing on this page is immigration advice.
          </p>

              <Newsletter />
            </div>
          </div>
        </Container>
        <BackToTop />
      </ToolFirstLayout>
    </>
  );
}
