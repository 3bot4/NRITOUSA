# NRITOUSA.COM — Fix Plan (Approve Before Any Code Changes)

> **Status: NOTHING has been changed.** This is a prioritized, approval-gated task list derived from `nritousa-sitewide-audit-report.md`.
> Check a box only as a decision to proceed. I will not touch code, deploy, push, or modify Brevo/Vercel/env until you explicitly approve specific items.

---

## 🔴 P0 — Critical (do first, mostly manual by you)

- [ ] **P0-1 · Rotate the exposed GitHub token.** The `origin` remote URL in `.git/config` embeds a live `ghp_…` PAT with push access. Revoke it in GitHub, mint a new one (or switch to SSH), then `git remote set-url origin <clean-url>`. *(Your action — I will not run this without approval; involves credentials.)*

## 🟠 P1 — High (safe code/config changes, on approval)

- [ ] **P1-1 · Add 2 new pages to the sitemap.** `/affiliate-disclosure` and `/return-to-india-checklist` in `src/lib/sitemap-data.ts`. *(Small, low-risk.)*
- [ ] **P1-2 · Commit the uncommitted feature set.** ~30 untracked + 28 modified files (H-1B Lottery cluster, Return-to-India lead magnet + PDF, GlobalSearch, MostUsedTools, affiliate-disclosure, e-OCI card, new Trump pages). Group into logical commits. *(No push without approval.)*
- [ ] **P1-3 · Reconcile git with live.** Recon Vercel (read-only) to confirm which of the above is already in production before the next deploy. *(Requires Vercel access — your call on how.)*
- [ ] **P1-4 · Add API rate limiting.** Throttle `newsletter`, `lead-magnet`, `lead-magnet/return-to-india-playbook`, `contribute`, `poll`. *(New dependency or in-memory bucket — decide approach.)*
- [ ] **P1-5 · Trim remaining long titles/descriptions.** Re-run `node scripts/audit/metadata.js`, then trim the current offenders (~30–40 pages) to ≤57-char titles / ≤155-char descriptions.

## 🟡 P2 — Medium (on approval)

- [ ] **P2-1 · Add ESLint config** — `.eslintrc.json` → `{ "extends": "next/core-web-vitals" }`.
- [ ] **P2-2 · Stop serving `public/.DS_Store`** — remove it and add `.DS_Store` to `.vercelignore`.
- [ ] **P2-3 · Decide author-page indexing** — add `/author/[slug]` to sitemap OR set `robots:{index:false}` (pick one).
- [ ] **P2-4 · Add on-page consent line** to newsletter + lead-magnet forms (GDPR/CAN-SPAM hygiene).
- [ ] **P2-5 · Add Return-to-India lead card** to `/return-to-india` hub + 401k/RNOR calculators.
- [ ] **P2-6 · Strengthen state-cluster interlinking** — state-to-state nav across the 11 `/indian-population-in-*` spokes.

## 🟢 P3 — Low / cleanup (on approval)

- [ ] **P3-1 · Migrate 12 thin tools** to `ToolHub`/`CalculatorHub` (continue existing rollout).
- [ ] **P3-2 · Surface under-linked pages** (`/resources`, `/partnerships`, `flight-price-guide`, `h1b-sponsor-finder`) from hubs/nav.
- [ ] **P3-3 · Add a banking (NRE/NRO/FCNR) pillar** and a "DIY NRI tax filing" pillar to consolidate scattered tools.
- [ ] **P3-4 · Repo declutter** — remove `git-installer.dmg`, `.git-corrupt-bak/`, archive stale root audit files (`AUDIT_REPORT.md`, `audit.js`, etc.) into `docs/`.
- [ ] **P3-5 · Wire `poll` route Supabase TODO** (optional, per code TODO).

---

## Already fixed in the current working tree (no action — informational)
- ✅ Root `/opengraph-image` now blocked in `robots.ts`.
- ✅ 2 broken FCNR calculator links now point to real article slugs.
- ✅ `/partnerships` added to the sitemap.
- ✅ MoneyHub (3 hubs) + `/about` now emit JSON-LD.
- ✅ `tsc --noEmit` passes clean.
- ✅ Both lead-magnet PDFs are valid (Playbook 143 KB, Wealth Guide 1.2 MB).
- ✅ No hardcoded secrets in source; Brevo key server-only; `.env.local` git-ignored.

---

## Guardrails (unchanged from your instructions)
Do **not**: deploy · push · pull · modify Vercel/Cloudflare/Brevo/DB/env · delete files · expose secrets · make code changes — **until you approve specific items above.**

**Suggested approval order:** P0-1 → P1-1/P1-2/P1-3 → P1-4/P1-5 → P2 → P3.
