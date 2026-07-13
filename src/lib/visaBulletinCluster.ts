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
    title: "Priority Date Explained for Indians",
    seoTitle: "Priority Date Explained for Indians | Green Card Visa Bulletin",
    metaDescription:
      "What is a priority date for employment green cards? When is it set, where to find it, and why it matters so much for Indian applicants in EB-2 and EB-3.",
    navLabel: "Priority Date",
    excerpt:
      "Your priority date is the most important number in your green card process — it sets your place in the queue.",
    date: "2026-06-16",
    content: `
:::summary
Your priority date is the date your PERM labor certification was filed with the Department of Labor (for EB-2/EB-3), or the date your I-140 was filed (for EB-1 and EB-2 NIW). It sets your place in the visa queue. For Indian applicants, an earlier priority date means a shorter wait in a very long backlog.
:::

## What is a priority date?

A priority date is the date that establishes when you entered the employment-based immigration queue. Think of it like a ticket number at a government office — the lower the number, the sooner you get served.

For most Indian H1B workers pursuing EB-2 or EB-3 green cards:
- Your priority date is the date the Department of Labor **accepted your PERM labor certification (Form ETA-9089) for processing**
- It appears on the ETA-9089 filing receipt DOL issues when the case is submitted — not on the earlier prevailing-wage request (Form ETA-9141), which does **not** establish the employment-based priority date
- Even before your I-140 is filed or approved, this date already exists

:::info
**EB-1 and EB-2 NIW exception:** If you are pursuing EB-1 (no PERM needed) or EB-2 National Interest Waiver (self-petition), your priority date is the date your I-140 was filed with USCIS — not a PERM date.
:::

## Where to find your priority date

Your priority date appears on:
- The PERM filing receipt from DOL (the date the employer's attorney filed ETA-9089)
- Your I-140 approval notice (I-797) — it will list the priority date in the approval
- Your I-485 receipt notice, if I-485 has been filed

:::tip
**Ask your employer's attorney for the exact PERM filing date** — this is your priority date. Do not confuse the PERM certification date (when DOL approved it) with the PERM filing date (when it was submitted). The filing date is your priority date.
:::

## Why is the priority date so important for Indians?

The US immigration system allocates employment-based green cards with a per-country 7% cap. No single country can receive more than 7% of all employment-based visas in a fiscal year.

India accounts for a disproportionately large share of EB-2 and EB-3 applicants relative to that 7% cap. The result:

:::bad
**India EB-2 and EB-3 backlogs are measured in years or decades.** In recent bulletins EB-2 India has at times been Unavailable (no numbers) and EB-3 India has sat around 2014. If you filed PERM in 2024, your priority date may not be current until the 2030s or later. Always verify the current month's cutoffs in the official visa bulletin, or check the live [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status.
:::

For Indian applicants, the priority date is not just a bureaucratic number — it determines years of waiting in H1B status, whether your children age out, and when you can change jobs freely.

## Priority date vs. I-140 filing date

These are different:

| | Priority Date | I-140 Filing Date |
|---|---|---|
| **What it is** | Date PERM was filed with DOL (or I-140 for EB-1/NIW) | Date I-140 petition was filed with USCIS |
| **Who controls it** | Set automatically at PERM submission | Filed by employer after PERM certification |
| **Why it matters** | Determines place in visa queue | Triggers the 180-day AC21 clock for portability |

For EB-2/EB-3: your priority date is the PERM filing date, not the I-140 filing date.

## Can a priority date be transferred?

In some situations, yes — a priority date from an earlier approved I-140 can sometimes be "ported" to a new I-140:
- If your first employer's I-140 was approved and you change employers, the new employer may be able to use your old priority date
- This is not automatic — it requires the attorney to request it and the old I-140 must not have been revoked
- Consult your immigration attorney before relying on priority date porting

:::cta
Check the current visa bulletin to see where your priority date stands.
[Check official visa bulletin →](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html)
:::

### Frequently asked questions

#### Can my priority date change after it is set?
Your original priority date generally stays the same once your PERM (or I-140) is filed — it is the monthly visa bulletin cutoffs that move, not your date. There are limited exceptions: a refiled PERM creates a new date, and in certain situations you may be able to keep or recapture an earlier date from a previously approved I-140. Confirm which date applies to your case with your immigration attorney.

#### What if my PERM was denied or withdrawn?
A denied PERM does not establish a priority date. If the PERM was refiled, the new filing date becomes the new priority date. If your I-140 was previously approved (for at least 180 days), your attorney may be able to preserve the old priority date even after the employer withdraws the I-140 — discuss this immediately with your attorney.

#### My priority date is 2020 — am I current for EB-2 India?
Check the current visa bulletin Final Action Date for India EB-2. Based on historical patterns, a 2020 priority date for India EB-2 is likely not current yet — but verify with the official bulletin since dates change monthly.
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
If the bulletin shows "C" (Current) for your category and country, all priority dates in that category qualify — your date is automatically current.
:::

## How to use Table B (Dates for Filing)

If USCIS authorizes Table B use that month:
- Your priority date only needs to be earlier than the Table B date to FILE I-485
- Filing I-485 gives you access to EAD (work permit) and Advance Parole (travel) while waiting
- Filing under Table B does NOT mean your green card will be approved — USCIS holds the case until your Final Action Date (Table A) is also current
- If your Final Action Date retrogresses after you file, your I-485 stays pending — you do not refile

:::good
**Filing under Table B while waiting for Final Action Date** is a powerful strategy for Indian applicants. It lets you get an EAD (so you're not dependent on H1B status) and AP (for travel) while you wait for your Table A date to catch up.
:::

## Step-by-step: which chart to check

1. Find your priority date (from your PERM receipt or I-140 approval notice)
2. Go to [travel.state.gov](https://travel.state.gov) and open the current month's visa bulletin
3. Check Table A for your EB category (EB-1/EB-2/EB-3) and India row
4. If your priority date is earlier than Table A (and the category is not "U"): you can file I-485 and be approved
5. If not: go to [uscis.gov/visabulletininfo](https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/visa-bulletin-information-for-adjustment-of-status-filing-chart) to check if Table B is authorized this month
6. If Table B is authorized and your priority date is earlier than Table B: you can file I-485

## What this means for Indian applicants

For India EB-2 and EB-3, Table B typically shows dates 6–18 months ahead of Table A. This matters because:

- If your priority date falls in the Table B range, you can file I-485 now and get EAD/AP
- If your priority date is before both tables, your green card can be approved
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
    title: "EB-1 India: Priority Dates, Requirements, and the No-PERM Advantage",
    seoTitle: "EB-1 India Priority Date 2026 | EB-1A EB-1B EB-1C Explained",
    metaDescription:
      "EB-1 India priority dates, requirements for EB-1A extraordinary ability, EB-1B outstanding researcher, EB-1C multinational exec. No PERM needed — faster path for Indians.",
    navLabel: "EB-1 India",
    category: "eb1",
    excerpt:
      "EB-1 skips PERM entirely and has a much shorter India backlog than EB-2 or EB-3 — making it the fastest employment green card path for qualifying Indians.",
    date: "2026-06-16",
    content: `
