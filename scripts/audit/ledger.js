#!/usr/bin/env node
/*
 * Content ledger for NRITOUSA.com — the standing record of what is verified,
 * what is rotting, and what content still needs work.
 *
 * Two halves, deliberately:
 *   HAND-MAINTAINED  data/content-ledger.json — the backlog we are choosing to
 *                    track. Edit this file; add items, mark them done.
 *   REGENERATED      everything else — link health, meta-tag stats, verified
 *                    number status, Fast Answer coverage. Recomputed on every
 *                    run so the ledger can never quietly drift from the site.
 *
 * That split matters: a ledger whose numbers are typed in by hand becomes
 * fiction within a month. Only the judgement calls are stored.
 *
 * Usage:
 *   npm run build          # required — meta stats read the rendered HTML
 *   npm run ledger:links   # optional — refreshes outbound link health (slow)
 *   npm run ledger         # writes reports/ledger.html
 *
 * Read-only with respect to the source tree; writes only reports/ledger.html.
 */

const { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } = require("node:fs");
const { join, relative, sep } = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = join(__dirname, "..", "..");
const APP_OUT = join(ROOT, ".next", "server", "app");
const LEDGER_DATA = join(ROOT, "data", "content-ledger.json");
const LINK_HEALTH = join(__dirname, "link-health.json");
const OUT_DIR = join(ROOT, "reports");
const OUT_FILE = join(OUT_DIR, "ledger.html");

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── rendered-HTML meta stats ─────────────────────────────────────────────── */

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–");

function metaTag(html, attr, key) {
  const a = new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, "i");
  const b = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, "i");
  const m = html.match(a) || html.match(b);
  return m ? decode(m[1]) : null;
}

function metaStats() {
  if (!existsSync(APP_OUT)) return null;
  const rows = [];
  for (const file of walkHtml(APP_OUT)) {
    const html = readFileSync(file, "utf8");
    const rel = relative(APP_OUT, file).replace(/\.html$/, "").split(sep);
    const route = rel.length === 1 && rel[0] === "index" ? "/" : "/" + rel.join("/");
    if (/noindex/i.test(metaTag(html, "name", "robots") || "")) continue;
    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = t ? decode(t[1].trim()) : "";
    const desc = metaTag(html, "name", "description") || "";
    rows.push({
      route,
      title,
      titleLen: title.length,
      descLen: desc.length,
      ogImage: !!metaTag(html, "property", "og:image"),
      twCard: !!metaTag(html, "name", "twitter:card"),
      doubledBrand: (title.match(/\| NRI to USA/g) || []).length > 1,
    });
  }
  const pct = (arr, p) => {
    const s = [...arr].sort((x, y) => x - y);
    return s.length ? s[Math.floor(s.length * p)] : 0;
  };
  const tl = rows.map((r) => r.titleLen);
  const dl = rows.map((r) => r.descLen);
  return {
    indexable: rows.length,
    titleMedian: pct(tl, 0.5),
    titleMax: Math.max(0, ...tl),
    titleOver60: rows.filter((r) => r.titleLen > 60).length,
    titleOver80: rows.filter((r) => r.titleLen > 80).length,
    descMedian: pct(dl, 0.5),
    descMax: Math.max(0, ...dl),
    descOver160: rows.filter((r) => r.descLen > 160).length,
    descOver200: rows.filter((r) => r.descLen > 200).length,
    missingOgImage: rows.filter((r) => !r.ogImage).length,
    missingTwCard: rows.filter((r) => !r.twCard).length,
    doubledBrand: rows.filter((r) => r.doubledBrand).map((r) => r.route),
    worstTitles: rows.filter((r) => r.titleLen > 80).sort((a, b) => b.titleLen - a.titleLen).slice(0, 8),
    worstDescs: rows.filter((r) => r.descLen > 200).sort((a, b) => b.descLen - a.descLen).slice(0, 8),
  };
}

/* ── audit script results ─────────────────────────────────────────────────── */

