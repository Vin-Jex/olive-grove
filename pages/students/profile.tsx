import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Button from "@/components/Atoms/Button";
import InputField from "@/components/Atoms/InputField";
import withAuth from "@/components/Molecules/WithAuth";
import { baseUrl } from "@/components/utils/baseURL";
import axiosInstance from "@/components/utils/axiosInstance";
import { AxiosError } from "axios";
import useUserVerify from "@/components/utils/hooks/useUserVerify";
import { formatDate, handleInputChange } from "@/components/utils/utils";
import { ProfilePhotoSection } from "../teachers/profile";
import {
  EUserRole,
  InputType,
  TStudentCorrect,
} from "@/components/utils/types";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";
import { updateUserInDB } from "@/components/utils/indexDB";
import { handleLogout } from "@/components/Molecules/Layouts/Admin.Layout";

export type TFormState = {
  firstName: string;
  lastName: string;
  middleName?: string;
  profileImage: string | File | Blob;
  academicStatus: string;
  department: { category: string; name: string; _id: string } | any;
  dob: string;
  email: string;
  username: string;
  newPassword: string;
  confirmPassword: string;
  gender: string;
  otp: string;
  academicSection: string | null;
  role: EUserRole;
  enrolledSubjects: [] | null;
  studentID: string;
};

