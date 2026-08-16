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
  socialTitle: "Divorce and Your US Immigration Status: The Deadlines Nobody Tells You About",
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
  { id: "quick-answer", label: "The quick answer" },
  { id: "status-table", label: "Effect on each status" },
  { id: "h4", label: "If you are on H-4" },
  { id: "h1b", label: "If you are the H-1B holder" },
  { id: "conditional-gc", label: "Conditional (2-year) green card" },
  { id: "ten-year-gc", label: "10-year green card" },
  { id: "pending", label: "With a case still pending" },
  { id: "abuse", label: "If there was abuse" },
  { id: "i864", label: "The I-864 obligation" },
  { id: "citizenship", label: "Citizenship afterwards" },
  { id: "estimator", label: "Alimony estimator" },
  { id: "india", label: "Is your US divorce valid in India?" },
  { id: "children", label: "Children, custody and India" },
  { id: "checklist", label: "Document checklist" },
  { id: "sources", label: "Official sources" },
  { id: "faq", label: "FAQs" },
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
        hook="If your right to be here came through the marriage, the decree date is an immigration deadline — and almost everything worth filing has to be filed before it."
        badges={["Free & private", "No signup", "Every rule sourced", "US + India"]}
        accent="from-brand-600 to-rose-600"
        sourceNote={
          <>
            Rules last verified <strong>{RULES_LAST_VERIFIED_HUMAN}</strong> against{" "}
            {OFFICIAL_SOURCES_REVIEWED} primary sources — USCIS policy, the CFR, state statutes
            and reported Indian judgments.
          </>
        }
        topDisclaimer="Educational information only — not legal advice. Immigration and family law decisions need a licensed attorney."
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
                  question="Does divorce cost me my immigration status?"
                  answer={
                    <>
                      <p>
                        It comes down to one question: <strong>is your status derivative?</strong>{" "}
                        If your right to be in the United States flows through your spouse, ending
                        the marriage cuts the cord. If you hold status in your own right, divorce
                        is mostly a paperwork event.
                      </p>
                      <p>
                        The timing rule matters more than any of the detail below.{" "}
                        <strong>
                          For a derivative status, the date the divorce becomes final is the date
                          your status ends
                        </strong>{" "}
                        — not the date you separate, and not the date you file. Everything you
                        might want to file instead should be on file <em>before</em> that date,
                        while you are still in valid status. The same application filed a day late
                        is a materially harder application.
                      </p>
                    </>
                  }
                  bullets={[
                    <>
                      <strong>On H-4, F-2 or L-2:</strong> highest urgency. File a change of status
                      before the decree.
                    </>,
                    <>
                      <strong>On H-1B, or holding a 10-year green card:</strong> your own status is
                      unaffected.
                    </>,
                    <>
                      <strong>On a conditional 2-year card:</strong> you keep it, and file{" "}
                      <A href="/i90-vs-i751">Form I-751</A> alone with a waiver.
                    </>,
                    <>
                      <strong>With an I-130 or I-485 pending:</strong> the most damaging case —
                      take advice before anyone files for divorce.
                    </>,
                  ]}
                  ctaText="Estimate the alimony exposure"
                  ctaHref="#estimator"
                />
              </section>

              {/* ---------------- Status matrix ---------------- */}
              <section id="status-table" className="scroll-mt-24 space-y-4">
                <H2>What divorce does to each status</H2>
                <DataTable
                  columns={statusImpactCols}
                  rows={statusImpactRows}
                  caption="Read your own row first. The urgency column is about how much of your remaining planning time is already spent."
                  keyRows={["H-4 dependent", "I-130 / I-485 still pending"]}
                />
              </section>

              {/* ---------------- H-4 ---------------- */}
              <section id="h4" className="scroll-mt-24 space-y-4">
                <H2>If you are on H-4</H2>
                <P>
                  This is the hardest situation on the list, and it lands hardest on Indian
                  families, because the H-4 spouse is very often the one who gave up a career in
                  India to make the move.
                </P>
                <P>
                  H-4 is a dependent status. It exists only because of the marriage to the H-1B
                  principal. When the marriage legally ends, the qualifying relationship ends, and
                  the status goes with it. Any H-4 EAD you hold stops being valid at the same
                  moment — an employment authorization document cannot outlive the status it was
                  issued against, whatever expiry date is printed on the card.
                </P>

                <WarnBox title="There is no 60-day grace period for H-4 after divorce">
                  <p>
                    The widely repeated 60-day figure comes from the rules on{" "}
                    <em>cessation of employment</em> for nonimmigrant workers. It does not extend
                    to a dependent who loses status because a marriage ended. Planning around 60
                    days you do not have is the most expensive mistake in this section.
                  </p>
                </WarnBox>

                <Callout kind="note" title="What is settled, and what is not">
                  <p>{H4_TIMING_AMBIGUITY}</p>
                </Callout>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.gracePeriod60} />
                  <FactChip f={divorceFacts.unlawfulPresence3Year} />
                </div>

                <H3>What you can file instead</H3>
                <DataTable
                  columns={h4OptionsCols}
                  rows={h4OptionsRows}
                  caption="Lead time is the column that decides this. Two of these cannot be assembled in the weeks between deciding to divorce and the decree, which is why the conversation has to happen early."
                  keyRows={["Change of status to B-2 (visitor)", "U visa or T visa (crime or trafficking victims)"]}
                />

                <P>
                  File the change of status <strong>while you are still in valid H-4 status</strong>
                  . A timely-filed application generally lets you remain in the United States while
                  it is pending. Once the decree is entered and you have nothing on file, you begin
                  accruing unlawful presence — and it is <em>departing</em> after accruing it that
                  triggers the re-entry bars, which is why leaving quietly to sort things out later
                  is often the worst available move.
                </P>

                <DecisionFlow
                  title="The order that protects you"
                  nodes={[
                    { text: "Divorce is coming and you are on H-4", kind: "start" },
                    { text: "Talk to an immigration attorney BEFORE the family lawyer files", kind: "action", branch: "first" },
                    { text: "Which option do you actually qualify for?", kind: "decision" },
                    { text: "Assemble the package — I-20 for F-1, or the I-539 for B-2", kind: "action", branch: "takes weeks" },
                    { text: "File the change of status while still married", kind: "action" },
                    { text: "Only then let the final decree be entered", kind: "end" },
                  ]}
                />

                <Callout kind="tip" title="Coordinating the decree date is normal">
                  <p>
                    Asking your family lawyer to time the final decree around an immigration filing
                    is legitimate and routine. Most divorce attorneys will not think to raise it,
                    because immigration is not their practice area — so you have to. It costs
                    nothing to ask and it is the single highest-leverage thing on this page.
                  </p>
                </Callout>
              </section>

              {/* ---------------- H-1B ---------------- */}
              <section id="h1b" className="scroll-mt-24 space-y-4">
                <H2>If you are the H-1B holder</H2>
                <P>
                  Your own status is unaffected. H-1B is tied to your employer and your petition,
                  not to your marriage. You do not need to notify USCIS of a divorce for H-1B
                  purposes, and your extensions, transfers and{" "}
                  <A href="/i140-processing-time">I-140</A> continue normally. An approved I-140
                  and its priority date belong to you and stay with you.
                </P>
                <P>Two things do change.</P>
                <Bullets
                  items={[
                    "Your spouse's H-4 ends with the marriage. Your children's H-4 continues, because it comes from being your children — that relationship does not end, even if they live with the other parent. Custody and travel consent are separate questions, and they need separate answers.",
                    "Any derivative claim in your green card case ends. If your I-485 is pending and your spouse was a derivative applicant, their side of the case ends with the marriage while yours continues unaffected.",
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
                  is the one that matters to you. That is where the real exposure sits, and it is
                  financial rather than immigration — which is precisely why it gets missed.
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
                  Divorce does not end that path. It changes how you walk it:{" "}
                  <strong>
                    you file I-751 on your own, requesting a waiver of the joint-filing requirement
                  </strong>
                  . There are three grounds for that waiver, and people routinely assume there is
                  only one.
                </P>

                <DataTable
                  columns={i751WaiverCols}
                  rows={i751WaiverRows}
                  caption="More than one ground can be requested on the same petition."
                  keyRows={["Battery or extreme cruelty"]}
                />

                <Callout kind="mistake" title="The 90-day window does not apply to a waiver">
                  <p>
                    That window is a rule about <em>joint</em> petitions. A waiver request may be
                    filed as soon as a waiver ground applies — before, during or after the 90 days.
                    People miss filings waiting for a window that was never theirs.
                  </p>
                </Callout>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.i751JointWindow} />
                  <FactChip f={divorceFacts.i751WaiverWindow} />
                </div>

                <H3>What USCIS is actually testing</H3>
                <P>
                  One thing: <strong>was the marriage genuine when you entered it?</strong> Not
                  whether it lasted. Not whose fault the divorce was. Not whether you behaved well
                  during it. A marriage that was real and then failed qualifies — that is the whole
                  purpose of the waiver. Build the file around the beginning and the middle of the
                  relationship, not the end.
                </P>
                <ChecklistBox title="Evidence that carries weight" items={goodFaithEvidence} />

                <WarnBox title="If the I-751 deadline lands before the decree does">
                  <p>
                    File anyway rather than letting conditional status lapse. Divorces in several
                    states routinely run longer than the I-751 window, and USCIS has a defined path
                    for exactly this: the petition goes in, a Request for Evidence issues asking for
                    the final decree, and the marriage may legally terminate during the response
                    period — which is enough to establish eligibility. Raise the collision with both
                    lawyers early rather than discovering it later.
                  </p>
                </WarnBox>
              </section>

              {/* ---------------- 10-year GC ---------------- */}
              <section id="ten-year-gc" className="scroll-mt-24 space-y-4">
                <H2>If you have a 10-year green card</H2>
                <P>
                  You are fine. Once the conditions are removed you are a lawful permanent resident
                  in your own right. Divorce does not revoke a green card, does not affect{" "}
                  <A href="/green-card-renewal">renewal</A>, and is not a ground of removability.
                </P>
                <P>
                  The only real consequence is on the naturalization clock, which is{" "}
                  <a
                    href="#citizenship"
                    className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                  >
                    further down this page
                  </a>
                  . The one narrow exception is a case where USCIS has evidence the marriage was
                  fraudulent from the outset — but that is a marriage-fraud question with its own
                  evidence, not a consequence of the marriage ending.
                </P>
              </section>

              {/* ---------------- Pending case ---------------- */}
              <section id="pending" className="scroll-mt-24 space-y-4">
                <H2>If your green card case is still pending</H2>
                <P>
                  This is the most damaging scenario on the page. A Form I-130 filed by a
                  US-citizen or permanent-resident spouse is a petition based on a qualifying
                  relationship. When the marriage ends, the relationship ends, the petition is no
                  longer approvable, and a pending{" "}
                  <A href="/i485-processing-time">I-485</A> resting on it will be denied.
                </P>
                <P>
                  If the I-485 is denied and you have no other status, you fall out of status on
                  denial. The options at that point are narrow: a self-petition if abuse is part of
                  the history, an employment-based petition if an employer is available, or a return
                  to a nonimmigrant status you independently qualify for. None of them is quick.
                </P>
                <Callout kind="insight" title="Sequencing is the whole game here">
                  <p>
                    If a marriage-based case is pending and the marriage is failing, speak to an
                    immigration attorney <em>before</em> anyone files for divorce — not after. The
                    order of events changes which doors are still open, and it is one of the few
                    parts of this process you still control.
                  </p>
                </Callout>
              </section>

              {/* ---------------- Abuse ---------------- */}
              <section id="abuse" className="scroll-mt-24 space-y-4">
                <H2>If there was abuse</H2>
                <P>
                  There are two separate routes here, and which one is open to you depends entirely
                  on <strong>your spouse&rsquo;s immigration status</strong> — not on the severity
                  of what happened. Getting this wrong wastes months for the people who can least
                  afford to lose them.
                </P>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Spouse is a US citizen or green card holder
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-ink-900">VAWA self-petition</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                      Lets an abused spouse petition for themselves, without the abuser&rsquo;s
                      knowledge, participation or signature. It breaks the dependency entirely: a
                      conditional resident who would otherwise have no path can pursue permanent
                      residence independently. Available to men and women alike.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                      Spouse is on H-1B, L-1 or another temporary visa
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-ink-900">U visa or T visa</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                      VAWA is <strong>not</strong> available to you — the statute requires the
                      abuser to be a citizen or permanent resident. The U visa, for victims of
                      qualifying crimes who cooperate with law enforcement, does not depend on your
                      spouse&rsquo;s status at all. It is slower, and it is a real path.
                    </p>
                  </div>
                </div>

                <WarnBox title="The error that sends H-4 spouses down a dead end">
                  <p>
                    A great deal of NRI-facing content tells abused H-4 spouses to file under VAWA.
                    They cannot. An H-1B holder is neither a US citizen nor a lawful permanent
                    resident, and that prerequisite is statutory — it is not a paperwork problem
                    that a good attorney can argue around. If someone has told you otherwise, get a
                    second opinion from an immigration attorney or a DOJ-accredited representative
                    before you spend anything on it.
                  </p>
                </WarnBox>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.vawaPrerequisite} />
                  <FactChip f={divorceFacts.vawaAfterDivorce} />
                </div>

                <H3>What a VAWA self-petition requires, broadly</H3>
                <Bullets
                  items={[
                    "A qualifying marriage to a US citizen or lawful permanent resident, entered into in good faith",
                    "Battery or extreme cruelty during the marriage — which includes non-physical abuse: coercive control, threats of deportation, financial isolation, confiscation of documents",
                    "That you lived with the abusive spouse",
                    "Good moral character",
                  ]}
                />
                <P>
                  Two forms of abuse recur specifically in immigrant households and are frequently
                  not recognized as abuse by the person living through them: threatening to
                  withdraw an immigration petition as leverage, and holding a spouse&rsquo;s
                  passport or immigration documents. Both are directly relevant to a claim.
                </P>
                <Callout kind="note" title="Already divorced?">
                  <p>
                    A VAWA self-petition is still possible, but generally only within two years of
                    the divorce, and you must show a connection between the abuse and the end of the
                    marriage. Do not assume the door has closed — and do not sit on it either.
                  </p>
                </Callout>
              </section>

              {/* ---------------- I-864 ---------------- */}
              <section id="i864" className="scroll-mt-24 space-y-4">
                <H2>The obligation that survives the divorce: Form I-864</H2>
                <P>
                  If you sponsored your spouse for a green card, you signed Form I-864, the
                  Affidavit of Support. Almost everyone signs it as a formality. It is a{" "}
                  <strong>
                    contract with the federal government, enforceable in court by the person you
                    sponsored.
                  </strong>{" "}
                  Under it you promised to maintain their income at 125% of the federal poverty
                  guidelines. Divorce is not on the list of things that ends it.
                </P>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.i864Threshold} />
                  <FactChip f={divorceFacts.i864Quarters} />
                </div>

                <WarnBox title="The obligation ends only when one of these happens">
                  <ul className="ml-4 list-disc space-y-1.5">
                    {i864Terminators.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p className="font-bold">Divorce is not on that list.</p>
                </WarnBox>

                <P>
                  The practical consequence surprises almost everyone. A sponsored ex-spouse with
                  little or no income can sue the sponsor to enforce it. They do not have to prove
                  hardship, and they do not have to have claimed any public benefit — only that the
                  sponsor failed to maintain the promised level of support. Courts have awarded
                  back-support plus attorney&rsquo;s fees.
                </P>
                <P>
                  This runs <strong>alongside</strong> alimony, not instead of it. A settlement that
                  waives spousal support does not automatically dispose of an I-864 claim, because
                  the undertaking runs to the government as well as to the immigrant — and courts
                  have split on whether it can be waived at all. If you are the sponsoring spouse,
                  put it in the negotiation explicitly and in writing. If you are the sponsored
                  spouse, it is a right you may not know you have.
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
                  Permanent residents normally naturalize after five years. There is a shortened
                  three-year route for people married to a US citizen — but it requires living in
                  marital union with that citizen spouse for the whole three years, and remaining
                  married right through to the oath.
                </P>
                <P>
                  Divorce ends access to that route. You revert to the five-year rule.{" "}
                  <strong>
                    You do not lose the years already accrued as a permanent resident — the clock
                    does not reset, only the finish line moves.
                  </strong>
                </P>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.naturalizationFiveYear} />
                  <FactChip f={divorceFacts.naturalizationThreeYear} />
                </div>
                <P>
                  If you have already naturalized, divorce has no effect at all. Citizenship, once
                  granted, is not contingent on the marriage continuing.
                </P>
              </section>

              {/* ---------------- Estimator ---------------- */}
              <section id="estimator" className="scroll-mt-24 space-y-4">
                <H2>Estimate the alimony exposure</H2>
                <P>
                  Spousal support is the other number that shapes the decision. It is discretionary
                  everywhere, but most negotiations start from a guideline figure. Because an Indian
                  marriage often has a second forum genuinely in play, this shows the US guideline
                  result and, beside it, what an Indian court might work from for the same couple.
                </P>

                <AlimonyEstimator />

                <H3>How to read it</H3>
                <P>
                  The US column applies the guideline your state uses — California&rsquo;s Santa
                  Clara formula for temporary support, New York&rsquo;s statutory formula under DRL
                  § 236(B)(6), the Texas statutory cap, or the AAML benchmark elsewhere. Final
                  awards are decided on statutory factors and routinely differ from the guideline.
                </P>
                <P>
                  Two jurisdiction-specific traps are worth naming, because they are where a naive
                  calculator misleads people. <strong>Texas has an eligibility gate before any
                  figure exists</strong> — under a ten-year marriage, without a statutory exception,
                  the usual outcome is no maintenance at all rather than a smaller number. And{" "}
                  <strong>New York&rsquo;s formula stops at a statutory income cap</strong>; a high
                  earner&rsquo;s real exposure can exceed the guideline, because the court may award
                  more on the income above it.
                </P>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.txEligibility} />
                  <FactChip f={divorceFacts.nyIncomeCap} />
                </div>
                <P>
                  The India column benchmarks on roughly 25% of net income, the share referenced in{" "}
                  <em>Kalyan Dey Chowdhury v. Rita Dey Chowdhury</em> (2017), adjusted for the lower
                  earner&rsquo;s own income. India has no formula at all. Under{" "}
                  <em>Rajnesh v. Neha</em> both spouses must file a sworn affidavit of assets and
                  income, and courts assess real earning capacity — an NRI&rsquo;s US income is
                  routinely imputed in full, which is why the Indian figure is often far higher than
                  people expect.
                </P>
                <Callout kind="reminder" title="The tax treatment changed, and old numbers mislead">
                  <p>
                    For agreements executed after December 31, 2018, alimony is no longer deductible
                    by the payer and no longer taxable to the recipient. If you are anchoring on
                    what someone paid or received a decade ago, you are comparing pre-tax and
                    post-tax dollars.
                  </p>
                </Callout>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FactChip f={divorceFacts.alimonyTaxTreatment} />
                  <FactChip f={divorceFacts.usdInr} />
                </div>
                <P>
                  Neither column includes child support, division of property, retirement accounts
                  and the QDRO that splits them, Indian real estate or NRE/NRO balances, or{" "}
                  <em>stridhan</em> return claims — which are the wife&rsquo;s absolute property and
                  sit outside maintenance entirely. Several of those are larger than the maintenance
                  number.
                </P>
              </section>

              {/* ---------------- India ---------------- */}
              <section id="india" className="scroll-mt-24 space-y-4">
                <H2>Is your US divorce even valid in India?</H2>
                <P>Frequently not — and this catches people badly.</P>
                <P>
                  Under Section 13 of the Code of Civil Procedure and the Supreme Court&rsquo;s
                  decision in <em>Y. Narasimha Rao v. Y. Venkata Lakshmi</em> (1991), an Indian
                  court recognizes a foreign divorce only if it clears five tests.
                </P>

                <DataTable
                  columns={indiaRecognitionCols}
                  rows={indiaRecognitionRows}
                  caption="A decree only has to fail one of these to be unenforceable in India."
                  keyRows={["The ground is one Indian personal law recognizes"]}
                />

                <P>
                  The third condition is where most American divorces fail.{" "}
                  <strong>
                    &ldquo;Irretrievable breakdown&rdquo; — the standard US no-fault ground — is not
                    a ground for divorce under the Hindu Marriage Act.
                  </strong>{" "}
                  Only the Supreme Court of India, exercising its Article 142 powers, can dissolve a
                  marriage on that basis. A decree resting on it is generally unenforceable in
                  India, and an ex parte decree where your spouse never appeared is weaker still.
                </P>

                <WarnBox title="Do not remarry on an unrecognized decree">
                  <p>
                    If your first marriage still subsists under Indian law, remarrying exposes you
                    to prosecution for bigamy under Section 82 of the Bharatiya Nyaya Sanhita, the
                    successor to Section 494 of the Indian Penal Code. This has happened to real
                    NRIs who assumed a US decree was the end of the matter everywhere.
                  </p>
                </WarnBox>

                <H3>Getting certainty in India</H3>
                <P>
                  Where you need it — to remarry, to transfer property, to do anything official —
                  there are two routes. A <strong>declaratory suit</strong> in an Indian court
                  confirming your marital status, or a fresh{" "}
                  <strong>Section 13B mutual-consent petition</strong> if your ex-spouse will
                  cooperate. Section 13B is usually the faster and cleaner of the two.
                </P>
                <P>
                  You can run a mutual-consent petition from the United States. A notarized and{" "}
                  <A href="/oci">apostilled</A> special power of attorney lets your advocate appear
                  for you, and Indian courts permit participation by video conference. Expect two
                  motions with a six-month interval between them — waivable where reconciliation is
                  clearly impossible — and six to eighteen months in total. Contested cases are far
                  harder to run remotely.
                </P>
                <P>
                  Separately: a US decree does not resolve custody, maintenance or property situated
                  in India. Those need Indian proceedings on their own merits.
                </P>

                <H3>The Indian authorities this section rests on</H3>
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
                  A child&rsquo;s H-4 status continues after the divorce, because it derives from
                  being the H-1B holder&rsquo;s child and that does not change. A US-citizen child
                  is unaffected entirely.
                </P>
                <P>
                  The cross-border problem is enforcement.{" "}
                  <strong>
                    India is not a signatory to the Hague Convention on the Civil Aspects of
                    International Child Abduction
                  </strong>
                  , so a US custody order is not directly enforceable there — recovering a child
                  taken to India becomes a fresh proceeding in an Indian court, on Indian principles.
                </P>
                <ChecklistBox
                  tone="brand"
                  title="Put these in the settlement, not in an assumption"
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
                  Assemble this before the household separates, not after. Access to joint records
                  disappears faster than people expect, and the I-751 and I-864 questions later on
                  both turn on documents that were easy to get and became impossible.
                </P>
                <ChecklistBox title="Get copies of all of these" items={documentChecklist} />
              </section>

              {/* ---------------- Sources ---------------- */}
              <section id="sources" className="scroll-mt-24 space-y-4">
                <H2>Official sources</H2>
                <OfficialSourceBox
                  title="Primary sources for every rule on this page"
                  intro="Immigration rules change and are applied differently by different offices. Verify anything you are about to act on against the source:"
                  links={officialSourceLinks}
                />
              </section>

              {/* ---------------- FAQ ---------------- */}
              <section id="faq" className="scroll-mt-24">
                <ToolFaq items={faqs} />
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
