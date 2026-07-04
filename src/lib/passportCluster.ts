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
    title: "Indian Passport Renewal in the USA: The Complete 2026 Guide",
    seoTitle:
      "Indian Passport Renewal in USA (2026): VFS Guide, Documents & Fees",
    metaDescription:
      "Renew your Indian passport in the USA with this 2026 VFS guide. Documents, fees, photo rules, processing time, Tatkal vs normal, and common mistakes to avoid.",
    navLabel: "Start here",
    excerpt:
      "The complete hub for renewing your Indian passport from the US — the VFS Global process, documents, fees, photo specs, city-by-city centers, and processing times.",
    date: "2026-06-14",
    content: `Renewing an Indian passport from the US is a paperwork exercise, not a hard one — but a single wrong photo or a missing photocopy at the VFS counter can cost you weeks. This is the master guide: the full process here, plus deep dives on your nearest center, the exact documents, and realistic timelines.

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::summary
Indian citizens on any valid US status (H1B, L1, F1/OPT, H4, Green Card) renew through **VFS Global** on behalf of the Indian Consulate. Complete your application on **Passport Seva/GPSP**, then follow the **VFS portal instructions for payment and appointment**. Normal processing runs **6–12 weeks**, Tatkal **3–5 weeks**. Most renewals need **no police verification**. Start 3–4 months before expiry or travel.
:::

:::info
title: Explore this guide
- **Your city:** [Chicago](/indian-passport-renewal-usa/chicago) · [New York](/indian-passport-renewal-usa/new-york) · [San Francisco](/indian-passport-renewal-usa/san-francisco) · [Houston / Texas](/indian-passport-renewal-usa/houston-texas)
- **Go deeper:** the full [documents checklist](/indian-passport-renewal-usa/documents) and realistic [processing times](/indian-passport-renewal-usa/processing-time)
:::

## Who can renew in the USA
Any Indian citizen with valid US immigration status can renew here — the visa stamp can be expired as long as the underlying status (H1B, etc.) is current.

:::info
title: You should renew if any of these is true
- Passport is **expired or expiring within 12 months**
- Fewer than **2 blank pages** remain
- It's **damaged, lost, or stolen**
- Your **name or personal details changed** (e.g. after marriage)
:::

> OCI/PIO cardholders (US citizens of Indian origin) follow a different process — this guide is for Indian passport holders.

## The VFS Global process, step by step
The consulates outsource passport services to VFS Global. You do the application and payment yourself online first; VFS only handles document intake and biometrics.

:::steps
Create an account on [passportindia.gov.in](https://passportindia.gov.in) and choose "Reissue of Passport" — not "Fresh Passport."
Fill the form accurately (name, DOB, Indian address, emergency contacts) and note your Application Reference Number (ARN).
Complete your application on Passport Seva/GPSP, then follow VFS portal instructions for payment and appointment. Confirm the exact payment step on VFS for your jurisdiction before submitting.
Book your VFS appointment at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) — slots fill 3–6 weeks out, so book early.
Attend on the day with all originals + photocopies; VFS verifies documents and captures biometrics.
Track status on the Passport Seva portal with your ARN; the new passport returns by speed post.
:::

## Documents, in one line each
Bring every document as **original plus a self-attested photocopy** — missing copies are the #1 reason people get turned away. The essentials: printed form with ARN, current passport, proof of US status, proof of US address, proof of Indian address, two Indian-spec photos, and your fee + appointment receipts. The complete, situation-by-situation list is on the [documents page](/indian-passport-renewal-usa/documents).

## Fees
Fees are paid in USD when you apply. Complete your application on Passport Seva/GPSP, then follow VFS portal instructions for payment and appointment — confirm the exact payment step on VFS for your jurisdiction before submitting. VFS adds a service charge of roughly $15–25 per application.

| Service | Normal | Tatkal |
| --- | --- | --- |
| 36-page (10 yr) | ~$98 | ~$176 |
| 60-page (10 yr) | ~$111 | ~$190 |
| Minor under 15 (5 yr) | ~$45 | ~$101 |
| Lost/stolen | ~$162 | N/A |

> Fees change — always confirm current rates on [passportindia.gov.in](https://passportindia.gov.in) before paying.

## Photo requirements
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

## Which center do I go to?
VFS routes you by **consulate jurisdiction** — the consulate that covers the state you live in, not the nearest city. Pick yours:

| Consulate | Covers (broadly) | Local guide |
| --- | --- | --- |
| Chicago | Midwest | [Chicago →](/indian-passport-renewal-usa/chicago) |
| New York | Northeast | [New York →](/indian-passport-renewal-usa/new-york) |
| San Francisco | West Coast | [San Francisco →](/indian-passport-renewal-usa/san-francisco) |
| Houston | South-central | [Houston / Texas →](/indian-passport-renewal-usa/houston-texas) |

## Processing time
Plan for the long end of these ranges, especially in peak seasons (Nov–Feb, Jun–Aug). The full breakdown — and how to track status — is on the [processing-time page](/indian-passport-renewal-usa/processing-time).

| Service | Estimated time |
| --- | --- |
| Normal renewal | 6–12 weeks |
| Tatkal renewal | 3–5 weeks |
| Lost passport | 8–16 weeks |

## Police verification
This is the part NRIs worry about most — and usually needn't. A straightforward renewal where your Indian address is unchanged and you have no pending cases needs **no police verification**. It's only triggered for fresh passports, a changed Indian address, lost/stolen cases, or a criminal record — in which case the consulate routes it to your local police station in India.

## Tatkal vs Normal
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

## Frequently asked questions

### Can I renew if I have a Green Card?
Yes. Green Card holders renew at VFS just like visa holders — bring the Green Card as proof of US status.

### Can I renew an already-expired passport?
Yes, there's no deadline to renew an expired Indian passport. You just can't travel internationally on it until the new one arrives.

### What happens to the US visa in my old passport?
It stays valid. Ask VFS to return your old passport stamped "CANCELLED" and travel with both books together — old (valid US visa) and new.

### Is a VFS appointment mandatory?
Yes — walk-ins aren't accepted. Book online in advance.

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
      "Indian Passport Renewal in San Francisco: VFS Center & Process (2026)",
    seoTitle: "Indian Passport Renewal in San Francisco (2026): VFS Guide",
    metaDescription:
      "Indian passport renewal in San Francisco Bay Area. VFS address, appointment tips, documents, fees, and processing time for California NRIs.",
    navLabel: "San Francisco",
    excerpt:
      "Renewing your Indian passport in San Francisco — the VFS Global center, the Consulate jurisdiction it serves, and how to book and apply from the West Coast.",
    date: "2026-06-14",
    content: `If you live on the West Coast, your Indian passport renewal runs through the **Consulate General of India, San Francisco** and its VFS Global Passport Seva Center. The steps are the same nationwide; you just file under San Francisco's jurisdiction. This page covers the SF-specific bits — the [full process is in the main guide](/indian-passport-renewal-usa).

