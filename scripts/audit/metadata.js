#!/usr/bin/env node
// Extract per-page title/description/path from page.tsx files; flag length +
// duplicate issues. Resolves simple in-file const refs (TITLE/DESC). Read-only.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..", "..");
const APP = path.join(ROOT, "src", "app");

function walk(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n);
    const s = fs.statSync(f);
    if (s.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(n)) continue;
      walk(f, out);
    } else if (/[/\\]page\.tsx$/.test(f)) out.push(f);
  }
  return out;
}
function routeFor(file) {
  const segs = path.relative(APP, path.dirname(file)).split(path.sep).filter(Boolean);
  return "/" + segs.filter((s) => !(s.startsWith("(") && s.endsWith(")")) && !s.startsWith("@")).join("/");
}
function resolveConsts(src) {
  const map = {};
  for (const m of src.matchAll(/const\s+([A-Z][A-Z0-9_]*)\s*=\s*(?:`([^`]*)`|"([^"]*)"|'([^']*)')/g)) {
    map[m[1]] = (m[2] ?? m[3] ?? m[4] ?? "").replace(/\s+/g, " ").trim();
  }
  return map;
}
// Scope extraction to the actual metadata block so nested card `title:` /
// `description:` objects deeper in the JSX can't produce false positives.
function metaBlock(src) {
  let i = src.search(/pageMetadata\s*\(\s*\{/);
  if (i < 0) i = src.search(/export\s+const\s+metadata[^=]*=\s*\{/);
  if (i < 0) return src.slice(0, 1200); // fallback: file head
  const start = src.indexOf("{", i);
  // grab a generous window; metadata objects are small
  return src.slice(start, start + 1400);
}
function pick(block, consts, key) {
  const re = new RegExp(key + "\\s*:\\s*(?:`([^`]*)`|\"([^\"]*)\"|'([^']*)'|([A-Za-z_][A-Za-z0-9_.]*))");
  const m = block.match(re);
  if (!m) return null;
  if (m[4]) {
    // resolve UPPER_CASE in-file consts; otherwise mark as dynamic reference
    return consts[m[4]] ?? `«${m[4]}»`;
  }
  return (m[1] ?? m[2] ?? m[3] ?? "").replace(/\s+/g, " ").trim();
}

const files = walk(APP);
const rows = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const route = routeFor(f);
  const consts = resolveConsts(src);
  const dynamic = /export\s+(async\s+)?function\s+generateMetadata/.test(src);
  const hasMeta = /export\s+const\s+metadata\b/.test(src) || dynamic;
  const block = metaBlock(src);
  const title = pick(block, consts, "title");
  const description = pick(block, consts, "description");
  const canonical = pick(block, consts, "path") || pick(block, consts, "canonical");
  rows.push({ route, file: path.relative(ROOT, f), dynamic, hasMeta, title, description, canonical });
}

// duplicates
const byTitle = {}, byDesc = {};
for (const r of rows) {
  if (r.title) (byTitle[r.title] = byTitle[r.title] || []).push(r.route);
  if (r.description) (byDesc[r.description] = byDesc[r.description] || []).push(r.route);
}
const dupTitles = Object.entries(byTitle).filter(([, v]) => v.length > 1);
const dupDescs = Object.entries(byDesc).filter(([, v]) => v.length > 1);

// length / missing issues (only for statically-extractable, non-dynamic where sensible)
const issues = [];
for (const r of rows) {
  if (!r.hasMeta) { issues.push({ route: r.route, issue: "no metadata export", val: "" }); continue; }
  if (r.dynamic && !r.title) continue; // generateMetadata — title built at runtime, skip length checks
  const dynTitle = r.title && r.title.startsWith("«");
  const dynDesc = r.description && r.description.startsWith("«");
  if (dynTitle || dynDesc) { /* dynamic reference — not a defect, skip length checks for that field */ }
  if (!r.title) issues.push({ route: r.route, issue: "title not statically found", val: r.file });
  else if (dynTitle) { /* dynamic title ref */ }
  else {
    const tl = (r.title + " | NRI to USA").length; // layout appends suffix
    if (tl > 62) issues.push({ route: r.route, issue: `title too long (${tl} w/ suffix)`, val: r.title });
    if (r.title.length < 15) issues.push({ route: r.route, issue: `title too short (${r.title.length})`, val: r.title });
  }
  if (!r.description) issues.push({ route: r.route, issue: "description not statically found", val: r.file });
  else if (dynDesc) { /* dynamic description ref */ }
  else {
    const d = r.description.length;
    if (d > 165) issues.push({ route: r.route, issue: `description too long (${d})`, val: r.description.slice(0, 80) + "…" });
    if (d < 70) issues.push({ route: r.route, issue: `description too short (${d})`, val: r.description });
  }
  if (r.canonical && r.canonical !== r.route && !r.canonical.startsWith("«")) {
    // allow dynamic canonical mismatch note
    if (!r.canonical.includes("$") && !r.dynamic)
      issues.push({ route: r.route, issue: "canonical != route", val: `canonical=${r.canonical}` });
  }
}

const out = { total: rows.length, dupTitles, dupDescs, issues, rows };
fs.writeFileSync(path.join(__dirname, "metadata-data.json"), JSON.stringify(out, null, 2));
console.log("pages:", rows.length);
console.log("\n=== DUPLICATE TITLES (" + dupTitles.length + ") ===");
dupTitles.forEach(([t, v]) => console.log(`"${t}"\n   -> ${v.join(", ")}`));
console.log("\n=== DUPLICATE DESCRIPTIONS (" + dupDescs.length + ") ===");
dupDescs.forEach(([t, v]) => console.log(`"${t.slice(0, 70)}…"\n   -> ${v.join(", ")}`));
console.log("\n=== ISSUES (" + issues.length + ") ===");
issues.forEach((i) => console.log(`[${i.issue}] ${i.route}  ${String(i.val).slice(0, 90)}`));
