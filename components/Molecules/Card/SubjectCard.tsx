import React, { SetStateAction } from "react";
import Image from "next/image";
import Button from "@/components/Atoms/Button";
import img from "@/public/image/tutor.png";
import Link from "next/link";

interface SubjectProps {
  assessments?: boolean;
  name: string;
  role: string;
  // type: "lecture" | "assessment";
  subject: string;
  topic: string;
  time: string;
  toggleModal: () => void;
  btnLink2: string;
}

const SubjectCard: React.FC<SubjectProps> = ({
  assessments,
  name,
  role,
  subject,
  topic,
  time,
  // type,
  toggleModal,
  btnLink2,
}) => {
  return (
    <div
      className={`flex flex-col  justify-center gap-6 ${
        !assessments && "max-w-full"
      } border-dark/30 rounded-xl p-6 shadow-card-2 w-full`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={img}
          alt="Profile Pics"
          className="shadow w-16 h-16 object-cover rounded-full"
        />
        <div className="flex gap-2 flex-col justify-center">
          <span className="text-dark text-lg font-roboto leading-5">
            {name}
          </span>
          <span className="text-subtext">{role}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center ">
        <span className="text-dark text-2xl font-medium font-roboto">
          {subject}
        </span>
        <div className="flex justify-between gap-5 items-start">
          <span
            className={`flex  gap-1 text-base  text-subtext ${
              topic.length >= 10 && assessments
                ? "flex-col items-start"
                : "items-center"
            }`}
          >
            <b className="font-roboto font-medium block text-dark">Topic:</b>
            <span className="block">{topic}</span>
          </span>
          {assessments && (
            <span
              className={`flex  gap-1 text-base  text-subtext ${
                topic.length >= 14 ? "flex-col items-start" : "items-center"
              }`}
            >
              <b className="font-roboto font-medium block text-dark">Due:</b>
              <span className="block"> 20-11-2024, 9:30AM</span>
            </span>
          )}
        </div>
        <span className="flex gap-1 text-base text-subtext">
          {/* <b className="font-roboto font-medium text-dark">
            {assessments ? "Due" : "Duration"}:
          </b>
          {time} */}
          little introduction into the course(sort of summary)
        </span>
      </div>

      <div className="flex lg:flex-col lg:items-start min-[1580px]:items-center min-[1580px]:flex-row items-center gap-4">
        {!assessments && (
          <>
            <Link
              className="w-fit border-primary border hover:bg-[#28a1b0] transition duration-200 ease-in-out hover:text-white rounded-md px-2 md:px-3 lg:px-4 !py-2 lg:py-3 text-sm md:text-base font-medium"
              href={btnLink2}
              passHref
            >
              {assessments ? "Submit" : "Join Lecture"}
            </Link>
            <Button onClick={toggleModal} className="!py-2" size="sm">
              View {assessments ? "Assignment" : "Lecture"}
            </Button>
          </>
        )}
        {assessments && (
          <Link
            className="w-fit px-2 md:px-3 bg-[#32A8C4] rounded-md text-[#fdfdfd]  lg:px-4 py-2.5 lg:py-3 text-sm md:text-base font-medium"
            href={btnLink2}
            passHref
          >
            View Assignment
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;
