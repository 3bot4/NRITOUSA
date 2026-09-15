/**
 * OCI Center — single source of truth for every fee, processing time, and
 * official link used across /oci/* pages and the OCI interactive tools.
 *
 * RULE (per project spec): NEVER hardcode an OCI fee or a processing time in a
 * page, component, or article. Import it from here. When VFS Global or the
 * consulates revise a number, change it ONCE in this file and every guide,
 * calculator, and timeline updates automatically.
 *
 * Everything below is an EDUCATIONAL ESTIMATE summarised from public VFS Global
 * USA / Indian consulate fee schedules. Amounts and durations change without
 * notice — every consumer surfaces `VERIFY_SOURCES` so users confirm before
 * paying or planning travel.
 */

/** Plain-English "as of" stamp shown next to any figure from this file. */
export const OCI_DATA_AS_OF = "2026-09-14";

/** Authoritative links every OCI page must cite. */
export const VERIFY_SOURCES = {
  ociServices: {
    label: "VFS Global — OCI services (USA)",
    href: "https://visa.vfsglobal.com/usa/en/ind/apply-oci-services",
  },
  ociPortal: {
    label: "Government of India — OCI online portal",
    href: "https://ociservices.gov.in",
  },
  mha: {
    label: "Ministry of Home Affairs — OCI",
    href: "https://www.mha.gov.in/en/divisionofmha/foreigners-division/overseas-citizen-of-india-cardholder",
  },
  passportSeva: {
    label: "Passport Seva (India)",
    href: "https://www.passportindia.gov.in",
  },
} as const;

export type VerifySourceKey = keyof typeof VERIFY_SOURCES;

/* ------------------------------------------------------------------ *
 * Fees (USD) — government + VFS + optional add-ons
 * ------------------------------------------------------------------ */

export interface FeeLine {
  id: string;
  label: string;
  /** Amount in USD. */
  amount: number;
  /** Short note on what the fee covers / when it applies. */
  note?: string;
  /** Optional add-ons the applicant may opt out of. */
  optional?: boolean;
}

/**
 * Core government service fees, by OCI service type. These are the amounts the
 * Government of India charges; VFS adds its own service charge (below).
 */
export const GOVERNMENT_FEES = {
  freshAdult: {
    id: "gov-fresh-adult",
    label: "Fresh OCI registration (adult)",
    amount: 275,
    note: "First-time OCI for an applicant 18 or older.",
  },
  freshMinor: {
    id: "gov-fresh-minor",
    label: "Fresh OCI registration (minor)",
    amount: 275,
    note: "First-time OCI for an applicant under 18, including newborns.",
  },
  pioConversion: {
    id: "gov-pio",
    label: "OCI registration in lieu of a PIO card",
    amount: 100,
    note: "Converting a PIO card to OCI — the same $100 applies whether the PIO card is valid or lost/damaged. It is NOT free.",
  },
  passportUpdateLate: {
    id: "gov-passport-update-late",
    label: "Passport-particulars update filed more than 3 months after the new passport",
    amount: 25,
    note: "Updating passport particulars is FREE when filed within three months of the new passport. This consular fee applies only to a late filing, and ICWF plus the VFS service charge are added on top.",
  },
  miscNewPassport: {
    id: "gov-misc-passport",
    label: "Miscellaneous service — name / address / detail change",
    amount: 25,
    note: "OCI Miscellaneous Services rate for a change to what is recorded — a name change, for example. Not the same thing as a routine passport-particulars update, which is free when timely.",
  },
  lostDamaged: {
    id: "gov-lost",
    label: "Re-issue — lost / damaged OCI card",
    amount: 100,
    note: "Replacement of a lost, stolen, or damaged OCI card, plus ICWF and the VFS service charge. A police report is required for a loss, and the mission generally verifies originals in person. This is NOT the $25 miscellaneous-services rate — a previous revision of this file had it at $25, which understated it fourfold.",
  },
  // `satisfies` rather than `: Record<string, FeeLine>`: the Record annotation
  // let a removed key (`reissue`) still type-check at every call site and go
  // undefined at runtime. This keeps the shape check and the literal keys.
} as const satisfies Record<string, FeeLine>;

