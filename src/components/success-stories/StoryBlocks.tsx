import type { SuccessStory } from "@/lib/successStories";

/** Editorial disclosure: the production note + the transparency disclosure. */
export function EditorialDisclosure({ story }: { story: SuccessStory }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-sm leading-relaxed text-ink-700">
        <span className="font-semibold text-ink-900">Editorial note. </span>
        {story.editorialNote}
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-ink-700">
        {story.disclosure}
      </div>
    </div>
  );
}

/** Thematic "key lessons" list shown near the top of a story. */
export function KeyLessons({ lessons }: { lessons: string[] }) {
  return (
    <section
      aria-labelledby="lessons-heading"
      className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-7"
    >
      <h2
        id="lessons-heading"
        className="text-lg font-bold tracking-tight text-ink-900"
      >
        Key lessons
      </h2>
      <ul className="mt-4 space-y-3">
        {lessons.map((t) => (
          <li key={t} className="flex items-start gap-3 text-ink-700">
            <span
              aria-hidden
              className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
            >
              ✓
            </span>
            <span className="leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Lightweight in-page table of contents (anchor jump list) for long stories. */
export function StoryToc({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <nav
      aria-label="On this page"
      className="rounded-2xl border border-ink-900/5 bg-slate-50/60 p-5"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
        On this page
      </p>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
