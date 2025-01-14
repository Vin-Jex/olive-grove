import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import SideNav from '../Navs/SideNav';
import AdminNav from '../Navs/AdminNav';
import Meta from '@/components/Atoms/Meta';
import LogoutWarningModal from '../Modal/LogoutWarningModal';
import { handleLogout } from './Admin.Layout';
import VerificationModal from '../Modal/VerificationModal';
import { useUser } from '@/contexts/UserContext';
import useServiceWorkerListener from '@/components/utils/hooks/useServiceWorkerListener';

interface AdminWrapperProps {
  children: ReactNode;
  title: string;
  isPublic: boolean;
  metaTitle?: string;
  description?: string;
}

const TeachersWrapper = ({
  title,
  metaTitle,
  description,
  children,
  isPublic = true,
}: AdminWrapperProps) => {
  const [warningModal, setWarningModal] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [isLogOutLoading, setIsLogOutLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isForbidden = useServiceWorkerListener();
  //for now forbidden is causing some issues I am not sure of, and I'm not sure of this logic cos I am already verified, so it should not

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
    <div className='relative w-full h-[100dvh] teacherCourse-Wrapper container overflow-auto mx-auto flex flex-row'>
      <Meta title={metaTitle || 'Dashboard'} description={description} />
      <LogoutWarningModal
        handleModalClose={handleWarning}
        loading={isLogOutLoading}
        handleConfirm={() => {
          setIsLogOutLoading(true);
          handleLogout('teachers').then(() => {
            setIsLogOutLoading(false);
            handleWarning();
          });
        }}
        modalOpen={warningModal}
      />
      <VerificationModal
        redirectTo='/teachers/profile'
        modalOpen={isOpen}
        handleModalClose={handleVerifyOpen}
      />

      <aside
        className={` left-0 top-0 h-screen max-md:hidden w-[16.5rem] overflow-auto z-30 !bg-white block transition-transform transform ${
          isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <SideNav isOpen={isSidenavOpen} handleOpen={handleWarning} />
      </aside>
      <div className='flex-1 w-full h-full overflow-y-auto relative flex flex-col'>
        <div className='w-full flex-0 flex z-40 lg:z-20 sticky top-0 right-0 bg-milky mb-2'>
          <nav className={`w-full mr-[2rem] ml-4`}>
            <AdminNav toggleSidenav={toggleSidenav} title={title} />
          </nav>
        </div>
        <main className='w-full overflow-x-hidden px-4 flex-1'>{children}</main>
      </div>
    </div>
  );
};

export default TeachersWrapper;
