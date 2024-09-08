import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import AuthBg1 from "@/public/image/auth__bg.png";
import AuthBg2 from "@/public/image/auth_bg.png";
import AuthBg3 from "@/public/image/Frame 5.png";
import Input from "@/components/Atoms/Input";
import Button from "@/components/Atoms/Button";
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";

export type loginType = {
  username: string;
  password: string;
};

const StudentLogin = () => {
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
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const maxAge = 1 * 24 * 60 * 60;

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

    console.log("Data: ", data);

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
    } else {
      console.error("Error Message: ", data.error);
    }

    // Clear errors after 7 seconds
    setTimeout(() => {
      return setFormError({
        internetError: "",
        usernameError: "",
        passwordError: "",
        successError: "",
      });
    }, 7000);
    if (formState.username === "" || formState.password === "")
      setIsDisabled(true);
    else setIsDisabled(false);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    resetForm();

    try {
      if (formState.username === "" || formState.password === "")
        setIsDisabled(true);
      else setIsDisabled(false);
      const response = await fetch(`${baseUrl}/student-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
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
        successError: "Student successfully logged in.",
      }));
      Cookies.set("jwt", data?.token, {
        expires: maxAge * 1000,
        secure: true,
      });
      Cookies.set("userId", data?.id, {
        expires: maxAge * 1000,
        secure: true,
      });
      Cookies.set("role", data?.role, {
        expires: maxAge * 1000,
        secure: true,
      });

      // Reset the form after successful submission
      resetForm();

      // Wait for 5 seconds before redirecting to login
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.log("Status: ", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignIn(event);
    }
  };

  return (
    <div className='flex w-full h-screen relative'>
      <Image
        src={AuthBg1}
        alt='Auth Background Image 2'
        // Changed
        className='absolute -z-50 bottom-0 left-0 hidden lg:flex'
      />
      <Image
        src={AuthBg2}
        alt='Auth Background Image 2'
        className='absolute -z-50 top-0 right-0'
      />
      {/* Changed */}
      <div className='hidden lg:flex w-full items-center justify-center'>
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
            Student Portal
          </h5>
          <span className='text-primary text-[30px] font-semibold capitalize font-roboto leading-[30px]'>
            Olive Grove School
          </span>
          <span className='text-subtext text-[16px] font-medium capitalize font-roboto leading-[28px]'>
            Login to your Account
          </span>
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
        ) : formError.usernameError !== "" ? (
          <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.usernameError}
          </span>
        ) : formError.passwordError !== "" ? (
          <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-red-600/70 capitalize -mb-3'>
            <Info sx={{ fontSize: "1.1rem" }} />
            {formError.passwordError}
          </span>
        ) : (
          ""
        )}

        <form
          onKeyPress={handleKeyPress}
          onSubmit={handleSignIn}
          //Change
          className='flex flex-col mx-auto space-y-5 w-[94%] sm:w-[87%] md:w-[490px]'
        >
          <Input
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            placeholder='Username *'
            required
            className='input'
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Password *'
            required
            className='input'
            showIcon={VisibilityOutlined}
            hideIcon={VisibilityOffOutlined}
          />

          <span className='text-subtext text-base font-medium font-roboto cursor-pointer ml-auto w-fit whitespace-nowrap'>
            Forgot Password
          </span>

          <Button size='md' width='full' disabled={isDisabled}>
            Login
          </Button>
          <div className='flex items-center justify-center text-md font-roboto gap-x-1 -mt-2'>
            <span className='text-subtext'>Don&apos;t have an account?</span>
            <Link href='/auth/path/students/signup' className='text-primary'>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
