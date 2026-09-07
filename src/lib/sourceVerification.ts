/**
 * Does a page's body actually cite a primary source?
 *
 * The "✓ Sources verified" badge used to render unconditionally in the byline,
 * so it appeared on 85 pages whose only outbound link was an affiliate house
 * ad. A trust badge that every page shows regardless of whether it cites
 * anything is worse than no badge: it costs the pages that *have* done the work
 * their differentiation, and it is a claim the page cannot back.
 *
 * So the badge is now derived from the content itself — pass the page body and
 * the badge appears only when a primary source is genuinely linked. Add a
 * citation to an article and the badge lights up on its own; there is no flag
 * to remember to set, and none to set wrongly.
 *
 * "Primary source" means the authority that actually sets the rule: US and
 * Indian government hosts, the central banks, the federal register, and the
 * courts. Own-site links and affiliate links (StockLeo, TaxSaveIQ, OptionLeo)
 * deliberately do not count.
 */
const PRIMARY_SOURCE_PATTERN =
  /https?:\/\/[^\s"')]*?(?:\.gov(?:\.in)?(?:[/:?#]|\b)|\.nic\.in\b|\bgov\.uk\b|\brbi\.org\.in\b|\bsebi\.gov\.in\b|\bincometax(?:india)?\.gov\.in\b|\bcourtlistener\.com\b|\bsupremecourt\.gov\b|\buscode\.house\.gov\b|\bfederalregister\.gov\b)/i;

/**
 * True when `content` links at least one primary source. Accepts raw article
 * markdown, JSX-free copy, or any string that contains the page's outbound
 * URLs — it only looks for the URL, not for link syntax, so it works for both
 * `[text](url)` markdown and bare URLs printed in visible copy.
 */
export function hasPrimarySource(content: string | undefined | null): boolean {
  if (!content) return false;
  return PRIMARY_SOURCE_PATTERN.test(content);
}
