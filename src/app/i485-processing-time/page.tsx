import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import I485ProcessingCalculator from "@/components/tools/I485ProcessingCalculator";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import SoftCta from "@/components/SoftCta";
import ImmigrationTimelineTable from "@/components/tools/ImmigrationTimelineTable";
import {
  i485TimelineRows,
  i485TimelineBadges,
  i485PlanningSummary,
  i485SourceNote,
  i485SourceLinks,
  TIMELINE_DISCLAIMER,
} from "@/data/immigrationTimelineData";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  i485ClusterLinks,
  i485RelatedLinks,
  i485WebAppJsonLd,
  i485ArticleJsonLd,
  I485_PUBLISHED,
  I485_UPDATED,
  I485_UPDATED_HUMAN,
} from "@/lib/i485Cluster";
import {
  i485ProcessingData as D,
  I485_DATA_NOTE,
} from "@/data/i485ProcessingData";

const PATH = "/i485-processing-time";
const TITLE = "I-485 Processing Time 2026: Adjustment of Status Timeline";
const DESC =
  "Check typical I-485 green card processing timelines, what affects your case, and estimate your personal wait by category, field office, and priority date.";

export const metadata: Metadata = pageMetadata({
  title: "I-485 Processing Time 2026: Typical 8-14 Month Timeline",
  description:
    "I-485 processing typically runs 8-14 months for employment-based cases. Stage-by-stage timeline, delay causes, and a personal estimate calculator.",
  path: PATH,
});

/* -------------------------------------------------------------------------- */
/* Static, editable content (update alongside I485_UPDATED in i485Cluster.ts). */
/* -------------------------------------------------------------------------- */

const SNAPSHOT: {
  situation: string;
  meaning: string;
  check: string;
  next: string;
}[] = [
  {
    situation: "Family-based I-485",
    meaning: "Processing depends on the relationship category, your local field office, the interview, and evidence quality.",
    check: "USCIS processing times by form and field office.",
    next: "Use the calculator below and check your USCIS receipt notice.",
  },
  {
    situation: "Employment-based I-485",
    meaning: "Processing depends on your EB category, priority date, service center, biometrics, medical exam, and background checks.",
    check: "USCIS processing times and the current Visa Bulletin.",
    next: "Confirm whether your priority date is current.",
  },
  {
    situation: "Indian EB-2 / EB-3 applicant",
    meaning: "The Visa Bulletin is often the biggest factor after I-485 filing.",
    check: "Final Action Date and Date for Filing for India.",
    next: "Track the Visa Bulletin monthly.",
  },
  {
    situation: "Biometrics completed",
    meaning: "A normal step — but it does not guarantee immediate approval.",
    check: "Case status and any USCIS requests.",
    next: "Watch for interview, RFE, or approval updates.",
  },
  {
    situation: "RFE received",
    meaning: "USCIS needs more evidence before continuing.",
    check: "The RFE deadline and requested documents.",
    next: "Respond carefully, with attorney help if needed.",
  },
  {
    situation: "Interview scheduled",
    meaning: "USCIS wants to verify eligibility, documents, or relationship/employment facts.",
    check: "Interview notice, documents list, medical exam status.",
    next: "Prepare original documents and copies.",
  },
  {
    situation: "Case outside normal processing time",
    meaning: "Your case may be eligible for a USCIS service request.",
    check: "The USCIS case inquiry date on your receipt page.",
    next: "Submit an inquiry only when USCIS says it is outside normal time.",
  },
];

const WANT: { q: string; a: string }[] = [
  {
    q: "When will my green card be approved?",
    a: "It depends on USCIS processing, your priority date, background checks, and whether your case is complete.",
  },
  {
    q: "Does I-485 pending mean my green card is guaranteed?",
    a: "No. Pending simply means USCIS is still reviewing the adjustment application.",
  },
  {
    q: "Why is my friend's I-485 faster than mine?",
    a: "Different category, field office, priority date, biometrics, RFE, interview, and background-check timelines all change the wait.",
  },
  {
    q: "Can I travel or work while I-485 is pending?",
    a: "Many applicants use Advance Parole and an EAD, but confirm travel and work decisions with an immigration attorney.",
  },
  {
    q: "What should I check every month?",
    a: "Your USCIS case status, USCIS processing times, the Visa Bulletin (if employment/preference-based), and any mail from USCIS.",
  },
];

