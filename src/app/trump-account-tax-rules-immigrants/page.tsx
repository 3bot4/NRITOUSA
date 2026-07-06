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
  trumpAccountConfig as CFG,
  trumpAccountSourceLinks,
  accountComparisonColumns,
  accountComparisonRows,
  taxTableCols,
  taxTableRows,
  taxFaqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-tax-rules-immigrants";
const TITLE = "Trump Account Tax Rules for Immigrant Families: H-1B, NRI & Move-Back Tax Guide";
const DESC =
  "Understand Trump Account tax rules for H-1B, green card, and Indian immigrant families: contributions, tax-deferred growth, gift tax, employer contributions, U.S. citizen child issues, and India move-back planning.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Tax table", href: "#tax-table" },
  { label: "Deduction?", href: "#deduction" },
  { label: "India tax", href: "#india" },
  { label: "FBAR/FATCA", href: "#fbar" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "Does the parent get a tax deduction?",
    id: "deduction",
    body: <p>Generally no. There is typically no individual income-tax deduction for contributions during the growth period. The benefit is tax-deferred compounding inside the account, not an upfront write-off.</p>,
  },
  {
    h: "Does the child pay tax when money is contributed?",
    body: <p>Contributions during the growth period are generally not included in the child's income when made, subject to current rules and the source and type of contribution. Confirm current IRS guidance before relying on this.</p>,
  },
  {
    h: "How is the gift-tax safe harbor treated?",
    body: (
      <>
        <p>Current IRS guidance provides a safe harbor for certain qualifying contributions.</p>
        <p>But large or unusual contributions should be reviewed with a tax advisor. Do not assume every contribution from every source is automatically exempt from gift-tax reporting.</p>
      </>
    ),
  },
  {
    h: "Will India tax a Trump Account after moving back?",
    id: "india",
    body: (
      <>
        <p>India may tax income or gains depending on the child's tax residency, the account structure, income recognition, and Indian law at that time.</p>
        <p>Do not assume U.S. tax deferral automatically applies in India. Plan with a cross-border advisor — see <a href="/trump-account-moving-back-to-india" className="font-semibold text-brand-600 underline">moving back to India</a> and <a href="/india-tax-compliance" className="font-semibold text-brand-600 underline">India tax compliance</a>.</p>
      </>
    ),
  },
  {
    h: "Trump Account vs FBAR / FATCA for U.S.-citizen children",
    id: "fbar",
    body: (
      <>
        <p>The Trump Account is a U.S. account, so FBAR is not about the Trump Account itself.</p>
        <p>But a U.S.-citizen child living in India may later have Indian bank or investment accounts, which can trigger U.S. reporting such as FBAR/FATCA as the child grows and earns.</p>
        <p>See our <a href="/articles/fbar-fatca-nri-guide" className="font-semibold text-brand-600 underline">FBAR &amp; FATCA guide for NRIs</a> and <a href="/india-tax-compliance" className="font-semibold text-brand-600 underline">India tax compliance</a> pages.</p>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(taxFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Tax Rules for Immigrants", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-tax-rules-immigrants"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Tax Rules for Immigrants" },
        ]}
        icon="🧾"
        category="Immigrant Family Wealth"
        title="Trump Account Tax Rules for Immigrant Families"
        hook="Tax-deferred growth, the gift-tax safe harbor, and the cross-border catch: what H-1B, green-card, and Indian families need to know — especially if you might leave the U.S."
        accent="from-brand-600 to-indigo-600"
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="How are Trump Accounts taxed for immigrant families?"
              answer={
                <>
                  <p>Growth is tax-deferred — not taxed year by year while invested. Parents contribute after-tax dollars (non-exempt contributions generally up to {CFG.annualLimit}/child/year, subject to current law), with no upfront deduction.</p>
                  <p>The cross-border catch: a U.S.-citizen child owes U.S. tax for life, and India may also tax the account once you're Indian tax residents. Do not assume U.S. deferral carries over to India.</p>
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

        <section id="tax-table" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Trump Account tax treatment for immigrant families</h2>
              <p className="mt-1.5 text-sm text-ink-600">General U.S. treatment vs the immigrant/NRI issue to watch. This is educational; confirm your situation with a cross-border advisor.</p>
              <div className="mt-4">
                <DataTable columns={taxTableCols} rows={taxTableRows} />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <ProseSections heading="Trump Account tax questions, answered carefully" sections={SECTIONS} />
            <div className="mx-auto mt-6 max-w-3xl">
              <WarnBox title="Cross-border tax is the real complexity">
                <p>For most U.S.-only families the taxes are straightforward. The complexity appears when a U.S.-citizen child or the family later becomes tax-resident in India.</p>
                <p>Get a cross-border tax plan before you rely on any outcome — this page is educational only, not tax advice.</p>
              </WarnBox>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Trump Account vs 529 vs Roth IRA vs brokerage</h2>
              <div className="mt-4">
                <ComparisonTable columns={accountComparisonColumns} rows={accountComparisonRows} caption="Tax treatment and flexibility side by side. The right choice depends on your goal and whether you might educate a child in India or move back." />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox intro="Verify current tax rules directly with the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={taxFaqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india", primary: true },
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families" },
                { label: "India tax compliance", href: "/india-tax-compliance" },
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
