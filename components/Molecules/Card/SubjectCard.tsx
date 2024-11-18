import React from "react";
import Image from "next/image";
import Button from "@/components/Atoms/Button";
import img from "@/public/image/tutor.png";
import Link from "next/link";

interface SubjectProps {
  assessments?: boolean;
  name: string;
  role: string;
  subject: string;
  topic: string;
  time: string;
  btnLink1: string;
  btnLink2: string;
}

const SubjectCard: React.FC<SubjectProps> = ({
  assessments,
  name,
  role,
  subject,
  topic,
  time,
  btnLink1,
  btnLink2,
}) => {
  return (
    <div className="flex flex-col justify-center gap-6 border-[1.2px] border-dark/30 rounded-xl p-6 shadow-md w-full">
      <div className="flex items-center gap-3">
        <Image
          src={img}
          alt="Profile Pics"
          className="shadow w-16 h-16 object-cover rounded-full"
        />
        <div className="flex flex-col justify-center">
          <span className="text-dark text-lg font-roboto leading-5">
            {name}
          </span>
          <span className="text-subtext">{role}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center ">
        <span className="text-dark text-2xl font-medium font-roboto">
          {subject}
        </span>
        {!assessments && (
          <span className="flex gap-1 text-base text-subtext">
            <b className="font-roboto font-medium text-dark">Topic:</b>
            {topic}
          </span>
        )}
        <span className="flex gap-1 text-base text-subtext">
          <b className="font-roboto font-medium text-dark">
            {assessments ? "Due" : "Duration"}:
          </b>
          {time}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href={btnLink1} passHref>
          <Button size="sm">{assessments ? "Submit" : "Join Lecture"}</Button>
        </Link>
        <Link href={btnLink2} passHref>
          <Button width="fit" size="sm" color="outline">
            View {assessments ? "Assignment" : "Lecture"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubjectCard;
