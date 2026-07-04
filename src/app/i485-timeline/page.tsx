import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import EstimatedTimelineTable from "@/components/EstimatedTimelineTable";
import {
  i485StageEstimateRows,
  i485EstimateSourceLinks,
  I485_ESTIMATE_VERIFIED,
  I485_ESTIMATE_DISCLAIMER,
} from "@/data/i485ProcessingData";
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
  i485ArticleJsonLd,
  I485_PUBLISHED,
  I485_UPDATED,
  I485_UPDATED_HUMAN,
} from "@/lib/i485Cluster";

const PATH = "/i485-timeline";
const TITLE = "I-485 Timeline 2026: From Filing to Green Card, Step by Step";
const DESC =
  "The I-485 adjustment-of-status timeline — receipt, biometrics, EAD/AP, RFE, interview, and approval — explained step by step.";

export const metadata: Metadata = pageMetadata({
  title: "I-485 Timeline 2026: Step by Step",
  description: DESC,
  path: PATH,
});

const STEPS = [
  { icon: "📥", title: "File I-485 (when priority date is current)", body: "You file once your date is current under the chart USCIS honors that month — usually with EAD (I-765) and Advance Parole (I-131) concurrently." },
  { icon: "📩", title: "Receipt notices (I-797C)", body: "USCIS issues receipt notices within a few weeks. Keep them — they prove your case is pending." },
  { icon: "🖐️", title: "Biometrics appointment", body: "You attend a biometrics (fingerprints/photo) appointment at an Application Support Center." },
  { icon: "🪪", title: "EAD / Advance Parole issued", body: "If filed concurrently, your EAD and Advance Parole (or combo card) typically arrive months before the green card, letting you work and travel." },
  { icon: "📄", title: "RFE (if any)", body: "USCIS may request more evidence. Respond fully and on time with your attorney to avoid delay or denial." },
  { icon: "🗣️", title: "Interview (if required)", body: "Many employment cases are interview-waived, but USCIS can schedule a field-office interview. Bring originals and updates." },
  { icon: "✅", title: "Approval & green card", body: "When approved (and a visa number is available), USCIS produces and mails your green card. Keep your approval notice." },
];

const faq: FaqItem[] = [
  { question: "What is the full I-485 timeline?", answer: "File (when your priority date is current) → receipt notices → biometrics → EAD/AP issued → possible RFE → possible interview → approval and green card. Timing varies by field office and whether an interview is required." },
  { question: "How long after filing do I get EAD and Advance Parole?", answer: "When filed concurrently with I-485, EAD (I-765) and Advance Parole (I-131) commonly arrive within several months — usually well before the green card itself, so you can work and travel while I-485 is pending." },
  { question: "When do I get biometrics?", answer: "USCIS usually schedules biometrics within a few weeks to a couple of months after filing. You attend an Application Support Center for fingerprints and a photo." },
  { question: "Will I have an interview for I-485?", answer: "Many employment-based I-485 cases are waived from interview, but USCIS retains discretion to require one. If scheduled, plan for extra time and prepare with your attorney." },
  { question: "What can delay my I-485?", answer: "Common causes: an RFE, a required interview, visa number retrogression, background-check holds, or field-office backlogs. Filing a complete, well-documented package reduces avoidable delays." },
  { question: "Can I travel while I-485 is pending?", answer: "Use Advance Parole, or travel on a valid H-1B/L-1 visa (dual intent). Traveling without either, while relying on a pending I-485, can be treated as abandoning the application. Confirm with your attorney." },
  { question: "Can I change jobs while I-485 is pending?", answer: "Under AC21 portability, once your I-485 has been pending 180+ days you may be able to change to a same-or-similar job and keep the case. This is case-specific — confirm with your attorney before moving." },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. I-485 timing and steps are case-specific — confirm with your immigration attorney and follow the official USCIS instructions." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i485ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I485_PUBLISHED, dateModified: I485_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-485 Timeline", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i485-timeline"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-485 Timeline" },
        ]}
        icon="🗺️"
        category="Visa & Green Card"
        title="I-485 Timeline 2026"
        hook="From filing to green card — receipt, biometrics, EAD/AP, RFE, interview, and approval, step by step."
        accent="from-teal-600 to-emerald-600"
        badges={["Step by step", "Adjustment of status", "For Indian applicants"]}
        headerExtra={
          <Link href="/i485-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
            Estimate your I-485 timeline →
          </Link>
        }
      >
        {/* Fast Answer: I-485 stage estimate first */}
        <section className="pt-6">
          <Container>
            <EstimatedTimelineTable
              title="I-485 Processing Time Estimate by Stage"
              intro="Planning ranges for adjustment of status after you can file. Times vary widely by field office, category, and visa availability — verify with USCIS. There is no premium processing for I-485."
              rows={i485StageEstimateRows}
              lastUpdated={I485_ESTIMATE_VERIFIED}
              sourceLinks={i485EstimateSourceLinks}
              disclaimer={I485_ESTIMATE_DISCLAIMER}
              ctaText="Estimate my I-485 timeline"
              ctaHref="/i485-processing-time"
            />
          </Container>
        </section>

        <section className="pb-10 pt-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-sm leading-relaxed text-ink-600">
                Once your priority date is current, I-485 is the final stage — adjusting to permanent resident status from inside the U.S. Here is every step, in order.
              </p>
              <ol className="mt-6 space-y-3">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-50 text-lg">{s.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{i + 1}. {s.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h2 className="text-base font-bold text-ink-900">Before you can even start</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  This timeline begins only when your priority date is current. For India EB-2/EB-3, that is the longest wait — track it with the{" "}
                  <Link href="/eb2-eb3-priority-date-india" className="text-brand-600 underline">EB2/EB3 India priority date</Link> page and the{" "}
                  <Link href="/tools/priority-date-checker" className="text-brand-600 underline">priority date checker</Link>.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related green card tools" links={[...i485ClusterLinks.filter((l) => l.href !== PATH), ...i485RelatedLinks]} />
          </Container>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={I485_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
