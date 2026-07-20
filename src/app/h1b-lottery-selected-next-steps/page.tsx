import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { pageMetadata, type FaqItem } from "@/lib/seo";
import {
  H1bLotteryShell,
  SectionHeading,
  Callout,
  ChecklistCard,
  CompareTable,
  LOTTERY_UPDATED,
} from "@/components/H1bLotteryLayout";

const PAGE_PATH = "/h1b-lottery-selected-next-steps";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Selected: Next Steps After Selection (2026/2027 Guide)",
    description:
      "You were selected in the H1B lottery — now what? A practical next-steps checklist for Indian applicants: confirm your employer, gather documents, the LCA and Form I-129 process, filing window, premium processing, start date, and travel caution.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: "/h1b-lottery-results" },
  { name: "Selected: Next Steps", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "Does being selected in the H1B lottery mean I have an H-1B visa?",
    answer:
      "No. Selection only means your employer is now eligible to file a full cap-subject H-1B petition (Form I-129) for you. USCIS still has to receive and approve that petition, and — if you are outside the US — you may still need visa stamping at a consulate. Selection is the door opening, not the visa.",
  },
  {
    question: "How long does my employer have to file the H-1B petition after selection?",
    answer:
      "USCIS opens a filing window after selection — historically at least 90 days. Your employer must file the complete petition with the selection notice inside that window. Because a certified Labor Condition Application (LCA) is needed first (about seven business days at the Department of Labor), employers usually start LCA work immediately after selection.",
  },
  {
    question: "Should I pay for premium processing myself?",
    answer:
      "Premium processing is an optional faster-decision service. Who pays is between you and your employer — many employers cover it, some ask the employee. It does not change the outcome, only the speed. If your timing is tight (for example, an OPT end date close to October 1), premium processing can be worth discussing with your employer and attorney.",
  },
  {
    question: "When does my H-1B employment start after selection?",
    answer:
      "For cap-subject petitions, the requested start date is normally October 1 of the relevant fiscal year. You cannot begin H-1B employment before that date on the basis of the cap-subject approval. If you are on F-1 OPT that ends before then, cap-gap may bridge the gap: it extends your F-1 status, and your work authorization too if you were in authorized post-completion OPT when the petition was filed, until April 1 of that fiscal year or the approved petition's validity start date, whichever is earlier. Confirm with your DSO and attorney.",
  },
  {
    question: "Is it safe to travel to India after being selected but before approval?",
    answer:
      "Travel while a petition is pending carries risk. Leaving the US can complicate a change-of-status request, and re-entry may require valid visa stamping, which can trigger administrative processing and delays. Do not book non-refundable travel until your attorney confirms the timing is safe for your specific case.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-results", label: "H1B Lottery Results Hub", desc: "How to check status, meaning, and next steps" },
  { href: "/h1b-registration-status-meaning", label: "Registration Status Meaning", desc: "Submitted, Selected, Not Selected, Denied, Invalidated" },
  { href: "/h1b-visa-stamping-after-selection", label: "Visa Stamping After Selection", desc: "Change of status vs consular processing and India stamping" },
  { href: "/h1b-lottery-results-for-f1-opt-students", label: "For F-1 OPT Students", desc: "Cap-gap and OPT-to-H-1B timing" },
  { href: "/h1b", label: "H-1B Guide for Indians", desc: "RFE, premium processing, extension, and travel" },
  { href: "/green-card", label: "Green Card Process for Indians", desc: "Life after H-1B: EB-2/EB-3 and priority dates" },
  { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "Firm up your US–India money picture" },
];

