import Link from "next/link";
import Container from "@/components/Container";
import DataStamp from "@/components/tools/DataStamp";

/** Coming-soon body for stubbed tools: what's planned + data provenance. */
export default function ComingSoon({
  planned,
  lastUpdated,
  source,
  sourceLabel,
}: {
  planned: string[];
  lastUpdated: string;
  source: string;
  sourceLabel: string;
}) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-ink-900/5 bg-white p-8 shadow-card">
          <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Coming soon
          </span>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-ink-900">
            What this tool will do
          </h2>
          <ul className="mt-4 space-y-2.5">
            {planned.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-ink-700">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                >
                  ✓
                </span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-500">
            The data pipeline and page are already wired — we&apos;re finishing
            the dataset. Meanwhile, explore the{" "}
            <Link href="/tools" className="font-semibold text-brand-600">
              live tools →
            </Link>
          </p>
          <DataStamp
            className="mt-6 border-t border-ink-900/5 pt-4"
            lastUpdated={lastUpdated}
            source={source}
            sourceLabel={sourceLabel}
          />
        </div>
      </Container>
    </section>
  );
}
