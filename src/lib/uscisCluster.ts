import { computeReadingTime } from "@/lib/format";

/**
 * USCIS Case Status topic cluster (hub-&-spoke).
 *
 *   /uscis/case-status         ← hub (static route in app/uscis/case-status/)
 *     ├─ /case-was-received
 *     ├─ /case-is-being-actively-reviewed
 *     ├─ /request-for-evidence-rfe
 *     ├─ /case-approved-what-next
 *     ├─ /card-is-being-produced
 *     ├─ /case-transferred
 *     ├─ /biometrics-notice
 *     ├─ /interview-scheduled
 *     ├─ /case-denied
 *     └─ /receipt-number
 *
 * Child pages are served by app/uscis/[slug]/page.tsx.
 * Content is light-markdown + ::: fence format (rendered by ArticleBody).
 */

export type UscisClusterPageKind = "status" | "reference";

export interface UscisClusterPageData {
  /**
   * Opt in to the answer-first template chrome (byline row + author bio box).
   * Set only on pages rebuilt to that template, so untouched siblings render
   * exactly as before.
   */
  answerFirst?: boolean;
  slug: string;
  kind: UscisClusterPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface UscisClusterPage extends UscisClusterPageData {
  readingTime: number;
}

export const USCIS_CLUSTER_BASE = "/uscis";
export const USCIS_CASE_STATUS_HUB = "/uscis/case-status";

export const uscisChildPath = (slug: string) => `${USCIS_CLUSTER_BASE}/${slug}`;

const rawPages: UscisClusterPageData[] = [

  /* ───────────────────────── CASE WAS RECEIVED ───────────────────────── */
  {
    slug: "case-was-received",
    kind: "status",
    title: "\"Case Was Received\" USCIS Status: What It Means for Indians",
    seoTitle: "USCIS Case Was Received: Meaning & What Happens Next",
    metaDescription:
      "USCIS says \"Case Was Received\" — what does it mean? Plain-English explanation for H1B, I-140, I-485, EAD applicants. What to expect next and when to worry.",
    navLabel: "Case Was Received",
    excerpt:
      "Your case was received and logged in the USCIS system. Here's what it means, what your NOA1 notice says, and what happens next.",
    date: "2026-06-16",
    content: `**"Case Was Received"** is the very first status update after USCIS accepts your filing. It means your package has been opened, fee verified, and entered into the USCIS case management system. You should also receive (or have received) a **Notice of Action — Receipt Notice (Form I-797C)** in the mail. That notice has your 13-character **receipt number**, which is how you track everything going forward.

:::summary
Your case is in the queue. Nothing is wrong and nothing is required from you. USCIS will continue adjudicating. Expected next status: **"Case Is Being Actively Reviewed"** — or biometrics/interview notice if your form requires it.
:::

:::warn
title: Verify before you act
- Official USCIS case status: [egov.uscis.gov/casestatus](https://egov.uscis.gov/casestatus/landing.do)
- Receipt notice errors: contact USCIS within 90 days of issuance
:::

## What the status actually means

USCIS uses "Case Was Received" (sometimes phrased as "Application/Petition Was Received") to confirm three things:

:::info
title: What USCIS has confirmed at this point
- Your filing package arrived at the correct service center or lockbox
- The filing fee cleared (or fee waiver is accepted)
- A case record was created and a receipt number was assigned
:::

This is purely administrative — no adjudicator has looked at your case yet.

## Your NOA1 receipt notice

A few days to weeks after filing, you will get a **Form I-797C, Notice of Action** (the receipt notice). Save it. It contains:

- Your **receipt number** (e.g., IOE0123456789, LIN2412345678)
- The **form type** filed
- The **priority date** (for employment-based petitions — this matters enormously for Indian EB green card waiters)
- The **estimated processing time** at the time of receipt

> If you filed through an attorney or employer, they may receive the notice first. Ask them for a copy.

## What happens next

The next status is usually **"Case Is Being Actively Reviewed"** once an adjudicator picks it up. For forms that require them, USCIS may send biometrics or interview scheduling notices before adjudication completes.

Typical time in "Case Was Received":
| Form | Typical duration before next update |
| --- | --- |
| I-129 H1B (cap-subject) | Weeks to months (depends on lottery + FY) |
| I-129 H1B (cap-exempt/extension) | 2–6 months at current processing times |
| I-140 | 2–8 months (longer without premium processing) |
| I-485 | Variable — biometrics notice usually within 1–3 months |
| I-765 EAD | 3–12 months at current times |
| I-131 Advance Parole | 2–6 months |

> Always check current times at [uscis.gov/processing-times](https://www.uscis.gov/tools/check-case-processing-times).

## When to worry

:::bad
- **No receipt notice after 4–6 weeks** — your package may be lost or rejected; check with your attorney
- **Wrong information on the NOA1** (wrong name, wrong form, wrong priority date) — file a correction request promptly
- **Receipt number format looks wrong** — verify the service center codes with your attorney
:::

## Action steps

:::steps
Save your receipt notice (physical + digital scan).
Note your receipt number and use it at [egov.uscis.gov](https://egov.uscis.gov/casestatus/landing.do) to track status.
Check that the priority date on the NOA1 matches what your attorney filed — for I-140/I-485, this date is critical.
Sign up for case status email updates at myUSCIS so you get push notifications on changes.
No further action needed — wait for the next notice.
:::

## Frequently asked questions

### How long does "Case Was Received" last?
There's no fixed time. USCIS picks up cases as adjudicators become available. You are in the queue. Check the published processing times at uscis.gov for your specific form and service center.

### Should I call USCIS about my case now?
Generally no — USCIS asks you not to contact them until your case is outside the published processing time window. Premature inquiries don't speed processing and may actually slow things down.

### My employer's attorney got the NOA1 but I haven't seen it. Is that normal?
Yes — for employer-filed petitions (H1B, H1B extensions), the petitioner (employer) receives the receipt notice. Ask your HR or immigration attorney for a copy.

:::cta
title: Check what your status means next
body: Use the USCIS Case Status Meaning Tool to understand your current status and get form-specific guidance.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ──────────────────── CASE IS BEING ACTIVELY REVIEWED ─────────────── */
  {
    slug: "case-is-being-actively-reviewed",
    kind: "status",
    title: "\"Case Is Being Actively Reviewed\" USCIS: What It Means",
    seoTitle: "USCIS \"Case Is Being Actively Reviewed\" Meaning Explained",
    metaDescription:
      "USCIS status \"Case Is Being Actively Reviewed\" explained for H1B, I-485, I-140, EAD applicants. What an adjudicator is doing, typical timelines, and when to worry.",
    navLabel: "Actively Reviewed",
    excerpt:
      "An adjudicator has your case. Here's what active review means, how long it takes, and what could come next — RFE, interview, approval, or denial.",
    date: "2026-06-16",
    content: `**"Case Is Being Actively Reviewed"** means an actual USCIS adjudicator has your case file open and is working on it. This is past the queue — your case has been assigned. It's a good sign, though it doesn't guarantee fast resolution.

:::summary
An officer is reviewing your file. Possible outcomes from here: **approval**, **Request for Evidence (RFE)**, **interview scheduling**, or (rarely) **denial**. Nothing is required from you unless USCIS sends a notice. Keep your contact info current.
:::

## What adjudication means

Adjudication is the process of evaluating your application against USCIS regulations, your supporting documents, and any relevant policy memos. The officer may:

:::info
title: What the officer is doing with your case
- Verifying your identity and immigration history in USCIS systems
- Reviewing your supporting documents for completeness and consistency
- Checking your employer's petition (for H1B, L1, I-140) or your personal record (I-485, N-400)
- Determining whether any Requests for Evidence are needed
- Cross-checking prior cases, immigration court records, inadmissibility grounds
:::

## How long does active review take?

"Actively Reviewed" can appear anywhere from a day to months before the next update. It does **not** mean your case will be decided quickly.

| Form | What usually comes next |
| --- | --- |
| I-129 H1B | Approval, RFE, or transfer to National Benefits Center |
| I-140 | Approval or RFE (RFE rate ~15–25% for EB petitions) |
| I-485 | Biometrics scheduled, interview scheduled, RFE, or approval |
| I-765 EAD | Approval or RFE |
| N-400 | Interview scheduled |

## When to worry

:::warn
- **Outside the published processing time range** — you are eligible to submit a case inquiry or e-request at uscis.gov. Don't do it earlier.
- **Prior RFE was submitted** and you haven't heard back within 2 months — contact your attorney
- **Status flips back to "Received"** — this can happen with transfers; not automatically a problem but confirm with your attorney
:::

## What you should do

:::steps
Continue monitoring case status with your receipt number — changes can happen fast.
Make sure USCIS has your current address on file (change of address via AR-11 form).
If you're waiting on I-485, keep your biometrics appointment ready and don't travel without Advance Parole.
Do not contact USCIS unless you are outside the published processing window.
If status stays here for several months past the published window, your attorney can submit a case inquiry or service request.
:::

## Frequently asked questions

### Does "Actively Reviewed" mean I'll get a decision soon?
Not necessarily. It means someone has your file, but the review can take days, weeks, or months depending on the complexity of your case and the officer's workload.

### Can I go outside the US while my case is "Actively Reviewed"?
It depends on the form. If your I-485 is pending and you don't have Advance Parole, leaving the US may abandon your adjustment. For H1B or I-140, you can generally travel. Confirm with your attorney before any international travel while a petition is pending.

### What's the difference between "Actively Reviewed" and "Case Is Ready to Be Scheduled for an Interview"?
"Actively Reviewed" is a general adjudication status; "Ready to Be Scheduled" is specific to I-485 cases that require an interview and are waiting for an interview slot to open up.

:::cta
title: Understand your full status picture
body: The USCIS Case Status Meaning Tool gives you form-specific guidance based on your current status.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ─────────────────────── REQUEST FOR EVIDENCE ──────────────────────── */
  {
    slug: "request-for-evidence-rfe",
    kind: "status",
    title: "USCIS RFE Meaning: Why You Got One and What Happens Next",
    seoTitle: "USCIS RFE Meaning: Why You Got One & What Next",
    metaDescription:
      "What a USCIS Request for Evidence means for H-1B, I-140, I-485 or EAD — why USCIS issues RFEs, how the response process works, the likely outcomes, and RFE vs NOID. An RFE is not a denial.",
    navLabel: "RFE (Request for Evidence)",
    excerpt:
      "An RFE is not a denial. This is the plain-English guide to what a Request for Evidence means, why USCIS issues them, how the response process works, and what outcomes to expect.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `A **Request for Evidence (RFE)** means USCIS reviewed your case and found that the current record is not sufficient to approve or deny it — the officer needs more documentation, clarification, or proof. It is **not a denial**. This page explains what an RFE is, why USCIS issues them, and how the response process works. If you are holding the notice and want to decode its fields line by line and work a checklist, use the [RFE notice guide](/uscis/rfe-notice); for H-1B-specific RFE types, see the [H-1B RFE guide](/h1b/rfe).

:::warn
title: RFE deadline is a hard deadline
- USCIS gives you a response deadline — usually **87 days** from the date on the notice (not the date you receive it)
- Missing the deadline typically results in an automatic **denial**
- Work with your immigration attorney immediately
:::

:::summary
An RFE means USCIS needs more evidence to make a decision. Respond completely and by the deadline. A strong, well-documented response can still result in an approval. A weak, incomplete, or late response typically leads to denial.
:::

## Why USCIS sends RFEs

:::info
title: Common reasons Indians receive RFEs
- **I-129 H1B:** Specialty occupation (SOC code, degree match, job duties), employer-employee relationship, Level 1 wage concerns
- **I-140 EB-2 NIW:** Substantial merit and national importance, well-positioned to advance the endeavor
- **I-140 EB-2 / EB-3:** Job offer legitimacy, employer's ability to pay
- **I-485:** Medical exam issues, inadmissibility grounds, missing forms, prior visa overstay
- **I-765 EAD:** Category eligibility documentation
- **N-400:** Tax records, prior travel, criminal history clarification
:::

## What the RFE notice contains

At a high level, your RFE notice (sent by mail and visible on case status) specifies the **evidence requested**, the **response deadline** (from the date on the notice, not receipt), and **where to send** your response. Your attorney receives the original if they are the attorney of record.

To decode every field on the notice — the legal basis, the specific issues, and the submission instructions — and to work a step-by-step response checklist, use the dedicated [RFE notice guide](/uscis/rfe-notice).

## How to respond to an RFE

:::steps
Contact your immigration attorney immediately — same day if possible.
Read the RFE notice carefully to understand exactly what USCIS is asking for.
Gather all documents on the list — don't improvise; address each point explicitly.
Have your attorney draft a cover letter that addresses each RFE issue directly.
Assemble the complete response package, make copies, and mail before the deadline via trackable courier.
Monitor your case status — next update should be "Response to RFE Was Received."
:::

## RFE response outcomes

| Response quality | Typical outcome |
| --- | --- |
| Complete, well-documented response | Often approved; sometimes another RFE or NOID |
| Partial response | Higher denial risk |
| No response / missed deadline | Automatic denial |

## Types of RFE for Indians to know

:::compare
left: H1B RFEs (most common)
right: Green card RFEs (common)
✗ Specialty occupation dispute
✗ Degree field mismatch
✗ Employer-employee relationship
✗ Third-party worksite issues
✓ I-140 ability-to-pay docs
✓ EB-2 NIW merit/national importance
✓ I-485 medical/inadmissibility
✓ I-485 prior overstay or status gap
:::

For the H-1B side in depth — specialty occupation, employer-employee relationship, maintenance of status, and wage/LCA RFEs — see the [H-1B RFE guide](/h1b/rfe).

## Which RFE guide do I need?

| What you need | Guide |
|---|---|
| What an RFE is, why you got one, likely outcomes | **You are here** — RFE meaning & process |
| Decode the fields on your actual notice + a response checklist | [RFE notice guide](/uscis/rfe-notice) |
| H-1B-specific RFE types and evidence | [H-1B RFE guide](/h1b/rfe) |

## Frequently asked questions

### Does an RFE mean my case will probably be denied?
No. Many cases with RFEs are ultimately approved. The key is a complete, timely, well-documented response. H1B RFE approval rates vary by category but strong responses often succeed.

### Can I add new evidence in my RFE response?
Yes — you can submit additional evidence as long as it responds to what USCIS asked. In some cases, petitioners also voluntarily withdraw and refile if the situation has changed significantly.

### Is there a premium processing option for RFE responses?
If you filed with premium processing (I-129 or I-140), USCIS has 15 business days to act after receiving your RFE response. The clock restarts from when USCIS receives your response.

### What is a NOID vs an RFE?
A **Notice of Intent to Deny (NOID)** is more serious — USCIS is telling you it plans to deny and giving you a chance to rebut. NOIDs are less common but require an even stronger response.

:::cta
title: Understand your RFE next steps
body: Use the USCIS Case Status Meaning Tool for form-specific RFE guidance.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ─────────────────────── CASE APPROVED WHAT NEXT ───────────────────── */
  {
    slug: "case-approved-what-next",
    kind: "status",
    title: "USCIS Case Approved: What Happens Next (H1B, I-140, I-485, EAD)",
    seoTitle: "USCIS Case Approved — What Happens Next for Indians",
    metaDescription:
      "USCIS case approved — what happens next for H1B, I-140, I-485, EAD, green card? NOA2 notice, card production, priority date meaning, and action steps.",
    navLabel: "Case Was Approved",
    excerpt:
      "Your case is approved. Here's what that means for each form type — I-797 approval notice, card production, priority dates, and what to do right after.",
    date: "2026-06-16",
    content: `**"Case Was Approved"** means USCIS has adjudicated your petition or application favorably. What happens next depends entirely on which form was approved — because approval means something very different for an I-140 versus an I-485.

:::summary
Your petition/application was approved. You will receive an **I-797 Approval Notice**. Next steps depend on the form — some approvals are final (I-485, EAD), others open the door to the next stage (I-140 approval starts your green card clock; H1B approval means you can work under the new terms). Read your form type below.
:::

## What the approval notice contains

For most forms, USCIS mails a **Form I-797, Notice of Action (Approval Notice)**. It shows:
- The form approved
- The validity dates (for H1B: start and end dates)
- The approved beneficiary
- For I-140: your **priority date** (the most important number for Indian EB green card applicants)

## What approval means by form type

### I-129 H1B approval
Your H1B petition is approved. If this is a **cap-subject new H1B**, you can start working on October 1 or the start date on the approval. If it's an **extension or transfer**, you may be able to continue or begin working per your employer's AC21 / portability rights. Your employer will give you a copy of the I-797.

:::good
- Print and carry the I-797 when traveling — Customs officers may ask for it at the port of entry
- For H1B stamps, schedule a US visa stamping appointment in India or a third country; the approved I-797 is your primary document
:::

### I-140 approval
Your immigrant worker petition is approved and your **priority date is established**. This does not mean you have a green card or can file I-485 yet — for most Indians in EB-2 or EB-3, you will wait years (sometimes decades) for your priority date to become current before filing I-485.

:::info
title: What I-140 approval means for Indians
- Priority date is locked in from the I-140 receipt date (or earlier labor certification date)
- Once approved, your I-140 generally remains valid even if you change employers (AC21)
- An approved I-140 allows H1B extensions beyond 6 years under INA 106(c)
- Your priority date must become current in the monthly visa bulletin before filing I-485
:::

### I-485 approval (green card granted)
This is the big one — your application for Lawful Permanent Resident status is approved. Your physical green card (I-551) will be produced and mailed. You are now a permanent resident.

:::steps
Watch for "Card Is Being Produced" status, then "Card Was Mailed."
You'll receive your green card by mail — confirm your address is current.
Your green card is valid for 10 years (2 years if conditional). Renew before it expires.
You can now travel freely — no more Advance Parole needed.
Track your 5-year (or 3-year if married to US citizen) clock toward citizenship.
:::

### I-765 EAD approval
Your Employment Authorization Document is approved. Watch for "Card Is Being Produced" → "Card Was Mailed." You can work as soon as you physically have the card in hand — do not start working before you receive it.

### I-131 Advance Parole approval
Your travel document is approved. Wait for "Card Was Mailed." You should not travel internationally until you physically have the Advance Parole document. If your I-485 is also pending, leaving without it typically abandons your adjustment.

## Frequently asked questions

### I-140 is approved but the visa bulletin date is years away — what do I do now?
Keep your I-140 employer relationship or port to a different employer after 180 days using AC21 portability. Your approved I-140 survives a job change. Monitor the visa bulletin monthly. Keep your status valid. This is the reality for most Indian EB applicants.

### Does H1B approval mean I can travel outside the US?
Yes, but carry the I-797 approval notice. To re-enter on H1B, you need a valid H1B visa stamp in your passport (unless the visa is unexpired) or use I-94 + AP if applicable. If your stamp is expired, schedule a visa stamping appointment.

### My I-485 is approved — when do I get the green card?
Typically 2–4 weeks after the approval, the card enters production. You'll see "Card Is Being Produced" and then "Card Was Mailed." Allow 7–10 business days for delivery after mailing.

:::cta
title: Track what happens after your approval
body: Use the USCIS Case Status Meaning Tool for step-by-step post-approval guidance.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ──────────────────────── CARD IS BEING PRODUCED ───────────────────── */
  {
    slug: "card-is-being-produced",
    kind: "status",
    title: "\"Card Is Being Produced\" USCIS Status: Green Card & EAD Timeline",
    seoTitle: "USCIS Card Is Being Produced: What It Means & When It Arrives",
    metaDescription:
      "USCIS \"Card Is Being Produced\" status for green card (I-551), EAD (I-766), or Advance Parole. What it means, how long production takes, and when the card arrives.",
    navLabel: "Card Is Being Produced",
    excerpt:
      "USCIS is printing your physical card — green card, EAD, or Advance Parole. Here's how long it takes, what to do if it doesn't arrive, and what to check.",
    date: "2026-06-16",
    content: `**"Card Is Being Produced"** means USCIS has approved your application and the physical card (green card / EAD / Advance Parole) is being printed at a card production facility. After this, the status will change to **"Card Was Mailed"** and then you'll receive the card.

:::summary
Your card is being printed. No action needed. Expect "Card Was Mailed" within 1–3 weeks, and physical delivery 7–10 business days after that. Make sure your address is correct in USCIS's system now.
:::

## What card is being produced

| Form | Card produced |
| --- | --- |
| I-485 (green card) | Form I-551 (Permanent Resident Card) |
| I-765 (EAD) | Form I-766 (Employment Authorization Document) |
| I-131 (Advance Parole) | Advance Parole travel document |
| I-765 + I-131 combo | Combo card (EAD + AP on one card) |

## Timeline after "Card Is Being Produced"

:::info
title: Typical timeline
- **"Card Was Mailed"** status: usually 1–3 weeks after production begins
- **Physical delivery**: 7–10 business days after the "mailed" status appears
- **Total: 2–5 weeks** from "Card Is Being Produced" to card in hand
:::

> If you have an urgent need (travel, job start), do not assume the card will arrive on any specific date. Build in buffer time.

## Confirm your mailing address now

USCIS sends physical cards to the address on file. This is not the time to discover an old address is on file.

:::warn
- File Form AR-11 (Change of Address) immediately if your address has changed since filing
- If the address on your I-485/I-765 approval notice is wrong, call USCIS (1-800-375-5283) or submit an online inquiry
- Cards mailed to wrong addresses may require a replacement request
:::

## What to do when the card arrives

:::steps
Inspect the card immediately — verify name spelling, date of birth, expiration date, and category code match your records.
Sign the card if required (green card has signature panel on back).
For green card: compare the A-Number on the card to your approval notice — they should match.
For EAD: note the validity date and set a calendar reminder 180 days before expiration to file renewal.
Scan and store a digital copy in a secure location.
:::

## If the card doesn't arrive

:::bad
- Card not received **30 days after "Card Was Mailed"** — you can request a replacement via myUSCIS or call USCIS
- Card arrived but information is wrong — do not sign if any info is incorrect; request a replacement immediately
- **Green card lost before arrival**: File I-90 (Application to Replace Permanent Resident Card)
- **EAD lost before arrival**: File I-765 replacement (you cannot work until you have a valid EAD in hand)
:::

## Can I start working before I receive the EAD?

No. For EAD holders, employment authorization begins when you physically receive the valid card — not when the case shows "Approved" or "Card Was Mailed." Do not start working before you hold the card.

## Frequently asked questions

### It's been 6 weeks and my card still hasn't arrived — what do I do?
Submit a case inquiry through myUSCIS or call USCIS. For green cards, 30 days is the typical window before requesting a replacement. For EAD, also 30 days. Use the USPS tracking number (if provided) to verify delivery status.

### My status shows "Card Was Mailed" but USPS says it was delivered to the wrong address — what now?
File a case inquiry immediately via myUSCIS. If you recently moved, this is especially urgent. You may need to request a replacement and provide evidence of current address.

:::cta
title: Know exactly what to expect
body: Use the USCIS Case Status Meaning Tool for guidance specific to your form type.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ───────────────────────── CASE TRANSFERRED ────────────────────────── */
  {
    slug: "case-transferred",
    kind: "status",
    title: "\"Case Was Transferred\" USCIS Status: What It Means",
    seoTitle: "USCIS Case Was Transferred: What It Means & What to Do",
    metaDescription:
      "USCIS status \"Case Was Transferred\" explained for H1B, I-485, I-140 applicants. Why USCIS transfers cases between service centers and what to do next.",
    navLabel: "Case Transferred",
    excerpt:
      "USCIS transferred your case to a different service center or office. Here's why this happens, whether it's a problem, and what to expect next.",
    date: "2026-06-16",
    content: `**"Case Was Transferred"** means USCIS moved your case from one service center or office to another. This is an internal administrative action — it does not restart your clock, abandon your case, or mean something went wrong. Your receipt number stays the same.

:::summary
Your case was moved to a different USCIS facility for adjudication. This is routine. No action needed from you unless USCIS sends a notice. Your receipt number does not change. Processing time may update to reflect the new office's queue.
:::

## Why USCIS transfers cases

:::info
title: Common reasons for a case transfer
- **Workload balancing**: When one service center is overloaded, USCIS redistributes cases to other centers
- **Jurisdiction change**: Some case types are centralized at specific centers (e.g., the National Benefits Center handles many I-485 cases)
- **Interview location**: I-485 cases may transfer to a local USCIS field office if an interview is required in your area
- **Specialized processing**: Complex cases may transfer to a specialty unit
:::

## Your receipt number stays the same

Even though the case moved, you continue tracking it with the **same receipt number** at [egov.uscis.gov](https://egov.uscis.gov/casestatus/landing.do). You will not get a new receipt number.

## Does a transfer reset my processing time?

Functionally, yes — your case now joins the new center's queue. This can mean:
- Processing time estimate on uscis.gov will reflect the new center
- Your case may be processed faster or slower depending on the receiving center's volume

:::warn
- If you were already past the processing time window at the old center, check whether you're within or outside the new center's published window before submitting a service request
- Transfers to the National Benefits Center (NBC) for I-485 are common and normal — it doesn't mean your priority date is current or that adjudication is starting imminently
:::

## I-485 transfer to a local field office

For I-485 (Adjustment of Status) cases that require an interview, a transfer to a local USCIS field office usually means your interview is being scheduled. This is good news — it means your priority date is current (or will be soon) and USCIS is moving toward a decision.

## Action steps

:::steps
No immediate action required from your side.
Continue monitoring your case status with the same receipt number.
If you receive a notice from the new center (rare), follow its instructions.
Update your address via AR-11 if you've moved — the new center may mail notices to your address on file.
If you were near or past the old center's processing time, re-check against the new center's published time.
:::

## Frequently asked questions

### Did my priority date change when my case transferred?
No. The priority date (for I-140 / I-485) is established at the time the petition is filed and is not affected by internal transfers.

### How do I know which center my case transferred to?
The case status update message usually names the new location. You can also call USCIS (1-800-375-5283) to confirm. Your attorney can submit an inquiry if needed.

### My case transferred twice — is that normal?
Multiple transfers can happen during major USCIS reorganizations (e.g., when USCIS moves I-485 cases between service centers and the National Benefits Center). Unusual but not unheard of. As long as the case is active and the status is updating, continue to monitor.

:::cta
title: Track your transferred case
body: The USCIS Case Status Meaning Tool explains what comes after a transfer for your specific form.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ──────────────────────── BIOMETRICS NOTICE ────────────────────────── */
  {
    slug: "biometrics-notice",
    kind: "status",
    title: "USCIS Biometrics Appointment: What It Means & What to Bring",
    seoTitle: "USCIS Biometrics Appointment: What to Bring & What Happens",
    metaDescription:
      "USCIS scheduled biometrics appointment for I-485, I-765, N-400. What to bring to the ASC, fingerprinting process, rescheduling, and what happens after.",
    navLabel: "Biometrics Notice",
    excerpt:
      "USCIS needs your fingerprints and photo at an Application Support Center (ASC). Here's what to bring, what happens, and how to reschedule if needed.",
    date: "2026-06-16",
    content: `**"Appointment for Biometrics Services Was Scheduled"** means USCIS has booked you for a biometrics capture session at an **Application Support Center (ASC)**. You will receive a **biometrics appointment notice** by mail with the date, time, and ASC address.

:::summary
Attend your biometrics appointment with the notice and valid photo ID. No lawyer needed. It takes about 15–30 minutes. USCIS will collect your fingerprints, photo, and signature. Missing the appointment without rescheduling can delay your case significantly.
:::

## What biometrics are collected

USCIS collects:
- **Fingerprints** — all ten digits, used for FBI background checks
- **Photograph** — digital photo for your file
- **Signature** — captured electronically

This is for identity verification and criminal background checks across federal databases.

## Which forms require biometrics

| Form | Biometrics required? |
| --- | --- |
| I-485 (Adjustment of Status) | Yes — almost always |
| I-765 (EAD, standalone) | Yes |
| I-131 (Advance Parole) | Usually — depends on case type |
| N-400 (Naturalization) | Yes |
| I-539 (Extension/Change of Status for dependents) | Yes |
| I-129 H1B (employer files) | No |

## What to bring to the ASC

:::good
- **Biometrics appointment notice** (printed — do not rely on your phone screen)
- **Valid government-issued photo ID** — passport, state ID, or driver's license
- Any other identity documents the notice specifically requests (e.g., Employment Authorization Card if renewing)
:::

:::bad
- Do not bring family members unless they also have their own appointment letter
- Do not bring large bags — many ASCs have limited or no storage
- Do not bring food or drinks
:::

## Rescheduling your appointment

You can reschedule a biometrics appointment **once without a reason** at [myUSCIS](https://my.uscis.gov). Rescheduling is usually possible 1–3 weeks before the original date depending on availability. Reschedule through myUSCIS or by calling 1-800-375-5283.

:::warn
- If you miss your appointment and do not reschedule, USCIS may deem your application **abandoned**
- If you're sick or have a genuine emergency, call USCIS the same day to document the reason and reschedule immediately
:::

## What happens after biometrics

After your biometrics are captured, USCIS runs a background check through the FBI. This typically takes a few weeks. Your case status will update to reflect the next step — usually **"Case Is Being Actively Reviewed"** or an interview notice for I-485/N-400.

:::steps
Attend your appointment on time (arrive 10–15 minutes early).
Bring printed notice + valid photo ID.
The ASC officer will scan your fingerprints and take your photo — takes 15–30 minutes.
You'll receive a stamped copy of your appointment notice as confirmation.
Monitor your case status for the next update.
:::

## Frequently asked questions

### Do I need an attorney at the biometrics appointment?
No — attorneys are not typically needed or present at biometrics appointments. It's a routine administrative capture, not an interview.

### My biometrics appointment is far away — can I go to a closer ASC?
Generally no. USCIS assigns you to an ASC in your jurisdiction. You can reschedule to a different available date at the **same** ASC, but switching ASC locations usually requires a case inquiry.

### My case has been in biometrics for months — is that normal?
USCIS re-uses biometrics for some forms within a validity window (usually 15 months). If your application was pending for a long time, they may have already used a prior set. If biometrics appear stale, they may schedule you again.

:::cta
title: Know what comes after biometrics
body: Use the USCIS Case Status Meaning Tool to see what your next status will be.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ───────────────────────── INTERVIEW SCHEDULED ─────────────────────── */
  {
    slug: "interview-scheduled",
    kind: "status",
    title: "USCIS Interview Scheduled: I-485 & N-400 Interview Guide for Indians",
    seoTitle: "USCIS Interview Scheduled: I-485 Green Card & N-400 Citizenship Guide",
    metaDescription:
      "USCIS interview scheduled for I-485 adjustment of status or N-400 citizenship. What to bring, what officers ask Indians, and what to do before the interview.",
    navLabel: "Interview Scheduled",
    excerpt:
      "USCIS has scheduled your interview for I-485 (green card) or N-400 (citizenship). Here's what to bring, typical questions, and how to prepare.",
    date: "2026-06-16",
    content: `**"Interview Was Scheduled"** (or "Appointment Notice Was Sent") means USCIS has set a date for your in-person interview at a local field office. This is a required step for most I-485 (Adjustment of Status) and all N-400 (Naturalization) cases.

:::summary
Your interview is set. Go in prepared with all original documents listed in the notice, honest answers, and your complete application package. The interview is typically 30–60 minutes. After the interview, you may receive a same-day decision, or USCIS may take additional time to review.
:::

## Which cases require an interview

| Form | Interview required? |
| --- | --- |
| I-485 (employment-based, EB) | **Sometimes waived** for EB-1/EB-2/EB-3; USCIS has expanded interviews in recent years |
| I-485 (family-based) | Yes, almost always |
| N-400 (citizenship) | Yes, always |
| I-485 for diversity visa | Yes |

> If you have an employment-based I-485 and an interview is scheduled, it's not necessarily a bad sign — USCIS has been interviewing more EB applicants in recent years.

## What to bring to the interview

:::good
- **Interview notice** (printed)
- **Original passport(s)** — all passports including expired ones
- **I-94 print-out** (current and prior)
- **Green card / EAD** if currently held
- **I-797 approval notices** for all petitions (H1B, I-140, etc.)
- **Photos** — as specified by the interview notice
- **Completed medical exam** (Form I-693) in a sealed envelope if not already filed
- **Employment letter** or documentation of current employment (I-485 EB cases)
- **Marriage certificate** and joint financial documents if applicable
- **Tax returns** for last 3 years
- **All original application documents** — copies of what you filed
:::

## What USCIS officers ask Indians at I-485 interviews

The officer's job is to verify the information in your application. Common questions:

:::info
title: Common I-485 EB interview question areas
- Employment: Confirm current employer, job title, salary, work location
- Prior immigration history: All prior visas, entries, any overstays or violations
- Prior petitions: Status of I-140, priority date, employer's continued ability to pay
- Personal background: Criminal history (none expected), prior immigration proceedings
- Biographical: Address history, spouse/family info if applicable
:::

## N-400 citizenship interview

The N-400 interview covers:
1. **English language test** — reading, writing, speaking
2. **Civics test** — 10 questions from the 100-question bank (must answer 6 correctly)
3. **Application review** — officer reviews your N-400 form with you, line by line

:::warn
- For the 2025 civics test: if you applied on or after **April 19, 2025**, you will take the **2020 civics test** version (128 questions, must pass 12 of 20). Confirm which test applies at the time of your interview.
- Study the civics questions in advance — many are straightforward but some require memorization
:::

## After the interview

Possible outcomes:
- **Same-day approval**: Officer stamps your I-94 or tells you approval is forthcoming — you'll see "Case Was Approved" soon
- **Decision reserved**: Officer needs to review additional evidence; USCIS will mail a notice
- **Additional evidence requested**: Officer gives you a list of documents to submit within a deadline
- **Denial recommended**: Rare — if officer has significant concerns

## Frequently asked questions

### Can I bring my attorney to the interview?
Yes. Immigration attorneys are permitted (and often advisable) at I-485 interviews. For N-400, it's less common but allowed.

### My I-485 EB interview was waived earlier — why am I being interviewed now?
USCIS interview policies change. Some cases initially waived now get scheduled as the case reaches final adjudication or if the officer has specific questions.

### How should I dress for the interview?
Business casual is appropriate. You are going to a government office — dress professionally and respectfully.

:::cta
title: Prepare for your USCIS interview
body: Use the USCIS Case Status Meaning Tool for what to expect after your specific form's interview.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ──────────────────────────── CASE DENIED ──────────────────────────── */
  {
    slug: "case-denied",
    kind: "status",
    title: "USCIS Case Was Denied: Your Options for H1B, I-485, I-140 & EAD",
    seoTitle: "USCIS Case Denied: What to Do Next for H1B, I-485, I-140, EAD",
    metaDescription:
      "USCIS denied your case — what to do next for H1B, I-140, I-485, EAD. Motion to reopen, appeal, USCIS AAO, Federal Court options for Indians in the USA.",
    navLabel: "Case Was Denied",
    excerpt:
      "A denial is not always the end. Here's what a USCIS denial means, your options by form type (MTR, AAO appeal, refile, Federal Court), and critical deadlines.",
    date: "2026-06-16",
    content: `**"Case Was Denied"** is the most difficult status to see. It means USCIS adjudicated your case and found it did not meet the legal requirements for approval. You will receive a **denial notice** explaining the specific grounds. **Read it carefully — the reasons and your options depend on the specific grounds cited.**

:::warn
title: Act immediately — deadlines matter
- Motions to Reopen (MTR) and Motions to Reconsider (MTC) must be filed within **33 days** of the denial date (30 days + 3 days for mailing)
- AAO appeals: typically **30 days** from denial
- Federal court challenges: have their own filing deadlines
- If you stop appearing for work (H1B) or overstay status, your options narrow fast
- Consult an immigration attorney the same day you receive a denial
:::

:::summary
A denial is serious but not always final. Depending on the form and the reason, you may be able to file a Motion to Reopen, appeal to the AAO, refile with stronger evidence, or take federal court action. Deadlines are short — contact an attorney immediately.
:::

## What to do first

:::steps
Read the denial notice completely — the grounds matter for choosing your response.
Call your immigration attorney the same day.
Do not abandon status — if on H1B, continue working under a valid status while deciding options.
Note the denial date — your appeal/motion deadline counts from this date.
Ask your attorney which option fits your specific case and timeline.
:::

## Options after denial

### Motion to Reopen (MTR)
Filed when **new facts or evidence** emerge that were unavailable before the decision. Brings your case back before the same officer. Filing window: typically **33 days**.

### Motion to Reconsider (MTC)
Filed when you believe USCIS **made a legal error** in applying the law or regulations. No new evidence — just a legal argument. Same 33-day window.

### AAO (Administrative Appeals Office) Appeal
For certain forms (I-140, I-129, some I-485 denials), you can appeal to the USCIS Administrative Appeals Office. The AAO may remand (send back) or overturn the denial. Timeline: **30 days** from denial.

### Refile
In some cases, particularly for I-765 EAD or I-131, refiling a fresh application is simpler than appealing — especially if circumstances have changed.

### Federal Court (District Court)
If USCIS actions are arbitrary, capricious, or contrary to law, federal court challenge under the APA is possible. This is typically a last resort and requires specialized litigation counsel.

## Denial reasons by form

:::info
title: Common denial grounds for Indians
- **I-129 H1B**: Specialty occupation not established, employer-employee relationship issues, wage level violations
- **I-140 EB-2 NIW**: Failed to demonstrate national importance or well-positioned prong
- **I-485**: Priority date not current at time of decision, medical inadmissibility, prior immigration violations, missing documents
- **I-765 EAD**: Eligibility category not established, pending case issues
- **N-400**: Good moral character issues, continuous residence gaps, language test failure
:::

## Status implications after denial

:::compare
left: H1B denied
right: I-485 denied
✗ You lose H1B status if extension denied — leave or change status quickly
✗ Employer may file MTR/appeal to restore status
✗ Cap-subject H1B denial: may need new lottery
✓ You may still have other valid status (H4, OPT, etc.)
✓ File MTR or refile while consulting attorney
✓ Check if I-140 is still valid for future refile
✓ Consult attorney about unlawful presence implications
✓ Departure may be required pending attorney review
:::

## Frequently asked questions

### Does H1B denial mean I have to leave immediately?
It depends on whether you have other valid status. If the H1B extension is denied and your I-94 has expired, you may be out of status. Your attorney must review your specific timeline. Do not simply leave or stay without legal guidance.

### My I-485 was denied but my I-140 is still approved — does the I-140 survive?
An approved, standalone I-140 generally survives an I-485 denial (unlike an I-140 that was filed as a package — those rules differ). Your priority date is typically retained. Consult your attorney about refiling.

### Can I refile an I-485 after denial?
Yes — in many cases. Refiling requires either a new visa number to be available (priority date must be current again) and addressing whatever caused the denial. Your attorney will advise on timing and feasibility.

:::cta
title: Understand your denial options
body: Use the USCIS Case Status Meaning Tool for a plain-English summary of your options.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ──────────────────────────── RECEIPT NUMBER ───────────────────────── */
  {
    slug: "receipt-number",
    kind: "reference",
    title: "USCIS Receipt Number Explained: IOE, LIN, SRC, EAC, WAC, MSC",
    seoTitle: "USCIS Receipt Number: IOE LIN SRC EAC WAC MSC Explained",
    metaDescription:
      "What is a USCIS receipt number? Explains IOE, LIN, SRC, EAC, WAC, MSC prefix codes for Indians tracking H1B, I-485, I-140, EAD case status.",
    navLabel: "Receipt Number Guide",
    excerpt:
      "Your USCIS receipt number is your case tracking ID. Here's what the 13 characters mean, what the prefix codes (IOE, LIN, SRC, EAC, WAC, MSC) represent, and how to use it.",
    date: "2026-06-16",
    content: `Your **USCIS receipt number** (also called a case number) is the 13-character identifier on your **Form I-797, Notice of Action**. It is the single most important number for tracking your immigration case. Without it, you cannot check your status online or submit a case inquiry.

:::summary
Your receipt number looks like **IOE0123456789** or **LIN2412345678**. The first 3 letters are a **service center code**. The next 2 digits are the fiscal year it was filed. The remaining 8 are a sequential case number. Use it at [egov.uscis.gov](https://egov.uscis.gov/casestatus/landing.do) to check status.
:::

## Receipt number format

:::info
title: Receipt number structure
- Format: **[3-letter code] [2-digit fiscal year] [8-digit sequence]**
- Example: **LIN 24 12345678**
- First 3 letters = service center code (LIN, SRC, EAC, WAC, IOE, MSC)
- Next 2 digits = fiscal year filed (24 = FY2024)
- Last 8 digits = unique case sequence number
:::

## Service center codes explained

| Code | Location / Meaning | Common forms handled |
| --- | --- | --- |
| **LIN** | Nebraska Service Center (Lincoln, NE) | I-129 H1B, I-140, I-485, I-765 |
| **SRC** | Texas Service Center (Dallas, TX) | I-129, I-140, I-485, I-765 |
| **EAC** | Vermont Service Center (St. Albans, VT) | I-129, I-140, I-485, I-765 |
| **WAC** | California Service Center (Laguna Niguel, CA) | I-129, I-140, I-485, I-765 |
| **IOE** | USCIS ELIS (electronic filing system) | Online-filed applications |
| **MSC** | National Benefits Center (Lee's Summit, MO) | I-485 (transferred cases), I-130 |
| **YSC** | Potomac Service Center | DACA, some specialty cases |

> The service center processes your case based on the employer's or applicant's location, current USCIS workload distribution, and form type. Not all service centers accept all forms.

## Where to find your receipt number

:::info
title: Where your receipt number appears
- **Form I-797C (Receipt Notice)**: Large text in the upper right corner
- **Form I-797 (Approval Notice)**: Same location
- **USCIS online case portal**: Visible in myUSCIS under "My Cases" if you filed online or linked your case
- **Attorney correspondence**: Your immigration attorney will have it on file
:::

## How to use your receipt number to check status

:::steps
Go to [egov.uscis.gov/casestatus](https://egov.uscis.gov/casestatus/landing.do).
Enter your receipt number exactly as it appears — no spaces, no dashes.
Click "Check Status" — you'll see the current status and a plain-English description.
Optionally, sign up for email notifications in myUSCIS so you get updates automatically.
:::

## Multiple receipt numbers

It's common to have multiple receipt numbers if you've had multiple petitions or applications:

:::info
title: Why you might have multiple receipt numbers
- Each H1B filing (new, extension, transfer) gets its own receipt number
- I-140 and I-485 are separate filings with separate receipt numbers
- I-765 EAD and I-131 Advance Parole each get their own receipt number
- Premium processing adds a separate I-907 receipt
:::

## IOE receipt numbers (online filing)

Cases filed through the USCIS online system receive **IOE** prefix numbers. These are tracked the same way at the case status portal — no difference in processing.

## Frequently asked questions

### My receipt number starts with numbers, not letters — is that right?
A receipt number should start with 3 letters (the center code). If you see only numbers, you may be looking at an A-Number (alien registration number) or I-94 number — those are different identifiers. Check your I-797 notice for the correct receipt number.

### How do I get my receipt number if I never received the NOA1?
If you filed through an employer, ask your HR or immigration attorney. If you filed yourself and the notice never arrived (after 6–8 weeks), you can call USCIS at 1-800-375-5283 or submit an online inquiry.

### Can I look up my case without a receipt number?
Not through the standard USCIS case status portal. USCIS does not have a general name-based search for the public. With your full name and A-Number, your attorney or an accredited representative can do more advanced lookups.

:::cta
title: Check what your current status means
body: Have your receipt number? Use the USCIS Case Status Meaning Tool for plain-English guidance.
button: Try the tool
href: /tools/uscis-case-status-meaning
:::`,
  },
];

export const uscisChildPages: UscisClusterPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const uscisChildSlugs = uscisChildPages.map((p) => p.slug);

export function getUscisChildPage(slug: string): UscisClusterPage | undefined {
  return uscisChildPages.find((p) => p.slug === slug);
}
