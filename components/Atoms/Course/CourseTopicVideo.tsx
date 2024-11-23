import Video, { VideoProps } from "next-video";
import {
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useRef,
} from "react";

const TopicVideo = forwardRef<
  ForwardRefExoticComponent<VideoProps & RefAttributes<unknown>>,
  { url?: string; markVideoCompleted: () => void }
>(({ url, markVideoCompleted }, ref) => {
  return (
    <div className="rounded-2xl overflow-hidden max-w-screen-lg">
      <Video
        ref={ref}
        src={
          url ||
          "https://videos.pexels.com/video-files/9559153/9559153-uhd_2732_1440_25fps.mp4"
        }
        accentColor="#02E7F5"
        primaryColor="#FFFFFF"
        controls={true}
        className="max-w-screen-lg video-player"
        onTimeUpdate={markVideoCompleted}
        autoPlay
      />
    </div>
  );
});

TopicVideo.displayName = "TopicVideo";

export default TopicVideo;
