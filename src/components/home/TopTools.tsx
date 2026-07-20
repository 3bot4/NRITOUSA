import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Icon, { type IconName } from "@/components/Icon";
import { accent, type CategoryKey } from "@/lib/accents";

interface ToolEntry {
  name: string;
  benefit: string;
  href: string;
  cat: CategoryKey;
  icon: IconName;
  rank?: number;
}

// Curated, ranked surface of every live tool + calculator. Hand-ordered by
// how much traffic/value each drives for the Indian-in-the-USA audience.
const entries: ToolEntry[] = [
  { name: "Green Card Tracker", benefit: "Your EB priority-date wait, estimated honestly", href: "/tools/green-card-tracker", cat: "visa", icon: "calendar", rank: 1 },
  { name: "Citizenship Checklist", benefit: "Earliest N-400 date + which civics test applies", href: "/tools/citizenship-checklist", cat: "visa", icon: "flag", rank: 2 },
  { name: "H-1B Salaries", benefit: "Real median pay by title, city & wage level", href: "/tools/h1b-salaries", cat: "money", icon: "briefcase", rank: 3 },
  { name: "Remittance & TCS Cost", benefit: "True cost of sending money to India", href: "/calculators/remittance-tcs-cost", cat: "money", icon: "send" },
  { name: "401(k) Cash Out vs Keep", benefit: "Moving back? Cash out or let it compound", href: "/calculators/401k-return-to-india", cat: "money", icon: "dollar" },
  { name: "RNOR & Tax Residency", benefit: "Are you NRI, RNOR, or ROR for India tax?", href: "/calculators/rnor-tax-residency", cat: "money", icon: "scale" },
  { name: "India Property Capital Gains", benefit: "Tax, TDS & repatriation on a property sale", href: "/calculators/india-property-capital-gains", cat: "money", icon: "home" },
  { name: "Backdoor Roth Eligibility", benefit: "Check eligibility and the pro-rata trap", href: "/calculators/backdoor-roth-eligibility", cat: "money", icon: "dollar" },
  { name: "Rent vs Buy (Visa)", benefit: "Tied to your real US visa horizon", href: "/calculators/rent-vs-buy-immigrant", cat: "docs", icon: "home" },
  { name: "Visa-Free Travel", benefit: "Where an Indian passport goes without a visa", href: "/tools/visa-free-countries", cat: "travel", icon: "passport" },
  { name: "Processing Times", benefit: "Current USCIS, OCI & stamping waits", href: "/tools/processing-times", cat: "docs", icon: "clock" },
];

export default function TopTools() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Top tools & calculators"
          title="Everything in one place"
          description="All 11 free tools and calculators — no login, results in under a minute."
          action={{ label: "Open the full Tools & Data Hub", href: "/tools" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((t) => {
            const a = accent(t.cat);
            return (
              <Link
                key={t.name}
                href={t.href}
                className={`group relative flex flex-col rounded-2xl border border-t-2 border-ink-900/5 ${a.topBorder} bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
              >
                {t.rank && (
                  <span
                    className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white ${a.dot}`}
                    aria-label={`Ranked number ${t.rank}`}
                  >
                    #{t.rank}
                  </span>
                )}
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}>
                  <Icon name={t.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-ink-900 group-hover:text-ink-900">
                  {t.name}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {t.benefit}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.badge}`}>
                    {a.label}
                  </span>
                  <span className="text-xs font-medium text-ink-400">· under a minute</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Open the full Tools & Data Hub
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
