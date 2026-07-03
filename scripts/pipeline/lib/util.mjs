/**
 * Shared helpers: repo paths, JSON read/write, and Eastern-Time stamping.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const DATA_DIR = join(ROOT, "data");
export const HISTORY_DIR = join(DATA_DIR, "history");

export function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(path, obj) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
}

/** Round to a fixed number of decimals (returns a Number, not a string). */
export function round(n, decimals) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/* ------------------------------ Eastern Time ------------------------------ */

const ET = "America/New_York";

/** ISO-8601 timestamp WITH the correct ET offset (handles EDT/EST). */
export function nowEtIso(d = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ET,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value])
  );
  const offsetMin = etOffsetMinutes(d);
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = String(Math.floor(abs / 60)).padStart(2, "0");
  const om = String(abs % 60).padStart(2, "0");
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}${sign}${oh}:${om}`;
}

/** Human label, e.g. "Jun 12, 2026, 9:00 AM ET". */
export function nowEtLabel(d = new Date()) {
  return (
    new Intl.DateTimeFormat("en-US", {
      timeZone: ET,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d) + " ET"
  );
}

/** Calendar date in ET as "YYYY-MM-DD". */
export function etDate(d = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ET,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Minutes east of UTC for the ET zone at instant d (negative — ET is behind UTC). */
function etOffsetMinutes(d) {
  // Compare the same instant rendered in UTC vs ET to derive the offset.
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  const et = new Date(d.toLocaleString("en-US", { timeZone: ET }));
  return Math.round((et.getTime() - utc.getTime()) / 60000);
}
