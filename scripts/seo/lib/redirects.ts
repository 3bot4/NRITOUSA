/**
 * Every redirect the site serves, from BOTH sources:
 *
 *   1. next.config.mjs `redirects()`   — edge/config redirects
 *   2. src/app/**\/page.tsx calling `permanentRedirect()` — route-level stubs
 *
 * Auditing only one source is how a redirect chain survives review, so this
 * merges them and exposes the resolution so chains and loops are detectable.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..", "..");
const APP_DIR = join(ROOT, "src", "app");

export interface RedirectRule {
  source: string;
  destination: string;
  /** 301/308 — `permanent: true` is 308, `statusCode: 301` is 301. */
  status: number;
  origin: "next.config" | "permanentRedirect";
  file: string;
}

/** Parse the redirects() array out of next.config.mjs. */
function fromNextConfig(): RedirectRule[] {
  const src = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
  const rules: RedirectRule[] = [];
  // Each entry is an object literal with source/destination and either
  // `permanent: true|false` or `statusCode: N`.
  for (const m of src.matchAll(
    /\{\s*source:\s*["']([^"']+)["'],\s*destination:\s*["']([^"']+)["'],\s*(permanent:\s*(true|false)|statusCode:\s*(\d+))\s*,?\s*\}/g,
  )) {
    const [, source, destination, , permanent, statusCode] = m;
    rules.push({
      source,
      destination,
      status: statusCode ? Number(statusCode) : permanent === "true" ? 308 : 307,
      origin: "next.config",
      file: "next.config.mjs",
    });
  }
  return rules;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name === "page.tsx" || name === "page.ts") out.push(full);
  }
  return out;
}

function fileToRoute(file: string): string {
  const rel = relative(APP_DIR, file).split(sep).slice(0, -1);
  return "/" + rel.filter((s) => !(s.startsWith("(") && s.endsWith(")"))).join("/");
}

/** Find route files whose whole job is to redirect. */
function fromAppRoutes(): RedirectRule[] {
  const rules: RedirectRule[] = [];
  for (const file of walk(APP_DIR)) {
    const src = readFileSync(file, "utf8");
    const m = /permanentRedirect\(\s*["'`]([^"'`]+)["'`]/.exec(src);
    if (!m) continue;
    rules.push({
      source: fileToRoute(file),
      destination: m[1],
      status: 308,
      origin: "permanentRedirect",
      file: relative(ROOT, file),
    });
  }
  return rules;
}

export function allRedirects(): RedirectRule[] {
  return [...fromNextConfig(), ...fromAppRoutes()].sort((a, b) =>
    a.source.localeCompare(b.source),
  );
}

/** source path → destination path. */
export function redirectMap(): Map<string, string> {
  return new Map(allRedirects().map((r) => [r.source, r.destination]));
}

export interface ChainResult {
  source: string;
  hops: string[];
  final: string;
  /** True when following the chain revisits a URL. */
  loop: boolean;
}

/** Follow each redirect to its terminus, detecting chains and loops. */
export function resolveChains(): ChainResult[] {
  const map = redirectMap();
  return [...map.keys()].map((source) => {
    const hops: string[] = [];
    const seen = new Set<string>([source]);
    let cur = source;
    let loop = false;
    while (map.has(cur)) {
      const next = map.get(cur)!;
      hops.push(next);
      if (seen.has(next)) {
        loop = true;
        break;
      }
      seen.add(next);
      cur = next;
      if (hops.length > 10) break;
    }
    return { source, hops, final: cur, loop };
  });
}
