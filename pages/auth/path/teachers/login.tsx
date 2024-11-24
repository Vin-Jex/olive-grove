import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import Input from "@/components/Atoms/Input";
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { baseUrl } from "@/components/utils/baseURL";
import { CircularProgress } from "@mui/material";
import CustomCursor from "@/components/Molecules/CustomCursor";

export type loginType = {
  teacherID: string;
  password: string;
};

const LoginPath = () => {
  const [formState, setFormState] = useState<loginType>({
    teacherID: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    internetError: "",
    teacherIDError: "",
    passwordError: "",
    successError: "",
    generalError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const maxAge = 1 * 24 * 60 * 60;

  useEffect(() => {
    if (formState.teacherID === "" || formState.password.length < 6) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [formState.password, formState.teacherID]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState({
      teacherID: "",
      password: "",
    });
    setIsDisabled(true);
  };

  const handleErrors = (data: any) => {
    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: "No internet connection",
      }));
      return;
    }

    if (!formState.teacherID.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        teacherIDError: "Teacher ID field cannot be empty",
      }));
      return;
    }

    if (formState.password.length < 6) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: "Password must be at least 6 characters long",
      }));
      return;
    }

    if (data.error) {
      setFormError((prevState) => ({
        ...prevState,
        generalError: data.error,
      }));
    }

    if (data.message.teacherID) {
      setFormError((prevState) => ({
        ...prevState,
        teacherIDError: data.message.teacherID,
      }));
    } else if (data.message.password) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: data.message.password,
      }));
    }

    clearError();
  };

  const clearError = () => {
    setTimeout(() => {
      setFormError({
        internetError: "",
        teacherIDError: "",
        passwordError: "",
        successError: "",
        generalError: "",
      });
    }, 7000);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
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

    try {
      const response = await fetch(`${baseUrl}/teacher-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }
      await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: "Teacher successfully logged in.",
      }));

      resetForm();

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      clearError();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignIn(event);
    }
  };

  return (
    <div className='flex w-full h-screen justify-center items-center bg-gradient-to-r from-[#0078a8] to-[#32A8C4]'>
      <CustomCursor />

      <div className='bg-white rounded-lg shadow-lg px-6 py-8 w-full md:w-[480px] flex flex-col items-center gap-6'>
        <div className='flex flex-col items-center mb-6'>
          <Link href='/' className='w-[4.5rem]'>
            <Image src={logo} alt='Olive Grove Logo' width={72} height={80} />
          </Link>
          <h5 className='text-dark text-[18px] md:text-[20px] lg:text-[24px] font-bold mb-1 text-center'>
            Welcome back,&nbsp;
            <span className='text-[#32A8C4]'>Instructor!</span>
          </h5>

          <p className='text-gray-600 text-sm text-center mx-4'>
            Easily access your teaching resources and manage your classes
            seamlessly.
          </p>
        </div>

        {/* Error Messages */}
        {formError.internetError && (
          <span className='text-yellow-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            {formError.internetError}
          </span>
        )}
        {formError.successError && (
          <span className='text-green-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            {formError.successError}
          </span>
        )}
        {formError.generalError && (
          <span className='text-red-600 text-sm flex items-center justify-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
            <span>{formError.generalError}</span>
          </span>
        )}

        {/* Form Section */}
        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          className='flex flex-col w-full gap-4'
        >
          <Input
            type='text'
            name='teacherID'
            value={formState.teacherID}
            onChange={handleChange}
            placeholder='Teacher ID'
            className='input rounded-lg shadow-md p-3'
            required
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Password'
            showIcon={VisibilityOutlined}
            hideIcon={VisibilityOffOutlined}
            className='input rounded-lg shadow-md p-3'
            required
          />

          <Button size='sm' width='full' disabled={isDisabled || isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className='text-gray-500 text-sm'>
          Not a teacher?&nbsp;
          <Link
            href='/auth/path/students/login'
            className='text-[#32A8C4] font-semibold'
          >
            Sign in as a student
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPath;
