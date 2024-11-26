import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import { VideoProps } from "next-video";
import { TCourse } from "@/components/utils/types";
import {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
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

const demoNotes = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tellus lacus, dignissim commodo dictum aliquam, maximus nec mauris. Phasellus sed nisl dignissim erat eleifend congue. Nullam ultricies est a tempus varius. Phasellus vitae massa rutrum, elementum urna sed, volutpat urna. Nam at nulla dui. Suspendisse aliquet metus purus, eget ultrices tellus pharetra eget. Proin dictum urna non aliquet pellentesque. Nunc dapibus gravida justo eu finibus.
<br />
<br />
Duis dapibus purus tristique eros rutrum placerat. Sed et congue augue. Vivamus hendrerit quam vel justo rutrum hendrerit sed a enim. Curabitur a placerat mauris, eu efficitur turpis. Suspendisse tempus, dolor et imperdiet imperdiet, neque nibh mollis dolor, sed laoreet ex lacus id dolor. Aliquam pellentesque nunc ac feugiat tempus. Nulla blandit magna non nulla luctus sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos`;

export const TopicDetails: FC<{
  course: TCourse;
}> = ({ course }) => {
  const router = useRouter();
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

  const displayCompleted = () => {
    setTopicIsCompleted(true);

    setTimeout(() => setTopicIsCompleted(false), 6000);
  };

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

    console.log("VIDEO DURATION", duration);
    console.log("VIDEO TIMESTAMP", currentTime);
    console.log("PERCENTAGE", percentage);
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

    console.log("Marking Topic as read");

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

    console.log("TOPIC CHECKED SUCCESSFULLY");

    return true;
  }, [topicDetails.topic?._id, topicDetails.type]);

  useEffect(() => {
    setTopicIsCompleted(topicDetails.topic?.viewed || false);
    setVideoCompletedIsTriggered(topicDetails.topic?.viewed || false);
    setNoteCompletedIsTriggered(topicDetails.topic?.viewed || false);
    setCheckedState(topicDetails.topic?.viewed || false);
  }, [router.asPath]);

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

  const tabBody: TTabBody[] = [
    ...(topicDetails?.topic?.topicVideo || topicDetails?.topic?.youtubeVideo
      ? [
          {
            slug: "video",
            content: (
              <TopicVideo
                ref={videoRef}
                markVideoCompleted={markVideoCompleted}
                url={
                  // topicDetails?.topic?.topicVideo ||
                  // topicDetails?.topic?.youtubeVideo ||
                  "https://videos.pexels.com/video-files/4203954/4203954-hd_1920_1080_24fps.mp4"
                }
              />
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
          {/* BREADCRUMB */}
          <div className="font-thin flex gap-1 w-full">
            {topicDetails.path?.map((crumb, i) => (
              <span key={i}>
                {crumb} {i != (topicDetails.path?.length || 0) - 1 ? "/" : ""}
              </span>
            ))}
          </div>
          {/**I AM NOT SURE OF THE NEED OF THE BREADCRUMB, IT LOOKS ROUGH */}
          {/* TITLE */}
          <div className="text-3xl font-bold">{topicDetails.topic?.title}</div>
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
