/**
 * Two-panel calculator layout: inputs left, live results right on desktop,
 * stacked (inputs first) on mobile. Used by the interactive tools.
 */
export default function ToolLayout({
  inputs,
  results,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      <div className="min-w-0">{inputs}</div>
      <div className="min-w-0">{results}</div>
    </div>
  );
}
