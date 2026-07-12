/**
 * Single source of truth for the Life Insurance (Indian-family) cluster:
 *   /life-insurance-for-indian-families-usa          (pillar)
 *   /term-life-insurance-for-indian-families-usa
 *   /indexed-universal-life-iul-for-indian-families-usa
 *   /term-vs-iul-for-indian-families-usa
 *
 * COMPLIANCE RULES for every page in this cluster (do not violate):
 *   - Never say IUL is guaranteed tax-free wealth.
 *   - Never say everyone should buy IUL.
 *   - Never promise or project investment returns.
 *   - Never call IUL a replacement for retirement accounts.
 *   - Always disclose: policy charges, caps, floors, participation rates,
 *     loan interest, lapse risk, and possible tax consequences.
 *   - Always explain that loans/withdrawals may reduce the death benefit and
 *     can create tax issues if the policy lapses.
 *   - Always mention MEC (modified endowment contract) risk in plain English.
 *   - Every page carries exactly two disclaimers: LIFE_TOP_DISCLAIMER (short,
 *     near the top) and LIFE_BOTTOM_DISCLAIMER (fuller, at the bottom). Do not
 *     stack extra full disclaimer blocks mid-page. The calculator additionally
 *     shows TERM_CALC_DISCLAIMER verbatim beside its inputs and result.
 *   - No dollar premium quotes — costs "vary by age, health, state, and insurer".
 *   - External links only at the END of the page (official source box).
 */
import type { FaqItem } from "@/lib/seo";

/* ------------------------------------------------------------------ *
 * Disclaimers.
 *
 * Each page shows exactly TWO: one short prominent disclaimer near the top
 * (LIFE_TOP_DISCLAIMER) and one fuller disclaimer at the bottom
 * (LIFE_BOTTOM_DISCLAIMER). Do not stack additional full disclaimer blocks
 * mid-page — that is the repetition we removed on purpose.
 * ------------------------------------------------------------------ */
/** Short, prominent — shown once near the top of every page. */
export const LIFE_TOP_DISCLAIMER =
  "This guide is educational only and is not personalized insurance, tax, legal, investment, or financial advice. Review your situation with a licensed insurance professional in your state.";

/** Fuller — shown once at the bottom/footer of every page. */
export const LIFE_BOTTOM_DISCLAIMER =
  "Life insurance products are regulated by state insurance departments. Policy features, costs, guarantees, exclusions, loans, withdrawals, and tax treatment vary by insurer and contract. This content does not recommend a specific policy, insurer, coverage amount, or product. Speak with a licensed insurance professional and qualified tax advisor before buying or changing a policy.";

/** Verbatim disclaimer shown next to the needs calculator and its result. */
export const TERM_CALC_DISCLAIMER =
  "This calculator is for educational planning only and is not personalized insurance, tax, legal, investment, or financial advice. It does not recommend a specific policy, insurer, coverage amount, or product. Life insurance products are regulated by state insurance departments. Review your situation with a licensed insurance professional in your state.";

/**
 * Trust note (this cluster is not monetized — no affiliate/agent-referral
 * links today). If referral/affiliate links are ever added, swap this for
 * LIFE_REFERRAL_DISCLOSURE near the CTA instead.
 */
export const LIFE_TRUST_NO_SELL_NOTE =
  "NRI to USA does not sell life insurance. This guide is educational and designed to help families ask better questions before speaking with a licensed professional.";

/** Kept ready for the day a partner/referral link appears near a CTA. */
export const LIFE_REFERRAL_DISCLOSURE =
  "NRI to USA may receive compensation from partner links or referrals. This does not change our educational content. We do not recommend a specific insurer, policy, or product.";

/* ------------------------------------------------------------------ *
 * E-E-A-T block content
 * ------------------------------------------------------------------ */
export const LIFE_EEAT_TITLE = "Why this guide is different for Indian families";

