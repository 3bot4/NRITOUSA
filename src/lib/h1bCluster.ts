import { computeReadingTime } from "@/lib/format";

/**
 * H1B topic cluster (hub-and-spoke).
 *
 *   /h1b                                ← hub (static route)
 *     ├─ /h1b/transfer
 *     ├─ /h1b/extension
 *     ├─ /h1b/amendment
 *     ├─ /h1b/rfe
 *     ├─ /h1b/premium-processing
 *     ├─ /h1b/layoff-60-day-grace-period
 *     ├─ /h1b/travel-to-india
 *     ├─ /h1b/transfer-after-layoff
 *     ├─ /h1b/start-work-after-transfer-receipt
 *     └─ /h1b/stamping-india-after-approval
 *
 * Child pages are served by app/h1b/[slug]/page.tsx.
 */

export type H1bClusterPageKind = "guide" | "reference";

export interface H1bClusterPageData {
  /**
   * Opt in to the answer-first template chrome (byline row + author bio box).
   * Set only on pages rebuilt to that template, so untouched siblings render
   * exactly as before.
   */
  answerFirst?: boolean;
  slug: string;
  kind: H1bClusterPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface H1bClusterPage extends H1bClusterPageData {
  readingTime: number;
  snapshot?: H1bSnapshot;
}

/* ── Fast Answer snapshots (top of each H-1B page) ─────────────────────────── */

export interface H1bSnapshotRow {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface H1bSnapshot {
  title: string;
  rows: H1bSnapshotRow[];
  badges?: string[];
}

/** Premium processing (I-907) fee — current figure (rose to $2,965 on Mar 1, 2026). */
export const H1B_PREMIUM_FEE = "$2,965";
export const H1B_SNAPSHOT_VERIFIED = "2026-07-04";
export const H1B_SNAPSHOT_DISCLAIMER =
  "Planning estimates only — regular processing times vary by service center and premium fees change. Premium processing guarantees USCIS action within 15 business days, not approval. Not legal advice; verify with USCIS before relying on any date or fee.";
export const h1bSnapshotSources: { label: string; href: string }[] = [
  { label: "USCIS Form I-129", href: "https://www.uscis.gov/i-129" },
  { label: "USCIS Form I-907 (premium)", href: "https://www.uscis.gov/i-907" },
  { label: "USCIS Processing Times", href: "https://egov.uscis.gov/processing-times/" },
];

/** Rows most H-1B pages share (regular + premium timing). */
const H1B_BASE_ROWS: H1bSnapshotRow[] = [
  { label: "Regular processing", value: "3–6 months", note: "Varies by service center." },
  { label: "Premium processing (I-907)", value: "15 business days", note: `Optional; fee ${H1B_PREMIUM_FEE}.` },
];

export const h1bSnapshots: Record<string, H1bSnapshot> = {
  "premium-processing": {
    title: "H-1B premium processing at a glance",
    badges: ["15 business days", `Fee ${H1B_PREMIUM_FEE}`],
    rows: [
      { label: "USCIS action guarantee", value: "15 business days", note: "Approve, RFE, or deny — not a guaranteed approval.", highlight: true },
      { label: "Premium fee (I-907)", value: H1B_PREMIUM_FEE, note: "Usually paid by the employer. Verify current amount." },
      { label: "If an RFE is issued", value: "Clock restarts", note: "New 15-business-day window after USCIS receives the RFE response." },
      { label: "Regular processing", value: "3–6 months", note: "If you skip premium." },
    ],
  },
  transfer: {
    title: "H-1B transfer timing at a glance",
    badges: ["Start on receipt", "Premium 15 business days"],
    rows: [
      { label: "When you can start work", value: "On receipt notice", note: "H-1B portability — after the new employer files a non-frivolous I-129.", highlight: true },
      ...H1B_BASE_ROWS,
      { label: "Common mistake", value: "Waiting for approval", note: "You may usually start on the receipt, not the approval." },
    ],
  },
  extension: {
    title: "H-1B extension timing at a glance",
    badges: ["240-day rule", "Premium 15 business days"],
    rows: [
      { label: "Keep working after I-94 expiry", value: "Up to 240 days", note: "If the extension was filed before your I-94 expired.", highlight: true },
      ...H1B_BASE_ROWS,
      { label: "I-94 risk", value: "File before expiry", note: "Filing after your I-94 expires can break status." },
    ],
  },
  amendment: {
    title: "H-1B amendment timing at a glance",
    badges: ["Material change", "Premium 15 business days"],
    rows: [
      { label: "When required", value: "Material change", note: "New worksite/MSA or significant job change.", highlight: true },
      ...H1B_BASE_ROWS,
    ],
  },
  rfe: {
    title: "H-1B RFE timing at a glance",
    badges: ["Clock restarts", "Response deadline"],
    rows: [
      { label: "Premium clock after RFE", value: "Restarts (15 business days)", note: "From the day USCIS receives your response.", highlight: true },
      { label: "Response deadline", value: "Set by USCIS notice", note: "Often up to ~87 days; follow the exact date on your RFE." },
      { label: "Regular processing", value: "Adds weeks–months", note: "On top of the original timeline." },
    ],
  },
  "layoff-60-day-grace-period": {
    title: "H-1B layoff grace period at a glance",
    badges: ["60-day grace", "Premium advised"],
    rows: [
      { label: "Grace period", value: "Up to 60 days", note: "Per authorized validity period after your last day; may be shorter if I-94 ends sooner.", highlight: true },
      { label: "New employer transfer", value: "File within the grace period", note: "Premium processing (15 business days) is usually advisable." },
      { label: "Premium fee (I-907)", value: H1B_PREMIUM_FEE, note: "Speeds action to 15 business days." },
    ],
  },
  "transfer-after-layoff": {
    title: "H-1B transfer after layoff at a glance",
    badges: ["60-day grace", "Premium 15 business days"],
    rows: [
      { label: "File within", value: "60-day grace period", note: "New employer files I-129 before the grace period ends.", highlight: true },
      ...H1B_BASE_ROWS,
      { label: "Premium fee (I-907)", value: H1B_PREMIUM_FEE, note: "Strongly advised in a layoff situation." },
    ],
  },
  "start-work-after-transfer-receipt": {
    title: "Starting work after an H-1B transfer receipt",
    badges: ["Portability", "Start on receipt"],
    rows: [
      { label: "When you can start", value: "On the receipt notice", note: "H-1B portability under AC21 — after a non-frivolous I-129 is filed.", highlight: true },
      ...H1B_BASE_ROWS,
    ],
  },
};

export const H1B_CLUSTER_BASE = "/h1b";
export const h1bChildPath = (slug: string) => `${H1B_CLUSTER_BASE}/${slug}`;

const rawPages: H1bClusterPageData[] = [

  /* ──────────────────────────── TRANSFER ────────────────────────────────── */
  {
    slug: "transfer",
    kind: "guide",
    title: "H1B Transfer Explained: How It Works, When Work Starts, and What Can Go Wrong",
    seoTitle: "H1B Transfer Explained | When Can You Start Working, AC21, RFE Risk",
    metaDescription:
      "How does an H1B transfer work for Indians? Understand AC21 portability, when work can begin after receipt, cap-exempt vs cap-subject, and what triggers an RFE.",
    navLabel: "H1B Transfer",
    excerpt:
      "An H1B transfer is a new I-129 petition filed by a new employer. Under AC21 portability rules, you may be able to start work before approval — but the timing and conditions matter enormously.",
    date: "2026-06-16",
    content: `An **H1B transfer** (formally a **Change of Employer petition**) is a new Form I-129 filed by a new employer with USCIS, requesting to change your H1B sponsor from your current employer to them. The term "transfer" is informal — USCIS calls it a **change of employer petition**.

:::info
title: Key facts about H1B transfers
- The new employer files a new I-129 petition on your behalf
- You do NOT lose your H1B status just because you changed jobs — but timing and filing matter
- Under AC21 portability, you may work for the new employer after the transfer petition is **filed and receipted** (conditions apply)
- The transfer is cap-exempt — it does not require going through the H1B lottery again
- Your total H1B clock (6-year max for most) continues — it is not reset
:::

## Who can transfer an H1B

You can transfer your H1B to a new employer if you are currently in valid H1B status (or within the 60-day grace period after your H1B employment ended). The new employer must:

- Have a legitimate H1B-eligible position (specialty occupation)
- File a Labor Condition Application (LCA) with the Department of Labor before filing the I-129
- File Form I-129 with USCIS, attaching the LCA and supporting documentation

## When can you start working for the new employer

This is the most frequently misunderstood part of H1B transfers. The rules depend on whether **AC21 portability** applies.

:::warn
title: This is not legal advice — confirm with your attorney
The following is general educational information. Whether you can legally work for a new employer before H1B approval depends on specific facts about your case. Your immigration attorney — or the new employer's attorney — must verify your situation before you start working.
:::

Under **AC21 portability** (Immigration and Nationality Act Section 214(n)), you may be able to start working for the new employer as soon as the **new I-129 petition is filed and USCIS issues a receipt notice**, provided all of these conditions are met:

:::info
title: AC21 portability conditions (all must be met)
- You were last admitted to the US in valid H1B status
- Your current H1B status has not expired
- You have not engaged in unauthorized employment
- The new petition is filed before your current H1B status expires
- You have not violated the terms of your H1B
:::

If your current I-94 or H1B status has already expired, you are NOT covered by AC21 portability. You must wait for the new petition to be **approved** before working.

## Cap-subject vs. cap-exempt transfers

H1B transfers are **always cap-exempt** — you do not re-enter the lottery. Your employer is not limited by the annual H1B cap when petitioning for an existing H1B holder changing employers.

## What documents you need for an H1B transfer

The new employer (or their attorney) will need:
- Copies of all prior H1B approval notices and I-797 forms
- Your current and all prior I-94 records
- Passport copies (all pages, all valid passports)
- Latest pay stubs from current employer
- Academic credentials (degree transcripts, evaluations)
- Resume

## Why H1B transfers get RFEs

:::bad
title: Common H1B transfer RFE triggers
- Specialty occupation challenge — USCIS questions whether the role qualifies as H1B-eligible
- Employer-employee relationship — particularly for consulting, staffing, or third-party placement situations
- Itinerary — USCIS may ask for a detailed statement of work and client letters
- Wage and LCA issues — prevailing wage compliance and LCA location must match actual work location
:::

## After the transfer is approved

Once the new employer's I-129 is approved, you will receive a new I-797 approval notice with updated authorized period dates. Update your employer on file with USCIS (your new employer is already the petitioner).

:::cta
title: Check your H1B transfer risk factors
body: Use the H1B Transfer Risk Checklist to assess your specific situation and understand what documents to gather.
button: Open the checklist tool
href: /tools/h1b-transfer-risk-checklist
:::

## Frequently asked questions

### Do I need a new visa stamp for an H1B transfer?
No — you do not need a new visa stamp for an H1B transfer if you remain in the US. Your existing H1B visa stamp remains valid for re-entry until it expires. If you travel abroad and need to re-enter, you will typically need a new visa stamp showing the new employer. [Read: H1B travel to India and stamping](/h1b/travel-to-india)

### What happens to my I-94 during a transfer?
Your I-94 record continues under your current employer's petition until the transfer is approved. After approval, your authorized period is set by the new petition. Do not let your I-94 expire before the new petition is filed.

### Can I transfer while my previous H1B was laid off?
Yes, if you are within the 60-day grace period and certain conditions apply. [Read: H1B transfer after layoff](/h1b/transfer-after-layoff)

### How long does an H1B transfer take?
Regular processing: typically 3–6 months depending on service center. Premium processing (Form I-907): USCIS action within 15 business days. Check current times at [uscis.gov/check-processing-times](https://www.uscis.gov/check-processing-times). See also: [USCIS processing times guide](/uscis/processing-times)`,
  },

  /* ────────────────────────── EXTENSION ─────────────────────────────────── */
  {
    slug: "extension",
    kind: "guide",
    title: "H1B Extension Guide: 3-Year, 6-Year, and Beyond 6 Years with I-140",
    seoTitle: "H1B Extension Guide | 3-Year, 6-Year Limit, I-140 Extensions for Indians",
    metaDescription:
      "How does H1B extension work? Understand 3-year extensions, the 6-year cap, the 240-day rule, and how an approved I-140 unlocks H1B extensions beyond 6 years for Indian EB applicants.",
    navLabel: "H1B Extension",
    excerpt:
      "H1B extensions follow a structured timeline: initial 3 years, a 3-year extension, then the 6-year cap. But an approved I-140 unlocks annual extensions — critical for Indian green card waiters.",
    date: "2026-06-16",
    content: `An **H1B extension** is a new Form I-129 petition filed by your current employer to extend your period of authorized stay in H1B status beyond what was previously approved. USCIS issues H1B in increments — typically 3 years at a time — and you must file extensions to continue working legally.

## H1B timeline: 3-year increments and the 6-year cap

:::info
title: Standard H1B timeline
- **Initial approval:** Up to 3 years
- **First extension:** Up to 3 more years (total: 6 years)
- **Hard cap:** 6 years total for most H1B holders
- **Exception:** I-140 approval or long-pending PERM can unlock additional 1-year or 3-year extensions
:::

After 6 years, most H1B holders must leave the US for at least 1 year before obtaining a new H1B. The exception for Indian EB applicants who have a pending green card process is critical.

## H1B extension beyond 6 years: the I-140 exception

For Indian EB applicants, the 6-year H1B cap is often a major concern because the green card queue can stretch decades. Two provisions offer relief:

:::good
title: H1B extension beyond 6 years — two paths
**Path 1 (1-year extensions):** Your PERM labor certification OR I-140 petition has been pending for 365+ days without final action. You can extend H1B in 1-year increments indefinitely while the green card process is pending.

**Path 2 (3-year extensions):** Your I-140 has been approved. You can extend H1B in 3-year increments even if the I-140 is with a previous employer (subject to AC21 conditions). This is the most common path for long-wait Indian EB applicants.
:::

Having an **approved I-140** is by far the more secure path. Even if you change employers under AC21, the approved I-140 from a previous employer continues to support H1B extensions as long as your green card process continues.

## The 240-day rule

If your H1B extension petition is filed **before your current status expires** but USCIS has not yet approved it by the expiration date, you may continue working for up to **240 days** after your I-94 expiry under the 240-day rule, provided your petition remains pending.

:::warn
title: 240-day rule cautions
- You can continue working but you are technically in a period of authorized stay — not valid H1B status
- You cannot travel internationally during this window without risk (your I-94 has expired)
- If your petition is denied, the 240-day authorization ends immediately
- Always confirm 240-day rule eligibility with your attorney before relying on it
:::

## What your employer needs for an H1B extension

- Updated LCA (Labor Condition Application) filed with DOL
- Current I-797 approval notices (all prior)
- Your latest I-94 record
- Proof of continuous employment (pay stubs, W-2s)
- Updated position description if duties have changed

## Premium processing for H1B extensions

Premium processing (Form I-907) guarantees USCIS action within 15 business days of accepting the premium upgrade. This is commonly used for extensions where the current status expiry is approaching and there is timing pressure. Fees can change — always verify the current amount at uscis.gov/i-907 before filing.

:::bad
title: Premium processing does not guarantee approval
Premium processing guarantees USCIS will act — meaning approve, issue an RFE, or deny — within 15 business days. It does not guarantee the result. If an RFE is issued, the 15-business-day clock restarts after your attorney submits the RFE response.
:::

## Frequently asked questions

### How far in advance should I file an H1B extension?
Most immigration attorneys recommend filing 6 months before your current I-94 expiry. This gives time to respond to RFEs while still having valid status. Filing earlier than 6 months may result in USCIS returning the petition as premature.

### Can I extend H1B if my employer is different from the one on my I-140?
Yes — under AC21 portability, if your I-140 was approved for 180+ days and you changed to a same or similar occupation, the I-140 continues to support H1B extensions even with the new employer. Consult your attorney to confirm the position qualifies.

### What happens if my H1B extension is denied?
If the extension is denied and you have no other valid status or pending petition, you would be out of status. You generally have a very short window (sometimes days) to depart or take remedial action. Contact your attorney immediately if you receive a denial.`,
  },

  /* ────────────────────────── AMENDMENT ─────────────────────────────────── */
  {
    slug: "amendment",
    kind: "guide",
    title: "H1B Amendment: When It Is Required and What Triggers It",
    seoTitle: "H1B Amendment: When Required, What Triggers It | Indian Workers Guide",
    metaDescription:
      "Do you need an H1B amendment? Learn what material changes require an H1B amendment petition, the consequences of not filing, and when to consult your employer's attorney.",
    navLabel: "H1B Amendment",
    excerpt:
      "An H1B amendment is required when material changes occur — most commonly a new worksite location. Filing the wrong amendment decision can create serious compliance problems.",
    date: "2026-06-16",
    content: `An **H1B amendment** is a new Form I-129 petition filed by your employer to notify USCIS of material changes to your H1B employment that go beyond what was approved in the original or current petition.

:::warn
title: When an H1B amendment is required vs. optional
USCIS guidance (particularly after the Matter of Simeio Solutions case) requires amendments for certain material changes. The consequences of not filing when required include USCIS finding that you fell out of H1B status. This is a complex area — always confirm amendment requirements with your employer's immigration attorney before a change takes effect.
:::

## What triggers an H1B amendment

:::info
title: Changes most commonly requiring an H1B amendment
- **New work location outside the area of intended employment** — a new city, MSA (Metropolitan Statistical Area), or worksite beyond commuting distance of the LCA-covered location
- **Significant change in job duties** — a promotion or role change that materially changes the nature of the position
- **Change in employer entity** — acquisitions, mergers, or corporate restructurings that change the legal employer
:::

## What does NOT require an amendment (generally)

- Short-term travel to a new location for under 30–60 days (within certain DOL guidelines)
- Working from home within the same MSA as the LCA-covered location
- Minor title changes with no material duty changes
- Salary increases

Note: These exceptions have nuances. Your employer's attorney must evaluate each situation.

## Consequences of not filing when required

If USCIS finds during an RFE or audit that a material change occurred without an amendment being filed, it can determine that you were out of H1B status from the date of the change. This can affect future extension applications, green card processing, and visa stamping.

## The amendment process

The amendment process mirrors an H1B extension:

:::steps
Your employer identifies that a material change is about to occur.
Your employer's attorney files a new LCA with the Department of Labor covering the new location and wage level.
The attorney prepares the amended I-129 petition and files with USCIS.
You may continue working (including at the new location, if same or similar) while the amendment is pending — confirm with your attorney.
USCIS issues an updated I-797 approval once adjudicated.
:::

## Premium processing for amendments

Premium processing is available for H1B amendments and is commonly used when the worksite change is time-sensitive. USCIS action in 15 business days.

## Frequently asked questions

### My employer is moving my project to a new client site in another city. Do I need an amendment?
Almost certainly yes, if the new city is outside the area covered by the current LCA. Your employer's attorney should file both a new LCA (which can be done quickly) and an amendment petition. Confirm before you start working at the new location.

### Can I work at the new location while the amendment is pending?
Generally yes, once the new LCA is filed and in place for the new location — but you need the attorney's confirmation that the specific situation allows this. Do not assume.

### How long does an H1B amendment take?
Same as extension: 3–6 months regular processing, 15 business days with premium processing. Check current official times at [uscis.gov/check-processing-times](https://www.uscis.gov/check-processing-times).`,
  },

  /* ──────────────────────────── RFE ──────────────────────────────────────── */
  {
    slug: "rfe",
    kind: "guide",
    title: "H1B RFE Explained: Common Types, Deadlines, and What to Do",
    seoTitle: "H1B RFE Meaning | Common RFE Types, Deadline, Response for Indians",
    metaDescription:
      "Received an H1B RFE? Understand what a Request for Evidence means, the most common H1B RFE types (specialty occupation, employer-employee), the response deadline, and what not to do.",
    navLabel: "H1B RFE",
    excerpt:
      "An H1B RFE is not a denial — but it has a hard deadline. Understand what triggers RFEs on H1B petitions, what evidence USCIS wants, and why your attorney must lead the response.",
    date: "2026-06-16",
    content: `A **Request for Evidence (RFE)** on an H1B petition means USCIS needs additional documentation before it can adjudicate your case. An RFE is not a denial. Many H1B petitions receive RFEs and are ultimately approved — but only with a complete, timely, well-documented response.

:::warn
title: RFE deadline is critical
The RFE notice includes a response deadline — typically **87 days** from the **notice date** (not the date you receive it). Missing this deadline results in automatic denial with no recourse. Contact your attorney the same day you receive an RFE.
:::

## Most common H1B RFE types

### 1. Specialty occupation

The most frequent H1B RFE category. USCIS questions whether the offered position qualifies as a "specialty occupation" — defined as a role that normally requires a bachelor's degree or higher in a specific field.

:::info
title: What USCIS looks for in a specialty occupation RFE
- Whether a theoretical and practical application of highly specialized knowledge is required
- Whether a degree in a specific field (not just any bachelor's) is the normal minimum entry requirement
- Industry-specific data: DOL occupational codes, industry surveys, expert opinions
- Employer's history of hiring for that role
:::

### 2. Employer-employee relationship

Common for consulting companies, staffing firms, and third-party placement situations. USCIS asks: does the petitioning employer actually control the day-to-day work of the H1B worker?

Required evidence usually includes:
- Detailed contracts and work orders with end clients
- Client letters confirming the employer controls work
- Itinerary and specific project details
- Supervisory structure documentation

### 3. Maintenance of status

USCIS questions whether the worker has been continuously maintaining valid H1B status through prior employer changes, previous petition issues, or gaps in employment.

### 4. Wage and LCA compliance

USCIS may question whether the LCA wage matches the actual wage level and the prevailing wage for the occupation and location.

## What to do when you receive an H1B RFE

:::steps
Contact your immigration attorney the same day you receive the RFE.
Locate the response deadline date on the RFE notice — this is from the notice date, not your receipt date.
Do NOT submit anything without your attorney reviewing and approving the full response.
Gather all documents your attorney requests — promptly.
Do not make major work, travel, or immigration decisions while RFE is pending without attorney guidance.
Submit the complete, attorney-prepared response well before the deadline.
:::

:::bad
title: Do not do these things during an RFE
- Do not submit a partial response hoping to supplement later — USCIS may deny based on what was submitted
- Do not ignore the RFE thinking it will resolve itself
- Do not start working for a different employer without understanding how the RFE affects portability
- Do not travel internationally without confirming with your attorney
:::

## After the RFE response

USCIS will review the response and may:
- **Approve** the petition
- **Deny** the petition (if the response is insufficient)
- Issue a **Notice of Intent to Deny (NOID)** — another chance to respond, but with a shorter deadline

## Premium processing and RFEs

If you are on premium processing, the 15-business-day clock **restarts** from the day USCIS receives your RFE response. So a premium processing case with an RFE will take longer than 15 business days total, but USCIS is still committed to acting within 15 business days of the response receipt.

## Frequently asked questions

### Does an RFE mean my H1B will be denied?
No. Many H1B petitions with RFEs are approved after a complete response. The probability of approval depends heavily on the strength of the evidence and the quality of the legal argument in the response — which is why having an experienced immigration attorney is critical.

### My employer got the RFE but I haven't seen it. What should I do?
For employer-filed petitions, the RFE is sent to the employer's attorney. Contact HR at your company immediately to confirm an RFE was received and ask for a timeline on the response. The deadline applies regardless of whether you personally see the notice.

### Can I change jobs while an H1B RFE is pending?
This is complex. AC21 portability may technically apply, but a pending RFE adds legal risk to portability claims. Consult your attorney before making any employment changes while an RFE is pending.`,
  },

  /* ───────────────────────── PREMIUM PROCESSING ──────────────────────────── */
  {
    slug: "premium-processing",
    kind: "guide",
    title: "H1B Premium Processing Explained: What It Does and Does Not Guarantee",
    seoTitle: "H1B Premium Processing | 15 Business Days, Cost, What It Guarantees",
    metaDescription:
      "What is H1B premium processing? Understand the 15 business day guarantee, current fee, when to use it, and why it speeds up action but does not guarantee approval.",
    navLabel: "Premium Processing",
    excerpt:
      "H1B premium processing guarantees USCIS will act within 15 business days — meaning approve, issue an RFE, or deny. It speeds up the process but does not change the outcome.",
    date: "2026-06-16",
    content: `**H1B premium processing** is an optional paid service where the petitioning employer pays USCIS an additional fee to process the I-129 H1B petition on an expedited schedule. USCIS guarantees to take action — approve, issue an RFE, or deny — within **15 business days** of accepting the premium processing upgrade.

:::warn
title: Premium processing does not guarantee approval
Premium processing guarantees speed, not success. USCIS may still issue an RFE or deny the petition. Do not interpret "premium processing" as a path to certain approval.
:::

## Key facts about premium processing

:::info
title: Premium processing quick reference
- **Covered forms:** I-129 (H1B, L1, TN, O1 and others), I-140 (employment green card) — verify current eligible forms at uscis.gov
- **Current fee:** Verify at uscis.gov/i-907 before filing (subject to change)
- **USCIS guarantee:** Action within 15 business days of accepting the premium upgrade
- **What "action" means:** Approval, Request for Evidence (RFE), Notice of Intent to Deny (NOID), or denial
- **RFE impact on clock:** If USCIS issues an RFE, the 15-business-day clock restarts after your attorney submits the response
- **Who files:** The petitioning employer or their attorney files Form I-907 with the fee
:::

## When does premium processing start

Premium processing can be requested at the time of the initial filing, or it can be added later by filing Form I-907 for an already-pending petition. The 15-business-day clock starts from the day USCIS **accepts and receipts** the I-907 premium processing upgrade — not from the original petition filing date.

## When to use premium processing

Premium processing makes sense when:

:::good
title: Situations where premium processing is commonly useful
- **H1B transfer with urgent start date** — new employer needs the worker to start quickly
- **Extension approaching I-94 expiry** — to avoid relying on the uncertain 240-day rule
- **H1B amendment** — when worksite change is already in effect and a quick decision is needed
- **I-140** — when establishing a priority date quickly matters for H1B extensions beyond 6 years
- **Any situation with travel concerns** — getting an approval notice before international travel
:::

## When premium processing is NOT available

Premium processing is **not available** for:
- I-485 (Adjustment of Status)
- I-765 (EAD)
- I-131 (Advance Parole)
- N-400 (Naturalization)

Always verify current eligibility at uscis.gov — USCIS has periodically expanded premium processing to new form types.

## Cost and who pays

The premium processing fee is paid by the petitioner (employer) — employers are permitted to pay it on behalf of the employee. In most cases, employers choose to pay premium processing when it is in their business interest (urgent hire, expiring status).

Some employers require the employee to pay if the premium request is employee-initiated. Review your company's immigration policy.

## Premium processing refunds

If USCIS does not act within the 15-business-day window, you are entitled to a refund of the premium processing fee and USCIS will continue to expedite the case. Contact your employer's attorney if the window has passed without action.

## Frequently asked questions

### Will premium processing help if my case already has an RFE?
If the RFE response has been submitted, premium processing can be requested for the remaining adjudication. USCIS will then have 15 business days from receipt of the I-907 to act. Confirm with your attorney whether this is possible for your specific petition.

### Does premium processing change the approval criteria?
No. USCIS adjudicates premium processing petitions under exactly the same standards as regular cases. The officer reviewing your petition applies the same rules regardless of processing type.

### My employer won't pay for premium processing but my status is expiring. What can I do?
Discuss the business impact with HR — an expired employee who cannot legally work creates problems for the employer too. You can also ask if you are permitted to pay the fee yourself under your company's policy. Consult your attorney about 240-day rule eligibility as an alternative.`,
  },

  /* ─────────────────────── LAYOFF / 60-DAY GRACE PERIOD ─────────────────── */
  {
    slug: "layoff-60-day-grace-period",
    answerFirst: true,
    kind: "guide",
    title: "H-1B 60-Day Grace Period 2026: Rules, Options & Timing",
    seoTitle: "H-1B 60-Day Grace Period: Rules, Options & Timing",
    metaDescription:
      "Laid off on H-1B? You get 60 days from your last day of employment (or until I-94 expiry) to transfer, change status, or depart. You cannot work during it.",
    navLabel: "Layoff & 60-Day Grace",
    excerpt:
      "The 60-day H1B grace period after involuntary termination gives you a window to pursue options. But it is not an automatic safety net — unauthorized work ends it immediately.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
If your H-1B job ends, you get up to **60 calendar days** — counted from your **last day of employment**, or until your **I-94 expires, whichever comes first** — to stay in the US lawfully while you fix your status. In that window you may have a new employer file an **H-1B transfer**, file a **change of status** (H-4, F-1, O-1), or depart. What you may **not** do is work for anyone, in any form, including freelance or unpaid-then-paid arrangements. The grace period is granted **per authorized validity period** and is discretionary, not an entitlement.
:::

:::key
- Start counting from your **last day of employment**, not your final paycheck or severance end date.
- Take the shorter of **60 days or your I-94 expiry** — an I-94 ending in 30 days gives you 30 days, not 60.
- Do **not work at all** during the grace period; a new H-1B transfer must be filed *and* receipted before you resume work.
- Contact an immigration attorney within the **first few days** — options narrow fast as the clock runs.
- Protect the long game: an **approved I-140** preserves your priority date and supports 3-year H-1B extensions with the next employer.
:::

Being laid off on an H-1B starts a clock that most people misunderstand in the same two ways: they think it starts later than it does, and they think it allows work. It does neither. This guide is for H-1B workers (and H-4 families) who have just been notified, or who want a plan in place before it happens. The number that governs everything: 60 days from your last day of employment, capped by your I-94 end date. Below: exactly what the grace period allows and forbids, how to count your deadline, each of your three real options with timing, what happens to your green card process and I-140, how the H-4 family is affected, and the mistakes that cost people their status.

If your H1B employment ends — through a layoff, termination, or resignation — you enter what is commonly called the **60-day grace period**. This is a regulatory provision giving H1B holders up to 60 days (or until their I-94 expires, whichever is shorter) to take corrective action without immediately falling out of status.

:::warn
title: The 60-day grace period is not unlimited protection
- The grace period allows you to stay in the US and pursue options — it does NOT authorize you to work
- If you work for any employer without a valid, approved work authorization during this window, you are out of status
- The 60 days is from the last day of employment, not from when you receive a final paycheck
- If your I-94 expires before 60 days, the grace period is shorter
:::

## What Does the 60-Day Grace Period Allow?

:::info
title: What you CAN do during the grace period
- Remain in the US lawfully
- Have a new employer file an H1B transfer petition on your behalf
- File a change of status (COS) to another visa category (F-1, O-1, H-4, etc.)
- Prepare for voluntary departure from the US
- Consult with attorneys and evaluate options
:::

## What Does the Grace Period NOT Allow?

- Working for any employer without valid, approved work authorization
- Freelancing, contract work, or consulting — even brief or informal arrangements
- Volunteering for compensation

## What Are Your Options During the 60 Days?

### Option 1: New employer files an H1B transfer

This is the most common path. A new employer files a new I-129 petition for you. **Under most circumstances, you cannot start working for the new employer until the petition is filed AND you have a receipt notice** — even during the grace period. Confirm the exact conditions with an immigration attorney.

See: [H1B transfer after layoff](/h1b/transfer-after-layoff)

### Option 2: Change of status

You can file a change of status to another visa category, such as:
- H-4 dependent status (if your spouse is on H1B)
- F-1 student status (if you intend to study)
- O-1 extraordinary ability (if you qualify)

### Option 3: Departure

If you have no viable US options or need time to regroup, you can depart the US. From outside the US, you are not subject to the grace period pressure and can continue pursuing options (including a new H1B from outside the US or through consular processing).

| Option | Filing deadline | Can you work? | Realistic timing |
|---|---|---|---|
| New employer H-1B transfer | Filed within the 60 days | Only after filing **and** receipt notice | Receipt in days–weeks; premium processing 15 business days |
| Change of status to H-4 | Filed within the 60 days | No (H-4 EAD is a separate later filing) | Months to adjudicate; status preserved while pending |
| Change of status to F-1 | Filed within the 60 days | No (limited on-campus work later) | Months; needs an I-20 first |
| Change of status to O-1 | Filed within the 60 days | After approval | Evidence-heavy; premium processing available |
| Depart the US | Before day 61 | N/A | Removes deadline pressure entirely |

> A timely-filed transfer or change-of-status petition generally lets you remain while it is pending, but approval is never guaranteed — file early rather than on day 59.

## How Do You Count Your 60 Days?

The 60 days begins on your **last day of H1B employment** — not your last day on payroll or when HR processes your termination paperwork. The clock starts when your employment relationship ends. It is **60 calendar days**, not business days, and it is capped by your I-94.

| Scenario | Last day of employment | I-94 expiry | Your actual deadline |
|---|---|---|---|
| Standard layoff | March 1 | Aug 2027 | April 30 (60 days) |
| I-94 expiring soon | March 1 | March 31 | **March 31** (I-94 wins) |
| WARN notice period, still on payroll | May 1 (end of notice) | Aug 2027 | June 30 — clock starts May 1 |
| Severance paid through June | March 1 | Aug 2027 | April 30 — severance does not extend it |
| Resignation | Your last working day | Aug 2027 | 60 days from that day |

:::bad
title: Common mistakes during the grace period
- Waiting too long to contact an immigration attorney — do it within the first few days
- Assuming any work is permissible during the grace period
- Failing to track the exact date employment ended
- Traveling internationally without understanding the re-entry implications
- Ignoring the grace period because you have job offers in progress
:::

## Do WARN Notice and Severance Extend the Grace Period?

Some employers covered by the WARN Act provide 60-day notice of layoff, during which you remain on payroll. If you are on payroll through a WARN Act notice period, you are still employed and the grace period has not started. Confirm the exact last day of employment with HR.

Severance pay after termination does NOT extend your employment period — the grace period starts from the last day you were actively employed, not when severance payments end.

## What Happens to Your Green Card Process and Family?

A layoff does not erase the green card progress you have made. An **approved I-140** keeps your priority date, and if it has been approved 180+ days it generally survives the employer withdrawing it — which is what lets a new employer support 3-year H-1B extensions beyond the six-year cap. A pending **PERM or unapproved I-140**, by contrast, usually does not survive the employer relationship. On the family side, **H-4 dependents** hold status derivative of yours, so their status and any H-4 EAD ride on you securing a new petition within the window.

## How This Connects to the Rest of Your Case

The grace period is a status problem, a green card problem, and a money problem at once. On status, the next step is usually an [H-1B transfer after layoff](/h1b/transfer-after-layoff) — read it before accepting any offer. On the green card, check what your [approved I-140 preserves](/green-card/i-140-approved-what-next) and where your [priority date](/visa-bulletin/priority-date) stands, since a long [India backlog](/green-card/green-card-backlog-india) makes I-140 retention especially valuable. For the family, the [H-4 EAD navigator](/tools/h4-ead-navigator) covers what happens to spousal work authorization, and the broader [H-1B layoff checklist](/h1b-layoff) covers the financial runway.

## Frequently asked questions

### How long is the H-1B grace period after a layoff?
Up to 60 calendar days from your last day of employment, or until your I-94 expires — whichever is shorter. It is granted per authorized validity period and is discretionary rather than guaranteed, so file any transfer or change-of-status petition well before day 60.

### When does the 60-day grace period start?
On your last day of actual H-1B employment. It does not start when your final paycheck arrives, when severance ends, or when HR completes termination paperwork. If you are on payroll through a WARN Act notice period, you are still employed and the clock has not begun.

### Can I work during the H-1B 60-day grace period?
No. You cannot work for any employer in any capacity — including freelance, contract, consulting, or informal arrangements — until a new petition is filed and you have a receipt notice. Unauthorized work jeopardizes your status and future filings.

### Can I travel internationally during the grace period?
It is risky. Leaving the US during the grace period generally means you cannot re-enter in H-1B status without a valid visa and a new approved petition, and re-entry may cut your remaining options short. Speak to an attorney before booking anything.

### I was laid off. Can I do consulting or freelance work during the 60-day period?
No. Any work — including freelancing, consulting, or informal arrangements — without a valid work authorization constitutes unauthorized employment and immediately jeopardizes your status.

### Does the 60-day grace period reset if I find a new job?
Once an H1B transfer petition is filed and receipted, you are no longer in the grace period — you are in pending petition status under the new employer. You are not given a new 60-day period.

### What if I need more than 60 days to find a job?
Your immigration options narrow significantly after 60 days. Before the grace period expires, consider filing a change of status to H-4 (if applicable), F-1, or another category to buy time. Do not remain in the US beyond the grace period without valid status. Consult an attorney immediately.`,
  },

  /* ───────────────────────── TRAVEL TO INDIA ────────────────────────────── */
  {
    slug: "travel-to-india",
    kind: "guide",
    title: "H1B Travel to India: Visa Stamping, 221g Risk, and When Not to Go",
    seoTitle: "H1B Travel to India | Visa Stamping, 221g Risk, Admin Processing",
    metaDescription:
      "Traveling to India on H1B? Understand visa stamping at Indian consulates, the 221g administrative processing risk, when to avoid travel, and what H1B holders need for re-entry.",
    navLabel: "Travel to India",
    excerpt:
      "H1B travel to India for visa stamping carries real risk — especially after a job change, RFE, or transfer. Understand the process before you book your flight.",
    date: "2026-06-16",
    content: `Traveling to India while on H1B status is generally permissible, but it requires careful planning. The main reason most H1B holders travel to India for immigration purposes is to get a **new H1B visa stamp** at a US consulate.

:::info
title: Key H1B travel facts
- You need a valid H1B visa stamp to re-enter the US, not just an approval notice
- The visa stamp and the H1B approval are two different things — a new I-797 approval does NOT automatically give you a new visa
- US consulates in India include Chennai, Mumbai, Hyderabad, Kolkata, and New Delhi
- Consular processing involves security checks that can cause delays (administrative processing)
:::

## When do you need a new H1B visa stamp

You do NOT need a new visa stamp to continue working in the US — your existing visa stamp remains valid for re-entry. You need a new stamp when:

- Your existing H1B visa stamp has expired and you plan to travel internationally
- Your H1B petition was transferred to a new employer and your existing stamp shows the old employer (though some consulates allow re-entry on an approved I-797 — rules vary)
- You changed employers after your stamp was issued

## The stamping process in India

:::steps
Create an appointment through the US consulate website (ustraveldocs.com for India).
Complete Form DS-160 (nonimmigrant visa application).
Attend the visa appointment at the US consulate.
The consular officer reviews your documents and either approves the stamp or issues a 221(g) for additional processing.
If approved, your passport is returned with the new H1B visa stamp.
:::

## The 221(g) risk and administrative processing

The most significant risk of traveling to India for visa stamping is receiving a **221(g) refusal for administrative processing**. This means the consulate has put your application on hold for additional review — security checks, employer verification, or documentation requests.

:::bad
title: 221(g) administrative processing: what this means
- Your passport may be held at the consulate for weeks or months
- There is no guaranteed timeline for 221(g) resolution
- You may not be able to return to the US during this period
- It can affect your job, your H1B filing deadlines, and your green card timeline
- USCIS rules and employer relationships are scrutinized more heavily at the consulate than domestically
:::

## When to be especially cautious about travel

Do NOT travel to India for stamping without consulting your immigration attorney if any of these apply:

- You recently changed employers (H1B transfer)
- Your petition is in premium processing or pending an RFE response
- You work in consulting, staffing, or third-party placement (higher 221g risk)
- You have had prior 221g issues
- Your visa stamp shows a different employer than your current petition
- Any prior immigration violations, overstays, or status gaps exist

## Documents needed for H1B stamping

- Valid passport (and prior passports if applicable)
- Current I-797 approval notice (all prior H1B I-797s are helpful)
- DS-160 application confirmation
- Appointment confirmation
- Most recent I-94 record printout
- Recent pay stubs (last 3–6 months)
- Letter from employer confirming employment and H1B details
- Copy of current LCA
- Academic credentials

## Dropbox renewal (third-country nationals)

If you are an Indian national who has previously been stamped at a US post in India, you may be eligible for the **dropbox** (interview waiver) option for renewal — a simpler process where your passport is sent to the consulate without a personal interview. Verify current eligibility at ustraveldocs.com, as policies change.

## Frequently asked questions

### Can I re-enter the US with just my I-797 approval notice and an expired visa stamp?
This depends on the airline and CBP officers. Generally, you cannot board a US-bound international flight without a valid visa (unless you hold a green card, US passport, or are a citizen of a visa-waiver country). An expired H1B visa stamp requires renewal before travel. Some border crossings from Canada or Mexico may have different rules — confirm with your attorney.

### How long does India H1B stamping take?
If approved at interview without 221(g): passport is usually returned within a week. With 221(g) administrative processing: can take weeks to months with no guaranteed timeline.

### Is it safe to travel to India right after an H1B transfer?
Heightened caution is advised. A recent transfer means a new employer relationship that will be scrutinized at the consulate. Many attorneys advise waiting for the transfer to be approved and for some employment history with the new employer before attempting stamping. Consult your attorney before booking.`,
  },

  /* ───────────────────────── TRANSFER AFTER LAYOFF ─────────────────────── */
  {
    slug: "transfer-after-layoff",
    kind: "guide",
    title: "H1B Transfer After Layoff: What to Do in the 60-Day Window",
    seoTitle: "H1B Transfer After Layoff | 60-Day Grace Period, New Petition, Timeline",
    metaDescription:
      "Got laid off on H1B? Learn exactly what to do in the 60-day grace period, how an H1B transfer works after layoff, when you can start working, and what mistakes to avoid.",
    navLabel: "Transfer After Layoff",
    excerpt:
      "After an H1B layoff, the clock starts immediately. Here is a day-by-day framework for the 60-day grace period and what must happen before you can legally work for a new employer.",
    date: "2026-06-16",
    content: `If you were laid off from your H1B job, you have a defined window to act. This guide is specifically for H1B holders who have been laid off and are pursuing a **new H1B petition (transfer) with a new employer** during the 60-day grace period.

:::warn
title: Not legal advice — timing is everything
Every situation has specific facts that matter: when employment ended, current I-94 status, any prior petitions, the terms of any severance, and WARN Act applicability. Consult an immigration attorney within the first 1–5 days of your layoff. Do not wait.
:::

## Day-by-day framework for the 60-day window

:::info
title: Immediate actions (Days 1-5)
- Contact an immigration attorney — even before talking to new employers
- Confirm the exact date your employment ended with HR
- Determine when your I-94 expires (check cbp.dhs.gov/I94)
- Review your options: H1B transfer, H-4, F-1, departure
- Do NOT work for anyone, including informally, until you have valid work authorization
:::

:::good
title: Active job search period (Days 6-30)
- Pursue job offers — many employers understand the H1B grace period situation
- When you receive an offer, have the new employer initiate the H1B transfer petition process immediately
- Premium processing is almost always advisable in a layoff situation — 15 business days vs. 3-6 months
- Keep documentation of your job search and any offer letters
:::

:::warn
title: Critical window (Days 31-50)
- If no new petition is filed by this point, your options are narrowing rapidly
- Consider change of status to H-4 (if applicable) or voluntary departure
- Do not let day 60 pass without a filed petition or valid change of status
:::

## When can you start working for the new employer

After your old employer's H1B ended, you cannot work without authorization. With a new H1B transfer:

- **Before receipt notice:** You generally cannot start work — you have no valid work authorization at this moment
- **After receipt notice is issued:** Many attorneys cite AC21 portability as supporting work authorization at this point — but only if you were in valid H1B status when the petition was filed (i.e., within the 60-day grace period and your I-94 has not yet expired)
- **After approval:** Clear work authorization

This is one of the most legally nuanced points in H1B law. See: [When can you start work after H1B transfer receipt?](/h1b/start-work-after-transfer-receipt)

## What if 60 days has passed

If the 60-day grace period expires without a filed transfer petition or change of status, you are technically out of status. Options become much more limited:

- You may still be able to file a motion if there are extenuating circumstances
- You could depart the US and apply for a new H1B from outside (either through a new cap-exempt petition or waiting for the next lottery)
- Some situations allow a "nunc pro tunc" (late) filing argument — these are complex and not guaranteed

Do not remain in the US beyond 60 days without valid status or a pending petition. The consequences compound quickly.

## Special situations

### WARN Act notice period
If your employer placed you on a 60-day paid notice period under the WARN Act, you are still technically employed during that period. The grace period does not start until the end of the WARN Act notice period. Confirm with HR when your actual employment end date is.

### Severance with NDA
Severance payments do not extend your employment period. The grace period starts from your last day of work, even if you receive 3 months of severance.

### Previous employer was acquired or merged
Corporate restructuring may mean your H1B petition continues with the successor employer under certain circumstances. Consult your attorney about successor-in-interest rules before treating this as a layoff situation.

## Frequently asked questions

### My offer letter says the start date is in 3 weeks. Can I ask the new employer to file with premium processing now?
Yes — and most good employers will do this for H1B candidates in a grace period. Premium processing ensures USCIS acts within 15 business days of acceptance. Communicate your grace period timeline clearly to the new employer's HR team.

### I did 2 days of consulting for a company during the grace period. Does this void my H1B?
Unauthorized work is a serious H1B compliance issue. Consult your attorney immediately and do not continue. The attorney will advise on disclosure and next steps.

### Can I interview for jobs in the US during the 60-day grace period?
Yes — attending job interviews does not constitute work. You can actively search for new employment.`,
  },

  /* ──────────────── START WORK AFTER TRANSFER RECEIPT ───────────────────── */
  {
    slug: "start-work-after-transfer-receipt",
    kind: "guide",
    title: "H1B Transfer: When Can You Start Working After Receipt Notice?",
    seoTitle: "H1B Transfer Receipt Notice: When Can You Start Work? AC21 Explained",
    metaDescription:
      "When can you legally start working for a new employer after an H1B transfer? Understand AC21 portability, the receipt notice, and the conditions that must be met.",
    navLabel: "Start Work After Receipt",
    excerpt:
      "H1B receipt notice and work authorization are often confused. AC21 portability may allow work after the petition is filed and receipted — but only if specific conditions are met.",
    date: "2026-06-16",
    content: `One of the most common H1B questions: **"Can I start working for my new employer as soon as the H1B transfer petition is filed or when the receipt notice arrives?"**

The answer is: it depends on AC21 portability, and whether the conditions are met at the time of filing.

:::warn
title: This is not a simple yes or no
Whether you can legally work for a new employer after an H1B transfer receipt — and specifically when — depends on your specific facts. Your immigration attorney must confirm your situation before you begin work at a new employer.
:::

## What AC21 portability says

**INA Section 214(n) (AC21)** allows an H1B holder to work for a new employer as soon as a new petition is filed (and a receipt notice is issued), provided:

:::info
title: All four AC21 portability conditions must be met
1. You were last admitted to the US in valid H1B status
2. Your H1B status has not expired (I-94 is valid)
3. You have not violated the terms of your H1B status
4. The new petition is a non-frivolous petition filed before your current status expires
:::

If all four are met: most immigration attorneys take the position that work authorization begins when the petition is filed and USCIS issues a receipt notice.

## The receipt notice and when it arrives

When the new employer's attorney files the I-129 petition:

:::steps
Attorney mails (or e-files) the I-129 package to the USCIS service center.
USCIS processes the package and assigns a receipt number.
USCIS mails the receipt notice (Form I-797C) to the employer's attorney — typically within 2–4 weeks for mail filing.
The attorney forwards a copy to the employer and you.
:::

With **premium processing**, USCIS processes much faster and the receipt notice arrives more quickly.

## The "filed" vs. "receipted" distinction

Some attorneys distinguish between:
- **Filed**: The day the package is physically mailed or submitted to USCIS
- **Receipted**: The day USCIS issues the receipt number

In practice, most attorneys recommend waiting for the actual receipt notice before starting work, as proof of filing is clearer with a receipt number. Others rely on a dated FedEx delivery confirmation and certificate of mailing as evidence of the filing date.

Confirm with your attorney which approach they recommend and what documentation to retain.

## When AC21 portability does NOT apply

:::bad
title: Situations where you must wait for approval
- Your current I-94 has already expired (you are in or past the grace period)
- The new petition was filed after your current status expired
- You have prior unauthorized work or status violations
- The new petition has been denied or an NOID issued
:::

In these situations, starting work before the petition is approved creates unauthorized employment risk.

## Documenting your start date

If you start work under AC21 portability before approval, retain:
- A copy of the receipt notice (I-797C) with the receipt date
- A dated copy of the attorney's filing cover letter or FedEx tracking showing the filing date
- Copies of your valid I-94 record at the time of filing
- Your current I-797 approval notices from the prior employer

These documents may be requested during an RFE, transfer audit, or future immigration applications.

## Frequently asked questions

### My attorney says I can start on the day we have proof the petition was mailed. Is that safe?
This is a defensible position that many attorneys take — the AC21 statute says "filed." The risk is if USCIS later rejects the petition (returns it without processing) for a technical deficiency. If the petition is rejected and never receipted, you may have worked without valid authorization during that window. Premium processing reduces this window significantly.

### What if my new employer's attorney is slow getting me the receipt notice?
Ask HR to chase the attorney for the receipt notice copy. You should have a scanned copy of your I-797C. If you are relying on AC21 portability, you want this document in your possession.

### I have an approved I-140 from my old employer. Does that help with my transfer?
Your approved I-140 supports H1B extension rights beyond 6 years and may support AC21 job portability for future green card purposes. It does not independently authorize you to work for the new employer — the H1B petition still must be filed and the portability conditions met.`,
  },

  /* ─────────────────── STAMPING INDIA AFTER APPROVAL ────────────────────── */
  {
    slug: "stamping-india-after-approval",
    kind: "guide",
    title: "H1B Stamping in India After Approval: Consulate Process and Risks",
    seoTitle: "H1B Stamping in India After Approval | Consulate Process, 221g, Tips",
    metaDescription:
      "Guide to getting an H1B visa stamp at Indian US consulates after your H1B is approved. Understand the consulate appointment process, 221g risk, documents needed, and timing.",
    navLabel: "Stamping India After Approval",
    excerpt:
      "Getting an H1B visa stamp in India after your petition is approved requires a US consulate appointment. Here is what the process involves, what documents you need, and the 221(g) risk.",
    date: "2026-06-16",
    content: `Once your H1B petition is approved by USCIS, you have an I-797 approval notice. If you need to travel to India and return to the US, you will need a valid **H1B visa stamp** in your passport — a separate step from the USCIS approval.

:::info
title: Approval vs. visa stamp — two different things
- **USCIS approval (I-797):** Authorizes your H1B employment in the US
- **Visa stamp (in passport):** Required to board a US-bound flight and re-enter the US through a port of entry
- An approved I-797 does NOT replace the visa stamp for re-entry purposes
:::

## US consulates in India that issue H1B visa stamps

- **Chennai** (commonly used by South Indians; historically known for shorter wait times)
- **Mumbai**
- **Hyderabad**
- **New Delhi**
- **Kolkata**

Each consulate has different appointment availability and administrative processing rates. Check current wait times at ustraveldocs.com.

## The visa stamping process step by step

:::steps
Complete Form DS-160 online — the nonimmigrant visa application.
Pay the visa application fee (MRV fee) at an authorized bank.
Schedule an appointment through ustraveldocs.com (for India).
Attend the visa interview at the US consulate with all required documents.
The consular officer reviews your application — they may approve on the spot or issue a 221(g) for additional processing.
If approved, your passport is returned with the visa stamp, typically within a few business days.
:::

## Documents required for H1B stamping in India

- Valid Indian passport (and all prior US passports)
- DS-160 application confirmation page
- Appointment confirmation letter
- MRV fee payment receipt
- Current I-797 H1B approval notice
- Prior I-797 notices (all previous H1B approvals)
- Most recent I-94 record printout (from cbp.dhs.gov/I94)
- Employer support letter confirming your H1B employment, salary, and petition details
- Recent pay stubs (last 3–6 months)
- Copy of your current LCA (Labor Condition Application)
- Academic transcripts and degree certificates
- Resume / CV

## The 221(g) administrative processing risk

A **221(g) refusal** means the consular officer cannot immediately approve your visa and is placing your application under administrative processing for additional review. This may involve:

- Security/background checks
- Employer verification — the consulate may contact your employer directly
- Request for additional documentation

:::bad
title: 221(g) can be unpredictable and lengthy
- There is no guaranteed timeline for 221(g) resolution — it can take weeks to months
- Your passport may be held at the consulate during this period
- Some H1B categories (consulting, staffing, contract roles) have higher 221(g) rates
- A 221(g) does not mean a denial — most cases are ultimately resolved
- Plan your travel to India accordingly if your employer cannot afford a long absence
:::

## Who is at higher risk for 221(g)

Higher 221(g) risk situations include:
- Consulting or staffing arrangements where the end client relationship is complex
- Recent employer changes (within the last 6–12 months)
- Previous 221(g) experiences
- Certain technology roles that may require additional security review
- Any discrepancy in documentation

## Dropbox (interview waiver) option

If you have been previously stamped in India, you may be eligible for the **dropbox** process — sending your passport via courier without attending an in-person interview. Eligibility conditions apply and change periodically. Check ustraveldocs.com for current rules.

## Tips to reduce 221(g) risk

:::good
title: Best practices for smooth H1B stamping
- Bring complete, organized documentation — a well-prepared application signals compliance
- Have your employer prepare a thorough support letter covering the nature of work, client relationship, and your role
- Avoid stamping immediately after a job change — wait until you have meaningful employment history with the new employer
- If you work in consulting, have your employer prepare client letters confirming the employer-employee relationship
- Consult your employer's attorney before traveling to ensure petition records are in order
:::

## Frequently asked questions

### How long should I plan for the H1B stamping trip?
If approved at interview without 221(g): allow about 1–2 weeks total including processing. If 221(g) is issued: plan indefinitely — some cases resolve in 2–3 weeks, others take months. Build significant buffer into your travel plans and inform your employer of the risk.

### My current H1B visa stamp still has years left but shows my old employer. Can I use it?
A valid H1B visa stamp generally allows re-entry even if it shows an old employer, as long as you have a current valid I-797 from your new employer. Some CBP officers and airlines may ask for both. The specific rules have nuances — consult your attorney and carry both your old stamp and your current I-797 when traveling.

### I have an approved I-140. Does that help at the consulate?
An approved I-140 is not directly relevant to the consular officer's decision on your H1B visa. The consulate evaluates your H1B petition on its own merits. Your I-140 does not accelerate or guarantee approval at the consulate.`,
  },
];

/* ── computed exports ─────────────────────────────────────────────────────── */

export const h1bChildPages: H1bClusterPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
  snapshot: h1bSnapshots[p.slug],
}));

export const h1bChildSlugs = h1bChildPages.map((p) => p.slug);

export function getH1bChildPage(slug: string): H1bClusterPage | undefined {
  return h1bChildPages.find((p) => p.slug === slug);
}
