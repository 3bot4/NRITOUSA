import Image from "next/image";
import type { Contributor } from "@/lib/successStories";
import { contributorInitials } from "@/lib/successStories";

/**
 * Contributor avatar. Renders an approved headshot when one exists in /public,
 * otherwise a deterministic initials monogram (the site-wide convention).
 *
 * We NEVER synthesize a face: a subject with no approved photo simply shows
 * their initials. Set `approvedPhoto` on the Contributor once a real, approved
 * headshot is added at /public.
 */
export default function ContributorAvatar({
  contributor,
  size = 96,
  className = "",
}: {
  contributor: Contributor;
  size?: number;
  className?: string;
}) {
  const rounded = "rounded-2xl";

  if (contributor.approvedPhoto) {
    return (
      <Image
        src={contributor.approvedPhoto}
        alt={contributor.photoAlt}
        width={size}
        height={size}
        className={`${rounded} object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ height: size, width: size, fontSize: size * 0.32 }}
      className={`flex flex-none items-center justify-center ${rounded} bg-gradient-to-br from-ink-900 to-ink-700 font-extrabold text-white ${className}`}
    >
      {contributorInitials(contributor)}
    </span>
  );
}