/** Per-page unique "why this guide is different" paragraph (keyed by path). */
export const lifeEeatByPath: Record<string, string> = {
  "/life-insurance-for-indian-families-usa":
    "Most life insurance guides are written for a generic U.S. household. Indian and NRI families often have a different planning picture: U.S. mortgage or rent, H-1B job risk, children’s education, parents in India, and possible return-to-India plans. This guide connects those real obligations before comparing term insurance, IUL, and other planning options.",
  "/term-life-insurance-for-indian-families-usa":
    "For Indian families in the U.S., term insurance is not just about replacing income. It may also need to cover mortgage payments, childcare, college goals, visa disruption, and financial support for parents or family members in India. This page focuses only on protection-first coverage so families can estimate the gap before discussing policies.",
  "/indexed-universal-life-iul-for-indian-families-usa":
    "IUL is often presented as a tax-advantaged wealth tool, but Indian and immigrant families should understand the policy mechanics before treating it like an investment. This guide explains cash value, caps, floors, loans, policy charges, lapse risk, and tax treatment in plain English so families can ask better questions before buying.",
  "/term-vs-iul-for-indian-families-usa":
    "Many families are shown term and IUL as competing choices, but they solve different problems. Indian families may first need low-cost protection for income, mortgage, children, and India obligations, while permanent insurance may only fit certain long-term planning cases. This comparison helps separate protection needs from wealth-planning discussions.",
  "/term-life-insurance-needs-calculator-indian-families":
    "Most life insurance calculators ignore cross-border obligations. This calculator includes U.S. needs such as mortgage, income replacement, children, and debts, plus India or home-country responsibilities like parent support, property loans, and emergency travel. The result is only an educational estimate, but it gives families a better starting point for an agent discussion.",
};

export const LIFE_EEAT_CREDENTIAL =
  "Educational content reviewed for plain-English accuracy. Nothing here is a policy recommendation, an offer of insurance, or a substitute for advice from a licensed insurance professional in your state.";
export const LIFE_SOURCES_REVIEWED = "NAIC, state insurance departments, IRS, and FINRA";

/** Heading for the end-of-page official-sources box on insurance pages. */
export const LIFE_SOURCE_HEADING = "Official & regulatory sources";

/** "For insurance professionals" trust-box copy (P5). */
export const LIFE_PRO_BOX_TITLE = "For insurance professionals";
export const LIFE_PRO_BOX_TEXT =
  "This page is written as a client-friendly educational resource for Indian and immigrant families in the U.S. It does not recommend a specific insurer, policy, or product. Licensed agents may use it as a starting point for a broader protection-planning discussion.";

/* ------------------------------------------------------------------ *
 * Official sources ONLY (regulators + IRS). Linked at the END of pages.
 * ------------------------------------------------------------------ */
export const lifeInsuranceSourceLinks: { label: string; href: string }[] = [
  {
    label: "NAIC — Life Insurance consumer guide (naic.org)",
    href: "https://content.naic.org/insurance-topics/life-insurance",
  },
  {
    label: "NAIC — Find your state insurance department",
    href: "https://content.naic.org/state-insurance-departments",
  },
  {
    label: "IRS — Life insurance & disability insurance proceeds",
    href: "https://www.irs.gov/faqs/interest-dividends-other-types-of-income/life-insurance-disability-insurance-proceeds",
  },
  {
    label: "FINRA — Indexed Universal Life insurance investor insight",
    href: "https://www.finra.org/investors/insights/indexed-universal-life-insurance",
  },
];

export const lifeInsuranceSourceIntro =
  "Life insurance is regulated by state insurance departments, and tax treatment is set by the IRS. Policy features, costs, guarantees, caps, floors, and loan terms vary by insurer and contract — always verify against your own policy documents and these official sources:";

/* ------------------------------------------------------------------ *
 * "Which page should you read?" pointers
 * ------------------------------------------------------------------ */
