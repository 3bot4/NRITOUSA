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
title: H-1B extension after I-140 approval
- **Three-year H-1B extensions** may be available under AC21 §104(c) when your priority date is **not current** — i.e., a visa number is unavailable because of the backlog
- They can be renewed for as long as the visa remains unavailable and you otherwise qualify — a key benefit of an approved I-140, though not automatic or guaranteed
- After an employer change, an approved I-140 from a prior employer can still support these extensions as long as its approval has not been revoked for cause (the "same or similar" test governs §204(j) I-485 portability, not H-1B extensions)
- Separately, a PERM or I-140 that was **pending 365+ days** before your six-year limit can support **one-year** extensions under AC21 §106(a)
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
Two things happen immediately: your priority date is retained on the approved petition (8 CFR 204.5(e)), and you may qualify for H-1B extensions beyond the six-year cap under AC21 §104(c) — in three-year increments when a visa number is unavailable because of the backlog. What does *not* start yet is the §204(j) job-portability clock: that runs from when your I-485 is filed and has been pending 180 days, not from I-140 approval. And I-485 eligibility itself waits until your priority date is current in the visa bulletin.

### How long after I-140 approval can I file I-485?
It depends entirely on your priority date and country of birth, not on the approval date. Rest-of-World applicants in a current category can often file immediately; India-born EB-2 and EB-3 applicants typically wait years to decades. Check the current month's chart before assuming anything.

### Does I-140 approval mean my green card is approved?
No. The I-140 approves the *petition* — that you qualify for the category. The green card itself is granted at the I-485 (or consular) stage, which cannot even begin until a visa number is available for your priority date.

### My I-140 was approved years ago. Can I still use it?
Generally yes — as long as your priority date becomes current, the approved petition remains usable. An I-140 approved for 180+ days is not auto-revoked by an employer's withdrawal (8 CFR 205.1), so it can keep supporting your case; separately, its priority date is retained for a later qualifying petition regardless of the "same or similar" test. The "same or similar" requirement specifically governs §204(j) portability on a *pending I-485*. Consult your attorney.

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
    answerFirst: true,
    kind: "guide",
    title: "Your Green Card Priority Date: From PERM to I-485",
    seoTitle: "Green Card Priority Date: PERM to I-485 Journey (India)",
    metaDescription:
      "How your green card priority date is created at PERM filing, carried by an approved I-140, retained when you change jobs, and cashed in at I-485 — the stage-by-stage employment green card journey for Indian applicants.",
    navLabel: "Priority Date",
    excerpt:
      "Your priority date is created once, at PERM filing, then travels with you through I-140, the wait, and I-485. This guide follows the date through every stage of the employment green card — how it is set, kept, and used.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `Your **priority date** is created once — the day your PERM is filed — and then travels with you through the entire employment green card. This guide follows the date through each stage: how it is created, how an approved I-140 lets you keep it when you change employers, and how it is finally cashed in at the I-485 or consular stage. For how the monthly visa bulletin decides *when* your date reaches the front, see the [visa bulletin priority-date guide](/visa-bulletin/priority-date).

:::key
- Your date is set at **PERM (ETA-9089) filing** — or, for EB-1 and EB-2 NIW, at **I-140 filing** — and never changes on its own afterward.
- An **approved I-140** lets you **keep the date for a later qualifying petition** (8 CFR 204.5(e)) and can support **H-1B extensions past six years** under AC21 §104(c) when a visa number is unavailable.
- Keeping an old date on a new petition (**retention**) is a separate rule from **petition survival** (the 180-day withdrawal rule) and from **I-485 job portability** under INA §204(j).
- The date is only "spent" at the very end — when it is current and you file [I-485](/green-card/i-485) or go through consular processing.
- Check where your date stands each month with the [Priority Date Checker](/tools/priority-date-checker).
:::

## Where does a priority date come from?

For most Indian H-1B workers in EB-2 or EB-3, the priority date is the day the Department of Labor accepted your employer's **PERM labor certification (Form ETA-9089)** for processing. It exists from that moment — before the I-140 is even filed.

