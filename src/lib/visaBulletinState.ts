/**
 * Shared Visa Bulletin state — one source of truth for the homepage ticker,
 * the immigration tracker and their tests.
 *
 * The State Department publishes each month's bulletin roughly mid-way through
 * the PRIOR month. So a release dated mid-July publishes the AUGUST bulletin.
 * On, say, 20 July 2026 the July bulletin is in effect, the August bulletin is
 * already published, and the September bulletin is the next expected release.
 *
 * The bug this replaces: the ticker read the next release DATE (Aug 14) and
 * labelled it "Next Bulletin", implying the August bulletin — which had already
 * been published on July 15. A forecast must name the SEPTEMBER bulletin.
 */

export interface BulletinState {
  /** "YYYY-MM" of the bulletin currently in effect. */
  effectiveMonth: string;
  /** "YYYY-MM" of the latest bulletin already published (may be next month). */
  latestPublishedMonth: string;
  /** "YYYY-MM" of the next bulletin expected to be published, or null. */
  nextExpectedMonth: string | null;
  /** ISO date of that next expected publication (an ESTIMATE), or null. */
  nextPublicationDate: string | null;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Add `n` months to a "YYYY-MM" key. */
export function addMonths(key: string, n: number): string {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${pad((total % 12) + 1)}`;
}

/** "2026-08" → "August 2026". */
export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Derive the bulletin state from today's date and the published release
 * schedule. A release publishes the month AFTER its own month.
 */
export function visaBulletinState(
  today: Date,
  releases: string[],
): BulletinState {
  const effectiveMonth = `${today.getUTCFullYear()}-${pad(today.getUTCMonth() + 1)}`;
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  const pub = releases
    .filter((iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso))
    .map((iso) => ({ date: iso, month: addMonths(iso.slice(0, 7), 1) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const isPast = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d) <= t;
  };

  const published = pub.filter((p) => isPast(p.date));
  const upcoming = pub.filter((p) => !isPast(p.date));

  // Latest published is the newest release already out, but never earlier than
  // the effective month (the effective bulletin was itself published earlier).
  const latestFromReleases = published.length
    ? published[published.length - 1].month
    : effectiveMonth;
  const latestPublishedMonth =
    latestFromReleases > effectiveMonth ? latestFromReleases : effectiveMonth;

  const next = upcoming[0] ?? null;

  return {
    effectiveMonth,
    latestPublishedMonth,
    nextExpectedMonth: next?.month ?? null,
    nextPublicationDate: next?.date ?? null,
  };
}
