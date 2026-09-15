import type { Metadata } from "next";
import MoneyHub, { type MoneyHubConfig } from "@/components/MoneyHub";
import { pageMetadata } from "@/lib/seo";
import { returnToIndiaStatus as ST } from "@/data/returnToIndiaStatusData";
import {
  wealthReturnSnapshotRows,
  wealthReturnSources,
  WEALTH_RETURN_VERIFIED,
  WEALTH_RETURN_DISCLAIMER,
} from "@/data/siteWideVerifiedNumbers";

const config: MoneyHubConfig = {
  showReturnToIndiaLeadMagnet: true,
  path: "/return-to-india",
  breadcrumb: "Return to India",
  icon: "✈️",
  accent: "from-emerald-600 to-teal-700",
  title: "Retirement & Return to India",
  intro:
    "Thinking about moving back to India — this year or a decade from now? This hub covers what happens to your US retirement accounts and benefits, how RNOR status protects you, and how to plan currency timing so the move doesn't quietly cost you years of savings.",
  covers: [
    "Keeping — or losing — your green card",
    "The US exit tax on giving it up",
    "401(k) when you leave the USA",
    "IRA — Roth vs traditional",
    "Social Security after leaving the US",
    "RNOR residency status",
    "Currency planning & timing",
    "Cross-border retirement readiness",
  ],
  articleSlugs: [
    "what-happens-to-401k-leaving-usa",
    "transfer-401k-to-india-nps-ppf",
    "social-security-benefits-leaving-us",
    "roth-ira-vs-traditional-nri",
    "nri-retirement-usa-india-currency-risk",
    "hsa-after-leaving-usa",
  ],
  tools: [
    { label: "401(k) return-to-India calculator", href: "/calculators/401k-return-to-india", kind: "Calculator" },
    { label: "RNOR tax residency calculator", href: "/calculators/rnor-tax-residency", kind: "Calculator" },
    { label: "DTAA foreign tax credit", href: "/calculators/dtaa-foreign-tax-credit", kind: "Calculator" },
    { label: "FBAR/FATCA risk checker", href: "/tools/fbar-fatca-checker", kind: "Tool" },
    { label: "Shipping cost & customs duty calculator", href: "/shipping-household-goods-to-india", kind: "Calculator" },
  ],
  primaryCta: { label: "Model your 401(k) move", href: "/calculators/401k-return-to-india" },
  relatedGuides: [
    {
      label: "Should NRIs keep their investments in India?",
      href: "/india-investments/should-nris-keep-investments-in-india",
      blurb:
        "The other half of the move: what to do with the mutual funds, FDs, and property you still hold in India — and how the US taxes them while you're here.",
    },
    {
      label: "Bringing gold from the US to India",
      href: "/gold-limit-usa-to-india",
      blurb:
        "Duty-free allowances and the customs limits on gold you carry back when you relocate — plus what has to be declared on arrival.",
    },
  ],
  deepDive: {
    eyebrow: "Before the money questions",
    title: "The part of the move that is hard to undo",
    description:
      "The 401(k) and RNOR decisions below can all be revisited. Two things cannot: losing the immigration status that lets you come back, and the tax bill that can attach to formally giving it up. Almost every return-to-India guide skips both.",
    blocks: [
      {
        kind: "prose",
        heading: "Leaving for a year is a status decision, not a travel decision",
        paragraphs: [
          `If you hold a green card, the document is evidence of an intention to live in the United States permanently. Spend long enough abroad and that intention is no longer credible, and the status can be treated as abandoned — the card stops being a valid entry document, and getting back in becomes a consular problem rather than an airport formality. USCIS advises applying for a re-entry permit before any absence of ${ST.lpr.reentryPermitAdvisedAfterMonths} months or more.`,
          `The part people get wrong is assuming this is purely a day count. Abandonment turns on intent, so a trip shorter than a year can still cost the status if the surrounding facts say you moved — and the facts officers weigh are the ordinary evidence of a life: whether the trip was meant to be temporary, whether you kept US family and community ties, whether you kept US employment, and whether you kept filing US taxes as a resident. Selling the house, ending the job and filing as a non-resident while "trying India for a year" is a coherent story, and it is not the story you want told.`,
        ],
      },
      {
        kind: "table",
        heading: "What covers what",
        intro:
          "Three different instruments, depending on how long you are gone. The one you need has to be obtained in the right order — the first two are filed while you are still in the United States.",
        headers: ["How long you will be abroad", "What you need", "Where it comes from"],
        rows: [
          [
            "Months, with US ties intact",
            "Nothing extra — the green card itself",
            "Keep the evidence of intent: employment, tax filings, address, ties",
          ],
          [
            `About a year or more, up to ${ST.lpr.reentryPermitMaxYears} years`,
            `Re-entry permit (Form ${ST.lpr.forms.reentryPermit.id})`,
            "Applied for — and biometrics given — while you are physically in the US",
          ],
          [
            `Longer than ${ST.lpr.sb1NeededAfterYears} years`,
            "SB-1 returning resident visa",
            "A US embassy or consulate abroad, and it must be applied for and granted",
          ],
          [
            "You have decided not to return",
            `Voluntary abandonment (Form ${ST.lpr.forms.abandonment.id})`,
            "A deliberate filing — and a tax trigger, see below",
          ],
        ],
        note:
          "A re-entry permit cannot be applied for from India, which is the sequencing mistake that matters: by the time you realise you need one, you may no longer be in a position to get it.",
      },
      {
        kind: "callout",
        tone: "warn",
        heading: "Giving up the green card can trigger a US exit tax",
        paragraphs: [
          `Filing Form ${ST.lpr.forms.abandonment.id} ends your status cleanly, which is often exactly what someone settling permanently in India wants — it stops the US tax-residency obligations that otherwise follow the card. But if you have been a permanent resident in at least ${ST.expatriation.longTermResidentYears} of the last ${ST.expatriation.longTermResidentWindowYears} tax years, you are a "long-term resident" for tax purposes, and ending residency is an expatriation event.`,
          `Expatriating makes you a "covered expatriate" — subject to the mark-to-market exit tax — if your net worth is ${ST.expatriation.netWorthTest} or more, or your average annual net US income tax for the five preceding years exceeds an inflation-indexed threshold (${ST.expatriation.netIncomeTaxTest} for ${ST.expatriation.netIncomeTaxTestYear}), or you cannot certify ${ST.expatriation.certificationYears} years of tax compliance. Form ${ST.expatriation.form.id} is required either way, and failing to file it carries a ${ST.expatriation.penalty} penalty.`,
          `The practical consequence is one of sequencing, and it is the single most expensive thing on this page: the year you hand the card back, and where your unrealised gains sit at that moment, are planning variables. Decide them with a cross-border tax adviser before you file, not after.`,
        ],
      },
      {
        kind: "list",
        heading: "Which of these applies to you",
        intro:
          "The right answer depends entirely on the status you hold, and the three cases have almost nothing in common.",
        items: [
          {
            lead: "H-1B, L-1 or another temporary status:",
            body:
              "there is nothing to abandon and no exit tax — your status simply ends when the employment does. Your work is on the tax side: the year of departure is usually a split residency year, and the timing of your last day and your flight can change which country taxes what.",
          },
          {
            lead: "Green-card holder:",
            body:
              "both halves of this section apply. Decide deliberately whether you are keeping the status (and so need a re-entry permit and continued US filing as a resident) or ending it (and so need the expatriation analysis). Drifting into abandonment gets you the tax obligations without the benefit.",
          },
          {
            lead: "US citizen:",
            body:
              "you keep the right to return regardless, and you keep US tax filing obligations on worldwide income for as long as you hold the passport — living in India does not suspend them. Renouncing citizenship is its own expatriation event with the same covered-expatriate tests above. Most returning citizens keep the passport and take an OCI card for the India side.",
          },
        ],
      },
      {
        kind: "prose",
        heading: "Then get the arrival date right",
        paragraphs: [
          "Once status is settled, the highest-value remaining decision is when you land. Indian residency is assessed against the Indian financial year, and RNOR status — the window in which foreign income is generally outside the Indian net — depends on your day counts across years. Moving in February rather than April can therefore shift an entire tax year of foreign income from sheltered to taxable, for no reason other than the date on the ticket.",
          "That makes the arrival date worth modelling before it is booked, alongside the account decisions in the guides below.",
        ],
      },
    ],
    lastVerified: ST.verified,
    sources: [
      { label: "USCIS — international travel as a permanent resident", href: ST.lpr.travelGuidanceUrl },
      { label: `USCIS Form ${ST.lpr.forms.reentryPermit.id} (re-entry permit)`, href: ST.lpr.forms.reentryPermit.url },
      { label: `USCIS Form ${ST.lpr.forms.abandonment.id} (abandonment of LPR status)`, href: ST.lpr.forms.abandonment.url },
      { label: "IRS — expatriation tax", href: ST.expatriation.infoUrl },
      { label: `IRS Form ${ST.expatriation.form.id}`, href: ST.expatriation.form.url },
    ],
    footnote:
      "Educational only, and deliberately general — abandonment of permanent residence and expatriation are both fact-specific and irreversible. Confirm your own position with an immigration attorney and a cross-border tax adviser before acting on any of it.",
  },
  snapshot: {
    title: "Return-to-India money decisions — key numbers first",
    rows: wealthReturnSnapshotRows,
    badges: ["401(k) 10% early penalty", "SS 40 credits (~10 yrs)", "RNOR ~2–3 yrs"],
    lastVerified: WEALTH_RETURN_VERIFIED,
    sources: wealthReturnSources,
    disclaimer: WEALTH_RETURN_DISCLAIMER,
    ctaText: "Model your 401(k) move",
    ctaHref: "/calculators/401k-return-to-india",
  },
};

export const metadata: Metadata = pageMetadata({
  title: "Retirement & Return to India — 401(k), IRA, Social Security, RNOR & Currency",
  description:
    "Planning to move back to India? Keeping or abandoning your green card, the US exit tax on giving it up, what happens to your 401(k), IRA and Social Security, how RNOR status works, and how to time the move.",
  path: config.path,
});

export default function ReturnToIndiaPage() {
  return <MoneyHub config={config} />;
}
