import { computeReadingTime } from "@/lib/format";

/**
 * myUSCIS Account cluster (hub-&-spoke).
 *
 *   /uscis/myuscis-account            ← hub (static route in app/uscis/myuscis-account/)
 *     ├─ /uscis/online-account-number
 *     ├─ /uscis/online-access-code
 *     ├─ /uscis/add-paper-case-to-account
 *     ├─ /uscis/myuscis-vs-case-status
 *     ├─ /uscis/change-address
 *     ├─ /uscis/i-797-notice
 *     ├─ /uscis/rfe-notice
 *     ├─ /uscis/approval-notice
 *     └─ /uscis/account-privacy
 *
 * Child pages are served by app/uscis/[slug]/page.tsx alongside uscisCluster slugs.
 * Content uses ::: fence format rendered by ArticleBody.
 */

export type MyuscisPageKind = "guide" | "reference";

export interface MyuscisPageData {
  /**
   * Opt in to the answer-first template chrome (byline row + author bio box).
   * Set only on pages rebuilt to that template, so untouched siblings render
   * exactly as before.
   */
  answerFirst?: boolean;
  slug: string;
  kind: MyuscisPageKind;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface MyuscisPage extends MyuscisPageData {
  readingTime: number;
}

export const MYUSCIS_HUB = "/uscis/myuscis-account";
export const MYUSCIS_CLUSTER_BASE = "/uscis";

const rawPages: MyuscisPageData[] = [

  /* ── 1. Online Account Number ────────────────────────────────────────── */
  {
    slug: "online-account-number",
    kind: "reference",
    title: "USCIS Online Account Number Explained for Indians",
    seoTitle: "USCIS Online Account Number: What It Is and How to Use It",
    metaDescription:
      "What is the USCIS online account number? How it differs from your A-number and receipt number, where to find it, and how to use it to link a paper-filed case.",
    navLabel: "Online Account Number",
    excerpt:
      "The USCIS online account number is a unique ID created when you register on myUSCIS — separate from your A-Number and receipt number.",
    date: "2026-06-16",
    content: `:::summary
Your **USCIS online account number** is a unique number assigned when you create a myUSCIS account at my.uscis.gov. It is separate from your A-Number (alien registration number) and from your I-797 receipt number. You will need it if a petitioner or preparer wants to link your case to their own myUSCIS account.
:::

## What is the USCIS online account number?

When you create an account on **my.uscis.gov**, USCIS assigns you a unique **online account number** — sometimes called a "USCIS account number." It appears in your myUSCIS profile and on some notices.

:::info
title: Three USCIS numbers to keep separate
- **A-Number (Alien Registration Number):** Your permanent immigration ID — starts with "A" followed by 8 or 9 digits. Appears on your green card, EAD, and most immigration documents.
- **Receipt number:** The 13-character case tracking number from your I-797 notice (e.g., EAC2390001234). One per filed petition.
- **USCIS online account number:** Created when you register on my.uscis.gov. Used to link yourself to a case filed on paper by an employer or attorney.
:::

## Where to find your online account number

Log in to **my.uscis.gov**, go to your profile (click your name at the top right), and look for "USCIS online account number" or "Account number." It is typically a long numeric string.

:::tip
title: When is the online account number used?
- Your employer's attorney files a paper I-129 H1B on your behalf (you are the beneficiary)
- The attorney enters your online account number on the petition so the case appears in your myUSCIS account
- USCIS mails you a notice with an **online access code** as an alternative linking method
- You are responding to an RFE online through myUSCIS for a paper-filed case
:::

## Online account number vs A-Number

:::compare
✓ Online account number: Created by you when you register on my.uscis.gov. Used only on the myUSCIS platform to link cases. Not a legal immigration document identifier.
✗ A-Number: Assigned by USCIS when you have an immigration record. Appears on physical immigration documents. Required for biometrics, passport applications, and background checks.
:::

## Who needs to share their online account number?

If your employer or attorney filed a **paper petition** on your behalf and wants to link the case to your myUSCIS account so you can track it online, they will ask for your USCIS online account number. You provide this number directly to your attorney — do not post it publicly.

:::warn
title: Privacy note
Your USCIS online account number is not a secret in the same way your A-Number is, but it should still be shared only with your authorized attorney or representative. Do not share it with unauthorized third parties or "case status checking" services.
:::

## Frequently asked questions

### I do not have a myUSCIS account. Do I need one?
You do not need a myUSCIS account to check basic case status (you can use egov.uscis.gov). However, if you want to track paper-filed cases, receive online notifications, or respond to RFEs electronically, a myUSCIS account is useful. Creating one is free at my.uscis.gov.

### Can I change my online account number?
No. The USCIS online account number is assigned by the system when you create your account and cannot be changed or chosen.

### My attorney asked for my "USCIS account number" — is that the same as online account number?
Yes. "USCIS account number," "USCIS online account number," and "online account number" all refer to the same identifier from your myUSCIS profile.

:::cta
title: Learn how to add a paper-filed case to your account
body: Once you have your online account number, adding your paper petition to myUSCIS takes a few steps.
button: Add paper case guide →
href: /uscis/add-paper-case-to-account
:::`,
  },

  /* ── 2. Online Access Code ───────────────────────────────────────────── */
  {
    slug: "online-access-code",
    answerFirst: true,
    kind: "reference",
    title: "USCIS Online Access Code: How to Get and Use It (2026)",
    seoTitle: "USCIS Online Access Code: How to Get and Use It",
    metaDescription:
      "A USCIS online access code is a one-time mailed code that links a paper case to myUSCIS. Where to find it, how to enter it, and what if it expired.",
    navLabel: "Online Access Code",
    excerpt:
      "A USCIS online access code is a one-time code mailed to you that lets you add a paper-filed case to your myUSCIS account without needing the petitioner's involvement.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
A **USCIS online access code** is a one-time alphanumeric code that USCIS **mails on paper** to the address on your petition. You enter it at **my.uscis.gov** together with your **13-character receipt number** to link a paper-filed case to your online account, so you can track it like an online filing. It is **not** your receipt number and **not** your USCIS online account number. There is **no way to look it up online** — if it never arrived or expired, call USCIS at **1-800-375-5283** or have your attorney link the case with your online account number instead.
:::

:::key
- Look for a **separate mailed notice** — the access code does not appear on your I-797C receipt notice.
- Enter it with your **13-character receipt number** (for example EAC, LIN, WAC, SRC or IOE) at my.uscis.gov.
- Act quickly: codes carry an **expiration date** printed on the notice.
- Check the address on the petition, not your current one — USCIS mails the code to the address **on file at filing**.
- Skip the code entirely if your attorney entered your **online account number** on the petition before filing.
:::

If USCIS mailed you a notice with an access code and you are not sure what to do with it, this page is the short version: it is the key that links a paper-filed petition to your online myUSCIS dashboard. This guide is for anyone whose employer or attorney filed on paper — H-1B I-129 petitions, family I-130s, I-485s — who wants online status visibility instead of waiting for mailed notices. The single most important thing to know: the code arrives **only by postal mail**, cannot be retrieved from any website, and expires, so if the notice went to an old address you need to call USCIS rather than hunt for it online. Below: exactly what the code is and where to find it on the notice, how to enter it step by step, how it differs from the receipt number and online account number, what to do when it expires or never arrives, and the common errors that stop a case from linking.

## What Is a USCIS Online Access Code?

When USCIS receives a **paper-filed petition** (such as an I-129 H1B filed by an employer on paper), they send a **Notice of Action (I-797C)** with a receipt number — and in some cases they also mail a **separate notice containing an online access code** to the beneficiary's address.

The access code is typically:
- A string of letters and numbers printed on the notice
- Valid for a limited time (check the notice for expiration)
- Specific to one case/receipt number

:::warn
title: Your access code is mailed to your address on file
USCIS sends the online access code to the address listed on your paper petition — not necessarily your current address. If you have moved since filing, the notice may go to the old address. Check with your employer's attorney about the address used on the petition.
:::

## How Do You Enter a USCIS Online Access Code?

:::steps
title: Steps to enter your online access code
1. Go to **my.uscis.gov** and log in (or create a free account first)
2. On your dashboard, look for "Add a case" or "Link a paper case"
3. Enter your **receipt number** (from your I-797 notice)
4. When prompted, enter the **online access code** from your separate code notice
5. The case will appear in your myUSCIS dashboard with available status updates
:::

## Access Code vs Receipt Number vs Online Account Number

These three numbers get confused constantly. Only one of them is the access code:

| Identifier | Looks like | Where it comes from | What it does |
|---|---|---|---|
| **Online access code** | Short alphanumeric code | Mailed on a separate USCIS notice | One-time link of a paper case to your account |
| **Receipt number** | 13 characters, e.g. EAC2412345678 | Printed on your I-797C | Permanently identifies the case |
| **USCIS online account number** | 12-digit number | Shown in your myUSCIS profile | Given to your attorney *before* filing |
| **A-number** | A + 8–9 digits | On green card / notices | Identifies you, not the case |

Both the access code and the online account number can link a paper case — but they work differently:

:::compare
✓ Online access code: USCIS mails it to your address. You enter it yourself on myUSCIS. Works even if your attorney did not enter your account number on the petition.
✗ Online account number: You give it to your attorney before filing. They enter it on the paper petition. Requires coordination before the petition is filed.
:::

## What If Your Access Code Expired or Never Arrived?

If the code has expired or you never received a code notice:
- Your **employer's attorney** can link the case on their end using your online account number
- You can contact USCIS to request a new code (call 1-800-375-5283)
- For basic status, you can always use egov.uscis.gov with just your receipt number

| Your situation | What to do | Realistic timing |
|---|---|---|
| Code notice never arrived | Confirm the address used on the petition, then call USCIS | Allow time for re-mailing |
| Code expired | Call 1-800-375-5283 and request a new code | New notice arrives by mail |
| Moved since filing | File Form AR-11 change of address, then request a new code | Update address first |
| Code rejected as invalid | Re-enter without spaces, all uppercase | Immediate |
| Case still not showing after entry | Wait 24–48 hours for systems to sync | 1–2 days |
| Need status right now | Use egov.uscis.gov with the receipt number alone | Immediate |

## How This Connects to the Rest of Your USCIS Account

Linking a paper case is one step in a bigger picture: the [myUSCIS account](/uscis/myuscis-account) is where notices, RFEs and decisions appear online, while the [case status portal](/uscis/case-status) shows the one-line status using only a receipt number. If you are unsure which tool to use, the [myUSCIS vs case status comparison](/uscis/myuscis-vs-case-status) lays out what each one can and cannot show. Your [receipt number](/uscis/receipt-number) is the constant across all of them — and once the case is linked, [what each status message means](/uscis/case-status) becomes the next thing worth understanding.

## Frequently asked questions

### How do I get a USCIS online access code?
You do not request it in advance — USCIS mails it automatically on a separate notice to the address on your paper petition. There is no way to look it up online. If it never arrived or has expired, call USCIS at 1-800-375-5283 to request a new one, or ask your attorney to link the case using your online account number instead.

### Where do I find my USCIS online access code?
On the paper notice USCIS mailed you — it is a separate document from the I-797C receipt notice, and the code is printed on it along with an expiration date. It does not appear anywhere in your online account, in email, or on the receipt notice itself.

### How long is a USCIS online access code valid?
Each notice prints its own expiration date, so check the notice rather than assuming. Once it lapses you cannot reuse it; call USCIS for a replacement or link the case through your online account number.

### Can I add a paper-filed case to myUSCIS without an access code?
Yes, if your attorney entered your 12-digit USCIS online account number on the petition before filing — then the case links automatically. Without either the code or that pre-filing coordination, you cannot self-link, but you can still check status at egov.uscis.gov with the receipt number.

### Does every paper petition come with an online access code?
Not always. Access code notices are sent for many paper-filed cases but not all. Whether you receive one depends on USCIS systems and the specific form. Your attorney can also link the case using your online account number.

### I entered my access code but the case is not showing. What next?
Allow 24–48 hours for the system to sync. If the case still does not appear, check that you entered the receipt number correctly (no spaces, all uppercase). Contact USCIS if the issue persists.

### Is the access code the same as the receipt number?
No. The receipt number (13 characters, starts with 3 letters like EAC or LIN) is your permanent case tracking number. The access code is a temporary one-time code for linking the case to your myUSCIS dashboard.

:::cta
title: See the step-by-step guide for adding a paper case
body: After you have your access code or online account number, follow these steps to link your petition.
button: Add paper case guide →
href: /uscis/add-paper-case-to-account
:::`,
  },

  /* ── 3. Add Paper Case to Account ───────────────────────────────────── */
  {
    slug: "add-paper-case-to-account",
    kind: "guide",
    title: "How to Add a Paper-Filed Case to Your myUSCIS Account",
    seoTitle: "How to Add Paper Case to myUSCIS Account | Online Account Number or Access Code",
    metaDescription:
      "Step-by-step guide to adding a paper-filed USCIS case (H1B, I-140, I-485) to your myUSCIS account using your online account number or online access code.",
    navLabel: "Add Paper Case",
    excerpt:
      "If your employer filed your H1B or green card petition on paper, here is how to link it to your myUSCIS account for online tracking.",
    date: "2026-06-16",
    content: `:::summary
Most employer-sponsored H1B and green card petitions are **paper-filed** by your employer's attorney. To track these in your myUSCIS account, you either need your attorney to enter your **USCIS online account number** on the petition before filing, OR you use the **online access code** that USCIS mails to you after filing. Both methods are free and do not require sharing your A-Number or receipt number with USCIS again.
:::

## Method 1 — Online account number (before filing)

This method requires coordination with your attorney **before the petition is submitted**.

:::steps
title: Method 1 steps
1. Create a myUSCIS account at my.uscis.gov if you do not have one
2. Go to your profile and locate your **USCIS online account number**
3. Send this number to your employer's immigration attorney
4. The attorney enters it in the appropriate field on the paper petition (e.g., Part 5 of I-129 for H1B)
5. After USCIS receives the petition and creates a receipt, the case links to your account automatically
:::

## Method 2 — Online access code (after filing)

This method works after filing, using a code USCIS mails to you.

:::steps
title: Method 2 steps
1. Wait for USCIS to mail an **online access code notice** to the address on your petition
2. Create or log in to your myUSCIS account at my.uscis.gov
3. On your dashboard, click **"Add a case"** or **"Link a paper case"**
4. Enter your 13-character **receipt number** from your I-797 notice
5. Enter the **online access code** from the separate mailed notice
6. The case appears in your myUSCIS dashboard within 24–48 hours
:::

## What you can see after linking

Once a paper case is linked to your myUSCIS account, you can typically:
- View the current case status (same as egov.uscis.gov, but in your dashboard)
- Receive email or text notifications when your status changes
- In some cases, respond to RFEs or upload evidence electronically
- See notices associated with the case

:::warn
title: What you cannot do via myUSCIS for paper-filed cases
- You cannot change the filing details or petition contents
- You cannot file new forms through the paper case link — those require separate filings
- Not all paper-filed forms have full online functionality — I-485 updates may be more limited than I-129
:::

## Common situations

:::info
title: H1B worker (I-129 petition)
Your employer's attorney files I-129 on paper. Give your attorney your USCIS online account number before they file. After filing, USCIS sends an access code to your address as a backup linking method.
:::

:::info
title: I-140 green card petition
I-140 is filed by your employer on your behalf. Same process: give attorney your online account number before filing, or use access code after receipt notice arrives.
:::

:::info
title: I-485 adjustment of status
I-485 can be filed on paper (typically by an attorney package). If concurrently filed with I-140, both may appear in your account once linked.
:::

## Frequently asked questions

### My attorney says they did not enter my online account number. Can I still link my case?
Yes — use Method 2 (access code). USCIS will mail the code to the address on your petition. If you have not received it after 8 weeks, contact your attorney or USCIS.

### I have multiple cases. Do I need to link each one separately?
Yes. Each paper case must be linked individually using its own receipt number and access code (or your account number, if the attorney entered it for each petition).

### Can my attorney see my myUSCIS account after I link the case?
Linking a case to your account does not automatically give your attorney access to your account. Your attorney has their own representative account with USCIS. Your myUSCIS account is personal.

:::cta
title: Check your USCIS case status meaning
body: Once your case is linked, use the USCIS Case Status Meaning Tool to understand what each status update means.
button: USCIS Status Decoder →
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ── 4. myUSCIS vs Case Status ───────────────────────────────────────── */
  {
    slug: "myuscis-vs-case-status",
    answerFirst: true,
    kind: "guide",
    title: "myUSCIS vs Case Status: What's the Difference? (2026)",
    seoTitle: "myUSCIS vs USCIS Case Status: What's the Difference?",
    metaDescription:
      "myUSCIS (my.uscis.gov) needs a login and shows all cases plus alerts; the case status portal needs only a 13-digit receipt number. Which to use, and when.",
    navLabel: "myUSCIS vs Case Status",
    excerpt:
      "myUSCIS (my.uscis.gov) is a full account dashboard. The case status portal (egov.uscis.gov) is a quick receipt number lookup. Here is when to use each.",
    date: "2026-06-16",
    updated: "2026-07-20",
    content: `:::quickanswer
They are two different USCIS websites. **myUSCIS** (my.uscis.gov) is a **personal account** — you log in, see every linked case in one dashboard, get email/text alerts, and for some forms respond to RFEs or file online. The **case status portal** (egov.uscis.gov/casestatus) is a **public lookup** needing only your **13-character receipt number** and no login. Both read the **same underlying case record**, so the status itself never differs — myUSCIS simply does more with it. A paper-filed case only appears in myUSCIS after you link it with an **online access code** or your attorney's use of your online account number.
:::

:::key
- Use the **case status portal** for a 10-second check — receipt number only, no account, works for anyone's case.
- Create **myUSCIS** if you want alerts: it notifies you on status change instead of you refreshing daily.
- Expect **identical status data** from both — they read one database, so a mismatch is a display delay, not two different answers.
- Link paper-filed cases first — they show in myUSCIS only after an **access code** or pre-filing online account number.
- Know the limit: creating an account is **read-only** and never affects, triggers, or delays adjudication.
:::

If you have ever wondered why your case shows up on one USCIS website but not the other, this is the explanation. myUSCIS and the case status portal look similar, serve different jobs, and confuse a lot of applicants — especially those on employer-filed H-1B petitions where the paper case does not automatically appear in a personal account. This guide covers what each site does, which one to use in which situation, why a paper-filed case may be missing from myUSCIS, whether the two can disagree, and what an account genuinely adds for H-1B, I-485, EAD and N-400 applicants. The short version: the portal answers "what is my status right now," while myUSCIS answers "tell me the moment anything changes."

## Quick comparison

| Feature | myUSCIS (my.uscis.gov) | Case Status Portal (egov.uscis.gov) |
|---|---|---|
| Login required | Yes | No |
| Link paper cases | Yes (with account number or access code) | No |
| Email/text alerts | Yes | No |
| Respond to RFEs online | Some forms | No |
| View all your cases at once | Yes | No (one at a time) |
| Underlying status data | Same | Same |
| Filing new applications | Some forms | No |

## When Should You Use the Case Status Portal?

Use **egov.uscis.gov/casestatus** when:
- You want a quick status check with just your receipt number
- You do not have a myUSCIS account
- You are checking status on behalf of a family member using their receipt number
- You just want to see the current status message without logging in

## When Should You Use myUSCIS?

Use **my.uscis.gov** when:
- You want status notifications without manually checking
- You want to see all your USCIS cases in one dashboard
- Your attorney says your case has an online response option for an RFE
- You want to schedule a biometrics appointment or InfoPass (if available)
- You need to update your address (AR-11) online

:::tip
title: Both show the same status data
Do not worry if the status on myUSCIS and egov.uscis.gov shows slightly different wording — the underlying case record is the same. USCIS updates both systems from the same database. If there is a discrepancy, wait 24 hours before taking action.
:::

## Is a myUSCIS Account Required for H-1B or I-485?

No, a myUSCIS account is not required for most immigration processes. Your attorney and employer handle all official filings. However, it is useful for:

:::info
title: When myUSCIS adds real value for Indians
- **H1B workers:** Get notified the moment your employer's attorney gets a receipt notice or your case status changes — before the attorney may call you.
- **I-485 applicants:** If USCIS authorizes online responses for your case, you can upload evidence through your account.
- **EAD/AP applicants:** Some I-765/I-131 renewals can be filed directly through myUSCIS instead of paper.
- **N-400 applicants:** N-400 for naturalization can be filed online through myUSCIS.
:::

## Why Isn't My Case Showing in myUSCIS?

Almost always because it was **filed on paper and never linked** — not because something is wrong. A case appears in your account only if it was filed online under your account, or you linked it afterwards.

| Symptom | Most likely cause | Fix |
|---|---|---|
| Employer-filed H-1B missing | Paper I-129, never linked to you | Link with the mailed online access code |
| Case linked but no updates | Normal — status only changes at real milestones | Enable alerts, check the portal |
| "Case not found" in the portal | Receipt number mistyped, or too recently filed | Re-enter without spaces; allow a few days |
| Attorney sees updates you don't | Case sits in the attorney's account | Ask them to add your online account number |
| Status differs between the two sites | Display sync delay | Wait 24–48 hours before acting |

## How This Connects to the Rest of Your USCIS Account

These two sites are the front door; the details live elsewhere. To link a paper case you need the [online access code](/uscis/online-access-code) USCIS mails you, and every lookup on either site needs your [receipt number](/uscis/receipt-number) — the 13-character code whose prefix also tells you which service center holds the case. Once you can see a status, [what each status message means](/uscis/case-status) is the next question, and the [myUSCIS account guide](/uscis/myuscis-account) covers setup, alerts and privacy.

## Frequently asked questions

### What is the difference between myUSCIS and USCIS case status?
myUSCIS is a personal account requiring a login that shows all your linked cases, sends alerts, and allows online filing or RFE responses for some forms. The case status portal is a public page that returns one case's status from a 13-character receipt number with no account. Both read the same case record.

### Why is my case not showing in my myUSCIS account?
Most often because it was filed on paper and has not been linked to your account. Paper cases appear only after you enter the online access code USCIS mails you, or if your attorney entered your USCIS online account number on the petition before filing.

### Can I add my case to my myUSCIS account?
Yes, if it was paper-filed and you have the online access code that USCIS mailed to the address on the petition — enter it with your receipt number under "Add a case." Without a code, ask your attorney to link it using your 12-digit online account number, or call USCIS at 1-800-375-5283 for a replacement code.

### Does creating a myUSCIS account affect my pending case?
No. Creating an account and linking a case is read-only from USCIS's side — it does not change your case, trigger a review, or affect adjudication in any way.

### My status on myUSCIS says something different than what I see on the USCIS status portal. Which is correct?
Both pull from the same USCIS system. If there is a discrepancy, it is likely a display delay. Wait 24–48 hours. If the difference persists, contact USCIS at 1-800-375-5283.

### Can USCIS see my login activity or what I look at in myUSCIS?
USCIS operates the platform, so yes — they can see account activity at the platform level, but routine case status checks do not trigger any immigration review. See the [account privacy guide](/uscis/account-privacy) for more detail.

:::cta
title: Decode your current case status
body: Once you know the status in myUSCIS or the portal, use our USCIS Status Decoder to understand what it means for your specific form.
button: USCIS Status Decoder →
href: /tools/uscis-case-status-meaning
:::`,
  },

  /* ── 5. Change Address ───────────────────────────────────────────────── */
  {
    slug: "change-address",
    kind: "guide",
    title: "How to Change Your Address with USCIS | AR-11 and myUSCIS",
    seoTitle: "How to Change Address with USCIS | AR-11 Form for Indians",
    metaDescription:
      "Non-citizens must update their address with USCIS within 10 days of moving. Learn how to file AR-11 online, through myUSCIS, or by mail — and what happens if you miss the deadline.",
    navLabel: "Change Address (AR-11)",
    excerpt:
      "All non-citizens must notify USCIS of an address change within 10 days of moving using Form AR-11 or the online change-of-address portal.",
    date: "2026-06-16",
    content: `:::summary
If you are a non-citizen in the US (on H1B, H4, F1, green card, or any other status), you are **legally required** to notify USCIS of any address change within **10 days** of moving. The form is **AR-11 (Alien's Change of Address Card)**. You can do it online for free at uscis.gov/ar-11 — no fee, no attorney needed. Failure to report an address change can result in fines.
:::

## Who must file AR-11?

:::warn
title: Required for nearly all non-citizens
Almost all non-citizens in the US — including H1B workers, H4 dependents, F1 students, I-485 applicants, green card holders, and others — are required by law (8 U.S.C. § 1305) to file AR-11 within 10 days of any address change. US citizens are exempt.
:::

## How to change your address online (fastest)

:::steps
title: Filing AR-11 online
1. Go to **uscis.gov/ar-11** (USCIS Change of Address portal)
2. Have your A-Number (if you have one), current address, and new address ready
3. Fill in the form — no fee required
4. Submit — you will receive a confirmation on screen and by email
5. The change is applied to all your pending USCIS cases
:::

## How to change your address in myUSCIS

If you have a myUSCIS account, you can also update your address there:
- Log in at my.uscis.gov
- Go to your profile settings
- Update your address

:::tip
title: Update address with your employer's attorney too
USCIS notices, RFEs, and interview letters are mailed to the address on file. If your attorney filed on paper, they should also update USCIS directly — the online AR-11 updates USCIS's main system, but the attorney's petition address may also need correction via a written notice to the relevant service center.
:::

## What happens if you miss the 10-day deadline?

Missing the AR-11 deadline can result in:
- A civil fine of up to $200
- In serious cases, cited as evidence of immigration violation
- Most importantly: **critical USCIS notices going to your old address** — including RFEs with 87-day deadlines, biometrics notices, and green card/EAD delivery

:::warn
title: Address for pending I-485 is especially critical
If you have a pending I-485 (adjustment of status), USCIS sends the interview notice, any RFE, and the approval/denial to the address on file. A missed RFE because notices went to an old address can result in an automatic denial. Update your address immediately when you move.
:::

## Special cases for pending cases

- **H1B (I-129):** Your employer's attorney needs to notify USCIS of your change of address in writing, in addition to your own AR-11.
- **I-485:** File AR-11 AND ask your attorney to notify USCIS directly. Some field offices also require written notification in the case file.
- **N-400:** Update your address in both AR-11 and your myUSCIS account where you filed.

## Frequently asked questions

### Do I need to file AR-11 every time I move, even temporarily?
Yes, if the move constitutes a "change of address." Temporary stays under 30 days at a hotel while keeping your primary address are generally not moves for AR-11 purposes, but any permanent or semi-permanent new address requires AR-11.

### I filed AR-11. How long until USCIS updates my records?
Online filings are typically processed within a few days. For pending cases, allow 1–2 weeks for the address to update across all your case files. Verify by calling USCIS if a critical notice is expected.

### Does filing AR-11 update my address on a pending I-130 or I-485?
It should. The online AR-11 updates USCIS's central records, which links to pending cases. However, for extra protection on pending I-485 or I-130, ask your attorney to file a written change of address notice directly with the service center handling your case.

:::cta
title: Back to myUSCIS account guide
body: Learn everything about myUSCIS including notices, access codes, and privacy.
button: myUSCIS Account Guide →
href: /uscis/myuscis-account
:::`,
  },

  /* ── 6. I-797 Notice ─────────────────────────────────────────────────── */
  {
    slug: "i-797-notice",
    kind: "reference",
    title: "USCIS I-797 Notice Explained | Types A, B, C, D for Indians",
    seoTitle: "USCIS I-797 Notice: Types A B C D Explained for Indians",
    metaDescription:
      "What is a USCIS I-797 notice? Understand the difference between I-797A, I-797B, I-797C, and I-797D — approval notices, receipt notices, and transfer notices for H1B, I-485, EAD.",
    navLabel: "I-797 Notice Types",
    excerpt:
      "The I-797 is the official USCIS Notice of Action. It comes in four types — A (approval with I-94), B (approval without I-94), C (receipt/transfer/rejection), and D (replacement).",
    date: "2026-06-16",
    content: `:::summary
**Form I-797** is the official USCIS **Notice of Action** — the document USCIS mails to confirm receipt, approval, transfer, or rejection of your petition. There are four variants (A, B, C, D) with different meanings. Always keep your original I-797 notices — they are legal immigration documents. An I-797A approval notice for H1B contains a new I-94 at the bottom, which is valid proof of status.
:::

## The four types of I-797

| Type | Name | What it means | Has I-94? |
|---|---|---|---|
| **I-797A** | Approval Notice (with I-94) | Petition approved; new I-94 attached at bottom | Yes |
| **I-797B** | Approval Notice (without I-94) | Petition approved; no new I-94 (petitioner is outside US) | No |
| **I-797C** | Notice of Action (informational) | Receipt, transfer, rejection, or biometrics notice | No |
| **I-797D** | Combination notice | Accompanies an action item (such as a combo EAD/AP card explanation) | No |

## I-797A — Approval with I-94 (most important for H1B workers)

The **I-797A** is the H1B approval notice that nearly every Indian H1B worker receives. The tear-off section at the bottom is a **new Form I-94** showing your authorized stay period. Key points:

:::info
title: Critical I-797A facts for H1B workers
- The bottom I-94 portion replaces your prior I-94 and authorizes your stay period
- Keep the physical original — it is often required for visa stamping, border re-entry, and some employment verifications
- The "Valid To" date on the I-94 section is your authorized stay expiration — not the same as your visa stamp expiration
- If your I-797A is lost or damaged, you can request a replacement I-797 (Form I-290B process or call USCIS)
:::

## I-797C — Receipt and informational notices

The **I-797C** is the most common notice you will receive at various stages:

- **Receipt notice:** Confirms USCIS received your filing. Contains your 13-character receipt number.
- **Transfer notice:** Case moved to a different service center. Your receipt number does not change.
- **Rejection notice:** Your filing was rejected (usually for incorrect fee, missing signature, or wrong form version). Different from a denial.
- **Biometrics notice:** Appointment scheduled at an Application Support Center.
- **Online access code notice:** Contains the code to link your paper case to myUSCIS.

:::warn
title: Rejection vs denial — a critical difference
An I-797C rejection notice means your package was returned without being filed (fee issue, missing signature). A denial is an adjudicated decision against your case. A rejected filing can be refiled; a denial requires an appeal or motion.
:::

## What to check on any I-797 notice

:::tip
title: Always verify these fields on receipt
1. Your full name — spelled correctly
2. Your date of birth
3. The form type and petition category
4. The priority date (on I-140 and some I-129 approvals)
5. The validity period (on I-797A — both petition period and I-94 section)
6. The service center code in the receipt number (matches where your case was filed)
:::

## I-797 for green card (I-140, I-485)

- **I-140 approval (I-797B or I-797A):** Establishes your priority date. The priority date is printed on the notice — verify it matches what your attorney told you.
- **I-485 receipt (I-797C):** Confirms USCIS received your adjustment of status filing. This receipt is important — it triggers your 240-day work authorization extension if your H1B is expiring.

## Frequently asked questions

### My I-797A was lost. Can I get a replacement?
Contact USCIS at 1-800-375-5283 or submit a case inquiry. For approved petitions, your attorney may be able to obtain a duplicate approval notice. The I-94 portion can also be verified or reprinted at cbp.dhs.gov/I94.

### My I-797C says my case was transferred. Does my receipt number change?
No. Your receipt number stays the same after a transfer. Only the service center handling your case changes. Update your wait-time expectations based on the new center's published processing times.

### My priority date on the I-140 approval looks wrong. What should I do?
Contact your immigration attorney immediately. Priority date errors on the I-797 can often be corrected by filing a written request with USCIS. Do not wait — the priority date controls your entire green card wait time.

:::cta
title: Understand what your USCIS notice means
body: Use the USCIS Notice Decoder to get plain-English guidance for your specific notice type and form.
button: USCIS Notice Decoder →
href: /tools/uscis-notice-decoder
:::`,
  },

  /* ── 7. RFE Notice ───────────────────────────────────────────────────── */
  {
    slug: "rfe-notice",
    kind: "guide",
    title: "USCIS RFE Notice: How to Decode It and Respond",
    seoTitle: "USCIS RFE Notice: Decode It & Response Checklist",
    metaDescription:
      "Decode your USCIS RFE notice field by field — the response deadline, legal basis, specific issues, and submission instructions — then work the response checklist. For H-1B, I-140, I-485 and EAD.",
    navLabel: "RFE Notice",
    excerpt:
      "Holding a USCIS RFE? This guide decodes the notice field by field — deadline, legal basis, the specific issues — and gives you a response checklist so nothing is missed before the deadline.",
    date: "2026-06-16",
    updated: "2026-07-21",
    content: `:::summary
This guide is for when you are **holding the actual RFE notice** and need to read it correctly. A **Request for Evidence (RFE)** is an official USCIS notice (on Form I-797) asking for more documentation or clarification — it is **not a denial**, and many cases with RFEs are approved. The critical field is the **response deadline**, usually **87 days** from the notice date; a late or incomplete response results in automatic denial. For the bigger picture — what an RFE is and why USCIS issues them — see the [RFE meaning & process guide](/uscis/request-for-evidence-rfe).
:::

## What an RFE notice contains

When you receive an RFE, the notice will include:

:::info
title: Key elements in every RFE notice
1. **Response deadline date:** The specific date by which USCIS must receive your complete response — not the postmark date, but the receipt date
2. **The legal basis:** The specific statute, regulation, or policy USCIS is citing
3. **The specific issues:** What evidence is lacking or insufficient
4. **Instructions for submission:** Where to mail or upload your response
5. **Whether premium processing is suspended:** For I-129 H1B, premium processing may be paused during the RFE response period
:::

## What to check immediately on your RFE

:::warn
title: Deadline is the first thing to check
1. Find the "Response Due" date on the first page
2. Note the mailing address or online submission instructions for your response
3. Mark your calendar — give your attorney at least 3–4 weeks before the deadline to prepare
4. Do not wait to contact your attorney — RFE responses require significant preparation time
:::

## Common RFE reasons by form

- **I-129 H1B:** Specialty occupation documentation, employer-employee relationship, degree equivalency, beneficiary qualifications
- **I-140 EB-2:** Evidence of advanced degree or exceptional ability, progressive job offers
- **I-140 EB-1:** Evidence of extraordinary ability, peer review letters, citation records
- **I-485:** Missing civil documents, police clearance, medical exam follow-up, public charge evidence
- **I-765 EAD:** Missing supporting documents for EAD eligibility category

## Responding to an RFE

:::steps
title: How the RFE response process works
1. Attorney receives the RFE notice (mailed to the attorney of record)
2. Attorney shares the notice with you and requests any needed documents from you
3. Attorney prepares a legal brief and assembles evidence
4. Response is submitted by the deadline — either by mail to the specified address or online (if your case has that option)
5. USCIS resumes adjudication — may approve, deny, or issue a second RFE (NOID)
:::

:::tip
title: Do not cut corners on RFE responses
A complete, well-organized RFE response with a strong legal brief is significantly more likely to succeed than a partial response submitted in a hurry. Trust your attorney's timeline — rushing is rarely the right move if the deadline allows preparation time.
:::

## RFE vs NOID

An RFE (Request for Evidence) is asking for more evidence — a relatively normal part of adjudication. A NOID (Notice of Intent to Deny) is more serious: USCIS is telling you they plan to deny but giving you a chance to respond. NOIDs have shorter response windows (usually 30 days) and represent a higher-risk situation requiring urgent attorney involvement.

## Which RFE guide do I need?

| What you need | Guide |
|---|---|
| What an RFE is, why you got one, likely outcomes | [RFE meaning & process guide](/uscis/request-for-evidence-rfe) |
| Decode the fields on your actual notice + a response checklist | **You are here** — RFE notice guide |
| H-1B-specific RFE types and evidence | [H-1B RFE guide](/h1b/rfe) |

## Frequently asked questions

### Do I need to do anything personally when my attorney gets an RFE?
Yes — your attorney may need documents from you such as degree certificates, pay stubs, tax returns, employment letters, or expert opinion letters. Respond to your attorney's requests promptly. Delays on your end compress the time available for the legal brief.

### Will an RFE hurt my future immigration applications?
An RFE on a prior case does not appear as a negative mark on subsequent applications. What matters is how the case was resolved. An approved case after an RFE is a fully approved case.

### Can USCIS issue a second RFE on the same case?
Technically yes, though it is uncommon. If a first response was incomplete, USCIS may issue another notice. They can also issue a NOID instead of a second RFE.

### My H1B RFE is about specialty occupation. Is that serious?
Specialty occupation RFEs have become more common, especially for IT staffing and consulting roles. A strong response with clear evidence of the position's specific requirements and your credentials is essential. Some cases are approved; others are denied even with a strong response. Discuss the realistic outcome with your attorney honestly.

:::cta
title: Check if your USCIS case is delayed
body: Has your case been pending longer than expected after an RFE response? Use the Processing Delay Checker.
button: Processing Delay Checker →
href: /tools/uscis-processing-delay-checker
:::`,
  },

  /* ── 8. Approval Notice ──────────────────────────────────────────────── */
  {
    slug: "approval-notice",
    kind: "reference",
    title: "USCIS Approval Notice Explained | I-797A and I-797B for Indians",
    seoTitle: "USCIS Approval Notice Explained | H1B, I-140, I-485, EAD India",
    metaDescription:
      "What does a USCIS approval notice mean? Understand I-797A and I-797B for H1B, I-140, I-485, EAD, and N-400. What to check, what to do next, and when to contact your attorney.",
    navLabel: "Approval Notice",
    excerpt:
      "A USCIS approval notice (I-797A or I-797B) confirms your petition or application was approved. What you do next depends heavily on which form was approved.",
    date: "2026-06-16",
    content: `:::summary
A **USCIS approval notice** is an I-797A or I-797B confirming that your petition or application was approved. What happens next depends entirely on which form was approved: H1B approval gives you a new I-94; I-140 approval establishes your priority date; I-485 approval means your green card is coming; EAD approval means your work card is being produced. Read the approval notice carefully — it contains specific validity dates and instructions.
:::

## What an approval notice confirms

When you receive an approval notice, USCIS has:
- Reviewed your petition or application
- Determined you meet the legal requirements
- Approved the petition for the requested classification and period

:::tip
title: Store original approval notices safely
All I-797 approval notices are legal immigration documents. Keep originals in a secure location (not your employer's office). You may need them for visa stamping, re-entry at the border, employment verification (I-9), or future immigration filings.
:::

## H1B approval (I-797A)

An H1B approval (I-797A) includes a **tear-off I-94 at the bottom**. Key items to verify:

:::info
title: Check these fields on your H1B I-797A
- Your full legal name (matches passport)
- Employer name (exact match to petition)
- Petition validity dates (start and end dates)
- Classification code (H-1B1 or H-1B)
- I-94 section at bottom: authorized stay from/to dates
- Priority date if applicable (generally not on H1B but check)
:::

The I-94 at the bottom replaces your prior I-94 and is valid proof of your H1B status until the "To" date shown. If you travel internationally after H1B approval, CBP at the border creates a new I-94 at entry — your I-797A I-94 is superseded by the CBP I-94 (verifiable at cbp.dhs.gov/I94).

## I-140 approval (I-797B)

An I-140 approval establishes your **priority date** for the green card queue. Key items:

:::info
title: What to verify on I-140 approval notice
- Priority date (usually date PERM was filed — verify it matches your attorney's records exactly)
- Petition classification (EB-1A, EB-2, EB-3 — must match your intended category)
- Petitioner name (your employer)
- Beneficiary name (your name as it appears)
:::

:::warn
title: Priority date error on I-140 is critical
If the priority date on your I-140 approval is wrong by even one day, your entire wait time in the visa queue is affected. Contact your attorney immediately if the date is incorrect — USCIS can correct it with supporting documentation.
:::

## I-485 approval

I-485 (adjustment of status) approval means your **green card application was approved**. After the approval notice:
- Your card will be mailed separately after "Card Is Being Produced" status
- The card arrival takes 7–30 days after "Card Was Mailed" status
- You can work and travel using the card itself once received

## EAD (I-765) approval

EAD approval is followed by **card production**. The approval notice itself is not the EAD card — the physical card is produced and mailed separately. Do not attempt to work based on the approval notice alone; wait for the physical EAD card.

## N-400 (naturalization) approval

After N-400 approval, you will be scheduled for an **oath ceremony**. The approval notice will include scheduling information or instructions on checking for your ceremony date.

## Frequently asked questions

### My H1B approval dates are shorter than what was requested. Is that normal?
Yes. USCIS sometimes approves for a shorter period than requested (known as an abbreviated approval). This happens if your employer's LCA was for a shorter period or if USCIS has concerns about the petition term. It is a valid approval for the period shown.

### My H1B is approved but my visa stamp expired. Can I still work?
Yes. H1B status and the visa stamp are separate. The visa stamp is for entry at the border. The I-797A approval notice and the I-94 at its bottom authorize you to work in the US. You only need a new visa stamp to travel internationally.

### How long do I have before I must use my approved H1B?
An H1B approval is effective on the start date listed. If you need to start earlier, a corrected petition may be needed. If the start date passes without you beginning work for that employer, the approval may technically be abandoned — consult your attorney.

:::cta
title: Check your USCIS case status
body: Is your case still pending after the expected approval window? Check whether it is outside the normal processing time.
button: Processing Times →
href: /tools/processing-times
:::`,
  },

  /* ── 9. Account Privacy ──────────────────────────────────────────────── */
  {
    slug: "account-privacy",
    kind: "guide",
    title: "myUSCIS Account Privacy and Security Tips for Indians",
    seoTitle: "myUSCIS Account Privacy Tips | What USCIS Can See India",
    metaDescription:
      "Is myUSCIS safe to use? What can USCIS see in your account, what information not to put there, and security tips for Indian H1B and green card applicants.",
    navLabel: "Account Privacy",
    excerpt:
      "myUSCIS is operated by USCIS. Understand what USCIS can see, what not to enter in your account, and how to keep your login secure as an H1B or green card applicant.",
    date: "2026-06-16",
    content: `:::summary
**myUSCIS is operated by USCIS — a US government agency.** Everything you do in the account is on government servers. Routine case status checks and address updates are standard and do not trigger negative attention. However, you should understand what the platform does and does not collect, and practice basic account security to protect your login.
:::

## What USCIS can see in your myUSCIS account

USCIS operates the myUSCIS platform. As the platform operator, they can see:
- Your account registration information (name, email, date of birth used to create the account)
- Which cases you have linked to your account
- Case status views and notification settings
- Any documents or evidence you upload in response to RFEs through the platform
- Your address if updated through the platform

:::info
title: What USCIS sees — and what it means
Viewing your own case status on myUSCIS is entirely normal and expected. USCIS does not flag applicants for checking their case status frequently. Millions of applicants use myUSCIS daily without immigration consequences.
:::

## What not to put in your myUSCIS account

:::warn
title: Do not upload these to myUSCIS outside of an official case response
- Documents unrelated to an active case (travel journals, financial documents not requested, personal photos)
- Explanations or statements you have not reviewed with your immigration attorney
- Sensitive personal information beyond what registration requires
- Anything you would not want adjudicators to read, because uploaded documents in an active case response are part of your official record
:::

## Who else can see your myUSCIS account?

- **Your immigration attorney** can have their own USCIS representative account — they do NOT see your personal myUSCIS account directly. Linking a case to your account does not share your account with your attorney.
- **USCIS adjudicators** work with the case file, which includes documents you upload through the platform in official responses.
- **Other government agencies** may access USCIS records through interagency data sharing (FBI, CBP, SSA) — this is independent of your myUSCIS account and applies to your immigration record generally.

## Security tips for your myUSCIS account

:::tip
title: Account security best practices
1. **Use a strong, unique password** — do not reuse passwords from other sites
2. **Enable two-factor authentication (2FA)** if available on the platform
3. **Use your personal email address** — not your work email which your employer may control
4. **Do not share your login credentials** with your employer, attorney, or anyone else
5. **Log out** when using shared or public computers
6. **Use the official URL** — my.uscis.gov (not any look-alike site)
:::

## Is myUSCIS safe to use on a work device?

Technically functional, but not ideal. Your employer may have visibility into browser activity on company-managed devices. Use your personal device with a personal email for your myUSCIS account. This is especially relevant for H1B workers whose employer relationship may change.

## Can I use a VPN with myUSCIS?

myUSCIS has been known to block some VPN IP ranges. If you are having trouble accessing the site from a VPN, try disabling it temporarily for USCIS access. VPN use itself is not a USCIS concern.

## Frequently asked questions

### Will USCIS know if I check my case status many times a day?
Yes, in the sense that server logs record all activity. No, in the sense that checking your case status repeatedly has no immigration consequences. Many applicants check daily during anxious waiting periods — this is not unusual and does not affect adjudication.

### Should my employer have access to my myUSCIS account?
No. Your myUSCIS account is personal. Your employer's attorney has their own representative account to manage petitions they file. You do not need to share your personal login with your employer or attorney.

### What happens to my myUSCIS account if I leave the US permanently?
Your account remains accessible as long as you have your login credentials. There is no immigration consequence to retaining a myUSCIS account if you depart the US. You can close the account if you wish through account settings.

:::cta
title: Back to myUSCIS account guide
body: Return to the full myUSCIS account guide for setup, notices, and features.
button: myUSCIS Account Guide →
href: /uscis/myuscis-account
:::`,
  },
];

export const myuscisChildPages: MyuscisPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
}));

export const myuscisChildSlugs = myuscisChildPages.map((p) => p.slug);

export function getMyuscisChildPage(slug: string): MyuscisPage | undefined {
  return myuscisChildPages.find((p) => p.slug === slug);
}
