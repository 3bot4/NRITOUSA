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
  ChecklistBox,
  WarnBox,
  DataTable,
  ExampleBox,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  trumpAccountWebAppJsonLd,
  trumpAccountArticleJsonLd,
  trumpAccountAuthorJsonLd,
  trumpAccountItemListJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
  TRUMP_ACCOUNT_UPDATED,
  TRUMP_ACCOUNT_UPDATED_HUMAN,
} from "@/lib/trumpAccountCluster";
import {
  trumpAccountConfig as CFG,
  trumpAccountSourceLinks,
  pilotDenialReasons,
  pilotExampleCols,
  pilotExampleRows,
  eligibilityFaqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-1000-eligibility";
const TITLE = "Trump Account $1,000 Eligibility: Rules for U.S.-Born Children of H-1B Parents";
const DESC =
  "Check who qualifies for the $1,000 Trump Account pilot contribution, including U.S.-born children of H-1B parents, valid SSN rules, citizenship, birth window, and Form 4547.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const CHECKLIST_ITEMS = [
  `Child ${CFG.bornWindowLegal}`,
  "Child is a U.S. citizen",
  "Child has a valid Social Security number (not an ITIN)",
  "Child meets the qualifying-child rules",
  `The account is opened and the request is made via ${CFG.form}`,
];

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Exact checklist", href: "#checklist" },
  { label: "Check yours", href: "#eligibility-checker" },
  { label: "Denial reasons", href: "#denials" },
  { label: "Examples", href: "#examples" },
  { label: "FAQ", href: "#faq" },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    trumpAccountItemListJsonLd({ path: PATH, name: "Trump Account $1,000 eligibility checklist", items: CHECKLIST_ITEMS.map((c) => ({ name: c })) }),
    faqJsonLd(eligibilityFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "$1,000 Eligibility", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-1000-eligibility"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "$1,000 Eligibility" },
        ]}
        icon="💵"
        category="Immigrant Family Wealth"
        title="Trump Account $1,000 Eligibility: Who Gets the Federal Child Contribution?"
        hook="The $1,000 federal pilot contribution is not for every child. Here's the exact checklist, the reasons immigrant families get denied, and a checker for your family."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <a href="#eligibility-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check the $1,000 eligibility →</a>
        }
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Who gets the $1,000 Trump Account federal contribution?"
              answer={
                <>
                  <p>The {CFG.federalContribution} federal contribution is not for every child. It generally applies only if the child is a U.S. citizen, has a valid SSN, was {CFG.bornWindowLegal}, and meets qualifying-child rules.</p>
                  <p>H-1B parents with a U.S.-born child in this birth window may often qualify — but a child with only an ITIN does not.</p>
                </>
              }
              ctaText="Check your family's eligibility"
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

        <section id="checklist" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">The exact $1,000 eligibility checklist</h2>
              <ChecklistBox title="All of these must be true" items={CHECKLIST_ITEMS} />
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

        <section id="denials" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Why immigrant families may be denied the $1,000</h2>
              <ChecklistBox tone="brand" title="Common denial reasons" items={pilotDenialReasons} />
              <div className="mt-4">
                <WarnBox title="The birth window is strict">
                  <p>Even a U.S.-citizen child with a valid SSN gets nothing from this pilot if born outside {CFG.bornWindowLabel}. Check the birth year first — it's the fastest way to rule the contribution in or out.</p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        <section id="examples" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Immigrant-family examples</h2>
              <DataTable columns={pilotExampleCols} rows={pilotExampleRows} />
              <div className="mt-4">
                <ExampleBox title="Example — Ananya, born 2026 in New Jersey">
                  <p>Ananya's parents are on H-1B and H-4. She was born in the U.S. in 2026 and has an SSN. She is a U.S. citizen, has a valid SSN, and is in the 2025–2028 window — so she likely qualifies for the {CFG.federalContribution}. Her parents request it on {CFG.form}.</p>
                </ExampleBox>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox intro="Confirm the current $1,000 pilot rules directly with the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={eligibilityFaqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "How to apply (Form 4547)", href: "/how-to-apply-for-trump-account-form-4547", primary: true },
                { label: "Can H-1B parents open one?", href: "/can-h1b-parents-open-trump-account-for-child" },
                { label: "SSN vs ITIN rules", href: "/trump-account-ssn-itin-child" },
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
