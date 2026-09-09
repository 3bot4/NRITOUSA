import Link from "next/link";
import Container from "@/components/Container";
import UscisProcessingDelayChecker from "@/components/tools/UscisProcessingDelayChecker";
import FastAnswerSnapshot from "@/components/FastAnswerSnapshot";

/**
 * The long-form USCIS processing-times explainer.
 *
 * This content was authored at /uscis/processing-times, which 301s to
 * /tools/processing-times — Google had already picked the tool page (190
 * impressions vs. the guide's zero), so the tool page became canonical and the
 * guide's unique material moved here rather than being dropped.
 *
 * Deliberately excludes the premium-processing FEE table: the route already
 * renders that table once, below this block. The regular-vs-premium comparison
 * below is about the mechanic, not the fee.
 *
 * FAQ entries live on the route, not here, so the route keeps ownership of the
 * FAQPage JSON-LD.
 */

const DELAY_STEPS = [
  { label: "Step 1", text: "Go to egov.uscis.gov/processing-times and find the date USCIS is currently completing for your form and center." },
  { label: "Step 2", text: "Compare that date to your receipt date (on your I-797 notice). If your receipt date is earlier, you may be outside the window." },
  { label: "Step 3", text: "If outside the window, you can submit a case inquiry through your myUSCIS account or at egov.uscis.gov." },
  { label: "Step 4", text: "For employer-sponsored cases, have your attorney contact USCIS — direct petitioner contact may be more effective than an individual inquiry." },
];

const WHY_ESTIMATES = [
  { title: "Requests for Evidence (RFE)", body: "When USCIS needs more documentation, it issues an RFE. The case pauses while waiting for your response, adding weeks or months." },
  { title: "Background and security checks", body: "Some applicants require additional national security or background checks that run independently of the adjudication process." },
  { title: "Service center transfers", body: "When a case is transferred to a different center, it joins that center's queue from the transfer date." },
  { title: "Workload and staffing spikes", body: "Congressional mandates, policy changes, or surges in filings (like H1B cap season) create temporary backlogs at specific centers." },
  { title: "Case complexity", body: "Complex employment-based petitions, prior immigration history, or unusual circumstances require more officer review time." },
  { title: "Interview scheduling", body: "For I-485, interview scheduling at local field offices adds time that is separate from service center processing." },
];

