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

:::tip
title: After approval — download your e-OCI
Once your OCI is granted, existing cardholders can also generate the free digital **e-OCI card** from the OCI Services Portal. See the [e-OCI card guide](${OCI_BASE}/e-oci-card) for the download steps, travel cautions, and email/login fixes.
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
    title: "OCI Apostille Guide for U.S. Applicants",
    seoTitle: "OCI Apostille Guide for U.S. Applicants",
    metaDescription:
      "Learn when OCI applicants may need apostille or attestation for birth certificates, marriage certificates, name-change records, and minor OCI documents. Includes VFS copy warning and state apostille guidance.",
    excerpt:
      "When U.S. birth, marriage, divorce, and name-change documents need apostille or attestation for OCI — with a built-in need checker, examples, and the latest VFS-checklist guidance.",
    navLabel: "Apostille guide",
    hook: "When birth, marriage & name-change documents need apostille or attestation — plus a need checker.",
    icon: "📜",
    date: "2026-06-27",
    updated: "2026-06-27",
    content: `This guide is for **U.S.-based OCI applicants** who need to understand when birth certificates, marriage certificates, divorce documents, or name-change records **may need apostille or attestation depending on the document, applicant type, country of issue, and the latest VFS checklist** — and how to handle them for VFS. Use the **OCI Apostille Need Checker** above for a quick read on your specific document, then use the sections below to get it right.

:::warn
title: Important: Keep your original apostilled document safe
For OCI applications, you may need to get a certified/original document apostilled first, but VFS/Consulate typically requires **self-attested copies** of apostilled documents in the OCI application packet. Do not send original apostilled documents to VFS unless the latest VFS checklist or Consulate specifically asks for them.
:::

## What is an apostille?
An apostille authenticates a public document for use in another country under the Hague Apostille Convention. Because both the U.S. and India are members, an apostille is accepted directly — no further embassy legalization is needed. **Apostille is issued by the apostille authority for the state or country that issued the document. In many U.S. states this is the Secretary of State, but not always.**

## Apostille vs notarization vs attestation
These get confused constantly, and using the wrong one is a top reason OCI documents bounce back.

:::compare
left: Often not enough on its own
right: What OCI may require
✗ Notarization — only confirms a signature or identity, not international acceptance
✓ Apostille — Hague Convention authentication of the document itself
✓ Attestation — consular / foreign-mission authentication, used for non-apostille countries or when VFS/Consulate requests it
:::

**Notarization alone is usually not enough when VFS asks for apostille/attestation.** Apostille is used for Hague Convention document authentication. Attestation may apply for documents from non-apostille countries or when requested by VFS/Consulate. Always follow the **latest VFS checklist** for the applicant type and consulate jurisdiction.

## Who actually apostilles the document?
Use the apostille authority for the **state or country that issued the document** — not where you live now.

:::info
title: Who handles what
- **U.S. state-issued** birth, marriage, divorce, and name-change documents usually go to **that state's apostille authority** (often the Secretary of State, but not always).
- **U.S. federal documents** may instead need authentication by the **U.S. Department of State**.
- **Indian-issued documents** are generally **not apostilled in the U.S.** — they're handled differently; check the latest VFS checklist.
- **Foreign (non-U.S.) documents** may need an **apostille from that country** (if it's a Hague member) or **attestation by the appropriate mission** if it isn't.
:::

## Which OCI documents need apostille?
:::good
title: May require apostille / attestation
- U.S. **birth certificate** (newborns/minors, and to prove parentage)
- U.S. **marriage certificate** (spouse-based OCI, name change)
- **Name-change** court orders / legal documents
- **Divorce decrees** and **death certificates** where relevant to your case
:::

:::bad
title: Usually do NOT need apostille
- Your **passport** and **naturalization certificate** (foreign-government IDs)
- The **OCI application printout** and photos
- Documents already issued by **Indian authorities**
:::

When in doubt, confirm against the latest VFS checklist before paying for an apostille you may not need.

## OCI apostille examples
- **U.S.-born minor applying for OCI:** the birth certificate may need apostille/attestation. A **hospital "birth certificate" is not enough** — you need the certified government-issued birth certificate showing **both parents' names**.
- **OCI through marriage:** a foreign marriage certificate may need apostille/attestation, and **spouse-based OCI has extra eligibility rules** (including a registered-marriage duration requirement).
- **Name change:** a court order or legal name-change document may need apostille if it was issued **outside India**.
- **Divorce / death certificate:** may be needed for **remarriage** cases or to document a parent/spouse relationship.

## The general process
:::steps
Order a certified government copy of the record from the issuing county/state office (not a photocopy or hospital copy).
Check whether your state needs it notarized or county-clerk certified first.
Submit to the correct apostille authority (the issuing state, the U.S. Department of State for federal documents, or a foreign authority/mission) with the request form and fee.
Receive the document with the apostille (or attestation) attached, and keep the original safe.
Submit/upload the self-attested copy of the apostilled document required by the latest VFS checklist. Keep the original apostilled document safe unless VFS or the Consulate specifically asks for it.
:::

## Minor OCI birth certificate warning
:::warn
title: Minor OCI birth certificate warning
For minor or newborn OCI applications, use a certified government-issued birth certificate that shows the child's details and parent information. Hospital birth certificates are not accepted for OCI. If the birth certificate was issued outside India, apostille or attestation may be required depending on the VFS checklist.
:::

## State-by-state apostille authorities
Fees and turnaround change — always confirm on the official page linked for your state.

### California
Issued by the **California Secretary of State** (Notary Public & Special Filings / Authentication). Mail-in and limited in-person (Sacramento/LA) service. Official: [California SOS authentication](https://www.sos.ca.gov/notary/authentication).

### Texas
Issued by the **Texas Secretary of State**, Authentications Unit. Mail-in, with expedited options. Official: [Texas SOS authentication](https://www.sos.state.tx.us/authinfo.shtml).

### New Jersey
Issued by the **NJ Department of the Treasury, Division of Revenue & Enterprise Services**. Regional/Trenton service. Official: [New Jersey apostilles](https://www.nj.gov/treasury/revenue/apostilles.shtml).

### New York
Issued by the **NY Department of State**. County-clerk certification is often required first for vital records. Official: [New York apostille](https://dos.ny.gov/apostille-or-certificate-authentication).

### Illinois
Issued by the **Illinois Secretary of State**, Index Department. Mail-in and walk-in (Chicago/Springfield); the fee is $2 per document. Official: [Illinois apostilles](https://www.ilsos.gov/departments/index/apostilles.html).

:::tip
title: Mail vs walk-in
Walk-in service (where offered) can be same-day; mail-in often runs 1–4 weeks. If your OCI timeline is tight, factor the apostille step in early — it's sequential, before VFS.
:::

## Common apostille mistakes
:::warn
- **Mailing your only original** when the VFS checklist actually asks for a self-attested copy.
- Apostilling a **plain photocopy or hospital certificate** instead of a certified government record.
- Going to the **wrong authority** — apostille is done by the **issuer's** state/country, not where you live now.
- Relying on a **notary stamp** when VFS asks for apostille or attestation.
- Skipping a required **county-clerk certification** (common in New York).
:::

## Where to go next
- New to the process? Start at the [OCI Center](${OCI_BASE}) or read the full [step-by-step application guide](${OCI_BASE}/how-to-apply), which covers **minor and newborn applications**, the **document checklist**, and **fees** in detail.
- Renewing or updating instead? See [OCI renewal, re-issue and name changes](${OCI_BASE}/renewal).
- Check you qualify with the [eligibility checker](${OCI_TOOLS.eligibility.path}), estimate the [total cost](${OCI_TOOLS.cost.path}), and plan dates with the [timeline calculator](${OCI_TOOLS.timeline.path}).

## Frequently asked questions

### Do I send the original apostilled document to VFS?
Usually no. VFS/Consulate typically requires **self-attested copies** of apostilled documents. Keep the original safe unless specifically requested.

### Is notarization enough for OCI?
Usually no. A notary stamp alone is different from apostille or consular attestation.

### Does a U.S. birth certificate need apostille for minor OCI?
It may be required depending on the VFS checklist and applicant type. Use a certified government-issued birth certificate, not a hospital certificate.

### Is a hospital birth certificate accepted for OCI?
No. A hospital "certificate" is not the official record. Use the **certified government-issued birth certificate** from the state/county vital-records office, which can then be apostilled if required.

### Who apostilles a marriage certificate?
The apostille authority of the state/country that issued the marriage certificate.

### What if my document was issued outside the United States?
It may need apostille from that country if applicable, or attestation by the appropriate foreign mission/consulate. Indian-issued documents are handled separately — check the latest VFS checklist.

### Can OCI be delayed because of apostille problems?
Yes. Missing apostille/attestation, wrong issuing authority, hospital instead of certified certificates, or sending the wrong copy are common causes of OCI delays and document rejections.

### Should I apostille before starting the OCI application?
It usually helps to order certified copies and apostille **early**, because that step is sequential and can take weeks — but always confirm the current VFS document list first so you apostille the right documents.

:::warn
title: Disclaimer
This page is an educational guide. OCI and VFS requirements can change by applicant type, consulate jurisdiction, and document country. Always verify with the **latest VFS checklist** and official OCI instructions before submitting.
:::`,
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
