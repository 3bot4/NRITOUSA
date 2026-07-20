import { computeReadingTime } from "@/lib/format";

/**
 * Topic cluster (hub-&-spoke) for "Indian passport renewal in the USA".
 *
 *   /indian-passport-renewal-usa/                 ← hub / pillar page
 *     ├─ /chicago, /new-york, /san-francisco,
 *     │  /houston-texas                           ← city cluster pages
 *     └─ /documents, /processing-time             ← content cluster pages
 *
 * Every page is authored in the same light-markdown + ::: fence format as
 * lib/articles (rendered by ArticleBody). The hub links down to every child;
 * each child links back up to the hub and across to its siblings. That dense
 * internal linking is the whole point of the cluster — see ClusterPage.tsx.
 */

export type ClusterPageKind = "hub" | "city" | "content";

export interface ClusterPageData {
  /** "" for the hub; the child segment (e.g. "chicago") otherwise. */
  slug: string;
  kind: ClusterPageKind;
  title: string;
  /** SEO <title> override (falls back to `title`). */
  seoTitle?: string;
  /** SEO meta description (falls back to `excerpt`). ~140–160 chars. */
  metaDescription?: string;
  excerpt: string;
  /** Short label shown in cluster navigation cards. */
  navLabel: string;
  date: string;
  updated?: string;
  content: string;
}

export interface ClusterPage extends ClusterPageData {
  readingTime: number;
  feeSnapshot?: PassportFeeSnapshot;
}

/* ── Fast Answer: fees & timelines snapshot ────────────────────────────────── */

