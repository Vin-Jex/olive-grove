import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
    window.location.href =
      type === "admin" ? "/auth/path" : `/auth/path/${type}/signin`;
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
    <div className='relative w-full h-[100dvh] container overflow-auto mx-auto flex flex-row'>
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
        redirectTo={"/admin/profile"}
        modalOpen={isOpen}
        handleModalClose={handleVerifyOpen}
      />

      <aside
        className={` left-0 top-0 h-screen max-md:hidden w-[16.5rem] overflow-auto z-30 !bg-white block transition-transform transform ${
          isSidenavOpen ? "translate-x-0" : "-translate-x-full"
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

export default AdminsWrapper;
