#!/usr/bin/env node
// List unique internal links that target dynamic route families, grouped by family.
const fs = require("fs");
const path = require("path");
const d = require("./audit-data.json");
const ROOT = path.resolve(__dirname, "..", "..");
const prefixes = d.dynamicRoutePrefixes.map((x) => ({ p: x.prefix, path: x.path })).filter((x) => x.p);

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n);
    const s = fs.statSync(f);
    if (s.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(n)) continue;
      walk(f, out);
    } else if (/\.(tsx|ts|md|mdx)$/.test(n)) out.push(f);
  }
  return out;
}
const files = walk(path.join(ROOT, "src"));
const re = /(?:href|to)\s*=\s*(?:{`?|["'`])([^"'`}\s]+)/g;
const uniq = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(src))) {
    const l = m[1];
    if (!l.startsWith("/") || l.startsWith("//")) continue;
    const clean = l.split("#")[0].split("?")[0];
    if (clean.includes("${") || clean.includes("`")) continue;
    for (const pr of prefixes) {
      if (clean === pr.p || clean.startsWith(pr.p + "/")) {
        if (!uniq.has(clean)) uniq.set(clean, pr.path);
      }
    }
  }
}
const byFamily = {};
for (const [l, fam] of uniq) (byFamily[fam] = byFamily[fam] || []).push(l);
for (const fam of Object.keys(byFamily).sort()) {
  console.log("\n### " + fam + "  (" + byFamily[fam].length + " unique)");
  console.log(byFamily[fam].sort().join("\n"));
}
