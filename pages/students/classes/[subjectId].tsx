import { useRouter } from "next/router";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React from "react";
import Image from "next/image";
import img from "@/public/image/tutor.png";
import Link from "next/link";
import Button from "@/components/Atoms/Button";
import withAuth from "@/components/Molecules/WithAuth";

const SubjectDetailsPage = () => {
  const router = useRouter();
  const { subjectId } = router.query;

  return (
    <StudentWrapper title={`Courses`} metaTitle={`Olive Groove ~ ${subjectId}`}>
      <div className='p-6 sm:p-8 md:p-12 space-y-5'>
        <div className='flex flex-col'>
          <span className='text-base sm:text-lg font-medium text-dark font-roboto'>
            Explore your classes
          </span>
          <span className='text-sm sm:text-md text-subtext font-roboto'>
            Manage and join your classes.
          </span>
        </div>

        <div className='flex flex-col md:flex-row items-start gap-4 p-6'>
          <Image
            src={img}
            alt='Profile Pics'
            className='shadow w-16 h-16 object-cover rounded-full'
          />
          <div className='flex flex-col gap-6 md:gap-12'>
            <div className='flex flex-col justify-center'>
              <span className='text-dark text-base sm:text-lg font-roboto leading-5'>
                Dr. Ayodeji Emmanuel
              </span>
              <span className='text-subtext'>Teacher</span>
            </div>

            <div className='flex flex-col justify-center gap-2.5'>
              <span className='text-dark text-xl sm:text-2xl font-medium font-roboto capitalize'>
                {subjectId}
              </span>

              <span className='flex gap-1 text-sm sm:text-base text-subtext'>
                <b className='font-roboto font-medium text-dark'>Topic:</b>
                Complex Numbers
              </span>

              <div className='max-w-full md:max-w-[700px] text-subtext text-sm sm:text-base font-roboto'>
                The complex number is basically the combination of a real number
                and an imaginary number. The complex number is in the form of
                a+ib, where a = real number and ib = imaginary number. Also, a,b
                belongs to real numbers and i = √-1.
                <br />
                <br />
                Hence, a complex number is a simple representation of addition
                of two numbers, i.e., real number and an imaginary number. One
                part of it is purely real and the other part is purely
                imaginary.
              </div>
            </div>

            <div className='flex flex-col justify-center gap-2'>
              <span className='flex gap-1 text-sm sm:text-base text-subtext'>
                <b className='font-roboto font-medium text-dark'>Duration:</b>
                09:00AM - 10:30AM
              </span>

              <Link href='#' passHref>
                <Button size='sm'>Join Class</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentWrapper>
  );
};

export default withAuth("Student", SubjectDetailsPage);
