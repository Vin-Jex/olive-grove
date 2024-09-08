import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "@/public/image/logo.png";
import Button from "../Atoms/Button";
import { Close, Menu } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Header = () => {
  const [toggleNav, setToggleNav] = useState<boolean>(false);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className='relative w-full h-fit flex items-center justify-between py-1 px-2 sm:px-3.5 md:px-5 lg:px-8 bg-white z-50 bg-gradient-to-br from-[rgba(224,_224,_224,_0.45)] via-[rgba(224,_224,_224,_0.45)] to-[rgba(224,_224,_224,_0.45)] '>
      <Link href='/' className='w-[3.8rem] h-[2.8rem] md:h-[3.2rem] md:w-[4rem]'>
        <Image
          src={logo}
          alt='Olive_grove_logo'
          width='10000'
          height='10000'
          className='w-full h-full object-cover'
        />
      </Link>

      <span
        className='p-1 sm:p-2 visible sm:hidden cursor-pointer text-dark/80'
        onClick={() => setToggleNav(!toggleNav)}
      >
        {!toggleNav ? <Menu /> : <Close />}
      </span>
      <div
        className={`bg-white w-[90%] sm:w-[90%] min-h-screen absolute top-0 duration-300 ease-in-out transition-all overflow-auto px-4  ${
          !toggleNav ? "-left-[10000px] " : "left-0 sm:-left-[10000000000px]"
        }`}
      >
        <div className='mb-6 w-[4rem] h-[4rem]'>
          <Link href='/'>
            <Image
              src={logo}
              alt='Olive_grove_logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover -ml-2.5'
            />
          </Link>
        </div>

        <div className='w-full flex flex-col gap-y-8'>
          <ul className='flex flex-col gap-0.5 capitalize'>
            <li className='flex items-stretch'>
              <Link
                href='#discover'
                onClick={() => setToggleNav(false)}
                className='text-subtext font-roboto leading-6 text-[18px] sm:text-base py-3'
              >
                discover
              </Link>
            </li>
            <li className='flex items-stretch'>
              <Link
                href='#features'
                onClick={() => setToggleNav(false)}
                className='text-subtext font-roboto leading-6 text-[18px] sm:text-base py-3'
              >
                features
              </Link>
            </li>
            <li className='flex items-stretch'>
              <Link
                href='#about_us'
                onClick={() => setToggleNav(false)}
                className='text-subtext font-roboto leading-6 text-[18px] sm:text-base py-3'
              >
                about us
              </Link>
            </li>
          </ul>
          {isClient && !Cookies.get("jwt") ? (
            <div className='w-full flex flex-col space-y-4'>
              <Button
                width='full'
                size='sm'
                color='outline'
                onClick={() => {
                  router.push("/auth/path");
                  setToggleNav(false);
                }}
              >
                Login
              </Button>
              <Button
                width='full'
                size='sm'
                color='blue'
                onClick={() => {
                  router.push("/auth/path");
                  setToggleNav(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className='w-full flex flex-col gap-y-5'>
              <Button
                width='full'
                size='sm'
                color='blue'
                onClick={() => setToggleNav(false)}
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className='w-full sm:flex items-center justify-end gap-6 md:gap-8 lg:gap-10 hidden'>
        <ul className='flex items-center gap-5 md:gap-6 lg:gap-8 capitalize'>
          <li className=''>
            <Link
              href='#discover'
              className='text-subtext text-sm md:text-base font-roboto leading-6'
            >
              discover
            </Link>
          </li>
          <li className=''>
            <Link
              href='#features'
              className='text-subtext text-sm md:text-base font-roboto leading-6'
            >
              features
            </Link>
          </li>
          <li className=''>
            <Link
              href='#about_us'
              className='text-subtext text-sm md:text-base font-roboto leading-6'
            >
              about us
            </Link>
          </li>
        </ul>

        {isClient && !Cookies.get("jwt") ? (
          <div className='flex w-full max-w-[270px] h-fit gap-4'>
            <Button
              width='full'
              size='sm'
              color='outline'
              onClick={() => {
                router.push("/auth/path");
              }}
            >
              Login
            </Button>
            <Button
              width='full'
              size='sm'
              color='blue'
              onClick={() => {
                router.push("/auth/path");
              }}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Button
            size='sm'
            color='blue'
            onClick={() => {
              const role = Cookies.get("role");
              router.push(
                role === "Student"
                  ? "/students/dashboard"
                  : role === "Teacher"
                  ? "/teachers/dashboard"
                  : role === "Admin"
                  ? "/admins/dashboard"
                  : "/auth/path"
              );
            }}
          >
            Dashboard
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
