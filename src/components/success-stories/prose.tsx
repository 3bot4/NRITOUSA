import React from "react";
import Link from "next/link";

/**
 * Minimal inline renderer for success-story prose: parses `[label](/href)`
 * links and `**bold**`. Internal hrefs (starting with "/") render as Next
 * <Link>; anything else as a safe external anchor. Dependency-free on purpose.
 */
export function renderInline(
  text: string,
  keyPrefix: string,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, linkLabel, href, bold] = match;
    if (href) {
      if (href.startsWith("/")) {
        nodes.push(
          <Link
            key={`${keyPrefix}-l${i}`}
            href={href}
            className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
          >
            {linkLabel}
          </Link>,
        );
      } else {
        nodes.push(
          <a
            key={`${keyPrefix}-a${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
          >
            {linkLabel}
          </a>,
        );
      }
    } else if (bold) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{bold}</strong>);
    }
    lastIndex = pattern.lastIndex;
    i++;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
