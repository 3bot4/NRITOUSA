# Monetization & advertising-compliance audit report

Date: 2026-07-25
Scope: AdSense/Impact/CJ/sponsorship readiness pass across legal pages,
consent infrastructure, crawlability, authorship, and affiliate disclosure.
No redesign, no branding/layout/calculator-logic/URL/SEO-strategy changes.

## Note on repo state at the start of this pass

Before this work began, the working tree already had **unrelated, uncommitted
work in progress**: a Microsoft Clarity analytics integration
(`src/components/ClarityAnalytics.tsx`, `src/lib/clarity.ts`, plus edits to
`next.config.mjs`, `src/app/layout.tsx`, `src/app/cookie-policy/page.tsx`,
`src/app/privacy-policy/page.tsx`). It was left untouched and is not part of
this report — it will show up in `git status`/`git diff` alongside this pass's
changes because both touch some of the same files (the CSP block in
`next.config.mjs`, and the same sections in the two legal pages).
`NRITOUSA-Content-SEO-Audit-2026-07-21.pdf` and
`nritousa-page-rework-priority-plan.xlsx` were also already sitting untracked
in the repo root, unrelated to this work, and were not touched.

---

## Issues found and how they were fixed

| # | Issue | Verified how | Fix |
| --- | --- | --- | --- |
| 1 | About page said "no affiliate-driven nonsense" — directly conflicts with monetization | Read `src/app/about/page.tsx` | Replaced with transparent wording: independent editorial conclusions, compensated relationships disclosed |
| 2 | Privacy Policy had no advertising/AdSense section | Read all 18 sections of `src/app/privacy-policy/page.tsx` | Added "Advertising and Google AdSense" section with real linked resources (Google Ads Settings, Google's partner-sites data page, NAI opt-out) |
| 3 | Cookie Policy's consent section said "by continuing to use the Site, you consent to our use of cookies" (blanket implied-consent language) | Read `src/app/cookie-policy/page.tsx` section `cookie-consent` | Rewrote to describe necessary vs. optional cookies accurately, and how to reopen choices once a CMP exists |
| 4 | Affiliate Disclosure page didn't state "not every provider is included" or that sponsored content is labeled separately | Read `src/app/affiliate-disclosure/page.tsx` in full | Added both points to the relevant sections and the summary bullet list |
| 5 | Impact.com affiliate tag (`utt.impactcdn.com`, live site-wide via `ImpactTag.tsx`) was **not** in the CSP allowlist — likely silently blocked in production | Diffed `next.config.mjs` CSP against `ImpactTag.tsx`'s script origin | Added `utt.impactcdn.com` to `script-src` and `connect-src`, unconditionally (the tag was already live) |
| 6 | Two calculators named in the brief's own route-review list — `/calculators/rent-vs-buy-immigrant` and `/calculators/401k-return-to-india` — render no author/reviewer byline | Read `CalculatorHub.tsx`'s gating logic and `calculatorContent.ts`; confirmed neither entry set `updated`/`expertiseTags` | Added both fields to both entries, matching the existing `rnor-tax-residency` pattern |
| 7 | Person JSON-LD `jobTitle` was "Founder and Author" on `/about-deepak` vs. "Founder & Author" everywhere else (`author.ts`, `seo.ts`, the page's own `<title>`) | Grepped `Founder & Author` / `Founder and Author` across `src/` | `personJsonLd` now reads `jobTitle: author.jobTitle` (single source of truth) instead of a second hardcoded string |
| 8 | No consent-management readiness: no CMP, no way to reopen privacy choices, Google Consent Mode not initialized | Grepped for OneTrust/Cookiebot/Osano/TrustArc/usercentrics/`gtag('consent'`/Consent Mode — zero hits | Added `src/lib/consent.ts` (inert `cmpProvider: null` / `cmpActive: false`), a footer "Privacy choices" link that only renders once a CMP is configured, and Google Consent Mode v2 defaults (`ad_*: 'denied'`, `analytics_storage: 'granted'` — preserves current analytics) |
| 9 | No AdSense code path exists (expected — greenfield) | Grepped `adsbygoogle`/`AdSense`/`googlesyndication`/`pub-` — zero hits, no fake id anywhere | Added dormant `src/lib/ads.ts`, `AdSenseScript`/`AdSlot`/`AdDisclosureLabel` components, `NEXT_PUBLIC_ADSENSE_CLIENT` env var, conditional CSP entries. Nothing activates without a real client id. No `<AdSlot>` placed on any page. |
| 10 | No ad-placement / sensitive-route policy existed in code | N/A — new requirement | Added `NO_AD_ROUTES` + `isExcludedRoute`/`isAdEligibleRoute` in `src/lib/ads.ts`, seeded from the current route inventory (H-1B layoffs, visa deadlines, USCIS case-status pages, FBAR/FATCA tools, emergency checklists) |
| 11 | `AffiliateDisclosureNote.tsx` existed but was used nowhere, and didn't support variants | Grepped for its usage — zero call sites | Replaced with `AffiliateDisclosureNotice.tsx` (compact/standard/comparison-table variants, exact wordings from the brief) |
| 12 | `ads.txt`, robots.txt, sitemap | Read `src/app/robots.ts`, all 6 sitemap route files, `sitemap-data.ts`'s `CONTENT_BASELINE` | **No issues found.** robots.ts already allows all + excludes `/api/`; sitemap already uses a committed baseline date, never a build timestamp. No code change. `ads.txt` intentionally not created — no real publisher id exists. |

## Issue the brief assumed but that does **not** exist

The brief described a specific Cookie Policy bug: the table of contents
listing a "Section 7: Cookie consent / privacy choices" while the rendered
page jumps from Section 6 to Section 8. This was checked directly against the
live source (`src/app/cookie-policy/page.tsx`) and the shared layout
component (`src/components/LegalPageLayout.tsx`): the table of contents and
the section bodies are both generated by mapping over the **same** `sections`
array, so they cannot structurally disagree. All 9 sections render in order,
numbered 1–9, with no gap. This is now covered by a regression test
(`src/app/cookie-policy/anchors.test.ts`) so it stays true. No fix was made
because there was nothing to fix — per the working rule not to assume an
issue still exists without verifying it first.

---

## Files changed

**Legal-page copy:**
- `src/app/about/page.tsx`
- `src/app/privacy-policy/page.tsx`
- `src/app/cookie-policy/page.tsx`
- `src/app/affiliate-disclosure/page.tsx`
- `src/app/about-deepak/page.tsx` (jobTitle consistency only)
- `docs/legal-policy-review-todos.md` (added a summary of what this pass changed)

**Consent infrastructure (new):**
- `src/lib/consent.ts`
- `src/components/PrivacyChoicesLink.tsx`
- `src/components/Footer.tsx` (wires the link into the Company column)
- `src/components/GoogleAnalytics.tsx` (Consent Mode v2 defaults)

**Crawlability / CSP:**
- `next.config.mjs` (Impact.com CSP fix, unconditional; AdSense CSP domains, conditional on `NEXT_PUBLIC_ADSENSE_CLIENT`)

**AdSense infrastructure (new, dormant):**
- `src/lib/ads.ts`
- `src/components/ads/AdSenseScript.tsx`
- `src/components/ads/AdSlot.tsx`
- `src/components/ads/AdDisclosureLabel.tsx`
- `src/app/layout.tsx` (wires in `AdSenseScript`)
- `.env.local.example` (documents `NEXT_PUBLIC_ADSENSE_CLIENT`)

**Affiliate disclosure:**
- `src/components/AffiliateDisclosureNotice.tsx` (new, replaces `AffiliateDisclosureNote.tsx`, which is deleted — it had zero usages)

**Authorship:**
- `src/lib/calculatorContent.ts` (`updated`/`expertiseTags` on 2 calculators)

**Tests (new):**
- `src/app/cookie-policy/anchors.test.ts`
- `src/components/Footer.test.ts`
- `src/components/AffiliateDisclosureNotice.test.ts`
- `src/lib/ads.test.ts`
- `src/lib/consent.test.ts`
- `src/lib/adsensePublisherId.test.ts`

**Documentation (new):**
- `MONETIZATION_SETUP.md`
- `MONETIZATION_AUDIT_REPORT.md` (this file)

## Routes affected

`/about`, `/privacy-policy`, `/cookie-policy`, `/affiliate-disclosure`,
`/about-deepak`, `/calculators/rent-vs-buy-immigrant`,
`/calculators/401k-return-to-india`, and every route site-wide via the footer
(new conditional "Privacy choices" item, currently hidden) and the root
layout (new conditional `AdSenseScript`, currently a no-op).

## Redirects created

None. `/privacy` → `/privacy-policy` and `/terms-of-use` →
`/terms-and-conditions` were already correctly consolidated via page-level
`permanentRedirect()` calls before this pass; the footer already links only to
canonical routes; no stray "Terms of Use" label exists outside the legacy
redirect stub. No new duplicate/legacy legal routes were found.

## ads.txt status

Not created — no real AdSense publisher id exists anywhere in this
repository, and none was invented. `src/lib/adsensePublisherId.test.ts`
guards against a placeholder ever being introduced. See
`MONETIZATION_SETUP.md` §2 for the exact steps once a real id exists.

## AdSense integration status

Code-complete, inert. `NEXT_PUBLIC_ADSENSE_CLIENT` is unset, so:
`AdSenseScript` renders nothing, the AdSense CSP domains are absent, and
`isAdEligibleRoute()` returns `false` everywhere. No `<AdSlot>` is placed on
any page. Setting the one env var and redeploying is the entire activation
path — see `MONETIZATION_SETUP.md` §1.

## CMP status

No CMP integrated (none existed before this pass either). `cmpProvider` in
`src/lib/consent.ts` is `null`. The footer "Privacy choices" link is coded but
does not render while `cmpActive` is `false`. Google Consent Mode v2 defaults
are live (`ad_storage`/`ad_user_data`/`ad_personalization: 'denied'`,
`analytics_storage: 'granted'`) — this does not change what visitors
experience today (no ads exist yet) and does not regress GA/Clarity. See
`MONETIZATION_SETUP.md` §1 for the AdSense → Privacy & messaging → European
regulations steps to actually configure a certified CMP.

## Testing performed

- `npx tsc --noEmit` — **clean, zero errors.**
- `npm test` (vitest) — **878/878 tests passing**, including the 6 new test
  files added in this pass (44 pre-existing files were unaffected).
- `npm run build` (production build) — **clean, exit code 0, 903/903 static
  pages generated, no errors or warnings.** (First attempt showed cascading
  `MODULE_NOT_FOUND` errors — caused by having accidentally run `next dev`
  concurrently with `next build` against the same `.next` output directory,
  a self-inflicted race condition, not a code defect. Stopped the dev server,
  deleted `.next`, and reran the build in isolation; it passed cleanly.)
- `git status`/known-gotcha check — no untracked `<name> 2.ts(x)` duplicate
  files present.
- Served the production build (`npm run start`) and curl-checked 17 routes:
  `/`, `/about`, `/about-deepak`, `/privacy-policy`, `/cookie-policy`,
  `/terms-and-conditions`, `/affiliate-disclosure`, `/disclaimer`, `/contact`,
  `/tools`, `/calculators/rent-vs-buy-immigrant`,
  `/calculators/401k-return-to-india`, `/tools/fbar-fatca-checker`,
  `/success-stories`, `/success-stories/deepak-middha`, `/robots.txt`,
  `/sitemap.xml` — **all HTTP 200**. `/ads.txt` correctly returns 404 (not
  created, by design).
- Verified against the actual rendered HTML (not just source): the CSP header
  includes `utt.impactcdn.com`; the Cookie Policy no longer contains "by
  continuing to use the Site, you consent" and does mention "privacy
  choices"; the Privacy Policy renders "Advertising and Google AdSense" and a
  working "Google Ads Settings" link; the About page no longer contains
  "affiliate-driven nonsense" and does contain the new "fear-based marketing"
  wording; the homepage contains **no** `adsbygoogle` script and **no**
  "Privacy choices" footer link (both correctly dormant); the homepage does
  emit `gtag('consent', 'default', ...)`; and both previously byline-less
  calculators now render "Reviewed by ... Deepak Middha".

## Limitation: no live visual/browser QA

This environment has no browser automation or screenshot tooling installed
(no Puppeteer in `package.json`). "Desktop/mobile rendering," "no horizontal
overflow," and "no visible console error" were therefore verified through the
production build succeeding cleanly, HTTP-level route checks, and rendered
HTML content checks — not through an actual browser. If you want a true
visual pass (mobile viewport screenshots, live console-error capture,
production-domain checks on nritousa.com itself), that still needs to happen
separately, e.g. via Vercel's preview deployment or a manual pass in a
browser.

## Unresolved manual items (yours to complete)

1. **AdSense publisher id** — set `NEXT_PUBLIC_ADSENSE_CLIENT` in Vercel once
   you have a real `ca-pub-...` id from the AdSense dashboard.
2. **ads.txt** — create `public/ads.txt` with the exact line AdSense gives
   you, per `MONETIZATION_SETUP.md` §2.
3. **CMP selection** — AdSense dashboard → Privacy & messaging → European
   regulations → choose a Google-certified CMP, then set `cmpProvider` in
   `src/lib/consent.ts` and wire its preference-center trigger into
   `openPrivacyChoices()`.
4. **First ad placement** — once you have real ad-unit slot ids, add
   `<AdSlot>` to specific pages following the placement rules in
   `MONETIZATION_SETUP.md` §1. None are placed yet.
5. **Attorney review** — unchanged from before this pass; see
   `docs/legal-policy-review-todos.md` (CCPA/CPRA applicability, GDPR/UK
   targeting, mailing address, arbitration clause, etc.). This pass did not
   and could not resolve those — they're legal/business decisions, not code.
6. **`NO_AD_ROUTES` review** — the seeded sensitive-route list in
   `src/lib/ads.ts` reflects the current route inventory; review and extend
   it as new high-sensitivity pages are added.

## Final verdict

**Ready to apply.** Every change in this pass is either a verified copy/CSP
fix to existing live pages, or new infrastructure that stays completely
inert until you deliberately configure it (an env var for AdSense, a
`cmpProvider` value for the CMP). Nothing here activates advertising, and
nothing here can regress the current site — `tsc` and the full test suite are
clean. The only blockers to *actually running ads* are the manual items above,
all of which require information only you have (a real AdSense account, a CMP
choice) that this pass correctly refused to fabricate.
