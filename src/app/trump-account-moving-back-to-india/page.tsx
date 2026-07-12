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
  trumpAccountItemListJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
  TRUMP_ACCOUNT_UPDATED,
  TRUMP_ACCOUNT_UPDATED_HUMAN,
} from "@/lib/trumpAccountCluster";
import {
  trumpAccountSourceLinks,
  keepContributingCols,
  keepContributingRows,
  beforeMovingChecklist,
  moveBackFaqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";

const PATH = "/trump-account-moving-back-to-india";
const TITLE = "Trump Account If H-1B Parents Move Back to India";
const DESC =
  "What happens to your child's Trump Account if H-1B parents return to India: account access, U.S. citizen child tax duties, and records to keep.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Does it close?", href: "#close" },
  { label: "Who owns it?", href: "#owner" },
  { label: "Login from India", href: "#login" },
  { label: "US citizen child", href: "#citizen-child" },
  { label: "India tax", href: "#india-tax" },
  { label: "Keep contributing?", href: "#keep" },
  { label: "Checklist", href: "#checklist" },
  { label: "FAQ", href: "#faq" },
];

const SECTIONS = [
  {
    h: "Does the account close if we leave the U.S.?",
    id: "close",
    body: (
      <>
        <p>Generally no. Leaving the U.S. does not automatically close or erase the account.</p>
        <p>There is no rule that deletes a Trump Account because a family relocates. What changes is provider access and management, not the account's existence.</p>
      </>
    ),
  },
  {
    h: "Who owns the account after the family moves back?",
    id: "owner",
    body: (
      <>
        <p>The child owns the account as the beneficiary — it is established for the exclusive benefit of the child.</p>
        <p>A parent or responsible party manages it while the child is a minor, wherever the family lives.</p>
      </>
    ),
  },
  {
    h: "Can we still log in from India?",
    id: "login",
    body: (
      <>
        <p>It depends on the provider. Several things can affect access from India:</p>
        <p>A foreign (Indian) address, an Indian phone number, two-factor authentication methods, a usable U.S. mailing address, U.S. bank links, and app access can all matter.</p>
        <p>Some U.S. brokerages restrict foreign-address accounts or freeze them. Set up reliable access before you leave to avoid being locked out.</p>
      </>
    ),
  },
  {
    h: "What if my child is a U.S. citizen living in India?",
    id: "citizen-child",
    body: (
      <>
        <p>U.S. citizenship continues unless it is formally changed later, so the child may have future U.S. filing responsibilities even while living in India.</p>
        <p>Keep the SSN, passport, and account records safe — they make future U.S. filings much easier. See the <a href="/trump-account-tax-rules-immigrants" className="font-semibold text-brand-600 underline">tax rules for immigrants</a>.</p>
      </>
    ),
  },
  {
    h: "Will India tax the Trump Account?",
    id: "india-tax",
    body: (
      <>
        <p>India's treatment depends on the child's tax residency and Indian law at the time.</p>
        <p>Do not overpromise or assume U.S. deferral carries over. This is a question for a cross-border tax advisor once your India residency status is clear. See <a href="/india-tax-compliance" className="font-semibold text-brand-600 underline">India tax compliance</a>.</p>
      </>
    ),
  },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    trumpAccountItemListJsonLd({ path: PATH, name: "Before leaving the U.S. checklist", items: beforeMovingChecklist.map((c) => ({ name: c })) }),
    faqJsonLd(moveBackFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "Moving Back to India", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="trump-account-moving-back-to-india"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "Moving Back to India" },
        ]}
        icon="🇮🇳"
        category="Immigrant Family Wealth"
        title="What Happens to a Trump Account If H-1B Parents Move Back to India?"
        hook="The account belongs to your child and usually survives the move — but access and taxes need planning. Here's what happens, and the checklist to complete before you leave the U.S."
        accent="from-brand-600 to-indigo-600"
        headerExtra={
          <a href="#checklist" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700">Before-you-leave checklist →</a>
        }
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="What happens to a Trump Account if we move back to India?"
              answer={
                <>
                  <p>The account belongs to your child and generally does not close automatically when you leave the U.S.</p>
                  <p>Plan ahead for two things: access (foreign-address policy, U.S. bank/app logins, 2-factor that works abroad) and taxes (a U.S.-citizen child's lifelong U.S. filing plus Indian tax residency once you return).</p>
                </>
              }
              ctaText="See the before-you-leave checklist"
              ctaHref="#checklist"
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

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="What actually happens to the account" sections={SECTIONS} />
          </Container>
        </section>

        {/* Keep contributing table */}
        <section id="keep" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Should we keep contributing after moving back?</h2>
              <p className="mt-1.5 text-sm text-ink-600">General guidance by situation — get cross-border advice before adding more.</p>
              <div className="mt-4">
                <DataTable columns={keepContributingCols} rows={keepContributingRows} />
              </div>
            </div>
          </Container>
        </section>

        {/* Checklist */}
        <section id="checklist" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Before leaving the U.S. checklist</h2>
              <ChecklistBox title="Do these before your move" items={beforeMovingChecklist} />
              <div className="mt-4">
                <WarnBox title="Set up access before you land in India">
                  <p>It's far harder to fix a frozen account or a broken 2-factor method after you've left. Confirm the provider's foreign-address policy and test your logins and authenticator before departure.</p>
                </WarnBox>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox intro="Verify current rules with the official sources, and check your provider's foreign-address policy:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={moveBackFaqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Tax rules for immigrants", href: "/trump-account-tax-rules-immigrants", primary: true },
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families" },
                { label: "India tax compliance", href: "/india-tax-compliance" },
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
