import type { Metadata } from "next";
import Container from "@/components/Container";
import SignupForm from "@/components/auth/SignupForm";
import CommunityDisclaimer from "@/components/community/Disclaimer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to join the NRI to USA community.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Join the community</h1>
        <p className="mt-2 text-ink-500">
          Create a free account to ask questions, reply, and save discussions.
        </p>
        <div className="mt-8 rounded-2xl border border-ink-900/5 bg-white p-6 shadow-card">
          <SignupForm />
        </div>
        <div className="mt-6"><CommunityDisclaimer compact /></div>
      </div>
    </Container>
  );
}
