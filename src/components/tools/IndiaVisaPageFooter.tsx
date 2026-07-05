import type { FaqItem } from "@/lib/seo";
import Container from "@/components/Container";
import ToolFaq from "@/components/tools/ToolFaq";
import OfficialSourceBox from "@/components/tools/OfficialSourceBox";
import PermClusterLinks from "@/components/tools/PermClusterLinks";
import AuthorReviewLine from "@/components/tools/AuthorReviewLine";
import { otherIndiaVisaLinks } from "@/lib/indiaVisaCluster";
import {
  indiaVisaSourceLinks,
  indiaVisaRelatedLinks,
  INDIA_VISA_UPDATED_HUMAN,
} from "@/data/indiaVisaData";

/**
 * Shared footer for every supporting page in the India Visa cluster:
 * official sources → related cluster pages → related NRI guides → FAQ →
 * author review line. Keeps the eight pages consistent and DRY.
 */
export default function IndiaVisaPageFooter({
  currentPath,
  faqs,
}: {
  currentPath: string;
  faqs: FaqItem[];
}) {
  return (
    <>
      <section className="border-t border-ink-900/5 bg-ink-50/40 py-10 sm:py-12">
        <Container>
          <OfficialSourceBox
            title="Official India visa sources"
            intro="Always verify current requirements, fees, and processing times directly:"
            links={indiaVisaSourceLinks}
          />
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <PermClusterLinks title="More India visa guides" links={otherIndiaVisaLinks(currentPath)} />
          <div className="mt-8">
            <PermClusterLinks title="Related NRI & travel guides" links={indiaVisaRelatedLinks} />
          </div>
        </Container>
      </section>

      <section className="border-t border-ink-900/5 bg-white py-12 sm:py-16">
        <Container>
          <ToolFaq items={faqs} />
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <AuthorReviewLine lastUpdated={INDIA_VISA_UPDATED_HUMAN} />
        </Container>
      </section>
    </>
  );
}
