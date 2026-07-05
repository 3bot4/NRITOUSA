import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("california");

export default function Page() {
  return <StatePopulationPage slug="california" />;
}
