import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermTimelineCalculator from "@/components/tools/PermTimelineCalculator";
import PermDolTimesPanel from "@/components/tools/PermDolTimesPanel";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import SoftCta from "@/components/SoftCta";
import ImmigrationTimelineTable from "@/components/tools/ImmigrationTimelineTable";
import {
  permTimelineRows,
  permTimelineBadges,
  permPlanningSummary,
  permSourceNote,
  permSourceLinks,
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
  clusterLinks,
  relatedImmigrationLinks,
  webAppJsonLd,
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
  CLUSTER_UPDATED,
  CLUSTER_UPDATED_HUMAN,
} from "@/lib/permCluster";
import { permProcessingData as D, DOL_DATA_NOTE } from "@/data/permProcessingData";

const PATH = "/perm-processing-time-calculator";
const TITLE = "PERM Processing Time Calculator 2026";
const DESC =
  "Check the current PERM timeline, PWD processing, recruitment, DOL review, audit risk, and I-140 timing, then estimate your personal case.";

export const metadata: Metadata = pageMetadata({
  title: "PERM Processing Time 2026: DOL Timeline Calculator",
  description:
    "PERM processing time: plan 20–26 months from PWD filing to certification with no audit. Live DOL queue dates, stage-by-stage timeline, and a calculator.",
  path: PATH,
});

/* -------------------------------------------------------------------------- */
/* Static, editable content (numbers live in src/data/permProcessingData.ts).  */
/* -------------------------------------------------------------------------- */

const SNAPSHOT: {
  stage: string;
  what: string;
  question: string;
  next: string;
}[] = [
  {
    stage: "PWD filed",
    what: "Employer requests the prevailing wage from DOL.",
    question: "How long will PWD take?",
    next: "Check the DOL PWD queue and wait for the wage determination.",
  },
  {
    stage: "PWD approved",
    what: "Employer can move into recruitment planning.",
    question: "Can PERM be filed now?",
    next: "Complete required recruitment steps before filing PERM.",
  },
  {
    stage: "Recruitment",
    what: "Employer tests the labor market using required recruitment steps.",
    question: "How long after recruitment can PERM be filed?",
    next: "Confirm the recruitment window and quiet period with your attorney.",
  },
  {
    stage: "PERM filed",
    what: "Employer submits ETA Form 9089 to DOL.",
    question: "When will PERM be approved?",
    next: "Compare your filing date with the DOL analyst review queue.",
  },
  {
    stage: "PERM audit",
    what: "DOL requests more information before deciding the case.",
    question: "How long does a PERM audit take?",
    next: "Compare with the DOL audit review queue and your attorney's response timeline.",
  },
  {
    stage: "PERM approved",
    what: "Employer can usually move to I-140.",
    question: "What happens after PERM approval?",
    next: "Prepare the I-140 filing and track your priority date.",
  },
  {
    stage: "I-140 filed",
    what: "USCIS reviews the immigrant petition.",
    question: "Should I use premium processing?",
    next: "Discuss premium processing and H-1B extension strategy with your employer/attorney.",
  },
  {
    stage: "Priority date waiting",
    what: "Indian EB-2/EB-3 applicants may wait for Visa Bulletin movement.",
    question: "Can I file I-485 now?",
    next: "Check the Visa Bulletin Final Action Date and Date for Filing.",
  },
];

const WANT: { q: string; a: string }[] = [
  {
    q: "When will my PERM be approved?",
    a: "Compare your PERM filing date with DOL's current analyst review queue and average processing days.",
  },
  {
    q: "Is PWD included in PERM processing time?",
    a: "People often say 'PERM timeline' to mean PWD, recruitment, PERM filing, and DOL review — but technically PWD is a separate step before PERM filing.",
  },
  {
    q: "Can PERM be expedited?",
    a: "PERM itself has no premium processing. After PERM approval, the I-140 may have premium processing depending on the case.",
  },
  {
    q: "What if my PERM is audited?",
    a: "An audit can add significant time because DOL reviews additional information before deciding the case.",
  },
  {
    q: "Why does this matter for H-1B?",
    a: "PERM and I-140 timing can affect long-term H-1B extension planning, especially near the six-year limit.",
  },
];

