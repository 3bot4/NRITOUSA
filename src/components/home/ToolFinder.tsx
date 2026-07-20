import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Icon, { type IconName } from "@/components/Icon";
import { accent, type CategoryKey } from "@/lib/accents";

interface Intent {
  q: string;
  href: string;
  cat: CategoryKey;
  icon: IconName;
}

const intents: Intent[] = [
  { q: "When will my green card come?", href: "/tools/green-card-tracker", cat: "visa", icon: "calendar" },
  { q: "Can I apply for citizenship yet?", href: "/tools/citizenship-checklist", cat: "visa", icon: "flag" },
  { q: "Is my H-1B salary fair?", href: "/tools/h1b-salaries", cat: "money", icon: "briefcase" },
  { q: "My spouse has an H-4 EAD — what can they do?", href: "/tools/h4-ead-navigator", cat: "visa", icon: "briefcase" },
  { q: "Where can I travel visa-free?", href: "/tools/visa-free-countries", cat: "travel", icon: "passport" },
  { q: "How long is visa stamping taking?", href: "/tools/processing-times", cat: "docs", icon: "clock" },
  { q: "Cash out my 401k before moving back?", href: "/calculators/401k-return-to-india", cat: "money", icon: "dollar" },
  { q: "What does sending money to India cost?", href: "/calculators/remittance-tcs-cost", cat: "money", icon: "send" },
  { q: "Should I rent or buy on a visa?", href: "/calculators/rent-vs-buy-immigrant", cat: "docs", icon: "home" },
  { q: "Am I still an NRI for tax?", href: "/calculators/rnor-tax-residency", cat: "money", icon: "scale" },
];

export default function ToolFinder() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Start here"
          title="What are you trying to figure out?"
          description="Tap a question — we'll take you straight to the tool that answers it. Free, no login, under a minute."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {intents.map((it) => {
            const a = accent(it.cat);
            return (
              <Link
                key={it.q}
                href={it.href}
                className={`group flex items-center gap-3 rounded-2xl border border-ink-900/5 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${a.hoverBorder}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}>
                  <Icon name={it.icon} />
                </span>
                <span className="flex-1 text-sm font-semibold text-ink-800 group-hover:text-ink-900">
                  {it.q}
                </span>
                <span className={`shrink-0 ${a.text}`}>
                  <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