const Profile = () => {
  const { user, setUser } = useUser();
  const {
    otpRequestLoading,
    handleRequestOTP,
    formattedTimer,
    verifyOTP,
    OTPTimer,
    setOTPTimer,
    setFormattedTimer,
    setMessage,
  } = useUserVerify();

  const [formState, setFormState] = useState<TFormState>({
    firstName: (user && "firstName" in user && user.firstName) || "",
    lastName: (user && "lastName" in user && user.lastName) || "",
    middleName: (user && "middleName" in user && user.middleName) || "",
    profileImage:
      ((user && "profileImage" in user && user.profileImage) as string) || "",
    academicStatus:
      ((user &&
        "department" in user &&
        (user as TStudentCorrect).department?.category &&
        (user as TStudentCorrect).department?.category) as string) || "", // we have to confirm this
    department:
      ((user &&
        "department" in user &&
        (user as TStudentCorrect).department &&
        (user as TStudentCorrect).department) as string) || "",
    dob: (user && "dob" in user && formatDate(user.dob as string)) || "",
    email: (user && "email" in user && user.email) || "",
    username: (user && "username" in user && user.username) || "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    gender: (user && "gender" in user && user.gender) || "",
    academicSection: user?.academicSection || null,
    enrolledSubjects:
      (user && "enrolledSubjects" in user && user.enrolledSubjects) || null,
    role: user?.role ?? EUserRole.Student,
    studentID: (user && "studentID" in user && user.studentID) || "",
  });
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [isDisabled, setIsDisabled] = useState({
    account: true,
    security: true,
    verification: true,
  });
  const [currentTab, setCurrentTab] = useState<
    "Account" | "Security" | "account_verify"
  >("Account");

  const inputFields: {
    label: string;
    name: string;
    type: InputType;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    options?: { value: string; display_value: string }[];
  }[] = useMemo(
    () => [
      {
        label: "First Name",
        name: "firstName",
        type: "text",
        required: true,
      },
      {
        label: "Middle Name",
        name: "middleName",
        type: "text",
        required: true,
      },
      {
        label: "Last Name",
        name: "lastName",
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
        label: "Username",
        name: "username",
        type: "text",
        required: false,
      },
      {
        label: "Date of Birth",
        name: "dob",
        type: "date",
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
          { value: "undisclosed", display_value: "Prefer not to say" },
        ],
      },
      {
        label: "Department",
        name: "department",
        type: "text",
        required: true,
        disabled: true,
      },
      {
        label: "Academic Status",
        name: "academicStatus",
        type: "text",
        disabled: true,
      },
      {
        label: "Role",
        name: "role",
        type: "text",
        disabled: true,
      },
    ],
    []
  );

  useEffect(() => {
    if (user) {
      setCurrentTab(user?.isVerified === false ? "account_verify" : "Account");
    }
  }, [user]);

  const getInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/student");
      const data = response.data;
      setFormState((prev) => ({
        ...prev,
        name: data.name,
        studentID: data.teacherID,
        email: data.email,
        profileImage: data.profileImage,
        enrolledSubjects: data.enrolledSubjects,
        gender: data.gender,
        academicSection: data.academicSection,
        role: data.role,
        academicStatus: data.department?.category,
        dob: formatDate(data.dob),
        middleName: data.middleName,
        department: data.department,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      setUser(data);
      setIsDisabled((prevState) => ({
        ...prevState,
        account: true,
        security: true,
      }));
      setPreviewImage(null);
    } catch (err: AxiosError | any) {
      if (err.message === "Network Error") console.log("network error");
      if (
        err.response?.data?.message ===
        "Your account is not verified. Please check your email for the verification code."
      )
        setCurrentTab("account_verify");
      toast.error(err.response?.data?.message);
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
          const value = formState[key as keyof TFormState];

          if (value === null || value === undefined) {
            // Skip null or undefined fields
            return;
          }

          if (key === "profileImage") {
            if (value instanceof File || value instanceof Blob) {
              formData.append(key, value);
            } else if (typeof value === "string") {
              formData.append(key, value);
            }
          } else if (Array.isArray(value)) {
            if (key === "enrolledSubjects") {
              const ids = value
                .filter((course) => {
                  return (
                    typeof course === "object" &&
                    course !== null &&
                    "_id" in course
                  );
                })
                .map((course: { _id: string }) => course._id);
              formData.append(key, ids as unknown as string);
            } else {
              // Handle other arrays
              formData.append(key, JSON.stringify(value));
            }
          } else if (typeof value === "object" && value !== null) {
            if (
              (key === "academicSection" || key === "department") &&
              "_id" in value
            ) {
              const id = (value as { _id: string })._id;
              formData.append(key, id);
            }
          } else {
            formData.append(key, String(value));
          }
        });

        const response = await axiosInstance.put(
          `/student-user/${user && "username" in user && user.username}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const data = response.data;
        toast.success(data?.message);

        // Update the user data in IndexedDB
        await updateUserInDB(user?._id!, data?.data, user?._id!);

        // Fetch updated user data
        getInfo();
      } catch (error: AxiosError | any) {
        const data = error.response.data;
        const messageValues = Object?.values(data?.message);

        if (messageValues.length > 0) {
          toast.success(messageValues.join("\n"));
        } else
          toast.error(
            `Failed to update teacher info: ${
              error.response?.data?.message || error.message
            }`
          );
      }
    },
    [formState, getInfo, user]
  );

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === "newPassword" || key === "confirmPassword" || key === "otp") {
        if (value !== null && value !== undefined) {
          // Convert non-string types to string if needed
          formData.append(key, value.toString());
        }
      }
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

  const handleEmailVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsDisabled((prevState) => ({
        ...prevState,
        verification: true,
      }));

      const response = await axiosInstance.post(
        `${baseUrl}/email/verify`,
        JSON.stringify({ otp: formState.otp })
      );

      const data = await response.data;
      toast.success(data?.message || "Email verified successfully");
      // Update the user data in IndexedDB
      await updateUserInDB(user?._id!, data?.data, user?._id!);

      // Fetch updated user data
      getInfo();
    } catch (error: AxiosError | any) {
      const data = error?.response?.data;
      toast.error(data?.error || data?.message || "Failed to verify email");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      if (currentTab === "Account") {
        updateInfo(event);
      } else if (currentTab === "Security") {
        handlePasswordChange(event);
      } else if (currentTab === "account_verify") {
        handleEmailVerify(event);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return (
    <StudentWrapper
      remark='Manage and edit your profile settings.'
      title='Olive Grove - Profile'
      metaTitle='Olive Grove - Profile'
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
                onClick={() => {
                  setFormState((prevState) => ({
                    ...prevState,
                    otp: "",
                    newPassword: "",
                    confirmPassword: "",
                  }));
                  setFormattedTimer("00:00");
                  setOTPTimer(0);
                  setCurrentTab(
                    page as "Account" | "Security" | "account_verify"
                  );
                }}
                key={index}
              >
                {page}
              </div>
            ))}
          </div>

          {currentTab === "account_verify" && (
            <div
              className={`px-7 py-2 font-medium text-sm border-b-2  cursor-pointer transition ${
                currentTab === "account_verify"
                  ? "border-primary border-opacity-70  bg-[#32A8C41A] text-primary"
                  : ""
              }`}
              onClick={() => {
                setFormState((prevState) => ({
                  ...prevState,
                  otp: "",
                  newPassword: "",
                  confirmPassword: "",
                }));
                setFormattedTimer("00:00");
                setOTPTimer(0);
                setCurrentTab("account_verify")
              }}
            >
              Email Verification
            </div>
          )}
        </div>
        {/* Title */}

        {currentTab === "Account" && (
          <form
            className='flex flex-col space-y-8 shadow-card rounded-2xl py-10 px-6'
            onKeyPress={handleKeyPress}
            onSubmit={updateInfo}
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
              name={
                user && "firstName" in user && "lastName" in user
                  ? `${user.firstName} ${user.lastName}`
                  : ""
              }
              id={user && "studentID" in user ? user.studentID : ""}
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
                  disabled={field.disabled}
                  className={`disabled:bg-[#1e1e1e] disabled:bg-opacity-10 disabled:!border-none !rounded-md ${
                    field.type === "select" ? "text-sm" : "text-base"
                  }`}
                  value={
                    field.name === "department"
                      ? (formState.department &&
                        typeof formState.department === "object"
                          ? formState.department.name
                          : formState.department) || ""
                      : formState[
                          field.name as keyof Omit<TFormState, "profileImage">
                        ] ?? ""
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

            <div>
              {formState.enrolledSubjects &&
              formState.enrolledSubjects.length > 0 ? (
                formState.enrolledSubjects.map(
                  (course: { title: string }, index) => {
                    return (
                      <div
                        key={index}
                        className='bg-[#1e1e1e] text-subtext mt-3 bg-opacity-10 rounded-lg w-fit py-3 px-4 capitalize'
                      >
                        {course?.title}
                      </div>
                    );
                  }
                )
              ) : (
                <div className='flex flex-col justify-center space-y-2'>
                  <span className='text-sm font-roboto font-medium text-subtext'>
                    Your Courses:
                  </span>
                  <span className='bg-[#1e1e1e] text-subtext text-sm bg-opacity-10 rounded-lg w-fit py-3 px-4'>
                    Not offering any course.
                  </span>
                </div>
              )}
            </div>
            <Button size='xs' type='submit' disabled={isDisabled.account}>
              Update
            </Button>
          </form>
        )}

        {currentTab === "Security" && (
          <form
            className='flex flex-col space-y-8 shadow-card rounded-2xl py-10 px-6'
            onKeyPress={handleKeyPress}
            onSubmit={handlePasswordChange}
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
              onKeyPress={handleKeyPress}
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
                  value={formState.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormState((prev) => ({ ...prev, otp: value }));
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
                disabled={formState.otp.length < 6}
                type='submit'
              >
                Verify
              </Button>
            </form>
          </div>
        )}
      </div>
    </StudentWrapper>
  );
};

export default withAuth("Student", Profile);
