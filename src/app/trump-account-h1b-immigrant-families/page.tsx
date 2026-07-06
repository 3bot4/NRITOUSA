import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import TrumpAccountEligibilityChecker from "@/components/tools/TrumpAccountEligibilityChecker";
import {
  QuickAnswer,
  JumpNav,
  WhichPageBlock,
  EEATBox,
  TrumpClusterNav,
  ProseSections,
  ChecklistBox,
  ComparisonTable,
  DataTable,
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
  familyEligibilityCols,
  familyEligibilityRows,
  howToApplyCols,
  howToApplyRows,
  beforeMovingChecklist,
  pillarFaqs,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_DATA_NOTE,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-h1b-immigrant-families";
const TITLE = "Trump Accounts for H1B Visa Holders: Complete Guide for Immigrant Families (2026)";
const DESC =
  "Can H-1B parents open a Trump Account for a U.S.-born child? Learn eligibility, $1,000 pilot contribution rules, SSN vs ITIN, Form 4547, taxes, and what happens if your family moves back to India.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Eligibility by family", href: "#eligibility" },
  { label: "Check eligibility", href: "#eligibility-checker" },
  { label: "How to apply", href: "#how-to-apply" },
  { label: "Move back to India", href: "#move-back" },
  { label: "vs 529", href: "#compare" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "What is a Trump Account?",
    body: (
      <>
        <p>A Trump Account is {CFG.accountType}. In plain terms, it's a long-term, retirement-style account that an adult opens <strong>for a child</strong> — not for themselves.</p>
        <p>The child is {CFG.owner}. Money is invested for tax-deferred growth, and during the growth period {CFG.investmentRule}.</p>
        <p>Contributions cannot be made before {CFG.contributionsBegan}. Certain newborns also qualify for a one-time {CFG.federalContribution} federal pilot contribution.</p>
      </>
    ),
  },
  {
    h: "Can H-1B parents apply?",
    body: (
      <>
        <p>Generally yes — for an eligible child. Parents, guardians, and authorized individuals can make the election. Your visa (H-1B, L-1, H-4, or green card) is not the deciding factor.</p>
        <p>What matters is the child: under 18 (by the end of the election year) with a valid SSN. Most H-1B families with a U.S.-born child clear these rules.</p>
      </>
    ),
  },
  {
    h: "Can H-1B parents apply for themselves? No.",
    body: (
      <p>No. Trump Accounts are for children, not adults. An H-1B worker can only be the responsible party for an eligible child. For your own retirement, look at a 401(k) or IRA instead.</p>
    ),
  },
  {
    h: "Who qualifies for the $1,000 federal contribution?",
    body: (
      <>
        <p>The {CFG.federalContribution} pilot is narrower than the account. Based on current guidance, the child must be a U.S. citizen, have a valid SSN, meet qualifying-child rules, and be {CFG.bornWindowLegal}.</p>
        <p>Many U.S.-born children of H-1B parents qualify because they are U.S. citizens by birth. See the <a href="/trump-account-1000-eligibility" className="font-semibold text-brand-600 underline">$1,000 eligibility guide</a>.</p>
      </>
    ),
  },
  {
    h: "The under-18 and valid-SSN rule",
    body: (
      <>
        <p>To open the account, the child generally must be under 18 (by year-end) and have a <strong>valid Social Security number</strong>.</p>
        <p>An ITIN does not satisfy this. A U.S.-born child is eligible for an SSN; a foreign-born child usually needs one first. See the <a href="/trump-account-ssn-itin-child" className="font-semibold text-brand-600 underline">SSN vs ITIN guide</a>.</p>
      </>
    ),
  },
  {
    h: "The U.S.-citizen, born 2025–2028 rule",
    body: (
      <p>The {CFG.federalContribution} contribution specifically requires a U.S.-citizen child {CFG.bornWindowLegal}. A child born in 2024 or earlier, or a non-citizen child, can potentially still hold the account but would not receive this federal contribution.</p>
    ),
  },
  {
    h: "Contribution limits",
    body: (
      <p>Beyond the one-time federal {CFG.federalContribution}, non-exempt contributions are generally subject to a {CFG.annualLimit} annual limit per child, subject to current law and future adjustments. Confirm the current figure before relying on it.</p>
    ),
  },
  {
    h: "Investment options",
    body: (
      <p>During the growth period, {CFG.investmentRule}. Treasury announced {CFG.defaultInvestmentLabel} as the default/launch investment, with {CFG.additionalEtfsLabel} as additional low-cost ETF options — broad, simple, diversified building blocks.</p>
    ),
  },
  {
    h: "Tax rules",
    body: (
      <p>Growth is tax-deferred inside the account. For immigrant families there's an extra layer: a U.S.-citizen child keeps U.S. tax duties for life, and India may tax the account once you're Indian tax residents. Details: <a href="/trump-account-tax-rules-immigrants" className="font-semibold text-brand-600 underline">tax rules for immigrants</a>.</p>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(pillarFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="trump-account-h1b-immigrant-families"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Accounts for H-1B Families" },
        ]}
        icon="🇺🇸"
        category="Immigrant Family Wealth"
        title="Trump Accounts for H1B Visa Holders: Complete Guide for Immigrant Families (2026)"
        hook="Can H-1B parents open a Trump Account for their U.S.-born child — and claim the $1,000 federal contribution? This is the full immigrant-family guide: eligibility, rules, taxes, and how to apply."
        accent="from-brand-600 to-indigo-600"
        headerExtra={
          <a href="#eligibility-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700">Check my eligibility →</a>
        }
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        {/* Jump nav */}
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        {/* Quick answer */}
        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Can H-1B parents apply for a Trump Account for their U.S.-born child?"
              answer={
                <>
                  <p>H-1B parents <strong>cannot open a Trump Account for themselves</strong>, but they may be able to open one for an eligible child.</p>
                  <p>A U.S.-born child of H-1B parents usually has U.S. citizenship and can get a Social Security number, so the child may qualify for a Trump Account.</p>
                  <p>To get the {CFG.federalContribution} federal pilot contribution, the child must be a U.S. citizen, have a valid SSN, be {CFG.bornWindowLegal}, and meet qualifying-child rules. A child with only an ITIN does not qualify.</p>
                </>
              }
              ctaText="Check your family's eligibility"
              ctaHref="#eligibility-checker"
            />
          </Container>
        </section>

        {/* Which page / EEAT */}
        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
            </div>
          </Container>
        </section>

        {/* Eligibility by family situation */}
        <section id="eligibility" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Trump Account eligibility by family situation</h2>
              <p className="mt-1.5 text-sm text-ink-600">The parent's visa is not the test — the child's status is. Use this to see where your family likely lands, then confirm with the checker.</p>
              <div className="mt-4">
                <DataTable columns={familyEligibilityCols} rows={familyEligibilityRows} />
              </div>
            </div>
          </Container>
        </section>

        {/* Eligibility checker */}
        <section id="eligibility-checker" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <TrumpAccountEligibilityChecker />
            </div>
          </Container>
        </section>

        {/* Main explainer */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="Trump Accounts for H-1B and immigrant families, explained" sections={SECTIONS} />
          </Container>
        </section>

        {/* How to apply table */}
        <section id="how-to-apply" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How to apply for a Trump Account as an H-1B parent</h2>
              <p className="mt-1.5 text-sm text-ink-600">You open the account and (if eligible) request the {CFG.federalContribution} using {CFG.form}. Full walkthrough on the <a href="/how-to-apply-for-trump-account-form-4547" className="font-semibold text-brand-600 underline">Form 4547 guide</a>.</p>
              <div className="mt-4">
                <DataTable columns={howToApplyCols} rows={howToApplyRows} />
              </div>
              <div className="mt-4">
                <ChecklistBox
                  title="Documents to have ready"
                  items={[
                    "Child's valid Social Security number (SSN card)",
                    "Child's birth certificate (date of birth + U.S. citizenship if U.S.-born)",
                    "Child's U.S. passport or CRBA, if claiming the $1,000 for a citizen child",
                    `Responsible party's ID and taxpayer details for ${CFG.form}`,
                  ]}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Move back to India — strong section */}
        <section id="move-back" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What happens to a Trump Account if H-1B parents move back to India?</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>This is one of the most important questions for H-1B and L-1 families, because many plan to return to India eventually. The short answer: the account generally survives the move, but access and taxes need planning.</p>
                <p><strong>The account belongs to the child, not the parent.</strong> It is established for the exclusive benefit of the child, who is the account beneficiary. A move abroad does not change who owns it.</p>
                <p><strong>Leaving the U.S. does not automatically close or erase the account.</strong> There is no rule that deletes a Trump Account simply because the family relocates. What changes is how easy it is to access and manage.</p>
                <p><strong>A U.S.-citizen child may have future U.S. tax responsibilities even while living in India.</strong> U.S. citizenship continues unless it is formally changed later, so the child may need to file U.S. taxes as they grow, regardless of where they live.</p>
                <p><strong>Provider access is often the real issue.</strong> A foreign (Indian) address, an Indian phone number, app logins, U.S. bank links, two-factor authentication, and a usable U.S. mailing address can all affect whether you can keep managing the account from India. Some U.S. providers restrict or freeze foreign-address accounts.</p>
                <p><strong>Indian tax residency may matter later.</strong> Once the family becomes Indian tax resident, India may look at the account's income under its own rules. Do not assume India will treat the account the same way the U.S. does — that's a decision for a cross-border tax advisor.</p>
                <p><strong>Keep records.</strong> Save the SSN card, U.S. birth certificate/passport, Form 4547 confirmation, and yearly statements. Good records make future U.S. and Indian filings far easier.</p>
                <p>For the deep dive, read <a href="/trump-account-moving-back-to-india" className="font-semibold text-brand-600 underline">what happens to a Trump Account if you move back to India</a> and the <a href="/trump-account-tax-rules-immigrants" className="font-semibold text-brand-600 underline">tax rules for immigrant families</a>.</p>
              </div>
              <div className="mt-5">
                <ChecklistBox tone="brand" title="Before moving back to India checklist" items={beforeMovingChecklist} />
              </div>
            </div>
          </Container>
        </section>

        {/* Comparison table (single semantic table — no duplicate) */}
        <section id="compare" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Trump Account vs 529 vs Roth IRA vs custodial brokerage</h2>
              <div className="mt-4">
                <ComparisonTable
                  columns={accountComparisonColumns}
                  rows={accountComparisonRows}
                  caption="How a Trump Account compares to the other common ways H-1B and Indian families save for a child. Many families combine a Trump Account with a 529."
                />
              </div>
              <p className="mt-4 text-sm text-ink-600">Deciding between the first two? <a href="/trump-account-vs-529-for-h1b-families" className="font-semibold text-brand-600 underline">Trump Account vs 529 for H-1B families →</a></p>
            </div>
          </Container>
        </section>

        {/* Sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox
              title="Official sources"
              intro="Trump Account rules are new and evolving. Verify current guidance directly with these official sources before you apply or contribute:"
              links={trumpAccountSourceLinks}
            />
            <p className="mx-auto mt-4 max-w-3xl text-xs text-ink-500">{TRUMP_ACCOUNT_DATA_NOTE}</p>
          </Container>
        </section>

        {/* Cluster nav */}
        <section className="py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={pillarFaqs} />
          </Container>
        </section>

        {/* Next step */}
        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Check the $1,000 eligibility", href: "/trump-account-1000-eligibility", primary: true },
                { label: "How to apply (Form 4547)", href: "/how-to-apply-for-trump-account-form-4547" },
                { label: "SSN vs ITIN rules", href: "/trump-account-ssn-itin-child" },
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
