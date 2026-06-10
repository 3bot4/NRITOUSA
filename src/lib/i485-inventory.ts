/**
 * Typed access + "how many people are ahead of you" math for the USCIS
 * pending employment-based I-485 inventory under /data/i485-inventory.
 * Pure functions only — safe to import from client components.
 *
 * Honesty notes baked into the model:
 *   - The inventory is a PERIODIC SNAPSHOT (USCIS publishes in batches, months
 *     after the snapshot date) and counts ONLY people who have already filed
 *     Form I-485. It understates total demand.
 *   - USCIS breaks priority dates out by YEAR only, with a grouped
 *     "{year} and earlier" floor and a most-recent listed year. We never
 *     invent finer (monthly) buckets, so "ahead of you" is computed at the
 *     year granularity the source actually provides.
 *   - It is a PLACE IN LINE, not a wait time. Retrogression/policy can change
 *     everything.
 *
 * Refresh procedure: docs/DATA-UPDATE-PLAYBOOK.md.
 */

import inventory from "../../data/i485-inventory/current.json";
import type { EbCategory, BulletinCountry } from "@/lib/visa-bulletin";

export interface InventoryBucket {
  year: number;
  /** "earlier" => this bucket is "{year} and earlier" (a grouped floor). */
  grouped?: string;
  count: number;
}

type InvCategoryKey = "EB-1" | "EB-2" | "EB-3";
type InvCountryKey = "India" | "China" | "All Other";

export const inventoryMeta = {
  snapshotDate: inventory.snapshotDate,
  publishedDate: inventory.publishedDate,
  lastUpdated: inventory.lastUpdated,
  source: inventory.source,
  sourceLabel: inventory.sourceLabel,
  overallTotal: inventory.overallTotal,
  cpRatio: inventory.cpRatio,
  cpRatioNote: inventory.cpRatioNote,
  todo: (inventory as { todo?: boolean }).todo ?? false,
};

const CATEGORY_KEY: Record<EbCategory, InvCategoryKey | null> = {
  eb1: "EB-1",
  eb2: "EB-2",
  eb3: "EB-3",
  eb5: null, // EB-5 is not broken out in this USCIS report
};

const COUNTRY_KEY: Record<BulletinCountry, InvCountryKey> = {
  india: "India",
  china: "China",
  row: "All Other",
};

function getBuckets(
  category: EbCategory,
  country: BulletinCountry
): InventoryBucket[] | null {
  const catKey = CATEGORY_KEY[category];
  if (!catKey) return null;
  const data = inventory.data as Record<
    string,
    Record<string, InventoryBucket[]>
  >;
  const buckets = data[COUNTRY_KEY[country]]?.[catKey];
  if (!buckets || !buckets.length) return null;
  return [...buckets].sort((a, b) => a.year - b.year);
}

export type AheadResult =
  | { status: "unsupported" }
  | { status: "not-listed"; year: number; maxYear: number }
  | {
      status: "grouped";
      year: number;
      groupedYear: number;
      bucketLabel: string;
      bucketCount: number;
    }
  | {
      status: "ok";
      /** People with a strictly-earlier priority YEAR (the hard headline). */
      ahead: number;
      /** People sharing the user's priority YEAR (report can't split by month). */
      sameYear: number;
      sameYearLabel: string;
      /** Total pending in this country + category. */
      categoryTotal: number;
      /** Modeled overall place in line incl. estimated consular cases. */
      overallEstimate: number;
    };

/**
 * Approximate place in line from the I-485 inventory for a given
 * category + country + priority date.
 */
export function peopleAhead(
  category: EbCategory,
  country: BulletinCountry,
  priorityDate: string
): AheadResult {
  const buckets = getBuckets(category, country);
  if (!buckets) return { status: "unsupported" };

  const userYear = Number(priorityDate.slice(0, 4));
  if (!userYear) return { status: "unsupported" };

  const floor = buckets.find((b) => b.grouped) ?? buckets[0];
  const maxYear = buckets[buckets.length - 1].year;
  const categoryTotal = buckets.reduce((s, b) => s + b.count, 0);

  // Priority date newer than anything the report lists — USCIS hasn't opened
  // filing to it yet, so there is no honest count (not a 0).
  if (userYear > maxYear) {
    return { status: "not-listed", year: userYear, maxYear };
  }

  // Priority date at/inside the grouped "{year} and earlier" floor — the
  // report lumps these together and we cannot separate them.
  if (userYear <= floor.year) {
    return {
      status: "grouped",
      year: userYear,
      groupedYear: floor.year,
      bucketLabel: `${floor.year} and earlier`,
      bucketCount: floor.count,
    };
  }

  const ahead = buckets
    .filter((b) => b.year < userYear)
    .reduce((s, b) => s + b.count, 0);
  const sameYear = buckets.find((b) => b.year === userYear)?.count ?? 0;
  const overallEstimate = Math.round(ahead * inventoryMeta.cpRatio);

  return {
    status: "ok",
    ahead,
    sameYear,
    sameYearLabel: String(userYear),
    categoryTotal,
    overallEstimate,
  };
}
