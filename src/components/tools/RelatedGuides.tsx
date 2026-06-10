import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getArticle } from "@/lib/articles";

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
}

/**
 * "Related guides" card grid for tool pages. Pass existing article slugs
 * (silently skipped if a slug doesn't exist, so links can never 404) plus
 * optional extra links such as calculators.
 */
export default function RelatedGuides({
  slugs,
  extras = [],
  title = "Related guides",
}: {
  slugs: string[];
  extras?: RelatedLink[];
  title?: string;
}) {
  const links: RelatedLink[] = [
    ...slugs
      .map((slug) => {
        const a = getArticle(slug);
        return a
          ? {
              href: `/articles/${a.slug}`,
              title: a.title,
              description: a.excerpt,
            }
          : null;
      })
      .filter((x): x is RelatedLink => x !== null),
    ...extras,
  ];

  if (links.length === 0) return null;

  return (
    <section>
      <SectionHeading eyebrow="Keep learning" title={title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex flex-col rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <h3 className="text-sm font-bold tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
              {l.title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
              {l.description}
            </p>
            <span className="mt-3 text-xs font-semibold text-brand-600">
              Read guide{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
