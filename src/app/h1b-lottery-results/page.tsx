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
  FY_LABEL,
  LOTTERY_UPDATED,
} from "@/components/H1bLotteryLayout";

const PAGE_PATH = "/h1b-lottery-results";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "H1B Lottery Results 2026/2027: How to Check Status, Selection Meaning, and Next Steps",
    description:
      "Learn how to check H1B lottery results, what selected or not selected means, second lottery chances, next steps after selection, and options for F-1 OPT, STEM OPT, H-4, and immigrant families.",
    path: PAGE_PATH,
    type: "article",
    openGraph: { publishedTime: LOTTERY_UPDATED, modifiedTime: LOTTERY_UPDATED },
  });
}

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Immigration", url: "/immigration" },
  { name: "H1B Lottery Results", url: PAGE_PATH },
];

const faqs: FaqItem[] = [
  {
    question: "How do I check my H1B lottery result?",
    answer:
      "H1B registration results are shown inside the USCIS online organizational account used to submit the registration — that account belongs to your employer or its immigration attorney, not to you as the employee. In most cases you learn your result when your employer or the company's lawyer tells you. Each registration in that account shows a status such as Submitted, Selected, or Not Selected. If you have your own myUSCIS account and were registered, you may also see a status there, but the employer's account is the authoritative source.",
  },
  {
    question: "Can I check H1B lottery results myself?",
    answer:
      "Usually not directly. The lottery (electronic registration) is run through the employer's USCIS organizational account, so the employer or attorney sees the official result first and is expected to inform you. You cannot walk into a public USCIS page and look up your name. If you created a personal myUSCIS account before registration, a status may appear there, but the safest step is to ask your employer or its immigration attorney in writing for your exact registration status.",
  },
  {
    question: "What does selected mean in H1B lottery?",
    answer:
      "\"Selected\" means your registration was chosen in the lottery and your employer is now eligible to file a full, cap-subject H-1B petition (Form I-129) for you during the USCIS filing window. It is an invitation to file — not a visa, not an approval, and not a guarantee of an H-1B. USCIS still has to receive and approve the petition. Being selected is the milestone that lets the real petition begin.",
  },
  {
    question: "What does submitted mean after H1B lottery?",
    answer:
      "\"Submitted\" means your registration was successfully entered and the registration fee was paid, and it is in the pool waiting for the selection to run — or it was in the pool for a selection round that has not yet chosen it. It is not a selection. After the main selection runs, a Submitted registration that was not chosen stays Submitted (still eligible for any later selection round in the same fiscal year) rather than flipping to Not Selected.",
  },
  {
    question: "What happens if my H1B lottery is not selected?",
    answer:
      "If you are not selected, your employer cannot file a cap-subject H-1B for you this fiscal year. You keep whatever status you already hold — for many Indians that is F-1 OPT or STEM OPT. Common next steps are staying on OPT/STEM OPT if eligible, looking at cap-exempt H-1B employers (universities, affiliated nonprofits, research organizations), considering L-1 if you work abroad for the same company, exploring O-1 only with strong achievements, or planning to re-enter next year's lottery. Being not selected is common and does not mean you did anything wrong.",
  },
  {
    question: "Can there be a second H1B lottery?",
    answer:
      "Sometimes. If USCIS does not receive enough petitions from the first round of selections to reach the annual cap, it can run one or more additional selection rounds later in the year from the same registration pool. This has happened in several past years, but it is never guaranteed and USCIS does not announce it in advance. Keep your registration status visible through your employer and watch official USCIS updates rather than relying on rumors.",
  },
  {
    question: "When can my employer file the H1B petition after selection?",
    answer:
      "After selection, USCIS opens a filing window (historically at least 90 days) during which your employer must file the full cap-subject H-1B petition (Form I-129) with the selection notice. The employer typically needs a certified Labor Condition Application (LCA) from the Department of Labor first, which takes about seven business days. Employers often file early in the window and can request premium processing for a faster decision.",
  },
  {
    question: "Does H1B lottery selection mean approval?",
    answer:
      "No. Selection only means your employer may now file the petition. USCIS still reviews the full I-129 petition and can approve it, issue a Request for Evidence (RFE), or deny it. A clean, well-documented specialty-occupation petition with a matching LCA has the best chance. Do not make irreversible plans — such as resigning from another job or non-refundable travel — on selection alone.",
  },
  {
    question: "What should F-1 OPT students do after H1B selection?",
    answer:
      "If you are on F-1 OPT or STEM OPT and your registration is selected and your employer files the petition on time with an October 1 start, cap-gap relief generally extends your F-1 status and work authorization past your OPT end date until the petition is decided (up to the start date). Confirm your OPT end date, tell your DSO, keep your I-20 and EAD current, and make sure your employer files during the window. Get a cap-gap I-20 from your school's international office.",
  },
  {
    question: "What are my options if I am not selected?",
    answer:
      "Options depend on your current status. If you are on F-1 OPT, check whether you qualify for the 24-month STEM OPT extension. Look at cap-exempt H-1B employers, L-1 (if you have a year abroad with the same multinational), O-1 for extraordinary ability, H-4/H-4 EAD if your spouse holds status, or another degree program. Many people simply re-enter next year's lottery while staying in valid status. Avoid risky shortcuts, and build a financial and travel backup plan while you decide.",
  },
];

