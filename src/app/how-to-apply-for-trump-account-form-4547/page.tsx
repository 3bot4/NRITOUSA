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
  trumpAccountHowToJsonLd,
  TRUMP_ACCOUNT_PUBLISHED,
  TRUMP_ACCOUNT_UPDATED,
  TRUMP_ACCOUNT_UPDATED_HUMAN,
} from "@/lib/trumpAccountCluster";
import {
  trumpAccountConfig as CFG,
  trumpAccountSourceLinks,
  form4547Checklist,
  form4547Faqs,
  TRUMP_ACCOUNT_DISCLAIMER,
  TRUMP_ACCOUNT_SHORT_DISCLAIMER,
  TRUMP_ACCOUNT_REVIEWED_LINE,
} from "@/data/trumpAccountData";
import type { DataRow, DataCol } from "@/data/trumpAccountData";

const PATH = "/how-to-apply-for-trump-account-form-4547";
const TITLE = "How to Apply for a Trump Account with IRS Form 4547: H-1B Parent Guide";
const DESC =
  "Step-by-step guide for H-1B and immigrant parents to apply for a Trump Account using IRS Form 4547, request the $1,000 pilot contribution, and avoid common mistakes.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

const HOWTO_COLS: DataCol[] = [
  { key: "step", label: "Step" },
  { key: "action", label: "Action", highlight: true },
  { key: "details", label: "Details" },
  { key: "mistake", label: "Common mistake" },
];

const HOWTO: (DataRow & { name: string; text: string })[] = [
  { step: "1", action: "Confirm child age and SSN", details: "Child under 18 by year-end with a valid SSN", mistake: "Using an ITIN in the SSN field", name: "Confirm child age and SSN", text: "Check the child is under 18 by year-end and has a valid Social Security number (not an ITIN)." },
  { step: "2", action: "Confirm $1,000 eligibility", details: "If requesting it: U.S. citizen, born 2025–2028", mistake: "Requesting it for a child outside the window", name: "Confirm $1,000 eligibility", text: "If you plan to request the pilot contribution, confirm U.S. citizenship and a birth after Dec 31, 2024 and before Jan 1, 2029." },
  { step: "3", action: "Go to the official source", details: "Start from IRS.gov or TrumpAccounts.gov", mistake: "Using an unofficial or fake site", name: "Go to the official source", text: "Start only from official IRS or TrumpAccounts.gov pages to get the current Form 4547." },
  { step: "4", action: "Complete responsible-party section", details: "Your legal name and taxpayer info", mistake: "Missing or mismatched taxpayer details", name: "Complete responsible-party section", text: "Enter the responsible party's legal name and taxpayer information." },
  { step: "5", action: "Complete child / beneficiary section", details: "Child name, DOB, valid SSN, address", mistake: "Name/DOB that doesn't match SSA records", name: "Complete child section", text: "Enter the child's full legal name, date of birth, valid SSN, and address, matching official records." },
  { step: "6", action: "Elect account only or account + pilot", details: "Only elect the $1,000 if eligible", mistake: "Electing the pilot when ineligible", name: "Elect account or account plus pilot", text: "Choose whether to open the account only, or the account plus the $1,000 pilot contribution if the child qualifies." },
  { step: "7", action: "Review SSN / DOB / citizenship", details: "Everything must match IRS/SSA records", mistake: "Typos in SSN or date of birth", name: "Review details", text: "Double-check the SSN, date of birth, and citizenship details against the official documents." },
  { step: "8", action: "Submit and save confirmation", details: "Keep the confirmation for your records", mistake: "Not saving proof of the election", name: "Submit and save confirmation", text: "Submit per the IRS instructions and save the confirmation." },
  { step: "9", action: "Activate the account / provider steps", details: "Choose an eligible index fund/ETF", mistake: "Ignoring investment restrictions", name: "Activate the account", text: "Follow provider instructions and choose a qualifying index fund/ETF for the growth period." },
  { step: "10", action: "Save records for taxes & move-back", details: "SSN card, birth certificate, Form 4547", mistake: "Losing documents needed later", name: "Save records", text: "Keep the SSN card, birth certificate/passport, and Form 4547 confirmation for future taxes and any move back to India." },
];

