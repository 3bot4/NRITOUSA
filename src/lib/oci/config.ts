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
export const OCI_DATA_AS_OF = "2026-07-04";

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
    href: "https://www.mha.gov.in/en/foreigners/overseas-citizenship-of-india-oci-cardholder",
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
export const GOVERNMENT_FEES: Record<string, FeeLine> = {
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
    label: "PIO-to-OCI conversion",
    amount: 0,
    note: "Conversion of a PIO card to OCI is generally free of the government fee — confirm current policy with VFS.",
  },
  reissue: {
    id: "gov-reissue",
    label: "OCI re-issue (new passport / 20-yr / 50-yr)",
    amount: 275,
    note: "Re-issue when a new passport is obtained, or at the under-20 / over-50 milestones.",
  },
  miscNewPassport: {
    id: "gov-misc-passport",
    label: "Miscellaneous service — new passport update",
    amount: 100,
    note: "Updating OCI with a new passport when re-issue is not mandatory.",
  },
  lostDamaged: {
    id: "gov-lost",
    label: "Re-issue — lost / damaged OCI card",
    amount: 100,
    note: "Replacement of a lost, stolen, or damaged OCI card.",
  },
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
    { label: "Fresh OCI — govt fee", value: usd(GOVERNMENT_FEES.freshAdult.amount), note: "Adult or minor; same government fee. Re-issue is also " + usd(GOVERNMENT_FEES.reissue.amount) + ".", highlight: true },
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
  checklist: {
    slug: "oci-document-checklist",
    path: "/tools/oci-document-checklist",
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
    path: "/tools/oci-photo-checker",
    label: "OCI Photo Checker",
  },
} as const;
