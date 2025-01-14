import React, { SetStateAction, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import Button from '@/components/Atoms/Button';
import dummyImage from '@/public/image/tutor.png';
import Link from 'next/link';
import { baseUrl } from '@/components/utils/baseURL';
import axiosInstance from '@/components/utils/axiosInstance';

interface SubjectProps {
  assessments?: boolean;
  name: string;
  role: string;
  img?: string | StaticImageData;
  // type: "lecture" | "assessment";
  description?: string;
  teacherImage?: string;
  category?: string;
  subject: string;
  topic: string;
  time: string;
  toggleModal: () => void;
  btnLink2: string;
}

const SubjectCard: React.FC<SubjectProps> = ({
  assessments,
  teacherImage,
  name,
  role,
  subject,
  category,
  topic,
  time,
  description,
  img,
  toggleModal,
  btnLink2,
}) => {
  //name, suubejct

  return (
    <div
      className={`flex flex-col  justify-center gap-6 ${
        !assessments && 'max-w-full'
      } border-dark/30 rounded-2xl p-6 shadow-card-2 w-full`}
    >
      <div className='flex items-center gap-3'>
        <Image
          src={teacherImage ?? dummyImage}
          width={50}
          height={50}
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
          <span className={`flex  gap-1 text-base  text-subtext items-center `}>
            <b className='font-roboto font-medium block text-dark'>Topic:</b>
            <span
              className='sm:block pt-0.5 hidden text-sm'
              dangerouslySetInnerHTML={{ __html: topic.slice(0, 11) + '...' }}
            />
            <span
              className='max-sm:block hidden'
              dangerouslySetInnerHTML={{ __html: topic.slice(0, 7) + '...' }}
            />
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
            <span className='block'>{category}</span>
          </span>
        )}
        <span className='flex gap-1  max-w-[88%] text-sm text-wrap text-subtext'>
          {description}
        </span>
      </div>

      <div className='flex lg:flex-col lg:items-start min-[1580px]:items-center min-[1580px]:flex-row justify-between items-center gap-4'>
        <Link
          className='bg-primary text-[#fdfdfd] hover:bg-primary/90 transition duration-200 ease-in-out px-2 md:px-2.5 lg:px-3 py-2 lg:py-2.5 text-xs md:text-sm font-medium rounded-md font-roboto'
          href={btnLink2}
          passHref
        >
          {assessments ? 'View Assessment' : 'View Lecture'}
        </Link>
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
        <span className='px-3 py-2 flex items-center h-[28px] text-xs rounded-full text-[#1E1E1E] text-opacity-60 bg-[#B69302] bg-opacity-10'>
          <SVGDot className='mr-2 block' />
          <span className='pt-[2px]'>
            {' '}
            {type === 'assessments' ? 'New' : 'Upcoming'}
          </span>
        </span>
      ) : (
        <span className='bg-[#1E1E1E] h-[28px] text-xs bg-opacity-10 px-4   py-2 rounded-full text-[#1E1E1E] text-opacity-60 '>
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