/* ─────── Passport-particulars update: the rule, and where it diverges ───── */

/**
 * Updating OCI after a new passport. This is the single most-asked question in
 * the cluster and the hardest to state nationally, because the missions do not
 * currently say the same thing.
 *
 * WHAT EVERY SOURCE CHECKED AGREES ON (safe to state as the rule):
 *   • You update passport particulars on the OCI portal, online.
 *   • The window is three months from receipt of the new passport.
 *   • Filed inside that window it is FREE, with no physical application and no
 *     VFS visit.
 *   • You keep your existing card — no new physical card is produced for a
 *     routine passport update.
 *   • Filed late, a consular fee plus ICWF plus the VFS service charge applies.
 *
 * WHERE THEY DIVERGE (must be attributed, never presented as national):
 *   • CGI San Francisco's advisory of June 16, 2026 and CGI Chicago say the
 *     update is required EACH time a new passport is issued, at any age.
 *   • The Government of India OCI portal's own miscellaneous FAQs, and CGI
 *     Atlanta, still carry the older formulation: upload each time up to age 20
 *     and once after completing 50.
 *   • On the post-20 case the three differ again: the GoI portal calls it a
 *     mandatory one-time CARD RE-ISSUE at US$25; CGI Chicago states that
 *     re-issuance of physical OCI cards "has been discontinued"; CGI San
 *     Francisco frames it as a BIOMETRIC enrolment obligation rather than a new
 *     card.
 *
 * Because of that, this cluster states the common ground as the rule, names the
 * divergence, and tells the reader to follow the mission for their own
 * jurisdiction rather than presenting any one consulate as universal.
 *
 * HOW TO UPDATE: re-check the GoI portal FAQs plus at least two US missions
 * before changing any of this, and only collapse the divergence when they
 * actually agree.
 */
export const PASSPORT_UPDATE = {
  verified: "2026-09-15",
  /** Months from receipt of the new passport to file free of charge. */
  windowMonths: 3,
  /** Filed inside the window. */
  timelyFeeUsd: 0,
  /** Age after which a new passport triggers the biometric obligation. */
  biometricsAfterAge: 20,
  /** True while the missions do not state the same rule. */
  jurisdictionsDiverge: true,
  agreed: [
    "The update is made online on the OCI portal.",
    "The window is three months from receipt of the new passport.",
    "Filed within that window it is free, with no physical application and no VFS visit.",
    "No new physical card is issued for a routine passport update — your existing card stands.",
    "Filed late, a consular fee plus ICWF and the VFS service charge apply.",
  ],
  diverges: [
    {
      question: "Is an update required after EVERY new passport?",
      positions: [
        "CGI San Francisco (advisory of June 16, 2026) and CGI Chicago: yes, each time a new passport is issued, at any age.",
        "The Government of India OCI portal's miscellaneous FAQs and CGI Atlanta: each time up to age 20, and once after completing 50.",
      ],
    },
    {
      question: "What happens on a passport obtained after age 20?",
      positions: [
        "GoI OCI portal: a one-time card re-issue is required, at US$25, to capture adult facial features.",
        "CGI Chicago: re-issuance of physical OCI cards has been discontinued.",
        "CGI San Francisco: biometric information must be given to the Mission/Post or FRRO, or at the immigration post on first entry or departure.",
      ],
    },
  ],
  sources: [
    { label: "GoI OCI portal — miscellaneous services FAQs", href: "https://ociservices.gov.in/onlineOCI/miscFAQs" },
    { label: "CGI San Francisco — advisory on updating passport particulars (June 16, 2026)", href: "https://www.cgisf.gov.in/section/news/advisory-for-oci-cardholders-updating-passport-particulars-after-obtaining-a-new-passport/" },
    { label: "CGI Chicago — OCI card updation (re-issuance discontinued)", href: "https://www.cgichicago.gov.in/page/oci-card-updation-reissuance-of-oci-cards-discontinued/" },
    { label: "CGI Atlanta — when to update your OCI card", href: "https://indiainatlanta.gov.in/eoial_pages/MjYw" },
  ],
} as const;

export type GovernmentFeeKey = keyof typeof GOVERNMENT_FEES;

/** VFS Global service & logistics charges (per application). */
export const VFS_FEES: Record<string, FeeLine> = {
  service: {
    id: "vfs-service",
    label: "VFS Global service charge",
    amount: 19,
    note: "Per-application VFS processing fee. Always charged.",
  },
  icwf: {
    id: "icwf",
    label: "Indian Community Welfare Fund (ICWF)",
    amount: 3,
    note: "Small statutory contribution collected on consular services.",
  },
  courierReturn: {
    id: "courier-return",
    label: "Return courier (secure mail-back)",
    amount: 20,
    note: "Tracked return shipping of your documents and card.",
    optional: true,
  },
  sms: {
    id: "sms",
    label: "SMS status updates",
    amount: 2.5,
    note: "Optional text-message tracking notifications.",
    optional: true,
  },
  premiumLounge: {
    id: "premium-lounge",
    label: "Premium lounge / assisted service",
    amount: 35,
    note: "Optional priority counter and document assistance where offered.",
    optional: true,
  },
} as const;

export type VfsFeeKey = keyof typeof VFS_FEES;

/* ------------------------------------------------------------------ *
 * Processing timeline (stages, in days)
 * ------------------------------------------------------------------ */

export interface TimelineStage {
  id: string;
  label: string;
  description: string;
  /** Typical lower / upper bound in calendar days for this stage alone. */
  minDays: number;
  maxDays: number;
}

/**
 * End-to-end OCI processing, stage by stage. Durations are sequential and
 * additive — the Timeline Calculator sums them onto the application date.
 * OCI involves a two-stage government clearance (consulate + MHA in India),
 * which is why total times run longer than a passport re-issue.
 */
export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "vfs-submission",
    label: "VFS submission & document check",
    description:
      "After you complete the online OCI application, VFS receives your documents (by mail or in person) and verifies them.",
    minDays: 2,
    maxDays: 7,
  },
  {
    id: "consulate",
    label: "Consulate processing",
    description:
      "The Indian Consulate reviews the application and forwards eligible cases to the Ministry of Home Affairs in India.",
    minDays: 10,
    maxDays: 21,
  },
  {
    id: "mha",
    label: "MHA clearance (India)",
    description:
      "The Ministry of Home Affairs conducts background clearance and grants the OCI. This is usually the longest stage.",
    minDays: 21,
    maxDays: 60,
  },
  {
    id: "printing",
    label: "Printing & booklet/card production",
    description:
      "Once granted, the OCI is printed and the document/sticker is produced.",
    minDays: 5,
    maxDays: 14,
  },
  {
    id: "dispatch",
    label: "Dispatch & return delivery",
    description:
      "VFS dispatches your documents and OCI back to you via the return courier you selected.",
    minDays: 3,
    maxDays: 10,
  },
];

/** Convenience totals (sum of all stages), in calendar days. */
export const TIMELINE_TOTAL = {
  minDays: TIMELINE_STAGES.reduce((s, st) => s + st.minDays, 0),
  maxDays: TIMELINE_STAGES.reduce((s, st) => s + st.maxDays, 0),
};

/** Human label for the headline processing range, e.g. "6–16 weeks". */
export function totalWeeksLabel(): string {
  const lo = Math.round(TIMELINE_TOTAL.minDays / 7);
  const hi = Math.round(TIMELINE_TOTAL.maxDays / 7);
  return `${lo}–${hi} weeks`;
}

/* ------------------------------------------------------------------ *
 * Fast Answer snapshot (built from the fees + timeline above)
 * ------------------------------------------------------------------ */

