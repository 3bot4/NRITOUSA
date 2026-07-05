import StatePopulationPage, { stateMetadata } from "@/components/StatePopulationPage";

export const metadata = stateMetadata("maryland");

export default function Page() {
  return <StatePopulationPage slug="maryland" />;
}
