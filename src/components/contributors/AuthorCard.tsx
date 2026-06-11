import Link from "next/link";
import type { Author } from "@/types";
import Icon from "@/components/Icon";
import AuthorAvatar from "./AuthorAvatar";
import { authorPath } from "@/lib/authors";

/** Directory card for a single contributor. */
export default function AuthorCard({ author }: { author: Author }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-center gap-4">
        <AuthorAvatar author={author} size={64} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight text-ink-900">
            {author.name}
          </h3>
          <p className="truncate text-sm text-ink-500">{author.role}</p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
        {author.bio}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-ink-900/5 pt-4">
        <Link
          href={authorPath(author.slug)}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View Articles{" "}
          <span aria-hidden className="inline-block">
            →
          </span>
        </Link>
        <a
          href={author.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${author.name} on LinkedIn`}
          className="text-ink-400 transition-colors hover:text-brand-600"
        >
          <Icon name="linkedin" />
        </a>
      </div>
    </article>
  );
}
