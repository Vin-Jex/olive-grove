import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import React from "react";
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
      link: "mailto:olivegrooveschool@gmail.com",
    },
  ],
  resources: [
    {
      text: "123 ABC Road, Apapa, Lagos. Nigeria.",
      Icon: PlaceOutlined,
      link: "#",
    },
    {
      text: "+2347012345678",
      Icon: PhoneOutlined,
      link: "tel:+2347012345678",
    },
    {
      text: "olivegrooveschool@gmail.com",
      Icon: MailOutlined,
      link: "mailto:olivegrooveschool@gmail.com",
    },
  ],
  follow_us: [
    {
      text: "Facebook",
      Icon: Facebook,
      link: "https://www.facebook.com/olivegrooves",
    },
    {
      text: "Instagram",
      Icon: Instagram,
      link: "https://www.instagram.com/olivegrooves",
    },
    {
      text: "Twitter",
      Icon: Twitter,
      link: "https://www.x.com/olivegrooves",
    },
    {
      text: "LinkedIn",
      Icon: LinkedIn,
      link: "https://www.linkedin.com/in/olivegrooves",
    },
    {
      text: "YouTube",
      Icon: YouTube,
      link: "https://www.youtube.com/olivegrooves",
    },
  ],
};

const Footer = () => {
  return (
    <div className='flex flex-col gap-y-8 md:gap-y-24 w-full px-3 sm:px-5 md:px-6 lg:px-12 xl:px-16 pt-3 md:pt-16 md:pb-6 border-t border-subtext'>
      <div className='flex flex-col md:flex-row w-full gap-x-12 gap-y-12'>
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
          <h5 className='text-dark/90 w-full text-[13px] font-roboto'>
            Join our community to receive updates and exclusive offers.
          </h5>
          <form className='flex items-center gap-3 w-full my-2'>
            <Input className='input' type='email' placeholder='Enter Email' />
            <Button type='submit' size='md' color='blue'>
              Join
            </Button>
          </form>
          <span className='text-dark/90 w-full text-[13px] font-roboto'>
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </span>
        </div>
        <div className='w-full flex flex-wrap lg:flex-nowrap items-start lg:items-center lg:justify-evenly gap-y-8 gap-x-16'>
          {Object.keys(list).map((key, index) => {
            const value = key.split("_").join(" ");
            return (
              <ul className='flex flex-col gap-y-4' key={index}>
                <h4 className='capitalize text-dark font-medium font-roboto text-[16px]'>
                  {value}
                </h4>
                {Object.values(list)[index].map(({ Icon, text, link }, ind) => {
                  return (
                    <li className='flex items-center gap-2' key={ind}>
                      <Link
                        href={link}
                        className='text-subtext text-[14px] flex items-center gap-2'
                      >
                        {Icon && <Icon />}
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
      <div className='flex flex-col md:flex-row md:items-center justify-between border-t-[1.5px] border-dark/60 w-full py-6 gap-y-4'>
        <span className='text-[14px] text-dark font-roboto order-2 md:order-1'>
          &copy; {new Date().getFullYear()} Olive Grove School. All rights
          reserved.
        </span>
        <ul className='flex flex-col sm:flex-row sm:items-center gap-y-3 gap-x-6 order-1 sm:order-2'>
          <li className='text-[14px] text-dark underline underline-offset-4 font-roboto'>
            Privacy Policy
          </li>
          <li className='text-[14px] text-dark underline underline-offset-4 font-roboto'>
            Terms of Service
          </li>
          <li className='text-[14px] text-dark underline underline-offset-4 font-roboto'>
            Cookies Settings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
