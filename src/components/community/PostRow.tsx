import Link from "next/link";
import type { PostView } from "@/lib/supabase/types";
import { authorDisplay, excerpt } from "@/lib/community-utils";
import { formatDate } from "@/lib/format";

export default function PostRow({ post }: { post: PostView }) {
  const author = authorDisplay(post);
  return (
    <Link
      href={`/community/post/${post.slug}`}
      className="group block rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
            {post.is_pinned && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                📌 Pinned
              </span>
            )}
            {post.is_locked && (
              <span className="rounded-full bg-ink-900/5 px-2 py-0.5 font-semibold text-ink-500">
                🔒 Locked
              </span>
            )}
            {post.category && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-ink-600">
                {post.category.icon} {post.category.name}
              </span>
            )}
          </div>
          <h3 className="truncate text-lg font-bold tracking-tight text-ink-900 group-hover:text-brand-600">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {excerpt(post.content, 150)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
            <span className="font-medium text-ink-600">{author.name}</span>
            {author.badge && (
              <span className="font-semibold text-amber-700">
                · {author.badge}
              </span>
            )}
            <span>· {formatDate(post.created_at)}</span>
          </div>
        </div>
        <div className="flex flex-none flex-col items-center gap-1 text-center">
          <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-ink-800">
            {post.replies_count}
          </span>
          <span className="text-[0.65rem] uppercase tracking-wide text-ink-400">
            replies
          </span>
        </div>
      </div>
    </Link>
  );
}
