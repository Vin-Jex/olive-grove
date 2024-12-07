import React, { useCallback, useEffect, useState } from "react";
import dummyImage from "@/images/dummy-img.jpg";
import Image, { StaticImageData } from "next/image";
import Input from "../Input";
import SendIcon from "./CourseSendIcon";
import CommentCard from "./CourseQACommentCard";
import Cookies from "js-cookie";
import axiosInstance from "@/components/utils/axiosInstance";

const CourseQA = () => {
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    dummyImage.src
  );

  const fetchProfileImage = useCallback(async () => {
    const role = Cookies.get("role")?.toLocaleLowerCase();

    try {
      const response = await axiosInstance.get(`/${role}`);
      if (!response) setProfileImage(dummyImage.src);

      const { data } = response;
      setProfileImage(data.profileImage);
    } catch (err) {
      console.error(`failed to load ${role} information`);
      setProfileImage(dummyImage);
    }
  }, []);

  /*
     const lastViewPoint = useRef(0);
  const [viewedSegment, setViewedSegment] = useState<
    { start: number; end: number }[]
  >([]);

  //* Track the video progress
  useEffect(() => {
    const videoElement = document.querySelector(
      ".video-player"
    ) as HTMLMediaElement;

    if (!videoElement) return;

    function handleTimeUpdate() {
      const currentTime = videoElement.currentTime;

      setViewedSegment((prev) => {
        const segment = [...prev];
        const lastSegment = segment[segment.length - 1];
        if (lastSegment && lastViewPoint.current === lastSegment.end) {
          lastSegment.end = currentTime;
        } else {
          segment.push({
            start: lastViewPoint.current,
            end: currentTime,
          });
        }
        return segment;
      });
      lastViewPoint.current = currentTime;
    }

    window.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      window.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const videoElement = document.querySelector(
      ".video-player"
    ) as HTMLMediaElement;

    if (!videoElement) return;

    function durationWatched() {
      if (viewedSegment) {
        return viewedSegment.reduce(
          (acc, curr) => acc + (curr.end - curr.start),
          0
        );
      }
      return 0;
    }

    const duration = videoElement.duration;
    const watchedDuration = durationWatched();
    if (watchedDuration >= 0.7 * duration)
      console.log(
        `${(watchedDuration / duration) * 100}% of the video watched`
      );
    else console.log("not watched enoug of the video yet");
  }, [viewedSegment]);

    */

  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  return (
    <>
      <div>
        <div className="grid grid-cols-[50px_1fr] py-8 gap-4 w-full">
          <div>
            <Image
              src={dummyImage.src}
              width={40}
              height={40}
              alt="student profile"
            />
          </div>
          {/**profil imega */}
          <div className="relative ">
            <Input
              name="text"
              className="rounded-full w-full px-3 py-3"
              placeholder="Share your thoughts"
              value=""
              onChange={() => {}}
            />
            <button className="h-full absolute right-2 top-0  rounded-full">
              <SendIcon className="w-full h-[75%]" />
            </button>
          </div>
        </div>
        <div>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <CommentCard key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CourseQA;
