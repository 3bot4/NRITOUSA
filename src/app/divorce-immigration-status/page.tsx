import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import Newsletter from "@/components/Newsletter";
import {
  QuickAnswer,
  DataTable,
  Callout,
  WarnBox,
  ChecklistBox,
  DecisionFlow,
  NextStep,
} from "@/components/tools/TrumpAccountUI";
import { TocRail, TocInline, BackToTop } from "@/components/government-benefits/PillarToc";
import AlimonyEstimator from "@/components/tools/AlimonyEstimator";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  DIV_PATH,
  DIV_PUBLISHED,
  DIV_UPDATED,
  DIV_UPDATED_HUMAN,
  divArticleJsonLd,
  divWebAppJsonLd,
  divWebPageJsonLd,
  relatedGuideLinks,
} from "@/lib/divorceImmigrationCluster";
import {
  faqs,
  divorceFacts,
  statusImpactCols,
  statusImpactRows,
  h4OptionsCols,
  h4OptionsRows,
  i751WaiverCols,
  i751WaiverRows,
  goodFaithEvidence,
  i864Terminators,
  indiaRecognitionCols,
  indiaRecognitionRows,
  documentChecklist,
  officialSourceLinks,
  indianAuthorities,
  H4_TIMING_AMBIGUITY,
  DOCUMENT_HANDLING_NOTE,
  SHORT_DISCLAIMER,
  RULES_LAST_VERIFIED_HUMAN,
  OFFICIAL_SOURCES_REVIEWED,
  DIVORCE_DISCLAIMER,
  DISCLAIMER_POINTS,
} from "@/data/divorceImmigrationData";

const TITLE = "Divorce and Immigration Status: H-4, H-1B, Green Card & Citizenship";
const H1 = "Divorce and Your US Immigration Status";
const DESC =
  "What divorce does to H-4 status and its EAD, H-1B, a conditional or 10-year green card, a pending I-485, naturalization and the I-864 — plus whether a US divorce is valid in India.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: DIV_PATH,
  type: "article",
  socialTitle: "Divorce and Your US Immigration Status: What Changes, by Status",
  openGraph: {
    publishedTime: DIV_PUBLISHED,
    modifiedTime: DIV_UPDATED,
    authors: ["Deepak Middha"],
    section: "Immigration",
    tags: ["divorce", "H-4", "H-1B", "green card", "I-751", "I-864", "VAWA", "India"],
  },
});

/* ------------------------------------------------------------------ *
 * Table of contents. Every id here MUST exist on the page —
 * enforced by anchors.test.ts.
 * ------------------------------------------------------------------ */
const JUMP = [
  { id: "quick-answer", label: "Quick answer" },
  { id: "status-table", label: "Effect by status" },
  { id: "h4", label: "If you are on H-4" },
  { id: "h1b", label: "If you are the H-1B holder" },
  { id: "conditional-gc", label: "Conditional (2-year) green card" },
  { id: "ten-year-gc", label: "10-year green card" },
  { id: "pending", label: "Pending I-130 / I-485" },
  { id: "abuse", label: "Abuse: VAWA, U and T" },
  { id: "i864", label: "The I-864 undertaking" },
  { id: "citizenship", label: "Citizenship afterwards" },
  { id: "india", label: "Is a US divorce valid in India?" },
  { id: "children", label: "Children, custody and India" },
  { id: "checklist", label: "Document checklist" },
  { id: "estimator", label: "Alimony comparison" },
  { id: "faq", label: "FAQs" },
  { id: "sources", label: "Official sources" },
];

/* ------------------------------------------------------------------ *
 * Small local presentational helpers
 * ------------------------------------------------------------------ */

/**
 * Section heading. Deliberately carries NO id — the enclosing <section> owns
 * the anchor, so there is exactly one id per section and the ToC can never
 * point at a duplicate.
 */
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">{children}</h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold tracking-tight text-ink-900">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-ink-700">{children}</p>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
    >
      {children}
    </Link>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
    >
      {children}
    </a>
  );
}

/** A verified figure with its year, jurisdiction, source and check date. */
function FactChip({ f }: { f: (typeof divorceFacts)[string] }) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.label}</p>
      <p className="mt-1 text-lg font-extrabold leading-snug text-ink-900">{f.value}</p>
      <p className="mt-1 text-xs text-ink-600">
        {f.year} · {f.jurisdiction}
      </p>
      {f.note && <p className="mt-2 text-xs leading-relaxed text-ink-600">{f.note}</p>}
      <p className="mt-2 text-xs text-ink-500">
        <Ext href={f.sourceUrl}>{f.sourceName} ↗</Ext> · verified {f.lastVerified}
      </p>
    </div>
  );
}

/**
 * Compact "Primary source: …" label placed next to a high-risk legal claim, so
 * a reader can check the assertion without scrolling to the sources box.
 * Links are real URLs pulled from the data file — never hand-typed here.
 */
