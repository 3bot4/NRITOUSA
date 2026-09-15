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
import { eadProcessingData as D, EAD_DATA_NOTE, eadSnapshotRows, eadSnapshotSources, EAD_ESTIMATE_VERIFIED, EAD_ESTIMATE_DISCLAIMER } from "@/data/eadProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import { FactTable } from "@/components/education/FactTable";

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
  { question: "Can I get Advance Parole faster in an emergency?", answer: "Yes — there is a separate emergency path that does not run through the normal queue. You call the USCIS Contact Center, describe the emergency, and ask for an emergency advance parole appointment at your local field office. If the field office accepts it, you appear in person with a complete I-131 package and proof of the emergency, and an officer can decide on the spot and issue the travel authorization the same day. It is reserved for genuine emergencies — a death or serious illness in the family, not a wedding or a booked vacation." },
  { question: "What counts as an emergency for Advance Parole?", answer: "USCIS decides expedite and emergency requests case by case under its published expedite criteria, and an emergency or urgent humanitarian situation means a pressing circumstance related to human welfare — illness, disability, the death of a family member, or extreme conditions such as a natural disaster or armed conflict. Pre-planned travel, a sibling's wedding, a graduation, routine business travel or simply wanting to visit family generally do not qualify." },
  { question: "If I hold H-1B, should I travel on my visa or on Advance Parole?", answer: "Practitioners almost always say the visa, if it is valid. Re-entering on Advance Parole admits you as a parolee rather than in H-1B status, and H-1B status is the fallback that keeps you in the country if the I-485 is ever denied. Under a long-standing legacy memorandum an H-1B holder who returns on parole and keeps working for the same H-1B employer can be restored to H-1B status through a later extension or transfer petition — but working on the EAD instead, or changing employers on the EAD, gives that fallback up. This is exactly the kind of decision to put to your attorney before you book." },
  { question: "What if my Advance Parole expires while I am abroad?", answer: "The document has to be valid at the moment you ask to be admitted, not just when you left. If it expires while you are outside the country and you have no other basis for admission, you can be left unable to return and your I-485 can be treated as abandoned. Check the expiry date against your return date — including any risk of the trip being extended — before you leave, and file the renewal early rather than travelling on a document that is about to run out." },
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
        {/* Fast Answer: Advance Parole timing */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Advance Parole — how long?"
              accent="emerald"
              rows={eadSnapshotRows}
              badges={["AP 4–9 months", "No regular premium"]}
              lastVerified={EAD_ESTIMATE_VERIFIED}
              sources={eadSnapshotSources}
              disclaimer={EAD_ESTIMATE_DISCLAIMER}
            />
          </Container>
        </section>

        <section className="pb-10 pt-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8">
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

              {/* ── Emergency advance parole ──────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  The emergency path, which does not use the queue
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The {D.advanceParoleMonthsLow}&ndash;{D.advanceParoleMonthsHigh} month
                  figure above describes the ordinary queue, and it is the wrong number to
                  look at if a parent is in hospital. There is a separate
                  route — <strong>emergency advance parole</strong> — that is decided in
                  person at a USCIS field office, often within days, and it is the single
                  most useful thing to know about Form I-131 that most timeline pages
                  leave out.
                </p>
                <ol className="mt-4 space-y-3">
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">1. Call the USCIS Contact Center the day the emergency starts</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Ask for an <em>emergency advance parole appointment</em> at your local
                      field office. Have your A-number, your I-485 receipt number, and a
                      one-sentence description of the emergency ready. The contact centre
                      raises a service request; the field office decides whether to see you.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">2. Bring a complete filing, not a request for one</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Appointments are short and officers decide on what is in front of
                      them: a signed Form I-131 with the fee, passport photos, your
                      passport, your I-485 receipt notice, and documentary proof of the
                      emergency — a physician&rsquo;s letter, hospital records, a death
                      certificate — plus proof of your relationship to the person abroad.
                      A missing relationship document is a common reason a sympathetic
                      case still fails.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">3. Expect a decision at the window</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Where the request is granted, officers can adjudicate on the spot and
                      issue the travel authorisation the same day, though some offices take
                      a little longer to produce the document. Nothing about this is
                      guaranteed — it is discretionary, and the field office can decline to
                      schedule you at all.
                    </p>
                  </li>
                </ol>
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <p className="text-sm font-bold text-ink-900">Before you book a field-office appointment</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    If you have anything irregular in your history — a period out of
                    status, a removal or immigration-court matter, an arrest, or an entry
                    without inspection — speak to an immigration attorney before you
                    appear in person. An in-person appointment is a poor venue in which to
                    discover a problem in your record.
                  </p>
                </div>
              </div>

              {/* ── Expedite criteria ─────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Expedite requests: what actually qualifies
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  There is no premium processing for Advance Parole, so an expedite request
                  is the only way to move an ordinary case up the queue. USCIS decides them
                  one by one, at its own discretion, against published criteria — and a
                  request that does not name one of them is simply declined.
                </p>
                <FactTable
                  caption="USCIS expedite criteria, and how they land on an I-131"
                  headers={["Criterion", "What it means for a travel document"]}
                  rows={[
                    [
                      "Severe financial loss to a company or person",
                      "Must be real and documented — a business at risk of failing or losing a critical contract, not an expensive ticket. It will not count if the urgency came from your own late filing or a late RFE response.",
                    ],
                    [
                      "Emergency or urgent humanitarian situation",
                      "A pressing circumstance of human welfare: illness, disability, a death in the family, or extreme conditions such as a natural disaster or armed conflict. This is the criterion most travel emergencies fall under.",
                    ],
                    [
                      "Nonprofit organisation furthering US cultural or social interests",
                      "Raised by an IRS-designated nonprofit on behalf of the beneficiary; rarely relevant to an adjustment applicant’s own travel.",
                    ],
                    [
                      "US government interests",
                      "Includes cases flagged by federal agencies and national-security or public-safety matters. Not something an applicant asserts for themselves.",
                    ],
                    [
                      "Clear USCIS error",
                      "Where the delay traces to a mistake USCIS made on the case, rather than to normal queue times.",
                    ],
                  ]}
                  highlightRows={[1]}
                  note={
                    <>
                      Expedites are discretionary and generally need documentary proof.
                      A pressing need to travel is what USCIS weighs on a Form
                      I-131 — &ldquo;my case is taking longer than the posted time&rdquo;
                      is not, by itself, a criterion. Source:{" "}
                      <a href="https://www.uscis.gov/forms/filing-guidance/expedite-requests" target="_blank" rel="noopener noreferrer" className="underline">
                        USCIS expedite requests
                      </a>
                      .
                    </>
                  }
                />
              </div>

              {/* ── H-1B: visa or parole ──────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  H-1B holders: the choice at the border matters more than the wait
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  If you hold valid H-1B or L-1 status you can travel on the visa with a
                  pending I-485, and you generally should. Re-entering on Advance Parole
                  admits you as a <strong>parolee</strong> — you are no longer in H-1B
                  status. That matters for one reason above all others: if the I-485 is
                  later denied, H-1B status is the thing that keeps you lawfully in the
                  country while you regroup. A parolee whose adjustment is denied has no
                  such floor.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The position practitioners have relied on for years, from a legacy
                  INS memorandum, is that an H-1B or L-1 holder who returns on parole and
                  <em> keeps working for the same sponsoring employer on the H-1B</em> can
                  be restored to H-1B status through a later extension or transfer
                  petition. Start working on the EAD instead, or move employers on the EAD,
                  and that route closes — you have chosen the parole track.
                </p>
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <p className="text-sm leading-relaxed text-ink-700">
                    The practical rule of thumb: keep the H-1B alive until the green card
                    is actually approved, and treat Advance Parole as the backup for trips
                    you cannot make on the visa — not as the default. Which track suits you
                    depends on your visa validity, your stamping risk and your employer,
                    so put it to your attorney before you book, not after you land.{" "}
                    <Link href="/h1b-visa-stamping-after-selection" className="font-semibold text-brand-600 underline">
                      Visa stamping and travel risk →
                    </Link>
                  </p>
                </div>
              </div>

              {/* ── Expiry while abroad ───────────────────────────────── */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                <h2 className="text-lg font-bold text-ink-900">
                  Check the expiry against your return date, not your departure
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Advance Parole has to be valid at the moment you ask to be admitted, not
                  merely when you left. A document that lapses while you are abroad can
                  leave you unable to return and your I-485 treated as abandoned — and a
                  trip extended by the very emergency you travelled for is exactly how
                  that happens. Build in slack, and file the renewal early rather than
                  travelling on a document that is nearly out. Renewals go through the same
                  queue as the original, so there is no quick fix from outside the country.
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