const usd = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(2)}`;

/** Estimated all-in cost for a fresh adult OCI (govt + VFS + ICWF, incl. courier). */
export function freshOciAllInLabel(): string {
  const total =
    GOVERNMENT_FEES.freshAdult.amount +
    VFS_FEES.service.amount +
    VFS_FEES.icwf.amount +
    VFS_FEES.courierReturn.amount;
  return `~${usd(total)}`;
}

/** Rows for the OCI "Fast Answer" snapshot — always sourced from this config. */
export function ociSnapshotRows(): { label: string; value: string; note?: string; highlight?: boolean }[] {
  return [
    { label: "Fresh OCI — govt fee", value: usd(GOVERNMENT_FEES.freshAdult.amount), note: "Adult or minor; same government fee. Updating passport particulars on the portal within " + PASSPORT_UPDATE.windowMonths + " months is free; a late update is " + usd(GOVERNMENT_FEES.passportUpdateLate.amount) + " plus ICWF and VFS charges.", highlight: true },
    { label: "VFS service + ICWF", value: `${usd(VFS_FEES.service.amount)} + ${usd(VFS_FEES.icwf.amount)}`, note: "Per application; plus optional return courier " + usd(VFS_FEES.courierReturn.amount) + "." },
    { label: "All-in (fresh adult)", value: freshOciAllInLabel(), note: "Govt + VFS + ICWF + return courier. Use the Cost Calculator for your exact case." },
    { label: "Processing time", value: totalWeeksLabel(), note: "Two-stage clearance (consulate + MHA in India); plan for the long end." },
  ];
}

/** Official sources for the OCI Fast Answer. */
export const OCI_SNAPSHOT_SOURCES: { label: string; href: string }[] = [
  { label: "VFS Global — OCI (USA)", href: "https://visa.vfsglobal.com/usa/en/ind/apply-oci-services" },
  { label: "Consulate OCI fee schedule", href: "https://www.cgisf.gov.in/page/oci-overseas-citizenship-of-india-cards/" },
];

export const OCI_SNAPSHOT_DISCLAIMER =
  "Fees and processing times are best-known current figures (from VFS/consulate schedules) and change without notice; MHA clearance timing varies widely. Educational planning only — confirm the exact fee and time on VFS/your consulate before applying or booking travel.";

/* ------------------------------------------------------------------ *
 * Photo specification (for the Photo Checker)
 * ------------------------------------------------------------------ */

export const PHOTO_SPEC = {
  dimensions: "2 x 2 inches (51 x 51 mm), square",
  background: "Plain white or very light, no shadows",
  facePercent: "Face should fill 60–70% of the frame, centred",
  fileSizeOnline: "Online upload: JPEG, typically 10 KB – 1 MB",
  pixelsOnline: "Roughly 600 x 600 px, equal width and height",
  expression: "Neutral expression, both eyes open, no smiling",
  glassesHeadgear:
    "No glasses; no headgear except for religious reasons (face fully visible)",
  recency: "Taken within the last 3–6 months",
} as const;

/* ------------------------------------------------------------------ *
 * Shared cross-links for OCI tools/guides (internal linking)
 * ------------------------------------------------------------------ */

export const OCI_BASE = "/oci";

export const OCI_TOOLS = {
  eligibility: {
    slug: "oci-eligibility-checker",
    path: "/tools/oci-eligibility-checker",
    label: "OCI Eligibility Checker",
  },
  /**
   * Roadmap tools — NOT yet built. They deliberately carry no `path`: the
   * routes do not exist, so exposing one would let a caller render a 404
   * (which is exactly what /tools/oci-document-checklist did). Omitting
   * `path` makes any `OCI_TOOLS.checklist.path` link a compile error until
   * the route ships. Add `path` back in the same commit as the route.
   */
  checklist: {
    slug: "oci-document-checklist",
    label: "OCI Document Checklist Generator",
  },
  timeline: {
    slug: "oci-timeline-calculator",
    path: "/tools/oci-timeline-calculator",
    label: "OCI Timeline Calculator",
  },
  cost: {
    slug: "oci-cost-calculator",
    path: "/tools/oci-cost-calculator",
    label: "OCI Cost Calculator",
  },
  photo: {
    slug: "oci-photo-checker",
    label: "OCI Photo Checker",
  },
} as const;
