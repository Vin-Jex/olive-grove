import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import { VideoProps } from "next-video";
import {
  TChapter,
  TCourse,
  TLesson,
  TSection,
  TSubSection,
} from "@/components/utils/types";

import {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TopicVideo from "./CourseTopicVideo";
import NotFoundError from "../NotFoundError";
import { useTopicContext } from "@/contexts/TopicContext";
import img404 from "@/images/olive-notes-404.png";
import { Alert, Checkbox, FormControlLabel, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";
import Button from "../Button";
import { capitalize } from "@/components/utils/utils";
import { usePathname } from "next/navigation";
import CourseQA from "./CourseQA";
import YouTubeEmbed from "./CourseTopicYouTubeVideo";

// Function to collect IDs of lessons, sections, and subsections in a linear array
export function collectLinearContentIds(data: TCourse): string[] {
  const ids: string[] = [];

  // Helper function to traverse chapters, lessons, sections, and subsections
  function traverseItem(item: TChapter) {
    if (item.lessons) {
      // Traverse lessons
      item.lessons.forEach((lesson: TLesson) => {
        // lesson._id && ids.push(lesson._id); // Add lesson ID
        lesson.sections.forEach((section: TSection) => {
          section._id && ids.push(section._id); // Add section ID
          section.subsections.forEach((subsection: TSubSection) => {
            subsection._id && ids.push(subsection._id); // Add subsection ID
          });
        });
      });
    }
  }

  // Traverse all data items (chapters)

  data?.chapters?.forEach((chapter: TChapter) => {
    traverseItem(chapter);
  }) ?? [];

  return ids;
}

function getPreviousId(currentId: string, linearIds: string[]): string | null {
  const currentIndex = linearIds.indexOf(currentId);
  if (currentIndex > 0) {
    return linearIds[currentIndex - 1]; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

function getNextId(currentId: string, linearIds: string[]): string | null {
  const currentIndex = linearIds.indexOf(currentId);
  if (currentIndex > 0) {
    return linearIds[currentIndex + 1]; // Return the ID of the previous item
  }
  return null; // Return null if there's no previous item
}

export const TopicDetails: FC<{
  course: TCourse;
}> = ({ course }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { topicDetails } = useTopicContext();
  const videoRef =
    useRef<ForwardRefExoticComponent<VideoProps & RefAttributes<unknown>>>(
      null
    );
  const [videoCompletedIsTriggered, setVideoCompletedIsTriggered] = useState(
    topicDetails.topic?.viewed || false
  );
  const [noteCompletedIsTriggered, setNoteCompletedIsTriggered] = useState(
    topicDetails.topic?.viewed || false
  );
  const [topicIsCompleted, setTopicIsCompleted] = useState(
    topicDetails.topic?.viewed || false
  );
  const [checkedState, setCheckedState] = useState(
    topicDetails.topic?.viewed || false
  );
  const [contentIds, setContentIds] = useState<string[]>([]);

  const displayCompleted = () => {
    setTopicIsCompleted(true);

    setTimeout(() => setTopicIsCompleted(false), 6000);
  };

  const getContentIds = useMemo(() => collectLinearContentIds, []);

  const fetchNavigate = useCallback(async () => {
    const contentIds = getContentIds(course!);
    setContentIds(contentIds);
  }, [course, getContentIds]);

  function handlePreviousTab() {
    if (topicDetails.topic) {
      const previousId = getPreviousId(
        topicDetails.topic?._id || "",
        contentIds
      );
      router.push(`${pathName}?topic=${previousId}`);
    }
  }

  function handleNextTab() {
    if (topicDetails.topic) {
      const previousId = getNextId(topicDetails.topic?._id || "", contentIds);
      router.push(`${pathName}?topic=${previousId}`);
    }
  }

  /**
   * Function responsible for marking the video as completed
   * @param e The video event handler
   * @returns void
   */
  const markVideoCompleted = () => {
    if (
      !videoRef.current ||
      topicDetails.topic?.viewed ||
      videoCompletedIsTriggered
    )
      return;

    const duration: number | undefined = (videoRef.current as any)?.duration;
    const currentTime: number | undefined = (videoRef.current as any)
      ?.currentTime;
    const percentage = ((currentTime || 0) / (duration || 0)) * 100;

    // Mark video as completed after reaching 90% of the video duration
    if (percentage >= 90) {
      // Mark video as completed
      // alert("Video completed!");
      setVideoCompletedIsTriggered(true);
    }
  };

  /**
   * Function responsible for indicating if the user has finished reading
   * @param event The checkbox change event
   * @param checked The current state of the checkbox
   */
  const markNotesRead = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setCheckedState(checked);
    if (!topicDetails.topic?.viewed && !noteCompletedIsTriggered && checked) {
      // Mark notes as read
      setNoteCompletedIsTriggered(true);
    }
  };

  /**
   * Function responsible for marking the topic as read
   * @returns void
   */
  const markTopicAsRead = useCallback(async () => {
    // * Get the access token from the cookies
    const jwt = Cookies.get("jwt");
    // * Make an API request to retrieve the list of courses created by this teacher
    const response = await fetch(
      `${baseUrl}/courses/mark-as-viewed/${capitalize(topicDetails.type)}/${
        topicDetails.topic?._id
      }`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          currentDate: new Date().toISOString(),
          nextId: "6739522037923060e34feabd",
        }),
      }
    );

    //  Display a success message to the user if the topic was marked as read successfully
    displayCompleted();

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      return false;
    }

    return true;
  }, [topicDetails.topic?._id, topicDetails.type]);

  useEffect(() => {
    setTopicIsCompleted(topicDetails.topic?.viewed || false);
    setVideoCompletedIsTriggered(topicDetails.topic?.viewed || false);
    setNoteCompletedIsTriggered(topicDetails.topic?.viewed || false);
    setCheckedState(topicDetails.topic?.viewed || false);
    fetchNavigate();
  }, [fetchNavigate, topicDetails.topic]);

  useEffect(() => {
    if (
      !topicDetails.topic?.viewed &&
      (topicDetails.topic?.topicVideo || topicDetails.topic?.youtubeVideo) &&
      videoCompletedIsTriggered &&
      noteCompletedIsTriggered
    ) {
      markTopicAsRead();
      return;
    }

    if (
      !topicDetails.topic?.viewed &&
      !topicDetails.topic?.topicVideo &&
      !topicDetails.topic?.youtubeVideo &&
      noteCompletedIsTriggered
    ) {
      markTopicAsRead();
      return;
    }
  }, [
    videoCompletedIsTriggered,
    noteCompletedIsTriggered,
    topicDetails,
    markTopicAsRead,
  ]);

  // * The list of the tab content
  const tabBody: TTabBody[] = [
    ...(topicDetails?.topic?.topicVideo || topicDetails?.topic?.youtubeVideo
      ? [
          {
            slug: "video",
            content: (
              <>
                {topicDetails?.topic?.topicVideo ? (
                  <TopicVideo
                    ref={videoRef}
                    markVideoCompleted={markVideoCompleted}
                    url={
                      topicDetails?.topic?.topicVideo
                      // || "https://videos.pexels.com/video-files/4203954/4203954-hd_1920_1080_24fps.mp4"
                    }
                  />
                ) : (
                  <YouTubeEmbed
                    ref={videoRef as any}
                    markVideoCompleted={markVideoCompleted}
                    url={
                      topicDetails?.topic?.youtubeVideo
                      // || "https://videos.pexels.com/video-files/4203954/4203954-hd_1920_1080_24fps.mp4"
                    }
                  />
                )}
              </>
            ),
          },
        ]
      : []),
    ...(topicDetails?.topic?.topicNote
      ? [
          {
            slug: "notes",
            content: (
              <div className="flex w-full gap-2 flex-col">
                <div
                  className="lg:max-h-[80vh] w-full overflow-y-auto rounded-sm px-2"
                  dangerouslySetInnerHTML={{
                    __html: topicDetails?.topic.topicNote || "",
                  }}
                ></div>
                <div className="w-full">
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={markNotesRead}
                        value={checkedState}
                        defaultChecked={topicDetails.topic.viewed || false}
                      />
                    }
                    label="I've finished reading"
                  />
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {topicDetails.topic ? (
        <div className="flex flex-col w-full gap-4">
          {/* TITLE */}

          <div className="text-xl max-sm:text-lg font-medium font-roboto bg-primary bg-opacity-10  rounded-lg px-5 py-4">
            {topicDetails.topic?.title}
          </div>
          {/* TAB */}
          {topicDetails.topic?.topicVideo ||
          topicDetails?.topic?.youtubeVideo ? (
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
          ) : topicDetails.topic?.topicNote ? (
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
            <div>
              {
                <NotFoundError
                  msg="No notes provided"
                  width={320}
                  height={320}
                  img={img404.src}
                />
              }
            </div>
          )}
          {/* Previous and next button */}
          <div className="flex w-full justify-between py-5">
            <Button
              onClick={handlePreviousTab}
              disabled={
                getPreviousId &&
                !getPreviousId(topicDetails.topic._id as string, contentIds)
              }
              size="xs"
              className="disabled:!border-none"
              // className="text-primary !border-primary border"
              color="outline"
              width="fit"
            >
              Previous Topic
            </Button>

            <Button
              disabled={
                getNextId &&
                !getNextId(topicDetails.topic._id as string, contentIds)
              }
              onClick={handleNextTab}
              size="xs"
              color="blue"
              width="fit"
            >
              Next Topic
            </Button>
          </div>
          {/* QA session */}
          {/* <CourseQA /> */}
        </div>
      ) : (
        <>
          <NotFoundError msg={"No topic found"} />
        </>
      )}
      {topicIsCompleted && (
        <Snackbar
          open={topicIsCompleted}
          onClose={() => setTopicIsCompleted(false)}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          className="!z-[999]"
        >
          <Alert severity="success" onClose={() => setTopicIsCompleted(false)}>
            Topic completed!
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
