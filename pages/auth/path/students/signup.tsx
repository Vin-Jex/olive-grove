import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import AuthBg1 from "@/public/image/auth__bg.png";
import AuthBg2 from "@/public/image/auth_bg.png";
import AuthBg3 from "@/public/image/Frame 5.png";
import { InputType } from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import Cookies from "js-cookie";
import { Info } from "@mui/icons-material";
import File from "@/components/Atoms/File";
import { baseUrl } from "@/components/utils/baseURL";
import { useRouter } from "next/router";
import InputField from "@/components/Atoms/InputField";
import CustomCursor from "@/components/Molecules/CustomCursor";
import { CircularProgress } from "@mui/material";

export type SignupType = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  dob: string;
  class: string;
  username: string;
  password: string;
};

const StudentSignup = () => {
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [formState, setFormState] = useState<SignupType>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    dob: "",
    class: "",
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    internetError: "",
    firstNameError: "",
    lastNameError: "",
    classError: "",
    dobError: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
    profileImageError: "",
    successError: "",
    generalError: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const maxAge = 1 * 24 * 60 * 60;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    {
      label: "Date of Birth *",
      name: "dob",
      type: "date",
      required: true,
      error: formError.dobError,
    },
    {
      label: "Class *",
      name: "class",
      type: "text",
      required: true,
      error: formError.classError,
    },
    {
      label: "Username *",
      name: "username",
      type: "text",
      required: true,
      error: formError.usernameError,
    },
    {
      label: "Password *",
      name: "password",
      type: "password",
      required: true,
      error: formError.passwordError,
    },
  ];

  useEffect(() => {
    if (
      formState.class === "" ||
      formState.dob === "" ||
      formState.username === "" ||
      formState.password === "" ||
      formState.firstName === "" ||
      formState.lastName === "" ||
      formState.email === "" ||
      selectedImage === null
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [
    formState.class,
    formState.dob,
    formState.email,
    formState.firstName,
    formState.lastName,
    formState.password,
    formState.username,
    selectedImage,
  ]);

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
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      class: "",
      dob: "",
      email: "",
      password: "",
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

  const handleErrors = (data: any) => {
    // Check for internet connectivity
    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: "No internet connection",
      }));
      return;
    }

    // Validate email and password
    if (!formState.email.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        emailError: "Email field cannot be empty",
      }));
      return;
    }

    if (!formState.password.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: "Password field cannot be empty",
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
    } else if (data.message.class) {
      setFormError((prevState) => ({
        ...prevState,
        classError: data.message.class,
      }));
    } else if (data.message.dob) {
      setFormError((prevState) => ({
        ...prevState,
        dobError: data.message.dob,
      }));
    } else if (data.message.profileImage) {
      setFormError((prevState) => ({
        ...prevState,
        profileImageError: data.message.profileImage,
      }));
    } else {
      console.error("Error Message: ", data.error);
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
        internetError: "",
        firstNameError: "",
        lastNameError: "",
        classError: "",
        dobError: "",
        emailError: "",
        usernameError: "",
        passwordError: "",
        profileImageError: "",
        successError: "",
        generalError: "",
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
        internetError: "No internet connection",
      }));
      setIsLoading(false);
      clearError();
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage as Blob);

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setIsDisabled(true);
      const response = await fetch(`${baseUrl}/student-signup/`, {
        method: "POST",
        body: formData,
      });

      console.error("Response Status: ", response.status);
      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: "Student account created successfully.",
      }));
      Cookies.set("userId", data?.id, { expires: maxAge * 1000, secure: true });

      // Reset the form after successful submission
      resetForm();

      // Wait for 5 seconds before redirecting to login
      setTimeout(() => {
        router.push("/auth/path/students/login/");
      }, 5000);

      console.log("Response: ", JSON.stringify(data));
    } catch (error) {
      console.log("Status: ", error);
    } finally {
      setIsDisabled(false);
      setIsLoading(false);
      clearError();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignup(event);
    }
  };

  return (
    <div className='flex w-full h-screen relative'>
      <CustomCursor />

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
      <div className='w-full flex items-center justify-center'>
        <Image
          src={AuthBg3}
          alt='Auth Background Image 2'
          className='max-w-[659px] max-h-[659px] w-full h-full object-cover'
        />
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-y-8'>
        <div className='flex flex-col items-center justify-center'>
          <Link href='/' className='w-[4.5rem] h-[5rem] -ml-4 -mb-2'>
            <Image
              src={logo}
              alt='Olive_grove_logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
          <h5 className='text-dark text-[20px] font-semibold capitalize font-roboto leading-[25px]'>
            School Portal
          </h5>
          <span className='text-primary text-[30px] font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-[16px] font-medium capitalize font-roboto leading-[28px]'>
            Create new account
          </span>
        </div>

        {formError.usernameError ? (
          <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.usernameError}
          </span>
        ) : formError.passwordError ? (
          <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.passwordError}
          </span>
        ) : formError.internetError ? (
          <span className='text-yellow-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            {formError.internetError}
          </span>
        ) : formError.successError ? (
          <span className='text-green-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            {formError.successError}
          </span>
        ) : formError.generalError ? (
          <span className='text-red-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            <span>{formError.generalError}</span>
          </span>
        ) : null}
        {formError.profileImageError !== "" && (
          <span className='flex items-center gap-x-1 text-sm font-roboto font-normal text-[#F6CE46]'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.profileImageError}
          </span>
        )}
        <form
          className='flex flex-col mx-auto gap-y-5 w-[490px]'
          onKeyPress={handleKeyPress}
          onSubmit={handleSignup}
        >
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
              error={""}
            />
          </div>
          {inputFields.map((field) => (
            <InputField
              placeholder={field.label}
              key={field.name}
              name={field.name}
              type={field.type}
              value={formState[field.name as keyof SignupType]}
              onChange={handleChange}
              required={field.required}
              error={field.error}
            />
          ))}

          <div className='w-full flex flex-col gap-1 cursor-pointer'>
            <File
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              previewImage={previewImage}
              onChange={handleImageChange}
              disabled={false}
              resetImageStates={resetImageField}
              placeholder={
                fileName === "" ? fileName : "Upload Profile Picture"
              }
              required
              fileName={fileName}
            />
          </div>
          <Button
            type='submit'
            size='sm'
            width='full'
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              "Create Account"
            )}
          </Button>
          <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
            <span className='text-subtext'>Already have an account?</span>
            <Link href='/auth/path/students/login' className='text-primary'>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignup;
