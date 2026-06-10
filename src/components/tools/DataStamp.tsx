/**
 * "Last updated · Source" stamp rendered on every tool that reads a /data
 * JSON file. Keeps the freshness + provenance promise visible to users.
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
      Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time> · Source:{" "}
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
