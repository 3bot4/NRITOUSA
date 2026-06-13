import React from "react";
import Link from "next/link";

/**
 * Light-markdown renderer for article bodies in lib/articles.
 *
 * Block syntax:
 *  - "## " / "### "             → H2 / H3 headings
 *  - "- "                        → bullet list
 *  - "1. " (any number)          → ordered list
 *  - "| a | b |" + "|---|" row   → comparison table (zebra rows, bold first col)
 *  - blank-line-separated text   → paragraphs
 *
 * Callout / component fences (":::kind … :::"):
 *  - :::summary  → "In a nutshell" summary box (legacy)
 *  - :::key      → "Key takeaways" checklist (legacy)
 *  - :::note     → inline amber note (legacy)
 *  - :::info     → 📌 Key-stat / callout box (violet, high-contrast)
 *  - :::good     → ✓ Recommended box (green)
 *  - :::bad      → ✗ Avoid box (orange)
 *  - :::tip      → 💡 Pro Tips box (blue)
 *  - :::warn     → ⚠️ Warning / common-mistakes box (amber)
 *  - :::compare  → two-column ✓ / ✗ comparison box
 *  - :::steps    → numbered circled steps (① ② ③)
 *  - :::cta      → inline call-to-action card
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

/** Strip a leading "- " bullet marker if present. */
const stripBullet = (l: string) => l.trim().replace(/^[-*]\s+/, "");

