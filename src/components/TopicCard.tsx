import Link from "next/link";
import type { Topic } from "@/types";

export default function TopicCard({
  topic,
  count,
}: {
  topic: Topic;
  count?: number;
}) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-ink-900/5 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${topic.accent} text-lg shadow-sm`}
        >
          {topic.icon}
        </span>
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-400">
          {typeof count === "number"
            ? `${count} guide${count === 1 ? "" : "s"}`
            : "Topic"}
        </span>
      </div>
      <h3 className="mt-2.5 text-sm font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-600">
        {topic.title}
      </h3>
      <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-500">
        {topic.description}
      </p>
      <span className="mt-2.5 text-xs font-semibold text-brand-600">
        Explore{" "}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
