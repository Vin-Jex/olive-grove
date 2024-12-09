import { FC, forwardRef, LegacyRef } from "react";

const YouTubeEmbed = forwardRef<
  HTMLIFrameElement,
  { url?: string; markVideoCompleted: () => void }
>(({ url, markVideoCompleted }, ref) => {
  return (
    <div
      //   style={{
      //     position: "relative",
      //     paddingBottom: "56.25%",
      //     height: 0,
      //     overflow: "hidden",
      //   }}
      className="relative rounded-2xl overflow-hidden h-[550px] w-full"
    >
      <iframe
        src={url}
        ref={ref}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="max-h-[550px] video-player"
        allowFullScreen
        onTimeUpdate={markVideoCompleted}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
});

YouTubeEmbed.displayName = "YouTubeEmbed";

export default YouTubeEmbed;
