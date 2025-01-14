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
import { useUser } from "@/contexts/UserContext";
import InputField from "@/components/Atoms/InputField";

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
  const { setUser } = useUser();
  const [formState, setFormState] = useState<loginType>({
    username: "",
    password: "",
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
      toast.error("No internet connection");
      return;
    }

    // Validate username and password
    if (!formState.username.trim()) {
      toast.error("Username field cannot be empty");
      return;
    }

    if (!formState.password.trim()) {
      toast.error("Password field cannot be empty");
      return;
    }

    if (data.error) {
      toast.error(data.error);
      return;
    }

    if (data.message.username) {
      toast.error(data.message.username);
      return;
    }

    if (data.message.password) {
      toast.error(data.message.password);
      return;
    }

    if (formState.username === "" || formState.password === "")
      setIsDisabled(true);
    else setIsDisabled(false);
  };

  const handleSuccessLogin: TAxiosSuccess<TLoginResponse<"student">> = async ({
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
    setUser(userDetails);
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
      toast.error("No internet connection");
      return;
    }

    try {
      await loginStudent(handleSuccessLogin as any, handleErrorLogin, {
        data: formState,
      });
    } catch (error) {}
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignIn(event);
    }
  };

  return (
    <AuthLayout title='Olive Grove - Welcome Back'>
      <div className='w-full h-full flex flex-col items-center justify-center gap-y-8'>
        <div className='flex flex-col items-center justify-center w-[90%] sm:w-[80%] md:w-[400px] text-center'>
          <h5 className='text-dark text-base font-semibold capitalize font-roboto'>
            Student Portal
          </h5>
          <span className='text-primary text-2xl font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-sm font-medium capitalize font-roboto'>
            Easily access your learning resources and stay on top of your
            classes effortlessly.
          </span>
        </div>

        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          //Change
          className='flex flex-col mx-auto space-y-4 w-[94%] sm:w-[87%] md:w-[470px]'
        >
          <InputField
            label={`Username`}
            placeholder='Enter Username'
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            required
            error={""}
          />

          <InputField
            label={`Password`}
            placeholder='Enter Password'
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            required
            error={""}
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
          <div className='flex items-center justify-center text-sm font-roboto gap-x-1 !mt-2'>
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
