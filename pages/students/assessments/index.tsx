import SubjectCard from "@/components/Molecules/Card/SubjectCard";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React from "react";
import { subjectData } from "../lectures";
import withAuth from "@/components/Molecules/WithAuth";

const Assessments = () => {
  return (
    <StudentWrapper title='Assessments' metaTitle='Olive Groove ~ Assessments'>
      <div className='p-6 sm:p-8 md:p-12 space-y-5'>
        {/* Title */}
        <div className='flex flex-col'>
          <span className='text-base sm:text-lg font-medium text-dark font-roboto'>
            Access your Assessments
          </span>
          <span className='text-sm sm:text-md text-subtext font-roboto'>
            Manage, submit and access your assessments.
          </span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-fit w-full gap-6 sm:gap-8 mt-8'>
          {subjectData.map((subject, index) => (
            <SubjectCard
              key={index}
              assessments
              name={subject.name}
              role={subject.role}
              time={subject.time}
              topic={subject.topic}
              subject={subject.subject}
              btnLink1={subject.btnLink1}
              btnLink2={`/students/assessments/${subject.subject?.toLocaleLowerCase()}`}
            />
          ))}
        </div>
      </div>
    </StudentWrapper>
  );
};

export default withAuth("Student", Assessments);
