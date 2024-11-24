import Button from "@/components/Atoms/Button";
import {
  TChapter,
  TCourse,
  TLesson,
  TSection,
  TSubSection,
} from "@/components/utils/types";
import { capitalize } from "@/components/utils/utils";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import dummyImage from "@/images/dummy-img.jpg";
import Input from "@/components/Atoms/Input";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";

export type TTabBody = { slug: string; content: ReactNode };

async function fetchCourses(id: string) {
  try {
    const response = await fetch(`${baseUrl}/courses/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (err) {
    console.log(err);
  }
}

// Function to collect IDs of lessons, sections, and subsections in a linear array
function collectLinearContentIds(data: TCourse): string[] {
  const ids: string[] = [];

  // Helper function to traverse chapters, lessons, sections, and subsections
  function traverseItem(item: TChapter) {
    if (item.lessons) {
      // Traverse lessons
      item.lessons.forEach((lesson: TLesson) => {
        lesson._id && ids.push(lesson._id); // Add lesson ID
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

  data.chapters?.forEach((chapter: TChapter) => {
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

const Tab: FC<{
  slugs: { key: string; name: string }[];
  body: TTabBody[];
}> = ({ slugs, body }) => {
  const [activeTab, setActiveTab] = useState(slugs[0].key);
  const [contentIds, setContentIds] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    dummyImage
  );
  const router = useRouter();
  const { topic } = router.query;
  const pathName = usePathname();
  const subjectId = pathName.split("/").pop();
  const getContentIds = useMemo(() => collectLinearContentIds, []);
  useEffect(() => {
    async function fetchNavigate() {
      if (subjectId) {
        const courses = await fetchCourses(subjectId);
        const contentIds = getContentIds(courses!);
        setContentIds(contentIds);
      }
    }
    fetchNavigate();
  }, [subjectId, getContentIds]);

  const fetchProfileImage = useCallback(async () => {
    const userId = Cookies.get("userId");
    try {
      const response = await fetch(`${baseUrl}/students/${userId}`);
      if (!response) setProfileImage(dummyImage);
      const data = await response.json();
      setProfileImage(data.profileImage);
    } catch (err) {
      console.error("failed to load student information");
      setProfileImage(dummyImage);
    }
  }, []);
  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  function handlePreviousTab() {
    if (topic) {
      const previousId = getPreviousId(topic as string, contentIds);
      router.push(`${pathName}?topic=${previousId}`);
    }
  }

  function handleNextTab() {
    if (topic) {
      const previousId = getNextId(topic as string, contentIds);
      router.push(`${pathName}?topic=${previousId}`);
    }
  }
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

  return (
    <div className='min-[1560px]:w-[64rem] flex flex-col gap-6'>
      {/* TAB ACTIONS */}
      <div className='w-full flex gap-0'>
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
      <div className='w-full'>
        {body.find((content) => content.slug === activeTab)?.content}
        <div className='flex w-full justify-between py-5'>
          <Button
            onClick={handlePreviousTab}
            size='md'
            className='text-primary !border-primary border'
            color='outline'
            width='fit'
          >
            Previous Topic
          </Button>

          <Button onClick={handleNextTab} size='md' color='blue' width='fit'>
            Next Topic
          </Button>
        </div>
        <div>
          <div className='grid grid-cols-[50px_1fr] py-8 gap-4 w-full'>
            <div>
              <Image
                src={profileImage}
                width={40}
                height={40}
                alt='student profile'
              />
            </div>
            {/**profil imega */}
            <div className='relative '>
              <Input
                name='text'
                className='rounded-full w-full px-3 py-3'
                placeholder='Share your thoughts'
                value=''
                onChange={() => {}}
              />
              <button className='h-full absolute right-2 top-0  rounded-full'>
                <SendIcon className='w-full h-[75%]' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SendIcon({ className }: { className: string }) {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='30' height='30' rx='15' fill='#32A8C4' fill-opacity='0.1' />
      <g clip-path='url(#clip0_1182_3065)'>
        <path
          d='M21.1759 10.2644C21.4999 9.3682 20.6314 8.4997 19.7352 8.82445L8.78142 12.7859C7.88217 13.1114 7.77342 14.3384 8.60067 14.8177L12.0972 16.8419L15.2194 13.7197C15.3609 13.5831 15.5503 13.5075 15.747 13.5092C15.9436 13.5109 16.1317 13.5898 16.2708 13.7288C16.4098 13.8679 16.4887 14.056 16.4904 14.2526C16.4921 14.4493 16.4165 14.6387 16.2799 14.7802L13.1577 17.9024L15.1827 21.3989C15.6612 22.2262 16.8882 22.1167 17.2137 21.2182L21.1759 10.2644Z'
          fill='#32A8C4'
        />
      </g>
      <defs>
        <clipPath id='clip0_1182_3065'>
          <rect
            width='18'
            height='18'
            fill='white'
            transform='translate(6 6)'
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Tab;
