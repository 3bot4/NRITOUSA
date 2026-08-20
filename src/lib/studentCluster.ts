/**
 * International-student cluster config: the five /education pages that make
 * up the F-1 cluster, their share copy, and the internal-link map that ties
 * them to the existing H-1B, EAD, tax and remittance clusters.
 *
 * Shape follows the other clusters in this repo (see i140Cluster.ts,
 * eadCluster.ts): page metadata and cross-page copy live here, facts live in
 * src/data/studentClusterData.ts, and route files own generateMetadata and
 * JSON-LD.
 */

import { STUDENT_DATA_VERIFIED } from "@/data/studentClusterData";

export const STUDENT_BASE = "/education";

export interface StudentPage {
  slug: string;
  path: string;
  title: string;
  label: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  icon: string;
  accent: string;
  /** "tool" pages render a calculator; "guide" pages are decision content. */
  kind: "tool" | "guide";
  /** Primary keyword intent this page owns. */
  owns: string[];
  /** Short hook used above the tool. */
  hook: string;
}

export const studentPages: Record<string, StudentPage> = {
  "f1-tax-calculator": {
    slug: "f1-tax-calculator",
    path: "/education/f1-tax-calculator",
    title: "F-1 Student Tax Calculator: Residency, FICA & Refund",
    label: "F-1 Tax Calculator",
    seoTitle: "F-1 Tax Calculator: 1040-NR, FICA Refund & Treaty",
    seoDescription:
      "Work out whether you file 1040-NR or 1040, how much FICA your employer wrongly withheld, and your refund with the US-India treaty standard deduction.",
    description:
      "Three chained steps for international students: the substantial presence test with correct F-1 exempt-year logic, the FICA refund you are owed if Social Security tax was withheld while you were a nonresident, and a refund estimate that applies the US-India treaty standard deduction.",
    icon: "🧾",
    accent: "from-emerald-500 to-teal-600",
    kind: "tool",
    owns: [
      "1040nr",
      "international student tax return",
      "opt tax calculator",
      "fica exemption opt",
      "f1 student tax treaty india",
    ],
    hook: "Filing your first US tax return? Find out which form you file, whether your employer took FICA it should not have, and roughly what you get back.",
  },
  "us-degree-roi-calculator": {
    slug: "us-degree-roi-calculator",
    path: "/education/us-degree-roi-calculator",
    title: "Is a US Degree Worth It? 10-Year ROI Calculator",
    label: "US Degree ROI Calculator",
    seoTitle: "Is a US Master's Worth It? 10-Year ROI Calculator",
    seoDescription:
      "Compare four paths over 10 years — build a US career, return to India, or never go — with loan interest, sponsorship odds and the career capital a US degree carries.",
    description:
      "A 10-year net-worth projection across four paths, with every assumption editable: study and stay, the proposed-OPT-fee stress test, return to India after a few years, or never go at all. Plus the part money models leave out — what US work experience does to your credential and your options in other countries.",
    icon: "📈",
    accent: "from-brand-600 to-indigo-600",
    kind: "tool",
    owns: [
      "masters in usa worth it",
      "is us degree worth it",
      "ms in usa roi",
      "us degree return on investment",
    ],
    hook: "Worth it, or not? Model the money over 10 years — then see the part the money model cannot show you.",
  },
  "opt-calculator": {
    slug: "opt-calculator",
    path: "/education/opt-calculator",
    title: "OPT Calculator: Deadlines, STEM & Unemployment Days",
    label: "OPT Calculator",
    seoTitle: "OPT Calculator: Unemployment Days & STEM Deadlines",
    seoDescription:
      "Get your OPT filing window, EAD dates, STEM deadline and grace period — plus a live unemployment counter that uses the real 150-day aggregate cap.",
    description:
      "Enter your program end date and OPT status to get every date that matters — filing window, EAD estimate, STEM deadline, grace period — plus an unemployment counter that applies the aggregate 150-day cap correctly instead of pretending STEM resets it.",
    icon: "⏳",
    accent: "from-amber-500 to-orange-600",
    kind: "tool",
    owns: [
      "opt unemployment days",
      "stem opt extension",
      "f1 grace period",
      "opt timeline",
    ],
    hook: "Every OPT date in one place — and an honest unemployment counter, because STEM does not reset your clock.",
  },
  "cpt-vs-opt": {
    slug: "cpt-vs-opt",
    path: "/education/cpt-vs-opt",
    title: "CPT vs OPT: The Honest Comparison (and Day-1 CPT Risk)",
    label: "CPT vs OPT",
    seoTitle: "CPT vs OPT (2026): Rules, Limits & Day 1 CPT Risk",
    seoDescription:
      "How CPT and OPT actually differ, the 12-month full-time CPT rule that destroys OPT eligibility, and a straight account of Day-1 CPT risk from someone not selling it.",
    description:
      "A decision-grade comparison of CPT and OPT — including the full-time-CPT rule that eliminates OPT eligibility — and an honest section on Day-1 CPT written by a site with nothing to sell you.",
    icon: "⚖️",
    accent: "from-violet-500 to-purple-600",
    kind: "guide",
    owns: ["day 1 cpt", "cpt vs opt", "curricular practical training"],
    hook: "Which one applies to you, what each costs you later, and what nobody selling Day-1 CPT programmes will tell you.",
  },
  "sevis-termination-guide": {
    slug: "sevis-termination-guide",
    path: "/education/sevis-termination-guide",
    title: "SEVIS Terminated or Visa Revoked: What To Do Now",
    label: "SEVIS Termination Guide",
    seoTitle: "SEVIS Terminated / F-1 Visa Revoked: What To Do",
    seoDescription:
      "Termination and revocation are different things with different answers. A first-48-hours checklist, your reinstatement options, and what not to do.",
    description:
      "An emergency map for students whose SEVIS record was terminated or visa revoked: what actually happened, what to do in the first 48 hours, reinstatement versus departure, and the things people do in a panic that make it worse.",
    icon: "🛟",
    accent: "from-rose-500 to-red-600",
    kind: "guide",
    owns: ["f1 visa revoked", "sevis terminated", "sevis termination reinstatement"],
    hook: "First, work out which of the two things happened to you — the answers are completely different.",
  },
};

