import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
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
  { question: "What is the full I-485 timeline?", answer: "In order: file (when your priority date is current) → receipt notices → biometrics → EAD/AP issued → possible RFE → possible interview → approval and green card. For how long each stage takes, see our I-485 processing time page." },
  { question: "Where do EAD and Advance Parole fall in the sequence?", answer: "When filed concurrently with I-485, EAD (I-765) and Advance Parole (I-131) are decided well before the I-485 itself, so you can work and travel while the green card application is still pending. Current estimates are on our I-485 processing time page." },
  { question: "When does biometrics happen in the sequence?", answer: "Biometrics comes after your receipt notices and before case review — you attend an Application Support Center for fingerprints and a photo. See our I-485 processing time page for current scheduling estimates." },
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
        <section className="pb-10 pt-8 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">The Seven Stages of an I-485, In Order</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Once your priority date is current, I-485 is the final stage — adjusting to permanent
                resident status from inside the U.S. Here is every step, in order. This page is about
                the <strong>sequence</strong>; for how long each stage takes, see{" "}
                <Link href="/i485-processing-time" className="font-semibold text-emerald-700 underline">
                  I-485 processing time
                </Link>
                .
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

              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <h2 className="text-base font-bold text-ink-900">Before stage 1: the package has to be complete on day one</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  The sequence above only starts if USCIS accepts the filing, and the bar
                  for that moved. Since December 2, 2024, Form I-693 — the sealed medical
                  exam — must be submitted <strong>with</strong> the I-485. A package
                  without it risks being <strong>rejected outright</strong> rather than
                  receipted and later held for evidence, which means no receipt number, no
                  pending application, and no concurrently filed EAD or Advance Parole
                  either. That is a materially worse outcome than an RFE at stage 5, and it
                  is why the medical is now a task you complete before you file.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Work through the{" "}
                  <Link href="/i485-documents-checklist" className="font-semibold text-rose-700 underline">
                    I-485 documents checklist
                  </Link>{" "}
                  before you post anything.
                </p>
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-bold text-ink-900">
                  The parts of the sequence nobody explains
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Between the seven visible stages there are a handful of events that
                  change what you should be doing, and none of them generate an
                  announcement. These are the ones worth knowing in advance.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Biometrics may be reused rather than rescheduled
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      USCIS can reuse fingerprints already on file instead of calling you
                      in, so the absence of a biometrics notice is not evidence that your
                      case is stalled between stages 2 and 3. If a notice does arrive,
                      attend it — a missed appointment without rescheduling can be treated
                      as abandonment of the application.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Day 180 is a milestone even though nothing arrives
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Once the I-485 has been pending 180 days, AC21 portability may let
                      you move to a same-or-similar role without restarting the green
                      card. Nothing in your case status marks the date, so count it
                      yourself from the receipt date — it is the point at which a job
                      offer stops being a threat to the case.{" "}
                      <Link href="/h1b-layoff" className="font-semibold text-brand-600 underline">
                        Portability and layoff options →
                      </Link>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      &ldquo;Ready to be scheduled for an interview&rdquo; is a queue, not a date
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      If that status appears, the service centre has finished with your
                      file and passed it to a field office, which schedules from its own
                      backlog. It means stage 6 is coming; it does not mean it is
                      imminent, and the wait after it depends on the office rather than
                      the category.{" "}
                      <Link href="/tools/uscis-case-status-meaning" className="font-semibold text-brand-600 underline">
                        Decode a case-status message →
                      </Link>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Moving house is a filing, not an update
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Change of address must be reported to USCIS within 10 days of
                      moving, and a move can also transfer your case to a different field
                      office — with a different interview backlog. An interview notice or
                      a green card sent to an old address is one of the more avoidable
                      ways this sequence goes wrong.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Approval and the card in your hand are different events
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      You become a permanent resident on approval, but the physical card
                      is produced and posted afterwards. If you need to travel or prove
                      status before it arrives, USCIS can provide temporary evidence of
                      permanent residence — worth asking about at the interview rather
                      than discovering later.{" "}
                      <Link href="/green-card-renewal" className="font-semibold text-brand-600 underline">
                        What to do if the card never arrives →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
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
