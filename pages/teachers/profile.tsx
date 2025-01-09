import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
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
import UnvefiiedIcon from "@/images/unverifiedIcon.svg";
import Input from "@/components/Atoms/Input";
import axiosInstance from "@/components/utils/axiosInstance";
import { PhotoCamera } from "@mui/icons-material";
import InputField from "@/components/Atoms/InputField";
import { handleInputChange } from "@/components/utils/utils";
import Button from "@/components/Atoms/Button";
import toast from "react-hot-toast";
import { InputType } from "@/components/utils/types";
import useUserVerify from "@/components/utils/hooks/useUserVerify";
import { handleLogout } from "@/components/Molecules/Layouts/Admin.Layout";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { updateUserInDB } from "@/components/utils/indexDB";
import { useUser } from "@/contexts/UserContext";
import { CircularProgress } from "@mui/material";
import { baseUrl } from "@/components/utils/baseURL";

interface IProfilePhotoSectionProps {
  lastLoginAt: string | Date;
  isVerified: boolean;
  profileImage: string;
  name: string;
  id: string;
  userRole: "Teacher" | "Student" | "Admin";
  setIsDisabled:
    | Dispatch<SetStateAction<boolean>>
    | React.Dispatch<
        React.SetStateAction<{
          account: boolean;
          security: boolean;
        }>
      >;
  setPreviewImage: Dispatch<SetStateAction<Blob | null | string>>;
  setCurrentTab: Dispatch<
    SetStateAction<"Account" | "Security" | "account_verify">
  >;
  previewImage: string;
  setFormState: Dispatch<SetStateAction<any>>;
  type?: "Account" | "Security";
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
  const [currentTab, setCurrentTab] = useState<
    "Account" | "Security" | "account_verify"
  >("Account");
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const { user, setUser } = useUser();
  const [formState, setFormState] = useState<TFormState>({
    name: (user && "name" in user && user.name) || "",
    teacherID: (user && "teacherID" in user && user.teacherID) || "",
    tel: (user && "tel" in user && user.tel) as unknown as string || "",
    profileImage: user?.profileImage || "",
    address: (user && "address" in user && user?.address) || "",
    email: (user && "email" in user && user?.email) || "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [emailOTP, setEmailOTP] = useState({ error: "", value: "" });
  const [isDisabled, setIsDisabled] = useState({
    account: true,
    security: true,
  });

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
      label: "Full Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      required: true,
    },
    {
      label: "Mobile Number",
      name: "tel",
      type: "tel",
      required: false,
    },
    {
      label: "Home Address",
      name: "address",
      type: "text",
      required: false,
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      required: true,
      options: [
        { value: "male", display_value: "Male" },
        { value: "female", display_value: "Female" },
        { value: "other", display_value: "Other" },
        { value: "prefer_not_to_say", display_value: "Prefer not to say" },
      ],
    },
  ];

  useEffect(() => {
    if (user) {
      setCurrentTab(!user?.isVerified ? "account_verify" : "Account");
    }
  }, [user]);

