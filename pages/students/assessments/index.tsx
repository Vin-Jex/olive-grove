import SubjectCard from '@/components/Molecules/Card/SubjectCard';
import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, { useEffect, useState } from 'react';
import { subjectData } from '../lectures';
import withAuth from '@/components/Molecules/WithAuth';
import axiosInstance from '@/components/utils/axiosInstance';
import { baseUrl } from '@/components/utils/baseURL';

const Assessments = () => {
  const [currentAssessments, setCurrentAssessments] = useState(); //properly type this.

  useEffect(() => {
    const fethchAssessments = async () => {
      try {
        const response = await axiosInstance(`${baseUrl}/student/assessments`);
        setCurrentAssessments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
  }, []);
  return (
    <StudentWrapper
      firstTitle='Assessments'
      remark='Manage, submit and access your assessments.'
      title='Assessments'
      metaTitle='Olive Groove ~ Assessments'
    >
      <div className='p-6 sm:p-8 md:p-12 space-y-5'>
        {/* Title */}
        {/* <div className='flex flex-col'>
          <span className='text-base lg:text-3xl  sm:text-lg font-medium text-dark font-roboto'>
            Access your Assessments
          </span>
          <span className='text-sm sm:text-md text-subtext font-roboto'>
            Manage, submit and access your assessments.
          </span>
        </div> */}

        <div className='grid max-md:place-items-center  md:grid-cols-2 lg:grid-cols-3  h-fit w-full gap-8 !mt-8'>
          {subjectData.map((subject, index) => (
            <SubjectCard
              key={index}
              assessments
              toggleModal={() => {}}
              // type="assessment"
              name={subject.name}
              role={subject.role}
              time={subject.time}
              topic={subject.topic}
              subject={subject.subject}
              btnLink2={`/students/assessments/${subject.subject?.toLocaleLowerCase()}`}
            />
          ))}
        </div>
      </div>
    </StudentWrapper>
  );
};

// export default Assessments;

export default withAuth('Student', Assessments);
