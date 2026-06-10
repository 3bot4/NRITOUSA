import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Icon, { type IconName } from "@/components/Icon";
import { accent, type CategoryKey } from "@/lib/accents";
import { bulletin, getCutoffs, formatCutoff } from "@/lib/visa-bulletin";
import passport from "../../../data/passport-access.json";

/**
 * "Sample results" cards (stockleo pattern): show a real example output for
 * each flagship tool so visitors see value before clicking. Numbers are pulled
 * from the live /data files where possible; representative figures are marked.
 */
interface Sample {
  cat: CategoryKey;
  icon: IconName;
  tool: string;
  href: string;
  example: string;
  result: string;
  // TODO(owner): true = a representative figure to verify, not from a data file
  approx?: boolean;
}

export default function SampleResults() {
  const eb2 = formatCutoff(getCutoffs("eb2", "india").fad);
  const visaFree = passport.summary.visaFreeOrOnArrival;

  const samples: Sample[] = [
    {
      cat: "visa",
      icon: "calendar",
      tool: "Green Card Tracker",
      href: "/tools/green-card-tracker",
      example: "EB-2 India · Final Action Date",
      result: `Cutoff now at ${eb2}`,
    },
    {
      cat: "money",
      icon: "briefcase",
      tool: "H-1B Salaries",
      href: "/tools/h1b-salaries",
      example: "Software Engineer · Bay Area",
      result: "Median ≈ $145k base",
      approx: true,
    },
    {
      cat: "travel",
      icon: "passport",
      tool: "Visa-Free Travel",
      href: "/tools/visa-free-countries",
      example: "Indian passport",
      result: `${visaFree} visa-free / VOA destinations`,
    },
    {
      cat: "money",
      icon: "send",
      tool: "Remittance & TCS",
      href: "/calculators/remittance-tcs-cost",
      example: "Send $10,000 to India",
      result: "You lose ≈ $250–450 to fees + TCS",
      approx: true,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="See it before you click"
          title="Real answers, in seconds"
          description="Each tool gives you a concrete number for your situation — here's a taste."
          action={{ label: "All tools", href: "/tools" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {samples.map((s) => {
            const a = accent(s.cat);
            return (
              <Link
                key={s.tool}
                href={s.href}
                className={`group flex flex-col rounded-2xl border border-t-2 border-ink-900/5 ${a.topBorder} bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}>
                    <Icon name={s.icon} />
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.badge}`}>
                    {a.label}
                  </span>
                </div>
                <p className="mt-4 text-xs text-ink-400">{s.example}</p>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-ink-900">
                  {s.result}
                  {s.approx && <span className="align-super text-[10px] font-bold text-ink-400"> *</span>}
                </p>
                <p className={`mt-auto pt-4 text-sm font-semibold ${a.text}`}>
                  {s.tool}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </p>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-ink-400">
          Live data updated {bulletin.month}. <span className="align-super">*</span>{" "}
          Representative example — open the tool for your exact numbers.
        </p>
      </Container>
    </section>
  );
}