const STAGES: { title: string; body: string }[] = [
  { title: "I-485 filed", body: "You (or your employer) submit the adjustment-of-status application to USCIS." },
  { title: "Receipt notice issued", body: "USCIS mails a receipt (I-797C) confirming the case and your receipt number." },
  { title: "Biometrics appointment", body: "USCIS collects your fingerprints and photo for background checks." },
  { title: "Case review", body: "An officer reviews eligibility, evidence, and the results of security checks." },
  { title: "RFE, if needed", body: "If evidence is missing, USCIS issues a Request for Evidence with a deadline." },
  { title: "Interview, if required", body: "Some field offices require an in-person interview to verify your case." },
  { title: "Final review", body: "USCIS completes background checks and confirms a visa number is available." },
  { title: "Approval / green card production", body: "Once approved, your card is produced and mailed to you." },
];

const faq: FaqItem[] = [
  { question: "What is I-485 processing time?", answer: "I-485 processing time is how long USCIS takes to adjudicate your Application to Register Permanent Residence or Adjust Status after it is filed. It varies widely by field office, whether an interview is required, and visa-number availability. Check the current USCIS I-485 processing times for your office." },
  { question: "How long does I-485 take in 2026?", answer: "After filing, I-485 commonly takes several months to about two years, and longer if a field-office interview is required. These are general planning ranges — exact times vary by office and change, so verify on the USCIS processing-times page for Form I-485." },
  { question: "Why does I-485 processing time vary by field office?", answer: "USCIS field offices and service centers carry different caseloads, staffing, and interview requirements. The same category can be adjudicated much faster at one office than another, which is why office-specific USCIS processing times matter more than a single national number." },
  { question: "What happens after I-485 biometrics?", answer: "After your biometrics appointment, USCIS uses your fingerprints and photo to run background and security checks while an officer reviews eligibility and evidence. Depending on your case, the next steps can be an EAD/Advance Parole issuance, an RFE, a field-office interview, a visa-number wait, or approval. Biometrics completion is a normal milestone, not a signal that a decision is imminent." },
  { question: "Does biometrics mean my I-485 is almost approved?", answer: "No. Biometrics is a routine early step so USCIS can run background checks. It is a good sign your case is moving, but it does not mean approval is imminent — an interview, RFE, or visa-number wait can still follow." },
  { question: "Does EAD approval mean I-485 approval is coming soon?", answer: "Not necessarily. The EAD (work permit) and Advance Parole often arrive months before any I-485 decision. They let you work and travel while the case is pending, but they are separate from the green-card decision itself." },
  { question: "Can I-485 be approved if my priority date is not current?", answer: "Generally no. Even with a pending I-485, USCIS usually cannot approve the green card unless your priority date is current under the Visa Bulletin chart in use. For India EB-2/EB-3 this is often the dominant wait." },
  { question: "Why is the Visa Bulletin important for Indian applicants?", answer: "For Indian EB-2 and EB-3 applicants, visa numbers are heavily backlogged. The Visa Bulletin's Final Action Date and Date for Filing determine both when you can file I-485 and when it can finally be approved — often the biggest factor in the total wait." },
  { question: "What happens if I receive an RFE?", answer: "An RFE (Request for Evidence) means USCIS needs more documentation before deciding. Read it carefully, note the deadline, and respond fully — ideally with your attorney. A complete, on-time response avoids denial and keeps the case moving." },
  { question: "Is an I-485 interview always required?", answer: "No. Many employment-based I-485 cases are waived from interview, but USCIS can require a field-office interview for any case. If required, plan for additional processing time. Your attorney can gauge the likelihood for your office." },
  { question: "When can I submit a USCIS case inquiry?", answer: "You can usually submit a service request (case inquiry) only once your case is outside the normal processing time USCIS publishes for your office and form. The USCIS processing-times page shows the 'inquiry date' — submitting earlier rarely helps." },
  { question: "Can I travel while I-485 is pending?", answer: "Many applicants travel using Advance Parole (Form I-131), and H-1B/L-1 holders may travel on their visa instead. Travel while I-485 is pending has risks, so confirm your specific situation with an immigration attorney before leaving the U.S." },
  { question: "Can I use premium processing to speed up Form I-485?", answer: "No. Premium processing under Form I-907 covers a specific list of forms, including the I-140 immigrant petition and certain I-765 employment-authorization applications, but the I-485 adjustment of status application is not one of them. Requesting premium processing on your I-140 speeds up that petition's decision only — it does not accelerate the I-485 and does not affect visa availability. There is currently no way to pay for faster I-485 adjudication." },
  { question: "Why was my I-485 transferred to a field office?", answer: "Employment-based I-485s are routinely moved from a service center or the National Benefits Center to the field office covering your address, most often because USCIS determined an interview is needed or to balance workload. You should receive a transfer notice. The filing date and pending-since clock do not restart, but the queue you are in is now the field office's, so compare your case against that office's published processing time rather than the NBC's when judging whether it is delayed." },
  { question: "Why does the USCIS processing time not match my experience?", answer: "The published figure is the time it took to complete 80% of adjudicated cases over the previous six months — not an average, and backward-looking by up to six months. One in five cases takes longer. Additionally, USCIS advises that if your office shows as the National Benefits Center and you filed an employment-based I-485, you should check your local field office's processing time instead, which is a common source of confusion." },
  { question: "What is transfer of underlying basis (interfiling)?", answer: "Transfer of underlying basis, commonly called interfiling, is a request that USCIS adjudicate your already-pending I-485 under a different approved I-140 — most often moving from EB-3 to EB-2 when the EB-2 India chart becomes more favorable. Your I-485 stays pending and keeps its original filing date; only the petition it rests on changes. It requires an approved I-140 in the new category and a visa number immediately available there, and USCIS grants it as a matter of discretion." },
  { question: "Does interfiling restart my I-485 processing time?", answer: "No. Interfiling is not a new filing, so your I-485 keeps its original receipt date and its place in the field-office queue. What changes is which visa bulletin row governs visa availability for your case. That can shorten the overall wait dramatically if the new category is current, but it does not make USCIS adjudicate any faster once a number is available." },
  { question: "What is the difference between interfiling and Supplement J?", answer: "They solve different problems. Interfiling (transfer of underlying basis) changes which I-140 and which category your pending I-485 rests on, needs a visa number available in the new category, and has no waiting period. Form I-485 Supplement J is used for INA §204(j) portability when you change employers or jobs — it keeps the same I-140 and category, requires the I-485 to have been pending at least 180 days, and requires the new job to be in the same or a similar occupation." },
  { question: "Can I interfile back if my new category retrogresses?", answer: "Not freely. Once USCIS transfers your I-485 to a new underlying petition, the case is adjudicated under that category, and if it retrogresses or goes Unavailable your case waits until numbers return there. Reversing the transfer is not a routine request. Because of this, timing the interfile against the charts with your attorney matters more than requesting it the first month a category looks better." },
  { question: "Is this I-485 calculator legal advice?", answer: "No. This tool is for educational planning only and is not legal advice. Filing eligibility and timelines are case-specific — confirm with your immigration attorney and the official USCIS and Visa Bulletin sources." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i485WebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    i485ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I485_PUBLISHED, dateModified: I485_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-485 Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i485-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-485 Processing Time" },
        ]}
        icon="🟢"
        category="Visa & Green Card"
        title="I-485 Processing Time 2026"
        hook="See estimated I-485 timeline by stage, including receipt notice, biometrics, RFE, interview, case review, EAD/AP, and green card approval."
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#i485-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
              Estimate My I-485 Timeline →
            </a>
            <a href={D.uscisProcessingTimesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
              Check USCIS Official Processing Times ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {I485_UPDATED_HUMAN}. {I485_DATA_NOTE}</>}
        disclaimerExtra={<p>{TIMELINE_DISCLAIMER}</p>}
      >
        {/* Byline row */}
        <section className="pt-5">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ReviewedByline date={I485_UPDATED} />
            </div>
          </Container>
        </section>

        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Long Does I-485 Take?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                I-485 processing time depends on green card category, USCIS field office or service center, biometrics, medical exam, RFE, interview, background checks, and priority date availability. For employment-based Indian applicants, the Visa Bulletin can be one of the biggest factors because USCIS generally cannot approve the green card unless the priority date is current.
              </p>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <p className="text-xs leading-relaxed text-ink-700">
                  <span className="font-bold text-ink-900">India EB-2 / EB-3 note:</span> approval usually also depends on Visa Bulletin availability. Even if your I-485 is pending, USCIS generally cannot approve the green card unless your priority date is current.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#i485-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Use the calculator →</a>
                <a href={D.uscisProcessingTimesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">USCIS processing times ↗</a>
              </div>
            </div>
          </Container>
        </section>

        {/* NEW: static timeline estimate table (before the calculator) */}
        <section className="py-10 sm:py-12">
          <Container>
            <ImmigrationTimelineTable
              title="I-485 Processing Time Estimate by Stage"
              intro="Most users searching for I-485 processing time want to know what happens after filing and how long each stage may take. This table gives a planning estimate. Use the calculator below for a personal estimate based on your case details."
              rows={i485TimelineRows}
              badges={i485TimelineBadges}
              sourceNote={i485SourceNote}
              sourceLinks={i485SourceLinks}
              ctaText="Estimate My I-485 Timeline"
              ctaHref="#i485-calculator"
              accentBtn="bg-emerald-600 hover:bg-emerald-700"
            />

            {/* Quick planning summary box */}
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">I-485 Timeline Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{i485PlanningSummary}</p>
            </div>
          </Container>
        </section>

        {/* Situations table (renamed, now below the timeline estimate) */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">I-485 Situations Explained</h2>
              <p className="mt-1.5 text-sm text-ink-500">After you understand the estimated I-485 timeline above, this table explains common case situations and what you should check next.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Situation</th>
                      <th className="p-3 font-semibold">What it means</th>
                      <th className="p-3 font-semibold">What to check</th>
                      <th className="p-3 font-semibold">Next step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {SNAPSHOT.map((r) => (
                      <tr key={r.situation} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.situation}</td>
                        <td className="p-3 text-ink-600">{r.meaning}</td>
                        <td className="p-3 text-ink-600">{r.check}</td>
                        <td className="p-3 text-ink-600">{r.next}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">{I485_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* What most people want to know */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What most people want to know about I-485 timing</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {WANT.map((c) => (
                  <div key={c.q} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">&ldquo;{c.q}&rdquo;</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{c.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Typical timeline stages */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Typical I-485 timeline stages</h2>
              <ol className="mt-5 space-y-3">
                {STAGES.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{s.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* Calculator */}
        <section id="i485-calculator" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Estimate Your Personal I-485 Processing Time</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The snapshot above gives a general overview. Use the calculator below to estimate your personal timeline based on your green card category, country, priority date, field office, biometrics, RFE, and interview status.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <I485ProcessingCalculator />
            </div>
          </Container>
        </section>

        {/* The two waits, for India applicants */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The two waits, for India applicants</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">1. The wait to file (the big one)</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">For India EB-2/EB-3, the dominant wait is the Visa Bulletin priority-date backlog before you can even file I-485 — often years after I-140 approval.</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">2. The wait to adjudicate</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">Once filed, USCIS adjudication is a general planning range of months to ~2 years, longer if an interview is required. This is the smaller of the two waits.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-500">{I485_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* How to read a USCIS processing time + where EB cases actually sit */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Reading the USCIS number — and why yours may not match it
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Two facts about the published figure explain most of the gap between what people
                read and what they experience.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">It is the 80th percentile</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                    USCIS publishes the time it took to complete <strong>80% of adjudicated cases
                    over the previous six months</strong> — not an average and not a promise. One in
                    five cases finished slower than the number shown, and the figure is backward-looking
                    by up to six months.
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <p className="text-sm font-bold text-ink-900">
                    Employment cases: check your field office, not the NBC
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                    USCIS states that if your office shows as the{" "}
                    <strong>National Benefits Center</strong> and you filed an employment-based I-485,
                    you should check the processing time for your{" "}
                    <strong>local field office</strong> instead. Reading the NBC number is one of the
                    most common reasons a case looks overdue when it is not.
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-base font-bold text-ink-900">
                Transfer to a local field office
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Employment-based I-485s are frequently moved from a service center or the NBC to the
                field office covering your address before a decision — most often when USCIS decides
                an interview is needed, or to balance workload. This is routine, and it is the single
                most common reason a case that had been moving appears to go silent.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
                <li>
                  • You will normally see a <strong>case transfer notice</strong>, and online status
                  may change to indicate a new office.
                </li>
                <li>
                  • The clock does <strong>not</strong> restart, but the queue you are now in is the
                  field office&apos;s — which can be faster or slower than the office you left.
                </li>
                <li>
                  • After a transfer, the processing time that applies to you is the{" "}
                  <strong>receiving office&apos;s</strong>. Compare against that one when deciding
                  whether the case is genuinely outside normal time.
                </li>
                <li>
                  • Only submit a service request once you are past the inquiry date{" "}
                  <em>for the office now holding the case</em>.
                </li>
              </ul>

              <h3 className="mt-6 text-base font-bold text-ink-900">
                Can I use premium processing to speed up Form I-485?
              </h3>
              <div className="mt-2 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <p className="text-sm font-bold text-ink-900">
                  No — premium processing is not available for Form I-485.
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                  Form I-907 covers a defined list of forms — including the{" "}
                  <strong>I-140</strong> immigrant petition and certain <strong>I-765</strong>{" "}
                  employment-authorization filings — but the I-485 adjustment application itself is
                  not among them. Paying for premium processing on your I-140 speeds the{" "}
                  <em>petition</em> decision; it does nothing for the adjustment application and
                  nothing for visa availability. There is no way to buy a faster I-485.
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-600">
                  Source:{" "}
                  <a
                    href="https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold text-emerald-700 underline"
                  >
                    USCIS — How Do I Request Premium Processing?
                  </a>
                </p>
              </div>

              <p className="mt-4 rounded-xl border border-ink-900/10 bg-white p-4 text-xs leading-relaxed text-ink-600">
                <strong className="text-ink-800">
                  Processing ranges on this page are planning estimates, last reviewed{" "}
                  {I485_UPDATED_HUMAN}.
                </strong>{" "}
                They are not USCIS-published figures for your specific office. The authoritative,
                office-specific number is always the{" "}
                <a
                  href={D.uscisProcessingTimesUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="font-semibold text-emerald-700 underline"
                >
                  USCIS processing-times tool
                </a>{" "}
                — check it for Form I-485 and your field office before drawing any conclusion about
                whether your case is delayed.
              </p>
            </div>
          </Container>
        </section>

        {/* Changing the basis of a pending I-485 */}
        <section className="border-t border-ink-900/5 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">
                Changing a pending I-485: interfiling vs. changing jobs
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                A pending I-485 is not frozen. Two different mechanisms let you change something
                underneath it while it stays pending — and they are constantly confused with each
                other because both involve a pending I-485 and both are sometimes called
                &ldquo;porting.&rdquo; They solve different problems and have different requirements.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
                    Transfer of underlying basis
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink-900">
                    Change which I-140 your I-485 rests on
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                    Also called <strong>interfiling</strong>. You keep the same pending I-485 but ask
                    USCIS to adjudicate it under a different approved I-140 — typically moving from
                    EB-3 to EB-2 when the EB-2 India chart pulls ahead.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-ink-700">
                    <li>• Needs an <strong>approved I-140</strong> in the new category</li>
                    <li>• Needs a visa number <strong>immediately available</strong> in that category</li>
                    <li>• <strong>No 180-day waiting period</strong></li>
                    <li>• Discretionary — USCIS is not obliged to grant it</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-card">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    §204(j) portability
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink-900">
                    Change employers or roles
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                    Filed on <strong>Form I-485 Supplement J</strong>. The I-140 and category stay the
                    same; you change the job the green card is based on.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-ink-700">
                    <li>• I-485 must have been <strong>pending at least 180 days</strong></li>
                    <li>• New job must be in the <strong>same or similar</strong> occupation</li>
                    <li>• The original I-140 must remain valid</li>
                    <li>• Does <strong>not</strong> change your category or priority date</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <p className="text-sm font-bold text-ink-900">
                  What each does to your processing time
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-700">
                  Neither restarts your I-485 — the original filing date and the pending-since clock
                  survive both. A transfer of underlying basis can <em>shorten</em> the total wait
                  substantially, because it moves your case to a chart where a visa number is
                  available now instead of years from now. What it does not do is speed up USCIS
                  adjudication itself: once a number is available under the new category, your case
                  re-enters the same field-office queue described above. Supplement J is
                  timing-neutral — it protects a case through a job change rather than accelerating
                  it, though an incomplete or late filing can stall adjudication.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <p className="text-sm font-bold text-ink-900">The risk worth understanding first</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-700">
                  Interfiling is not freely reversible. If you transfer your I-485 to EB-2 and EB-2
                  India then retrogresses or goes Unavailable — as it did for the back half of FY
                  2026 — your case waits under EB-2 until numbers return. You cannot casually bounce
                  back to the category you left. Time the request against the charts with your
                  attorney rather than requesting it the first month EB-2 looks better.
                </p>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-700">
                Full mechanics, the cover-letter contents, and the priority-date rules are on the{" "}
                <Link
                  href="/visa-bulletin/eb3-to-eb2-interfiling"
                  className="font-semibold text-emerald-700 underline"
                >
                  EB-3 to EB-2 interfiling guide
                </Link>
                . If you are weighing the move in the other direction, see the{" "}
                <Link
                  href="/visa-bulletin/eb2-to-eb3-downgrade"
                  className="font-semibold text-emerald-700 underline"
                >
                  EB-2 to EB-3 downgrade guide
                </Link>
                . And before either, check whether{" "}
                <Link
                  href="/visa-bulletin/cross-chargeability"
                  className="font-semibold text-emerald-700 underline"
                >
                  cross-chargeability
                </Link>{" "}
                applies — if your spouse was born outside India it can be worth more than any
                category change.
              </p>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related Green Card and Immigration Tools" links={[...i485ClusterLinks.filter((l) => l.href !== PATH), ...i485RelatedLinks]} />
          </Container>
        </section>

        {/* Soft CTA */}
        <section className="py-4">
          <Container>
            <SoftCta
              related={{
                href: "/tools/green-card-tracker",
                label: "Green Card Tracker",
                description:
                  "Log your priority date and see where your case sits in the current backlog.",
              }}
            />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        {/* Author + updated */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={I485_UPDATED_HUMAN} />
            <AuthorBioBox
              className="mt-6 max-w-3xl"
              tags={["I-485 & adjustment of status", "USCIS processing times", "Employment green cards"]}
            />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
