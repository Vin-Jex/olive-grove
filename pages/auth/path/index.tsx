import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";

export type loginType = {
  username: string;
  password: string;
};

interface RoleCardProps {
  role: "student" | "teacher";
  selectedRole: string;
  handleCardClick: (role: string) => void;
  description: string;
}

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
      router.push("/auth/path/students/signin");
    }
  };
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(selectedRole === "");
  }, [selectedRole]);

  return (
    <div className='flex w-full h-screen overflow-hidden relative'>
      <div className='absolute -right-[150px] -top-[150px] bg-primary/10 h-[490px] w-[490px] rounded-full blur-xl' />
      <div className='absolute -left-[150px] -bottom-[150px] bg-primary/10 h-[490px] w-[490px] rounded-full blur-xl' />

      <div className='w-[95%] sm:w-fit md:w-[800px] flex flex-col items-center justify-center space-y-6 md:space-y-12 my-auto mx-auto z-10 p-4 sm:px-8 sm:py-10 bg-white rounded-2xl shadow-[0px_5px_20px_#1E1E1E1A]'>
        <div className='flex flex-col items-center justify-center'>
          <Link href='/' className='w-[4rem] h-[4rem] -ml-4'>
            <Image
              src={logo}
              alt='Olive Grove Logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
          <h5 className='text-dark text-[20px] font-semibold first-letter:capitalize font-roboto leading-[25px]'>
            How would you like to sign in?
          </h5>
          <p className='text-dark text-sm text-center'>
            Select your role to get started and access your dashboard.
          </p>
        </div>

        <div className='flex flex-col justify-center space-y-5 w-[90%] md:w-[80%]'>
          <div className='flex flex-col justify-between w-full space-y-4'>
            <RoleCard
              role='student'
              selectedRole={selectedRole}
              handleCardClick={handleCardClick}
              description='Sign in to Olive Groove as a student and get access to classes and assignments.'
            />
            <RoleCard
              role='teacher'
              selectedRole={selectedRole}
              handleCardClick={handleCardClick}
              description='Sign in to Olive Groove as a teacher and create classes and assignments for your students.'
            />
          </div>

          <div className='w-full md:max-w-full mx-auto'>
            <Button
              size='sm'
              width='full'
              disabled={isDisabled}
              onClick={handleLogin}
            >
              Continue
            </Button>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-dark text-sm'>Need help? Contact support.</p>
          <Link href='/support' className='text-[#32A8C4] underline text-sm'>
            Support Center
          </Link>
        </div>
      </div>
    </div>
  );
};

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  selectedRole,
  handleCardClick,
  description,
}) => (
  <div
    className={`flex-1 flex flex-col p-4 rounded-lg border transition-all duration-300 ease-in-out hover:scale-95 ${
      selectedRole === role
        ? "border-[#32A8C4] bg-[#32A8C4]/10"
        : "border-[#1E1E1E]/10 cursor-pointer"
    }`}
    onClick={() => handleCardClick(role)}
  >
    <div className='flex justify-between items-center mb-2'>
      <h2 className='text-lg font-semibold text-[#32A8C4]'>{`As a ${
        role.charAt(0).toUpperCase() + role.slice(1)
      }`}</h2>
      <input
        type='radio'
        className='radio-check'
        checked={selectedRole === role}
        readOnly
      />
    </div>
    <p className='text-subtext text-sm w-[85%] md:w-[60%]'>{description}</p>
  </div>
);

export default LoginPath;
