/**
 * "Data as of · Source" stamp rendered on every tool that reads a /data
 * JSON file. Keeps the freshness + provenance promise visible to users.
 *
 * Labelled "Data as of", not "Last updated": the date is when the DATASET was
 * refreshed, not when the page changed. Calling it "Last updated" put a second,
 * different "Last updated" date on pages whose byline (and the homepage
 * "Latest updates and checks" list) already show the page's real update date.
 */
export default function DataStamp({
  lastUpdated,
  source,
  sourceLabel,
  className = "",
}: {
  lastUpdated: string;
  source: string;
  sourceLabel: string;
  className?: string;
}) {
  return (
    <p className={`text-xs text-ink-400 ${className}`}>
      Data as of <time dateTime={lastUpdated}>{lastUpdated}</time> · Source:{" "}
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-600 underline decoration-brand-200 underline-offset-2 hover:text-brand-700"
      >
        {sourceLabel}
      </a>
    </p>
  );
}
