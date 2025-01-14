import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import Button from "@/components/Atoms/Button";
import File from "@/components/Atoms/File";
import { baseUrl } from "@/components/utils/baseURL";
import InputField from "@/components/Atoms/InputField";
import { CircularProgress } from "@mui/material";
import { fetchCourses } from "@/components/utils/course";
import { InputType, TCourse } from "@/components/utils/types";
import OTPInput from "@/components/Molecules/OTPInput";
import useUserVerify from "@/components/utils/hooks/useUserVerify";
import MultipleSelect from "@/components/Molecules/MaterialSelect";
import FormPagination from "@/components/Molecules/FormPagination";
import { AxiosError } from "axios";
import AuthLayout from "./layout";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axiosInstance from "@/components/utils/axiosInstance";

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
  gender: "";
};

const StudentSignup = () => {
  const { otpRequestLoading, handleRequestOTP, fetchedDept, OTPTimer } =
    useUserVerify();
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [availableCourse, setAvailableCourses] = useState<TCourse[]>([]);
  const [formState, setFormState] = useState<SignupType>({
    firstName: "",
    lastName: "",
    middleName: "",
    department: "",
    email: "",
    dob: "",
    enrolledSubjects: [],
    username: "",
    password: "",
    gender: "",
  });
  const [isDisabled, setIsDisabled] = useState<boolean[]>(Array(3).fill(true));
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [otp, setOtp] = useState("");
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [firstName, setFirstName] = useState("");

  const inputFields: {
    label: string;
    name: string;
    type: InputType;
    required?: boolean;
    options?: { value: string; display_value: string }[];
  }[] = useMemo(
    () => [
      {
        label: "First Name",
        name: "firstName",
        type: "text",
        required: true,
        error: "",
      },
      {
        label: "Last Name",
        name: "lastName",
        type: "text",
        required: true,
        error: "",
      },
      {
        label: "Middle Name",
        name: "middleName",
        type: "text",
        required: false,
        error: "",
      },
      {
        label: "Date of Birth",
        name: "dob",
        type: "date",
        required: true,
        error: "",
      },
      {
        label: "Department",
        name: "department",
        type: "select",
        required: true,
        error: "",
        options: fetchedDept?.map((dept) => ({
          display_value: dept.name,
          value: dept._id,
        })),
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
        label: "Username",
        name: "username",
        type: "text",
        required: true,
        error: "",
      },
      {
        label: "Password",
        name: "password",
        type: "password",
        required: true,
        error: "",
      },
    ],
    [fetchedDept]
  );

  useEffect(() => {
    if (
      formState.dob !== "" &&
      formState.middleName !== "" &&
      formState.username !== "" &&
      formState.firstName !== "" &&
      formState.lastName !== "" &&
      formState.department !== "" &&
      formState.password !== "" &&
      formState.gender !== "" &&
      selectedImage !== null
    ) {
      setIsDisabled((c) => c.map((e, i) => (i === 0 ? false : e)));
    }
    if (formState.email !== "" && formState.enrolledSubjects.length !== 0)
      setIsDisabled((c) => c.map((e, i) => (i === 1 ? false : e)));
    if (otp !== "")
      setIsDisabled((c) => c.map((e, i) => (i === 2 ? false : e)));
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
    formState.gender,
  ]);

  useEffect(() => {
    async function getCourses() {
      const courses = await fetchCourses({
        query: "department",
        value: formState.department,
      });
      if (typeof courses === "string") return;
      else setAvailableCourses(courses.data);
    }
    getCourses();
  }, [formState.department]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      department: "",
      dob: "",
      email: "",
      password: "",
      gender: "",
    }));
    setSelectedImage(null);
    setFileName("");
    setPreviewImage(null);
  };

  const resetImageField = () => {
    setSelectedImage(null);
    setFileName("");
    setPreviewImage(null);
  };

  async function handleEmailVerify(otp: string) {
    try {
      setEmailVerifyLoading(true);
      const request_body = JSON.stringify({ otp });
      const response = await axiosInstance.post(`/email/verify`, request_body);

      setCurrentFormIndex((c) => c + 1);
      toast.success(response.data?.message || "Email verified successfully");
    } catch (err: AxiosError | any) {
      console.error("otp error", otp);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setEmailVerifyLoading(false);
    }
  }

  const handleErrors = (data: any) => {
    // Check for internet connectivity
    if (!navigator.onLine) {
      toast.error("No internet connection.");
      return;
    }

    // Validate email and password
    if (!formState.email.trim()) {
      toast.error("Email field cannot be empty.");
      return;
    }

    if (!formState.password.trim()) {
      toast.error(data.message.username);
      return;
    }

    if (data.message.username) {
      toast.error(data.message.username);
    } else if (data.message.password) {
      toast.error(data.message.password);
    } else if (data.message.firstName) {
      toast.error(data.message.firstName);
    } else if (data.message.lastName) {
      toast.error(data.message.lastName);
    } else if (data.message.dob) {
      toast.error(data.message.dob);
    } else if (data.message.dapartment) {
      toast.error(data.message.department);
    } else if (data.message.profileImage) {
      toast.error(data.message.profileImage);
    } else if (data.message.gender) {
      toast.error(data.message.gender);
    } else {
      console.error("Error Message: ", data.error);
    }

    if (data.error) {
      toast.error(data.message || data.error);
    }
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

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    setIsLoading(true);

    if (!navigator.onLine) {
      if (!navigator.onLine) {
        toast.error("No internet connection.");
        return;
      }
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedImage as Blob);

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      if (key === "enrolledSubjects") {
        formData.append(key, JSON.stringify(value));
      } else formData.append(key, value as string);
    });

    try {
      const response = await fetch(`${baseUrl}/student-signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      data && setFirstName(data?.details?.firstName);
      setCurrentFormIndex((c) => c + 1);

      const accessToken = data.token.accessToken;
      const refreshToken = data.token.refreshToken;
      const userId = data.details.id;
      const userRole = data.details.role;

      accessToken !== undefined &&
        Cookies.set("accessToken", accessToken, { expires: 1 });
      refreshToken !== undefined &&
        Cookies.set("refreshToken", refreshToken, { expires: 1 });
      userId !== undefined && Cookies.set("userId", userId, { expires: 1 });
      userRole !== undefined && Cookies.set("role", userRole, { expires: 1 });

      toast.success(data?.message);

      resetForm();
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignup(event);
    }
  };

  return (
    <AuthLayout title='Olive Grove - Create New Account'>
      <div className='relative w-full h-full flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center w-[94%] sm:w-[87%] md:w-2/3'>
          {currentFormIndex !== 4 && (
            <div className='flex flex-col items-center justify-center w-[90%] sm:w-[80%]'>
              <div className='flex flex-col items-center justify-center text-center'>
                <div className='w-[7rem] bg-[#1e1e1e] bg-opacity-5 h-1 relative mb-3'>
                  <div
                    style={{
                      width: `${((currentFormIndex + 1) * 100) / 4}%`,
                    }}
                    className={`absolute h-full transition-all left-0 top-0 bg-primary`}
                  />
                </div>
                <h5 className='text-dark text-base font-semibold capitalize font-roboto'>
                  Student Portal
                </h5>
                <span className='text-primary text-2xl font-semibold capitalize font-roboto'>
                  Olive Grove School
                </span>
                <span className='text-subtext text-sm font-medium capitalize font-roboto'>
                  {currentFormIndex === 0
                    ? "Join now to access personalized learning resources and take control of your academic journey!"
                    : currentFormIndex === 1
                    ? "Fill your email and kindly select all your enrolled subjects below."
                    : currentFormIndex === 2
                    ? "Would you like to verify your account now?"
                    : currentFormIndex === 3
                    ? "An OTP was sent to the email you provided. Kindly enter it below."
                    : ""}
                </span>
              </div>
            </div>
          )}

          <form
            className='flex flex-col mx-auto space-y-4 w-full mt-8'
            onKeyPress={handleKeyPress}
            onSubmit={handleSignup}
          >
            {/* first form step */}
            {currentFormIndex === 0 && (
              <div className='flex flex-col w-full space-y-3 overflow-y-auto'>
                {/* Rendering input fields */}
                <div className='flex space-x-3'>
                  {inputFields
                    .filter(
                      (field) =>
                        field.name === "firstName" || field.name === "lastName"
                    )
                    .map((field) => (
                      <InputField
                        placeholder={field.label}
                        label={field.label}
                        key={field.name}
                        name={field.name}
                        type={field.type}
                        {...(field.options && { options: field.options })}
                        pattern={
                          field.name === "username"
                            ? "[a-zA-Z0-9!@#$_%].{5,}$"
                            : field.name === "password"
                            ? "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$"
                            : undefined
                        }
                        title={
                          field.name === "email"
                            ? "Please enter a valid email address"
                            : field.name === "username"
                            ? "Username must be at least 5 characters containing uppercase, lowercase, and special characters(!@#$_%+-)"
                            : field.name === "password"
                            ? "Password must be at least 8 characters containing uppercase, lowercase, and special characters(!@#$_%+-)"
                            : ""
                        }
                        value={formState[field.name as keyof SignupType]}
                        onChange={handleChange}
                        required={field.required}
                        error={""}
                      />
                    ))}
                </div>

                {/* Department and gender side by side */}
                <div className='flex space-x-3'>
                  {inputFields
                    .filter(
                      (field) =>
                        field.name === "department" || field.name === "gender"
                    )
                    .map((field) => (
                      <InputField
                        placeholder={field.label}
                        label={field.label}
                        key={field.name}
                        name={field.name}
                        type={field.type}
                        {...(field.options && { options: field.options })}
                        value={formState[field.name as keyof SignupType]}
                        onChange={handleChange}
                        required={field.required}
                        error={""}
                      />
                    ))}
                </div>

                {/* Rendering remaining input fields */}
                {inputFields
                  .filter(
                    (field) =>
                      ![
                        "firstName",
                        "lastName",
                        "department",
                        "gender",
                      ].includes(field.name)
                  )
                  .map((field) => (
                    <InputField
                      placeholder={field.label}
                      label={field.label}
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      {...(field.options && { options: field.options })}
                      pattern={
                        field.name === "username"
                          ? "[a-zA-Z0-9!@#$_%].{5,}$"
                          : field.name === "password"
                          ? "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$"
                          : undefined
                      }
                      title={
                        field.name === "email"
                          ? "Please enter a valid email address"
                          : field.name === "username"
                          ? "Username must be at least 5 characters containing uppercase, lowercase, and special characters(!@#$_%+-)"
                          : field.name === "password"
                          ? "Password must be at least 8 characters containing uppercase, lowercase, and special characters(!@#$_%+-)"
                          : ""
                      }
                      value={formState[field.name as keyof SignupType]}
                      onChange={handleChange}
                      required={field.required}
                      error={""}
                    />
                  ))}

                {/* File upload component */}
                <div className='w-full flex flex-col gap-1 cursor-pointer'>
                  <File
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    previewImage={previewImage}
                    onChange={handleImageChange}
                    disabled={false}
                    resetImageStates={resetImageField}
                    accept='image/jpeg, image/png, image/jpg'
                    placeholder={
                      fileName === "" ? fileName : "Upload Profile Picture"
                    }
                    required
                    fileName={fileName}
                  />
                </div>

                {/* Continue Button */}
                <Button
                  size='sm'
                  width='full'
                  onClick={() => setCurrentFormIndex((c) => c + 1)}
                  className='capitalize'
                  disabled={isDisabled[0]}
                >
                  Continue
                </Button>

                {/* Login link */}
                <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
                  <span className='text-subtext'>Already have an account?</span>
                  <Link
                    href='/auth/path/students/signin'
                    className='text-primary'
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}

            {currentFormIndex === 1 && (
              <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                <InputField
                  type='email'
                  name='email'
                  className='ml-0 !py-5 !w-full'
                  value={formState.email}
                  onChange={handleChange}
                  placeholder='Enter your mail'
                  required
                  error=''
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
                  size='sm'
                >
                  {isLoading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    "Complete"
                  )}
                </Button>
              </div>
            )}

            {currentFormIndex === 2 && (
              <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                <div className='flex flex-col mx-auto gap-y-5 w-[490px]'>
                  <Button
                    size='sm'
                    width='full'
                    onClick={(e) => {
                      e.preventDefault();
                      handleRequestOTP("email_verification");
                      setCurrentFormIndex((c) => c + 1);
                    }}
                    className='mx-auto text-center'
                  >
                    {otpRequestLoading ? (
                      <CircularProgress size={20} color='inherit' />
                    ) : (
                      "Verify Now"
                    )}
                  </Button>
                  <Link
                    href='/auth/path/students/signin'
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
                    await handleEmailVerify(otp);
                  }}
                  className='mx-auto'
                  size='sm'
                >
                  {emailVerifyLoading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    "Verify"
                  )}
                </Button>
                <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
                  <span className='text-subtext'>Did&apos;t get OTP?</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOtp("");
                      handleRequestOTP("email_verification");
                    }}
                    className='text-primary'
                  >
                    Resend OTP
                  </button>
                  <span className='text-subtext ml-6'>
                    {String(Math.floor(OTPTimer / 60)).length < 2
                      ? String(Math.floor(OTPTimer / 60)).padStart(2, "0")
                      : Math.floor(OTPTimer / 60)}
                    :
                    {String(OTPTimer % 60).length < 2
                      ? String(OTPTimer % 60).padStart(2, "0")
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
                  Welcome {firstName}!
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

            {currentFormIndex !== 4 && (
              <FormPagination
                isDisabled={isDisabled}
                index={currentFormIndex}
                number={4}
                onChange={setCurrentFormIndex}
              />
            )}
          </form>
        </div>
      </div>
    </AuthLayout>
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
        fillOpacity='0.2'
      />
      <path
        d='M44.6254 62.4458L35.5166 53.3371C35.0258 52.8462 34.3601 52.5705 33.666 52.5705C32.9719 52.5705 32.3062 52.8462 31.8154 53.3371C31.3246 53.8279 31.0488 54.4936 31.0488 55.1877C31.0488 55.5314 31.1165 55.8717 31.248 56.1892C31.3796 56.5068 31.5724 56.7953 31.8154 57.0383L42.7879 68.0108C43.8116 69.0346 45.4654 69.0346 46.4891 68.0108L74.2616 40.2383C74.7524 39.7475 75.0282 39.0818 75.0282 38.3877C75.0282 37.6936 74.7524 37.0279 74.2616 36.5371C73.7708 36.0462 73.1051 35.7705 72.411 35.7705C71.7169 35.7705 71.0512 36.0462 70.5604 36.5371L44.6254 62.4458Z'
        fill='#35E309'
      />
    </svg>
  );
}

export default StudentSignup;
