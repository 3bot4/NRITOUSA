/**
 * Reader for data/ice-detention-tracker.json.
 *
 * The data file is hand-maintained — the owner adds an entry, commits, deploys.
 * This module sorts, validates shape and derives the "last updated" stamp the
 * page renders, so the page cannot disagree with the data.
 *
 * `lastUpdated` is DERIVED as the later of the file's own `lastUpdated` field
 * and the newest entry date. That means adding an entry dated today refreshes
 * the stamp whether or not the editor remembered to touch the field, and it
 * cannot be refreshed by a deploy with no content change.
 *
 * The `kind` field is load-bearing and the UI must render it: "official" and
 * "statistic" entries are traceable to an agency; "reported-pattern" entries
 * are not, and presenting the two the same way would be the single most
 * misleading thing this page could do.
 */

import raw from "../../data/ice-detention-tracker.json";

export type TrackerKind = "official" | "statistic" | "reported-pattern";

export interface TrackerSource {
  label: string;
  href: string;
}

export interface TrackerEntry {
  id: string;
  /** ISO date the thing happened or took effect. */
  date: string;
  kind: TrackerKind;
  category: string;
  title: string;
  summary: string;
  affects: string;
  whatToDo?: string;
  sources: TrackerSource[];
}

interface RawFile {
  lastUpdated?: string;
  entries?: unknown[];
}

const KINDS: TrackerKind[] = ["official", "statistic", "reported-pattern"];

const isKind = (v: unknown): v is TrackerKind =>
  typeof v === "string" && KINDS.indexOf(v as TrackerKind) !== -1;

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Entries, newest first. Rows missing a date, a title or at least one source
 * are DROPPED rather than rendered half-empty — the data file's own rules
 * require all three, and a tracker row with no source is the kind of thing this
 * page must not publish.
 */
export function trackerEntries(): TrackerEntry[] {
  const file = raw as RawFile;
  const out: TrackerEntry[] = [];

  for (const item of file.entries ?? []) {
    const e = item as Record<string, unknown>;
    const date = str(e.date);
    const title = str(e.title);
    const sources = Array.isArray(e.sources)
      ? (e.sources as Record<string, unknown>[])
          .map((s) => ({ label: str(s.label), href: str(s.href) }))
          .filter((s) => s.label !== "" && /^https?:\/\//.test(s.href))
      : [];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || title === "" || sources.length === 0) {
      continue;
    }

    out.push({
      id: str(e.id) || date + "-" + title.slice(0, 20),
      date,
      kind: isKind(e.kind) ? e.kind : "reported-pattern",
      category: str(e.category) || "Other",
      title,
      summary: str(e.summary),
      affects: str(e.affects),
      whatToDo: str(e.whatToDo) || undefined,
      sources,
    });
  }

  out.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  return out;
}

/** The later of the file's stamp and the newest entry date. */
export function trackerLastUpdated(): string {
  const file = raw as RawFile;
  const declared = str(file.lastUpdated);
  const newest = trackerEntries()[0]?.date ?? "";
  return [declared, newest].filter(Boolean).sort().pop() ?? "";
}

export function trackerCategories(): string[] {
  const seen: string[] = [];
  for (const e of trackerEntries()) {
    if (seen.indexOf(e.category) === -1) seen.push(e.category);
  }
  return seen;
}

export const KIND_LABELS: Record<TrackerKind, string> = {
  official: "Official source",
  statistic: "Published statistic",
  "reported-pattern": "Reported pattern",
};

export const KIND_NOTES: Record<TrackerKind, string> = {
  official:
    "Traceable to a statute, a regulation, a Federal Register document or an agency page.",
  statistic: "Published agency data, cited to the agency's own release.",
  "reported-pattern":
    "A pattern described by news outlets or by practitioners. No official source states it as policy, and no figure for how often it happens is published.",
};
