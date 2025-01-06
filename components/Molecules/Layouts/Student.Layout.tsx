import React, { ReactNode, useEffect, useState } from 'react';
import SideNav from '../Navs/SideNav';
import AdminNav from '../Navs/AdminNav';
import Meta from '@/components/Atoms/Meta';
import LogoutWarningModal from '../Modal/LogoutWarningModal';
import { useRouter } from 'next/router';
import { handleLogout } from './Admin.Layout';
import { TUser } from '@/components/utils/types';
import VerificationModal from '../Modal/VerificationModal';
import { useUser } from '@/contexts/UserContext';
import useServiceWorkerListener from '@/components/utils/hooks/useServiceWorkerListener';

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
  setUser,
  children,
}: AdminWrapperProps) => {
  const active = true;
  const [warningModal, setWarningModal] = useState(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
    }

    if (user && !isPublic && !user.isVerified) {
      setIsOpen(true);
    }
  }, [isOpen, isForbidden, user, isPublic]);

  return (
    <div className='w-full h-[100dvh] overflow-hidden container mx-auto flex flex-col items-center justify-center'>
      <Meta title={metaTitle || 'Dashboard'} description={description} />
      <LogoutWarningModal
        handleModalClose={handleWarning}
        loading={isLogOutLoading}
        handleConfirm={() => {
          setIsLogOutLoading(true);
          handleLogout('students').then(() => {
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
        className={`absolute left-0 top-0 h-screen overflow-auto w-[16rem] z-30 !bg-white lg:block transition-transform transform ${
          isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className='w-full'>
        <div className='absolute right-0 top-0 w-full flex z-30 lg:z-20'>
          <div
            className={`${
              active ? 'w-0 lg:w-[22rem]' : 'w-0 lg:w-[98px]'
            } transition-all ease-in-out duration-500`}
          />
          <nav className={`w-full sm:mr-[3.9rem]`}>
            <AdminNav
              toggleSidenav={toggleSidenav}
              title={title}
              remark={remark}
            />
          </nav>
        </div>
        <main className='w-full h-full max-h-[calc(100dvh-3.37rem)] overflow-auto flex mt-20'>
          <div
            className={`${
              active ? 'w-0 lg:w-[18rem]' : 'w-0 lg:w-[98px]'
            } transition-all ease-in-out duration-500`}
          ></div>
          <div className='min-h-screen w-full z-10'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default StudentWrapper;
