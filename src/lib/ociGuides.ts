import { computeReadingTime } from "@/lib/format";
import { formatUsd } from "@/lib/format";
import {
  GOVERNMENT_FEES,
  OCI_BASE,
  OCI_TOOLS,
  totalWeeksLabel,
} from "@/lib/oci/config";

/**
 * OCI guide cluster — three dense, comprehensive pillar pages that together
 * cover the entire OCI journey for Indians in the USA. Deliberately
 * consolidated (not 100+ thin pages) so each URL has real topical authority
 * and the tools do the interactive work.
 *
 *   /oci                 ← hub (custom page in app/oci/page.tsx)
 *     ├─ /how-to-apply   ← first-time application pillar
 *     ├─ /apostille      ← document apostille + state-by-state
 *     └─ /renewal        ← renewal, re-issue, lost card, updates
 *
 * Figures that are fees or processing times are interpolated from
 * src/lib/oci/config.ts — NEVER hardcoded here (single source of truth).
 * Body is authored in the same light-markdown + ::: fence format as
 * lib/passportCluster, rendered by ArticleBody.
 */

export interface OciGuideData {
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  /** Short label for nav cards. */
  navLabel: string;
  /** One-line hook shown on the hub guide card. */
  hook: string;
  icon: string;
  date: string;
  updated?: string;
  content: string;
}

export interface OciGuide extends OciGuideData {
  readingTime: number;
}

export const ociGuidePath = (slug: string) => `${OCI_BASE}/${slug}`;

const FRESH_ADULT = formatUsd(GOVERNMENT_FEES.freshAdult.amount);
const WEEKS = totalWeeksLabel();

