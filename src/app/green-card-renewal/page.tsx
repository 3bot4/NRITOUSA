import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import GreenCardRenewalChecker from "@/components/tools/GreenCardRenewalChecker";
import RenewOnlineChecklist from "@/components/tools/RenewOnlineChecklist";
import RenewalTimelineTable from "@/components/tools/RenewalTimelineTable";
import EstimatedTimelineAnswer from "@/components/tools/EstimatedTimelineAnswer";
import RenewalReasonCards from "@/components/tools/RenewalReasonCards";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import ReviewedByline from "@/components/ReviewedByline";
import AuthorBioBox from "@/components/AuthorBioBox";
import SoftCta from "@/components/SoftCta";
import { breadcrumbJsonLd, faqJsonLd, jsonLdGraph, pageMetadata } from "@/lib/seo";
import {
  gcRenewalClusterLinks,
  gcRenewalRelatedLinks,
  gcRenewalWebAppJsonLd,
  gcRenewalArticleJsonLd,
  gcRenewalItemListJsonLd,
  GC_RENEWAL_PUBLISHED,
  GC_RENEWAL_UPDATED,
  GC_RENEWAL_UPDATED_HUMAN,
} from "@/lib/greenCardRenewalCluster";
import {
  greenCardRenewalTimelineRows,
  greenCardRenewalBadges,
  greenCardRenewalPlanningSummary,
  greenCardRenewalReasons,
  greenCardRenewalFaqs,
  renewOnlineSteps,
  expiredGreenCardConcerns,
  greenCardRenewalSourceLinks,
  greenCardRenewalSources as S,
  greenCardRenewalConfig as C,
  GC_RENEWAL_DISCLAIMER,
  GC_RENEWAL_DATA_NOTE,
} from "@/data/greenCardRenewalData";
import {
  greenCardRenewalFastAnswerColumns,
  greenCardRenewalFastAnswerRows,
  expiredTimingColumns,
  expiredTimingRows,
  greenCardRenewalTimingConfig as T,
  greenCardRenewalOfficialLinks,
} from "@/data/greenCardRenewalTimelineData";

const PATH = "/green-card-renewal";
const TITLE = "Green Card Renewal 2026: Timeline, Fee, Form I-90 & Checklist";
const DESC =
  "Learn how to renew or replace your green card with Form I-90. See timeline, fee, documents, online filing steps, and use a free renewal checklist tool.";

export const metadata: Metadata = pageMetadata({
  title: "Green Card Renewal 2026: Timeline, Fee & Form I-90",
  description: DESC,
  path: PATH,
});

