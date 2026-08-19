#!/usr/bin/env node
/*
 * Outbound-citation health check for NRITOUSA.com.
 *
 * Why this exists: scripts/check-links.js validates INTERNAL routes only — it
 * explicitly skips http(s) URLs. That left the outbound government/IRS/Census
 * citations, which are the whole basis of this site's authority, unverified.
 * The first run of this script (2026-08-18) found 10 dead ones across 46 pages.
 *
 * Read-only: reads the production build output, makes GET/HEAD requests to
 * third-party hosts, and writes scripts/audit/link-health.json. Never touches
 * git or the source tree.
 *
 * Requires a prior `next build` (reads .next/server/app/ ** /*.html), because
 * only the rendered HTML shows the links a reader actually receives.
 *
 * ── Why a status code alone is not enough ────────────────────────────────────
 * Most .gov hosts answer 403 to anything without a browser fingerprint, so a
 * naive checker reports dozens of false positives. Conversely CMS.gov serves a
 * *200-looking* shell for a missing page. So the classifier does two things a
 * status check does not: it treats known bot-blocking hosts as UNVERIFIABLE
 * rather than dead, and it confirms every suspected 404 by re-fetching and
 * looking for a not-found signature in the <title>.
 *
 * Usage: node scripts/audit/link-health.js [--json]
 */

const { readFileSync, readdirSync, statSync, writeFileSync, existsSync } = require("node:fs");
const { join, relative, sep } = require("node:path");

const ROOT = join(__dirname, "..", "..");
const APP_OUT = join(ROOT, ".next", "server", "app");
const OUT_FILE = join(__dirname, "link-health.json");

/**
 * Hosts that reject automated requests outright (403 to anything without a
 * browser fingerprint). A failure here is NOT evidence of a dead link — these
 * can only be confirmed by hand. Keep in sync with CLAUDE.md and
 * scripts/audit-monthly-numbers.ts.
 */
const BOT_BLOCKED_HOSTS = [
  "uscis.gov",
  "egov.uscis.gov",
  "travel.state.gov",
  "ceac.state.gov",
  "vfsglobal.com",
  "visa.vfsglobal.com",
  "finra.org",
  "congress.gov",
  "migrationpolicy.org",
  "nycourts.gov",
  "dos.ny.gov",
  "linkedin.com",
  "incometaxindia.gov.in",
  "trumpaccounts.gov",
  "scholarships.com",
];

/** <title> signatures that mean "this page is gone" even behind a 200/404. */
const NOT_FOUND_TITLE = /(page not found|404|page cannot be found|document not found|not found)/i;

/**
 * Redirect targets that mean the citation is gone even though the chain ended
 * in a 200. uscode.house.gov answers 200 and quietly lands on docnotfound.xhtml
 * for a granuleid it no longer recognises — the 8 USC 1305 citation sat broken
 * behind a 200 until this pattern was added.
 */
const SOFT_404_TARGET = /(docnotfound|notfound|not-found|\/404|pagenotfound|error\.aspx)/i;

