# Monetization setup

This is the owner-facing setup guide for AdSense, affiliate programs (Impact,
CJ Affiliate), and sponsorships on NRItoUSA.com. It documents exactly what
was built automatically, what still requires manual action in a dashboard
somewhere, and the one-switch kill for each system.

See also `MONETIZATION_AUDIT_REPORT.md` for the full list of issues found and
fixed, and `docs/legal-policy-review-todos.md` for the pre-existing legal
attorney-review checklist (unchanged in scope by this pass).

---

## 1. Google AdSense

### Status: code infrastructure ready, **no ads are live**

Nothing serves an ad until you set one environment variable. There is no
fake/placeholder publisher id anywhere in this repo (guarded by
`src/lib/adsensePublisherId.test.ts`).

### To turn AdSense on

1. Get your AdSense publisher id (`ca-pub-XXXXXXXXXXXXXXXX`) from the AdSense
   dashboard.
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` in the Vercel
   dashboard (Project → Settings → Environment Variables) and redeploy. Locally,
   copy `.env.local.example` to `.env.local` and set it there.
3. That single variable:
   - Enables `src/components/ads/AdSenseScript.tsx` (loads the AdSense loader
     script in the root layout).
   - Enables the AdSense CSP domains (`pagead2.googlesyndication.com`,
     `*.googlesyndication.com`, `googleads.g.doubleclick.net`,
     `*.doubleclick.net`) in `next.config.mjs` — evaluated at build time, so a
     redeploy is required after setting it.
   - Enables `isAdEligibleRoute()` in `src/lib/ads.ts` to return `true` on
     non-excluded routes (still requires an actual `<AdSlot>` on a page — see
     below).

### One-switch kill

Unset `NEXT_PUBLIC_ADSENSE_CLIENT` and redeploy. `adsEnabled` in
`src/lib/ads.ts` goes false, `AdSenseScript` stops loading, and any `<AdSlot>`
already placed on a page renders nothing (not even reserved space).

### Placing your first ad unit

No `<AdSlot>` has been placed on any page yet — placing one requires a real
ad-unit slot id from the AdSense dashboard (do not invent one). To add one:

```tsx
import AdSlot from "@/components/ads/AdSlot";
import { usePathname } from "next/navigation"; // client component only

