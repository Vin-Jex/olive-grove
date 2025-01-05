import TeachersWrapper from '@/components/Molecules/Layouts/Teacher.Layout';
import Image from 'next/image';
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import dummyImage from '@/images/dummy-img.jpg';
import Input from '@/components/Atoms/Input';
import axiosInstance from '@/components/utils/axiosInstance';
import { PhotoCamera } from '@mui/icons-material';
import InputField from '@/components/Atoms/InputField';
import { handleInputChange } from '@/components/utils/utils';
import Button from '@/components/Atoms/Button';
import toast from 'react-hot-toast';
import { InputType } from '@/components/utils/types';
import useUserVerify from '@/components/utils/hooks/useUserVerify';
import { handleLogout } from '@/components/Molecules/Layouts/Admin.Layout';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { updateUserInDB } from '@/components/utils/indexDB';
import { useUser } from '@/contexts/UserContext';

interface IProfilePhotoSectionProps {
  profileImage: string;
  name: string;
  id: string;
  userRole: 'Teacher' | 'Student' | 'Admin';
  setIsDisabled:
    | Dispatch<SetStateAction<boolean>>
    | React.Dispatch<
        React.SetStateAction<{
          account: boolean;
          security: boolean;
        }>
      >;
  setPreviewImage: Dispatch<SetStateAction<Blob | null | string>>;
  previewImage: string;
  setFormState: Dispatch<SetStateAction<any>>;
  type?: 'Account' | 'Security';
}

