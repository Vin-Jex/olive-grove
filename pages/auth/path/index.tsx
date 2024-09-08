import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import AuthBg1 from "@/public/image/auth__bg2.png";
import AuthBg2 from "@/public/image/auth_bg.png";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";

export type loginType = {
  username: string;
  password: string;
};

const LoginPath = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");

  const handleCardClick = (role: string) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole === "teacher") {
      router.push("/auth/path/teachers/login");
    } else if (selectedRole === "student") {
      router.push("/auth/path/students/login");
    }
  };

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (selectedRole === "") setIsDisabled(true);
    else setIsDisabled(false);
  }, [selectedRole]);

  return (
    <div className='flex w-full h-screen relative'>
      <Image
        src={AuthBg1}
        alt='Auth Background Image 2'
        className='absolute -z-50 bottom-0 left-0'
      />
      <Image
        src={AuthBg2}
        alt='Auth Background Image 2'
        className='absolute -z-50 top-0 right-0'
      />

      <div className='w-full md:w-[717px] flex flex-col items-center justify-center space-y-6 md:space-y-12 my-auto mx-auto'>
        <div className='flex flex-col items-center justify-center space-y-2 md:space-y-6'>
          <Link href='/' className='w-[4.5rem] h-[5rem] -ml-4 -mb-2'>
            <Image
              src={logo}
              alt='Olive_grove_logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
          <h5 className='text-dark text-[20px] font-semibold capitalize font-roboto leading-[25px]'>
            How do you want to sign in?
          </h5>
        </div>

        <div className='flex flex-col justify-center space-y-5'>
          <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-x-8 md:space-y-0'>
            <div
              className={`cursor-pointer border-2 ${
                selectedRole === "teacher"
                  ? "border-primary"
                  : "border-primary/80"
              } rounded-lg py-2 mb-2 flex flex-col justify-center gap-y-1 w-full h-full min-h-[133px] max-w-[80%] md:max-w-[287px] px-5 `}
              onClick={() => handleCardClick("student")}
            >
              <div className='flex justify-between  items-center'>
                <h2 className='font-roboto font-semibold text-primary text-xl leading-6'>
                  As a Student
                </h2>

                <input
                  type='radio'
                  className='radio-check'
                  checked={selectedRole === "student"}
                  readOnly
                />
              </div>
              <p className='font-roboto font-normal text-subtext text-base leading-5'>
                Sign in to Olive Groove as a student and get access to classes
                and assignments.
              </p>
            </div>

            <div
              className={`cursor-pointer border-2 ${
                selectedRole === "teacher"
                  ? "border-primary"
                  : "border-primary/80"
              } rounded-lg py-2 mb-2 flex flex-col justify-center gap-y-1 w-full h-full min-h-[133px] max-w-[80%] md:max-w-[287px] px-5 `}
              onClick={() => handleCardClick("teacher")}
            >
              <div className='flex justify-between  items-center'>
                <h2 className='font-roboto font-semibold text-primary text-xl leading-6'>
                  As a Teacher
                </h2>

                <input
                  type='radio'
                  className='radio-check'
                  checked={selectedRole === "teacher"}
                  readOnly
                />
              </div>
              <p className='font-roboto font-normal text-subtext text-base leading-5'>
                Sign in to Olive Groove as a teacher and create classes and
                assignments for your students.
              </p>
            </div>
          </div>

          <div className='w-full max-w-[80%] md:max-w-full mx-auto'>
            <Button
              size='md'
              width='full'
              disabled={isDisabled}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPath;
