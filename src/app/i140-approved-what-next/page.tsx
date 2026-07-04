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
  i140ClusterLinks,
  i140RelatedLinks,
  i140ArticleJsonLd,
  I140_PUBLISHED,
  I140_UPDATED,
  I140_UPDATED_HUMAN,
} from "@/lib/i140Cluster";

const PATH = "/i140-approved-what-next";
const TITLE = "I-140 Approved — What Next? (2026 Guide for Indians)";
const DESC =
  "Your I-140 is approved — what now? Priority date, when you can file I-485, H-1B extensions, and job changes explained.";

export const metadata: Metadata = pageMetadata({
  title: "I-140 Approved — What Next?",
  description: DESC,
  path: PATH,
});

const STEPS = [
  { icon: "📌", title: "Your priority date is locked in", body: "I-140 approval fixes your priority date (your PERM filing date). This is your permanent place in the green card line — keep the approval notice safe." },
  { icon: "📅", title: "Watch the Visa Bulletin", body: "You can file I-485 only when your priority date is current under the chart USCIS honors that month. For India EB-2/EB-3 this is usually a multi-year wait." },
  { icon: "🛡️", title: "H-1B extensions beyond 6 years", body: "An approved I-140 pending 180+ days generally supports 3-year H-1B extensions when your priority date is not current (AC21). It is what keeps H-1B renewable while you wait." },
  { icon: "🔄", title: "Changing jobs", body: "After I-140 approval you can often keep your priority date even if you switch employers. Don't let the old employer withdraw the I-140 after 180 days — it protects your date and extensions." },
  { icon: "📥", title: "File I-485 when current", body: "When your date is current, you (and dependents) file I-485 to adjust status, and can apply for EAD and Advance Parole. Confirm the timing with your attorney." },
];

const faq: FaqItem[] = [
  { question: "My I-140 is approved — can I file I-485 now?", answer: "Only if your priority date is current in the Visa Bulletin under the chart USCIS is honoring that month. For India EB-2/EB-3, approval usually leads to a multi-year wait before I-485 can be filed." },
  { question: "What is my priority date after I-140 approval?", answer: "It is the date DOL received your PERM — now locked in by the I-140 approval. It marks your place in line; when the Visa Bulletin cutoff reaches it, a visa number becomes available." },
  { question: "How does an approved I-140 help my H-1B?", answer: "An I-140 approved (and pending 180+ days) generally supports 3-year H-1B extensions beyond the six-year limit when your priority date is not current, under AC21. This is a major benefit for backlogged Indian applicants." },
  { question: "Can I change employers after I-140 approval?", answer: "Often yes. Once the I-140 has been approved for 180+ days, you can generally keep your priority date and H-1B extension eligibility even if you move to a new employer, subject to AC21 portability rules. Confirm with your attorney." },
  { question: "What if my employer withdraws my I-140?", answer: "If the I-140 was approved 180+ days ago, a withdrawal generally does not strip your priority date or your ability to get H-1B extensions — but timing and specifics matter. If it was withdrawn earlier, consequences differ. Talk to your attorney immediately." },
  { question: "Does I-140 approval expire?", answer: "An approved I-140 generally remains valid to retain your priority date, but it can be affected by employer withdrawal within 180 days or fraud/revocation. Keep your approval notice and consult your attorney before any job change." },
  { question: "Can I use my priority date for a new PERM/I-140?", answer: "Yes — priority date retention lets you carry your earlier priority date to a new EB-2 or EB-3 I-140 (for example, an EB-3 downgrade or EB-2 upgrade). Your attorney handles the interfiling or new filing." },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. AC21 portability, priority date retention, and I-485 timing are case-specific. Confirm your situation with your employer's immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i140ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I140_PUBLISHED, dateModified: I140_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-140 Approved — What Next", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i140-approved-what-next"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-140 Approved — What Next" },
        ]}
        icon="✅"
        category="Visa & Green Card"
        title="I-140 Approved — What Next?"
        hook="Priority date, when you can file I-485, H-1B extensions, and job changes — what an approved I-140 really means for Indians."
        accent="from-emerald-600 to-teal-600"
        badges={["Priority date", "I-485", "H-1B AC21"]}
        headerExtra={
          <Link href="/eb2-eb3-priority-date-india" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
            When can I file I-485? →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <p className="text-sm leading-relaxed text-ink-600">
                Getting your I-140 approved is a big milestone — but for Indian applicants it is the start of the longest wait, not the finish line. Here is exactly what it unlocks and what you do next.
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

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-sm leading-relaxed text-amber-900">
                <strong className="font-bold">Before any job change:</strong> talk to an immigration attorney about AC21 portability, priority date retention, and keeping your I-140 intact — the 180-day rule and your specific facts matter a lot. This page is educational only and not legal advice.
              </div>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related I-140 & green card tools" links={[...i140ClusterLinks.filter((l) => l.href !== PATH), ...i140RelatedLinks]} />
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
            <AuthorReviewLine lastUpdated={I140_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