const GUIDE: {
  h: string;
  body: string;
  link?: { href: string; label: string };
}[] = [
  { h: "What Is Green Card Renewal?", body: "Green card renewal is the process of getting a new Permanent Resident Card when your current 10-year card is expiring or has expired. It does not change your status — it updates the physical card that proves you are a lawful permanent resident. Most people renew using Form I-90." },
  { h: "Who Should File the I-90 Form for Green Card Renewal?", body: "Form I-90 is generally for lawful permanent residents with a 10-year card that is expiring or expired, or whose card is lost, stolen, damaged, has incorrect information, or whose name has legally changed. It is also used when a card was never received." },
  { h: "Who Should Not File Form I-90?", body: "Conditional permanent residents with a 2-year card usually should not use Form I-90 to remove conditions. Marriage-based conditional residents generally file Form I-751, and EB-5 investor conditional residents generally file Form I-829. Filing the wrong form can cause serious delays." },
  { h: "Renew vs Replace a Permanent Resident Card: What's the Difference?", body: "Renewal means getting a new card when a 10-year card expires; replacement means a lost, stolen, damaged, or incorrect card. Both run on Form I-90, but the reason you select changes the evidence and sometimes the fee — the replacement cases are covered in full on /replace-green-card.", link: { href: "/replace-green-card", label: "Replace a green card" } },
  { h: "What Documents Do You Need for Green Card Renewal?", body: "A simple renewal may need little beyond your application, while a name change requires legal name-change evidence and a USCIS-error correction may require different documentation. Keep a clear copy or photo of your current card. Always follow the official Form I-90 instructions for your specific reason." },
  { h: "What happens after filing I-90", body: "USCIS issues a receipt notice (Form I-797C). For eligible renewal applicants, that notice may extend green card validity. USCIS may schedule biometrics or reuse prior biometrics, review the application, possibly request more evidence, and — if approved — produce and mail the new card." },
  { h: "Biometrics for green card renewal", body: "USCIS may require a biometrics appointment for fingerprints, photo, and signature, or it may reuse previous biometrics. Watch for an appointment notice or a reuse notice in your USCIS account. Completing biometrics is a routine step and does not by itself mean approval is imminent." },
  { h: "Receipt notice and temporary proof", body: "USCIS has announced a validity extension (up to 36 months) for eligible I-90 renewals. The receipt notice, presented with your expired card, may serve as temporary evidence of status. Keep the notice with your card and follow USCIS instructions. If you need urgent proof, ask about an ADIT/I-551 stamp." },
  { h: "Green card renewal mistakes to avoid", body: "Common mistakes include filing Form I-90 for a conditional 2-year card, filing at the wrong time, submitting incomplete evidence, assuming an old fee amount, and ignoring the receipt notice. Verify the current fee, the correct form, and the required documents before filing." },
  { h: "When to talk to an immigration attorney", body: "Consider professional help if you have a conditional card, a complex history (such as criminal issues or prior immigration problems), an urgent travel need, a pending naturalization decision, or you are simply unsure which form applies. An attorney can help you avoid costly errors." },
];

/**
 * Online-filing detail merged from /renew-green-card-online (301 → here).
 * "When online filing may not be best" was the highest-value unique block on
 * that page — the hub previously had nothing on choosing paper filing.
 */
const ONLINE_SECTIONS: { h: string; body: string }[] = [
  { h: "Benefits of online filing", body: "Filing Form I-90 online through a free USCIS account usually lets you complete the form at your own pace, upload evidence directly, pay electronically, get an immediate confirmation, and track your case in one place. It also reduces the risk of a lost or delayed mailing." },
  { h: "When online filing may not be best", body: "Some situations may call for paper filing — for example, certain fee-waiver requests, unusual case types, or if you would rather not create an online account. Check the Form I-90 instructions, and remember that conditional 2-year card holders usually file a different form entirely (I-751 or I-829)." },
  { h: "Documents to prepare", body: "A simple renewal may need little beyond your application, while a name change requires legal name-change evidence and a USCIS-error correction may require different documentation. Have a clear copy or photo of your current card ready to upload, and follow the instructions for your specific reason." },
  { h: "Common mistakes", body: "Watch for typos in your name or A-number, choosing the wrong reason for filing, forgetting required evidence, assuming an outdated fee amount, and — most seriously — filing Form I-90 for a conditional 2-year card. Review every answer before you submit." },
  { h: "What happens after online filing", body: "USCIS issues a receipt notice (which may extend green card validity for eligible renewals), may schedule biometrics or reuse prior biometrics, reviews the application, may request more evidence, and — if approved — produces and mails the new card. Track everything in your USCIS account." },
  { h: "Fee waivers: Form I-912", body: "Applicants who cannot pay may request a fee waiver on Form I-912 — generally based on a means-tested benefit, household income at or below 150% of the Federal Poverty Guidelines, or financial hardship. Eligibility is limited and never guaranteed, and a fee-waiver request is one of the situations that may call for paper filing. Review the official criteria before requesting one." },
];

/**
 * Expired-card detail merged from /expired-green-card (301 → here). The hub
 * covered the 36-month receipt extension generally but not as it applies to an
 * ALREADY-expired card, and had no I-9, DMV or ADIT-stamp coverage at all.
 */