const BY_SITUATION = [
  {
    form: "I-129 — H1B transfer",
    range: "3–6 months (regular) · 15 business days (premium)",
    notes: [
      "An H1B transfer (change of employer) requires a new I-129 petition from the new employer.",
      "In many H-1B portability situations, a worker may be able to start with the new employer after USCIS receives the petition, but this depends on specific facts, valid status, timing, and receipt. Confirm with the employer's immigration attorney before starting work.",
      "Premium processing is available and commonly used for transfers where start date is time-sensitive.",
      "USCIS may request additional evidence (RFE) on specialty occupation or employer-employee relationship.",
    ],
    premium: true,
  },
  {
    form: "I-129 — H1B extension",
    range: "4–8 months (regular) · 15 business days (premium)",
    notes: [
      "Extensions within the same employer file under the same I-129 petition type.",
      "Cap-exempt employers (universities, nonprofits) may file at different service centers than cap-subject employers.",
      "If an I-140 is approved for at least 365 days, H1B can be extended in 3-year increments beyond the 6-year limit.",
      "File extensions well before the current I-94 expiry — ideally 6 months out.",
    ],
    premium: true,
  },
  {
    form: "I-129 — H1B amendment",
    range: "4–7 months (regular) · 15 business days (premium)",
    notes: [
      "Amendments are required when certain material changes occur (worksite, duties, etc.).",
      "USCIS may issue RFEs on H1B amendments more frequently than extensions due to specialty occupation scrutiny.",
      "Premium processing is available.",
    ],
    premium: true,
  },
  {
    form: "I-140 — Employment green card",
    range: "6–12+ months (regular) · 15 business days (premium)",
    notes: [
      "For Indian EB applicants, the priority date — set at I-140 receipt — is the critical milestone.",
      "I-140 approval alone does not mean you can file I-485 — the priority date must also be current in the visa bulletin.",
      "Premium processing is valuable if you need to establish the priority date quickly or enable an H1B extension beyond 6 years.",
      "Once approved for 365+ days, the I-140 protects H1B extension rights even after job change under AC21 portability.",
    ],
    premium: true,
  },
  {
    form: "I-485 — Adjustment of status",
    range: "8 months – 3+ years (varies by category and priority date)",
    notes: [
      "I-485 timing for Indian EB applicants is dominated by visa bulletin retrogression — the priority date must remain current.",
      "Once the priority date is current and I-485 is filed, USCIS processing itself adds several more months.",
      "Premium processing is not available for I-485 as of this writing.",
      "Travel without an approved Advance Parole while I-485 is pending is generally treated as abandonment.",
      "An interview at a local field office is usually required for employment-based I-485.",
    ],
    premium: false,
  },
  {
    form: "I-765 — EAD",
    range: "3–7 months (regular) · combo card with AP sometimes faster",
    notes: [
      "H4 EAD applicants cannot work until the physical EAD card is in hand.",
      "F1 OPT/STEM OPT EADs should be filed well before the program end date — there is no premium processing for EAD.",
      "I-485-based EADs filed as a combo card (EAD + AP together) may follow the same timing.",
      "EAD automatic extension of up to 540 days applies if you file a renewal before expiration in many categories — verify with uscis.gov.",
    ],
    premium: false,
  },
  {
    form: "I-131 — Advance Parole",
    range: "3–8 months",
    notes: [
      "Do not travel internationally while I-485 is pending without an approved, valid AP document physically in hand.",
      "The combo card (EAD + AP) is commonly filed for I-485 applicants — it can save time.",
      "No premium processing for I-131.",
      "In genuine emergencies, you may request expedite processing — document the emergency clearly.",
    ],
    premium: false,
  },
  {
    form: "I-130 — Family petition",
    range: "6 months – 2+ years depending on relationship category",
    notes: [
      "Immediate relatives of US citizens (spouse, minor children, parents) have immediate visa availability after I-130 approval.",
      "All other family preference categories have annual limits and can face multi-year backlogs.",
      "I-130 is just the first step — visa bulletin and consular processing or I-485 follow.",
    ],
    premium: false,
  },
  {
    form: "N-400 — Naturalization",
    range: "8–18 months (varies significantly by field office)",
    notes: [
      "N-400 is processed at your local USCIS field office, which has significant timing variation.",
      "Biometrics appointment and interview at the field office add to total time.",
      "No premium processing for N-400.",
      "Prepare civics test materials and review travel/continuous residence requirements early.",
    ],
    premium: false,
  },
];

const BEFORE_PANIC = [
  { item: "Receipt date", detail: "Use the exact date on your I-797 notice — not when you mailed the application or when USCIS cashed the fee." },
  { item: "Form type and subtype", detail: "I-129 for H1B has different processing times than I-129 for L1 or O1. Select the right subtype on uscis.gov." },
  { item: "Correct service center", detail: "Use the service center shown on your I-797, not where you mailed it. After a transfer, use the new center." },
  { item: "Current case status", detail: "Check egov.uscis.gov. An RFE sent, biometrics notice, or interview scheduling notice may explain the timeline." },
  { item: "RFE status", detail: "If an RFE was issued and you responded, USCIS has up to 60 days (premium) or several months (regular) to act after your response." },
  { item: "Premium processing clock", detail: "If premium was paid, the 15-day clock starts from USCIS's acceptance of the premium request — not the original filing date." },
  { item: "I-485 priority date", detail: "For I-485, check the current visa bulletin at travel.state.gov. A retrogressed priority date pauses processing until it becomes current again." },
];

const CALL_ATTORNEY = [
  "You received a Request for Evidence (RFE) — respond by the exact deadline on the notice (standard max ~84 days, ≈87 with US mailing time; some forms 30 days).",
  "Your current work authorization (H1B, EAD) expires within 60–90 days and a renewal petition is not yet filed or approved.",
  "You were laid off while H1B, I-485, or EAD applications are pending.",
  "You received a denial or Notice of Intent to Deny (NOID).",
  "You are planning international travel and Advance Parole is pending or expired.",
  "Your priority date retrogressed after your I-485 was filed.",
  "USCIS sent a notice to a wrong address and you missed it.",
  "Premium processing window has passed (15 business days) without USCIS action.",
];

