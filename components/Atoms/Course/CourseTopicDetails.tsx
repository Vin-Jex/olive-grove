import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import { TCourse, TSection } from "@/components/utils/types";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import TopicVideo from "./CourseTopicVideo";
import NotFoundError from "../NotFoundError";
import Button from "../Button";

const demoNotes = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tellus lacus, dignissim commodo dictum aliquam, maximus nec mauris. Phasellus sed nisl dignissim erat eleifend congue. Nullam ultricies est a tempus varius. Phasellus vitae massa rutrum, elementum urna sed, volutpat urna. Nam at nulla dui. Suspendisse aliquet metus purus, eget ultrices tellus pharetra eget. Proin dictum urna non aliquet pellentesque. Nunc dapibus gravida justo eu finibus.
<br />
<br />
Duis dapibus purus tristique eros rutrum placerat. Sed et congue augue. Vivamus hendrerit quam vel justo rutrum hendrerit sed a enim. Curabitur a placerat mauris, eu efficitur turpis. Suspendisse tempus, dolor et imperdiet imperdiet, neque nibh mollis dolor, sed laoreet ex lacus id dolor. Aliquam pellentesque nunc ac feugiat tempus. Nulla blandit magna non nulla luctus sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos`;

export const TopicDetails: FC<{
  course: TCourse;
}> = ({ course }) => {
  const router = useRouter();
  const { topic } = router.query;
  const [topicDetails, setTopicDetails] = useState<{
    path: [string, string, string];
    topic: TSection;
  }>();

  const tabBody: TTabBody[] = [
    ...(topicDetails?.topic.topicVideo || topicDetails?.topic.youtubeVideo
      ? [
          {
            slug: "video",
            content: (
              <TopicVideo
                url={
                  topicDetails?.topic?.topicVideo ||
                  topicDetails?.topic?.youtubeVideo ||
                  ""
                }
              />
            ),
          },
        ]
      : []),
    ...(topicDetails?.topic.topicNote
      ? [
          {
            slug: "notes",
            content: (
              <div
                className="lg:max-h-[80vh] overflow-y-auto rounded-sm px-2"
                dangerouslySetInnerHTML={{
                  __html: topicDetails?.topic.topicNote || "",
                }}
              ></div>
            ),
          },
        ]
      : []),
  ];

  /**
   * * Function responsible for returning the details of the topic to be displayed
   */
  const getTopic = () => {
    // * Loop through each chapter in the course
    for (const chapter of course.chapters || []) {
      // * Loop through each lesson in each chapter
      for (const lesson of chapter.lessons) {
        // * Search for the topic with the id passed in the query in the list of topics under the current lesson
        const section = lesson.sections.find(
          (section) => section._id === topic
        );

        // * If the topic was found, update the topic details state and break the loop
        if (section) {
          console.log("TOPIC", section);
          setTopicDetails({
            path: [chapter.title, lesson.title, section?.title],
            topic: section,
          });
          break;
        }
      }
    }
  };

  useEffect(() => {
    getTopic();
  }, [router.asPath]);

  return (
    <>
      {topicDetails ? (
        <div className="flex flex-col w-full gap-4">
          {/* BREADCRUMB */}
          {/* <div className="font-thin flex gap-1 w-full">
            {topicDetails.path.map((crumb, i) => (
              <span key={i}>
                {crumb} {i != topicDetails.path.length - 1 ? "/" : ""}
              </span>
            ))}
        </div> */}
          {/**I AM NOT SURE OF THE NEED OF THE BREADCRUMB, IT LOOKS ROUGH */}
          {/* TITLE */}
          <div className="text-3xl font-bold">{topicDetails.topic.title}</div>
          {/* TAB */}
          {topicDetails.topic.topicVideo || topicDetails?.topic.youtubeVideo ? (
            <Tab
              slugs={[
                ...(topicDetails.topic.topicVideo ||
                topicDetails?.topic.youtubeVideo
                  ? [{ name: "topic video", key: "video" }]
                  : []),
                { name: "topic notes", key: "notes" },
              ]}
              body={tabBody}
            />
          ) : topicDetails.topic.topicNote ? (
            <Tab
              slugs={[
                ...(topicDetails.topic.topicVideo ||
                topicDetails?.topic.youtubeVideo
                  ? [{ name: "topic video", key: "video" }]
                  : []),
                { name: "topic notes", key: "notes" },
              ]}
              body={tabBody}
            />
          ) : (
            <div>{<NotFoundError msg="No notes provided" />}</div>
          )}
        </div>
      ) : (
        <>
          <NotFoundError msg={"No topic found"} />
        </>
      )}
    </>
  );
};