export const studentPageList: StudentPage[] = Object.values(studentPages);

export function getStudentPage(slug: string): StudentPage | undefined {
  return studentPages[slug];
}

/* ─────────────────────────── Share copy per page ───────────────────────── */

/**
 * WhatsApp is how this audience actually shares things — student group chats,
 * university admit groups, family threads. Each share text is written to be
 * useful when pasted with no context, and leads with the corrective fact
 * rather than the page title.
 */
export const shareCopy: Record<string, { text: string; tagline: string }> = {
  "f1-tax-calculator": {
    text: "Free F-1 student tax calculator: checks if you file 1040-NR or 1040, the FICA refund your employer may owe you (7.65%), and the US-India treaty standard deduction most Indian students never claim.",
    tagline:
      "Send this to the friend who thinks nonresidents cannot claim the standard deduction — Indian students can.",
  },
  "us-degree-roi-calculator": {
    text: "Is a US master's actually worth it? This runs 10 years across four paths — stay in the US, return to India, or never go — with loan interest and sponsorship odds you can edit yourself.",
    tagline:
      "Share this with anyone deciding on a US master's right now — the $100,000 H-1B fee they are panicking about is not being collected.",
  },
  "opt-calculator": {
    text: "OPT calculator with every deadline: filing window, STEM cut-off, grace period, and an unemployment counter that uses the real 150-day aggregate cap — STEM does NOT reset it to 150.",
    tagline:
      "Forward this to anyone on OPT who thinks their unemployment days reset when STEM is approved. They do not.",
  },
  "cpt-vs-opt": {
    text: "CPT vs OPT explained straight, including the rule that catches people out: 12 months of full-time CPT eliminates your OPT eligibility completely.",
    tagline:
      "Worth sending to anyone weighing a Day-1 CPT programme before they commit money to it.",
  },
  "sevis-termination-guide": {
    text: "If your SEVIS record was terminated or your visa revoked: these are two different things with two different answers. First-48-hours checklist and reinstatement options.",
    tagline:
      "Keep this one saved. If it ever happens to someone in your group, the first 48 hours matter most.",
  },
};

export function getShareCopy(slug: string) {
  return (
    shareCopy[slug] ?? {
      text: "Free tools and straight answers for international students in the USA.",
      tagline: "Share this with a student who needs it.",
    }
  );
}

/* ───────────────────────── Cross-cluster link map ──────────────────────── */

export interface ClusterLink {
  label: string;
  href: string;
  blurb: string;
}