const REGULAR_VS_PREMIUM: [string, string, string][] = [
  ["Forms available", "All USCIS forms", "Select forms: I-129, I-140, and some others — verify at uscis.gov"],
  ["Cost", "Filing fee only", "Additional fee — verify current amount at uscis.gov/i-907 (subject to change)"],
  ["USCIS action guarantee", "No guarantee", "Action within 15 business days of premium acceptance"],
  ["What 'action' means", "—", "Approval, denial, RFE, or Notice of Intent to Deny"],
  ["Does it guarantee approval?", "—", "No — premium processing guarantees speed, not outcome"],
  ["RFE impact on clock", "—", "If RFE issued, premium clock restarts on USCIS receipt of your response"],
  ["Who can file", "Employer or petitioner", "Typically the employer/petitioner; some categories allow self-filing"],
];

export default function UscisProcessingTimesGuide() {
  return (
    <>
      {/* Fast Answer: processing times & premium */}
      <section className="bg-white pb-4 pt-10 sm:pt-12">
        <Container>
          <FastAnswerSnapshot
            title="USCIS processing times at a glance"
            accent="brand"
            rows={[
              { label: "Premium processing (I-907)", value: "15 business days", note: "Action guarantee (not approval); fee $2,965 for I-129/I-140.", highlight: true },
              { label: "Regular I-140", value: "~6–12+ months", note: "Varies by service center & petition type." },
              { label: "Regular I-129 (H-1B)", value: "Varies by service center", note: "Premium available to cut to 15 business days." },
              { label: "Check your case", value: "Case status + Processing Times", note: "Compare your receipt date to the posted times." },
            ]}
            badges={["Premium 15 business days", "Fee $2,965"]}
            lastVerified="2026-07-04"
            sources={[
              { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
              { label: "USCIS Form I-907", href: "https://www.uscis.gov/i-907" },
              { label: "USCIS Case Status", href: "https://egov.uscis.gov/" },
            ]}
            disclaimer="Processing times vary by form, category, and service center and change often; premium fees can change (premium rose to $2,965 on Mar 1, 2026). Not legal advice — verify on USCIS before relying on any date."
          />
        </Container>
      </section>

      {/* quick answer */}
      <section className="bg-blue-50/60 py-8">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-white p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-600">Quick answer</p>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700">
              {[
                "USCIS processing times are estimates — not deadlines or guarantees.",
                "Check official times at egov.uscis.gov/processing-times by form type and service center.",
                "If your receipt date is earlier than the date USCIS is currently processing, you may be outside the normal window.",
                "Premium processing (I-129, I-140) guarantees USCIS action in 15 business days — not approval.",
                "For employer-filed cases (H1B, I-140), talk to your employer's immigration attorney about delays — not USCIS directly.",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-none text-blue-400">▸</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* delay checker tool */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-ink-900">
              Processing Delay Checker
            </h2>
            <UscisProcessingDelayChecker />
            <p className="mt-3 text-center text-xs text-ink-400">
              Want the full standalone tool?{" "}
              <Link href="/tools/uscis-processing-delay-checker" className="font-medium text-blue-600 underline">
                Open USCIS Processing Delay Checker →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* what processing times mean */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              What USCIS processing times actually mean
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              The processing times shown on{" "}
              <a href="https://egov.uscis.gov/processing-times" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline">
                egov.uscis.gov/processing-times
              </a>{" "}
              represent the receipt dates of cases USCIS is currently completing at each service center. If the published time for I-129 at the Nebraska Service Center shows a receipt date of November 2024, it means USCIS is right now finishing cases received in November 2024.
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              This is a backward-looking estimate, not a forward-looking promise. It tells you how backed up USCIS currently is — but your case could be faster or slower. The published range is built to cover roughly 80% of completed cases, so one case in five finishes outside it in either direction. Cases with complications (RFEs, security checks, missing documents) take longer regardless of the published time.
            </p>
            <div className="rounded-2xl border border-ink-900/5 bg-white p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-500">How to read the USCIS processing times page</p>
              <ol className="space-y-2 text-sm text-ink-700">
                {[
                  "Go to egov.uscis.gov/processing-times.",
                  'Select your form type (e.g., "I-129").',
                  "Select the service center shown on your I-797 receipt notice.",
                  "Select your petition/application subtype if prompted.",
                  "USCIS shows a date range — this is the receipt date of cases currently being completed.",
                  "If your receipt date is before the earlier end of that range, your case may be outside the normal processing window.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Important:</strong> Processing times change monthly. A time that looked normal last month may already be outdated. Always check the date stamp on the USCIS processing times page when you visit.
            </div>
          </div>
        </Container>
      </section>

      {/* why estimates not guarantees */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Why processing times are estimates, not guarantees
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              USCIS is a high-volume government agency processing millions of applications across dozens of form types, service centers, and immigration categories. Several factors cause individual cases to deviate from published times:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {WHY_ESTIMATES.map((item) => (
                <div key={item.title} className="rounded-xl border border-ink-900/5 bg-ink-50/40 p-4">
                  <p className="mb-1 text-sm font-semibold text-ink-900">{item.title}</p>
                  <p className="text-xs leading-relaxed text-ink-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* processing by situation */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Processing time by situation
            </h2>
            <p className="text-xs leading-relaxed text-ink-500">
              The ranges below are general guidance based on historical USCIS data. Always check the current official estimate at{" "}
              <a href="https://egov.uscis.gov/processing-times" target="_blank" rel="noopener noreferrer" className="underline">egov.uscis.gov/processing-times</a>{" "}
              for your specific form, center, and subtype — these change monthly.
            </p>

            {BY_SITUATION.map((item) => (
              <div key={item.form} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-bold text-ink-900">{item.form}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.range}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {item.notes.map((note) => (
                    <li key={note} className="flex items-start gap-2 text-sm text-ink-600">
                      <span className="mt-1 flex-none text-ink-300">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
                {item.premium && (
                  <p className="mt-3 rounded-lg border-l-4 border-indigo-300 bg-indigo-50/40 px-3 py-2 text-xs text-indigo-900">
                    Premium processing available — guarantees USCIS action in 15 business days, not approval.
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* regular vs premium */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              Regular vs. premium processing
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              Premium processing is an optional paid service for certain USCIS form types. It is not a guarantee of approval — it is a guarantee that USCIS will take action (approve, deny, or issue an RFE) within a defined timeframe.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-ink-900/5">
              <table className="w-full text-sm">
                <thead className="bg-ink-50/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600"> </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Regular processing</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink-600">Premium processing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {REGULAR_VS_PREMIUM.map(([label, reg, prem]) => (
                    <tr key={label}>
                      <td className="px-4 py-2.5 text-xs font-semibold text-ink-700">{label}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-600">{reg}</td>
                      <td className="px-4 py-2.5 text-xs text-ink-600">{prem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* when a case may be delayed */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              When a case may be considered delayed
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              USCIS considers a case &ldquo;outside normal processing time&rdquo; when your receipt date is earlier than the date currently shown on their processing times tool for your form and service center. That is the official benchmark — not the number of months that feel long to you.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {DELAY_STEPS.map((step) => (
                <div key={step.label} className="rounded-xl border border-ink-900/5 bg-white p-4">
                  <p className="mb-1 text-xs font-bold text-blue-600">{step.label}</p>
                  <p className="text-sm leading-relaxed text-ink-700">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* what to check before panicking */}
      <section className="bg-white py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              What to check before panicking
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              Before assuming your case is delayed or lost, work through this checklist. Most &ldquo;delayed&rdquo; cases are either within normal range or have a clear explanation.
            </p>
            <div className="space-y-2">
              {BEFORE_PANIC.map((row) => (
                <div key={row.item} className="flex flex-col gap-1 rounded-xl border border-ink-900/5 bg-ink-50/40 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
                  <p className="flex-none text-xs font-bold text-ink-800 sm:w-44">{row.item}</p>
                  <p className="text-xs leading-relaxed text-ink-600">{row.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* when to contact attorney */}
      <section className="bg-ink-50/40 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-xl font-bold tracking-tight text-ink-900">
              When to contact your employer&rsquo;s attorney or immigration lawyer
            </h2>
            <p className="text-sm leading-relaxed text-ink-700">
              Many USCIS delays resolve on their own. But some situations require immediate legal attention. Contact your immigration attorney the same day if:
            </p>
            <ul className="space-y-2">
              {CALL_ATTORNEY.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1 flex-none text-rose-500">!</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs text-rose-800">
              <strong className="font-semibold">For employer-filed petitions:</strong> Contact HR at your company first — they retain an immigration attorney who has access to your petition files. Do not contact USCIS directly about employer-filed cases without coordinating with your attorney.
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
