"use client";

/**
 * Icon-card grid selector — replaces a plain <select> dropdown for choices
 * users should be able to recognize visually (service type, network status,
 * plan type). Large touch targets, keyboard-navigable (native <button>s),
 * selected state is never color-alone (also gets a check mark + border).
 */
export interface IconOption<T extends string> {
  value: T;
  label: string;
  icon: string;
}

export default function IconSegmentedSelect<T extends string>({
  options,
  value,
  onChange,
  columns = 4,
  compact = false,
}: {
  options: IconOption<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: 2 | 3 | 4;
  compact?: boolean;
}) {
  const colClass = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4";
  return (
    <div className={`grid gap-2 ${colClass}`} role="radiogroup">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border-2 text-center transition ${
              compact ? "min-h-[64px] px-2 py-2" : "min-h-[84px] px-3 py-3"
            } ${
              selected
                ? "border-brand-500 bg-brand-50 shadow-sm"
                : "border-ink-900/10 bg-white hover:border-brand-200 hover:bg-brand-50/40"
            }`}
          >
            {selected && (
              <span aria-hidden className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[0.6rem] text-white">
                ✓
              </span>
            )}
            <span aria-hidden className={compact ? "text-xl" : "text-2xl"}>{opt.icon}</span>
            <span className={`font-semibold leading-tight ${selected ? "text-brand-800" : "text-ink-700"} ${compact ? "text-[0.6875rem]" : "text-xs"}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
