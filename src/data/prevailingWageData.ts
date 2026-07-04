/**
 * Prevailing wage data — editable config for the prevailing-wage cluster
 * (/prevailing-wage-calculator, /dol-wage-levels-explained, /h1b-prevailing-wage).
 *
 * WHY THERE ARE NO DOLLAR FIGURES HERE:
 * The actual prevailing wage for a case depends on the specific SOC occupation
 * code AND the area of intended employment, pulled from the DOL OFLC wage
 * library (OEWS/OES). We never hardcode a wage number — users must look up their
 * exact figure at the official source below. This file holds the *structure*
 * (the four wage levels, how they are determined, and the update pointers),
 * which is stable and rule-based.
 *
 * HOW TO UPDATE: OEWS wage data refreshes annually (typically each July). When
 * it does, bump `oewsVintage` and `lastUpdated`. The source URLs rarely change.
 */

export interface WageLevelDef {
  level: "I" | "II" | "III" | "IV";
  name: string;
  /** Percentile of the OEWS wage distribution DOL assigns to this level. */
  percentile: string;
  /** Plain-English who-this-fits summary. */
  summary: string;
  /** Typical signals that point to this level (educational, not the official worksheet). */
  signals: string[];
}

export interface PrevailingWageData {
  lastUpdated: string;
  /** OEWS wage-year vintage currently in force (annual refresh, ~July). */
  oewsVintage: string;
  /** Official OFLC/FLAG prevailing-wage entry point. */
  oflcSourceUrl: string;
  /** Where to actually look up a wage by SOC + area. */
  wageLookupUrl: string;
  /** Foreign Labor Certification Data Center (historical/lookup). */
  flcDataCenterUrl: string;
  /** The four wage levels. */
  levels: WageLevelDef[];
}

export const prevailingWageData: PrevailingWageData = {
  lastUpdated: "Verify against the current OEWS vintage on DOL FLAG",
  oewsVintage: "Update from DOL FLAG (OEWS refreshes annually, ~July)",
  oflcSourceUrl: "https://flag.dol.gov/wage-data/wage-search",
  wageLookupUrl: "https://flag.dol.gov/wage-data/wage-search",
  flcDataCenterUrl: "https://www.flcdatacenter.com/",
  levels: [
    {
      level: "I",
      name: "Level I (Entry)",
      percentile: "17th percentile of the OEWS wage distribution",
      summary:
        "Entry-level roles. Workers who perform routine tasks under close supervision and have a basic understanding of the occupation.",
      signals: [
        "Little to no prior experience required",
        "Close supervision; routine tasks",
        "Only the basic education/experience the occupation normally requires",
      ],
    },
    {
      level: "II",
      name: "Level II (Qualified)",
      percentile: "34th percentile of the OEWS wage distribution",
      summary:
        "Qualified workers who have some experience and perform moderately complex tasks with limited judgment.",
      signals: [
        "Some experience (often a couple of years)",
        "Moderately complex tasks, limited independent judgment",
        "Requirements modestly above the occupational baseline",
      ],
    },
    {
      level: "III",
      name: "Level III (Experienced)",
      percentile: "50th percentile (median) of the OEWS wage distribution",
      summary:
        "Experienced workers who use independent judgment, may supervise, and handle complex tasks.",
      signals: [
        "Meaningful experience in the role",
        "Independent judgment; may direct or train others",
        "Advanced degree or special skills tied to the duties",
      ],
    },
    {
      level: "IV",
      name: "Level IV (Fully Competent)",
      percentile: "67th percentile of the OEWS wage distribution",
      summary:
        "Fully competent / senior workers who plan and lead, use wide latitude of judgment, and often manage others.",
      signals: [
        "Senior or lead responsibilities",
        "Wide latitude for independent judgment; strategic duties",
        "Substantial experience and/or advanced credentials",
      ],
    },
  ],
};

/** Standard educational data-source note for the prevailing-wage cluster. */
export const WAGE_DATA_NOTE =
  "Data source: U.S. Department of Labor OFLC prevailing wage / OEWS data. Actual prevailing wages depend on your specific SOC occupation and area of employment and refresh annually — always look up your exact figure at the official source.";
