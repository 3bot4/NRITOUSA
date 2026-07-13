import type { TimelineMilestone } from "@/lib/successStories";

/**
 * Accessible career/immigration timeline. Rendered as an ordered list so the
 * sequence is conveyed to assistive tech; the connecting line and dots are
 * decorative (aria-hidden). Every milestone is traceable to an approved source.
 */
export default function StoryTimeline({
  milestones,
}: {
  milestones: TimelineMilestone[];
}) {
  return (
    <ol className="relative space-y-8 border-l-2 border-ink-900/10 pl-6 sm:pl-8">
      {milestones.map((m, i) => (
        <li key={`${m.when}-${i}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[1.72rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand-600 shadow-sm sm:-left-[2.22rem]"
          />
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            {m.when}
          </p>
          <h3 className="mt-1 text-base font-bold text-ink-900">{m.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
            {m.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
