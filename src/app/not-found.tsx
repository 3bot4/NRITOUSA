import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-extrabold tracking-tight text-brand-600">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-ink-500">
        The link may be broken or the page may have moved. Let&apos;s get you
        back to the guides.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Back home
        </Link>
        <Link
          href="/topics"
          className="rounded-xl border border-ink-900/10 bg-white px-6 py-3 font-semibold text-ink-700 hover:bg-ink-900/[0.03]"
        >
          Browse topics
        </Link>
      </div>
    </Container>
  );
}
