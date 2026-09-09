import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import InterviewWaiverChecker from "@/components/tools/InterviewWaiverChecker";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";
import {
  POE_PUBLISHED,
  POE_UPDATED,
  POE_UPDATED_HUMAN,
  poeArticleJsonLd,
  poeWebAppJsonLd,
} from "@/lib/portOfEntryCluster";
import {
  IW_CURRENT_RULE,
  IW_INTEGRITY_FEE,
  IW_OFFICER_DISCRETION,
  IW_SCREENING_NOTE,
  IW_VERIFIED,
  IW_WAIT_TIMES_NOTE,
  iwCategoryVerdicts,
  iwChronology,
  iwConditions,
  iwFees,
  iwLinks,
} from "@/data/interviewWaiverData";

const PATH = "/visa-interview-waiver";
const TITLE =
  "Visa Interview Waiver (Dropbox) in 2026: Who Still Qualifies, and Who Does Not";
const DESC =
  "H-1B, H-4, L and F are no longer interview-waiver eligible. The complete eligible list under the rules effective 1 October 2025, the four conditions, the policy chronology, and a checker that tells you which condition failed.";

export const metadata: Metadata = pageMetadata({
  title: "Visa Interview Waiver (Dropbox)",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  {
    question: "Is H-1B dropbox still available in 2026?",
    answer:
      "No. H-1B is not on the list of categories eligible for an interview waiver under the Department of State's update effective 1 October 2025. H-1B dropbox effectively ended on 18 February 2025, when the renewal window was cut from 48 months to 12 with a same-classification requirement, and the July 2025 update removed waivers for nearly all categories. The September 2025 update restored H-2A but not H-1B. Every H-1B applicant attends an in-person interview. Pages describing a 48-month H-1B dropbox window are quoting a rule that has not been in force since February 2025.",
  },
  {
    question: "Which visa categories can still use the interview waiver?",
    answer:
      "The complete list: A-1, A-2, C-3 (except attendants, servants and personal employees of accredited officials), G-1 through G-4, NATO-1 through NATO-6, TECRO E-1, and applicants for diplomatic or official-type visas; B-1, B-2, B1/B2 and Border Crossing Card renewals within 12 months of the prior visa's expiration; and H-2A renewals within the same 12-month window. Everything else requires an in-person interview.",
  },
  {
    question: "Can my H-4 spouse or child use dropbox even if I cannot?",
    answer:
      "No. H-4 is not an eligible category either. Since the September 2025 changes there is also no automatic interview waiver for applicants under 14 or over 79, so young children and elderly parents attend in-person interviews too. A family renewing H-1B and H-4 together should plan for interviews for every member.",
  },
  {
    question: "I was refused a visa years ago. Does that disqualify me forever?",
    answer:
      "Not necessarily, and this is the most misread clause in the rule. The condition is that you have never been refused a visa unless the refusal was overcome or waived. A 214(b) refusal that was later followed by a successful issuance has been overcome. A 221(g) that was resolved and the visa issued has been overcome. What fails the condition is an open, unresolved refusal. The consular section makes the call, so do not treat either reading as certain.",
  },
  {
    question: "Can I apply for a US visa in Canada or Mexico as an Indian citizen?",
    answer:
      "You can book it, but two separate rules work against you. First, applying in your country of nationality or usual residence is itself a condition of the interview waiver, so a third-country application cannot be a dropbox application. Second, since 6 September 2025 the Department of State has directed nonimmigrant applicants to schedule interviews in their country of nationality or residence, and warns that applying elsewhere may make it harder to qualify for the visa at all — with fees that are neither refundable nor transferable. If you also hold an expired stamp, applying abroad destroys automatic visa revalidation.",
  },
  {
    question: "How much does a US visa cost in 2026?",
    answer:
      "There are two tiers and families routinely hit both. Non-petition-based visas — B-1/B-2, F, M, J — carry a $185 application fee. Petition-based visas in the H, L, O, P, Q and R categories carry $205, which covers H-1B and H-4. Separately, a $250 Visa Integrity Fee was enacted in July 2025 and applies to nonimmigrant visa issuance from fiscal year 2026, indexed annually to the Consumer Price Index. It is charged on issuance rather than application, and implementation has been uneven across posts — treat it as enacted but verify collection at your post before budgeting.",
  },
  {
    question: "Do I have to make my social media public for an H-1B visa?",
    answer:
      "From 15 December 2025, H-1B and dependent H-4 applicants are instructed to set the privacy settings on all of their social media profiles to public, extending a review already applied to F, M and J applicants. Consular officers may review publicly available online content as part of the adjudication. This does not affect the waiver question — H-1B and H-4 are not waiver-eligible in any case — but it does affect how long stamping takes, and it drove interview cancellations and rescheduling at Indian posts when it took effect.",
  },
  {
    question: "What if the consulate calls me in for an interview anyway?",
    answer:
      "That is expressly reserved to them. Consular officers may require an in-person interview in any individual case, for any reason. It happens after a dropbox submission for reasons ranging from a document question to a routine quality check. Meeting every condition makes you eligible to be considered for a waiver; it never entitles you to one, and a request to appear is not a sign of a problem in itself.",
  },
  {
    question: "My embassy's website says dropbox is available for all categories. Who is right?",
    answer:
      "The Department of State's announcement governs. Individual embassy pages — including in.usembassy.gov — have at times carried stale copy implying interview waivers are available for all nonimmigrant categories, which has not been true since 2025. Where an embassy page and the Department's dated announcement conflict, rely on the announcement and expect the post to apply the current rule.",
  },
  {
    question: "How long are visa appointment waits right now?",
    answer:
      "Any figure printed on a web page is stale by the time you read it, which is why this page does not publish one. The Department of State maintains a live wait-time tool by post and visa class. Check it on the day you plan, note the date you checked, and disregard numbers quoted in forums or blog posts without a capture date.",
  },
];

const VERDICT_STYLE = {
  eligible: { chip: "bg-emerald-100 text-emerald-800", label: "Eligible" },
  conditional: { chip: "bg-amber-100 text-amber-800", label: "Conditional" },
  "not-eligible": { chip: "bg-rose-100 text-rose-800", label: "Not eligible" },
} as const;

export default function Page() {
  const jsonLd = jsonLdGraph(
    poeWebAppJsonLd({
      path: PATH,
      name: "Interview Waiver Eligibility Checker",
      description:
        "Check every condition in the Department of State interview waiver rules effective 1 October 2025 and see which one fails.",
    }),
    poeArticleJsonLd({
      path: PATH,
      headline: TITLE,
      description: DESC,
      datePublished: POE_PUBLISHED,
      dateModified: POE_UPDATED,
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Visa Interview Waiver", url: PATH },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="visa-interview-waiver"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Visa Interview Waiver" },
        ]}
        icon="📮"
        category="Visa & Green Card"
        title="Visa Interview Waiver (Dropbox)"
        hook="H-1B, H-4, L and F dropbox ended in 2025 and has not come back. Here is the complete eligible list, dated — and a checker that names the exact condition you fail."
        accent="from-emerald-600 to-teal-700"
        badges={[
          "Rules effective 1 Oct 2025",
          "Dated chronology",
          "Verified Sep 2026",
          "Not legal advice",
        ]}
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a
              href="#tool"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Check My Eligibility →
            </a>
            <a
              href={iwLinks.currentRule}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              The DOS announcement ↗
            </a>
          </div>
        }
        sourceNote={
          <>
            Rules stated as of the Department of State update announced{" "}
            {IW_CURRENT_RULE.announced}, effective {IW_CURRENT_RULE.effective}.
            Verified {IW_VERIFIED}; no later interview-waiver change found. This
            policy changed four times in two years — check the date on anything
            else you read.
          </>
        }
        disclaimerExtra={
          <p>
            Educational only, and not legal advice. Eligibility is determined by
            the consular section, not by this page or its checker.
          </p>
        }
      >
        {/* ── Dated verdict box ───────────────────────────────────────── */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="Who can use the interview waiver today?"
              accent="emerald"
              rows={[
                {
                  label: "H-1B, H-4, L, F, J, O, P",
                  value: "Not eligible",
                  note: "In-person interview required. No exceptions by age.",
                  highlight: true,
                },
                {
                  label: "B-1 / B-2 renewal",
                  value: "Eligible",
                  note: "Within 12 months of expiry, full validity, 18+ at issuance.",
                },
                {
                  label: "H-2A renewal",
                  value: "Eligible",
                  note: "Restored 1 Oct 2025. Every competitor still says B-1/B-2 only.",
                },
                {
                  label: "Diplomatic / official",
                  value: "Eligible",
                  note: "A, G, NATO, C-3 (with exceptions), TECRO E-1.",
                },
              ]}
              badges={[
                `Effective ${IW_CURRENT_RULE.effective}`,
                "Officer may still require an interview",
              ]}
              lastVerified={IW_VERIFIED}
              sources={[
                { label: "DOS Interview Waiver Update", href: iwLinks.currentRule },
                { label: "Country of residence policy", href: iwLinks.countryOfResidence },
                { label: "Visa fees", href: iwLinks.fees },
              ]}
              disclaimer={IW_OFFICER_DISCRETION}
              ctaText="Check which condition I fail"
              ctaHref="#tool"
            />
          </Container>
        </section>

        {/* ── Per-category verdict table ──────────────────────────────── */}
        <section className="py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Every category, with a verdict
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                This is the complete eligible list under the rule effective{" "}
                {IW_CURRENT_RULE.effective}. Anything not on it requires an
                in-person interview.
              </p>
              <div className="mt-5 space-y-2">
                {iwCategoryVerdicts.map((row) => {
                  const s = VERDICT_STYLE[row.verdict];
                  return (
                    <div
                      key={row.category}
                      className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-ink-900">{row.category}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                        {row.note}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
                {IW_OFFICER_DISCRETION}
              </p>
            </div>
          </Container>
        </section>

        {/* ── The checker ─────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Interview Waiver Eligibility Checker
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-500">
                It does not just say yes or no. It names the condition that
                fails, says whether that condition is curable, and counts the
                days left in your 12-month window.
              </p>
              <div className="mt-5">
                <InterviewWaiverChecker />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Chronology ──────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                How the rule changed, and when
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                Most of the wrong advice circulating about dropbox is simply an
                old rule that was correct when it was written. This table lets
                you place whatever you were told. Note that the announcement date
                and the effective date differ — sometimes by six weeks.
              </p>
              <ol className="mt-6 space-y-4">
                {iwChronology.map((e) => (
                  <li
                    key={e.effective + e.headline}
                    className={`relative rounded-2xl border p-4 ${
                      e.current
                        ? "border-emerald-300 bg-emerald-50/60 shadow-card"
                        : "border-ink-900/10 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-ink-900/5 px-2.5 py-1 text-xs font-bold text-ink-700">
                        Effective {e.effective}
                      </span>
                      <span className="text-xs text-ink-400">
                        announced {e.announced}
                      </span>
                      {e.current && (
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                          In force today
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-bold text-ink-900">{e.headline}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      {e.detail}
                    </p>
                    {e.href && (
                      <a
                        href={e.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-brand-600 underline"
                      >
                        Department of State announcement ↗
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        {/* ── The conditions ──────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                The conditions, and what each one actually means
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                Being in an eligible category is only the first half. Every
                condition below must also hold.
              </p>
              <div className="mt-5 space-y-4">
                {iwConditions.map((c, i) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-ink-900">{c.label}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                          {c.detail}
                        </p>
                        <div className="mt-3 rounded-xl bg-amber-50 p-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                            The nuance
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-amber-900">
                            {c.nuance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Fees ────────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What it costs — both tiers
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                An Indian family stamping together usually pays two different
                amounts, and almost nothing written for this audience gives both.
                The parents renewing a visitor visa and the H-1B principal are on
                separate fee tiers.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {iwFees.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card"
                  >
                    <p className="text-3xl font-black tracking-tight text-ink-900">
                      {f.amount}
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink-800">
                      {f.label}
                    </p>
                    <p className="mt-1.5 text-sm text-ink-600">{f.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-black text-ink-900">
                    {IW_INTEGRITY_FEE.amount}
                  </span>
                  <span className="text-sm font-bold text-ink-800">
                    Visa Integrity Fee
                  </span>
                  <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                    {IW_INTEGRITY_FEE.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-amber-900">
                  {IW_INTEGRITY_FEE.detail}
                </p>
              </div>
              <p className="mt-4 text-sm text-ink-500">
                Fees change. Verify both tiers on the{" "}
                <a
                  href={iwLinks.fees}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  Department of State fees page
                </a>{" "}
                before you pay.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Screening + waits ───────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                  Online presence review, from {IW_SCREENING_NOTE.effective}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                  {IW_SCREENING_NOTE.detail}
                </p>
                <a
                  href={IW_SCREENING_NOTE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand-600 underline"
                >
                  Department of State announcement ↗
                </a>
              </div>

              <div className="rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5">
                <h2 className="text-lg font-bold text-ink-900">
                  Appointment wait times — why there is no table here
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {IW_WAIT_TIMES_NOTE}
                </p>
                <a
                  href={iwLinks.waitTimes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  Official Global Visa Wait Times ↗
                </a>
              </div>

              <div>
                <h2 className="text-lg font-bold text-ink-900">
                  When an embassy page contradicts the rule
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                  Individual embassy sites have at times served stale copy
                  implying that interview waivers remain available for all
                  nonimmigrant categories. That has not been true since 2025.
                  Where an embassy page and the Department&rsquo;s dated
                  announcement conflict, rely on the announcement — and expect
                  the post to apply the current rule regardless of what its own
                  page says.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── What this means for Indian families ─────────────────────── */}
        <section className="py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                What this means if you are an Indian family
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-600">
                <p>
                  <strong>Parents visiting on B-2 are now the main dropbox
                  path.</strong> A parent renewing a visitor visa within 12
                  months of its expiry, issued for full validity, aged 18 or over
                  at issuance, is the profile the current rule was written
                  around. If you are inviting parents, the{" "}
                  <Link
                    href="/invitation-letter-for-parents-to-visit-usa"
                    className="text-brand-600 underline"
                  >
                    invitation letter guide
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/visitor-insurance/parents-visiting-usa"
                    className="text-brand-600 underline"
                  >
                    visitor insurance for parents
                  </Link>{" "}
                  cover the rest of that trip.
                </p>
                <p>
                  <strong>The whole H-1B household interviews.</strong> Principal,
                  spouse and children, including toddlers. Budget appointment
                  slots for everyone, not one, and expect the online presence
                  review to lengthen the process.
                </p>
                <p>
                  <strong>Do not solve an appointment shortage with a
                  third-country booking.</strong> It fails the waiver condition,
                  it runs against the September 2025 country-of-residence
                  direction, the fee is not refundable or transferable, and if
                  your stamp is expired it destroys{" "}
                  <Link
                    href="/automatic-visa-revalidation"
                    className="text-brand-600 underline"
                  >
                    automatic visa revalidation
                  </Link>
                  .
                </p>
                <p>
                  <strong>The outbound trip has its own risks.</strong> Stamping
                  in India after a job change, and the 221(g) administrative
                  processing that can follow, is covered in depth on{" "}
                  <Link href="/h1b/travel-to-india" className="text-brand-600 underline">
                    H-1B travel to India
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/h1b/stamping-india-after-approval"
                    className="text-brand-600 underline"
                  >
                    stamping in India after approval
                  </Link>
                  . The return leg — being refused admission at a US airport — is
                  covered on{" "}
                  <Link
                    href="/h1b-denied-entry-airport"
                    className="text-brand-600 underline"
                  >
                    denied entry at the airport
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Sources ─────────────────────────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-ink-900">Sources</h2>
              <p className="mt-1 text-sm text-ink-500">
                All read {IW_VERIFIED}. This policy has changed four times in two
                years — check the date before relying on anything, including this
                page.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  ["Interview Waiver Update, 18 September 2025 (current rule)", iwLinks.currentRule],
                  ["Interview Waiver Update, 25 July 2025", iwLinks.july2025],
                  ["Interview Waiver Update, 18 February 2025", iwLinks.feb2025],
                  ["Adjudicating NIV Applicants in Their Country of Residence", iwLinks.countryOfResidence],
                  ["Expanded Screening and Vetting for H-1B and H-4 Applicants", iwLinks.h1bScreening],
                  ["Expanded Screening and Vetting for Visa Applicants", iwLinks.expandedScreening],
                  ["Fees for Visa Services", iwLinks.fees],
                  ["Global Visa Wait Times", iwLinks.waitTimes],
                  ["U.S. Visas News (check for later changes)", iwLinks.visasNews],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-600 underline"
                    >
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related visa & travel guides"
              links={[
                {
                  href: "/h1b-denied-entry-airport",
                  label: "Denied Entry at the Airport on H-1B",
                  desc: "The return leg: secondary inspection and the outcome fork",
                },
                {
                  href: "/automatic-visa-revalidation",
                  label: "Automatic Visa Revalidation",
                  desc: "Re-entering from Canada or Mexico on an expired stamp",
                },
                {
                  href: "/h1b/travel-to-india",
                  label: "H-1B Travel to India",
                  desc: "Stamping, 221(g) risk, and when not to go",
                },
                {
                  href: "/h1b/stamping-india-after-approval",
                  label: "H-1B Stamping in India After Approval",
                  desc: "Consulate process, documents and administrative processing",
                },
                {
                  href: "/invitation-letter-for-parents-to-visit-usa",
                  label: "Invitation Letter for Parents",
                  desc: "The B-2 renewal path that is still dropbox-eligible",
                },
                {
                  href: "/visitor-insurance/parents-visiting-usa",
                  label: "Visitor Insurance for Parents",
                  desc: "Cover for parents visiting the USA",
                },
              ]}
            />
          </Container>
        </section>

        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={POE_UPDATED_HUMAN} />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
