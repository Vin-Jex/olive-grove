import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ProfileImg from "@/public/image/student4.png";
import Button from "@/components/Atoms/Button";
import InputField from "@/components/Atoms/InputField";
import { baseUrl } from "@/components/utils/baseURL";
import Input, { InputType } from "@/components/Atoms/Input";
import { useRouter } from "next/router";
import {
  Info,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import withAuth from "@/components/Molecules/WithAuth";

const Profile = () => {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    internetError: "",
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
    successError: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const router = useRouter();

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
      label: "Username *",
      name: "username",
      type: "text",
      required: true,
      error: formError.usernameError,
    },
  ];

  useEffect(() => {
    if (
      formState.username === "" ||
      formState.password === "" ||
      formState.firstName === "" ||
      formState.lastName === "" ||
      formState.email === ""
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [
    formState.email,
    formState.firstName,
    formState.lastName,
    formState.password,
    formState.username,
  ]);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value as string,
    }));
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }));
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
    } else {
      console.error("Error Message: ", data.error);
    }

    // Clear errors after 10 seconds
    setTimeout(() => {
      setFormError({
        internetError: "",
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        usernameError: "",
        passwordError: "",
        successError: "",
      });
    }, 10000);
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    // Reset previous error messages
    event.preventDefault();
    resetForm();

    const formData = new FormData();

    // Append other form fields to the FormData object
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setIsDisabled(true);
      const response = await fetch(`${baseUrl}/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        handleErrors(data);
        return;
      }

      const data = await response.json();
      setFormError((prevState) => ({
        ...prevState,
        successError: "Information updated successfully.",
      }));

      // Reset the form after successful submission
      resetForm();

      console.log("Response: ", JSON.stringify(data));
    } catch (error) {
      console.log("Status: ", error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (isDisabled && event.key === "Enter") {
      handleSignup(event);
    }
  };

  return (
    <>
      <StudentWrapper title='Profile' metaTitle='Olive Groove ~ Profile'>
        <div className='p-12 space-y-5'>
          {/* Title */}
          <div className='flex flex-col'>
            <span className='text-lg font-medium text-dark font-roboto'>
              Access your Information
            </span>
            <span className='text-md text-subtext font-roboto'>
              Mange and edit your details.
            </span>
          </div>

          <div className='flex gap-4'>
            <Image
              src={ProfileImg}
              alt='Profile Pics'
              className='shadow w-16 h-16 object-cover rounded-full'
            />
            <div className='flex flex-col justify-center'>
              <span className='text-dark text-lg font-roboto leading-5'>
                Dr. Ayodeji Emmanuel
              </span>
              <span className='text-subtext'>Student</span>
            </div>
          </div>

          <div className='!mt-20'>
            {formError.internetError !== "" ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-[#d9b749] capitalize -mb-3'>
                <Info sx={{ fontSize: "1.1rem" }} />
                {formError.internetError}
                sdca
              </span>
            ) : formError.successError !== "" ? (
              <span className='flex items-center gap-x-1 text-sm md:text-base font-roboto font-semibold text-primary capitalize -mb-3'>
                <Info sx={{ fontSize: "1.1rem" }} />
                {formError.successError}
              </span>
            ) : (
              ""
            )}
            <form
              className='flex flex-col gap-y-5 w-[560px]'
              onKeyPress={handleKeyPress}
              onSubmit={handleSignup}
            >
              <span className='text-subtext text-xl font-roboto font-medium -mb-1'>
                Personal Information
              </span>
              <div className='flex items-end gap-8 w-full'>
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
                  value={formState[field.name as keyof typeof formState]}
                  onChange={handleChange}
                  required={field.required}
                  error={field.error}
                />
              ))}

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

              <Button
                type='submit'
                size='sm'
                width='full'
                disabled={isDisabled}
              >
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </StudentWrapper>
    </>
  );
};

export default withAuth("Student", Profile);