export const lifeWhichPagePointers: { href: string; text: string }[] = [
  {
    href: "/life-insurance-for-indian-families-usa",
    text: "Start here: why life insurance matters for Indian families in the U.S.",
  },
  {
    href: "/term-life-insurance-for-indian-families-usa",
    text: "How much term coverage does your family need?",
  },
  {
    href: "/term-life-insurance-needs-calculator-indian-families",
    text: "Estimate your coverage gap with the needs calculator",
  },
  {
    href: "/indexed-universal-life-iul-for-indian-families-usa",
    text: "How IUL actually works — benefits, risks, and what “tax-free” really means",
  },
  {
    href: "/term-vs-iul-for-indian-families-usa",
    text: "Term vs IUL side by side — which one should you review?",
  },
];

/* ------------------------------------------------------------------ *
 * Term vs IUL comparison table (structural match for ComparisonTable)
 * ------------------------------------------------------------------ */
export interface LifeComparisonColumn {
  key: string;
  label: string;
  highlight?: boolean;
}
export interface LifeComparisonRow {
  feature: string;
  values: Record<string, string>;
}

export const termVsIulColumns: LifeComparisonColumn[] = [
  { key: "term", label: "Term Life" },
  { key: "iul", label: "Indexed Universal Life (IUL)" },
];

export const termVsIulRows: LifeComparisonRow[] = [
  {
    feature: "Purpose",
    values: {
      term: "Pure income protection for a set number of years — pays a death benefit if you die during the term.",
      iul: "Permanent coverage plus a cash-value component with index-linked crediting, if the policy is funded and stays in force.",
    },
  },
  {
    feature: "Coverage length",
    values: {
      term: "A fixed term — commonly 10, 20, or 30 years — then coverage ends or renews at much higher rates.",
      iul: "Designed to last for life, but only if premiums and policy charges keep the policy funded.",
    },
  },
  {
    feature: "Cost",
    values: {
      term: "Usually the lowest-cost way to buy a large death benefit; cost varies by age, health, state, and insurer.",
      iul: "Meaningfully higher premiums for the same death benefit, because part of the premium funds cash value and policy charges.",
    },
  },
  {
    feature: "Cash value",
    values: {
      term: "None — term has no savings or investment component.",
      iul: "Builds cash value credited by an index-linked formula, limited by caps and participation rates, reduced by policy charges.",
    },
  },
  {
    feature: "Complexity",
    values: {
      term: "Simple: pick a coverage amount, a term length, and beneficiaries.",
      iul: "Complex: caps, floors, participation rates, charges, loans, and illustration assumptions all need review.",
    },
  },
  {
    feature: "Tax treatment",
    values: {
      term: "Death benefit is generally income-tax-free to beneficiaries.",
      iul: "Death benefit generally income-tax-free; cash value grows tax-deferred; loans/withdrawals can become taxable if the policy lapses or is a MEC.",
    },
  },
  {
    feature: "Best fit",
    values: {
      term: "Most families who mainly need income replacement during working and child-raising years.",
      iul: "Some families who already have basic protection and want permanent coverage — only after understanding costs and risks.",
    },
  },
  {
    feature: "Main risk",
    values: {
      term: "Outliving the term with a remaining need, or waiting until health changes make new coverage expensive.",
      iul: "Underfunding or heavy loans causing the policy to lapse — which can end coverage and create a tax bill.",
    },
  },
];

/* ------------------------------------------------------------------ *
 * Questions to ask a licensed insurance agent (shared bank)
 * ------------------------------------------------------------------ */
export const agentQuestionsGeneral: string[] = [
  "Are you licensed in my state, and which insurers can you offer?",
  "How did you calculate the coverage amount you are recommending for my family?",
  "What happens to this policy if I change jobs, lose my visa status, or move back to India?",
  "What does this policy cost per year, and which charges come out of my premium?",
  "Is any part of this illustration guaranteed, and what happens in the worst-case (guaranteed) column?",
  "How are you compensated on this product compared with the alternatives?",
];

