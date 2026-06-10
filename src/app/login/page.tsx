import type { Metadata } from "next";
import Container from "@/components/Container";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to the NRI to USA community.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next && searchParams.next.startsWith("/")
    ? searchParams.next
    : "/community";

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Welcome back</h1>
        <p className="mt-2 text-ink-500">Log in to post, reply, and save discussions.</p>
        <div className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
          <LoginForm next={next} />
        </div>
      </div>
    </Container>
  );
}