export default function Page() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="H1B Selected"
      h1="H1B Lottery Selected: Your Next Steps After Selection"
      readingTime="~9 min read"
      intro={
        <>
          Congratulations — being selected in the H-1B lottery is a real milestone. But it is the{" "}
          <strong>start of the petition process, not the end</strong>. This guide walks Indian applicants through
          exactly what happens next: confirming your employer is filing, gathering documents, the LCA and Form I-129
          process, the filing window, premium processing, start-date planning, and travel caution.
        </>
      }
      quickAnswer={{
        question: "I was selected — what is the very first thing to do?",
        answer: (
          <>
            Get written confirmation that your employer is actually filing the petition, and ask{" "}
            <strong>when</strong> within the filing window. Everything else — documents, LCA, premium processing,
            travel — depends on that answer. Selection alone does not create an H-1B; the employer must still file and
            USCIS must approve.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="Selected: Next Steps"
      faqs={faqs}
      articleHeadline="H1B Lottery Selected: Next Steps After Selection"
      articleDescription="Practical next-steps checklist after an H-1B lottery selection: confirm your employer, gather documents, LCA and Form I-129, the filing window, premium processing, start date, and travel caution."
      relatedLinks={relatedLinks}
    >
      <section className="bg-white py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm leading-relaxed text-ink-700">
              When your registration is selected, USCIS is telling your employer: <em>you may now file a full,
              cap-subject H-1B petition for this person.</em> The clock that matters now is the{" "}
              <strong>filing window</strong> — historically at least 90 days from the selection notice. Inside that
              window, your employer&rsquo;s immigration attorney has to obtain a certified Labor Condition Application
              (LCA) and assemble the Form I-129 petition with supporting evidence. Your job as the beneficiary is to be
              organized, responsive, and cautious — especially about travel — until the petition is approved.
            </p>

            <Callout tone="good" title="Selection ≠ approval">
              Selection means eligibility to file. USCIS can still approve the petition, issue a Request for Evidence
              (RFE), or deny it. Keep making decisions as if approval is likely but not certain — don&rsquo;t resign
              from a current role or make irreversible commitments on selection alone.
            </Callout>

            <SectionHeading kicker="Step 1" id="confirm">
              Confirm your employer is moving forward
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Not every selected registration turns into a filed petition. Business needs change, budgets shift, and
              occasionally an employer decides not to proceed. So the first step is to remove all ambiguity. Ask your
              employer (and its attorney) in writing to confirm they are filing your cap-subject petition, and ask for
              a realistic filing date within the window. Getting this in email protects you and gives you a paper trail
              if timing questions come up later.
            </p>
            <ChecklistCard
              tone="emerald"
              title="Confirmation checklist"
              items={[
                "Written confirmation that the employer is filing your cap-subject H-1B petition this cycle.",
                "The job title, worksite location(s), and salary that will appear on the LCA and I-129.",
                "Who the attorney is and how they will communicate with you (portal, email, phone).",
                "Whether premium processing will be used and who pays for it.",
                "A target filing date inside the window — not just “soon.”",
              ]}
            />

            <SectionHeading kicker="Step 2" id="documents">
              Gather your documents
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              A well-documented petition moves faster and draws fewer RFEs. For Indian applicants, the degree and
              specialty-occupation evidence matters most — USCIS wants to see that your role genuinely requires a
              bachelor&rsquo;s degree (or higher) in a specific field, and that your qualifications match.
            </p>
            <CompareTable
              columns={["Category", "Documents to have ready"]}
              rows={[
                ["Identity & status", "Passport bio page, current I-94, all prior I-797 approval notices, current EAD (if on OPT/STEM OPT)."],
                ["Education", "Degree certificate(s), full transcripts, and a credential evaluation if your degree is from India and an equivalency is needed."],
                ["Job & specialty", "Detailed job description, org chart, and anything showing the role requires a specific degree field."],
                ["Prior work", "Updated resume, prior experience/employment letters, and any relevant certifications."],
              ]}
            />

            <SectionHeading kicker="Step 3" id="lca-i129">
              Understand the LCA and Form I-129 process
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Before filing, the employer files a Labor Condition Application (LCA, Form ETA-9035) with the Department
              of Labor, attesting to the required wage and working conditions for your role and location. LCA
              certification typically takes about <strong>seven business days</strong>. Once certified, the LCA is
              included in the H-1B petition. The employer then files{" "}
              <strong>Form I-129</strong> (Petition for a Nonimmigrant Worker) with USCIS, along with the selection
              notice, the LCA, fees, and your supporting documents. If you are already in the US in valid status, the
              petition usually also requests a change of status to H-1B; if you are abroad, it requests consular
              notification for visa stamping.
            </p>

            <SectionHeading kicker="Step 4" id="window">
              Filing window and premium processing
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChecklistCard
                tone="sky"
                title="Filing window"
                items={[
                  "USCIS gives at least 90 days from the selection notice to file.",
                  "The petition must be filed inside the window or the selection is lost.",
                  "Employers often file early to leave room for RFEs and stamping.",
                ]}
              />
              <ChecklistCard
                tone="sky"
                title="Premium processing"
                items={[
                  "Optional paid service for a faster USCIS decision (a set number of business days).",
                  "Useful when your OPT/cap-gap timing is tight or you need certainty sooner.",
                  "Does not change the outcome — only the speed of the decision.",
                ]}
              />
            </div>

            <SectionHeading kicker="Step 5" id="start-travel">
              Start date, travel caution, and records
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Cap-subject H-1B employment normally starts <strong>October 1</strong>. You cannot begin H-1B work before
              that date based on the cap-subject approval. If you are on F-1 OPT ending before then, cap-gap may bridge
              you — and it can run past October 1, until April 1 of the relevant fiscal year or the approved
              petition&rsquo;s start date, whichever is earlier. See the{" "}
              <Link href="/h1b-lottery-results-for-f1-opt-students" className="font-semibold text-orange-600 underline">
                F-1 OPT guide
              </Link>
              . On travel: leaving the US while a change-of-status petition is pending can be risky, and re-entry may
              require fresh visa stamping with possible administrative processing. Confirm with your attorney before
              booking anything.
            </p>
            <Callout tone="tip" title="Keep copies of everything">
              Save your selection notice, the I-129 receipt notice (I-797C), any RFE and response, and the final
              approval. You will need them for stamping, extensions, transfers, and eventually your green card process.
            </Callout>

            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <p className="text-sm font-semibold text-orange-900">Back to the hub</p>
              <p className="mt-1 text-sm text-orange-800/80">
                For the full picture — checking results, status meanings, second-lottery odds, and the NRI money
                checklist — return to the{" "}
                <Link href="/h1b-lottery-results" className="font-semibold underline">
                  H1B Lottery Results hub
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
