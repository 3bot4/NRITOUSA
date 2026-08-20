import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import OptCalc from "@/components/education/OptCalc";
import ShareWithTagline from "@/components/education/ShareWithTagline";
import { FactTable, MythRealityTable } from "@/components/education/FactTable";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  getStudentPage,
  getShareCopy,
  getRelated,
  STUDENT_LAST_REVIEWED,
} from "@/lib/studentCluster";
import {
  mythVsRealityFacts,
  optRules,
  studentSources,
  STUDENT_DATA_VERIFIED,
} from "@/data/studentClusterData";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const page = getStudentPage("opt-calculator")!;
const share = getShareCopy("opt-calculator");
const related = getRelated("opt-calculator");

export const metadata: Metadata = {
  ...pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  }),
  keywords: [
    "OPT unemployment days",
    "STEM OPT extension",
    "F1 grace period",
    "OPT calculator",
    "OPT filing window",
    "OPT 90 day rule",
  ],
};

const faq: FaqItem[] = [
  {
    question: "How many unemployment days do I get on OPT?",
    answer: `${optRules.initialUnemploymentDays} days during post-completion OPT. If you are approved for the STEM extension, ${optRules.stemAdditionalUnemploymentDays} more are added, for a lifetime total of ${optRules.aggregateUnemploymentDaysWithStem} days across both periods combined. The word that matters is combined: it is an aggregate cap, not a reset. A student who uses 40 days during initial OPT has 110 days left on STEM, not 150. A great deal of published OPT content states this incorrectly.`,
  },
  {
    question: "Does the STEM extension reset my unemployment counter?",
    answer: `No. This is the single most common misunderstanding about OPT. The ${optRules.aggregateUnemploymentDaysWithStem}-day figure is a lifetime total across post-completion OPT and the STEM extension together. Days you have already used are not returned to you when STEM is approved — the cap simply rises from ${optRules.initialUnemploymentDays} to ${optRules.aggregateUnemploymentDaysWithStem}.`,
  },
  {
    question: "When can I file for OPT?",
    answer: `The filing window opens ${optRules.filingWindowDaysBefore} days before your program end date and closes ${optRules.filingWindowDaysAfter} days after it. File on the first day you possibly can — USCIS processing time comes directly out of your job-search runway, and missing the closing date means losing post-completion OPT permanently. There is no late filing and no appeal.`,
  },
  {
    question: "What counts as employment for the unemployment counter?",
    answer: `Paid work of at least ${optRules.initialMinWeeklyHours} hours a week in your field of study, multiple part-time jobs totalling ${optRules.initialMinWeeklyHours}+ hours, a documented unpaid internship or volunteer role related to your degree, or self-employment with proper business documentation. Critically, it only counts if you report it in the SEVP Portal — a large share of accrued unemployment days come from students who were working the whole time but never reported it.`,
  },
  {
    question: "Do days outside the US count toward my unemployment limit?",
    answer:
      "Generally yes. Time spent outside the United States while unemployed during an approved OPT period still counts against the limit. The exception is employer-authorised leave — if you are employed and on approved leave, those days do not accrue. Travelling home to job-hunt remotely does not pause the clock.",
  },
  {
    question: "When do I file for the STEM extension?",
    answer: `You may file up to ${optRules.stemFilingWindowDaysBefore} days before your current EAD expires, and USCIS must receive it before that expiry date. File early — transit time counts against you and a rejection for lateness cannot be cured. You also need your employer enrolled in E-Verify and a completed Form I-983 training plan, both of which take time to arrange.`,
  },
  {
    question: "What happens if I go over the unemployment limit?",
    answer:
      "Exceeding the cap is a status violation. Your SEVIS record can be terminated, which ends work authorisation, removes the grace period, and can start unlawful presence accruing. If you are close to the limit, speak to your DSO before you cross it rather than after — the options available beforehand are much better than the ones available afterwards.",
  },
  {
    question: "Can I work while my OPT application is pending?",
    answer:
      "No. You cannot begin working until you have the EAD card in hand and the start date on it has arrived. This is the danger window: your program has ended, your student status has transitioned, and you have no work authorisation yet. It is also why filing on the first day of the window matters so much — every week of processing is a week you cannot work.",
  },
];

