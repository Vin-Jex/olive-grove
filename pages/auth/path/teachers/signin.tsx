import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import useAjaxRequest, { TAxiosError, TAxiosSuccess } from "use-ajax-request";
import axiosInstance from "@/components/utils/axiosInstance";
import { TLoginResponse } from "@/components/utils/types";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { initDB } from "@/components/utils/indexDB";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import AuthLayout from "../students/layout";
import InputField from "@/components/Atoms/InputField";

export type loginType = {
  teacherID: string;
  password: string;
};

const LoginPath = () => {
  const { reCheckUser } = useAuth();
  const { sendRequest: loginTeacher, loading: isLoading } = useAjaxRequest({
    instance: axiosInstance,
    config: {
      url: `/teacher-login`,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
  const { setUser } = useUser();
  const [formState, setFormState] = useState<loginType>({
    teacherID: "",
    password: "",
  });
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (formState.teacherID === "" || formState.password.length < 6) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [formState.password, formState.teacherID]);

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
    setFormState({
      teacherID: "",
      password: "",
    });
    setIsDisabled(true);
  };

  const handleErrors = (data: any) => {
    if (!navigator.onLine) {
      toast.error("No internet connection");
      return;
    }

    if (!formState.teacherID.trim()) {
      toast.error("Teacher ID field cannot be empty.");
      return;
    }

    if (formState.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (data.error) {
      toast.error(data.error);
    }

    if (data.message.teacherID) {
      toast.error(data.message.teacherID);
    } else if (data.message.password) {
      toast.error(data.message.password);
    }
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
      "Welcome back, Instructor! You're all set to make a difference today!"
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
      await loginTeacher(handleSuccessLogin as any, handleErrorLogin, {
        data: formState,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignIn(event);
    }
  };

  return (
    <AuthLayout title='Olive Grove - Create New Account'>
      <div className='w-full h-full flex flex-col items-center justify-center gap-y-8'>
        <div className='flex flex-col items-center justify-center w-[90%] sm:w-[80%] md:w-[400px]'>
          <h5 className='text-dark text-base font-semibold capitalize font-roboto'>
            Teacher&apos;s Portal
          </h5>
          <span className='text-primary text-2xl font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-sm text-center font-medium capitalize font-roboto'>
            Easily access your teaching resources and manage your classes
            seamlessly.
          </span>
        </div>

        {/* Form Section */}
        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          className='flex flex-col mx-auto space-y-4 w-[94%] sm:w-[87%] md:w-[470px]'
        >
          <InputField
            label='Teacher ID'
            placeholder='Enter Teacher ID'
            type='text'
            name='teacherID'
            value={formState.teacherID}
            onChange={handleChange}
            required
            error={""}
            disabled={isLoading}
          />

          <InputField
            label='Password'
            placeholder='Enter Password'
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            required
            error={""}
            disabled={isLoading}
          />

          <Button size='sm' width='full' disabled={isDisabled || isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color='inherit' />
            ) : (
              "Sign In"
            )}
          </Button>
          <div className='flex items-center justify-center text-sm font-roboto gap-x-1 !mt-2'>
            <span className='text-subtext'>Not a teacher?&nbsp;</span>
            <Link href='/auth/path/students/signin' className='text-primary'>
              Sign in as a student
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPath;
