import React, { ReactNode, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import { useSidebarContext } from "@/contexts/SidebarContext";
import Meta from "@/components/Atoms/Meta";
import WarningModal from "../Modal/WarningModal";
import { useRouter } from "next/router";
import CustomCursor from "../CustomCursor";
import { handleLogout } from "./Admin.Layout";

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  metaTitle?: string;
  description?: string;
  className?: string;
}

const TeachersWrapper = ({
  title,
  metaTitle,
  description,
  children,
  className,
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
    <div className="w-full h-[100dvh] container overflow-auto mx-auto flex flex-col items-center justify-center">
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
        className={`absolute left-0 top-0 h-screen w-fit overflow-auto z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SideNav handleOpen={handleWarning} />
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
          <nav className={`w-full bg-white px-4`}>
            <AdminNav toggleSidenav={toggleSidenav} title={title} />
          </nav>
        </div>
        <main className="w-full h-full max-h-[calc(100dvh-3.37rem)] overflow-auto flex mt-16 overflow-x-hidden">
          <div
            className={`${
              active ? "w-0 lg:w-[15rem]" : "w-0 lg:w-[98px]"
            } transition-all ease-in-out duration-500`}
          ></div>
          <div className="h-[93vh] box-border w-full z-10 px-4 py-4 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeachersWrapper;
