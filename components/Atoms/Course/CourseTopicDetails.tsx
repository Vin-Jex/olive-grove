import Tab, { TTabBody } from '@/components/Molecules/Tab/Tab';
import { VideoProps } from 'next-video';
import { TCourse } from '@/components/utils/types';
import {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import TopicVideo from './CourseTopicVideo';
import NotFoundError from '../NotFoundError';
import { useTopicContext } from '@/contexts/TopicContext';
import img404 from '@/images/olive-notes-404.png';
import { Alert, Checkbox, FormControlLabel, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { baseUrl } from '@/components/utils/baseURL';

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

    console.log('VIDEO DURATION', duration);
    console.log('VIDEO TIMESTAMP', currentTime);
    console.log('PERCENTAGE', percentage);
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
    if (!topicDetails.topic?.viewed && !noteCompletedIsTriggered && checked) {
      // Mark notes as read
      // alert("Notes read!");
      setNoteCompletedIsTriggered(true);
    }
  };

  /**
   * Function responsible for marking the topic as read
   * @returns void
   */
  const markTopicAsRead = useCallback(async () => {
    // * Get the access token from the cookies
    // * Make an API request to retrieve the list of courses created by this teacher
    const response = await fetch(
      `${baseUrl}/courses/mark-as-viewed/${topicDetails.type}/${topicDetails.topic?._id}`,
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          currentDate: Date.now(),
          nextId: '6739522037923060e34feabd',
        }),
      }
    );

    //  Display a success message to the user if the topic was marked as read successfully
    displayCompleted();

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      return false;
    }

    console.log('TOPIC CHECKED SUCCESSFULLY');

    return true;
  }, [topicDetails.topic?._id, topicDetails.type]);

  useEffect(() => {
    setTopicIsCompleted(false);
    setVideoCompletedIsTriggered(false);
    setNoteCompletedIsTriggered(false);
  }, [router.asPath]);

  useEffect(() => {
    if (
      (topicDetails.topic?.topicVideo || topicDetails.topic?.youtubeVideo) &&
      videoCompletedIsTriggered &&
      noteCompletedIsTriggered
    ) {
      markTopicAsRead();
      return;
    }

    if (
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
            slug: 'video',
            content: (
              <TopicVideo
                ref={videoRef}
                markVideoCompleted={markVideoCompleted}
                url={
                  // topicDetails?.topic?.topicVideo ||
                  // topicDetails?.topic?.youtubeVideo ||
                  'https://videos.pexels.com/video-files/4203954/4203954-hd_1920_1080_24fps.mp4'
                }
              />
            ),
          },
        ]
      : []),
    ...(topicDetails?.topic?.topicNote
      ? [
          {
            slug: 'notes',
            content: (
              <div className='flex w-full gap-2 flex-col'>
                <div
                  className='lg:max-h-[80vh] w-full overflow-y-auto rounded-sm px-2'
                  dangerouslySetInnerHTML={{
                    __html: topicDetails?.topic.topicNote || '',
                  }}
                ></div>
                <div className='w-full'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={markNotesRead}
                        defaultChecked={topicDetails.topic.viewed}
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
      {topicDetails ? (
        <div className='flex flex-col w-full gap-4'>
          {/* BREADCRUMB */}
          <div className='font-thin flex gap-1 w-full'>
            {topicDetails.path?.map((crumb, i) => (
              <span key={i}>
                {crumb} {i != (topicDetails.path?.length || 0) - 1 ? '/' : ''}
              </span>
            ))}
          </div>
          {/**I AM NOT SURE OF THE NEED OF THE BREADCRUMB, IT LOOKS ROUGH */}
          {/* TITLE */}
          <div className='text-2xl font-bold bg-primary bg-opacity-10 min-[1560px]:w-[64rem] rounded-lg px-3 py-4'>
            {topicDetails.topic?.title}
          </div>
          {/* TAB */}
          {topicDetails.topic?.topicVideo ||
          topicDetails?.topic?.youtubeVideo ? (
            <Tab
              slugs={[
                ...(topicDetails.topic.topicVideo ||
                topicDetails?.topic.youtubeVideo
                  ? [{ name: 'topic video', key: 'video' }]
                  : []),
                { name: 'topic notes', key: 'notes' },
              ]}
              body={tabBody}
            />
          ) : topicDetails.topic?.topicNote ? (
            <Tab
              slugs={[
                ...(topicDetails.topic.topicVideo ||
                topicDetails?.topic.youtubeVideo
                  ? [{ name: 'topic video', key: 'video' }]
                  : []),
                { name: 'topic notes', key: 'notes' },
              ]}
              body={tabBody}
            />
          ) : (
            <div>
              {
                <NotFoundError
                  msg='No notes provided'
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
          <NotFoundError msg={'No topic found'} />
        </>
      )}
      {topicIsCompleted && (
        <Snackbar
          open={topicIsCompleted}
          onClose={() => setTopicIsCompleted(false)}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          className='!z-[999]'
        >
          <Alert severity='success' onClose={() => setTopicIsCompleted(false)}>
            Topic completed!
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
