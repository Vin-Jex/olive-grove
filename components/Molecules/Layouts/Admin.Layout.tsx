import React, { ReactNode, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import { useSidebarContext } from "@/contexts/SidebarContext";
import Meta from "@/components/Atoms/Meta";
import WarningModal from "../Modal/WarningModal";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import CustomCursor from "../CustomCursor";
import { baseUrl } from "@/components/utils/baseURL";
import axiosInstance from "@/components/utils/axiosInstance";
import { constrainedMemory } from "process";

export const handleLogout = async () => {
  const role = Cookies.get("role");
  try {
    // const refreshToken = Cookies.get('refreshToken');
    // const accessToken = Cookies.get('accessToken');
    // const response = await fetch(`${baseUrl}/${role?.toLowerCase()}-logout`, {
    //   method: 'POST',
    //   // credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer accessToken=${accessToken};requestToken=${refreshToken}`,
    //   },
    // });

    // if (!response.ok) {
    //   await response.json();
    //   console.log(response, 'this section');
    //   return;
    // }

    const response = await axiosInstance.post(
      `${baseUrl}/${role?.toLowerCase()}-logout`
    );
    console.log(response, "this section");
    if (!response) return;

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    Cookies.remove("userId");


    // setTimeout(() => {
    //   window.location.href = '/auth/path/teachers/login/';
    // }, 500);
  } catch (error) {
    console.log("Status: ", error);
  }
};

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  metaTitle?: string;
  description?: string;
}

const AdminsWrapper = ({
  title,
  metaTitle,
  description,
  children,
}: AdminWrapperProps) => {
  // const { active } = useSidebarContext();
  const active = true;
  const [warningModal, setWarningModal] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const router = useRouter();

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  const handleWarning = () => {
    setWarningModal(!warningModal);
  };

  return (
    <div className="w-full h-[100dvh] container mx-auto flex flex-col items-center justify-center">
      {/*<customcursor />*/}

      <Meta title={metaTitle || "Dashboard"} description={description} />
      <WarningModal
        handleModalClose={handleWarning}
        handleConfirm={() => {
          handleLogout().then(() => router.push("/auth/path/teachers/login/"));
        }}
        modalOpen={warningModal}
      />

      <aside
        className={`absolute left-0 top-0 h-screen w-fit z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"

        } lg:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className="w-full">
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
            <AdminNav
              isOpen={isSidenavOpen}
              toggleSidenav={toggleSidenav}
              title={title}
            />
          </nav>
        </div>
        <main className="w-full h-full max-h-[calc(100dvh-3.37rem)] overflow-auto flex mt-20">
          <div
            className={`${
              active ? "w-0 lg:w-[15rem]" : "w-0 lg:w-[98px]"
            } transition-all ease-in-out duration-500`}
          ></div>
          <div className="min-h-screen w-full z-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminsWrapper;
