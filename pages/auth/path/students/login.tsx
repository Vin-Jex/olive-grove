import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/image/logo.png';
import AuthBg1 from '@/public/image/auth__bg.png';
import AuthBg2 from '@/public/image/auth_bg.png';
import AuthBg3 from '@/public/image/Frame 5.png';
import Input from '@/components/Atoms/Input';
import Button from '@/components/Atoms/Button';
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import CustomCursor from '@/components/Molecules/CustomCursor';
import { CircularProgress } from '@mui/material';
import { baseUrl } from '@/components/utils/baseURL';
import exp from 'constants';
import axiosInstance from '@/components/utils/axiosInstance';
import { useAuth } from '@/contexts/AuthContext';
import useAjaxRequest, { TAxiosError, TAxiosSuccess } from 'use-ajax-request';
import { TLoginResponse } from '@/components/utils/types';

export type loginType = {
  username: string;
  password: string;
};

const StudentLogin = () => {
  const { reCheckUser } = useAuth();
  const { sendRequest: loginStudent, loading: isLoading } = useAjaxRequest({
    instance: axiosInstance,
    config: {
      url: `/student-login`,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
  const [formState, setFormState] = useState<loginType>({
    username: '',
    password: '',
  });
  const [formError, setFormError] = useState({
    internetError: '',
    usernameError: '',
    passwordError: '',
    successError: '',
    generalError: '',
  });

  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (formState.username === '' || formState.password === '')
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [formState.password, formState.username]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      username: '',
      password: '',
    }));
    if (formState.username === '' || formState.password === '')
      setIsDisabled(true);
    else setIsDisabled(false);
  };

  const handleErrors = (data: any) => {
    // Check for internet connectivity
    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: 'No internet connection',
      }));
      return;
    }

    // Validate username and password
    if (!formState.username.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        usernameError: 'Username field cannot be empty',
      }));
      return;
    }

    if (!formState.password.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: 'Password field cannot be empty',
      }));
      return;
    }

    if (data.error) {
      setFormError((prevState) => ({
        ...prevState,
        generalError: data.error,
      }));
    }

    if (data.message.username) {
      setFormError((prevState) => ({
        ...prevState,
        usernameError: data.message.username,
      }));
    }

    if (data.message.password) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: data.message.password,
      }));
    }

    if (formState.username === '' || formState.password === '')
      setIsDisabled(true);
    else setIsDisabled(false);

    clearError();
  };

  const clearError = () => {
    setTimeout(() => {
      setFormError({
        internetError: '',
        passwordError: '',
        successError: '',
        generalError: '',
        usernameError: '',
      });
    }, 7000);
  };

  const handleSuccessLogin: TAxiosSuccess<TLoginResponse<'teacher'>> = ({
    data,
  }) => {
    const accessToken = data.token.accessToken;
    const refreshToken = data.token.refreshToken;
    const userId = data.details._id;
    const userRole = data.details.role;

    const expiryDate = new Date().setDate(new Date().getDate() + 1);

    // console.log("Tihs is the accessToken", accessToken);
    // console.log("This is the refreshToken", refreshToken);
    // console.log("Tihs is the userId", userId);
    // console.log("This is the userRole", userRole);

    accessToken !== undefined &&
      Cookies.set('accessToken', accessToken, { expires: 1 });
    refreshToken !== undefined &&
      Cookies.set('refreshToken', refreshToken, { expires: 1 });
    userId !== undefined && Cookies.set('userId', userId, { expires: 1 });
    userRole !== undefined && Cookies.set('role', userRole, { expires: 1 });
    Cookies.set('userDetails', JSON.stringify(data.details), { expires: 1 });

    setFormError((prevState) => ({
      ...prevState,
      successError: 'Student successfully logged in.',
    }));

    resetForm();

    reCheckUser();

    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleErrorLogin: TAxiosError<any> = (res) => {
    handleErrors(res.response.data);
    return;
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: 'No internet connection',
      }));
      clearError();
      return;
    }

    try {
      await loginStudent(handleSuccessLogin as any, handleErrorLogin, {
        data: formState,
      });
    } catch (error) {
      console.log('Error:', error);
    } finally {
      clearError();
    }
  };

  // const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
  //   // Reset previous error messages
  //   event.preventDefault();
  //   resetForm();

  //   setIsLoading(true);

  //   if (!navigator.onLine) {
  //     setFormError((prevState) => ({
  //       ...prevState,
  //       internetError: 'No internet connection',
  //     }));
  //     setIsLoading(false);
  //     clearError();
  //     return;
  //   }

  //   try {
  //     if (formState.username === '' || formState.password === '')
  //       setIsDisabled(true);
  //     else setIsDisabled(false);
  //     const response = await fetch(`${baseUrl}/student-login`, {
  //       method: 'POST',
  //       // credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: formState.username,
  //         password: formState.password,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       console.log(data, 'Logoin data');
  //       handleErrors(data);
  //       return;
  //     }
  //     // const json = await response.json();
  //     // console.log(json, 'this is the login json');
  //     const expiryDate = new Date().setDate(new Date().getDate() + 1);

  //     const {
  //       details: { role, studentID, _id },
  //       token: { accessToken, refreshToken },
  //     } = await response.json();
  //     Cookies.set('role', role, { expires: expiryDate });
  //     Cookies.set('studentID', studentID), { expires: expiryDate };
  //     Cookies.set('userId', _id, {
  //       expires: expiryDate,
  //     });
  //     Cookies.set('accessToken', accessToken);
  //     Cookies.set('refreshToken', refreshToken);
  //     setFormError((prevState) => ({
  //       ...prevState,
  //       successError: 'Student successfully logged in.',
  //     }));

  //     // Reset the form after successful submission
  //     resetForm();

  //     // Wait for 5 miliseconds before redirecting to login
  //     setTimeout(() => {
  //       router.push('/');
  //     }, 500);
  //   } catch (error) {
  //     console.log('Status: ', error);
  //   } finally {
  //     setIsDisabled(false);
  //     setIsLoading(false);

  //     clearError();
  //   }
  // };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === 'Enter') {
      handleSignIn(event);
    }
  };

  return (
    <div className='flex w-full h-screen relative'>
      {/*<customcursor />*/}

      <Image
        src={AuthBg1}
        alt='Auth Background Image 2'
        // Changed
        className='absolute -z-50 bottom-0 left-0 hidden lg:flex'
      />
      <Image
        src={AuthBg2}
        alt='Auth Background Image 2'
        className='absolute -z-50 top-0 right-0'
      />
      {/* Changed */}
      <div className='hidden lg:flex w-full items-center justify-center'>
        <Image
          src={AuthBg3}
          alt='Auth Background Image 2'
          className='max-w-[659px] max-h-[659px] w-full h-full object-cover'
        />
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-y-8'>
        <div className='flex flex-col items-center justify-center'>
          <Link href='/' className='w-[5.5rem]'>
            <Image src={logo} alt='Olive Grove Logo' width={100} height={100} />
          </Link>
          <h5 className='text-dark text-[20px] font-semibold capitalize font-roboto'>
            Step into Your Future
          </h5>
          <span className='text-primary text-[30px] font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-[16px] font-medium capitalize font-roboto leading-[28px]'>
            Log in to your Student Account and unlock your potential!
          </span>
        </div>

        {/* Error Messages */}
        {
          formError.usernameError ? (
            <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
              <Info sx={{ fontSize: '1.1rem' }} />
              {formError.usernameError}
            </span>
          ) : formError.passwordError ? (
            <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
              <Info sx={{ fontSize: '1.1rem' }} />
              {formError.passwordError}
            </span>
          ) : formError.internetError ? (
            <span className='text-yellow-600 text-sm flex items-center justify-center gap-1'>
              <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
              {formError.internetError}
            </span>
          ) : formError.successError ? (
            <span className='text-green-600 text-sm flex items-center justify-center gap-1'>
              <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
              {formError.successError}
            </span>
          ) : formError.generalError ? (
            <span className='text-red-600 text-sm flex items-center justify-center gap-1'>
              <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
              <span>{formError.generalError}</span>
            </span>
          ) : null // Return null if no errors exist
        }

        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          //Change
          className='flex flex-col mx-auto space-y-5 w-[94%] sm:w-[87%] md:w-[490px]'
        >
          <Input
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            placeholder='Username *'
            required
            className='input'
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Password *'
            required
            className='input'
            showIcon={VisibilityOutlined}
            hideIcon={VisibilityOffOutlined}
          />

          <span className='text-subtext text-base font-medium font-roboto cursor-pointer ml-auto w-fit whitespace-nowrap'>
            Forgot Password
          </span>

          <Button size='sm' width='full' disabled={isDisabled || isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              'Sign In'
            )}
          </Button>
          <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
            <span className='text-subtext'>Don&apos;t have an account?</span>
            <Link href='/auth/path/students/signup' className='text-primary'>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
