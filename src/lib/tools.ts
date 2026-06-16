/**
 * Tools catalog. Each entry powers the /tools hub, the nav/footer links,
 * the sitemap, and per-tool metadata. The interactive UI for each live tool
 * lives in src/components/tools and its page under src/app/tools/<slug>.
 *
 * All tools are 100% client-side: they read versioned JSON from /data
 * (statically imported) or /public/data (fetched). No database is involved.
 * Refresh procedures for every data file: docs/DATA-UPDATE-PLAYBOOK.md.
 */

export type ToolGroup =
  | "Visa & Green Card"
  | "Money & Finance"
  | "Travel & Documents";

export interface ToolMeta {
  slug: string;
  title: string;
  /** Short label for cards / nav */
  label: string;
  group: ToolGroup;
  description: string;
  icon: string;
  /** Tailwind gradient for the icon tile */
  accent: string;
  seoTitle: string;
  seoDescription: string;
  status: "live" | "coming-soon";
  /**
   * Cross-cutting cluster tags (e.g. "tax-compliance"). Drives the India Tax
   * & Compliance hub and the related-tools strip at the foot of each page.
   */
  tags?: string[];
}

export const tools: ToolMeta[] = [
  {
    slug: "green-card-stage-finder",
    title: "Green Card Stage Finder for Indians",
    label: "Green Card Stage Finder",
    group: "Visa & Green Card",
    description:
      "Where are you in the green card process? Answer questions about your visa, EB category, PERM, I-140, priority date, and I-485 filing to get your current stage, what happens next, the main bottleneck, and questions to ask your employer's immigration attorney. No personal information collected.",
    icon: "🟢",
    accent: "from-green-700 to-emerald-600",
    seoTitle: "Green Card Stage Finder for Indians | PERM, I-140, Priority Date, I-485",
    seoDescription:
      "Find your green card stage: PERM pending, I-140 approved, waiting for priority date, or I-485 filed. Educational tool for Indian H1B workers — no personal info needed.",
    status: "live",
    tags: [],
  },
  {
    slug: "h1b-transfer-risk-checklist",
    title: "H1B Transfer Risk Checklist for Indians",
    label: "H1B Transfer Checklist",
    group: "Visa & Green Card",
    description:
      "Laid off, changing jobs, or navigating an H1B transfer? Answer a few questions about your employment status, petition filing, I-94 validity, and travel plans to get an educational risk assessment and a list of documents to collect.",
    icon: "📋",
    accent: "from-orange-600 to-amber-500",
    seoTitle: "H1B Transfer Risk Checklist | Layoff, AC21, Receipt, Premium Processing",
    seoDescription:
      "H1B transfer situation checker for Indians — assess layoff grace period, AC21 portability, receipt notice timing, premium processing, and travel risk. No personal info required.",
    status: "live",
    tags: [],
  },
  {
    slug: "uscis-processing-delay-checker",
    title: "USCIS Processing Delay Checker for Indians",
    label: "Processing Delay Checker",
    group: "Visa & Green Card",
    description:
      "Is your H1B, I-140, I-485, or EAD case delayed? Select your form type, receipt date, and current status to get an educational assessment of whether your case is within normal range — and what to do next. No personal information collected.",
    icon: "⏱️",
    accent: "from-blue-600 to-cyan-600",
    seoTitle: "USCIS Processing Delay Checker | H1B, I-140, I-485, EAD for Indians",
    seoDescription:
      "Is my USCIS case delayed? Free tool for Indian applicants — select form type and status for an educational delay assessment. No receipt number needed.",
    status: "live",
    tags: [],
  },
  {
    slug: "uscis-receipt-number-decoder",
    title: "USCIS Receipt Number Decoder for Indians",
    label: "Receipt Prefix Decoder",
    group: "Visa & Green Card",
    description:
      "What does your USCIS receipt number prefix mean? Select IOE, LIN, SRC, EAC, WAC, or MSC to learn which service center has your case, what forms it handles, and what the prefix does NOT tell you. No full receipt number required.",
    icon: "🔍",
    accent: "from-indigo-600 to-violet-600",
    seoTitle: "USCIS Receipt Number Prefix Decoder | IOE LIN SRC EAC WAC MSC Explained",
    seoDescription:
      "What does IOE, LIN, SRC, EAC, WAC, or MSC mean on your USCIS receipt number? Free decoder tool for Indian applicants — no personal info needed.",
    status: "live",
    tags: [],
  },
  {
    slug: "uscis-case-status-meaning",
    title: "USCIS Case Status Meaning Tool for Indians",
    label: "USCIS Status Decoder",
    group: "Visa & Green Card",
    description:
      "Select your form type and current USCIS status to get a plain-English explanation, what usually happens next, your action steps, and when to contact your attorney. No receipt number or personal details needed.",
    icon: "🛂",
    accent: "from-blue-600 to-indigo-600",
    seoTitle: "USCIS Case Status Meaning Tool for Indians | H1B, I-140, I-485, EAD",
    seoDescription:
      "What does my USCIS status mean? Free tool for Indians — select your form and status to get plain-English meaning, next steps, and action guidance. No personal info required.",
    status: "live",
    tags: [],
  },
  {
    slug: "h4-ead-navigator",
    title: "H-4 Spouse Work & Business Navigator",
    label: "H-4 EAD Navigator",
    group: "Visa & Green Card",
    description:
      "What can an H-4 EAD spouse actually do? A playful pathfinder to matched work & business ideas, myth-vs-reality answers, an EAD renewal gap calculator, and tappable start-earning / start-a-business checklists.",
    icon: "💍",
    accent: "from-fuchsia-500 to-pink-600",
    seoTitle: "H-4 EAD: What Work Is Allowed? (2026 Guide)",
    seoDescription:
      "What can an H-4 EAD spouse do — jobs, freelance, LLC, daycare, tiffin? Interactive pathfinder, myth-vs-reality, and an EAD renewal gap calculator.",
    status: "live",
  },
  {
    slug: "citizenship-checklist",
    title: "US Citizenship (N-400) Readiness Checklist & Tracker",
    label: "Citizenship Checklist",
    group: "Visa & Green Card",
    description:
      "Personalized N-400 naturalization checklist: compute your earliest filing date, find out which civics test applies to you (2025 vs 2008), surface your risk areas, and track every step to the oath.",
    icon: "🦅",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "US Citizenship (N-400) Checklist — 2026",
    seoDescription:
      "Free N-400 naturalization checklist for green card holders: earliest filing date calculator, the 2025 civics test rule, and documents to gather.",
    status: "live",
  },
  {
    slug: "green-card-tracker",
    title: "Green Card Wait Time Tracker & Estimator",
    label: "Green Card Tracker",
    group: "Visa & Green Card",
    description:
      "See how many applicants are ahead of you in line from the USCIS I-485 inventory, the current visa bulletin cutoff for your EB category, how far your priority date is behind, and an honest estimated wait range.",
    icon: "🟢",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "Green Card Wait Time Estimator (India) 2026",
    seoDescription:
      "How many people are ahead of you in the EB green card line? Free estimator using USCIS I-485 inventory, Final Action Dates, and an honest wait range.",
    status: "live",
  },
  {
    slug: "h1b-salaries",
    title: "H-1B Salary Explorer",
    label: "H-1B Salaries",
    group: "Visa & Green Card",
    description:
      "Interactive H-1B salary explorer: change position, city, and experience level to watch the charts update, compare cities side by side, and drop in your offer to see your percentile — built from official DOL LCA filings.",
    icon: "💼",
    accent: "from-violet-500 to-purple-600",
    seoTitle: "H-1B Salary Explorer by Job Title & City",
    seoDescription:
      "Explore real H-1B base salaries by position, city, and experience. See the distribution, compare cities, and check your percentile — from DOL data.",
    status: "live",
  },
  {
    slug: "visa-free-countries",
    title: "Visa-Free Countries for Indian Passport Holders",
    label: "Visa-Free Travel",
    group: "Travel & Documents",
    description:
      "Filterable list of where Indians can travel visa-free, with visa on arrival or e-Visa — including destinations that get easier with a valid US visa.",
    icon: "🌍",
    accent: "from-sky-500 to-blue-600",
    seoTitle: "Visa-Free Countries for Indians (2026)",
    seoDescription:
      "Where can Indians travel visa-free in 2026? Full filterable list of visa-free, visa-on-arrival, and e-Visa destinations — plus US-visa waivers.",
    status: "live",
  },
  {
    slug: "processing-times",
    title: "Immigration & Consular Processing Times",
    label: "Processing Times",
    group: "Travel & Documents",
    description:
      "Typical current waits for H-1B extensions, I-140, I-485, EAD/AP, OCI cards, Indian passport renewal, and US visa stamping in India — in one table.",
    icon: "⏱️",
    accent: "from-amber-500 to-orange-600",
    seoTitle: "USCIS, OCI & Visa Stamping Times (2026)",
    seoDescription:
      "Current typical processing times in one place: H-1B, I-140, I-485, EAD/AP, OCI card, Indian passport renewal, and US visa stamping in India.",
    status: "live",
  },
  {
    slug: "h1b-lottery-timeline",
    title: "H-1B Lottery Timeline & Odds",
    label: "H-1B Lottery",
    group: "Visa & Green Card",
    description:
      "A personalized H-1B cap-season timeline: enter your cycle and stage to see your registration, selection, filing, and start-date milestones, a live countdown to your next key date, and what to do at each step.",
    icon: "🎟️",
    accent: "from-fuchsia-500 to-pink-600",
    seoTitle: "H-1B Lottery Timeline & Selection Odds",
    seoDescription:
      "Personalized H-1B cap season timeline: registration, selection, filing windows, second-round odds, and a live countdown to your next key date.",
    status: "live",
  },
  {
    slug: "flight-price-guide",
    title: "USA ↔ India Flight Price Guide",
    label: "Flight Price Guide",
    group: "Travel & Documents",
    description:
      "Estimate whether USA–India fares for your route, month, and travel style are likely low, moderate, or high — with booking-window tips, a flexibility score, and a money-saving checklist.",
    icon: "✈️",
    accent: "from-cyan-500 to-teal-600",
    seoTitle: "USA to India Flight Price Guide for NRIs",
    seoDescription:
      "Estimate USA to India flight price pressure by route, month, season, flexibility, booking window, and travel type with this NRI flight guide.",
    status: "live",
  },
  {
    slug: "fbar-fatca-checker",
    title: "FBAR & FATCA Checker",
    label: "FBAR / FATCA",
    group: "Money & Finance",
    description:
      "Answer a few questions about your Indian accounts to see whether FBAR or FATCA (Form 8938) may need review — with a document checklist and CPA question list. Educational only.",
    icon: "🧾",
    accent: "from-rose-500 to-pink-600",
    seoTitle: "FBAR and FATCA Checker for NRIs in the USA",
    seoDescription:
      "Use this educational FBAR and FATCA checker to understand whether India bank accounts, FDs, NRE/NRO, or foreign assets may need review.",
    status: "live",
    tags: ["tax-compliance"],
  },
  {
    slug: "form-10f-generator",
    title: "Form 10F Generator for DTAA Treaty Benefits",
    label: "Form 10F Generator",
    group: "Money & Finance",
    description:
      "Prepare a clean, printable Form 10F draft to claim India–US DTAA treaty benefits: enter your name, PAN, tax residency period, and foreign tax ID, then copy or download the seven-field declaration. Runs entirely in your browser — educational only.",
    icon: "📄",
    accent: "from-indigo-500 to-blue-600",
    seoTitle: "Form 10F Generator for NRIs (DTAA) 2026",
    seoDescription:
      "Free Form 10F generator for NRIs claiming India–US DTAA treaty benefits. Enter your details to get a printable, copy/download-ready draft.",
    status: "live",
    tags: ["tax-compliance"],
  },
];

export const toolGroups: ToolGroup[] = [
  "Visa & Green Card",
  "Money & Finance",
  "Travel & Documents",
];

export function getTool(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export const liveTools = tools.filter((t) => t.status === "live");
