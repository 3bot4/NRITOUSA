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
  /**
   * True when `nextPublicationDate` has already passed but the bulletin has not
   * been ingested — i.e. DOS is running late. Callers must not render a
   * countdown to a date in the past.
   */
  releaseOverdue: boolean;
}

/**
 * Date the immigration data (visa bulletin, processing times, tracker figures)
 * was last re-verified against official sources by a human. This is a distinct
 * concept from the source-data month, the bulletin publication date, and the
 * bulletin effective month — do not conflate them. Shared by the homepage
 * ticker and the immigration tracker so both show the same "last verified".
 */
export const IMMIGRATION_LAST_VERIFIED = "2026-08-22";

/** Human label, e.g. "Jul 20, 2026". */
export const immigrationLastVerifiedLabel = (() => {
  const d = new Date(`${IMMIGRATION_LAST_VERIFIED}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
})();

const pad = (n: number) => String(n).padStart(2, "0");

/** Add `n` months to a "YYYY-MM" key. */
export function addMonths(key: string, n: number): string {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${pad((total % 12) + 1)}`;
}

/** "2026-09" → "September 2026". */
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
  /**
   * "YYYY-MM" of the newest bulletin actually ingested into
   * data/visa-bulletin. Optional only so existing callers/tests can omit it.
   */
  latestIngestedMonth?: string,
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
  let latestPublishedMonth =
    latestFromReleases > effectiveMonth ? latestFromReleases : effectiveMonth;

  /*
   * Every entry in `releases` is an ESTIMATE, and FY2026 slipped every single
   * month (the September bulletin was forecast for Aug 14 and landed Aug 21).
   * Once an estimated date passes, the arithmetic above starts asserting a
   * bulletin that may not exist — on 2026-09-16 it claimed "October 2026 is
   * already published" while DOS had published nothing.
   *
   * The bulletins we have actually ingested are the ceiling: we cannot have a
   * published bulletin we have not read. This self-corrects — the cap rises the
   * moment the monthly refresh lands.
   */
  if (latestIngestedMonth && latestPublishedMonth > latestIngestedMonth) {
    latestPublishedMonth =
      latestIngestedMonth > effectiveMonth ? latestIngestedMonth : effectiveMonth;
  }

  // The next bulletin is by definition the month after the latest published
  // one; look up its estimated date if the schedule still has one.
  const nextExpectedMonth = addMonths(latestPublishedMonth, 1);
  const scheduled = pub.find((p) => p.month === nextExpectedMonth) ?? null;

  return {
    effectiveMonth,
    latestPublishedMonth,
    nextExpectedMonth,
    nextPublicationDate: scheduled?.date ?? null,
    /* True when the estimated date has come and gone without the bulletin
     * being ingested — the UI must say "overdue", not count down to a past
     * date. */
    releaseOverdue: scheduled ? isPast(scheduled.date) : false,
  };
}
