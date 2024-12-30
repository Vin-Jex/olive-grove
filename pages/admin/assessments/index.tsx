import React from "react";
import { subjectData } from "../lectures";
import withAuth from "@/components/Molecules/WithAuth";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import AssessmentCard from "@/components/Molecules/Card/AssessmentCard";
import AdminsWrapper from "@/components/Molecules/Layouts/Admin.Layout";

const Assessments = () => {
  const router = useRouter();
  return (
    <AdminsWrapper
      isPublic={false}
      title='Assessments'
      metaTitle='Olive Grove ~ Assessments'
    >
      <div className='p-12 space-y-5'>
        {/* Title */}
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-medium text-dark font-roboto'>
              Access Assessments
            </span>
            <span className='text-md text-subtext font-roboto'>
              Manage, create and access assessments.
            </span>
          </div>
          <Button
            size='md'
            width='fit'
            onClick={() => router.push(`/teachers/assessments/create`)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <path
                d='M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z'
                fill='#FDFDFD'
              />
            </svg>
            <span className=''>Create Task</span>
          </Button>
        </div>

        {Object.keys(subjectData).map((week, index) => (
          <div key={index} className='grid grid-cols-3 gap-8 !my-14'>
            {subjectData[week].map((subject, sIndex) => (
              <AssessmentCard
                key={sIndex}
                name={subject.name}
                role={subject.role}
                time={subject.time}
                subject={subject.subject.title}
                assessmentType='Class Work'
                btnLink1={() => {
                  router.push(`/teachers/assessments/${sIndex}`);
                }}
                btnLink2={() => {
                  router.push(`/teachers/assessments/create`);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </AdminsWrapper>
  );
};

export default withAuth("Admin", Assessments);
