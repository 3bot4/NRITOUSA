import type { Metadata } from "next";
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
  ProseSections,
  WarnBox,
  DataTable,
  ComparisonTable,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  trumpAccountWebAppJsonLd,
  trumpAccountArticleJsonLd,
  trumpAccountAuthorJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
  TRUMP_ACCOUNT_UPDATED,
  TRUMP_ACCOUNT_UPDATED_HUMAN,
} from "@/lib/trumpAccountCluster";
import {
  accountComparisonColumns,
  accountComparisonRows,
  decision529Cols,
  decision529Rows,
  trumpAccountSourceLinks,
  vs529Faqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-vs-529-for-h1b-families";
const TITLE = "Trump Account vs 529 Plan for H-1B and Indian Families: Which Is Better?";
const DESC =
  "Compare Trump Accounts and 529 plans for H-1B and Indian immigrant families. See which works better for U.S. education, studying in India, moving back, taxes, and flexibility.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Decision table", href: "#decision" },
  { label: "When 529 wins", href: "#when-529" },
  { label: "When Trump wins", href: "#when-trump" },
  { label: "Use both?", href: "#both" },
  { label: "Full compare", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "When a 529 is better",
    id: "when-529",
    body: (
      <>
        <p>Choose a 529 first when you have strong confidence the money will be used for qualified education.</p>
        <p>It shines when: you're confident about a qualifying U.S. school, your state offers a 529 tax benefit, and your goal is specifically college savings.</p>
      </>
    ),
  },
  {
    h: "When a Trump Account is better",
    id: "when-trump",
    body: (
      <>
        <p>Lean Trump Account when flexibility matters more than the education-only tax break.</p>
        <p>It fits when: the child is eligible for the $1,000 pilot, the country of education is uncertain, the goal is long-term wealth, you want move-back flexibility, and there's no child earned income (so a Roth IRA isn't an option).</p>
      </>
    ),
  },
  {
    h: "Can you use both?",
    id: "both",
    body: (
      <>
        <p>Yes — many families may use both. A common order:</p>
        <p>1. Claim/open a Trump Account if the child qualifies for the $1,000. 2. Use a 529 for education-specific savings if you're confident about qualifying use. 3. Use taxable/custodial accounts only after you understand the taxes.</p>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(vs529Faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Trump Account vs 529", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-vs-529-for-h1b-families"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "vs 529 Plan" },
        ]}
        icon="⚖️"
        category="Immigrant Family Wealth"
        title="Trump Account vs 529 Plan for H-1B and Indian Families"
        hook="Education savings or long-term wealth? For families who might study in India or move back, the answer isn't obvious. Here's a decision table and scenario-based picks."
        accent="from-brand-600 to-indigo-600"
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Trump Account or 529 — which should H-1B and Indian families choose?"
              answer={
                <>
                  <p>If you're confident the child will attend a qualifying U.S. school, a 529's tax-free education growth is compelling.</p>
                  <p>If your family might study in India or move back, a Trump Account's non-education flexibility often fits better. Many families use both — and a U.S.-citizen newborn should grab the one-time $1,000 either way.</p>
                </>
              }
            />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
            </div>
          </Container>
        </section>

        {/* Decision table */}
        <section id="decision" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Which to choose first, by family situation</h2>
              <div className="mt-4">
                <DataTable columns={decision529Cols} rows={decision529Rows} />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <ProseSections heading="When each account wins" sections={SECTIONS} />
            <div className="mx-auto mt-6 max-w-3xl">
              <WarnBox title="A Trump Account is not a replacement for a 529">
                <p>They are different tools. A 529 is education-specific with tax-free growth for qualified education; a Trump Account is retirement-style and tax-deferred. Don't swap one for the other without matching it to your goal.</p>
              </WarnBox>
            </div>
          </Container>
        </section>

        <section id="compare" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Side-by-side comparison</h2>
              <div className="mt-4">
                <ComparisonTable columns={accountComparisonColumns} rows={accountComparisonRows} caption="Trump Account vs 529 (plus Roth IRA and custodial brokerage for context)." />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox intro="Verify current rules for both account types with the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={vs529Faqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Tax rules for immigrants", href: "/trump-account-tax-rules-immigrants", primary: true },
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
                { label: "Main H-1B guide", href: "/trump-account-h1b-immigrant-families" },
                { label: "Trump Account tax planning for immigrant families", href: "/trump-account-tax-planning-immigrant-families" },
              ]}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_SHORT_DISCLAIMER}</p>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
