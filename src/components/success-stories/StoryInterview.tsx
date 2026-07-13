import type { InterviewExchange } from "@/lib/successStories";
import { renderInline } from "./prose";

/**
 * Q&A body. Each exchange is a question heading followed by one or more answer
 * paragraphs (which may carry inline internal links) and an optional verbatim
 * pull-quote (the subject's own words). No FAQPage/QAPage schema is emitted —
 * this is editorial prose, and marking it up as an FAQ would misrepresent it.
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
              <p key={j}>{renderInline(p, `q${i}-p${j}`)}</p>
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
