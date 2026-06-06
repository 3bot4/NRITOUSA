import React from "react";
import Link from "next/link";

/**
 * Light-markdown renderer for article bodies in lib/articles.
 *
 * Block syntax:
 *  - "## "  / "### "            → H2 / H3 headings
 *  - "- "                       → bullet list
 *  - "1. " (any number)         → ordered list
 *  - "| a | b |" + "|---|" row  → table
 *  - ":::summary … :::"         → TL;DR / summary callout box
 *  - ":::key … :::"             → "Key takeaways" checklist box
 *  - ":::note … :::"            → inline note / important callout
 *  - blank-line-separated text  → paragraphs
 *
 * Inline syntax (inside paragraphs, list items, headings, cells, callouts):
 *  - **bold**
 *  - [label](/internal or https://external)
 *
 * Dependency-free on purpose; swap for MDX when content moves to a CMS.
 */

/** Parse inline **bold** and [text](url) into React nodes. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Tokenize on links and bold. Links first so a bold inside a link label still works simply.
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      // Link: [label](href)
      const label = match[1];
      const href = match[2];
      const isInternal = href.startsWith("/");
      if (isInternal) {
        nodes.push(
          <Link
            key={`${keyPrefix}-l-${i}`}
            href={href}
            className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
          >
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={`${keyPrefix}-l-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
          >
            {label}
          </a>
        );
      }
    } else if (match[3] !== undefined) {
      // Bold
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-ink-900">
          {match[3]}
        </strong>
      );
    }

    lastIndex = pattern.lastIndex;
    i += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function Table({ rows, keyId }: { rows: string[]; keyId: string }) {
  // rows includes header row, separator row (|---|), then body rows
  const cells = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const header = cells(rows[0]);
  const body = rows.slice(2).map(cells);

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-ink-900/10">
      <table className="w-full border-collapse text-left text-[0.95rem]">
        <thead className="bg-slate-50">
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="border-b border-ink-900/10 px-4 py-3 font-semibold text-ink-900"
              >
                {renderInline(h, `${keyId}-th-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="even:bg-slate-50/60">
              {row.map((c, ci) => (
                <td
                  key={ci}
                  className="border-b border-ink-900/5 px-4 py-3 align-top text-ink-700"
                >
                  {renderInline(c, `${keyId}-td-${r}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SummaryBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const body = lines.join("\n").trim();
  const blocks = body.split(/\n\n+/);
  return (
    <div className="my-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5 sm:p-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-700">
        In a nutshell
      </p>
      {blocks.map((b, i) => (
        <p key={i} className="text-[1.0625rem] leading-7 text-ink-700">
          {renderInline(b, `${keyId}-p-${i}`)}
        </p>
      ))}
    </div>
  );
}

function KeyTakeaways({ items, keyId }: { items: string[]; keyId: string }) {
  return (
    <div className="my-6 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm sm:p-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
        Key takeaways
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-ink-700">
            <span
              aria-hidden
              className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
            >
              ✓
            </span>
            <span className="leading-relaxed">
              {renderInline(item.replace(/^- /, ""), `${keyId}-k-${i}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoteBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const body = lines.join("\n").trim();
  return (
    <div className="my-6 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-5 py-4">
      <p className="text-[1.0625rem] leading-7 text-ink-700">
        {renderInline(body, `${keyId}-note`)}
      </p>
    </div>
  );
}

export default function ArticleBody({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  let para: string[] = [];

  const flushPara = (key: string) => {
    if (para.length === 0) return;
    const text = para.join(" ");
    elements.push(
      <p key={key} className="my-4 text-[1.0625rem] leading-8 text-ink-700">
        {renderInline(text, key)}
      </p>
    );
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line → paragraph break
    if (trimmed === "") {
      flushPara(`p-${i}`);
      i += 1;
      continue;
    }

    // Callout fences: :::summary / :::key / :::note … :::
    const fence = trimmed.match(/^:::(\w+)/);
    if (fence) {
      flushPara(`p-${i}`);
      const kind = fence[1];
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && lines[i].trim() !== ":::") {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing :::
      const keyId = `cb-${i}`;
      if (kind === "key") {
        const items = buf.filter((l) => l.trim().startsWith("- "));
        elements.push(<KeyTakeaways key={keyId} items={items} keyId={keyId} />);
      } else if (kind === "note") {
        elements.push(<NoteBox key={keyId} lines={buf} keyId={keyId} />);
      } else {
        elements.push(<SummaryBox key={keyId} lines={buf} keyId={keyId} />);
      }
      continue;
    }

    // Table: a line with | and the next line is a |---| separator
    if (
      trimmed.startsWith("|") &&
      i + 1 < lines.length &&
      /^\|[\s:|-]+\|?$/.test(lines[i + 1].trim())
    ) {
      flushPara(`p-${i}`);
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableRows.push(lines[i]);
        i += 1;
      }
      elements.push(<Table key={`t-${i}`} rows={tableRows} keyId={`t-${i}`} />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushPara(`p-${i}`);
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-8 mb-2 text-xl font-bold tracking-tight text-ink-900"
        >
          {renderInline(trimmed.replace(/^### /, ""), `h3-${i}`)}
        </h3>
      );
      i += 1;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushPara(`p-${i}`);
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-10 mb-3 text-2xl font-bold tracking-tight text-ink-900"
        >
          {renderInline(trimmed.replace(/^## /, ""), `h2-${i}`)}
        </h2>
      );
      i += 1;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      flushPara(`p-${i}`);
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i += 1;
      }
      elements.push(
        <ol
          key={`ol-${i}`}
          className="my-5 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand-500"
        >
          {items.map((it, idx) => (
            <li key={idx} className="pl-1 leading-relaxed text-ink-700">
              {renderInline(it, `ol-${i}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ")) {
      flushPara(`p-${i}`);
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().replace(/^- /, ""));
        i += 1;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="my-5 list-disc space-y-2 pl-5 marker:text-brand-500"
        >
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed text-ink-700">
              {renderInline(it, `ul-${i}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Default: accumulate into paragraph
    para.push(trimmed);
    i += 1;
  }

  flushPara("p-final");

  return <div className="mx-auto max-w-prose">{elements}</div>;
}
