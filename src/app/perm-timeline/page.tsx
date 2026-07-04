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
  clusterLinks,
  relatedImmigrationLinks,
  clusterArticleJsonLd,
  CLUSTER_PUBLISHED,
  CLUSTER_UPDATED,
  CLUSTER_UPDATED_HUMAN,
} from "@/lib/permCluster";

const PATH = "/perm-timeline";
const TITLE = "PERM Timeline 2026: Step-by-Step Green Card Process After H-1B";
const DESC =
  "Understand the full PERM green card timeline from PWD and recruitment to I-140 and Visa Bulletin.";

export const metadata: Metadata = pageMetadata({
  title: "PERM Timeline 2026: PWD to I-140",
  description: DESC,
  path: PATH,
});

const STAGES = [
  { n: 1, title: "Employer starts the green card process", body: "Your employer decides to sponsor you and chooses the category (usually EB-2 or EB-3). Nothing is filed with the government yet, but this is when the clock on your green card really starts." },
  { n: 2, title: "PWD — prevailing wage determination", body: "DOL sets the minimum wage for your role. Nothing else can proceed until this is issued. This is the first official queue you'll watch on the DOL FLAG dashboard." },
  { n: 3, title: "Recruitment", body: "Your employer runs required job ads to test the U.S. labor market, offering at least the prevailing wage, then observes a mandatory 30-day quiet period before filing PERM." },
  { n: 4, title: "PERM filing", body: "The employer files ETA-9089 with DOL. The receipt date becomes your priority date — your permanent place in the green card line." },
  { n: 5, title: "DOL review", body: "A DOL analyst reviews the case and either certifies it, denies it, or issues an audit. Audited cases move to a slower queue. PERM cannot be premium processed." },
  { n: 6, title: "PERM approval", body: "Once certified, the PERM is valid for 180 days — the employer must file I-140 within that window." },
  { n: 7, title: "I-140 immigrant petition", body: "The employer files Form I-140. Premium processing is available for most EB-2/EB-3 petitions (~15 business days) and EB-1C/EB-2 NIW (~45 business days)." },
  { n: 8, title: "Visa Bulletin and I-485", body: "You file I-485 to adjust status once your priority date is current in the Visa Bulletin. For India EB-2/EB-3 this is often a multi-year wait after I-140 approval." },
];

const faq: FaqItem[] = [
  { question: "What is the full PERM timeline?", answer: "The PERM timeline runs: employer decision → prevailing wage determination (PWD) → recruitment → PERM filing → DOL review → PERM approval → I-140 → Visa Bulletin/I-485. Each stage has its own processing time, and DOL publishes the PWD and PERM queues monthly." },
  { question: "How long does the PERM process take from start to finish?", answer: "The PERM stage alone (PWD through certification) commonly spans well over a year, and audits add more time. After that comes I-140, and then — for India — a long Visa Bulletin wait before I-485. Use our calculator with your own dates for a personalized estimate." },
  { question: "Is PWD part of PERM?", answer: "PWD is the first step of the PERM process, but it is a separate DOL determination with its own queue. PERM cannot be filed until the PWD is issued, so people often treat them as one timeline." },
  { question: "How long is recruitment for PERM?", answer: "Recruitment must span the required advertising period and include a mandatory 30-day quiet period before PERM can be filed. Safe planning is roughly 60–90 days end to end, though the exact rules depend on the type of position." },
  { question: "What happens after PERM approval?", answer: "After PERM is certified, the employer files Form I-140 within the 180-day PERM validity window. Once I-140 is approved, you wait for your priority date to become current in the Visa Bulletin before filing I-485." },
  { question: "How long does I-140 take after PERM?", answer: "With premium processing, USCIS decides most I-140 petitions in about 15 business days (about 45 business days for EB-1C and EB-2 NIW). Without premium processing, standard times run several months and vary by service center." },
  { question: "Can I file I-485 immediately after I-140?", answer: "Only if your priority date is current in the Visa Bulletin. For India EB-2 and EB-3, priority dates are usually backlogged, so most applicants wait years after I-140 approval before I-485 can be filed." },
  { question: "Why does the Visa Bulletin matter for Indian applicants?", answer: "Because India is heavily oversubscribed, an approved I-140 does not mean you can file I-485 right away. The monthly Visa Bulletin cutoff for India EB-2/EB-3 determines when a visa number is available — often many years after your priority date." },
  { question: "Does EB-2 move faster than EB-3?", answer: "It depends on the month. For India, EB-2 and EB-3 cutoffs move independently and sometimes EB-3 is more current than EB-2 (or vice versa). Some applicants with two approved I-140s use an EB-3 downgrade strategy — discuss it with your attorney." },
  { question: "Can I change employers during PERM?", answer: "Changing employers before I-140 approval usually means restarting PERM with the new employer (new PWD, recruitment, filing) and a new priority date — though you may be able to keep your old priority date if you had an approved I-140. This is very case-specific; confirm with your attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "PERM Timeline", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="perm-timeline"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "PERM Timeline" },
        ]}
        icon="🗺️"
        category="Visa & Green Card"
        title="PERM Timeline 2026"
        hook="The full step-by-step green card process after H-1B — from prevailing wage and recruitment to I-140 and the Visa Bulletin."
        accent="from-indigo-600 to-violet-600"
        badges={["Step by step", "For Indian applicants", "EB-2 / EB-3"]}
        headerExtra={
          <Link href="/perm-processing-time-calculator" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
            Estimate your timeline →
          </Link>
        }
      >
        {/* Overview + stages */}
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Full timeline overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                For most Indian professionals on H-1B, the employment green card runs through PERM. Here is every stage in order, with what happens and what governs the wait. Times for the DOL stages (PWD and PERM) change monthly — check the{" "}
                <Link href="/dol-processing-times" className="text-brand-600 underline">current DOL processing times</Link>.
              </p>

              <ol className="mt-6 space-y-3">
                {STAGES.map((s) => (
                  <li key={s.n} className="flex gap-4 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">{s.n}</span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{s.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* India special section */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
              <h2 className="text-lg font-bold text-ink-900">Why Indian EB-2/EB-3 applicants must track the Visa Bulletin</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                For most countries, an approved I-140 quickly leads to I-485. For India, it does not. Because India is heavily oversubscribed, priority dates are backlogged by many years — so even after your PERM and I-140 are approved, you wait for the monthly Visa Bulletin cutoff to reach your priority date before you can file I-485. That is why Indian applicants track the bulletin so closely: it, not the DOL queue, controls the final and longest part of the wait.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/eb2-eb3-priority-date-india" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-50">EB2/EB3 India priority date tracker →</Link>
                <Link href="/tools/priority-date-checker" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-900/10 transition hover:bg-ink-50">Priority date checker →</Link>
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
