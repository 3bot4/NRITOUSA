import type { AuthorDisplay, AuthorBadgeTone } from "@/lib/community-utils";

const toneStyles: Record<AuthorBadgeTone, { badge: string; avatar: string }> = {
  official: {
    badge: "bg-brand-600 text-white",
    avatar: "bg-brand-600 text-white",
  },
  starter: {
    badge: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
    avatar: "bg-amber-100 text-amber-800",
  },
  admin: {
    badge: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    avatar: "bg-rose-100 text-rose-700",
  },
  mod: {
    badge: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
    avatar: "bg-indigo-100 text-indigo-700",
  },
  none: { badge: "", avatar: "bg-brand-50 text-brand-700" },
};

export default function AuthorChip({
  author,
  size = "md",
  date,
}: {
  author: AuthorDisplay;
  size?: "sm" | "md";
  date?: string;
}) {
  const tone = toneStyles[author.tone];
  const avatarSize = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex flex-none items-center justify-center rounded-full font-bold ${avatarSize} ${tone.avatar}`}
        aria-hidden
      >
        {author.initials}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink-800">{author.name}</span>
          {author.badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${tone.badge}`}
            >
              {author.badge}
            </span>
          )}
        </div>
        {date && <p className="text-xs text-ink-400">{date}</p>}
      </div>
    </div>
  );
}
