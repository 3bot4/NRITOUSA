import { computeReadingTime } from "@/lib/format";

/**
 * USCIS Forms topic cluster (hub-&-spoke).
 *
 *   /uscis/forms                     ← hub (static route)
 *     ├─ /uscis/forms/i-129
 *     ├─ /uscis/forms/i-140
 *     ├─ /uscis/forms/i-485
 *     ├─ /uscis/forms/i-765
 *     ├─ /uscis/forms/i-131
 *     ├─ /uscis/forms/i-130
 *     ├─ /uscis/forms/i-539
 *     ├─ /uscis/forms/i-907-premium-processing
 *     ├─ /uscis/forms/ar-11-change-address
 *     └─ /uscis/forms/n-400
 *
 * Child pages are served by app/uscis/forms/[slug]/page.tsx.
 */

export type FormsPageKind = "form" | "guide";

export interface FormsPageData {
  slug: string;
  kind: FormsPageKind;
  formNumber: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface FormsPage extends FormsPageData {
  readingTime: number;
}

export const USCIS_FORMS_HUB = "/uscis/forms";
export const USCIS_FORMS_BASE = "/uscis/forms";

const rawPages: FormsPageData[] = [

  /* ── 1. I-129 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-129",
    kind: "form",
    formNumber: "I-129",
    title: "Form I-129 Explained for Indians: H1B, L1, and Work Visa Petitions",
    seoTitle: "Form I-129 Explained | H1B, L1, Work Visa Petition for Indians",
    metaDescription:
      "What is Form I-129? Your employer files I-129 to petition for your H1B, L1, O1, or TN work visa. Plain-English guide for Indian workers — what it covers, how long it takes, and what to check.",
    navLabel: "I-129 Work Visa Petition",
    excerpt:
      "Form I-129 is the employer petition for nonimmigrant work visas including H1B, L1, O1, TN, and H4 EAD. Your employer files it — not you.",
    date: "2026-06-16",
    content: `:::summary
**Form I-129** is the Petition for a Nonimmigrant Worker. Your **employer files it** — not you. It is used for H-1B, L-1, O-1, TN, H-4 EAD (as a co-filed I-539/I-765), and several other nonimmigrant work categories. You cannot sponsor yourself with an I-129.
:::

## What I-129 is used for

:::info
title: Common I-129 visa categories for Indians
- **H-1B** — Specialty occupation (most common for Indian software engineers, analysts, scientists)
- **L-1A** — Intracompany transferee (managerial/executive)
- **L-1B** — Intracompany transferee (specialized knowledge)
- **O-1** — Extraordinary ability in sciences, arts, business, or athletics
- **TN** — USMCA professionals (Canadians and Mexicans only — not available to Indians)
- **H-2B** — Temporary non-agricultural workers
:::

## Who files it

:::compare
left: Employer (Petitioner)
right: Employee (Beneficiary)
left_items:
- Signs and submits Form I-129
- Pays the filing fee (cannot legally pass to employee in most H1B cases)
- Provides Labor Condition Application (LCA) for H-1B
- Provides supporting evidence: job description, qualifications, wage documentation
right_items:
- Named on the petition as beneficiary
- Does NOT sign I-129 itself
- Provides credentials, degree copies, résumé, passport to employer/attorney
- Receives I-797 Notice of Action when petition is processed
:::

## Key H-1B I-129 facts for Indian workers

:::info
title: H-1B I-129 specifics
- Cap-subject H-1B: filed only after lottery selection, between April 1–June 30 for an October 1 start
- Cap-exempt: universities, nonprofits, government research — can be filed any time
- Premium processing (I-907): $2,805 fee for 15 business day USCIS action
- Validity: up to 3 years initially, extendable in 3-year increments
- **If I-140 is approved and priority date is not current**: H-1B extensions beyond 6 years are available under INA 214(n) / AC21 one-year increments
:::

## What happens after I-129 is filed

:::steps
1. USCIS issues I-797C Receipt Notice (confirms receipt, has receipt number)
2. If premium: USCIS acts within 15 business days — approval, denial, or RFE
3. If regular: case enters adjudication queue — weeks to months depending on service center
4. If approved: I-797A (H-1B) or I-797B is mailed to petitioner, I-94 at bottom of I-797A
5. Employee uses I-797 approval + passport + visa stamp (if abroad) to work or enter US
:::

## Common mistakes

:::warn
title: Avoid these I-129 errors
- **Employee NOT aware**: Your employer may not share the petition details. Ask your attorney or HR for a copy of your approved I-797.
- **Wrong I-94 end date**: Your authorized stay is the I-94 on the I-797A — not your visa stamp expiration date.
- **Travel during pending petition**: Consult your attorney before international travel while I-129 is pending.
- **Cap-gap period**: If OPT expires before Oct 1 and your H-1B was selected, you may be in a cap-gap period — rules are specific, verify with your attorney.
:::

## FAQ

:::faq
Q: Can I file I-129 myself?
A: No. I-129 must be filed by the petitioning employer. You cannot self-petition for H-1B.

Q: How do I know if my I-129 was approved?
A: Your employer receives the I-797A approval notice. Ask your employer or attorney for a copy — you need it for travel, visa stamping, and future H-1B extensions.

Q: What is the I-129 filing fee?
A: Base fee is $730, plus a $600 Asylum Program Fee for employers with 26+ employees, and optional $2,805 premium processing. Some fees vary by employer size.

Q: My I-129 got an RFE — is that a denial?
A: No. An RFE (Request for Evidence) means USCIS needs more documentation. Your employer's attorney must respond within the deadline (usually 87 days). Many RFE cases are ultimately approved.
:::

:::cta
href: /tools/uscis-notice-decoder
label: Decode your I-797 notice →
Got an I-797 and not sure what it means? Use the USCIS Notice Decoder.
:::`,
  },

  /* ── 2. I-140 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-140",
    kind: "form",
    formNumber: "I-140",
    title: "Form I-140 Explained for Indians: Employment-Based Green Card Petition",
    seoTitle: "Form I-140 Explained | EB Green Card Petition for Indians",
    metaDescription:
      "What is Form I-140? Your employer files an I-140 immigrant petition to start your EB green card process. Understand priority dates, EB-2 vs EB-3, I-140 approval, and what happens next.",
    navLabel: "I-140 Green Card Petition",
    excerpt:
      "Form I-140 is the employer immigrant petition that starts your EB green card clock. Approval gives you a priority date — the most important date in the Indian green card journey.",
    date: "2026-06-16",
    content: `:::summary
**Form I-140** (Immigrant Petition for Alien Workers) is filed by your employer to classify you for an employment-based (EB) immigrant visa. The approval date becomes your **priority date** — the number that determines your place in the India EB queue. For most Indians, the wait after I-140 approval is measured in **decades**, not months.
:::

## What I-140 does

:::info
title: What I-140 establishes
- Classifies the job and the employee's qualifications for EB-1, EB-2, or EB-3
- Sets the **priority date** (usually the PERM labor certification filing date, or I-140 filing date for EB-1)
- Allows H-1B extensions beyond the 6-year cap once approved (even before priority date is current)
- Enables AC21 job portability after 180 days of I-485 pending — without losing the priority date
- Stays valid even if you change employers (after I-140 is approved and I-485 has been pending 180+ days)
:::

## EB categories most common for Indians

:::compare
left: EB-2 (India — very long wait)
right: EB-3 (India — also long wait)
left_items:
- Advanced degree (Master's or higher, or Bachelor's + 5 years exp)
- National Interest Waiver (EB-2 NIW — self-petition, no PERM needed)
- India priority dates: typically 2010–2013 range (check current bulletin)
- Downgrade to EB-3 sometimes used tactically when EB-3 is ahead
right_items:
- Bachelor's degree or skilled worker
- India priority dates: sometimes ahead of EB-2 India due to "spillover"
- EB-3 upgrade from EB-2 is not possible — but EB-2 can "port" to EB-3
- Check both Final Action Date and Dates for Filing each month
:::

## What happens after I-140 is approved

:::steps
1. USCIS approves I-140 and issues I-797B approval notice
2. Priority date is set (shown on the notice — verify it matches your PERM date)
3. State Department visa bulletin tracks when India EB priority dates become current
4. When your priority date is current AND a visa number is available: file I-485 (if in US) or consular process abroad
5. I-485 adjudication → green card
:::

## Common mistakes

:::warn
title: I-140 mistakes to avoid
- **Not verifying the priority date**: The date on your I-140 approval must match your PERM filing date. An error is serious — correct it immediately.
- **Letting I-140 lapse**: If your employer withdraws I-140 before it has been approved for 180 days and your I-485 has been pending less than 180 days, you may lose portability.
- **Thinking I-140 = green card**: I-140 approval is step 1. For India EB-2/EB-3, you may wait 10–50+ years before visa numbers are available.
- **Not filing for H-1B extension**: Once I-140 is approved, you qualify for H-1B extensions in 1-year increments beyond the 6-year cap.
:::

## FAQ

:::faq
Q: Can I file I-140 myself?
A: Only for EB-1A (extraordinary ability) and EB-2 NIW (National Interest Waiver). All other EB categories require employer sponsorship.

Q: What is my priority date?
A: Usually the date your employer filed the PERM Labor Certification (Form 9089). For EB-1 without PERM, it is the I-140 filing date. It is printed on your I-140 approval notice.

Q: I changed jobs — is my I-140 still valid?
A: If your I-140 has been approved for 180+ days AND your I-485 has been pending for 180+ days, you can port to a same-or-similar job (AC21). The I-140 stays valid for priority date purposes even after withdrawal in most cases.

Q: Can I file I-485 before I-140 is approved?
A: Only if a visa number is available under "Dates for Filing" in the visa bulletin — even with I-140 still pending. This is called concurrent filing. Check the current bulletin each month.
:::

:::cta
href: /tools/priority-date-checker
label: Check your priority date →
Use the Priority Date Checker to see where your EB priority date stands against the current visa bulletin.
:::`,
  },

  /* ── 3. I-485 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-485",
    kind: "form",
    formNumber: "I-485",
    title: "Form I-485 Explained for Indians: Adjustment of Status to Green Card",
    seoTitle: "Form I-485 Explained | Adjustment of Status Green Card for Indians",
    metaDescription:
      "What is Form I-485? Adjustment of status lets you apply for a green card without leaving the US. Guide for Indian H1B workers — when to file, what to expect, travel rules, and EAD combo card.",
    navLabel: "I-485 Adjustment of Status",
    excerpt:
      "Form I-485 is the application to adjust your status to permanent resident (green card) without leaving the US. For Indians, filing I-485 is often the most significant immigration step.",
    date: "2026-06-16",
    content: `:::summary
**Form I-485** (Application to Register Permanent Residence or Adjust Status) lets you become a US permanent resident (green card holder) without leaving the United States. You can only file I-485 when a visa number is available for your category and country — for most India EB applicants, this means waiting many years after I-140 approval.
:::

## Who can file I-485

:::info
title: I-485 eligibility basics
- You are physically present in the US with a valid nonimmigrant status (or within a protected period)
- An immigrant visa number is available for your category and country (visa bulletin)
- You have an approved or concurrently pending I-140 (for EB categories) or I-130 (for family categories)
- You have not violated status or committed acts that make you inadmissible
:::

## What you file with I-485

:::info
title: Forms typically filed with I-485
- **I-485** — Main adjustment of status application
- **I-765** — EAD (work permit) — you can work while I-485 is pending
- **I-131** — Advance Parole — travel document (mandatory if you plan to travel internationally while I-485 is pending)
- **I-864** — Affidavit of Support (family-based cases)
- Medical exam (Form I-693) from a USCIS civil surgeon
:::

## What happens after filing I-485

:::steps
1. USCIS sends I-797C Receipt Notice (your I-485 is now "pending")
2. Biometrics appointment notice — attend to complete fingerprinting
3. EAD and Advance Parole approved (usually before I-485 itself)
4. Interview notice (most I-485 cases require interview at local USCIS field office)
5. Approval → green card card produced and mailed
:::

## Critical travel rule

:::warn
title: NEVER travel internationally while I-485 is pending without Advance Parole
Leaving the US while I-485 is pending — without an approved Advance Parole (Form I-131) — is generally treated as **abandonment of your I-485**. Your case will be considered withdrawn. The only exception is Canadian and Mexican border crossings under specific conditions. Always consult your attorney before any international travel once I-485 is filed.
:::

## Processing time

I-485 for employment-based cases (EB-2/EB-3 India) has historically taken 12–36+ months after filing. Family-based cases vary. Use the USCIS online processing times tool for current estimates by field office or service center. USCIS publishes I-485 inventory data that gives a rough sense of the queue size.

## FAQ

:::faq
Q: Can I work while my I-485 is pending?
A: Yes — once your I-765 (EAD) is approved. Your EAD card is your work authorization during the pending period. You are not required to remain on H-1B status, though many people do for backup protection.

Q: What happens to my H-1B if I file I-485?
A: Your H-1B status remains valid alongside the pending I-485. Many people maintain H-1B because it allows international travel without Advance Parole, and provides a fallback if I-485 is denied.

Q: Can my employer withdraw my I-140 after I file I-485?
A: If your I-140 has been approved for 180+ days AND your I-485 has been pending for 180+ days, the I-140 withdrawal does not affect your I-485 or the priority date for portability purposes.

Q: I just got my priority date current — how quickly should I file I-485?
A: File as soon as possible. Priority dates can retrogress (move backward) in the next month's bulletin. Have your documents ready in advance so you can file within days of the date becoming current.
:::

:::cta
href: /tools/green-card-stage-finder
label: Find your green card stage →
Not sure where you are in the green card process? Use the Green Card Stage Finder.
:::`,
  },

  /* ── 4. I-765 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-765",
    kind: "form",
    formNumber: "I-765",
    title: "Form I-765 Explained for Indians: EAD Work Permit Application",
    seoTitle: "Form I-765 Explained | EAD Work Permit for Indians (H4, I-485, OPT)",
    metaDescription:
      "What is Form I-765? The EAD (Employment Authorization Document) application for H-4 EAD, I-485 pending, OPT, and other situations. Guide for Indian applicants — filing, processing, and renewal.",
    navLabel: "I-765 EAD Work Permit",
    excerpt:
      "Form I-765 is the EAD (work permit) application. H-4 spouses, I-485 applicants, F-1 OPT students, and DACA recipients all use it. Without an approved EAD card in hand, you cannot legally use it for work.",
    date: "2026-06-16",
    content: `:::summary
**Form I-765** (Application for Employment Authorization) is how you apply for an **EAD (Employment Authorization Document)** — the physical card that lets you work for any US employer. Different applicants file I-765 for different reasons, and each has different eligibility rules and fees.
:::

## Who files I-765

:::info
title: Common I-765 situations for Indians
- **H-4 EAD**: H-4 spouse of H-1B holder whose I-140 is approved — you need both approved and the specific H-4 EAD eligibility
- **I-485 pending**: File I-765 concurrently with I-485 to work during the green card pending period
- **F-1 OPT**: F-1 students use I-765 for Optional Practical Training (filed through school's DSO, not directly)
- **F-1 STEM OPT extension**: Additional 24-month extension for STEM fields
- **Asylum/Refugee**: Special EAD categories (C08, C03)
- **DACA**: Category C33
:::

## What you get

An EAD is a physical card with your name, photo, and validity dates. It has a **category code** that determines which basis you're authorized to work under. The card must be physically in your possession before you start working — an approval notice alone is not work authorization.

:::warn
title: Do not start work without the physical EAD card
The I-765 approval notice (I-797) is NOT work authorization. Wait until you physically receive the EAD card. The card is mailed after the "Card Is Being Produced" status appears.
:::

## H-4 EAD specifics

:::info
title: H-4 EAD eligibility requirements (both must apply)
- You are in valid H-4 status (as dependent of H-1B principal)
- The H-1B principal has an **approved I-140** (employment-based immigrant petition)
H-4 EAD eligibility does NOT require the priority date to be current. Just the approved I-140.
:::

## Renewal timing

:::warn
title: File I-765 renewal early — there is NO automatic extension for H-4 EAD
H-4 EAD has no automatic extension. File your renewal **6 months before expiration**. If your EAD expires before the renewal is approved, you may need to stop working. Some EAD categories have a 180-day automatic extension — H-4 EAD does NOT qualify for this rule.
:::

## FAQ

:::faq
Q: Can I use my EAD to work anywhere?
A: Yes. An EAD (I-765 approval + physical card) lets you work for any employer, including self-employment, freelancing, and starting a business — unlike H-1B which is employer-specific.

Q: How long does I-765 processing take?
A: USCIS target is 3–5 months for most I-765 categories. Check current processing times at uscis.gov. Premium processing (I-907) is available for some I-765 categories.

Q: My H-4 EAD is expiring — can I still work during the renewal gap?
A: Only if you qualify for a 180-day automatic extension, which H-4 EAD does NOT. For H-4 EAD, if your card expires before renewal is approved, you must stop working until the new card arrives.

Q: I filed I-765 with my I-485 — do I get a separate approval?
A: Yes. USCIS sends a separate EAD card (often with Advance Parole as a combo card) before your I-485 is adjudicated. Track it separately.
:::

:::cta
href: /tools/h4-ead-navigator
label: H-4 EAD Navigator →
Explore what H-4 EAD holders can do, renewal gap risks, and business options.
:::`,
  },

  /* ── 5. I-131 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-131",
    kind: "form",
    formNumber: "I-131",
    title: "Form I-131 Explained for Indians: Advance Parole and Travel Documents",
    seoTitle: "Form I-131 Explained | Advance Parole Travel Document for Indians",
    metaDescription:
      "What is Form I-131? Advance Parole lets you travel internationally while I-485 is pending. Plain-English guide for Indian applicants — when you need it, combo card, and risks.",
    navLabel: "I-131 Advance Parole",
    excerpt:
      "Form I-131 is the travel document application. If your I-485 is pending, you MUST have an approved Advance Parole before leaving the US — or your green card application is considered abandoned.",
    date: "2026-06-16",
    content: `:::summary
**Form I-131** (Application for Travel Document) covers several travel-related documents, but the most critical for Indian applicants is **Advance Parole (AP)** — the travel document you need to re-enter the US while your I-485 (green card application) is pending. Traveling without it is a serious mistake that can result in I-485 abandonment.
:::

## What I-131 covers

:::info
title: I-131 document types
- **Advance Parole (I-512L)** — Re-entry document for I-485 applicants (most common for Indians)
- **Refugee Travel Document** — For refugees and asylees
- **Re-entry Permit** — For permanent residents who will be outside the US for 1+ year
- **Parole in Place** — Humanitarian parole for certain cases
:::

## The I-485 + Advance Parole rule

:::warn
title: Critical rule: Do not leave the US while I-485 is pending without Advance Parole
If your I-485 is pending and you leave the US without an approved Advance Parole document, USCIS considers your I-485 **abandoned**. You would need to restart the entire green card process. The I-485 abandonment rule has exceptions for H-1B and L-1 holders traveling on valid visa stamps, but even these exceptions are narrowly interpreted and carry risk. Consult your attorney before any international travel once I-485 is filed.
:::

## Combo card: EAD + AP

When you file I-765 (EAD) and I-131 (Advance Parole) together with your I-485, USCIS often issues a **combo EAD-AP card** — a single card that serves as both work authorization and advance parole. You carry this card + your passport when traveling.

:::info
title: Traveling with combo EAD-AP card
- Always carry the physical combo card + your passport when traveling internationally
- Present it to CBP at the port of re-entry — you are being "paroled in" rather than admitted
- Your H-1B status pauses during the I-485 pending period once you use the AP to re-enter — understand the implications with your attorney
:::

## FAQ

:::faq
Q: My I-131 was approved but the physical card hasn't arrived yet — can I travel?
A: Wait for the physical card. The approval notice alone is insufficient. If your travel is urgent, contact your attorney immediately.

Q: I have an H-1B visa stamp and a pending I-485 — do I need Advance Parole?
A: You can technically re-enter on a valid H-1B stamp without advance parole — but this is complex and carries risk. Once you re-enter on H-1B during I-485 pendency, your "immigrant intent" may be questioned. Always consult your attorney before traveling while I-485 is pending, even if you have a valid H-1B visa.

Q: How long does I-131 processing take?
A: Currently 5–12+ months. File as early as possible. Do NOT book international travel counting on AP arriving by a specific date unless you have it in hand.

Q: My Advance Parole expired during my trip — can I still return?
A: This is a serious situation. Contact your immigration attorney immediately. CBP may still parole you in depending on circumstances, but there is no guarantee. Keep AP expiration dates well ahead of planned return dates.
:::`,
  },

  /* ── 6. I-130 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-130",
    kind: "form",
    formNumber: "I-130",
    title: "Form I-130 Explained for Indians: Sponsoring Family Members for a Green Card",
    seoTitle: "Form I-130 Explained | Family Green Card Petition for Indians",
    metaDescription:
      "What is Form I-130? US citizens and permanent residents use I-130 to sponsor family members for immigration. Guide for Indian applicants — categories, priority dates, and what comes next.",
    navLabel: "I-130 Family Petition",
    excerpt:
      "Form I-130 is the family green card petition. US citizens or permanent residents file it to sponsor a spouse, parent, child, or sibling. Approval is just step one — the wait for a visa number can be long.",
    date: "2026-06-16",
    content: `:::summary
**Form I-130** (Petition for Alien Relative) is filed by a US citizen or permanent resident (the "petitioner") to establish a qualifying family relationship with a foreign national relative (the "beneficiary"). Approval creates a queue position in the family-based preference system — it does NOT itself grant immigration status.
:::

## Who can file I-130

:::compare
left: US Citizen Petitioner
right: Permanent Resident Petitioner
left_items:
- Can petition for immediate relatives (no wait): spouse, unmarried children under 21, parents
- Can also petition for: adult unmarried children (F1), married children (F3), siblings (F4)
- Sibling category (F4) can have extremely long waits for Indian petitioners
right_items:
- Can petition for: spouse and unmarried children under 21 (F2A), unmarried sons/daughters 21+ (F2B)
- Cannot petition for parents or siblings
- F2A priority dates move relatively faster than F2B
:::

## What happens after I-130 is approved

:::steps
1. USCIS approves I-130 and sets priority date (date I-130 was filed)
2. Case transferred to National Visa Center (NVC) for visa number queue
3. When priority date becomes current: beneficiary files immigrant visa application (DS-260) or I-485
4. Interview at US Embassy (abroad) or USCIS field office (if in US)
5. Visa/green card issued
:::

## Indian family backlog

:::warn
title: Indian family preference wait times can be very long
India-born applicants face significant backlogs in family preference categories. The F4 (sibling) category for India has historically been 20+ years backlogged. Check the State Department visa bulletin for current India family preference priority dates before making immigration plans.
:::

## FAQ

:::faq
Q: I am a permanent resident — can I petition for my parents?
A: No. Only US citizens can petition for parents. Permanent residents can only petition for spouses and unmarried children.

Q: I filed I-130 for my spouse — how long until they can come?
A: If you are a US citizen, spouse is an "immediate relative" with no numerical cap — processing time is typically 12–24 months total. If you are a permanent resident, your spouse falls under F2A, which has a queue that can be 2–5+ years depending on visa bulletin.

Q: My I-130 was approved years ago — is it still valid?
A: Generally yes. I-130 approvals do not expire. The wait is in the queue for a visa number, not in the petition itself. Keep your contact information updated with NVC.

Q: Can the beneficiary be in the US already?
A: Yes — if they have a valid status or meet adjustment of status eligibility, they may file I-485 in the US when their priority date is current.
:::`,
  },

  /* ── 7. I-539 ─────────────────────────────────────────────────────────── */
  {
    slug: "i-539",
    kind: "form",
    formNumber: "I-539",
    title: "Form I-539 Explained for Indians: Change or Extend Nonimmigrant Status",
    seoTitle: "Form I-539 Explained | Extend or Change Visa Status for Indians (H4, F1, B2)",
    metaDescription:
      "What is Form I-539? Indian dependents and visitors use I-539 to extend or change nonimmigrant status — H-4, F-1, B-2, and others. Guide to filing, processing time, and status while pending.",
    navLabel: "I-539 Change/Extend Status",
    excerpt:
      "Form I-539 lets you extend your stay or change to a different nonimmigrant visa category without leaving the US. H-4 dependents often file it alongside the principal's I-129.",
    date: "2026-06-16",
    content: `:::summary
**Form I-539** (Application to Extend/Change Nonimmigrant Status) is used to extend your current nonimmigrant stay or change to a different nonimmigrant category — without leaving the US. It cannot be used by H-1B, L-1, or O-1 principals (those are filed by employers on I-129).
:::

## Who uses I-539

:::info
title: Common I-539 situations for Indians
- **H-4 dependent** extending status alongside H-1B principal's I-129 renewal
- **B-1/B-2 visitor** extending a tourist or business visit
- **F-1 or M-1 student** changing to another nonimmigrant category
- **J-1 exchange visitor** changing status
- Multiple family members can be included on one I-539 filing (as co-applicants)
:::

## H-4 and I-539

:::info
title: H-4 status and I-539
If you are an H-4 dependent, your status is tied to the H-1B principal. When the H-1B principal's employer files I-129 for an H-1B extension, you should file I-539 to extend your H-4 status (or file I-539 + I-765 for H-4 EAD renewal). These are typically filed at the same time but processed separately.
:::

## What you cannot do with I-539

:::warn
title: I-539 limitations
- Cannot change to H-1B, L-1, O-1, or other employment-based principal status (those require employer I-129)
- Cannot be used if you entered the US under the Visa Waiver Program (ESTA)
- Cannot be used if you have violated your status (overstayed, unauthorized work)
- You must file BEFORE your current authorized stay expires
:::

## Processing time

I-539 processing is notoriously slow — often 12–24+ months. During the pending period, you are generally protected from deportation if filed timely (status maintained under 8 CFR 214.1(c)), but you cannot travel internationally or start employment (unless you have separate authorization).

## FAQ

:::faq
Q: Can I work while my I-539 is pending?
A: No — unless you file and receive approval for an I-765 (EAD) separately. An I-539 alone does not authorize work.

Q: My I-539 is pending and I need to travel — what happens?
A: Departing the US while I-539 is pending typically abandons the application. Consult your attorney before any international travel while I-539 is pending.

Q: My H-4 I-539 was approved but I need to renew my H-4 EAD — are they the same?
A: No. H-4 EAD requires a separate I-765 application. An approved I-539 (H-4 status extension) does not extend your I-765 (work permit).

Q: Can I be a co-applicant on my spouse's I-539?
A: Yes, if you are seeking the same extension or change of status and you entered on the same status. Co-applicants file on a single I-539 with a separate co-applicant form (I-539A).
:::`,
  },

  /* ── 8. I-907 Premium Processing ─────────────────────────────────────── */
  {
    slug: "i-907-premium-processing",
    kind: "form",
    formNumber: "I-907",
    title: "Form I-907 Explained for Indians: Premium Processing for USCIS Petitions",
    seoTitle: "Form I-907 Premium Processing Explained | H1B, I-140, I-765 for Indians",
    metaDescription:
      "What is Form I-907 premium processing? Pay $2,805 for a guaranteed 15 business day USCIS action on eligible petitions including H-1B I-129, I-140, and I-765. Guide for Indians.",
    navLabel: "I-907 Premium Processing",
    excerpt:
      "Form I-907 lets you pay for expedited 15 business day USCIS action on eligible petitions. It guarantees speed — not approval. An RFE or denial within 15 days still satisfies USCIS's commitment.",
    date: "2026-06-16",
    content: `:::summary
**Form I-907** (Request for Premium Processing Service) lets you pay an additional fee for USCIS to take action on an eligible petition within **15 business days** (approximately 3 weeks). Premium processing guarantees a decision, RFE, or notice of intent to deny — it does NOT guarantee approval. It is a speed option, not an approval boost.
:::

## Eligible forms for premium processing

:::info
title: Forms that accept I-907 (as of 2026)
- **I-129** — H-1B, L-1, O-1, TN, E petitions
- **I-140** — EB-1A, EB-1B, EB-1C, EB-2, EB-3 (many categories)
- **I-765** — OPT, STEM OPT, certain EAD categories
- **I-539** — certain categories (verify current eligibility)
Check uscis.gov for current eligibility — USCIS periodically expands or limits which petitions qualify.
:::

## Current fee

:::info
title: I-907 premium processing fee (2026)
- **$2,805** for most eligible petitions
- Fee is in addition to the underlying petition fee (I-129, I-140, etc.)
- Fee must be paid by separate check/money order or separate online payment
- If USCIS fails to act within 15 business days, the fee must be refunded
:::

## What "15 business days" means

:::warn
title: Premium processing clock details
- 15 **business days** (not calendar days) from when USCIS receives the I-907
- Clock restarts if USCIS issues an RFE — the employer must respond and USCIS has another 15 days
- Clock may be suspended for fraud investigations or during biometrics appointments
- USCIS counts business days from the service center intake date, not the postmark date
:::

## When premium processing makes sense

:::compare
left: Good reasons for premium processing
right: When premium processing won't help
left_items:
- H-1B extension with H-1B status expiring soon and no cap-gap protection
- Job offer contingent on approved petition timing
- Travel plans where you need an updated I-797 approval before a visa stamp appointment
- I-140 approval needed before 6-year H-1B limit for extensions
right_items:
- I-485 (adjustment of status) — not eligible for premium processing
- I-131 (Advance Parole) — not eligible
- Already outside the normal processing time without urgent need
- Budget constraints — $2,805 is significant; regular processing may still be fast enough
:::

## FAQ

:::faq
Q: Who pays for premium processing — me or my employer?
A: Typically the employer. USCIS rules generally prohibit H-1B employers from passing the premium processing fee to the employee when it benefits the employer. When you request premium processing for personal reasons (like a quick I-140 for the 6-year H-1B extension), the employer may ask you to pay. Confirm the arrangement with your HR or attorney.

Q: I paid for premium processing and still got an RFE — did I waste money?
A: No — premium processing still worked as intended. USCIS took action within 15 business days. Receiving an RFE rather than an approval means USCIS needs more information. Your attorney responds to the RFE and USCIS has another 15 business days to act on the response.

Q: Can I add premium processing after I've already filed the petition?
A: Yes. You can file I-907 after the initial petition is filed, as long as the case is still pending at the service center. Some service centers require filing I-907 separately; some allow it with an amended petition. Your attorney will know the current procedure.
:::`,
  },

  /* ── 9. AR-11 ─────────────────────────────────────────────────────────── */
  {
    slug: "ar-11-change-address",
    kind: "form",
    formNumber: "AR-11",
    title: "AR-11 Change of Address for Indians: USCIS Notification Requirement",
    seoTitle: "AR-11 Change of Address | USCIS Address Update for Indians (H1B, Green Card)",
    metaDescription:
      "What is AR-11? Every non-citizen in the US must notify USCIS within 10 days of moving using Form AR-11. Guide for Indian H1B holders, I-485 applicants, and permanent residents.",
    navLabel: "AR-11 Change of Address",
    excerpt:
      "AR-11 is the form to notify USCIS when you change your address. US law requires all non-citizens to report address changes within 10 days of moving. It takes 5 minutes online.",
    date: "2026-06-16",
    content: `:::summary
**AR-11** (Alien's Change of Address Card) is the US law requirement for every non-citizen (with limited exceptions) to notify USCIS within **10 days** of moving to a new address. You can file it online in minutes at my.uscis.gov — no fee, no attorney needed.
:::

## Who must file AR-11

:::info
title: AR-11 applies to all non-citizens with limited exceptions
- H-1B, H-4, L-1, O-1, F-1 visa holders
- I-485 applicants (adjustment of status pending)
- Permanent residents (green card holders)
- Asylees and refugees
**Exceptions**: US citizens, diplomats, certain other categories
The requirement applies even if you move temporarily (e.g., a 3-month project in another city).
:::

## Why it matters

:::warn
title: Don't miss this — USCIS notices go to your address on file
- USCIS mails all notices (RFEs, biometrics appointments, interview notices, approvals) to the address on file
- A missed notice because you moved can result in a missed RFE deadline, missed biometrics, or even a denial
- For I-485 applicants: a missed notice is especially dangerous — you may not know about a required interview
- Penalty for not filing AR-11: technically a misdemeanor under US law (rarely enforced, but the real risk is missing critical notices)
:::

## How to file

:::steps
1. Go to my.uscis.gov (official USCIS site)
2. Log in or create an account
3. Select "Change of Address" from your dashboard
4. Enter your new address and confirm which cases to update
5. USCIS confirms via email — keep the confirmation
:::

:::info
title: Also update with other agencies
- **USPS**: File a mail forwarding request so notices sent to old address reach you during the transition
- **Employer/attorney**: Notify your immigration attorney and employer HR — they send correspondence to your address too
- **State DMV**: Update your driver's license address as required by your state
- **SSA**: Update Social Security Administration records if needed
:::

## Common mistakes

:::warn
title: AR-11 mistakes
- **Not doing it**: Many immigrants don't know about the requirement — now you do
- **Not updating pending case records**: Filing AR-11 updates your USCIS central file but service centers handling pending petitions may not automatically update. Ask your attorney to also notify the specific service center.
- **Waiting too long**: File within 10 days of the move date, not whenever you get around to it
:::

## FAQ

:::faq
Q: I moved last year and forgot to file AR-11 — what do I do?
A: File it now. USCIS does not prosecute people for late filing — but file immediately to ensure future notices reach you. There is no penalty process for late AR-11 as a practical matter.

Q: Does AR-11 automatically update my address on all pending petitions?
A: Not always. AR-11 updates your central USCIS alien file. For pending petitions at specific service centers, your attorney should also send a written address change notification directly to the service center.

Q: I am a permanent resident — do I still need to file AR-11?
A: Yes. Permanent residents must also file AR-11 when they move.

Q: I filed AR-11 and confirmed it — why did my notice still go to the old address?
A: Service center processing times for address updates vary. If you have a critical pending petition, your attorney should send a written address change to the specific service center in addition to the online AR-11 filing.
:::

:::cta
href: /uscis/change-address
label: Full address change guide →
See the complete guide including what else to update when you move.
:::`,
  },

  /* ── 10. N-400 ─────────────────────────────────────────────────────────── */
  {
    slug: "n-400",
    kind: "form",
    formNumber: "N-400",
    title: "Form N-400 Explained for Indians: US Citizenship Application",
    seoTitle: "Form N-400 Explained | US Citizenship Application for Indians",
    metaDescription:
      "What is Form N-400? The naturalization application for US citizenship. Guide for Indian green card holders — eligibility, physical presence, continuous residence, civics test, and timeline.",
    navLabel: "N-400 Citizenship",
    excerpt:
      "Form N-400 is the naturalization application to become a US citizen. Most green card holders can apply after 5 years (3 years if married to a US citizen). The process includes background check, interview, and civics test.",
    date: "2026-06-16",
    content: `:::summary
**Form N-400** (Application for Naturalization) is how a permanent resident (green card holder) applies to become a US citizen. Eligibility generally requires **5 years as a permanent resident** (3 years if married to and living with a US citizen), meeting physical presence and continuous residence requirements, passing an English and civics test, and demonstrating good moral character.
:::

## Basic eligibility

:::info
title: N-400 standard eligibility (5-year path)
- Permanent resident for at least 5 years
- Physically present in the US for at least 30 months of the last 5 years
- Lived continuously in the US (no single trip abroad of 6+ months)
- Currently residing in the district where you file for at least 3 months
- Ability to read, write, and speak English
- Knowledge of US history and civics (tested at interview)
- Good moral character during the 5-year period
:::

## The N-400 process

:::steps
1. Confirm eligibility (5-year or 3-year path; physical presence calculation)
2. Complete Form N-400 and gather supporting documents
3. File N-400 with USCIS (can file 90 days before the 5-year anniversary)
4. Biometrics appointment
5. Interview at local USCIS field office — English test + civics test
6. Oath of Allegiance ceremony → you are a US citizen
:::

## The civics test

:::info
title: 2025 civics test rules
- The 2008 civics test (100 questions, pass 6 of 10 asked) is currently in effect as of 2026
- The 2020 revised test (128 questions) was rescinded — applicants should study the 2008 version
- Study materials are available free at uscis.gov
- If you fail the test, you get one more attempt at a second interview
- Applicants 65+ who have been a permanent resident for 20+ years have a simplified 20-question list
:::

## When to file (90-day rule)

:::info
title: You can file up to 90 days early
USCIS allows filing N-400 up to **90 days before** the 5-year permanent residence anniversary (or 3-year for spouse of US citizen). Use the USCIS Early Filing Calculator at uscis.gov to find your earliest filing date.
:::

## FAQ

:::faq
Q: Will I lose my Indian citizenship when I naturalize?
A: India does not allow dual citizenship. When you take the US Oath of Allegiance, you renounce other citizenships — which means you lose Indian citizenship. You can then apply for an OCI (Overseas Citizen of India) card, which gives you lifelong visa-free travel to India and certain other rights, though OCI is not citizenship.

Q: I have a criminal record — can I apply for N-400?
A: Some offenses bar naturalization or require careful analysis. Always consult an immigration attorney before filing N-400 if you have any criminal history, including arrests that did not result in convictions.

Q: How long does N-400 processing take?
A: Currently 12–24 months at most field offices. Check current processing times at uscis.gov for your specific field office.

Q: Can I travel while N-400 is pending?
A: Yes — you remain a permanent resident while N-400 is pending. You can travel with your green card and passport. Maintain your physical presence requirements — extended trips abroad could still affect your continuous residence calculation.
:::

:::cta
href: /tools/citizenship-checklist
label: Citizenship Checklist →
Use the N-400 Readiness Checklist to calculate your earliest filing date and track every step.
:::`,
  },
];

/* ── Computed exports ──────────────────────────────────────────────────── */

export const formsChildPages: FormsPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const formsChildSlugs = rawPages.map((p) => p.slug);

export function getFormsChildPage(slug: string): FormsPage | undefined {
  return formsChildPages.find((p) => p.slug === slug);
}
