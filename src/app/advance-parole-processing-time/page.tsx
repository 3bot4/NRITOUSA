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
  eadClusterLinks,
  eadRelatedLinks,
  eadArticleJsonLd,
  EAD_PUBLISHED,
  EAD_UPDATED,
  EAD_UPDATED_HUMAN,
} from "@/lib/eadCluster";
import { eadProcessingData as D, EAD_DATA_NOTE } from "@/data/eadProcessingData";

const PATH = "/advance-parole-processing-time";
const TITLE = "Advance Parole Processing Time 2026: I-131 Travel Document";
const DESC =
  "How long Advance Parole (Form I-131) takes, the travel rules while it is pending, and how it pairs with your EAD.";

export const metadata: Metadata = pageMetadata({
  title: "Advance Parole Processing Time 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "How long does Advance Parole take?", answer: "Advance Parole (Form I-131) commonly takes several months and varies by service center. Check the current USCIS processing times for I-131, and plan travel well in advance since there is generally no premium processing for Advance Parole." },
  { question: "Can I travel while my Advance Parole is pending?", answer: "For adjustment-of-status (I-485) applicants, leaving the U.S. while an Advance Parole application is pending can be treated as abandoning it — a serious risk. Do not travel on a pending Advance Parole without checking with your immigration attorney first." },
  { question: "What is Advance Parole used for?", answer: "Advance Parole lets certain applicants — often those with a pending I-485 — travel abroad and return without abandoning their application. It is a travel document, not a visa or work permit." },
  { question: "Is Advance Parole the same as an EAD?", answer: "No. An EAD (Form I-765) authorizes work; Advance Parole (Form I-131) authorizes travel. Adjustment applicants often file them together and may receive a combined EAD/Advance Parole 'combo card.'" },
  { question: "Can Advance Parole be premium processed?", answer: "Generally no — USCIS does not offer premium processing for standard Advance Parole. Plan your travel timeline around standard processing and expedite only in genuine emergencies per USCIS criteria." },
  { question: "Do H-1B or L-1 holders need Advance Parole to travel?", answer: "If you hold valid H-1B or L-1 status, you can usually travel on your visa without Advance Parole, even with a pending I-485 — one advantage of 'dual intent' visas. Confirm your specific situation with your attorney before traveling." },
  { question: "What happens if I travel without Advance Parole?", answer: "If you are relying on a pending I-485 and travel without a valid Advance Parole (and without a dual-intent visa like H-1B/L-1), USCIS may consider your I-485 abandoned. Always confirm your travel plan with your attorney." },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. Travel decisions while applications are pending are high-stakes and case-specific — confirm with your immigration attorney before any international trip." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    eadArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: EAD_PUBLISHED, dateModified: EAD_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Advance Parole Processing Time", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="advance-parole-processing-time"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Advance Parole Processing Time" },
        ]}
        icon="✈️"
        category="Visa & Green Card"
        title="Advance Parole Processing Time"
        hook="How long Form I-131 takes, the travel rules while it is pending, and how it pairs with your EAD."
        accent="from-sky-500 to-blue-600"
        badges={["Form I-131", "Travel document", "For I-485 filers"]}
        headerExtra={
          <Link href="/ead-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
            EAD processing time →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Planning range</p>
                  <p className="mt-1 text-2xl font-extrabold text-ink-900">~{D.advanceParoleMonthsLow}–{D.advanceParoleMonthsHigh} months</p>
                  <p className="mt-1 text-xs text-ink-500">Form I-131 · varies by service center · no premium processing</p>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Travel warning</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">Do not leave the U.S. while an Advance Parole tied to a pending I-485 is still pending — it can be treated as abandoned. Confirm with your attorney first.</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">What Advance Parole is</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Advance Parole (Form I-131) is a travel document that lets certain applicants — usually those with a pending I-485 — leave the U.S. and return without abandoning their green card application. It is not a visa and not a work permit. Adjustment applicants often file it together with the EAD and may get a combined <strong>EAD/Advance Parole combo card</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="text-base font-bold text-ink-900">H-1B / L-1 holders: you may not need it</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Because H-1B and L-1 are dual-intent visas, you can usually travel on your valid visa even with a pending I-485 — without using Advance Parole. This preserves your H-1B/L-1 status. Always confirm your specific travel plan with your attorney before leaving.
                </p>
              </div>

              <p className="text-xs text-ink-500">{EAD_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related EAD & travel tools" links={[...eadClusterLinks.filter((l) => l.href !== PATH), ...eadRelatedLinks]} />
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
            <AuthorReviewLine lastUpdated={EAD_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
