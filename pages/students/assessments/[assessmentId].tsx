import { useRouter } from "next/router";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { useState } from "react";
import Image from "next/image";
import img from "@/public/image/tutor.png";
import Link from "next/link";
import Button from "@/components/Atoms/Button";
import withAuth from "@/components/Molecules/WithAuth";

const AssessmentDetailsPage = () => {
  const router = useRouter();
  const [startExercise, setStartExercise] = useState(false);
  const { assessmentId } = router.query;

  return (
    <StudentWrapper
      title={`Assessment`}
      metaTitle={`Olive Groove ~ ${assessmentId} assessment`}
    >
      {/* <div className='p-6 sm:p-8 md:p-12 space-y-5'>
        <div className='flex flex-col'>
          <span className='text-base sm:text-lg font-medium text-dark font-roboto'>
            Access your Assessments
          </span>
          <span className='text-sm sm:text-md text-subtext font-roboto'>
            Manage, submit and access your assessments.
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
                {assessmentId}
              </span>

              <span className='flex gap-1  text-sm text-base text-subtext'>
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
                <b className='font-roboto font-medium text-dark'>Due:</b>
                09:00AM - 10:30AM
              </span>

              <Link href='#' passHref>
                <Button size='sm'>Submit</Button>
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      <div className="mx-11 max-w-[60vw]">
        <div className=" py-4 px-6  rounded-md bg-[#32A8C4] bg-opacity-10 w-full">
          <h2 className="text-3xl py-5">Physics Class Exercise</h2>
          <div className="flex justify-between">
            <span>
              <strong>Topic:</strong> Fundamentals of Motion
            </span>
            <span>
              <strong>Due:</strong> 20-11-2024, 9:30AM
            </span>
          </div>
        </div>
        {!startExercise ? (
          <div className=" px-5">
            <p className="py-6">
              This midterm test is a multiple-choice type of exam made up of 5
              questions with options. Ensure to attempt all questions and finish
              before the time is up. You have 25minutes.
            </p>
            <p className="py-6">Click on the button below to begin.</p>
            <Button
              onClick={() => setStartExercise((c) => !c)}
              color="blue"
              size="md"
            >
              Start Exercise
            </Button>
          </div>
        ) : (
          <div className="py-5 space-y-10">
            <QuestionCard />
            <QuestionCard />
          </div>
        )}
      </div>
    </StudentWrapper>
  );
};

function QuestionCard() {
  return (
    <div className="space-y-3">
      <strong>1. What is Displacement</strong>
      <div className="space-y-3">
        <input type="radio" id="html" name="fav_language" value="HTML" />
        <label htmlFor="html" className="pl-3">
          HTML
        </label>
        <br />
        <input type="radio" id="css" name="fav_language" value="CSS" />
        <label htmlFor="css" className="pl-3">
          CSS
        </label>
        <br />
        <input
          type="radio"
          id="javascript"
          name="fav_language"
          value="JavaScript"
        />
        <label htmlFor="javascript" className="pl-3">
          JavaScript
        </label>
      </div>
    </div>
  );
}

export default withAuth("Student", AssessmentDetailsPage);
