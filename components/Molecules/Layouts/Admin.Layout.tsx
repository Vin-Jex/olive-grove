import React, { ReactNode, useEffect, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import Meta from "@/components/Atoms/Meta";
import LogoutWarningModal from "../Modal/LogoutWarningModal";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { baseUrl } from "@/components/utils/baseURL";
import axiosInstance from "@/components/utils/axiosInstance";
import { useUser } from "@/contexts/UserContext";
import VerificationModal from "../Modal/VerificationModal";
import useServiceWorkerListener from "@/components/utils/hooks/useServiceWorkerListener";


export const handleLogout = async (type: 'students' | 'admin' | 'teachers') => {
  const role = Cookies.get('role');
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/${role?.toLowerCase()}-logout`
    );

    if (!response) return;

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('role');
    Cookies.remove('userId');
    window.location.href = `/auth/path/${type}/signin`;
  } catch (error) {
    console.error('Status: ', error);
  }
};

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  isPublic: boolean;
  metaTitle?: string;
  description?: string;
}

const AdminsWrapper = ({
  title,
  metaTitle,
  description,
  isPublic = true,
  children,
}: AdminWrapperProps) => {
  const active = true;
  const [warningModal, setWarningModal] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isForbidden = useServiceWorkerListener();

  const handleVerifyOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  const handleWarning = () => {
    setWarningModal(!warningModal);
  };

  useEffect(() => {
    if (isForbidden) {
      setIsOpen(true);
    }

    if (user && !isPublic && !user.isVerified) {
      setIsOpen(true);
    }
  }, [isOpen, isForbidden, user, isPublic]);

  return (
    <div className='w-full h-[100dvh] container mx-auto flex flex-col items-center justify-center'>
      <Meta title={metaTitle || 'Dashboard'} description={description} />
      <LogoutWarningModal
        handleModalClose={handleWarning}
        handleConfirm={() => {
          handleLogout('teachers');
        }}
        modalOpen={warningModal}
      />

      <VerificationModal
        modalOpen={isOpen}
        handleModalClose={handleVerifyOpen}
      />

      <aside
        className={`absolute left-0 top-0 h-screen w-fit z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className='w-full'>
        <div
          className={`${
            active ? '' : ''
          } absolute right-0 top-0 w-full flex z-30 lg:z-20`}
        >
          <div
            className={`${
              active ? 'w-0 lg:w-[15rem]' : 'w-0 lg:w-[98px]'
            } transition-all ease-in-out duration-500`}
          ></div>
          <nav className={`w-full md:px-4 lg:px-12`}>
            <AdminNav toggleSidenav={toggleSidenav} title={title} />
          </nav>
        </div>
        <main className='w-full h-full max-h-[calc(100dvh-3.37rem)] overflow-auto flex mt-20'>
          <div
            className={`${
              active ? 'w-0 lg:w-[15rem]' : 'w-0 lg:w-[98px]'
            } transition-all ease-in-out duration-500`}
          ></div>
          <div className='min-h-screen w-full z-10'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminsWrapper;
