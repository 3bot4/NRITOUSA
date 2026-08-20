import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import ToolFirstLayout from "@/components/tools/ToolFirstLayout";
import ToolFaq from "@/components/tools/ToolFaq";
import SevisSituationSelector from "@/components/education/SevisSituationSelector";
import ShareWithTagline from "@/components/education/ShareWithTagline";
import { FactTable } from "@/components/education/FactTable";
import {
  getStudentPage,
  getShareCopy,
  getRelated,
  STUDENT_LAST_REVIEWED,
} from "@/lib/studentCluster";
import {
  optRules,
  studentSources,
  STUDENT_DATA_VERIFIED,
} from "@/data/studentClusterData";
import { site } from "@/lib/site";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdGraph,
  pageMetadata,
  type FaqItem,
} from "@/lib/seo";

const page = getStudentPage("sevis-termination-guide")!;
const share = getShareCopy("sevis-termination-guide");
const related = getRelated("sevis-termination-guide");

export const metadata: Metadata = {
  ...pageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.path,
  }),
  keywords: [
    "F1 visa revoked",
    "SEVIS terminated",
    "SEVIS termination reinstatement",
    "F1 status terminated what to do",
    "student visa revocation",
  ],
};

const faq: FaqItem[] = [
  {
    question: "What is the difference between SEVIS termination and visa revocation?",
    answer:
      "They are separate actions by separate agencies with separate consequences. SEVIS termination is a DHS action against your student status record — it ends your F-1 status and any work authorisation attached to it, and it matters while you are inside the US. Visa revocation is a State Department action against the stamp in your passport — it affects your ability to enter the US, and by itself it does not end your status inside the country. You can have one without the other, and the correct response is different for each.",
  },
  {
    question: "My visa was revoked but my SEVIS record is active. Do I have to leave?",
    answer:
      "Generally no. The visa stamp is a travel document used to request entry at the border; it is not what maintains your status inside the US. If your SEVIS record is active and you are maintaining a full course load, you are typically still in status and may still be work-authorised. The practical consequence is that you cannot use that visa to re-enter, so you should not travel internationally. Confirm your SEVIS status with your DSO before drawing any conclusion, and get advice on the stated grounds.",
  },
  {
    question: "How long do I have to apply for reinstatement?",
    answer: `Generally within ${optRules.reinstatementFilingMonths} months of the SEVIS termination date, though the specifics depend on your circumstances. You need to show the violation resulted from circumstances beyond your control, or that not being reinstated would cause extreme hardship, and that you are not deportable on other grounds. You may remain in the US while the application is pending, but you cannot work. Because the window is short and the standard is demanding, get advice quickly rather than researching your way through it.`,
  },
  {
    question: "Can I travel after my SEVIS record is terminated?",
    answer:
      "You should not travel without legal advice first. Airlines routinely flag terminated SEVIS records at check-in, and CBP can refuse entry — particularly if unlawful presence has begun accruing. More importantly, departing can foreclose remedies that are currently available to you, including reinstatement. The instinct to leave quickly is understandable and it is often the wrong move.",
  },
  {
    question: "Should I email USCIS or ICE to explain my situation?",
    answer:
      "Not before an immigration attorney has reviewed what you plan to say. Anything you write to a government agency becomes part of your record and can be used in later adjudications. A well-intentioned explanatory email is one of the most common ways students make a recoverable situation worse. Ask your DSO for the facts first, get advice second, and communicate with agencies through counsel.",
  },
  {
    question: "Can a SEVIS termination be reversed?",
    answer:
      "Yes, in some circumstances. Where a termination was made in error, a DSO may be able to correct it directly. Where it was made without adequate basis or process, attorneys have successfully challenged terminations and courts have ordered records reinstated. Do not treat a termination as final without having someone qualified review the reason code and the facts behind it.",
  },
  {
    question: "What are the most common reasons SEVIS records get terminated?",
    answer: `Falling below a full course load without authorisation, unauthorised employment, exceeding the OPT unemployment limit (${optRules.initialUnemploymentDays} days on initial OPT, ${optRules.aggregateUnemploymentDaysWithStem} aggregate with STEM), failing to report a change of address or employer, not maintaining a valid I-20, and criminal matters. Several of these are administrative and entirely avoidable — a surprising share of terminations trace back to something that was never reported rather than something that was actually done wrong.`,
  },
  {
    question: "Do I still have a 60-day grace period after termination?",
    answer: `Generally no, and this is a critical difference. The ${optRules.gracePeriodDays}-day grace period applies when you complete your program or your OPT ends normally. When a SEVIS record is terminated for a status violation, there is typically no grace period and unlawful presence may begin accruing straight away. That is why the timeline after a termination is measured in days, not months.`,
  },
];

