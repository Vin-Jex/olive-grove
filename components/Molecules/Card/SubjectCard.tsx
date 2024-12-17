import React, { SetStateAction } from 'react';
import Image from 'next/image';
import Button from '@/components/Atoms/Button';
import img from '@/public/image/tutor.png';
import Link from 'next/link';

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
        !assessments && 'max-w-full'
      } border-dark/30 rounded-2xl p-6 shadow-card-2 w-full`}
    >
      <div className='flex items-center gap-3'>
        <Image
          src={img}
          alt='Profile Pics'
          className='shadow w-12 h-12 object-cover rounded-full'
        />
        <div className='flex gap-[0.1rem] flex-col justify-center'>
          <span className='text-dark h-5 text-base font-roboto leading-5'>
            {name}
          </span>
          <span className='text-subtext h-5 text-sm'>{role}</span>
        </div>
      </div>
      <div className='flex  flex-col gap-1 justify-center '>
        <span className='text-dark text-xl max-w-[89%] font-medium font-roboto'>
          {subject}
        </span>
        <div className='flex pb-2 justify-between gap-5 items-start'>
          <span
            className={`flex  gap-1 text-base  text-subtext ${
              topic.length >= 10 && assessments && 'items-center' // "flex-col items-start"
              // : "items-center"
            }`}
          >
            <b className='font-roboto font-medium block text-dark'>Topic:</b>
            <span className='sm:block hidden'>
              {topic.slice(0, 11) + '...'}{' '}
            </span>
            <span className='max-sm:block hidden'>{topic.slice(0, 7) + '...'} </span>
          </span>
          {assessments && (
            <span
              className={`flex  gap-1 text-base  text-subtext ${
                topic.length >= 10 && assessments && 'items-center' // "flex-col items-start"
                // : "items-center"
              }`}
            >
              <b className='font-roboto font-medium block text-dark'>Due:</b>
              <span className='block'> 20-11-2024, 9:30AM</span>
            </span>
          )}
        </div>
        {assessments && (
          <span
            className={`flex pb-3 gap-1 text-base  text-subtext ${
              topic.length >= 10 && assessments && 'items-center'
            }`}
          >
            <b className='font-roboto font-medium block text-dark'>
              Category:{' '}
            </b>
            <span className='block'>Test</span>
          </span>
        )}
        <span className='flex gap-1  max-w-[88%] text-sm text-wrap text-subtext'>
          little introduction into the course (sort of summary)
        </span>
      </div>

      <div className='flex lg:flex-col lg:items-start min-[1580px]:items-center min-[1580px]:flex-row justify-between items-center gap-4'>
        <>
          <Link
            className='w-fit !text-white bg-primary hover:bg-[#28a1b0] transition duration-200 ease-in-out rounded-[4px] px-2 md:px-3 lg:px-4 !py-1.5 lg:py-3 text-sm md:text-base font-medium'
            href={btnLink2}
            passHref
          >
            {assessments ? 'View Assessment' : 'View Lecture'}
          </Link>
        </>
        <Label
          date=''
          upcoming={true}
          type={assessments ? 'assessments' : ''}
        />
      </div>
    </div>
  );
};

function Label({
  date,
  upcoming,
  type,
}: {
  date: string;
  upcoming: boolean;
  type?: string;
}) {
  return (
    <>
      {upcoming ? (
        <span className='px-3 py-2 flex items-center h-8 text-xs rounded-full text-[#1E1E1E] text-opacity-60 bg-[#B69302] bg-opacity-10'>
          <SVGDot className='mr-2 block' />
          {type === 'assessments' ? 'New' : 'Upcoming'}
        </span>
      ) : (
        <span className='bg-[#1E1E1E] bg-opacity-10 px-4   py-2 rounded-full text-[#1E1E1E] text-opacity-60 '>
          20/11/2024
        </span>
      )}
    </>
  );
}

export default SubjectCard;

const SVGDot = (props: { className?: string }) => (
  <svg
    width='9'
    height='8'
    className={props.className}
    viewBox='0 0 9 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='4.5' cy='4' r='4' fill='#B69302' />
  </svg>
);
