import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import logo from "@/public/image/logo.png";
import Button from "../Atoms/Button";
import { Close, Menu } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [toggleNav, setToggleNav] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [currentHash, setCurrentHash] = useState("");
  const { loggedIn, user } = useAuth();

  // Set the hash on page load and whenever the route changes
  useEffect(() => {
    const hash = router.asPath.split("#")[1] || "";
    setCurrentHash(hash);

    const handleHashChange = () => {
      const updatedHash = window.location.hash.replace("#", "");
      setCurrentHash(updatedHash);
    };

    // Listen for changes in the hash (e.g., when navigating within the same page)
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [router.asPath]);

  useEffect(() => {
    setIsClient(true);

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setToggleNav(false);
      }
    };

    if (toggleNav) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [toggleNav]);

  return (
    <header className='relative w-full h-fit flex items-center justify-between py-1.5 px-2 sm:px-3.5 md:px-5 lg:px-8 bg-white z-50 bg-gradient-to-br from-[rgba(224,_224,_224,_0.45)] via-[rgba(224,_224,_224,_0.45)] to-[rgba(224,_224,_224,_0.45)] '>
      <Link
        href='/'
        className='w-[3.8rem] h-[2.8rem] md:h-[3.2rem] md:w-[4rem]'
      >
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

      {/* Overlay */}
      {toggleNav && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm w-full sm:hidden'
          onClick={() => setToggleNav(false)}
        />
      )}

      {/* Modal */}
      <div
        ref={modalRef}
        className={`bg-white/70 backdrop-blur-md shadow-2xl w-screen sm:hidden min-h-[70vh] absolute top-0 z-50 duration-500 ease-in-out transition-all overflow-hidden ${
          toggleNav
            ? "left-1/2 transform -translate-x-1/2 opacity-100 scale-100"
            : "opacity-0 scale-95 -left-[10000px]"
        }`}
      >
        {/* Modal Close Button */}
        <div className='w-full flex justify-end p-4'>
          <Close
            className='cursor-pointer text-dark/70 hover:text-dark'
            onClick={() => setToggleNav(false)}
          />
        </div>

        <div className='mb-6 w-[4rem] h-[4rem] mx-auto'>
          <Link href='/'>
            <Image
              src={logo}
              alt='Olive_grove_logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
        </div>

        <div className='w-full flex flex-col gap-y-8 items-center px-6'>
          <ul className='flex flex-col gap-2 capitalize w-full'>
            <li className='flex items-center w-full'>
              <Link
                href='#discover'
                onClick={() => setToggleNav(false)}
                className={`text-subtext font-roboto leading-6 text-lg w-full text-center py-2 rounded-md transition-colors duration-200 ease-in-out ${
                  currentHash === "discover"
                    ? "bg-blue-100 text-primary"
                    : "hover:bg-gray-100 hover:text-primary"
                }`}
              >
                Discover
              </Link>
            </li>
            <li className='flex items-center w-full'>
              <Link
                href='#features'
                onClick={() => setToggleNav(false)}
                className={`text-subtext font-roboto leading-6 text-lg w-full text-center py-2 rounded-md transition-colors duration-200 ease-in-out ${
                  currentHash === "features"
                    ? "bg-blue-100 text-primary"
                    : "hover:bg-gray-100 hover:text-primary"
                }`}
              >
                Features
              </Link>
            </li>
            <li className='flex items-center w-full'>
              <Link
                href='#about_us'
                onClick={() => setToggleNav(false)}
                className={`text-subtext font-roboto leading-6 text-lg w-full text-center py-2 rounded-md transition-colors duration-200 ease-in-out ${
                  currentHash === "about_us"
                    ? "bg-blue-100 text-primary"
                    : "hover:bg-gray-100 hover:text-primary"
                }`}
              >
                About Us
              </Link>
            </li>
          </ul>

          {isClient && !loggedIn ? (
            <div className='w-full flex flex-col space-y-4'>
              <Button
                width='full'
                size='xs'
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
                size='xs'
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
                size='xs'
                color='blue'
                onClick={() => setToggleNav(false)}
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Nav */}
      <div className='w-full sm:flex items-center justify-end gap-6 md:gap-8 lg:gap-10 hidden'>
        <ul className='flex items-center gap-5 md:gap-6 lg:gap-8 capitalize'>
          <li>
            <Link
              href='#discover'
              className={`text-subtext text-sm md:text-base font-roboto leading-6 transition-colors duration-200 ease-in-out ${
                currentHash === "discover"
                  ? "!text-primary px-3 py-1 rounded-md"
                  : "hover:bg-gray-100 hover:text-primary px-3 py-1 rounded-md"
              }`}
            >
              Discover
            </Link>
          </li>
          <li>
            <Link
              href='#features'
              className={`text-subtext text-sm md:text-base font-roboto leading-6 transition-colors duration-200 ease-in-out ${
                currentHash === "features"
                  ? "!text-primary px-3 py-1 rounded-md"
                  : "hover:bg-gray-100 hover:text-primary px-3 py-1 rounded-md"
              }`}
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              href='#about_us'
              className={`text-subtext text-sm md:text-base font-roboto leading-6 transition-colors duration-200 ease-in-out ${
                currentHash === "about_us"
                  ? "!text-primary px-3 py-1 rounded-md"
                  : "hover:bg-gray-100 hover:text-primary px-3 py-1 rounded-md"
              }`}
            >
              About Us
            </Link>
          </li>
        </ul>

        {isClient && !loggedIn ? (
          <div className='flex w-full max-w-[270px] h-fit gap-4'>
            <Button
              width='full'
              size='xs'
              color='outline'
              onClick={() => router.push("/auth/path")}
            >
              Login
            </Button>
            <Button
              width='full'
              size='xs'
              color='blue'
              onClick={() => router.push("/auth/path")}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Button
            size='xs'
            color='blue'
            onClick={() => {
              const role = user?.role;
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
