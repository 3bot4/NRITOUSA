import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermDolTimesPanel from "@/components/tools/PermDolTimesPanel";
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
  clusterLinks,
  relatedImmigrationLinks,
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
  CLUSTER_UPDATED,
  CLUSTER_UPDATED_HUMAN,
} from "@/lib/permCluster";
import {
  permProcessingData as D,
  permEstimateSourceLinks,
  PERM_ESTIMATE_VERIFIED,
  PERM_ESTIMATE_DISCLAIMER,
} from "@/data/permProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/pwd-processing-time";
const TITLE = "PWD Processing Time 2026: Prevailing Wage Timeline for PERM";
const DESC =
  "Learn current PWD processing time for PERM and what happens after prevailing wage approval.";

export const metadata: Metadata = pageMetadata({
  title: "PWD Processing Time 2026 for PERM",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is PWD in PERM?", answer: "PWD stands for prevailing wage determination. It is the first Department of Labor step in a PERM case: DOL sets the minimum wage the employer must offer for the specific job, location, and requirements. PERM cannot be filed until the PWD is issued." },
  { question: "How long does PWD take?", answer: "PWD processing time varies by wage source and DOL volume and is published monthly on the DOL FLAG dashboard. As a general planning range it commonly takes several months. Check the current queue on FLAG and confirm with your attorney." },
  { question: "Is PWD required before PERM?", answer: "Yes. A valid prevailing wage determination is a prerequisite for filing PERM. Recruitment ads must also offer at least the prevailing wage, so PWD effectively gates the entire PERM timeline." },
  { question: "What is OEWS?", answer: "OEWS (Occupational Employment and Wage Statistics) is the standard government wage survey DOL uses to set most prevailing wages. OEWS-based PWDs are the most common and have their own processing queue on the FLAG dashboard." },
  { question: "What is Non-OEWS?", answer: "A non-OEWS wage source is used when the employer relies on an alternative survey, a collective bargaining agreement, or another approved wage source instead of the OEWS survey. These determinations are tracked in a separate FLAG queue." },
  { question: "Can PWD be premium processed?", answer: "No. Like PERM itself, the prevailing wage determination cannot be premium processed. There is no way to pay DOL to expedite a PWD." },
  { question: "What happens after PWD approval?", answer: "Once the PWD is issued, the employer runs the required recruitment (job ads) offering at least the prevailing wage, observes the mandatory 30-day quiet period, and then files the PERM application. The PWD is valid for a limited window, so recruitment must be timed within it." },
  { question: "Can recruitment start before PWD?", answer: "In practice, recruitment should not be finalized before the PWD is issued because ads must offer at least the prevailing wage. Starting ads before you know the wage risks having to redo recruitment. Employers typically wait for the PWD." },
  { question: "Does PWD approval guarantee PERM approval?", answer: "No. PWD only sets the wage. PERM approval separately depends on proper recruitment, a clean labor market test, and DOL review — and the case may still be audited. PWD is a necessary first step, not a guarantee." },
  { question: "Why is my PWD taking longer than expected?", answer: "PWD queues fluctuate with DOL volume and staffing, and complex roles or non-OEWS wage sources can take longer. Compare your PWD filing date to the current FLAG queue; if it is far older, ask your employer's attorney whether follow-up is appropriate." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "PWD Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="pwd-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "PWD Processing Time" },
        ]}
        icon="💵"
        category="Visa & Green Card"
        title="PWD Processing Time 2026"
        hook="The prevailing wage determination is the first DOL step — and it gates your whole PERM timeline. Here's how long it takes and what comes next."
        accent="from-emerald-500 to-teal-600"
        badges={["Updated monthly", "Official DOL source", "Prevailing wage"]}
      >
        {/* Fast Answer: PWD planning range first */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="How long does the PWD take?"
              answerLabel="Prevailing Wage Determination (planning range)"
              answer="5–7 months"
              accent="emerald"
              rows={[
                { label: "PWD (this page)", value: "5–7 months", note: "First DOL step; gates everything after.", highlight: true },
                { label: "Recruitment + quiet period", value: "2–3 months", note: "After PWD is issued." },
                { label: "PERM analyst review", value: "12–16 months", note: "No premium processing." },
                { label: "Total to PERM (no audit)", value: "~20–26 months", note: "PWD → certified, planning range." },
              ]}
              badges={["Planning range", "Official queue on DOL FLAG"]}
              lastVerified={PERM_ESTIMATE_VERIFIED}
              sources={permEstimateSourceLinks}
              disclaimer={PERM_ESTIMATE_DISCLAIMER}
              ctaText="See the live DOL PWD queue below"
              ctaHref="#current-pwd"
            />
          </Container>
        </section>

        {/* Intro */}
        <section className="pb-8 pt-10">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">What is PWD?</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  A prevailing wage determination (PWD) is the U.S. Department of Labor&rsquo;s official finding of the minimum wage an employer must pay for a specific job, in a specific location, with specific requirements. It is the first step in a PERM-based green card case, and every later step — recruitment and the PERM filing itself — depends on it.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">Why PWD matters before PERM</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Recruitment ads must offer at least the prevailing wage, and the PERM application certifies the employer will pay it. So until the PWD is issued, recruitment can&rsquo;t be properly finalized and PERM can&rsquo;t be filed. A slow PWD pushes your entire timeline — recruitment, PERM, I-140, and your priority date — later.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Current PWD times */}
        <section id="current-pwd" className="scroll-mt-24 pb-10">
          <Container>
            <PermDolTimesPanel variant="pwd" />
          </Container>
        </section>

        {/* OEWS vs non-OEWS + timeline examples */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">OEWS vs Non-OEWS — in simple terms</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  <strong>OEWS</strong> is the standard government wage survey DOL uses for most cases — this is the common path. <strong>Non-OEWS</strong> means the employer used a different approved source (an alternative survey, a collective bargaining agreement, etc.). The two have separate DOL queues, and non-OEWS determinations can take longer.
                </p>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">PWD timeline examples</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  General planning range: a PWD commonly takes about {D.pwdPlanningMonthsLow}–{D.pwdPlanningMonthsHigh} months from filing, though the current queue on the FLAG dashboard is the number to trust. For example, if a PWD is filed in month 0, an employer might realistically plan recruitment to begin a few months later once the determination is issued — then add the recruitment window and 30-day quiet period before PERM filing.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">What happens after PWD approval?</h3>
                <ol className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>1. Employer runs required recruitment (job ads) offering at least the prevailing wage.</li>
                  <li>2. A mandatory 30-day quiet period is observed after recruitment.</li>
                  <li>3. The employer files the PERM application (ETA-9089) — its receipt date is your priority date.</li>
                  <li>4. DOL reviews (and may audit) before certifying.</li>
                </ol>
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