export interface PassportFeeRow {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface PassportFeeSnapshot {
  title: string;
  rows: PassportFeeRow[];
  badges?: string[];
  lastVerified: string;
  disclaimer: string;
  sources: { label: string; href: string }[];
}

/**
 * Fees & timelines shown at the top of every passport-cluster page. Fee amounts
 * are common USD ESTIMATES — Indian passport/VFS fees vary by jurisdiction,
 * booklet size, and validity, and change over time. Always confirm the exact
 * amount on VFS / Passport Seva before paying. lastVerified: 2026-07-04.
 */
export const passportFeeSnapshot: PassportFeeSnapshot = {
  title: "Indian passport renewal — fees & timelines at a glance",
  badges: ["Normal 6–12 wks", "Tatkal 3–5 wks", "Fees per VFS USA"],
  rows: [
    { label: "Normal renewal time", value: "6–12 weeks", note: "Plan for the long end in peak season." },
    { label: "Tatkal renewal time", value: "3–5 weeks", note: "Faster processing for eligible cases." },
    { label: "Passport fee (36-page)", value: "$125", note: "60-page (jumbo) is $175. Booklet fee only.", highlight: true },
    { label: "Tatkal (extra)", value: "+$125", note: "Added on top of the normal booklet fee." },
    { label: "VFS service charge", value: "$19", note: "Per application; plus a $2 ICWF charge." },
    { label: "Total (36-page)", value: "$146 normal / $271 tatkal", note: "Fee + ICWF + VFS; return courier extra." },
  ],
  lastVerified: "2026-07-04",
  disclaimer:
    "Fees are current VFS USA figures (36-page $125, jumbo $175, Tatkal +$125, ICWF $2, VFS service $19) and vary by booklet size and validity; a lost/damaged passport or minor booklet costs differently, outside photos add ~$10–20, and online payment adds a ~3.75% convenience charge. Always confirm the exact current fees on VFS Global / Passport Seva before paying. Educational information, not legal advice.",
  sources: [
    { label: "VFS Global (India, USA)", href: "https://visa.vfsglobal.com/usa/en/ind/" },
    { label: "Passport Seva", href: "https://www.passportindia.gov.in/" },
  ],
};

/** Base path of the cluster (the hub lives here). */
export const CLUSTER_BASE = "/indian-passport-renewal-usa";

/** Root-relative path for a cluster page ("" → the hub). */
export const clusterPath = (slug: string) =>
  slug ? `${CLUSTER_BASE}/${slug}` : CLUSTER_BASE;

const rawPages: ClusterPageData[] = [
  /* ----------------------------- HUB ----------------------------- */
  {
    slug: "",
    kind: "hub",
    title: "Indian Passport Renewal in USA 2026: Fees, Documents & Timeline",
    seoTitle: "Indian Passport Renewal in USA 2026: Fees & Timeline",
    metaDescription:
      "Indian passport renewal in USA: $146 total (36-page) via VFS Global, 6–12 weeks. 2026 fees, documents, address proof and Tatkal guide.",
    navLabel: "Start here",
    excerpt:
      "The complete hub for renewing your Indian passport from the US — the VFS Global process, documents, fees, photo specs, city-by-city centers, and processing times.",
    date: "2026-06-14",
    updated: "2026-07-19",
    content: `:::quickanswer
To renew an Indian passport in the USA, apply online at Passport Seva (choose "Reissue"), then pay and book an appointment through **VFS Global** — the total for a standard 36-page booklet is about **$146** ($125 fee + $19 VFS charge + $2 ICWF), or roughly **$271 with Tatkal** (+$125). Normal processing typically takes **6–12 weeks**; Tatkal takes **3–5 weeks**. Most straightforward renewals need **no police verification**.
:::

:::key
- Budget **$146 total** for a normal 36-page renewal ($125 booklet + $19 VFS service + $2 ICWF); a 60-page jumbo runs **$196**, per VFS USA fees as of July 2026.
- Expect **6–12 weeks** for normal processing and **3–5 weeks** for Tatkal — start **3–4 months** before your passport expires or you travel.
- Book your VFS appointment **4–6 weeks ahead**; slots at the 5 US centers fill fast, especially Nov–Feb and Jun–Aug.
- Bring **originals + self-attested photocopies** of every document and two **2"x2" Indian-spec photos** — missing copies and US-spec photos are the top 2 rejection reasons.
- File under the consulate that covers **your state of residence**, not the nearest city — check the jurisdiction table below.
:::

Indian passport renewal in the USA runs through VFS Global on behalf of the five Indian consulates — and if you get the photo, the photocopies, and the jurisdiction right, it is a routine paperwork exercise. This hub is written for every Indian citizen living in the US on H-1B, L-1, F-1/OPT, H4, or a green card who needs to renew an Indian passport without flying home. The single most important number: a normal renewal typically takes **6–12 weeks** door to door, so start 3–4 months before expiry or travel. Below you'll find the step-by-step VFS Global Indian passport renewal process, the full 2026 fee table in USD, what counts as address proof for Indian passport renewal in the USA, Indian-spec photo rules, the consulate jurisdiction map, realistic processing times, and Tatkal vs normal — plus deep-dive pages for your [city center](/indian-passport-renewal-usa/san-francisco), the [documents checklist](/indian-passport-renewal-usa/documents), and [processing times](/indian-passport-renewal-usa/processing-time).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::info
title: Explore this guide
- **Your city:** [Chicago](/indian-passport-renewal-usa/chicago) · [New York](/indian-passport-renewal-usa/new-york) · [San Francisco](/indian-passport-renewal-usa/san-francisco) · [Houston / Texas](/indian-passport-renewal-usa/houston-texas)
- **Go deeper:** the full [documents checklist](/indian-passport-renewal-usa/documents) and realistic [processing times](/indian-passport-renewal-usa/processing-time)
:::

## Who Can Renew an Indian Passport in the USA?
Any Indian citizen with valid US immigration status can renew here — the visa stamp can be expired as long as the underlying status (H1B, etc.) is current.

:::info
title: You should renew if any of these is true
- Passport is **expired or expiring within 12 months**
- Fewer than **2 blank pages** remain
- It's **damaged, lost, or stolen**
- Your **name or personal details changed** (e.g. after marriage)
:::

> OCI/PIO cardholders (US citizens of Indian origin) follow a different process — this guide is for Indian passport holders.

## How Do You Renew an Indian Passport in the USA? (VFS Global, Step by Step)
The renewal takes about 30–45 minutes of online work plus one in-person VFS visit. The consulates outsource passport services to VFS Global. You do the application and payment yourself online first; VFS only handles document intake and biometrics.

:::steps
Create an account on [passportindia.gov.in](https://passportindia.gov.in) and choose "Reissue of Passport" — not "Fresh Passport."
Fill the form accurately (name, DOB, Indian address, emergency contacts) and note your Application Reference Number (ARN).
Complete your application on Passport Seva/GPSP, then follow VFS portal instructions for payment and appointment. Confirm the exact payment step on VFS for your jurisdiction before submitting.
Book your VFS appointment at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) — slots fill 3–6 weeks out, so book early.
Attend on the day with all originals + photocopies; VFS verifies documents and captures biometrics.
Track status on the Passport Seva portal with your ARN; the new passport returns by speed post.
:::

## What Documents Do You Need? (One Line Each)
Bring every document as **original plus a self-attested photocopy** — missing copies are the #1 reason people get turned away. The essentials: printed form with ARN, current passport, proof of US status, US address proof, Indian address proof, two Indian-spec photos, and your fee + appointment receipts. The complete, situation-by-situation list — including what counts as US and Indian address proof — is on the [documents page](/indian-passport-renewal-usa/documents).

## How Much Are Indian Passport Renewal Fees in the USA? (2026)
A standard 36-page renewal costs about **$146 all-in** — the $125 booklet fee plus VFS Global's $19 service charge and the $2 ICWF contribution. Fees are paid in USD through the VFS portal per its instructions for your jurisdiction. Figures below are per VFS USA, last verified July 2026.

| Item | 36-page booklet | 60-page (jumbo) |
| --- | --- | --- |
| Passport booklet fee (normal) | $125 | $175 |
| Tatkal surcharge (if chosen) | +$125 | +$125 |
| ICWF contribution | $2 | $2 |
| VFS Global service charge | $19 | $19 |
| **Total — normal** | **$146** | **$196** |
| **Total — Tatkal** | **$271** | **$321** |

> Lost/damaged replacements and minor (under-15) booklets are priced differently, return courier is extra, and online payment adds a ~3.75% convenience charge. Fees change — always confirm current rates on [VFS Global](https://visa.vfsglobal.com/usa) before paying.

## What Address Proof Works for Indian Passport Renewal in the USA?
You need **US address proof** (for where you live now) and, if your passport shows an Indian address you want to keep, the consulates generally reprint the same Indian address — the practical burden is the US side. Any one current document from the left column typically works; pairs of weaker documents can back each other up.

| Commonly accepted US address proof | Watch out for |
| --- | --- |
| State driver's license / state ID | Address must match your application exactly |
| Utility bill (electricity, gas, water, internet) | Typically within the last 3 months |
| Bank or credit-card statement | Within the last 3 months; e-statements printed are usually fine |
| Lease agreement / mortgage statement | Must show your name and full address |
| Employer letter on letterhead | Helpful as a supporting (second) proof |

> If you recently moved, update your driver's license or bring two matching secondary proofs. Mismatched addresses between the form and the proof are a common return-to-sender reason. Full details on the [documents checklist](/indian-passport-renewal-usa/documents).

## What Are the Photo Requirements?
Indian passport photos are **not** the same as US ones, and the wrong format is one of the most common rejections.

:::good
- **2" x 2"** (51mm x 51mm), high-resolution color print
- **Plain white** background — no cream or off-white
- Face fills **70–80%** of the frame, neutral expression, both eyes open
- Taken within the **last 6 months**, no shadows
:::

:::bad
- **No glasses** — even prescription
- **No head coverings** except religious
- Don't use CVS/Walgreens "US passport" photos — get them at an Indian grocery/photo shop and bring the spec sheet
:::

## Which VFS Center Do I Go To?
VFS routes you by **consulate jurisdiction** — the consulate that covers the state you live in, not the nearest city. Pick yours:

| Consulate | Covers (broadly) | Local guide |
| --- | --- | --- |
| Chicago | Midwest | [Chicago →](/indian-passport-renewal-usa/chicago) |
| New York | Northeast | [New York →](/indian-passport-renewal-usa/new-york) |
| San Francisco | West Coast | [San Francisco →](/indian-passport-renewal-usa/san-francisco) |
| Houston | South-central | [Houston / Texas →](/indian-passport-renewal-usa/houston-texas) |

## How Long Does Indian Passport Renewal Take in the USA?
Typically **6–12 weeks** for a normal renewal, measured from VFS submission to the new booklet arriving by mail. Plan for the long end of these ranges, especially in peak seasons (Nov–Feb, Jun–Aug). The full breakdown — and how to track status — is on the [processing-time page](/indian-passport-renewal-usa/processing-time).

| Service | Estimated time |
| --- | --- |
| Normal renewal | 6–12 weeks |
| Tatkal renewal | 3–5 weeks |
| Lost passport | 8–16 weeks |

## Do You Need Police Verification?
Usually not. A straightforward renewal where your Indian address is unchanged and you have no pending cases needs **no police verification**. It's only triggered for fresh passports, a changed Indian address, lost/stolen cases, or a criminal record — in which case the consulate routes it to your local police station in India.

## Tatkal vs Normal: Which Should You Choose?
Tatkal ("immediate") is faster but costs ~$70–80 more and needs an extra self-declaration (Annexure F). Neither option guarantees a specific date.

:::compare
left: Choose Normal if
right: Choose Tatkal if
✗ Your travel is more than 3 months away
✗ You want to save money
✗ You have no urgent deadline
✓ You have confirmed travel within ~8–10 weeks
✓ There's a family emergency in India
✓ Your passport expires in under 6 months
:::

## Common mistakes to avoid
:::warn
- **Wrong photo format** — US-spec photos with non-white backgrounds get rejected
- **Missing photocopies** — VFS needs originals *and* self-attested copies of each document
- **Picking "Fresh Passport"** instead of "Reissue" — causes delays and re-filing
- **Applying with lapsed status** — your underlying status (not just the visa stamp) must be valid; carry I-94/I-797
- **Booking too late** — slots fill weeks out and processing can take 12 weeks; start 3–4 months early
:::

## How This Connects to the Rest of Your Immigration Life
Your Indian passport is the anchor document for almost every other process, so time the renewal around what's next. If you'll need **US visa stamping** (say, [H-1B stamping after selection](/h1b-visa-stamping-after-selection)), renew the passport first — consulates want at least 6 months of validity, and your old passport with the valid visa travels alongside the new one. If a family member is applying for an **OCI card**, the passport number on file matters — see the [OCI resource center](/oci). Green-card-track families should also keep passports current for [I-485 filings](/i485-documents-checklist) and international travel on advance parole, and every visa applicant needs 6+ months of passport validity beyond the intended stay for an [India visa from the USA](/india-visa-from-usa).

## Frequently asked questions

### How do I renew my Indian passport in the USA?
Apply online at passportindia.gov.in (choose "Reissue of Passport"), then pay and book an appointment through VFS Global per the portal instructions for your jurisdiction, and appear in person with originals + photocopies. The whole flow typically takes 6–12 weeks; the step-by-step process is above.

### How long does Indian passport renewal take in the USA?
Typically 6–12 weeks for normal processing and 3–5 weeks for Tatkal, from VFS submission to delivery. Peak seasons (Nov–Feb, Jun–Aug) run toward the long end — see the [processing-time breakdown](/indian-passport-renewal-usa/processing-time).

### How much does it cost to renew an Indian passport in the USA?
About $146 all-in for a normal 36-page booklet ($125 fee + $19 VFS + $2 ICWF) and about $271 with Tatkal, per VFS USA as of July 2026. A 60-page jumbo booklet totals $196 normal / $321 Tatkal.

### Can I renew if I have a Green Card?
Yes. Green Card holders renew at VFS just like visa holders — bring the Green Card as proof of US status.

### Can I renew an already-expired Indian passport?
Yes, there's no deadline to renew an expired Indian passport. You just can't travel internationally on it until the new one arrives.

### What happens to the US visa in my old passport?
It stays valid. Ask VFS to return your old passport stamped "CANCELLED" and travel with both books together — old (valid US visa) and new.

### Is a VFS appointment mandatory for Indian passport renewal?
Yes — walk-ins aren't accepted. Book online at visa.vfsglobal.com/usa; slots often fill 3–6 weeks out.

### How early can I renew — can I apply 1 year before expiry?
Yes. India lets you reissue a passport up to 12 months before expiry, and you should — many countries (and US visa stamping) require 6+ months of remaining validity.

## The bottom line
Complete your application on Passport Seva/GPSP and follow VFS for payment and appointment, book your center early, and bring originals plus Indian-spec photos and photocopies of everything. Get those three right and the rest is just waiting — so start 3–4 months ahead of any expiry or trip. Use the city and detail pages below to nail the specifics for your situation.

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },

  /* --------------------------- CITY PAGES -------------------------- */
  {
    slug: "chicago",
    kind: "city",
    title: "Indian Passport Renewal in Chicago: VFS Center & Process (2026)",
    seoTitle:
      "Indian Passport Renewal in Chicago (2026): VFS Guide & Appointments",
    metaDescription:
      "Step-by-step guide to Indian passport renewal in Chicago. VFS Chicago address, appointment tips, documents, fees, and processing time for Illinois residents.",
    navLabel: "Chicago",
    excerpt:
      "Renewing your Indian passport in Chicago — the VFS Global center, the Consulate jurisdiction it serves, and how to book and apply from the Midwest.",
    date: "2026-06-14",
    content: `If you live in the Midwest, your Indian passport renewal runs through the **Consulate General of India, Chicago** and its VFS Global Passport Seva Center. The process is identical to the rest of the country — you just file under Chicago's jurisdiction. This page covers the Chicago-specific bits; the [full step-by-step process is in the main guide](/indian-passport-renewal-usa).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::summary
Chicago's consulate covers most of the **Midwest**. Complete your application on **Passport Seva/GPSP**, then follow the **VFS portal instructions for payment and appointment** at the Chicago center, and submit in person. Confirm the current center address and hours on the **official VFS site** — they move occasionally. Everything else (documents, fees, photos) follows the national process.
:::

## Who files under Chicago
The Consulate General of India, Chicago handles passport jurisdiction for a large block of Midwestern states — generally including Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, North Dakota, South Dakota, Ohio, and Wisconsin.

:::info
title: Confirm your jurisdiction first
- VFS routes by **the state you live in**, not the closest city
- If you've moved between states, file under your **current** state's consulate
- The authoritative state list is on the Chicago consulate and VFS websites — check before booking
:::

## Booking the Chicago VFS center
Appointments are booked online at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa). Choose the **Chicago Passport Seva Center**, pick a slot, and print the confirmation.

:::tip
- Book **3–6 weeks ahead** — Chicago slots fill fast, especially Nov–Feb and Jun–Aug
- Check for slots early morning; cancellations free up
- Get your **Indian-spec photos** from an Indian grocery/photo shop in Devon Avenue or the suburbs, not a US drugstore
:::

## What to bring
Identical to the national checklist — originals **plus** self-attested photocopies of each. See the [complete documents page](/indian-passport-renewal-usa/documents) for the situation-by-situation list (name change, F1/OPT, dependents, lost passport).

:::warn
- **Confirm the center address on the official VFS site the week of your appointment** — VFS locations and hours change
- Bring your **printed ARN form, fee receipt, and appointment letter**
- Carry proof of **valid US status** (I-797/I-94, Green Card, F1 + I-20)
:::

## Timeline from Chicago
Processing isn't faster or slower by city — it follows the [national processing times](/indian-passport-renewal-usa/processing-time): roughly **6–12 weeks normal**, **3–5 weeks Tatkal**. The new passport returns by speed post to your mailing address.

## Frequently asked questions

### Do I have to go to Chicago in person?
Yes — VFS requires an in-person appointment for biometrics; walk-ins aren't accepted. Some applicants in remote areas use VFS mail-in options where offered, but confirm eligibility on the VFS site.

### I live in Ohio/Michigan — is that Chicago's jurisdiction?
Generally yes, but jurisdictions are occasionally re-drawn. Verify on the VFS USA site before booking so you don't file under the wrong consulate.

### Where do I get Indian-spec passport photos in Chicago?
Indian grocery and photo shops (e.g. along Devon Avenue) know the 2"x2" white-background format. Avoid US drugstore "passport photo" booths.

## The bottom line
Chicago renewals are the standard national process filed under the Midwest consulate. Confirm your state falls under Chicago, book the VFS slot early, bring Indian-spec photos and full photocopies, and follow the [main guide](/indian-passport-renewal-usa) for the rest.

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },
  {
    slug: "new-york",
    kind: "city",
    title: "Indian Passport Renewal in New York: VFS Center & Process (2026)",
    seoTitle:
      "Indian Passport Renewal in New York (2026): VFS Guide & Appointments",
    metaDescription:
      "Complete guide to Indian passport renewal in New York. VFS NYC address, appointment booking, documents, fees, and processing time for NY/NJ residents.",
    navLabel: "New York",
    excerpt:
      "Renewing your Indian passport in New York — the VFS Global center, the Consulate jurisdiction it serves, and how to book and apply from the Northeast.",
    date: "2026-06-14",
    content: `If you live in the Northeast, your Indian passport renewal runs through the **Consulate General of India, New York** and its VFS Global Passport Seva Center. The steps match the rest of the country; you just file under New York's jurisdiction. This page covers the NY-specific bits — the [full process is in the main guide](/indian-passport-renewal-usa).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::summary
New York's consulate covers much of the **Northeast**. Complete your application on **Passport Seva/GPSP**, then follow the **VFS portal instructions for payment and appointment** at the New York center, and submit in person. NY is one of the busiest centers, so book early and confirm the current address/hours on the **official VFS site**.
:::

## Who files under New York
The Consulate General of India, New York generally handles jurisdiction for the Northeastern states — including New York, New Jersey, Connecticut, Pennsylvania, Massachusetts, Rhode Island, New Hampshire, Vermont, Maine, and others in the region.

:::info
title: Confirm your jurisdiction first
- VFS routes by **the state you live in**, not the closest city
- Some nearby states fall under Washington DC's consulate, not New York — check the list
- The authoritative state list is on the NY consulate and VFS websites
:::

## Booking the New York VFS center
Book online at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa). Choose the **New York Passport Seva Center**, select a slot, and print the confirmation.

:::tip
- NY is high-volume — book **4–6 weeks ahead** and check mornings for released slots
- Plan for travel/parking in Manhattan; arrive 10–15 minutes early
- Get **Indian-spec photos** from a South-Asian photo shop (Jackson Heights, Edison NJ, Oak Tree Road) — not a US drugstore
:::

## What to bring
Identical to the national checklist — originals **plus** self-attested photocopies of each. The situation-by-situation list (name change, F1/OPT, dependents, lost passport) is on the [documents page](/indian-passport-renewal-usa/documents).

:::warn
- **Confirm the center address on the official VFS site the week of your appointment**
- Bring your **printed ARN form, fee receipt, and appointment letter**
- Carry proof of **valid US status** (I-797/I-94, Green Card, F1 + I-20)
:::

## Timeline from New York
Processing follows the [national processing times](/indian-passport-renewal-usa/processing-time) — about **6–12 weeks normal**, **3–5 weeks Tatkal** — though high-volume centers can sit at the longer end in peak season. The new passport returns by speed post.

## Frequently asked questions

### I live in New Jersey — do I use the New York center?
Generally yes; NJ falls under the New York consulate. Confirm on the VFS USA site before booking.

### Is the New York center busier than others?
Yes — it's one of the busiest, so appointments can be harder to get and peak-season processing slower. Book as early as possible.

### Where do I get Indian-spec photos near NYC?
South-Asian photo shops in Jackson Heights (Queens), Edison and the Oak Tree Road area (NJ) know the 2"x2" white-background format.

## The bottom line
New York renewals are the standard national process filed under the Northeast consulate. Verify your state, book the busy VFS slot early, bring Indian-spec photos and full photocopies, and follow the [main guide](/indian-passport-renewal-usa) for everything else.

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },
  {
    slug: "san-francisco",
    kind: "city",
    title:
      "Indian Passport Renewal in San Francisco 2026: Fees & Timeline",
    seoTitle: "Indian Passport Renewal San Francisco 2026: Fees & Time",
    metaDescription:
      "Indian passport renewal in San Francisco: $146 total, 6–12 weeks (3–5 Tatkal). SF consulate jurisdiction, VFS booking and documents.",
    navLabel: "San Francisco",
    excerpt:
      "Renewing your Indian passport in San Francisco — the VFS Global center, the Consulate jurisdiction it serves, and how to book and apply from the West Coast.",
    date: "2026-06-14",
    updated: "2026-07-19",
    content: `:::quickanswer
To renew an Indian passport in San Francisco, apply on Passport Seva (choose "Reissue"), then pay and book a VFS Global appointment at the **San Francisco Passport Seva Center**, which serves the **Consulate General of India, San Francisco** jurisdiction — Northern California and much of the Western US. Total cost is about **$146** for a standard 36-page booklet ($125 + $19 VFS + $2 ICWF), or roughly **$271 with Tatkal**. Processing typically takes **6–12 weeks** normal and **3–5 weeks** Tatkal, and Bay Area slots often fill **4–6 weeks** out.
:::

:::key
- Budget **$146** total for a normal 36-page renewal in San Francisco, or **$271** with Tatkal, per current VFS USA fees.
- Book **4–6 weeks ahead** — the Bay Area is the highest-demand Indian passport jurisdiction in the US.
- Confirm your state falls under **San Francisco**, not Houston or New York: Northern California, Oregon, Washington, Nevada and neighbours generally do; Southern California may not.
- Expect **6–12 weeks** for normal processing and **3–5 weeks** for Tatkal, returned by speed post.
- Bring **originals plus self-attested photocopies** of every document and two **2"x2" Indian-spec photos** — US drugstore photos are rejected.
:::

If you live on the West Coast, your Indian passport renewal in San Francisco runs through the **Consulate General of India, San Francisco** and its VFS Global Passport Seva Center. This page is for Bay Area and Northern California residents on H-1B, L-1, F-1/OPT, H4, or a green card who need SFO-specific details — the consulate jurisdiction, VFS booking, fees in USD, and realistic processing time — rather than the generic national walkthrough. The number that matters most locally: appointment slots at the San Francisco center commonly run 4–6 weeks out, so book before you need to travel. Below: exactly who files under San Francisco, how to book the VFS appointment, the full 2026 fee table, what to bring, timelines, and where to get Indian-spec photos in the Bay Area. The [full nationwide process is in the main guide](/indian-passport-renewal-usa).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

## Which States Fall Under the San Francisco Indian Consulate?
The Consulate General of India, San Francisco generally covers the Western US. Jurisdiction follows **the state you live in**, not the nearest city — and Southern California is the classic trap, since it commonly falls under a different consulate.

| Typically under San Francisco | Usually a different consulate |
| --- | --- |
| Northern California | Southern California (verify — often another post) |
| Oregon, Washington | Texas, Oklahoma → Houston |
| Nevada, Idaho, Montana | Georgia, Florida → Atlanta |
| Wyoming, Utah, Colorado | New York, New Jersey → New York |
| Alaska, Hawaii | Illinois, Michigan, Ohio → Chicago |

> Jurisdiction lists change. Confirm your exact state and region on the SF consulate and VFS USA sites before booking — applying at the wrong center means starting over.

:::info
title: Confirm your jurisdiction first
- VFS routes by **the state you live in**, not the closest city
- Northern vs Southern California can differ — verify which consulate covers your address
- The authoritative state list is on the SF consulate and VFS websites
:::

## How Do You Book a VFS Appointment in San Francisco?
Book online at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) after completing your Passport Seva application. Choose the **San Francisco Passport Seva Center**, select a slot, and print the confirmation. Walk-ins are not accepted.

:::tip
- The Bay Area is high-demand — book **4–6 weeks ahead** and check mornings for released slots
- Get **Indian-spec photos** from a South-Asian photo shop (Fremont, Sunnyvale, Artesia) — not a US drugstore
- Build in travel time; confirm parking near the center in advance
:::

## What Does Indian Passport Renewal Cost in San Francisco?
The same national VFS USA fee schedule applies — about **$146 all-in** for a normal 36-page booklet. Fees below were last verified July 2026; confirm on VFS before paying.

| Item | 36-page booklet | 60-page (jumbo) |
| --- | --- | --- |
| Passport booklet fee (normal) | $125 | $175 |
| Tatkal surcharge (if chosen) | +$125 | +$125 |
| ICWF contribution | $2 | $2 |
| VFS Global service charge | $19 | $19 |
| **Total — normal** | **$146** | **$196** |
| **Total — Tatkal** | **$271** | **$321** |

> Return courier is extra and online payment adds a ~3.75% convenience charge. Lost, damaged, and minor booklets are priced differently.

## What Documents Do You Need to Bring?
Identical to the national checklist — originals **plus** self-attested photocopies of each. The full situation-by-situation list (name change, F1/OPT, dependents, lost passport) is on the [documents page](/indian-passport-renewal-usa/documents).

:::warn
- **Confirm the center address on the official VFS site the week of your appointment**
- Bring your **printed ARN form, fee receipt, and appointment letter**
- Carry proof of **valid US status** (I-797/I-94, Green Card, F1 + I-20)
:::

## How Long Does Indian Passport Renewal Take in San Francisco?
Processing follows the [national processing times](/indian-passport-renewal-usa/processing-time) — about **6–12 weeks normal**, **3–5 weeks Tatkal**, measured from VFS submission to delivery by speed post. Add the appointment lead time on the front, which in the Bay Area is often the longest single wait.

| Stage | Typical time (SFO) |
| --- | --- |
| Getting a VFS appointment slot | 4–6 weeks |
| VFS document intake to dispatch | 1–2 weeks |
| Passport processing (normal) | 6–12 weeks total |
| Passport processing (Tatkal) | 3–5 weeks total |
| Speed post return delivery | 3–7 days |

## How This Connects to Your Other Filings
Time the renewal around what comes next. If you need **US visa stamping** in India — for example [H-1B stamping after selection](/h1b-visa-stamping-after-selection) — renew first, since consulates expect at least 6 months of passport validity and your old passport with the valid visa travels alongside the new booklet. Bay Area families applying for an [OCI card](/oci) should note the passport number on file changes with a new booklet, and anyone filing [I-485 adjustment of status](/i485-documents-checklist) needs a current passport in the evidence set.

## Frequently asked questions

### How long does Indian passport renewal take in San Francisco?
Typically 6–12 weeks for normal processing and 3–5 weeks for Tatkal from VFS submission, plus 4–6 weeks to get an appointment slot in the Bay Area. Plan 3–4 months ahead of any travel.

### How much does Indian passport renewal cost in San Francisco?
About $146 total for a normal 36-page booklet ($125 fee + $19 VFS service + $2 ICWF), or about $271 with Tatkal. A 60-page jumbo booklet is $196 normal / $321 Tatkal, per VFS USA as of July 2026.

### I live in Southern California — is that San Francisco's jurisdiction?
Not always. Parts of Southern California and the Southwest can fall under a different consulate. Verify your state and region on the VFS USA site before booking, since applying at the wrong center means starting over.

### Which states does the San Francisco Indian consulate cover?
Generally Northern California, Oregon, Washington, Nevada, Idaho, Montana, Wyoming, Utah, Colorado, Alaska, and Hawaii. Texas routes to Houston, the Southeast to Atlanta, the Northeast to New York, and the Midwest to Chicago. Always confirm on the official list.

### Are Bay Area VFS appointments hard to get?
They can be, given the large Indian tech community. Book 4–6 weeks ahead and watch for released morning slots.

### Where do I get Indian-spec photos in the Bay Area?
South-Asian photo shops in Fremont, Sunnyvale, and similar areas know the 2"x2" white-background format. US drugstore passport photos use the wrong background and framing and are commonly rejected.

### Can I renew my Indian passport in San Francisco if it has already expired?
Yes. There is no deadline to renew an expired Indian passport, and the same reissue process applies. You just cannot travel internationally until the new booklet arrives.

### Do I need to visit the VFS center in person?
Yes. Walk-ins are not accepted and the appointment is mandatory, because VFS captures biometrics and verifies your original documents in person.

## The bottom line
San Francisco renewals are the standard national process filed under the Western consulate. Confirm your state (Northern vs Southern California matters), book the in-demand VFS slot early, budget about $146 normal or $271 Tatkal, bring Indian-spec photos and full photocopies, and follow the [main guide](/indian-passport-renewal-usa) for the rest.

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },
  {
    slug: "houston-texas",
    kind: "city",
    title:
      "Indian Passport Renewal in Houston, Texas: VFS Center & Process (2026)",
    seoTitle: "Indian Passport Renewal in Houston Texas (2026): VFS Guide",
    metaDescription:
      "Indian passport renewal in Houston Texas. VFS address, appointment booking, documents, fees, and processing time for Texas residents.",
    navLabel: "Houston / Texas",
    excerpt:
      "Renewing your Indian passport in Houston — the VFS Global center, the Consulate jurisdiction it serves, and how to book and apply from Texas and the South.",
    date: "2026-06-14",
    content: `If you live in Texas or the south-central US, your Indian passport renewal runs through the **Consulate General of India, Houston** and its VFS Global Passport Seva Center. The steps are the same nationwide; you just file under Houston's jurisdiction. This page covers the Houston-specific bits — the [full process is in the main guide](/indian-passport-renewal-usa).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::summary
Houston's consulate covers Texas and much of the **south-central US**. Complete your application on **Passport Seva/GPSP**, then follow the **VFS portal instructions for payment and appointment** at the Houston center, and submit in person. Confirm the current address/hours on the **official VFS site** before you go.
:::

## Who files under Houston
The Consulate General of India, Houston generally handles jurisdiction for Texas and neighboring states — commonly including Texas, Oklahoma, Arkansas, Louisiana, Mississippi, Alabama, Tennessee, New Mexico, Arizona, Oklahoma, and others in the region.

:::info
title: Confirm your jurisdiction first
- VFS routes by **the state you live in**, not the closest city
- Some Southeastern states fall under the Atlanta consulate, not Houston — check the list
- The authoritative state list is on the Houston consulate and VFS websites
:::

## Booking the Houston VFS center
Book online at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa). Choose the **Houston Passport Seva Center**, select a slot, and print the confirmation.

:::tip
- Book **3–6 weeks ahead** — Houston serves a large Indian community and slots fill fast
- Get **Indian-spec photos** from a South-Asian photo shop (Hillcroft / Mahatma Gandhi District) — not a US drugstore
- Confirm parking and arrive 10–15 minutes early
:::

## What to bring
Identical to the national checklist — originals **plus** self-attested photocopies of each. The situation-by-situation list (name change, F1/OPT, dependents, lost passport) is on the [documents page](/indian-passport-renewal-usa/documents).

:::warn
- **Confirm the center address on the official VFS site the week of your appointment**
- Bring your **printed ARN form, fee receipt, and appointment letter**
- Carry proof of **valid US status** (I-797/I-94, Green Card, F1 + I-20)
:::

## Timeline from Houston
Processing follows the [national processing times](/indian-passport-renewal-usa/processing-time) — about **6–12 weeks normal**, **3–5 weeks Tatkal**. The new passport returns by speed post.

## Frequently asked questions

### I live in Georgia/Florida — do I use Houston?
Probably not — much of the Southeast falls under the Atlanta consulate. Verify your state on the VFS USA site before booking.

### Where do I get Indian-spec photos in Houston?
South-Asian photo shops around the Hillcroft / Mahatma Gandhi District know the 2"x2" white-background format.

### Is the process different in Texas?
No — it's the same national VFS process; only the jurisdiction and center differ. Follow the [main guide](/indian-passport-renewal-usa).

## The bottom line
Houston renewals are the standard national process filed under the south-central consulate. Confirm your state isn't actually Atlanta's, book the VFS slot early, bring Indian-spec photos and full photocopies, and follow the [main guide](/indian-passport-renewal-usa) for everything else.

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },

  /* ------------------------- CONTENT PAGES ------------------------- */
  {
    slug: "documents",
    kind: "content",
    title: "Documents Required for Indian Passport Renewal in USA 2026",
    seoTitle: "Documents for Indian Passport Renewal in USA 2026",
    metaDescription:
      "Document checklist for Indian passport renewal in the USA: 8 core documents, originals plus self-attested copies, address proof, and Annexure forms.",
    navLabel: "Documents checklist",
    excerpt:
      "The complete, situation-by-situation document checklist for renewing your Indian passport from the US — and the photocopy rules that trip people up at VFS.",
    date: "2026-06-14",
    content: `:::quickanswer
Indian passport renewal in the USA needs **8 core documents**, each brought as an **original plus a self-attested photocopy**: your printed Passport Seva application with ARN, your current passport, proof of valid US status, US address proof, Indian address proof, **2 photos in Indian 2"x2" specs**, the fee receipt, and your VFS appointment letter. Specific situations add more — a marriage certificate for a name change, an I-20 for F-1 students, the principal's I-797 for H-4/L-2 dependents, and a police report plus affidavit for a lost passport. Missing photocopies are the single most common reason applications stall at the counter.
:::

:::key
- Bring **originals AND self-attested photocopies** of every document — VFS verifies the original and keeps the copy.
- Budget **2 photos at 2"x2"** in Indian specs with a plain white background; US drugstore passport photos are routinely rejected.
- Show US address proof dated within the **last 3 months** — utility bill, bank statement, or lease in your name.
- Add situation documents: marriage certificate (name change), I-20 (F-1), principal's I-797 (H-4/L-2), police report (lost passport).
- Expect extra paperwork for minors: birth certificate, **both parents'** passports and status proof, and **Annexure D** consent if one parent cannot attend.
:::

Missing documents — and missing photocopies — are the number-one reason applications stall at the VFS counter. This page is the complete list of documents required for Indian passport renewal in the USA, written for H-1B, L-1, F-1/OPT, H-4 and green card holders applying through VFS Global. The rule that catches most people: every single item must arrive as an original **and** a self-attested copy, and Indian-spec photos are not the same as US ones. Below: the 8-document core checklist, what counts as address proof on both the US and India side, the add-on documents for each situation, the Annexure forms and when you need them, photo specifications, minor applicant requirements, and the rejection reasons worth avoiding. For the overall process, see the [main guide](/indian-passport-renewal-usa).

## What Documents Do You Need? (Core Checklist)
| Document | Notes |
| --- | --- |
| Printed application form | With ARN number from Passport Seva |
| Current Indian passport | Original + copy of first & last 2 pages |
| Proof of US status | I-797/I-94, Green Card, F1 visa, or EAD |
| US address proof | Utility bill, bank statement, or lease (last 3 months) |
| Indian address proof | Aadhaar, voter ID, or similar |
| 2 passport photos | Indian specs — 2"x2", white background |
| Fee payment receipt | Printed from Passport Seva |
| Appointment confirmation | Printed VFS letter |

:::warn
- VFS needs **originals AND self-attested photocopies** — bringing only one fails
- **Self-attest** copies by signing across them
- Print everything — ARN form, fee receipt, appointment letter — don't rely on phone screens
:::

## What Extra Documents Does Your Situation Need?

:::info
title: Name change after marriage
- Marriage certificate (original + copy)
- Spouse's passport copy
:::

:::info
title: F1 / OPT students
- I-20 (original + copy)
- OPT EAD card, if applicable
:::

:::info
title: H4 / L2 dependents
- Principal applicant's valid H1B/L1 and I-797 copy
- Marriage certificate
:::

:::info
title: Lost or stolen passport
- Police report (FIR) from local US police
- Notarized affidavit of loss
- Processing takes longer — see the [processing-time page](/indian-passport-renewal-usa/processing-time)
:::

## What Counts as Address Proof?

You need **both** a US address proof (where you live now) and an Indian address proof (the address printed in your passport). Each must be an original plus a self-attested copy.

| US address proof — any one | Indian address proof — any one |
|---|---|
| Utility bill (electricity, gas, water, internet), last 3 months | Aadhaar card |
| Bank or credit-card statement, last 3 months | Voter ID (EPIC) |
| Signed lease or mortgage statement | Ration card |
| State driver's license or state ID | Registered rent agreement |
| Employer letter on letterhead (as supporting proof) | Utility bill in a parent's name with relationship proof |

> Accepted lists vary by consulate jurisdiction and change over time. Confirm yours on VFS before the appointment — a mismatch between the address on your form and on the proof is a common rejection.

## Which Annexure Form Do You Need?

Annexures are standard declaration forms. Most straightforward renewals need none, but these come up often:

| Annexure | When you need it | Notarized? |
|---|---|---|
| Annexure D | One parent cannot attend a minor's appointment (consent of absent parent) | Yes |
| Annexure E | Standard declaration used in several reissue situations | Often |
| Annexure F | Tatkal (fast-track) applications | Yes |
| Affidavit of loss | Lost or stolen passport, alongside the police report | Yes |
| Name-change declaration | Name differs across documents, or change after marriage/divorce | Yes |

> Annexure numbering and requirements are set by the Ministry of External Affairs and change periodically — download the current form from Passport Seva or VFS rather than reusing an old PDF.

## What Are the Photo Requirements?
Indian photos differ from US ones — wrong format is a top rejection reason.

:::good
- **2" x 2"** (51mm x 51mm), high-resolution color
- **Plain white** background, no shadows
- Face fills **70–80%** of the frame, neutral expression, both eyes open
- Taken within the **last 6 months**
:::

:::bad
- No glasses (even prescription), no non-religious head coverings
- Don't use US drugstore "passport photo" booths — they shoot US specs
- Don't reuse an old photo — it must be recent
:::

## What Documents Do Minors (Children) Need?
Children need extras: birth certificate, **both parents' passports and US status proof**, and 2 child photos. If one parent can't attend VFS, the absent parent provides a notarized consent (Annexure D). The child must attend for biometrics.

## Frequently asked questions

### Do I really need photocopies if I bring originals?
Yes. VFS requires both — originals to verify, copies to submit. Self-attest each copy.

### What counts as US address proof?
A utility bill, bank statement, or lease issued in the last ~3 months showing your name and US address. (VFS and Passport Seva call this "proof of address" — "address proof" is the same thing.)

### What counts as Indian address proof?
Aadhaar, voter ID, or a similar Indian document. Bring it as original plus a self-attested photocopy, like everything else on the checklist. The accepted list varies by jurisdiction and changes — confirm it on VFS for your center before your appointment.

### My name differs slightly between documents — is that a problem?
A mismatch (even a middle name) can cause delays. Bring supporting documents and, if needed, an affidavit explaining the difference.

### What is Annexure E for Indian passport renewal?
Annexure E is one of the standard declaration forms used in certain reissue situations. Whether you need it depends on your specific case and jurisdiction, and the Ministry of External Affairs updates the annexure set periodically — always download the current version from Passport Seva or VFS rather than reusing a saved copy.

### What documents does a minor need for Indian passport renewal?
The child's birth certificate, the current passport, **both parents'** passports and US status proof, two Indian-spec photos, and the printed application. If one parent cannot attend, that parent signs a notarized Annexure D consent. The child must attend in person for biometrics.

### Do I need to submit my old passport?
Yes — you submit the current passport and it is returned to you, usually cancelled, alongside the new one. Keep both together when travelling, since a valid US visa stamp in the cancelled book remains usable for entry.

## How This Connects to the Rest of Your Renewal

The document set is one of three things that decide whether your appointment goes smoothly — the others are [fees and the Tatkal decision](/indian-passport-renewal-usa) and [realistic processing times](/indian-passport-renewal-usa/processing-time). Your consulate jurisdiction determines which VFS center reviews these documents, so confirm yours first: [Chicago](/indian-passport-renewal-usa/chicago), [New York](/indian-passport-renewal-usa/new-york), [San Francisco](/indian-passport-renewal-usa/san-francisco), or [Houston](/indian-passport-renewal-usa/houston-texas). If US visa stamping is next on your list, note that consulates typically want at least 6 months of passport validity — see [H-1B stamping after selection](/h1b-visa-stamping-after-selection).

## The bottom line
Assemble the core set, add the documents your situation requires, photocopy and self-attest everything, and bring Indian-spec photos. Then head back to the [main guide](/indian-passport-renewal-usa) to book the appointment — or go straight to your center: [Chicago](/indian-passport-renewal-usa/chicago), [New York](/indian-passport-renewal-usa/new-york), [San Francisco](/indian-passport-renewal-usa/san-francisco), or [Houston](/indian-passport-renewal-usa/houston-texas).

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },
  {
    slug: "processing-time",
    kind: "content",
    title: "Indian Passport Renewal Processing Time in the USA (2026)",
    seoTitle: "Indian Passport Renewal Processing Time in USA (2026)",
    metaDescription:
      "How long does Indian passport renewal take in USA? Normal vs Tatkal timelines, 2026 VFS processing estimates, and how to track your application.",
    navLabel: "Processing time",
    excerpt:
      "How long Indian passport renewal really takes from the US — normal vs Tatkal timelines, what causes delays, and how to track your application.",
    date: "2026-06-14",
    content: `"How long will it take?" is the question everyone asks. The honest answer: plan for the long end of the range, because peak seasons and consulate backlogs stretch timelines. Here's what to actually expect, and how to track it. For the overall process, see the [main guide](/indian-passport-renewal-usa).

:::summary
Normal renewal runs **6–12 weeks**, Tatkal **3–5 weeks**, and lost-passport cases **8–16 weeks** — estimates, not guarantees. Peak seasons (**Nov–Feb, Jun–Aug**) and police verification add time. **Don't book non-refundable travel** until the new passport is in hand.
:::

## Realistic timelines
| Service | Estimated time |
| --- | --- |
| Normal renewal | 6–12 weeks |
| Tatkal renewal | 3–5 weeks |
| Lost / stolen passport | 8–16 weeks |
| Minor (first-time) | 8–14 weeks |

:::warn
- These are **estimates**, not service guarantees — even Tatkal has no promised date
- **Don't book non-refundable international travel** until you physically have the new passport
- Build in extra time for **speed-post return** after the consulate prints it
:::

## What slows things down
:::bad
- **Peak seasons** — Nov–Feb and Jun–Aug see the heaviest volume
- **Police verification** — triggered by a changed Indian address or first-time passports
- **Document issues** — a wrong photo or missing copy restarts your queue position
- **Consulate backlogs** — vary by jurisdiction and time of year
:::

## Tatkal: faster, not instant
Tatkal cuts the queue for ~$70–80 more plus an Annexure F self-declaration. Choose it for confirmed near-term travel or an emergency — but treat even Tatkal dates as estimates and apply as early as you can.

:::compare
left: Normal is fine if
right: Tatkal makes sense if
✗ Your travel is 3+ months away
✗ You'd rather save the fee
✗ You have no hard deadline
✓ Confirmed travel within ~8–10 weeks
✓ Family emergency in India
✓ Passport expires within 6 months
:::

## How to track your application
:::steps
Log in to [passportindia.gov.in](https://passportindia.gov.in) and open "Track Application Status."
Enter your File Number or ARN to see the current stage.
Watch for SMS/email updates from VFS and the consulate.
Once dispatched, track the speed-post return to your mailing address.
:::

## Plan backwards from your travel
The safest rule: start **3–4 months before** your passport expires or before any international trip. If you're cutting it close, read the [documents page](/indian-passport-renewal-usa/documents) so nothing bounces your application, and consider Tatkal.

## Frequently asked questions

### Is Tatkal guaranteed faster?
It's prioritized and usually faster (3–5 weeks vs 6–12), but there's no guaranteed delivery date. Apply early regardless.

### Why is my renewal taking longer than the estimate?
Peak season, police verification, document issues, or consulate backlog. Track status with your ARN and contact VFS if it stalls well beyond the range.

### Can I travel while my application is in process?
Not on the passport you've submitted — it's with the consulate. Don't plan travel until the new passport arrives.

## The bottom line
Normal 6–12 weeks, Tatkal 3–5, lost passports longest — all estimates. Start 3–4 months ahead, keep your documents clean to avoid restarts, track with your ARN, and don't commit to travel until the new book is in your hands. Back to the [main guide](/indian-passport-renewal-usa).

:::cta
title: Stay ahead of your renewal
body: Explore more NRI guides, or sign up for monthly visa bulletin updates and passport renewal alerts.
button: Browse NRI guides
href: /topics
:::`,
  },
];

export const clusterPages: ClusterPage[] = rawPages.map((p) => ({
  ...p,
  readingTime: computeReadingTime(p.content),
  feeSnapshot: passportFeeSnapshot,
}));

export const clusterHub: ClusterPage = clusterPages.find(
  (p) => p.kind === "hub"
)!;

export const clusterChildren: ClusterPage[] = clusterPages.filter(
  (p) => p.kind !== "hub"
);

export const clusterCities: ClusterPage[] = clusterPages.filter(
  (p) => p.kind === "city"
);

export const clusterContentPages: ClusterPage[] = clusterPages.filter(
  (p) => p.kind === "content"
);

/** Look up a cluster page by child slug ("" → hub). */
export function getClusterPage(slug: string): ClusterPage | undefined {
  return clusterPages.find((p) => p.slug === slug);
}
