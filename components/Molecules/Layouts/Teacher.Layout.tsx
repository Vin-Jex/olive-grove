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
    <>
      <div className="relative w-full h-[100dvh] container overflow-auto mx-auto flex flex-row">
        {/*<customcursor />*/}

        <Meta title={metaTitle || "Dashboard"} description={description} />
        <WarningModal
          handleModalClose={handleWarning}
          handleConfirm={() => {
            handleLogout().then(() =>
              router.push("/auth/path/teachers/login/")
            );
          }}
          modalOpen={warningModal}
        />

        <aside
          className={` left-0 top-0 h-screen w-[16.5rem] overflow-auto z-30 !bg-white lg:block transition-transform transform ${
            isSidenavOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
        </aside>
        <div className="flex-1 w-full h-screen overflow-y-auto relative">
          {/* <div
            className={`${
              active ? "" : ""
            } absolute right-0 top-0 w-full flex z-40 lg:z-20 bg-milky`}
          >
            <div
              className={`${
                active ? "w-0 lg:w-[22rem]" : "w-0 lg:w-[98px]"
              } transition-all ease-in-out duration-500`}
            ></div>
            <nav className={`w-full mr-[2rem] ml-4`}>
              <AdminNav
                isOpen={isSidenavOpen}
                toggleSidenav={toggleSidenav}
                title={title}
              />
            </nav>
          </div>
          <main className="w-full h-full max-h-[calc(100dvh-5rem)] overflow-y-auto overflow-x-hidden flex mt-[6rem] pt-5">
            <div
              className={`${
                active ? "w-0 lg:w-[20rem]" : "w-0 lg:w-[98px]"
              } transition-all ease-in-out duration-500`}
            ></div>
            <div className="min-h-screen w-full z-10 px-[2rem]">{children}</div>
          </main> */}
          <div
            className={`${
              active ? "" : ""
            } w-full flex z-40 lg:z-20 sticky top-0 right-0 bg-milky mb-2`}
          >
            <nav className={`w-full mr-[2rem] ml-4`}>
              <AdminNav
                isOpen={isSidenavOpen}
                toggleSidenav={toggleSidenav}
                title={title}
              />
            </nav>
          </div>
          <main className="w-full overflow-x-hidden px-4">{children}</main>
        </div>
      </div>
    </>
  );
};

export default TeachersWrapper;