:::info
**Two things that are commonly confused with it:**
- The **prevailing-wage request (Form ETA-9141)** filed before PERM does **not** establish your employment-based priority date — only the ETA-9089 filing does.
- For **EB-1** (no PERM) and **EB-2 NIW** (self-petition), there is no PERM, so the priority date is the date the **I-140 was filed** with USCIS.
:::

## How the priority date travels through each stage

The date is set once and then does a different job at every stage of the process. This is the whole journey in one view:

| Stage | What happens to your priority date |
|---|---|
| **PERM (ETA-9089)** filed with DOL | Priority date is **created** on the filing date |
| **I-140** filed and approved | Date is **locked to the petition**; an approved I-140 protects it and unlocks H-1B extensions |
| **The wait** | Date sits in the queue; the [visa bulletin](/visa-bulletin/priority-date) moves the cutoff toward it each month |
| **Date becomes current** | The date is now usable — the [I-485 filing window](/visa-bulletin/priority-date-current-what-next) opens |
| **I-485 / consular processing** | Date is **cashed in**; a visa number is used and the green card is issued |

The single most valuable action is filing PERM early, because the filing date *is* your place in line. Nothing later — not I-140 premium processing, not a faster attorney — moves the date forward.

## Keeping your priority date when you change employers

This is where the priority date matters most day-to-day — and where three separate rules get confused. Once your **I-140 is approved**, the date can follow you to a new qualifying petition instead of resetting.

:::good
title: Priority-date retention (8 CFR 204.5(e))
- The priority date of an **approved EB-1, EB-2, or EB-3 I-140** can be kept for a **later qualifying EB petition** — even with a new employer, in a different qualifying occupation.
- It is generally lost **only** if USCIS revokes the approval for one of four reasons: fraud or willful misrepresentation, DOL revocation of the labor certification, USCIS/DOS invalidation of the labor certification, or a USCIS determination of material error.
- **Employer withdrawal by itself is not one of those grounds** — so a withdrawal does not, on its own, cost you the priority date.
:::

:::warn
title: Withdrawal before 180 days revokes the petition — not automatically the date
If your employer withdraws the I-140 before it has been approved 180 days (and no I-485 has been pending 180+ days), USCIS generally auto-revokes **that petition** (8 CFR 205.1), and the withdrawal rescinds the job offer — so, unless §204(j) portability applies, you usually need a **new qualifying petition** to keep moving toward the green card. Your **priority date**, though, is generally still retained for that later petition, because withdrawal is not one of the 8 CFR 204.5(e)(2) loss grounds. Full decision guide: [changing jobs after I-140 approval](/green-card/change-jobs-after-i140).
:::

Retention is a different rule from **I-485 job portability under INA §204(j)**, which lets someone whose **I-485 has been pending at least 180 days** move to a *same or similar* job on the pending case. Retention does not turn on the "same or similar" test at all — see [AC21 portability explained](/green-card/ac21) for how the three rules fit together.

## Transferring a priority date to a new petition

An applicant can often **carry an earlier priority date from an approved employment-based I-140 onto a later one** — for example, from a first employer's approved EB-2 I-140 onto a new employer's petition, or from EB-2 onto an [EB-3 downgrade](/visa-bulletin/eb2-to-eb3-downgrade) filing.

:::info
- Retention is **not automatic** — your attorney must claim the earlier date when the new petition is filed.
- The new petition can be for a **different qualifying occupation**; "same or similar" is a §204(j) I-485 portability test, not a retention requirement.
- Under 8 CFR 204.5(e)(2), retention is generally **unavailable only** if the earlier approval was revoked for fraud or willful misrepresentation, DOL revocation of the labor certification, USCIS/DOS invalidation of the labor certification, or a material error.
- A refiled PERM (for example after a denial) generally creates a **new** priority date; you keep the old one through the earlier approved I-140.
:::

## Cashing in the date: I-485 or consular processing