const EXPIRED_SECTIONS: { h: string; body: string }[] = [
  { h: "Work proof with an expired card", body: "An expired card can complicate I-9 employment verification. A USCIS receipt notice or validity-extension documentation may help you prove work authorization. Talk with your employer's HR and check current USCIS guidance — do not assume you cannot work." },
  { h: "Travel warning", body: "Traveling internationally with an expired green card can be difficult: airlines and border officers may question the card. Check USCIS, airline, and consulate requirements before you travel, and consider whether you need a temporary I-551/ADIT stamp for re-entry." },
  { h: "DMV and ID issues", body: "State DMVs and other agencies may ask for unexpired evidence of status when you renew a license or ID. Bring your receipt notice and any USCIS extension documentation, and check the specific requirements of your state agency in advance." },
  { h: "Receipt notice extension for an already-expired card", body: "USCIS has announced a validity extension (up to 36 months) for eligible lawful permanent residents who properly file Form I-90. Presented together with the expired card, the receipt notice may serve as temporary evidence of status even after the card's own expiration date has passed. Keep the notice and follow its instructions." },
  { h: "Temporary proof / ADIT stamp", body: "If you need urgent proof of status and the receipt notice isn't enough for your situation, you may be able to request a temporary I-551/ADIT stamp. Check current USCIS procedures for obtaining temporary evidence of permanent resident status." },
  { h: "When Form I-90 may be wrong", body: "If you have a 2-year conditional card, Form I-90 usually does not apply. Marriage-based conditional residents generally file Form I-751, and EB-5 investor conditional residents generally file Form I-829. Filing the wrong form can cause serious delays." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    gcRenewalWebAppJsonLd({ path: PATH, name: TITLE, description: DESC }),
    gcRenewalArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: GC_RENEWAL_PUBLISHED, dateModified: GC_RENEWAL_UPDATED }),
    gcRenewalItemListJsonLd({ path: PATH, name: "Green Card Renewal Timeline", items: greenCardRenewalTimelineRows.map((r) => ({ name: r.step, description: r.whatHappens })) }),
    faqJsonLd(greenCardRenewalFaqs),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "Green Card Renewal", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="green-card-renewal"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "Green Card Renewal" },
        ]}
        icon="🟢"
        category="Visa & Green Card"
        title="Green Card Renewal 2026: Timeline, Fee, Form I-90 & Checklist"
        hook="Renew or replace your green card with a clear Form I-90 timeline, fee checklist, document list, online filing guide, and personalized next-step tool."
        badges={["Free educational checklist", "No case number", "No signup", "No personal data"]}
        accent="from-emerald-600 to-teal-600"
        headerExtra={
          <div className="flex flex-wrap gap-2">
            <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Renewal Steps →</a>
            <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">Check USCIS Form I-90 ↗</a>
          </div>
        }
        sourceNote={<>Last updated: {GC_RENEWAL_UPDATED_HUMAN}. {C.sourceNote}</>}
        disclaimerExtra={<p>{GC_RENEWAL_DISCLAIMER}</p>}
      >
        {/* Byline row */}
        <section className="pt-5">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ReviewedByline date={GC_RENEWAL_UPDATED} />
            </div>
          </Container>
        </section>

        {/* Quick answer */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-bold text-ink-900">Quick Answer: How Do You Renew a Green Card?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Most lawful permanent residents renew or replace a 10-year green card by filing <strong>Form I-90</strong> with USCIS — <strong>$415 online / $465 by paper</strong> as last verified — and a practical planning range for processing is about <strong>8–14 months</strong>. Your I-797 receipt notice extends an eligible expiring card&apos;s validity (currently by up to <strong>36 months</strong>) while the case runs. Conditional permanent residents with a 2-year card usually should <strong>not</strong> use Form I-90 to remove conditions; they generally need Form I-751 or I-829 depending on the case.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="#green-card-renewal-tool" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Use the checklist tool →</a>
                <a href={S.formI90} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-ink-900/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 transition hover:border-emerald-300">Form I-90 ↗</a>
              </div>
            </div>

            {/* Key takeaways */}
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Key takeaways</p>
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                <li>• File Form I-90 <strong>within 6 months</strong> of your card&apos;s expiration date — earlier filing risks rejection, later filing risks proof-of-status gaps.</li>
                <li>• Budget <strong>$415 online / $465 paper</strong> for the I-90 fee, per the USCIS Fee Schedule (G-1055).</li>
                <li>• Plan around <strong>8–14 months</strong> of processing and rely on the receipt notice&apos;s <strong>36-month</strong> validity extension in the meantime.</li>
                <li>• Never file I-90 for a <strong>2-year conditional card</strong> — marriage-based cases file Form I-751 in the 90 days before expiry.</li>
                <li>• Renew online through a free USCIS account for the lower fee, document uploads, and case tracking.</li>
              </ul>
            </div>

            {/* Opening keyword paragraph */}
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="text-base leading-relaxed text-ink-700">
                Green card renewal is the Form I-90 process that replaces an expiring or expired 10-year
                Permanent Resident Card — and this guide walks through every step of how to renew a green card
                in 2026. It is written for lawful permanent residents renewing on time, catching up on an
                already-expired card, or replacing a lost or damaged one, whether you file the green card
                renewal online or by mail. The single most important number: file within <strong>6 months of
                expiry</strong> and expect roughly <strong>8–14 months</strong> of processing, bridged by the
                receipt notice&apos;s 36-month extension. Below: the full timeline stage by stage, the I-90 form
                and fee, who should <em>not</em> use I-90, documents by situation, online filing steps, what
                happens after you file, and a 60-second checklist tool personalized to your case.
              </p>
            </div>
          </Container>
        </section>

        {/* Fast-answer estimated timeline (above everything else) */}
        <section className="py-10 sm:py-12">
          <Container>
            <EstimatedTimelineAnswer
              title="Green Card Renewal Timeline Estimate"
              intro="Most users want the timeline first. The table below gives a quick planning estimate for Form I-90 renewal or replacement. Use the checker below for a personal next-step checklist."
              columns={greenCardRenewalFastAnswerColumns}
              rows={greenCardRenewalFastAnswerRows}
              badges={["Form I-90", "Estimated timeline first", "Check USCIS monthly", "Receipt may extend validity", "Conditional cards are different"]}
              summaryTitle="Green Card Renewal Planning Answer"
              summaryText="For a standard 10-year green card renewal, a practical planning range is about 8–14 months, but the current official Form I-90 processing time should always be checked on USCIS. After filing, users usually wait for a receipt notice, possible biometrics, USCIS review, approval, card production, and mailing."
              sourceNote={T.sourceNote}
              officialLinks={greenCardRenewalOfficialLinks}
              ctaText="Check My Renewal Steps"
              ctaHref="#green-card-renewal-tool"
            />
          </Container>
        </section>

        {/* Detailed stage table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <RenewalTimelineTable
              title="Green Card Renewal Stages Explained"
              intro="Now that you have the estimate above, here is what happens at each Form I-90 stage. Use the personalized checklist below for your specific situation."
              rows={greenCardRenewalTimelineRows}
              badges={greenCardRenewalBadges}
              sourceNote={C.sourceNote}
              sourceLinks={[
                { label: "Form I-90", href: S.formI90 },
                { label: "USCIS Processing Times", href: S.uscisProcessingTimes },
                { label: "USCIS Fee Schedule", href: S.uscisFeeSchedule },
              ]}
              ctaText="Check My Renewal Steps"
              ctaHref="#green-card-renewal-tool"
            />

            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-card">
              <h3 className="text-base font-bold text-ink-900">Green Card Renewal Planning Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{greenCardRenewalPlanningSummary}</p>
            </div>
          </Container>
        </section>

        {/* Reasons table */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <RenewalReasonCards
              intro="Your situation decides which form you file and what evidence you need. The 2-year conditional card row is the most important to get right."
              reasons={greenCardRenewalReasons}
            />
          </Container>
        </section>

        {/* Tool */}
        <section className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Check Your Green Card Renewal Steps</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">The tables above give the general path. Answer a few questions for a personalized Form I-90 checklist, documents list, urgency level, and official links.</p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl">
              <GreenCardRenewalChecker />
            </div>

            {/* How this calculation works */}
            <div className="mx-auto mt-8 max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How this checklist is calculated</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The checker maps your answers onto the official Form I-90 rules rather than doing any
                prediction: your card type decides the form (10-year card → I-90; 2-year conditional card →
                I-751/I-829), your reason (expiring, expired, lost, damaged, wrong data, name change) selects
                the evidence list from the Form I-90 instructions, and your timing sets the urgency level —
                inside the 6-month renewal window, already expired, or expired with travel booked. Fee figures
                come from the same verified table used across this site ($415 online / $465 paper, as last
                verified), and the timeline estimate reflects the 8–14 month planning range with the 36-month
                receipt extension. It stores nothing and always links to USCIS to confirm before you file.
              </p>
            </div>
          </Container>
        </section>

        {/* Detailed guide */}
        <section className="border-t border-ink-900/5 bg-white py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="space-y-6">
                {GUIDE.map((g) => (
                  <div key={g.h}>
                    <h2 className="text-lg font-bold text-ink-900">{g.h}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{g.body}</p>
                    {g.link && (
                      <Link href={g.link.href} className="mt-1.5 inline-block text-sm font-semibold text-emerald-700 underline">
                        {g.link.label} →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-ink-500">{GC_RENEWAL_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* ── Online filing (merged from /renew-green-card-online) ───────── */}
        <section id="renew-online" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">How Do You Renew a Green Card Online?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Many lawful permanent residents can renew or replace a green card online by creating a
                free USCIS online account and filing <strong>Form I-90</strong> — $415 online versus $465
                by paper, as last verified. Online filing usually makes it easier to upload evidence, pay,
                and track the case, but some situations may still require mail filing.
              </p>

              <h3 className="mt-7 text-base font-bold text-ink-900">Online Green Card Renewal Steps</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">The usual order for filing Form I-90 online. Do the readiness check below before you start.</p>
              <ol className="mt-4 space-y-3">
                {renewOnlineSteps.map((step, i) => (
                  <li key={step.step} className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{step.step}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{step.whatHappens}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-400"><span className="font-semibold text-ink-500">Check:</span> {step.whatToCheck}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h3 className="mt-7 text-base font-bold text-ink-900">Does Filing Online Make It Faster?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                No — not in adjudication. Renewing online may make filing and tracking easier and it
                reaches USCIS immediately rather than through the mail, but it does not guarantee faster
                USCIS approval. Processing time still depends on USCIS workload and the facts of your
                case, so plan around the same 8&ndash;14 month range either way.
              </p>

              <div className="mt-5 space-y-5">
                {ONLINE_SECTIONS.map((sec) => (
                  <div key={sec.h}>
                    <h3 className="text-base font-bold text-ink-900">{sec.h}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{sec.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink-600">
                Exact current amounts, the fee-waiver rules and the biometrics-fee structure are on{" "}
                <Link href="/green-card-renewal-fee" className="font-semibold text-emerald-700 underline">
                  the green card renewal fee page
                </Link>
                .
              </p>

              <div className="mt-5">
                <a href="#online-checklist" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">Check My Online Filing Readiness →</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Online readiness tool. Deliberately a SEPARATE module from the
            renewal-steps checker above: merging them would drop the USCIS
            account, online-payment and fee-waiver branches this one asks about. */}
        <section id="online-checklist" className="scroll-mt-24 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Online Filing Readiness Check</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                A different question from the checklist above: not <em>what</em> your renewal path is, but
                whether you are set up to file it online today — account, documentation, payment and
                fee-waiver needs.
              </p>
              <div className="mt-6">
                <RenewOnlineChecklist />
              </div>
            </div>
          </Container>
        </section>

        {/* ── Expired green card (merged from /expired-green-card) ────────── */}
        <section id="expired-green-card" className="scroll-mt-24 border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900">Expired Green Card: Work, Travel, DMV and Proof of Status</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                An expired green card does not automatically mean you lost permanent resident status, but
                the expired card can create real problems for travel, employment verification, DMV and
                proof of status. Most 10-year card holders renew with <strong>Form I-90</strong>;
                conditional (2-year) residents usually need a different process.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <h3 className="text-base font-bold text-ink-900">Expired Green Card: Common Concerns</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">What an expired card really means for each situation, and what to do next.</p>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 sm:hidden">
                {expiredGreenCardConcerns.map((r) => (
                  <div key={r.concern} className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
                    <p className="text-sm font-bold text-ink-900">{r.concern}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600"><span className="font-semibold text-ink-500">Reality:</span> {r.reality}</p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-800"><span className="font-semibold">Do:</span> {r.whatToDo}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card sm:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                      <th className="p-3 font-semibold">Concern</th>
                      <th className="p-3 font-semibold">Reality</th>
                      <th className="p-3 font-semibold">What to do</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-900/5 bg-white">
                    {expiredGreenCardConcerns.map((r) => (
                      <tr key={r.concern} className="align-top">
                        <td className="p-3 font-semibold text-ink-900">{r.concern}</td>
                        <td className="p-3 text-ink-600">{r.reality}</td>
                        <td className="p-3 text-ink-600">{r.whatToDo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8">
              <EstimatedTimelineAnswer
                title="Expired Green Card Timeline and Next Steps"
                intro="What to do and how urgent it is, based on your situation. An expired card does not end your status, but it can cause friction until you renew."
                columns={expiredTimingColumns}
                rows={expiredTimingRows}
                badges={["Status usually continues", "Renew with Form I-90", "Travel/work needs may be urgent", "Conditional cards are different"]}
                summaryTitle="Expired Green Card Answer"
                summaryText="An expired green card does not automatically mean someone lost permanent resident status, but the expired card can create problems for travel, work verification, DMV, and proof of status. Regular 10-year card holders often use Form I-90, while conditional residents usually need a different process."
                sourceNote={T.sourceNote}
                officialLinks={greenCardRenewalOfficialLinks}
                ctaText="Check My Renewal Steps"
                ctaHref="#green-card-renewal-tool"
              />
            </div>

            <div className="mx-auto mt-8 max-w-3xl space-y-5">
              {EXPIRED_SECTIONS.map((sec) => (
                <div key={sec.h}>
                  <h3 className="text-base font-bold text-ink-900">{sec.h}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{sec.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Official sources */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <OfficialSourceBox links={greenCardRenewalSourceLinks} />
          </Container>
        </section>

        {/* Internal links */}
        <section className="py-10 sm:py-12">
          <Container>
            <PermClusterLinks
              title="Related Green Card and Immigration Tools"
              links={[...gcRenewalClusterLinks.filter((l) => l.href !== PATH), ...gcRenewalRelatedLinks]}
            />
          </Container>
        </section>

        {/* Soft CTA */}
        <section className="py-4">
          <Container>
            <SoftCta
              related={{
                href: "/green-card-renewal-fee",
                label: "Green Card Renewal Fee",
                description:
                  "See the current Form I-90 filing and biometrics fees before you file.",
              }}
            />
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
          <Container>
            <ToolFaq items={greenCardRenewalFaqs} />
          </Container>
        </section>

        {/* Author */}
        <section className="pb-12">
          <Container>
            <AuthorReviewLine lastUpdated={GC_RENEWAL_UPDATED_HUMAN} />
            <AuthorBioBox
              className="mt-6 max-w-3xl"
              tags={["USCIS forms & timelines", "Green card renewal", "Immigrant family planning"]}
            />
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