type TFormState = {
  name: string;
  teacherID: string;
  email: string;
  tel: string;
  address: string;
  profileImage: string | File | Blob;
  newPassword: string;
  confirmPassword: string;
  otp: string;
};
const TeachersProfile = () => {
  const [currentTab, setCurrentTab] = useState<'Account' | 'Security'>(
    'Account'
  );
  const [formState, setFormState] = useState<TFormState>({
    name: '',
    teacherID: '',
    tel: '',
    profileImage: '',
    address: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [isDisabled, setIsDisabled] = useState({
    account: true,
    security: true,
  });
  const { user, setUser } = useUser();

  const {
    otpRequestLoading,
    handleRequestOTP,
    message,
    setMessage,
    verifyOTP,
    OTPTimer,
    formattedTimer,
  } = useUserVerify();
  const router = useRouter();

  const inputFields: {
    label: string;
    name: string;
    type: InputType;
    required?: boolean;
    options?: { value: string; display_value: string }[];
  }[] = [
    {
      label: 'Full Name',
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      label: 'Mobile Number',
      name: 'tel',
      type: 'tel',
      required: false,
    },
    {
      label: 'Home Address',
      name: 'address',
      type: 'text',
      required: false,
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { value: 'male', display_value: 'Male' },
        { value: 'female', display_value: 'Female' },
        { value: 'other', display_value: 'Other' },
        { value: 'prefer_not_to_say', display_value: 'Prefer not to say' },
      ],
    },
  ];

  const getInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/teacher');
      const data = response.data.data;
      setFormState((prev) => ({
        ...prev,
        name: data.name,
        teacherID: data.teacherID,
        email: data.email,
        tel: data.tel,
        address: data.address,
        profileImage: data.profileImage,
      }));
      setUser(data);
      setIsDisabled((prevState) => ({
        ...prevState,
        account: true,
        security: true,
      }));
      setPreviewImage(null);
    } catch (error) {
      console.error('Error fetching teacher info:', error);
    }
  }, [setUser]);

  const updateInfo = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsDisabled((prevState) => ({
        ...prevState,
        account: true,
      }));
      try {
        const formData = new FormData();
        Object.keys(formState).forEach((key) => {
          // Skip these keys
          if (['newPassword', 'confirmPassword', 'otp'].includes(key)) {
            return;
          }
          if (key === 'profileImage') {
            formData.append(key, formState[key as keyof TFormState] as File);
          } else {
            formData.append(key, formState[key as keyof TFormState]);
          }
        });

        const response = await axiosInstance.put('/teacher-user', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = response.data.data;
        toast.success(response.data?.message);

        // Update the user data in IndexedDB
        await updateUserInDB(user?._id!, data, user?._id!);

        // Fetch updated user data
        getInfo();
      } catch (error: any) {
        console.error('Error updating teacher info:', error);
        toast.error(
          `Failed to update teacher info: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    [formState, getInfo, user?._id]
  );

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === 'newPassword' || key === 'confirmPassword' || key === 'otp')
        formData.append(key, value);
    });

    setIsDisabled((prevState) => ({
      ...prevState,
      security: true,
    }));
    try {
      const response = await axiosInstance.post(`/password/change`, formData);

      const data = response.data;
      toast.success(data?.message);

      //log the user out on successfull password change
      handleLogout('students');

      setMessage((err) => ({
        ...err,
        success: true,
        error: false,
        message: data.message,
      }));
    } catch (error: AxiosError | any) {
      setMessage((err) => ({
        ...err,
        error: true,
        message: error?.response?.data.message,
      }));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === 'Enter') {
      if (currentTab === 'Account') {
        updateInfo(event);
      } else {
        handlePasswordChange(event);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return (
    <TeachersWrapper
      isPublic={true}
      metaTitle='Olive Grove - Where Your Teaching Legacy Begins'
      title='Olive Grove - Profile'
    >
      <div className='flex flex-col space-y-8'>
        <div className='w-full max-w-[20rem] flex gap-0'>
          {['Account', 'Security'].map((page, index) => (
            <div
              className={`px-7 py-2 font-medium text-sm text-center border-b-2 cursor-pointer transition w-full ${
                currentTab === page
                  ? 'border-primary border-opacity-70  bg-[#32A8C41A] text-primary'
                  : ''
              }`}
              onClick={() => setCurrentTab(page as 'Account' | 'Security')}
              key={index}
            >
              {page}
            </div>
          ))}
        </div>

        {/* Tab 1 */}
        {currentTab === 'Account' && (
          <form
            onSubmit={updateInfo}
            onKeyPress={handleKeyPress}
            className='flex flex-col space-y-8 shadow-card rounded-2xl py-10 px-6'
          >
            <ProfilePhotoSection
              userRole={user?.role!}
              setFormState={setFormState}
              setPreviewImage={setPreviewImage}
              previewImage={previewImage as string}
              setIsDisabled={setIsDisabled}
              profileImage={formState.profileImage as string}
              name={user && 'name' in user ? user.name : ''}
              id={user && 'teacherID' in user ? user.teacherID : ''}
            />
            <div className='flex flex-col'>
              <span className='text-lg lg:text-xl font-normal text-dark font-roboto'>
                Account Information
              </span>
              <span className='text-sm text-subtext font-roboto'>
                Edit your personal account information.
              </span>
            </div>
            <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-x-12 gap-y-8 w-full'>
              {inputFields.map((field) => (
                <InputField
                  label={field.label}
                  placeholder={field.label}
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  className={`disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md ${
                    field.type === 'select' ? 'text-sm' : 'text-base'
                  }`}
                  value={
                    formState[
                      field.name as keyof Omit<TFormState, 'profileImage'>
                    ]
                  }
                  onChange={(e) => {
                    setIsDisabled((prevState) => ({
                      ...prevState,
                      account: false,
                    }));
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      setFormState
                    );
                  }}
                  required={field.required}
                  error={''}
                  inputSize={field.type === 'select' ? 'sm' : 'xs'}
                  {...(field.type === 'select'
                    ? { options: field.options }
                    : {})}
                />
              ))}
            </div>

            <Button size='xs' type='submit' disabled={isDisabled.account}>
              Update
            </Button>
          </form>
        )}

        {/* Tab 2 */}
        {currentTab === 'Security' && (
          <form
            onSubmit={handlePasswordChange}
            onKeyPress={handleKeyPress}
            className='flex flex-col space-y-8 shadow-card rounded-2xl py-10 px-6'
          >
            <div className='flex flex-col'>
              <span className='text-lg lg:text-xl font-normal text-dark font-roboto'>
                Security Information
              </span>
              <span className='text-sm text-subtext font-roboto'>
                Update your security information.
              </span>
            </div>
            <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-x-12 gap-y-8 w-full'>
              <InputField
                label='New Password'
                placeholder='New Password'
                name='newPassword'
                type='password'
                className={`disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md text-base`}
                value={formState.newPassword}
                pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$'
                title='Password must be at least 8 characters containing uppercase, lowercase, and special characters(!@#$_%+-)'
                onChange={(e) => {
                  setIsDisabled((prevState) => ({
                    ...prevState,
                    security: false,
                  }));
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    setFormState
                  );
                }}
                required={true}
                disabled={otpRequestLoading || OTPTimer > 0}
                error={''}
              />
              <InputField
                label='Confirm Password'
                placeholder='Confirm Password'
                name='confirmPassword'
                type='password'
                className={`disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md text-base`}
                value={formState.confirmPassword}
                onChange={(e) => {
                  setIsDisabled((prevState) => ({
                    ...prevState,
                    security: false,
                  }));
                  handleInputChange(
                    e.target.name,
                    e.target.value,
                    setFormState
                  );
                }}
                required={true}
                disabled={otpRequestLoading || OTPTimer > 0}
                error={''}
              />
              <div className='flex flex-col space-y-2 relative'>
                <InputField
                  label='One-Time Password'
                  placeholder='Enter OTP'
                  name='otp'
                  type='text'
                  className={`disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md text-base`}
                  value={formState.otp}
                  onChange={(e) => {
                    setIsDisabled((prevState) => ({
                      ...prevState,
                      security: false,
                    }));
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange(e.target.name, value, setFormState);
                  }}
                  required={true}
                  disabled={
                    otpRequestLoading ||
                    formState.newPassword === '' ||
                    formState.confirmPassword === '' ||
                    formState.newPassword.length < 8 ||
                    formState.confirmPassword.length < 8 ||
                    formState.newPassword !== formState.confirmPassword
                  }
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
                      handleRequestOTP('password_reset');
                    }
                  }}
                  disabled={
                    otpRequestLoading ||
                    formState.newPassword === '' ||
                    formState.confirmPassword === '' ||
                    formState.newPassword.length < 8 ||
                    formState.confirmPassword.length < 8 ||
                    formState.newPassword !== formState.confirmPassword ||
                    OTPTimer > 0
                  }
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
            </div>

            <Button
              size='xs'
              type='submit'
              disabled={
                isDisabled.security ||
                otpRequestLoading ||
                formState.newPassword === '' ||
                formState.confirmPassword === '' ||
                formState.newPassword.length < 8 ||
                formState.confirmPassword.length < 8 ||
                formState.newPassword !== formState.confirmPassword ||
                formState.otp === '' ||
                formState.otp.length < 4
              }
            >
              Update
            </Button>
          </form>
        )}
      </div>
    </TeachersWrapper>
  );
};

export default TeachersProfile;

// Profile Photo Section
export function ProfilePhotoSection({
  profileImage,
  previewImage,
  name,
  userRole,
  setPreviewImage,
  setIsDisabled,
  type,
  setFormState,
  id,
}: IProfilePhotoSectionProps) {
  return (
    <div className='flex items-center space-x-7'>
      <div className='relative'>
        <Image
          src={
            previewImage
              ? previewImage
              : !profileImage
              ? dummyImage
              : profileImage
          }
          width={300}
          height={300}
          alt='Profile Image'
          className='shadow w-[5.7rem] h-[5.7rem] object-cover rounded-full'
        />
        {type !== 'Security' && (
          <>
            <label
              className='flex items-center justify-center absolute -right-1.5 cursor-pointer bottom-3 bg-white text-[#1E1E1E99] p-1.5 rounded-full'
              htmlFor='profileImage'
            >
              <PhotoCamera className='!text-lg' />
            </label>
            <Input
              type='file'
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const image = e.target.files?.[0];
                if (image) {
                  setFormState &&
                    setFormState((prevState: any) => ({
                      ...prevState,
                      [e.target.name]: image,
                    }));

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage && setPreviewImage(reader.result as string);

                    // Handle both boolean and object types for setIsDisabled
                    if (setIsDisabled) {
                      if (typeof setIsDisabled === 'function') {
                        setIsDisabled((prev: any) =>
                          typeof prev === 'boolean'
                            ? false
                            : { ...prev, account: false, security: false }
                        );
                      }
                    }
                  };
                  // setIsDisabled && setIsDisabled(false);

                  reader.readAsDataURL(image);
                }
              }}
              name='profileImage'
              accept='image/*'
              id='profileImage'
              className='hidden'
            />
          </>
        )}
      </div>
      <div className='flex flex-col justify-center font-roboto space-y-1 min-w-[200px]'>
        <span className='text-dark text-2xl leading-5'>
          {name.trim() ? name : 'N/A'}
        </span>
        <div className='flex flex-col justify-center'>
          <span className='text-subtext text-[15px]'>
            <strong>ID: </strong>
            {id.trim() ? id : 'N/A'}
          </span>
          <span className='text-subtext text-sm'>{userRole}</span>
        </div>
      </div>
    </div>
  );
}
