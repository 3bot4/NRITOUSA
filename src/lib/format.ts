/**
 * Format a date-only ISO stamp ("2026-08-22") for display.
 *
 * `new Date("2026-08-22")` is parsed as UTC midnight, so formatting it in the
 * server's local zone renders the PREVIOUS day anywhere west of Greenwich —
 * every "Updated"/"Data verified" label on the site was showing one day early.
 * Pin the zone to UTC so the label always matches the stamp it came from.
 * (src/lib/visaBulletinState.ts already does this deliberately.)
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Build-time reading time in minutes: body word count / 220 wpm, rounded up,
 * minimum 1. Computed from article content so the label can never drift from
 * the actual text.
 */
export function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

/** Format a number as whole US dollars, e.g. 11610 → "$11,610". */
export function formatUsd(n: number, digits = 0): string {
  return isFinite(n)
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: digits,
      })
    : "—";
}

/** Deterministic initials for author avatars (no external images). */
export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
