import {
  timelineEvents,
  timelineSummary,
  TIMELINE_STATUS_LABEL,
  AS_OF_DATE_HUMAN,
  type TimelineStatus,
} from "@/data/governmentBenefitsData";

/**
 * The 2026–27 rule-change timeline.
 *
 * Every event's status ("In effect" / "Next change" / "Upcoming") is DERIVED
 * from the maintained AS_OF_DATE in the data module — never hard-coded next to
 * the event, and never read from the visitor's device clock. See the comment on
 * AS_OF_DATE for why: "is this rule in effect?" is a legal statement, and a
 * wrong device clock must not be able to answer it.
 *
 * Server-rendered, plain accessible HTML: text stays selectable, crawlable and
 * readable with JavaScript disabled. Status is conveyed by a text label, not by
 * colour alone.
 */

const statusChip: Record<TimelineStatus, string> = {
  "in-effect": "border-ink-900/15 bg-ink-100 text-ink-700",
  next: "border-amber-400 bg-amber-100 text-amber-900",
  upcoming: "border-ink-900/10 bg-white text-ink-500",
};

const dotStyle: Record<TimelineStatus, string> = {
  "in-effect": "bg-ink-400",
  next: "bg-amber-500 ring-4 ring-amber-100",
  upcoming: "bg-white border-2 border-ink-900/20",
};

export default function BenefitsTimeline() {
  const events = timelineEvents();
  const { inEffect, next, later } = timelineSummary();

  return (
    <div data-timeline className="space-y-5">
      {/* ---------- Answer-first status banner ---------- */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 sm:p-5">
        {/*
          NOT "If you are reading this today". That framing implied a live date
          the page cannot know: it is statically rendered and AS_OF_DATE is a
          maintained constant, so it would have gone stale and misstated which
          rules are in force. "Page updated" is what we can actually assert.
        */}
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
          Page updated {AS_OF_DATE_HUMAN}
        </p>
        <dl className="mt-3 space-y-2.5 text-sm leading-relaxed">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
            <dt className="font-bold text-ink-900 sm:w-40 sm:flex-none">Already in effect</dt>
            <dd className="min-w-0 text-ink-700">
              {inEffect.length
                ? inEffect.map((e) => e.title).join("; ")
                : "None of the changes below have taken effect yet."}
            </dd>
          </div>
          {next && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="font-bold text-ink-900 sm:w-40 sm:flex-none">Next change</dt>
              <dd className="min-w-0 text-ink-700">
                <strong className="text-ink-900">{next.date}</strong> — {next.title}.{" "}
                <span className="text-ink-600">Who should pay attention: {next.who}</span>
              </dd>
            </div>
          )}
          {later.length > 0 && (
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="font-bold text-ink-900 sm:w-40 sm:flex-none">After that</dt>
              <dd className="min-w-0 text-ink-700">
                {later.map((e) => `${e.date} — ${e.title}`).join("; ")}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* ---------- Vertical timeline ---------- */}
      <ol className="relative space-y-3 sm:pl-6">
        {/* The rail sits behind the dots; hidden on phone where it adds noise. */}
        <span
          aria-hidden
          className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-ink-900/10 sm:block"
        />
        {events.map(({ event, status }) => (
          <li key={event.id} className="relative">
            <span
              aria-hidden
              className={`absolute -left-6 top-4 hidden h-3.5 w-3.5 rounded-full sm:block ${dotStyle[status]}`}
            />
            <div
              className={`rounded-2xl border p-4 ${
                status === "next"
                  ? "border-amber-300 bg-amber-50/40"
                  : "border-ink-900/10 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-ink-900/10 bg-white px-2.5 py-0.5 text-xs font-bold text-ink-800">
                  {event.date}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide ${statusChip[status]}`}
                >
                  {TIMELINE_STATUS_LABEL[status]}
                </span>
              </div>

              <p className="mt-2 font-bold leading-snug text-ink-900">{event.title}</p>

              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                <span className="font-semibold text-ink-900">Who this affects: </span>
                {event.who}
              </p>

              {/* The long legal detail is collapsed so the timeline stays scannable,
                  but remains in the DOM: crawlable and readable without JS. */}
              <details className="group mt-2">
                <summary className="inline-flex min-h-[32px] cursor-pointer list-none items-center gap-1 text-xs font-bold text-brand-700 marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
                  Why this matters
                  <span aria-hidden className="transition-transform group-open:rotate-90">
                    ›
                  </span>
                </summary>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{event.what}</p>
              </details>

              <p className="mt-2.5 break-words text-xs text-ink-500">
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {event.sourceName} ↗
                </a>{" "}
                · verified {event.lastVerified}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