<AdSlot slot="1234567890" pathname={pathname} />
```

- `AdSlot` reserves layout space, is responsive, fails silently with no ad
  blocker/network errors surfaced to the visitor, and renders nothing on
  excluded routes (`src/lib/ads.ts` → `NO_AD_ROUTES`) or when ads are off.
- It renders an `AdDisclosureLabel` above the unit — only "Advertisement" or
  "Sponsored links", never a misleading label like "Recommended" or "Next
  step".

### Placement rules (calculator & sensitive-page safe zones)

The user's answer, calculation, checklist, or urgent action must always be
easier to find than the ad. Concretely, on calculator pages, never place an
ad:

- Between input fields, or inside the calculator form.
- Next to a Calculate, Reset, Save, Download, Share, Print, or Continue button.
- Immediately above a primary-action button.
- Inside the calculated result, or between the result headline and its
  explanation.
- In a sticky position that covers calculator controls.
- Anywhere it can cause layout movement after the user enters data (this is
  why `AdSlot` always reserves fixed height).

Permitted future positions: below the complete result and its explanation,
between substantial educational sections further down the page, or near the
end of a long page.

On articles/guides: after the Quick Answer section (never before it), between
two substantial content sections, or near the end before related resources —
never automatically after every heading.

### Sensitive routes (no ads, ever, without a deliberate decision)

`src/lib/ads.ts` → `NO_AD_ROUTES` (checked by `isAdEligibleRoute()` /
`isExcludedRoute()`, tested in `src/lib/ads.test.ts`) currently excludes:

- H-1B layoffs: `/h1b-layoff`, `/tools/h1b-transfer-risk-checklist`
- Visa deadlines / priority dates: `/visa-bulletin`,
  `/eb2-eb3-priority-date-india`, `/tools/priority-date-checker`
- USCIS case-status / urgent-action pages: `/uscis/case-status`,
  `/uscis/receipt-number`, `/uscis/life-planning`,
  `/tools/uscis-case-status-meaning`, `/tools/uscis-life-decision-checklist`,
  `/nvc-case-status`, `/nvc-document-checklist-india`, `/immigration-tracker`,
  `/tools/green-card-tracker`, `/i485-documents-checklist`
- FBAR/FATCA and tax-penalty determinations: `/tools/fbar-fatca-checker`,
  `/tools/form-15ca-15cb-checklist`, `/tools/nri-tds-refund-checklist`
- `/return-to-india-checklist`

**This is a seed list, not an exhaustive one.** Review it and add any new
high-sensitivity page (a new emergency checklist, a new tax-penalty tool,
etc.) to `NO_AD_ROUTES` when it's built.

### Auto Ads

Not enabled by this pass — Auto Ads is configured entirely in the AdSense
dashboard, not in code. When you turn it on:

- Start with low ad density and inspect the AdSense preview before publishing.
- Exclude every route in `NO_AD_ROUTES` above (AdSense supports URL exclusion
  rules in its dashboard) and exclude calculator forms/result areas
  specifically.
- Consider disabling intrusive overlay/anchor ad formats.
- Review mobile rendering separately from desktop — Auto Ads placement
  differs by viewport.

### Google Privacy & Messaging / consent (do this before serving personalized ads to EU/UK/consent-required visitors)

1. In the AdSense dashboard: **Privacy & messaging → European regulations** →
   select a Google-certified consent management platform (CMP) and configure
   it. Do the same for **US state privacy** messaging if/when you serve
   ad-supported traffic from opted-in US states.
2. Once you've chosen and integrated a CMP, set `cmpProvider` in
   `src/lib/consent.ts` (currently `null`). This automatically:
   - Turns on the footer "Privacy choices" link
     (`src/components/PrivacyChoicesLink.tsx`, currently hidden — see below).
   - Is where you wire the CMP SDK's actual preference-center trigger into
     `openPrivacyChoices()`.
3. Wire the CMP's consent callback to call
   `gtag('consent', 'update', { ad_storage: ..., ad_user_data: ...,
   ad_personalization: ... })` reflecting the visitor's actual choice. The
   defaults already set in `src/components/GoogleAnalytics.tsx` are
   `ad_storage`/`ad_user_data`/`ad_personalization: 'denied'` and
   `analytics_storage: 'granted'` (this preserves current GA/Clarity behavior
   and only affects ad personalization, which isn't live yet).

### Reopening privacy choices

The footer "Privacy choices" link only renders when `cmpActive` is true (i.e.
once you've set `cmpProvider` in step 2 above) — see
`src/components/PrivacyChoicesLink.tsx`. This is deliberate: a visible link to
a non-functional action would be worse than no link. Do not add a visible
"Privacy choices" link before a real CMP is wired in.

---

## 2. ads.txt

**Not created.** No real AdSense publisher id exists in this codebase to put
in it, and this project will never guess one or publish a placeholder.

### To create it once you have a real publisher id

Create `public/ads.txt` with the exact line AdSense gives you (Dashboard →
Sites → your domain → "View ads.txt instructions"). It typically looks like:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Use the **exact** line AdSense shows you — do not copy the example above
literally, and do not reuse the number from this document (there isn't one).
If you add Impact, CJ, or another network that requires its own `ads.txt`
line, append it as an additional line in the same file (one seller per line).

### Verify after deploying

```
curl -I https://www.nritousa.com/ads.txt
```

Must return `HTTP 200`, `Content-Type: text/plain`, no redirect, no HTML
wrapper, no auth prompt.

---

## 3. Impact.com affiliate tag

**Status: already live in code, was silently CSP-blocked — now fixed.**

`src/components/ImpactTag.tsx` (Robinhood program tracking tag,
`utt.impactcdn.com`) has been rendered site-wide since before this pass, but
`utt.impactcdn.com` was missing from the CSP `script-src`/`connect-src`
allowlist in `next.config.mjs`, so the browser was very likely blocking the
tag in production. That's fixed unconditionally (not gated on any env var,
since the tag was already live).

There is no outbound Robinhood link/CTA anywhere on the site matching this
tag — if you add one, mark it `rel="sponsored noopener noreferrer"` like
`src/components/OptionLeoCard.tsx` does, and place an
`AffiliateDisclosureNotice` (see below) next to it.

## 4. Adding a new affiliate link (Impact, CJ, or any other network)

1. Add the link with `rel="sponsored noopener noreferrer"` and
   `target="_blank"`. Only mark genuinely compensated commercial links this
   way — never a government/official source (those use
   `rel="nofollow noopener noreferrer"`, see `OfficialSourceNote.tsx`) and
   never the same-owner cross-promotion cards (`OptionLeoCard.tsx`,
   `RecommendedToolsAd.tsx`), which already carry their own network-relationship
   disclosure.
2. Place an `AffiliateDisclosureNotice` (`src/components/AffiliateDisclosureNotice.tsx`)
   **before or immediately next to** the first affiliate recommendation —
   never only in the footer, never inside an accordion, never after every
   affiliate link has already appeared:
   - `variant="compact"` next to a single CTA button or partner card.
   - `variant="standard"` above a block of affiliate recommendations in body
     copy.
   - `variant="comparison-table"` directly above a provider-comparison table.
3. If a new network requires its own `ads.txt`/`app-ads.txt` line, add it per
   §2 above — do not create a separate ads.txt file per network.
4. If the network's tracking script loads from a new domain, add that domain
   to `next.config.mjs`'s CSP (`script-src`/`connect-src`) — a new tag will be
   silently blocked otherwise, exactly like the Impact.com tag was before this
   pass (§3).

## 5. Provider-comparison pages (future)

No comparison-table page exists on the site today, so no component was built
for one — building it now would be unused scaffolding. When you build one
(e.g. "best NRE FD rates"), give each provider row:

- Provider name
- Intended user / who it's for
- Relevant features
- Important fees
- Limitations
- Eligibility considerations
- Last-verified date
- Official provider source (link)
- Affiliate-relationship status

Never rank providers solely by commission, and never use unsupported
superlatives ("best", "guaranteed", "safest", "risk-free", "always cheaper",
"zero risk", "guaranteed approval"). Don't add `Product`, `Review`,
`AggregateRating`, or financial-product JSON-LD unless the visible content and
evidence fully support it. Place an `AffiliateDisclosureNotice
variant="comparison-table"` directly above the table.

---

## 6. One-switch kill for everything

| System | Switch | Effect |
| --- | --- | --- |
| AdSense (script + slots + CSP) | Unset `NEXT_PUBLIC_ADSENSE_CLIENT`, redeploy | `adsEnabled` → false everywhere |
| CMP / "Privacy choices" link | Set `cmpProvider` back to `null` in `src/lib/consent.ts` | Footer link disappears, `openPrivacyChoices()` becomes a no-op again |
| Impact.com tag | Remove `<ImpactTag />` from `src/app/layout.tsx` | Tag stops loading (pre-existing component, unrelated to this pass) |

---

## 7. Testing this in production

1. `curl -I https://www.nritousa.com/ads.txt` and `.../robots.txt` for 200/text-plain.
2. View source on a calculator page and a legal page — confirm no console
   errors, no `adsbygoogle` script tag until `NEXT_PUBLIC_ADSENSE_CLIENT` is
   set.
3. After setting the AdSense env var: use the AdSense dashboard's own
   preview/inspect tools rather than assuming placement is correct from code
   review alone.
4. Check `https://www.nritousa.com/cookie-policy#cookie-consent` renders the
   updated consent-choices language (no more "by continuing to use the Site
   you consent to all cookies").

## 8. Rollback procedure

Every change in this pass is either (a) additive and dormant by default
(AdSense/CMP infrastructure — nothing activates without an env var or a
`cmpProvider` value you set yourself), or (b) a copy/CSP fix to existing pages.
To roll back:

- **Full rollback**: `git revert` the commit(s) from this pass.
- **Partial rollback (keep the legal-copy fixes, drop the ad infra)**: delete
  `src/lib/ads.ts`, `src/components/ads/`, and the `<AdSenseScript />` line in
  `src/app/layout.tsx`; remove the AdSense block from
  `.env.local.example`; revert the AdSense-conditional CSP additions in
  `next.config.mjs` (the unconditional Impact.com CSP fix should stay — it
  fixes a real pre-existing bug independent of AdSense).
- Nothing in this pass touches production data, redirects existing traffic,
  or removes existing content — rollback is a pure code revert with no data
  migration.
