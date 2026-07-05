import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("massachusetts");

export default function Page() {
  return <StatePopulationPage slug="massachusetts" />;
}
