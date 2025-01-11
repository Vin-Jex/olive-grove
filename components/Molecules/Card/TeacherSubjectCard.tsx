import React from "react";
import Button from "@/components/Atoms/Button";
import { TAssessment, TTeacher } from "@/components/utils/types";

interface TTeacherCardProps {
  type: "assessment" | "lecture";
  academicWeekDate: number;
  assessmentType?: string;
  timeline?: string | Date;
  course: string;
  assessment?: TAssessment<"get">;
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
  course,
  assessment,
  time,
  academicWeekDate,
  lectureTopic,
  assessmentType,
  assessmenTClass,
  timeline,
  actionClick,
  btnLink1,
  btnLink2,
}) => {
  return (
    <div className='flex flex-col gap-3 rounded-2xl shadow-card px-6 pt-4 pb-5 w-full max-h-[300px]'>
      <div className='flex flex-col justify-center space-y-3.5'>
        <span className='font-bold font-roboto text-dark/90 text-sm sm:text-base md:text-xl'>
          {course || "Title is not specified."}
        </span>
        {type === "assessment" ? (
          <div className='flex flex-col space-y-4'>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>
                Assessment Type:
              </b>
              <p className='capitalize'>{assessment?.assessmentType?.name}</p>
            </span>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>
                Assessment Week:
              </b>
              <p className='capitalize'>
                {assessment?.academicWeek?.weekNumber} (
                {assessment?.academicWeek?.academicYear || "N/A"})
              </p>
            </span>
            <span className='w-full flex gap-1 text-xs sm:text-sm md:text-base text-subtext'>
              <b className='font-roboto font-medium text-dark'>Due Date:</b>
              <p>
                {new Date(assessment?.dueDate! || "").toLocaleString("en-US", {
                  timeZoneName: "short",
                })}
              </p>
            </span>

            <span
              className='text-subtext text-[15px]'
              dangerouslySetInnerHTML={{
                __html: truncateAndElipses(assessment?.description!, 60),
              }}
            />
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
      </div>

      <div className='flex items-center mt-3 space-x-4'>
        <Button size='xs' width='fit' onClick={btnLink1}>
          {type === "assessment" ? "View Assessment" : "Start Lecture"}
        </Button>

        <Button
          onClick={btnLink2}
          width='fit'
          size='xs'
          className='!border-dark !text-dark hover:!text-white hover:!border-primary'
          color='outline'
        >
          {type === "assessment" ? "Edit Assessment details" : "Edit Lecture"}
        </Button>
      </div>
    </div>
  );
};

export default TeacherCard;
