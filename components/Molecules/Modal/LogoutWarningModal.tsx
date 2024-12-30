import React from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";
import { TWarningModalProps } from "@/components/utils/types";
import { CircularProgress } from "@mui/material";

export default function LogoutWarningModal({
  modalOpen,
  handleModalClose,
  loading,
  handleConfirm,
}: TWarningModalProps) {
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[602px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex flex-col items-center justify-center py-5 md:py-[40px] px-4 md:px-6 w-full gap-y-6 md:gap-y-6'>
          <div className='text-center'>
            <WarningSVG />
          </div>
          <strong className='font-roboto text-[19px] sm:text-[23px] text-center text-dark w-full'>
            Are you sure you want to logout
          </strong>
          <span className='text-center max-w-[300px] text-gray-400'>
            You will be redirected to the login page to enter your login
            information
          </span>
          <div className='flex items-center justify-center gap-5 sm:gap-6 w-full'>
            <Button
              size='sm'
              color='outline'
              onClick={() => {
                handleModalClose();
              }}
            >
              cancel
            </Button>
            <Button
              size='sm'
              onClick={() => {
                handleConfirm && handleConfirm();
              }}
            >
              {loading ? (
                <CircularProgress className='' size={20} color='inherit' />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const WarningSVG = () => {
  return (
    <svg
      width='130'
      height='130'
      viewBox='0 0 130 130'
      className='w-24 h-24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='130' height='130' rx='65' fill='#FF3B3B' fillOpacity='0.2' />
      <path
        d='M64.9993 34.8462V75.0513M65.2506 95.1539V95.6565H64.748V95.1539H65.2506Z'
        stroke='#FF3B3B'
        strokeWidth='6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
