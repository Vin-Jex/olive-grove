import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/image/logo.png';
import AuthBg1 from '@/public/image/auth__bg2.png';
import AuthBg2 from '@/public/image/auth_bg.png';
import Button from '@/components/Atoms/Button';
import { useRouter } from 'next/router';
import CustomCursor from '@/components/Molecules/CustomCursor';

export type loginType = {
  username: string;
  password: string;
};

interface RoleCardProps {
  role: 'student' | 'teacher';
  selectedRole: string;
  handleCardClick: (role: string) => void;
  description: string;
}

const LoginPath = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  const handleCardClick = (role: string) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole === 'teacher') {
      router.push('/auth/path/teachers/login');
    } else if (selectedRole === 'student') {
      router.push('/auth/path/students/login');
    }
  };
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(selectedRole === '');
  }, [selectedRole]);

  return (
    <div className='flex w-full h-screen relative'>
      {/*<customcursor />*/}

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

      <div className='absolute inset-0 bg-black opacity-30 -z-10' />

      <div className='w-[95%] sm:w-fit md:w-[700px] flex flex-col items-center justify-center space-y-6 md:space-y-12 my-auto mx-auto z-10 p-4 sm:px-8 sm:py-10 bg-white rounded-lg shadow-lg'>
        <div className='flex flex-col items-center justify-center'>
          <Link href='/' className='w-[4.5rem] h-[5rem] -ml-4'>
            <Image
              src={logo}
              alt='Olive Grove Logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
          <h5 className='text-primary text-[20px] font-semibold capitalize font-roboto leading-[25px]'>
            How would you like to sign in?
          </h5>
          <p className='text-dark text-sm text-center'>
            Select your role to get started and access your dashboard.
          </p>
        </div>

        <div className='flex flex-col justify-center space-y-5'>
          <div className='flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0 md:space-x-4'>
            <RoleCard
              role='student'
              selectedRole={selectedRole}
              handleCardClick={handleCardClick}
              description='Join us as a student and access your classes and assignments.'
            />
            <RoleCard
              role='teacher'
              selectedRole={selectedRole}
              handleCardClick={handleCardClick}
              description='Become a teacher to create classes and manage assignments.'
            />
          </div>

          <div className='w-full md:max-w-full mx-auto'>
            <Button
              size='sm'
              width='full'
              disabled={isDisabled}
              onClick={handleLogin}
            >
              Login
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
    className={`flex-1 flex flex-col p-4 rounded-lg border-2 transition-all duration-300 ease-in-out ${
      selectedRole === role
        ? 'border-[#32A8C4] bg-[#32A8C4]/10 shadow-lg'
        : 'border-gray-300 hover:shadow-md cursor-pointer'
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
    <p className='text-gray-700 text-sm'>{description}</p>
  </div>
);

export default LoginPath;
