#!/usr/bin/env node
/**
 * Rough prose word-count for a TSX page + the modules it pulls copy from.
 *
 * Counts human-readable text only: JSX text nodes and the string literals that
 * hold body copy, FAQ answers and list items. Strips imports, class names,
 * Tailwind strings, URLs and identifiers, so the number tracks what a reader
 * actually reads rather than the file size.
 *
 * Used to check the "no thin pages" bar (≈1,500–2,500 words) for the
 * September 2026 gap build. Indicative, not exact.
 */
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
let total = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const words = new Set();
  let count = 0;

  // string literals that look like prose (contain a space and a lowercase run)
  const strings = src.match(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g) ?? [];
  for (const raw of strings) {
    const s = raw.slice(1, -1);
    if (!/\s/.test(s)) continue;
    if (/^[\w-]+(\s+[\w:/-]+)*$/.test(s) && /(?:^|\s)(?:text|bg|border|rounded|flex|grid|mt|mb|px|py|sm:|hover:)/.test(s)) continue; // tailwind
    if (/^https?:/.test(s)) continue;
    count += s.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length;
  }

  // JSX text nodes: >text<
  const jsx = src.match(/>[^<>{}]+</g) ?? [];
  for (const raw of jsx) {
    const s = raw.slice(1, -1).trim();
    if (!s || !/[a-z]{3}/.test(s)) continue;
    count += s.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).length;
  }

  total += count;
  console.log(String(count).padStart(6), file);
  void words;
}

console.log(String(total).padStart(6), "TOTAL");
