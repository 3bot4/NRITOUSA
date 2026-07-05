import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("illinois");

export default function Page() {
  return <StatePopulationPage slug="illinois" />;
}
