"use client";

export interface Band {
  label: string;
  sublabel?: string;
  value: string;
}

/**
 * Natural-language "pick a band, or say you don't know" input — replaces
 * asking for an exact dollar/percentage figure. "Not sure" is a first-class
 * option that clears the field rather than forcing a guess; the engine
 * already treats an unset field honestly (flags it, never invents a value),
 * so choosing "Not sure" here is never silently defaulted to anything.
 */
export default function QuickPickBands({
  question,
  help,
  bands,
  value,
  onChange,
  notSureLabel = "Not sure",
}: {
  question: string;
  help?: string;
  bands: Band[];
  value: string;
  onChange: (v: string) => void;
  notSureLabel?: string;
}) {
  const isNotSure = value === "";
  return (
    <div>
      <p className="text-sm font-bold text-ink-900">{question}</p>
      {help && <p className="mt-0.5 text-xs text-ink-500">{help}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {bands.map((b) => {
          const selected = b.value === value;
          return (
            <button
              key={b.value}
              type="button"
              onClick={() => onChange(b.value)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-xs font-bold transition ${
                selected ? "border-brand-500 bg-brand-50 text-brand-800" : "border-ink-900/10 bg-white text-ink-700 hover:border-brand-200"
              }`}
            >
              {b.label}
              {b.sublabel && <span className="block font-normal text-ink-400">{b.sublabel}</span>}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-xl border-2 border-dashed px-3 py-2 text-xs font-bold transition ${
            isNotSure ? "border-ink-400 bg-ink-50 text-ink-700" : "border-ink-900/15 bg-white text-ink-400 hover:border-ink-400"
          }`}
        >
          {notSureLabel}
        </button>
      </div>
    </div>
  );
}
