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
  WarnBox,
  NextStep,
  ComparisonTable,
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
  lifeVsFaqs,
  termVsIulColumns,
  termVsIulRows,
  lifeInsuranceSourceLinks,
  lifeInsuranceSourceIntro,
  LIFE_SOURCE_HEADING,
  LIFE_BOTTOM_DISCLAIMER,
} from "@/data/lifeInsuranceData";

const PATH = "/term-vs-iul-for-indian-families-usa";
const META = lifeMeta(PATH);
const TITLE = "Term vs IUL for Indian Families in the U.S.: Which One Should You Review?";
const META_TITLE = "Term vs IUL for Indian Families in the U.S.";
const DESC =
  "Side-by-side comparison of term life insurance and indexed universal life (IUL) for Indian and NRI families in the U.S.: purpose, cost, cash value, complexity, tax treatment, best fit, main risks — plus example planning paths and a pre-agent checklist.";

export const metadata: Metadata = pageMetadata({ title: META_TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Comparison table", href: "#comparison" },
  { label: "When term is better", href: "#when-term" },
  { label: "When IUL may fit", href: "#when-iul" },
  { label: "Using both", href: "#both" },
  { label: "Planning paths", href: "#paths" },
  { label: "Checklist", href: "#checklist" },
  { label: "FAQ", href: "#faq" },
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
    faqJsonLd(lifeVsFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Wealth", url: "/long-term-nri-wealth" },
      { name: "Life Insurance", url: "/life-insurance-for-indian-families-usa" },
      { name: "Term vs IUL", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="term-vs-iul-for-indian-families-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Wealth", href: "/long-term-nri-wealth" },
          { label: "Life Insurance", href: "/life-insurance-for-indian-families-usa" },
          { label: "Term vs IUL" },
        ]}
        icon="⚖️"
        category="Wealth · Life Insurance"
        title="Term vs IUL for Indian Families in the U.S."
        hook="Term and IUL are not competitors — they are different tools. Term buys the most protection per dollar for a set period; IUL is permanent coverage with cash value, higher costs, and more moving parts. Here is the honest side-by-side, so you know which one to review with a licensed agent."
        accent="from-brand-600 to-indigo-600"
        badges={["Educational guide", "Plain English", "No signup", "Agent-ready checklist"]}
        sourceNote={<>Last updated: {META.modifiedHuman}. Features, costs, and tax treatment vary by insurer, contract, and state.</>}
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
        <section className="pt-6">
          <Container>
            <QuickAnswer
              question="Quick Answer: Which One Should You Review?"
              answer={
                <p>
                  For most Indian families in the U.S., the first review is term insurance sized to real obligations —
                  it solves the core problem (income replacement) at the lowest cost. IUL is worth reviewing only for
                  some families with basic protection already in place, consistent long-term funding capacity, and a
                  specific permanent-coverage or legacy goal. Some families end up using both.
                </p>
              }
              ctaText="Jump to the pre-agent checklist"
              ctaHref="#checklist"
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

        {/* 1. Comparison table */}
        <section id="comparison" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Term vs IUL: quick comparison</h2>
              <div className="mt-5">
                <ComparisonTable
                  columns={termVsIulColumns}
                  rows={termVsIulRows}
                  caption="An educational comparison of typical product behavior. Every policy is a contract — exact features, costs, and guarantees vary by insurer and state."
                />
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

        {/* 2. When term may be better */}
        <section id="when-term" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">When term may be the better review</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  If the main job is protecting your family's lifestyle while you earn — the mortgage, childcare,
                  college, and support for a spouse or parents — term usually does that job at the lowest cost, which
                  means you can afford <em>enough</em> coverage instead of a partial amount.
                </p>
              </div>
              <div className="mt-5">
                <ChecklistBox
                  title="Signals that point to term"
                  items={[
                    "Your primary need is income replacement during working and child-raising years.",
                    "Budget matters — you want maximum coverage per premium dollar.",
                    "Your obligations have an end date: kids become independent, the mortgage gets paid off.",
                    "You are still building your emergency fund and retirement basics.",
                    "You want a simple product you fully understand.",
                  ]}
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                The sizing framework lives in the{" "}
                <Link
                  href="/term-life-insurance-for-indian-families-usa"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  term life insurance guide
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* 3. When IUL may be worth reviewing */}
        <section id="when-iul" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">When IUL may be worth reviewing</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  IUL earns a careful, skeptical review — not an automatic purchase — when the basics are already done
                  and there is a genuine permanent need. It is never the right product because a seminar or a WhatsApp
                  forward said so.
                </p>
              </div>
              <div className="mt-5">
                <ChecklistBox
                  title="Signals that a review can make sense"
                  tone="brand"
                  items={[
                    "Basic protection is already in place (usually term sized to your obligations).",
                    "Emergency fund and retirement basics — 401(k) match, IRA/Roth options — are funded.",
                    "You want a death benefit that lasts for life, or you have estate / legacy goals.",
                    "You can fund the policy consistently for decades without straining the budget.",
                    "You are willing to understand caps, floors, participation rates, charges, loans, and MEC limits before signing.",
                  ]}
                />
              </div>
              <div className="mt-5">
                <WarnBox title="Remember what IUL is not">
                  <p>
                    IUL is not guaranteed tax-free wealth, not a promised investment return, and not a replacement for
                    retirement accounts. Loans and withdrawals reduce the death benefit and can create tax bills if the
                    policy lapses. The full breakdown is in the{" "}
                    <Link
                      href="/indexed-universal-life-iul-for-indian-families-usa"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      IUL guide for Indian families
                    </Link>
                    .
                  </p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Why some families use both */}
        <section id="both" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Why some families use both</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                <p>
                  The two products can do different jobs in the same plan: a large term policy carries the heavy
                  protection load during working years at low cost, while a smaller permanent policy covers a need that
                  never expires — final expenses, a legacy goal, or estate planning.
                </p>
                <p>
                  The combination is not automatically better. It costs more than term alone, and the permanent piece
                  carries all the IUL complexities. Whether the extra cost buys something your family actually needs is
                  exactly the question to put to a licensed agent — ideally priced both ways, in writing.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Example planning paths */}
        <section id="paths" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Example planning paths</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Three illustrative paths — education only, with generic reasoning rather than numbers or promises.
              </p>
              <div className="mt-5 space-y-4">
                <ExampleBox title="Path 1: Protection-first family">
                  <p>
                    A young family with kids, a mortgage, and one or two incomes puts all premium dollars into term
                    coverage sized to the full obligation list. Nothing is left underinsured for the sake of a
                    cash-value feature. Permanent products wait until protection, emergency savings, and retirement
                    basics are complete — which may be never, and that is fine.
                  </p>
                </ExampleBox>
                <ExampleBox title="Path 2: High-income family">
                  <p>
                    A dual-income household has maxed the 401(k) match, funds IRAs, holds a solid emergency fund, and
                    already carries adequate term coverage. With long-term dollars still unallocated and a legacy goal
                    in mind, they review a conservatively funded permanent policy — reading the guaranteed column,
                    the fee schedule, and the MEC limits before deciding, with their tax advisor in the loop.
                  </p>
                </ExampleBox>
                <ExampleBox title="Path 3: Return-to-India family">
                  <p>
                    A family planning to move back within five to ten years keeps the plan flexible: term coverage for
                    the U.S. years, with written confirmation from the insurer about what happens to the policy after
                    the move. They are cautious about any product that needs decades of U.S.-based funding to work, and
                    they fold the insurance question into their broader{" "}
                    <Link
                      href="/return-to-india-checklist"
                      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      return to India checklist
                    </Link>
                    .
                  </p>
                </ExampleBox>
              </div>
            </div>
          </Container>
        </section>

        {/* Agent CTA */}
        <section className="py-10">
          <Container>
            <AgentCTA checklistHref="#checklist" />
          </Container>
        </section>

        {/* 6. Final checklist */}
        <section id="checklist" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Final checklist before speaking with an agent</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Walk in with this done and the meeting becomes a review, not a pitch.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ChecklistBox
                  title="Know your numbers"
                  tone="brand"
                  items={[
                    "Your obligation list: income years, mortgage/rent, childcare, college, debts, family support.",
                    "Existing coverage: employer group life and any India policies.",
                    "The years the need must last — and which needs are permanent, if any.",
                    "A monthly premium budget you can sustain for the full commitment.",
                  ]}
                />
                <ChecklistBox
                  title="Know your questions"
                  items={[
                    "Verify the agent's state license before the meeting.",
                    "Ask for term and any permanent option priced side by side.",
                    "For any IUL: guaranteed column, all charges, loan terms, and MEC limits — in writing.",
                    "Ask what happens to each policy if you move back to India.",
                    "Never cancel an existing policy until a replacement is in force and reviewed.",
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
            <ToolFaq items={lifeVsFaqs} />
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
                { label: "Size your term coverage", href: "/term-life-insurance-for-indian-families-usa", primary: true },
                { label: "How IUL works (and its risks)", href: "/indexed-universal-life-iul-for-indian-families-usa" },
                { label: "Free Immigrant Wealth Guide", href: "/free-immigrant-wealth-guide" },
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
