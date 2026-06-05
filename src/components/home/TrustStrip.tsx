import Container from "@/components/Container";

const items = [
  {
    icon: "🧭",
    title: "Built for NRIs",
    body: "Every guide is written for the immigrant experience, not generic US advice.",
  },
  {
    icon: "💡",
    title: "USA finance explained simply",
    body: "Credit, taxes, 401k, and investing — in plain English, no jargon.",
  },
  {
    icon: "🔁",
    title: "India-USA money topics",
    body: "Transfers, NRE/NRO accounts, and investing across both countries.",
  },
  {
    icon: "🤝",
    title: "Real immigrant experiences",
    body: "Honest stories and lessons from people who've been exactly where you are.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-ink-900/5 bg-white py-10 sm:py-12">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl border border-ink-900/5 bg-[#fafafa] p-4 transition-colors hover:bg-brand-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