The priority date is only "spent" at the final stage. When your date is current under the chart USCIS is honoring that month, you either file **I-485 (adjustment of status)** from inside the US or complete **consular processing** through the [National Visa Center](/nvc-case-status) if you are abroad. Being current is a prerequisite for filing — it is not a promise of how fast USCIS then adjudicates. For what "current" means and how the two visa-bulletin charts work, use the [visa bulletin priority-date guide](/visa-bulletin/priority-date).

## Frequently asked questions

### Where do I find my priority date?
It is printed on your I-140 receipt and approval notices (Form I-797) and on the PERM filing receipt from DOL; if you have already filed I-485, it is carried onto that receipt too. For PERM-based EB-2/EB-3 cases it is the PERM *filing* date — ask your employer's attorney to confirm the exact date.

### Does my priority date reset if I change jobs?
Generally no, once your I-140 is approved. Under 8 CFR 204.5(e), the priority date of an approved EB-1/EB-2/EB-3 petition can be kept for a later qualifying petition unless USCIS revokes the approval for fraud, DOL revocation or invalidation of the labor certification, or a material error. Employer withdrawal is not on that list — so even if a withdrawal before 180 days revokes the *petition*, the *priority date* is generally still retained. What a withdrawal costs you is that petition; unless §204(j) portability applies, you usually need a new qualifying petition to continue. See [changing jobs after I-140 approval](/green-card/change-jobs-after-i140).

### Can I keep my EB-2 priority date if I downgrade to EB-3?
Usually yes. An earlier approved EB-2 I-140 generally lets a new EB-3 I-140 keep the same priority date. This retention is separate from the §204(j) "same or similar" portability test and is lost only if the earlier approval was revoked for one of the 8 CFR 204.5(e)(2) grounds (fraud, labor-certification revocation or invalidation, or material error). Your attorney claims the earlier date on the new petition.

### Does premium processing move my priority date forward?
No. Premium processing only speeds the I-140 *decision* — generally 15 business days for most classifications, but 45 business days for E13 multinational executives/managers and E21 national-interest-waiver cases. Your priority date, and the visa-bulletin wait behind it, are completely unaffected.

### My priority date is current — why is my I-485 still pending?
Being current lets you file (or lets USCIS approve) — it is not a processing-speed guarantee. The I-485 itself still takes months after filing. Track the adjudication stage on the [I-485 filing guide](/green-card/i-485).`,
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
    answerFirst: true,
    kind: "reference",
    title: "EB-2 vs EB-3 for Indians: Which Category Should You Choose?",
    seoTitle: "EB-2 vs EB-3 for Indians: Which to Choose + Downgrade",
    metaDescription:
      "EB-2 vs EB-3 for Indian green card applicants: the eligibility, trade-offs, EB-2 NIW self-petition, and when an EB-3 downgrade makes sense. The decision guide — for live dates, see the bulletin pages.",
    navLabel: "EB-2 vs EB-3 for India",
    excerpt:
      "EB-2 and EB-3 both face severe India backlogs, and neither is reliably faster. This is the decision guide: eligibility, the NIW self-petition, and when a downgrade helps — with the live dates kept on the visa-bulletin pages.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `Most Indian employment green card applicants qualify for **EB-2** (advanced degree or exceptional ability) or **EB-3** (skilled worker or professional). Neither category is reliably faster for India — their cutoffs leapfrog each other — so the choice comes down to your eligibility, whether the **EB-2 NIW** self-petition is open to you, and whether a **downgrade** currently helps. This page is the decision guide; for the current cutoff dates, use the live [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) pages.

:::info
title: How this page fits with the other EB-2/EB-3 India pages
- **This page** — the permanent EB-2 vs EB-3 decision: eligibility, NIW, downgrade strategy.
- [EB-2 India](/visa-bulletin/eb2-india) / [EB-3 India](/visa-bulletin/eb3-india) — the **live cutoff dates** and monthly movement.
- [Wait-time scenarios](/eb2-eb3-priority-date-india) — rough **how-long estimates** by priority date (labeled estimates).
- [India green card backlog](/green-card/green-card-backlog-india) — the **causes and scale** of the wait.
:::

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
      "India green card backlog: the 7% per-country limit vs demand many times larger. Wait times by category, how the numerical limits actually work, and what you can do.",
    navLabel: "India Green Card Backlog",
    excerpt:
      "The India green card backlog exists because the statutory 7% per-country limit caps India's share of EB visas — while India produces far more qualified applicants than that share allows each year.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `:::quickanswer