export const agentQuestionsIul: string[] = [
  "What are the current cap, floor, and participation rates — and how much can the insurer change them?",
  "Show me the guaranteed column of the illustration, not just the projected one. Does the policy survive on guarantees alone?",
  "What are all the policy charges (cost of insurance, premium loads, admin and rider fees), and how do they change with age?",
  "What is the loan interest rate, and what happens to the policy if I borrow and the market credits 0% for several years?",
  "At what funding level would this policy become a MEC, and how will you make sure it does not?",
  "If I stop paying premiums for two years, when exactly would this policy lapse — and what would the tax bill be?",
];

/** Agent discussion checklist shown with the needs-calculator result. */
export const agentQuestionsCalculator: string[] = [
  "How did you calculate this coverage amount?",
  "What term lengths are available?",
  "Is the policy convertible?",
  "What happens if I move back to India?",
  "Can beneficiaries be in India?",
  "What happens if I lose my job or visa status?",
  "How much coverage is portable outside employer insurance?",
];

/* ------------------------------------------------------------------ *
 * Per-page FAQ sets (must match visible FAQ content on each page)
 * ------------------------------------------------------------------ */
export const lifePillarFaqs: FaqItem[] = [
  {
    question: "Do Indian families in the U.S. really need life insurance?",
    answer:
      "If anyone depends on your income — a spouse, children, or parents in India — a death would leave a financial gap that savings alone rarely covers, especially in early U.S. years. Life insurance is how U.S. families typically fill that gap. Whether you need it, and how much, depends on your income, debts, and dependents, which is why the decision should be reviewed with a licensed insurance professional.",
  },
  {
    question: "Can H-1B visa holders buy life insurance in the U.S.?",
    answer:
      "Generally yes — many U.S. insurers issue policies to visa holders who live and work in the U.S., though underwriting rules on visa type, residency history, and travel vary by insurer. An agent licensed in your state can tell you which insurers work with your situation.",
  },
  {
    question: "Is the free life insurance from my employer enough?",
    answer:
      "Usually not by itself. Employer coverage is commonly 1–2 times salary, ends or shrinks when you leave the job, and is not portable in most cases. Most planning frameworks treat employer coverage as a supplement, not the foundation.",
  },
  {
    question: "What happens to a U.S. life insurance policy if we move back to India?",
    answer:
      "It depends on the insurer and the contract. Some policies can be maintained from abroad if premiums are paid and the insurer permits it; others have residency-related restrictions. Ask this question in writing before you buy if a return to India is realistic for your family.",
  },
  {
    question: "Should we buy term insurance or permanent insurance first?",
    answer:
      "For most families the first priority is having enough coverage, and term insurance is usually the lowest-cost way to get there. Permanent policies like IUL are a separate, more complex decision that generally makes sense to review only after basic protection, emergency savings, and retirement contributions are in place.",
  },
  {
    question: "Does life insurance cover my parents in India?",
    answer:
      "A U.S. policy on your life can protect parents financially by naming them among your beneficiaries — many NRIs support parents in India, and that support would stop if the earner died. Insuring the parents' own lives is a different product question with its own residency and underwriting rules; discuss it with a licensed agent.",
  },
];

