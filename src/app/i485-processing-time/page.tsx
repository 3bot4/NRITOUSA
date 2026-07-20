import type { Metadata } from "next";
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
