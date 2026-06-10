import Container from "@/components/Container";
import Icon, { type IconName } from "@/components/Icon";
import { accent, type CategoryKey } from "@/lib/accents";

const items: { cat: CategoryKey; icon: IconName; title: string; body: string }[] = [
  {
    cat: "visa",
    icon: "flag",
    title: "Built for NRIs",
    body: "Every tool and guide is written for the immigrant experience, not generic US advice.",
  },
  {
    cat: "money",
    icon: "dollar",
    title: "USA finance explained simply",
    body: "Credit, taxes, 401k, and investing — in plain English, no jargon.",
  },
  {
    cat: "travel",
    icon: "send",
    title: "India–USA money topics",
    body: "Transfers, NRE/NRO accounts, and investing across both countries.",
  },
  {
    cat: "docs",
    icon: "check",
    title: "Real, sourced data",
    body: "Every data tool stamps its last-updated date and official source.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-ink-900/5 bg-white py-10 sm:py-12">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const a = accent(item.cat);
            return (
              <div
                key={item.title}
                className={`flex gap-3 rounded-2xl border border-t-2 border-ink-900/5 ${a.topBorder} bg-[#fafafa] p-4`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.softBg} ${a.text}`}>
                  <Icon name={item.icon} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
