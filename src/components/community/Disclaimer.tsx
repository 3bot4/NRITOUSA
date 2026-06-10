import Link from "next/link";
import { COMMUNITY_DISCLAIMER } from "@/lib/community-utils";

export default function CommunityDisclaimer({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-amber-300/60 bg-amber-50/70 px-5 ${
        compact ? "py-3" : "py-4"
      } text-sm leading-relaxed text-amber-900`}
    >
      <strong className="font-semibold">Community disclaimer:</strong>{" "}
      {COMMUNITY_DISCLAIMER}{" "}
      {!compact && (
        <>
          Read the{" "}
          <Link href="/community/rules" className="underline">
            community rules
          </Link>
          .
        </>
      )}
    </div>
  );
}