const STAGES: { title: string; body: string }[] = [
  { title: "Employer starts green card process", body: "The employer decides to sponsor and begins the PERM labor certification process." },
  { title: "PWD filed", body: "The employer requests a prevailing wage determination from DOL for the role." },
  { title: "PWD approved", body: "DOL issues the minimum wage the employer must offer, clearing the way for recruitment." },
  { title: "Recruitment begins", body: "The employer runs required job ads to test the U.S. labor market." },
  { title: "Recruitment ends", body: "After the ads run, a mandatory 30-day quiet period must pass before filing." },
  { title: "PERM filed", body: "The employer submits ETA Form 9089. The receipt date becomes your priority date." },
  { title: "DOL analyst review", body: "An analyst certifies, denies, or audits the filed PERM application." },
  { title: "Audit review, if applicable", body: "Audited cases move to a separate, slower queue while DOL reviews the full file." },
  { title: "PERM approved", body: "With certification, the employer can move on to the I-140 immigrant petition." },
  { title: "I-140 filed", body: "USCIS reviews the immigrant petition; premium processing is available for most categories." },
  { title: "Visa Bulletin / I-485 stage", body: "You file I-485 once your priority date is current — for India, often a multi-year wait." },
];

const faq: FaqItem[] = [
  { question: "What is PERM processing time?", answer: "PERM processing time is how long the U.S. Department of Labor (DOL) takes to decide a PERM labor certification after it is filed. It does not include the earlier prevailing wage (PWD) and recruitment steps. DOL publishes the current queue monthly on its FLAG processing-times dashboard, and times change from month to month." },
  { question: "How long does PERM take in 2026?", answer: "The total PERM stage — prevailing wage determination, recruitment, filing, and DOL analyst review — commonly spans well over a year end to end, and longer if the case is audited. Exact current queues change monthly; always check the DOL FLAG dashboard and confirm your own timeline with your employer's immigration attorney." },
  { question: "Is PWD included in PERM processing time?", answer: "Technically no. Prevailing wage determination (PWD) is a separate DOL step that must finish before PERM is filed. Many people casually include PWD, recruitment, and DOL review when they say 'PERM timeline,' but the official PERM processing queue only covers the review after the ETA-9089 is filed." },
  { question: "What is the difference between PWD and PERM?", answer: "PWD (prevailing wage determination) is the first DOL step: DOL sets the minimum wage your employer must offer for the role. PERM (labor certification) comes later, after recruitment, and is DOL's certification that no qualified U.S. worker is available. PWD must be completed before PERM can be filed." },
  { question: "How long does PWD take for PERM?", answer: "As a planning range, a prevailing wage determination (PWD) commonly takes about 5–7 months, and it has no premium processing. PWD is a separate DOL step that must finish before PERM is filed, so it is not counted in the official PERM review queue. Times change monthly — check the DOL FLAG processing-times dashboard for the current PWD queue." },
  { question: "How long does PERM take after recruitment?", answer: "After recruitment ends, the employer must wait at least 30 days (the quiet period) before filing PERM. Once filed, DOL analyst review currently takes many months — see the current queue on the DOL FLAG dashboard. An audit adds significant additional time." },
  { question: "Does a PERM audit add time?", answer: "Yes. If DOL selects your PERM for audit, it moves to a separate, slower review queue and can add roughly 6–12+ months as a planning range. An audit is not a denial — your attorney responds with the recruitment file and documentation — but you should plan for a longer total timeline. Check the DOL audit queue and confirm timing with your attorney." },
  { question: "What does DOL analyst review mean?", answer: "DOL analyst review is the standard adjudication: an analyst reviews the filed ETA-9089 and recruitment record and either certifies, denies, or issues an audit. DOL publishes the priority date (filing month) it is currently reviewing on the FLAG dashboard." },
  { question: "What happens if my PERM is audited?", answer: "An audit means DOL asks for the full recruitment file and supporting documentation before deciding. It is not a denial, but it substantially lengthens processing because audited cases go into a separate, slower review queue. Your attorney responds to the audit on the employer's behalf." },
  { question: "Can PERM be premium processed?", answer: "No. PERM labor certification cannot be premium processed. There is no way to pay to expedite a PERM decision. Premium processing is only available for certain I-140 immigrant petitions, which come after PERM." },
  { question: "What happens after PERM approval?", answer: "After PERM is certified, the employer files Form I-140 (the immigrant petition) with USCIS. Once I-140 is approved and your priority date is current in the Visa Bulletin, you can file I-485 (or pursue consular processing) for the green card." },
  { question: "How long does I-140 take after PERM approval?", answer: "Premium processing decides most EB-2/EB-3 I-140 petitions in about 15 business days, and EB-1C/EB-2 NIW in about 45 business days. Standard (non-premium) I-140 adjudication is a general planning range of several months. Confirm current availability with your attorney." },
  { question: "Does PERM approval mean I can file I-485?", answer: "Not by itself. PERM approval lets the employer file I-140. You can generally only file I-485 (adjustment of status) once your priority date is current in the Visa Bulletin. For India EB-2/EB-3, that can be a multi-year wait after I-140 approval." },
  { question: "Why does the Visa Bulletin matter for Indian applicants?", answer: "For India EB-2 and EB-3, visa numbers are heavily backlogged. The Visa Bulletin's Final Action Date and Date for Filing determine when you can file I-485 and when the green card can be approved — often the biggest factor in the total timeline after PERM and I-140." },
  { question: "Can PERM help with H-1B extension?", answer: "Yes, indirectly. A PERM (or I-140) pending 365+ days before your six-year H-1B limit generally supports one-year extensions under AC21 §106(a). An approved I-140 generally supports three-year extensions. Rules are case-specific — confirm with your attorney." },
  { question: "What if my H-1B expires before PERM approval?", answer: "This is a timing risk. Whether you can extend depends on how far along your green card case is (PERM/I-140 filing and approval dates) and recapture of time spent outside the U.S. Speak to your employer's immigration attorney immediately; this tool only gives an educational estimate." },
  { question: "Is this PERM calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer's immigration attorney. Processing estimates are based on general planning ranges and the DOL FLAG dashboard, which changes monthly." },
  { question: "How often should I check DOL processing times?", answer: "DOL updates its FLAG processing-times dashboard monthly, so check it at least once a month while your case is pending. We refresh the numbers on this page from that official source, but always verify the current figures directly at flag.dol.gov/processingtimes." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    webAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "PERM Processing Time Calculator", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="perm-processing-time-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "PERM Processing Time" },
        ]}
        icon="⏳"
        category="Visa & Green Card"
        title={TITLE}
        hook="See estimated PERM timeline by stage, including PWD, recruitment, DOL review, audit, I-140, priority date, and H-1B risk."
        accent="from-blue-700 to-indigo-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#perm-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
              Estimate My Personal PERM Timeline →
            </a>
            <a href={D.dolSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
              Check Official DOL Processing Times ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {CLUSTER_UPDATED_HUMAN}. {DOL_DATA_NOTE}</>}
        disclaimerExtra={<p>{TIMELINE_DISCLAIMER}</p>}
      >
        {/* Byline row */}
        <section className="pt-5">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ReviewedByline date={CLUSTER_UPDATED} />
            </div>
          </Container>
        </section>

        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Long Does PERM Take?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                The total PERM timeline is not only the DOL review period. Most applicants should think of the timeline as PWD + recruitment + PERM filing + DOL analyst review + possible audit + I-140. A no-audit PERM path can often take around <strong>20–26 months</strong> from PWD filing to PERM approval as a planning range. If the case is audited, it can take longer. PERM itself does not have premium processing.
              </p>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <p className="text-xs leading-relaxed text-ink-700">
                  <span className="font-bold text-ink-900">Note:</span> PERM cannot be premium processed. I-140 may be eligible for premium processing depending on the category and case type.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#perm-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-800">Use the calculator →</a>
                <a href={D.dolSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-blue-300">DOL FLAG processing times ↗</a>
              </div>
            </div>

            {/* Key takeaways */}
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                <li>• Plan <strong>20–26 months</strong> from PWD filing to PERM certification on a clean, no-audit case — the DOL review alone is only part of it.</li>
                <li>• Expect no shortcut: <strong>PERM has no premium processing</strong>, unlike the I-140 that follows it.</li>
                <li>• Build in the mandatory <strong>30-day quiet period</strong> after recruitment ends before the ETA-9089 can be filed.</li>
                <li>• Add several months if audited — audited cases move to a separate, slower DOL queue.</li>
                <li>• Remember what the wait buys you: your <strong>priority date</strong> is set on the PERM filing date, so earlier filing means an earlier place in the green card queue.</li>
              </ul>
            </div>

            {/* Opening keyword paragraph */}
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="text-base leading-relaxed text-ink-700">
                PERM processing time is the stretch between your employer starting the labor
                certification and the Department of Labor certifying it — and for most people it is the
                slowest controllable part of an employment green card. This page is for H-1B workers and
                employers tracking DOL PERM processing times across all four stages: the prevailing wage
                determination (PWD), recruitment, the ETA-9089 filing, and analyst review or audit. The
                headline number to plan around is <strong>20–26 months</strong> from PWD filing to
                certification when nothing is audited, with PERM offering no premium-processing escape
                hatch. Below you&apos;ll find a stage-by-stage PERM timeline for 2026, the live DOL FLAG
                queue dates, what PWD processing time is running, how long a PERM audit adds, a calculator
                that estimates your own dates, and how PERM connects to the I-140 and the priority-date
                wait that follows.
              </p>
            </div>
          </Container>
        </section>

        {/* NEW: static timeline estimate table (before the calculator) */}
        <section className="py-10 sm:py-12">
          <Container>
            <ImmigrationTimelineTable
              title="PERM Processing Time Estimate by Stage"
              intro="Most users searching for PERM processing time want the total wait first. This table gives a quick planning estimate. Use the calculator below for a personal estimate based on your own dates."
              rows={permTimelineRows}
              badges={permTimelineBadges}
              sourceNote={permSourceNote}
              sourceLinks={permSourceLinks}
              ctaText="Estimate My Personal PERM Timeline"
              ctaHref="#perm-calculator"
              accentBtn="bg-blue-700 hover:bg-blue-800"
            />

            {/* Quick planning summary box */}
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">PERM Timeline Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{permPlanningSummary}</p>
            </div>
          </Container>
        </section>

        {/* Stage explanation table (renamed, now below the timeline estimate) */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">PERM Stages Explained</h2>
              <p className="mt-1.5 text-sm text-ink-500">After you understand the timeline estimate above, this table explains what each PERM stage means and what action usually comes next.</p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Stage</th>
                      <th className="p-3 font-semibold">What happens</th>
                      <th className="p-3 font-semibold">Typical question</th>
                      <th className="p-3 font-semibold">Next step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {SNAPSHOT.map((r) => (
                      <tr key={r.stage} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.stage}</td>
                        <td className="p-3 text-ink-600">{r.what}</td>
                        <td className="p-3 text-ink-600">{r.question}</td>
                        <td className="p-3 text-ink-600">{r.next}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">{DOL_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* What most people want to know */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What most people want to know about PERM timing</h2>
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

        {/* Current DOL data */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto mb-4 max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Current DOL PERM processing data</h2>
              <p className="mt-1.5 text-sm text-ink-500">Pulled from the official DOL FLAG dashboard. Values shown as &ldquo;Update from DOL FLAG&rdquo; are awaiting the next monthly refresh.</p>
            </div>
            <PermDolTimesPanel variant="full" />
          </Container>
        </section>

        {/* Typical timeline */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Typical PERM green card timeline</h2>
              <ol className="mt-5 space-y-3">
                {STAGES.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
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
        <section id="perm-calculator" className="scroll-mt-24 border-t border-ink-900/5 bg-white pb-12 pt-10 sm:pb-16 sm:pt-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Estimate Your Personal PERM Processing Time</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                The snapshot above gives a general overview. Use the calculator below to estimate your own PERM timeline based on PWD, recruitment, PERM filing date, audit status, I-140, priority date, and H-1B expiration.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <PermTimelineCalculator />
            </div>

            {/* How this calculation works */}
            <div className="mx-auto mt-8 max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How this PERM estimate is calculated</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The estimate is built from the Department of Labor&apos;s own published queue positions, not
                from crowd-sourced case reports. DOL states on its FLAG dashboard which filing month it is
                currently processing for each queue — prevailing wage determinations, PERM analyst review,
                and audits are tracked separately. The calculator measures the distance between the month
                DOL is working on now and your own filing month, converts that backlog into remaining
                months, and then adds the fixed statutory pieces that no queue can shorten: the recruitment
                period and the mandatory 30-day quiet period before the ETA-9089 can be filed. If you flag
                your case as audited, it switches to the audit queue&apos;s slower position instead of the
                standard analyst queue. Two assumptions are worth stating plainly: the model assumes DOL
                continues advancing at its recent pace, which can and does change month to month, and it
                treats PERM as having no premium processing, because it does not. Everything after
                certification — the I-140 and the priority-date wait — is estimated separately, since those
                run on USCIS and visa-bulletin timelines rather than DOL ones.
              </p>
            </div>

            {/* How this connects */}
            <div className="mx-auto mt-8 max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How PERM timing connects to the rest of your green card</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                PERM is the stage that sets your place in line. The date DOL receives your ETA-9089 becomes
                your{" "}
                <Link href="/visa-bulletin/priority-date" className="font-semibold text-brand-600 underline">
                  priority date
                </Link>
                , so every month of PWD or recruitment delay pushes that date later in a queue where, for
                India, a single month can matter. After certification the employer files the{" "}
                <Link href="/i140-processing-time" className="font-semibold text-brand-600 underline">
                  I-140
                </Link>{" "}
                — which <em>can</em> be premium processed — and only once your priority date is current can
                you move to{" "}
                <Link href="/i485-timeline" className="font-semibold text-brand-600 underline">
                  I-485
                </Link>
                . PERM timing also drives H-1B planning: an approved I-140, or a PERM pending 365+ days,
                is what supports extensions beyond the six-year limit. Check where your date stands with the{" "}
                <Link href="/tools/priority-date-checker" className="font-semibold text-brand-600 underline">
                  Priority Date Checker
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related PERM and Green Card Tools" links={[...clusterLinks.filter((l) => l.href !== PATH), ...relatedImmigrationLinks]} />
          </Container>
        </section>

        {/* Soft CTA */}
        <section className="py-4">
          <Container>
            <SoftCta
              related={{
                href: "/prevailing-wage-calculator",
                label: "Prevailing Wage Calculator",
                description:
                  "Estimate the DOL wage level your PERM case needs before the ETA-9089 stage.",
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
            <AuthorReviewLine lastUpdated={CLUSTER_UPDATED_HUMAN} />
            <AuthorBioBox
              className="mt-6 max-w-3xl"
              tags={["PERM & DOL timelines", "Employment green cards", "H-1B to green card planning"]}
            />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