/** Pull "label: value" directive lines out of a fence body. */
function parseDirectives(lines: string[]) {
  const directives: Record<string, string> = {};
  const rest: string[] = [];
  for (const l of lines) {
    const m = l.match(/^\s*([a-z]+):\s+(.*)$/);
    if (m && ["left", "right", "title", "body", "button", "href"].includes(m[1])) {
      directives[m[1]] = m[2].trim();
    } else {
      rest.push(l);
    }
  }
  return { directives, rest };
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
    <div className="my-5 overflow-x-auto rounded-xl border border-ink-900/10">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className="border-b border-ink-900/10 px-3.5 py-2.5 font-semibold text-ink-900"
              >
                {renderInline(h, `${keyId}-th-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="even:bg-slate-50">
              {row.map((c, ci) => (
                <td
                  key={ci}
                  className={`border-b border-ink-900/5 px-3.5 py-2.5 align-top ${
                    ci === 0 ? "font-semibold text-ink-900" : "text-ink-700"
                  }`}
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
    <div className="my-5 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-700">
        In a nutshell
      </p>
      {blocks.map((b, i) => (
        <p key={i} className="text-[0.95rem] leading-[1.6] text-ink-700">
          {renderInline(b, `${keyId}-p-${i}`)}
        </p>
      ))}
    </div>
  );
}

function KeyTakeaways({ items, keyId }: { items: string[]; keyId: string }) {
  return (
    <div className="my-5 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
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
            <span className="text-[0.95rem] leading-[1.6]">
              {renderInline(stripBullet(item), `${keyId}-k-${i}`)}
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
    <div className="my-5 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-5 py-4">
      <p className="text-[0.95rem] leading-[1.6] text-ink-700">
        {renderInline(body, `${keyId}-note`)}
      </p>
    </div>
  );
}

/** 📌 Key-stat / "in a nutshell" callout — violet, high-contrast. */
function InfoBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const { directives, rest } = parseDirectives(lines);
  const items = rest.filter((l) => /^[-*]\s+/.test(l.trim()));
  const paras = rest.filter((l) => l.trim() && !/^[-*]\s+/.test(l.trim()));
  return (
    <div className="my-5 rounded-lg border-l-4 border-[#7C3AED] bg-[#F5F3FF] px-5 py-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
        <span aria-hidden>📌</span> {directives.title ?? "In a nutshell"}
      </p>
      {paras.map((p, i) => (
        <p key={`pp-${i}`} className="text-[0.95rem] leading-[1.6] text-ink-700">
          {renderInline(p.trim(), `${keyId}-ip-${i}`)}
        </p>
      ))}
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-[0.95rem] leading-[1.6] text-ink-800">
              <span aria-hidden className="text-[#7C3AED]">
                •
              </span>
              <span>{renderInline(stripBullet(item), `${keyId}-i-${i}`)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Single-column ✓ / ✗ box. `variant="good"` → green recommended list;
 * `variant="bad"` → orange avoid list.
 */
function VerdictBox({
  lines,
  keyId,
  variant,
}: {
  lines: string[];
  keyId: string;
  variant: "good" | "bad";
}) {
  const { directives, rest } = parseDirectives(lines);
  const items = rest.filter((l) => l.trim());
  const cfg =
    variant === "good"
      ? {
          bg: "#F0FDF4",
          border: "#16A34A",
          label: "#15803D",
          mark: "✓",
          title: "Recommended",
        }
      : {
          bg: "#FFF7ED",
          border: "#EA580C",
          label: "#C2410C",
          mark: "✗",
          title: "Avoid",
        };
  return (
    <div
      className="my-5 rounded-lg border-l-4 px-5 py-4 shadow-sm"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <p
        className="mb-2.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: cfg.label }}
      >
        {directives.title ?? cfg.title}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[0.95rem] leading-[1.6] text-ink-800">
            <span aria-hidden className="font-bold" style={{ color: cfg.border }}>
              {cfg.mark}
            </span>
            <span>{renderInline(stripBullet(item), `${keyId}-v-${i}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 💡 Pro Tips box — blue, → arrow bullets. */
function TipBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const { directives, rest } = parseDirectives(lines);
  const items = rest.filter((l) => l.trim());
  return (
    <div className="my-5 rounded-lg border-l-4 border-[#2563EB] bg-[#EFF6FF] px-5 py-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
        <span aria-hidden>💡</span> {directives.title ?? "Pro tips"}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[0.95rem] leading-[1.6] text-ink-800">
            <span aria-hidden className="font-bold text-[#2563EB]">
              →
            </span>
            <span>{renderInline(stripBullet(item), `${keyId}-tip-${i}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ⚠️ Warning / common-mistakes box — amber, ✗ bullets. */
function WarnBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const { directives, rest } = parseDirectives(lines);
  const items = rest.filter((l) => l.trim());
  return (
    <div className="my-5 rounded-lg border-l-4 border-[#D97706] bg-[#FFFBEB] px-5 py-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B45309]">
        <span aria-hidden>⚠️</span> {directives.title ?? "Common mistakes"}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[0.95rem] leading-[1.6] text-ink-800">
            <span aria-hidden className="font-bold text-[#D97706]">
              ✗
            </span>
            <span>{renderInline(stripBullet(item), `${keyId}-w-${i}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Two-column ✓ / ✗ comparison box.
 * Author with ✗-prefixed lines (left/avoid) and ✓-prefixed lines (right/do),
 * optional `left:` / `right:` heading directives.
 */
function CompareBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const { directives, rest } = parseDirectives(lines);
  const bad: string[] = [];
  const good: string[] = [];
  for (const raw of rest) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith("✗") || /^x\s/i.test(l)) bad.push(l.replace(/^✗\s*|^x\s+/i, ""));
    else if (l.startsWith("✓") || /^\+\s/.test(l))
      good.push(l.replace(/^✓\s*|^\+\s+/, ""));
    else good.push(stripBullet(l));
  }
  const col = (
    items: string[],
    side: "bad" | "good",
    heading: string
  ) => {
    const cfg =
      side === "good"
        ? { bg: "#F0FDF4", border: "#16A34A", label: "#15803D", mark: "✓" }
        : { bg: "#FFF7ED", border: "#EA580C", label: "#C2410C", mark: "✗" };
    return (
      <div
        className="flex-1 rounded-lg border-l-4 px-4 py-3.5"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <p
          className="mb-2 text-xs font-bold uppercase tracking-wider"
          style={{ color: cfg.label }}
        >
          {heading}
        </p>
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 text-[0.9rem] leading-[1.55] text-ink-800"
            >
              <span aria-hidden className="font-bold" style={{ color: cfg.border }}>
                {cfg.mark}
              </span>
              <span>{renderInline(it, `${keyId}-c-${side}-${i}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="my-5 flex flex-col gap-3 sm:flex-row">
      {col(bad, "bad", directives.left ?? "Avoid")}
      {col(good, "good", directives.right ?? "Do this")}
    </div>
  );
}

/** Numbered circled steps. Each line: "Title — description" (one per line). */
function StepsBox({ lines, keyId }: { lines: string[]; keyId: string }) {
  const items = lines
    .map((l) => stripBullet(l.replace(/^\d+\.\s+/, "")))
    .filter(Boolean);
  return (
    <ol className="my-5 space-y-3">
      {items.map((item, i) => {
        const split = item.split(/\s+[—–-]\s+/);
        const title = split[0];
        const desc = split.slice(1).join(" — ");
        return (
          <li key={i} className="flex gap-3.5">
            <span
              aria-hidden
              className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
            >
              {i + 1}
            </span>
            <div className="text-[0.95rem] leading-[1.6]">
              <span className="font-semibold text-ink-900">
                {renderInline(title, `${keyId}-st-${i}`)}
              </span>
              {desc && (
                <span className="text-ink-700">
                  {" "}
                  — {renderInline(desc, `${keyId}-sd-${i}`)}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Inline call-to-action card. Directives: title, body, button, href. */
function CtaCard({ lines, keyId }: { lines: string[]; keyId: string }) {
  const { directives } = parseDirectives(lines);
  const href = directives.href ?? "/";
  const isInternal = href.startsWith("/");
  const btn = (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
      {directives.button ?? "Learn more"}
      <span aria-hidden>→</span>
    </span>
  );
  return (
    <div className="my-6 rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
      {directives.title && (
        <p className="text-base font-bold text-ink-900">
          {renderInline(directives.title, `${keyId}-ct`)}
        </p>
      )}
      {directives.body && (
        <p className="mt-1 text-[0.9rem] leading-[1.55] text-ink-600">
          {renderInline(directives.body, `${keyId}-cb`)}
        </p>
      )}
      <div className="mt-3.5">
        {isInternal ? (
          <Link href={href}>{btn}</Link>
        ) : (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {btn}
          </a>
        )}
      </div>
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
      <p key={key} className="my-3.5 text-base leading-[1.6] text-ink-700">
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

    // Callout / component fences
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
      switch (kind) {
        case "key": {
          const items = buf.filter((l) => l.trim().startsWith("- "));
          elements.push(<KeyTakeaways key={keyId} items={items} keyId={keyId} />);
          break;
        }
        case "note":
          elements.push(<NoteBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "info":
          elements.push(<InfoBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "good":
          elements.push(
            <VerdictBox key={keyId} lines={buf} keyId={keyId} variant="good" />
          );
          break;
        case "bad":
          elements.push(
            <VerdictBox key={keyId} lines={buf} keyId={keyId} variant="bad" />
          );
          break;
        case "tip":
          elements.push(<TipBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "warn":
          elements.push(<WarnBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "compare":
          elements.push(<CompareBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "steps":
          elements.push(<StepsBox key={keyId} lines={buf} keyId={keyId} />);
          break;
        case "cta":
          elements.push(<CtaCard key={keyId} lines={buf} keyId={keyId} />);
          break;
        default:
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
          className="mt-6 mb-2 text-lg font-bold tracking-tight text-ink-900"
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
          className="mt-8 mb-2.5 text-xl font-bold tracking-tight text-ink-900"
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
          className="my-4 list-decimal space-y-1.5 pl-6 marker:font-semibold marker:text-brand-500"
        >
          {items.map((it, idx) => (
            <li
              key={idx}
              className="pl-1 text-base leading-[1.6] text-ink-700"
            >
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
          className="my-4 list-disc space-y-1.5 pl-5 marker:text-brand-500"
        >
          {items.map((it, idx) => (
            <li key={idx} className="text-base leading-[1.6] text-ink-700">
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

  return <div className="mx-auto max-w-[720px]">{elements}</div>;
}
