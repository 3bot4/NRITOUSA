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
import { i485Checklist, i485ProcessingData as D, I485_DATA_NOTE } from "@/data/i485ProcessingData";

const PATH = "/i485-documents-checklist";
const TITLE = "I-485 Documents Checklist 2026: What to Gather Before Filing";
const DESC =
  "A complete I-485 documents checklist — forms, proof of eligibility, identity, and supporting evidence to gather before you file.";

export const metadata: Metadata = pageMetadata({
  title: "I-485 Documents Checklist 2026",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What documents do I need for I-485?", answer: "At a high level: Form I-485 and fee, the I-693 medical exam, proof of an approved/pending I-140 and a current priority date, two photos, birth certificate (translated), passport and visa stamps, I-94 and I-797 notices, and evidence of continuous lawful status. Family members need their own identity and relationship documents." },
  { question: "Do I need a medical exam (I-693) to file I-485?", answer: "Yes, the I-693 medical exam (completed by a USCIS-designated civil surgeon and submitted sealed) is generally required. Timing rules for when it must be submitted can change, so confirm current guidance with your attorney." },
  { question: "Should I file EAD and Advance Parole with I-485?", answer: "Most applicants file Form I-765 (EAD) and Form I-131 (Advance Parole) concurrently with I-485 so they can work and travel while it is pending. H-1B/L-1 holders may rely on their visa instead." },
  { question: "Do I need to prove my priority date is current?", answer: "You can only file when your priority date is current under the chart USCIS honors that month. Keep your I-140 approval notice and confirm the current Visa Bulletin chart before filing." },
  { question: "What if a document is not in English?", answer: "Provide a full, certified English translation for any document not in English (for example, a birth or marriage certificate). The translator certifies competence and accuracy." },
  { question: "What if I don't have a birth certificate?", answer: "If a birth certificate is unavailable, USCIS accepts secondary evidence (such as school or religious records) plus, in some cases, a non-availability certificate. Discuss the right secondary evidence with your attorney." },
  { question: "Do I need documents for my spouse and children?", answer: "Yes. Each dependent files their own I-485 with their own identity documents, photos, medical exam, and proof of the qualifying relationship (marriage/birth certificates)." },
  { question: "Is this checklist legal advice?", answer: "No. This checklist is educational only and not legal advice. The official USCIS Form I-485 instructions govern — confirm your exact document list with your immigration attorney." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    i485ArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: I485_PUBLISHED, dateModified: I485_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "I-485 Documents Checklist", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="i485-documents-checklist"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "I-485 Documents Checklist" },
        ]}
        icon="🗂️"
        category="Visa & Green Card"
        title="I-485 Documents Checklist"
        hook="Everything to gather before you file — forms, proof of eligibility, identity, and supporting evidence."
        accent="from-emerald-500 to-green-600"
        badges={["Before you file", "Adjustment of status", "Educational"]}
        headerExtra={
          <Link href="/i485-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
            Can I file yet? →
          </Link>
        }
      >
        <section className="pb-10 pt-6 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5">
              <p className="text-sm leading-relaxed text-ink-600">
                Use this as a preparation checklist, not a substitute for the official USCIS Form I-485 instructions. Gather these before filing so your package is complete — a complete package reduces avoidable RFEs and delays.
              </p>
              {i485Checklist.map((group) => (
                <div key={group.title} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h2 className="text-base font-bold text-ink-900">{group.title}</h2>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                        <span className="mt-0.5 flex-none text-emerald-500">☐</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm leading-relaxed text-amber-900">
                <strong>Follow the official instructions.</strong> Fees, the medical-exam timing rule, and required evidence change. Verify everything against the{" "}
                <a href={D.i485FormUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">official USCIS Form I-485 page</a>{" "}
                and confirm your list with your immigration attorney. {I485_DATA_NOTE}
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
