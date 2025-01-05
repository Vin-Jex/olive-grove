import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Input from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import { Info } from "@mui/icons-material";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import axiosInstance from "@/components/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";
import useAjaxRequest, { TAxiosError, TAxiosSuccess } from "use-ajax-request";
import { TLoginResponse } from "@/components/utils/types";
import AuthLayout from "./layout";
import { initDB } from "@/components/utils/indexDB";
import toast from "react-hot-toast";

export type loginType = {
  username: string;
  password: string;
};

const StudentLogin = () => {
  const { reCheckUser } = useAuth();
  const { sendRequest: loginStudent, loading: isLoading } = useAjaxRequest({
    instance: axiosInstance,
    config: {
      url: `/student-login`,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
  const [formState, setFormState] = useState<loginType>({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    internetError: "",
    usernameError: "",
    passwordError: "",
    successError: "",
    generalError: "",
  });

  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (formState.username === "" || formState.password === "")
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [formState.password, formState.username]);

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
      username: "",
      password: "",
    }));
    if (formState.username === "" || formState.password === "")
      setIsDisabled(true);
    else setIsDisabled(false);
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

    // Validate username and password
    if (!formState.username.trim()) {
      setFormError((prevState) => ({
        ...prevState,
        usernameError: "Username field cannot be empty",
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

    if (data.error) {
      setFormError((prevState) => ({
        ...prevState,
        generalError: data.error,
      }));
    }

    if (data.message.username) {
      setFormError((prevState) => ({
        ...prevState,
        usernameError: data.message.username,
      }));
    }

    if (data.message.password) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: data.message.password,
      }));
    }

    if (formState.username === "" || formState.password === "")
      setIsDisabled(true);
    else setIsDisabled(false);

    clearError();
  };

  const clearError = () => {
    setTimeout(() => {
      setFormError({
        internetError: "",
        passwordError: "",
        successError: "",
        generalError: "",
        usernameError: "",
      });
    }, 7000);
  };

  const handleSuccessLogin: TAxiosSuccess<TLoginResponse<"teacher">> = async ({
    data,
  }) => {
    const accessToken = data.token.accessToken;
    const refreshToken = data.token.refreshToken;
    const userId = data.details._id;
    const userRole = data.details.role;
    const userDetails = data.details;
    await initDB(userDetails, userDetails._id);

    accessToken !== undefined &&
      Cookies.set("accessToken", accessToken, { expires: 1 });
    refreshToken !== undefined &&
      Cookies.set("refreshToken", refreshToken, { expires: 1 });
    userId !== undefined && Cookies.set("userId", userId, { expires: 1 });
    userRole !== undefined && Cookies.set("role", userRole, { expires: 1 });
    Cookies.set("userDetails", JSON.stringify(data.details), { expires: 1 });

    toast.success(
      `Welcome back, ${
        userDetails && "firstName" in userDetails && "lastName" in userDetails
          ? `${userDetails.firstName} ${userDetails.lastName}`
          : "Student"
      }! Your learning journey continues!`
    );

    resetForm();
    reCheckUser();
    router.push("/");
  };

  const handleErrorLogin: TAxiosError<any> = (res) => {
    handleErrors(res.response.data);
    return;
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!navigator.onLine) {
      setFormError((prevState) => ({
        ...prevState,
        internetError: "No internet connection",
      }));
      clearError();
      return;
    }

    try {
      await loginStudent(handleSuccessLogin as any, handleErrorLogin, {
        data: formState,
      });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      clearError();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignIn(event);
    }
  };

  return (
    <AuthLayout title='Olive Grove - Welcome Back'>
      <div className='w-full h-full flex flex-col items-center justify-center gap-y-8'>
        <div className='flex flex-col items-center justify-center'>
          <h5 className='text-subtext text-base font-semibold capitalize font-roboto'>
            Student Portal
          </h5>
          <span className='text-dark text-2xl font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-sm font-medium capitalize font-roboto leading-[28px]'>
            Welcome Back!
          </span>
        </div>

        {/* Error Messages */}
        {
          formError.usernameError ? (
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
          ) : null // Return null if no errors exist
        }

        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          //Change
          className='flex flex-col mx-auto space-y-5 w-[94%] sm:w-[87%] md:w-[470px]'
        >
          <Input
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            placeholder='Enter Username'
            required
            className='input'
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Enter Password'
            required
            className='input'
          />

          <span className='text-subtext text-sm font-medium font-roboto cursor-pointer ml-auto !mt-1 w-fit whitespace-nowrap'>
            Forgot Password
          </span>

          <Button size='sm' width='full' disabled={isDisabled || isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              "Sign In"
            )}
          </Button>
          <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
            <span className='text-subtext'>Don&apos;t have an account?</span>
            <Link href='/auth/path/students/signup' className='text-primary'>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default StudentLogin;
