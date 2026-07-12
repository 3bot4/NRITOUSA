# NRITOUSA.COM — Site-Wide Audit Report

> **Scope:** Local, read-only static audit of the working tree at `/Users/middha/Desktop/NRITOUSA.COM`.
> **Guarantees:** No `git push` / `pull`, no Vercel deploy, no Brevo/Cloudflare/DB/env writes, no file deletions, no code changes. Secrets are referenced by **variable name only** — no values printed.
> **Date:** 2026-07-09 · **Branch:** `main` (3 commits ahead of `origin/main`) · **Framework:** Next.js 14.2.35 (App Router)
> **Verification run:** `tsc --noEmit` → **PASSED (exit 0)**. `next build` intentionally not run (known local Satori/OG hang; Vercel is the build gate).

---

## A. Executive Summary

The site is large, mature, and architecturally healthy: **172 `page.tsx` routes**, 8 API routes, a split sitemap (index + 5 segment sitemaps), a centralized SEO metadata builder, systematic JSON-LD, and a well-secured server-side Brevo email layer. A machine-generated audit already lives at `docs/sitewide-audit-nritousa.md`, and **the three recent commits on `main` have already fixed most of its P0/P1 items** (broken FCNR links, `/partnerships` sitemap gap, root OG-image crawl, MoneyHub + `/about` JSON-LD).

This report supersedes that one where the working tree has moved on, and adds coverage the older audit predates: the **exposed GitHub token**, the new **H-1B Lottery cluster**, the **Return-to-India Playbook lead magnet**, the **global site search**, and **API rate-limiting / repo-hygiene** gaps.

**Overall health: Good.** One **critical security item** (leaked PAT) needs immediate rotation; everything else is polish, hygiene, and indexing consistency. Nothing here requires an emergency deploy.

**Headline numbers**
| Metric | Value |
|---|---|
| `page.tsx` routes | 172 |
| API routes | 8 (`contribute`, `newsletter`, `lead-magnet`, `lead-magnet/return-to-india-playbook`, `poll`, `roles`, `sponsors`, `data-status`) |
| Sitemaps | 1 index + 5 segments (pages/tools/articles/tax/immigration) |
| Typecheck | **PASS** (exit 0) |
| Orphan pages (0 incoming links) | 0 |
| Broken internal links | 0 (prior 2 fixed in working tree) |
| Hardcoded secrets in `src`/`public`/`scripts` | 0 |
| Exposed secret in repo config | **1 — GitHub PAT in `.git/config` remote URL** |
| Lead-magnet PDFs valid | 2/2 (`free-immigrant-wealth-guide.pdf` 1.2 MB, `The_Ultimate_Return_to_India_Playbook_2026.pdf` 143 KB, valid `%PDF-1.4`) |
| ESLint config | **None** |

---

## B. Critical Issues

### B1. Exposed GitHub Personal Access Token (rotate now)
`git remote -v` shows the `origin` URL with an embedded classic PAT:
```
origin  https://ghp_****************@github.com/3bot4/NRITOUSA.git
```
This token grants push access to the repo. It lives in `.git/config` and is trivially exposed by any screen-share, `git remote -v`, shell history, or backup. **This is the only critical finding.**

- **Impact:** Full write access to the production source repository if leaked.
- **Action (do NOT do automatically — user decision):** Revoke the token at GitHub → Settings → Developer settings → Tokens, generate a new one (or switch to SSH / a credential helper), and re-set the remote with `git remote set-url`. Verify the token was never committed into tracked files (confirmed: `git ls-files` shows no token; it is only in local `.git/config`).

> Note: `.env.local` holds `BREVO_API_KEY` and is correctly git-ignored (`.env*.local`) and vercel-ignored implicitly. No secret values are printed in this report.

---

## C. High-Priority Fixes

