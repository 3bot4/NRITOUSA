import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
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
const TITLE = "How to Apply for a Trump Account: IRS Form 4547 Step-by-Step Guide";
const DESC =
  "How to apply for a Trump Account with IRS Form 4547: 5 stages, SSN rules, the $1,000 pilot contribution window, and what immigrant families need to check.";

export const metadata: Metadata = pageMetadata({
  title: "How to Apply for a Trump Account: IRS Form 4547 Guide",
  description: DESC,
  path: PATH,
});

const HOWTO_COLS: DataCol[] = [
  { key: "step", label: "Step" },
  { key: "action", label: "Action", highlight: true },
  { key: "details", label: "Details" },
  { key: "mistake", label: "Common mistake" },
];

const HOWTO: (DataRow & { name: string; text: string })[] = [
  { step: "1", action: "Confirm child age and SSN", details: "Under 18 at year-end; SSN valid for employment, issued before the election", mistake: "Using an ITIN, or an SSN card marked “Not Valid for Employment”", name: "Confirm child age and SSN", text: "Check the child is under 18 at year-end and has a Social Security number that is valid for employment and was issued before you make the election — not an ITIN. If the card is marked “Not Valid for Employment” but the child is now a U.S. citizen or permanent resident, request a new card from the Social Security Administration first." },
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

/* 5-stage summary table shown near the top (plain-language overview).
   The detailed checklist below expands these same five stages into 10
   individual actions — keep the two consistent if either is edited. */
const SUMMARY_COLS: DataCol[] = [
  { key: "step", label: "Stage" },
  { key: "action", label: "What you do", highlight: true },
];
const SUMMARY_ROWS: DataRow[] = [
  { step: "Stage 1", action: "Confirm the child is eligible" },
  { step: "Stage 2", action: "Check SSN and birth-year requirements" },
  { step: "Stage 3", action: "Review IRS Form 4547 instructions" },
  { step: "Stage 4", action: "Complete parent/guardian and child information" },
  { step: "Stage 5", action: "Submit only through official IRS/Treasury channels" },
];

/* Source comparison — what each source is actually for. */
const SOURCE_COMPARE_COLS: DataCol[] = [
  { key: "source", label: "Source" },
  { key: "role", label: "What it's for", highlight: true },
];
const SOURCE_COMPARE_ROWS: DataRow[] = [
  { source: "IRS / Treasury / TrumpAccounts.gov", role: "Official rules and filing instructions" },
  { source: "NRItoUSA", role: "Plain-English explanation for immigrant families" },
  { source: "TaxSaveIQ", role: "Tax calculators and long-term planning comparisons" },
];

/* Who this guide is for. */
const WHO_FOR: React.ReactNode[] = [
  "H-1B parents with U.S.-born children",
  "H-4 families checking a child's eligibility",
  "Green card (permanent resident) parents",
  "U.S. citizen parents",
  <>NRI families planning to <a href="/trump-account-moving-back-to-india" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">move back to India</a></>,
  <>Parents comparing <a href="/trump-account-vs-529-for-h1b-families" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">a Trump Account vs a 529 plan</a></>,
  "Anyone trying to understand IRS Form 4547 before submitting any information",
];

const FILE_OR_WAIT = [
  { h: "Apply now", body: <p>Your U.S.-born child has a valid SSN, is under 18, and (for the $1,000) is a U.S. citizen born in the {CFG.bornWindowLabel} window.</p> },
  { h: "Wait to apply", body: <p>The SSN has not been issued yet. Apply once you have the actual number that matches SSA records.</p> },
  { h: "Do not request the $1,000", body: <p>The child is outside the 2025–2028 window (or is not a U.S. citizen). You may still be able to open the account without the pilot contribution.</p> },
  { h: "Review carefully", body: <p>The child has only an ITIN. Generally not eligible — read the <a href="/trump-account-ssn-itin-child" className="font-semibold text-brand-600 underline">SSN vs ITIN guide</a> before applying.</p> },
];

const JUMP = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Who it's for", href: "#who-for" },
  { label: "5 stages", href: "#summary" },
  { label: "Detailed checklist", href: "#steps" },
  { label: "Info checklist", href: "#checklist" },
  { label: "Official sources", href: "#sources" },
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
        title="How to Apply for a Trump Account: IRS Form 4547 Step-by-Step Guide"
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
                  <p>To apply for a Trump Account, parents or guardians use {CFG.form} to elect an initial Trump Account for an eligible child. If the child qualifies, the same form may also be used to request the {CFG.federalContribution} federal pilot contribution.</p>
                  <p>Before filing, confirm the child's age, valid Social Security number, citizenship/birth-year eligibility, and current IRS/Treasury instructions.</p>
                </>
              }
              ctaText="See the 5 stages"
              ctaHref="#summary"
            />
          </Container>
        </section>

        <section className="py-8">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <WarnBox title="⚠️ NRItoUSA does not open accounts or collect your information">
                <p>Do not enter your child's SSN or family information on random websites claiming to open a Trump Account. Use only official IRS, Treasury, or TrumpAccounts.gov instructions. NRItoUSA does not collect personal information or open accounts.</p>
              </WarnBox>
              <WhichPageBlock currentHref={PATH} />
              <EEATBox lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
              <ReviewedByline date={TRUMP_ACCOUNT_UPDATED} className="mt-4" />
            </div>
          </Container>
        </section>

        {/* Who this guide is for */}
        <section id="who-for" className="scroll-mt-24 py-8">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Who this guide is for</h2>
              <ChecklistBox title="This page is written for" items={WHO_FOR} tone="brand" />
            </div>
          </Container>
        </section>

        {/* 5-step summary (plain-language overview near the top) */}
        <section id="summary" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">The 5 stages to apply, at a glance</h2>
              <DataTable columns={SUMMARY_COLS} rows={SUMMARY_ROWS} caption="A quick overview. The detailed checklist below breaks these same five stages into the individual actions, with the common mistakes at each one." />
            </div>
          </Container>
        </section>

        {/* Steps table (single semantic table — replaces the old ordered list) */}
        <section id="steps" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Detailed checklist: every action, in order</h2>
              <p className="mb-4 text-sm leading-relaxed text-ink-600">
                This expands the five stages above into the individual actions you
                actually take, with the mistake most people make at each one. It
                covers four distinct things that are easy to confuse:{" "}
                <strong>electing to open the account</strong>,{" "}
                <strong>requesting the $1,000 pilot contribution</strong> (a separate
                election, only for eligible children),{" "}
                <strong>activating the account</strong> once Treasury contacts the
                responsible party, and{" "}
                <strong>contributing or choosing an eligible investment</strong>{" "}
                afterwards.
              </p>
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

        {/* Source comparison + official links */}
        <section id="sources" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 text-xl font-bold text-ink-900">Which source does what</h2>
              <DataTable
                columns={SOURCE_COMPARE_COLS}
                rows={SOURCE_COMPARE_ROWS}
                caption="Only the official sources set the rules and accept your filing. Everything else — including this page — is for understanding, not for submitting personal information."
              />
              <div className="mt-6">
                <OfficialSourceBox
                  title="Official IRS and Treasury sources"
                  intro="Trump Accounts are administered by the IRS and the Treasury, not by USCIS. Get the current form and instructions directly from the official sources:"
                  links={trumpAccountSourceLinks}
                />
              </div>
            </div>
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
              heading="Related Trump Account guides"
              links={[
                { label: "Trump Account H-1B guide", href: "/trump-account-h1b-immigrant-families", primary: true },
                { label: "$1,000 eligibility", href: "/trump-account-1000-eligibility" },
                { label: "SSN vs ITIN rules", href: "/trump-account-ssn-itin-child" },
                { label: "Moving back to India", href: "/trump-account-moving-back-to-india" },
                { label: "Trump Account vs 529", href: "/trump-account-vs-529-for-h1b-families" },
              ]}
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-ink-400">{TRUMP_ACCOUNT_SHORT_DISCLAIMER}</p>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={TRUMP_ACCOUNT_UPDATED_HUMAN} />
            <AuthorBioBox
              className="mt-6 max-w-3xl"
              tags={["Trump Accounts & child savings", "Immigrant family finance", "US tax-advantaged accounts"]}
            />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