The India green card backlog exists because US law sets a worldwide employment-based limit of **at least 140,000 a year** and, under INA §202, limits any one country to **7% of the combined family-sponsored and employment-based preference limits** (a combined per-country cap of **25,620 for FY2026**). That per-country limit is applied through category-allocation and prorating rules — it is **not** a fixed India EB quota — and India-born demand runs many times its actual share, so the queue now runs to a million or more including dependents. Practically: **EB-2 and EB-3 India cutoffs sit around 2014–2015**, EB-2 India was **Unavailable** in the July 2026 bulletin, and new filings in those categories should be planned in **decades, not years**.
:::

:::key
- Plan around the statutory **7% per-country limit** (INA §202), calculated across the combined family + employment preference totals — **not** a fixed annual India EB number.
- Expect EB-2 and EB-3 India final action dates to sit in the **2014–2015** range, moving only **1–3 months per calendar year** in recent years.
- Know your fastest realistic route: in recent bulletins **EB-1** India has run years rather than decades for those who qualify.
- Protect your position regardless of the wait — an approved I-140 supports **H-1B extensions past six years** (AC21 §104(c), three-year increments when a visa number is unavailable) and retains your priority date; §204(j) job portability opens once your I-485 has been pending **180 days**.
- Watch your children's ages: **CSPA** calculations decide whether a child over 21 keeps a place in your case.
:::

The India green card backlog is the defining constraint on Indian professional immigration to the US — a queue so long that a worker who files today in EB-2 may reach the front after retirement. This page explains why the backlog exists, how long the wait actually is by category, and what India-born H-1B workers can legitimately do about it. The mechanism that explains it: the 7% per-country limit caps India's *share* far below its demand — but it is a proration rule across all countries and categories, not a fixed India allotment. Below: how the numerical limits work, current wait times by category with the live cutoffs, how many Indians are estimated to be waiting, why unused visas rarely rescue the queue, the legislative picture, and the strategies applicants actually use while they wait.

## Why Does the India Green Card Backlog Exist?

The employment-based green card system has two constraints that together create the India backlog:

:::info
title: The two limits that create the India backlog
**Annual worldwide cap:** The worldwide employment-based preference level is set at **at least 140,000 per year** (including the family members of principal applicants). It has not been meaningfully increased since 1990.

**Per-country limit:** Under INA §202, no single country may take more than **7% of the combined family-sponsored and employment-based** annual preference limits — a combined per-country limit of **25,620 for FY2026**. This is a proration cap applied across categories, **not** a fixed employment-based allotment for India.
:::

The result: India generates a large fraction of all employment-based green card petitions (because of the large number of Indian workers in H1B-eligible fields), but the 7% per-country limit holds its *usage share* far below its demand. How many India-born applicants are actually admitted in a given year depends on category allocation, prorating, demand in each category, derivatives, and the spillover of unused numbers — and the gap between demand and that share has created a backlog spanning decades.

