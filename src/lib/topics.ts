import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    slug: "finance",
    title: "Personal Finance",
    label: "Finance",
    description:
      "Budgeting, banking, and building wealth in dollars — the fundamentals every NRI should master after landing in the US.",
    icon: "💵",
    accent: "from-emerald-500 to-teal-600",
    seoTitle: "Finance Guides for NRIs in the USA",
    seoDescription:
      "Learn banking, credit cards, taxes, investing, insurance, emergency funds, 401k, Roth IRA, and money basics for immigrants in the USA.",
  },
  {
    slug: "taxes",
    title: "Taxes & Filing",
    label: "Taxes",
    description:
      "US tax returns, FBAR, double taxation, India income, and what the India–US tax treaty actually means for you.",
    icon: "🧾",
    accent: "from-rose-500 to-pink-600",
    seoTitle: "US Tax Guides for NRIs & Immigrants",
    seoDescription:
      "FBAR, FATCA, DTAA, the Substantial Presence Test, PFICs, and how to file your first US tax return as an NRI or visa holder.",
  },
  {
    slug: "credit",
    title: "Credit & Cards",
    label: "Credit",
    description:
      "Build a US credit score from zero, choose the right cards, and avoid the mistakes that haunt new immigrants.",
    icon: "💳",
    accent: "from-violet-500 to-purple-600",
    seoTitle: "Build US Credit: Card & Score Guides for NRIs",
    seoDescription:
      "How to build a US credit score from zero, choose the best secured credit cards, and avoid the credit mistakes new immigrants make.",
  },
  {
    slug: "housing",
    title: "Housing & Renting",
    label: "Housing",
    description:
      "Renting your first apartment, understanding leases, and the path from tenant to first-time homebuyer.",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
    seoTitle: "Renting and Buying a Home in the USA for NRIs",
    seoDescription:
      "Simple guides for NRIs on renting apartments, leases, mortgages, buying property, and deciding whether to rent or buy in the USA.",
  },
  {
    slug: "property",
    title: "Buying Property",
    label: "Property",
    description:
      "Mortgages on a visa, down payments, closing costs, and buying real estate both in the US and back in India.",
    icon: "🔑",
    accent: "from-orange-500 to-red-600",
    seoTitle: "Buying & Selling US Property as an NRI",
    seoDescription:
      "Mortgages on a visa, FHA loans, down payments, FIRPTA, and buying or selling a home in the US as an NRI or visa holder.",
  },
  {
    slug: "cars",
    title: "Cars & Driving",
    label: "Cars",
    description:
      "Buy vs. lease, financing without credit history, insurance, and getting your license as a newcomer.",
    icon: "🚗",
    accent: "from-sky-500 to-blue-600",
    seoTitle: "Car Buying and Driving Guides for Immigrants",
    seoDescription:
      "Learn how to buy, finance, insure, register, and maintain a car in the USA as a new immigrant, student, or NRI family.",
  },
  {
    slug: "investing",
    title: "Investing",
    label: "Investing",
    description:
      "Index funds, brokerage accounts, and growing your portfolio — plus the PFIC rules NRIs must know.",
    icon: "📈",
    accent: "from-green-500 to-emerald-600",
    seoTitle: "Investing in the USA for NRIs & Immigrants",
    seoDescription:
      "Index funds, brokerage accounts, the PFIC trap, and how NRIs and visa holders can invest and build wealth in the USA.",
  },
  {
    slug: "retirement",
    title: "401(k) & Roth IRA",
    label: "Retirement",
    description:
      "Employer matches, Roth vs. traditional, and what happens to your retirement accounts if you move back to India.",
    icon: "🏦",
    accent: "from-indigo-500 to-blue-700",
    seoTitle: "401(k) & Roth IRA Guides for NRIs",
    seoDescription:
      "Employer match, Roth vs traditional, backdoor Roth, 72(t), HSAs, and what happens to your 401(k) if you move back to India.",
  },
  {
    slug: "money-transfer",
    title: "India–USA Transfers",
    label: "Transfers",
    description:
      "Remittances, the best transfer services, exchange rates, NRE/NRO accounts, and moving money tax-smart.",
    icon: "🔁",
    accent: "from-cyan-500 to-teal-600",
    seoTitle: "India-USA Money Transfer & NRI Finance Guides",
    seoDescription:
      "Guides on sending money to India, bringing money to the USA, NRI bank accounts, property, investments, and cross-border finance.",
  },
  {
    slug: "community",
    title: "Community & Life",
    label: "Community",
    description:
      "Settling in, building a network, healthcare, schooling, and finding your people in a new country.",
    icon: "🤝",
    accent: "from-fuchsia-500 to-pink-600",
    seoTitle: "NRI Community & Settling-in Guides",
    seoDescription:
      "Building community, healthcare, dependents, and settling into life in the USA as a new immigrant or NRI family.",
  },
  {
    slug: "stories",
    title: "Immigrant Stories",
    label: "Stories",
    description:
      "First-person journeys from H-1B to green card to citizenship — the wins, setbacks, and lessons learned.",
    icon: "✨",
    accent: "from-purple-500 to-indigo-600",
    seoTitle: "NRI Immigrant Stories & Journeys",
    seoDescription:
      "First-person journeys from H-1B to green card and beyond — real lessons from NRIs and immigrants building a life in the USA.",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getTopicTitle(slug: string): string {
  return getTopic(slug)?.title ?? slug;
}
