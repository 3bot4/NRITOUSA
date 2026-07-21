import { computeReadingTime } from "@/lib/format";

/**
 * USCIS Life Planning topic cluster (hub-&-spoke).
 *
 *   /uscis/life-planning              ← hub (static route)
 *     ├─ /uscis/buy-house-while-waiting-for-green-card
 *     ├─ /uscis/change-job-during-green-card
 *     ├─ /uscis/travel-to-india-while-i485-pending
 *     ├─ /uscis/h1b-renewal-while-i485-pending
 *     ├─ /uscis/h4-ead-renewal-delay
 *     ├─ /uscis/start-side-business-on-h1b
 *     ├─ /uscis/moving-states-address-change
 *     ├─ /uscis/parents-visiting-usa-while-case-pending
 *     └─ /uscis/layoff-green-card-process
 *
 * Child pages are served by app/uscis/[slug]/page.tsx alongside other clusters.
 */

export type LifePlanningPageKind = "life-decision" | "guide";

export interface LifePlanningPageData {
  /**
   * Opt in to the answer-first template chrome (byline row + author bio box).
   * Set only on pages rebuilt to that template, so untouched siblings render
   * exactly as before.
   */
  answerFirst?: boolean;
  slug: string;
  kind: LifePlanningPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface LifePlanningPage extends LifePlanningPageData {
  readingTime: number;
}

export const LIFE_PLANNING_HUB = "/uscis/life-planning";
export const LIFE_PLANNING_CLUSTER_BASE = "/uscis";

const rawPages: LifePlanningPageData[] = [

  /* ── 1. Buying a house ─────────────────────────────────────────────── */
  {
    slug: "buy-house-while-waiting-for-green-card",
    answerFirst: true,
    kind: "life-decision",
    title: "Buying a House on H-1B in 2026: Mortgage Rules & Risks",
    seoTitle: "Buying a House on H-1B: Mortgage Rules & Risks 2026",
    metaDescription:
      "Yes, you can buy a house on H-1B or with I-485 pending. Loan types by visa status, down payment (3.5%–20%), FHA rules, and what happens if you must leave.",
    navLabel: "Buy a House (Green Card Pending)",
    excerpt:
      "You can buy a house on H-1B or with I-485 pending. The real question is whether it makes sense given your timeline, down payment, and what happens if your case is delayed or you have to leave.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
**Yes — you can legally buy a house on H-1B or with an I-485 pending.** US law places no citizenship or immigration-status restriction on owning property, and H-1B holders qualify for ordinary conventional and **FHA** mortgages on the same terms as citizens, including **3.5% down** on FHA. What lenders actually want is a valid **I-94**, an **SSN** (or ITIN with some lenders), a documented **2-year work history**, and typically at least **1 year of visa validity** remaining. The real question is not legality but risk: what happens to the mortgage if you have to leave.
:::

:::key
- Qualify like any borrower: valid I-94, SSN, and a documented 2-year work history — **no citizenship requirement** exists for a US mortgage.
- Put down as little as **3.5% with FHA** or **5%–20% conventional**; foreign-national loans without US credit need **20–40%**.
- Expect lenders to want at least **~1 year** of remaining visa validity, and many prefer to see an approved I-140 for stability.
- Keep **6 months** of mortgage reserves — the H-1B **60-day** grace period after a layoff is your entire runway.
- Remember the mortgage does not require US residence: if you leave, you can **rent it out** and file a US return on the rental income.
:::

Buying a house while your green card is years away is one of the most common financial decisions Indian H-1B families face — and the legal part is the easy part. This guide is for H-1B, H-4 EAD, and I-485-pending buyers who want to know which loan types they actually qualify for, how much down payment each requires, how immigration timing changes the risk, and what happens to the property if a layoff or a denied case forces them to leave. The short answer to the underlying worry: property ownership has **no effect whatsoever** on your immigration case, and a mortgage does not require you to remain in the country. Below: mortgage eligibility by visa status, the loan-type comparison table, timing the purchase around your immigration stage, exit scenarios, and a financial readiness checklist.

## Can You Get a Mortgage on an H-1B Visa?

:::info
title: H-1B mortgage basics
- Most major lenders (Fannie Mae/Freddie Mac conforming loans) allow H-1B borrowers with at least 1–2 years remaining on the visa
- You need a valid H-1B I-94, SSN, and documented income (W-2s, employment letter)
- Foreign national loans (no SSN, no credit history) are available but require larger down payments (20–40%) and higher rates
- **ITIN loans**: Some lenders accept ITIN instead of SSN — useful if you are in a status transition
:::

| Loan type | Available on a work visa? | Typical minimum down payment | Notes |
|---|---|---|---|
| Conventional (Fannie/Freddie) | Yes | 5% (3% some programs) | Needs SSN, 2-year work history; PMI under 20% |
| **FHA** | Yes, with valid EAD or work-authorized status | **3.5%** | Requires SSN; lender verifies work authorization |
| VA | Only if you are a qualifying service member/veteran | 0% | Rare for visa holders |
| ITIN loan | Yes | 15%–25% | For borrowers without an SSN; higher rates |
| Foreign national loan | Yes | 20%–40% | No US credit history required; highest rates |
| Jumbo | Yes | 10%–20% | Stricter reserves; visa validity scrutinised |

> Down payments and overlays vary by lender. Confirm current requirements with the lender and, where FHA rules matter, with HUD guidance.

### Which visa statuses can borrow?

| Your status | Conventional | FHA | What lenders look at |
|---|---|---|---|
| H-1B | Yes | Yes | I-797/I-94 validity, ideally 1+ year remaining |
| H-4 with EAD | Yes | Yes | EAD validity and documented income |
| L-1 | Yes | Yes | Same as H-1B |
| F-1 / OPT | Case by case | Case by case | Short status horizon is the obstacle |
| I-485 pending with EAD | Yes | Yes | Often viewed favourably — approved I-140 helps |
| Green card holder | Yes | Yes | Treated as a permanent resident borrower |

## When Should You Buy Relative to Your Immigration Stage?

:::compare
left: Lower risk to buy
right: Higher risk / pause and plan
left_items:
- H-1B with 3+ years remaining and strong employer history
- I-140 approved, I-485 filed, EAD in hand (job flexibility)
- Permanent resident (green card received)
- Priority date is close — you expect to file I-485 within 1–2 years
right_items:
- H-1B cap-gap period or visa expiring within 12 months
- I-485 just filed (high uncertainty in timeline)
- PERM pending — employer may leave or be acquired
- Considering AC21 job change within the next 6 months
- Strong possibility of needing to return to India
:::

## What Happens to the House If You Have to Leave the US?

:::warn
title: Scenarios to plan for before buying
- **Case delayed but you stay**: Your mortgage continues normally. You can rent the property if you temporarily leave. Your mortgage does not require you to live in the US.
- **You move abroad but return**: You can keep the property as a rental or sell it. Rental income is US-source income taxed in the US; you will need to file a US tax return.
- **Green card denial / you must leave permanently**: You can sell the house (capital gains rules apply), rent it, or transfer it to a trust. Plan this scenario BEFORE buying, not after.
- **Employer closes / you lose H-1B**: You have a 60-day grace period to find new H-1B sponsorship. If you cannot, you may need to leave — plan mortgage and housing accordingly.
:::

## Are You Financially Ready to Buy?

:::info
title: Questions to answer before signing
- Can you afford the mortgage on one income if your H-4 EAD spouse faces a gap?
- Do you have 6 months of reserves in a US account?
- What is your expected time to green card — and does the house purchase timeline align?
- Have you considered ITIN vs SSN for both spouses on the mortgage?
- If buying near a specific employer, what is your plan if you change jobs via AC21?
:::

## How This Connects to the Rest of Your Immigration and Money Picture

A home purchase sits on top of two timelines you do not fully control. The immigration one runs through your [priority date](/visa-bulletin/priority-date) and the [India backlog](/green-card/green-card-backlog-india) — the longer that wait, the longer you will hold the property in nonimmigrant status, and the more the [60-day layoff grace period](/h1b-layoff) matters as a risk. The money one runs through your India-side assets: a down payment funded from Indian savings can trigger [FBAR and FATCA reporting](/tools/fbar-fatca-checker), and if you ever move back, rental income and the eventual sale interact with [RNOR rules](/return-to-india). If your spouse's income is on the loan, their [H-4 EAD renewal timing](/tools/h4-ead-navigator) becomes a mortgage risk too.

## Frequently asked questions

### Can I buy a house on an H-1B visa?
Yes. US law places no immigration-status restriction on buying property, and H-1B holders qualify for conventional and FHA mortgages on standard terms with a valid I-94, an SSN, and a documented two-year work history. Most lenders also want to see roughly a year or more of remaining visa validity.

### Can I get an FHA loan on a work visa?
Yes. FHA loans are available to non-permanent residents who are authorized to work in the US, with the same 3.5% minimum down payment. The lender verifies work authorization through your EAD or visa documentation; individual lenders may add their own overlays.

### Does buying a house affect my green card case?
No. Property ownership does not affect USCIS adjudication of any petition or application. It does not demonstrate immigrant intent in a way that creates a problem for your nonimmigrant status.

### Can my H-4 spouse be on the mortgage?
Yes — if your H-4 spouse has an EAD, they can be a co-borrower with documented income. Without work authorization, they can be a non-occupant co-borrower, but their income typically cannot be counted toward qualifying.

### Can I use my Indian savings as a down payment?
Yes. Large down payments sourced from foreign accounts must be documented with bank statements showing the source of funds, to satisfy anti-money-laundering rules. Holding those accounts may also trigger FBAR or FATCA reporting obligations.

### What if I buy a house and then get laid off?
You have a 60-day H-1B grace period to find new sponsorship. If you cannot and must leave, you can rent the property out or sell it — a mortgage does not require you to live in the US. Plan that scenario with a property manager or real estate attorney before you buy, not after.

### How much down payment do I need as a visa holder?
It depends on the loan: 3.5% on FHA, typically 5%–20% conventional, 15%–25% on an ITIN loan, and 20%–40% on a foreign-national loan with no US credit history. Anything under 20% on a conventional loan adds private mortgage insurance.

:::cta
href: /tools/uscis-life-decision-checklist
label: Life decision checklist →
Answer a few questions to get a personalized risk and checklist for your home buying decision.
:::`,
  },

  /* ── 2. Changing jobs during green card ────────────────────────────── */
  {
    slug: "change-job-during-green-card",
    kind: "life-decision",
    title: "Changing Jobs During the Green Card Process: AC21 and What to Know",
    seoTitle: "Change Job During Green Card Process | AC21 Portability for Indians",
    metaDescription:
      "Can you change jobs while your green card is pending? AC21 portability lets you switch to a same-or-similar job after 180 days with I-485 pending. Guide for Indian H1B workers.",
    navLabel: "Change Job (Green Card Process)",
    excerpt:
      "You can change jobs during the green card process — but timing, AC21 eligibility, and the new job's SOC code all matter. Changing too early can risk your priority date and I-140.",
    date: "2026-06-16",
    content: `:::summary
**Yes, you can change jobs during the green card process — but the rules depend on where you are in the process.** The key statute is AC21 (American Competitiveness in the 21st Century Act), which allows I-485 applicants to change to a same or similar job after the I-485 has been pending for 180 days.
:::

## The AC21 window

:::info
title: AC21 portability rules
- Your I-485 must have been pending for **at least 180 days** (counting from filing receipt date)
- Your I-140 must be **approved** (I-140 portability is separate)
- The new job must be in the **same or similar occupational classification** (same SOC code or closely related)
- You file an I-485 supplement J (Form I-485J) to notify USCIS of the job change
- You do not need USCIS approval to change jobs under AC21 — you just notify
:::

## Stages and risk levels

:::compare
left: Safer to change jobs
right: Riskier — plan carefully
left_items:
- I-485 has been pending 180+ days (AC21 applies)
- New job is same SOC code or directly comparable specialty
- I-140 approved for 180+ days (protected even if employer withdraws)
- EAD in hand — you can work for any employer
right_items:
- PERM is still pending — changing employers restarts PERM
- I-140 is pending or approved for less than 180 days
- New job is in a different occupational field (AC21 portability risk)
- I-485 filed recently (less than 180 days ago)
:::

## What happens to PERM if you change jobs

:::warn
title: PERM is tied to the employer — it does NOT port
If your PERM Labor Certification is still pending or was recently approved and you haven't filed I-140 yet, changing employers **restarts the entire process**. Your new employer would need to start a new PERM. Your priority date from the old PERM is generally lost unless the new employer can demonstrate the same or similar job. This is the most common and most painful mistake in the green card process.
:::

## I-140 portability after approval

:::info
title: Protecting your priority date when changing employers
- If your I-140 was approved and you change employers before 180 days: **priority date is at risk**
- If your I-140 was approved AND has been approved for 180+ days: the priority date survives even if the old employer withdraws the I-140 (USCIS policy under AC21 § 106(c))
- The surviving priority date can be used by a new employer filing a new I-140 on your behalf
:::

## FAQ

:::faq
Q: I just got an offer from a FAANG company — my I-485 has been pending for 210 days. Can I switch?
A: Likely yes if the new job is same or similar SOC classification. Software engineer to software engineer is straightforward. Software engineer to product manager may need attorney analysis. File I-485J promptly after starting the new job.

Q: Does my new employer need to file anything?
A: Your attorney files Form I-485J (Confirmation of Bona Fide Job Offer) with USCIS. Some attorneys include a cover letter with the AC21 same-or-similar analysis. The new employer does not file a new I-140 for I-485 portability, but should file a new I-140 for green card continuation under the new employer.

Q: My old employer's attorney has my I-140 documents — can I get copies?
A: You are entitled to a copy of your I-797 I-140 approval notice. Request this from HR before you leave. The underlying PERM and I-140 application belongs to the employer — but your I-140 approval notice is a document about you.

Q: I changed jobs and USCIS sent an RFE about AC21 — what now?
A: Respond through your attorney with same-or-similar analysis: SOC codes for old and new job, job description comparison, and documentation of your qualifications for the new role. AC21 RFEs are common and many are resolved with a good response.
:::

:::cta
href: /tools/h1b-transfer-risk-checklist
label: H1B Transfer Risk Checklist →
Assess your risk profile for changing employers.
:::`,
  },

  /* ── 3. Travel to India while I-485 pending ───────────────────────── */
  {
    slug: "travel-to-india-while-i485-pending",
    kind: "life-decision",
    title: "Travel to India While I-485 Is Pending: Advance Parole Rules",
    seoTitle: "Travel to India While I-485 Pending | Advance Parole Guide for Indians",
    metaDescription:
      "Can you travel to India while your I-485 is pending? You need an approved Advance Parole — not just the approval notice. Guide for Indian H1B and H4 green card applicants.",
    navLabel: "Travel to India (I-485 Pending)",
    excerpt:
      "You can travel to India while I-485 is pending — but only with a physical Advance Parole card in hand. Leaving without it is typically treated as I-485 abandonment. The H-1B visa stamp exception is narrow.",
    date: "2026-06-16",
    content: `:::summary
**Never leave the US while your I-485 is pending without an approved, physically received Advance Parole (I-131) card.** Departing without it — regardless of your H-1B status — is generally treated as abandonment of your I-485. This would cost you your place in the India EB queue.
:::

## The Advance Parole requirement

:::warn
title: The rule: I-131 Advance Parole MUST be in hand before departure
- File Form I-131 when you file I-485 (file both together)
- Wait until you physically receive the combo EAD-AP card or standalone AP document
- Book travel ONLY after the physical card is in your possession — not when the USCIS status says "Card Is Being Produced"
- Check the AP card's expiration date before booking return travel — it must be valid on your return date
:::

## The H-1B "exception" — narrow and risky

:::warn
title: The H-1B travel exception — understand before relying on it
Under INA § 212(d)(5), H-1B and L-1 holders technically can reenter on their valid H-1B or L-1 visa stamp while I-485 is pending — without Advance Parole. BUT:
- This requires a valid, unexpired H-1B visa stamp (not I-797, not I-94 — the actual visa stamp in your passport)
- Your H-1B must remain valid for your return date
- Re-entering on H-1B during I-485 pendency changes your parole status and may complicate your case
- CBP officers have discretion — some will flag questions about immigrant intent
- **Many immigration attorneys advise against relying on this exception** — get AP instead
:::

## What happens at the India/US border

:::info
title: Re-entry with Advance Parole
- At the US port of entry: present your AP card + your passport
- CBP will stamp you as "paroled" — your legal status after this re-entry is parolee, not H-1B nonimmigrant
- Your I-485 continues normally — the parole re-entry is expected and handled
- Carry: your AP card, the AP approval notice, your I-797 (I-485 receipt), and a copy of your I-485 filing
:::

## Planning the trip

:::info
title: Trip planning checklist with I-485 pending
- AP card physically in hand (check front and back — confirm validity dates)
- AP card valid through your RETURN date (not just departure)
- Your H-4 spouse (if applicable) also has an AP card if they have a pending I-485
- Carry printed copies of AP, I-797 I-485 receipt, and your attorney's contact
- Inform your attorney of your travel dates before departure
- Have the I-797 I-485 receipt number accessible in case CBP has questions
:::

## FAQ

:::faq
Q: My AP says it expires in 2 months — is it safe to go to India for 3 weeks?
A: If your trip is 3 weeks and your AP is valid through your return date, yes. If there is any risk of being delayed in India (visa, family emergency, health), factor a buffer. Never let your AP expire while abroad.

Q: My I-485 is pending but I don't have AP yet — my father is ill in India. What do I do?
A: Contact your attorney immediately for humanitarian expedite of the AP. USCIS has an expedite request process (contact USCIS directly or through an Infopass). If you leave without AP in this situation, you risk I-485 abandonment — your attorney needs to help you evaluate the specific risk vs. urgency.

Q: Can I attend a wedding in India while I-485 is pending?
A: Yes — with an approved AP card in hand. A wedding is not a humanitarian emergency so you cannot expedite AP for this reason. Plan trips 8–12 months out to account for AP processing time.

Q: My spouse's I-485 is pending but she has H-4 (not EAD/AP). Can she travel?
A: If she has no AP, she cannot return to the US after an I-485 trip abroad without abandoning her I-485 — unless she has an H-4 stamp valid for re-entry AND your H-1B remains valid. This is complex. Get attorney advice before she leaves.
:::`,
  },

  /* ── 4. H-1B renewal while I-485 pending ─────────────────────────── */
  {
    slug: "h1b-renewal-while-i485-pending",
    kind: "life-decision",
    title: "H-1B Renewal While I-485 Is Pending: Do You Still Need It?",
    seoTitle: "H-1B Renewal While I-485 Pending | Should Indians Renew H1B?",
    metaDescription:
      "Should you renew your H-1B while I-485 is pending? If you have EAD, you can work on that. But keeping H-1B active offers travel flexibility and a safety net if I-485 is denied.",
    navLabel: "H-1B Renewal (I-485 Pending)",
    excerpt:
      "Once your EAD arrives, you don't legally need H-1B to work. But many Indian applicants keep H-1B active for travel flexibility (no AP needed with valid H-1B stamp) and as a safety net if I-485 is denied.",
    date: "2026-06-16",
    content: `:::summary
Once your I-485 is filed and EAD is approved, you are **not required to maintain H-1B status**. Your EAD alone authorizes you to work for any employer. However, most immigration attorneys recommend **keeping H-1B active** for two key reasons: (1) travel flexibility and (2) the safety net if I-485 is denied.
:::

## H-1B vs EAD: what each gives you

:::compare
left: H-1B status advantages
right: EAD (I-765) advantages
left_items:
- Travel internationally without Advance Parole (if valid H-1B visa stamp)
- Safety net: if I-485 is denied, you remain in valid nonimmigrant status
- AC21 job portability analysis is cleaner with maintained H-1B
- Some employers prefer H-1B workers for policy/compliance reasons
right_items:
- Work for any employer — not tied to H-1B sponsor
- Employer does not need to file any petition for you
- No LCA required for employer
- Self-employment, freelancing, LLC ownership all allowed
- No cap on hours or employers
:::

## Cost-benefit of H-1B renewal with pending I-485

:::info
title: When H-1B renewal makes sense
- If your I-485 priority date is close and approval is expected in 1–2 years: H-1B renewal may be low value (high cost for short remaining period)
- If your I-485 has been pending less than 3 years and has a long wait remaining: H-1B renewal is worth it for travel flexibility and safety net
- If you plan to travel internationally regularly (India trips for family): H-1B visa stamp avoids dependence on AP timing
- If your employer wants to keep your work authorization clean and separate from I-485: H-1B is preferred
:::

## What happens if I-485 is denied

:::warn
title: The safety net scenario
If your I-485 is denied (RFE response failed, inadmissibility ground found, etc.) and you have already let your H-1B expire/lapse, you have **no valid nonimmigrant status**. You must appeal, refile, or depart. If you maintained H-1B, you remain in valid H-1B status and can appeal or regroup without being out of status.

This is the primary reason immigration attorneys recommend maintaining H-1B even when EAD is available.
:::

## H-1B extensions beyond the 6-year cap

:::info
title: H-1B extensions under AC21 with approved I-140
Under AC21 § 104(c), if your I-140 is approved and your priority date is not current (India EB-2/EB-3 typically), you qualify for H-1B extensions in one-year increments beyond the 6-year limit. These extensions are available as long as your I-140 remains approved. This is a critical benefit — it keeps you legal while waiting for decades in the India EB queue.
:::

## FAQ

:::faq
Q: My H-1B is expiring and my I-485 has been pending for 2 years with EAD active — do I renew H-1B?
A: Discuss with your attorney. The main factors: (1) Do you travel to India and need a US visa stamp for re-entry? (2) Are there any risks to your I-485 that make the safety net valuable? (3) Is your employer willing to file and pay for the extension?

Q: My employer says they won't file an H-1B extension because I have EAD — what are my rights?
A: Your employer is not legally required to maintain your H-1B if you have EAD and are authorized to work under it. This is a business decision. If H-1B is important to you (for travel or safety net), discuss with your attorney whether you can find a cap-exempt employer to hold the H-1B or whether an H-1B holder can file without employer sponsorship (generally not possible in most cases).

Q: I let my H-1B lapse but I have EAD — am I in valid status?
A: You are authorized to work and stay in the US based on the pending I-485 and your EAD. You are in a "period of authorized stay" — not technically in nonimmigrant H-1B status. If I-485 is denied, this becomes a serious problem. This is the risk of letting H-1B lapse.
:::`,
  },

  /* ── 5. H-4 EAD renewal delay ──────────────────────────────────────── */
  {
    slug: "h4-ead-renewal-delay",
    kind: "life-decision",
    title: "H-4 EAD Renewal Delay: What to Do When Your Work Permit Is Expiring",
    seoTitle: "H-4 EAD Renewal Delay | What to Do if H4 EAD Expires (2026 Guide)",
    metaDescription:
      "H-4 EAD renewal taking too long? No automatic extension for H-4. If your EAD expires before renewal is approved, you may need to stop working. What to do and how to plan.",
    navLabel: "H-4 EAD Renewal Delay",
    excerpt:
      "H-4 EAD has no automatic 180-day extension. If your EAD expires before renewal is approved, you must stop working. File renewals 6 months early and know your options.",
    date: "2026-06-16",
    content: `:::summary
**H-4 EAD has no automatic extension.** Unlike some other EAD categories, H-4 EAD holders cannot continue working once the physical EAD card expires — even if the renewal is pending. USCIS processing delays (currently 4–9 months for H-4 EAD) create real income gaps for families. Plan renewals 6 months early.
:::

## The no-auto-extension problem

:::warn
title: H-4 EAD: no 180-day automatic extension
Some EAD categories get an automatic 180-day extension while renewal is pending — H-4 EAD (category C26) does NOT qualify for this. If your H-4 EAD expires on March 1 and your renewal is still pending, you must stop working on March 1. Period. Working beyond the expiration date is unauthorized employment and can jeopardize future applications.
:::

## Timeline and filing strategy

:::info
title: H-4 EAD renewal filing timeline
- File I-765 renewal **6 months before expiration** — current processing is 4–9+ months
- File alongside I-539 if your H-4 status is also expiring
- Use premium processing if available (check current USCIS eligibility — availability has varied)
- Track your case at my.uscis.gov
- If past normal processing time, submit a service request through myUSCIS after the published processing window
:::

## Income gap planning

:::info
title: Financial planning for the EAD gap period
- Calculate worst-case gap: if EAD expires and renewal takes 3 months, can the household manage on one income?
- Build 3–6 months of reserves before the renewal period
- Inform your employer early — some accommodate unpaid leave; others require formal resignation
- If you resign during the gap, you can rejoin any employer once the new EAD arrives (no new H-4 EAD approval required for same employer if within validity)
:::

## What you CAN do during an EAD gap

:::info
title: Allowed activities while H-4 EAD is pending (and expired)
- Passive investing (stocks, real estate you already own — rental income from property you own is allowed)
- Volunteer work (no compensation)
- Study courses, certifications
- Run a business as a non-compensated owner/partner (very fact-specific — consult attorney)
What you **cannot do**: work for wages or salary, including remote contract work for companies
:::

## FAQ

:::faq
Q: My H-4 EAD expires in 3 months and I just filed the renewal — will I face a gap?
A: Likely yes given current 4–9 month processing times. Contact your attorney about premium processing (if available for your case) and plan for the gap financially.

Q: Can I work remotely for an Indian company during the EAD gap while in the US?
A: No. Working for any employer — US or foreign — while physically in the US without work authorization is unauthorized employment, regardless of who pays or where the work goes.

Q: My H-4 EAD gap will be 4 months. Should I resign or take unpaid leave?
A: Discuss with your HR. Unpaid leave of absence (FMLA or personal leave) preserves your job and benefits without unauthorized employment. Resigning and rejoining is also common. Do not continue working once EAD expires.

Q: My I-140 was just approved — when can I file for H-4 EAD?
A: You can file I-765 for H-4 EAD immediately after the I-140 approval. The priority date does not need to be current — only the approved I-140 is required. File now rather than waiting.
:::

:::cta
href: /tools/h4-ead-navigator
label: H-4 EAD Navigator →
Understand what H-4 EAD holders can do, renewal gap risk, and business options.
:::`,
  },

  /* ── 6. Side business on H-1B ────────────────────────────────────── */
  {
    slug: "start-side-business-on-h1b",
    kind: "life-decision",
    title: "Can You Start a Side Business on H-1B? What's Actually Allowed",
    seoTitle: "Start Side Business on H-1B | What Indians Can and Cannot Do",
    metaDescription:
      "Can you start a business on H-1B? You can own equity and earn passive income. You cannot actively work in the business without separate work authorization. Guide for Indian H1B workers.",
    navLabel: "Side Business on H-1B",
    excerpt:
      "H-1B workers can own a business and earn passive income from it — but cannot provide labor or services to that business without separate work authorization. The line between owner and worker matters.",
    date: "2026-06-16",
    content: `:::summary
**H-1B workers can own a US business (LLC, S-Corp, C-Corp) and earn passive income (distributions, dividends, rent, capital gains).** What H-1B workers **cannot do** is actively work in that business — providing services, writing code, taking calls, attending client meetings — without a separate EAD or another form of work authorization. The visa authorizes work only for the sponsoring H-1B employer.
:::

## What is allowed on H-1B

:::info
title: H-1B — what you can do with a business
- **Own equity**: LLC membership, shares, partnership interests — fully allowed
- **Passive income**: rent from property you own, stock dividends, LLC distributions where your return is on capital (not labor)
- **Invest**: buy stocks, ETFs, real estate, crypto — all passive activity
- **Be on the board**: Director roles (non-executive, unpaid or compensated in equity) are generally permissible — but verify with your attorney for specific situations
- **Sign documents as owner**: Signing as managing member of an LLC you own is typically allowed
:::

## What is NOT allowed on H-1B

:::warn
title: H-1B — what crosses the line into unauthorized work
- Writing code for your own startup (even if unpaid)
- Taking client calls or providing consulting services through your LLC
- Managing day-to-day operations: creating content, making products, fulfilling orders
- Running an active dropshipping, Etsy, or service business where you provide the labor
- Doing freelance development/design/writing as a side contractor through your own company
The test: are you providing labor or professional services? If yes — not allowed on H-1B alone.
:::

## Paths to work in your own business

:::info
title: How Indians legally work in their own businesses
- **H-4 EAD**: If your spouse has H-4 EAD, they can actively work in the business you own — building, operating, serving clients
- **I-485 EAD (C09)**: If you file I-485 and get EAD, you can work in your own business freely
- **O-1 visa**: For extraordinary ability — allows active work in your own venture
- **EB-1A self-petition**: Extraordinary ability green card — long path but no employer required
- **Invest and wait**: Build the business structure now, operate it actively after getting EAD
:::

## The H-4 EAD business strategy

:::info
title: Using H-4 EAD to build a family business
Many Indian families use this structure: H-1B spouse owns the LLC (or is majority owner), H-4 EAD spouse actively runs it — handling operations, clients, fulfillment. H-4 EAD holders can work for any employer including a business where their spouse is the owner. There is no prohibition on working for a family-owned entity with an EAD.
:::

## FAQ

:::faq
Q: I want to start a Shopify store while on H-1B — is that allowed?
A: If you are fulfilling orders, writing product listings, managing ads, or creating the product — that is active work and not allowed. If the store is managed entirely by your H-4 EAD spouse and you are only the legal owner collecting distributions, it may be permissible. The labor must not come from you.

Q: Can I collect rent from a rental property on H-1B?
A: Yes. Owning rental property and collecting rent is passive investment income — fully allowed on H-1B. If you personally manage the property (making repairs, finding tenants, handling issues), that crosses into active management which is legally gray. Property management companies handle the active portion for this reason.

Q: I am in the I-485 pending period with EAD — can I work in my own business now?
A: Yes. An EAD (I-765) authorizes you to work for any employer, including self-employment, freelancing, and running your own business. Once your EAD is in hand, you can actively work in your own company.

Q: Can an H-1B worker receive a salary from their own corporation?
A: Generally no — taking a salary as an employee of your own company requires that company to petition for your H-1B, making you the employer-petitioner. USCIS scrutinizes this heavily. Some structures work (H-1B filed by majority-owned corporation through an attorney) but they are complex and expensive. EAD is the practical path.
:::`,
  },

  /* ── 7. Moving states ────────────────────────────────────────────── */
  {
    slug: "moving-states-address-change",
    kind: "life-decision",
    title: "Moving States on H-1B or Green Card Pending: USCIS, H-1B, and What to File",
    seoTitle: "Moving States on H-1B or I-485 | USCIS Address Change Guide for Indians",
    metaDescription:
      "Moving to another state on H-1B or with I-485 pending? You need to file AR-11, update pending petitions, and likely file an H-1B amendment. Guide for Indian NRI applicants.",
    navLabel: "Moving States (H-1B / I-485)",
    excerpt:
      "Moving states on H-1B requires an H-1B amendment (in many cases) and USCIS address change (AR-11). With I-485 pending, you must update USCIS, notify your service center, and transfer your I-485 to the right field office.",
    date: "2026-06-16",
    content: `:::summary
Moving to another state while on H-1B or with I-485 pending is common — but it triggers several filing and notification obligations. The most overlooked: H-1B employees who move to a new work location may need an H-1B **amendment** (a new I-129 filing), not just an address update.
:::

## H-1B and moving to a new work location

:::warn
title: Moving work location on H-1B may require an H-1B amendment
Your H-1B petition was filed for a specific "place of employment" in a specific Metropolitan Statistical Area (MSA). If you move to a new city or MSA — whether you're working from home in a new state or physically relocating to a new office — your employer may need to file:
- **New LCA** for the new location (required if new MSA)
- **H-1B amendment** (I-129 amendment) for the new location
This is not optional if the new location is in a different MSA than what's on your current LCA.
:::

## Remote work and home office LCA

:::info
title: Working remotely from home after moving
If your employer allows remote work and you move to a different state:
- Your home becomes a "place of employment"
- Your employer needs a new LCA posting for your new home location (certified by DOL)
- Depending on whether the move crosses MSA boundaries, an H-1B amendment may be required
- Some employers have blanket LCAs for remote work — ask your employer's immigration counsel
The DOL conducted enforcement actions on remote-work LCA violations — this is not a paperwork technicality.
:::

## USCIS filings required when you move

:::info
title: Moving checklist for H-1B or I-485 applicants
1. **AR-11** — File online at my.uscis.gov within 10 days of move
2. **Notify your employer's immigration attorney** — they update service center records and file any LCA/amendment
3. **I-485 field office transfer** (if I-485 pending) — your case may need to move to the local USCIS field office for your new state for interview purposes
4. **SSA/DMV** — Update Social Security Administration and state DMV records
5. **Banking/financial accounts** — update address with US bank accounts to satisfy KYC requirements
:::

## I-485 pending — field office transfer

:::info
title: Transferring your I-485 interview to a new field office
If your I-485 interview has not been scheduled and you move to a new state:
- Notify USCIS (through your attorney or myUSCIS) of your new address (AR-11)
- USCIS will route your interview to the field office in your new state
- If an interview has already been scheduled at your old field office and you move, contact USCIS immediately to reschedule
- Processing timelines vary by field office — some have shorter or longer waits than where you were
:::

## FAQ

:::faq
Q: My employer has offices in both California and New York — I moved to NY. Do we need an amendment?
A: If the NY office is a new place of employment not already on your H-1B LCA and petition, yes — a new LCA and potentially an H-1B amendment is required. If the NY office was already listed on your H-1B as an alternate location, it may not need an amendment. Check with your employer's attorney.

Q: I moved within the same city but to a new apartment — do I still need to file AR-11?
A: Yes. Any address change — even a few blocks — requires AR-11 within 10 days. It takes 5 minutes online.

Q: I moved and my I-485 interview letter went to my old address — what now?
A: Contact USCIS immediately. Depending on timing: (a) the notice may be redirectable, (b) you may need to reschedule, (c) a missed interview notice can lead to denial if not addressed quickly. Do not wait.

Q: I work fully remote and moved from Texas to California — do I need an H-1B amendment?
A: Almost certainly yes. Texas and California are different MSAs. Your employer needs a new California LCA and likely an H-1B amendment. The risk of not doing this is a DOL violation for the employer and a status issue for you. Raise this with your employer's immigration team before or immediately after the move.
:::`,
  },

  /* ── 8. Parents visiting while case pending ────────────────────────── */
  {
    slug: "parents-visiting-usa-while-case-pending",
    kind: "life-decision",
    title: "Parents Visiting the USA While Your Green Card Case Is Pending",
    seoTitle: "Parents Visiting USA While I-485 Pending | Indian Immigrant Guide",
    metaDescription:
      "Can your Indian parents visit the US while your I-485 or H-1B case is pending? B-2 visa for parents, how long they can stay, I-485 or sponsorship questions answered.",
    navLabel: "Parents Visiting USA (Case Pending)",
    excerpt:
      "Your parents can visit on a B-2 tourist visa regardless of your immigration status. Their visit does not affect your case — but their visa application requires showing ties to India and intent to return.",
    date: "2026-06-16",
    content: `:::summary
**Your parents can visit the US on a B-2 tourist visa regardless of your immigration status** — whether you are on H-1B, have I-485 pending, or have already received your green card. The visit does not affect your green card case in any way. The challenge is their visa application: consular officers want to see strong ties to India and clear intent to return.
:::

## B-2 visa for Indian parents: the basics

:::info
title: B-2 tourist visa for parents of US residents
- Parents need a B-2 (or B-1/B-2 combination) tourist visa from the US Embassy in India
- B-2 allows a stay typically up to 6 months per visit
- Consular officers assess immigrant intent — they want to see that your parents have ties to India and intend to return
- **Does not help**: "My child is on H-1B" or "My child has I-485 pending" — this does NOT help the visa application and can raise immigrant intent flags
- **Does help**: Parents own property, have pension, have spouse in India, have other family in India
:::

## Common B-2 visa challenges for Indian parents

:::warn
title: Why B-2 visa is sometimes denied for parents of US residents
- Consular officer suspects immigrant intent (parent wants to stay in US permanently)
- Parents have no strong ties to India (retired, spouse already here, no property)
- Too frequent or too long visits that look like de facto residence in the US
- Prior overstays or visa violations
- Parents sponsored by US citizen child — even a green card sponsorship application for parents can trigger questions about intent to stay
:::

## Duration of stay management

:::info
title: Managing parents' authorized stay
- I-94 entry records show how long each parent was admitted
- Staying more than 6 months triggers potential "substantial presence" tax rules
- Parents on B-2 who stay past their admitted period are overstaying — a serious violation that can bar future visas
- Most CBP officers admit parents for 6 months, but this is their discretion, not a right
- For parents with medical needs, an I-539 to extend the B-2 status is possible but slow
:::

## Can you sponsor parents for a green card?

:::info
title: Sponsoring parents for a green card
- Only **US citizens** can file I-130 to sponsor parents for a green card
- Permanent residents (green card holders) **cannot** petition for parents
- If you become a US citizen, your parents become "immediate relatives" — there is no numerical cap and they can immigrate relatively quickly (12–18 months total)
- While your green card is still pending, you cannot petition for parents yet
:::

## FAQ

:::faq
Q: My parents want to be here when I file I-485 — is there any issue with them visiting at that time?
A: No. Your I-485 filing has no connection to your parents' B-2 visit. They can visit; their visa is independent of your case.

Q: My parents want to stay for a year to help with a newborn — how do we extend their B-2?
A: File I-539 before their admitted I-94 date expires. USCIS processing is 12–24 months, but filing in time maintains their authorized stay. However, staying this long raises scrutiny for future visa applications.

Q: My mother wants to bring her prescribed medications — what should she know?
A: She should bring original prescription bottles, a letter from her Indian doctor listing medications, and no more than a 90-day supply of non-controlled substances. Some medications common in India are controlled in the US — check the DEA scheduling before packing.

Q: My parents are US citizens (naturalized) — do they need a visa to visit India?
A: This question is reversed — for Indian parents visiting the US, the B-2 rules above apply. If your parents have become US citizens (through their own path), they would use their US passport to travel.
:::`,
  },

  /* ── 9. Layoff during green card ─────────────────────────────────── */
  {
    slug: "layoff-green-card-process",
    kind: "life-decision",
    title: "H-1B Layoff During Green Card Process: What Happens to Your Case",
    seoTitle: "H-1B Layoff During Green Card Process | What Indians Must Do Immediately",
    metaDescription:
      "Laid off while your green card is pending? You have 60 days to act. Guide for Indian H1B workers — grace period, I-140 portability, I-485 survival, and what to do immediately.",
    navLabel: "Layoff (Green Card Pending)",
    excerpt:
      "An H-1B layoff while green card is pending triggers a 60-day grace period to find new sponsorship. Your I-140 and priority date may survive depending on timing. Act in the first 72 hours.",
    date: "2026-06-16",
    content: `:::summary
**An H-1B layoff is a serious immigration event — but not necessarily a catastrophe.** You have a **60-day grace period** from the last day of employment to take action. Your I-140 priority date may survive under AC21 portability. Your I-485 may continue if it has been pending 180+ days. Move immediately — immigration deadlines in a layoff situation are unforgiving.
:::

## First 72 hours: what to do

:::steps
1. **Contact your immigration attorney immediately** — or find one today if you don't have personal counsel
2. **Get your last day of employment in writing** — the 60-day grace period starts the day after your last working day
3. **Secure your immigration documents**: I-797 approvals (I-129, I-140), all I-797C receipt notices, your I-94 history, priority date documentation
4. **Ask HR about H-1B withdrawal timeline** — employers are required to notify USCIS of termination but the timing matters for your grace period
5. **Evaluate your options** (see below) — do not take any immigration-related action without consulting your attorney
:::

## Your 60-day grace period

:::info
title: H-1B 60-day grace period basics
- Introduced by USCIS regulation in 2017: laid-off H-1B workers have a **one-time 60-day grace period** per authorized validity period
- During this period, you remain in a period of authorized stay (not status) — you are not in violation
- You cannot work during the grace period without a new H-1B or other work authorization
- After 60 days without action, you accrue unlawful presence
- The 60-day period applies once per H-1B validity period — using it for a brief gap and then being laid off again resets less favorably
:::

## What happens to I-140 and green card priority date

:::info
title: I-140 and priority date after layoff
- **I-140 approved for 180+ days**: Priority date survives even if employer withdraws the I-140 (USCIS policy). New employer can file a new I-140 and you can preserve the old priority date through your attorney.
- **I-140 approved less than 180 days ago**: If employer withdraws I-140, priority date may be lost. Some attorneys argue for protection, but it is more precarious.
- **PERM pending or I-140 pending**: Layoff terminates these — the employer cannot maintain them for a separated employee (generally).
:::

## What happens to I-485

:::info
title: I-485 after H-1B layoff
- **I-485 pending 180+ days AND I-140 approved 180+ days**: You can invoke AC21 portability and continue I-485 with a new employer in a same or similar job. File I-485J.
- **I-485 pending less than 180 days**: Your I-485 may be at risk without the original employer's sponsorship. Consult attorney immediately about options.
- **EAD in hand**: Your EAD allows you to work for any employer during the pending I-485 period — EAD does not require the original H-1B employer to remain your employer.
:::

## Options after H-1B layoff

:::compare
left: Best options
right: Options to avoid
left_items:
- Find new H-1B sponsor within 60 days (H-1B transfer on day 1 of new employment)
- Invoke AC21 if I-485 has been pending 180+ days (any same-or-similar employer)
- Work on EAD if I-485 pending and EAD is valid
- Change to F-1 student status if pursuing further education
right_items:
- Doing nothing and hoping 60 days doesn't expire
- Working without authorization during the grace period
- Departing and returning on B-2 (treated as abandoned H-1B)
- Taking a "1099 gig" role without checking work authorization rules
:::

## FAQ

:::faq
Q: I was laid off and my I-485 has been pending 200 days — am I safe?
A: Relatively safer than earlier in the process — you can invoke AC21 if you find a same-or-similar job. Your I-485 can continue with a new employer. Your EAD also gives you work flexibility. But "safe" requires action — contact your attorney immediately and don't assume everything is fine without analysis.

Q: My employer is doing mass layoffs — should I do anything before the layoff happens?
A: Yes. Gather all your immigration documents now. Know the exact status of your I-140 and I-485. Have your attorney's contact ready. If you have an EAD, confirm it's valid. If I-140 has been approved for less than 180 days, discuss with your attorney whether voluntary transfer to a new employer now (before layoff) is better.

Q: Can I file B-2 change of status to stay in the US while job hunting?
A: You can try, but consular officers and USCIS scrutinize B-2 applications from people who just lost H-1B employment. Immigrant intent is a significant issue. The 60-day grace period is a better legal window for actively seeking new H-1B employment. B-2 change of status takes months to process anyway.

Q: The company offered severance — does that extend my grace period?
A: No. The 60-day grace period is from the date of employment termination, not the end of severance pay. Check your actual last day of employment with HR.
:::

:::cta
href: /tools/h1b-transfer-risk-checklist
label: H1B Transfer Risk Checklist →
Assess your situation after a layoff — what actions to take and in what order.
:::`,
  },
];

/* ── Computed exports ────────────────────────────────────────────────── */

export const lifePlanningChildPages: LifePlanningPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const lifePlanningChildSlugs = rawPages.map((p) => p.slug);

export function getLifePlanningChildPage(slug: string): LifePlanningPage | undefined {
  return lifePlanningChildPages.find((p) => p.slug === slug);
}
