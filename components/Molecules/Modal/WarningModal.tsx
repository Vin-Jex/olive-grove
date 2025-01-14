import React from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";
import { CircularProgress } from "@mui/material";

interface WarningModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleConfirm: () => void;
  content: string;
  subtext: string;
  isLoading: boolean;
}

export default function WarningModal({
  modalOpen,
  handleModalClose,
  handleConfirm,
  content,
  subtext,
  isLoading,
}: WarningModalProps) {
  return (
    <Modal
      isOpen={modalOpen}
      onClose={handleModalClose}
      className='w-[80%] sm:w-[70%] md:w-[502px] bg-white backdrop-blur-[10px] rounded-3xl'
    >
      <div className='flex flex-col items-center justify-center py-8 px-4 md:px-6 w-full space-y-6'>
        <WarningSVG />
        <div className='flex flex-col items-center space-y-1'>
          <span className='font-roboto font-bold text-base sm:text-lg text-center !leading-6 text-dark w-[70%]'>
            {content}
          </span>
          <span className='text-center text-sm text-gray-400'>{subtext}</span>
        </div>
        <div className='flex items-center justify-center space-x-5 w-full !mt-5'>
          <Button size='xs' color='outline' onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            size='xs'
            disabled={isLoading}
            onClick={() => {
              if (handleConfirm) handleConfirm();
            }}
          >
            {isLoading ? (
              <CircularProgress size={15} color='inherit' />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export const WarningSVG = () => (
  <div className='flex items-center justify-center bg-[#FF3B3B33] rounded-full p-4'>
    <svg
      width='50'
      height='50'
      viewBox='0 0 88 88'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M43.9993 13.8462V54.0513M44.2506 74.1539V74.6565H43.748V74.1539H44.2506Z'
        stroke='#FF3B3B'
        strokeWidth='6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  </div>
);
