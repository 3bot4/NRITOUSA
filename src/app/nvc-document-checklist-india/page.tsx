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
  nvcClusterLinks,
  nvcRelatedLinks,
  nvcArticleJsonLd,
  NVC_PUBLISHED,
  NVC_UPDATED,
  NVC_UPDATED_HUMAN,
} from "@/lib/nvcCluster";
import { nvcLinks, NVC_DATA_NOTE, nvcFeeRows, nvcFees as F } from "@/data/nvcData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

const PATH = "/nvc-document-checklist-india";
const TITLE = "NVC Document Checklist for Indian Immigrant Visa Applicants";
const DESC =
  "The NVC document checklist for Indian applicants — civil documents (birth, marriage, police clearance, passport), the Affidavit of Support, and financial evidence to upload in CEAC.";

export const metadata: Metadata = pageMetadata({
  title: "NVC Document Checklist (India)",
  description: DESC,
  path: PATH,
});

const CHECKLIST: { title: string; items: string[] }[] = [
  {
    title: "Applicant civil documents (each applicant)",
    items: [
      "Birth certificate (from the municipal authority; with a non-availability certificate + affidavit only if a birth certificate genuinely cannot be issued)",
      "Passport biographic page (valid passport for each applicant)",
      "Marriage certificate (for spouses), from the registrar",
      "Divorce decree or spouse's death certificate, if previously married",
      "Police Clearance Certificate (PCC) per the rules for India and any country where you lived",
      "Court and prison records, if you have any arrest or conviction history",
      "Certified English translations for any document not in English",
    ],
  },
  {
    title: "Petitioner / sponsor financial documents",
    items: [
      "Affidavit of Support (Form I-864) completed by the petitioner",
      "Most recent U.S. federal tax return (or IRS transcript) for the sponsor",
      "W-2s / 1099s and recent pay evidence",
      "Joint sponsor's I-864 and financials, if the petitioner's income is insufficient",
      "Proof of the sponsor's U.S. domicile and status (citizen/LPR)",
    ],
  },
  {
    title: "Case & NVC items",
    items: [
      "NVC case number and invoice ID (to log in to CEAC)",
      "Proof of paid NVC fees (Affidavit of Support fee + IV application fee)",
      "DS-260 confirmation page for each applicant",
      "Two recent passport-style photos per applicant (per current specs)",
    ],
  },
];