  const getInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/teacher");
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
      console.error("Error fetching teacher info:", error);
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
          if (["newPassword", "confirmPassword", "otp"].includes(key)) {
            return;
          }
          if (key === "profileImage") {
            formData.append(key, formState[key as keyof TFormState] as File);
          } else {
            formData.append(key, formState[key as keyof TFormState]);
          }
        });

        const response = await axiosInstance.put("/teacher-user", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = response.data.data;
        toast.success(response.data?.message);

        // Update the user data in IndexedDB
        await updateUserInDB(user?._id!, data, user?._id!);

        // Fetch updated user data
        getInfo();
      } catch (error: any) {
        console.error("Error updating teacher info:", error);
        toast.error(
          `Failed to update teacher info: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    [formState, getInfo, user?._id]
  );

  const handleEmailVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setEmailVerifyLoading(true);
      const response = await axiosInstance.post(
        `${baseUrl}/email/verify`,
        JSON.stringify({ otp: emailOTP.value })
      );

      const data = await response.data;
      toast.success(data?.message || "Email verified successfully");

      router.push("/auth/path/teachers/signin");
    } catch (error: AxiosError | any) {
      const data = error?.response?.data;
      toast.error(data?.message || "Failed to verify email");
    } finally {
      setEmailVerifyLoading(false);
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

    setIsDisabled((prevState) => ({
      ...prevState,
      security: true,
    }));
    try {
      const response = await axiosInstance.post(`/password/change`, formData);

      const data = response.data;
      toast.success(data?.message);

      //log the user out on successfull password change
      handleLogout("students");

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
    if (isDisabled && event.key === "Enter") {
      if (currentTab === "Account") {
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
        <div className='w-full flex justify-between items-center'>
          <div className='w-full max-w-[20rem] flex gap-0'>
            {["Account", "Security"].map((page, index) => (
              <div
                className={`px-7 py-2 font-medium text-sm text-center border-b-2 cursor-pointer transition w-full ${
                  currentTab === page
                    ? "border-primary border-opacity-70  bg-[#32A8C41A] text-primary"
                    : ""
                }`}
                onClick={() =>
                  setCurrentTab(
                    page as "Account" | "Security" | "account_verify"
                  )
                }
                key={index}
              >
                {page}
              </div>
            ))}
          </div>
          <div
            className={`px-7 py-2 font-medium text-sm border-b-2  cursor-pointer transition ${
              currentTab === "account_verify"
                ? "border-primary border-opacity-70  bg-[#32A8C41A] text-primary"
                : ""
            }`}
            onClick={() => setCurrentTab("account_verify")}
          >
            Email Verification
          </div>
        </div>

        {/* Tab 1 */}
        {currentTab === "Account" && (
          <form
            onSubmit={updateInfo}
            onKeyPress={handleKeyPress}
            className='flex flex-col space-y-8 shadow-card rounded-2xl py-10 px-6'
          >
            <ProfilePhotoSection
              lastLoginAt={user?.lastLoginAt!}
              setCurrentTab={setCurrentTab}
              userRole={user?.role!}
              isVerified={user?.isVerified!}
              setFormState={setFormState}
              setPreviewImage={setPreviewImage}
              previewImage={previewImage as string}
              setIsDisabled={setIsDisabled}
              profileImage={formState.profileImage as string}
              name={user && "name" in user ? user.name : ""}
              id={user && "teacherID" in user ? user.teacherID : ""}
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
                    field.type === "select" ? "text-sm" : "text-base"
                  }`}
                  value={
                    formState[
                      field.name as keyof Omit<TFormState, "profileImage">
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
                  error={""}
                  inputSize={field.type === "select" ? "sm" : "xs"}
                  {...(field.type === "select"
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
        {currentTab === "Security" && (
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
                error={""}
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
                error={""}
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
                    const value = e.target.value.replace(/\D/g, "");
                    handleInputChange(e.target.name, value, setFormState);
                  }}
                  required={true}
                  disabled={
                    otpRequestLoading ||
                    formState.newPassword === "" ||
                    formState.confirmPassword === "" ||
                    formState.newPassword.length < 8 ||
                    formState.confirmPassword.length < 8 ||
                    formState.newPassword !== formState.confirmPassword
                  }
                  error={""}
                  maxLength={6}
                />
                <Button
                  size='xs'
                  type='button'
                  width='fit'
                  className='!text-xs !py-2 !px-4 font-roboto absolute right-2 bottom-[1.4rem] translate-y-1/2'
                  onClick={() => {
                    if (OTPTimer <= 0 && !otpRequestLoading) {
                      handleRequestOTP("password_reset");
                    }
                  }}
                  disabled={
                    otpRequestLoading ||
                    formState.newPassword === "" ||
                    formState.confirmPassword === "" ||
                    formState.newPassword.length < 8 ||
                    formState.confirmPassword.length < 8 ||
                    formState.newPassword !== formState.confirmPassword ||
                    OTPTimer > 0
                  }
                >
                  {otpRequestLoading
                    ? "Requesting OTP..."
                    : OTPTimer > 0
                    ? formattedTimer
                    : verifyOTP.status
                    ? "Resend OTP"
                    : "Request OTP"}
                </Button>
              </div>
            </div>

            <Button
              size='xs'
              type='submit'
              disabled={
                isDisabled.security ||
                otpRequestLoading ||
                formState.newPassword === "" ||
                formState.confirmPassword === "" ||
                formState.newPassword.length < 8 ||
                formState.confirmPassword.length < 8 ||
                formState.newPassword !== formState.confirmPassword ||
                formState.otp === "" ||
                formState.otp.length < 4
              }
            >
              Update
            </Button>
          </form>
        )}
        {currentTab === "account_verify" && (
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
                    const value = e.target.value.replace(/\D/g, "");
                    setEmailOTP((prev) => ({ ...prev, value }));
                  }}
                  required
                  error={""}
                  maxLength={6}
                />
                <Button
                  size='xs'
                  type='button'
                  width='fit'
                  className='!text-xs !py-2 !px-4 font-roboto absolute right-2 bottom-[1.4rem] translate-y-1/2'
                  onClick={() => {
                    if (OTPTimer <= 0 && !otpRequestLoading) {
                      handleRequestOTP("email_verification");
                    }
                  }}
                  disabled={otpRequestLoading || OTPTimer > 0}
                >
                  {otpRequestLoading
                    ? "Requesting OTP..."
                    : OTPTimer > 0
                    ? formattedTimer
                    : verifyOTP.status
                    ? "Resend OTP"
                    : "Request OTP"}
                </Button>
              </div>
              <Button
                size='xs'
                disabled={emailOTP.value.length < 6 || emailVerifyLoading}
                type='submit'
              >
                {emailVerifyLoading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </TeachersWrapper>
  );
};

export default TeachersProfile;

// Profile Photo Section
export function ProfilePhotoSection({
  lastLoginAt,
  isVerified,
  setCurrentTab,
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
    <div className='flex items-center justify-between'>
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
          {type !== "Security" && (
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
                      setPreviewImage &&
                        setPreviewImage(reader.result as string);

                      // Handle both boolean and object types for setIsDisabled
                      if (setIsDisabled) {
                        if (typeof setIsDisabled === "function") {
                          setIsDisabled((prev: any) =>
                            typeof prev === "boolean"
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
          <span className='text-dark flex items-center text-2xl leading-5'>
            {name.trim() ? name : "N/A"}
            <span className='ml-2'>
              {isVerified ? (
                <svg
                  width='28'
                  height='28'
                  className='h-5'
                  viewBox='0 0 28 28'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M20.5512 1.81576C20.2869 1.3934 19.8975 1.06396 19.4371 0.873295C18.9768 0.682633 18.4685 0.640237 17.9829 0.752008L14.5367 1.54359C14.1836 1.62477 13.8166 1.62477 13.4634 1.54359L10.0172 0.752008C9.53169 0.640237 9.02336 0.682633 8.56302 0.873295C8.10269 1.06396 7.71325 1.3934 7.44891 1.81576L5.57058 4.81342C5.37891 5.12009 5.12016 5.37884 4.8135 5.57243L1.81583 7.45076C1.3942 7.71486 1.06524 8.10367 0.874621 8.56322C0.684 9.02277 0.641172 9.53026 0.752081 10.0153L1.54366 13.4653C1.62454 13.8178 1.62454 14.1841 1.54366 14.5367L0.752081 17.9848C0.640741 18.47 0.683354 18.9779 0.873995 19.4379C1.06464 19.8978 1.39383 20.287 1.81583 20.5512L4.8135 22.4295C5.12016 22.6212 5.37891 22.8799 5.5725 23.1866L7.45083 26.1843C7.99133 27.0487 9.0225 27.4761 10.0172 27.248L13.4634 26.4564C13.8166 26.3753 14.1836 26.3753 14.5367 26.4564L17.9848 27.248C18.4701 27.3593 18.978 27.3167 19.438 27.1261C19.8979 26.9355 20.287 26.6063 20.5512 26.1843L22.4296 23.1866C22.6213 22.8799 22.88 22.6212 23.1867 22.4295L26.1862 20.5512C26.6083 20.2866 26.9373 19.897 27.1276 19.4367C27.3179 18.9764 27.36 18.4682 27.2481 17.9828L26.4584 14.5367C26.3772 14.1835 26.3772 13.8165 26.4584 13.4633L27.25 10.0153C27.3615 9.53018 27.3192 9.02241 27.1289 8.56249C26.9386 8.10256 26.6098 7.71332 26.1882 7.44884L23.1886 5.57051C22.8823 5.37849 22.6235 5.11967 22.4315 4.81342L20.5512 1.81576ZM19.5872 9.72584C19.7057 9.50785 19.7351 9.25238 19.6691 9.01317C19.6031 8.77397 19.4469 8.56968 19.2334 8.44329C19.0198 8.3169 18.7656 8.27827 18.5242 8.33553C18.2827 8.39278 18.0729 8.54145 17.9388 8.75026L12.9267 17.2334L9.90033 14.3354C9.81055 14.2432 9.70312 14.1701 9.58445 14.1203C9.46578 14.0705 9.3383 14.0452 9.20961 14.0457C9.08093 14.0463 8.95368 14.0728 8.83544 14.1236C8.71721 14.1744 8.61042 14.2485 8.52145 14.3414C8.43247 14.4344 8.36313 14.5443 8.31756 14.6647C8.27199 14.785 8.25112 14.9133 8.25621 15.0419C8.26129 15.1705 8.29222 15.2967 8.34714 15.4131C8.40207 15.5295 8.47988 15.6336 8.57591 15.7193L12.4744 19.4548C12.5788 19.5546 12.7043 19.6295 12.8416 19.674C12.979 19.7184 13.1246 19.7313 13.2676 19.7115C13.4106 19.6918 13.5473 19.6401 13.6675 19.5601C13.7877 19.4801 13.8883 19.374 13.9617 19.2498L19.5872 9.72584Z'
                    fill='#32A8C4'
                  />
                </svg>
              ) : (
                <Image
                  src={UnvefiiedIcon}
                  width={19}
                  height={19}
                  alt='unverified icon status'
                />
              )}
            </span>
          </span>
          <div className='flex flex-col justify-center'>
            <span className='text-subtext text-[15px]'>
              <strong>ID: </strong>
              {id.trim() ? id : "N/A"}
              {!isVerified && (
                <button
                  onClick={() => setCurrentTab("account_verify")}
                  className='ml-3 text-primary'
                >
                  verify Now!
                </button>
              )}
            </span>
            <span className='text-subtext text-sm'>{userRole}</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <div className='text-subtext'>Last Login</div>
        <span className='font-semibold text-subtext'>
          {" "}
          {new Date(lastLoginAt).toLocaleTimeString()},{" "}
          {new Date(lastLoginAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
