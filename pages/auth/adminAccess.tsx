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
        usernameError: "Teacher ID field cannot be empty",
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
      const response = await fetch(`${baseUrl}/admin-login`, {
        method: "POST",
        credentials: "include",
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
        successError: "Teacher successfully logged in.",
      }));

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
      <div className='w-full md:w-[717px] flex flex-col items-center justify-center gap-12 my-auto mx-auto'>
        <div className='flex flex-col items-center justify-center gap-y-3'>
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
            Login as Admin
          </h5>
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
          className='flex flex-col mx-auto gap-y-5 w-[490px]'
        >
          <Input
            type='text'
            name='username'
            value={formState.username}
            onChange={handleChange}
            placeholder='Username'
            required
            className='input'
          />
          <Input
            type='password'
            name='password'
            value={formState.password}
            onChange={handleChange}
            placeholder='Password'
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
        </form>
      </div>
    </div>
  );
};

export default AdminAccess;
