import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import Cookies from "js-cookie";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import Input from "@/components/Atoms/Input";
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { baseUrl } from "@/components/utils/baseURL";
import CustomCursor from "@/components/Molecules/CustomCursor";

export type loginType = {
  username: string;
  password: string;
};

const AdminAccess = () => {
  const [formState, setFormState] = useState<loginType>({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    internetError: "",
    usernameError: "",
    passwordError: "",
    successError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();
  const maxAge = 1 * 24 * 60 * 60;

  useEffect(() => {
    setIsDisabled(!formState.username || !formState.password);
  }, [formState]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setFormState({ username: "", password: "" });
    setFormError({
      internetError: "",
      usernameError: "",
      passwordError: "",
      successError: "",
    });
  };

  const handleErrors = (data: any) => {
    if (!navigator.onLine) {
      setFormError({
        internetError: "No internet connection",
        usernameError: "",
        passwordError: "",
        successError: "",
      });
      return;
    }

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

    if (data.message.username) {
      setFormError((prevState) => ({
        ...prevState,
        usernameError: data.message.username,
      }));
    } else if (data.message.password) {
      setFormError((prevState) => ({
        ...prevState,
        passwordError: data.message.password,
      }));
    }

    // Clear errors after 7 seconds
    clearError();
  };

  const clearError = () => {
    setTimeout(() => {
      setFormError({
        internetError: "",
        usernameError: "",
        passwordError: "",
        successError: "",
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
      const response = await fetch(`${baseUrl}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: "Successfully logged in!",
      }));
      Cookies.set("jwt", data.token, { expires: maxAge, secure: true });
      Cookies.set("userId", data.id, { expires: maxAge, secure: true });
      Cookies.set("role", data.role, { expires: maxAge, secure: true });

      resetForm();
      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      clearError();
    }
  };

  return (
    <div className='flex w-full h-screen justify-center items-center bg-gradient-to-r from-[#0078a8] to-[#32A8C4]'>
      <CustomCursor />

      <div className='bg-white rounded-lg shadow-lg px-6 py-8 w-full md:w-[480px] flex flex-col items-center gap-6'>
        <div className='flex flex-col items-center mb-6'>
          <Link href='/' className='w-[5rem] mb-2'>
            <Image
              src={logo}
              alt='Olive Grove Logo'
              width={80}
              height={90}
              className='rounded-full'
            />
          </Link>
          <h5 className='text-dark text-[20px] md:text-[22px] lg:text-[26px] font-bold mb-1 text-center'>
            Great to see you again,&nbsp;
            <span className='font-extrabold text-[#32A8C4]'>Admin!</span>
          </h5>

          <p className='text-gray-500 text-xs md:text-sm text-center mx-2 md:mx-4'>
            Kindly sign in to access and manage your administrative functions
            seamlessly.
          </p>
        </div>

        {/* Error Messages */}
        {formError.internetError && (
          <span className='text-yellow-600 text-sm flex items-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.internetError}
          </span>
        )}
        {formError.successError && (
          <span className='text-green-600 text-sm flex items-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.successError}
          </span>
        )}
        {formError.usernameError && (
          <span className='text-red-600 text-sm flex items-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.usernameError}
          </span>
        )}
        {formError.passwordError && (
          <span className='text-red-600 text-sm flex items-center gap-1'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.passwordError}
          </span>
        )}

        {/* Form Section */}
        <form
          onSubmit={handleSignIn}
          className='flex flex-col w-full gap-4 space-y-1'
        >
          <Input
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            placeholder='Username'
            required
            className='input rounded-lg p-3'
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Password'
            showIcon={VisibilityOutlined}
            hideIcon={VisibilityOffOutlined}
            required
            className='input rounded-lg p-3'
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
          Not an admin?&nbsp;
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

export default AdminAccess;
