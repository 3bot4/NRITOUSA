import Link from "next/link";
import type { CommunityCategory } from "@/lib/supabase/types";

export default function CategoryCard({
  category,
  count,
}: {
  category: CommunityCategory;
  count?: number;
}) {
  return (
    <Link
      href={`/community/categories/${category.slug}`}
      className="group flex items-start gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-2xl">
        {category.icon ?? "💬"}
      </span>
      <div className="min-w-0">
        <h3 className="font-bold tracking-tight text-ink-900 group-hover:text-brand-600">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-500">
            {category.description}
          </p>
        )}
        {typeof count === "number" && (
          <p className="mt-2 text-xs font-medium text-ink-400">
            {count} discussion{count === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </Link>
  );
}