/** A deep path that redirects to the bare origin root has lost its content. */
function droppedToRoot(from, to) {
  try {
    const a = new URL(from);
    const b = new URL(to);
    const deep = a.pathname.replace(/\/+$/, "").length > 1 || !!a.search;
    const root = b.pathname.replace(/\/+$/, "") === "" && !b.search;
    return deep && root && a.host.replace(/^www\./, "") === b.host.replace(/^www\./, "");
  } catch {
    return false;
  }
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const CONCURRENCY = 8;
const TIMEOUT_MS = 25_000;

const isBotBlocked = (url) => {
  try {
    const h = new URL(url).host.replace(/^www\./, "");
    return BOT_BLOCKED_HOSTS.some((b) => h === b || h.endsWith("." + b));
  } catch {
    return false;
  }
};

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const toRoute = (file) => {
  const rel = relative(APP_OUT, file).replace(/\.html$/, "");
  const parts = rel.split(sep);
  return parts.length === 1 && parts[0] === "index" ? "/" : "/" + parts.join("/");
};

/** Collect every distinct off-site href in the rendered build, with its pages. */
function collectExternalLinks() {
  const map = new Map();
  for (const file of walkHtml(APP_OUT)) {
    const html = readFileSync(file, "utf8");
    const route = toRoute(file);
    for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
      const url = m[1].replace(/&amp;/g, "&");
      if (/nritousa\.com/.test(url)) continue;
      if (!map.has(url)) map.set(url, new Set());
      map.get(url).add(route);
    }
  }
  return [...map]
    .map(([url, pages]) => ({ url, pages: [...pages].sort() }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

async function request(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": UA,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    const body = method === "GET" ? await res.text().catch(() => "") : "";
    return { status: res.status, finalUrl: res.url, body };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * HEAD first (cheap), fall back to GET when the server dislikes HEAD. Any
 * suspected failure is re-fetched with GET so the <title> can be inspected —
 * that is what separates real rot from a bot block or a transient blip.
 */
async function probe(url) {
  let last = null;
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await request(url, method);
      last = r;
      if (method === "HEAD" && [403, 405, 501, 404].includes(r.status)) continue;
      break;
    } catch (err) {
      last = { status: 0, error: err?.name === "AbortError" ? "timeout" : String(err?.cause?.code || err?.name || err?.message).slice(0, 40) };
      if (method === "GET") break;
    }
  }

  const { status = 0, finalUrl, body = "", error } = last || {};
  const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ").slice(0, 120) : null;
  const blocked = isBotBlocked(url);

  let state;
  if (status >= 200 && status < 300) {
    // A 200 is not proof the citation survived: CMS.gov serves a shell for
    // missing pages, and uscode.house.gov redirects into a not-found document.
    const softDead =
      (title && NOT_FOUND_TITLE.test(title)) ||
      (finalUrl && SOFT_404_TARGET.test(finalUrl)) ||
      (finalUrl && droppedToRoot(url, finalUrl));
    // A bot-blocking host can bounce a deep link to its own root instead of
    // answering 403 (incometaxindia.gov.in does). That is indistinguishable
    // from real rot from out here, so say so rather than crying wolf.
    state = softDead ? (blocked ? "unverifiable" : "dead") : "ok";
  } else if (status === 404 || status === 410) {
    state = "dead";
  } else if (status === 403 || status === 999) {
    state = blocked ? "unverifiable" : "forbidden";
  } else if (status === 0) {
    state = "unreachable";
  } else {
    state = "error";
  }

  // Only report redirects that actually move the citation. Protocol, www and
  // trailing-slash normalisation accounted for 76 of the first run's 107 hits —
  // pure noise that would bury the ~30 real relocations.
  const canon = (u) =>
    u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "").toLowerCase();
  const redirected = state === "ok" && !!finalUrl && canon(finalUrl) !== canon(url);

  return { status, state, title, error, finalUrl: redirected ? finalUrl : undefined, redirected: redirected || undefined };
}

async function main() {
  if (!existsSync(APP_OUT)) {
    console.error("No build output at .next/server/app — run `npm run build` first.");
    process.exit(2);
  }

  const links = collectExternalLinks();
  const results = [];
  let cursor = 0;

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (cursor < links.length) {
        const item = links[cursor++];
        const verdict = await probe(item.url);
        results.push({ ...item, ...verdict });
        if (results.length % 50 === 0) {
          process.stderr.write(`  …${results.length}/${links.length}\n`);
        }
      }
    }),
  );

  results.sort((a, b) => a.url.localeCompare(b.url));
  const by = (s) => results.filter((r) => r.state === s);
  const dead = by("dead");
  const unreachable = by("unreachable");
  const forbidden = by("forbidden");
  const redirects = results.filter((r) => r.redirected);

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    note: "Outbound citation health. 'unverifiable' = host blocks automated requests (see BOT_BLOCKED_HOSTS); those must be checked by hand and are NOT failures.",
    counts: {
      checked: results.length,
      ok: by("ok").length,
      dead: dead.length,
      unreachable: unreachable.length,
      forbidden: forbidden.length,
      unverifiable: by("unverifiable").length,
      redirected: redirects.length,
    },
    dead: dead.map((r) => ({ url: r.url, status: r.status, title: r.title, pages: r.pages })),
    unreachable: unreachable.map((r) => ({ url: r.url, error: r.error, pages: r.pages })),
    forbidden: forbidden.map((r) => ({ url: r.url, status: r.status, pages: r.pages })),
    redirects: redirects.map((r) => ({ url: r.url, finalUrl: r.finalUrl, pages: r.pages })),
  };

  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2) + "\n");

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const c = report.counts;
  console.log(`\n═══ Outbound Link Health ═══`);
  console.log(`Checked ${c.checked} external URLs across the rendered build.\n`);
  console.log(`  ok            ${c.ok}`);
  console.log(`  dead          ${c.dead}`);
  console.log(`  unreachable   ${c.unreachable}   (network/DNS — often transient, re-run before acting)`);
  console.log(`  forbidden     ${c.forbidden}   (403 from a host not on the known-blocked list)`);
  console.log(`  unverifiable  ${c.unverifiable}   (known bot-blocking host — check by hand)`);
  console.log(`  redirected    ${c.redirected}   (still resolves, but the cited URL is outdated)`);

  if (dead.length) {
    console.log(`\n── Dead (confirmed) ──`);
    for (const d of dead) {
      console.log(`  ${d.status}  ${d.url}`);
      console.log(`       ${d.title ? `"${d.title}"  ·  ` : ""}${d.pages.length} page(s)`);
    }
  }
  if (unreachable.length) {
    console.log(`\n── Unreachable (re-run to confirm) ──`);
    for (const u of unreachable) console.log(`  ${u.error}  ${u.url}`);
  }

  console.log(`\nWrote ${relative(ROOT, OUT_FILE)}`);
  if (dead.length) {
    console.log(`\n✗ ${dead.length} dead citation(s).\n`);
    process.exit(1);
  }
  console.log(`\n✅ No dead outbound citations.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
