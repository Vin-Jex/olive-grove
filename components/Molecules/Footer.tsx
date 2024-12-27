import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import React, { useEffect, useState } from "react";
import Input from "../Atoms/Input";
import Button from "../Atoms/Button";
import {
  Facebook,
  Instagram,
  LinkedIn,
  MailOutlined,
  PhoneOutlined,
  PlaceOutlined,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useRouter } from "next/router";

const list: {
  about_us: {
    text: string;
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    };
    link: string;
  }[];
  resources: {
    text: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    };
    link: string;
  }[];
  follow_us: {
    text: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    };
    link: string;
  }[];
} = {
  about_us: [
    {
      text: "Discover",
      link: "#discover",
    },
    {
      text: "Features",
      link: "#features",
    },
    {
      text: "Contact",
      link: "mailto:okomamakuochukwu@gmail.com",
    },
  ],
  resources: [
    {
      text: "Olive Grove College Ugwuomu Nike, Enugu.",
      Icon: PlaceOutlined,
      link: "#",
    },
    {
      text: "+2348039362043",
      Icon: PhoneOutlined,
      link: "tel:+2348039362043",
    },
    {
      text: "okomamakuochukwu@gmail.com",
      Icon: MailOutlined,
      link: "mailto:okomamakuochukwu@gmail.com",
    },
  ],
  follow_us: [
    {
      text: "Facebook",
      Icon: Facebook,
      link: "https://www.facebook.com/oliveGrove",
    },
    {
      text: "Instagram",
      Icon: Instagram,
      link: "https://www.instagram.com/oliveGrove",
    },
    {
      text: "Twitter",
      Icon: Twitter,
      link: "https://www.x.com/oliveGrove",
    },
    {
      text: "LinkedIn",
      Icon: LinkedIn,
      link: "https://www.linkedin.com/in/oliveGrove",
    },
    {
      text: "YouTube",
      Icon: YouTube,
      link: "https://www.youtube.com/oliveGrove",
    },
  ],
};

const Footer = () => {
  const router = useRouter();
  const [currentHash, setCurrentHash] = useState("");

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
  return (
    <div className='flex flex-col gap-y-8 md:gap-y-24 w-full px-4 sm:px-5 md:px-6 lg:px-12 xl:px-16 pt-3 md:pt-16 md:pb-6 border-t border-subtext bg-gradient-to-t from-gray-800 to-gray-700'>
      <div className='flex flex-col lg:flex-row w-full gap-x-12 gap-y-12'>
        <div className='flex flex-col w-full max-w-[500px]'>
          <Link href='/' className='w-[5.4rem] h-[5rem] -ml-4 -mb-2'>
            <Image
              src={logo}
              alt='Olive_grove_logo'
              width='10000'
              height='10000'
              className='w-full h-full object-cover'
            />
          </Link>
          <h5 className='text-white/90 w-full text-[13px] font-roboto'>
            Join our community to receive updates and exclusive offers.
          </h5>
          <form className='flex items-center justify-center w-full my-6 max-w-md'>
            <div className='relative w-full rounded-lg overflow-hidden'>
              <input
                type='email'
                placeholder='Enter Email'
                className='w-full py-3 px-4 border border-gray-300 shadow-sm focus:outline-none transition duration-300 ease-in-out'
                required
              />
              <button
                type='submit'
                className='absolute right-0 top-0 h-full bg-[#32A8C4] text-white font-semibold px-6 transition-transform transform hover:scale-100 focus:outline-none'
              >
                Join
              </button>
            </div>
          </form>

          <span className='text-white/90 w-full text-[13px] font-roboto'>
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </span>
        </div>
        <div className='w-full flex flex-wrap lg:flex-nowrap items-start lg:items-center lg:justify-evenly gap-y-8 gap-x-16'>
          {Object.keys(list).map((key, index) => {
            const value = key.split("_").join(" ");
            return (
              <ul className='flex flex-col gap-y-4' key={index}>
                <h4 className='capitalize text-white font-medium font-roboto text-[16px]'>
                  {value}
                </h4>
                {Object.values(list)[index].map(({ Icon, text, link }, ind) => {
                  const linkHash = link.split("#")[1];
                  return (
                    <li
                      className='flex items-center gap-2 transition-transform duration-300 hover:scale-105'
                      key={ind}
                    >
                      <Link
                        href={link}
                        className={`text-gray-300 text-[14px] flex items-center gap-2 hover:text-[#32A8C4] transition-colors duration-200 ${
                          currentHash === linkHash
                            ? "!text-[#32A8C4] font-bold"
                            : ""
                        }`}
                      >
                        {Icon && <Icon className='text-[#32A8C4]' />}
                        {text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </div>
      <div className='flex flex-col md:flex-row md:items-center justify-between border-t-[1.5px] border-gray-600 w-full py-6 gap-y-4'>
        <span className='text-[14px] text-gray-300 font-roboto order-2 md:order-1'>
          &copy; {new Date().getFullYear()} Olive Grove School. All rights
          reserved.
        </span>
        <ul className='flex flex-col sm:flex-row sm:items-center gap-y-3 gap-x-6 order-1 sm:order-2'>
          <li className='text-[14px] text-gray-300 underline underline-offset-4 font-roboto hover:text-[#32A8C4] transition-colors duration-200'>
            Privacy Policy
          </li>
          <li className='text-[14px] text-gray-300 underline underline-offset-4 font-roboto hover:text-[#32A8C4] transition-colors duration-200'>
            Terms of Service
          </li>
          <li className='text-[14px] text-gray-300 underline underline-offset-4 font-roboto hover:text-[#32A8C4] transition-colors duration-200'>
            Cookies Settings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
