import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import EadExtensionCalculator from "@/components/tools/EadExtensionCalculator";
import OldVsNewRuleDiagram from "@/components/tools/ead/OldVsNewRuleDiagram";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { FactTable } from "@/components/education/FactTable";
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
import {
  eadProcessingData as D,
  EAD_DATA_NOTE,
  eadSnapshotRows,
  eadSnapshotSources,
  EAD_ESTIMATE_VERIFIED,
  EAD_ESTIMATE_DISCLAIMER,
  eadAutoExtensionRuleStatus as RULE,
  spouseIncidentToStatus as SPOUSE,
  EAD_AUTO_EXTENSION_SUMMARY,
  EAD_OPT_VS_STEM_SUMMARY,
  stemPendingAuth as STEM,
} from "@/data/eadProcessingData";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";
import OfficialSourceNote from "@/components/OfficialSourceNote";
import { formatDate } from "@/lib/format";

/** The (c)(9) range stands in for "most categories" in the copy below. */
const MOST_CATEGORIES =
  D.categories.find((c) => c.key === "c09") ?? D.categories[0];

const PATH = "/ead-renewal-gap";
const TITLE = "EAD Renewal Gap 2026: What to Do Now the Auto-Extension Is Gone";
const DESC =
  "The automatic EAD extension ended for renewals filed on or after October 30, 2025. What that means for your filing date, your employer's Form I-9, and the categories that still have a way out.";

export const metadata: Metadata = pageMetadata({
  title: "EAD Renewal Gap: How to Avoid It",
  description: DESC,
  path: PATH,
});

const faq: FaqItem[] = [
  { question: "What is an EAD renewal gap?", answer: "A gap is any stretch where your old EAD has expired and the renewal is not yet approved. You are not authorized to work during it, and your employer must stop employing you until authorization is restored. Since the automatic extension was removed on October 30, 2025, a gap is now the default outcome whenever USCIS takes longer to decide your renewal than the time you left yourself before expiry." },
  { question: "Does the automatic EAD extension still exist?", answer: `Not through the general renewal route. ${EAD_AUTO_EXTENSION_SUMMARY} For the categories this page is about, that means work stops on the date printed on the card. One F-1 category is outside all of this: a timely-filed STEM OPT extension keeps automatic authorization under a separate provision — see the question on OPT below.` },
  { question: "How early can I file my EAD renewal?", answer: `USCIS generally accepts a renewal up to ${D.renewalFilingWindowDays} days (about six months) before your current EAD expires. With no automatic extension to fall back on, filing on the first day of that window is no longer just good practice — it is the entire buffer you get. File later and you are simply betting that USCIS beats your expiry date.` },
  { question: "What happens on Form I-9 when my EAD expires?", answer: "Your employer must reverify you on or before the expiry date printed on the card. With no automatic extension, an expired EAD plus a Form I-797C receipt notice is no longer acceptable evidence for a renewal filed on or after October 30, 2025 — so if the new card has not arrived, there is nothing to reverify with and the employer must suspend employment. Some employers offer unpaid leave; others terminate. Ask HR what their policy is before you are in the window, not after." },
  { question: "Do L-2 and E spouses need an EAD at all?", answer: `Usually no. E-1, E-2, E-3 and L-2 dependent spouses have been employment-authorized incident to status since ${formatDate(SPOUSE.sinceDate)}, and an unexpired Form I-94 showing ${SPOUSE.codes.join(", ")} is acceptable evidence for Form I-9 on its own. If that is you, the EAD renewal gap largely is not your problem — your I-94 validity is. H-4 spouses are not in this group and still need the (c)(26) EAD.` },
  { question: "Can premium processing help avoid a gap?", answer: `Only for the F-1 (c)(3) categories, which can be premium processed in about 30 business days. It matters most on initial OPT, where nothing covers the wait for the card. It matters least on a STEM extension, which already carries up to ${STEM.pendingAuthDays} days of continued authorization while pending under ${STEM.pendingAuthCite}. Premium processing is not available for the categories most affected by the repeal — H-4 (c)(26) and pending-I-485 (c)(9) — so for those, the filing date is the only lever you control.` },
  { question: "My EAD already expired and the renewal is still pending. What now?", answer: "Stop working and tell your employer immediately — continuing to work is far more damaging than the lost pay. Then check the receipt date on your Form I-797C: if USCIS received the renewal before October 30, 2025, the old extension may still cover you. Ask your attorney whether an expedite request fits your facts, and ask HR about unpaid leave to preserve the job while you wait." },
  { question: "Could the automatic extension come back?", answer: `It might. DHS issued the removal as an interim final rule that took effect the day it published, before the comment period closed on ${formatDate(D.autoExtensionRuleCommentsClosed)}, and it is being challenged in court under the Administrative Procedure Act. ${RULE.planningAdvice}` },
  { question: "Do F-1 OPT and STEM OPT both lose out?", answer: `No, and treating them the same is the most common mistake made about these two categories. ${EAD_OPT_VS_STEM_SUMMARY}` },
  { question: "Is this page legal advice?", answer: "No. This page is educational only and not legal advice. Work-authorization timing is high-stakes and case-specific — confirm your filing window and your status with your immigration attorney, and confirm I-9 handling with your employer." },
];

