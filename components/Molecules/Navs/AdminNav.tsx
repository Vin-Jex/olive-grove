import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Menu, NotificationsOutlined, Search } from '@mui/icons-material';
import dummyImage from '@/images/dummy-img.jpg';
import {
  DateFormatter,
  generateDateString,
} from '@/components/Functions/DateFormatter';
import Image, { StaticImageData } from 'next/image';
import { baseUrl } from '@/components/utils/baseURL';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/components/utils/axiosInstance';
import Input from '@/components/Atoms/Input';
import SearchLayout from '../SearchLayout';

interface AdminNavType {
  title?: string;
  firstTitle?: string;
  remark?: string;
  toggleSidenav: () => void;
}

const AdminNav: React.FC<AdminNavType> = ({
  firstTitle,
  remark,
  title,
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
        if (Date.now() - timestamp < 60 * 60 * 1000) {
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
        localStorage.setItem(cacheKey, JSON.stringify({
          image: imageUrl,
          timestamp: Date.now()
        }));

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
    <div className='flex items-center justify-between w-full h-fit py-2 md:py-3 bg-light border-b space-x-2'>
    <div className='flex md:!hidden'>
      <Menu className='!text-2xl cursor-pointer' onClick={toggleSidenav} />
    </div>

    <div className='flex flex-col md:flex-row items-center md:justify-between w-fit md:w-full'>
      <div className='flex flex-col order-2 space-y-1 md:order-1 w-full'>
        <span className='leading-4 font-roboto font-medium text-md md:text-xl text-dark  w-full my-auto'>
          {title ? title : firstTitle}
        </span>
        {remark && (
          <span className='leading-4 font-roboto text-xs md:text-sm text-gray-400'>
            {remark}
          </span>
        )}
      </div>
      <div className='flex items-center space-x-3 md:space-x-5 xl:space-x-7 order-1 md:order-2'>
        {firstTitle !== 'Courses' && (
          <SearchLayout onChange={() => {}} value='' />
        )}
        <span className='font-roboto text-xs sm:text-sm md:text-[16px] lg:text-[18px] text-subtext leading-4 whitespace-nowrap'>
          {DateFormatter(generateDateString())}
        </span>
        <button className='flex items-center justify-center'>
          <NotificationsOutlined className='!text-xl md:!text-2xl text-subtext' />
        </button>
        <div className='w-7 h-7 md:w-9 md:h-9 overflow-hidden'>
          <Image
            src={!profileImage ? dummyImage : profileImage}
            width={300}
            height={300}
            alt='Profile Pics'
            className='shadow w-full h-full object-cover rounded-full'
          />
          {/* we're supposed to add a fallback image */}
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminNav;