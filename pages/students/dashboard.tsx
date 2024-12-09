import Cookies from 'js-cookie';
import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, { useEffect, useState } from 'react';
import Img from '@/public/image/welcome_img.svg';
import Image from 'next/image';
import ClassCard from '@/components/Molecules/Card/ClassCard';
import ClassModal from '@/components/Molecules/Modal/ClassModal';
import withAuth from '@/components/Molecules/WithAuth';
import { baseUrl } from '@/components/utils/baseURL';
import Calendar from '@/components/Molecules/Calendar';
import axiosInstance from '@/components/utils/axiosInstance';

const TodayClass = [
  {
    subject: 'Physics',
    time: '08:30AM - 9:30AM',
    description: 'Introduction to Physics',
    teacher: 'Mr. John Doe',
  },
  {
    subject: 'English Studies',
    time: '09:40AM - 10:20AM',
    description: 'Introduction to English',
    teacher: 'Mrs. Jane Doe',
  },
  {
    subject: 'Chemistry',
    time: '10:30AM - 11:30AM',
    description: 'Introduction to Chemistry',
    teacher: 'Mr. John Doe',
  },
  {
    subject: 'Agricultural Studies',
    time: '11:40AM - 12:20PM',
    description: 'Introduction to Agriculture',
    teacher: 'Mrs. Jane Doe',
  },
  {
    subject: 'Computer Science',
    time: '12:30PM - 1:30PM',
    description: 'Introduction to Computer Science',
    teacher: 'Mr. John Doe',
  },
];

type CardProps = {
  header: string;
  main: string;
  footer?: string;
};

function Card({ header, main, footer = '' }: CardProps) {
  return (
    <div className='flex flex-col justify-start text-start w-full  space-y-3 rounded-md shadow-card py-4 px-6'>
      <h3 className='font-roboto font-medium text-sm sm:text-base w-full text-secondary'>
        {header}
      </h3>
      <span className='text-dark font-semibold text-2xl md:text-3xl'>
        {main}
      </span>
      <span className='text-sm text-gray-400'>{footer}</span>
    </div>
  );
}

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalAss, setOpenModalAss] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    firstName: '',
  });
  useEffect(() => {
    async function fetchStudentProfile() {
      try {
        const response = await axiosInstance.get(`${baseUrl}/student`);

        setStudentInfo({ firstName: response.data.firstName });
      } catch (err) {
        //how to display error.
      }
    }
    fetchStudentProfile();
  }, []);

  const handleModal = () => {
    setOpenModal(!openModal);
  };
  const handleModalAssignment = () => {
    setOpenModalAss(!openModalAss);
  };
  return (
    <>
      <ClassModal
        type='class'
        handleModalClose={handleModal}
        modalOpen={openModal}
      />
      <ClassModal
        type='assignment'
        handleModalClose={handleModalAssignment}
        modalOpen={openModalAss}
      />
      <StudentWrapper title='Dashboard' metaTitle='Olive Groove ~ Dashboard'>
        <div className='p-4 sm:p-6 md:p-8 lg:p-12 space-y-5'>
          {/* start */}
          <div className='xl:grid xl:grid-cols-[3fr_1fr] xl:gap-4'>
            <div className='bg-primary w-full rounded-3xl font-roboto relative overflow-hidden h-full '>
              <div className='flex flex-col h-full justify-center my-auto px-4 sm:px-6 md:px-9 py-6 sm:py-8 md:py-11 w-full z-10'>
                <h3 className='font-roboto font-medium text-xl md:text-2xl lg:text-3xl lg:text-[3.125rem] text-light leading-tight sm:leading-snug md:leading-[3.75rem] mb-2 sm:mb-4'>
                  Welcome back, {studentInfo.firstName}
                </h3>
                <span className='text-sm sm:text-base text-light/80 font-roboto'>
                  You have 3 classes and 2 assignments to attend to.
                </span>
                <span className='text-sm sm:text-base text-light/80 font-roboto mt-1'>
                  Continue learning to become the best!
                </span>
              </div>
              <div className='w-[80px] sm:w-[130px] md:w-[160px] lg:w-[400px]  absolute right-0 bottom-0'>
                <Image
                  src={Img}
                  alt={`${Img} Pics`}
                  className='w-full h-full object-contain sm:object-scale-down'
                  width={400}
                  height={300}
                />
              </div>
            </div>
            <div className=' h-full rounded-lg p-2'>
              <Calendar />
            </div>
          </div>
          {/* <div className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-7 border-2 w-full rounded-3xl font-roboto gap-4 sm:gap-5 md:gap-6"> */}

          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 backdrop-blur-md'>
            <Card
              header='CGPA'
              main='3.42'
              footer='You are top 5 in the class, keep diong well'
            />
            <Card
              header='Grade'
              main='SSS 2'
              footer='Keep studying to progress to your next class.'
            />
            <Card
              header='No. of Courses'
              main='8'
              footer='Mathematics, English, Physics, Chemistry, Biology'
            />
            <Card
              header='Current Session'
              main='2021/2022'
              footer='NExt session starts in 3 months'
            />
          </div>
          {/* </div> */}

          <div className='flex flex-col sm:flex-row w-full gap-4 sm:gap-6 md:gap-8 mt-4 rounded-xl sm:mt-6 md:mt-8 '>
            <div className='w-full sm:w-1/2 shadow-2xl rounded-xl'>
              <ClassCard
                modalOpen={handleModal}
                data={TodayClass}
                title='class'
              />
            </div>
            <div className='w-full sm:w-1/2 mt-4 sm:mt-0 shadow-2xl rounded-xl'>
              <ClassCard modalOpen={handleModalAssignment} title='assignment' />
            </div>
          </div>
        </div>
      </StudentWrapper>
    </>
  );
};

export default withAuth('Student', Dashboard);
