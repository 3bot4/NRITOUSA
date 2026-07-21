import { computeReadingTime } from "@/lib/format";

/**
 * Green Card topic cluster (hub-and-spoke).
 *
 *   /green-card                           ← hub (static route)
 *     ├─ /green-card/perm
 *     ├─ /green-card/i-140-approved-what-next
 *     ├─ /green-card/priority-date
 *     ├─ /green-card/i-485
 *     ├─ /green-card/ead-advance-parole
 *     ├─ /green-card/eb2-vs-eb3-india
 *     ├─ /green-card/green-card-backlog-india
 *     ├─ /green-card/change-jobs-after-i140
 *     ├─ /green-card/ac21
 *     └─ /green-card/cspa-kids-aging-out
 *
 * Child pages are served by app/green-card/[slug]/page.tsx.
 */

export type GreenCardPageKind = "guide" | "reference";

export interface GreenCardPageData {
  /**
   * Opt in to the answer-first template chrome (byline row + author bio box).
   * Set only on pages rebuilt to that template, so untouched siblings render
   * exactly as before.
   */
  answerFirst?: boolean;
  slug: string;
  kind: GreenCardPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface GreenCardPage extends GreenCardPageData {
  readingTime: number;
}

export const GREEN_CARD_CLUSTER_BASE = "/green-card";
export const greenCardChildPath = (slug: string) =>
  `${GREEN_CARD_CLUSTER_BASE}/${slug}`;

const rawPages: GreenCardPageData[] = [

  /* ──────────────────────────── PERM ────────────────────────────────────── */
  {
    slug: "perm",
    kind: "guide",
    title: "PERM Labor Certification Explained for Indian H1B Workers",
    seoTitle: "PERM Labor Certification Explained | Green Card Stage 1 for Indians",
    metaDescription:
      "What is PERM labor certification? Understand Stage 1 of the employment green card process for Indians: why employers file PERM, how long it takes, audit risk, and what happens next.",
    navLabel: "PERM Labor Certification",
    excerpt:
      "PERM is the first stage of the employer-sponsored green card process. Your employer must prove no qualified US worker is available for your role before USCIS can proceed with your green card.",
    date: "2026-06-16",
    content: `**PERM** (Program Electronic Review Management) is a **labor certification** process administered by the **US Department of Labor (DOL)**. It is Stage 1 of the employment-based green card process for most workers in EB-2 and EB-3 categories.

:::info
title: What PERM accomplishes
- Your employer demonstrates to DOL that no qualified, willing US worker is available for the offered position at the prevailing wage
- DOL certifies the labor market test, clearing the way for the employer to file an I-140 immigrant petition with USCIS
- Your priority date — the most critical date for Indian EB applicants — is set at PERM filing date (or earlier, if an I-140 is later filed under the same sponsorship)
:::

:::warn
title: PERM does not apply to EB-1
EB-1A (extraordinary ability), EB-1B (outstanding researcher/professor), and EB-1C (multinational executive) categories do NOT require PERM. The employer files the I-140 directly. If you qualify for EB-1, you skip this stage entirely.
:::

## What the PERM process involves

PERM is primarily your employer's responsibility. You do not file anything directly — but you need to understand what is happening.

:::steps
**Prevailing wage determination:** The employer requests a prevailing wage from DOL for your specific job title, duties, location, and education level. This can take several months. The determined wage sets the floor — the employer must pay you at least this amount.
**Recruitment:** The employer must conduct a good-faith labor market test — typically posting the job in newspapers, professional journals, job boards, and internal postings for specified periods.
**Recruitment review:** If no qualified US workers apply (or applicants are lawfully rejected), the employer can proceed.
**ETA Form 9089 filing:** The employer files the PERM application with DOL electronically, documenting all recruitment activities.
**DOL adjudication:** DOL reviews the application. Most are processed in 6–18 months. Some are selected for audit.
:::

## How long PERM takes

Current PERM processing at DOL runs approximately 6–18 months, but this varies significantly based on DOL workload and whether the application is audited.

:::bad
title: PERM audit risk
- Approximately 20–30% of PERM applications are selected for audit — a random or targeted additional review
- Audits add months to the process — audited cases can take 12–24+ months from audit notice to certification
- Audit triggers can include: job duties that closely match your actual experience, occupation codes with historically high audit rates, or inconsistencies in the application
- Do NOT provide false or misleading information — PERM fraud has serious immigration consequences
:::

## Why PERM matters for Indians specifically

For Indian workers, the **PERM filing date** is typically what sets the **priority date** — and the priority date determines your place in the employment-based green card queue. Since India has decades-long backlogs in EB-2 and EB-3, the filing date of the PERM (or the I-140, whichever is earlier) sets your waiting position for potentially years or decades.

Getting your PERM filed as early as possible — ideally in your first year with a sponsoring employer — is one of the most important things Indian H1B workers can do.

## What happens after PERM is certified

Once DOL certifies the PERM, your employer has **180 days** to file the I-140 immigrant petition with USCIS. If they miss this window, the PERM certification expires and the process must restart from scratch.

See: [I-140 approved — what next?](/green-card/i-140-approved-what-next)

## Frequently asked questions

### Can I negotiate my salary while PERM is pending?
Yes — you can receive salary increases and promotions. The PERM prevailing wage sets a floor, not a ceiling.

### What happens if I change employers while PERM is pending?
PERM is employer-specific and cannot be transferred. If you change employers before PERM is certified, the PERM must be abandoned. The new employer must start a fresh PERM. Your priority date from the old PERM is generally lost (unless the new employer ports it under specific conditions — consult your attorney).

### Does my priority date come from PERM filing or I-140 filing?
For most EB-2 and EB-3 cases, the priority date comes from the **PERM filing date** — not the I-140 filing date. If PERM is not required (EB-1, EB-2 NIW), the priority date is set at I-140 filing.

### Can my employer withdraw PERM or cancel my sponsorship?
Yes. Employers are not legally required to continue sponsoring after PERM certification or even after I-140 approval (with some AC21 portability protections). This is one reason why having an approved I-140 for as long as possible matters — the I-140 provides some protection even if you later change employers.`,
  },

  /* ────────────────────── I-140 APPROVED WHAT NEXT ──────────────────────── */
  {
    slug: "i-140-approved-what-next",
    answerFirst: true,
    kind: "guide",
    title: "I-140 Approved: What Next? Timeline to Green Card (2026)",
    seoTitle: "I-140 Approved: What Next? Timeline to Green Card",
    metaDescription:
      "I-140 approved: unlocks 3-year H-1B extensions and, after 180 days, AC21 portability. Next steps, the I-485 wait, and the full timeline to your green card.",
    navLabel: "I-140 Approved — What Next",
    excerpt:
      "I-140 approval is a milestone, not the finish line. For Indian EB applicants, the approved I-140 establishes your priority date and unlocks H1B extensions — but the wait for visa availability can be decades.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
An approved I-140 means USCIS agrees you qualify for your EB category — it is **Stage 2 of 3**, not the finish line. It immediately unlocks **3-year H-1B extensions** beyond the six-year cap, locks in your **priority date**, and after **180 days** gives you AC21 job portability. What it does *not* do is let you file I-485: for India-born EB-2 and EB-3 applicants that wait typically runs **years to decades** until your priority date is current in the visa bulletin.
:::

:::key
- File H-1B extensions in **3-year** increments from now on — available the moment the I-140 is approved, even with a badly backlogged priority date.
- Wait **180 days** after approval before relying on AC21 portability to change employers in a same or similar occupation.
- Budget **$1,440** per adult for the I-485 when your date finally becomes current, plus **$715** if a new I-140 is ever needed.
- Track two charts monthly — Final Action Dates and Dates for Filing — because only one of them opens your I-485 window.
- Keep the approval notice permanently: an I-140 approved **365+ days** still supports H-1B extensions even if the employer later withdraws it.
:::

If your I-140 was just approved, the honest answer to "what next" is: one important door opens, and one long wait begins. This guide is for India-born EB-2 and EB-3 applicants who have the approval notice in hand and want to know exactly what it unlocks, what it does not, and what the remaining timeline to a green card looks like. The single most useful fact: I-140 approval is what lets your H-1B run past six years in three-year blocks, so your status is secure while the priority-date queue moves. Below: what the approval actually means, the full I-140-to-green-card timeline with realistic stage estimates, the steps to take this month, when you can file I-485, how AC21 portability and job changes work after approval, and what happens if your employer withdraws the petition.

**I-140 (Immigrant Petition for Alien Workers)** approval is Stage 2 of the employment-based green card process. It means USCIS has determined that you qualify for the specific EB category your employer petitioned. But for Indian EB applicants, this is far from the end of the road.

:::info
title: What I-140 approval means
- Your **priority date** is officially established (set at PERM filing date, or I-140 filing if no PERM required)
- You qualify for your EB category based on your credentials, job duties, and employer's petition
- Your H1B can be extended in 3-year increments beyond the 6-year cap once I-140 is approved
- After 180 days, you gain limited AC21 job portability protection
- You must still wait for your priority date to become current in the visa bulletin before filing I-485
:::

## What Does I-140 Approval NOT Mean?

:::bad
title: I-140 approval does not mean
- You can file I-485 immediately (unless your priority date is also current)
- You have a green card or an approved green card application
- You can freely change employers without consequence to your green card process
- The wait is almost over — for Indian EB-2/EB-3, the wait typically continues for many years
:::

## When Can You File I-485 After I-140 Approval?

Only when your priority date is current on the chart USCIS is accepting that month. Your **priority date** determines your place in the EB green card queue. For most Indian EB-2 and EB-3 applicants, this date was set years ago — and they are still waiting.

| Stage after I-140 approval | Typical timing | What it depends on |
|---|---|---|
| H-1B extension eligibility | Immediate | I-140 approval alone |
| AC21 job portability | 180 days after approval | Same or similar occupation |
| Priority date becomes current | Years to decades (India EB-2/EB-3) | Monthly visa bulletin |
| I-485 filing window opens | The month your date is current | Which chart USCIS accepts |
| I-485 processing | ~8–14 months typically | USCIS service center |
| EAD / Advance Parole | ~3–8 months after I-485 filing | Separate applications |

> Timings are planning estimates. Verify the current month's cutoffs at travel.state.gov and current form processing times at uscis.gov.

See: [Priority date explained](/green-card/priority-date)

## Can You Extend H-1B Beyond 6 Years After I-140 Approval?

One of the most immediately valuable effects of I-140 approval for Indian H1B workers is the ability to extend H1B beyond the standard 6-year cap:

:::good
title: H1B extension after I-140 approval
- **3-year H1B extensions** become available once your I-140 is approved — even if your priority date is not current
- These 3-year extensions can continue indefinitely while the green card process is pending
- Even if you change employers (under AC21), the I-140 from a previous employer supports H1B extensions as long as the green card process continues in a same or similar occupation
- An I-140 approved for 365+ days also provides 1-year H1B extensions even if the petition was withdrawn
:::

## What Should You Do Immediately After I-140 Approval?

:::steps
Note your I-140 approval notice receipt date — this may affect AC21 portability timing (180 days).
Confirm your priority date with your employer's attorney — it should appear on both the PERM and the I-140 approval notice.
Begin monitoring the monthly visa bulletin at [travel.state.gov](https://travel.state.gov) — both the Final Action Date and Date for Filing charts.
Discuss H1B extension strategy with your attorney — given your priority date, plan extensions accordingly.
Ask your employer about any plans to withdraw the I-140 — understand what their policy is and what protections you have.
If you are approaching the 180-day mark post-approval, understand your AC21 portability rights before making any job changes.
:::

## Can You Change Jobs After I-140 Approval? (AC21)

Once your I-140 has been approved for **180 days**, you gain green card portability under AC21 — meaning if you later change employers, the approved I-140 continues to support your green card application as long as the new job is in a same or similar occupational classification. This significantly reduces the risk of changing jobs while the green card process is pending.

See: [AC21 portability explained](/green-card/ac21)

## What Will the Rest of the Green Card Cost?

Fees below are the current USCIS amounts for the stages that remain after I-140 approval. Employer-side costs (PERM, the I-140 itself) are typically the employer's responsibility.

| Filing | Fee | Who usually pays |
|---|---|---|
| I-485 adjustment of status (each adult) | $1,440 | Often the employee or employer, per policy |
| I-765 EAD (with I-485) | Filed with I-485 | Employee |
| I-131 Advance Parole (with I-485) | Filed with I-485 | Employee |
| New I-140, if ever refiled | $715 | Employer |
| I-140 premium processing (optional) | $2,805 | Employer |

> Per the USCIS fee schedule (Form G-1055). Always confirm the current amount on uscis.gov before paying.

## How I-140 Approval Connects to the Rest of Your Case

The approval is the hinge between the employer-driven half of the process and the queue-driven half. Behind you sits [PERM](/perm-timeline), which set the priority date you now carry; ahead sits the [visa bulletin](/visa-bulletin) wait and then [I-485](/i485-processing-time). Two things are worth doing this month: check where your date actually stands with the [Priority Date Checker](/tools/priority-date-checker) and model the remaining wait with the [Green Card Tracker](/tools/green-card-tracker). If your category is deeply backlogged, read [EB-2 India](/visa-bulletin/eb2-india) and the [EB-2 to EB-3 downgrade](/visa-bulletin/eb2-to-eb3-downgrade) option — and if a layoff ever hits, the approved I-140 is what protects your [H-1B extensions](/h1b-layoff).

## Frequently asked questions

### I-140 approved — what happens next?
Three things happen immediately: your priority date is locked in, you become eligible for 3-year H-1B extensions beyond the six-year cap, and a 180-day clock starts toward AC21 job portability. What does not happen is I-485 eligibility — that waits until your priority date is current in the visa bulletin.

### How long after I-140 approval can I file I-485?
It depends entirely on your priority date and country of birth, not on the approval date. Rest-of-World applicants in a current category can often file immediately; India-born EB-2 and EB-3 applicants typically wait years to decades. Check the current month's chart before assuming anything.

### Does I-140 approval mean my green card is approved?
No. The I-140 approves the *petition* — that you qualify for the category. The green card itself is granted at the I-485 (or consular) stage, which cannot even begin until a visa number is available for your priority date.

### My I-140 was approved years ago. Can I still use it?
Generally yes — as long as your priority date becomes current and the I-140 was not withdrawn/revoked, it remains valid. An I-140 approved for 180+ days and then withdrawn by the employer can still support your application under AC21 if you are in a same or similar occupation. Consult your attorney.

### Can my employer withdraw my I-140 after approval?
Yes, unless the I-140 has been approved for 180+ days, in which case a withdrawal by the employer generally does not affect your ability to use it for H1B extensions and eventual I-485 filing (subject to AC21 conditions). After 180 days, the I-140 retains its value for your use even if the employer withdraws it.

### Do I need a new I-140 if I change employers?
Not necessarily. Under AC21, if your I-140 was approved for 180+ days and you move to a same or similar occupation, you can port the I-140 to a new employer's sponsorship. Your new employer does NOT need to restart the PERM and I-140 process for the ported petition. However, some employers choose to file a new PERM and I-140 anyway for additional protection. Consult your attorney.

### Can I keep my priority date if a new I-140 is filed?
Yes — priority date retention lets you carry your earlier priority date onto a new EB-2 or EB-3 I-140, for example in an EB-3 downgrade or EB-2 upgrade. You keep your original place in the queue instead of starting over, and your attorney handles the interfiling or new filing.`,
  },

  /* ───────────────────────── PRIORITY DATE ──────────────────────────────── */
  {
    slug: "priority-date",
    kind: "guide",
    title: "Priority Date Explained for Indian Green Card Applicants",
    seoTitle: "Priority Date Green Card India | Final Action Date, Visa Bulletin Explained",
    metaDescription:
      "What is a priority date for the green card? Understand how it is set, the visa bulletin, Final Action Date vs Date for Filing, retrogression, and what Indian EB-2 and EB-3 applicants need to know.",
    navLabel: "Priority Date",
    excerpt:
      "Your priority date is your place in the employment-based green card queue. For Indian EB applicants, understanding the visa bulletin, Final Action Date, and retrogression is essential for long-term planning.",
    date: "2026-06-16",
    content: `Your **priority date** is the date that establishes your position in the employment-based (EB) green card queue. Think of it as your place in a very long line. For Indian EB applicants in the EB-2 and EB-3 categories, this line can stretch decades.

:::info
title: Priority date quick facts
- Set at the date your **PERM was filed** (for EB-2/EB-3 with PERM) or your **I-140 was filed** (for EB-1, EB-2 NIW)
- Printed on your I-797 PERM receipt and your I-140 receipt and approval notice
- Checked monthly against the State Department visa bulletin at [travel.state.gov](https://travel.state.gov)
- Must be "current" before you can file I-485 or proceed to consular processing
:::

## The visa bulletin: how priority dates become current

The **State Department Visa Bulletin** is published monthly and shows which priority dates are currently authorized to proceed. It has two charts:

:::compare
Final Action Date (Part A) | Dates for Filing (Part B)
The cutoff date for **final** processing — you need this date for I-485 to be approved | An earlier cutoff date USCIS sometimes allows for I-485 filing (when USCIS approves use of this chart)
More conservative — moves forward slowly | Less conservative — can be years ahead of Final Action Date
Required to complete green card | USCIS announces monthly whether this chart is usable for new I-485 filings
:::

Each month, USCIS publishes a notice on whether the Date for Filing chart may be used for that month. If USCIS approves use of Part B, you may file I-485 even if your Final Action Date has not yet arrived — but your case will not be approved until the Final Action Date passes.

## Why India has a separate column

The visa bulletin has separate columns for India, China, Mexico, Philippines, and all other countries. The **per-country annual limit** means that no more than 7% of all employment-based green cards can go to nationals of any single country. Because India generates a disproportionately large share of EB petitions (especially EB-2 and EB-3), its queue is far longer than the worldwide column.

:::warn
title: India-specific waiting times (educational estimates)
Current wait times for Indian nationals in EB-2 and EB-3 are extremely long — often 10, 20, or more years depending on priority date. These are not guarantees and fluctuate based on annual usage patterns. Always check the current official visa bulletin and speak with your attorney for your specific situation.
:::

## Retrogression: when priority dates move backward

**Retrogression** happens when the visa bulletin moves the cutoff date backwards — further into the past. This means that priority dates that were previously current become "unavailable" again.

:::bad
title: What retrogression means for you
- If your priority date retrogresssed after your I-485 was already filed: your case is put on hold until the date becomes current again — but you keep your EAD and Advance Parole
- If you had not yet filed I-485 when retrogression hits: you must wait for the date to become current again before filing
- Retrogression can happen without warning and can affect your planning significantly
:::

## How to read your priority date relative to the visa bulletin

:::steps
Go to the current State Department Visa Bulletin at [travel.state.gov](https://travel.state.gov).
Find the Part A (Final Action Dates) table for Employment-Based immigration.
Find the India column and the row for your category (EB-1, EB-2, or EB-3).
The date shown is the cutoff — if your priority date is **before** this date, you are current. If your priority date is **on or after** this date, you are not yet current.
Also check whether USCIS has authorized use of Part B (Dates for Filing) for this month — if so, the Part B date may allow you to file I-485 earlier.
:::

## Frequently asked questions

### How do I find my priority date?
Your priority date is printed on:
- The I-797 receipt notice for your PERM application
- The I-140 receipt and approval notices
- Any I-485 receipt if you have already filed

Ask your employer's immigration attorney to confirm the exact date.

### My priority date has been current for 2 months but USCIS is slow. Is that normal?
Yes — being current in the visa bulletin is a prerequisite for filing I-485, not a guarantee of how quickly USCIS will process it. I-485 itself takes months to years after filing. See: [I-485 adjustment of status](/green-card/i-485)

### Can my priority date from a previous employer be used with a new employer?
Yes — under AC21, if your I-140 was approved for 180+ days and you change to a same or similar occupation, your priority date remains with you even after the employer change. The priority date does not reset when you change employers under AC21.

### What happens if my priority date becomes current but then retrogresses before my I-485 is approved?
If you already filed I-485 before retrogression: your case stays open and your EAD/AP typically remain valid until a decision is made. If you have not yet filed: you wait for the date to become current again. This is one reason some applicants file I-485 as early as possible when the Date for Filing chart is usable.`,
  },

  /* ──────────────────────────── I-485 ───────────────────────────────────── */
  {
    slug: "i-485",
    kind: "guide",
    title: "I-485 Adjustment of Status for Indian Green Card Applicants",
    seoTitle: "I-485 Adjustment of Status India | Filing, Biometrics, Interview, Timeline",
    metaDescription:
      "What is I-485 adjustment of status? Understand when Indian EB applicants can file, what forms are needed, biometrics, the interview, how long it takes, and what to do while pending.",
    navLabel: "I-485 Filing",
    excerpt:
      "I-485 is the final domestic stage of the green card process. Filing requires your priority date to be current. Once filed, you can apply for an EAD and Advance Parole while your case is pending.",
    date: "2026-06-16",
    content: `**Form I-485 (Application to Register Permanent Residence or Adjust Status)** is how most Indian H1B workers in the US apply for a green card domestically — without having to leave the US for consular processing. It is Stage 5 of the employment-based green card process.

:::warn
title: Priority date must be current to file I-485
You generally cannot file I-485 until your priority date is current in the visa bulletin. There is an exception: USCIS sometimes allows use of the "Dates for Filing" (Part B) chart, which has an earlier cutoff. Check the current official visa bulletin and USCIS's monthly announcement on whether Part B is available for that month.
:::

## What you file along with I-485

I-485 is a package — you file multiple forms simultaneously:

:::info
title: Standard I-485 filing package for EB applicants
- **Form I-485** — the main adjustment application
- **Form I-485 Supplement J** — used to confirm the job offer and AC21 portability
- **Form I-131** — Advance Parole application (file together as combo card)
- **Form I-765** — EAD application (file together as combo card)
- **Form I-864** — Affidavit of Support from your employer or a US citizen/PR sponsor (varies by category)
- **Medical examination results (Form I-693)** — completed by a USCIS-designated civil surgeon, sealed envelope
- **Passport photos, identity documents, prior immigration records**
:::

## The biometrics appointment

After USCIS receives your I-485, you will receive a biometrics appointment notice. You attend a USCIS Application Support Center (ASC) to provide fingerprints, photos, and signature. This triggers background checks that run throughout your case.

## The I-485 interview

For most employment-based I-485 cases, USCIS schedules an interview at your local field office. The interview is used to verify your identity, confirm the job offer is still valid, and check your immigration history.

:::info
title: What to bring to the I-485 interview
- All original identity documents (passport, prior visas)
- I-797 approval notices for all prior petitions (I-140, I-129 H1B)
- Evidence of continuous lawful status in the US
- Employment letter from your employer confirming the job offer is still open
- Tax returns (last 2–3 years)
- Any prior USCIS correspondence
:::

## How long I-485 takes

I-485 processing times for Indian EB applicants are difficult to predict. The case must be pending until the Final Action Date in the visa bulletin also becomes current (if filed under Part B) and USCIS processes the biometrics, interview, and background checks. This can range from several months to years after filing.

Check current official processing times at [uscis.gov/check-processing-times](https://www.uscis.gov/check-processing-times).

## What to do while I-485 is pending

:::good
title: Key steps while I-485 is pending
- Maintain valid H1B status OR rely on your pending I-485 for authorized stay (once filed, the pending I-485 itself provides an authorized period of stay — but not work authorization unless you have a valid EAD)
- Apply for EAD and Advance Parole with the I-485 package or separately
- Do NOT travel internationally without an approved Advance Parole document in hand
- Keep your address current with USCIS (Form AR-11)
- Notify your attorney of any job changes, address changes, or arrests
:::

:::bad
title: What not to do while I-485 is pending
- Do NOT travel internationally without an approved Advance Parole — departure typically results in abandonment of the I-485 application
- Do NOT accept a job that is materially different from the one on your I-140 without consulting your attorney about AC21 portability
- Do NOT let your medical exam results expire — they typically are valid for 2 years
:::

## Frequently asked questions

### Can I change employers while my I-485 is pending?
Yes — under AC21, if your I-140 was approved for 180+ days and your I-485 has been pending for 180+ days, you can change to a same or similar job with a new employer without affecting your green card application. See: [AC21 portability](/green-card/ac21)

### Can I stay in the US if my H1B expires while I-485 is pending?
Yes — a pending I-485 provides an authorized period of stay called "adjustment of status pending." You are not out of status. However, you are not authorized to work unless you also hold a valid EAD.

### What if my priority date retrogresses after I file I-485?
Your case is held in suspense at USCIS. Your EAD and Advance Parole typically remain valid (renewable) until a decision. You do not need to refile — you just wait for the date to become current again.

### My I-485 has been pending for over a year with no interview. Is that normal?
I-485 interview scheduling varies widely by field office and USCIS workload. Compare your case to published processing times for your specific field office at uscis.gov. If outside the window, a case inquiry may be appropriate. For employer-sponsored cases, contact your employer's attorney.`,
  },

  /* ─────────────────────── EAD AND ADVANCE PAROLE ───────────────────────── */
  {
    slug: "ead-advance-parole",
    kind: "guide",
    title: "EAD and Advance Parole While I-485 is Pending: What Indians Need to Know",
    seoTitle: "EAD Advance Parole I-485 Pending | Combo Card, Travel, Work Authorization India",
    metaDescription:
      "Understand EAD (work permit) and Advance Parole (travel document) for Indian I-485 applicants. What the combo card is, when you can work independently of H1B, and the travel rules.",
    navLabel: "EAD & Advance Parole",
    excerpt:
      "While your I-485 is pending, you can apply for an EAD (work permit) and Advance Parole (travel document) together as a combo card. These provide important flexibility — but come with critical travel rules.",
    date: "2026-06-16",
    content: `While your **Form I-485** is pending, you can simultaneously apply for two important documents that provide employment and travel flexibility:

- **EAD (Employment Authorization Document, Form I-765)** — a work permit that lets you work for any employer, regardless of H1B or other visa status
- **Advance Parole (AP, Form I-131)** — a travel document that allows you to leave and re-enter the US without abandoning your pending I-485

These are typically filed together as a **combo card** application alongside your I-485, and USCIS often approves them on a single card.

## The EAD: your work permit

:::info
title: What the EAD lets you do
- Work for any employer in the US — you are not tied to your H1B sponsor
- Work in any occupation — you are not limited to your H1B specialty occupation
- Work part-time, freelance, contract, or independently
- Start your own business
:::

:::warn
title: EAD does NOT cancel your H1B
Many Indian applicants choose to keep their H1B status active even after receiving an EAD. This is sometimes called "maintaining H1B status" and is important because:

- If your I-485 is denied or abandoned, you fall back to H1B status (rather than becoming out of status)
- You want to keep the I-140 portability protection for H1B extensions
- Your employer may require H1B for their records

Discuss with your attorney whether to keep H1B status active alongside EAD.
:::

## The EAD automatic extension

If you file an EAD **renewal** before your current EAD expires and the renewal is pending, an automatic extension of **up to 540 days** applies for many I-485-based EADs. This means you can keep working continuously without a gap even if USCIS is slow to renew. Verify eligibility at uscis.gov — rules and eligible categories change.

## Advance Parole: the travel document

**Advance Parole** allows you to leave the US and return without abandoning your pending I-485. Without it, leaving the US while your I-485 is pending is generally treated as abandonment.

:::bad
title: The cardinal rule: do NOT travel without AP in hand
- Never board an international flight while I-485 is pending without an approved, valid AP document physically in your possession
- An AP application pending at USCIS is not the same as having an approved AP — you cannot use a pending application to travel
- Even a brief trip to Canada or Mexico while I-485 is pending without AP can result in I-485 abandonment
- Confirm your situation with your attorney before any international travel
:::

## The combo card

USCIS often issues the EAD and Advance Parole on a single combo card — one plastic card that authorizes both work and re-entry. The combo card is more efficient and many applicants prefer it, though there are some situations where separate documents are beneficial. Ask your attorney.

## When to file EAD and AP relative to I-485

You should file the EAD and AP together with your I-485 if possible — this starts the processing clock earlier. Some applicants file them after the I-485 if they were not ready initially, but filing together is generally more efficient.

## Frequently asked questions

### If I use my EAD, can I quit my H1B employer?
Technically yes — the EAD lets you work anywhere. But leaving your H1B employer may affect your green card sponsorship (your employer could withdraw the I-140 if it has been less than 180 days) and your ability to fall back on H1B status if something goes wrong with your I-485. Consult your attorney before leaving your employer.

### Can my spouse use an EAD while my I-485 is pending?
If your spouse is a dependent beneficiary on the same I-485 filing (i.e., they filed their own I-485 as a derivative beneficiary), they can also apply for their own EAD. H-4 EAD holders who file I-485 as dependents often switch to I-485-based EAD.

### I traveled with Advance Parole. What happens to my H1B status?
Traveling on Advance Parole can be treated as abandonment of your H1B status in some cases — you re-enter on the I-485 parole rather than on H1B admission. This can affect your H1B protections. Discuss the implications with your attorney before traveling on AP if you want to maintain H1B status.

### How long does the combo card take to arrive?
Processing times for EAD/AP vary — check uscis.gov/check-processing-times. Filing together with I-485 is the most efficient approach. See also: [USCIS processing times guide](/uscis/processing-times)`,
  },

  /* ─────────────────────── EB-2 vs EB-3 INDIA ───────────────────────────── */
  {
    slug: "eb2-vs-eb3-india",
    kind: "reference",
    title: "EB-2 vs EB-3 for Indians: Which Category Has a Shorter Green Card Wait?",
    seoTitle: "EB-2 vs EB-3 for Indians | Which Has Shorter Wait, Downgrade Strategy",
    metaDescription:
      "EB-2 vs EB-3 green card for Indian applicants: which category has a shorter priority date queue? When does EB-3 downgrade make sense? What is EB-2 NIW? India-specific analysis.",
    navLabel: "EB-2 vs EB-3 for India",
    excerpt:
      "EB-2 and EB-3 both face severe backlogs for Indian nationals. Sometimes EB-3 moves faster than EB-2 — making downgrade from EB-2 to EB-3 a strategy worth understanding.",
    date: "2026-06-16",
    content: `Indian applicants in employment-based green card categories primarily fall into **EB-2** (advanced degree or exceptional ability) and **EB-3** (skilled workers, professionals). Both categories are heavily oversubscribed for Indian nationals, but their relative wait times have shifted significantly over the years.

## EB-2 for India: advanced degree or exceptional ability

:::info
title: EB-2 general requirements
- A US advanced degree (master's or higher) or a bachelor's degree plus 5 years of progressive experience in the field
- OR a person of exceptional ability in sciences, arts, or business
- OR National Interest Waiver (EB-2 NIW) — self-petitioned, no employer sponsorship needed
- Most Indian H1B workers with master's degrees qualify for EB-2
:::

## EB-3 for India: skilled workers and professionals

:::info
title: EB-3 general requirements
- Professionals (bachelor's degree, not advanced)
- Skilled workers (at least 2 years of training/experience)
- Unskilled workers (less than 2 years training — generally very long wait worldwide)
- Many EB-2 filers also file an EB-3 petition simultaneously as a backup strategy
:::

## Why the EB-2 vs EB-3 comparison matters: the downgrade strategy

For most immigration history, EB-2 India moved faster than EB-3 India. But periodically, EB-3 India has had a **faster-moving priority date** than EB-2 India. When this happens, Indian applicants who qualify for EB-2 but have been waiting for years sometimes file a new PERM and I-140 under EB-3 to take advantage of the faster queue — this is called "EB-3 downgrade."

:::warn
title: EB-3 downgrade is a strategy, not always the right answer
- Downgrading means filing a new PERM (starting Stage 1 over) and a new I-140 — a significant time and cost investment
- The relative speed of EB-2 vs EB-3 India fluctuates monthly — what is faster today may not be faster next year
- Filing in both categories simultaneously (if your employer and attorney agree) provides a hedge
- Never make this decision without current visa bulletin data and attorney guidance
:::

## EB-2 NIW (National Interest Waiver): the self-petition path

The **EB-2 National Interest Waiver** is unique: you can self-petition directly with USCIS without employer sponsorship or PERM. Requirements under the Dhanasar standard:

:::good
title: EB-2 NIW requirements (Dhanasar standard)
- The proposed endeavor has substantial merit and national importance
- You are well-positioned to advance the endeavor
- It would be beneficial to the US to waive the normal job offer and labor certification requirements
:::

NIW applicants are often researchers, scientists, physicians (especially in underserved areas), engineers, and entrepreneurs. The self-petition aspect is valuable — no employer dependency — but the same India per-country backlog applies for the wait time.

## Which category should I apply under?

There is no universal answer. Factors to consider:

| Factor | EB-2 | EB-3 |
| --- | --- | --- |
| Education requirement | Advanced degree or exceptional ability | Bachelor's + professional role |
| Employer involvement | Required (unless NIW) | Required |
| Current India wait | Check current visa bulletin | Check current visa bulletin |
| Self-petition option | Yes (NIW) | No |
| Downgrade possible | N/A | Can file EB-3 if also EB-2 eligible |

**Always compare current visa bulletin dates and consult your attorney before making category decisions.**

## Frequently asked questions

### Can I file both EB-2 and EB-3 at the same time?
Yes — many Indian applicants file in both categories simultaneously (requires separate PERM and I-140 for each). This gives you the option to file I-485 under whichever category becomes current first.

### If I downgrade to EB-3, do I lose my EB-2 priority date?
No — you file a new PERM and I-140 under EB-3, which establishes a new EB-3 priority date. Your EB-2 process (and its priority date) continues separately. You do not lose your EB-2 priority date by also pursuing EB-3.

### My employer won't file a new PERM for EB-3. Can I use another employer?
Theoretically yes — a different employer can sponsor an EB-3 PERM. But this involves significant commitment from a new employer and attorney coordination. Discuss this carefully before pursuing.`,
  },

  /* ────────────────────── GREEN CARD BACKLOG INDIA ──────────────────────── */
  {
    slug: "green-card-backlog-india",
    answerFirst: true,
    kind: "reference",
    title: "India Green Card Backlog 2026: Wait Times & Why It Exists",
    seoTitle: "India Green Card Backlog 2026: Wait Times by Category",
    metaDescription:
      "India green card backlog: ~9,800 EB visas a year (7% cap) vs over a million waiting. Wait times by category, the math behind it, and what you can do.",
    navLabel: "India Green Card Backlog",
    excerpt:
      "The India green card backlog exists because annual per-country limits cap India's share of EB visas — while India produces far more qualified applicants than the cap allows each year.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
The India green card backlog exists because US law caps employment-based green cards at about **140,000 a year** and forbids any one country from taking more than **7%** — roughly **9,800 a year for India** across EB-1, EB-2 and EB-3 combined. India-born demand is many times that, so the queue has grown to well over a million people including dependents. Practically: **EB-2 and EB-3 India cutoffs sit around 2014–2015**, EB-2 India was **Unavailable** in the July 2026 bulletin, and new filings in those categories should be planned in **decades, not years**.
:::

:::key
- Plan around India's hard ceiling: **~9,800** employment green cards a year, 7% of the ~140,000 total, across all EB categories.
- Expect EB-2 and EB-3 India final action dates to sit in the **2014–2015** range, moving only **1–3 months per calendar year** in typical years.
- Know your fastest realistic route: **EB-1** India runs years rather than decades for those who qualify.
- Protect your position regardless of the wait — an approved I-140 gives **3-year H-1B extensions** indefinitely and AC21 portability after **180 days**.
- Watch your children's ages: **CSPA** calculations decide whether a child over 21 keeps a place in your case.
:::

The India green card backlog is the defining constraint on Indian professional immigration to the US — a queue so long that a worker who files today in EB-2 may reach the front after retirement. This page explains why the backlog exists, how long the wait actually is by category, and what India-born H-1B workers can legitimately do about it. The one number that explains everything: the 7% per-country cap gives India roughly 9,800 employment-based green cards a year against demand many multiples larger. Below: the supply-and-demand math, current wait times by category with the live cutoffs, how many Indians are estimated to be waiting, why unused visas rarely rescue the queue, the legislative picture, and the strategies applicants actually use while they wait.

## Why Does the India Green Card Backlog Exist?

The employment-based green card system has two constraints that together create the India backlog:

:::info
title: The two limits that create the India backlog
**Annual cap:** Congress has set the annual employment-based green card limit at approximately 140,000 (including family members of principal applicants). This number has not been meaningfully increased since 1990.

**Per-country cap:** No more than 7% of annual employment-based green cards can go to nationals of any single country — approximately 9,800 per year for India across all EB categories combined.
:::

The result: India generates a large fraction of all employment-based green card petitions (because of the large number of Indian workers in H1B-eligible fields), but receives only 7% of the annual allocation. The gap between demand and supply has created a backlog spanning decades.

| The math behind the backlog | Number |
|---|---|
| Employment-based green cards per year (worldwide) | ~140,000 including dependents |
| Maximum share for any one country | 7% |
| India's effective annual ceiling, all EB categories | ~9,800 |
| EB-1 worldwide allocation (28.6%) | ~40,040 |
| EB-2 worldwide allocation (28.6%) | ~40,040 |
| EB-3 worldwide allocation (28.6%) | ~40,040 |
| Annual limit last raised by Congress | 1990 |

> Dependents count against the cap, so a single applicant with a spouse and two children consumes four of India's ~9,800 numbers.

## How Long Is the India Green Card Wait by Category?

The current wait for Indian nationals in EB-2 and EB-3 varies by priority date and fluctuates monthly with the visa bulletin. Because visa bulletin dates are forward-looking estimates, official sources do not publish definitive wait times. What is known:

:::warn
title: India green card wait — general education only
- Some studies and analyses have estimated EB-2 India waits at 50+ years for applicants with recent priority dates — though these are projections, not guarantees
- EB-3 India has historically had both faster and slower periods relative to EB-2
- The actual wait experienced by any individual depends on annual visa bulletin movement, retrogression events, and whether legislative changes occur
- Always check the current official visa bulletin at [travel.state.gov](https://travel.state.gov) for the most accurate current state
:::

Where the categories actually stood in the July 2026 bulletin:

| Category (India) | Final Action Date | Dates for Filing | Practical read |
|---|---|---|---|
| EB-1 India | October 15, 2022 | December 1, 2023 | Years, not decades — fastest route |
| EB-2 India | Unavailable | January 15, 2015 | No approvals that month at all |
| EB-3 India | January 1, 2014 | January 15, 2015 | Posted a date while EB-2 could not |
| EB-5 India (Unreserved) | Unavailable | May 1, 2024 | Set-aside categories were Current |

> Source: U.S. Department of State Visa Bulletin, July 2026. These change monthly — check the live [EB-1](/visa-bulletin/eb1-india), [EB-2](/visa-bulletin/eb2-india) and [EB-3](/visa-bulletin/eb3-india) status pages for the current month.

## What Does the Backlog Mean for You Practically?

For Indian workers currently on H1B:

:::good
title: Practical implications of the backlog
- File PERM and I-140 as early as possible — establishing an early priority date is the single most important action
- Once I-140 is approved, your H1B can be extended indefinitely in 3-year increments
- You can change employers under AC21 without losing your priority date (after 180 days)
- Your children face aging-out risk if the wait is very long — see CSPA rules
- EAD and Advance Parole become available once you can file I-485 (when priority date is current)
:::

## Why Don't Unused Visas From Other Countries Clear the Queue?

Some EB-1 and EB-2 visa numbers go unused by other countries. In those situations, unused numbers "waterfall" down to other categories within the same fiscal year. This can temporarily advance India's EB-3 priority date. However, this is unpredictable and cannot be relied upon for planning.

## Could Legislation Fix the India Backlog?

Various immigration reform proposals have addressed the per-country cap, including bills that would remove country limits for employment-based visas. As of this writing, no such legislation has been enacted. Monitor news and consult your attorney about any legislative changes.

## What Can You Do While Waiting in the Backlog?

:::steps
Get PERM filed as soon as your employer will sponsor it — this sets the earliest possible priority date.
Get I-140 approved (consider premium processing) to lock in the priority date and protect H1B extension rights.
Explore EB-3 downgrade if EB-3 India is moving faster — requires new PERM and I-140.
Consider EB-2 NIW if your work qualifies — self-petition, no employer dependency.
Ensure children have their own pending I-485 before turning 21 — understand CSPA protections.
Plan career moves using AC21 portability — you can change employers after 180 days without losing your priority date.
:::

## How the Backlog Connects to the Rest of Your Life in the US

The backlog is not just a waiting problem — it shapes every other decision. Because your place in line is set at [PERM filing](/perm-timeline) and carried by the [approved I-140](/green-card/i-140-approved-what-next), filing early matters more than anything else you can control. While you wait, the I-140 is what keeps your [H-1B renewable past six years](/h1b) and what protects you in a [layoff](/h1b-layoff); your children's eligibility depends on [CSPA](/green-card/cspa-kids-aging-out) math; and your spouse's ability to work runs through the [H-4 EAD](/tools/h4-ead-navigator). Check where you actually stand with the [Priority Date Checker](/tools/priority-date-checker) and model the remaining years with the [Green Card Tracker](/tools/green-card-tracker).

## Frequently asked questions

### How long is the green card wait for Indians?
It depends on category and priority date. EB-1 India has recently run a few years; EB-2 and EB-3 India cutoffs sit around 2014–2015, which means new filings in those categories face waits measured in decades under current law. EB-2 India was Unavailable entirely in the July 2026 bulletin.

### How many Indians are waiting for a green card?
Published analyses of USCIS and State Department inventory data put the India-born employment-based queue at well over a million people once dependents are counted. Because dependents consume visa numbers too, the effective queue is far longer than the count of principal applicants alone.

### Why is the India green card backlog so long?
Two rules multiply against each other: a fixed annual supply of about 140,000 employment-based green cards, and a 7% per-country ceiling that limits India to roughly 9,800 a year. India-born demand vastly exceeds that share, and the annual limits have not been meaningfully raised since 1990.

### Will the backlog ever clear?
The backlog clears for individuals when their priority date becomes current — which for some recent Indian applicants may be many decades away under current law. Legislative reform could accelerate this, but it is not guaranteed.

### Does naturalization help my family members skip the queue?
Once you become a US citizen, your immediate relatives (spouse, minor children, parents) no longer need to wait in an immigrant visa queue — there is no annual cap for immediate relatives of US citizens. But you cannot naturalize until after you receive a green card.

### I am from India but work for a company that sponsors Canadian workers — can I use the Canadian queue?
The per-country cap is based on your country of birth, not citizenship or residence. If you were born in India, you are in the India quota regardless of where you live or work.`,
  },

  /* ─────────────────────── CHANGE JOBS AFTER I-140 ──────────────────────── */
  {
    slug: "change-jobs-after-i140",
    kind: "guide",
    title: "Changing Jobs After I-140 Approval: AC21 Portability for Indians",
    seoTitle: "Change Jobs After I-140 Approval | AC21 Portability Green Card India",
    metaDescription:
      "Can you change jobs after I-140 is approved? Understand AC21 green card portability, the 180-day rule, same-or-similar occupation requirement, and how job changes affect your green card process.",
    navLabel: "Change Jobs After I-140",
    excerpt:
      "After your I-140 has been approved for 180 days, AC21 allows you to change employers and preserve your green card priority date — provided the new job is in the same or similar occupational classification.",
    date: "2026-06-16",
    content: `One of the most important and frequently misunderstood aspects of the India green card process is the ability to **change employers** after I-140 approval without losing your green card progress. This is governed by **AC21 (American Competitiveness in the Twenty-First Century Act)** portability provisions.

:::info
title: AC21 green card portability in plain language
- After your I-140 has been **approved for at least 180 days**, you can change employers
- Your priority date and approved I-140 "port" to your new situation
- The new job must be in the **same or similar occupational classification** as the job on the original PERM/I-140
- You do not need your original employer to file a new I-140 — the old one is used
- Your new employer does not need to restart PERM and I-140 (for the ported petition)
:::

## The 180-day rule

The 180-day clock starts from the date your I-140 was approved by USCIS. To use AC21 portability:

- I-140 must be approved (not just pending)
- 180 days must have elapsed since I-140 approval
- Your I-485 must be pending (or you must be within a reasonable time of filing)
- The new job must qualify as same or similar

:::warn
title: Before 180 days: higher risk zone
If your I-140 has been approved for less than 180 days and you leave your sponsoring employer, the employer can withdraw the I-140. A withdrawn I-140 (before 180 days) generally cannot be used for portability — you would lose that priority date. After 180 days, the employer's withdrawal does not affect your ability to use the I-140.
:::

## What counts as "same or similar" occupation

The same-or-similar test is based on **SOC (Standard Occupational Classification) codes** — the government's occupational taxonomy. Generally:

:::good
title: Likely same or similar (general guidance — consult attorney)
- Software engineer → software engineer, senior software engineer, tech lead, engineering manager
- Data scientist → data analyst, ML engineer, research scientist
- Financial analyst → finance manager, investment analyst, senior financial analyst
- Doctor → physician in same specialty, attending physician in same specialty
:::

:::bad
title: Likely NOT same or similar (general guidance)
- Software engineer → product manager (different SOC category)
- Financial analyst → immigration attorney (different field entirely)
- Engineer → entrepreneur/startup founder (depends on role specifics)
:::

The test is fact-specific. Your attorney will review the job description at portability time and document the same-or-similar analysis.

## What happens to your PERM

Your PERM is tied to the original employer's petition. When you port your I-140 to a new employer:

- The original PERM is not "transferred" — you use the approved I-140, not the PERM
- The new employer does not file a new PERM for the ported job
- However, the new employer must confirm through Supplement J (filed with your I-485) that the bona fide job offer is in the same or similar occupation

## What you need to document for AC21 portability

When USCIS reviews your I-485 after a job change, you (or your new employer's attorney) will need to show:

:::steps
A copy of the original I-140 approval notice (proving 180+ days).
A letter from the new employer describing the new position and its duties.
A Supplement J (I-485 Supplement J) confirming the job offer in the same or similar occupation.
Potentially a comparative SOC analysis showing the original and new job codes align.
Your resume showing continuity of work in the same field.
:::

## Frequently asked questions

### Can I change employers multiple times and still keep the priority date?
Yes — as long as each successive job is in the same or similar occupational classification as the original I-140 job, you can port through multiple employer changes.

### My new employer wants to file a brand new PERM and I-140. Is that better?
It can be. Some applicants file a "fresh" I-140 with the new employer while also relying on the ported I-140. This provides backup protection and lets the new employer formally own the sponsorship. There is no requirement to do this — portability is sufficient — but some employers prefer clean sponsorship. The ported I-140 has the earlier priority date; a new I-140 would have a later priority date.

### What if I change jobs but my I-485 has not yet been filed (priority date not current)?
You can still port the I-140 even if I-485 has not been filed. When your priority date becomes current, you will file I-485 using the ported I-140 with an employer who can confirm the same-or-similar offer at that future time. This requires planning — ensure your new employer is aware of this and willing to provide the Supplement J when needed.`,
  },

  /* ─────────────────────────── AC21 ─────────────────────────────────────── */
  {
    slug: "ac21",
    kind: "guide",
    title: "AC21 Portability Explained: H1B and Green Card Rights After 180 Days",
    seoTitle: "AC21 Portability | H1B and Green Card Job Change Rights for Indians",
    metaDescription:
      "AC21 portability explained for Indian workers: H1B work authorization after transfer receipt, and green card priority date preservation after I-140 approval. Conditions, risks, and documentation.",
    navLabel: "AC21 Portability",
    excerpt:
      "AC21 provides two critical protections for Indian workers: H1B work authorization portability after a transfer receipt notice, and green card priority date portability after I-140 approval for 180+ days.",
    date: "2026-06-16",
    content: `**AC21 (American Competitiveness in the Twenty-First Century Act)** is a 2000 law that provides important job mobility protections for H1B workers and employment-based green card applicants. For Indian workers navigating long H1B and green card timelines, understanding AC21 is critical.

AC21 provides **two separate portability protections** — one for H1B workers and one for green card applicants. These are related but distinct.

## AC21 protection #1: H1B work authorization portability

Under INA Section 214(n), when an H1B holder files a new I-129 petition with a new employer, they may work for the new employer **as soon as the petition is filed and a receipt notice is issued** — without waiting for USCIS to approve the transfer.

:::info
title: H1B portability conditions (all must be met)
- You were last admitted to the US in valid H1B status
- Your current H1B status has not expired (valid I-94)
- You have not violated any conditions of your H1B status
- The new I-129 petition is non-frivolous and filed before your current status expires
:::

If these conditions are met, you may work for the new employer after the petition is filed and receipted — no approval required. See also: [H1B Transfer: When Can You Start Work?](/h1b/start-work-after-transfer-receipt)

## AC21 protection #2: Green card priority date portability

Under INA Section 204(j), if your I-140 has been approved for at least 180 days and your I-485 has been pending or is about to be filed, you can change employers and maintain your priority date (and the approved I-140) for your green card application.

:::info
title: Green card portability conditions
- I-140 approved for 180+ days
- The new job is in the same or similar occupational classification (same SOC group generally)
- Your I-485 is pending OR your priority date is current enough that filing is imminent
:::

Once these conditions are met, the employer's withdrawal of the I-140 does not affect your ability to continue the green card process.

## How AC21 green card portability works in practice

When you file I-485 (now or in the future), you include **Supplement J** — a form confirming the job offer is in the same or similar occupation as the I-140. Your new employer signs this confirmation.

USCIS then evaluates whether the ported I-140 supports your I-485. The officer looks at:
- Whether the I-140 was approved for 180+ days before the job change
- Whether the new job is same or similar by SOC code comparison
- Whether the bona fide job offer still exists

## Documenting your AC21 portability claim

:::steps
Retain copies of your I-140 approval notice (showing approval date).
Calculate the 180-day mark from the approval date.
Secure a letter from your new employer describing the new position and confirming it aligns with the I-140 job.
Have your attorney prepare a Supplement J and an AC21 portability memo documenting the SOC analysis.
Keep records of continuous employment in the same occupation across employers.
:::

## When AC21 does NOT protect you

:::bad
title: Situations where AC21 portability may not apply
- I-140 withdrawn by employer before 180 days of approval — the I-140 cannot be used for portability
- New job in a materially different occupation (different SOC category)
- I-140 was denied (not just a pending RFE) — denied I-140 cannot be ported
- You violated H1B status before the transfer was filed
- Gap in employment or unauthorized work periods
:::

## Frequently asked questions

### I changed jobs before my I-140 was 180 days old. Did I lose my priority date?
If your employer withdrew the I-140 before 180 days, you generally lose that priority date and the ability to port that I-140. If the I-140 was NOT withdrawn, you might still be able to port it even if you changed jobs before 180 days — consult your attorney for your specific facts.

### AC21 says "same or similar" — how strictly does USCIS apply this?
USCIS has issued policy guidance on this. The test is based on SOC codes. A well-documented comparison showing the two roles share the same core duties, required education, and occupational category typically satisfies the requirement. Occupational level changes (individual contributor to manager in the same field) are generally acceptable.

### Does AC21 protect me if I change from a large company to a startup?
The size or nature of the employer does not affect AC21 portability — only the occupational classification of the role matters. A startup in the same field with a qualifying role is fine.`,
  },

  /* ─────────────────────── CSPA / AGING OUT ─────────────────────────────── */
  {
    slug: "cspa-kids-aging-out",
    kind: "reference",
    title: "CSPA and Children Aging Out: Green Card Risks for Indian Families",
    seoTitle: "CSPA Kids Aging Out Green Card India | Child Status Protection Act Explained",
    metaDescription:
      "Children of Indian H1B workers on green card wait lists face aging out at age 21. Understand CSPA (Child Status Protection Act), how CSPA age is calculated, and what to do before children turn 21.",
    navLabel: "CSPA & Kids Aging Out",
    excerpt:
      "Children included in an employment-based green card application must be under 21 when the green card is approved. The CSPA provides limited protection — but Indian families with long backlogs face real aging-out risk.",
    date: "2026-06-16",
    content: `**Aging out** refers to children included in an employment-based green card application turning 21 years old before the green card is approved. Under immigration law, children must be unmarried and under 21 to qualify as derivative beneficiaries in the EB category.

For Indian families with priority dates from years or decades ago, the risk that children will turn 21 before the green card is approved is very real and very serious.

:::warn
title: This is one of the most complex and consequential areas of immigration law
The rules around CSPA, aging out, and derivative beneficiaries are highly technical. The consequences of getting this wrong are severe — a child who ages out may lose their place in the green card process entirely. If your child is approaching age 21, consult an experienced immigration attorney immediately.
:::

## What the CSPA does

The **Child Status Protection Act (CSPA)** was passed in 2002 to provide some protection against aging out by "freezing" a child's age for immigration purposes under certain conditions.

## How CSPA age is calculated (simplified)

The CSPA age formula for employment-based categories:

:::info
title: CSPA age calculation (simplified)
CSPA age = (child's age on the date the visa number becomes available) minus (the number of days the I-140 petition was pending at USCIS)

If the CSPA age is under 21, the child retains child status even if their biological age is 21 or older.
:::

**Worked example:** Say a child turns 21 on June 1, the visa number becomes available on April 1, and the I-140 was pending 90 days. The CSPA age is 21 minus roughly three months — about 20 years and 9 months, which is under 21, so the child keeps child status. Because the days the I-140 spent pending are subtracted, filing the I-140 early and letting it stay pending longer both work in your child's favor.

**Important caveats:**
- "Visa number becomes available" means the first time the priority date becomes current in the Final Action Date chart
- The CSPA age calculation must be done precisely — errors can be costly
- The child must also seek to acquire lawful permanent residence within 1 year of visa availability
- These rules are complex and have been subject to litigation — consult an attorney

## Why Indian families are particularly at risk

Because Indian EB-2 and EB-3 priority dates move very slowly, children who were young when a PERM was filed may already be adults before the case is adjudicated. A child who was 5 years old when PERM was filed in 2010 is now 21. If the priority date did not become current before they turned 21, CSPA may not be sufficient to protect them — depending on the CSPA age calculation.

:::bad
title: What happens when a child ages out
- They can no longer be a derivative beneficiary on the parent's I-485
- They must qualify independently for immigration status (their own work visa, their own green card petition, marriage, etc.)
- The aging-out event cannot be undone retroactively
- Early action is critical
:::

## Steps to take before children approach age 21

:::steps
Calculate your child's CSPA age with your attorney — do not estimate this yourself.
Ensure your I-485 is filed as soon as your priority date becomes current — delays after the date becomes current affect CSPA protection.
Understand the "sought to acquire" requirement — the child must take steps to pursue lawful permanent residence within 1 year of visa availability.
Explore whether the child can obtain their own H1B, O-1, F-1, or other status independently as a backup.
Consider consulting a specialist immigration attorney who focuses on CSPA issues — this area has nuances that general practitioners may miss.
:::

## Frequently asked questions

### My child turns 21 in 3 years. Is it too late to protect them?
Not necessarily — depending on your priority date and I-140 approval date, CSPA may protect your child. The key is to calculate the CSPA age now, understand whether protection is possible, and file I-485 the moment your priority date allows. Act with urgency and consult your attorney.

### Does CSPA protect children of EB-1 petitions too?
Yes — CSPA applies to all employment-based categories. However, EB-1 typically moves faster, so the aging-out risk is lower. For Indian EB-2 and EB-3, the risk is more acute.

### My child aged out. Can they still get a green card?
They would need to qualify independently — through employment, marriage to a US citizen or green card holder, or their own EB petition. The derivative beneficiary path is generally closed once they age out. Consult an attorney immediately if your child is approaching or past 21 with no independent immigration status.

### Can a child file their own I-485 separately?
If a child is a derivative beneficiary and qualifies under CSPA, they file their own I-485 concurrently with the principal applicant. If they do NOT qualify under CSPA (aged out), they cannot file as a derivative — they need independent status.`,
  },
];

/* ── computed exports ─────────────────────────────────────────────────────── */

export const greenCardChildPages: GreenCardPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const greenCardChildSlugs = greenCardChildPages.map((p) => p.slug);

export function getGreenCardChildPage(slug: string): GreenCardPage | undefined {
  return greenCardChildPages.find((p) => p.slug === slug);
}
