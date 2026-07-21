import { computeReadingTime } from "@/lib/format";
import type { EbCategory } from "@/lib/visa-bulletin";

export type VisaBulletinPageKind = "guide" | "reference" | "update";

export interface VisaBulletinPageData {
  slug: string;
  kind: VisaBulletinPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  /**
   * When set, the child page is an employment-based category page and the
   * [slug] route renders the live <VisaBulletinCategoryStatus> card (Final
   * Action Date, Dates for Filing, month-over-month movement, sources) above
   * the article body — all from the centralized bulletin data, so the prose
   * below can stay evergreen and never carry drifting hand-written dates.
   */
  category?: EbCategory;
  content: string;
}

export interface VisaBulletinPage extends VisaBulletinPageData {
  readingTime: number;
}

export const VISA_BULLETIN_CLUSTER_BASE = "/visa-bulletin";

export function visaBulletinChildPath(slug: string) {
  return `${VISA_BULLETIN_CLUSTER_BASE}/${slug}`;
}

const rawPages: VisaBulletinPageData[] = [
  /* ── 1. Priority date ─────────────────────────────────────────────────────── */
  {
    slug: "priority-date",
    kind: "guide",
    title: "What Is a Priority Date? Green Card Guide for Indians (2026)",
    seoTitle: "What Is a Priority Date? Green Card Guide for Indians",
    metaDescription:
      "Your priority date is the day your PERM (ETA-9089) was filed — it sets your green card queue place. How to check it and what current means.",
    navLabel: "Priority Date",
    excerpt:
      "Your priority date is the most important number in your green card process — it sets your place in the queue.",
    date: "2026-06-16",
    updated: "2026-07-19",
    content: `
:::quickanswer
Your **priority date** is the date your PERM labor certification (Form ETA-9089) was filed with the Department of Labor — or, for EB-1 and EB-2 NIW, the date your I-140 was filed with USCIS. It is your place in the green card queue: you can only move forward in months when the visa bulletin cutoff for your category and country is **later** than your date. Because the statutory **7% per-country limit** (INA §202) holds India's usage share far below its demand, an India-born EB-2/EB-3 priority date typically waits **years to decades**.
:::

:::key
- Find your priority date on the **PERM filing receipt** or your **I-140 approval notice (Form I-797)** — it is the PERM *filing* date, not the approval date.
- Check it monthly against **two charts** — Final Action Dates and Dates for Filing — in the DOS visa bulletin, published around the **8th–10th** of each month.
- "Current" (C) means **no backlog** — you can file/approve regardless of your date; a posted date means only earlier filers may act.
- Expect India EB-2/EB-3 waits measured in **years to decades** under the 7% per-country limit (a proration cap, not a fixed India quota).
- Compare your date against this month's charts in 30 seconds with the [Priority Date Checker](/tools/priority-date-checker).
:::

If you're asking "what is a priority date," you're really asking where you stand in the US green card line. This guide is for Indian applicants in EB-2, EB-3, or EB-1, for whom the priority date — more than any USCIS processing time — decides how many years the green card takes. The single most important fact: your priority date for a PERM-based case is set the day the Form ETA-9089 is filed, and India's 7% per-country limit (calculated across the combined family and employment preference totals, applied by category and prorating — not a fixed India quota) means that date can wait a decade or more before it is "current." Below: exactly how the priority date green card system works, how to check your priority date, what "priority date current" means on the two visa-bulletin charts, the difference between the Final Action Date and Dates for Filing, whether a date can be transferred, and how it connects to your I-140 and I-485.

## What Is a Priority Date?

A priority date is the date that establishes when you entered the employment-based immigration queue. Think of it like a ticket number at a government office — the lower the number, the sooner you get served.

For most Indian H1B workers pursuing EB-2 or EB-3 green cards:
- Your priority date is the date the Department of Labor **accepted your PERM labor certification (Form ETA-9089) for processing**
- It appears on the ETA-9089 filing receipt DOL issues when the case is submitted — not on the earlier prevailing-wage request (Form ETA-9141), which does **not** establish the employment-based priority date
- Even before your I-140 is filed or approved, this date already exists

:::info
**EB-1 and EB-2 NIW exception:** If you are pursuing EB-1 (no PERM needed) or EB-2 National Interest Waiver (self-petition), your priority date is the date your I-140 was filed with USCIS — not a PERM date.
:::

## How Do You Check Your Priority Date?

Two steps: find your date on your case documents, then compare it against this month's visa bulletin.

| Where your priority date appears | What to look for |
|---|---|
| PERM filing receipt from DOL | The date the employer's attorney filed ETA-9089 |
| I-140 approval notice (Form I-797) | "Priority Date" printed on the notice |
| I-485 receipt notice (if filed) | Priority date carried onto the receipt |

Then open the current [Department of State visa bulletin](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html) (published around the 8th–10th of each month), find your category row (EB-1/EB-2/EB-3) and the India column, and compare — or let the [Priority Date Checker](/tools/priority-date-checker) do the comparison against the stored bulletin data.

:::tip
**Ask your employer's attorney for the exact PERM filing date** — this is your priority date. Do not confuse the PERM certification date (when DOL approved it) with the PERM filing date (when it was submitted). The filing date is your priority date.
:::

## What Does "Priority Date Current" Mean?

"Current" means there is no backlog for your category and country that month — a visa number is available to you no matter when you filed. The visa bulletin expresses this per cell:

| Bulletin entry | Meaning for you |
|---|---|
| **C (Current)** | No cutoff — any priority date may act this month |
| **A specific date** (e.g. 01JAN14) | Only priority dates **earlier** than that date may act |
| **U (Unavailable)** | No visa numbers this month — nobody in that category/country can be approved |

Your date being "current" on the **Dates for Filing** chart may let you submit the I-485 (in months USCIS accepts that chart); being current on the **Final Action Dates** chart is what allows actual approval. When your date goes current, act quickly — see [what to do next](/visa-bulletin/priority-date-current-what-next), because dates can retrogress the following month.

## Final Action Date vs Dates for Filing: Which Chart Do You Check?

Every monthly bulletin has two charts. **Final Action Dates** (Chart A) control when a green card can actually be approved; **Dates for Filing** (Chart B) control when you may submit an I-485, in the months USCIS announces it will accept Chart B. USCIS posts the applicable chart each month at uscis.gov/visabulletininfo. The full breakdown — with examples of how the two charts interact for Indian applicants — is in [Final Action Date vs Dates for Filing](/visa-bulletin/final-action-date-vs-date-of-filing).

## Why Is the Priority Date So Important for Indians?

The US immigration system allocates employment-based green cards with a per-country 7% cap. No single country can receive more than 7% of all employment-based visas in a fiscal year.

India accounts for a disproportionately large share of EB-2 and EB-3 applicants relative to that 7% cap. The result:

:::bad
**India EB-2 and EB-3 backlogs are measured in years or decades.** In recent bulletins EB-2 India has at times been Unavailable (no numbers) and EB-3 India has sat around 2014. If you filed PERM in 2024, your priority date may not be current until the 2030s or later. Always verify the current month's cutoffs in the official visa bulletin, or check the [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status.
:::

For Indian applicants, the priority date is not just a bureaucratic number — it determines years of waiting in H1B status, whether your children age out, and when you can change jobs freely.

## Priority date vs. I-140 filing date

These are different:

| | Priority Date | I-140 Filing Date |
|---|---|---|
| **What it is** | Date PERM was filed with DOL (or I-140 for EB-1/NIW) | Date I-140 petition was filed with USCIS |
| **Who controls it** | Set when the PERM is filed with DOL | Filed by employer after PERM certification |
| **Why it matters** | Determines place in visa queue | Approved I-140 may support priority-date retention and, in qualifying cases, H-1B extensions beyond six years |

For EB-2/EB-3: your priority date is the PERM filing date, not the I-140 filing date.

An I-140 does not by itself start the I-485 portability clock. Job portability under INA §204(j) is a separate rule that generally depends on an eligible Form I-485 that has remained **pending for at least 180 days**, together with a new job in the same or a similar occupational classification.

## Can a priority date be transferred?

In some situations, yes. An applicant may often retain the priority date from an earlier approved employment-based petition for a later employment-based petition, subject to applicable regulations and exceptions:
- If your first employer's I-140 was approved and you change employers, the new employer's petition may be able to keep your earlier priority date
- Priority-date retention is **separate** from the "same or similar occupational classification" analysis used for certain I-485 portability cases under INA §204(j) — retention does not turn on whether the new job is the same or similar
- Retention may be unavailable when the earlier approval is revoked for reasons such as fraud, willful misrepresentation, material error, or invalidation of the underlying labor certification
- This is not automatic; the attorney must claim the earlier date, and outcomes depend on case facts — consult your immigration attorney

## How Your Priority Date Connects to Everything Else

The priority date is set by [PERM](/perm-timeline), carried by the [I-140](/i140-processing-time), and cashed in at [I-485](/i485-timeline) — so each stage interacts with it differently. Filing PERM earlier moves your date earlier; I-140 premium processing speeds the petition but never the date; and the month your date clears the applicable chart is the month the [I-485 filing window](/visa-bulletin/priority-date-current-what-next) opens. Category also matters: the same date waits very differently in [EB-1 India](/visa-bulletin/eb1-india) vs [EB-2 India](/visa-bulletin/eb2-india) vs [EB-3 India](/visa-bulletin/eb3-india). Track all of it monthly with the [Priority Date Checker](/tools/priority-date-checker).

This page explains how to *read* the priority date on the bulletin. For how the date is created, kept across job changes, and used at each stage of the employment green card, follow the full journey in [your green card priority date, from PERM to I-485](/green-card/priority-date).

:::cta
Check the current visa bulletin to see where your priority date stands.
[Check official visa bulletin →](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html)
:::

## Frequently asked questions

### What is a priority date for a green card?
It is the date that locks your place in the employment-based visa queue — the PERM (ETA-9089) filing date for most EB-2/EB-3 cases, or the I-140 filing date for EB-1 and EB-2 NIW. The monthly visa bulletin then determines when that place reaches the front of the line.

### How do I check if my priority date is current?
Find the date on your I-140 approval notice, then compare it to your category-and-country cell in this month's DOS visa bulletin (and the chart USCIS says applies). If your date is earlier than the posted cutoff — or the cell shows "C" — you are current. The [Priority Date Checker](/tools/priority-date-checker) automates the comparison.

### What is the difference between the Final Action Date and Dates for Filing?
Final Action Dates (Chart A) control when a case can be approved; Dates for Filing (Chart B) control when an I-485 can be submitted in months USCIS accepts Chart B. USCIS announces the applicable chart monthly — details in [our chart-by-chart guide](/visa-bulletin/final-action-date-vs-date-of-filing).

### Can my priority date change after it is set?
Your original priority date generally stays the same once your PERM (or I-140) is filed — it is the monthly visa bulletin cutoffs that move, not your date. There are limited exceptions: a refiled PERM creates a new date, and in certain situations you may be able to keep or recapture an earlier date from a previously approved I-140. Confirm which date applies to your case with your immigration attorney.

### What if my PERM was denied or withdrawn?
A denied PERM does not establish a priority date. If the PERM was refiled, the new filing date becomes the new priority date. An I-140 that has been approved for at least 180 days is generally protected from automatic revocation if the employer later withdraws it, which can help preserve the earlier priority date. The effect of a withdrawal can still depend on timing, petition history, and the basis for any revocation — discuss your specific situation with your immigration attorney.

### My priority date is 2020 — am I current for EB-2 India?
Check the current visa bulletin Final Action Date for India EB-2. Based on historical patterns, a 2020 priority date for India EB-2 is likely not current yet — but verify with the official bulletin since dates change monthly.

### Does premium processing move my priority date forward?
No. Premium processing ($2,805) speeds only the I-140 decision — generally 15 business days for most classifications, but 45 business days for E13 multinational executives/managers and E21 national-interest-waiver cases. Your priority date — and the visa-bulletin wait behind it — is completely unaffected.
`,
  },

  /* ── 2. Final Action Date vs Dates for Filing ─────────────────────────────── */
  {
    slug: "final-action-date-vs-date-of-filing",
    kind: "guide",
    title: "Final Action Date vs Dates for Filing: Which Chart Matters for I-485?",
    seoTitle: "Final Action Date vs Dates for Filing | Visa Bulletin Part A vs Part B",
    metaDescription:
      "What is the difference between the Final Action Date (Part A) and Dates for Filing (Part B) in the visa bulletin? Which chart do you need for I-485 filing?",
    navLabel: "Final Action Date vs Dates for Filing",
    excerpt:
      "The visa bulletin has two charts — Final Action Date and Dates for Filing — and which one matters depends on what USCIS announces each month.",
    date: "2026-06-16",
    content: `
:::summary
The visa bulletin has two charts. Table A (Final Action Dates) is the strict cutoff for green card approval. Table B (Dates for Filing) is an earlier window that sometimes allows you to file I-485 before your Final Action Date is current — but only if USCIS authorizes its use each month. Always check both the visa bulletin AND the monthly USCIS Visa Bulletin Acceptance memo.
:::

## The two charts in the visa bulletin

Every month, the State Department publishes two priority date charts:

| Chart | Name | Purpose |
|---|---|---|
| **Table A** | Final Action Dates | USCIS may APPROVE your green card when your priority date is earlier than this date |
| **Table B** | Dates for Filing | USCIS may ACCEPT your I-485 filing when your priority date is earlier than this date — and this cutoff is usually later than Table A |

Table B is often later (more favorable) than Table A, but not always — and it can only be used for adjustment of status if USCIS allows it that month. It exists to let applicants file I-485 and get work/travel authorization while waiting for their final approval.

:::warn
**For July 2026 employment-based adjustment of status, use Final Action Dates.** USCIS has directed employment-based I-485 filers to use Table A (Final Action Dates) this month — Table B (Dates for Filing) cannot be used to file I-485 in July 2026.
:::

:::warn
**Table B is not always available.** USCIS must publish a "Visa Bulletin Acceptance" memo each month authorizing use of Table B. Check uscis.gov/visabulletininfo for the current month's announcement. If USCIS says Table A must be used, then Table B is irrelevant — even if your priority date would qualify under Table B.
:::

## How to use Table A (Final Action Dates)

Table A is always the governing chart for green card approval. Your priority date must be:
- **Earlier than** the Final Action Date listed for your category (EB-1, EB-2, EB-3) and country (India, Other). If the category shows "U" (Unavailable), no priority date qualifies that month
- Current in the month when USCIS adjudicates your I-485 — not just the month you filed

A priority date that is current under Table A means USCIS can approve your green card.

:::info
"C" means **Current** — the chart does not impose a priority-date cutoff for that category and country that bulletin month. Current does not by itself remove the other eligibility, filing, admissibility, petition, documentation, or visa-availability requirements that may apply, and adjustment-of-status applicants must still confirm which chart USCIS permits them to use that month.
:::

## How to use Table B (Dates for Filing)

If USCIS authorizes Table B use that month:
- Your priority date only needs to be earlier than the Table B date to FILE I-485
- Filing I-485 lets you **apply** for an EAD (work permit) and Advance Parole (travel) — each is a separate application (Forms I-765 and I-131), and approval is not automatic
- Filing under Table B does NOT mean your green card will be approved — USCIS holds the case until your Final Action Date (Table A) is also current
- If your Final Action Date retrogresses after you file, your I-485 stays pending — you do not refile

:::good
**Filing under Table B while waiting for Final Action Date** is a valuable option for many Indian applicants. It lets you apply for an EAD (so you may not be dependent on H1B status) and Advance Parole (for travel) while you wait for your Table A date to catch up. The EAD and Advance Parole are separate applications and are not granted automatically.
:::

## Step-by-step: which chart to check

1. Find your priority date (from your PERM receipt or I-140 approval notice)
2. Go to [travel.state.gov](https://travel.state.gov) and open the current month's visa bulletin
3. Check Table A for your EB category (EB-1/EB-2/EB-3) and India row
4. If your priority date is earlier than Table A (and the category is not "U"): you may be able to file I-485 and, if all other requirements are met, have it approved
5. If not: go to [uscis.gov/visabulletininfo](https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart) to check if Table B is authorized this month
6. If Table B is authorized and your priority date is earlier than Table B: you can file I-485

## What this means for Indian applicants

For India EB-2 and EB-3, Table B typically shows dates 6–18 months ahead of Table A. This matters because:

- If your priority date falls in the Table B range, you may be able to file I-485 now and apply for EAD/AP (separate applications)
- If your priority date is before both tables, your green card may be approved if all other requirements are met
- If your priority date is after both tables, you are still waiting

:::tip
Even if Table B is authorized, file I-485 only when it makes financial and strategic sense. Your attorney can advise on whether the filing fees and effort are worth it based on how close your Final Action Date is expected to be.
:::

### Frequently asked questions

#### What happens to my I-485 if Table B is revoked after I filed?
Nothing — once filed, your I-485 stays pending regardless of future bulletin changes. You cannot unfile. USCIS will approve when your Final Action Date (Table A) becomes current.

#### Can USCIS deny my I-485 because I filed under Table B?
No — if you met the Table B filing requirement at the time of filing and USCIS authorized it that month, your filing is valid. USCIS will hold the case and not deny it solely because Table B was subsequently rescinded.

#### Table B showed dates for my category but USCIS didn't authorize it. Can I still file?
No. Table B dates in the visa bulletin are not self-executing. They require an explicit USCIS monthly authorization. Without it, Table A governs.
`,
  },

  /* ── 3. EB-1 India ────────────────────────────────────────────────────────── */
  {
    slug: "eb1-india",
    kind: "guide",
    title: "EB-1 India 2026: Priority Date, Wait Time & Requirements",
    seoTitle: "EB-1 India Priority Date 2026: Wait Time & Requirements",
    metaDescription:
      "EB-1 India: ~40,040 EB-1 visas a year worldwide, with India subject to the 7% per-country limit (boosted by spillover). Current priority date, wait time, and EB-1A/B/C rules — no PERM.",
    navLabel: "EB-1 India",
    category: "eb1",
    excerpt:
      "EB-1 skips PERM entirely and has a much shorter India backlog than EB-2 or EB-3 — making it the fastest employment green card path for qualifying Indians.",
    date: "2026-06-16",
    updated: "2026-07-19",
    content: `
:::quickanswer
EB-1 is the fastest employment-based green card for India-born applicants: it needs **no PERM labor certification**, and in recent bulletins its India backlog has been measured in **a few years, not decades**. Worldwide, roughly **40,040 EB-1 visas** are available each year (28.6% of the ≥140,000 employment preference level). India is subject to the **7% per-country limit** (INA §202), but India-born EB-1 applicants routinely receive **more** than a strict per-country share because unused numbers from other countries spill into EB-1. The exact current EB-1 India priority date is in the status panel above — always confirm against the official DOS bulletin.
:::

:::key
- Expect an EB-1 India queue of **a few years** (the cutoff above shows exactly where it stands) versus **decades** in EB-2/EB-3 India.
- Budget **$715** for the I-140 filing fee and **$2,805** more if you want premium processing (15 business days), per the USCIS fee schedule.
- Plan around **~40,040 EB-1 visas per year worldwide**; India is subject to the 7% per-country limit but routinely uses **more than that share** thanks to spillover of unused numbers.
- Qualify under one of three doors: **EB-1A** (3 of 10 criteria, self-petition), **EB-1B** (2 of 6 criteria + 3 years' experience), or **EB-1C** (1 year as a multinational manager/executive).
- File I-485 only when your priority date clears the applicable chart — track it with the [Priority Date Checker](/tools/priority-date-checker).
:::

EB-1 India is the first-preference employment green card route for India-born professionals — and, in recent bulletins, the only major category where the India wait has been measured in years rather than decades. This guide is for researchers, executives, and standout individual contributors weighing EB-1A extraordinary ability, EB-1B outstanding researcher, or EB-1C multinational manager against a long EB-2/EB-3 India queue. The headline numbers: about 40,040 EB-1 visas are available worldwide each year, India is subject to the 7% per-country limit but routinely receives more through spillover, and the current EB-1 India priority date — shown in the status panel above — has recently sat a few years back, versus 10+ years for EB-2 India. Below: what the EB-1 visa for India actually is, where the eb1 priority date india stands and how to read it, how many EB-1 visas India gets per year, the realistic wait time for an EB-1 green card from India, and the full requirements for each sub-category.

## What Is the EB-1 Visa for India?

EB-1 is the first preference employment-based immigrant visa category. It covers three sub-categories:

| Sub-category | Who qualifies | PERM required? |
|---|---|---|
| **EB-1A** | Extraordinary ability in sciences, arts, education, business, or athletics | No — self-petition |
| **EB-1B** | Outstanding professor or researcher | No — employer petition |
| **EB-1C** | Multinational manager or executive | No — employer petition |

## EB-1A: Extraordinary ability

You must demonstrate sustained national or international acclaim in your field. USCIS uses a two-step test:

**Step 1 — Meet at least 3 of 10 criteria:**
- Major prizes or awards (Nobel, Oscar, Olympic medal, etc.)
- Membership in associations requiring outstanding achievement
- Published material about you in major media
- Judging others' work in your field
- Original contributions of major significance
- Authorship of scholarly articles
- Work displayed at artistic exhibitions or showcases
- Leading role in distinguished organizations
- High salary relative to peers
- Commercial success in performing arts

**Step 2 — Final merits determination:** Even if you meet 3 criteria, USCIS evaluates whether the totality of the evidence establishes extraordinary ability.

:::good
**EB-1A self-petition advantage:** You petition yourself — no employer needed, no PERM, and no specific job offer required. This gives Indian workers independence from their employer's willingness to sponsor.
:::

## EB-1B: Outstanding professor or researcher

Your employer files on your behalf. You must show:
- International recognition for outstanding achievements in an academic field
- At least 3 years of teaching or research experience
- A permanent research or tenured/tenure-track teaching position

**Evidence — meet at least 2 of 6 criteria:**
- Major prizes or awards for outstanding achievement
- Membership in associations requiring outstanding achievement
- Published material about your work in major media
- Participation as a judge of others' work
- Original scientific or scholarly research contributions
- Authorship of scholarly books or articles

## EB-1C: Multinational manager or executive

You must have been employed as a manager or executive for at least 1 of the 3 years before your petition with the same employer (or affiliate/subsidiary). The position must also be managerial or executive in nature.

:::info
EB-1C is the path for L1A visa holders who have been managing operations of an Indian parent company and transferred to the US entity.
:::

## What Is the EB-1 India Priority Date Right Now?

The status panel at the top of this page shows the current EB-1 India Final Action Date, the Dates for Filing cutoff, last month's value, and this month's movement — pulled from the latest Department of State bulletin, with the recent-months history in the table below it. Two reading rules: your priority date must be **earlier** than the cutoff to act, and EB-1A, EB-1B, and EB-1C all share the **same** EB-1 India cutoff — there is no separate "EB-1A India priority date." Unlike EB-2 and EB-3, EB-1 India has not faced a decades-long backlog, though wait times have grown as more applicants qualify.

:::warn
EB-1 India is no longer "instant" — it has developed its own cutoff for India-born applicants. But it remains significantly shorter than EB-2 India or EB-3 India. Always check the current official visa bulletin.
:::

## How Many EB-1 Visas Per Year for India?

About **40,040 worldwide** — the EB-1 category receives 28.6% of the ≥140,000 employment-based preference level each fiscal year. India is subject to the INA §202 **7% per-country limit** (calculated across the combined family and employment preference totals, not a per-category India quota), but there is **no fixed India EB-1 allotment**: India-born applicants routinely receive **more** than a strict per-country share because unused numbers from other countries spill into EB-1, per the Department of State's annual visa statistics.

| Annual limit | Figure |
|---|---|
| Worldwide employment-based preference level (FY2026) | at least 140,000 |
| EB-1 worldwide share (28.6%) | ~40,040 |
| India per-country limit | 7% of combined FB + EB (a proration cap, not a fixed EB-1 number) |
| India actual EB-1 usage | often higher than a strict 7% share — spillover from unused numbers |

## What Is the Wait Time for an EB-1 Green Card from India?

Typically **3–5 years end to end** for a new India-born filing as of mid-2026 — dramatically shorter than EB-2/EB-3 India. The wait has three parts:

| Stage | Typical time | Can you speed it up? |
|---|---|---|
| I-140 petition | ~6–10 months regular | Yes — premium: 15 business days (EB-1A/EB-1B) or 45 (EB-1C), $2,805 |
| Priority-date wait (India) | A few years (see status panel above) | No — set by the monthly visa bulletin |
| I-485 adjustment of status | ~8–14 months typically | Interview waivers sometimes shorten it |

Fees, per the USCIS fee schedule: **$715** to file I-140, **$2,805** optional premium processing, and **$1,440** for each adult I-485. Premium processing speeds only the I-140 decision — it does **not** move your priority date.

## EB-1 vs EB-2 NIW for Indian researchers

If you are a researcher or academic who cannot qualify for EB-1B (e.g., you don't have 3 years of experience), EB-2 National Interest Waiver (NIW) may be an option. NIW also skips PERM. However:
- EB-2 NIW uses the India EB-2 cutoff date — much longer wait than EB-1
- EB-1B uses the India EB-1 cutoff date — shorter wait
- If you can qualify for EB-1B, it is generally preferable for India-born applicants

## How EB-1 India Connects to the Rest of Your Case

Your EB-1 priority date is set when the I-140 is filed (see [what a priority date is](/visa-bulletin/priority-date)), and you can [file I-485](/visa-bulletin/priority-date-current-what-next) only once that date clears the applicable chart — check yours against the stored bulletin data with the [Priority Date Checker](/tools/priority-date-checker) and model the full wait with the [Green Card Tracker](/tools/green-card-tracker). If you already hold an approved EB-2 I-140 from a PERM case, its earlier priority date can typically be retained for the EB-1 petition, instantly crediting years of queue time. New to the bulletin itself? Start with the [visa bulletin explained for Indians](/visa-bulletin).

## Frequently asked questions

### What is the EB-1 priority date for India right now?
It changes monthly — the status panel at the top of this page shows the current month's EB-1 India Final Action Date and Dates for Filing straight from the DOS bulletin, plus the recent movement history. As of the July 2026 bulletin the Final Action Date sat in late 2022.

### How long does EB-1 take for India-born applicants?
Typically 3–5 years end to end as of mid-2026: about 6–10 months for the I-140 (or 15 business days with premium processing), the priority-date wait shown in the status panel, then 8–14 months of I-485 processing. That compares to a decade-plus in EB-2 India.

### How many EB-1 visas does India get per year?
India is subject to the 7% per-country limit rather than a fixed EB-1 allotment, and spillover of unused numbers regularly pushes India's actual EB-1 usage above a strict 7% share of the ~40,040 worldwide EB-1 visas, per DOS annual reports.

### Can I file EB-1A while on H1B?
Yes. H1B status is compatible with filing an EB-1A self-petition. Your H1B employer does not need to be involved — but your immigration attorney must be.

### I'm a software engineer at a tech company. Can I qualify for EB-1A?
Possibly, if you have exceptional achievements — patents, major open-source contributions, invited conference presentations, peer-reviewed publications, or very high compensation relative to your peers. Most standard software engineers do not qualify. An immigration attorney can evaluate your specific profile.

### Does premium processing help EB-1?
Yes — premium processing is available for I-140, including EB-1A/EB-1B/EB-1C, for $2,805. USCIS acts within **15 business days** for EB-1A and EB-1B, but **45 business days** for EB-1C (E13 multinational executives/managers). It speeds the petition decision only; it does not advance your priority date.

### Is EB-1 faster than EB-2 for India?
Yes, dramatically. EB-1 India's cutoff has recently sat a few years back, while EB-2 India's sits over a decade back — and EB-2 India was marked Unavailable in the July 2026 bulletin. If you can credibly qualify for any EB-1 sub-category, it is usually worth pursuing.

### Will EB-1 India become current in 2026?
No one can promise that. Cutoff movement depends on demand and spillover, and the Department of State does not pre-announce dates. Watch the monthly bulletin (or the [monthly update tracker](/visa-bulletin/monthly-update)) rather than relying on prediction posts.
`,
  },

  /* ── 4. EB-2 India ────────────────────────────────────────────────────────── */
  {
    slug: "eb2-india",
    kind: "guide",
    title: "EB-2 India Priority Date: Current Cutoff and Movement",
    seoTitle: "EB-2 India Priority Date 2026: Current Cutoff & Movement",
    metaDescription:
      "EB-2 India priority date: the current Final Action Date and Dates for Filing, recent monthly movement, retrogression/unavailability, and how to read the EB-2 India row.",
    navLabel: "EB-2 India",
    category: "eb2",
    excerpt:
      "EB-2 India tracks the current Final Action Date, Dates for Filing, and monthly movement — with the live cutoffs in the panel above and how to read them below.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `
:::quickanswer
The EB-2 India priority date moves monthly and is shown in the status panel above, straight from the Department of State bulletin — in July 2026 the category went fully **Unavailable** (no visa numbers) for the rest of FY 2026, with Dates for Filing at **January 15, 2015**. The structural cause: the statutory **7% per-country limit** (INA §202) holds India's usage share far below its demand across all EB categories — so the EB-2 India wait for new filings is measured in **decades**, not years. To model how many years a given date might take, use the [wait-time scenarios](/eb2-eb3-priority-date-india).
:::

:::key
- Read the **current EB-2 India Final Action Date and Dates for Filing** in the live panel above — this page owns the current cutoff and its movement.
- The EB-2 India Final Action Date, when posted at all, has sat in the **early-to-mid 2010s** and moved **1–3 months per calendar year** in recent years.
- Watch **October 1** — the new fiscal year restores visa numbers after an "Unavailable" month like July 2026.
- Get the I-140 approved even while backlogged — an approved I-140 can support **H-1B extensions past six years** (AC21 §104(c), when a visa number is unavailable).
- Compare charts monthly with the [Priority Date Checker](/tools/priority-date-checker) — EB-3 India sometimes moves ahead of EB-2; weigh the choice in [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india).
:::

The EB-2 India priority date is the number that rules green-card planning for most India-born professionals with a master's degree or a bachelor's plus five years' experience. This page owns the **current cutoff and its movement** — the current Final Action Date (status panel above) and the recent EB-2 India month-over-month movement (history table above). The structural cause of the backlog: the 7% per-country limit under INA §202 caps India's usage *share* far below its demand — it is a proration rule across all countries and categories, not a fixed India allotment. For how long a given priority date might take, see the [wait-time scenarios](/eb2-eb3-priority-date-india); to choose a category, see [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india). Below: EB-2 requirements, why the backlog exists, what drives the monthly movement, the EB-2 NIW option, and how to read the row.

## What Are the EB-2 India Requirements?

To qualify for EB-2, you must meet one of:

**Advanced degree:**
- A master's degree or higher in your field, OR
- A bachelor's degree plus at least 5 years of progressive post-degree experience in the specialty

**Exceptional ability:**
Meet at least 3 of:
- Degree or diploma from an institution of learning relating to your area of exceptional ability
- Letters from current or former employers showing at least 10 years of full-time experience
- A license to practice the profession
- Evidence of commanding a high salary relative to others in the field
- Membership in professional associations
- Recognition for achievements and significant contributions

**EB-2 NIW (National Interest Waiver):**
Skip the PERM requirement by showing your work benefits the national interest of the US. No employer needed.

## What Is the EB-2 India Final Action Date Right Now?

It changes monthly — the status panel at the top of this page shows the current EB-2 India Final Action Date and Dates for Filing from the latest DOS bulletin, and the table under it shows the recent months' movement. Reading rules: your priority date must be **earlier** than the posted cutoff; "U" (Unavailable) means no visa numbers are authorized that month and no EB-2 India case can receive final approval regardless of priority date; and USCIS separately announces each month whether I-485 filings use the Final Action Dates or Dates for Filing chart.

## Visa Bulletin EB-2 India: Why the Backlog Exists

The INA §202 per-country limit (7% of the combined family and employment preference totals — 25,620 for FY2026, a proration cap and not a fixed India allotment) holds India's usage share far below its demand. India accounts for a disproportionate share of EB-2 applicants — far more than that prorated share.

| Supply vs demand | Figure |
|---|---|
| Worldwide employment-based preference level (FY2026) | at least 140,000 |
| EB-2 worldwide share (28.6%) | ~40,040 |
| Per-country limit: 7% of combined FB + EB (FY2026) | 25,620 (proration cap, **not** India's EB quota) |
| Actual India EB-2 visas used per year | varies by demand, derivatives & spillover |
| Pending India-born EB-2/EB-3 applicants (with dependents) | estimated in the hundreds of thousands, per published analyses of USCIS/DOS inventory data |

The result: when a cutoff date is posted at all, the EB-2 India Final Action Date has sat in the early-to-mid 2010s for years, moving slowly at 1–3 months per calendar year in recent good years and retrogressing in bad years. In July 2026 the category went fully **Unavailable** (no numbers) for the remainder of FY 2026 — a more severe form of the same supply problem.

## What Drives EB-2 India Movement

Nobody — including paid prediction services — can promise where the EB-2 India cutoff will be next quarter, and nothing here is a forecast. What the recent pattern (see the movement table above) does illustrate:

- **New fiscal years help.** Visa numbers reset every **October 1**; an Unavailable category regains numbers, and early-FY bulletins often show the year's best movement.
- **Movement is asymmetric.** Advances come in small steps (weeks to a few months); retrogressions can erase years overnight when demand spikes.
- **Spillover is the wildcard.** Unused family-based or ROW employment numbers can accelerate India dates in some years — and vanish the next.
- **For new filings, the honest math is decades** at the current supply level unless Congress changes per-country caps. Plan careers, H-1B extensions, and children's CSPA timelines around that reality, not around prediction posts.

:::bad
If you filed PERM in 2018, 2020, 2022, or 2024, your wait for EB-2 India could be 10–30+ years from the time of filing, based on historical movement — and in months like July 2026 when the category is Unavailable, no approvals happen at all. Always verify current dates with the official visa bulletin.
:::

## EB-2 NIW: self-petition without PERM

EB-2 NIW allows you to self-petition without an employer sponsor and without PERM. Requirements under the Dhanasar framework:

1. Your proposed endeavor has both substantial merit AND national importance
2. You are well-positioned to advance the endeavor
3. On balance, it would be beneficial to the US to waive the normal job-offer-and-labor-certification requirement

**Who commonly qualifies:** Researchers, academics, STEM professionals with publications, entrepreneurs working in critical infrastructure, healthcare, clean energy, or national security areas.

:::info
Even if you file EB-2 NIW, the India EB-2 priority date still applies. NIW saves the PERM step but does not bypass the per-country backlog.
:::

## EB-2 vs EB-3 India: Which Is Faster?

Neither EB-2 nor EB-3 India is clearly and consistently faster — the visa bulletin moves both in ways that are hard to predict. Some Indian applicants file for both EB-2 and EB-3 simultaneously (using "downgrade" strategy) to cover both cutoffs.

| | EB-2 India | EB-3 India |
|---|---|---|
| Education bar | Master's, or bachelor's + 5 yrs progressive experience | Bachelor's or 2+ yrs skilled experience |
| Cutoff behavior | Often slightly ahead, but went Unavailable in July 2026 | Sometimes moves ahead of EB-2 for stretches |
| Self-petition option | Yes — EB-2 NIW | No |
| Strategy | Primary category for advanced-degree Indians | Downgrade target when its chart is ahead |

Read the full comparison: [EB-2 vs EB-3 for India →](/green-card/eb2-vs-eb3-india)

## Planning around EB-2 India

Given the long backlog, the most important things Indian EB-2 workers can do:

:::steps
1. File PERM as early as possible — your priority date is set at PERM filing, not PERM approval
2. Get I-140 approved promptly — an approved I-140 may support priority-date retention and, in qualifying cases, H-1B extensions beyond the normal six-year limit (this is separate from INA §204(j) I-485 portability, which generally depends on an eligible I-485 that has been pending at least 180 days)
3. Monitor the visa bulletin monthly — be ready to file I-485 quickly when your date becomes current under Table A or Table B
4. Protect your children with CSPA analysis — for long waits, children aging out is a real risk
5. Consult your attorney about EB-3 downgrade — depending on relative cutoff dates, EB-3 may currently be faster
:::

## How EB-2 India Connects to the Rest of Your Case

Your EB-2 priority date is set the day your employer files PERM (see [what a priority date is](/visa-bulletin/priority-date)) — so the [PERM processing timeline](/perm-timeline) directly delays it. Once the I-140 is approved, the date can be retained across employers and categories, including an [EB-2→EB-3 downgrade](/visa-bulletin/eb2-to-eb3-downgrade) or a later [EB-1 petition](/visa-bulletin/eb1-india). Track where you stand each month with the [Priority Date Checker](/tools/priority-date-checker), model your total wait with the [Green Card Tracker](/tools/green-card-tracker), and know [what to do the month your date goes current](/visa-bulletin/priority-date-current-what-next). For a rough sense of how many years a given date implies, see the [EB-2/EB-3 India wait-time scenarios](/eb2-eb3-priority-date-india) (illustrative estimates, not predictions), and weigh the category choice in [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india).

## Frequently asked questions

### What is the current EB-2 India Final Action Date?
It changes monthly — the status panel at the top of this page shows the current value straight from the DOS bulletin. In the July 2026 bulletin, EB-2 India was marked Unavailable (no numbers), with Dates for Filing at January 15, 2015.

### Why is EB-2 India "Unavailable"?
The category's annual visa numbers ran out before the fiscal year ended, so the Department of State stopped issuing them. Numbers reset on October 1 with the new fiscal year, and the category then reappears with posted cutoff dates.

### When will EB-2 India become current?
For new filings, honest math says decades at current supply — India's prorated 7% share cannot clear hundreds of thousands of pending applicants quickly. No service can credibly predict monthly cutoffs; watch the bulletin itself or the [monthly update tracker](/visa-bulletin/monthly-update), and see the [wait-time scenarios](/eb2-eb3-priority-date-india) for illustrative estimates.

### Is EB-2 or EB-3 faster for India right now?
It alternates. The two charts leapfrog each other; in some periods EB-3 India is ahead, which is why the [EB-2→EB-3 downgrade](/visa-bulletin/eb2-to-eb3-downgrade) exists. Compare both charts in the current bulletin before deciding anything.

### Can I get 3-year H1B extensions while waiting for my EB-2 priority date?
Once your I-140 is approved, you may qualify for H-1B extensions beyond the 6-year cap under AC21 §104(c) — in three-year increments when your priority date is not current (a visa number is unavailable) and you otherwise qualify. It is not automatic, but it is one of the most important benefits of getting the I-140 approved even while your priority date is years away.

### I have both an EB-2 and EB-3 I-140 approved. Can I use both?
Yes — you can file I-485 under whichever has the more favorable current priority date. Having both gives flexibility. Discuss the interfiling and porting options with your attorney.

### Does EB-2 NIW skip the India backlog?
No. NIW skips PERM (no employer or recruitment needed), but your case still uses the same EB-2 India cutoff dates — the per-country queue applies in full.

### How much does an EB-2 green card cost in USCIS fees?
Per the USCIS fee schedule: $715 for the I-140, $1,440 for each adult I-485, and $2,805 if you add I-140 premium processing. PERM itself has no filing fee, and US regulations require the employer to bear PERM costs.
`,
  },

  /* ── 5. EB-3 India ────────────────────────────────────────────────────────── */
  {
    slug: "eb3-india",
    kind: "guide",
    title: "EB-3 India Priority Date: Current Cutoff and Movement",
    seoTitle: "EB-3 India Priority Date 2026: Current Cutoff & Movement",
    metaDescription:
      "EB-3 India priority date: the current Final Action Date and Dates for Filing, recent monthly movement, and how to read the EB-3 India row. Downgrade strategy lives on the comparison page.",
    navLabel: "EB-3 India",
    category: "eb3",
    excerpt:
      "EB-3 India tracks the current Final Action Date, Dates for Filing, and monthly movement — with the live cutoffs in the panel above and how to read them below.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `
:::quickanswer
The EB-3 India priority date is shown in the status panel above — in the **July 2026** bulletin the Final Action Date was **January 1, 2014** with Dates for Filing at **January 15, 2015**, meaning only India-born applicants who filed PERM before those dates could act. EB-3 covers professionals with a **bachelor's degree** and skilled workers with **2+ years** of experience, and it moves **independently of EB-2 India** — in July 2026 EB-3 posted a date while EB-2 India was **Unavailable**, which is exactly when a downgrade becomes worth discussing.
:::

:::key
- Check both charts every month — EB-3 India posted **January 1, 2014** (Final Action) while EB-2 India was Unavailable in July 2026.
- Qualify under EB-3 with a **bachelor's degree** (professionals) or **2+ years** of training/experience (skilled workers).
- Plan around the statutory **7% per-country limit** (INA §202) — a proration cap across the combined family and employment preference totals, **not** a fixed India EB number.
- Keep your **original priority date** when downgrading: an approved EB-2 I-140 generally lets the new EB-3 petition retain the earlier date.
- Movement has run only **1–3 months per calendar year** in recent years; for how long a given date might take, see the [wait-time scenarios](/eb2-eb3-priority-date-india).
:::

EB-3 India is the third-preference employment green card queue for India-born professionals holding a bachelor's degree and skilled workers with at least two years of experience — and it matters most as the category that sometimes runs *ahead* of EB-2 India. This page owns the **current EB-3 India cutoff and its movement**: the current Final Action Date and Dates for Filing (status panel above) and the recent month-over-month movement. The structural cause of the backlog is the 7% per-country limit under INA §202, which holds India's usage share far below its demand — a proration rule across all countries and categories, not a fixed India allotment. For the **downgrade and interfiling strategy**, see [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india); for **how long a given date might take**, see the [wait-time scenarios](/eb2-eb3-priority-date-india). Below: EB-3 requirements, where the EB-3 India cutoff stands now, what drives its movement, and how to read the EB-3 row.

## What Are the EB-3 India Requirements?

**Skilled workers:** Positions requiring at least 2 years of training or experience that are not temporary or seasonal.

**Professionals:** Positions requiring a baccalaureate (bachelor's) degree as a minimum in a specific field of science, arts, or business.

**Other workers:** Unskilled positions — not applicable to most Indian H1B workers.

Most Indian H1B workers qualify under the "professionals" sub-category.

## What Is the EB-3 India Priority Date Right Now?

The status panel at the top of this page shows the current EB-3 India Final Action Date and Dates for Filing from the latest Department of State bulletin, with recent months' movement in the table beneath it. As of the July 2026 bulletin:

| Chart (July 2026) | EB-3 India | EB-2 India | Rest of World |
|---|---|---|---|
| Final Action Date | January 1, 2014 | Unavailable | August 1, 2024 |
| Dates for Filing | January 15, 2015 | January 15, 2015 | Current |

> Source: U.S. Department of State Visa Bulletin, July 2026. Cutoffs change monthly — the status panel above reflects the bulletin month stored in this site's data.

## Why Is the EB-3 India Backlog So Long?

Like EB-2, EB-3 India is constrained by the INA §202 per-country limit. The Final Action Date for EB-3 India has sat around 2014 in recent bulletins and moves at a broadly similar pace to EB-2 India — though not always identically. The two can diverge sharply: there are months when EB-3 India posts a cutoff date while EB-2 India is Unavailable (see the current status above).

| Supply vs demand | Figure |
|---|---|
| Worldwide employment-based preference level (FY2026) | at least 140,000 |
| EB-3 worldwide share (28.6%) | ~40,040 |
| Per-country limit: 7% of combined FB + EB (FY2026) | 25,620 (proration cap, **not** India's EB quota) |
| Recent EB-3 India cutoff movement | ~1–3 months per calendar year |

The key insight: EB-2 and EB-3 India move independently every month. In some months EB-3 India is more current than EB-2 India; in others, EB-2 is ahead. This creates the strategic opportunity of filing I-140 in both categories.

:::info
**Historical pattern:** EB-3 India was temporarily ahead of EB-2 India in the late 2010s, prompting many applicants to downgrade from EB-2 to EB-3. The two have since moved at similar speeds. Always check the current bulletin rather than relying on historical trends.
:::

## Should You Downgrade from EB-2 to EB-3?

If you have an approved EB-2 I-140, you may be able to file a new EB-3 I-140 to take advantage of a more current EB-3 India cutoff date. This is called an EB-3 downgrade.

:::compare
**Downgrade pros:** If EB-3 India is currently more current than EB-2 India, downgrade lets you file I-485 (and apply for EAD/AP) sooner.

**Downgrade cons:** Generally requires a new EB-3 I-140 filing and your employer's participation. Depending on the existing certified PERM, the position requirements, and the role, the employer may be able to rely on the existing labor certification rather than starting a completely new PERM — employer counsel should confirm. The earlier EB-2 priority date can often be retained on the new EB-3 I-140 (retention is separate from the §204(j) "same or similar" test).
:::

[Read the full EB-2 to EB-3 downgrade guide →](/visa-bulletin/eb2-to-eb3-downgrade)

## What Is EB-3 to EB-2 Interfiling?

If you originally filed I-485 under EB-3 and your employer now has an approved EB-2 I-140, you may be able to request USCIS to adjudicate your I-485 under EB-2 — a process called interfiling. This is useful when EB-2 India becomes more current than EB-3.

[Read the full EB-3 to EB-2 interfiling guide →](/visa-bulletin/eb3-to-eb2-interfiling)

## How Do You Read the EB-3 India Row in the Visa Bulletin?

1. Open the current month's visa bulletin at travel.state.gov
2. Go to Table A (Final Action Dates) or Table B (Dates for Filing) — whichever applies
3. Look for "3rd" row (Third Preference / EB-3) in the Employment-Based chart
4. Find the India column
5. Compare the printed date to your priority date — if your date is earlier than the printed date, you are current. If the cell shows "U" (Unavailable), no priority date is current that month

## How EB-3 India Connects to the Rest of Your Case

Your EB-3 priority date is set the day the employer files [PERM](/perm-timeline), carried by the approved [I-140](/i140-processing-time), and cashed in at [I-485](/i485-timeline) once the date clears the applicable chart. Because EB-2 and EB-3 India leapfrog each other, the practical move is to watch both rows monthly with the [Priority Date Checker](/tools/priority-date-checker) and model the remaining wait with the [Green Card Tracker](/tools/green-card-tracker). If EB-3 pulls ahead, read the [EB-2 to EB-3 downgrade guide](/visa-bulletin/eb2-to-eb3-downgrade); if EB-2 recovers after you filed under EB-3, [interfiling](/visa-bulletin/eb3-to-eb2-interfiling) is the route back. New to the charts? Start with [how to read the visa bulletin](/visa-bulletin). To gauge how long a given date might take, see the [EB-2/EB-3 India wait-time scenarios](/eb2-eb3-priority-date-india) (illustrative estimates, not predictions), and compare categories in [EB-2 vs EB-3 for India](/green-card/eb2-vs-eb3-india).

## Frequently asked questions

### What is the EB-3 India priority date right now?
It changes monthly. In the July 2026 bulletin, the EB-3 India Final Action Date was January 1, 2014 and Dates for Filing was January 15, 2015 — the status panel at the top of this page always shows the current month straight from the DOS bulletin.

### Is EB-3 India faster than EB-2 India?
Sometimes. The two move independently and leapfrog each other: in July 2026 EB-3 India posted a January 1, 2014 Final Action Date while EB-2 India was Unavailable, making EB-3 the only one of the two where cases could be approved that month. Compare both rows in the current bulletin before deciding anything.

### How long is the EB-3 India wait for a new filing?
At the recent historical pace of roughly 1–3 months of cutoff movement per calendar year, against India's prorated 7% share of the combined preference limits, a new EB-3 India filing should be planned in decades rather than years. This is an illustrative estimate, not a forecast — no service can credibly predict monthly movement. See the [wait-time scenarios](/eb2-eb3-priority-date-india) for the methodology.

### Can I file PERM in both EB-2 and EB-3 simultaneously?
Some employers allow concurrent PERM filings in both categories for the same employee. This gives the employee two I-140 petitions with potentially different priority dates. Discuss with your employer's immigration attorney.

### If I downgrade to EB-3, will my old EB-2 priority date carry over?
Often yes. An earlier approved EB-2 I-140 can generally let the new EB-3 I-140 keep the earlier priority date, subject to applicable rules. This priority-date retention is separate from the "same or similar occupation" test used for I-485 portability under INA §204(j), and it can be unavailable if the earlier approval was revoked for reasons such as fraud, willful misrepresentation, material error, or invalidation of the labor certification. Your employer's attorney claims the earlier date when filing the new I-140.

### Does a downgrade require a brand-new PERM?
Not always. Depending on the existing certified PERM, the position's stated requirements, and the role, the employer may be able to rely on the existing labor certification for the EB-3 petition rather than restarting recruitment. Employer counsel must confirm this for your specific case.

### If EB-3 India is currently faster, should I immediately downgrade?
Not necessarily. The relative movement of EB-2 and EB-3 India changes every month, and a downgrade generally requires a new EB-3 I-140 (and, depending on the existing certified PERM, possibly a new PERM), costing time and money. Work with your attorney to model the expected wait under each category before deciding.
`,
  },

  /* ── 6. Retrogression ────────────────────────────────────────────────────── */
  {
    slug: "retrogression",
    kind: "guide",
    title: "Visa Bulletin Retrogression 2026: What It Means for You",
    seoTitle: "Visa Bulletin Retrogression 2026: Meaning & Impact",
    metaDescription:
      "Retrogression means the visa bulletin cutoff moved backward. What it does to a pending I-485 (nothing), why it happens, and India EB-2/EB-3 examples.",
    navLabel: "Retrogression Explained",
    excerpt:
      "Retrogression happens when the visa bulletin moves backward — and for Indian applicants with pending I-485, it can feel alarming. Here is exactly what it means.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `
:::quickanswer
**Retrogression** means the Department of State moved a visa bulletin cutoff **backward** — to an earlier date than the previous month — so priority dates that were current last month no longer are. It happens when demand for a category exceeds the visa numbers available that year. If your **I-485 is already pending, nothing bad happens**: USCIS simply cannot approve it until your date is current again, and your EAD and Advance Parole keep renewing. In the **July 2026** bulletin, EB-1 India retrogressed from Dec 15, 2022 to **Oct 15, 2022**, and EB-2 India went fully **Unavailable**.
:::

:::key
- Understand the core rule: retrogression **pauses** approvals, it never denies or abandons a pending I-485.
- Keep renewing **EAD and Advance Parole** — both ride on the pending I-485, not on your date being current.
- Watch **October 1**: the new fiscal year restores visa numbers, and dates often retrogress right after a summer surge.
- Expect the extreme form too — a category can go to **"U" (Unavailable)**, meaning zero visa numbers, as EB-2 India did in July 2026.
- Never commit to job changes, travel, or financial plans on the assumption a date will advance — check the bulletin each month around the **8th–10th**.
:::

Visa bulletin retrogression is the single most alarming thing an Indian green card applicant can see in a monthly bulletin — and usually the least dangerous. This guide explains what retrogression means, why priority dates move backward, what actually happens to a pending I-485 when it hits, and how the India EB-2 and EB-3 categories have behaved historically. The reassuring headline: a pending I-485 is never denied because of retrogression; USCIS just holds the case, and your work and travel authorization continue. Below: the definition with a worked example, the visa-number math that causes it, the difference between a retrogressed date and an "Unavailable" category, what to do in each filing situation, India's retrogression history, and how to track it monthly.

## What Is Retrogression in the Visa Bulletin?

Each month, the State Department sets new priority date cutoffs in the visa bulletin. In most months, dates move forward (advancing toward more recent dates). In some months, dates move backward — this is retrogression.

**Example:**
- June 2026 EB-1 India Final Action Date: Dec 15, 2022
- July 2026 EB-1 India Final Action Date: Oct 15, 2022 ← retrogression of ~2 months

A priority date of Dec 1, 2022 that was current in June would not be current in July.

:::warn
**Retrogression can go all the way to "Unavailable."** One recent example: in the July 2026 bulletin, EB-1 India retrogressed from Dec 15, 2022 to Oct 15, 2022, while **EB-2 India and EB-5 India Unreserved both became Unavailable ("U")** for the remainder of that fiscal year — no visa numbers at all, the most extreme form of backward movement. EB-3 India, by contrast, held a posted cutoff. For the current month's dates and which chart USCIS is using, check the [EB-1 India](/visa-bulletin/eb1-india), [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status.
:::

## Why Do Priority Dates Move Backward?

The annual supply of employment-based green cards is ~140,000. The distribution depends on:
- Unused family-based visa numbers that roll over to employment-based categories
- The per-country 7% cap for India
- Demand from all countries for all EB categories

When demand is high, dates advance slowly or retrogress. When family-based visas are heavily used, fewer roll over to employment-based. The State Department adjusts each month to manage visa number usage throughout the fiscal year (October–September).

:::info
**Fiscal year end surge:** September is the last month of the US government fiscal year. The State Department often aggressively advances dates in July–August to use all remaining visa numbers, then retrogresses sharply in October when the new fiscal year begins.
:::

## What Happens to a Pending I-485 During Retrogression?

If your I-485 is already filed and pending:

:::good
**Your I-485 is safe.** Retrogression does not cause your I-485 to be denied or require you to refile. USCIS holds your application pending. You keep your EAD, Advance Parole, and any biometrics already processed.
:::

If your priority date was current but retrogression happened before your I-485 was approved:
- USCIS cannot approve the green card until your priority date is current again
- Your I-485 stays in a holding pattern — not denied, not abandoned
- You continue renewing EAD and AP as needed

If you have NOT filed I-485 yet and retrogression hits:
- You cannot file I-485 during retrogression (unless a Table B window is still open and authorized)
- You wait for the date to advance forward again

| Your situation when retrogression hits | What happens | What you should do |
|---|---|---|
| I-485 pending, date retrogressed | Case held, not denied | Nothing — keep renewing EAD/AP |
| I-485 pending, category went "U" | Case held, no approvals that month | Nothing — wait for the new fiscal year |
| I-485 not yet filed, date retrogressed | Filing window closed | Watch Table B monthly for a reopening |
| I-485 approved before retrogression | Unaffected | None — approval stands |
| EAD/AP renewal pending | Unaffected | File renewals on the normal schedule |

## India Retrogression History: What Has Actually Happened

First, the distinction that trips people up:

| Bulletin entry | What it means | Can cases be approved? |
|---|---|---|
| A later date than last month | Normal forward movement | Yes, for dates earlier than the cutoff |
| An earlier date than last month | Retrogression | Yes, but only for the smaller earlier-date group |
| **U (Unavailable)** | No visa numbers at all this month | No — nobody in that category/country |
| C (Current) | No backlog | Yes, any priority date |

India EB-2 and EB-3 have experienced multiple retrogression events:
- **Late 2000s / early 2010s:** India EB-2 dates moved forward aggressively, then retrogressed sharply
- **2017–2019:** EB-3 India moved forward significantly, attracting EB-2 downgrades, then retrogressed
- **2023–2024:** Several months of retrogression following fiscal year end
- **Ongoing:** The India EB-2/EB-3 dates remain volatile — always check the current bulletin rather than assuming forward movement

:::warn
Never book plans (job changes, international travel, financial decisions) based on an assumption that your priority date will advance by a certain amount in a certain timeframe. Retrogression can happen in any month.
:::

## How Do You Track Retrogression Each Month?

- **Monthly:** Check the new visa bulletin around the 8th–10th of each month at travel.state.gov
- **Sign up for email alerts** at the State Department website
- **Ask your employer's attorney** to notify you of significant changes

## How Retrogression Connects to the Rest of Your Case

Retrogression is a visa-supply event, not a USCIS processing event — which is why your [USCIS case status](/uscis/case-status) can sit unchanged for months while the bulletin moves. Your [priority date](/visa-bulletin/priority-date) itself never changes; only the cutoff it is measured against does. Track the categories directly on [EB-1 India](/visa-bulletin/eb1-india), [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india), compare your own date with the [Priority Date Checker](/tools/priority-date-checker), and model the remaining wait with the [Green Card Tracker](/tools/green-card-tracker). If a retrogression closes your filing window before you filed, [what to do when your date is current](/visa-bulletin/priority-date-current-what-next) explains how quickly to move next time.

## Frequently asked questions

### What does retrogression mean in the visa bulletin?
Retrogression means the Department of State moved a category's cutoff date backward, to an earlier date than the previous month, because demand exceeded the visa numbers available. Applicants whose priority dates were current the previous month may no longer be current.

### Does retrogression cancel or deny my pending I-485?
No. A pending I-485 is simply held — never denied, abandoned, or required to be refiled. USCIS resumes adjudication when your priority date is current again, and your EAD and Advance Parole remain renewable throughout.

### What is the difference between retrogression and "Unavailable"?
Retrogression moves the cutoff to an earlier date, so a smaller group can still be approved. "U" (Unavailable) means no visa numbers exist for that category and country that month, so nobody can be approved regardless of priority date. EB-2 India was Unavailable in July 2026.

### My priority date was current last month, but this month's bulletin shows retrogression. Will USCIS still approve my I-485 this month?
If USCIS already adjudicated your case in the prior month (when your date was current), approval may still happen. If not, USCIS will hold the case until your date is current again. Ask your attorney to check your specific case status.

### Can retrogression affect my EAD or AP renewal?
No — EAD and AP renewals are tied to your pending I-485 status, not to whether your priority date is currently current. As long as I-485 is pending, you can renew EAD and AP.

### What is the difference between retrogression and a visa number "cutback"?
They refer to the same thing — the visa bulletin date moving backward. "Retrogression" is the common term used in immigration practice.
`,
  },

  /* ── 7. Priority date current — what next ────────────────────────────────── */
  {
    slug: "priority-date-current-what-next",
    kind: "guide",
    title: "Priority Date Current — What to Do Next: I-485 Filing Guide",
    seoTitle: "Priority Date Current — What to Do Next | File I-485 Guide India",
    metaDescription:
      "Your priority date became current in the visa bulletin — here is the exact step-by-step guide for what to do next: file I-485, EAD, Advance Parole, and prepare for the interview.",
    navLabel: "Priority Date Current — What Next",
    excerpt:
      "When your priority date becomes current in the visa bulletin, you have a window to file I-485. Here is exactly what to do — and how not to miss it.",
    date: "2026-06-16",
    content: `
:::summary
When your priority date becomes current in the visa bulletin — either under Final Action Dates (Table A) or Dates for Filing (Table B, if USCIS authorizes it) — you have a window to file I-485. Act promptly: prepare in advance, confirm the USCIS filing authorization, and submit a complete package. This guide walks you through each step.
:::

## Step 1: Confirm which chart applies

Not all priority date currency is the same:

:::compare
**Table A current (Final Action Dates):** USCIS can both accept your I-485 filing AND approve it. Best case.

**Table B current (Dates for Filing):** USCIS can accept your I-485 filing, but will hold it until Table A is also current. Still valuable — you can **apply** for an EAD and Advance Parole while waiting (separate Forms I-765 and I-131; approval is not automatic).
:::

Check both the State Department visa bulletin (travel.state.gov) and the USCIS Visa Bulletin Acceptance memo (uscis.gov/visabulletininfo) to know which chart you are filing under.

## Step 2: Verify your filing window

Priority date currency only matters if:
1. Your underlying I-140 is approved (for EB-2/EB-3 filers)
2. You are in lawful nonimmigrant status (H1B, H4, L1, etc.) or otherwise eligible to adjust status
3. You are physically present in the US
4. You have not violated any immigration terms

Ask your attorney to confirm you are eligible to file I-485 in the US (adjustment of status) vs. consular processing abroad.

## Step 3: Prepare your I-485 package

Start preparing this before your date becomes current — it takes weeks to assemble:

:::steps
1. **Form I-485** — the main application. Your attorney prepares this.
2. **Form I-485 Supplement J** — confirms your job offer is still valid (your employer signs this).
3. **Form I-131** — Advance Parole application (do not travel until this is approved).
4. **Form I-765** — Employment Authorization Document (EAD) application.
5. **Form I-864** — Affidavit of Support from your employer (or sponsor if self-petitioning).
6. **Form I-693** — Medical examination. Must be completed by a USCIS-designated civil surgeon within 60 days before filing. Civil surgeons book up fast — schedule immediately.
7. **Supporting documents** — passport copies, I-94, birth certificate, marriage certificate (if applicable), photos, tax records.
:::

:::warn
The I-693 medical exam results are only valid for 2 years. If you prepare early, make sure the exam is still valid when you file. Civil surgeon appointments can take weeks to schedule — start immediately.
:::

## Step 4: File promptly

Priority date windows can close quickly. If retrogression occurs after you see your date is current but before you file, you miss the window. File as fast as your package is complete.

:::tip
**File in the first two weeks of the month** when possible. The new bulletin is typically published around the 8th–10th. USCIS processes filings in the month the bulletin is valid — if you wait until the last week and USCIS retrogresses dates for the next month, you may miss the window.
:::

## Step 5: Track receipt notices

After filing, USCIS will mail receipt notices (I-797) for I-485, I-131, and I-765. Track them at egov.uscis.gov. Timeframes vary widely by service center, workload, and case, and are not guaranteed — as general ranges only:
- Biometrics appointment letter: often a few weeks to a couple of months after filing
- EAD/AP: often several months, but varies
- Interview notice (if required): varies by field office and can be well over a year

## Step 6: Do not travel until AP is approved

:::warn
Do NOT travel internationally after filing I-485 until your Advance Parole is approved and in hand. Departing the US while I-485 is pending without AP can result in USCIS treating the I-485 as abandoned. Keep your H1B status and visa stamp as a backup, but always consult your attorney before any travel.
:::

### Frequently asked questions

#### My priority date just became current this month — how long do I have to file?
Technically until the end of the month (the bulletin is valid for one calendar month). But dates can retrogress the next month, so file as fast as possible. Do not wait until the last days of the month.

#### Can I file I-485 if my H1B is expiring soon?
Yes — as long as you are in valid nonimmigrant status at the time of filing. Once I-485 is filed, you are in a period of "authorized stay" and do not need to maintain underlying status to remain in the US. However, maintaining H1B status alongside pending I-485 is still advisable for job portability.

#### What if USCIS schedules my interview very close to a priority date retrogression?
If USCIS schedules an interview but your priority date is not current at the time of the interview, they may postpone or hold the interview. Your I-485 does not get denied.
`,
  },

  /* ── 8. EB-2 to EB-3 downgrade ───────────────────────────────────────────── */
  {
    slug: "eb2-to-eb3-downgrade",
    kind: "guide",
    title: "EB-2 to EB-3 Downgrade for Indians: When, Why, and How",
    seoTitle: "EB-2 to EB-3 Downgrade India | How to Downgrade, Priority Date Porting",
    metaDescription:
      "When does an EB-2 to EB-3 downgrade make sense for Indian applicants? How to file a new EB-3 I-140, when a new PERM is or isn't needed, retain the priority date, and weigh the risks.",
    navLabel: "EB-2 to EB-3 Downgrade",
    excerpt:
      "An EB-2 to EB-3 downgrade can let Indian applicants file I-485 sooner if EB-3 India is more current — it generally requires a new EB-3 I-140 (sometimes a new PERM) and carries real costs and risks.",
    date: "2026-06-16",
    content: `
:::warn
**Timing caution:** a downgrade only helps for filing or approval if the applicant's priority date is earlier than the active chart cutoff for the category being moved into, and the case otherwise qualifies — all under the chart USCIS authorizes that month. In some months EB-2 India is Unavailable while EB-3 India posts a cutoff (or the reverse), which changes whether a downgrade does anything right now. Check the current [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status, verify the official bulletin, and confirm with your attorney.
:::

:::summary
An EB-2 to EB-3 downgrade means filing a new EB-3 I-140 to take advantage of a more favorable EB-3 India cutoff date. Depending on the existing certified PERM, the employer may be able to rely on it rather than running a completely new PERM — counsel should confirm. This can let applicants file I-485 (and apply for EAD/AP) sooner if EB-3 India is currently ahead of EB-2 India. The original EB-2 I-140 is typically kept active — only the new EB-3 I-140 is used for I-485 filing.
:::

## When does a downgrade make sense?

A downgrade makes sense when:
1. EB-3 India Final Action Date OR Dates for Filing is more current than EB-2 India
2. Your employer is willing to file a new EB-3 I-140 (and a new PERM, if the existing labor certification can't be used)
3. Your current job description qualifies under EB-3 requirements (bachelor's + 2 years)
4. You want to file I-485 sooner and apply for EAD and Advance Parole

:::warn
**Check the current visa bulletin before assuming EB-3 is faster.** EB-2 and EB-3 India dates move independently every month. If EB-2 India is currently more current than EB-3 India, a downgrade would be counterproductive.
:::

## The downgrade process

### Step 1: Confirm the labor certification for EB-3
A downgrade is filed as a **new EB-3 I-140**. Depending on the existing certified PERM (Form ETA-9089) — its stated minimum requirements, the offered role, and the case history — the employer may be able to rely on the existing labor certification for the EB-3 filing, or may need to run a new PERM. Employer immigration counsel should determine which applies. If a **new PERM** is required, it involves:
- A new prevailing wage determination (PWD) from DOL
- Full recruitment process (posting the job and documenting no qualified US workers applied)
- Filing ETA-9089 with DOL

:::info
Whether the existing labor certification can support the EB-3 I-140 depends on the case. This question is separate from the §204(j) "same or similar" test used for I-485 portability. Your attorney will advise on the correct approach.
:::

### Step 2: I-140 filing for EB-3
File the new I-140 in the EB-3 category (based on the existing or a new PERM):
- Premium processing available — 15 business days (EB-1A/EB-1B); 45 business days for EB-1C
- If a new PERM is used, file promptly after certification — a certified PERM is valid for 180 days
- Claim the earlier EB-2 priority date on the EB-3 I-140 (see Step 3)

### Step 3: Priority date retention
The new EB-3 I-140 can generally **retain** the original EB-2 priority date, subject to applicable rules. Retention does **not** depend on the §204(j) "same or similar" test — the attorney claims the earlier date in the I-140 filing, and it must be requested explicitly. Retention can be unavailable if the earlier approval was revoked for reasons such as fraud, willful misrepresentation, material error, or invalidation of the labor certification.

### Step 4: File I-485 under EB-3
Once the EB-3 I-140 is approved with the original priority date, check if EB-3 India is current. If yes (under Table A or Table B), file I-485 under EB-3.

## Risks and costs

:::bad
**Risks to consider:**
- If a new PERM is required, it can take 12–18 months and cost $3,000–$8,000+ in employer legal fees
- If EB-3 India retrogresses back behind EB-2 India, you may have spent money for no gain
- Priority-date retention is not guaranteed and depends on case facts
- Retention can be unavailable if the earlier I-140 was revoked for fraud, willful misrepresentation, material error, or invalidation of the labor certification
:::

## Keep the EB-2 I-140 active

:::good
**Critical:** Do NOT withdraw or abandon the original EB-2 I-140 when filing EB-3. Keep both active. If EB-3 India retrogresses, you can always use the EB-2 I-140 as a fallback when EB-2 India advances.
:::

### Frequently asked questions

#### Does my employer have to support the downgrade?
Yes — a downgrade requires employer participation. The employer files the new EB-3 I-140 (and a new PERM, if the existing labor certification can't be used) and typically pays for the process. If your employer is unwilling, a downgrade is not possible.

#### Can I downgrade even if I am the same employer but in a different city/role?
Possibly, but any labor certification relied on must accurately describe the actual job requirements and location. A significant change in duties can affect whether the existing certification supports the EB-3 filing and whether the earlier priority date is retained. Your attorney must evaluate this.

#### I filed I-485 under EB-3. Can I also use my EB-2 I-140 if EB-2 becomes more current later?
Yes — this is called interfiling. See the [EB-3 to EB-2 interfiling guide →](/visa-bulletin/eb3-to-eb2-interfiling).
`,
  },

  /* ── 9. EB-3 to EB-2 interfiling ─────────────────────────────────────────── */
  {
    slug: "eb3-to-eb2-interfiling",
    kind: "guide",
    title: "EB-3 to EB-2 Interfiling: How to Switch I-485 to a More Favorable Category",
    seoTitle: "EB-3 to EB-2 Interfiling India | Switch I-485 Category Guide",
    metaDescription:
      "What is EB-3 to EB-2 interfiling? How to request USCIS to adjudicate your pending I-485 under a more favorable EB category when EB-2 India becomes more current.",
    navLabel: "EB-3 to EB-2 Interfiling",
    excerpt:
      "If your I-485 was filed under EB-3 and EB-2 India becomes more current, you can request USCIS to adjudicate under your EB-2 I-140 without refiling — this is interfiling.",
    date: "2026-06-16",
    content: `
:::summary
Interfiling means asking USCIS to adjudicate your already-pending I-485 under a different approved I-140 — typically from EB-3 to EB-2, when EB-2 India becomes more current. This is not a new I-485 filing; it is a request to associate your existing pending I-485 with a different underlying petition. USCIS has clear procedures for this, and it can meaningfully shorten the green card wait.
:::

## What is interfiling?

If you:
1. Filed I-485 under an EB-3 I-140
2. Also have an approved EB-2 I-140 (or subsequently get one approved)
3. The EB-2 India Final Action Date is now more current than your EB-3 India date

...then you can submit a request to USCIS to use your EB-2 I-140 as the basis for your pending I-485 instead of the EB-3.

This is called interfiling or "porting" the I-485 to a different I-140.

## Requirements for interfiling

- Your I-485 must already be pending with USCIS
- You must have a separate, valid, approved I-140 in the new (EB-2) category
- The new I-140 must have the same priority date (or an earlier one) as the original I-140 used to file I-485, if dates matter
- The EB-2 I-140 must not have been withdrawn or revoked

## How to request interfiling

There is no specific USCIS form for interfiling — it is done by letter to the USCIS field office handling your I-485:

:::steps
1. **Confirm your I-485 is pending** at the correct USCIS field office (check the receipt notice)
2. **Confirm EB-2 India Final Action Date** is more current than the priority date of your EB-3 filing
3. **Prepare a cover letter** requesting that USCIS adjudicate the I-485 under the EB-2 I-140. Include: full name, A-number (if assigned), I-485 receipt number, EB-2 I-140 receipt number, priority date
4. **Attach a copy of the EB-2 I-140 approval notice** (I-797)
5. **Submit to the USCIS office** handling the I-485 — your attorney will know the correct method (typically by mail or USCIS online account)
:::

## Priority date considerations

If your EB-2 I-140 and EB-3 I-140 share the same underlying PERM, they typically have the same priority date. If they are from different PERMs, they may have different priority dates — and only the priority date associated with each I-140 applies.

:::info
**Example:** If your EB-3 I-140 has a priority date of March 2015 and your EB-2 I-140 has a priority date of November 2014, USCIS would use the November 2014 date when adjudicating under EB-2 — which may or may not be current for EB-2 India.
:::

## Timing and strategy

Interfiling makes sense when:
- EB-2 India Final Action Date is more current than your EB-3 priority date
- You have a valid approved EB-2 I-140
- You want USCIS to approve sooner under the EB-2 track

:::tip
Some applicants file I-485 under EB-3 specifically to apply for EAD/AP earlier (if EB-3 India Dates for Filing is authorized), then plan to interfile under EB-2 when EB-2 India Final Action Date advances to their date. This two-step approach is used by experienced immigration attorneys.
:::

### Frequently asked questions

#### Does interfiling reset my I-485 filing date?
No — your I-485 retains its original filing date. You are not refiling; you are associating the existing pending I-485 with a different I-140.

#### Can USCIS deny the interfile request?
USCIS can refuse if the conditions are not met (e.g., the EB-2 I-140 was revoked). Generally, if you have a valid approved EB-2 I-140 and EB-2 India is current, USCIS will honor the request.

#### If I interfile to EB-2 and EB-2 retrogresses, what happens?
Your I-485 remains pending under EB-2. USCIS cannot approve until EB-2 India is current. You cannot re-interfile back to EB-3 — so consider timing carefully with your attorney.
`,
  },

  /* ── 10. Monthly update ───────────────────────────────────────────────────── */
  {
    slug: "monthly-update",
    kind: "update",
    title: "Visa Bulletin Monthly Update Tracker: How to Follow EB-1, EB-2, EB-3 India Dates",
    seoTitle: "Visa Bulletin Monthly Update | How to Track EB-2 EB-3 India Priority Dates",
    metaDescription:
      "How to track the monthly visa bulletin update for EB-1, EB-2, and EB-3 India priority dates. When the bulletin is published, what changes to watch for, and how to stay current.",
    navLabel: "Monthly Update Guide",
    excerpt:
      "The visa bulletin is updated every month — here is exactly how to track it, what changes to watch for, and how to set up alerts for your EB category.",
    date: "2026-06-16",
    content: `
:::summary
The State Department publishes a new visa bulletin around the 8th–10th of each month for the following month (e.g., the July bulletin is published in early June). For Indian H1B workers, monitoring this monthly update is essential — a single month can bring meaningful date movement, retrogression, or a new Dates for Filing authorization.
:::

## When is the visa bulletin published?

- **Publication date:** Typically the 8th–10th of each month
- **Effective month:** The following month (bulletin published in June is for July)
- **Where:** travel.state.gov → visa bulletin section

## What to check every month

### 1. Table A — Final Action Dates for India

Check three rows:
- EB-1 India: Relevant if your I-140 is approved and you are waiting for approval
- EB-2 India: Relevant for most Indian H1B workers with advanced degrees
- EB-3 India: Relevant if you pursued EB-3 or did an EB-2 downgrade

Note both the date AND whether it moved forward, stayed the same, or retrogressed.

### 2. Table B — Dates for Filing for India

Check the same three rows. If your priority date falls in the Table B range (but not Table A), you may be able to file I-485 this month — if USCIS authorizes Table B use.

### 3. USCIS Visa Bulletin Acceptance memo

Check uscis.gov/visabulletininfo for the USCIS Adjustment of Status Filing Chart announcement. This is published after the State Department bulletin. It announces whether Table B (Dates for Filing) can be used for I-485 that month.

:::warn
This step is critical and often missed. Even if Table B shows a favorable date for your priority date, USCIS must specifically authorize its use. Without USCIS authorization, Table A governs.
:::

## How to track changes month over month

Keep a simple log of the India EB-2 and EB-3 dates each month:

| Month | EB-2 India (Table A) | EB-3 India (Table A) | EB-2 India (Table B) | Using Table B? |
|---|---|---|---|---|
| June 2026 | Sep 1, 2013 | Dec 15, 2013 | Jan 15, 2015 | No (Final Action Dates) |
| July 2026 | Unavailable | Jan 1, 2014 | Jan 15, 2015 | No (Final Action Dates) |

This makes retrogression and forward movement immediately visible.

## Setting up alerts

- **Email alerts from State Department:** Visit travel.state.gov and sign up for visa bulletin email notifications
- **USCIS email updates:** Subscribe at public.govdelivery.com/accounts/USDHSUSCIS
- **Immigration attorney:** Ask your employer's attorney to send you a summary after each bulletin is published

## What to do when you see your date become current

If your priority date becomes current under Table A:
1. Contact your employer's immigration attorney immediately
2. Begin assembling the I-485 package if not already prepared
3. Schedule a civil surgeon for I-693 medical exam
4. File I-485 as quickly as possible — do not wait until the end of the month

If your priority date becomes current under Table B (and USCIS authorizes it):
1. Same steps as above
2. Understand you are filing for work/travel authorization (EAD/AP) and a pending case — final approval waits for Table A

:::cta
Use the Priority Date Checker tool to see how your priority date compares to the current visa bulletin dates.
[Open Priority Date Checker →](/tools/priority-date-checker)
:::

### Frequently asked questions

#### The new bulletin is published the 8th but I see it earlier online. Is it official?
The bulletin is sometimes leaked or pre-published on unofficial sites. Use the official travel.state.gov publication as the authoritative source.

#### I missed the filing window — the dates retrogressed before I could file. What now?
Wait for your date to become current again. You cannot file I-485 while your priority date is not current (unless Table B is authorized and your date qualifies). Keep your I-140 approved and your H1B extended.

#### How far in advance should I prepare the I-485 package?
Begin preparing 2–3 months before you expect your date to become current. Civil surgeon appointments fill up, and USCIS forms require gathering documents from your employer, birth country, and civil records. Do not wait until your date is current to start preparing.
`,
  },
];

/* ─── export ─────────────────────────────────────────────────────────────── */

/**
 * Pages that received meaningful immigration-accuracy corrections in the
 * 2026-07 pass (AC21/180-day, EB-2→EB-3 downgrade, priority-date retention vs.
 * §204(j), Current/Unavailable meaning, and I-485/EAD/AP wording). Their
 * dateModified is bumped accordingly; datePublished (`date`) is left unchanged.
 */
const CONTENT_UPDATED_2026_07 = new Set([
  "priority-date",
  "final-action-date-vs-date-of-filing",
  "eb2-india",
  "eb3-india",
  "priority-date-current-what-next",
  "eb2-to-eb3-downgrade",
  "eb3-to-eb2-interfiling",
]);

export const visaBulletinChildPages: VisaBulletinPage[] = rawPages.map((p) => ({
  ...p,
  updated: p.updated ?? (CONTENT_UPDATED_2026_07.has(p.slug) ? "2026-07-14" : undefined),
  readingTime: computeReadingTime(p.content),
}));

export const visaBulletinChildSlugs = visaBulletinChildPages.map((p) => p.slug);

export function getVisaBulletinChildPage(slug: string): VisaBulletinPage | undefined {
  return visaBulletinChildPages.find((p) => p.slug === slug);
}
