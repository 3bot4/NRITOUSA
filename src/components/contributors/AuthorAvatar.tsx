import Image from "next/image";
import type { Author } from "@/types";
import { initials } from "@/lib/format";

/**
 * Author headshot. Renders an optimized next/image when the author has a
 * `headshot` in /public; otherwise falls back to an initials avatar so the
 * directory looks complete before photos are supplied.
 */
export default function AuthorAvatar({
  author,
  size = 96,
  className = "",
}: {
  author: Author;
  size?: number;
  className?: string;
}) {
  const dimension = { width: size, height: size };

  if (author.headshot) {
    return (
      <Image
        src={author.headshot}
        alt={`${author.name} headshot`}
        {...dimension}
        className={`rounded-2xl object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={dimension}
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-500 font-extrabold text-white ${className}`}
    >
      <span style={{ fontSize: size * 0.36 }}>{initials(author.name)}</span>
    </span>
  );
}
