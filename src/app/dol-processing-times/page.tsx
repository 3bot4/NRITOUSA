import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermDolTimesPanel from "@/components/tools/PermDolTimesPanel";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import EstimatedTimelineTable from "@/components/EstimatedTimelineTable";
import {
  permStageEstimateRows,
  permEstimateSourceLinks,
  PERM_ESTIMATE_VERIFIED,
  PERM_ESTIMATE_DISCLAIMER,
} from "@/data/permProcessingData";
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
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
  CLUSTER_UPDATED,
  CLUSTER_UPDATED_HUMAN,
} from "@/lib/permCluster";

const PATH = "/dol-processing-times";
const TITLE = "DOL Processing Times 2026: PERM, PWD, and Audit Review";
const DESC =
  "Track DOL PERM, PWD, analyst review, and audit review processing times with monthly updated official-source data.";

export const metadata: Metadata = pageMetadata({
  title: "DOL Processing Times 2026: PERM & PWD",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "Where can I check official DOL processing times?", answer: "The official source is the DOL FLAG processing-times dashboard at flag.dol.gov/processingtimes. It shows the current PWD, PERM analyst review, and audit review queues. This page summarizes that data, but the dashboard is authoritative." },
  { question: "How often does DOL update PERM processing times?", answer: "DOL refreshes the FLAG processing-times dashboard monthly. Queues can move forward or backward month to month depending on filing volume and staffing, so always check the current month." },
  { question: "What is PERM analyst review?", answer: "It is the standard DOL adjudication step where an analyst reviews a filed PERM application and either certifies it, denies it, or issues an audit. DOL publishes the filing month (priority date) it is currently reviewing." },
  { question: "What is PERM audit review?", answer: "When DOL audits a PERM, it requests the full recruitment file and supporting evidence before deciding. Audited cases go into a separate, slower queue, which DOL reports with its own priority date on the dashboard." },
  { question: "Why is my PERM still pending?", answer: "Most likely your filing month is still behind the current analyst review queue, or your case was selected for audit. Compare your PERM filing date to the current queue on the FLAG dashboard. If your case is far older than the queue, ask your attorney whether an inquiry is appropriate." },
  { question: "What does the DOL priority date mean?", answer: "On the FLAG dashboard, the 'priority date' is the filing month DOL is currently processing — for example, DOL might be reviewing cases filed in a given month. It is different from the green card priority date used in the Visa Bulletin, though for PERM they share the same filing date." },
  { question: "Can I contact DOL if my PERM is delayed?", answer: "Employers (through their attorney) can submit a case-status inquiry to DOL if a case is significantly older than the published queue. There is no premium processing for PERM. Individual applicants generally cannot expedite; your employer's attorney handles any inquiry." },
  { question: "Are DOL processing times guaranteed?", answer: "No. Published queues are estimates of where DOL is working, not guarantees. Your individual case can move faster or slower, especially if audited or if additional review is required." },
  { question: "How do PWD processing times affect PERM?", answer: "PWD comes first: PERM cannot be filed until the prevailing wage determination is issued. A slow PWD queue pushes back your recruitment and PERM filing, which delays the whole timeline. See our PWD processing time page for details." },
  { question: "Should I use a PERM calculator or the official DOL page?", answer: "Use both. The official DOL FLAG dashboard gives the authoritative current queues; our PERM calculator combines those with your own dates to estimate your personal timeline. Neither is legal advice — confirm with your attorney." },
];

const SECTIONS = [
  { title: "PERM analyst review", body: "The standard queue. DOL analysts review filed PERM applications in roughly filing-date order and certify, deny, or audit. This is the number most applicants watch — compare it to your own PERM filing date to gauge how far you are from a decision." },
  { title: "PERM audit review", body: "A separate, slower queue for cases DOL selected for audit. An audit is not a denial, but it can add many months. If your case was audited, this is the queue that governs your wait." },
  { title: "PWD processing times for PERM", body: "The prevailing wage determination queue, split by wage source (OEWS vs non-OEWS). PWD must be issued before PERM can be filed, so this queue sits at the very front of your timeline." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "DOL Processing Times", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="dol-processing-times"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "DOL Processing Times" },
        ]}
        icon="📊"
        category="Visa & Green Card"
        title="DOL Processing Times 2026"
        hook="PERM, PWD, and audit review queues in one place — updated monthly from the official DOL FLAG dashboard."
        accent="from-amber-500 to-orange-600"
        badges={["Updated monthly", "Official DOL source", "For Indian applicants"]}
      >
        {/* Fast Answer: PERM stage estimate first */}
        <section className="pt-6">
          <Container>
            <EstimatedTimelineTable
              title="PERM / PWD Processing Time Estimate by Stage"
              intro="Planning ranges for the DOL portion of the green card path. The live current queue (which month DOL is processing) is in the official panel below — it changes monthly."
              rows={permStageEstimateRows}
              lastUpdated={PERM_ESTIMATE_VERIFIED}
              sourceLinks={permEstimateSourceLinks}
              disclaimer={PERM_ESTIMATE_DISCLAIMER}
              ctaText="See the live DOL queue below"
              ctaHref="#live-dol-queue"
            />
          </Container>
        </section>

        {/* Current times panel */}
        <section id="live-dol-queue" className="scroll-mt-24 pb-10 pt-10 sm:pb-12">
          <Container>
            <PermDolTimesPanel variant="full" />
          </Container>
        </section>

        {/* Summary sections */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">Current DOL processing times summary</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The U.S. Department of Labor processes employment-based green card cases in two stages: the prevailing wage determination (PWD) and the PERM labor certification. Each has its own queue, published monthly on the DOL FLAG dashboard. Below is what each queue means and how to read it.
                </p>
              </div>
              {SECTIONS.map((s) => (
                <div key={s.title} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h3 className="text-base font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">What &ldquo;priority date&rdquo; means on the DOL processing page</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  On the FLAG dashboard, the priority date is the filing month DOL is currently working on — not your personal green card priority date in the Visa Bulletin. For PERM they happen to be the same filing date, but the DOL queue tells you how far back DOL is currently processing, while the Visa Bulletin tells you when a visa number becomes available.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">What to do if your case is older than the current DOL queue</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>→ Confirm your exact filing date against the current published queue.</li>
                  <li>→ Ask your employer&rsquo;s attorney whether a DOL case-status inquiry is appropriate.</li>
                  <li>→ Remember PERM has no premium processing — you cannot pay to expedite.</li>
                  <li>→ Keep your H-1B status and any approved I-140 valid while you wait.</li>
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks links={[...clusterLinks.filter((l) => l.href !== PATH), ...relatedImmigrationLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={CLUSTER_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