export default function SevisTerminationGuidePage() {
  const url = absoluteUrl(page.path);
  const jsonLd = jsonLdGraph(
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.title,
      description: page.seoDescription,
      url,
      datePublished: STUDENT_DATA_VERIFIED,
      dateModified: STUDENT_DATA_VERIFIED,
      author: { "@id": `${site.url}/#organization` },
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en-US",
      isPartOf: { "@id": `${site.url}/#website` },
    },
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Education", url: "/education" },
      { name: page.label, url: page.path },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolFirstLayout
        toolSlug="sevis-termination-guide"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: page.label },
        ]}
        icon={page.icon}
        category="Education"
        title={page.title}
        hook={page.hook}
        badges={["First 48 hours", "No signup", "Sourced", "Updated monthly"]}
        accent={page.accent}
        sourceNote={
          <>
            Reviewed{" "}
            <time dateTime={STUDENT_DATA_VERIFIED}>{STUDENT_DATA_VERIFIED}</time>.
            Educational information only — not legal advice.
          </>
        }
        disclaimerExtra={
          <p>
            This page is educational information, not legal advice, and reading
            it does not create an attorney-client relationship. Status cases turn
            on facts specific to you. If your record has been terminated or your
            visa revoked, retain an immigration attorney — many offer free
            initial consultations, and the cost of getting this wrong is far
            higher than the cost of advice.
          </p>
        }
      >
        {/* Emergency banner — this page's readers are in a crisis */}
        <section className="pt-6">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 shadow-card sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                If this is happening right now
              </p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink-900">
                Three things, in this order
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-800 marker:font-extrabold marker:text-rose-600">
                <li>
                  <strong>Screenshot everything now.</strong> SEVP Portal, SEVIS
                  status, I-20, EAD, and every email. Records change; dated
                  copies do not.
                </li>
                <li>
                  <strong>Stop working</strong> if you were working on CPT or
                  OPT, today, even if your employer says it is fine.
                </li>
                <li>
                  <strong>Do not write to any government agency</strong> until an
                  attorney has reviewed what you plan to say. Find one through
                  the{" "}
                  <a
                    href={studentSources.ailaLawyerSearch.href}
                    target="_blank"
                    rel="nofollow noopener"
                    className="font-bold text-brand-700 underline"
                  >
                    AILA lawyer search
                  </a>
                  .
                </li>
              </ol>
            </div>
          </Container>
        </section>

        <section className="py-10">
          <Container>
            <SevisSituationSelector />
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ShareWithTagline
                shareText={share.text}
                tagline={share.tagline}
                path={page.path}
                heading="Someone will need this at some point"
              />
            </div>
          </Container>
        </section>

        <section className="pb-12">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                Termination vs revocation, side by side
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Getting these two confused is the most common reason students
                take the wrong action in the first week.
              </p>
              <FactTable
                caption="Two different actions by two different agencies"
                headers={["", "SEVIS termination", "Visa revocation"]}
                rows={[
                  ["Who does it", "DHS / SEVP", "State Department / consulate"],
                  ["What it affects", "Your status inside the US", "The stamp in your passport"],
                  [
                    "Can you stay in the US?",
                    "No — status has ended",
                    "Usually yes, if SEVIS is still active",
                  ],
                  [
                    "Can you keep working?",
                    "No — authorisation ends immediately",
                    "Usually yes, if SEVIS is still active",
                  ],
                  [
                    "Can you re-enter the US?",
                    "Not on that record",
                    "No — you need a new visa",
                  ],
                  [
                    "Grace period",
                    "Generally none",
                    `Unaffected — normal ${optRules.gracePeriodDays} days still apply`,
                  ],
                  [
                    "First thing to check",
                    "The termination reason code and date",
                    "Whether your SEVIS record is still active",
                  ],
                  [
                    "Main remedy",
                    `Reinstatement (within ~${optRules.reinstatementFilingMonths} months) or depart and re-enter on a new I-20`,
                    "Apply for a new visa when you next travel",
                  ],
                ]}
                highlightRows={[2, 3]}
              />

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Why records get terminated
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Most of these are administrative rather than serious — which is
                the frustrating part. A large share trace back to something that
                was never reported rather than something actually done wrong.
              </p>
              <FactTable
                caption="Common termination triggers and whether they were avoidable"
                headers={["Trigger", "Avoidable?", "What prevents it"]}
                rows={[
                  [
                    "Dropped below a full course load",
                    "Almost always",
                    "Get a reduced course load authorised by your DSO in advance — never retroactively.",
                  ],
                  [
                    "Exceeded OPT unemployment days",
                    "Almost always",
                    `Track your total and report qualifying employment in the SEVP Portal. The cap is ${optRules.initialUnemploymentDays} days, ${optRules.aggregateUnemploymentDaysWithStem} aggregate with STEM.`,
                  ],
                  [
                    "Unauthorised employment",
                    "Yes",
                    "Never start work before the authorisation is on your I-20 or your EAD is in hand.",
                  ],
                  [
                    "Failure to report an address or employer change",
                    "Yes",
                    "Report within the required window. This is pure administration and it terminates records regularly.",
                  ],
                  [
                    "I-20 expired without an extension",
                    "Yes",
                    "Request the extension before the program end date, not after.",
                  ],
                  [
                    "School lost SEVP certification",
                    "Not by you",
                    "Verify accreditation and SEVP standing before enrolling — especially for programs marketed on work authorisation.",
                  ],
                  [
                    "Criminal matter",
                    "Varies",
                    "Get an immigration attorney involved immediately, in parallel with criminal counsel.",
                  ],
                ]}
                highlightRows={[1, 3]}
              />

              <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50/50 p-5 sm:p-6">
                <h3 className="text-base font-bold text-ink-900">
                  A note on the current environment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Terminations and revocations affecting international students
                  have been the subject of active litigation, and outcomes have
                  varied. Courts have ordered records reinstated in some cases.
                  The practical implication for you is narrow but important: do
                  not treat an adverse action as final without having someone
                  qualified review it, and do not take irreversible steps —
                  particularly departing the country — before you have.
                </p>
                <p className="mt-2 text-xs text-ink-400">
                  Because this area moves, this page carries a review date rather
                  than claiming to be current. Last reviewed{" "}
                  <time dateTime={STUDENT_DATA_VERIFIED}>
                    {STUDENT_DATA_VERIFIED}
                  </time>
                  . Verify anything time-sensitive with an attorney.
                </p>
              </div>

              <h2 className="mt-10 text-2xl font-bold tracking-tight text-ink-900">
                Where to go next
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block h-full rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <p className="text-sm font-bold text-ink-900">{l.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">
                        {l.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-xs text-ink-400">
                Last reviewed:{" "}
                <time dateTime={STUDENT_LAST_REVIEWED}>
                  {STUDENT_LAST_REVIEWED}
                </time>
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-14">
          <Container>
            <ToolFaq items={faq} />
          </Container>
        </section>

        <section className="pb-16">
          <Container>
            <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-white p-5 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">
                Official sources and help
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  studentSources.reinstatement,
                  studentSources.optUnemployment,
                  studentSources.nafsa,
                  studentSources.ailaLawyerSearch,
                ].map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="nofollow noopener"
                      className="text-brand-600 underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </ToolFirstLayout>
    </>
  );
}
