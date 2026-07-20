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
  ChecklistBox,
  WarnBox,
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
  ssnItinCols,
  ssnItinRows,
  ssnItinFaqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-ssn-itin-child";
const TITLE = "Trump Account SSN vs ITIN Rules: Can H-4 or Immigrant Children Qualify?";
const DESC =
  "A valid SSN is required for Trump Account eligibility. Learn why ITIN does not qualify, what this means for H-4 children, U.S.-born children, and foreign-born children of Indian families.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "SSN vs ITIN table", href: "#table" },
  { label: "Can H-4 get an SSN?", href: "#h4" },
  { label: "Before applying", href: "#before" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "The valid-SSN requirement",
    body: (
      <>
        <p>To open a Trump Account, the child generally must have a valid Social Security number.</p>
        <p>This is a hard requirement for the account and for the {CFG.federalContribution} pilot contribution. Without a valid SSN, the application generally can't proceed.</p>
      </>
    ),
  },
  {
    h: "What an ITIN is (and why it doesn't qualify)",
    body: (
      <>
        <p>An ITIN is a tax-processing number for people who can't get an SSN. It lets a person file U.S. taxes.</p>
        <p>But it is <strong>not</strong> a Social Security number and does not satisfy the valid-SSN rule for a Trump Account.</p>
      </>
    ),
  },
  {
    h: "Can an H-4 child get an SSN?",
    id: "h4",
    body: (
      <>
        <p>H-4 children typically do not receive SSNs unless they have separate eligibility under Social Security rules.</p>
        <p>Do not assume an ITIN can be converted into an SSN. Verify with SSA/official rules before planning around it. See the <a href="/can-h1b-parents-open-trump-account-for-child" className="font-semibold text-brand-600 underline">H-1B scenarios guide</a>.</p>
      </>
    ),
  },
  {
    h: "U.S.-born vs foreign-born children",
    body: (
      <>
        <p>A U.S.-born child is a citizen and eligible for an SSN — confirm it has actually been issued before applying.</p>
        <p>A foreign-born child may qualify only if they can obtain a valid SSN, such as a foreign-born U.S. citizen with a CRBA or passport. A foreign-born noncitizen child with only an ITIN generally cannot.</p>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    faqJsonLd(ssnItinFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "SSN vs ITIN Rules", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-ssn-itin-child"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "SSN vs ITIN Rules" },
        ]}
        icon="🔢"
        category="Immigrant Family Wealth"
        title="Trump Account SSN vs ITIN Rules: Can a Child Without SSN Qualify?"
        hook="Can a child with only an ITIN qualify for a Trump Account? Generally no. Here's the valid-SSN rule, what it means for H-4 and foreign-born children, and what to do before applying."
        accent="from-brand-600 to-indigo-600"
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="Can a child without an SSN qualify for a Trump Account?"
              answer={
                <>
                  <p>Generally, no. A child with only an ITIN does not qualify for a Trump Account because current rules require a valid Social Security number.</p>
                  <p>A U.S.-born child is usually eligible for an SSN. A foreign-born child may qualify only if the child can obtain a valid SSN, such as through U.S. citizenship. Do not apply using an ITIN as if it were an SSN.</p>
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

        <section id="table" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">SSN vs ITIN: how different children fare</h2>
              <div className="mt-4">
                <DataTable columns={ssnItinCols} rows={ssnItinRows} />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <ProseSections heading="SSN vs ITIN, explained" sections={SECTIONS} />
          </Container>
        </section>

        <section id="before" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">What to do before applying</h2>
              <ChecklistBox
                title="Get the SSN situation right first"
                items={[
                  "Confirm whether the child has a valid SSN",
                  "Do not use an ITIN in the SSN field",
                  "For a U.S.-born child, wait until the SSN is issued",
                  "For a foreign-born U.S. citizen child, complete citizenship/SSN documentation first",
                  "If the child only has an ITIN, read the H-1B scenario page and don't assume eligibility",
                ]}
              />
              <div className="mt-4">
                <WarnBox title="An ITIN is the most common false start">
                  <p>Many immigrant families assume a dependent child's ITIN is enough. It isn't. Confirm a valid SSN before you file — see <a href="/how-to-apply-for-trump-account-form-4547" className="font-semibold underline">how to apply with Form 4547</a>.</p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox title="Official IRS and Treasury sources" intro="Verify SSN and eligibility rules directly with the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={ssnItinFaqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Can H-1B parents open one?", href: "/can-h1b-parents-open-trump-account-for-child", primary: true },
                { label: "Check the $1,000 eligibility", href: "/trump-account-1000-eligibility" },
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
