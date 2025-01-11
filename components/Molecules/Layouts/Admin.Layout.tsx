import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import Meta from "@/components/Atoms/Meta";
import LogoutWarningModal from "../Modal/LogoutWarningModal";
import Cookies from "js-cookie";
import { baseUrl } from "@/components/utils/baseURL";
import axiosInstance from "@/components/utils/axiosInstance";
import { useUser } from "@/contexts/UserContext";
import VerificationModal from "../Modal/VerificationModal";
import useServiceWorkerListener from "@/components/utils/hooks/useServiceWorkerListener";
import { deleteUserFromDB } from "@/components/utils/indexDB";

export const handleLogout = async (type: "students" | "admin" | "teachers") => {
  const role = Cookies.get("role");
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/${role?.toLowerCase()}-logout`
    );

    if (!response) return;

    await deleteUserFromDB(Cookies.get("userId") as string);

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    Cookies.remove("userId");
    window.location.href = `/auth/path/${type}/signin`;
  } catch (error) {
    console.error("Status: ", error);
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
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
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

  const shouldOpenModal = useCallback(() => {
    if (isForbidden) {
      setIsOpen(true);
    } else if (user && !isPublic) {
      if (user?.isVerified === false) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [isForbidden, isPublic, user]);

  useLayoutEffect(() => {
    shouldOpenModal();
  }, [shouldOpenModal]);

  return (
    <div className='w-full h-[100dvh] container mx-auto flex flex-col items-center justify-center'>
      <Meta title={metaTitle || "Dashboard"} description={description} />

      <LogoutWarningModal
        handleModalClose={handleWarning}
        loading={isLogOutLoading}
        handleConfirm={() => {
          setIsLogOutLoading(true);
          handleLogout("admin").then(() => {
            setIsLogOutLoading(false);
            handleWarning();
          });
        }}
        modalOpen={warningModal}
      />

      <VerificationModal
        redirectTo={
          user?.role === "Admin"
            ? "/admin/profile"
            : user?.role === "Student"
            ? "students/profile"
            : "/teachers/profile"
        }
        modalOpen={isOpen}
        handleModalClose={handleVerifyOpen}
      />

      <aside
        className={`absolute left-0 top-0 h-screen w-fit z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className='w-full'>
        <div
          className={`${
            active ? "" : ""
          } absolute right-0 top-0 w-full flex z-30 lg:z-20`}
        >
          <div
            className={`${
              active ? "w-0 lg:w-[15rem]" : "w-0 lg:w-[98px]"
            } transition-all ease-in-out duration-500`}
          ></div>
          <nav className={`w-full md:px-4 lg:px-12`}>
            <AdminNav toggleSidenav={toggleSidenav} title={title} />
          </nav>
        </div>
        <main className='w-full h-full max-h-[calc(100dvh-3.37rem)] overflow-auto flex mt-20'>
          <div
            className={`${
              active ? "w-0 lg:w-[15rem]" : "w-0 lg:w-[98px]"
            } transition-all ease-in-out duration-500`}
          ></div>
          <div className='min-h-screen w-full z-10'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminsWrapper;
