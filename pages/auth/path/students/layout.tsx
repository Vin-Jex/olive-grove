import Meta from '@/components/Atoms/Meta';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import LayoutImage from '@/public/image/student7.png';
import Link from 'next/link';
import logo from '@/public/image/logo.png';

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className='relative overflow-hidden'>
      <Meta title={title} description={description} />
      <main className='flex w-full h-screen relative overflow-hidden'>
        {/* Fixed image on the left */}
        <aside className='lg:w-[50vw] overflow-hidden h-screen fixed left-0 hidden lg:block'>
          <Image
            src={LayoutImage}
            alt='Layout content'
            className='w-[50vw] h-screen object-cover object-[20%] fixed left-0'
          />

          <div className='flex flex-col items-center justify-center py-4 absolute bottom-0 z-10 w-full min-h-60 bg-gradient-to-t from-black via-black/70 to-transparent'>
            <div className='flex flex-col items-center justify-center w-[60%] text-center'>
              <span className='font-roboto font-semibold text-white text-2xl'>
                Olive Grove Student/Teacher Portal.
              </span>
              <span className='text-sm text-[#F8F8F8CC]'>
                As a student you get access to all your classes, lectures,
                assessments and even your activity progress. As a teacher you
                are able to create and manage your classes, lectures and
                assessments while also viewing your student performances on
                their courses.
              </span>

              <div className='flex items-center lg:flex-col min-[1385px]:flex-row lg:gap-4 justify-center space-x-4 text-white/70 mt-5'>
                <span className='bg-[#f8f8f8] bg-opacity-20 px-7 py-2 rounded-full'>
                  Flexibility of Management
                </span>
                <span className='bg-[#f8f8f8] bg-opacity-20 px-5 py-2 rounded-full'>
                  24/7 Accessibility
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content, adjust width with calc */}
        <main
          className='bg-white fixed h-screen lg:w-[50vw] w-screen right-0 overflow-hidden'
          // style={{ width: "calc(100% - 50%)" }}
        >
          <Image
            src={logo}
            alt='Olive Grove Logo'
            width='10000'
            height='10000'
            className='object-cover w-12 h-12 absolute top-4 left-5 cursor-pointer z-10'
            onClick={() => window.location.replace('/')}
          />

          <div className='absolute -right-[200px] -top-[200px] bg-primary/10 h-[490px] w-[490px] rounded-full blur-xl' />
          <div className='absolute -left-[200px] -bottom-[200px] bg-primary/10 h-[490px] w-[490px] rounded-full blur-xl' />
          {children}
        </main>
      </main>
    </div>
  );
};

export default AuthLayout;