function runScript(args) {
  try {
    return execFileSync("node", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    // These scripts exit non-zero when they find problems — that output is the point.
    return (err.stdout || "") + (err.stderr || "");
  }
}

/** Fast Answer / source / stamp coverage across number-intent pages. */
function intentCoverage() {
  const out = runScript(["scripts/audit-user-intent-numbers.ts"]);
  const m = out.match(/Scanned (\d+) routes · (\d+) match a number intent/);
  const p = out.match(/High: (\d+)\s+Medium: (\d+)\s+Low: (\d+)/);
  const rows = [];
  for (const line of out.split("\n")) {
    const c = line.split("\t");
    if (c.length === 8 && /^(High|Medium|Low)$/.test(c[0].trim())) {
      rows.push({
        pri: c[0].trim(),
        flags: c.slice(1, 7).map((x) => x.trim() === "✅"),
        page: c[7].trim(),
      });
    }
  }
  const incompleteHigh = rows.filter((r) => r.pri === "High" && r.flags.some((f) => !f));
  return {
    scanned: m ? +m[1] : 0,
    matching: m ? +m[2] : 0,
    high: p ? +p[1] : 0,
    medium: p ? +p[2] : 0,
    low: p ? +p[3] : 0,
    incompleteHigh: incompleteHigh.length,
    worst: incompleteHigh
      .map((r) => ({ page: r.page, missing: r.flags.filter((f) => !f).length }))
      .sort((a, b) => b.missing - a.missing)
      .slice(0, 10),
  };
}

/** Staleness / drift state of the tracked verified numbers. */
function numberStatus() {
  const out = runScript(["scripts/audit-monthly-numbers.ts"]);
  const tracked = out.match(/Tracked values: (\d+) · Stale \(>(\d+) days\): (\d+)/);
  const drift = out.match(/Values changed without a re-verification stamp: (\d+)/);
  const ages = [...out.matchAll(/^(ok|NEEDS)\t(\d+)d\t/gm)].map((m) => +m[2]);
  const staleDays = tracked ? +tracked[2] : 45;
  return {
    tracked: tracked ? +tracked[1] : 0,
    staleDays,
    stale: tracked ? +tracked[3] : 0,
    drift: drift ? +drift[1] : 0,
    atCliff: ages.filter((a) => a >= staleDays - 1 && a <= staleDays).length,
    oldest: ages.length ? Math.max(...ages) : 0,
  };
}

function seoAuditSummary() {
  const f = join(OUT_DIR, "seo-audit.json");
  if (!existsSync(f)) return null;
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    const findings = j.findings || [];
    return {
      errors: findings.filter((x) => x.level === "error").length,
      warnings: findings.filter((x) => x.level === "warn").length,
      pageCount: j.pageCount,
      indexableCount: j.indexableCount,
    };
  } catch {
    return null;
  }
}

function linkHealth() {
  if (!existsSync(LINK_HEALTH)) return null;
  return JSON.parse(readFileSync(LINK_HEALTH, "utf8"));
}

/* ── render ───────────────────────────────────────────────────────────────── */

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

/*
 * Items arrive two ways: fully worked up after an audit, or as a one-line note
 * captured the moment someone spots something. Both have to render — a capture
 * step that demands five fields is a capture step people stop using. Anything
 * missing is simply omitted rather than printed as "undefined".
 */
function renderItems(items) {
  if (!items.length) return `<p class="empty">Nothing open.</p>`;
  return items
    .map((it) => {
      const sev = it.severity || "unsorted";
      const done = it.status === "done";
      const tone = done ? "good" : sev === "high" ? "dead" : sev === "medium" ? "watch" : "";
      const chip = tone || "info";
      const label = done ? `Resolved ${it.resolved || ""}`.trim() : it.status === "ongoing" ? "Ongoing" : sev;
      const bits = [];
      if (it.detail) bits.push(`<p>${esc(it.detail)}</p>`);
      if (!done && (it.nextStep || it.evidence)) {
        bits.push(
          `<p class="next">${it.nextStep ? `<b>Next:</b> ${esc(it.nextStep)}` : ""}` +
            `${it.evidence ? `<span class="ev">${esc(it.evidence)}</span>` : ""}</p>`,
        );
      }
      return `
    <div class="find ${tone}">
      <div class="find-head">
        <span class="chip ${chip}">${esc(label)}</span>
        <span class="find-title">${esc(it.title)}</span>
        ${it.area ? `<span class="chip info">${esc(it.area)}</span>` : ""}
        ${it.opened && !done ? `<span class="ev" style="margin:0">opened ${esc(it.opened)}</span>` : ""}
      </div>
      ${bits.join("\n      ")}
    </div>`;
    })
    .join("\n");
}