const rawGuides: OciGuideData[] = [
  /* =============================================================== *
   * 1. HOW TO APPLY
   * =============================================================== */
  {
    slug: "how-to-apply",
    title: "How to Get an OCI Card in the USA (2026): Eligibility, Documents, Fees & Steps",
    seoTitle: "How to Apply for OCI in the USA (2026): Documents, Fees & Steps",
    metaDescription:
      "The complete 2026 guide to applying for an OCI card from the USA — who qualifies, the exact documents, government and VFS fees, the step-by-step VFS process, minors and newborns, photo rules, and the mistakes that cause delays.",
    excerpt:
      "Who qualifies, the exact documents, what it costs, and the step-by-step VFS process — for adults, minors, and newborns.",
    navLabel: "How to apply",
    hook: "Every step from eligibility to card-in-hand — for adults, minors and newborns.",
    icon: "🪪",
    date: "2026-06-27",
    content: `An OCI card is the single most useful document for a US citizen of Indian origin — it replaces the lifetime of visa applications with one lifelong entry-and-residence right. This is the complete first-time application guide: who qualifies, what to gather, what it costs, and exactly how the VFS process works.

:::info
title: Start with the tools
- **Not sure you qualify?** Run the [OCI Eligibility Checker](${OCI_TOOLS.eligibility.path}) (60 seconds, no signup).
- **Budgeting?** Get a line-by-line total in the [OCI Cost Calculator](${OCI_TOOLS.cost.path}).
- **Planning travel?** See a stage-by-stage [OCI Timeline](${OCI_TOOLS.timeline.path}).
:::

## What OCI is — and is not
Overseas Citizenship of India (OCI) is a lifelong visa and resident status for foreign nationals of Indian origin. It lets you enter India any number of times, stay indefinitely, work, study, and own most property.

:::compare
left: Not allowed
right: What OCI gives you
✗ Voting or standing for office
✗ Government jobs / constitutional posts
✗ Buying agricultural or plantation land
✓ Lifelong, multiple-entry travel — no visa
✓ Live, work and study in India indefinitely
✓ Parity with NRIs on most financial & property matters
:::

> OCI is **not** dual citizenship. India does not allow it — you hold a foreign passport, with OCI as your lifelong India status.

## Who is eligible
You must be a **foreign national** (you've surrendered Indian citizenship) with a documented Indian-origin link.

:::good
title: You likely qualify if any of these is true
- You were **born in India** / were once an Indian citizen
- A **parent, grandparent, or great-grandparent** was an Indian citizen
- You are the **spouse** of an Indian citizen or OCI holder (marriage registered and subsisting **2+ years**)
- You are a **minor child** of an Indian-origin parent
:::

:::bad
title: You are not eligible if
- You currently hold **Indian citizenship** (surrender it first)
- You, or your parents/grandparents, were **citizens of Pakistan or Bangladesh**
:::

Confirm your exact path in the [Eligibility Checker](${OCI_TOOLS.eligibility.path}) before you spend on documents.

## The documents you'll need
Requirements vary slightly by consulate and by your situation, but almost every adult application needs:

:::steps
Current foreign passport (bio page) — valid at least 6 months.
Proof of Indian origin — your old Indian passport, OR a parent/grandparent's Indian passport or birth certificate, plus the document linking you to them.
US naturalization certificate or surrender/renunciation certificate (proof you gave up Indian citizenship).
Proof of US residence/status (driver's license, state ID, or visa page).
One OCI-spec photo (square, white background) and your signature on white paper.
For name/details that changed: the apostilled US document proving it (see the apostille guide below).
:::

:::warn
title: Apostille is the step people miss
US-issued civil documents — **birth certificates, marriage certificates, name-change orders** — usually must be **apostilled** by the issuing state's Secretary of State before a consulate will accept them. A plain notarized copy is one of the most common rejection reasons. See the [OCI apostille guide](${OCI_BASE}/apostille).
:::

## Minors and newborns
A child born in the US to Indian-origin parents qualifies through the parent. The application is similar but:

- **Both parents** must sign and provide consent and their passports.
- You'll need the child's **apostilled US birth certificate** showing both parents.
- A newborn can get OCI early — many parents apply once the US passport and apostilled birth certificate are ready.

## After naturalization or marriage
- **After US naturalization:** you must first **surrender your Indian passport** and obtain a surrender/renunciation certificate; OCI is the next step. You cannot hold both.
- **After marriage to an Indian citizen / OCI holder:** spouse-based OCI generally needs the marriage **registered and subsisting for 2+ years**, plus your apostilled marriage certificate.

## What it costs
OCI cost is the government service fee plus the VFS service charge, ICWF, and any optional add-ons (return courier, SMS, lounge). A fresh adult government fee is around **${FRESH_ADULT}**, before VFS charges.

:::info
title: Get your exact number
Fees change and vary by consulate. The [OCI Cost Calculator](${OCI_TOOLS.cost.path}) builds a current, line-by-line total for your service type and number of applicants — always confirm on the VFS payment screen before paying.
:::

## How long it takes
Plan for roughly **${WEEKS}** end-to-end. OCI needs a **two-stage clearance** — your consulate plus the Ministry of Home Affairs (MHA) in India — which is why it runs longer than a passport renewal. The [Timeline Calculator](${OCI_TOOLS.timeline.path}) maps each stage onto your submission date.

## The step-by-step process
:::steps
Complete the online application on the Government of India OCI portal (ociservices.gov.in) and upload your photo and signature.
Pay and book through VFS Global (visa.vfsglobal.com/usa), which handles OCI for the consulates.
Submit your documents to VFS by mail or in person, with the printed application and all originals/copies.
The consulate processes and forwards your case to MHA in India for clearance.
Once granted, your OCI is printed and dispatched back via your chosen return courier.
:::

## Common mistakes that delay OCI
:::warn
- **Wrong photo** — OCI photos are square with a white background and a large centered face (not US passport style).
- **Skipping apostille** on birth/marriage/name-change documents.
- **Name mismatches** across passport, birth certificate, and parents' documents.
- **Applying while still an Indian citizen** — surrender first.
- **Booking travel** against an estimate — MHA timing is variable; start months ahead.
:::

## Frequently asked questions

### Who is eligible for OCI from the USA?
Foreign nationals who were Indian citizens, or whose parent, grandparent, or great-grandparent was an Indian citizen, plus long-term foreign spouses of Indian citizens/OCI holders. Current Indian citizens and those with Pakistan/Bangladesh links are excluded. Use the [Eligibility Checker](${OCI_TOOLS.eligibility.path}) to confirm.

### How much does an OCI card cost?
The government service fee (around ${FRESH_ADULT} for a fresh adult) plus the VFS service charge, ICWF, and optional courier/SMS/lounge. Get a live total in the [Cost Calculator](${OCI_TOOLS.cost.path}).

### How long does OCI take?
About ${WEEKS} typically, because of the consulate + MHA two-stage clearance. See the [Timeline Calculator](${OCI_TOOLS.timeline.path}).

### Can my US-born baby get OCI?
Yes — through the Indian-origin parent. You'll need both parents' consent and the child's apostilled US birth certificate.

### Do I need to apostille my documents?
US civil documents (birth, marriage, name-change) usually must be apostilled by the issuing state. See the [apostille guide](${OCI_BASE}/apostille).`,
  },

  /* =============================================================== *
   * 2. APOSTILLE
   * =============================================================== */
  {
    slug: "apostille",
    title: "Apostille for OCI in the USA: Birth & Marriage Certificates by State",
    seoTitle: "Apostille for OCI (2026): Birth & Marriage Certificates by State",
    metaDescription:
      "How to apostille US documents for OCI — what apostille is, why it's needed, notary vs attestation vs apostille, which documents need it, and step-by-step Secretary of State guides for California, Texas, New Jersey, New York and Illinois.",
    excerpt:
      "What apostille is, which OCI documents need it, and how to do it through the Secretary of State in CA, TX, NJ, NY, and IL.",
    navLabel: "Apostille guide",
    hook: "What apostille is, which documents need it, and how to do it in CA, TX, NJ, NY & IL.",
    icon: "📜",
    date: "2026-06-27",
    content: `If your OCI application uses a US birth certificate, marriage certificate, or name-change order, that document almost certainly needs an **apostille** first. This guide explains what that means and walks through the process for the five states where most Indian-origin Americans live.

:::info
title: Where apostille fits
Apostille is a document step that happens **before** you submit to VFS. Finish it first, then follow the [How to Apply guide](${OCI_BASE}/how-to-apply).
:::

## What is an apostille?
An apostille is a certificate attached by a US state's **Secretary of State** that authenticates a public document for use in another country. Because both the US and India are members of the Hague Apostille Convention, an apostille is accepted directly — no further embassy legalization is needed.

## Notary vs attestation vs apostille
These get confused constantly, and submitting the wrong one is a top rejection reason.

:::compare
left: Not enough on its own
right: What OCI needs
✗ Notary — only verifies a signature, not the document
✗ Attestation — a generic term; not the Hague certificate
✓ Apostille — the state Secretary of State's Hague certificate
:::

> Order matters: for many vital records you need a **certified copy** from the issuing office first, sometimes **notarized**, and only then **apostilled** by the Secretary of State.

## Which OCI documents need apostille?
:::good
title: Usually require apostille
- US **birth certificate** (for newborns/minors, and to prove parentage)
- US **marriage certificate** (spouse-based OCI, name change)
- **Name-change** court orders / deed poll
- **Divorce decrees** and **death certificates** where relevant to your case
:::

:::bad
title: Usually do NOT need apostille
- Your **passport** and **naturalization certificate** (foreign-government IDs)
- The **OCI application printout** and photos
- Documents already issued by Indian authorities
:::

When in doubt, confirm with your consulate before paying for an apostille you don't need.

## The general process
:::steps
Get a certified copy of the vital record from the issuing county/state office (not a photocopy).
Check whether your state needs it notarized or county-clerk certified first.
Submit to your state's Secretary of State (by mail or in person) with the apostille request form and fee.
Receive the document with the apostille certificate attached.
Submit the apostilled document with your OCI application to VFS.
:::

## State-by-state Secretary of State guides
Fees and turnaround change — always confirm on the official page linked for your state.

### California
Issued by the **California Secretary of State** (Notary Public & Special Filings / Authentication). Mail-in and limited in-person (Sacramento/LA) service. Official: [sos.ca.gov authentication](https://www.sos.ca.gov/notary/authentication).

### Texas
Issued by the **Texas Secretary of State**, Authentications Unit. Mail-in, with expedited options. Official: [sos.state.tx.us authentication](https://www.sos.state.tx.us/authinfo.shtml).

### New Jersey
Issued by the **NJ Department of the Treasury, Division of Revenue & Enterprise Services**. Regional/Trenton service. Official: [nj.gov apostilles](https://www.nj.gov/treasury/revenue/apostilles.shtml).

### New York
Issued by the **NY Department of State**. County-clerk certification is often required first for vital records. Official: [dos.ny.gov apostille](https://dos.ny.gov/apostille-or-certificate-authentication).

### Illinois
Issued by the **Illinois Secretary of State**, Index Department. Mail-in and walk-in (Chicago/Springfield). Official: [ilsos.gov apostille](https://www.ilsos.gov/departments/index/notary/apostille.html).

:::tip
title: Mail vs walk-in
Walk-in service (where offered) can be same-day; mail-in often runs 1–4 weeks. If your OCI timeline is tight, factor the apostille step in early — it's sequential, before VFS.
:::

## Common apostille mistakes
:::warn
- Apostilling a **plain photocopy** instead of a certified vital record.
- Going to the **wrong state** — apostille is done by the state that **issued** the document, not where you live now.
- Skipping a required **county-clerk certification** (common in New York).
- Letting the certified copy get **too old** if your state requires a recent issue date.
:::

## Frequently asked questions

### Does OCI require apostille?
For US-issued civil documents (birth, marriage, name-change) used in your application, yes — they generally must be apostilled by the issuing state's Secretary of State. Your passport and naturalization certificate do not.

### Can I just notarize instead of apostille?
No. A notary only witnesses a signature. OCI needs the state's Hague apostille certificate on the underlying document.

### Which state apostilles my document?
The state that **issued** it. A birth certificate from New Jersey is apostilled by New Jersey, even if you now live in Texas.

### How long does apostille take?
Walk-in service can be same-day in some states; mail-in commonly takes 1–4 weeks. Confirm current turnaround on your state's official page and start early.

### Do I need apostille for a newborn's OCI?
Yes — the child's US birth certificate showing both parents typically needs to be apostilled. See the [How to Apply guide](${OCI_BASE}/how-to-apply).`,
  },

  /* =============================================================== *
   * 3. RENEWAL & UPDATES
   * =============================================================== */
  {
    slug: "renewal",
    title: "OCI Renewal & Updates in the USA: New Passport, Lost Card & Name Change",
    seoTitle: "OCI Renewal & Re-issue in the USA (2026): New Passport, Lost Card",
    metaDescription:
      "When and how to renew or update your OCI in the USA — the under-20 and over-50 re-issue rules, new-passport updates, lost or damaged card replacement, address and name changes, and how long each takes.",
    excerpt:
      "When OCI must be re-issued, how to handle a new passport, lost or damaged cards, and name or address changes.",
    navLabel: "Renewal & updates",
    hook: "Re-issue at 20/50, new passport, lost cards, name & address changes — all in one place.",
    icon: "🔄",
    date: "2026-06-27",
    content: `OCI is lifelong, but it isn't entirely "set and forget." A handful of life events require a **re-issue** or an **update**, and missing one can cause boarding problems. Here's exactly when you need to act and what each case involves.

:::info
title: Same tools, same fees
Re-issues and updates use the same VFS process and the central fee schedule. Estimate yours in the [Cost Calculator](${OCI_TOOLS.cost.path}) and [Timeline Calculator](${OCI_TOOLS.timeline.path}).
:::

## When OCI must be re-issued
:::good
title: Re-issue is required when
- A **minor turns 20** — re-issue once after the 20th birthday
- The holder **crosses 50** — one re-issue is required after age 50
- A **minor (under 20) gets a new passport** — re-issue each time
- The card is **lost, stolen, or damaged**
:::

:::bad
title: For adults 21–50
A new passport no longer mandates a full re-issue in most cases — but you should still update the new passport details. Always confirm the current rule with VFS for your situation.
:::

## New passport — re-issue or update?
When you renew your US passport, your OCI is linked to the old passport number.

- **Minors / over-50 milestone:** do a full **re-issue**.
- **Adults 21–50:** typically a lighter **miscellaneous "new passport" update** rather than a full re-issue.

Either way, carrying your OCI together with the **old passport** it was issued against (or completing the update) avoids airline check-in confusion.

## Lost or damaged OCI card
:::steps
Report the loss if required and gather a copy of your passport and any OCI reference you have.
Apply for re-issue of the OCI document through the GoI portal and VFS.
Pay the lost/damaged re-issue fee and submit your documents.
Track the case and receive the reprinted OCI via return courier.
:::

## Name, address & detail changes
- **Name change** (e.g. after marriage): re-issue with your **apostilled** US name-change or marriage document — see the [apostille guide](${OCI_BASE}/apostille).
- **Address change:** keep your contact details current with the consulate/VFS; OCI itself doesn't print your US address, but accurate records matter for correspondence.
- **Correcting an error** on the card (spelling, date): apply for re-issue with supporting proof.

## How long updates take
Re-issues go through the same **consulate + MHA** path as a fresh OCI, so budget roughly **${WEEKS}**. Simple new-passport updates can be quicker, but don't assume — the [Timeline Calculator](${OCI_TOOLS.timeline.path}) gives a planning estimate.

## Don't get caught at the airport
:::warn
- A minor's OCI **not re-issued after a new passport** can be refused at check-in.
- Missing the **20** or **50** re-issue milestone.
- Traveling without the **old passport** your OCI was issued against (when an update is still pending).
:::

## Frequently asked questions

### Do I need to renew OCI when I get a new passport?
For minors (under 20) and after age 50, yes — re-issue. For adults 21–50, a lighter new-passport update usually suffices, but confirm the current VFS rule and keep details updated.

### What are the OCI re-issue age rules?
Re-issue once after a minor turns 20, and once after the holder crosses 50. Minors also re-issue with each new passport.

### How do I replace a lost or damaged OCI card?
Apply for re-issue through the GoI portal and VFS, pay the lost/damaged fee, and submit your documents. Estimate the cost in the [Cost Calculator](${OCI_TOOLS.cost.path}).

### How do I change my name on OCI after marriage?
Re-issue with your apostilled marriage or name-change document. See the [apostille guide](${OCI_BASE}/apostille).

### How long does an OCI re-issue take?
About ${WEEKS}, since re-issues go through the same consulate and MHA clearance as a new OCI.`,
  },
];

export const ociGuides: OciGuide[] = rawGuides.map((g) => ({
  ...g,
  readingTime: computeReadingTime(g.content),
}));

export const getOciGuide = (slug: string): OciGuide | undefined =>
  ociGuides.find((g) => g.slug === slug);
