import type { Metadata } from "next";
import OrganizerProfile from "@/components/nri-tax/OrganizerProfile";

export const metadata: Metadata = {
  title: "Profile — NRI Wealth Checkup",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <OrganizerProfile />;
}
