import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermTimelineCalculator from "@/components/tools/PermTimelineCalculator";
import PermDolTimesPanel from "@/components/tools/PermDolTimesPanel";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import {
  absoluteUrl,
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

const PATH = "/perm-processing-time-calculator";
const TITLE = "PERM Processing Time Calculator 2026";
const DESC =
  "Estimate your PWD, recruitment, PERM approval, I-140, priority date, and H-1B max-out risk timeline in one place.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is PERM processing time?", answer: "PERM processing time is how long the U.S. Department of Labor (DOL) takes to decide a PERM labor certification after it is filed. It does not include the earlier prevailing wage (PWD) and recruitment steps. DOL publishes the current queue monthly on its FLAG processing-times dashboard, and times change from month to month." },
  { question: "How long does PERM take in 2026?", answer: "The total PERM stage — prevailing wage determination, recruitment, filing, and DOL analyst review — commonly spans well over a year end to end, and longer if the case is audited. Exact current queues change monthly; always check the DOL FLAG dashboard and confirm your own timeline with your employer's immigration attorney." },
  { question: "What is the difference between PWD and PERM?", answer: "PWD (prevailing wage determination) is the first DOL step: DOL sets the minimum wage your employer must offer for the role. PERM (labor certification) comes later, after recruitment, and is DOL's certification that no qualified U.S. worker is available. PWD must be completed before PERM can be filed." },
  { question: "Does recruitment happen before or after PWD?", answer: "Recruitment happens after PWD in almost all cases, because job ads must offer at least the prevailing wage DOL sets. Recruitment must be completed, and a mandatory 30-day quiet period observed, before the employer files PERM." },
  { question: "How long does PERM take after recruitment?", answer: "After recruitment ends, the employer must wait at least 30 days (the quiet period) before filing PERM. Once filed, DOL analyst review currently takes many months — see the current queue on the DOL FLAG dashboard. An audit adds significant additional time." },
  { question: "What does PERM analyst review mean?", answer: "PERM analyst review is the standard DOL adjudication: an analyst reviews the filed ETA-9089 and recruitment record and either certifies, denies, or issues an audit. DOL publishes the priority date (filing month) it is currently reviewing." },
  { question: "What happens if my PERM is audited?", answer: "An audit means DOL asks for the full recruitment file and supporting documentation before deciding. It is not a denial, but it substantially lengthens processing because audited cases go into a separate, slower review queue. Your attorney responds to the audit on the employer's behalf." },
  { question: "Can I premium process PERM?", answer: "No. PERM labor certification cannot be premium processed. There is no way to pay to expedite a PERM decision. Premium processing is only available for certain I-140 immigrant petitions, which come after PERM." },
  { question: "Can I premium process I-140 after PERM approval?", answer: "Often yes. Once PERM is approved, the employer files Form I-140, and premium processing is available for most EB-2 and EB-3 I-140 petitions (currently about 15 business days) and for EB-1C and EB-2 NIW (about 45 business days). Confirm current availability with your attorney." },
  { question: "Does PERM approval mean I can file I-485?", answer: "Not by itself. PERM approval lets the employer file I-140. You can generally only file I-485 (adjustment of status) once your priority date is current in the Visa Bulletin. For India EB-2/EB-3, that can be a multi-year wait after I-140 approval." },
  { question: "What is a PERM priority date?", answer: "Your priority date is the date DOL received your PERM (the filing date). It marks your place in the green card line. When the Visa Bulletin cutoff for your category and country reaches your priority date, a visa number becomes available." },
  { question: "Does PERM help with H-1B extension?", answer: "Yes, indirectly. A PERM (or I-140) pending 365+ days before your six-year H-1B limit generally supports one-year extensions under AC21 §106(a). An approved I-140 generally supports three-year extensions. Rules are case-specific — confirm with your attorney." },
  { question: "What if my H-1B is expiring before PERM approval?", answer: "This is a timing risk. Whether you can extend depends on how far along your green card case is (PERM/I-140 filing and approval dates) and your recapture of time spent outside the U.S. Speak to your employer's immigration attorney immediately about extension options; this tool only gives an educational estimate." },
  { question: "Is this PERM calculator legal advice?", answer: "No. This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer's immigration attorney. Processing estimates are based on general planning ranges and the DOL FLAG dashboard, which changes monthly." },
  { question: "How often are DOL PERM processing times updated?", answer: "DOL updates its FLAG processing-times dashboard monthly. We refresh the numbers on this page from that official source. Because the queues move each month, always verify the current figures directly at flag.dol.gov/processingtimes." },
];

const STAGES = [
  { icon: "💵", title: "Prevailing Wage Determination", body: "DOL sets the minimum wage for the role (OEWS or non-OEWS source). Must finish before PERM filing." },
  { icon: "📣", title: "Recruitment", body: "Employer runs required job ads to test the U.S. labor market, then observes a 30-day quiet period." },
  { icon: "📨", title: "PERM filing", body: "Employer files ETA-9089. The receipt date becomes your priority date." },
  { icon: "🔎", title: "DOL analyst review", body: "An analyst certifies, denies, or audits. This is the main PERM processing-time queue." },
  { icon: "📋", title: "Audit review (if selected)", body: "Audited cases move to a separate, slower queue while DOL reviews the full recruitment file." },
  { icon: "📄", title: "I-140", body: "After PERM approval, the employer files I-140. Premium processing is available for most categories." },
  { icon: "📅", title: "Visa Bulletin / I-485", body: "You file I-485 once your priority date is current. For India, this is often a multi-year wait." },
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
        hook="Estimate your PWD, recruitment, PERM approval, I-140, priority date, and H-1B max-out risk timeline in one place."
        accent="from-blue-700 to-indigo-600"
        headerExtra={
          <a href="#calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
            Calculate My PERM Timeline →
          </a>
        }
        disclaimerExtra={
          <p>
            This calculator is for educational planning only and is not legal advice. Always confirm your case with your employer&rsquo;s immigration attorney.
          </p>
        }
      >
        {/* calculator */}
        <section className="pb-12 pt-6 sm:pb-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <PermTimelineCalculator />
            </div>
          </Container>
        </section>

        {/* What is PERM */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">What is PERM?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                PERM is the labor certification process many employers must complete before filing an employment-based green card case — most commonly for EB-2 and EB-3. It generally involves a prevailing wage determination (PWD), a required recruitment campaign to test the U.S. labor market, filing the PERM application (ETA-9089) with the Department of Labor, DOL review, and — once approved — the Form I-140 immigrant petition. Only after I-140 approval and a current priority date can most Indian applicants file I-485 to adjust status.
              </p>
            </div>
          </Container>
        </section>

        {/* Timeline stages */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">PERM timeline stages</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {STAGES.map((s, i) => (
                  <div key={s.title} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-lg">{s.icon}</span>
                      <p className="text-sm font-bold text-ink-900">{i + 1}. {s.title}</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Current DOL times */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermDolTimesPanel variant="full" />
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

        {/* Author + updated */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={CLUSTER_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