| # | Issue | Location | Why it matters | Recommendation |
|---|---|---|---|---|
| C1 | **New pages missing from sitemap** | `src/lib/sitemap-data.ts` | `/affiliate-disclosure` and `/return-to-india-checklist` are live, indexable (`pageMetadata`), but absent from the sitemap → slower discovery of the new lead-magnet landing page | Add `e("/affiliate-disclosure", 0.3, "yearly")` to `pagesEntries` and `e("/return-to-india-checklist", 0.8, "monthly")` to `taxEntries` (or `pagesEntries`) |
| C2 | **No rate-limiting on any API route** | all `src/app/api/*/route.ts` | Brevo contact/email endpoints accept unlimited POSTs. Honeypot blocks naive bots, but a targeted actor can burn Brevo send quota / pollute lists | Add lightweight IP throttling (e.g. Upstash ratelimit, or an in-memory token bucket per instance) to `newsletter`, `lead-magnet`, `lead-magnet/return-to-india-playbook`, `contribute`, `poll` |
| C3 | **Large uncommitted delta vs. git** | working tree | 28 modified + ~30 untracked files (entire H-1B Lottery cluster, Return-to-India lead magnet, GlobalSearch, MostUsedTools, affiliate-disclosure) are **uncommitted**; `origin/main` is 3 commits behind local `main`. Git is not a reliable record of what is live | Commit the new work in logical groups before the next deploy; confirm on Vercel which of these are already in production (deploys are done from the working tree per project convention, so live may be ahead of git) |
| C4 | **Titles/descriptions still exceed SERP limits** | many routes (see H) | The `fix: trim high priority seo metadata` commit trimmed the worst offenders, but the mid-tier (~30–40 pages) likely remain >60-char titles / >155-char descriptions → truncated snippets | Re-run `node scripts/audit/metadata.js` and trim the remaining set |

---

## D. Medium-Priority Fixes

| # | Issue | Location | Recommendation |
|---|---|---|---|
| D1 | **No ESLint config** | repo root | `next lint` cannot run non-interactively; lint is unenforced in CI. Add `.eslintrc.json` → `{ "extends": "next/core-web-vitals" }` |
| D2 | **`public/.DS_Store` is served** | `public/.DS_Store` (8 KB) | Publicly reachable at `/.DS_Store`. Add `.DS_Store` to `.vercelignore` and remove from `public/` |
| D3 | **Author pages: index/sitemap mismatch** | `src/app/author/[slug]`, sitemap | Author pages are indexable but excluded from the sitemap. Pick one signal: add to sitemap OR `robots:{index:false}` |
| D4 | **State-population spokes under-linked** | `/indian-population-in-*` (11 pages) | Each has only the pillar link. Add a state-to-state nav block + contextual links from immigration content |
| D5 | **12 tools/calcs not on the hub content system** | see `docs/sitewide-audit-nritousa.md` §Thin | All ship a FAQ, but lack intro/deep-dive. Continue the `ToolHub`/`CalculatorHub` rollout (per `toolfirst-layout-rollout` / `tool-hub-content` memory) |

---

## E. Low-Priority Cleanup

| # | Item | Note |
|---|---|---|
| E1 | `git-installer.dmg` (25 MB) in repo root | git-ignored (`*.dmg`) and vercel-ignored — safe, but delete to declutter |
| E2 | `.git-corrupt-bak/` (16 KB) | Leftover from a prior `.git` corruption (see `nritousa-local-build-unreliable` memory); git-ignored. Delete when confident it's not needed |
| E3 | Root `.DS_Store`, `tsconfig.tsbuildinfo` | git-ignored; harmless clutter |
| E4 | Stale root audit files | `AUDIT_REPORT.md`, `audit-report.www.nritousa.com.md`, `broken_links.csv`, `seo-indexing-audit.md`, `audit.js`, `website-audit.sh` — superseded by `scripts/audit/*` and this report; consider archiving under `docs/` |

---

## F. Sitemap Recommendations

**Current state (healthy):** `src/lib/sitemap-data.ts` is a single source of truth feeding a sitemap index + 5 segment sitemaps (`/sitemap.xml` → pages/tools/articles/tax/immigration). Every entry is a 200, self-canonical URL. Redirect routes, noindex funnel steps, API routes, and author pages are deliberately excluded and documented. XML is valid, uses `lastmod`/`changefreq`/`priority`, and is referenced from `robots.ts`. Not blocked by robots.

