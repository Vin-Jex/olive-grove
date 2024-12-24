import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/image/logo.png';
import AuthBg1 from '@/public/image/auth__bg.png';
import AuthBg2 from '@/public/image/auth_bg.png';
import SignUpImage from '@/images/signupImage.png';
import AuthBg3 from '@/public/image/Frame 5.png';
import Input, { InputType } from '@/components/Atoms/Input';
import Button from '@/components/Atoms/Button';
import {
  ChevronLeft,
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import File from '@/components/Atoms/File';
import { baseUrl } from '@/components/utils/baseURL';
import { useRouter } from 'next/router';
import InputField from '@/components/Atoms/InputField';
import CustomCursor from '@/components/Molecules/CustomCursor';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { fetchCourses } from '@/components/utils/course';
import { TCourse } from '@/components/utils/types';
import OTPInput from '@/components/Molecules/OTPInput';
import useUserVerify from '@/components/utils/hooks/useUserVerify';
import { DotLoader } from 'react-spinners';
import MultipleSelect from '@/components/Molecules/MaterialSelect';
import FormPagination from '@/components/Molecules/FormPagination';
import axios, { AxiosError } from 'axios';

export type SignupType = {
  firstName: string;
  lastName: string;
  middleName: string;
  department: string;
  email: string;
  dob: string;
  enrolledSubjects: string[];
  username: string;
  password: string;
};

type DeptData = {
  _id: string;
  name: string;
  category: string;
  description: string;
};

const StudentSignup = () => {
  const router = useRouter();
  const {
    otpRequestLoading,
    handleRequestOTP,
    somethingOccured,
    setSomethingOccured,
    verifyOTP,
    OTPTimer,
  } = useUserVerify();
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState('');
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [fetchedDept, setFetchedDept] = useState<DeptData[]>([]);
  const [availableCourse, setAvailableCourses] = useState<TCourse[]>([]);
  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);
  const [formState, setFormState] = useState<SignupType>({
    firstName: '',
    lastName: '',
    middleName: '',
    department: '',
    email: '',
    dob: '',
    enrolledSubjects: [],
    username: '',
    password: '',
  });
  const [formError, setFormError] = useState({
    internetError: '',
    firstNameError: '',
    lastNameError: '',
    enrolledSubjectsError: '',
    dobError: '',
    emailError: '',
    departmentError: '',
    usernameError: '',
    passwordError: '',
    profileImageError: '',
    successError: '',
    generalError: '',
  });
  const [isDisabled, setIsDisabled] = useState<boolean[]>(Array(3).fill(true));

  const [isLoading, setIsLoading] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [otp, setOtp] = useState('');
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);

  const inputFields: (
    | {
        label: string;
        name: string;
        type: InputType;
        required: boolean;
        error: string;
      }
    | {
        label: string;
        name: string;
        type: InputType;
        error: string;
        required?: undefined;
      }
  )[] = [
    {
      label: 'Last Name *',
      name: 'lastName',
      type: 'text',
      required: true,
      error: formError.lastNameError,
    },
    {
      label: 'Date of Birth *',
      name: 'dob',
      type: 'date',
      required: true,
      error: formError.dobError,
    },

    {
      label: 'Username *',
      name: 'username',
      type: 'text',
      required: true,
      error: formError.usernameError,
    },
    {
      label: 'Password *',
      name: 'password',
      type: 'password',
      required: true,
      error: formError.passwordError,
    },
  ];

  useEffect(() => {
    console.log('dob', selectedImage);
    if (
      formState.dob !== '' &&
      formState.middleName !== '' &&
      formState.username !== '' &&
      formState.firstName !== '' &&
      formState.lastName !== '' &&
      formState.department !== '' &&
      formState.password !== '' &&
      selectedImage !== null
    ) {
      console.log('I am in the if statement yay!')
      setIsDisabled((c) => c.map((e, i) => (i === 0 ? false : e)));
    }
    if (formState.email !== '' && formState.enrolledSubjects.length !== 0)
      setIsDisabled((c) => c.map((e, i) => (i === 1 ? false: e)));
    if (otp !== '')
      setIsDisabled((c) => c.map((e, i) => (i === 2 ? false: e)));
  }, [
    formState.dob,
    formState.email,
    otp,
    formState.firstName,
    formState.lastName,
    formState.middleName,
    formState.enrolledSubjects,
    formState.password,
    formState.department,
    formState.username,
    selectedImage,
  ]);

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const response = await fetch(`${baseUrl}/department/all`);
        if (!response.ok) {
          setFormError((prevState) => ({
            ...prevState,
            departmentError: 'Error fetching department',
          }));
        }
        const dept = await response.json();

        setFetchedDept(dept.data);
      } catch (err) {
        console.error(err, 'error');
      }
    }
    fetchDepartment();
  }, []);

  useEffect(() => {
    async function getCourses() {
      const courses = await fetchCourses({
        query: 'department',
        value: formState.department,
      });
      if (typeof courses === 'string') return;
      else setAvailableCourses(courses.data);
    }
    getCourses();
  }, [formState.department]);

  useEffect(() => {
    console.log(isDisabled);
  });

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value, 'this is the target');
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      department: '',
      dob: '',
      email: '',
      password: '',
    }));
    setSelectedImage(null);
    setFileName('');
    setPreviewImage(null);
  };

  const resetImageField = () => {
    setSelectedImage(null);
    setFileName('');
    setPreviewImage(null);
  };

  async function handleEmailVerify(
    otp: string,
    token?: { accessToken: string; refreshToken: string } | null
  ) {
    console.log('Verify OTP');
    try {
      setEmailVerifyLoading(true);
      const request_body = JSON.stringify({ otp });
      const response = await axios.post(
        `${baseUrl}/email/verify`,
        request_body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer accessToken=${token?.accessToken};refreshToken=${token?.refreshToken}`,
          },
        }
      );

      setCurrentFormIndex((c) => c + 1);

      setSomethingOccured({
        success: true,
        error: false,
        message: response.data.message,
      });
    } catch (err: AxiosError | any) {
      console.error('otp error', otp);
      console.log(err);
      setSomethingOccured({
        success: false,
        error: true,
        message: err.response.data.message,
      });
    } finally {
      setEmailVerifyLoading(false);
    }
  }

  const handleErrors = (data: any) => {
    // Check for internet connectivity
    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: 'No internet connection',
      }));
      return;
    }

    // Validate email and password
    if (!formState.email.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        emailError: 'Email field cannot be empty',
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

    if (data.message.username) {
      setFormError((prevState) => ({
        ...prevState,
        emailError: data.message.username,
      }));
    } else if (data.message.password) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: data.message.username,
      }));
    } else if (data.message.firstName) {
      setFormError((prevState) => ({
        ...prevState,
        firstNameError: data.message.firstName,
      }));
    } else if (data.message.lastName) {
      setFormError((prevState) => ({
        ...prevState,
        lastNameError: data.message.lastName,
      }));
    } else if (data.message.dob) {
      setFormError((prevState) => ({
        ...prevState,
        dobError: data.message.dob,
      }));
    } else if (data.message.dapartment) {
      setFormError((prevState) => ({
        ...prevState,
        departmentError: data.message.department,
      }));
    } else if (data.message.profileImage) {
      setFormError((prevState) => ({
        ...prevState,
        profileImageError: data.message.profileImage,
      }));
    } else {
      console.error('Error Message: ', data.error);
    }

    if (data.error) {
      setFormError((prevState) => ({
        ...prevState,
        generalError: data.error,
      }));
    }

    // Clear errors after 7 seconds

    clearError();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    } else {
      setSelectedImage(null);
    }
  };

  const clearError = () => {
    setTimeout(() => {
      setFormError({
        internetError: '',
        firstNameError: '',
        lastNameError: '',
        enrolledSubjectsError: '',
        departmentError: '',
        dobError: '',
        emailError: '',
        usernameError: '',
        passwordError: '',
        profileImageError: '',
        successError: '',
        generalError: '',
      });
    }, 7000);
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    setIsLoading(true);

    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: 'No internet connection',
      }));
      setIsLoading(false);
      clearError();
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedImage as Blob);

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === 'enrolledSubjects') {
        formData.append(key, JSON.stringify(value));
      } else formData.append(key, value as string);
    });

    console.log(formData, 'this is the formdata');

    try {
      const response = await fetch(`${baseUrl}/student-signup`, {
        method: 'POST',
        // credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data, 'thsi is the data from student signup');
        //set access and refreshTokens to cookies

        handleErrors(data);
        return;
      }

      const data = await response.json();
      setCurrentFormIndex((c) => c + 1);

      setTokens({
        accessToken: data.token.accessToken,
        refreshToken: data.token.refreshToken,
      });
      console.log(data, 'thsi is the data from student signup');
      setFormError((prevState) => ({
        ...prevState,
        successError: 'Student account created successfully.',
      }));

      // Reset the form after successful submission
      resetForm();

      //I need to show the page final page that has a button with which the user can navigate to the dasboard

      console.log('Response: ', JSON.stringify(data));
    } catch (error) {
      // setSomethingOccured({
      //   success: true,
      //   error: false,
      //   message: error.data.message,
      // });
      console.log('Status: ', error);
    } finally {
      setIsDisabled((c) => c.map((_, i) => (i === 3 ? true : false)));
      setIsLoading(false);
      clearError();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === 'Enter') {
      handleSignup(event);
    }
  };

  return (
    <>
      <div className='flex flex-col md:flex-row w-full max-h-screen relative'>
        {/*<customcursor />*/}

        {/* <Image
        src={AuthBg1}
        alt='Auth Background Image 2'
        className='absolute -z-50 bottom-0 left-0'
      />
      <Image
        src={AuthBg2}
        alt='Auth Background Image 2'
        className='absolute -z-50 top-0 right-0'
      /> */}
        <div className='flex-1 hidden md:block relative'>
          <div className='h-52  blur-md bottom-0 absolute bg-black/30 w-full'></div>
          <Image
            src={SignUpImage}
            alt='sign up image'
            className=' overflow-hidden h-full  object-cover'
          />
          <div className='absolute md:px-5 lg:px-16 text-white bottom-0 py-16'>
            <div className=' text-3xl text-center py-4 font-bold'>
              Olive Groove Student/Teacher Portal.
            </div>
            <span className='text-center inline-block'>
              As a student you get access to all your classes, lectures,
              assessments and even your activity progress. As a teacher you are
              able to create and manage your classes, lectures and assessments
              while also viewing your student performances on their courses.
            </span>
            <div className='flex md:flex-col lg:flex-row gap-5 py-4 justify-center'>
              <div className='bg-[#f8f8f8] bg-opacity-50 text-center px-5 py-2 rounded-full'>
                Flexibility of Management
              </div>
              <div className='bg-[#f8f8f8] bg-opacity-50 text-center px-5 py-2 rounded-full'>
                24/7 Accessibility
              </div>
            </div>
          </div>
        </div>
        {/* <div className='w-full flex items-center justify-center'>
        <Image
          src={AuthBg3}
          alt='Auth Background Image 2'
          className='max-w-[659px] max-h-[659px] w-full h-full object-cover'
        />
      </div> */}
        <div className='relative w-full flex items-center justify-center  flex-1'>
          <div className=' flex flex-col w-full items-center justify-center gap-y-3'>
            <Link
              href='/'
              className='xl:absolute left-[5rem] top-[1rem] w-[4.5rem] h-[5rem] -ml-4 -mb-2'
            >
              <Image
                src={logo}
                alt='Olive_grove_logo'
                width='10000'
                height='10000'
                className='w-full h-full object-cover'
              />
            </Link>
            <div className='flex flex-col items-center justify-center'>
              {currentFormIndex !== 4 && (
                <>
                  <div className='w-[7rem] bg-[#1e1e1e] bg-opacity-5 h-1  my-2 relative'>
                    <div
                      style={{
                        width: `${((currentFormIndex + 1) * 100) / 4}%`,
                      }}
                      className={`absolute h-full transition-all left-0 top-0 bg-primary`}
                    ></div>
                  </div>
                  <h5 className='text-dark text-[20px] font-semibold capitalize font-roboto leading-[25px]'>
                    School Portal
                  </h5>
                  <span className='text-primary text-[30px] font-semibold capitalize font-roboto leading-[30px]'>
                    Olive Grove School
                  </span>
                </>
              )}
            </div>

            {formError.usernameError ? (
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
              <span className='text-red-600 text-sm flex items-center justify-center gap-1'>
                <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
                {formError.internetError}
              </span>
            ) : formError.successError ? (
              <span className='text-green-600 text-sm flex items-center justify-center gap-1'>
                <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
                {formError.successError}
              </span>
            ) : formError.departmentError ? (
              <span className='text-green-600 text-sm flex items-center justify-center gap-1'>
                <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
                {formError.departmentError}
              </span>
            ) : formError.generalError ? (
              <span className='text-red-600 text-sm flex items-center justify-center gap-1'>
                <Info sx={{ fontSize: '1.1rem' }} className='mt-0.5' />
                <span>{formError.generalError}</span>
              </span>
            ) : null}
            {formError.profileImageError !== '' && (
              <span className='flex items-center gap-x-1 text-sm font-roboto font-normal text-red-600'>
                <Info sx={{ fontSize: '1.1rem' }} />
                {formError.profileImageError}
              </span>
            )}
            <form
              className='flex flex-col mx-auto gap-y-5 '
              onKeyPress={handleKeyPress}
              onSubmit={handleSignup}
            >
              {/* first form step */}
              {currentFormIndex === 0 && (
                <div className='flex flex-col w-full gap-y-5 '>
                  <span className='text-subtext text-[16px] text-center font-medium capitalize font-roboto leading-[28px]'>
                    Create new account
                  </span>
                  <div className='flex items-end gap-3 w-full'>
                    <InputField
                      name='firstName'
                      type='text'
                      placeholder='First Name *'
                      value={formState.firstName}
                      onChange={handleChange}
                      required
                      error={formError.firstNameError}
                    />

                    <InputField
                      name='middleName'
                      type='text'
                      placeholder='Middle Name'
                      value={formState.middleName}
                      onChange={handleChange}
                      error={''}
                    />
                  </div>
                  <div className='w-full '>
                    <select
                      onChange={handleChange}
                      value={formState.department}
                      id='department'
                      name='department'
                      required
                      className='flex items-center h-12 px-2 sm:px-2.5 py-3 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal w-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext order-2'
                    >
                      <option value='' disabled selected>
                        Select Department
                      </option>
                      {fetchedDept?.map((course) => (
                        <option value={course._id} key={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {inputFields.map((field) =>
                    field.name !== 'password' ? (
                      <InputField
                        placeholder={field.label}
                        key={field.name}
                        name={field.name}
                        type={field.type}
                        pattern={
                          field.name === 'username'
                            ? '[a-zA-Z0-9!@#$_%].{5,}$'
                            : undefined
                        }
                        title={
                          field.name === 'email'
                            ? 'Please enter a valid email address'
                            : field.name === 'username'
                            ? 'Username must be at least 5 characters containing uppercase, lowercase, and special characters(!@#$_%+-)'
                            : ''
                        }
                        value={formState[field.name as keyof SignupType]}
                        onChange={handleChange}
                        required={field.required}
                        error={field.error}
                      />
                    ) : (
                      <Input
                        key={field.name}
                        pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$'
                        title='Password must be at least 8 characters containing uppercase, lowercase, and special characters(!@#$_%+-)'
                        type='password'
                        name='password'
                        value={formState[field.name as keyof SignupType]}
                        onChange={handleChange}
                        placeholder='Password'
                        showIcon={VisibilityOutlined}
                        hideIcon={VisibilityOffOutlined}
                        required={field.required}
                        className='input rounded-lg p-3'
                      />
                    )
                  )}

                  <div className='w-full flex flex-col gap-1 cursor-pointer'>
                    <File
                      selectedImage={selectedImage}
                      setSelectedImage={setSelectedImage}
                      previewImage={previewImage}
                      onChange={handleImageChange}
                      disabled={false}
                      resetImageStates={resetImageField}
                      placeholder={
                        fileName === '' ? fileName : 'Upload Profile Picture'
                      }
                      required
                      fileName={fileName}
                    />
                  </div>
                  <Button
                    size='sm'
                    width='full'
                    onClick={() => setCurrentFormIndex((c) => c + 1)}
                    className='capitalize'
                    disabled={isDisabled[0]}
                  >
                    Sign Up
                  </Button>
                  <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
                    <span className='text-subtext'>
                      Already have an account?
                    </span>
                    <Link
                      href='/auth/path/students/login'
                      className='text-primary'
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}

              {currentFormIndex === 1 && (
                <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                  <span className='text-center text-subtext'>
                    Kindly select all your enrolled subjects below.
                  </span>
                  <InputField
                    type='email'
                    name='email'
                    className='ml-0 !py-5 !w-full'
                    value={formState.email}
                    onChange={handleChange}
                    placeholder='Enter your mail'
                    required
                    error={formError.emailError}
                  />
                  <div className='w-full'>
                    <MultipleSelect
                      name='enrolledSubjects'
                      onChange={setFormState}
                      options={availableCourse.map((c) => ({
                        name: c.title,
                        value: c._id as string,
                      }))}
                    />
                  </div>
                  <Button
                    disabled={isLoading || isDisabled[1]}
                    width='full'
                    type='submit'
                    // /*type='submit'*/ onClick={() =>
                    //   setCurrentFormIndex((c) => c + 1)
                    // }
                    size='md'
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : (
                      'Complete'
                    )}
                  </Button>
                </div>
              )}
              {/* second form step */}
              {/* third part of the step form */}

              {/**forth part of the form */}
              {currentFormIndex === 2 && (
                <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                  <span className='text-center text-subtext'>
                    Would you like to verify your account now?
                  </span>
                  <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                    <Button
                      size='md'
                      width='full'
                      onClick={(e) => {
                        e.preventDefault();
                        handleRequestOTP('email_verification', tokens);
                        setCurrentFormIndex((c) => c + 1);
                      }}
                      className='mx-auto text-center'
                    >
                      {otpRequestLoading ? (
                        <CircularProgress size={20} color='inherit' />
                      ) : (
                        'Verify Now'
                      )}
                    </Button>
                    <Link
                      href='/auth/path/students/login'
                      className='w-full text-subtext border text-center py-4'
                    >
                      Verify Later
                    </Link>
                  </div>
                  <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
                    <span className='text-subtext text-center'>
                      If you choose to verify later, you will be restricted to a
                      specific level of access with your account.
                    </span>
                  </div>
                </div>
              )}
              {currentFormIndex === 3 && (
                <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                  <span className='text-center text-subtext'>
                    An OTP was sent to the mail you provided below. Kindly it
                    below.
                  </span>
                  <div className='flex justify-center'>
                    <OTPInput
                      className='!my-1'
                      length={6}
                      onChange={(otp) => {
                        setOtp(otp);
                      }}
                    />
                  </div>
                  <Button
                    width='full'
                    disabled={isDisabled[2]}
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleEmailVerify(otp, tokens);
                    }}
                    className='mx-auto'
                    size='md'
                  >
                    {emailVerifyLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                  <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
                    <span className='text-subtext'>Did&apos;t get OTP?</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRequestOTP('email_verification', tokens);
                      }}
                      className='text-primary'
                    >
                      Resend OTP
                    </button>
                    <span className='text-subtext ml-6'>
                      {String(Math.floor(OTPTimer / 60)).length < 2
                        ? String(Math.floor(OTPTimer / 60)).padStart(2, '0')
                        : Math.floor(OTPTimer / 60)}
                      :
                      {String(OTPTimer % 60).length < 2
                        ? String(OTPTimer % 60).padStart(2, '0')
                        : OTPTimer % 60}
                    </span>
                  </div>
                </div>
              )}

              {/* final page */}
              {currentFormIndex === 4 && (
                <div className='flex flex-col mx-auto gap-y-5 w-[490px] justify-center items-center'>
                  <SignUpCompleteIcon />
                  <h2 className='font-bold text-xl md:text-2xl lg:text-3xl'>
                    Welcome {'Eniola'}!
                  </h2>
                  <span className='text-lg max-sm:text-base text-[#1e1e1e] text-opacity-50'>
                    Your account has been created successfully!
                  </span>
                  <Link
                    className='bg-primary px-4 py-2 text-white rounded-md'
                    href='/students/dashboard'
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}

              {/* second form step */}

              {/* third part of the step form */}

              <FormPagination
                isDisabled={isDisabled}
                index={currentFormIndex}
                number={4}
                onChange={setCurrentFormIndex}
              />
            </form>
          </div>
        </div>
      </div>

      {(somethingOccured.error || somethingOccured.success) && (
        <Snackbar
          open={somethingOccured.error || somethingOccured.success}
          onClose={() =>
            setSomethingOccured((err) => ({
              ...err,
              error: false,
              success: false,
            }))
          }
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          className='!z-[999]'
        >
          <Alert
            severity={somethingOccured.error ? 'error' : 'success'}
            onClose={() =>
              setSomethingOccured((err) => ({ ...err, error: false }))
            }
          >
            {somethingOccured.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

function SignUpCompleteIcon() {
  return (
    <svg
      width='104'
      height='103'
      viewBox='0 0 104 103'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='0.5'
        width='103'
        height='103'
        rx='51.5'
        fill='#35E309'
        fill-opacity='0.2'
      />
      <path
        d='M44.6254 62.4458L35.5166 53.3371C35.0258 52.8462 34.3601 52.5705 33.666 52.5705C32.9719 52.5705 32.3062 52.8462 31.8154 53.3371C31.3246 53.8279 31.0488 54.4936 31.0488 55.1877C31.0488 55.5314 31.1165 55.8717 31.248 56.1892C31.3796 56.5068 31.5724 56.7953 31.8154 57.0383L42.7879 68.0108C43.8116 69.0346 45.4654 69.0346 46.4891 68.0108L74.2616 40.2383C74.7524 39.7475 75.0282 39.0818 75.0282 38.3877C75.0282 37.6936 74.7524 37.0279 74.2616 36.5371C73.7708 36.0462 73.1051 35.7705 72.411 35.7705C71.7169 35.7705 71.0512 36.0462 70.5604 36.5371L44.6254 62.4458Z'
        fill='#35E309'
      />
    </svg>
  );
}

export default StudentSignup;
