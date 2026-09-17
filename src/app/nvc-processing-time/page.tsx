import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import NvcTimelineChecker from "@/components/tools/NvcTimelineChecker";
import NvcTimelineEstimator from "@/components/tools/NvcTimelineEstimator";
import ConsularPathDiagram from "@/components/tools/nvc/ConsularPathDiagram";
import NotLegalAdvice from "@/components/tools/NotLegalAdvice";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  nvcClusterLinks,
  nvcRelatedLinks,
  nvcWebAppJsonLd,
  nvcArticleJsonLd,
  NVC_PUBLISHED,
  NVC_UPDATED,
  NVC_UPDATED_HUMAN,
} from "@/lib/nvcCluster";
import {
  nvcLinks,
  nvcProcessingData as D,
  nvcFees as F,
  nvcPublishedTimeframes as PT,
  NVC_DATA_NOTE,
} from "@/data/nvcData";
import { formatDate } from "@/lib/format";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/nvc-processing-time";
const TITLE = "NVC Processing Time: Case Creation, Document Review & Interview Wait";
const DESC =
  "NVC processing time right now: the published timeframes for case creation and document review, what happens after your I-130 is approved, a stage-by-stage estimator, and consular processing vs adjustment of status.";

export const metadata: Metadata = pageMetadata({
  title: "NVC Processing Time & Timeframes: What Happens After I-130 Approval",
  description: DESC,
  path: PATH,
});

const STAGES: { stage: string; range: string; note: string }[] = [
  { stage: "USCIS approval → NVC case creation", range: `~${D.caseCreationWeeksLow}–${D.caseCreationWeeksHigh} weeks`, note: "Includes the physical handoff from USCIS to NVC and the welcome letter." },
  { stage: "Pay fees + complete DS-260", range: "Depends on you", note: "This step moves as fast as you complete it; fees take a day or two to clear." },
  { stage: "Document review after submission", range: `~${D.docReviewWeeksLow}–${D.docReviewWeeksHigh} weeks`, note: "NVC reviews packages roughly in the order received; missing items reset the clock." },
  { stage: "Documentarily qualified → interview", range: `~${D.dqToInterviewMonthsLow}–${D.dqToInterviewMonthsHigh} months`, note: "Depends on embassy appointment availability and, for preference categories, the priority date." },
];

const faq: FaqItem[] = [
  { question: "How long does NVC take after USCIS approval?", answer: "After USCIS approves your petition, it is forwarded to NVC and a case is created, usually within a few weeks — commonly a couple to several weeks, but this varies and is not guaranteed. NVC then issues a welcome letter with your case number and invoice ID. Always check the official NVC timeframes for the current pace." },
  { question: "How long does NVC take to review documents?", answer: "Once you submit your DS-260, Affidavit of Support, and civil documents, NVC reviews the package — often within a few weeks, though it can be longer during busy periods. If documents are missing, NVC lists what is needed in CEAC and the review restarts once you resubmit. Times change, so treat any range as a planning estimate." },
  { question: "How often does NVC update timeframes?", answer: "NVC publishes processing timeframes on the Department of State website and updates them regularly to reflect current workload. Because the numbers move, the official timeframes page — not a fixed figure you read once — is the reliable source before assuming your case is delayed." },
  { question: "What does documentarily qualified mean?", answer: "Documentarily qualified (DQ) means NVC has accepted your DS-260 and all required documents, so the case is complete and ready for a consular interview. After DQ, the case waits in line for an interview appointment based on embassy availability and visa number availability for preference categories." },
  { question: "How long after DQ will I get an interview?", answer: "There is no fixed wait. After documentarily qualified, NVC schedules interviews as appointments become available at your embassy or consulate. For immediate-relative categories this can be relatively quick; for preference categories it also depends on your priority date being current. It can range from about a month to many months." },
  { question: "Why is my NVC case delayed?", answer: "Common reasons include a slow USCIS-to-NVC handoff, missing or unclear documents that need resubmission, high case volume, a priority date that is not yet current for preference categories, and limited interview appointments at your post. Check CEAC for requested items and compare against the official NVC timeframes before submitting an inquiry." },
  { question: "What does NVC mean?", answer: "NVC is the National Visa Center, the Department of State office in Portsmouth, New Hampshire that sits between USCIS and your consulate. USCIS approves the petition; NVC then collects the fees, the DS-260 immigrant visa application, the civil documents and the affidavit of support, and schedules the interview once everything is accepted. It does not decide your case — the consular officer does." },
  { question: "What are the NVC steps, in order?", answer: "Ten of them: the petition is approved, the case is sent to NVC, a welcome letter arrives with your case number, you pay the two fees, you file the DS-260, you upload the civil documents and the I-864, NVC reviews and marks the case documentarily qualified, the interview is scheduled, you attend the medical and then the interview, and finally the visa is issued, you enter the US and the green card is mailed to you." },
  { question: "What are the current NVC processing times for interviews?", answer: `NVC publishes no single interview-scheduling date. ${PT.interviewSchedulingNote} What it does publish is which day's case creation and which day's document review it has reached — as of ${formatDate(PT.caseCreation.asOf)} it was creating cases received ${formatDate(PT.caseCreation.workingOn)}, and as of ${formatDate(PT.documentReview.asOf)} it was reviewing documents submitted ${formatDate(PT.documentReview.workingOn)}. For the interview end, use the IV Scheduling Status tool for your specific post.` },
  { question: "What happens after NVC accepts my documents?", answer: "Your case becomes documentarily qualified and joins the interview queue. NVC then books an appointment at your consulate as capacity allows, and you receive an appointment letter. Before the interview you complete the medical examination with a panel physician — for India, one approved for the Mumbai consular district. Nothing further is required from you between DQ and the appointment letter, which is why this stretch feels like silence." },
  { question: "My I-130 was approved — what is the next step?", answer: "Nothing happens immediately. USCIS forwards the approved petition to NVC, which creates a case and sends a welcome letter with your case number and invoice ID; that is the first thing you can act on. Until then there is nothing to log into and nothing to pay. Use the waiting time to order the documents that take longest on the Indian side — police clearance certificates and any birth certificate that needs a non-availability certificate behind it — and to check that the sponsor actually meets the affidavit of support income requirement." },
  { question: "Is consular processing faster than adjustment of status?", answer: "Often, yes — a consular case is frequently decided sooner than an I-485. But speed is not the only axis. Adjustment of status lets the immigrant work on an EAD and travel on advance parole while the case is pending, and it preserves motions and appeals if it is refused; a consular refusal has very limited review. Where the immigrant is already living usually settles the question, and where it genuinely is a choice, the trade is finality against interim benefits." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "NVC Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nvc-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "NVC Processing Time" },
        ]}
        icon="⏳"
        category="Visa & Green Card"
        title="NVC Processing Time"
        hook="How long the National Visa Center takes — case creation, document review, and the wait from documentarily qualified to your consular interview. These are general planning ranges, never guarantees."
        accent="from-blue-600 to-indigo-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
              Check My NVC Stage →
            </a>
            <a href={nvcLinks.nvcTimeframes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              Official NVC Timeframes ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>This is an educational tool and not legal advice. Always verify with official USCIS, Department of State, CEAC, and embassy/consulate instructions.</p>}
      >
        {/* ANSWER FIRST — the two dated facts DOS actually publishes. */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
                As of <strong>{formatDate(PT.caseCreation.asOf)}</strong>, NVC is
                creating cases it received from USCIS on{" "}
                <strong>{formatDate(PT.caseCreation.workingOn)}</strong>, and as
                of <strong>{formatDate(PT.documentReview.asOf)}</strong> it is
                reviewing document packages submitted on{" "}
                <strong>{formatDate(PT.documentReview.workingOn)}</strong>. If
                your own date falls after those, your case is in the queue — not
                delayed.
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  `NVC creating cases received ${formatDate(PT.caseCreation.workingOn)} (as of ${formatDate(PT.caseCreation.asOf)})`,
                  `NVC reviewing documents submitted ${formatDate(PT.documentReview.workingOn)} (as of ${formatDate(PT.documentReview.asOf)})`,
                  "NVC aims to schedule an interview within about three months of accepting your documents — subject to your consulate's capacity",
                  `Fees: ${F.affidavitOfSupport} affidavit of support + ${F.familyIvApplication} family / ${F.employmentIvApplication} employment IV application`,
                  "The middle of the process moves at your pace, not NVC's — fees, DS-260, civil documents",
                  "A missing civil document sends the package back and restarts the review queue",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 rounded-xl border border-ink-900/5 bg-ink-900/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-ink-700"
                  >
                    <span aria-hidden className="text-brand-600">
                      ▸
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-900">
                  Published NVC timeframes
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[PT.caseCreation, PT.documentReview].map((t) => (
                    <div
                      key={t.label}
                      className="rounded-xl border border-ink-900/5 bg-white px-4 py-3"
                    >
                      <p className="text-xs font-semibold text-ink-500">{t.label}</p>
                      <p className="text-lg font-black text-sky-800">
                        {formatDate(t.workingOn)}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        as of {formatDate(t.asOf)}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                        {t.note}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  {PT.interviewSchedulingNote} Verified{" "}
                  {formatDate(PT.lastVerified)} against{" "}
                  <a
                    href={nvcLinks.nvcTimeframes}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-600 underline"
                  >
                    the official NVC timeframes page
                  </a>
                  , which DOS updates regularly — check it before concluding
                  anything about your own case.
                </p>
              </div>

              <NotLegalAdvice className="mt-5" />
            </div>
          </Container>
        </section>

        {/* Fast Answer: stage ranges + fees */}
        <section className="pt-4">
          <Container>
            <FastAnswerSnapshot
              title="How long does NVC take? (planning ranges)"
              accent="sky"
              rows={[
                { label: "USCIS → NVC case creation", value: `${D.caseCreationWeeksLow}–${D.caseCreationWeeksHigh} wks`, note: "Handoff + welcome letter." },
                { label: "Document review", value: `${D.docReviewWeeksLow}–${D.docReviewWeeksHigh} wks`, note: "Per review cycle, if complete.", highlight: true },
                { label: "DQ → interview", value: `${D.dqToInterviewMonthsLow}–${D.dqToInterviewMonthsHigh} mo`, note: "Embassy availability + priority date." },
                { label: "Fee payment to clear", value: F.feePaymentClearDays, note: "Allow before the next step unlocks." },
              ]}
              badges={["Planning ranges, not guarantees", `AOS fee ${F.affidavitOfSupport} · IV fee ${F.familyIvApplication}–${F.employmentIvApplication}`]}
              lastVerified={F.lastVerified}
              sources={[
                { label: "Official NVC Timeframes", href: nvcLinks.nvcTimeframes },
                { label: "NVC Fees", href: nvcLinks.fees },
                { label: "CEAC", href: nvcLinks.ceac },
              ]}
              disclaimer={NVC_DATA_NOTE}
              ctaText="Check my NVC stage & next step"
              ctaHref="#calculator"
            />
          </Container>
        </section>

        {/* Stage range table */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">NVC processing time by stage</h2>
              <p className="mt-1.5 text-sm text-ink-500">General planning ranges only — not guarantees, and not a prediction for your specific case.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Stage</th>
                      <th className="p-3 font-semibold">Rough range</th>
                      <th className="p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {STAGES.map((r) => (
                      <tr key={r.stage} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.stage}</td>
                        <td className="p-3 font-semibold text-blue-700">{r.range}</td>
                        <td className="p-3 text-ink-600">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">{NVC_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* I-130 approved — what happens next (the whole consular path) */}
        <section id="after-i130-approval" className="scroll-mt-24 border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-[760px]">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                I-130 approved — what happens next
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                An approval notice feels like the end of something. It is the end
                of the USCIS half. Everything below happens at the Department of
                State, and the case now belongs to a different agency with a
                different portal, different fees and a different queue. Ten
                stages stand between that notice and a card in the mail.
              </p>
              <ConsularPathDiagram />
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                The three amber stages are the ones you control. Families
                routinely lose more time there than NVC ever costs them — a
                police clearance certificate ordered late, a birth certificate
                that needs a non-availability certificate behind it, an affidavit
                of support where the sponsor turns out to be under the income
                line.{" "}
                <Link href="/uscis/forms/i-864" className="text-brand-600 underline">
                  Check the sponsor income requirement
                </Link>{" "}
                before you reach that stage, not after, and work the{" "}
                <Link href="/nvc-document-checklist-india" className="text-brand-600 underline">
                  India document checklist
                </Link>{" "}
                in parallel with the fees rather than after them.
              </p>
            </div>
          </Container>
        </section>

        {/* Timeline estimator */}
        <section id="estimator" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                Estimate your own dates
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Put your approval date in and get a dated range for each stage.
                Every output is a range, because every input to it moves — treat
                the late end as your plan and anything earlier as a bonus.
              </p>
            </div>
            <div className="mt-6">
              <NvcTimelineEstimator />
            </div>
          </Container>
        </section>

        {/* Tool */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Which stage am I at, and what is my next step?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The table above gives typical ranges. Use the checker below to find your current NVC stage, your next step, and whether you may be outside the official timeframes.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <NvcTimelineChecker />
            </div>
          </Container>
        </section>

        {/* SEO content */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-bold text-ink-900">Why NVC processing time is hard to pin down</h2>
                <p className="mt-2">
                  NVC processing is not one step but several, and each is affected by different factors. The handoff from USCIS to NVC depends on USCIS. Fee payment and the DS-260 move as fast as you complete them. Document review depends on NVC's workload and whether your package is complete. And the final wait — from <Link href="/nvc-case-status#stage-documentarily-qualified" className="text-brand-600 underline">documentarily qualified</Link> to interview — depends on appointment availability at your embassy and, for preference categories, on your priority date. Because all of these move independently and change month to month, no honest single number exists.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">The parts you control vs. the parts you wait on</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">You control</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-ink-600">
                      <li>How quickly you pay fees once you have the case number</li>
                      <li>How fast you complete DS-260 for each applicant</li>
                      <li>Whether your uploaded documents are complete and clear</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">You wait on</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-ink-600">
                      <li>USCIS forwarding the case to NVC</li>
                      <li>NVC reviewing your document package</li>
                      <li>Embassy interview appointment availability</li>
                      <li>Your priority date (preference categories)</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-3">
                  The single biggest thing you can do to avoid delay is submit a <strong>complete, accurate package the first time</strong>. Missing or unclear documents send the case back for correction and effectively restart the review. The{" "}
                  <Link href="/nvc-document-checklist-india" className="text-brand-600 underline">NVC document checklist for Indian applicants</Link> walks through what to prepare.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What "documentarily qualified" changes about your wait</h2>
                <p className="mt-2">
                  Reaching DQ is a milestone, but it does not mean an interview is imminent. DQ simply means NVC has accepted everything and the case is ready. From there, the interview wait is governed by your embassy or consulate's appointment capacity and, for family and employment preference categories, by whether your priority date is current in the{" "}
                  <Link href="/visa-bulletin" className="text-brand-600 underline">Visa Bulletin</Link>. Immediate-relative categories (like IR1/CR1 spouses and IR5 parents of U.S. citizens) are not subject to that numerical wait, so they often move to interview faster once DQ.
                </p>
              </div>

              <div id="consular-vs-adjustment" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-ink-900">Consular processing vs adjustment of status</h2>
                <p className="mt-2">
                  Everything on this page is the <strong>consular</strong> route:
                  the immigrant is outside the United States, the case goes
                  through NVC, and the visa is issued at a consulate. The
                  alternative is <strong>adjustment of status</strong> — the
                  immigrant is already in the US in a valid status and files Form
                  I-485 with USCIS instead. NVC never touches an adjustment case.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-ink-900/10 text-left">
                        <th className="py-2 pr-3 font-bold text-ink-900">&nbsp;</th>
                        <th className="py-2 pr-3 font-bold text-ink-900">Consular processing</th>
                        <th className="py-2 font-bold text-ink-900">Adjustment of status</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-600">
                      {[
                        ["Where the immigrant is", "Outside the US", "Inside the US in a valid status"],
                        ["Who handles it", "Department of State — NVC, then a consulate", "USCIS"],
                        ["The form", "DS-260", "Form I-485"],
                        ["Work permit while waiting", "No — you work once you arrive", "Yes — file I-765 with the I-485"],
                        ["Travel while waiting", "Normal, you are not in the US", "Needs advance parole (I-131) or you abandon the case"],
                        ["Interview", "At the consulate, usually held", "At a USCIS field office, sometimes waived"],
                        ["If it is refused", "Very limited review", "Motions and appeals are available"],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-ink-900/5">
                          <td className="py-2.5 pr-3 font-semibold text-ink-800">{row[0]}</td>
                          <td className="py-2.5 pr-3">{row[1]}</td>
                          <td className="py-2.5">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  For an Indian family the choice is usually made for them by
                  where the beneficiary is living. Where there genuinely is a
                  choice — a spouse in the US on an H-4, say — the trade is
                  speed and finality against the EAD and advance parole that come
                  with a pending I-485. Consular cases are often decided sooner;
                  adjustment lets you work and travel in the meantime.{" "}
                  <Link href="/i485-timeline" className="text-brand-600 underline">
                    The I-485 timeline
                  </Link>{" "}
                  and{" "}
                  <Link href="/green-card/i-485" className="text-brand-600 underline">
                    the adjustment of status guide
                  </Link>{" "}
                  cover the other side. Either way the{" "}
                  <Link href="/uscis/forms/i-864" className="text-brand-600 underline">
                    affidavit of support
                  </Link>{" "}
                  is required — it just travels with a different package.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">When a delay is worth a public inquiry</h2>
                <p className="mt-2">
                  If your case is genuinely past the official NVC timeframes — for example, no case number long after approval, or a document package that has sat far beyond the typical review window — that is when an{" "}
                  <Link href="/nvc-public-inquiry" className="text-brand-600 underline">NVC public inquiry</Link> is appropriate. Inquiring before you are outside the timeframes, or sending duplicate inquiries, does not help and can add to the queue.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA boxes */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
              <Link href="#estimator" className="rounded-2xl border border-blue-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Just got the approval notice?</p>
                <p className="mt-1 text-xs text-ink-600">Estimate your NVC dates →</p>
              </Link>
              <Link href="/nvc-document-checklist-india" className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Preparing documents?</p>
                <p className="mt-1 text-xs text-ink-600">Open the NVC India Document Checklist →</p>
              </Link>
              <Link href="/nvc-public-inquiry" className="rounded-2xl border border-rose-200 bg-white p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Outside the official timeframe?</p>
                <p className="mt-1 text-xs text-ink-600">Review when to submit an NVC Public Inquiry →</p>
              </Link>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="More NVC & green card guides" links={[...nvcClusterLinks.filter((l) => l.href !== PATH), ...nvcRelatedLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        {/* Author */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NVC_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
