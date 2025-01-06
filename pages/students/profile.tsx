import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Button from '@/components/Atoms/Button';
import InputField from '@/components/Atoms/InputField';
import Input from '@/components/Atoms/Input';
import { Info } from '@mui/icons-material';
import withAuth from '@/components/Molecules/WithAuth';
import { baseUrl } from '@/components/utils/baseURL';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/components/utils/axiosInstance';
import { AxiosError } from 'axios';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { handleLogout } from '@/components/Molecules/Layouts/Admin.Layout';
import { useRouter } from 'next/router';
import useUserVerify from '@/components/utils/hooks/useUserVerify';
import { formatDate } from '@/components/utils/utils';
import { ProfilePhotoSection } from '../teachers/profile';
import { InputType } from '@/components/utils/types';
import { useUser } from '@/contexts/UserContext';

type TFormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  department: string;
  academicStatus: string;
  dob: string;
  profileImage: string | File | Blob;
  email: string;
  username: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
};

const Profile = () => {
  const router = useRouter();
  const {
    otpRequestLoading,
    handleRequestOTP,
    message,
    formattedTimer,
    setMessage,
    verifyOTP,
    OTPTimer,
  } = useUserVerify();

  const [formState, setFormState] = useState<TFormState>({
    firstName: '',
    lastName: '',
    middleName: '',
    profileImage: '',
    academicStatus: '',
    department: '',
    dob: '',
    email: '',
    username: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [formError, setFormError] = useState({
    internetError: '',
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    department: '',
    dob: '',
    usernameError: '',
    passwordError: '',
    successError: '',
  });
  const { user: userInfo } = useUser();
  const [emailOTP, setEmailOTP] = useState({ error: '', value: '' });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledPassword, setIsDisabledPassword] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [currentTab, setCurrentTab] = useState<
    'Account' | 'Security' | 'account_verify'
  >('Account');
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const { user } = useAuth();
  const role = user?.role;
  const [profileError, setProfileError] = useState('');

  console.log(userInfo, ': this is the user info');
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
    //username, dob
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      required: false,
      error: formError.usernameError,
    },
    {
      label: 'Date of Birth',
      name: 'dob',
      type: 'date',
      required: false,
      error: '',
    },
    { label: 'Department', name: 'department', type: 'text', error: '' },
    {
      label: 'Academic Status',
      name: 'academicStatus',
      type: 'text',
      error: '',
    },
  ];

  useEffect(() => {
    if (userInfo) {
      setCurrentTab(!userInfo?.isVerified ? 'account_verify' : 'Account');
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      formState.username === '' ||
      formState.dob === '' ||
      formState.firstName === '' ||
      formState.lastName === '' ||
      formState.email === ''
    )
      setIsDisabled(true);

    if (
      formState.newPassword === '' ||
      formState.confirmPassword === '' ||
      formState.otp === ''
    )
      setIsDisabledPassword(true);
    else setIsDisabledPassword(false);
  }, [
    formState.email,
    formState.firstName,
    formState.lastName,
    formState.newPassword,
    formState.dob,
    formState.confirmPassword,
    formState.username,
    formState.otp,
  ]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value as string,
    }));
  };

  const handleProfileEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      if (key !== 'password' && key !== 'otp' && key !== 'username') {
        formData.append(key, value);
      }
    });

    try {
      setIsDisabled(true);
      const response = await axiosInstance.put(
        `${baseUrl}/student-user/${formState.username}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const data = await response.data;
      fetchProfile();
      setFormError((prevState) => ({
        ...prevState,
        successError: data?.data?.response?.message,
      }));

      // Reset the form after successful submission
      setTimeout(() => {
        setFormError((prevState) => ({
          ...prevState,
          successError: '',
        }));
      }, 5000);
    } catch (error: AxiosError | any) {
      console.log(error, 'axios error');
      const data = error.response.data;
      setMessage((err) => ({
        ...err,
        error: true,
        message: data.message,
      }));
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === 'newPassword' || key === 'confirmPassword' || key === 'otp')
        formData.append(key, value);
    });

    try {
      setIsDisabledPassword(true);
      const response = await axiosInstance.post(
        `${baseUrl}/password/change`,
        formData
      );

      //log the user out on successfull password change
      handleLogout('students');

      setMessage((err) => ({
        ...err,
        success: true,
        error: false,
        message: response?.data?.data.message,
      }));
    } catch (error: AxiosError | any) {
      setMessage((err) => ({
        ...err,
        error: true,
        message: error?.response?.data.message,
      }));
    } finally {
      setIsDisabledPassword(false);
    }
  };

  const handleEmailVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setEmailVerifyLoading(true);
      const response = await axiosInstance.post(
        `${baseUrl}/email/verify`,
        JSON.stringify({ otp: emailOTP.value })
      );

      const data = await response.data;
      setMessage((err) => ({
        ...err,
        success: true,
        error: false,
        message: data.message,
      }));
      router.push('/auth/path/students/signin');
    } catch (error: AxiosError | any) {
      const data = error.response.data;
      setMessage((err) => ({
        ...err,
        error: true,
        message: data.message,
      }));
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/student`);

      const data = response.data;
      setFormState({
        profileImage: data.profileImage,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        department: data.department.name,
        academicStatus: data.department.category,
        dob: formatDate(data.dob),
        email: data.email,
        username: data.username,
        newPassword: '',
        confirmPassword: '',
        otp: '',
      });
      setProfileImage(data?.profileImage);

      setStudentName(data?.firstName + ' ' + data?.lastName);
    } catch (err: AxiosError | any) {
      if (err.message === 'Network Error') console.log('network error');
      if (
        err.response?.data?.message ===
        'Your account is not verified. Please check your email for the verification code.'
      )
        setCurrentTab('account_verify');
      setProfileError('Error occured in fetching user profile');
    }
  }, []);

  useEffect(() => {
    if (user) fetchProfile();
  }, [fetchProfile, user]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === 'Enter') {
      handleProfileEdit(event);
    }
    setIsDisabled(false);
  };

  return (
    <>
      <StudentWrapper
        remark='Manage and edit your profile settings.'
        title='Profile'
        metaTitle='Olive Grove ~ Profile'
      >
        <div className='md:px-12 px-6 py-12 space-y-5'>
          {currentTab !== 'account_verify' && (
            <div className='w-full max-w-[10rem] flex gap-0'>
              {['Account', 'Security'].map((slug, i) => (
                <>
                  <div
                    className={`px-7 py-2 font-medium text-sm border-b-2 cursor-pointer transition ${
                      currentTab === slug
                        ? 'border-primary border-opacity-70  bg-[#32A8C41A] text-primary'
                        : ''
                    }`}
                    onClick={() =>
                      setCurrentTab(slug as 'Account' | 'Security')
                    }
                    key={i}
                  >
                    {slug}
                  </div>
                </>
              ))}
            </div>
          )}
          {/* Title */}

          {currentTab === 'Account' && (
            <form
              className='w-full flex justify-between  bg-white px-8 max-sm:px-5 rounded-2xl py-10 shadow-card'
              onKeyPress={handleKeyPress}
              onSubmit={handleProfileEdit}
            >
              <div className='w-full flex flex-col space-y-5 gap-y-5'>
                <ProfilePhotoSection
                  userRole='Student'
                  setFormState={setFormState}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage as string}
                  setIsDisabled={setIsDisabled}
                  profileImage={profileImage}
                  name={studentName}
                  id={formState.username}
                />
                <div className='flex max-sm:flex-col max-sm:items-start max-sm:gap-3 w-full items-center justify-between'>
                  <div className='flex flex-col '>
                    <span className='text-lg lg:text-2xl font-normal text-dark font-roboto'>
                      Account Information
                    </span>
                    <span className='text-md text-subtext font-roboto'>
                      Edit your personal account information.
                    </span>
                  </div>
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
                <div className='text-red-500'>
                  {profileError && profileError}
                </div>

                <span className='text-subtext text-xl font-roboto font-medium -mb-1'>
                  Personal Information
                </span>
                <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-8 w-full'>
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
                      className='disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md'
                      disabled={
                        field.name === 'department' ||
                        field.name === 'academicStatus'
                          ? true
                          : false
                      }
                      value={
                        formState[
                          field.name as keyof Omit<TFormState, 'profileImage'>
                        ]
                      }
                      onChange={handleChange}
                      required={field.required}
                      error={field.error}
                    />
                  ))}
                  <Input
                    placeholder={'Role'}
                    key={role}
                    className='disabled:bg-[#1e1e1e] disabled:bg-opacity-10 !text-subtext disabled:!border-none !rounded-md'
                    disabled={true}
                    type='text'
                    value={role}
                  />
                </div>
                <div>
                  <span className='text-subtext capitalize'>
                    courses offered
                  </span>
                  <div className='bg-[#1e1e1e] text-subtext mt-3 bg-opacity-10 rounded-lg w-fit py-3 px-4'>
                    Mathematics
                  </div>
                </div>
                <Button
                  type='submit'
                  size='xs'
                  width='fit'
                  className='!px-8 disabled:cursor-not-allowed'
                  disabled={isDisabled}
                >
                  Update
                </Button>
              </div>
            </form>
          )}
          {currentTab === 'Security' && (
            <form
              className='w-full flex justify-between items-start bg-white px-8 rounded-2xl pb-8 pt-4 shadow-card'
              // onKeyPress={handleKeyPress}
              onSubmit={handlePasswordChange}
            >
              <div className='w-full space-y-5 gap-y-5'>
                <div className='w-full flex items-center justify-between'>
                  <div className='flex flex-col gap-1 my-7'>
                    <span className='text-lg lg:text-2xl  font-normal text-dark font-roboto'>
                      Security Information
                    </span>
                    <span className='text-md text-subtext font-roboto'>
                      Edit your personal security information.
                    </span>
                  </div>
                </div>
                {formError.passwordError && (
                  <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600 capitalize -mb-3'>
                    <Info sx={{ fontSize: '1.1rem' }} />
                    {formError.passwordError}
                  </span>
                )}
                <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-8 w-full'>
                  <Input
                    type='password'
                    name='newPassword'
                    value={formState.newPassword}
                    onChange={handleChange}
                    placeholder='New Password *'
                    // required
                    className='input !rounded-xl'
                  />
                  <Input
                    type='password'
                    name='confirmPassword'
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm Password *'
                    // required
                    className='input !rounded-xl'
                  />
                  <div className='flex items-center  '>
                    <Input
                      type='number'
                      name='otp'
                      value={formState.otp}
                      onChange={handleChange}
                      placeholder='OTP'
                      //required
                      className='input !rounded-xl'
                    />
                    <span
                      className={`text-sm ml-4 ${OTPTimer === 0 && 'hidden'}`}
                    >
                      {OTPTimer}
                    </span>
                  </div>
                </div>
                <div className='font-roboto text-subtext'>
                  {verifyOTP.message}{' '}
                  <button
                    disabled={
                      formState.newPassword === '' ||
                      formState.confirmPassword === '' ||
                      formState.newPassword !== formState.confirmPassword ||
                      OTPTimer > 0
                    }
                    onClick={() => handleRequestOTP('password_reset')}
                    className='text-primary font-bold disabled:cursor-not-allowed'
                  >
                    {verifyOTP.status ? 'Resend OTP' : ' Request OTP'}
                  </button>
                </div>
                <Button
                  type='submit'
                  size='xs'
                  width='fit'
                  className='!px-8 disabled:cursor-not-allowed'
                  disabled={isDisabledPassword}
                >
                  Update
                </Button>
              </div>
            </form>
          )}
          {currentTab === 'account_verify' && (
            <div>
              <form
                className='w-full bg-white space-y-8 px-8 max-sm:px-5 rounded-2xl py-10 shadow-card'
                // onKeyPress={handleKeyPress}
                onSubmit={handleEmailVerify}
              >
                <div className='flex max-sm:flex-col max-sm:items-start max-sm:gap-3 w-full items-center justify-between'>
                  <div className='flex flex-col '>
                    <span className='text-lg lg:text-2xl font-normal text-dark font-roboto'>
                      Email Verification
                    </span>
                    <span className='text-md text-subtext font-roboto'>
                      Edit the OTP sent to your email.
                    </span>
                  </div>
                </div>
                {formError.internetError !== '' ? (
                  <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-[#d9b749] capitalize -mb-3'>
                    <Info sx={{ fontSize: '1.1rem' }} />
                    {formError.internetError}
                  </span>
                ) : emailOTP.error !== '' ? (
                  <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-primary capitalize -mb-3'>
                    <Info sx={{ fontSize: '1.1rem' }} />
                    {emailOTP.error}
                  </span>
                ) : (
                  ''
                )}
                <div className='flex flex-col space-y-2 w-1/2 relative'>
                  <label
                    htmlFor='email_verification_otp'
                    className='text-subtext text-sm'
                  >
                    OTP
                  </label>
                  <InputField
                    id='email_verificaiton_otp'
                    name='email_verification_otp'
                    type='text'
                    placeholder='Enter OTP'
                    value={emailOTP.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setEmailOTP((prev) => ({ ...prev, value }));
                    }}
                    required
                    error={''}
                    maxLength={6}
                  />
                  <Button
                    size='xs'
                    type='button'
                    width='fit'
                    className='!text-xs !py-2 !px-4 font-roboto absolute right-2 bottom-[1.4rem] translate-y-1/2'
                    onClick={() => {
                      if (OTPTimer <= 0 && !otpRequestLoading) {
                        handleRequestOTP('email_verification');
                      }
                    }}
                    disabled={otpRequestLoading || OTPTimer > 0}
                  >
                    {otpRequestLoading
                      ? 'Requesting OTP...'
                      : OTPTimer > 0
                      ? formattedTimer
                      : verifyOTP.status
                      ? 'Resend OTP'
                      : 'Request OTP'}
                  </Button>
                </div>
                <Button
                  size='xs'
                  disabled={emailOTP.value.length < 6 || emailVerifyLoading}
                  type='submit'
                >
                  {emailVerifyLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </StudentWrapper>

      {(message.error || message.success) && (
        <Snackbar
          open={message.error || message.success}
          onClose={() =>
            setMessage((err) => ({
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
            severity={message.error ? 'error' : 'success'}
            onClose={() => setMessage((err) => ({ ...err, error: false }))}
          >
            {message.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default withAuth('Student', Profile);
