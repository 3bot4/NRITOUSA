import type { Metadata } from "next";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import TrackedSourceBox from "@/components/tools/TrackedSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import InvitationLetterGenerator from "@/components/tools/InvitationLetterGenerator";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  essentialsArticleJsonLd,
  essentialsSoftwareAppJsonLd,
  otherEssentialsLinks,
  INVITE_PUBLISHED,
  INVITE_UPDATED,
  INVITE_UPDATED_HUMAN,
} from "@/lib/nriEssentialsCluster";
import {
  inviteFaqs,
  inviteChecklist,
  invitationSourceLinks,
  INVITE_DISCLAIMER,
} from "@/data/invitationLetterData";

const PATH = "/invitation-letter-for-parents-to-visit-usa";
const TITLE = "Invitation Letter for Parents to Visit USA — Free Generator + Sample";
const DESC =
  "Generate a properly formatted B-2 invitation letter for your parents in 2 minutes. Free PDF download, sample letter, and document checklist. No signup.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESC, path: PATH });

export default function Page() {
  const jsonLd = jsonLdGraph(
    essentialsSoftwareAppJsonLd({
      path: PATH,
      name: "Parents Invitation Letter Generator",
      description:
        "Free generator that produces a properly formatted B-2 invitation letter for parents visiting the USA as a downloadable PDF — entirely in the browser, no signup.",
      applicationCategory: "UtilitiesApplication",
    }),
    essentialsArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: INVITE_PUBLISHED,
      dateModified: INVITE_UPDATED,
    }),
    faqJsonLd(inviteFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Invitation Letter for Parents", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="invitation-letter-for-parents-to-visit-usa"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Invitation Letter for Parents" },
        ]}
        icon="✉️"
        category="Visitor Visa (B-2)"
        title="Invitation Letter for Parents to Visit USA: Free Generator, Sample & Format (2026)"
        hook="Writing an invitation letter for parents to visit USA takes two minutes with the free generator below — a properly formatted, consulate-addressed letter as a PDF, generated entirely in your browser. Plus a sample letter, what to include, and the documents checklist."
        accent="from-sky-600 to-indigo-600"
        badges={["Free PDF download", "No signup", "Nothing leaves your browser", "Works for H-1B, F-1, GC, citizens"]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#letter-generator"
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Generate my letter →
            </a>
            <a
              href="#sample-letter"
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
            >
              See the sample letter
            </a>
          </div>
        }
        topDisclaimer={<>Educational template only. Not legal or immigration advice.</>}
        sourceNote={
          <>
            Reviewed by Deepak Middha, CA · Last updated {INVITE_UPDATED_HUMAN}. B-2 practice verified against
            travel.state.gov and ustraveldocs.com — official links at the end of this page.
          </>
        }
        disclaimerPoints={[
          "An invitation letter is optional supporting evidence — U.S. law (INA 214(b)) puts the decision on the applicant's own ties.",
          "Visa procedures and fees change — verify current requirements on travel.state.gov and ustraveldocs.com.",
          "This generator and guide are educational aids, not legal or immigration advice.",
        ]}
        disclaimerExtra={<p>{INVITE_DISCLAIMER}</p>}
      >
        {/* The generator IS the page — above the fold, right after the intro. */}
        <section className="pt-6">
          <Container>
            <InvitationLetterGenerator />
          </Container>
        </section>

        {/* What it is / isn't */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-10">
              <div>
                <h2 className="text-xl font-bold text-ink-900">What an Invitation Letter Is (and Isn&apos;t) for a B-2 Visa</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    An invitation letter is a short formal note from you — the son or daughter in the United States — to
                    the visa officer, stating who you are, your immigration status, who you are inviting, when, why, and
                    who pays. That is all it is. It is <strong>not</strong> an application form, <strong>not</strong> a
                    legal sponsorship, and <strong>not</strong> required by the U.S. State Department for a B-2 visitor
                    visa.
                  </p>
                  <p>
                    What actually decides a parents&apos; B-2 case is the law every officer applies — INA 214(b), which
                    presumes every applicant is an intending immigrant until <em>they</em> demonstrate otherwise.
                    Evidence of your parents&apos; own circumstances — home, pension, family, travel history — may help
                    demonstrate their reasons to return, but the consular officer evaluates the application as a whole,
                    with the DS-160 and interview at the center. The letter&apos;s real job is quieter: it documents the
                    visit story cleanly and keeps everyone&apos;s dates and facts consistent. They may carry it in case
                    the officer requests supporting information — each post controls how supporting documents are
                    submitted or reviewed. Families include one because it costs nothing and removes ambiguity — just
                    never expect it to rescue a weak case.
                  </p>
                </div>
              </div>

              {/* Sample letter */}
              <div id="sample-letter" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-ink-900">Sample Invitation Letter for Parents Visiting the USA</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Here is the full format the generator produces, annotated — an invitation letter for parents visiting
                  USA consulates from Delhi to Kolkata follows the same structure. Every bracketed item is something the
                  generator fills in for you:
                </p>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card sm:p-8">
                  <div className="min-w-[300px] font-serif text-[0.8125rem] leading-relaxed text-ink-800">
                    <p className="font-bold">[Your full name]</p>
                    <p>[Your street address]</p>
                    <p>[City, State ZIP]</p>
                    <p className="mt-4">[Date]</p>
                    <p className="mt-4">To:</p>
                    <p>The Visa Officer</p>
                    <p>[U.S. Embassy, New Delhi / U.S. Consulate General, Mumbai · Chennai · Hyderabad · Kolkata]</p>
                    <p>India</p>
                    <p className="mt-4 font-bold">
                      Subject: Invitation letter in support of B-2 visitor visa application of [parent names] (Passport
                      No. [numbers])
                    </p>
                    <p className="mt-4">Dear Visa Officer,</p>
                    <p className="mt-3">
                      I, [your name], residing at [your address], am [your immigration status]. I am writing to
                      respectfully invite my parents, [names], to visit me in the United States from [arrival date] to
                      [departure date].
                    </p>
                    <p className="mt-3">
                      The purpose of this visit is [tourism and spending time with our family]. I am employed as [your
                      occupation] at [employer]. During their stay, they will [stay with me at my residence / stay in
                      hotel accommodation]. [They will bear the cost of their own round-trip airfare. / I will bear the
                      cost of their airfare.] [I will be responsible for their day-to-day expenses. / They will bear
                      their own expenses.]
                    </p>
                    <p className="mt-3">
                      They maintain family, financial, and social ties to India and intend to return before the expiry
                      of their authorized period of stay. This visit is temporary and for the purpose stated above.
                    </p>
                    <p className="mt-3">
                      I request you to kindly consider their B-2 visitor visa application favorably. Please feel free to
                      contact me if any further information or documentation is required.
                    </p>
                    <p className="mt-4">Sincerely,</p>
                    <p className="mt-6 font-bold">[Your name + signature]</p>
                    <p className="mt-4 font-bold">Enclosures (commonly included, not officially required):</p>
                    <p>1. Copy of status document · 2. Employment letter · 3. Bank statement</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-ink-500">
                  <li>
                    <strong className="text-ink-700">Why the subject line names the passport numbers:</strong> it ties
                    the letter to the exact applications in front of the officer — useful when a surname is common.
                  </li>
                  <li>
                    <strong className="text-ink-700">Why the ties paragraph is short:</strong> the officer hears about
                    ties from your parents, with evidence. The letter only affirms the visit is temporary — it should
                    not argue the case.
                  </li>
                  <li>
                    <strong className="text-ink-700">Why enclosures are labeled &quot;not officially required&quot;:</strong>{" "}
                    overstating documents as mandatory reads as coaching. Accurate labels read as organized.
                  </li>
                </ul>
              </div>

              {/* What to include */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">What to Include in an Invite Letter for Parents to Visit USA</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Seven facts, one page: <strong>(1)</strong> your full name, address, and immigration status —
                    citizen, green card, H-1B, F-1, or other lawful status, stated plainly; <strong>(2)</strong> your
                    occupation and employer, one line; <strong>(3)</strong> your parents&apos; full names as printed in
                    their passports, with passport numbers; <strong>(4)</strong> the relationship; <strong>(5)</strong>{" "}
                    exact intended dates, matching the DS-160; <strong>(6)</strong> the purpose in plain words —
                    &quot;tourism and time with family&quot; beats flowery paragraphs; and <strong>(7)</strong> who
                    covers expenses and where they will stay.
                  </p>
                </div>
                <h3 className="mt-5 text-base font-bold text-ink-900">
                  Invitation letter, parents&apos; visit, USA consulate: keep every fact consistent
                </h3>
                <div className="mt-1.5 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Leave out: promises that your parents &quot;will definitely return&quot; (that determination is the
                    officer&apos;s), any mention of documents you cannot produce, and emotional appeals. Keep the tone
                    of a business letter between adults — the parents visiting USA invitation letter that works is the
                    boring one where every fact cross-checks against the DS-160: same dates, same address, same story
                    at the interview window.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div id="documents-checklist" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-ink-900">Supporting Documents Checklist</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  What families typically assemble around the letter — split by who handles it. None of the
                  sponsor-side documents are officially required.
                </p>
                <div className="mt-4 space-y-3 sm:hidden">
                  {inviteChecklist.map((r) => (
                    <div key={r.item} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                      <p className="text-sm font-bold text-ink-900">{r.item}</p>
                      <p className="mt-1 text-xs font-semibold text-sky-700">{r.who}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                        <th className="p-3 font-semibold">Document</th>
                        <th className="p-3 font-semibold">Who handles it</th>
                        <th className="p-3 font-semibold">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/5 bg-white">
                      {inviteChecklist.map((r) => (
                        <tr key={r.item} className="align-top">
                          <td className="p-3 font-semibold text-ink-900">{r.item}</td>
                          <td className="p-3 font-medium text-sky-700">{r.who}</td>
                          <td className="p-3 text-ink-600">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notarization */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">Do Parents Need a Notarized Letter?</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
                  <p>
                    Generally, no. Notarization adds no official weight to an invitation letter — consular officers do
                    not require it, and a notary only verifies who signed, not whether the contents are true. The
                    persistent notarization myth comes from other countries&apos; visitor-visa processes (and from
                    notary services happy to take the fee). Sign the letter in ink, and spend the notary money on a good
                    printout of your bank statement instead. If a visa consultant insists a U.S. B-2 letter must be
                    notarized, treat it as a signal to double-check their other advice too — the official word on what a
                    visitor application needs is at travel.state.gov, linked at the end of this page.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-12 sm:py-16">
          <Container>
            <ToolFaq items={inviteFaqs} />
          </Container>
        </section>

        {/* Related pages */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related family & cross-border guides"
              links={[
                ...otherEssentialsLinks(PATH),
                {
                  href: "/free-immigrant-wealth-guide",
                  label: "Free Immigrant Wealth Guide",
                  desc: "Money planning for your family's life in the USA",
                },
                {
                  href: "/immigration",
                  label: "Immigration Hub",
                  desc: "USCIS, green card, and visa guides in one place",
                },
              ]}
            />
          </Container>
        </section>

        {/* Official sources — external links live here, at the end */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <TrackedSourceBox
              title="Official visa sources"
              intro="Always verify current B-2 visitor visa requirements, passport validity rules, fees, and appointment procedures directly with the official sources:"
              links={invitationSourceLinks}
              eventName="official_visa_source_clicked"
              toolSlug="invitation-letter-for-parents-to-visit-usa"
            />
          </Container>
        </section>

        <section className="py-10 pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={INVITE_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
