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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-2xl shadow-sm`}
      >
        {topic.icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
        {topic.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {topic.description}
      </p>
      <span className="mt-4 text-sm font-semibold text-brand-600">
        {typeof count === "number" ? `${count} guide${count === 1 ? "" : "s"}` : "Explore"}{" "}
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5 inline-block">
          →
        </span>
      </span>
    </Link>
  );
}