const relatedLinks = [
  { href: "/h1b-lottery-chance-calculator", label: "H-1B Lottery Chance Calculator", desc: "Estimate your FY 2027 selection odds by wage level" },
  { href: "/h1b", label: "H-1B Guide for Indians", desc: "Transfer, extension, RFE, premium processing, and travel" },
  { href: "/h1b-layoff", label: "H-1B Layoff Checklist", desc: "60-day window, I-140, H-4 family, and money runway" },
  { href: "/h1b-sponsors", label: "H-1B Sponsor Finder", desc: "Search employers that filed H-1B petitions" },
  { href: "/green-card", label: "Green Card Process for Indians", desc: "EB-2/EB-3, I-140, priority date, and I-485" },
  { href: "/tools/fbar-fatca-checker", label: "FBAR / FATCA Checker", desc: "US reporting for NRE/NRO, FDs, and Indian mutual funds" },
  { href: "/india-tax-compliance", label: "India Tax & Compliance", desc: "FBAR, FATCA, DTAA, ITR, TDS, and repatriation" },
  { href: "/trump-account-h1b-immigrant-families", label: "Trump Account for H-1B Families", desc: "Child savings account rules for immigrant families" },
  { href: "/free-immigrant-wealth-guide", label: "Free Immigrant Wealth Guide", desc: "Money playbook for Indian immigrants in the USA" },
  { href: "/nri-wealth-checkup", label: "NRI Wealth Checkup", desc: "Educational US–India money and reporting checklist" },
  { href: "/calculators", label: "NRI Calculators & Tools", desc: "Every free calculator and checklist in one place" },
];

const statusTableRows: (string | React.ReactNode)[][] = [
  ["Submitted", "Registration was accepted and paid; sitting in the pool, not yet chosen.", "Wait. Stay in valid status. It may still be selected in a later round."],
  ["Selected", "Chosen in the lottery; employer may now file a cap-subject petition.", "Confirm your employer is filing; gather documents; plan the LCA + I-129."],
  ["Not Selected", "Not chosen after all selection rounds for the year.", "Stay on OPT/STEM OPT if eligible; explore cap-exempt, L-1, O-1; re-register next year."],
  ["Denied", "A duplicate registration for the same person by the same employer.", "Ask the employer/attorney to fix duplicate filings; only one registration per person per employer counts."],
  ["Invalidated – Failed Payment", "Registration was invalidated because the fee payment did not clear.", "Not eligible for selection. Employer must re-check payment and registration handling."],
];

const cardWrap = "grid gap-3 sm:grid-cols-2";