const faq: FaqItem[] = [
  { question: "What documents are needed for NVC from India?", answer: "For Indian applicants, NVC generally needs, for each applicant: a birth certificate, valid passport, marriage certificate (for spouses), a Police Clearance Certificate, and certified English translations where needed. The petitioner supplies the Affidavit of Support (I-864) with tax returns and income evidence. You also complete the DS-260 and pay NVC fees. Always confirm the exact list for your case in CEAC and on the Department of State document finder." },
  { question: "Do Indian applicants need a police clearance certificate?", answer: "Yes, in most cases. Immigrant visa applicants typically need a Police Clearance Certificate (PCC) from India — and from any other country where they lived for the required period — following the Department of State's reciprocity rules for India. Obtain the PCC from the passport office/authority as instructed and upload it to CEAC. Verify the current requirement on the official country document finder." },
  { question: "What financial documents does the petitioner need?", answer: "The petitioner completes the Affidavit of Support (Form I-864) and provides the most recent federal tax return or IRS transcript, W-2s/1099s, and recent income evidence. If their income does not meet the required threshold, a joint sponsor can file a separate I-864 with their own financials. The sponsor also shows U.S. domicile and citizen/LPR status." },
  { question: "What happens if NVC rejects a document?", answer: "If a document is unclear, incomplete, or wrong, NVC lists the problem in CEAC and asks you to resubmit. This does not end your case, but it restarts the review for that item, adding time. Read the CEAC message carefully, fix exactly what was flagged, and resubmit clear, complete copies. Do not upload unrelated duplicates." },
  { question: "Do I need to upload civil documents in CEAC?", answer: "Yes. For NVC processing, you upload scanned civil documents (birth, marriage, police certificates, passport, etc.) and the Affidavit of Support with financials directly in the CEAC immigrant visa portal. Keep the originals safe — you must bring them to the consular interview for the officer to inspect." },
  { question: "Should I bring original documents to the interview?", answer: "Yes. Even though you upload scans to CEAC, you must bring the original civil documents (and certified translations) to your consular interview, along with your appointment letter, passports, photos, and medical exam results. Follow your specific embassy or consulate's interview instructions for the exact list." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    nvcArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: NVC_PUBLISHED, dateModified: NVC_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "NVC Document Checklist (India)", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="nvc-document-checklist-india"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "NVC Document Checklist (India)" },
        ]}
        icon="📄"
        category="Visa & Green Card"
        title="NVC Document Checklist (India)"
        hook="Everything Indian immigrant-visa applicants typically upload to CEAC during NVC processing — civil documents, the Affidavit of Support, and financial evidence — in one scannable checklist."
        accent="from-emerald-600 to-teal-600"
        badges={["For Indian applicants", "Civil + financial docs", "CEAC upload"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <Link href="/nvc-case-status" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
              Find my NVC stage →
            </Link>
            <a href={nvcLinks.documentFinder} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
              Country document finder ↗
            </a>
          </div>
        }
        sourceNote={<>Last updated: {NVC_UPDATED_HUMAN}. {NVC_DATA_NOTE}</>}
        disclaimerExtra={<p>This is an educational tool and not legal advice. Document requirements vary by case and country. Always verify with official USCIS, Department of State, CEAC, and embassy/consulate instructions.</p>}
      >
        {/* Fast Answer: NVC fees */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="NVC fees & timing"
              accent="sky"
              rows={nvcFeeRows}
              badges={["AOS $120", "IV $325 / $345"]}
              lastVerified={F.lastVerified}
              sources={[{ label: "NVC Fees", href: nvcLinks.fees }, { label: "NVC Timeframes", href: nvcLinks.nvcTimeframes }, { label: "CEAC", href: nvcLinks.ceac }]}
              disclaimer={NVC_DATA_NOTE}
            />
          </Container>
        </section>

        {/* Quick answer */}
        <section className="pt-10">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick answer</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                For NVC, each Indian applicant typically uploads a <strong>birth certificate, passport, marriage certificate (if applicable), and Police Clearance Certificate</strong>, plus certified English translations where needed. The petitioner uploads the <strong>Affidavit of Support (I-864)</strong> with tax returns and income evidence. You also submit the <strong>DS-260</strong> and pay NVC fees. Requirements vary by case — always confirm the exact list in CEAC.
              </p>
            </div>
          </Container>
        </section>

        {/* Checklist */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5">
              <div>
                <h2 className="text-xl font-bold text-ink-900">The NVC document checklist</h2>
                <p className="mt-1.5 text-sm text-ink-500">Upload clear, complete scans to CEAC. Keep every original for the consular interview.</p>
              </div>
              {CHECKLIST.map((group) => (
                <div key={group.title} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                  <h3 className="text-base font-bold text-ink-900">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <span aria-hidden className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded border border-emerald-300 text-[10px] text-emerald-600">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs leading-relaxed text-ink-700">
                <span className="font-bold text-ink-900">Verify for your case:</span> exact requirements depend on your visa category and where you have lived. Check the Department of State{" "}
                <a href={nvcLinks.documentFinder} target="_blank" rel="noopener noreferrer" className="font-semibold underline">country-specific document finder for India</a> and the items CEAC lists for your case.
              </div>
            </div>
          </Container>
        </section>

        {/* SEO content */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-ink-700">
              <div>
                <h2 className="text-xl font-bold text-ink-900">How the document stage works at NVC</h2>
                <p className="mt-2">
                  After you pay fees and complete the DS-260, the document stage is where most Indian families spend the most effort. You gather civil documents for each applicant, the petitioner prepares the Affidavit of Support with financial evidence, and everything is uploaded to CEAC. NVC then reviews the package. If it is complete, the case becomes{" "}
                  <Link href="/nvc-case-status#stage-documentarily-qualified" className="text-brand-600 underline">documentarily qualified</Link>; if something is missing or unclear, NVC lists it in CEAC for you to fix.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Civil documents from India — the details that trip people up</h2>
                <ul className="mt-2 space-y-1.5">
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> <span><strong>Birth certificate:</strong> issued by the municipal authority. If one genuinely cannot be obtained, follow the Department of State's reciprocity guidance for a non-availability certificate plus secondary evidence — do not skip it silently.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> <span><strong>Police Clearance Certificate:</strong> usually required from India and any other country where you lived for the qualifying period. Obtain it as the reciprocity rules specify.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> <span><strong>Marriage / divorce records:</strong> registrar-issued marriage certificate; divorce decrees or a spouse's death certificate if you were previously married.</span></li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> <span><strong>Translations:</strong> anything not in English needs a certified English translation.</span></li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Financial documents from the petitioner</h2>
                <p className="mt-2">
                  The petitioner completes Form I-864, Affidavit of Support, showing they can financially support the immigrant. This includes the most recent federal tax return (or IRS transcript), W-2s/1099s, and current income evidence. If the petitioner's income falls short of the required guideline for their household size, a <strong>joint sponsor</strong> can file a separate I-864 with their own financials. The petitioner also demonstrates U.S. domicile and their citizen or permanent-resident status.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Avoiding the most common delays</h2>
                <p className="mt-2">
                  Most NVC delays at this stage are avoidable. Upload <strong>clear, legible scans</strong>; make sure names and dates match across documents; include translations; and answer only what NVC asks when they flag something. Because a rejected document restarts the review for that item, getting it right the first time is the single best way to reach the interview sooner. For how long each stage typically takes, see{" "}
                  <Link href="/nvc-processing-time" className="text-brand-600 underline">NVC processing time</Link>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Keep your originals for the interview</h2>
                <p className="mt-2">
                  Uploading scans to CEAC does not replace the originals. You must bring the original civil documents and certified translations to your consular interview in India, along with your appointment letter, valid passports, photos, and medical exam results. Follow your specific embassy or consulate's interview instructions for the exact documents to carry.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              <Link href="/nvc-case-status" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">Not sure where you are?</p>
                <p className="mt-1 text-xs text-ink-600">Use the NVC Timeline Checker →</p>
              </Link>
              <Link href="/nvc-public-inquiry" className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm shadow-card transition hover:shadow-sm">
                <p className="font-bold text-ink-900">A document was rejected and stuck?</p>
                <p className="mt-1 text-xs text-ink-600">Review when to submit an NVC Public Inquiry →</p>
              </Link>
            </div>
          </Container>
        </section>

        {/* Internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="More NVC & green card guides" links={[...nvcClusterLinks.filter((l) => l.href !== PATH), ...nvcRelatedLinks]} />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        {/* Author */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={NVC_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
