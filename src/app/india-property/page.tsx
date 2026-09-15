import type { Metadata } from "next";
import MoneyHub, { type MoneyHubConfig } from "@/components/MoneyHub";
import { pageMetadata } from "@/lib/seo";

const config: MoneyHubConfig = {
  showReturnToIndiaLeadMagnet: true,
  path: "/india-property",
  breadcrumb: "India Property",
  icon: "🏠",
  accent: "from-amber-600 to-orange-700",
  title: "India Property Planning",
  intro:
    "Own property in India while living in the USA? This hub walks through the decisions that actually move the needle: whether to sell or hold, how capital gains and TDS work, how to repatriate the proceeds, how to grant a power of attorney so someone can sign for you in India, and what happens to inherited property — all from a cross-border US/India tax angle.",
  covers: [
    "Sell vs hold",
    "Capital gains on India property",
    "TDS on property sale",
    "Repatriation of sale proceeds",
    "Inheritance of India property",
    "Power of attorney from the USA",
    "US tax reporting on India real estate",
  ],
  articleSlugs: [
    "sell-india-property-before-retirement-usa",
    "repatriate-india-property-sale-usa",
    "inheriting-indian-assets-us-tax",
    "investment-property-usa-vs-india",
    "us-kids-india-property-problems",
    "buying-india-property-for-children",
  ],
  tools: [
    { label: "India property capital gains calculator", href: "/calculators/india-property-capital-gains", kind: "Calculator" },
    { label: "NRI power of attorney route builder", href: "/power-of-attorney-for-india-from-usa#poa-builder", kind: "Tool" },
    { label: "DTAA foreign tax credit", href: "/calculators/dtaa-foreign-tax-credit", kind: "Calculator" },
    { label: "FBAR/FATCA risk checker", href: "/tools/fbar-fatca-checker", kind: "Tool" },
    { label: "India Tax & Compliance hub", href: "/india-tax-compliance", kind: "Hub" },
  ],
  primaryCta: { label: "Calculate capital gains", href: "/calculators/india-property-capital-gains" },
  deepDive: {
    eyebrow: "Work out which problem you have",
    title: "Four situations, four completely different answers",
    description:
      "Almost every question about India property from the USA is really one of four questions, and the advice for each contradicts the others. Place yourself first — then the guides below are worth reading in order rather than at random.",
    blocks: [
      {
        kind: "table",
        heading: "Which situation are you in?",
        headers: ["Your situation", "What it actually triggers", "Where to go"],
        rows: [
          [
            "Holding, and letting it out",
            "Indian tax on the rental income and an Indian return to file — and, separately, the same rent is taxable on your US return, with foreign-tax credit relief rather than an exemption. The Indian account the rent lands in is also what can push you over the FBAR threshold.",
            "India Tax & Compliance hub · FBAR/FATCA checker · DTAA credit calculator",
          ],
          [
            "Holding, empty, 'deciding later'",
            "The quiet case, and the one that goes wrong. Nothing is due, so nothing prompts you — while the people who could act for you in India get older and the paperwork you would need gets harder to assemble.",
            "Power of attorney guide · Should NRIs keep investments in India?",
          ],
          [
            "Selling",
            "TDS withheld by the buyer on the sale value rather than on the gain, a lower-deduction certificate if you want that cash now instead of at refund time, capital gains computed twice on two different bases, and a repatriation process after.",
            "NRI selling property in India · capital gains calculator",
          ],
          [
            "Inheriting, or leaving it to US-based children",
            "Succession rather than tax is the binding constraint: title, heirs, and whether children who have never lived in India can realistically administer or sell it.",
            "Inheriting Indian assets · Why US-born kids struggle with India property",
          ],
        ],
        note:
          "The four are not mutually exclusive over time — most NRIs pass through holding, then selling, and the decisions made in the first phase determine how painful the second is.",
      },
      {
        kind: "callout",
        tone: "warn",
        heading: "The one thing to do before you need it",
        paragraphs: [
          "A sale in India needs a signature at the Sub-Registrar's counter, and you cannot give it from New Jersey. The instrument that solves this — a properly executed, attested and registered power of attorney — takes weeks to put in place and has to be done while you and your attorney-holder are both able to act.",
          "Sorted in advance, it is a piece of admin. Left until a buyer is waiting, a parent is unwell, or an heir is disputing, it becomes the reason a sale falls through. It is the highest-value thing on this page for anyone in the 'deciding later' row above.",
        ],
      },
      {
        kind: "prose",
        heading: "Why the gain is a different number in each country",
        paragraphs: [
          "The single most common surprise in this cluster is that your Indian capital gain and your US capital gain are not the same figure, and neither is wrong. India and the US allow different adjustments to cost, and the US computes the gain in dollars — translating the purchase price at the rate when you bought and the sale price at the rate when you sold.",
          "That currency translation can move the result in either direction independently of what the property did in rupees. It is why the answer to 'how much tax will I pay' requires both calculations, and why relief comes through the foreign tax credit rather than through only being taxed once.",
        ],
      },
    ],
    footnote:
      "Educational only, not tax advice. Cross-border property involves two tax systems that treat the same transaction differently — the linked guides carry the current rates, thresholds and forms, and a cross-border adviser should see the numbers before you commit to a sale.",
  },
  relatedGuides: [
    {
      label: "NRI selling property in India: TDS, capital gains & repatriation",
      href: "/nri-selling-property-in-india-tds",
      blurb:
        "The full sale playbook: TDS rates on the sale value, the Form 13 lower-TDS certificate, US tax reporting, and bringing the proceeds to the USA.",
    },
    {
      label: "Power of attorney for India from USA: sell property without flying back",
      href: "/power-of-attorney-for-india-from-usa",
      blurb:
        "You cannot sign at the Sub-Registrar's counter from New Jersey. This is the instrument that lets someone sign for you — notary vs apostille vs consular attestation, the three-month stamping rule, registration, stamp duty, revocation and specimen formats.",
    },
    {
      label: "Should NRIs keep their investments in India?",
      href: "/india-investments/should-nris-keep-investments-in-india",
      blurb:
        "Property is one piece of the picture. This guide weighs keeping vs exiting your Indian mutual funds, FDs, and real estate once you're a US taxpayer.",
    },
  ],
};

export const metadata: Metadata = pageMetadata({
  title: "India Property Planning for NRIs — Sell vs Hold, Capital Gains, TDS & Repatriation",
  description:
    "For Indians in the USA with property in India: sell vs hold, capital gains and TDS, repatriating sale proceeds, power of attorney, and inheritance — with US/India tax in mind.",
  path: config.path,
});

export default function IndiaPropertyPage() {
  return <MoneyHub config={config} />;
}