function main() {
  const ledger = JSON.parse(readFileSync(LEDGER_DATA, "utf8"));
  const meta = metaStats();
  const links = linkHealth();
  const seo = seoAuditSummary();
  const nums = numberStatus();
  const intent = intentCoverage();
  const today = new Date().toISOString().slice(0, 10);

  if (!meta) {
    console.error("No build output at .next/server/app — run `npm run build` first.");
    process.exit(2);
  }

  const open = ledger.items
    .filter((i) => i.status !== "done")
    .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  const done = ledger.items.filter((i) => i.status === "done");

  const deadCount = links ? links.counts.dead : null;
  const linkTile = links
    ? deadCount === 0
      ? { v: "0 dead", cls: "ok", n: `${links.counts.checked} outbound citations checked ${links.generatedAt}. ${links.counts.unverifiable} on bot-blocking hosts need manual review.` }
      : { v: `${deadCount} dead`, cls: "bad", n: `Across ${new Set(links.dead.flatMap((d) => d.pages)).size} pages. Checked ${links.generatedAt}.` }
    : { v: "not run", cls: "mid", n: "Run <code>npm run ledger:links</code> to populate." };

  const html = `<title>NRItoUSA Content Ledger</title>
<style>
:root{--ground:#f5f7f9;--surface:#fff;--surface-2:#eef1f5;--ink:#131820;--muted:#5c6675;--faint:#8a93a1;--line:#dde2e9;--line-strong:#c6ccd6;--accent:#1e40f5;--accent-soft:#e8ebfe;--pass:#0f7a52;--pass-soft:#e2f2eb;--warn:#8a5a00;--warn-soft:#f9efdb;--fail:#b3261e;--fail-soft:#fbe7e5;--serif:"Iowan Old Style",Charter,"Bitstream Charter",Georgia,"Times New Roman",serif;--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ground:#0e1116;--surface:#161a21;--surface-2:#1c222b;--ink:#e6e9ee;--muted:#99a3b2;--faint:#737e8d;--line:#262c36;--line-strong:#39414e;--accent:#8298ff;--accent-soft:#1b2340;--pass:#56cf9a;--pass-soft:#12291f;--warn:#e3a844;--warn-soft:#2c2313;--fail:#ff8f84;--fail-soft:#2e1917}}
:root[data-theme="dark"]{--ground:#0e1116;--surface:#161a21;--surface-2:#1c222b;--ink:#e6e9ee;--muted:#99a3b2;--faint:#737e8d;--line:#262c36;--line-strong:#39414e;--accent:#8298ff;--accent-soft:#1b2340;--pass:#56cf9a;--pass-soft:#12291f;--warn:#e3a844;--warn-soft:#2c2313;--fail:#ff8f84;--fail-soft:#2e1917}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:60rem;margin:0 auto;padding:3.5rem 1.5rem 6rem}
.mast{border-bottom:2px solid var(--ink);padding-bottom:1.5rem;display:flex;flex-direction:column;gap:1rem}
.eyebrow{font-family:var(--mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(2rem,5vw,3rem);line-height:1.1;margin:0;text-wrap:balance;letter-spacing:-.015em}
.standfirst{font-size:1.075rem;color:var(--muted);max-width:52ch;margin:0}
.runline{display:flex;flex-wrap:wrap;gap:.4rem 1.25rem;font-family:var(--mono);font-size:.76rem;color:var(--faint)}
.runline b{color:var(--ink);font-weight:600}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:2.5rem 0 0}
.tile{background:var(--surface);padding:1.1rem 1.15rem;display:flex;flex-direction:column;gap:.45rem}
.tile .k{font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.tile .v{font-family:var(--serif);font-size:1.85rem;line-height:1;font-variant-numeric:tabular-nums}
.tile .n{font-size:.82rem;color:var(--muted);line-height:1.4}
.v.ok{color:var(--pass)}.v.bad{color:var(--fail)}.v.mid{color:var(--warn)}
section{margin-top:3.5rem}
h2{font-family:var(--serif);font-size:1.6rem;font-weight:600;margin:0 0 .35rem;letter-spacing:-.01em;display:flex;align-items:baseline;gap:.7rem;text-wrap:balance}
h2 .num{font-family:var(--mono);font-size:.78rem;color:var(--accent);letter-spacing:.08em}
h3{font-size:.95rem;font-weight:650;margin:2rem 0 .6rem}
.lede{color:var(--muted);margin:0 0 1.5rem;max-width:62ch}
p{max-width:66ch}
.find{border:1px solid var(--line);border-left:3px solid var(--line-strong);background:var(--surface);padding:1rem 1.15rem;display:flex;flex-direction:column;gap:.55rem}
.find+.find{margin-top:.6rem}
.find.dead{border-left-color:var(--fail)}.find.watch{border-left-color:var(--warn)}.find.good{border-left-color:var(--pass)}
.find-head{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem}
.find-title{font-weight:640;font-size:.97rem}
.chip{font-family:var(--mono);font-size:.67rem;letter-spacing:.07em;text-transform:uppercase;padding:.18rem .48rem;border-radius:2px;white-space:nowrap;font-weight:600}
.chip.dead{background:var(--fail-soft);color:var(--fail)}.chip.watch{background:var(--warn-soft);color:var(--warn)}
.chip.good{background:var(--pass-soft);color:var(--pass)}.chip.info{background:var(--accent-soft);color:var(--accent)}
.find p{margin:0;font-size:.9rem;color:var(--muted)}
.find .next{font-size:.85rem;padding-top:.15rem}
.find .next b{color:var(--ink)}
.ev{font-family:var(--mono);font-size:.75rem;color:var(--faint);display:block;margin-top:.2rem}
code{font-family:var(--mono);font-size:.8rem}
.scroll{overflow-x:auto;border:1px solid var(--line);background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:.86rem;min-width:34rem}
th,td{text-align:left;padding:.6rem .8rem;border-bottom:1px solid var(--line);vertical-align:top}
thead th{font-family:var(--mono);font-size:.68rem;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);font-weight:600;background:var(--surface-2);white-space:nowrap}
tbody tr:last-child td{border-bottom:0}
td.num{font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap}
td.r{font-family:var(--mono);font-size:.8rem;word-break:break-all}
.note{background:var(--surface-2);border:1px solid var(--line);padding:1rem 1.15rem;font-size:.89rem}
.note p{margin:0;color:var(--muted)}.note p+p{margin-top:.6rem}
.empty{color:var(--muted);font-style:italic}
footer{margin-top:4rem;padding-top:1.25rem;border-top:1px solid var(--line);font-family:var(--mono);font-size:.74rem;color:var(--faint)}
a{color:var(--accent);text-underline-offset:2px}
a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
</style>

<div class="wrap">
<header class="mast">
  <div class="eyebrow">Living ledger · nritousa.com</div>
  <h1>Content ledger</h1>
  <p class="standfirst">What is verified, what is rotting, and what still needs writing. Regenerated from the build and the audit scripts — only the backlog judgements are stored by hand.</p>
  <div class="runline">
    <span>generated <b>${today}</b></span>
    <span><b>${meta.indexable}</b> indexable pages</span>
    <span><b>${open.length}</b> open items</span>
    <span><b>${done.length}</b> resolved</span>
  </div>
</header>

<div class="tiles">
  <div class="tile"><div class="k">Metadata</div><div class="v ${seo && seo.errors === 0 ? "ok" : "bad"}">${seo ? `${seo.errors} err` : "n/a"}</div><div class="n">${seo ? `${seo.warnings} warnings across ${seo.pageCount} rendered pages.` : "Run <code>npm run seo:audit</code>."}</div></div>
  <div class="tile"><div class="k">Outbound links</div><div class="v ${linkTile.cls}">${linkTile.v}</div><div class="n">${linkTile.n}</div></div>
  <div class="tile"><div class="k">Tracked numbers</div><div class="v ${nums.stale === 0 && nums.drift === 0 ? "ok" : "mid"}">${nums.stale + nums.drift === 0 ? "current" : `${nums.stale + nums.drift} flagged`}</div><div class="n">${nums.tracked} values · ${nums.stale} stale · ${nums.drift} drifted${nums.atCliff ? ` · ${nums.atCliff} at the ${nums.staleDays}-day cliff` : ""}.</div></div>
  <div class="tile"><div class="k">Fast Answer gap</div><div class="v ${intent.incompleteHigh === 0 ? "ok" : "mid"}">${intent.incompleteHigh}</div><div class="n">High-intent pages missing a Fast Answer block, source link or verified stamp.</div></div>
</div>

<section>
  <h2><span class="num">01</span> Open work</h2>
  <p class="lede">Ranked by severity. Each item carries the command that re-checks it, so nothing here has to be taken on trust.</p>
  ${renderItems(open)}
</section>

<section>
  <h2><span class="num">02</span> Content coverage</h2>
  <p class="lede">${intent.matching} of ${intent.scanned} routes answer a question with a number in it. Those are the pages where a missing stamp or citation actually costs trust — ${intent.high} are High priority, and ${intent.incompleteHigh} of those are still missing at least one affordance.</p>
  <div class="scroll">
    <table>
      <thead><tr><th>Page</th><th>Gaps</th></tr></thead>
      <tbody>
        ${intent.worst.map((w) => `<tr><td class="r">${esc(w.page)}</td><td class="num">${w.missing} of 6</td></tr>`).join("\n        ")}
      </tbody>
    </table>
  </div>
  <p class="lede" style="margin-top:.9rem;font-size:.85rem">Columns checked: Fast Answer block · numeric estimate · last-verified stamp · official source · FAQ schema · Article dateModified. Full table from <code>npm run audit:intent-numbers</code>.</p>
</section>

<section>
  <h2><span class="num">03</span> Metadata health</h2>
  <p class="lede">The <code>seo:audit</code> rules cover presence and uniqueness. These are the dimensions they do not: how much of each tag actually survives to the SERP.</p>
  <div class="scroll">
    <table>
      <thead><tr><th>Tag</th><th>Median</th><th>Max</th><th>Over limit</th></tr></thead>
      <tbody>
        <tr><td>Title</td><td class="num">${meta.titleMedian}</td><td class="num">${meta.titleMax}</td><td class="num">${meta.titleOver60} &gt;60 · ${meta.titleOver80} &gt;80</td></tr>
        <tr><td>Description</td><td class="num">${meta.descMedian}</td><td class="num">${meta.descMax}</td><td class="num">${meta.descOver160} &gt;160 · ${meta.descOver200} &gt;200</td></tr>
        <tr><td>Missing og:image</td><td class="num">${meta.missingOgImage}</td><td class="num">—</td><td class="num">${meta.missingOgImage === 0 ? "full coverage" : "gap"}</td></tr>
        <tr><td>Missing twitter:card</td><td class="num">${meta.missingTwCard}</td><td class="num">—</td><td class="num">${meta.missingTwCard === 0 ? "full coverage" : "gap"}</td></tr>
        <tr><td>Doubled brand suffix</td><td class="num">${meta.doubledBrand.length}</td><td class="num">—</td><td class="num">${meta.doubledBrand.length === 0 ? "clean" : esc(meta.doubledBrand.join(", "))}</td></tr>
      </tbody>
    </table>
  </div>
  ${meta.worstTitles.length ? `<h3>Longest titles</h3><div class="scroll"><table><thead><tr><th>Chars</th><th>Page</th></tr></thead><tbody>${meta.worstTitles.map((w) => `<tr><td class="num">${w.titleLen}</td><td class="r">${esc(w.route)}</td></tr>`).join("")}</tbody></table></div>` : ""}
</section>

<section>
  <h2><span class="num">04</span> Outbound citations</h2>
  ${links
    ? `<p class="lede">Last checked ${links.generatedAt}. ${links.counts.checked} distinct off-site URLs in the rendered build.</p>
  <div class="scroll">
    <table>
      <thead><tr><th>State</th><th>Count</th><th>Meaning</th></tr></thead>
      <tbody>
        <tr><td>ok</td><td class="num">${links.counts.ok}</td><td>Resolves and is not a not-found page.</td></tr>
        <tr><td>dead</td><td class="num">${links.counts.dead}</td><td>Confirmed gone — 404, or a 200 that lands on a not-found document.</td></tr>
        <tr><td>redirected</td><td class="num">${links.counts.redirected}</td><td>Still resolves, but the cited URL has moved. Cosmetic normalisation is excluded.</td></tr>
        <tr><td>unverifiable</td><td class="num">${links.counts.unverifiable}</td><td>Host blocks automated requests. Not a failure — but only a human can confirm these.</td></tr>
        <tr><td>unreachable</td><td class="num">${links.counts.unreachable}</td><td>Network or DNS failure. Usually transient; re-run before acting.</td></tr>
        <tr><td>forbidden</td><td class="num">${links.counts.forbidden}</td><td>403 from a host not yet on the known-blocked list.</td></tr>
      </tbody>
    </table>
  </div>
  ${links.counts.dead ? `<h3>Dead</h3>${links.dead.map((d) => `<div class="find dead"><div class="find-head"><span class="chip dead">${d.status}</span><span class="find-title">${esc(d.url)}</span><span class="chip info">${d.pages.length} page${d.pages.length === 1 ? "" : "s"}</span></div><p>${esc(d.title || "")}</p></div>`).join("")}` : `<div class="note"><p><b>No dead citations.</b> Every outbound link that can be checked automatically resolves to a real page.</p></div>`}`
    : `<div class="note"><p>Link health has not been run against this build. <code>npm run ledger:links</code> (takes a few minutes — it probes every outbound URL).</p></div>`}
</section>

<section>
  <h2><span class="num">05</span> Resolved</h2>
  <p class="lede">Kept, not deleted — the log is the record of what changed and when.</p>
  ${renderItems(done)}
</section>

<section>
  <h2><span class="num">06</span> Refreshing this ledger</h2>
  <div class="note">
    <p><code>npm run build</code> → <code>npm run seo:audit</code> → <code>npm run ledger:links</code> → <code>npm run ledger</code></p>
    <p>The backlog in section 01 lives in <code>data/content-ledger.json</code> — that is the only part written by hand. Everything else is recomputed from the build output and the audit scripts on each run, so the ledger cannot silently go out of date. Add an item when an audit surfaces work; set <code>status</code> to <code>done</code> with a <code>resolved</code> date when it ships.</p>
  </div>
</section>

<footer>Generated ${today} from the production build · nritousa.com · sources: USCIS Form G-1055, DOL FLAG, IRS.gov, U.S. Census Bureau, Dept. of State Visa Bulletin</footer>
</div>
`;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, html);

  console.log(`\n═══ Content Ledger ═══`);
  console.log(`Open items      ${open.length}   (${open.filter((i) => i.severity === "high").length} high)`);
  console.log(`Resolved        ${done.length}`);
  console.log(`Indexable pages ${meta.indexable}`);
  console.log(`SEO findings    ${seo ? `${seo.errors} errors · ${seo.warnings} warnings` : "not run"}`);
  console.log(`Outbound links  ${links ? `${links.counts.dead} dead of ${links.counts.checked}` : "not run"}`);
  console.log(`Numbers         ${nums.stale} stale · ${nums.drift} drifted · ${nums.atCliff} at the ${nums.staleDays}-day cliff`);
  console.log(`Fast Answer gap ${intent.incompleteHigh} high-intent pages`);
  console.log(`\nWrote ${relative(ROOT, OUT_FILE)}\n`);
}

main();
