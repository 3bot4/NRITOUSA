# Legal policy review — open items

> **Important:** The legal pages on this site — Terms & Conditions, Privacy
> Policy, Disclaimer, and Cookie Policy — are strong, professional **drafts
> prepared for attorney review**. They are **not legal advice** and do **not**
> by themselves guarantee compliance with any law. **A qualified attorney
> licensed in Illinois (and any other relevant jurisdiction) should review every
> policy before the business relies on it.**

Operated by **Wealth Building Academy LLC**, an Illinois limited liability
company, under the brand **NRI to USA** (`nritousa.com`).

## Pages

| Page | Route | Source file |
| --- | --- | --- |
| Terms & Conditions | `/terms-and-conditions` | `src/app/terms-and-conditions/page.tsx` |
| Privacy Policy | `/privacy-policy` | `src/app/privacy-policy/page.tsx` |
| Disclaimer | `/disclaimer` | `src/app/disclaimer/page.tsx` |
| Cookie Policy | `/cookie-policy` | `src/app/cookie-policy/page.tsx` |

Shared chrome: `src/components/LegalPageLayout.tsx`.
Shared values (owner, state, email, mailing address, "last updated" date):
`src/lib/site.ts` → `legalUpdated`, `mailingAddress`, `state`.
`/terms-of-use` and `/privacy` permanently redirect to the canonical routes.

## Owner / attorney action items

- [x] **Official company contact email** is `support@nritousa.com` (set in
      `site.email`, used everywhere). Change there if a dedicated legal/privacy
      inbox is later preferred.
- [ ] **Insert a public mailing address** if you want one shown. Set
      `site.mailingAddress` in `src/lib/site.ts` (empty string hides the line).
- [ ] **Attorney review** of all four pages is recommended before reliance.
- [ ] **Confirm whether the CCPA/CPRA applies** to the business. The California
      notice is written with "where applicable / if we are subject to" hedging.
- [ ] **Confirm whether the GDPR / UK GDPR applies** (i.e. whether the site
      targets EU/UK users). If so, add lawful-basis + rights language and a
      cookie-consent mechanism. See TODOs in the Privacy Policy and Cookie
      Policy source.
- [ ] **Confirm cookie banner requirements** for target jurisdictions. No cookie
      consent banner is currently implemented (see Cookie Policy TODO). Do not
      claim cookie-consent compliance until one is added if required.
- [ ] **Confirm whether Google Analytics Advertising Features are enabled** (the
      site loads GA4 `G-R85V0V6Y7R` and Google Ads `AW-10930801554` via
      `src/lib/gtag.ts`). This affects the advertising/sharing disclosures.
- [ ] **Confirm affiliate / ads / sponsored links usage** and that the
      disclosure language matches actual practice (FTC).
- [ ] **Confirm the email provider.** Code references **Brevo** via
      `/api/newsletter` (see `ImmigrationEmailSignup.tsx`). Update the Privacy
      Policy's processor disclosures if it changes (Resend, Mailchimp, etc.).
- [ ] **Confirm data retention settings** in analytics and the email platform,
      and align the Privacy Policy's retention section.
- [ ] **Confirm whether any calculator inputs are stored server-side.** The
      Privacy Policy states most calculators run in-browser and inputs may be
      processed only temporarily — verify this matches each tool/API route.
- [ ] **Confirm no minors' data is collected.** The site targets a general adult
      audience; education/SAT tools should not request unnecessary data from
      minors.
- [ ] **Confirm no biometric data is collected** (relevant to Illinois BIPA). If
      biometric collection is ever added, implement a separate biometric privacy
      policy + written consent **before** collection.
- [ ] **Confirm no sensitive immigration/tax/account data is collected
      unnecessarily** through any form or tool.
- [ ] **Dispute resolution:** decide with counsel whether to add binding
      arbitration / class-action waiver to the Terms (intentionally omitted; the
      draft only requires informal resolution first).

## Analytics privacy note (verified at draft time)

GA4 events only send broad, non-identifying labels — `tool_name`,
`result_type` (coarse tier), `category`, and `page_slug` (a static route, not a
user-typed value). See `src/lib/analytics.ts` and the `trackToolUsed` callers in
`src/components/tools/*` and `src/components/calculators/*`. **No** income, tax
amounts, balances, visa/priority dates, receipt numbers, passport numbers, SSNs,
names, emails, or raw user-entered values are sent to analytics. Keep this
invariant when adding new events.
