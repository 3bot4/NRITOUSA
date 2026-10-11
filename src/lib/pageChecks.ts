import raw from "../../data/page-checks.json";

/**
 * Per-page "numbers checked" log (data/page-checks.json): path → ISO date a
 * person last re-verified that page's figures against official sources
 * WITHOUT changing its content. Written only by `npm run mark-checked`.
 *
 * Deliberately tiny and dependency-free so page templates and client-safe
 * components can import it without dragging the content catalogs along.
 *
 * A check is NOT a content change: it never feeds dateModified, sitemap
 * <lastmod>, or any "Updated" stamp — only the "Numbers checked" line.
 */
export const PAGE_CHECKS: Readonly<Record<string, string>> = raw.checks;

/** The logged check date for a root-relative path, if any. */
export function pageCheckedOn(path: string): string | undefined {
  return PAGE_CHECKS[path];
}
