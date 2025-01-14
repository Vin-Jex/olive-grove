import React from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";
import { TWarningModalProps } from "@/components/utils/types";
import { CircularProgress } from "@mui/material";
import { WarningSVG } from "./WarningModal";

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
        className='w-[80%] sm:w-[70%] md:w-[502px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex flex-col items-center justify-center py-5 md:py-[40px] px-4 md:px-6 w-full gap-y-6 md:gap-y-6'>
          <div className='text-center'>
            <WarningSVG />
          </div>

          <div className='flex flex-col items-center space-y-1'>
            <span className='font-roboto font-bold text-base sm:text-lg text-center !leading-6 text-dark w-[70%]'>
              Are you sure you want to signout?
            </span>
            <span className='text-center text-sm text-gray-400'>
              You will be redirected to the signin page to enter your
              information
            </span>
          </div>
          <div className='flex items-center justify-center space-x-5 w-full !mt-5'>
            <Button
              size='sm'
              color='outline'
              onClick={() => {
                handleModalClose();
              }}
            >
              Cancel
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
