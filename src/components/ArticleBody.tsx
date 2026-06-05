/**
 * Minimal renderer for the light-markdown article bodies in lib/articles.
 * Supports: "## " headings, "- " list items, and plain paragraphs.
 * Intentionally dependency-free; swap for MDX when content moves to a CMS.
 */
export default function ArticleBody({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/);
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul
        key={key}
        className="my-5 space-y-2 pl-5 marker:text-brand-500 list-disc"
      >
        {listBuffer.map((item, i) => (
          <li key={i} className="text-ink-700 leading-relaxed">
            {item.replace(/^- /, "")}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  blocks.forEach((block, i) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => l.startsWith("- "));

    if (isList) {
      listBuffer.push(...lines);
      return;
    }
    flushList(`list-${i}`);

    if (block.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="mt-10 mb-3 text-2xl font-bold tracking-tight text-ink-900"
        >
          {block.replace(/^## /, "")}
        </h2>
      );
    } else {
      elements.push(
        <p key={i} className="my-4 text-[1.0625rem] leading-8 text-ink-700">
          {block}
        </p>
      );
    }
  });

  flushList("list-final");

  return <div className="max-w-prose">{elements}</div>;
}
