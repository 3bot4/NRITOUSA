import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { formatDate } from "@/lib/format";
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
import {
  i485Checklist,
  i693Rules as MED,
  i485ProcessingData as D,
  I485_DATA_NOTE,
  i485StageEstimateRows,
  i485EstimateSourceLinks,
  I485_ESTIMATE_VERIFIED,
  I485_ESTIMATE_DISCLAIMER,
} from "@/data/i485ProcessingData";
import EstimatedTimelineTable from "@/components/EstimatedTimelineTable";

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
  { question: "Do I need a medical exam (I-693) to file I-485?", answer: "Yes — and it now has to go in the same envelope. Since December 2, 2024, USCIS requires Form I-693 to be submitted with Form I-485; filing without it risks the I-485 being rejected rather than USCIS asking for it later. Book the civil-surgeon appointment before you plan to file, not after." },
  { question: "Does the I-693 medical exam expire?", answer: "Not on a fixed clock any more. An I-693 signed by a civil surgeon on or after November 1, 2023 does not carry an expiry date — but under a June 11, 2025 policy update it is only valid for the application it was filed with. If that I-485 is withdrawn or denied, a later I-485 needs a newly completed I-693. Practical read: get the exam once, for the filing you are actually making." },
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
        {/* Fast Answer: I-485 timeline snapshot before the checklist */}
        <section className="pt-6">
          <Container>
            <EstimatedTimelineTable
              title="I-485 timeline snapshot (what to expect after filing)"
              intro="Prepare a complete package to avoid RFEs. Here is the general timeline once your I-485 is on file — planning ranges only, verify with USCIS."
              rows={i485StageEstimateRows}
              lastUpdated={I485_ESTIMATE_VERIFIED}
              sourceLinks={i485EstimateSourceLinks}
              disclaimer={I485_ESTIMATE_DISCLAIMER}
              ctaText="See detailed I-485 processing time"
              ctaHref="/i485-processing-time"
            />
          </Container>
        </section>

        <section className="pb-10 pt-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
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
              {/* ── the medical exam, which is now a pre-filing task ─── */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <h2 className="text-lg font-bold text-ink-900">
                  The medical exam is a pre-filing task now, not a later one
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  This is the item on the list most likely to be wrong in older advice.
                  For years you could file the I-485 and send Form I-693 when USCIS asked
                  for it. Since <strong>{formatDate(MED.mustFileWithI485Since)}</strong>,
                  USCIS requires the I-693 to be submitted <strong>with</strong> the
                  I-485 — file without it and the application may be rejected rather than
                  held for evidence. Because a civil-surgeon appointment plus the lab work
                  and the sealed envelope takes weeks, this has to be booked before your
                  filing date, not after it.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Who can do it</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">
                      Only a <strong>USCIS-designated civil surgeon</strong> — not your own
                      doctor, however well they know you. USCIS keeps a locator for finding
                      one near you.
                    </p>
                  </div>
                  <div className="rounded-xl border border-ink-900/10 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Does it expire?</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">
                      An I-693 signed on or after{" "}
                      {formatDate(MED.noExpiryIfSignedOnOrAfter)} has no expiry
                      date — but since {formatDate(MED.tiedToApplicationSince)} it is valid
                      only for the application it was filed with. A withdrawn or denied
                      I-485 means a fresh exam for the next one.
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-ink-600">
                  <li>
                    → Take your <strong>vaccination records</strong> to the appointment.
                    Missing records are the usual reason a completed exam still comes back
                    incomplete, and repeating vaccines costs another visit.
                  </li>
                  <li>
                    → The civil surgeon seals the envelope. <strong>Do not open it</strong>{" "}
                    — a broken seal invalidates it and you pay for the exam twice.
                  </li>
                  <li>
                    → The fee is the civil surgeon&rsquo;s own charge and is not a USCIS
                    fee, so it varies by clinic and is worth ringing around for.
                  </li>
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                  Rules verified {formatDate(MED.verified)}. Sources:{" "}
                  <a href={MED.requirementAlertUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    USCIS alert — I-693 required with I-485
                  </a>{" "}
                  ·{" "}
                  <a href={MED.validityAlertUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    USCIS alert — I-693 validity period
                  </a>{" "}
                  ·{" "}
                  <a href={MED.civilSurgeonLocatorUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    Find a civil surgeon
                  </a>
                </p>
              </div>

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
            <PermClusterLinks
              title="Related green card tools"
              links={[
                {
                  href: "/green-card/marriage-interview-questions",
                  label: "Marriage interview questions",
                  desc: "Example questions across the five areas officers probe, and a couple practice mode that shows only where your answers differ",
                },
                ...i485ClusterLinks.filter((l) => l.href !== PATH),
                ...i485RelatedLinks,
              ]}
            />
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