export const lifeTermFaqs: FaqItem[] = [
  {
    question: "How much term life insurance coverage do I need?",
    answer:
      "A common educational framework adds up income replacement for several years, remaining mortgage or rent runway, childcare, college goals, other debts, an emergency transition fund, and any support for a spouse or parents — then subtracts savings and existing coverage. The result is a starting point for a conversation with a licensed agent, not a rule.",
  },
  {
    question: "Should I choose a 10, 20, or 30-year term?",
    answer:
      "Match the term to how long people will depend on your income: many families align it with the years until children are independent, the mortgage is paid, or retirement savings can stand on their own. A newborn at home often points toward 20–30 years; a shorter remaining need may point toward less.",
  },
  {
    question: "Is my employer's group life insurance enough?",
    answer:
      "For most families with dependents, no. Group coverage is typically capped at a small multiple of salary and usually disappears when the job ends — including in a layoff, which is exactly when an H-1B family is under the most pressure. A personally owned policy stays with you.",
  },
  {
    question: "Does term life insurance build any cash value?",
    answer:
      "No. Term insurance is pure protection: if you outlive the term, the policy simply ends. That is also why it costs much less than permanent insurance for the same death benefit.",
  },
  {
    question: "What happens to my term policy if I move back to India?",
    answer:
      "Many insurers allow an existing policy to continue if premiums keep being paid, but rules on foreign residency vary by insurer and contract. If a return to India is realistic, ask the agent to confirm the insurer's rules in writing before you buy.",
  },
  {
    question: "Can I buy more than one term policy?",
    answer:
      "Often yes, subject to insurer limits tied to your income. Some families layer (“ladder”) policies — for example a larger policy for the child-raising years and a smaller, longer one — so coverage steps down as needs shrink. A licensed agent can show whether laddering fits your numbers.",
  },
];

export const lifeIulFaqs: FaqItem[] = [
  {
    question: "Is IUL tax-free?",
    answer:
      "Not automatically, and it is not guaranteed tax-free wealth. The death benefit is generally income-tax-free to beneficiaries, and cash value grows tax-deferred. Policy loans may be income-tax-free only while the policy stays in force and is not a modified endowment contract (MEC); withdrawals above what you paid in may be taxable; and if a policy lapses with loans outstanding, the result can be a significant tax bill.",
  },
  {
    question: "Is IUL a good investment?",
    answer:
      "IUL is life insurance with a cash-value feature, not an investment account, and no one can promise what it will return. Index-linked crediting is limited by caps and participation rates, reduced by policy charges, and illustrations are projections, not guarantees. It should be judged first as insurance.",
  },
  {
    question: "What is a MEC in plain English?",
    answer:
      "A modified endowment contract is what a policy becomes when too much premium is paid in too fast under IRS limits. A MEC keeps its death benefit, but loans and withdrawals lose their favorable tax treatment — money coming out is taxed gains-first and may face a penalty before age 59½. Insurers test for this, but you should confirm in writing that a proposed funding plan avoids MEC status if that matters to you.",
  },
  {
    question: "What happens if I stop paying IUL premiums?",
    answer:
      "Policy charges keep coming out of the cash value every month. If the cash value runs out, the policy lapses — coverage ends, and if loans were outstanding, the lapse can also trigger income tax. This lapse risk is one of the most important differences between IUL and term insurance.",
  },
  {
    question: "Can the insurer change my caps and participation rates?",
    answer:
      "Usually yes, within limits set by the contract. Caps and participation rates are typically declared by the insurer and can move over time, which is why a policy should be evaluated on its guaranteed terms as well as its current ones.",
  },
  {
    question: "Is IUL a replacement for my 401(k) or Roth IRA?",
    answer:
      "No. IUL is not a replacement for retirement accounts. Workplace plans and IRAs have their own tax advantages, low costs, and (often) employer matches. Most educational frameworks treat IUL as something some families review after retirement basics and emergency savings are already funded.",
  },
];