:::info
The current EB-1 India Final Action Date, Dates for Filing, and this month's movement are shown in the live status panel above — pulled from the latest Department of State bulletin. EB-1 India moves independently of EB-2 and EB-3 India and has historically carried a much shorter backlog, though it now has its own cutoff for India-born applicants. Always confirm the current month against the official bulletin.
:::

:::summary
EB-1 employment green cards do not require PERM labor certification — meaning no DOL process, no recruitment test, and no 12+ month wait before you can file I-140. For India-born applicants who qualify, EB-1 typically has a dramatically shorter wait than EB-2 or EB-3 India.
:::

## What is EB-1?

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

## EB-1 India priority dates

Unlike EB-2 and EB-3, EB-1 India has not faced the same decades-long backlog — though wait times have increased in recent years as more applicants qualify. Check the current visa bulletin for the current India EB-1 Final Action Date.

:::warn
EB-1 India is no longer "instant" — it has developed its own backlog for India-born applicants. But it is still significantly shorter than EB-2 India or EB-3 India. Always check the current official visa bulletin.
:::

## EB-1 vs EB-2 NIW for Indian researchers

If you are a researcher or academic who cannot qualify for EB-1B (e.g., you don't have 3 years of experience), EB-2 National Interest Waiver (NIW) may be an option. NIW also skips PERM. However:
- EB-2 NIW uses the India EB-2 cutoff date — much longer wait than EB-1
- EB-1B uses the India EB-1 cutoff date — shorter wait
- If you can qualify for EB-1B, it is generally preferable for India-born applicants

### Frequently asked questions

#### Can I file EB-1A while on H1B?
Yes. H1B status is compatible with filing an EB-1A self-petition. Your H1B employer does not need to be involved — but your immigration attorney must be.

#### I'm a software engineer at a tech company. Can I qualify for EB-1A?
Possibly, if you have exceptional achievements — patents, major open-source contributions, invited conference presentations, peer-reviewed publications, or very high compensation relative to your peers. Most standard software engineers do not qualify. An immigration attorney can evaluate your specific profile.

#### Does premium processing help EB-1?
Yes — premium processing is available for I-140, including EB-1A/EB-1B/EB-1C. USCIS will act within 15 business days.
`,
  },

  /* ── 4. EB-2 India ────────────────────────────────────────────────────────── */
  {
    slug: "eb2-india",
    kind: "guide",
    title: "EB-2 India Priority Dates: Backlog, Requirements, and NIW Option",
    seoTitle: "EB-2 India Priority Date 2026 | EB-2 Backlog, NIW, Requirements",
    metaDescription:
      "EB-2 India priority dates, current backlog, requirements (advanced degree, exceptional ability), EB-2 NIW self-petition, and how to plan your green card with EB-2.",
    navLabel: "EB-2 India",
    category: "eb2",
    excerpt:
      "EB-2 India has one of the longest green card backlogs in the US system — but knowing the current cutoff, NIW option, and EB-3 strategy can help you plan.",
    date: "2026-06-16",
    content: `
:::info
The current EB-2 India Final Action Date, Dates for Filing, and this month's movement are shown in the live status panel above, straight from the latest Department of State bulletin. When a category is marked **Unavailable**, no immigrant visa numbers are authorized that month and no case can receive final approval regardless of priority date. Always confirm the current month against the official bulletin.
:::

:::summary
EB-2 India is the second preference employment-based category for workers with an advanced degree (master's or higher, or bachelor's + 5 years of progressive experience) or exceptional ability. The India EB-2 backlog is measured in years to decades depending on your priority date, and in some months no numbers are available at all — see the live status above for where the category stands this month.
:::

## EB-2 requirements

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

## EB-2 India backlog explained

The per-country 7% cap limits India to approximately 9,800 employment-based visas per year across all EB categories. India accounts for a disproportionate share of EB-2 applicants — far more than 7% of the total pool.

The result: when a cutoff date is posted at all, the EB-2 India Final Action Date has sat in the early-to-mid 2010s for years, moving slowly at 1–3 months per calendar year in good years and retrogressing in bad years. In July 2026 the category went fully **Unavailable** (no numbers) for the remainder of FY 2026 — a more severe form of the same supply problem.

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

## EB-2 vs EB-3 for India: which is faster?

Neither EB-2 nor EB-3 India is clearly and consistently faster — the visa bulletin moves both in ways that are hard to predict. Some Indian applicants file for both EB-2 and EB-3 simultaneously (using "downgrade" strategy) to cover both cutoffs.

Read the full comparison: [EB-2 vs EB-3 for India →](/green-card/eb2-vs-eb3-india)

## Planning around EB-2 India

Given the long backlog, the most important things Indian EB-2 workers can do:

:::steps
1. File PERM as early as possible — your priority date is set at PERM filing, not PERM approval
2. Get I-140 approved promptly — unlocks 3-year H1B extensions and the 180-day AC21 clock
3. Monitor the visa bulletin monthly — be ready to file I-485 quickly when your date becomes current under Table A or Table B
4. Protect your children with CSPA analysis — for long waits, children aging out is a real risk
5. Consult your attorney about EB-3 downgrade — depending on relative cutoff dates, EB-3 may currently be faster
:::

### Frequently asked questions

#### What is the current EB-2 India Final Action Date?
Check the current month's visa bulletin at travel.state.gov. The date changes monthly and this guide cannot show real-time data.

#### Can I get 3-year H1B extensions while waiting for my EB-2 priority date?
Yes — once your I-140 is approved, you qualify for 3-year H1B extensions beyond the 6-year cap. This is one of the most important benefits of getting the I-140 approved even if your priority date is years away from being current.

#### I have both an EB-2 and EB-3 I-140 approved. Can I use both?
Yes — you can file I-485 under whichever has the more favorable current priority date. Having both gives flexibility. Discuss the interfiling and porting options with your attorney.
`,
  },

  /* ── 5. EB-3 India ────────────────────────────────────────────────────────── */
  {
    slug: "eb3-india",
    kind: "guide",
    title: "EB-3 India Priority Dates: Requirements, Downgrade from EB-2, and Backlog",
    seoTitle: "EB-3 India Priority Date 2026 | EB-3 Backlog, Downgrade from EB-2",
    metaDescription:
      "EB-3 India priority dates, requirements (bachelor's degree, skilled worker), EB-3 backlog for Indians, and the EB-2 to EB-3 downgrade strategy explained.",
    navLabel: "EB-3 India",
    category: "eb3",
    excerpt:
      "EB-3 India covers bachelor's-degree holders and skilled workers — and while the backlog is similar to EB-2, the relative cutoff movement can make EB-3 strategically useful.",
    date: "2026-06-16",
    content: `
:::info
The current EB-3 India Final Action Date, Dates for Filing, and this month's movement are shown in the live status panel above, from the latest Department of State bulletin. EB-3 India moves independently of EB-2 India — in some months EB-3 is ahead, in others behind — which is what makes the EB-2/EB-3 downgrade and interfiling strategies worth watching. There are months when one category posts a cutoff while the other is Unavailable. Always confirm the current month against the official bulletin.
:::

:::summary
EB-3 is the third preference employment-based category for skilled workers (2+ years of training/experience), professionals (bachelor's degree), and other workers. For India, EB-3 has its own backlog, which sometimes moves faster and sometimes slower than EB-2 India. Some applicants pursue both categories simultaneously.
:::

## EB-3 requirements

**Skilled workers:** Positions requiring at least 2 years of training or experience that are not temporary or seasonal.

**Professionals:** Positions requiring a baccalaureate (bachelor's) degree as a minimum in a specific field of science, arts, or business.

**Other workers:** Unskilled positions — not applicable to most Indian H1B workers.

Most Indian H1B workers qualify under the "professionals" sub-category.

## EB-3 India backlog

Like EB-2, EB-3 India suffers from the per-country 7% cap. The Final Action Date for EB-3 India has sat around 2014 in recent bulletins and moves at a broadly similar pace to EB-2 India — though not always identically. The two can diverge sharply: there are months when EB-3 India posts a cutoff date while EB-2 India is Unavailable (see the current status above).

The key insight: EB-2 and EB-3 India move independently every month. In some months EB-3 India is more current than EB-2 India; in others, EB-2 is ahead. This creates the strategic opportunity of filing I-140 in both categories.

:::info
**Historical pattern:** EB-3 India was temporarily ahead of EB-2 India in the late 2010s, prompting many applicants to downgrade from EB-2 to EB-3. The two have since moved at similar speeds. Always check the current bulletin rather than relying on historical trends.
:::

## EB-2 to EB-3 downgrade strategy

If you have an approved EB-2 I-140, you may be able to file a new EB-3 I-140 to take advantage of a more current EB-3 India cutoff date. This is called an EB-3 downgrade.

:::compare
**Downgrade pros:** If EB-3 India is currently more current than EB-2 India, downgrade lets you file I-485 (and get EAD/AP) sooner.

**Downgrade cons:** Requires a new PERM process (costly, takes 12–18 months), a new I-140 filing, and your employer must be willing. The priority date from the original EB-2 PERM may be portable to the new EB-3 I-140 if the new PERM is for the same or similar job.
:::

[Read the full EB-2 to EB-3 downgrade guide →](/visa-bulletin/eb2-to-eb3-downgrade)

## EB-3 to EB-2 interfiling

If you originally filed I-485 under EB-3 and your employer now has an approved EB-2 I-140, you may be able to request USCIS to adjudicate your I-485 under EB-2 — a process called interfiling. This is useful when EB-2 India becomes more current than EB-3.

[Read the full EB-3 to EB-2 interfiling guide →](/visa-bulletin/eb3-to-eb2-interfiling)

## How to read EB-3 India in the visa bulletin

1. Open the current month's visa bulletin at travel.state.gov
2. Go to Table A (Final Action Dates) or Table B (Dates for Filing) — whichever applies
3. Look for "3rd" row (Third Preference / EB-3) in the Employment-Based chart
4. Find the India column
5. Compare the printed date to your priority date — if your date is earlier than the printed date, you are current. If the cell shows "U" (Unavailable), no priority date is current that month

### Frequently asked questions

#### Can I file PERM in both EB-2 and EB-3 simultaneously?
Some employers allow concurrent PERM filings in both categories for the same employee. This gives the employee two I-140 petitions with potentially different priority dates. Discuss with your employer's immigration attorney.

#### My employer is willing to file a new EB-3 PERM for downgrade. Will my old EB-2 priority date carry over?
Possibly. If the new EB-3 I-140 is for the same or similar position as the original EB-2, and the EB-2 I-140 was not withdrawn, the old priority date may be portable. This is not automatic — the employer's attorney must request priority date portability when filing the new I-140.

#### If EB-3 India is currently faster, should I immediately downgrade?
Not necessarily. The relative movement of EB-2 and EB-3 India changes every month. Downgrading requires a full PERM process and costs time and money. Work with your attorney to model the expected wait under each category before deciding.
`,
  },

  /* ── 6. Retrogression ────────────────────────────────────────────────────── */
  {
    slug: "retrogression",
    kind: "guide",
    title: "Visa Bulletin Retrogression Explained: What It Means for Indian Green Card Applicants",
    seoTitle: "Visa Bulletin Retrogression Explained | India EB-2 EB-3 Priority Dates",
    metaDescription:
      "What is retrogression in the visa bulletin? Why do India EB-2 and EB-3 priority dates move backward, and what happens to a pending I-485 when retrogression occurs.",
    navLabel: "Retrogression Explained",
    excerpt:
      "Retrogression happens when the visa bulletin moves backward — and for Indian applicants with pending I-485, it can feel alarming. Here is exactly what it means.",
    date: "2026-06-16",
    content: `
:::summary
Retrogression means the State Department moved the visa bulletin Final Action Date or Dates for Filing backward — to an earlier date than the previous month. Priority dates that were "current" last month may no longer be current. For applicants with a pending I-485, retrogression freezes adjudication but does NOT cause denial or require refiling.
:::

## What is retrogression?

Each month, the State Department sets new priority date cutoffs in the visa bulletin. In most months, dates move forward (advancing toward more recent dates). In some months, dates move backward — this is retrogression.

**Example:**
- June 2026 EB-1 India Final Action Date: Dec 15, 2022
- July 2026 EB-1 India Final Action Date: Oct 15, 2022 ← retrogression of ~2 months

A priority date of Dec 1, 2022 that was current in June would not be current in July.

:::warn
**Retrogression can go all the way to "Unavailable."** One recent example: in the July 2026 bulletin, EB-1 India retrogressed from Dec 15, 2022 to Oct 15, 2022, while **EB-2 India and EB-5 India Unreserved both became Unavailable ("U")** for the remainder of that fiscal year — no visa numbers at all, the most extreme form of backward movement. EB-3 India, by contrast, held a posted cutoff. For the current month's dates and which chart USCIS is using, check the live [EB-1 India](/visa-bulletin/eb1-india), [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status.
:::

## Why does retrogression happen?

The annual supply of employment-based green cards is ~140,000. The distribution depends on:
- Unused family-based visa numbers that roll over to employment-based categories
- The per-country 7% cap for India
- Demand from all countries for all EB categories

When demand is high, dates advance slowly or retrogress. When family-based visas are heavily used, fewer roll over to employment-based. The State Department adjusts each month to manage visa number usage throughout the fiscal year (October–September).

:::info
**Fiscal year end surge:** September is the last month of the US government fiscal year. The State Department often aggressively advances dates in July–August to use all remaining visa numbers, then retrogresses sharply in October when the new fiscal year begins.
:::

## What retrogression means for I-485 applicants

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

## Retrogression history for India

India EB-2 and EB-3 have experienced multiple retrogression events:
- **Late 2000s / early 2010s:** India EB-2 dates moved forward aggressively, then retrogressed sharply
- **2017–2019:** EB-3 India moved forward significantly, attracting EB-2 downgrades, then retrogressed
- **2023–2024:** Several months of retrogression following fiscal year end
- **Ongoing:** The India EB-2/EB-3 dates remain volatile — always check the current bulletin rather than assuming forward movement

:::warn
Never book plans (job changes, international travel, financial decisions) based on an assumption that your priority date will advance by a certain amount in a certain timeframe. Retrogression can happen in any month.
:::

## How to track retrogression

- **Monthly:** Check the new visa bulletin around the 8th–10th of each month at travel.state.gov
- **Sign up for email alerts** at the State Department website
- **Ask your employer's attorney** to notify you of significant changes

### Frequently asked questions

#### My priority date was current last month, but this month's bulletin shows retrogression. Will USCIS still approve my I-485 this month?
If USCIS already adjudicated your case in the prior month (when your date was current), approval may still happen. If not, USCIS will hold the case until your date is current again. Ask your attorney to check your specific case status.

#### Can retrogression affect my EAD or AP renewal?
No — EAD and AP renewals are tied to your pending I-485 status, not to whether your priority date is currently current. As long as I-485 is pending, you can renew EAD and AP.

#### What is the difference between retrogression and a visa number "cutback"?
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

**Table B current (Dates for Filing):** USCIS can accept your I-485 filing, but will hold it until Table A is also current. Still valuable — you get EAD and AP while waiting.
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

After filing, USCIS will mail receipt notices (I-797) for I-485, I-131, and I-765. Track them at egov.uscis.gov. Expect:
- Biometrics appointment letter: 4–8 weeks after filing
- EAD/AP approval: 3–6 months
- Interview notice: varies by field office — can be 1–3+ years

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
      "When does an EB-2 to EB-3 downgrade make sense for Indian applicants? How to file a new EB-3 PERM and I-140, port the priority date, and weigh the risks.",
    navLabel: "EB-2 to EB-3 Downgrade",
    excerpt:
      "An EB-2 to EB-3 downgrade can let Indian applicants file I-485 sooner if EB-3 India is more current — but it requires a new PERM and carries real costs and risks.",
    date: "2026-06-16",
    content: `
:::warn
**Timing caution:** a downgrade only helps for filing or approval if the applicant's priority date is earlier than the active chart cutoff for the category being moved into, and the case otherwise qualifies — all under the chart USCIS authorizes that month. In some months EB-2 India is Unavailable while EB-3 India posts a cutoff (or the reverse), which changes whether a downgrade does anything right now. Check the current [EB-2 India](/visa-bulletin/eb2-india) and [EB-3 India](/visa-bulletin/eb3-india) status, verify the official bulletin, and confirm with your attorney.
:::

:::summary
An EB-2 to EB-3 downgrade means filing a new PERM and I-140 in the EB-3 category to take advantage of a more favorable EB-3 India cutoff date. This allows applicants to file I-485 (and get EAD/AP) sooner if EB-3 India is currently ahead of EB-2 India. The original EB-2 I-140 is typically kept active — only the new EB-3 I-140 is used for I-485 filing.
:::

## When does a downgrade make sense?

A downgrade makes sense when:
1. EB-3 India Final Action Date OR Dates for Filing is more current than EB-2 India
2. Your employer is willing to undergo a new PERM process
3. Your current job description qualifies under EB-3 requirements (bachelor's + 2 years)
4. You want to file I-485 sooner to get EAD and Advance Parole

:::warn
**Check the current visa bulletin before assuming EB-3 is faster.** EB-2 and EB-3 India dates move independently every month. If EB-2 India is currently more current than EB-3 India, a downgrade would be counterproductive.
:::

## The downgrade process

### Step 1: New PERM filing (6–18 months)
Your employer must file a new PERM with the Department of Labor for the EB-3 category. This involves:
- A new prevailing wage determination (PWD) from DOL
- Full recruitment process (posting the job and documenting no qualified US workers applied)
- Filing ETA-9089 with DOL

:::info
The EB-3 PERM typically needs to be for the same or similar position as the EB-2 PERM to allow priority date porting. The attorney will advise on how to describe the position to maintain continuity.
:::

### Step 2: I-140 filing for EB-3
Once PERM is certified (valid 180 days), file I-140 in the EB-3 category:
- Premium processing available — 15 business days
- File promptly after PERM certification — the 180-day window is short
- Request priority date portability from the original EB-2 PERM date

### Step 3: Priority date portability
If the new EB-3 I-140 is for the same or similar position, USCIS should honor the original EB-2 PERM priority date. The older priority date is noted in the I-140 filing. This is not automatic — the attorney must request it explicitly.

### Step 4: File I-485 under EB-3
Once the EB-3 I-140 is approved with the original priority date, check if EB-3 India is current. If yes (under Table A or Table B), file I-485 under EB-3.

## Risks and costs

:::bad
**Risks to consider:**
- New PERM can take 12–18 months and costs $3,000–$8,000+ in employer legal fees
- If EB-3 India retrogresses back behind EB-2 India, you spent money for no gain
- Priority date portability is not guaranteed — USCIS may not honor it
- If your job duties changed significantly, the new PERM may not qualify for priority date porting
:::

## Keep the EB-2 I-140 active

:::good
**Critical:** Do NOT withdraw or abandon the original EB-2 I-140 when filing EB-3. Keep both active. If EB-3 India retrogresses, you can always use the EB-2 I-140 as a fallback when EB-2 India advances.
:::

### Frequently asked questions

#### Does my employer have to support the downgrade?
Yes — an EB-3 PERM requires employer participation. Your employer must be willing to pay for the new PERM and I-140 process. If your employer is unwilling, a downgrade is not possible.

#### Can I downgrade even if I am the same employer but in a different city/role?
Possibly, but the new PERM must accurately describe the actual job requirements and location. Any significant change in duties may require starting with a new priority date rather than porting the old one. Your attorney must evaluate this.

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
Some applicants file I-485 under EB-3 specifically to get EAD/AP quickly (if EB-3 India Dates for Filing is authorized), then plan to interfile under EB-2 when EB-2 India Final Action Date advances to their date. This two-step approach is used by experienced immigration attorneys.
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

export const visaBulletinChildPages: VisaBulletinPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const visaBulletinChildSlugs = visaBulletinChildPages.map((p) => p.slug);

export function getVisaBulletinChildPage(slug: string): VisaBulletinPage | undefined {
  return visaBulletinChildPages.find((p) => p.slug === slug);
}
