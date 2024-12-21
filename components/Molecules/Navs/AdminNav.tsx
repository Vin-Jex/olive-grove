import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Menu, NotificationsOutlined, Search } from '@mui/icons-material';
import dummyImage from '@/images/dummy-img.jpg';
import {
  DateFormatter,
  generateDateString,
} from '@/components/Functions/DateFormatter';
import Image, { StaticImageData } from 'next/image';
import Logo from '@/public/image/logo.png';
import { baseUrl } from '@/components/utils/baseURL';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/components/utils/axiosInstance';
import Input from '@/components/Atoms/Input';
import SearchLayout from '../SearchLayout';

interface AdminNavType {
  title?: string;
  firstTitle?: string;
  remark?: string;
  isOpen: boolean;
  toggleSidenav: () => void;
}

const AdminNav: React.FC<AdminNavType> = ({
  firstTitle,
  remark,
  title,
  isOpen,
  toggleSidenav,
}) => {
  const [profileImage, setProfileImage] = useState(dummyImage.src);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfileImage() {
      const userRole = user?.role;
      const userId = user?.id;

      // Create a cache key based on user role and ID
      const cacheKey = `profileImage_${userRole}_${userId}`;

      // Check if cached image exists and is still valid
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { image, timestamp } = JSON.parse(cachedData);

        // Check if cache is less than 1 hour old
        //this time check might not be necessary if we are invalidatino the json in localstorage on every profile update
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setProfileImage(image);
          return;
        }
      }

      // If no valid cache, fetch new image
      try {
        let response;
        switch (userRole) {
          case 'Student':
            response = await axiosInstance.get(`${baseUrl}/student`);
            break;
          case 'Teacher':
            response = await axiosInstance.get(`${baseUrl}/teacher`);
            break;
          case 'Admin':
            response = await axiosInstance.get(`${baseUrl}/admin`);
            break;
          default:
            return;
        }

        const imageUrl = response.data.profileImage;

        // Cache the image with timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            image: imageUrl,
            timestamp: Date.now(),
          })
        );

        setProfileImage(imageUrl);
      } catch (err) {
        setProfileImage(dummyImage.src);
      }
    }

    if (user) {
      fetchProfileImage();
    }
  }, [user]);

  return (
    <div className='flex relative mx-2 max-sm:px-6 items-center bg-[#fafafa] justify-between w-full border-b custom-height max-sm:py-2 my-2 md:my-3'>
      {/* <div className={` md:!hidden ${isOpen ? 'hidden' : 'flex'}`}> */}
      <div className="flex md:!hidden">
        <Menu className="!text-2xl cursor-pointer" onClick={toggleSidenav} />
      </div>
      <div className='uppercase max-sm:flex hidden items-center font-semibold'>
        <div className=''>
          <Image src={Logo} width={70} height={70} alt='school logo' />
        </div>
        <span>olive groove school</span>
      </div>
      <div className='flex flex-col md:flex-row items-center md:justify-between w-fit md:w-full'>
        <div className='max-sm:hidden flex flex-col order-2 space-y-1 pb-2 md:order-1 w-full'>
          <span className='leading-4 font-roboto font-medium text-md md:text-xl text-dark  w-full my-auto'>
            {title ? title : firstTitle}
          </span>
          {remark && (
            <span className="leading-4 font-roboto text-xs md:text-sm text-gray-400">
              {remark}
            </span>
          )}
        </div>

        <div className='flex items-center space-x-3 h-full md:space-x-5 xl:space-x-7 order-1 md:order-2'>
          {/* <span className='font-roboto text-xs sm:text-sm md:text-[16px] lg:text-[18px] text-subtext leading-4 whitespace-nowrap'>
          {DateFormatter(generateDateString())}
        </span> */}
          <button className='flex items-center  justify-center sm:justify-end'>
            <NotificationIcon />
          </button>
          <div className='w-8 h-7 max-sm:hidden md:w-9 md:h-9 overflow-hidden'>
            <Image
              src={!profileImage ? dummyImage : profileImage}
              width={300}
              height={300}
              alt='Profile Pics'
              className='shadow w-full h-full object-cover rounded-full'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function NotificationIcon() {
  return (
    <svg
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
      className='w-6'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.952 17.2316C2.7035 18.8579 3.813 19.9861 5.171 20.5484C10.3778 22.7068 17.6228 22.7068 22.8297 20.5484C24.1877 19.9861 25.2972 18.8568 25.0487 17.2316C24.897 16.2318 24.1422 15.3999 23.5833 14.5868C22.8518 13.5088 22.7795 12.3339 22.7783 11.0833C22.7795 6.25092 18.8502 2.33325 14.0003 2.33325C9.1505 2.33325 5.22116 6.25092 5.22116 11.0833C5.22116 12.3339 5.14883 13.5099 4.41617 14.5868C3.8585 15.3999 3.10483 16.2318 2.952 17.2316Z'
        stroke='#1E1E1E'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.33398 22.1665C9.86832 24.179 11.756 25.6665 14.0007 25.6665C16.2465 25.6665 18.1318 24.179 18.6673 22.1665'
        stroke='#1E1E1E'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default AdminNav;