:::warn
title: Verify before applying
- Official sources: [passportindia.gov.in](https://passportindia.gov.in) · [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa) · your consulate jurisdiction page
:::

:::summary
San Francisco's consulate covers much of the **Western US**. Complete your application on **Passport Seva/GPSP**, then follow the **VFS portal instructions for payment and appointment** at the San Francisco center, and submit in person. With the Bay Area's large tech-immigrant population, slots go quickly — book early and confirm the current address/hours on the **official VFS site**.
:::

## Who files under San Francisco
The Consulate General of India, San Francisco generally handles jurisdiction for Western states — including California (northern), Oregon, Washington, Nevada, Idaho, Montana, Wyoming, Colorado, Utah, Alaska, Hawaii, and others. Note that **Southern California and some Southwest states** may fall under a different consulate — check the list.

:::info
title: Confirm your jurisdiction first
- VFS routes by **the state you live in**, not the closest city
- Northern vs Southern California can differ — verify which consulate covers your address
- The authoritative state list is on the SF consulate and VFS websites
:::

## Booking the San Francisco VFS center
Book online at [visa.vfsglobal.com/usa](https://visa.vfsglobal.com/usa). Choose the **San Francisco Passport Seva Center**, select a slot, and print the confirmation.

:::tip
- The Bay Area is high-demand — book **4–6 weeks ahead** and check mornings for released slots
- Get **Indian-spec photos** from a South-Asian photo shop (Fremont, Sunnyvale, Artesia) — not a US drugstore
- Build in travel time; confirm parking near the center in advance
:::

## What to bring
Identical to the national checklist — originals **plus** self-attested photocopies of each. The full situation-by-situation list (name change, F1/OPT, dependents, lost passport) is on the [documents page](/indian-passport-renewal-usa/documents).

:::warn
- **Confirm the center address on the official VFS site the week of your appointment**
- Bring your **printed ARN form, fee receipt, and appointment letter**
- Carry proof of **valid US status** (I-797/I-94, Green Card, F1 + I-20)
:::

## Timeline from San Francisco
Processing follows the [national processing times](/indian-passport-renewal-usa/processing-time) — about **6–12 weeks normal**, **3–5 weeks Tatkal**. The new passport returns by speed post to your mailing address.

## Frequently asked questions

### I live in Southern California — is that San Francisco's jurisdiction?
Not always. Parts of Southern California and the Southwest can fall under a different consulate. Verify your state/region on the VFS USA site before booking.

### Are Bay Area appointments hard to get?
They can be, given the large Indian tech community. Book 4–6 weeks ahead and watch for released morning slots.

### Where do I get Indian-spec photos in the Bay Area?
South-Asian photo shops in Fremont, Sunnyvale, and similar areas know the 2"x2" white-background format.

## The bottom line
San Francisco renewals are the standard national process filed under the Western consulate. Confirm your state (Northern vs Southern California matters), book the in-demand VFS slot early, bring Indian-spec photos and full photocopies, and follow the [main guide](/indian-passport-renewal-usa) for the rest.

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
    title: "Indian Passport Renewal Documents in the USA: Full Checklist (2026)",
    seoTitle: "Documents Required for Indian Passport Renewal in USA (2026)",
    metaDescription:
      "Full checklist of documents required for Indian passport renewal in USA. Original + photocopy requirements, VFS checklist, and common rejection reasons.",
    navLabel: "Documents checklist",
    excerpt:
      "The complete, situation-by-situation document checklist for renewing your Indian passport from the US — and the photocopy rules that trip people up at VFS.",
    date: "2026-06-14",
    content: `Missing documents — and missing photocopies — are the number-one reason applications stall at the VFS counter. This is the complete checklist, including the extras you need for name changes, students, dependents, and lost passports. For the overall process, see the [main guide](/indian-passport-renewal-usa).

:::summary
Bring every document as **original plus a self-attested photocopy**. The core set is the same for everyone; specific situations (marriage name change, F1/OPT, H4/L2 dependents, lost/stolen) add a few documents on top. Confirm the latest checklist on the **VFS site** before your appointment — requirements change.
:::

## The core checklist — everyone needs these
| Document | Notes |
| --- | --- |
| Printed application form | With ARN number from Passport Seva |
| Current Indian passport | Original + copy of first & last 2 pages |
| Proof of US status | I-797/I-94, Green Card, F1 visa, or EAD |
| Proof of US address | Utility bill, bank statement, or lease (last 3 months) |
| Proof of Indian address | Aadhaar, voter ID, or similar |
| 2 passport photos | Indian specs — 2"x2", white background |
| Fee payment receipt | Printed from Passport Seva |
| Appointment confirmation | Printed VFS letter |

:::warn
- VFS needs **originals AND self-attested photocopies** — bringing only one fails
- **Self-attest** copies by signing across them
- Print everything — ARN form, fee receipt, appointment letter — don't rely on phone screens
:::

## Add-on documents by situation

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

## Photo specifications
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

## Minor (child) applicants
Children need extras: birth certificate, **both parents' passports and US status proof**, and 2 child photos. If one parent can't attend VFS, the absent parent provides a notarized consent (Annexure D). The child must attend for biometrics.

## Frequently asked questions

### Do I really need photocopies if I bring originals?
Yes. VFS requires both — originals to verify, copies to submit. Self-attest each copy.

### What counts as proof of US address?
A utility bill, bank statement, or lease issued in the last ~3 months showing your name and US address.

### My name differs slightly between documents — is that a problem?
A mismatch (even a middle name) can cause delays. Bring supporting documents and, if needed, an affidavit explaining the difference.

## The bottom line
Assemble the core set, add the documents your situation requires, photocopy and self-attest everything, and bring Indian-spec photos. Then head back to the [main guide](/indian-passport-renewal-usa) or your [city page](/indian-passport-renewal-usa) to book the appointment.

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
