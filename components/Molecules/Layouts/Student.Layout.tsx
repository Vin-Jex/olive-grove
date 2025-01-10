import React, { ReactNode, useEffect, useState } from "react";
import SideNav from "../Navs/SideNav";
import AdminNav from "../Navs/AdminNav";
import Meta from "@/components/Atoms/Meta";
import LogoutWarningModal from "../Modal/LogoutWarningModal";
import { handleLogout } from "./Admin.Layout";
import { TUser } from "@/components/utils/types";
import VerificationModal from "../Modal/VerificationModal";
import { useUser } from "@/contexts/UserContext";
import useServiceWorkerListener from "@/components/utils/hooks/useServiceWorkerListener";

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  isPublic?: boolean;
  metaTitle?: string;
  description?: string;
  remark?: string;
  setUser?: React.Dispatch<React.SetStateAction<TUser | null>>;
}

const StudentWrapper = ({
  title,
  remark,
  metaTitle,
  description,
  isPublic = true,
  children,
}: AdminWrapperProps) => {
  const [warningModal, setWarningModal] = useState(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isForbidden = useServiceWorkerListener();

  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  const handleWarning = () => {
    setWarningModal(!warningModal);
  };

  const handleVerifyOpen = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isForbidden) {
      setIsOpen(true);
    } else if (user && !isPublic && !user.isVerified) {
      setIsOpen(true);
    }
  }, [isForbidden, user, isPublic]);

  return (
    <div className='relative w-full h-[100dvh] container overflow-auto mx-auto flex flex-row'>
      <Meta title={metaTitle || "Dashboard"} description={description} />
      <LogoutWarningModal
        handleModalClose={handleWarning}
        loading={isLogOutLoading}
        handleConfirm={() => {
          setIsLogOutLoading(true);
          handleLogout("students").then(() => {
            setIsLogOutLoading(false);
            handleWarning();
          });
        }}
        modalOpen={warningModal}
      />

      <VerificationModal
        modalOpen={isOpen}
        redirectTo='/students/profile'
        handleModalClose={handleVerifyOpen}
      />

      <aside
        className={`left-0 top-0 h-screen w-[16.5rem] overflow-auto z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className='flex-1 w-full h-full overflow-y-auto relative flex flex-col'>
        <div className='w-full flex-0 flex z-40 lg:z-20 sticky top-0 right-0 bg-milky mb-2'>
          <nav className={`w-full mr-[2rem] ml-2`}>
            <AdminNav toggleSidenav={toggleSidenav} title={title} />
          </nav>
        </div>
        <main className='w-full overflow-x-hidden px-4 flex-1 pb-4'>{children}</main>
      </div>
    </div>
  );
};

export default StudentWrapper;
