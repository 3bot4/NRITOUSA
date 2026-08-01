import { MISSING_INPUT_QUESTIONS } from "./shared";

/** Personalized "questions to ask the insurer" checklist, generated from the engine's missingInputs. */
export default function NextQuestionsChecklist({ missingInputs }: { missingInputs: string[] }) {
  const questions = Array.from(new Set(missingInputs)).map((k) => MISSING_INPUT_QUESTIONS[k]).filter(Boolean);
  if (questions.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        No missing terms were detected in this calculation — as a general practice, still confirm every number against your actual certificate before relying on it.
      </p>
    );
  }
  return (
    <ul className="space-y-1.5">
      {questions.map((q) => (
        <li key={q} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5 flex-none text-brand-500">?</span>
          <span className="text-ink-700">{q}</span>
        </li>
      ))}
    </ul>
  );
}
