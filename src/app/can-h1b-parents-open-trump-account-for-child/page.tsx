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
  DataTable,
  WarnBox,
  ExampleBox,
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
  scenarioTableCols,
  scenarioTableRows,
  canOpenFaqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/can-h1b-parents-open-trump-account-for-child";
const TITLE = "Can H1B Parents Open a Trump Account for Their Child? H-1B, H-4 & Green Card Rules";
const DESC =
  "H-1B parents may be able to open a Trump Account for an eligible child. See U.S.-born child, H-4 child, ITIN-only child, green card, and foreign-born child scenarios.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "All scenarios", href: "#scenarios" },
  { label: "Check yours", href: "#eligibility-checker" },
  { label: "Does visa matter?", href: "#visa" },
  { label: "For yourself?", href: "#self" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "Does the parent's visa status matter?",
    id: "visa",
    body: (
      <>
        <p>Parent status is <strong>not</strong> the main eligibility test. Whether you're on H-1B, L-1, H-4, F-1/OPT, or hold a green card, you can act as the responsible party.</p>
        <p>The key test is the child's age (under 18 by year-end), a valid SSN, and — for the {CFG.federalContribution} pilot — U.S. citizenship and a {CFG.bornWindowLabel} birth.</p>
      </>
    ),
  },
  {
    h: "Can an H-1B adult open one for themselves?",
    id: "self",
    body: (
      <p>No. Trump Accounts are for children. An adult cannot open one for their own benefit — the account is established for the exclusive benefit of an eligible child.</p>
    ),
  },
  {
    h: "Parent citizenship vs child citizenship",
    body: (
      <>
        <p>These are separate. A non-citizen H-1B parent can open an account for a U.S.-citizen child.</p>
        <p>And being a citizen parent does not, by itself, make a non-citizen child eligible for the U.S.-citizen {CFG.federalContribution} contribution. Always evaluate the child's status.</p>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(canOpenFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Can H-1B Parents Open One?", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="can-h1b-parents-open-trump-account-for-child"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Can H-1B Parents Open One?" },
        ]}
        icon="👨‍👩‍👧"
        category="Immigrant Family Wealth"
        title="Can H-1B Parents Open a Trump Account for Their Child?"
        hook="Your visa status isn't the deciding factor — your child's is. Here are the exact H-1B, H-4, green-card, and foreign-born scenarios, with what to verify and what to do next."
        accent="from-brand-600 to-indigo-600"
        headerExtra={
          <a href="#eligibility-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700">Check my scenario →</a>
        }
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Can H-1B parents open a Trump Account for their child?"
              answer={
                <>
                  <p><strong>Generally yes — if the child qualifies.</strong> H-1B parents can act as the responsible party. The account needs a child under 18 (by year-end) with a valid SSN.</p>
                  <p>The {CFG.federalContribution} federal contribution additionally needs a U.S.-citizen child {CFG.bornWindowLegal}. A U.S.-born child of H-1B parents usually meets both.</p>
                </>
              }
              ctaText="Check your exact scenario"
              ctaHref="#eligibility-checker"
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

        {/* Scenario table */}
        <section id="scenarios" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">H-1B, H-4, green-card & foreign-born scenarios</h2>
              <p className="mt-1.5 text-sm text-ink-600">Find the row closest to your family, then confirm with the checker below.</p>
              <div className="mt-4">
                <DataTable columns={scenarioTableCols} rows={scenarioTableRows} />
              </div>
              <div className="mt-4">
                <WarnBox title="About H-4 children — read this carefully">
                  <p>An H-4 child is usually blocked if the child only has an ITIN. If the child later has a valid SSN and meets the Trump Account rules, eligibility may need to be reviewed. The {CFG.federalContribution} pilot contribution still requires U.S. citizenship and the {CFG.bornWindowLabel} birth window.</p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        <section id="eligibility-checker" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <TrumpAccountEligibilityChecker />
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="How eligibility actually works" sections={SECTIONS} />
            <div className="mx-auto mt-6 max-w-3xl">
              <ExampleBox title="Example — Ravi & Priya (H-1B / H-4)">
                <p>Ravi is on H-1B and Priya on H-4. Their child was born in Texas in 2026 and has an SSN. Because the child is a U.S. citizen with a valid SSN, born in the 2025–2028 window, the family can likely open the account and request the {CFG.federalContribution}.</p>
                <p>Their older child, born in Bengaluru in 2023 and on H-4 with only an ITIN, is generally blocked until that child has a valid SSN — and the older child would not get the {CFG.federalContribution} regardless.</p>
              </ExampleBox>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <OfficialSourceBox title="Official IRS and Treasury sources" intro="Confirm current eligibility rules directly with the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 py-12 sm:py-16">
          <Container>
            <ToolFaq items={canOpenFaqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Check the $1,000 eligibility", href: "/trump-account-1000-eligibility", primary: true },
                { label: "SSN vs ITIN rules", href: "/trump-account-ssn-itin-child" },
                { label: "How to apply (Form 4547)", href: "/how-to-apply-for-trump-account-form-4547" },
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
