import Link from "next/link";
import type { ClusterLink } from "@/lib/permCluster";

/**
 * "Related immigration timeline tools" grid used across the PERM cluster.
 */
export default function PermClusterLinks({
  title = "Related immigration timeline tools",
  links,
}: {
  title?: string;
  links: ClusterLink[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-xl border border-ink-900/10 bg-white p-4 transition hover:border-blue-500 hover:shadow-sm"
          >
            <p className="text-sm font-semibold text-ink-900 group-hover:text-blue-700">{l.label}</p>
            <p className="mt-0.5 text-xs text-ink-500">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