export default function OptCalculatorPage() {
  const url = absoluteUrl(page.path);
  const jsonLd = jsonLdGraph(
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#app`,
      name: page.title,
      description: page.seoDescription,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
      { name: page.label, url: page.path },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="opt-calculator"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: page.label },
        ]}
        icon={page.icon}
        category="Education"
        title={page.title}
        hook={page.hook}
        badges={["Every deadline", "Calendar export", "No signup", "Aggregate cap"]}
        accent={page.accent}
        sourceNote={
          <>
            Rules verified{" "}
            <time dateTime={STUDENT_DATA_VERIFIED}>{STUDENT_DATA_VERIFIED}</time>{" "}
            against{" "}
            <a
              href={studentSources.optUnemployment.href}
              className="text-brand-600 underline"
              rel="nofollow noopener"
              target="_blank"
            >
              the DHS SEVIS unemployment counter guidance
            </a>
            .
          </>
        }
        disclaimerExtra={
          <p>
            Estimated dates for planning only. Your DSO and your I-20 are
            authoritative — confirm every date with them before acting, and never
            book non-refundable travel or resign a job against a date computed
            here.
          </p>
        }
      >
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="OPT rules at a glance"
              answerLabel="Unemployment allowed — lifetime total with STEM"
              answer={`${optRules.aggregateUnemploymentDaysWithStem} days`}
              accent="amber"
              rows={[
                {
                  label: "Initial OPT unemployment cap",
                  value: `${optRules.initialUnemploymentDays} days`,
                },
                {
                  label: "With STEM extension (aggregate, not a reset)",
                  value: `${optRules.aggregateUnemploymentDaysWithStem} days`,
                  note: "Days already used still count against it.",
                  highlight: true,
                },
                {
                  label: "STEM extension length",
                  value: `${optRules.stemMonths} months`,
                },
                {
                  label: "Grace period after OPT ends",
                  value: `${optRules.gracePeriodDays} days`,
                  note: "You cannot work during it.",
                },
              ]}
              badges={[
                `${optRules.initialUnemploymentDays}/${optRules.aggregateUnemploymentDaysWithStem} days`,
                `${optRules.stemMonths}-month STEM`,
                `${optRules.gracePeriodDays}-day grace`,
              ]}
              lastVerified={STUDENT_DATA_VERIFIED}
              sources={[studentSources.optUnemployment, studentSources.stemOpt]}
              disclaimer="Educational estimate only. Confirm every date with your DSO."
            />
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <OptCalc />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ShareWithTagline
                shareText={share.text}
                tagline={share.tagline}
                path={page.path}
              />
            </div>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The aggregate cap, shown properly
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                If you take one thing from this page: the STEM extension raises
                your ceiling, it does not empty your bucket. Here is what that
                actually means for four students.
              </p>
              <FactTable
                caption="Days remaining once the STEM extension is approved"
                headers={[
                  "Used on initial OPT",
                  "What people assume",
                  "Actually remaining",
                  "Shortfall",
                ]}
                nowrapCol={0}
                rows={[
                  ["0 days", "150 days", "150 days", "—"],
                  ["30 days", "150 days", "120 days", "30 days fewer"],
                  ["60 days", "150 days", "90 days", "60 days fewer"],
                  ["89 days", "150 days", "61 days", "89 days fewer"],
                ]}
                highlightRows={[3]}
                note="A student who spent almost their entire initial allowance job-hunting has under nine weeks of unemployment left across a two-year STEM extension — not five months."
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Where unemployment days quietly accrue
              </h2>
              <FactTable
                caption="Situations that do and do not stop the counter"
                headers={["Situation", "Counter", "Why"]}
                rows={[
                  [
                    "Working 20+ hrs/week in your field, reported in SEVP Portal",
                    "Stopped",
                    "This is straightforwardly qualifying employment.",
                  ],
                  [
                    "Working full-time but never reported it",
                    "Still running",
                    "SEVIS only knows what is reported. This is the most common way students accrue days they did not need to.",
                  ],
                  [
                    "Two part-time jobs totalling 25 hrs/week",
                    "Stopped",
                    "Multiple jobs can be combined to reach the threshold.",
                  ],
                  [
                    "Unpaid internship in your field, documented",
                    "Stopped",
                    "Unpaid work counts if it is genuine, documented, and related to your degree.",
                  ],
                  [
                    "Job unrelated to your field of study",
                    "Still running",
                    "OPT employment must relate to the degree that authorised it.",
                  ],
                  [
                    "Back in India job-hunting remotely",
                    "Still running",
                    "Time abroad while unemployed generally counts against the limit.",
                  ],
                  [
                    "Employed and on approved leave",
                    "Stopped",
                    "You are still employed — employer-authorised leave does not accrue.",
                  ],
                  [
                    "Dropped from 25 to 15 hrs/week on STEM OPT",
                    "Partly running",
                    `STEM OPT requires ${optRules.stemMinWeeklyHours}+ hours a week; falling short can be treated as unemployment.`,
                  ],
                ]}
                highlightRows={[1, 5]}
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Things students are told that are not true
              </h2>
              <MythRealityTable
                facts={[
                  mythVsRealityFacts[2],
                  mythVsRealityFacts[9],
                  mythVsRealityFacts[7],
                ]}
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Where to go next
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block h-full rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <p className="text-sm font-bold text-ink-900">{l.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">
                        {l.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs text-ink-400">
                Last reviewed:{" "}
                <time dateTime={STUDENT_LAST_REVIEWED}>
                  {STUDENT_LAST_REVIEWED}
                </time>
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-14">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-16">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                Official sources
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  studentSources.optUnemployment,
                  studentSources.stemOpt,
                  studentSources.reinstatement,
                ].map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-brand-600 underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
