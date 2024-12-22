import React from "react";
import Image from "next/image";
import Button from "@/components/Atoms/Button";
import dummy_img from "@/images/dummy-img.jpg";
import { TTeacher } from "@/components/utils/types";

interface TTeacherCardProps {
  type: "assessment" | "lecture";
  academicWeekDate: number;
  assessmentType?: string;
  teacher?: TTeacher;
  timeline?: string | Date;
  subject: string;
  lectureTopic?: string;
  time?: string | Date;
  assessmenTClass?: string;
  actionClick?: () => any;
  btnLink1: () => any;
  btnLink2: () => any;
}

const truncateAndElipses = (text: string, limit: number): string => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const TeacherCard: React.FC<TTeacherCardProps> = ({
  type,
  subject,
  time,
  academicWeekDate,
  lectureTopic,
  assessmentType,
  assessmenTClass,
  timeline,
  teacher,
  actionClick,
  btnLink1,
  btnLink2,
}) => {
  return (
    <div className='flex flex-col justify-center gap-6 border-[1.2px] border-dark/30 rounded-lg px-4 py-4 shadow-md w-full max-h-[300px]'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <Image
            src={teacher?.profileImage || dummy_img.src}
            alt='Profile Pics'
            width={20}
            height={20}
            className='shadow w-12 h-12 object-cover rounded-full'
          />
          <div className='flex flex-col justify-center'>
            <span className='text-dark text-sm md:text-base font-roboto leading-5'>
              {teacher?.name}
            </span>
            <span className='text-subtext text-xs sm:text-sm'>Teacher</span>
          </div>
        </div>
        <div
          className='flex items-center justify-center rounded-full cursor-pointer bg-white border-2 h-9 w-9 transition hover:scale-110'
          {...(actionClick ? { onClick: actionClick } : {})}
        >
          {type === "assessment" ? (
            <>
              <span className='w-[30px] h-[30px] flex items-center justify-center '>
                <i className='fas fa-pencil text-primary'></i>
              </span>
            </>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M12 18L16 14L14.6 12.6L13 14.2V10H11V14.2L9.4 12.6L8 14L12 18ZM5 8.00001V19H19V8.00001H5ZM5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V6.52501C3 6.29167 3.03767 6.06667 3.113 5.85001C3.18833 5.63334 3.30067 5.43334 3.45 5.25001L4.7 3.72501C4.88333 3.49167 5.11234 3.31234 5.387 3.18701C5.66167 3.06167 5.94934 2.99934 6.25 3.00001H17.75C18.05 3.00001 18.3377 3.06267 18.613 3.18801C18.8883 3.31334 19.1173 3.49234 19.3 3.72501L20.55 5.25001C20.7 5.43334 20.8127 5.63334 20.888 5.85001C20.9633 6.06667 21.0007 6.29167 21 6.52501V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM5.4 6.00001H18.6L17.75 5.00001H6.25L5.4 6.00001Z'
                fill='#32A8C4'
              />
            </svg>
          )}
        </div>
      </div>
      <div className='flex flex-col justify-center'>
        <span className='text-dark text-sm sm:text-base md:text-lg font-medium font-roboto'>
          {subject}
        </span>
        {type === "assessment" ? (
          <div className='flex flex-col gap-1'>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>Due:</b>
              <p>
                {new Date(timeline || "").toLocaleString("en-US", {
                  timeZoneName: "short",
                })}
              </p>
            </span>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>Type:</b>
              <p className='capitalize'>{assessmentType}</p>
            </span>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>Class:</b>
              <p className='capitalize'>{assessmenTClass}</p>
            </span>
          </div>
        ) : type === "lecture" ? (
          <>
            {lectureTopic && (
              <span className='flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
                <b className='font-roboto font-medium text-dark'>Topic:</b>
                <p
                  dangerouslySetInnerHTML={{
                    __html: truncateAndElipses(lectureTopic, 30),
                  }}
                ></p>
              </span>
            )}
            <span className='flex gap-1 text-xs md:text-sm text-subtext'>
              <b className='font-roboto font-medium text-dark'>Duration:</b>
              {new Date(time || "").toLocaleString()}
            </span>
          </>
        ) : (
          <></>
        )}
        <span className='flex gap-1 text-xs md:text-sm text-subtext mt-1'>
          <b className='font-roboto font-medium text-dark'>Week:</b>
          {academicWeekDate}
        </span>
      </div>

      <div className='flex items-center gap-4'>
        <Button size='xs' width='fit' onClick={btnLink1}>
          {type === "assessment" ? "Submissions" : "Start Lecture"}
        </Button>

        <Button onClick={btnLink2} width='fit' size='xs' color='outline'>
          Edit {type === "assessment" ? " Questions" : "Lecture"}
        </Button>
      </div>
    </div>
  );
};

export default TeacherCard;
