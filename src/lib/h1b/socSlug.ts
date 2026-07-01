/**
 * Stable, reversible slug for a SOC occupation title, e.g.
 * "Software Developers" -> "software-developers". Pure and isomorphic so both
 * the client finder and the server data layer can share it (kept separate from
 * lib/h1b/sponsors, which is server-only).
 */
export function socSlug(socTitle: string): string {
  return socTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