const FILE_OR_WAIT = [
  { h: "Apply now", body: <p>Your U.S.-born child has a valid SSN, is under 18, and (for the $1,000) is a U.S. citizen born in the {CFG.bornWindowLabel} window.</p> },
  { h: "Wait to apply", body: <p>The SSN has not been issued yet. Apply once you have the actual number that matches SSA records.</p> },
  { h: "Do not request the $1,000", body: <p>The child is outside the 2025–2028 window (or is not a U.S. citizen). You may still be able to open the account without the pilot contribution.</p> },
  { h: "Review carefully", body: <p>The child has only an ITIN. Generally not eligible — read the <a href="/trump-account-ssn-itin-child" className="font-semibold text-brand-600 underline">SSN vs ITIN guide</a> before applying.</p> },
];

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Step-by-step", href: "#steps" },
  { label: "Info checklist", href: "#checklist" },
  { label: "File or wait?", href: "#file-or-wait" },
  { label: "FAQ", href: "#faq" },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    trumpAccountWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    trumpAccountArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: TRUMP_ACCOUNT_PUBLISHED, dateModified: TRUMP_ACCOUNT_UPDATED }),
    trumpAccountAuthorJsonLd(),
    trumpAccountHowToJsonLd({
      path: PATH,
      name: "How to apply for a Trump Account using IRS Form 4547",
      description: DESC,
      steps: HOWTO.map((s) => ({ name: s.name, text: s.text })),
    }),
    faqJsonLd(form4547Faqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Trump Accounts for H-1B Families", url: "/trump-account-h1b-immigrant-families" },
      { name: "How to Apply (Form 4547)", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolFirstLayout
        toolSlug="how-to-apply-for-trump-account-form-4547"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Trump Account", href: "/trump-account-h1b-immigrant-families" },
          { label: "How to Apply (Form 4547)" },
        ]}
        icon="📝"
        category="Immigrant Family Wealth"
        title="How to Apply for a Trump Account Using IRS Form 4547"
        hook="Open the account and request the $1,000 contribution with IRS Form 4547 — here's the step-by-step, the exact information you need, scam warnings, and whether to file now or wait."
        accent="from-brand-600 to-indigo-600"
        headerExtra={
          <a href="#steps" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700">See the steps →</a>
        }
        sourceNote={<>{TRUMP_ACCOUNT_REVIEWED_LINE}</>}
        disclaimerExtra={<p>{TRUMP_ACCOUNT_DISCLAIMER}</p>}
      >
        <Container><div className="mx-auto max-w-3xl"><JumpNav items={JUMP} /></div></Container>

        <section id="quick-answer" className="scroll-mt-24 pt-6">
          <Container>
            <QuickAnswer
              question="How do I apply for a Trump Account?"
              answer={
                <>
                  <p>You apply using {CFG.form}, which is used to make {CFG.formPurpose}.</p>
                  <p>As the responsible party you provide your details and the child's (including the child's valid SSN), request the {CFG.federalContribution} only if the child qualifies, and submit per the current IRS instructions.</p>
                </>
              }
              ctaText="Walk through the steps"
              ctaHref="#steps"
            />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
              <WarnBox title="Do not use unofficial application links">
                <p>Trump Accounts are new, so scam pages may appear. Start only from IRS.gov or TrumpAccounts.gov, and never enter an SSN on an unverified site.</p>
              </WarnBox>
            </div>
          </Container>
        </section>

        {/* Steps table (single semantic table — replaces the old ordered list) */}
        <section id="steps" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Step-by-step: applying with Form 4547</h2>
              <DataTable columns={HOWTO_COLS} rows={HOWTO} />
            </div>
          </Container>
        </section>

        {/* Info checklist */}
        <section id="checklist" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Form 4547 information checklist</h2>
              <ChecklistBox title="Gather before you start" items={form4547Checklist} />
            </div>
          </Container>
        </section>

        {/* File or wait */}
        <section id="file-or-wait" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <ProseSections heading="Should an H-1B parent file Form 4547 or wait?" sections={FILE_OR_WAIT} />
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <OfficialSourceBox intro="Get the current form and instructions directly from the official sources:" links={trumpAccountSourceLinks} />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrumpClusterNav currentHref={PATH} />
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={form4547Faqs} />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <NextStep
              links={[
                { label: "Check the $1,000 eligibility", href: "/trump-account-1000-eligibility", primary: true },
                { label: "SSN vs ITIN rules", href: "/trump-account-ssn-itin-child" },
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
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