| How the numerical limits work | Figure |
|---|---|
| Worldwide employment-based preference level (FY2026) | at least 140,000, incl. dependents |
| Family-sponsored preference limit (FY2026) | 226,000 |
| Per-country limit: 7% of combined FB + EB (FY2026) | 25,620 (a proration cap, **not** India's EB quota) |
| EB-1 / EB-2 / EB-3 worldwide share (each 28.6%) | ~40,040 each |
| Actual India EB visas used per year | varies by category, demand, derivatives & spillover |
| Annual limit last raised by Congress | 1990 |

> Dependents (spouse and children) each use a visa number, so a family of four consumes four numbers — one reason demand outstrips India's prorated share so quickly.

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
- Once I-140 is approved, your H-1B may be extended in 3-year increments under AC21 §104(c) while a visa number is unavailable (renewable as long as that holds and you qualify)
- You can change employers and keep your priority date under 8 CFR 204.5(e); §204(j) portability on a pending I-485 opens after it has been pending 180 days
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

The backlog is not just a waiting problem — it shapes every other decision. Because your place in line is set at [PERM filing](/perm-timeline) and carried by the [approved I-140](/green-card/i-140-approved-what-next), filing early matters more than anything else you can control. While you wait, the I-140 is what keeps your [H-1B renewable past six years](/h1b) and what protects you in a [layoff](/h1b-layoff); your children's eligibility depends on [CSPA](/green-card/cspa-kids-aging-out) math; and your spouse's ability to work runs through the [H-4 EAD](/tools/h4-ead-navigator). Check where you actually stand with the [Priority Date Checker](/tools/priority-date-checker) and model the remaining years with the [Green Card Tracker](/tools/green-card-tracker). To weigh which category to file under, read [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india); to gauge how many years a given date implies, see the [EB-2/EB-3 India wait-time scenarios](/eb2-eb3-priority-date-india).

## Frequently asked questions

### How long is the green card wait for Indians?
It depends on category and priority date. EB-1 India has recently run a few years; EB-2 and EB-3 India cutoffs sit around 2014–2015, which means new filings in those categories face waits measured in decades under current law. EB-2 India was Unavailable entirely in the July 2026 bulletin.

### How many Indians are waiting for a green card?
Estimates from published analyses of USCIS and State Department inventory data put the India-born employment-based queue in the range of a million or more once dependents (derivatives) are counted — but the exact figure varies by analysis, methodology, and year, so treat any single number as an estimate rather than an official count. Because dependents consume visa numbers too, the effective queue is far longer than the count of principal applicants alone.

### Why is the India green card backlog so long?
Two rules work against each other: a worldwide employment-based supply of at least 140,000 green cards a year, and the INA §202 per-country limit — 7% of the combined family and employment preference totals, applied through category and prorating rules — which holds India's usage *share* far below its demand. India-born demand vastly exceeds that prorated share, and the annual limits have not been meaningfully raised since 1990.

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
    answerFirst: true,
    kind: "guide",
    title: "Changing Jobs After I-140 Approval: Your Options & Risks",
    seoTitle: "Changing Jobs After I-140 Approval (AC21) — India",
    metaDescription:
      "Your I-140 is approved and you want to change jobs. What employer withdrawal really costs you, how priority-date retention (8 CFR 204.5(e)) differs from the 180-day petition-survival rule and from §204(j) portability, and the Supplement J you'll need.",
    navLabel: "Change Jobs After I-140",
    excerpt:
      "Your I-140 is approved and you have an offer. This guide untangles the three rules people confuse — petition survival, priority-date retention, and §204(j) portability — so you know what a withdrawal actually costs and when to move.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `Your I-140 is approved and you have an offer from a new employer. The most common — and most expensive — mistake here is confusing three separate rules. A withdrawal by your old employer does **not**, by itself, cost you your priority date; what it can cost you is the *petition*. This guide separates the rules so you can see exactly what is at stake. For the underlying law, see [AC21 portability explained](/green-card/ac21).

:::key
- **Priority-date retention (8 CFR 204.5(e))** keeps your date for a later qualifying petition unless the approval is revoked for fraud, labor-certification revocation/invalidation, or material error — **employer withdrawal is not on that list.**
- **Petition survival (8 CFR 205.1)** is the 180-day-*after-approval* rule: it decides whether a *withdrawn I-140* itself stays approved.
- **§204(j) portability** is separate again — it needs your **I-485 pending 180+ days** and a **same-or-similar** job.
- So a withdrawal before 180 days usually means you need a **new petition** to proceed, but you generally **keep your priority date** for it.
- None of this speeds the India wait — it only protects your place in line while you change jobs.
:::

## The three rules, side by side

Confusing these is the single most common error. They have different clocks and protect different things:

| Rule | Clock | What it protects | Key requirement |
|---|---|---|---|
| **I-140 withdrawal rule** | 180 days after I-140 **approval** (or I-485 pending 180 days) | Whether the withdrawn I-140 itself generally stays approved | 8 CFR 205.1 |
| **Priority-date retention** | Approval of a qualifying I-140 | An earlier priority date for a later qualifying EB petition | 8 CFR 204.5(e), subject to the listed revocation exceptions |
| **§204(j) portability** | I-485 pending at least 180 days | Ability to continue a pending I-485 with a new job offer | New job in the same or similar occupation |

Read the rows across: your **priority date** rides on 204.5(e) retention (tied to approval, not to 180 days); the **petition** rides on the 205.1 withdrawal rule; **changing jobs on a pending case** rides on §204(j). See the retention mechanics in [your green card priority date](/green-card/priority-date).

## Decision guide: your situation after I-140 approval

:::info
title: Match your situation
- **I-140 approved 180+ days, no I-485 yet (date not current):** Lower risk. A withdrawal no longer auto-revokes the petition, and your priority date is retained regardless. A new employer files a fresh I-140 that keeps the earlier date; you file I-485 when your date is current.
- **I-140 approved less than 180 days, no I-485 yet:** A withdrawal here generally auto-revokes *that petition*, so you'd usually need a new qualifying petition — but your **priority date is still retained** for it (withdrawal is not a 204.5(e)(2) loss ground). Crossing 180 days first avoids having to refile.
- **I-485 pending 180+ days:** Best position. Use §204(j) portability to a same-or-similar job and file Supplement J.
- **I-485 pending less than 180 days:** Wait for the 180-day I-485 mark before relying on §204(j); moving earlier adds legal risk.
:::

## Employer withdrawal: what it does and does not cost

:::warn
title: Withdrawal costs you the petition, not automatically the date
If your I-140 has been **approved 180+ days** (or your I-485 has been pending 180+ days), an old employer's withdrawal generally does **not** revoke the petition. If it has been **approved less than 180 days**, a withdrawal generally **auto-revokes that petition** and rescinds the job offer — so, unless §204(j) applies, you need a new qualifying petition to continue. In either case your **priority date is generally retained** for a later petition, because withdrawal is not one of the 8 CFR 204.5(e)(2) loss grounds. Crossing the 180-day approval mark before you leave avoids having to refile the petition.
:::

## Timing the move around your I-485

- **Before you can file I-485 (date not current):** you rely on **priority-date retention**. A new employer files a new I-140 that keeps your earlier date; you file I-485 when the date is current. The new I-140 can be for a **different qualifying occupation** — "same or similar" is not required for retention.
- **After I-485 is on file and pending 180+ days:** you rely on **§204(j) portability** and confirm the new **same-or-similar** job with Supplement J — no new I-140 required for the pending case, though many employers file one anyway for a clean record.

## What counts as "same or similar" — and what to document

The same-or-similar test is based on **SOC (Standard Occupational Classification) codes**.

:::good
title: Usually same or similar (general guidance — confirm with your attorney)
- Software engineer → senior software engineer, tech lead, engineering manager
- Data scientist → data analyst, ML engineer, research scientist
- Financial analyst → finance manager, investment analyst
:::

:::bad
title: Often NOT same or similar
- Software engineer → product manager (different SOC category)
- Financial analyst → a role in an unrelated field
- Engineer → founder of an unrelated startup (fact-specific)
:::

When USCIS reviews the case after a job change, you (through your attorney) generally provide:

:::steps
A copy of the I-140 approval notice showing the approval date and the 180-day math.
A letter from the new employer describing the position and its duties.
Form I-485 Supplement J confirming the same-or-similar job offer.
A comparative SOC analysis aligning the original and new job codes.
Your resume showing continuity of work in the same occupation.
:::

## Which job-change guide do I need?

| Your situation | Guide |
|---|---|
| I want the rules and eligibility for AC21 itself | [AC21 concept & eligibility](/green-card/ac21) |
| My I-140 is approved and I'm weighing a specific move | **You are here** — options & risks after I-140 approval |
| I want to know my risk at my exact stage | [Changing jobs at each green card stage](/uscis/change-job-during-green-card) |

## Frequently asked questions

### Can I change employers multiple times and still keep my priority date?
Yes. As long as you have an approved qualifying I-140 whose approval has not been revoked for one of the 8 CFR 204.5(e)(2) grounds, the priority date can be retained across multiple employer changes. Retention does **not** require each new job to be "same or similar" — that test belongs to §204(j) portability on a pending I-485, not to keeping your date.

### If I change jobs before I-485 is filed, do I lose my green card progress?
Your priority date is generally retained either way. What changes is the petition: if your I-140 has been approved 180+ days, a withdrawal no longer auto-revokes it; if it was approved less than 180 days and the employer withdraws, that petition is generally auto-revoked and you'd need a new qualifying petition — but you keep the priority date for it. Either way, §204(j) portability is not available yet because that needs a pending I-485.

### My new employer wants to file a brand-new PERM and I-140. Is that better?
Sometimes. A fresh I-140 gives the new employer clean ownership of the sponsorship and can serve as a backup, and it can **retain your earlier priority date**. A brand-new PERM restarts recruitment but does not reset your retained date. Portability alone is often sufficient — discuss the trade-off with your attorney.

### Does moving jobs change how long my India wait is?
No. Retention and portability protect your existing place in line — they do not advance the [visa bulletin](/visa-bulletin/priority-date) cutoff. Your wait is governed by your priority date and the monthly bulletin, not by which employer sponsors you.`,
  },

  /* ─────────────────────────── AC21 ─────────────────────────────────────── */
  {
    slug: "ac21",
    answerFirst: true,
    kind: "guide",
    title: "AC21 Portability Explained: H-1B & Green Card Job Mobility",
    seoTitle: "AC21 Portability Explained: H-1B & Green Card Rights",
    metaDescription:
      "What AC21 is and who qualifies: two portability rights for Indian workers — H-1B work authorization after a transfer receipt (INA §214(n)) and I-485 job-offer portability after the I-485 is pending 180 days (INA §204(j)). Priority-date retention is a separate 8 CFR 204.5(e) rule.",
    navLabel: "AC21 Portability",
    excerpt:
      "AC21 is the law behind job mobility for Indian H-1B and green card applicants. It grants two separate portability rights — H-1B work authorization (§214(n)) and changing jobs on a pending I-485 (§204(j)) — while priority-date retention is a separate rule. This is the concept and eligibility guide.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `**AC21 (American Competitiveness in the Twenty-First Century Act)**, a 2000 law, is the statute that lets H-1B workers and employment green card applicants change jobs without starting over. It grants **two separate portability rights**: one under INA §214(n) for H-1B work authorization, and one under INA §204(j) for the green card. This page defines each right and its eligibility rules — the concept behind the two more task-specific guides linked below.

:::key
- **§214(n) — H-1B portability:** work for a new employer as soon as a non-frivolous I-129 transfer is filed and receipted, no approval needed.
- **§204(j) — green card portability:** move to a same-or-similar job with your existing I-140 once the **I-485 has been pending 180+ days**.
- The two rights are **independent** — you can use H-1B portability long before the green card §204(j) right ever applies.
- §204(j) portability is different from **priority-date retention**, which keeps an old date on a new petition regardless of "same or similar."
- AC21 protects the *ability to move* — it does not speed up the India [visa bulletin](/visa-bulletin/priority-date) wait.
:::

## AC21 protection #1: H-1B work authorization portability (§214(n))

Under INA §214(n), when an H-1B holder files a new I-129 petition with a new employer, they may begin working for that employer **as soon as the petition is filed and a receipt notice is issued** — without waiting for USCIS to approve the transfer.

:::info
title: H-1B portability conditions (all must be met)
- You were last admitted to the US in valid H-1B status
- Your current H-1B status has not expired (valid I-94)
- You have not violated any conditions of your H-1B status
- The new I-129 petition is non-frivolous and filed before your current status expires
:::

If these conditions are met, you may work for the new employer once the petition is filed and receipted — no approval required. See also: [H-1B transfer: when can you start work?](/h1b/start-work-after-transfer-receipt)

## AC21 protection #2: Green card portability (§204(j))

Under INA §204(j), if your **I-485 has been pending for at least 180 days**, you can change employers to a same-or-similar job and keep your existing I-140 and priority date supporting the green card.

:::info
title: Green card §204(j) portability conditions
- Your I-485 has been **pending for at least 180 days** (this is the clock that governs §204(j) — not the I-140 approval date)
- The new job is in the **same or similar occupational classification** (same SOC group, generally)
- The I-140 was approved (or is approvable) and the bona fide job offer still exists
:::

Job portability under §204(j) is confirmed to USCIS with **Supplement J**, which the new employer signs to certify the same-or-similar job offer. An approved I-140 **does not by itself start the I-485 portability clock** — that clock runs from I-485 filing.

:::info
title: Three rules people confuse — keep them separate
- **§204(j) portability (this section):** can you *change jobs on a pending I-485*? Turns on the **I-485 being pending 180+ days** plus a **same-or-similar** job offer (Supplement J).
- **Petition survival — the 180-day I-140 rule (8 CFR 205.1):** does a *withdrawn I-140* itself stay approved? Turns on the I-140 having been **approved 180+ days** (or an I-485 pending 180+ days).
- **Priority-date retention (8 CFR 204.5(e)):** can an *old priority date* move onto a *new qualifying petition*? Turns on having an **approved I-140**, is **not** limited to "same or similar," and is lost only if the approval was revoked for fraud, labor-certification revocation/invalidation, or material error. Details in [your green card priority date](/green-card/priority-date).
:::

## When AC21 does NOT protect you

:::bad
title: Situations where AC21 portability may not apply
- I-140 withdrawn by the employer before it was approved 180+ days — that I-140 generally cannot support the case
- New job in a materially different occupation (different SOC category)
- I-140 was **denied** (not just a pending RFE) — a denied I-140 cannot be ported
- You violated H-1B status before the transfer was filed
- Gaps in employment or unauthorized work periods
:::

Building your documentation for a specific job change — the Supplement J, the SOC same-or-similar memo, the timing — is covered step by step in [changing jobs after I-140 approval](/green-card/change-jobs-after-i140).

## Which job-change guide do I need?

| Your situation | Guide |
|---|---|
| I want the rules and eligibility for AC21 itself | **You are here** — AC21 concept & eligibility |
| My I-140 is approved and I'm weighing a specific move | [Changing jobs after I-140 approval](/green-card/change-jobs-after-i140) |
| I want to know my risk at my exact stage | [Changing jobs at each green card stage](/uscis/change-job-during-green-card) |

## Frequently asked questions

### What is the difference between AC21's two protections?
§214(n) lets you *work* for a new H-1B employer the moment your transfer is receipted. §204(j) lets you *change jobs without losing your green card* once your I-485 has been pending 180 days. They are separate rights with separate conditions — most people use H-1B portability years before §204(j) is ever relevant.

### Does the 180-day AC21 clock run from my I-140 approval?
No. The §204(j) 180-day clock runs from when your **I-485 was filed and has stayed pending** — not from I-140 approval. There is a *different* 180-day mark: the 8 CFR 205.1 withdrawal rule, which measures 180 days from **I-140 approval** and decides whether a withdrawn petition itself stays approved. Priority-date retention (8 CFR 204.5(e)) turns on simply having an approved I-140, not on any 180-day mark.

### AC21 says "same or similar" — how strictly does USCIS apply it?
The test is based on SOC codes and USCIS policy guidance. A well-documented comparison showing the two roles share core duties, required education, and occupational category typically satisfies it. Moving from individual contributor to manager in the same field is generally acceptable.

### Does AC21 protect me if I move from a large company to a startup?
The size or type of employer does not affect AC21 — only the occupational classification of the role matters. A startup role in the same field is fine.`,
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
