import { TCourse } from "@/components/utils/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";
import coursePlaceholder from "@/images/course-placeholder.png";
import Button from "../Button";

const Course: FC<{ course: TCourse }> = ({ course }) => {
  const router = useRouter();
const description = (course?.description && course.description?.length > 150) ? `${course.description?.slice(0, 150)}...` : course.description

  return (
    <div
      className="flex rounded-lg overflow-hidden flex-row items-start max-w-[450px] border border-[#1E1E1E33] cursor-pointer transition hover:scale-105"
      onClick={() => router.push(`/teachers/subjects/${course._id}`)}
    >
      {/* IMAGE */}
      <div className="w-[180px] h-[175px] cursor-pointer">
        <Image
          src={course.image || coursePlaceholder.src}
          width={180}
          height={175}
          className="w-[180px] h-[175px] object-cover"
          alt={course.title}
        />
      </div>

      <div className="flex flex-col items-start justify-between h-full p-4 gap-2">
        {/* CONTENT - TITLE & DESC. */}
        <div className="flex flex-col items-start justify-start w-full">
          <span className="font-semibold font-roboto text-base text-dark leading-6">
            {course.title}
          </span>
          <div
            className="font-roboto text-sm !leading-5 text-[#1E1E1E99]"
            dangerouslySetInnerHTML={{ __html: description || "" }}
          ></div>
        </div>
        {/* ACTIONS */}
        <div className="w-full flex gap-4">
          <Button
            size="xs"
            className="flex gap-2 justify-start"
            width="fit"
            color="blue"
          >
            <svg
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33334 3.875V1.33333C9.33334 1.11232 9.42113 0.900358 9.57741 0.744078C9.73369 0.587797 9.94566 0.5 10.1667 0.5C10.3853 0.500921 10.5948 0.587713 10.75 0.741667L16.5833 6.575C16.6614 6.65247 16.7234 6.74464 16.7657 6.84619C16.8081 6.94774 16.8298 7.05666 16.8298 7.16667C16.8298 7.27668 16.8081 7.3856 16.7657 7.48715C16.7234 7.5887 16.6614 7.68086 16.5833 7.75833L10.75 13.5917C10.633 13.7063 10.4848 13.784 10.324 13.8149C10.1631 13.8458 9.99667 13.8286 9.84551 13.7655C9.69434 13.7024 9.56514 13.5961 9.47405 13.4599C9.38296 13.3238 9.33401 13.1638 9.33334 13V10.4167H8.625C7.3084 10.397 6.0033 10.6641 4.80028 11.1995C3.59726 11.7348 2.52514 12.5255 1.65834 13.5167C1.55388 13.6557 1.40852 13.7586 1.24264 13.8109C1.07676 13.8632 0.898673 13.8623 0.733335 13.8083C0.565081 13.7516 0.419363 13.6425 0.317429 13.4971C0.215494 13.3517 0.162674 13.1775 0.16667 13C0.16667 5.4 6.9 4.1 9.33334 3.875ZM8.625 8.73333C9.18235 8.73225 9.73915 8.76844 10.2917 8.84167C10.489 8.8716 10.6689 8.97132 10.7989 9.12272C10.9289 9.27411 11.0003 9.46713 11 9.66667V10.9917L14.8167 7.16667L11 3.34167V4.66667C11 4.88768 10.9122 5.09964 10.7559 5.25592C10.5996 5.4122 10.3877 5.5 10.1667 5.5C9.40834 5.5 3.40834 5.66667 2.10834 10.8583C3.99526 9.46713 6.28069 8.72188 8.625 8.73333Z"
                fill="#ffffff"
              />
            </svg>
            Share Course
          </Button>
          <div className="flex items-center gap-2 text-[#1E1E1E99]">
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8V11.75C13 13.1645 13 13.871 12.5605 14.3105C12.121 14.75 11.4145 14.75 10 14.75H2.875C2.37772 14.75 1.90081 14.5525 1.54917 14.2008C1.19754 13.8492 1 13.3723 1 12.875M13 8C13 9.4145 13 10.121 12.5605 10.5605C12.121 11 11.4145 11 10 11H2.875C2.37772 11 1.90081 11.1975 1.54917 11.5492C1.19754 11.9008 1 12.3777 1 12.875M13 8V4.25C13 2.8355 13 2.129 12.5605 1.6895C12.121 1.25 11.4145 1.25 10 1.25H4C2.5855 1.25 1.879 1.25 1.4395 1.6895C1 2.129 1 2.8355 1 4.25V12.875"
                stroke="#B69302"
                stroke-width="1.5"
              />
              <path
                d="M4.75 5H9.25"
                stroke="#B69302"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>

            <span className="text-xs">
              {course.chapters?.length}&nbsp;Chapters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
