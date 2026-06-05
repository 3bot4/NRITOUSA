import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";

const stories = [
  {
    title: "My First Year in America",
    author: "Karthik S.",
    excerpt:
      "From a confusing first winter to finally feeling at home — what the first 12 months really taught me.",
    accent: "from-purple-500 to-indigo-600",
    href: "/topics/stories",
  },
  {
    title: "Mistakes I Made Buying My First Car",
    author: "Rahul M.",
    excerpt:
      "I walked in with no credit and walked out with an 18% loan. Here's what I'd do differently.",
    accent: "from-cyan-500 to-blue-600",
    href: "/topics/stories",
  },
  {
    title: "What I Wish I Knew Before Renting",
    author: "Ananya I.",
    excerpt:
      "Hidden fees, a brutal security deposit, and the lease clause that cost me. Learn from my misses.",
    accent: "from-amber-500 to-orange-600",
    href: "/topics/stories",
  },
  {
    title: "Learning About 401k Too Late",
    author: "Sneha R.",
    excerpt:
      "I skipped the employer match for two years to 'save'. That decision cost me thousands.",
    accent: "from-emerald-500 to-teal-600",
    href: "/topics/stories",
  },
];

export default function StoriesPreview() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Real experiences"
          title="Personal immigrant stories"
          description="Honest, first-person lessons you won't find in a textbook."
          action={{ label: "All stories", href: "/topics/stories" }}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <Link
              key={story.title}
              href={story.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div
                className={`relative aspect-[3/2] bg-gradient-to-br ${story.accent}`}
              >
                <span className="absolute bottom-3 left-4 text-4xl opacity-90">
                  “
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-600">
                  {story.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                  {story.excerpt}
                </p>
                <p className="mt-4 text-xs font-medium text-ink-400">
                  {story.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
