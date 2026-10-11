import { formatDate } from "@/lib/format";
import { pageCheckedOn } from "@/lib/pageChecks";

/**
 * "Numbers checked {date}" — the page's entry in data/page-checks.json (set by
 * `npm run mark-checked` after the weekly audit). Renders nothing for a page
 * that has never been logged, so no page ever shows an invented date. The
 * homepage "Latest updates and checks" list reads the same entry.
 */
export default function NumbersChecked({
  path,
  separator = false,
  className = "",
}: {
  /** Root-relative path of the page, e.g. "/tools/green-card-tracker". */
  path: string;
  /** Prefix a "·" for inline meta rows. */
  separator?: boolean;
  className?: string;
}) {
  const checked = pageCheckedOn(path);
  if (!checked) return null;
  return (
    <>
      {separator && <span aria-hidden>·</span>}
      <span className={className}>
        Numbers checked <time dateTime={checked}>{formatDate(checked)}</time>
      </span>
    </>
  );
}
