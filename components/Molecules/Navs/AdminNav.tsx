import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Menu, NotificationsOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
  DateFormatter,
  generateDateString,
} from "@/components/Functions/DateFormatter";
import Image from "next/image";
import Profile from "@/public/image/student4.png";
import { baseUrl } from "@/components/utils/baseURL";

interface AdminNavType {
  title: string;
  toggleSidenav: () => void;
}

const AdminNav: React.FC<AdminNavType> = ({ title, toggleSidenav }) => {
  const [profileImage, setProfileImage] = useState("");
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("role");
  useEffect(() => {
    async function fetchProfileImage() {
      if (userRole === "Student") {
        try {
          const response = await fetch(`${baseUrl}/students/${userId}`);
          if (!response.ok) {
            //insert a fallback image;
            //for now set it to an empty string
            setProfileImage("");
          }
          const json = await response.json();
          setProfileImage(json.profileImage);
        } catch (err) {
          setProfileImage("");
        }
      }
      if (userRole === "Teacher") {
        try {
          const response = await fetch(`${baseUrl}/teachers/${userId}`);
          if (!response.ok) {
            //insert a fallback image;
            //for now set it to an empty string
            setProfileImage("");
          }
          const json = await response.json();
          setProfileImage(json.profileImage);
        } catch (err) {
          setProfileImage("");
        }
      }
      if (userRole === "Admin") {
        try {
          const response = await fetch(`${baseUrl}/admins/${userId}`);
          if (!response.ok) {
            //insert a fallback image;
            //for now set it to an empty string
            setProfileImage("");
          }
          const json = await response.json();
          setProfileImage(json.profileImage);
        } catch (err) {
          setProfileImage("");
        }
      }
    }
    fetchProfileImage();
  }, []);
  return (
    <div className="flex items-center justify-between w-full h-fit py-2 md:py-3 bg-light border-b space-x-2">
      <div className="flex md:!hidden">
        <Menu className="!text-2xl cursor-pointer" onClick={toggleSidenav} />
      </div>
      <div className="flex flex-col md:flex-row items-end md:justify-between w-fit md:w-full">
        <span className="leading-4 font-roboto font-medium text-sm md:text-xl text-dark order-2 md:order-1 w-full my-auto">
          {title}
        </span>
        <div className="flex items-center space-x-3 md:space-x-5 xl:space-x-7 order-1 md:order-2">
          <span className="font-roboto text-xs sm:text-sm md:text-[16px] lg:text-[18px] text-subtext leading-4 whitespace-nowrap">
            {DateFormatter(generateDateString())}
          </span>
          <button className="flex items-center justify-center">
            <NotificationsOutlined className="!text-xl md:!text-2xl text-subtext" />
          </button>
          <div className="w-7 h-7 md:w-9 md:h-9 overflow-hidden">
            <Image
              src={profileImage}
              width={300}
              height={300}
              alt="Profile Pics"
              className="shadow w-full h-full object-cover rounded-full"
            />
            {/* we're supposed to add a fallback image */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