export default function H1bLotteryResultsPage() {
  return (
    <H1bLotteryShell
      path={PAGE_PATH}
      badge="H1B Lottery Results"
      h1="H1B Lottery Results 2026/2027: How to Check Status and What to Do Next"
      readingTime="~14 min read"
      intro={
        <>
          H1B lottery (electronic registration) results are released inside{" "}
          <strong>USCIS online accounts belonging to employers or their immigration attorneys</strong> — not to
          employees directly. If you are on F-1 OPT, STEM OPT, H-1B, or H-4, you usually hear your result from your
          employer or the company&rsquo;s immigration lawyer. This guide, written for Indian immigrants and their
          families, explains how to check results, what each status means, what to do if you are selected or not
          selected, whether a second lottery may happen, and the financial steps that protect your family either way.
        </>
      }
      quickAnswer={{
        question: "Are H1B lottery results out?",
        answer: (
          <>
            USCIS runs the H-1B registration selection once per year, typically in <strong>March</strong>, and can
            run additional rounds later if the cap is not reached. This page is maintained for the latest{" "}
            <strong>{FY_LABEL} cap season</strong> and is reviewed each year. Because results appear in the
            employer&rsquo;s USCIS account first, the fastest way to know your status is to ask your employer or its
            immigration attorney in writing. Do not rely on social-media rumors about exact dates.
          </>
        ),
      }}
      crumbs={crumbs}
      crumbLabel="H1B Lottery Results"
      faqs={faqs}
      articleHeadline="H1B Lottery Results 2026/2027: How to Check Status, Selection Meaning, and Next Steps"
      articleDescription="How to check H1B lottery results, what Submitted / Selected / Not Selected / Denied / Invalidated mean, second-lottery chances, next steps after selection, and options for F-1 OPT, STEM OPT, H-4, and immigrant families."
      relatedLinks={relatedLinks}
    >
      {/* quick nav */}
      <section className="bg-white pb-2">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "summary", label: "Quick summary" },
                { id: "how-to-check", label: "How to check" },
                { id: "status-meaning", label: "Status meaning" },
                { id: "selected", label: "If selected" },
                { id: "not-selected", label: "If not selected" },
                { id: "second-lottery", label: "Second lottery" },
                { id: "opt", label: "F-1 OPT / STEM" },
                { id: "h4", label: "H-4 families" },
                { id: "money", label: "NRI money" },
                { id: "faq", label: "FAQ" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-full border border-ink-900/10 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 hover:border-orange-400 hover:text-orange-700"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Quick summary */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="summary" kicker="Start here">
              Quick summary
            </SectionHeading>
            <ul className="space-y-2.5">
              {[
                ["Who can check results", "The employer or its immigration attorney checks the USCIS organizational account. Employees usually hear the result from the employer/lawyer."],
                ["What “Selected” means", "Your registration was chosen; the employer may now file a full cap-subject H-1B petition. It is not an approval or a visa."],
                ["What “Submitted” means", "Your registration is in the pool and paid, but not yet chosen. It can still be selected in a later round the same year."],
                ["What “Not Selected” means", "You were not chosen this year. You keep your current status (often F-1 OPT/STEM OPT) and can re-register next year."],
                ["When petition filing starts", "After selection, USCIS opens a filing window (historically 90+ days). The employer files Form I-129 with the selection notice and a certified LCA."],
                ["Whether a second lottery may happen", "Possibly. USCIS can run more selection rounds if the cap is not reached — but it is never guaranteed or pre-announced."],
                ["What F-1 OPT/STEM OPT students should do", "Confirm your OPT end date, ask your employer to file on time, and get a cap-gap I-20 from your DSO if selected."],
              ].map(([t, d]) => (
                <li key={t as string} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <span className="mt-0.5 flex-none text-orange-400">▸</span>
                  <span className="text-sm text-ink-700">
                    <strong className="text-ink-900">{t}:</strong> {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How to check */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="how-to-check" kicker="Step 1">
              How to check H1B lottery results
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              The H-1B cap lottery runs through the USCIS <strong>electronic registration</strong> system. Your
              employer (or the law firm it uses) registers you inside a USCIS <em>organizational account</em> and pays
              the registration fee. When USCIS runs the selection, the result appears against your registration inside
              that same account. That is why, as an employee, you almost always learn your result second-hand.
            </p>
            <div className="space-y-2.5">
              {[
                "Your employer or its immigration attorney logs into the USCIS organizational account and opens the registration for the current fiscal year.",
                "Each registration shows a status (Submitted, Selected, Not Selected, Denied, or Invalidated). The attorney or HR normally emails selected candidates first.",
                "As an employee, you usually cannot check directly. If you created a personal myUSCIS account before registration, a status may appear there, but treat the employer's account as authoritative.",
                "A Selection Notice (with a beneficiary confirmation number) is required for the employer to file the cap-subject petition. Ask for a copy for your records.",
                "If you are unsure, ask your employer or attorney in writing: “What is my exact H-1B registration status for this fiscal year?” Keep the reply.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-ink-900/5 bg-white p-4">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-orange-300 text-[10px] font-bold text-orange-600">
                    ✓
                  </span>
                  <p className="text-sm text-ink-700">{item}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-ink-900">Status → meaning → what to do next</p>
              <CompareTable columns={["Status", "What it means", "What to do next"]} rows={statusTableRows} />
            </div>
            <Callout tone="tip" title="Tip for Indian applicants">
              If a staffing/consulting firm registered you, ask specifically whether{" "}
              <em>only one</em> registration was submitted for you. Since the beneficiary-centric rules, each person
              gets one entry regardless of how many employers register them — multiple duplicate registrations by the
              same employer can lead to a <strong>Denied</strong> status.
            </Callout>
          </div>
        </Container>
      </section>

      {/* Status meaning */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="status-meaning" kicker="Step 2">
              H1B registration status meaning
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Here is what each status in the USCIS registration system means, in plain language. For a deeper walk-through
              of each one, see the dedicated{" "}
              <Link href="/h1b-registration-status-meaning" className="font-semibold text-orange-600 underline">
                H-1B registration status meaning guide
              </Link>
              .
            </p>
            <div className={cardWrap}>
              {[
                { t: "Submitted", d: "Registration accepted and fee paid. It is in the pool but not yet chosen. It stays Submitted (not Not Selected) until a round selects it or the year ends." },
                { t: "Selected", d: "Chosen in the lottery. Your employer may file a full cap-subject H-1B petition during the filing window. Not an approval." },
                { t: "Not Selected", d: "Not chosen after all selection rounds for the fiscal year. No cap-subject petition can be filed for you this year." },
                { t: "Denied", d: "A duplicate registration was found — the same employer submitted more than one registration for the same person. Only one counts." },
                { t: "Invalidated – Failed Payment", d: "The registration fee payment did not go through, so the registration was invalidated and is not eligible for selection." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* If selected */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="selected" kicker="Step 3">
              What to do if your H1B lottery is selected
            </SectionHeading>
            <Callout tone="good" title="Selected is a beginning, not the finish line">
              Selection lets your employer file the petition — USCIS still has to approve it. Move quickly and calmly,
              and keep copies of everything. Full detail:{" "}
              <Link href="/h1b-lottery-selected-next-steps" className="font-semibold underline">
                H-1B selected: next steps
              </Link>
              .
            </Callout>
            <div className={cardWrap}>
              <ChecklistCard
                tone="emerald"
                title="Confirm and prepare"
                items={[
                  "Confirm in writing that your employer is actually moving forward and filing the petition.",
                  "Gather documents: passport, I-94, prior I-797s, degree certificates, transcripts, resume, and any evaluation.",
                  "Understand the LCA + Form I-129 process — the employer needs a certified LCA (about 7 business days) before filing.",
                  "Note the filing window (historically 90+ days) and ask when your employer plans to file.",
                ]}
              />
              <ChecklistCard
                tone="emerald"
                title="Plan and protect"
                items={[
                  "Ask whether premium processing (faster USCIS decision) will be requested.",
                  "Plan your start date — cap-subject H-1B employment usually begins October 1.",
                  "Be cautious about international travel while the petition is pending or before stamping.",
                  "Keep copies of the selection notice, receipt notice (I-797C), and every approval.",
                ]}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* If not selected */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="not-selected" kicker="Step 4">
              What to do if your H1B lottery is not selected
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Not being selected is common — in recent years the odds for a single registration have been well below
              50%. It is not a reflection on you. You keep whatever status you already hold, and you have real options.
              See the full playbook:{" "}
              <Link href="/h1b-lottery-not-selected-options" className="font-semibold text-orange-600 underline">
                H-1B not selected: options
              </Link>
              .
            </p>
            <div className={cardWrap}>
              {[
                { t: "Stay on F-1 OPT / STEM OPT", d: "If you are on OPT and hold a STEM degree, check the 24-month STEM OPT extension to keep working and re-enter next year's lottery." },
                { t: "Cap-exempt H-1B employers", d: "Universities, affiliated nonprofits, and research organizations can file H-1B without the lottery, all year round." },
                { t: "L-1 if working abroad", d: "If you can work for the same multinational abroad for a year, an L-1 intra-company transfer may bring you back cap-free." },
                { t: "O-1 only with strong achievements", d: "The extraordinary-ability visa is demanding — realistic only with awards, publications, or major recognition." },
                { t: "H-4 / H-4 EAD if married", d: "If your spouse holds H-1B (with an approved I-140) or a green card, H-4 or H-4 EAD may keep you and any work authorization intact." },
                { t: "Avoid risky shortcuts", d: "Steer clear of “guaranteed” lottery schemes, day-1 CPT mills, or status gaps. They can permanently damage your immigration record." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
            <Callout tone="warn" title="Build a financial emergency plan">
              Whether you re-register or switch strategies, keep a cash runway (ideally 6+ months), maintain health
              insurance, and know your India-side liquidity. See the{" "}
              <a href="#money" className="font-semibold underline">
                NRI financial checklist
              </a>{" "}
              below.
            </Callout>
          </div>
        </Container>
      </section>

      {/* Second lottery */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="second-lottery" kicker="Step 5">
              Will there be a second H1B lottery?
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              USCIS may run one or more additional selection rounds if it does not receive enough petitions from the
              first round to reach the annual cap (65,000 regular plus 20,000 for U.S. master&rsquo;s degree holders).
              This has happened in several past years — but it is <strong>never guaranteed</strong> and is not announced
              ahead of time.
            </p>
            <div className={cardWrap}>
              <ChecklistCard
                tone="sky"
                title="What is true"
                items={[
                  "A later selection round can pull from the same Submitted pool — you don't re-register for it.",
                  "Your status stays “Submitted” (not “Not Selected”) while additional rounds remain possible.",
                  "USCIS posts official updates on its website when it runs another round.",
                ]}
              />
              <ChecklistCard
                tone="sky"
                title="What to do"
                items={[
                  "Keep your employer registration active and your details current with the attorney.",
                  "Watch official USCIS announcements — not social-media rumors — for a second round.",
                  "Keep your backup plan (STEM OPT, cap-exempt, next year) ready in case no second round happens.",
                ]}
              />
            </div>
            <p className="text-xs text-ink-500">
              Deeper detail:{" "}
              <Link href="/h1b-second-lottery" className="font-semibold text-orange-600 underline">
                Will there be a second H-1B lottery?
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* F-1 OPT / STEM OPT */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="opt" kicker="Step 6">
              Special guidance for F-1 OPT and STEM OPT students
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Most Indian H-1B candidates are on F-1 OPT or STEM OPT when the lottery runs. The critical concept is{" "}
              <strong>cap-gap</strong> — the bridge that keeps you in status between an OPT end date and an October 1
              H-1B start. Full guide:{" "}
              <Link href="/h1b-lottery-results-for-f1-opt-students" className="font-semibold text-orange-600 underline">
                H-1B lottery results for F-1 OPT students
              </Link>
              .
            </p>
            <div className={cardWrap}>
              {[
                { t: "Know your OPT end date", d: "Find the exact end date on your EAD card. Your cap-gap and backup timing revolve around it." },
                { t: "Check STEM OPT eligibility", d: "A qualifying STEM degree + E-Verify employer can add 24 months — a strong safety net if not selected." },
                { t: "Understand cap-gap basics", d: "If selected with a timely, October-1 petition, cap-gap generally extends your F-1 status/work authorization until the petition is decided." },
                { t: "Employer communication checklist", d: "Confirm the employer will file on time, request a cap-gap I-20 from your DSO, and keep your I-20/EAD current." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* H-4 families */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="h4" kicker="Step 7">
              H1B lottery results for H-4 families
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              A lottery result affects the whole family, not just the primary applicant. If you are planning around a
              spouse&rsquo;s H-1B or your own H-4 status, map the family impact early. Full guide:{" "}
              <Link href="/h1b-lottery-results-for-h4-families" className="font-semibold text-orange-600 underline">
                H-1B lottery results for H-4 families
              </Link>
              .
            </p>
            <div className={cardWrap}>
              {[
                { t: "Spouse planning", d: "A selection may let a spouse move to H-4 (and possibly H-4 EAD later). A non-selection may mean staying on the current plan." },
                { t: "H-4 EAD considerations", d: "H-4 EAD generally requires the H-1B principal to have an approved I-140 — a lottery win alone does not create H-4 EAD eligibility." },
                { t: "Child school continuity", d: "Plan school enrollment and any move around the October 1 start and the filing timeline, not around rumors." },
                { t: "Health insurance & emergency fund", d: "Keep continuous coverage during any status change, and hold an emergency fund that covers a filing that slips or is denied." },
                { t: "Moving back to India", d: "If plans don't work out, think through RNOR status, 401(k), children's schooling, and currency timing before deciding." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="text-sm font-semibold text-ink-900">{c.t}</p>
                  <p className="mt-1 text-xs text-ink-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* NRI money */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <SectionHeading id="money" kicker="Step 8">
              NRI financial checklist after H1B lottery results
            </SectionHeading>
            <p className="text-sm leading-relaxed text-ink-700">
              Selected or not, a lottery result is a good moment to firm up your US–India money picture. This is where
              NRItoUSA helps most.
            </p>
            <div className={cardWrap}>
              <ChecklistCard
                title="Stability in the US"
                items={[
                  "Emergency fund: aim for 6+ months of expenses in case a petition slips, is denied, or a job changes.",
                  "Health insurance: keep continuous coverage through any status change or job move.",
                  "Tax residency: understand your US resident/non-resident status for the year and how a status change affects it.",
                  "Green card timeline planning: if selected, start thinking about the EB-2/EB-3 path and priority-date backlog for Indians.",
                ]}
              />
              <ChecklistCard
                title="India-side compliance"
                items={[
                  "FBAR / FATCA: NRE/NRO accounts, FDs, and Indian mutual funds may trigger US reporting — don't miss FinCEN 114 / Form 8938.",
                  "India bank accounts: know your NRE vs NRO balances and whether your residency status could change them.",
                  "NRE / NRO planning: align account type and repatriation with your residency and tax position.",
                  "Repatriation & currency: if you may return to India, plan RNOR status, 401(k) handling, and currency timing in advance.",
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tools/fbar-fatca-checker"
                className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800 hover:border-orange-400"
              >
                FBAR / FATCA Checker →
              </Link>
              <Link
                href="/nri-wealth-checkup"
                className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400"
              >
                NRI Wealth Checkup →
              </Link>
              <Link
                href="/free-immigrant-wealth-guide"
                className="rounded-lg border border-ink-900/10 bg-ink-50 px-4 py-2 text-xs font-semibold text-ink-700 hover:border-brand-400"
              >
                Free Immigrant Wealth Guide →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Cluster nav */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            <SectionHeading kicker="Go deeper">Explore the H1B lottery results cluster</SectionHeading>
            <div className={cardWrap}>
              {[
                { href: "/h1b-lottery-selected-next-steps", label: "If you were selected", desc: "Documents, LCA + I-129, filing window, premium processing, start date, travel." },
                { href: "/h1b-lottery-not-selected-options", label: "If you were not selected", desc: "STEM OPT, cap-exempt, L-1, O-1, H-4, and a financial backup plan." },
                { href: "/h1b-second-lottery", label: "Will there be a second lottery?", desc: "How additional selection rounds work and what to watch for." },
                { href: "/h1b-registration-status-meaning", label: "Registration status meaning", desc: "Submitted, Selected, Not Selected, Denied, Invalidated — explained." },
                { href: "/h1b-lottery-results-for-f1-opt-students", label: "For F-1 OPT / STEM OPT students", desc: "Cap-gap, OPT end date, and backup planning." },
                { href: "/h1b-lottery-results-for-h4-families", label: "For H-4 families", desc: "Spouse planning, H-4 EAD, schools, insurance, and moving back." },
                { href: "/h1b-lottery-results-date", label: "Results date & timeline", desc: "When results are announced and how to tell they're out." },
                { href: "/h1b-lottery-chances", label: "Lottery chances & odds", desc: "The cap, the master's advantage, and what really moves your odds." },
                { href: "/h1b-visa-stamping-after-selection", label: "Visa stamping after selection", desc: "Change of status vs consular processing and India stamping." },
                { href: "/h1b-lottery-multiple-registrations", label: "Multiple registrations", desc: "Multiple job offers and beneficiary-centric rules." },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-orange-400 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-orange-700">{c.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </H1bLotteryShell>
  );
}
