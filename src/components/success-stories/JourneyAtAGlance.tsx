import type { JourneyGlance } from "@/lib/successStories";

/**
 * Compact "journey at a glance" card (approved, visible facts only). Never
 * renders exact investment gains, net worth, salary, addresses, private family
 * details, or immigration documents — those fields don't exist on the model.
 */
const ROWS: { key: keyof JourneyGlance; label: string }[] = [
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
  { key: "professionalFoundation", label: "Professional foundation" },
  { key: "primaryFields", label: "Primary fields" },
  { key: "majorChallenges", label: "Major challenges" },
  { key: "keyTurningPoints", label: "Key turning points" },
  { key: "currentContribution", label: "Current contribution" },
];

export default function JourneyAtAGlance({ data }: { data: JourneyGlance }) {
  return (
    <section
      aria-labelledby="glance-heading"
      className="rounded-2xl border border-ink-900/10 bg-slate-50/70 p-6 sm:p-7"
    >
      <h2
        id="glance-heading"
        className="text-sm font-bold uppercase tracking-wider text-brand-700"
      >
        Journey at a glance
      </h2>
      <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {ROWS.filter((r) => data[r.key]).map((r) => (
          <div key={r.key}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-ink-800">
              {data[r.key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
