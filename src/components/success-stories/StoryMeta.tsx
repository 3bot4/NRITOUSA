import type {
  Contributor,
  StoryAttribution,
  SuccessStory,
} from "@/lib/successStories";
import { formatDate } from "@/lib/format";
import ContributorAvatar from "./ContributorAvatar";

/**
 * Authorship + review information block. Attribution follows the story TYPE
 * (via resolveAttribution): for interviews / editorial profiles / founder
 * journeys the writer is the Editorial Team and the featured person is the
 * subject/reviewer; for first-person pieces the contributor is the author.
 * Interview date / interviewer only appear for genuine interviews.
 */
export default function StoryMeta({
  story,
  contributor,
  attribution,
}: {
  story: SuccessStory;
  contributor: Contributor;
  attribution: StoryAttribution;
}) {
  const authorLine = attribution.authorIsSubject
    ? `By ${attribution.authorName}`
    : `Written & edited by ${story.byline.writtenBy}`;

  return (
    <div className="flex flex-col gap-4 border-t border-ink-900/5 pt-6 sm:flex-row sm:items-center sm:gap-5">
      <ContributorAvatar contributor={contributor} size={56} />
      <div className="text-sm">
        <p className="text-ink-700">
          <span className="font-semibold text-ink-900">
            {attribution.authorIsSubject
              ? contributor.fullName
              : `Featuring ${contributor.fullName}`}
          </span>{" "}
          · {contributor.currentTitle}
        </p>
        <p className="mt-0.5 text-ink-500">
          {authorLine}
          {!attribution.authorIsSubject && (
            <> · {story.byline.reviewStatus}</>
          )}
        </p>
        {attribution.usesInterviewMeta && story.interviewMeta && (
          <p className="mt-0.5 text-ink-500">
            {story.interviewMeta.interviewer && (
              <>Interview by {story.interviewMeta.interviewer}</>
            )}
            {story.interviewMeta.interviewDate && (
              <> · Interviewed {formatDate(story.interviewMeta.interviewDate)}</>
            )}
            {story.interviewMeta.format && <> · {story.interviewMeta.format}</>}
          </p>
        )}
        <p className="mt-0.5 text-ink-400">
          Published {formatDate(story.publicationDate)} · Updated{" "}
          {formatDate(story.modifiedDate)} · Last reviewed{" "}
          {formatDate(story.verificationDate)}
        </p>
      </div>
    </div>
  );
}
