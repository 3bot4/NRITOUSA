# Visitor Insurance Cluster — Keyword Ownership Map

One primary search intent per URL. Long-tail terms are covered as headings/FAQ/body content on
the owning page — they do **not** get their own doorway page (explicit rule from the build
brief). If a future SEO review finds genuinely distinct intent + enough unique content for a
long-tail term, split it out then and update this map first.

## Primary SEMrush-sourced keywords

| Keyword | Volume | KD | Owning URL |
|---|---|---|---|
| visitor insurance USA | 1,900 | — | `/visitor-insurance` |
| visitors insurance | 1,900 | — | `/visitor-insurance` |
| visitor health insurance | 1,300 | — | `/visitor-insurance` |
| visitor medical insurance | 880 | — | `/visitor-insurance` |
| insurance for parents visiting USA | 590 | 17 | `/visitor-insurance/parents-visiting-usa` |
| visitors medical insurance | 480 | — | `/visitor-insurance` |
| travel medical insurance USA | 390 | — | `/visitor-insurance` |
| USA visitor insurance | 320 | — | `/visitor-insurance` |
| parents visiting USA insurance | 70 | — | `/visitor-insurance/parents-visiting-usa` |
| parents travel insurance USA | 10 | — | `/visitor-insurance/parents-visiting-usa` |

The parents-visiting-usa page is an early priority (spec: "meaningful volume, commercial intent,
relatively low keyword difficulty") — built in Phase 2, not deferred to Phase 4.

## Full URL → intent ownership

| URL | Primary intent(s) | Phase |
|---|---|---|
| `/visitor-insurance` | visitor insurance USA · visitors insurance · visitor health insurance · visitor medical insurance · USA visitor insurance · visitors medical insurance · travel medical insurance USA | 2 |
| `/tools/visitor-insurance-cost-calculator` | visitor insurance calculator · visitor insurance cost calculator · visitor medical insurance calculator · visitors insurance cost · visitor insurance liability calculator · how much will visitor insurance pay · how much will I pay with visitor insurance | 2 |
| `/tools/visitor-insurance-plan-comparison` | compare visitor insurance plans · visitor insurance comparison calculator · which visitor insurance plan is better · compare deductible and policy maximum · visitor insurance Plan A vs Plan B | 2 |
| `/visitor-insurance/parents-visiting-usa` | insurance for parents visiting USA · parents visiting USA insurance · visitor insurance for parents · medical insurance for parents visiting USA · parents travel insurance USA · health insurance for parents visiting USA · (+ long-tail: visitor insurance for parents over 60/65/70/75/80, elderly parents, two parents, 30/60/90-day, six-month) | 2 |
| `/visitor-insurance/fixed-benefit-vs-comprehensive` | fixed benefit vs comprehensive visitor insurance · limited coverage vs comprehensive coverage · visitor insurance fixed coverage · visitor insurance comprehensive plan · scheduled benefit visitor insurance | 2 |
| `/tools/visitor-insurance-deductible-coinsurance-calculator` | visitor insurance deductible calculator · visitor insurance coinsurance calculator · visitor insurance copay calculator · $0 vs $250 deductible visitor insurance · how visitor insurance deductible works · 80/20 coinsurance visitor insurance · deductible per incident vs policy period | 3 |
| `/tools/visitor-insurance-hospital-bill-calculator` | visitor insurance hospital bill calculator · visitor insurance ER cost · emergency room visitor insurance · urgent care visitor insurance · hospital cost with visitor insurance · ambulance coverage visitor insurance · how much will visitor insurance pay for hospital | 3 |
| `/tools/visitor-insurance-network-cost-calculator` | visitor insurance in network vs out of network · PPO visitor insurance calculator · out of network visitor insurance cost · allowed amount visitor insurance · balance billing visitor insurance · visitor insurance network calculator | 3 |
| `/tools/visitor-insurance-policy-maximum-calculator` | visitor insurance policy maximum · visitor insurance out of pocket maximum · visitor insurance maximum liability · $50,000 vs $100,000 visitor insurance · visitor insurance coverage limit calculator · what happens after visitor insurance maximum | 3 |
| `/visitor-insurance/pre-existing-conditions-acute-onset` | visitor insurance pre existing conditions · acute onset of pre existing condition visitor insurance · visitor insurance diabetes coverage · visitor insurance high blood pressure · visitor insurance heart attack coverage · parents visitor insurance pre existing conditions | 3 |
| `/visitor-insurance/how-much-coverage` | how much visitor insurance coverage do I need · $50,000 vs $100,000 visitor insurance (decision-framework angle, vs. the maximum-calculator's liability-math angle) · $100,000 vs $250,000 visitor insurance · policy maximum for parents visiting USA · visitor insurance coverage amount | 4 |
| `/visitor-insurance/glossary` | visitor insurance terms · visitor insurance glossary · visitor insurance deductible meaning · visitor insurance coinsurance meaning · visitor insurance policy maximum meaning · acute onset meaning · visitor insurance PPO meaning | 4 |
| `/visitor-insurance/methodology` | (trust/E-E-A-T page, not keyword-targeted — linked from every calculator result) | 4 |

## Cannibalization checks

- **"$50,000 vs $100,000 visitor insurance" appears twice** (`how-much-coverage` and, implicitly,
  the policy-maximum calculator). Resolved by angle, not keyword: `how-much-coverage` owns the
  *decision-framework* angle ("how much should I buy, given my risk factors") and embeds the
  policy-maximum calculator rather than competing with it; the calculator owns the *liability-math*
  angle ("given this specific maximum, what's my exposure"). Internal link from
  `how-much-coverage` → calculator uses this distinction explicitly in the anchor text.
- **"visitor insurance for parents"** is owned by `parents-visiting-usa`, not the hub — the hub's
  "who usually purchases it" section mentions parents in passing and links out, it does not try
  to rank for the parents-specific query itself.
- **Comprehensive vs fixed-benefit** content appears on both the hub (one explainer section, per
  the required hub sections list) and its own dedicated page. The hub section stays short
  (definition + why it matters) and links to `/visitor-insurance/fixed-benefit-vs-comprehensive`
  for the full comparison engine + examples — the hub must not attempt to duplicate the dedicated
  page's depth or it competes for the same terms.
- **Glossary terms vs. explainer sections**: the hub's deep sections (deductible/copay/coinsurance
  "explained with numbers") and the glossary's entries cover the same terms at different depth —
  hub sections are contextual explainers inside the buying-decision narrative; the glossary is the
  standalone reference page ("visitor insurance glossary", "acute onset meaning" as direct
  definitional queries). Glossary entries link back to the relevant calculator per spec; hub
  sections link to the glossary for the full definition instead of restating it.

## Long-tail coverage (no dedicated pages — covered in headings/FAQ/body only)

All long-tail terms listed in the build brief (cost/liability, networks, hospital scenarios,
parents by age band, plan design, pre-existing conditions, buying/comparing) are assigned to the
page above whose primary intent they extend — e.g. "visitor insurance for parents over 65" is a
heading/example inside `parents-visiting-usa`, "80/20 coinsurance" is a worked example inside
`deductible-coinsurance-calculator`, "acute onset meaning" is both a glossary entry and a section
of `pre-existing-conditions-acute-onset`. Do not create `/visitor-insurance/parents-over-65` or
similar per-term pages.
