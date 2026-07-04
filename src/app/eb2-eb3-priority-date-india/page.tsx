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

const PATH = "/eb2-eb3-priority-date-india";
const TITLE = "EB2 and EB3 Priority Date India Tracker";
const DESC =
  "Understand where your EB-2 or EB-3 India priority date stands, Final Action vs Dates for Filing, and when you can file I-485.";
const VISA_BULLETIN_URL =
  "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";

export const metadata: Metadata = pageMetadata({
  title: "EB2 EB3 Priority Date India Tracker",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is a priority date?", answer: "Your priority date is your place in the green card line — for PERM cases, it is the date DOL received your PERM filing. When the monthly Visa Bulletin cutoff for your category and country reaches your priority date, a visa number becomes available to you." },
  { question: "What is the difference between EB-2 India and EB-3 India?", answer: "EB-2 is for advanced-degree or exceptional-ability roles; EB-3 is for skilled workers and professionals. For India, both are heavily backlogged, and their cutoff dates move independently in the Visa Bulletin — sometimes EB-3 is ahead of EB-2, sometimes behind." },
  { question: "What is the difference between Final Action Date and Date for Filing?", answer: "The Final Action Date (Table A) is when USCIS can actually approve your green card. The Date for Filing (Table B) is an earlier cutoff that, when USCIS authorizes it, lets you file I-485 early to get an EAD and Advance Parole while you wait for the Final Action Date." },
  { question: "Why does the PERM filing date matter?", answer: "Because for PERM cases the PERM filing date is your priority date. The earlier your PERM is filed, the earlier your place in line — which is why starting the PERM process sooner directly improves your green card timing." },
  { question: "Can I file I-485 with an India EB-2 or EB-3 priority date?", answer: "Only when your priority date is current under the chart USCIS is honoring that month (Final Action Date, or Date for Filing if authorized). For India, this usually means waiting years after I-140 approval. Check the current bulletin and confirm with your attorney." },
  { question: "Can I move between EB-2 and EB-3?", answer: "Some applicants with an approved I-140 pursue an 'EB-3 downgrade' (or upgrade) to take advantage of whichever category is more current. This keeps your original priority date. It is very case-specific — discuss with your immigration attorney." },
  { question: "How often does the Visa Bulletin update?", answer: "The State Department publishes a new Visa Bulletin monthly, usually around the 8th–15th for the following month. USCIS then announces which chart (Table A or Table B) it will accept for I-485 filing that month." },
  { question: "Where is the official Visa Bulletin?", answer: "The official source is the U.S. Department of State Visa Bulletin at travel.state.gov. Always verify current cutoff dates there and confirm your filing eligibility with your attorney — this page is educational only." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    clusterArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: CLUSTER_PUBLISHED, dateModified: CLUSTER_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "EB2/EB3 India Priority Date", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="eb2-eb3-priority-date-india"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "EB2/EB3 India Priority Date" },
        ]}
        icon="📅"
        category="Visa & Green Card"
        title="EB2 / EB3 India Priority Date"
        hook="Where your India priority date stands, Final Action vs Dates for Filing, and when you can actually file I-485."
        accent="from-blue-700 to-indigo-600"
        badges={["For India applicants", "Visa Bulletin", "EB-2 / EB-3"]}
        headerExtra={
          <Link href="/tools/priority-date-checker" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
            Check your priority date →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ink-900">What is a priority date?</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Your priority date is your position in the green card queue. For employment cases that go through PERM, it is the date DOL received your PERM application. Each month the State Department&rsquo;s Visa Bulletin publishes cutoff dates; when the cutoff for your category (EB-2 or EB-3) and country (India) reaches your priority date, a green card number becomes available.
                </p>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">EB-2 India vs EB-3 India</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  EB-2 (advanced degree / exceptional ability) and EB-3 (skilled worker / professional) each have separate India cutoffs that move independently. Neither is always faster — the gap shifts month to month, which is why some applicants with two approved I-140s watch both and consider a downgrade or upgrade.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">Final Action Date vs Date for Filing</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  <strong>Final Action Date (Table A)</strong> is when USCIS can approve your green card. <strong>Date for Filing (Table B)</strong> is an earlier cutoff that — when USCIS authorizes it — lets you file I-485 early to obtain an EAD and Advance Parole while you keep waiting. Each month USCIS announces which chart it will honor.
                </p>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                <h3 className="text-base font-bold text-ink-900">Why the PERM filing date matters</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  For PERM cases, your PERM filing date <em>is</em> your priority date. Filing PERM earlier locks in an earlier place in line — which, given India&rsquo;s multi-year backlog, can mean years of difference. That is why the DOL PERM and PWD queues at the start of the process matter so much for your final timeline.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">Can I file I-485?</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  You can file I-485 once your priority date is current under the chart USCIS is honoring that month. For India EB-2/EB-3 this usually means a long wait after I-140 approval. Use the{" "}
                  <Link href="/tools/priority-date-checker" className="text-brand-600 underline">priority date checker</Link>{" "}
                  to compare your date to the current bulletin, and always confirm eligibility with your attorney.
                </p>
              </div>

              <div className="rounded-xl border border-ink-900/10 bg-white p-4 text-sm text-ink-600">
                Official source:{" "}
                <a href={VISA_BULLETIN_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline">
                  U.S. Department of State Visa Bulletin
                </a>. Cutoff dates change monthly — always verify there.
              </div>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks links={[...clusterLinks.filter((l) => l.href !== PATH), ...relatedImmigrationLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 sm:py-16">
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