export default function Page() {
  const jsonLd = jsonLdGraph(
    eadArticleJsonLd({ path: PATH, headline: TITLE, description: DESC, datePublished: EAD_PUBLISHED, dateModified: EAD_UPDATED }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Immigration", url: "/immigration" },
      { name: "EAD Renewal Gap", url: PATH },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ToolFirstLayout
        toolSlug="ead-renewal-gap"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Immigration", href: "/immigration" },
          { label: "EAD Renewal Gap" },
        ]}
        icon="⚠️"
        category="Visa & Green Card"
        title="EAD Renewal Gap: How to Avoid It"
        hook="The automatic extension is gone. What protects your work authorization now is your filing date — and knowing what your employer can legally accept."
        accent="from-amber-500 to-orange-600"
        badges={[`File ${D.renewalFilingWindowDays} days early`, "No auto-extension", "I-9 reverification"]}
        headerExtra={
          <Link href="/ead-processing-time" className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
            Estimate your EAD timeline →
          </Link>
        }
      >
        {/* Fast Answer: EAD timing & auto-extension */}
        <section className="pt-6">
          <Container>
            <FastAnswerSnapshot
              title="EAD renewal — timing & auto-extension"
              accent="emerald"
              rows={eadSnapshotRows}
              badges={["Most EAD 3–8 mo", "Auto-extension ended Oct 30, 2025"]}
              lastVerified={EAD_ESTIMATE_VERIFIED}
              sources={eadSnapshotSources}
              disclaimer={EAD_ESTIMATE_DISCLAIMER}
            />
          </Container>
        </section>

        {/* ── Calculator ─────────────────────────────────────────────── */}
        <section id="extension-calculator" className="scroll-mt-24 border-t border-ink-900/5 py-10 sm:py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                Does an automatic extension apply to you, and when does it end?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                One date decides almost all of it: when USCIS <em>received</em>{" "}
                your renewal. Put in your category and two dates and you get the
                answer, the legal basis for it, and the exact last day you are
                authorised to work.
              </p>
            </div>
            <div className="mt-6">
              <EadExtensionCalculator />
            </div>
          </Container>
        </section>

        {/* ── Old rule vs current rule ───────────────────────────────── */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <div className="mx-auto max-w-[760px]">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                Old rule vs current rule, by filing date
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Two renewals that look identical can sit on opposite sides of
                this line, because what separates them is a receipt date rather
                than anything about the applicant.
              </p>
              <OldVsNewRuleDiagram />
            </div>
          </Container>
        </section>

        <section className="pb-10 pt-10 sm:pb-12">
          <Container>
            <div className="mx-auto max-w-3xl space-y-8">
              {/* ── What changed ───────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">What changed on October 30, 2025</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  For years, filing your EAD renewal on time bought you a cushion: your
                  work authorization continued automatically while USCIS worked through
                  the case — first 180 days, then up to {D.autoExtensionDays} days after a
                  2024 rule. That cushion is gone. A DHS interim final rule
                  ({D.autoExtensionRuleCitation}), effective October 30, 2025, ended the
                  practice of automatically extending an EAD when a renewal is timely
                  filed. DHS&rsquo;s stated reason was to screen and vet applicants before
                  granting a further period of work authorization.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The practical effect is blunt. Your authorization now ends on the date
                  printed on your card, whether or not you filed early and whether or not
                  USCIS is sitting on your renewal. Filing on time no longer protects
                  you — it only starts the clock.
                </p>

                <FactTable
                  caption="Before and after the repeal"
                  headers={["", "Renewal received before Oct 30, 2025", "Renewal received on/after Oct 30, 2025"]}
                  rows={[
                    [
                      "Work authorization after the card expires",
                      `Continues automatically, up to ${D.autoExtensionDays} days`,
                      "Ends on the printed expiry date",
                    ],
                    [
                      "Form I-9 evidence while pending",
                      "Expired EAD + Form I-797C receipt notice",
                      "None — nothing to reverify with until the new card arrives",
                    ],
                    [
                      "What protects you from a gap",
                      "The extension did",
                      "Only the lead time you left before expiry",
                    ],
                    [
                      "If USCIS is slow",
                      "You keep working",
                      "You stop working",
                    ],
                  ]}
                  highlightRows={[0, 3]}
                  note={
                    <>
                      This table describes the general renewal mechanism at 8 CFR
                      § 274a.13(d), which the rule switched off for applications received
                      on or after the cutoff by adding § 274a.13(e). Three things sit
                      outside it: applications USCIS received <em>before</em> the cutoff,
                      which keep their extension; anything extended by separate statutory
                      authority or by an applicable Federal Register notice, the TPS
                      documentation notices being the standing example; and a timely-filed
                      STEM OPT extension, which carries up to {STEM.pendingAuthDays} days
                      of continued authorisation under {STEM.pendingAuthCite} — a
                      different provision the rule did not amend. The{" "}
                      <em>receipt</em> date on your Form I-797C, not the date you posted
                      it, decides which column you are in.
                    </>
                  }
                />
              </div>

              {/* ── Which column are you in ────────────────────────────── */}
              <div id="by-category" className="scroll-mt-24">
                <h2 className="text-xl font-bold text-ink-900">
                  By category code, because the answer is not the same for everyone
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  The code in the eligibility-category box on your EAD decides
                  three separate things: whether you ever had an automatic
                  extension to lose, whether anything authorises you to work
                  while the application is pending, and whether premium
                  processing is even an option. Most summaries collapse all EADs
                  into one answer, and the collapse is wrong in both directions.
                </p>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-900/10 shadow-card">
                  <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                    <caption className="sr-only">
                      EAD categories, whether an automatic extension applied
                      before the repeal, authorisation while pending, and
                      premium eligibility
                    </caption>
                    <thead>
                      <tr className="bg-ink-50/70 text-xs uppercase tracking-wide text-ink-500">
                        <th scope="col" className="p-3 font-semibold">Code</th>
                        <th scope="col" className="p-3 font-semibold">Who it is</th>
                        <th scope="col" className="p-3 font-semibold">
                          Auto-extension before {formatDate(D.autoExtensionRemovedDate)}
                        </th>
                        <th scope="col" className="p-3 font-semibold">
                          Authorised while pending now?
                        </th>
                        <th scope="col" className="p-3 font-semibold">Premium?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-900/5 bg-white">
                      {D.categories
                        .filter((c) => c.key !== "other")
                        .map((c) => (
                          <tr key={c.key} className="align-top">
                            <th scope="row" className="p-3 text-left font-semibold text-ink-900">
                              {c.code}
                            </th>
                            <td className="p-3 text-ink-600">{c.label}</td>
                            <td className="p-3">
                              {c.autoExtensionPreRule ? (
                                <span className="font-semibold text-amber-700">
                                  Yes — up to {D.autoExtensionDays} days, now gone
                                </span>
                              ) : (
                                <span className="text-ink-400">
                                  Never had one
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {c.pendingAuthDays ? (
                                <span className="font-semibold text-emerald-700">
                                  Yes — up to {c.pendingAuthDays} days
                                  <span className="mt-0.5 block text-xs font-normal text-ink-400">
                                    {c.pendingAuthCite}
                                  </span>
                                </span>
                              ) : (
                                <span className="font-semibold text-rose-700">No</span>
                              )}
                            </td>
                            <td className="p-3 text-ink-600">
                              {c.premiumEligible ? "Yes" : "No"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Read the last two columns together. The (c)(3)(C) row is the
                  only one here that still has anything holding it up while the
                  application sits with USCIS, and it is a different provision
                  from the renewal mechanism the October 2025 rule switched off
                  — which is why it survived. The H-4 and adjustment-based rows
                  are the ones that lost the most: they had up to{" "}
                  {D.autoExtensionDays} days of cover and now have none, and
                  they have no premium option to buy their way out with. For
                  those,{" "}
                  <Link href="/uscis/expedite-request" className="text-brand-600 underline">
                    an expedite request
                  </Link>{" "}
                  is the only lever left, and it is a weak one.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-ink-900">Which column are you in?</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Three things decide whether any extension still covers you. Work through
                  them in order.
                </p>
                <ol className="mt-4 space-y-3">
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      1. Find the <em>Received Date</em> on your Form I-797C
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      Not the date you mailed it, not the date you paid — the date USCIS
                      recorded receipt. Before October 30, 2025 and you may still be
                      running on the old up-to-{D.autoExtensionDays}-day extension. On or
                      after it, you are not.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      2. Check whether your extension comes from somewhere else
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      The repeal targeted one mechanism: the automatic extension for
                      timely-filed renewals. Extensions written into statute, or announced
                      for a specific population in a Federal Register notice — TPS
                      designations being the common case — run on their own terms and are
                      unaffected. If your EAD&rsquo;s validity was extended by a notice
                      naming your country or category, read that notice, not this rule.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      3. Check whether you need an EAD at all
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      E and L dependent spouses do not. See the next section — it is the
                      one group for whom this rule change is mostly noise.
                    </p>
                  </li>
                </ol>
              </div>

              {/* ── E/L spouses ────────────────────────────────────────── */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h2 className="text-lg font-bold text-ink-900">
                  L-2 and E spouses: you may not need the EAD in the first place
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Since {formatDate(SPOUSE.sinceDate)}, E-1, E-2, E-3 and L-2 dependent spouses have
                  been employment-authorized <strong>incident to status</strong>. Since{" "}
                  {formatDate(SPOUSE.i94CodesSinceDate)}, USCIS and CBP issue Form I-94 with the
                  spouse codes {SPOUSE.codes.join(", ")}, and an unexpired I-94 carrying
                  one of those codes is acceptable Form I-9 evidence on its own. You may
                  still apply for an EAD card if you want one, but you are not required
                  to — which means the renewal gap this page is about mostly does not
                  reach you. Your exposure is your <strong>I-94 expiry</strong>, so track
                  that date instead.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  <strong>H-4 spouses are not in this group.</strong> H-4 work
                  authorization still requires an approved (c)(26) EAD in hand, which is
                  why H-4 families absorbed the sharpest end of the repeal.{" "}
                  <Link href="/tools/h4-ead-navigator" className="font-semibold text-brand-600 underline">
                    Map your H-4 EAD timing →
                  </Link>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Sources:{" "}
                  <a href={SPOUSE.policyManualUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    USCIS Policy Manual Vol. 10, Pt. B, Ch. 2
                  </a>{" "}
                  ·{" "}
                  <a href={SPOUSE.i9HandbookUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    M-274 Handbook for Employers §7.9.2
                  </a>
                </p>
              </div>

              {/* ── The playbook ───────────────────────────────────────── */}
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  The playbook now that timing is the only protection
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  If you still need an EAD, every remaining lever is about buying lead
                  time. In order of how much they actually help:
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      File on the first day of the {D.renewalFilingWindowDays}-day window
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      USCIS accepts a renewal up to {D.renewalFilingWindowDays} days before
                      expiry. Against the {MOST_CATEGORIES.monthsLow}&ndash;
                      {MOST_CATEGORIES.monthsHigh} month planning range for most
                      categories, six months of lead time is the difference between
                      comfortable and unemployed. Put the date in your calendar the day
                      your current card arrives — that is the moment you know it.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Do not let a dependent filing wait on the principal
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      An H-4 EAD cannot be approved for longer than the underlying H-4
                      status, and H-4 status tracks the H-1B principal. If the H-1B
                      extension is filed late, the H-4 and its EAD inherit the delay and
                      the shortened validity. Sequence the household&rsquo;s filings
                      together rather than one at a time.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Use premium processing where it exists — the F-1 (c)(3) categories only
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      The (c)(3) student categories can be premium processed at about 30
                      business days. The categories hit hardest by the repeal — (c)(26)
                      H-4 and (c)(9) pending adjustment — cannot. Do not plan around a
                      premium option your category does not have. And note that the two
                      F-1 categories are not in the same position: a timely-filed STEM
                      extension already carries up to {STEM.pendingAuthDays} days of
                      continued authorisation while pending under {STEM.pendingAuthCite},
                      whereas on initial OPT nothing covers the wait for the card.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
                    <p className="text-sm font-bold text-ink-900">
                      Treat &ldquo;approved&rdquo; and &ldquo;in hand&rdquo; as different dates
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      An approval notice is not work authorization; the card is. Card
                      production and mail add time after approval, and a card returned as
                      undeliverable adds weeks more. Keep your address current with USCIS
                      and watch for the card&rsquo;s tracking, not just the status change.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── I-9 reality ────────────────────────────────────────── */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h2 className="text-lg font-bold text-ink-900">
                  What your employer must do (Form I-9)
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Your employer reverifies you on or before the expiry date on your card.
                  Under the old rule, an expired EAD plus the Form I-797C receipt notice
                  for a timely-filed renewal was acceptable evidence and employment simply
                  continued. For a renewal received on or after October 30, 2025 there is
                  no such document combination — so if the new card has not arrived, your
                  employer has nothing to reverify with and must suspend employment.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  What happens next is your employer&rsquo;s policy, not immigration law:
                  some place you on unpaid leave and hold the role, others terminate with
                  a right to reapply. That distinction decides whether a two-month delay
                  is an inconvenience or a job loss, and it is knowable in advance.{" "}
                  <strong>Ask HR which one they do while your card is still valid.</strong>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Whatever you do, do not keep working past the expiry date on an
                  assumption. Unauthorized employment carries consequences for your own
                  immigration record that outlast any gap in pay.
                </p>
              </div>

              {/* ── Rule status ────────────────────────────────────────── */}
              <div className="rounded-2xl border border-ink-900/10 bg-ink-50/60 p-5">
                <h2 className="text-lg font-bold text-ink-900">Where the rule stands</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  DHS issued the repeal as an <strong>interim final rule</strong> — it took
                  effect on the day it published, with comments collected afterwards and
                  closing on {formatDate(D.autoExtensionRuleCommentsClosed)}. {RULE.litigation}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  {RULE.planningAdvice}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Rule status verified {formatDate(RULE.verified)}. Primary source:{" "}
                  <a href={D.autoExtensionRuleUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {D.autoExtensionRuleCitation} — Removal of the Automatic Extension of
                    Employment Authorization Documents
                  </a>
                  .
                </p>
              </div>

              <OfficialSourceNote
                lastVerified={RULE.verified}
                sources={[
                  { label: "DHS interim final rule (90 FR 48799)", href: D.autoExtensionRuleUrl },
                  { label: "USCIS M-274 §5.0 — automatic extensions (what an employer may accept)", href: D.autoExtensionInfoUrl },
                  { label: "USCIS Form I-765", href: "https://www.uscis.gov/i-765" },
                  { label: "USCIS Processing Times", href: D.uscisProcessingTimesUrl },
                ]}
              />

              <p className="text-xs text-ink-500">{EAD_DATA_NOTE}</p>
            </div>
          </Container>
        </section>

        {/* internal links */}
        <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
          <Container>
            <PermClusterLinks title="Related EAD tools" links={[...eadClusterLinks.filter((l) => l.href !== PATH), ...eadRelatedLinks]} />
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
