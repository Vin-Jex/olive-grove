import Cookies from 'js-cookie';
import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import Image from 'next/image';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import dummyImage from '@/images/dummy-img.jpg';
import Button from '@/components/Atoms/Button';
import InputField from '@/components/Atoms/InputField';
import Input, { InputType } from '@/components/Atoms/Input';
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import withAuth from '@/components/Molecules/WithAuth';
import { baseUrl } from '@/components/utils/baseURL';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/components/utils/axiosInstance';

const Profile = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    username: '',
    password: '',
    otp: '',
  });
  const [formError, setFormError] = useState({
    internetError: '',
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    usernameError: '',
    passwordError: '',
    successError: '',
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [studentName, setStudentName] = useState('');
  const { user } = useAuth();
  const role = user?.role;
  const [profileError, setProfileError] = useState('');

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
      label: 'Email Address *',
      name: 'email',
      type: 'email',
      required: true,
      error: formError.emailError,
    },
    // {
    //   label: 'Username *',
    //   name: 'username',
    //   type: 'text',
    //   required: true,
    //   error: formError.usernameError,
    // },
  ];

  useEffect(() => {
    if (
      formState.username === '' ||
      formState.firstName === '' ||
      formState.lastName === '' ||
      formState.email === '' //||
      // formState.password === '' ||
      // formState.otp === ''
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [
    formState.email,
    formState.firstName,
    formState.lastName,
    formState.password,
    formState.username,
    formState.otp,
  ]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value as string,
    }));
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    }));
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

    // Validate email and password
    if (!formState.email.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        emailError: 'Email field cannot be empty',
      }));
      return;
    }

    /*
    if (!formState.password.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: 'Password field cannot be empty',
      }));formState.password === '' //||
      // formState.otp === ''
      return;
    }
    */ // I commented this out because the password field is not required

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
    } else {
      console.error('Error Message: ', data.error);
    }

    // Clear errors after 10 seconds
    setTimeout(() => {
      setFormError({
        internetError: '',
        firstNameError: '',
        lastNameError: '',
        emailError: '',
        usernameError: '',
        passwordError: '',
        successError: '',
      });
    }, 10000);
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    resetForm();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setIsDisabled(true);
      const response = await fetch(
        `${baseUrl}/student-user/${formState.username}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: 'Information updated successfully.',
      }));

      // Reset the form after successful submission
      resetForm();

      console.log('Response: ', JSON.stringify(data));
    } catch (error) {
      console.log('Status: ', error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    resetForm();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setIsDisabled(true);
      let response = await fetch(`{}`); //* simulate endpoint for password update
      // const response = await fetch(
      //   `${baseUrl}/student-user/${formState.username}`,
      //   {
      //     method: 'PUT',
      //     body: formData,
      //   }
      // );

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: 'Password updated successfully.',
      }));

      // Reset the form after successful submission
      resetForm();

      console.log('Response: ', JSON.stringify(data));
    } catch (error) {
      console.log('Status: ', error);
    } finally {
      setIsDisabled(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/student`);
      // if (!response.ok) {
      //   //handle this case.
      //   setProfileError('failed to fetch profile');
      //   console.log(response, 'the profile fo the current user');
      //   //since formdata has default value I am not sure that we need to reset them here.
      // }

      const json = response.data;
      setFormState({
        firstName: json.firstName,
        lastName: json.lastName,
        middleName: json.middleName,
        email: json.email,
        username: json.username,
        password: '',
        otp: '',
      });
      setProfileImage(json.profileImage);
      setStudentName(json.firstName + ' ' + json.lastName);
    } catch (err) {
      //how to display error.
      setProfileError('Error occured in fetching user profile');
    }
  }, []);
  useEffect(() => {
    fetchProfile();
    // department: "science";
    // dob: "2024-10-31T00:00:00.000Z";
    // email: "henryabayomi12@gmail.com";
    // enrolledSubjects: [];
    // firstName: "Jakande";
    // lastName: "Isheri";
    // middleName: "Estate";
    // password: "$2b$10$ASSaz448Doz5rvhge3be1OfTD1ysAjnTbokYYCjRto6erqkfp8Ik.";
    // profileImage: "https://res.cloudinary.com/difc1xy6v/image/upload/v1732028085/student-files/ximyskjgd8vsyxcoks0o.jpg";
    // repeated: [];
    // role: "Student";
    // studentID: "AQ1LJO2PRSXU";
    // username: "olive";
    // __v: 0;
    // _id: "673ca6b347a34dee9993a503";
  }, [fetchProfile]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === 'Enter') {
      handleSignup(event);
    }
  };

  return (
    <>
      <StudentWrapper title='Profile' metaTitle='Olive Groove ~ Profile'>
        <div className='p-12 space-y-5'>
          {/* Title */}
          <div className='flex gap-4'>
            <Image
              src={!profileImage ? dummyImage : profileImage}
              width={300}
              height={300}
              alt='Profile Pics'
              className='shadow w-16 h-16 object-cover rounded-full'
            />
            <div className='flex flex-col justify-center'>
              <span className='text-dark text-lg font-roboto leading-5'>
                {studentName}
              </span>
              <span className='text-subtext'>Student</span>
            </div>
          </div>
          <form
            className='flex flex-col !mt-20 space-y-5 gap-y-5 w-[560px]'
            onKeyPress={handleKeyPress}
            onSubmit={handleSignup}
          >
            {/* <div className='> */}
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <span className='text-lg lg:text-2xl font-normal text-dark font-roboto'>
                  Account Information
                </span>
                <span className='text-md text-subtext font-roboto'>
                  Edit your personal account information.
                </span>
              </div>
              <Button
                type='submit'
                size='sm'
                width='fit'
                className='!px-8'
                disabled={isDisabled}
              >
                Edit Personal Info
              </Button>
            </div>
            {formError.internetError !== '' ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-[#d9b749] capitalize -mb-3'>
                <Info sx={{ fontSize: '1.1rem' }} />
                {formError.internetError}
              </span>
            ) : formError.successError !== '' ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-primary capitalize -mb-3'>
                <Info sx={{ fontSize: '1.1rem' }} />
                {formError.successError}
              </span>
            ) : (
              ''
            )}
            <div className='text-red-500'>{profileError && profileError}</div>

            <span className='text-subtext text-xl font-roboto font-medium -mb-1'>
              Personal Information
            </span>
            <div className='grid grid-cols-2 gap-8 w-full'>
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
              {inputFields.map((field) => (
                <InputField
                  placeholder={field.label}
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  value={formState[field.name as keyof typeof formState]}
                  onChange={handleChange}
                  required={field.required}
                  error={field.error}
                />
              ))}
            </div>
          </form>
          <form
            onKeyPress={handleKeyPress}
            onSubmit={handlePasswordChange}
            className='flex flex-col !mt-20 space-y-5 gap-y-5 w-[560px]'
          >
            <div className='flex items-center justify-between'>
              <div className='flex flex-col my-7'>
                <span className='text-lg lg:text-2xl font-normal text-dark font-roboto'>
                  Security Information
                </span>
                <span className='text-md text-subtext font-roboto'>
                  Edit your personal security information.
                </span>
              </div>
              <Button
                type='submit'
                size='sm'
                width='fit'
                className='!px-8'
                disabled={isDisabled}
              >
                Edit password
              </Button>
            </div>
            {formError.internetError !== '' ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-[#d9b749] capitalize -mb-3'>
                <Info sx={{ fontSize: '1.1rem' }} />
                {formError.internetError}
              </span>
            ) : formError.successError !== '' ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-primary capitalize -mb-3'>
                <Info sx={{ fontSize: '1.1rem' }} />
                {formError.successError}
              </span>
            ) : (
              ''
            )}
            <div className='space-y-4'>
              <Input
                type='password'
                name='password'
                value={formState.password}
                onChange={handleChange}
                placeholder='Password *'
                // required
                className='input'
                showIcon={VisibilityOutlined}
                hideIcon={VisibilityOffOutlined}
              />
              {formState.password.length > 0 && <Button size='xs'>Generate OTP</Button>}
              <Input
                type='number'
                name='OTP'
                value={formState.password}
                onChange={handleChange}
                placeholder='OTP'
                //required
                className='input'
                showIcon={VisibilityOutlined}
                hideIcon={VisibilityOffOutlined}
              />
            </div>
          </form>
        </div>
      </StudentWrapper>
    </>
  );
};

export default withAuth('Student', Profile);