function SrcNote({
  label = "Primary source",
  items,
}: {
  label?: string;
  items: { name: string; href: string }[];
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-ink-900/10 bg-slate-50/70 px-3 py-2 text-xs text-ink-600">
      <span className="font-bold uppercase tracking-wide text-ink-500">{label}:</span>
      {items.map((s, i) => (
        <span key={s.href}>
          <Ext href={s.href}>{s.name} ↗</Ext>
          {i < items.length - 1 && <span className="text-ink-400"> ·</span>}
        </span>
      ))}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-[15px] leading-relaxed text-ink-700">
          <span aria-hidden className="mt-1.5 flex-none text-brand-500">
            •
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  const jsonLd = jsonLdGraph(
    divWebPageJsonLd(),
    divArticleJsonLd(),
    divWebAppJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Divorce and Immigration Status", url: DIV_PATH },
    ]),
    faqJsonLd(faqs),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="divorce-immigration-status"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Divorce & Status" },
        ]}
        icon="⚖️"
        category="Immigration · Family"
        title={H1}
        hook="If your immigration status depends on your marriage, the timing of the divorce can matter enormously. Learn what changes for H-4, H-1B, green-card holders, pending cases and citizenship — and what to consider before the divorce becomes final."
        badges={["Free & private", "No signup", "Primary sources cited", "US + India"]}
        accent="from-brand-600 to-rose-600"
        sourceNote={
          <>
            <strong>{SHORT_DISCLAIMER}</strong>
            <br />
            Sources last checked <strong>{RULES_LAST_VERIFIED_HUMAN}</strong> against{" "}
            {OFFICIAL_SOURCES_REVIEWED} primary sources — USCIS policy, the CFR, state statutes
            and reported Indian judgments. That is source verification, not attorney review; this
            page has not been reviewed by a lawyer.
          </>
        }
        topDisclaimer={SHORT_DISCLAIMER}
        disclaimerIntro={DIVORCE_DISCLAIMER}
        disclaimerPoints={DISCLAIMER_POINTS}
      >
        {/*
          ToolFirstLayout renders {children} raw — its header is wrapped in a
          <Container> but the body is not — so the page supplies its own. At xl
          the TOC gets its own grid column so it can never overlap the prose,
          and the article column carries min-w-0 so the wide tables shrink
          inside it instead of forcing the grid open. See the note in
          government-benefits/PillarToc.tsx for why this TOC and not ArticleToc.
        */}
        <Container className="py-8 sm:py-10">
          <div className="xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8">
            <aside className="hidden xl:block">
              <TocRail items={JUMP} />
            </aside>

            {/* Not a <main>: the root layout already renders one. */}
            <div data-article-main className="min-w-0 space-y-12">
              <div className="xl:hidden">
                <TocInline items={JUMP} />
              </div>

              {/* ---------------- Answer first ---------------- */}
              <section id="quick-answer" className="scroll-mt-24">
                <QuickAnswer
                  question="Does divorce affect my immigration status?"
                  answer={
                    <>
                      <p>
                        It depends first on one question:{" "}
                        <strong>is your status derivative?</strong> If your permission to be in
                        the United States comes through your spouse, ending the marriage can end
                        the relationship that status rests on. If you hold status in your own
                        right, a divorce generally changes much less.
                      </p>
                      <p>
                        Timing matters more than most of the detail below. For a derivative
                        status, options that are straightforward while you are still married can
                        become considerably harder afterwards, so the practical rule is to
                        identify and file what you can{" "}
                        <em>before</em> the divorce becomes final. What the consequences actually
                        are in your case depends on your facts, which is why this is a
                        conversation to have with an immigration attorney rather than a deadline
                        to calculate on your own.
                      </p>
                    </>
                  }
                  bullets={[
                    <>
                      <strong>On H-4, F-2 or L-2:</strong> high urgency — explore a change of
                      status or another filing while still eligible.
                    </>,
                    <>
                      <strong>On H-1B, or holding a 10-year green card:</strong> your own status
                      generally continues.
                    </>,
                    <>
                      <strong>On a conditional 2-year card:</strong> you generally keep it, and
                      file <A href="/i90-vs-i751">Form I-751</A> with a joint-filing waiver.
                    </>,
                    <>
                      <strong>With an I-130 or I-485 pending:</strong> a high-risk situation —
                      take advice before anyone files for divorce.
                    </>,
                  ]}
                />
              </section>

              {/* ---------------- Status matrix ---------------- */}
              <section id="status-table" className="scroll-mt-24 space-y-4">
                <H2>General effect of divorce, by status</H2>
                <P>
                  Find your own row first. Urgency here means how quickly the options worth
                  considering tend to narrow — not a legal deadline, which depends on your facts.
                </P>
                <DataTable
                  columns={statusImpactCols}
                  rows={statusImpactRows}
                  keyRows={["H-4 dependent", "Pending marriage-based I-130 / I-485"]}
                />
                <SrcNote
                  label="Primary sources"
                  items={[
                    { name: "USCIS Policy Manual", href: "https://www.uscis.gov/policy-manual" },
                    {
                      name: "8 CFR § 214.1",
                      href: divorceFacts.gracePeriod60.sourceUrl,
                    },
                  ]}
                />
              </section>

              {/* ---------------- H-4 ---------------- */}
              <section id="h4" className="scroll-mt-24 space-y-4">
                <H2>If you are on H-4</H2>
                <P>
                  This is often the most difficult situation on the list, and it weighs heavily on
                  Indian families, because the H-4 spouse is frequently the one who gave up a
                  career in India to make the move.
                </P>
                <P>
                  H-4 is a dependent status: it exists because of the marriage to the H-1B
                  principal. A final divorce can end the qualifying relationship that status rests
                  on. As for the EAD, if the H-4 status supporting it ends, you should not assume
                  the expiration date printed on the card continues to authorize employment — get
                  individualized immigration advice before continuing to work.
                </P>

                <Callout kind="note" title="What the law does and does not settle here">
                  <p>{H4_TIMING_AMBIGUITY}</p>
                </Callout>

                <WarnBox title="Do not assume the 60-day provision applies after a divorce">
                  <p>
                    The 60-day provision people cite comes from a regulation about{" "}
                    <em>cessation of employment</em> for certain nonimmigrant workers. It does not
                    expressly create a 60-day period for a dependent whose qualifying marriage has
                    ended, so it should not be assumed to apply here. Waiting on the strength of
                    it is a common mistake, and it can consume the time in which other options are
                    still realistic.
                  </p>
                </WarnBox>

                <Callout kind="tip" title="Three different things, often confused">
                  <ul className="ml-4 list-disc space-y-1.5">
                    <li>
                      <strong>Status violation</strong> — whether the terms of your nonimmigrant
                      status are still being met.
                    </li>
                    <li>
                      <strong>Unlawful presence</strong> — a period counted under the statute,
                      determined by rules that depend on the facts and on any pending application.
                    </li>
                    <li>
                      <strong>Unauthorized employment</strong> — working without valid
                      authorization, which is a separate problem with separate consequences.
                    </li>
                  </ul>
                  <p>
                    The three-year and ten-year re-entry bars turn on{" "}
                    <strong>departure from the United States</strong> after the relevant period has
                    accrued, rather than on the accrual by itself.
                  </p>
                </Callout>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.gracePeriod60} />
                  <FactChip f={divorceFacts.unlawfulPresence3Year} />
                </div>

                <H3>Options worth exploring</H3>
                <DataTable
                  columns={h4OptionsCols}
                  rows={h4OptionsRows}
                  caption="Lead time is usually the deciding column. Several of these cannot be assembled in the weeks between deciding to divorce and the decree, which is why the conversation is worth having early."
                  keyRows={[
                    "Change of status to B-2 (visitor)",
                    "U or T nonimmigrant status (crime and trafficking victims)",
                  ]}
                />
                <SrcNote
                  items={[
                    { name: "USCIS — Form I-539", href: "https://www.uscis.gov/i-539" },
                    {
                      name: "USCIS — U nonimmigrant status",
                      href: "https://www.uscis.gov/humanitarian/victims-of-criminal-activity-u-nonimmigrant-status",
                    },
                  ]}
                />

                <P>
                  Where a change of status is the route, filing{" "}
                  <strong>while you are still eligible to file it</strong> is what keeps the option
                  open, and a timely-filed application can affect what happens while it is pending.
                  Once your lawful status ends, you may begin accruing unlawful presence depending
                  on the facts of your case and how the period is determined. Because
                  unlawful-presence consequences can be serious, it is worth establishing what
                  status or filing options may be available before the divorce rather than after.
                </P>

                <DecisionFlow
                  title="A sequence worth discussing with counsel"
                  nodes={[
                    { text: "Divorce is in prospect and you are on H-4", kind: "start" },
                    {
                      text: "Speak to an immigration attorney before the family case is filed",
                      kind: "action",
                      branch: "first",
                    },
                    { text: "Which options are realistically open to you?", kind: "decision" },
                    {
                      text: "Assemble the package — an I-20 for F-1, or the I-539 for B-2",
                      kind: "action",
                      branch: "takes weeks",
                    },
                    { text: "File while you are still eligible to file", kind: "action" },
                    { text: "Then the family case proceeds to a final decree", kind: "end" },
                  ]}
                />

                <Callout kind="tip" title="Coordinating the timing is a normal request">
                  <p>
                    Asking your family lawyer to consider immigration timing when scheduling a final
                    decree is a legitimate and routine request. Many divorce attorneys will not raise
                    it, because immigration is not their practice area, so it is worth raising
                    yourself. It is an important step and it costs nothing to ask.
                  </p>
                </Callout>
              </section>

              {/* ---------------- H-1B ---------------- */}
              <section id="h1b" className="scroll-mt-24 space-y-4">
                <H2>If you are the H-1B holder</H2>
                <P>
                  Your own status rests on your employer and your petition rather than on your
                  marriage, so it is generally unaffected. There is no H-1B filing prompted by the
                  divorce itself, and extensions, transfers and an approved{" "}
                  <A href="/i140-processing-time">I-140</A> are not disturbed by it. An approved
                  I-140 and the priority date attached to it belong to you as the principal
                  beneficiary.
                </P>
                <P>Two things sit elsewhere and are worth attention.</P>
                <Bullets
                  items={[
                    "Your spouse's H-4 is affected by the end of the marriage. Your children's H-4 derives from the parent-child relationship, which the divorce does not end — including where they live with the other parent. Custody, travel consent and passport custody are separate questions that immigration status does not resolve.",
                    "A derivative claim in your green card case is affected. Where your I-485 is pending and your spouse was a derivative applicant, that derivative side of the case is affected by the end of the marriage while your own case continues.",
                  ]}
                />
                <P>
                  If you sponsored your spouse for a green card, the section on{" "}
                  <a
                    href="#i864"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    Form I-864
                  </a>{" "}
                  is the one likely to matter to you. It is a financial undertaking rather than an
                  immigration filing, which is a common reason it gets overlooked.
                </P>
              </section>

              {/* ---------------- Conditional GC ---------------- */}
              <section id="conditional-gc" className="scroll-mt-24 space-y-4">
                <H2>If you have a conditional (2-year) green card</H2>
                <P>
                  A marriage-based green card approved while the marriage was under two years old
                  comes with conditions attached. Normally you and your spouse file Form I-751
                  together in the 90 days before the card expires, to remove them.
                </P>
                <P>
                  A divorce does not close that path — it changes how you take it:{" "}
                  <strong>
                    you file I-751 on your own, requesting a waiver of the joint-filing requirement
                  </strong>
                  . There are three separate waiver grounds, they do not all require a divorce, and
                  they do not work identically. A common misconception is that only the first
                  exists.
                </P>

                <DataTable
                  columns={i751WaiverCols}
                  rows={i751WaiverRows}
                  caption="More than one ground may be requested on the same petition. Confirm current terminology and requirements against USCIS guidance before filing."
                  keyRows={["Battery or extreme cruelty"]}
                />
                <SrcNote
                  items={[
                    {
                      name: "USCIS Policy Manual Vol. 6, Pt. I, Ch. 5",
                      href: divorceFacts.i751WaiverWindow.sourceUrl,
                    },
                    { name: "USCIS — Form I-751", href: "https://www.uscis.gov/i-751" },
                  ]}
                />

                <Callout kind="mistake" title="The 90-day window governs joint petitions">
                  <p>
                    That window is a rule about <em>joint</em> petitions. USCIS guidance indicates a
                    waiver request may be filed once a waiver ground applies — before, during or
                    after the 90 days. Waiting for a window that does not govern a waiver request is
                    a common misconception and can cost time.
                  </p>
                </Callout>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.i751JointWindow} />
                  <FactChip f={divorceFacts.i751WaiverWindow} />
                </div>

                <H3>What the good-faith ground turns on</H3>
                <P>
                  Whether the marriage was <strong>entered into in good faith</strong> — the intent
                  at the outset, rather than how long it lasted or who was responsible for the
                  breakdown. A marriage that was genuine and later broke down is the situation this
                  waiver exists to address. The evidence that speaks to it generally comes from the
                  beginning and middle of the relationship rather than the end.
                </P>
                <ChecklistBox title="Evidence that tends to carry weight" items={goodFaithEvidence} />

                <WarnBox title="If the I-751 deadline arrives before the decree does">
                  <p>
                    Filing is generally preferable to letting conditional status lapse. Divorce
                    proceedings in several states run longer than the conditional card's validity,
                    and USCIS guidance describes a path for this: the petition is filed, a Request
                    for Evidence may issue asking for the final decree, and the marriage may
                    terminate during the response period. Raise the timing with both your
                    immigration and family lawyers early rather than discovering the conflict later.
                  </p>
                </WarnBox>
              </section>

              {/* ---------------- 10-year GC ---------------- */}
              <section id="ten-year-gc" className="scroll-mt-24 space-y-4">
                <H2>If you have a 10-year green card</H2>
                <P>
                  Once conditions have been removed, permanent residence is held in your own right.
                  A divorce is not itself a ground of removability and does not change{" "}
                  <A href="/green-card-renewal">card renewal</A>.
                </P>
                <P>
                  The consequence that does follow concerns the naturalization timeline, covered{" "}
                  <a
                    href="#citizenship"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    further down this page
                  </a>
                  . Separately, where a question arises about whether the marriage was entered into
                  in good faith at the outset, that is a distinct inquiry with its own evidence
                  rather than a consequence of the marriage ending.
                </P>
              </section>

              {/* ---------------- Pending case ---------------- */}
              <section id="pending" className="scroll-mt-24 space-y-4">
                <H2>If your green card case is still pending</H2>
                <P>
                  This is a high-risk situation. A Form I-130 filed by a US-citizen or
                  permanent-resident spouse rests on a qualifying relationship. For a typical
                  marriage-based I-130 and{" "}
                  <A href="/i485-processing-time">I-485</A>, ending the qualifying marriage can
                  eliminate the basis for the petition and the adjustment application. Exceptions
                  and alternative immigration pathways may apply depending on the circumstances.
                </P>
                <P>Alternatives that do not depend on the former spouse can include:</P>
                <Bullets
                  items={[
                    "Abuse-related protections, where they apply — a VAWA self-petition where the spouse is a US citizen or permanent resident, or U or T nonimmigrant status, each with its own eligibility requirements.",
                    "An employment-based petition through an employer, where one is available.",
                    "An independent self-petition such as an EB-2 national-interest waiver, where the professional profile genuinely supports it.",
                    "A change to a nonimmigrant classification you independently qualify for.",
                  ]}
                />
                <P>
                  None of these is quick, and which are realistic depends on facts a page cannot
                  see. See the{" "}
                  <a
                    href="#abuse"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    abuse-related protections
                  </a>{" "}
                  section for how VAWA, U and T differ.
                </P>
                <Callout kind="insight" title="Sequencing matters here">
                  <p>
                    Where a marriage-based case is pending and the marriage is failing, speaking to
                    an immigration attorney <em>before</em> anyone files for divorce is an important
                    step. The order of events can change which options remain available, and it is
                    one of the few parts of the process still within your control.
                  </p>
                </Callout>
              </section>

              {/* ---------------- Abuse ---------------- */}
              <section id="abuse" className="scroll-mt-24 space-y-4">
                <H2>Abuse-related protections: VAWA, U and T</H2>
                <P>
                  Two different routes exist here, and which may be open depends on{" "}
                  <strong>the abusive spouse&rsquo;s immigration status</strong> as well as on the
                  facts. Each has its own eligibility requirements, and a divorce by itself does not
                  create eligibility for any of them.
                </P>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      If the abusive spouse is a US citizen or permanent resident
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-ink-900">VAWA self-petition</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                      Allows an abused spouse to petition on their own behalf, without the
                      abuser&rsquo;s knowledge, participation or signature. Because it does not
                      depend on the other spouse filing anything, it can open a path for someone
                      whose case otherwise rested entirely on them. Available regardless of gender.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                      If the abusive spouse holds H-1B, L-1 or another temporary status
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-ink-900">
                      U or T nonimmigrant status
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                      A VAWA self-petition is not available in this situation, because the statute
                      requires the abuser to be a citizen or permanent resident. Depending on the
                      facts, U or T classification may provide an alternative, since neither depends
                      on the abuser&rsquo;s immigration status. Both carry their own requirements —
                      for U status, a qualifying crime and helpfulness to law enforcement, usually
                      evidenced by a certification.
                    </p>
                  </div>
                </div>

                <WarnBox title="A common misconception worth correcting">
                  <p>
                    A great deal of NRI-facing content directs abused H-4 spouses to file under
                    VAWA. That route requires the abusive spouse to be a US citizen or lawful
                    permanent resident, and an H-1B holder is neither — a statutory requirement
                    rather than a documentation problem. If you have been told otherwise, it is
                    worth a second opinion from an immigration attorney or a DOJ-accredited
                    representative before committing time or money to it.
                  </p>
                </WarnBox>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.vawaPrerequisite} />
                  <FactChip f={divorceFacts.vawaAfterDivorce} />
                </div>

                <H3>What a VAWA self-petition broadly requires</H3>
                <Bullets
                  items={[
                    "A qualifying marriage to a US citizen or lawful permanent resident, entered into in good faith",
                    "Battery or extreme cruelty during the marriage — extreme cruelty is not limited to physical violence and can include coercive control, threats relating to immigration status, financial isolation and withholding of documents",
                    "That you resided with the abusive spouse",
                    "Good moral character",
                  ]}
                />
                <SrcNote
                  items={[
                    {
                      name: "USCIS Policy Manual Vol. 3, Pt. D, Ch. 2",
                      href: divorceFacts.vawaPrerequisite.sourceUrl,
                    },
                    {
                      name: "USCIS — Abused Spouses, Children and Parents",
                      href: divorceFacts.vawaAfterDivorce.sourceUrl,
                    },
                  ]}
                />
                <P>
                  Two patterns recur in immigrant households and are often not recognized as abuse
                  by the person experiencing them: using a pending immigration petition as leverage,
                  and withholding a spouse&rsquo;s passport or immigration documents. Both can be
                  relevant to the analysis, though whether a particular history meets the statutory
                  standard is a question for counsel.
                </P>
                <Callout kind="note" title="Already divorced?">
                  <p>
                    A VAWA self-petition may still be possible, generally within two years of the
                    termination of the marriage, and it requires showing a connection between the
                    abuse and the end of the marriage alongside the other requirements. It is worth
                    asking rather than assuming either way.
                  </p>
                </Callout>
              </section>

              {/* ---------------- I-864 ---------------- */}
              <section id="i864" className="scroll-mt-24 space-y-4">
                <H2>The undertaking a divorce does not resolve: Form I-864</H2>
                <P>
                  If you sponsored your spouse for a green card, you signed Form I-864, the
                  Affidavit of Support — frequently treated as a formality at the time. It is an
                  undertaking given to the federal government under INA § 213A, and the sponsored
                  immigrant is among those who may seek to enforce it. Under it the sponsor
                  undertakes to maintain the sponsored immigrant&rsquo;s income at 125% of the
                  federal poverty guidelines. <strong>Divorce is not among the conditions the
                  regulation lists as terminating it.</strong>
                </P>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.i864Threshold} />
                  <FactChip f={divorceFacts.povertyGuidelines2026} />
                </div>

                <WarnBox title="Termination conditions under 8 CFR § 213a.2(e)(2)">
                  <ul className="ml-4 list-disc space-y-1.5">
                    {i864Terminators.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p>
                    <strong>Divorce does not appear on that list.</strong> Termination also does not
                    relieve a sponsor of a reimbursement obligation that accrued before the
                    undertaking ended.
                  </p>
                </WarnBox>
                <SrcNote
                  items={[
                    { name: "8 CFR § 213a.2", href: divorceFacts.i864Termination.sourceUrl },
                    {
                      name: "USCIS Policy Manual Vol. 8, Pt. G, Ch. 6",
                      href: divorceFacts.i864Quarters.sourceUrl,
                    },
                    { name: "USCIS — Form I-864", href: "https://www.uscis.gov/i-864" },
                  ]}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.i864Quarters} />
                  <FactChip f={divorceFacts.i864Termination} />
                </div>

                <P>
                  The practical consequence is one many sponsors do not anticipate. A sponsored
                  former spouse whose income falls below the threshold may bring a claim to enforce
                  the undertaking. How such claims are treated after a divorce has been litigated in
                  state and federal courts, and outcomes have varied — including on whether the
                  undertaking can be waived by agreement, and on what a court does with a settlement
                  that addresses spousal support without mentioning it.
                </P>
                <P>
                  What follows practically is that it runs <strong>alongside</strong> alimony rather
                  than in place of it, and a settlement that waives spousal support does not
                  automatically dispose of it. If you are the sponsoring spouse, raise it explicitly
                  in the negotiation and in writing. If you are the sponsored spouse, it is worth
                  knowing the undertaking exists before you sign anything.
                </P>
                <Callout kind="crossborder" title="If a newly single household is the issue">
                  <p>
                    A household that has just lost an income has its own set of questions about what
                    it can and cannot claim by immigration status — including how an I-864 sponsor&rsquo;s
                    reimbursement duty interacts with it. That is a different analysis, and it has
                    its own guide:{" "}
                    <A href="/usa-government-benefits-immigrants">
                      government benefits for immigrants
                    </A>
                    .
                  </p>
                </Callout>
              </section>

              {/* ---------------- Citizenship ---------------- */}
              <section id="citizenship" className="scroll-mt-24 space-y-4">
                <H2>Citizenship after divorce</H2>
                <P>
                  Permanent residents generally apply to naturalize after five years of residence.
                  A shortened three-year route exists for spouses of US citizens, but it requires
                  living in marital union with the same citizen spouse for the three years before
                  filing, and USCIS guidance requires that union to continue through naturalization.
                </P>
                <P>
                  A divorce generally ends access to that shortened route, leaving the standard
                  five-year requirement.{" "}
                  <strong>
                    Time already accrued as a permanent resident is not lost — the applicable period
                    changes rather than restarting.
                  </strong>{" "}
                  Legal separation raises the same question about marital union and is worth
                  discussing with counsel rather than assuming either way.
                </P>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.naturalizationFiveYear} />
                  <FactChip f={divorceFacts.naturalizationThreeYear} />
                </div>
                <SrcNote
                  items={[
                    {
                      name: "USCIS Policy Manual Vol. 12, Pt. G",
                      href: divorceFacts.naturalizationThreeYear.sourceUrl,
                    },
                    {
                      name: "USCIS Policy Manual Vol. 12, Pt. D",
                      href: divorceFacts.naturalizationFiveYear.sourceUrl,
                    },
                  ]}
                />
                <P>
                  If you have already naturalized, citizenship is held in your own right and does
                  not depend on the marriage continuing.
                </P>
              </section>

              {/* ---------------- India ---------------- */}
              <section id="india" className="scroll-mt-24 space-y-4">
                <H2>Is a US divorce valid in India?</H2>
                <P>
                  Not automatically. Recognition depends on whether the foreign decree satisfies
                  Section 13 of the Code of Civil Procedure and the applicable personal-law
                  requirements. The Supreme Court of India addressed how those conditions apply to
                  foreign matrimonial decrees in{" "}
                  <em>Y. Narasimha Rao v. Y. Venkata Lakshmi</em> (1991), reading several of them
                  narrowly in the matrimonial context.
                </P>

                <DataTable
                  columns={indiaRecognitionCols}
                  rows={indiaRecognitionRows}
                  caption="Section 13 makes a foreign judgment conclusive except in the enumerated situations. A decree that falls into one of them may not be treated as conclusive in India."
                  keyRows={[
                    "The judgment is not founded on an incorrect view of international law or a refusal to recognize Indian law where applicable",
                  ]}
                />

                <P>
                  Some US no-fault divorces may face recognition problems in India depending on the
                  divorce ground, the jurisdiction, the participation of the parties, and the
                  circumstances of the case. The point that most often needs addressing is that{" "}
                  <strong>
                    irretrievable breakdown is not among the grounds for divorce listed in the Hindu
                    Marriage Act
                  </strong>
                  , and the Supreme Court&rsquo;s power to dissolve a marriage on that basis rests on
                  Article 142 of the Constitution rather than on the statute. A decree obtained
                  where both spouses appeared voluntarily generally stands on stronger ground than
                  one entered by default.
                </P>

                <WarnBox title="Confirm recognition before remarrying">
                  <p>
                    Before remarrying, confirm that the divorce is recognized under the law
                    applicable to the first marriage. Where a first marriage subsists under Indian
                    law, remarriage raises exposure under Section 82 of the Bharatiya Nyaya Sanhita,
                    the successor provision to Section 494 of the Indian Penal Code. Resolving the
                    Indian position first can create serious problems if left until afterwards.
                  </p>
                </WarnBox>

                <H3>Establishing your status in India</H3>
                <P>
                  Where you need certainty — to remarry, to deal with property, or for anything
                  official — two routes are commonly used. A <strong>declaratory suit</strong> in an
                  Indian court confirming your marital status, or a fresh{" "}
                  <strong>Section 13B mutual-consent petition</strong> under the Hindu Marriage Act.
                  Where both spouses cooperate and Section 13B is available, a mutual-consent
                  proceeding may provide a clearer route to establishing marital status in India.
                </P>
                <P>
                  A mutual-consent proceeding can often be pursued from the United States. A
                  notarized power of attorney, legalized as the receiving court requires, can allow
                  an advocate to act for you, and Indian courts have permitted appearance by video
                  conference. Section 13B involves two motions with a statutory interval between
                  them, which a court may waive in appropriate cases. Contested proceedings are
                  considerably harder to run remotely. Confirm the requirements with an advocate
                  practising before the relevant court.
                </P>
                <P>
                  Separately, a US decree does not resolve custody, maintenance or property situated
                  in India. Those generally require attention under Indian law on their own merits.
                </P>

                <H3>The Indian authorities this section refers to</H3>
                <div className="space-y-2.5">
                  {indianAuthorities.map((a) => (
                    <div
                      key={a.cite}
                      className="rounded-xl border border-ink-900/10 bg-white p-4 shadow-card"
                    >
                      <p className="text-sm font-bold text-ink-900">{a.cite}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{a.point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ---------------- Children ---------------- */}
              <section id="children" className="scroll-mt-24 space-y-4">
                <H2>Children, custody and India</H2>
                <P>
                  A child&rsquo;s H-4 status derives from the parent-child relationship with the
                  H-1B holder, which a divorce between the parents does not end. A US-citizen
                  child&rsquo;s status is not affected by the divorce at all.
                </P>
                <P>
                  The cross-border complication is enforcement.{" "}
                  <strong>
                    India is not a party to the Hague Convention on the Civil Aspects of
                    International Child Abduction
                  </strong>
                  , so a US custody order does not automatically resolve enforcement questions in
                  India, and a cross-border custody dispute involving India can require separate
                  proceedings and legal advice there. Outcomes in this area are highly fact-specific.
                </P>
                <ChecklistBox
                  tone="brand"
                  title="Worth addressing in the settlement rather than assuming"
                  items={[
                    "Who physically holds each child's US passport, Indian passport and OCI card",
                    "Written consent requirements for international travel, and how far in advance",
                    "What happens to an OCI card if a parent's own status changes",
                    "Which court has continuing jurisdiction over custody modifications",
                    "Whether either parent may apply for or renew a child's Indian documents alone",
                  ]}
                />
              </section>

              {/* ---------------- Checklist ---------------- */}
              <section id="checklist" className="scroll-mt-24 space-y-4">
                <H2>Document checklist</H2>
                <P>
                  Assembling this before the household separates is considerably easier than
                  afterwards. Access to joint records can be lost quickly, and both the I-751 and
                  I-864 questions later on turn on documents that are straightforward to obtain
                  while you still have access to them.
                </P>
                <ChecklistBox title="Gather copies of these" items={documentChecklist} />
                <Callout kind="tip" title="Originals, translations and legalization">
                  <p>{DOCUMENT_HANDLING_NOTE}</p>
                </Callout>
              </section>

              {/* ---------------- Estimator ---------------- */}
              <section id="estimator" className="scroll-mt-24 space-y-4">
                <H2>Illustrative alimony &amp; maintenance comparison</H2>
                <P>
                  Spousal support is the other figure that shapes these decisions. It is
                  discretionary everywhere, though negotiations and temporary orders often start
                  from a guideline benchmark. Because an Indian marriage may have a second forum in
                  play, this places a US state benchmark beside a reference point drawn from Indian
                  case law for the same couple. Neither is a prediction of a court award.
                </P>

                <AlimonyEstimator />

                <H3>How to read the two columns</H3>
                <P>
                  The US column applies the guideline associated with the state selected —
                  California&rsquo;s Santa Clara formula for temporary support, New York&rsquo;s
                  statutory formula under DRL § 236(B)(6), the Texas statutory cap, or the AAML
                  benchmark elsewhere. Final awards are decided on statutory factors and commonly
                  differ from any guideline figure.
                </P>
                <P>
                  Two jurisdiction-specific points are worth naming, because a calculator that
                  ignores them can mislead. <strong>Texas requires specified eligibility conditions
                  before maintenance can be ordered</strong> — generally a marriage of ten years or
                  longer, or a statutory exception, alongside a showing about minimum reasonable
                  needs. And <strong>New York applies its formula up to a statutory income
                  cap</strong>, with any award on income above the cap left to the court&rsquo;s
                  assessment of the statutory factors.
                </P>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.txEligibility} />
                  <FactChip f={divorceFacts.nyIncomeCap} />
                </div>
                <P>
                  The India column applies a reference point rather than a formula. India has no
                  statutory maintenance formula; the Supreme Court of India referred to 25% of net
                  salary as a just-and-proper figure in a particular case,{" "}
                  <em>Kalyan Dey Chowdhury v. Rita Dey Chowdhury</em> (2017), and Indian courts
                  decide on the facts and circumstances of each case. Under{" "}
                  <em>Rajnesh v. Neha</em> both parties file an affidavit of disclosure of assets
                  and income, and Indian courts may consider a spouse&rsquo;s actual US income and
                  earning capacity when determining maintenance, depending on the facts and
                  applicable law.
                </P>
                <Callout kind="reminder" title="The tax treatment changed, so older figures are not comparable">
                  <p>
                    For agreements executed after December 31, 2018, alimony is not deductible by
                    the payer and not taxable to the recipient. Anchoring on what someone paid or
                    received under an older agreement compares pre-tax and post-tax dollars.
                  </p>
                </Callout>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.alimonyTaxTreatment} />
                  <FactChip f={divorceFacts.usdInr} />
                </div>
                <P>
                  Neither column includes child support, division of property, retirement accounts
                  and the QDRO that divides them, Indian real estate, NRE and NRO balances, or{" "}
                  <em>stridhan</em> claims, which sit separately from maintenance. Several of those
                  can be larger than the maintenance figure.
                </P>
              </section>

              {/* ---------------- FAQ ---------------- */}
              <section id="faq" className="scroll-mt-24">
                <ToolFaq items={faqs} />
              </section>

              {/* ---------------- Sources ---------------- */}
              <section id="sources" className="scroll-mt-24 space-y-4">
                <H2>Official sources</H2>
                <P>
                  Every legal claim on this page is drawn from the sources below. They were checked
                  on {RULES_LAST_VERIFIED_HUMAN} — source verification, not attorney review.
                </P>
                <OfficialSourceBox
                  title="Primary sources"
                  intro="Immigration rules change, and adjudicators apply them to the facts of individual cases. Verify anything you are about to act on against the source:"
                  links={officialSourceLinks}
                />
              </section>

              {/* ---------------- Next steps ---------------- */}
              <section className="space-y-6">
                <NextStep
                  heading="Where to go next"
                  links={[
                    { label: "I-90 vs I-751 — which form applies", href: "/i90-vs-i751" },
                    { label: "Government benefits by status", href: "/usa-government-benefits-immigrants" },
                    { label: "What an immigration attorney costs", href: "/immigration-attorney-lawyer-cost" },
                  ]}
                />

                <div className="mx-auto max-w-3xl">
                  <h2 className="mb-3 text-lg font-bold text-ink-900">Related guides</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {relatedGuideLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="group flex h-full flex-col rounded-xl border border-ink-900/10 bg-white px-4 py-3 transition hover:border-brand-400"
                        >
                          <span className="text-sm font-bold text-ink-900 group-hover:text-brand-700">
                            {l.label}
                          </span>
                          <span className="mt-0.5 text-xs leading-relaxed text-ink-500">
                            {l.desc}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <AuthorReviewLine lastUpdated={DIV_UPDATED_HUMAN} />
                {/*
                  Point of honesty: AuthorReviewLine reads "Written / reviewed by".
                  On a page about immigration and family law that could be read as
                  legal review, which has not happened. This states what the
                  byline does and does not mean.
                */}
                <p className="mx-auto max-w-3xl text-xs leading-relaxed text-ink-500">
                  Deepak Middha is a CA and Series 65 holder who reviews the financial and tax
                  explanations on this site. He is not an immigration attorney or a family lawyer,
                  and <strong>this page has not been reviewed by an attorney</strong>. The
                  verification date above refers to the checking of the cited sources, not to legal
                  review, and nothing here is legal representation. {SHORT_DISCLAIMER}
                </p>
                <Newsletter />
              </section>
            </div>
          </div>
        </Container>

        <BackToTop />
      </ToolFirstLayout>
    </>
  );
}