/** Links shown on every student-cluster page, pointing into sibling clusters. */
export const studentClusterLinks: ClusterLink[] = [
  {
    label: "H-1B hub",
    href: "/h1b",
    blurb: "Lottery odds, timelines, and what the fee fight actually changed.",
  },
  {
    label: "EAD processing times",
    href: "/ead-processing-time",
    blurb: "Current I-765 timelines, including the (c)(3) OPT categories.",
  },
  {
    label: "College cost calculator",
    href: "/education/tuition-calculator",
    blurb: "Full four-year cost, the $785 visa fee stack, and funding routes.",
  },
  {
    label: "Remittance & TCS calculator",
    href: "/calculators/remittance-tcs-cost",
    blurb: "What it costs to send tuition money from India after the April 2026 rate cut.",
  },
];

/** Related links per page, tuned to what that page's reader needs next. */
export const relatedByPage: Record<string, ClusterLink[]> = {
  "f1-tax-calculator": [
    {
      label: "Substantial presence test explained",
      href: "/articles/substantial-presence-test-explained",
      blurb: "The long-form guide behind step 1 of this calculator.",
    },
    {
      label: "OPT calculator",
      href: "/education/opt-calculator",
      blurb: "Your work-authorisation dates and unemployment counter.",
    },
    {
      label: "First tax return on H-1B",
      href: "/articles/h1b-first-tax-return-guide",
      blurb: "What changes when you move from F-1 to H-1B.",
    },
    {
      label: "Money guide for Indian students",
      href: "/articles/usa-money-guide-indian-students",
      blurb: "Banking, credit and the first-year money setup.",
    },
  ],
  "us-degree-roi-calculator": [
    {
      label: "College cost calculator",
      href: "/education/tuition-calculator",
      blurb: "Build the cost input this calculator needs.",
    },
    {
      label: "OPT to H-1B financial planning",
      href: "/articles/opt-h1b-financial-planning-students",
      blurb: "The transition this model turns on.",
    },
    {
      label: "CPT vs OPT",
      href: "/education/cpt-vs-opt",
      blurb: "Choices during the degree that change what comes after.",
    },
    {
      label: "H-1B hub",
      href: "/h1b",
      blurb: "Lottery odds and the real state of the fee litigation.",
    },
  ],
  "opt-calculator": [
    {
      label: "EAD processing times",
      href: "/ead-processing-time",
      blurb: "How long the I-765 is actually taking right now.",
    },
    {
      label: "CPT vs OPT",
      href: "/education/cpt-vs-opt",
      blurb: "Whether CPT already cost you OPT eligibility.",
    },
    {
      label: "SEVIS termination guide",
      href: "/education/sevis-termination-guide",
      blurb: "If you have gone over the unemployment limit.",
    },
    {
      label: "F-1 tax calculator",
      href: "/education/f1-tax-calculator",
      blurb: "OPT income has its own tax rules — start here.",
    },
  ],
  "cpt-vs-opt": [
    {
      label: "OPT calculator",
      href: "/education/opt-calculator",
      blurb: "Your dates and unemployment allowance once OPT starts.",
    },
    {
      label: "US degree ROI calculator",
      href: "/education/us-degree-roi-calculator",
      blurb: "What the whole decision is worth over 10 years.",
    },
    {
      label: "SEVIS termination guide",
      href: "/education/sevis-termination-guide",
      blurb: "What happens if a CPT programme goes wrong.",
    },
    {
      label: "H-1B hub",
      href: "/h1b",
      blurb: "Where Day-1 CPT decisions surface again years later.",
    },
  ],
  "sevis-termination-guide": [
    {
      label: "OPT calculator",
      href: "/education/opt-calculator",
      blurb: "Check your unemployment days before they become a problem.",
    },
    {
      label: "CPT vs OPT",
      href: "/education/cpt-vs-opt",
      blurb: "Unauthorised work is a common termination trigger.",
    },
    {
      label: "F-1 tax calculator",
      href: "/education/f1-tax-calculator",
      blurb: "Filing obligations continue regardless of status problems.",
    },
    {
      label: "H-1B 60-day grace period",
      href: "/h1b",
      blurb: "How the H-1B grace period differs from the F-1 one.",
    },
  ],
};

export function getRelated(slug: string): ClusterLink[] {
  return relatedByPage[slug] ?? studentClusterLinks;
}

/** Shared "last reviewed" stamp for the cluster. */
export const STUDENT_LAST_REVIEWED = STUDENT_DATA_VERIFIED;
