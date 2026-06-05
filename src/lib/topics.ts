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
  },
  {
    slug: "taxes",
    title: "Taxes & Filing",
    label: "Taxes",
    description:
      "US tax returns, FBAR, double taxation, India income, and what the India–US tax treaty actually means for you.",
    icon: "🧾",
    accent: "from-rose-500 to-pink-600",
  },
  {
    slug: "credit",
    title: "Credit & Cards",
    label: "Credit",
    description:
      "Build a US credit score from zero, choose the right cards, and avoid the mistakes that haunt new immigrants.",
    icon: "💳",
    accent: "from-violet-500 to-purple-600",
  },
  {
    slug: "housing",
    title: "Housing & Renting",
    label: "Housing",
    description:
      "Renting your first apartment, understanding leases, and the path from tenant to first-time homebuyer.",
    icon: "🏠",
    accent: "from-amber-500 to-orange-600",
  },
  {
    slug: "property",
    title: "Buying Property",
    label: "Property",
    description:
      "Mortgages on a visa, down payments, closing costs, and buying real estate both in the US and back in India.",
    icon: "🔑",
    accent: "from-orange-500 to-red-600",
  },
  {
    slug: "cars",
    title: "Cars & Driving",
    label: "Cars",
    description:
      "Buy vs. lease, financing without credit history, insurance, and getting your license as a newcomer.",
    icon: "🚗",
    accent: "from-sky-500 to-blue-600",
  },
  {
    slug: "investing",
    title: "Investing",
    label: "Investing",
    description:
      "Index funds, brokerage accounts, and growing your portfolio — plus the PFIC rules NRIs must know.",
    icon: "📈",
    accent: "from-green-500 to-emerald-600",
  },
  {
    slug: "retirement",
    title: "401(k) & Roth IRA",
    label: "Retirement",
    description:
      "Employer matches, Roth vs. traditional, and what happens to your retirement accounts if you move back to India.",
    icon: "🏦",
    accent: "from-indigo-500 to-blue-700",
  },
  {
    slug: "money-transfer",
    title: "India–USA Transfers",
    label: "Transfers",
    description:
      "Remittances, the best transfer services, exchange rates, NRE/NRO accounts, and moving money tax-smart.",
    icon: "🔁",
    accent: "from-cyan-500 to-teal-600",
  },
  {
    slug: "community",
    title: "Community & Life",
    label: "Community",
    description:
      "Settling in, building a network, healthcare, schooling, and finding your people in a new country.",
    icon: "🤝",
    accent: "from-fuchsia-500 to-pink-600",
  },
  {
    slug: "stories",
    title: "Immigrant Stories",
    label: "Stories",
    description:
      "First-person journeys from H-1B to green card to citizenship — the wins, setbacks, and lessons learned.",
    icon: "✨",
    accent: "from-purple-500 to-indigo-600",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getTopicTitle(slug: string): string {
  return getTopic(slug)?.title ?? slug;
}