**Add (missing indexable pages):**
- `/affiliate-disclosure` → `pagesEntries`, priority 0.3, yearly
- `/return-to-india-checklist` → `taxEntries` (lead-magnet landing), priority 0.8, monthly

**Verify (deploy-coupling):** The sitemap already lists the new H-1B Lottery cluster and Trump Account pages that are still **untracked** locally. That is correct *only if* they deploy in the same release. Confirm the pages and the sitemap ship together, or Google will hit 404s in the sitemap.

**Consider:** Author pages — either include (with `ProfilePage` schema they already emit) or noindex (see D3).

No low-value/duplicate URLs need removal — the exclusion logic is already disciplined.

---

## G. Robots.txt Recommendations

`src/app/robots.ts` is correct and current:
- Allows `/` (everything indexable).
- Disallows `/api/` and **all** OG-image variants including the root (`/opengraph-image`, `/opengraph-image?*`, `/*/opengraph-image`, `/*/opengraph-image?*`) — the prior "root OG crawlable" P0 is **fixed**.
- Declares the sitemap URL.

**No changes required.** (Optional: once author pages are decided, no robots change is needed — they're handled via per-page `robots` metadata.)

---

## H. SEO Metadata Issues

Centralization is excellent: `pageMetadata()` in `src/lib/seo.ts` guarantees a complete canonical + Open Graph + Twitter set with a default OG image on every route. Root layout sets `metadataBase`, self-referencing canonical, and site-wide robots directives. **No missing-canonical, partial-OG, or duplicate-title/description issues.** `noindex` is correctly applied to `/nri-wealth-checkup/{income,assets,dashboard,profile,report}` and the H-1B-sponsors not-found state.

**Remaining issue — length only** (many partially trimmed by the last commit; re-audit for the current set):

| URL/path | Current issue | Severity | Recommendation | Likely impact |
|---|---|---|---|---|
| ~30–40 routes (e.g. `/visa-bulletin`, `/oci`, several `/trump-account-*`, `/india-*-visa-*`) | Title > ~60 chars incl. ` \| NRI to USA` suffix | Medium | Trim to ≤57 pre-suffix or drop suffix on long titles | Truncated SERP titles → lower CTR |
| ~20–30 routes (e.g. `/oci`, `/`, `/free-immigrant-wealth-guide`, `/trump-account-*`) | Meta description > 155–165 chars | Medium | Trim, front-load the answer | Truncated descriptions |
| `/affiliate-disclosure`, `/return-to-india-checklist` | New; not in sitemap (metadata itself is fine) | High (C1) | Add to sitemap | Slower indexing |
| Author `/author/[slug]` | Indexable but not in sitemap | Low | Decide index vs noindex | Mixed signal |

Run `node scripts/audit/metadata.js` for the exact current offender list (the older `metadata-data.json` predates the trim commit).

---

## I. Internal Linking & Content Cluster Map

**Interlinking is systematic and healthy — 0 orphans.** Cluster children render through shared components that emit hub breadcrumbs + back-links; the Trump Account cluster cross-links siblings; state spokes link the pillar. **Global site search now indexes everything** (see §Search), which materially improves discovery.

**Clusters present (existing / status):**
| Cluster | Pillar | Supporting pages | Status |
|---|---|---|---|
| H-1B & immigration | `/h1b`, `/immigration`, `/uscis` | H-1B child cluster + **new H-1B Lottery cluster** (`/h1b-lottery-*`, 12 pages incl. odds calculator) | Strong; lottery cluster new & uncommitted |
| Trump Account | `/trump-account-h1b-immigrant-families` | 9 sibling pages + Form 4547 apply + eligibility checker + millionaire calculator | Strong (per `trump-account-cluster` memory) |
| Return to India | `/return-to-india` | `/return-to-india-checklist` (new), 401k calcs, RNOR, repatriation cluster + **Playbook PDF lead magnet** | Strong; new checklist page needs sitemap |
| FBAR/FATCA & India tax | `/india-tax-compliance` | FBAR/FATCA checker, ITR/TDS/gifts clusters, `nri-tax-forms-limits` | Strong |
| NRE/NRO & banking | `/send-money-to-india`, FCNR calc | NRE/NRO articles, FCNR vs HYSA | Adequate — could use a banking pillar |
| NRI/immigrant wealth | `/long-term-nri-wealth`, `/nri-wealth-checkup` | estate planning, India property, wealth guide PDF | Strong |
| DIY tax compliance | `/tools/nri-tax-filing-roadmap`, TDS refund checklist, Form 10F/15CA-CB/3520 tools | — | Present but scattered; candidate for a "DIY NRI tax filing" pillar |
| Calculators & checklists | `/calculators`, `/tools` | large catalog | Strong |

**Under-linked (opportunities):** the 11 state-population spokes (1 incoming each), `/resources` (2), `/education/grade-finder` (1), `/tools/flight-price-guide` & `/tools/h1b-sponsor-finder` (2 each).

**Lead-magnet placement:** `ReturnToIndiaLeadMagnetCard` is placed on 7 high-intent pages (fbar-fatca-checker, nri-tax-filing-roadmap, oci, calculators/[slug], long-term-nri-wealth, india-tax-compliance, return-to-india-checklist). The Immigrant Wealth Guide (`/free-immigrant-wealth-guide`) is in the homepage `LeadMagnetSpotlight` and search. **Recommendation:** add the Return-to-India card to `/return-to-india` hub and 401k/RNOR calculators; add the FBAR/FATCA DIY checklist as a distinct capture where it isn't yet.

---

## J. Brevo / Email-Capture Audit

**Verdict: well-implemented and secure.** All Brevo calls are **server-side only** (`runtime = "nodejs"`), key read from `process.env.BREVO_API_KEY`, never exposed client-side.

| Endpoint | Purpose | List/ID logic | Protections |
|---|---|---|---|
| `/api/newsletter` | Newsletter signup | `BREVO_NEWSLETTER_LIST_ID` (default 5); optional tracker list | honeypot, email regex, duplicate→success, error handling |
| `/api/lead-magnet` | Immigrant Wealth Guide PDF | `BREVO_NEWSLETTER_LIST_ID` + optional `BREVO_LEAD_MAGNET_LIST_ID` | honeypot, validation, PDF path only returned on success |
| `/api/lead-magnet/return-to-india-playbook` | Playbook PDF + transactional email | `BREVO_RETURN_TO_INDIA_LIST_ID` (default 23) + newsletter list; sends PDF email via `smtp/email` | honeypot, validation, `escapeHtml` on email body, non-fatal email, PDF path gated |
| `/api/contribute` | Contributor form → email to inbox | `CONTRIBUTE_EMAIL_TO/FROM` | honeypot, full validation, `escapeHtml`, reply-to = submitter |
| `/api/poll` | Anonymous life-decision poll | Brevo digest email; explicitly rejects PII identifiers | honeypot, allow-list of concerns |

**Strengths:** consistent honeypot (`company` field), email regex validation, HTML escaping on all user-rendered email content, graceful duplicate handling (`duplicate_parameter` → success), no secret ever sent to client, PDF links never revealed pre-submission, correct multi-brand list segmentation (does not dump into generic newsletter by default).

**Gaps:**
- **No rate limiting** (C2) — the main open item.
- **No explicit consent checkbox** on newsletter/lead-magnet forms (contribute has `agree`); consider a short consent line for GDPR/CAN-SPAM hygiene.
- `poll` route has `TODO` for IP rate-limit + Supabase — currently email-only.
- No secrets exposed; no API key committed; `.env.local.example` documents every var with placeholder values only.

---

## K. Lead-Magnet Audit

| Magnet | PDF | Route/component | Flow | Status |
|---|---|---|---|---|
| **Ultimate Return-to-India Playbook 2026** | `public/The_Ultimate_Return_to_India_Playbook_2026.pdf` — **valid, 143 KB, `%PDF-1.4`** | `ReturnToIndiaLeadMagnetCard` → `/api/lead-magnet/return-to-india-playbook` | email → Brevo upsert (list 23) → transactional email with PDF link → reveal download | Working. PDF is **untracked** in git (commit before deploy). Placed on 7 pages |
| **Free Immigrant Wealth Guide** | `public/free-immigrant-wealth-guide.pdf` — valid, 1.2 MB | `/free-immigrant-wealth-guide` → `/api/lead-magnet` | email+firstName → Brevo → reveal PDF | Working |
| **Return-to-India Checklist (PDF)** | Uses same Playbook PDF via the card | `/return-to-india-checklist` page | same as Playbook | Working; **page missing from sitemap** (C1) |

- Email collected **before** download on all three (PDF path gated server-side). ✅
- Thank-you/reveal state handled client-side in the card components. ✅
- Consent/privacy: PDF email includes an "educational only, not advice" disclaimer footer; on-page consent line could be added (see J).
- **Note:** the earlier transient `du` reading of "0 B" for the Playbook PDF was a filesystem/iCloud artifact — the file is a real, materialized 143 KB PDF (verified magic bytes + 288 disk blocks). **No broken-PDF issue.**

---

## L. Git / Live-Site Matching Observations

- **Branch:** `main`, **3 commits ahead of `origin/main`** (not pushed): `85ed0df fix: trim high priority seo metadata`, `3792afb fix: repair broken links robots and sitemap audit issues`, `aba9462 Improve Form 4547 apply page`.
- **Working tree:** 28 modified + ~30 untracked files — a substantial feature set (H-1B Lottery cluster, Return-to-India lead magnet + PDF, GlobalSearch, MostUsedTools, affiliate-disclosure, e-OCI card, Trump generational-wealth + tax-planning pages).
- **`.env.local`** correctly ignored; **no `.env` tracked** (only `.env.local.example`). ✅
- **No large binaries tracked** except `data/h1b/sponsors.csv` (7.7 MB — intentional, per `.gitignore` note) and `public/data/h1b/explorer.json` (1.3 MB). `git-installer.dmg` correctly ignored.
- **Live vs. git:** Per project convention (memory: `nritousa-vercel-deploy`, `nritousa-enhance-from-live`), production is deployed from the working tree via Vercel CLI **without committing**, so git is **not** a reliable mirror of production. Determining exactly what is live requires a Vercel recon (not performed — read-only mandate). **Recommendation:** commit the current work before the next deploy so git and live converge; treat "what's live" as an open question until confirmed on Vercel.

---

## M. Security / Secrets Audit

| Area | Finding | Severity |
|---|---|---|
| GitHub PAT in `.git/config` | **Exposed, embedded in remote URL** — rotate | **Critical** (B1) |
| Hardcoded secrets in `src`/`public`/`scripts` | None found (scanned `xkeysib-`, `ghp_`, `sk_live`, `AIza…`) | ✅ |
| `NEXT_PUBLIC_*` | Only `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_ADS_ID` (GA4 + Google Ads IDs) — **meant to be public** | ✅ |
| Brevo key | Server-only, never in client bundle | ✅ |
| `.env.local` | Git-ignored; holds `BREVO_API_KEY`, contribute email vars | ✅ (rotate only if ever shared) |
| CSP / security headers | `next.config.mjs` sets CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy — strong | ✅ |
| Form input rendering | All email HTML uses `escapeHtml`; no unsanitized user input rendered to pages | ✅ |
| API rate limiting | Absent on all routes | Medium (C2) |
| `public/.DS_Store` | Served publicly | Low (D2) |

**`npm audit`** was not run (would require network + could mutate lockfile expectations); recommend running `npm audit --omit=dev` in a scratch checkout if a dependency-vuln view is needed.

---

## N. Build / Lint / Typecheck Results

- **`tsc --noEmit`** → **PASSED (exit 0)**. No type errors anywhere.
- **`next lint`** → **cannot run** — no ESLint config exists (prompts interactively). Add `.eslintrc.json` (D1).
- **`next build`** → **not run** — established local hang on the dynamic `next/og` (Satori) `icon`/`opengraph-image` routes (memory: `nritousa-satori-icon-kills-local-serve`). **Vercel is the authoritative build gate.**
- **`scripts/check-links.js`** → not executed here; per `check-links-cluster-false-positives` memory it flags all `[slug]` cluster links as false-positive "broken" and is not a gate.

---

## O. Exact Recommended Next Commands (all read-only / safe)

```bash
# Refresh the metadata length offenders (post-trim-commit)
node scripts/audit/metadata.js

# Re-run the full static audit suite (read-only)
node scripts/audit/audit.js
node scripts/audit/orphans-thin.js
node scripts/audit/sitemap-check.js

# Confirm typecheck (already passing)
npx tsc --noEmit

# Optional dependency vuln view (does not mutate prod)
npm audit --omit=dev
```
Rotate the token (user decision, run manually — NOT auto-executed):
```bash
# After revoking + minting a new token in GitHub UI, or switching to SSH:
git remote set-url origin <new-url-without-embedded-token>
```

---

## P. "Do Not Deploy Yet" Checklist

- [ ] **Rotate the exposed GitHub PAT** (B1) — before anything else.
- [ ] Confirm on **Vercel** what is already live vs. the local working tree (L).
- [ ] Add `/affiliate-disclosure` + `/return-to-india-checklist` to the sitemap **in the same release** as those pages (C1).
- [ ] Verify the H-1B Lottery cluster + Trump pages (already in sitemap) ship **together** with their routes (F).
- [ ] Ensure the Return-to-India Playbook **PDF is committed/uploaded** (currently untracked) so the deployed download link resolves (K).
- [ ] Decide author-page index vs. noindex (D3) — avoid a mixed signal going live.
- [ ] Run `tsc --noEmit` clean (currently passing) and a **Vercel preview build** before promoting to prod.

---

## Q. Suggested Phased Implementation Plan

**Phase 1 — Safety & indexing cleanup (do first)**
Rotate GitHub PAT · add ESLint config · remove `public/.DS_Store` + add to `.vercelignore` · commit the large uncommitted feature set in logical groups · reconcile git with what's live on Vercel.

**Phase 2 — Sitemap / robots / canonicals**
Add `/affiliate-disclosure` + `/return-to-india-checklist` to sitemap · decide + apply author-page index/noindex · re-run `sitemap-check.js`. (Robots and canonicals already clean — no change.)

**Phase 3 — Homepage / search / internal links**
No homepage restructuring needed (search + MostUsedTools + HubCards + LeadMagnetSpotlight already clean) · add state-to-state nav for population spokes · surface `/resources`, `/partnerships`, low-link tools from hubs · consider a "DIY NRI tax filing" pillar to consolidate the scattered tax tools.

**Phase 4 — Brevo & lead-magnet improvements**
Add API rate limiting (C2) · add on-page consent line to newsletter/lead-magnet forms · add Return-to-India card to `/return-to-india` hub + 401k/RNOR calcs · (optional) wire the `poll` route's Supabase TODO.

**Phase 5 — Content-cluster strengthening**
Trim remaining long titles/descriptions (C4) · migrate the 12 thin tools to `ToolHub`/`CalculatorHub` · deepen spoke-to-spoke linking in the state cluster · add a banking (NRE/NRO/FCNR) pillar.

**Phase 6 — Final QA & deployment checklist**
Vercel preview build green · sitemap re-validated · lead-magnet download flows tested end-to-end on preview · Search Console re-submit sitemap after deploy · run `scripts/indexnow.mjs` if used.

---

*End of report. No changes were made. Companion task list: `nritousa-fix-plan-no-code-changes.md`.*
