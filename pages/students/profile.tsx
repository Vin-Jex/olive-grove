import Cookies from "js-cookie";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import Image from "next/image";
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import dummyImage from "@/images/dummy-img.jpg";
import Button from "@/components/Atoms/Button";
import InputField from "@/components/Atoms/InputField";
import Input, { InputType } from "@/components/Atoms/Input";
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import withAuth from "@/components/Molecules/WithAuth";
import { baseUrl } from "@/components/utils/baseURL";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/components/utils/axiosInstance";
import { AxiosError } from "axios";
import EmailVerifyModal from "@/components/Molecules/Modal/EmailVerifyModal";
import { Alert, Snackbar } from "@mui/material";
import { handleLogout } from "@/components/Molecules/Layouts/Admin.Layout";
import { useRouter } from "next/router";
import useUserVerify from "@/components/utils/hooks/useUserVerify";

type TFormState = {
  firstName: string;
  lastName: string;
  middleName: string;
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
    somethingOccured,
    setSomethingOccured,
    verifyOTP,
    OTPTimer,
  } = useUserVerify();
  const [formState, setFormState] = useState<TFormState>({
    firstName: "",
    lastName: "",
    middleName: "",
    profileImage: "",
    email: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [formError, setFormError] = useState({
    internetError: "",
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
    successError: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledPassword, setIsDisabledPassword] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [currentTab, setCurrentTab] = useState<"Account" | "Security">(
    "Account"
  );
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);
  const { user } = useAuth();
  const role = user?.role;
  const [profileError, setProfileError] = useState("");

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
      label: "Last Name *",
      name: "lastName",
      type: "text",
      required: true,
      error: formError.lastNameError,
    },
    {
      label: "Email Address *",
      name: "email",
      type: "email",
      required: true,
      error: formError.emailError,
    },
  ];

  useEffect(() => {
    if (
      formState.username === "" ||
      formState.firstName === "" ||
      formState.lastName === "" ||
      formState.email === "" //||
    )
      setIsDisabled(true);
    // else setIsDisabled(false);

    if (
      formState.newPassword === "" ||
      formState.confirmPassword === "" ||
      formState.otp === ""
    )
      setIsDisabledPassword(true);
    else setIsDisabledPassword(false);
  }, [
    formState.email,
    formState.firstName,
    formState.lastName,
    formState.newPassword,
    formState.confirmPassword,
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

  const handleProfileEdit = async (event: FormEvent<HTMLFormElement>) => {
    const cacheKey = `profileInfo_${role}_${user?.id}`;
    event.preventDefault();
    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      console.log(key, value, "key value");
      if (key !== "password" && key !== "otp" && key !== "username") {
        formData.append(key, value);
      }
    });

    try {
      setIsDisabled(true);
      const response = await axiosInstance.put(
        `${baseUrl}/student-user/${formState.username}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const data = await response.data;
      localStorage.removeItem(cacheKey);
      fetchProfile();
      setFormError((prevState) => ({
        ...prevState,
        successError: data?.data?.response?.message,
      }));

      // Reset the form after successful submission
      setTimeout(() => {
        setFormError((prevState) => ({
          ...prevState,
          successError: "",
        }));
      }, 5000);

      console.log("Response: ", JSON.stringify(data));
    } catch (error: AxiosError | any) {
      console.log(error, "axios error");
      const data = error.response.data;
      // handleErrors(data);
      setSomethingOccured((err) => ({
        ...err,
        error: true,
        message: data.message,
      }));
      console.log("Status: ", error);
    } finally {
      // setIsDisabled(true);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === "newPassword" || key === "confirmPassword" || key === "otp")
        formData.append(key, value);
    });

    try {
      setIsDisabledPassword(true);
      const response = await axiosInstance.post(
        `${baseUrl}/password/change`,
        formData
      ); //* simulate endpoint for password update

      // handleErrors(data);

      //log the user out on successfull password change
      handleLogout().then(() => {
        router.push("/auth/path/students/signin");
      });

      setSomethingOccured((err) => ({
        ...err,
        success: true,
        error: false,
        message: response?.data?.data.message,
      }));
    } catch (error: AxiosError | any) {
      console.log(error.response);
      setSomethingOccured((err) => ({
        ...err,
        error: true,
        message: error?.response?.data.message,
      }));
    } finally {
      setIsDisabledPassword(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    const cacheKey = `profileInfo_${role}_${user?.id}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      //removed the timestamp
      const { data } = JSON.parse(cachedData);

      setFormState({
        profileImage: data.profileImage,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        email: data.email,
        username: data.username,
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setProfileImage(data.profileImage);
      setStudentName(data.firstName + " " + data.lastName);
      return;
    }

    try {
      const response = await axiosInstance.get(`${baseUrl}/student`);

      const json = response.data;
      setFormState({
        profileImage: json.profileImage,
        firstName: json.firstName,
        lastName: json.lastName,
        middleName: json.middleName,
        email: json.email,
        username: json.username,
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setProfileImage(json.profileImage);

      setStudentName(json.firstName + " " + json.lastName);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: json,
        })
      );
    } catch (err: AxiosError | any) {
      //how to display error.
      if (err.message === "Network Error") console.log("network error");
      if (
        err.response.data.message ===
        "Your account is not verified. Please check your email for the verification code."
      )
        setEmailVerifyModal(true);
      setProfileError("Error occured in fetching user profile");
    }
  }, [user?.id, role]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [fetchProfile, user]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleProfileEdit(event);
    }
    setIsDisabled(false);
    // setIsDisabled;
  };

  return (
    <>
      <StudentWrapper
        firstTitle='Profile'
        remark='Manage and edit your profile settings.'
        title='Profile'
        metaTitle='Olive Groove ~ Profile'
      >
        <div className='md:p-12 px-6 py-12 space-y-5'>
          <div className='w-full max-w-[10rem] flex gap-0'>
            {["Account", "Security"].map((slug, i) => (
              <>
                <div
                  className={`px-7 py-2 font-medium text-sm border-b-2 cursor-pointer transition ${
                    currentTab === slug
                      ? "border-primary border-opacity-70  bg-[#32A8C41A] text-primary"
                      : ""
                  }`}
                  onClick={() => setCurrentTab(slug as "Account" | "Security")}
                  key={i}
                >
                  {slug}
                </div>
              </>
            ))}
          </div>
          {/* Title */}

          {currentTab === "Account" && (
            <form
              className='w-full flex justify-between sm:!mt-20 bg-white px-8 max-sm:px-5 rounded-2xl py-10 shadow-card'
              onKeyPress={handleKeyPress}
              onSubmit={handleProfileEdit}
            >
              <div className='w-full flex flex-col space-y-5 gap-y-5'>
                <Header
                  setFormState={setFormState}
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage as string}
                  setIsDisabled={setIsDisabled}
                  profileImage={profileImage}
                  studentName={studentName}
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
                  <Button
                    type='submit'
                    size='sm'
                    width='fit'
                    className='!px-8 disabled:cursor-not-allowed'
                    disabled={isDisabled}
                  >
                    Edit Personal Info
                  </Button>
                </div>
                {formError.internetError !== "" ? (
                  <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-[#d9b749] capitalize -mb-3'>
                    <Info sx={{ fontSize: "1.1rem" }} />
                    {formError.internetError}
                  </span>
                ) : formError.successError !== "" ? (
                  <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-primary capitalize -mb-3'>
                    <Info sx={{ fontSize: "1.1rem" }} />
                    {formError.successError}
                  </span>
                ) : (
                  ""
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
                    error={""}
                  />
                  {inputFields.map((field) => (
                    <InputField
                      placeholder={field.label}
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      value={
                        formState[
                          field.name as keyof Omit<TFormState, "profileImage">
                        ]
                      }
                      onChange={handleChange}
                      required={field.required}
                      error={field.error}
                    />
                  ))}
                </div>
              </div>
            </form>
          )}
          {currentTab === "Security" && (
            <form
              className='w-full flex justify-between sm:!mt-20 items-start bg-white px-8 rounded-2xl pb-8 pt-4 shadow-card'
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
                    <Info sx={{ fontSize: "1.1rem" }} />
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
                    showIcon={VisibilityOutlined}
                    hideIcon={VisibilityOffOutlined}
                  />
                  <Input
                    type='password'
                    name='confirmPassword'
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm Password *'
                    // required
                    className='input !rounded-xl'
                    showIcon={VisibilityOutlined}
                    hideIcon={VisibilityOffOutlined}
                  />
                  <div>
                    <Input
                      type='number'
                      name='otp'
                      value={formState.otp}
                      onChange={handleChange}
                      placeholder='OTP'
                      //required
                      className='input !rounded-xl'
                    />
                    <span className='text-sm ml-4'>{OTPTimer}</span>
                  </div>
                </div>
                <div className='font-roboto text-subtext'>
                  {verifyOTP.message}{" "}
                  <button
                    disabled={
                      formState.newPassword === "" ||
                      formState.confirmPassword === "" ||
                      formState.newPassword !== formState.confirmPassword ||
                      OTPTimer > 0
                    }
                    onClick={() => handleRequestOTP("password_reset")}
                    className='text-primary font-bold disabled:cursor-not-allowed'
                  >
                    {verifyOTP.status ? "Resend OTP" : " Request OTP"}
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
        </div>
      </StudentWrapper>
      {emailVerifyModal && (
        <EmailVerifyModal
          handleModalClose={() => setEmailVerifyModal(false)}
          modalOpen={emailVerifyModal}
        />
      )}
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          className='!z-[999]'
        >
          <Alert
            severity={somethingOccured.error ? "error" : "success"}
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

interface HeaderProps {
  profileImage: string;
  studentName: string;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  setPreviewImage: Dispatch<SetStateAction<Blob | null | string>>;
  previewImage: string;
  setFormState: Dispatch<SetStateAction<TFormState>>;
  type?: "security" | string;
}

function Header({
  profileImage,
  previewImage,
  studentName,
  setPreviewImage,
  setIsDisabled,
  type,
  setFormState,
}: HeaderProps) {
  return (
    <div className='flex gap-4'>
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
          className='shadow w-[6rem] h-[6rem] object-cover rounded-full'
        />
        {type !== "security" && (
          <>
            <label
              className='absolute -right-2 cursor-pointer top-[60%]'
              htmlFor='profileImage'
            >
              <CameraIcon />
            </label>
            <Input
              type='file'
              onChange={(e) => {
                const image = e.target.files?.[0];
                if (image) {
                  setFormState &&
                    setFormState((prevState) => ({
                      ...prevState,
                      [e.target.name]: image,
                    }));

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage && setPreviewImage(reader.result as string);
                    setIsDisabled && setIsDisabled(false);
                  };
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
      <div className='flex flex-col justify-center'>
        <span className='text-dark text-lg font-roboto leading-5'>
          {studentName}
        </span>
        <span className='text-subtext'>Student</span>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='30' height='30' rx='15' fill='white' />
      <path
        d='M9 9H11.25L12.75 7.5H17.25L18.75 9H21C21.3978 9 21.7794 9.15804 22.0607 9.43934C22.342 9.72064 22.5 10.1022 22.5 10.5V19.5C22.5 19.8978 22.342 20.2794 22.0607 20.5607C21.7794 20.842 21.3978 21 21 21H9C8.60218 21 8.22064 20.842 7.93934 20.5607C7.65804 20.2794 7.5 19.8978 7.5 19.5V10.5C7.5 10.1022 7.65804 9.72064 7.93934 9.43934C8.22064 9.15804 8.60218 9 9 9ZM15 11.25C14.0054 11.25 13.0516 11.6451 12.3483 12.3483C11.6451 13.0516 11.25 14.0054 11.25 15C11.25 15.9946 11.6451 16.9484 12.3483 17.6517C13.0516 18.3549 14.0054 18.75 15 18.75C15.9946 18.75 16.9484 18.3549 17.6516 17.6517C18.3549 16.9484 18.75 15.9946 18.75 15C18.75 14.0054 18.3549 13.0516 17.6516 12.3483C16.9484 11.6451 15.9946 11.25 15 11.25ZM15 12.75C15.5967 12.75 16.169 12.9871 16.591 13.409C17.0129 13.831 17.25 14.4033 17.25 15C17.25 15.5967 17.0129 16.169 16.591 16.591C16.169 17.0129 15.5967 17.25 15 17.25C14.4033 17.25 13.831 17.0129 13.409 16.591C12.9871 16.169 12.75 15.5967 12.75 15C12.75 14.4033 12.9871 13.831 13.409 13.409C13.831 12.9871 14.4033 12.75 15 12.75Z'
        fill='#1E1E1E'
        fillOpacity='0.6'
      />
    </svg>
  );
}

export default withAuth("Student", Profile);
