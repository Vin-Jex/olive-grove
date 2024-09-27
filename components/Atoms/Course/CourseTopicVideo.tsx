import Video from "next-video";
import { FC } from "react";

const TopicVideo: FC<{ url?: string }> = ({ url }) => {
  return (
    <div className="rounded-2xl overflow-hidden max-w-screen-lg">
      <Video
        src={
          url ||
          "https://videos.pexels.com/video-files/9559153/9559153-uhd_2732_1440_25fps.mp4"
        }
        accentColor="#02E7F5"
        primaryColor="#FFFFFF"
        controls={true}
        className="max-w-screen-lg"
        autoPlay
      />
    </div>
  );
};
export default TopicVideo;
