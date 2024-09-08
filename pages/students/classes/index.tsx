import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React from "react";
import SubjectCard from "@/components/Molecules/Card/SubjectCard";
import Link from "next/link";
import withAuth from "@/components/Molecules/WithAuth";

export const subjectData = [
  {
    subject: "Further Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Calculus",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Chemistry",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Organic Chemistry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Physics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Motion",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Trigonomentry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
];

const Classes = () => {
  return (
    <StudentWrapper title='Classes' metaTitle='Olive Groove ~ Classes'>
      <div className='p-12 space-y-5'>
        {/* Title */}
        <div className='flex flex-col'>
          <span className='text-lg font-medium text-dark font-roboto'>
            Explore your classes
          </span>
          <span className='text-md text-subtext font-roboto'>
            Manage and join your classes.
          </span>
        </div>

        <div className='grid grid-cols-3 h-fit w-full gap-8 !mt-8'>
          {subjectData.map((subject, index) => (
            <SubjectCard
              key={index}
              name={subject.name}
              role={subject.role}
              time={subject.time}
              topic={subject.topic}
              subject={subject.subject}
              btnLink1={subject.btnLink1}
              btnLink2={`/students/classes/${subject.subject?.toLocaleLowerCase()}`}
            />
          ))}
        </div>
      </div>
    </StudentWrapper>
  );
};

export default withAuth("Student", Classes);
