import { capitalize } from "@/components/utils/utils";
import React, { FC, ReactNode, useState } from "react";
import { useRouter } from "next/router";

export type TTabBody = { slug: string; content: ReactNode };

const Tab: FC<{
  slugs: { key: string; name: string }[];
  body: TTabBody[];
}> = ({ slugs, body }) => {
  const [activeTab, setActiveTab] = useState(slugs[0].key);
  const router = useRouter();
  const { topic } = router.query;

  // const lastViewPoint = useRef(0);
  // const [viewedSegment, setViewedSegment] = useState<
  //   { start: number; end: number }[]
  // >([]);

  // //* Track the video progress
  // useEffect(() => {
  //   const videoElement = document.querySelector(
  //     '.video-player'
  //   ) as HTMLMediaElement;

  //   if (!videoElement) return;
  //   console.log('yay!! I can find the video element');

  //   function handleTimeUpdate() {
  //     const currentTime = videoElement.currentTime;

  //     setViewedSegment((prev) => {
  //       const segment = [...prev];
  //       const lastSegment = segment[segment.length - 1];
  //       if (lastSegment && lastViewPoint.current === lastSegment.end) {
  //         lastSegment.end = currentTime;
  //       } else {
  //         segment.push({
  //           start: lastViewPoint.current,
  //           end: currentTime,
  //         });
  //       }
  //       return segment;
  //     });
  //     lastViewPoint.current = currentTime;
  //   }

  //   window.addEventListener('timeupdate', handleTimeUpdate);

  //   return () => {
  //     window.removeEventListener('timeupdate', handleTimeUpdate);
  //   };
  // }, []);

  // useEffect(() => {
  //   const videoElement = document.querySelector(
  //     '.video-player'
  //   ) as HTMLMediaElement;

  //   if (!videoElement) return;

  //   function durationWatched() {
  //     if (viewedSegment) {
  //       return viewedSegment.reduce(
  //         (acc, curr) => acc + (curr.end - curr.start),
  //         0
  //       );
  //     }
  //     return 0;
  //   }

  //   const duration = videoElement.duration;
  //   const watchedDuration = durationWatched();
  //   if (watchedDuration >= 0.7 * duration)
  //     console.log(
  //       `${(watchedDuration / duration) * 100}% of the video watched`
  //     );
  //   else console.log('not watched enoug of the video yet');
  // }, [viewedSegment]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* TAB ACTIONS */}
      <div className="w-full flex gap-0">
        {slugs.map((slug, i) => (
          <>
            <div
              className={`px-7 py-2 font-medium text-sm cursor-pointer transition ${
                activeTab === slug.key
                  ? "border-primary border-b-2 bg-[#32A8C41A] text-primary"
                  : ""
              }`}
              onClick={() => setActiveTab(slug.key)}
              key={i}
            >
              {capitalize(slug.name)}
            </div>
          </>
        ))}
      </div>
      {/* TAB BODY */}
      <div className="w-full">
        {body.find((content) => content.slug === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tab;