export const lifeCalcFaqs: FaqItem[] = [
  {
    question: "How does this term life insurance needs calculator work?",
    answer:
      "It adds up your family's obligations — income replacement, mortgage, other U.S. debts, children's education, a spouse transition fund, final expenses, a relocation fund, and India/home-country support and debts — then subtracts existing savings, individual and employer life insurance, and expected spouse income support. The difference is an estimated coverage gap, shown with a conservative 80%–120% range. It is an educational estimate, not a recommendation.",
  },
  {
    question: "Is the result a recommendation of how much insurance to buy?",
    answer:
      "No. The result is an educational starting point for a conversation with a licensed insurance professional. Only a licensed agent, working with your full situation and your state's rules, can recommend a coverage amount, product, or policy.",
  },
  {
    question: "Why does the calculator include support sent to parents in India?",
    answer:
      "Because for many Indian and NRI families it is a real, ongoing obligation that would stop the day the earner dies. Standard U.S. calculators ignore it. If you send money home every month, multiplying that support by the years you intend it to continue turns it into a number your coverage can actually protect.",
  },
  {
    question: "Should I include my India home loan or property debt?",
    answer:
      "If your family would still owe it — or would need to settle it to keep or sell the property — include it. Cross-border estates get complicated quickly, and a debt in India does not disappear because the earner lived in the U.S. A licensed agent and a cross-border tax or legal professional can help with the details.",
  },
  {
    question: "Why does the calculator show a range instead of one number?",
    answer:
      "Because every input is an estimate. The 80% figure shows a lower bound if your inputs were conservative, 100% is your base estimate, and 120% adds a cushion for inflation and estimation error. The range is meant to frame a discussion, not to be precise.",
  },
  {
    question: "Does the calculator quote premiums or prices?",
    answer:
      "No. Premiums depend on age, health, term length, coverage amount, state, and insurer underwriting — none of which this calculator evaluates. For actual pricing you need quotes through a licensed insurance professional.",
  },
  {
    question: "Why subtract employer life insurance if it isn't portable?",
    answer:
      "The calculator subtracts it because it exists today — but treat that line skeptically. Employer coverage usually ends when the job does, including layoffs, which is why the agent checklist asks how much coverage is portable. Some families deliberately leave employer coverage out to be conservative; the calculator lets you enter zero for exactly that reason.",
  },
  {
    question: "What term length should I choose?",
    answer:
      "Match the term to how long the obligations last. As a general educational pattern: families with a child under 5 often review 25–30 year terms, families with school-age children review 20–25 years, and shorter needs — a small remaining mortgage or nearly independent kids — may point to 10–20 years. Always verify the fit with a licensed agent.",
  },
  {
    question: "Is my information saved anywhere?",
    answer:
      "No. The calculator runs entirely in your browser — nothing you type is sent to a server, stored, or shared.",
  },
];

export const lifeVsFaqs: FaqItem[] = [
  {
    question: "Which is cheaper — term or IUL?",
    answer:
      "For the same death benefit, term is almost always significantly cheaper, because IUL premiums also fund cash value and policy charges. Actual costs vary by age, health, state, and insurer, so comparisons should use real quotes from a licensed agent.",
  },
  {
    question: "Can I start with term and convert to permanent later?",
    answer:
      "Many term policies include a conversion option that lets you switch to a permanent policy within a set window without new medical underwriting. Deadlines and available products vary by insurer, so if conversion matters to you, confirm the details before buying the term policy.",
  },
  {
    question: "Can a family own both term and IUL?",
    answer:
      "Yes — some families use term for the large protection need during working years and a smaller permanent policy for lifelong goals. Whether the combination is worth its cost depends on your budget and goals, which is a conversation for a licensed agent and tax advisor.",
  },
  {
    question: "Should I replace a policy I already own?",
    answer:
      "Be careful. Replacing an existing policy can trigger surrender charges, new contestability periods, higher costs at your current age, and possible tax consequences — state replacement regulations exist because switching often benefits the seller more than the buyer. Get the comparison in writing and review it with a licensed professional before cancelling anything.",
  },
  {
    question: "Who regulates life insurance in the U.S.?",
    answer:
      "State insurance departments regulate insurers, products, and agents; agents must be licensed in your state. Tax treatment of policies is governed by federal tax law. You can verify any agent's license through your state insurance department.",
  },
];
