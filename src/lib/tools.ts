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
}

export const tools: ToolMeta[] = [
  {
    slug: "citizenship-checklist",
    title: "US Citizenship (N-400) Readiness Checklist & Tracker",
    label: "Citizenship Checklist",
    group: "Visa & Green Card",
    description:
      "Personalized N-400 naturalization checklist: compute your earliest filing date, find out which civics test applies to you (2025 vs 2008), surface your risk areas, and track every step to the oath.",
    icon: "🦅",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "US Citizenship Checklist for Green Card Holders (N-400) — 2026",
    seoDescription:
      "Free interactive N-400 naturalization checklist for green card holders: earliest filing date calculator, the new 128-question 2025 civics test rule, documents to gather, and the 2025–26 good moral character pain points.",
    status: "live",
  },
  {
    slug: "green-card-tracker",
    title: "Green Card Wait Time Tracker & Estimator",
    label: "Green Card Tracker",
    group: "Visa & Green Card",
    description:
      "See the current visa bulletin cutoff for your EB category, how far your priority date is behind, and an honest estimated wait range based on historical movement.",
    icon: "🟢",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "Green Card Wait Time Estimator (EB-1/EB-2/EB-3 India) — 2026",
    seoDescription:
      "Free EB green card wait time estimator for India and China. Current Final Action Dates, historical visa bulletin movement, and an honest estimated wait range for your priority date.",
    status: "live",
  },
  {
    slug: "h1b-salaries",
    title: "H-1B Salary Explorer",
    label: "H-1B Salaries",
    group: "Visa & Green Card",
    description:
      "Median and percentile H-1B base salaries by job title, metro, and wage level — aggregated from official DOL LCA disclosure data.",
    icon: "💼",
    accent: "from-violet-500 to-purple-600",
    seoTitle: "H-1B Salary Explorer by Job Title & City (DOL Data)",
    seoDescription:
      "Look up real H-1B salaries by job title, city, and wage level. Median, 25th and 75th percentile base pay aggregated from official US Department of Labor LCA disclosures.",
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
    seoTitle: "Visa-Free Countries for Indian Passport Holders (2026)",
    seoDescription:
      "Where can Indians travel without a visa in 2026? Full filterable list of visa-free, visa-on-arrival, and e-Visa destinations — plus countries that waive visas for Indians with a valid US visa.",
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
    seoTitle: "USCIS, OCI & Visa Stamping Processing Times (2026)",
    seoDescription:
      "Current typical processing times in one place: I-129 H-1B, I-140, I-485, EAD and Advance Parole, OCI card, Indian passport renewal via VFS, and H-1B stamping waits at Indian consulates.",
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
      "Personalized H-1B cap season timeline: registration dates, selection notifications, filing windows, second-round odds, and a live countdown to your next key date — with what to do at each milestone.",
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
