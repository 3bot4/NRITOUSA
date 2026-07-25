/**
 * Guards the "never publish a fake AdSense publisher id" requirement.
 * Scans text-like files under src/ and public/ for a placeholder pattern —
 * "pub-" followed by ten or more zeros — and confirms public/ads.txt does
 * not exist. ads.txt must only ever be created with a real, account-issued
 * line (see MONETIZATION_SETUP.md), never generated or guessed by this
 * codebase.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const REPO_ROOT = resolve(__dirname, "../../");
const SCAN_DIRS = ["src", "public"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".json",
  ".txt",
  ".xml",
  ".css",
  ".md",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (TEXT_EXTENSIONS.has(extname(full))) {
      out.push(full);
    }
  }
  return out;
}

describe("AdSense publisher id safety", () => {
  it("never ships a placeholder/fake publisher id in src/ or public/", () => {
    const files = SCAN_DIRS.flatMap((d) => walk(resolve(REPO_ROOT, d)));
    expect(files.length).toBeGreaterThan(50); // sanity: the scan actually ran

    const fakeIdPattern = /pub-0{10,}/i;
    for (const file of files) {
      const contents = readFileSync(file, "utf8");
      expect(
        contents,
        `${file} contains a placeholder AdSense publisher id`,
      ).not.toMatch(fakeIdPattern);
    }
  });

  it("does not publish ads.txt without a real, account-issued publisher id", () => {
    expect(existsSync(resolve(REPO_ROOT, "public/ads.txt"))).toBe(false);
  });
});
