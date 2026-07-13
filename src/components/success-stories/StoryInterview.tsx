import type { InterviewExchange } from "@/lib/successStories";

/**
 * Q&A interview block. Each exchange is a question heading followed by one or
 * more answer paragraphs and an optional verbatim pull-quote (the subject's own
 * words). No FAQ schema is emitted for this — it's an editorial interview, not
 * a support FAQ, so marking it up as FAQPage would misrepresent the content.
 */
export default function StoryInterview({
  exchanges,
}: {
  exchanges: InterviewExchange[];
}) {
  return (
    <div className="space-y-10">
      {exchanges.map((ex, i) => (
        <div key={i}>
          <h3 className="text-lg font-bold leading-snug text-ink-900">
            <span className="mr-2 text-brand-500" aria-hidden>
              Q.
            </span>
            {ex.question}
          </h3>
          <div className="mt-3 space-y-4 leading-8 text-ink-700">
            {ex.answer.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
          {ex.quote && (
            <blockquote className="mt-5 border-l-4 border-brand-500 bg-brand-50/50 py-3 pl-5 pr-4 text-lg font-medium italic leading-relaxed text-ink-800">
              “{ex.quote}”
            </blockquote>
          )}
        </div>
      ))}
    </div>
  );
}
