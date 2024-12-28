import React, { ReactNode, useEffect, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import Meta from "@/components/Atoms/Meta";
import LogoutWarningModal from "../Modal/LogoutWarningModal";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { handleLogout } from "./Admin.Layout";
import { getUserFromDB } from "@/components/utils/indexDB";
import VerificationModal from "../Modal/VerificationModal";
import { TUser } from "@/components/utils/types";

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  isPublic: boolean;
  metaTitle?: string;
  description?: string;
  className?: string;
  setUser?: React.Dispatch<React.SetStateAction<TUser | null>>;
}

const TeachersWrapper = ({
  title,
  metaTitle,
  description,
  children,
  isPublic = true,
  setUser,
  className,
}: AdminWrapperProps) => {
  const [warningModal, setWarningModal] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    const userId = Cookies.get("userId")!;
    const userDetails = async () => {
      const response = await getUserFromDB(userId, userId);
      if (response && !isPublic) {
        if (!response.isVerified) {
          setIsOpen(true);
        }
      }
      if (setUser) setUser(response);
    };
    if (userId) {
      userDetails();
    }
  }, [isPublic, setUser]);

  return (
    <>
      <div className='relative w-full h-[100dvh] container overflow-auto mx-auto flex flex-row'>
        <Meta title={metaTitle || "Dashboard"} description={description} />
        <LogoutWarningModal
          handleModalClose={handleWarning}
          handleConfirm={() => {
            handleLogout().then(() =>
              router.push("/auth/path/teachers/signin")
            );
          }}
          modalOpen={warningModal}
        />
        <VerificationModal
          modalOpen={isOpen}
          handleModalClose={handleVerifyOpen}
        />

        <aside
          className={` left-0 top-0 h-screen w-[16.5rem] overflow-auto z-30 !bg-white lg:block transition-transform transform ${
            isSidenavOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
        </aside>
        <div className='flex-1 w-full h-full overflow-y-auto relative flex flex-col'>
          <div className='w-full flex-0 flex z-40 lg:z-20 sticky top-0 right-0 bg-milky mb-2'>
            <nav className={`w-full mr-[2rem] ml-4`}>
              <AdminNav
                isOpen={isSidenavOpen}
                toggleSidenav={toggleSidenav}
                title={title}
              />
            </nav>
          </div>
          <main className='w-full overflow-x-hidden px-4 flex-1'>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default TeachersWrapper;
