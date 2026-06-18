import type { Metadata } from "next";
import OrganizerDashboard from "@/components/nri-tax/OrganizerDashboard";

export const metadata: Metadata = {
  title: "Dashboard — NRI Wealth Checkup",
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return <OrganizerDashboard />;
}
