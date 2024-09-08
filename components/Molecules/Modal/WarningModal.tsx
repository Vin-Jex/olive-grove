import React, { useState } from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";

type WarningModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleConfirm?: () => void;
};

export default function WarningModal({
  modalOpen,
  handleModalClose,
  handleConfirm,
}: WarningModalProps) {
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[602px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex flex-col items-center justify-center py-5 md:py-[40px] px-4 md:px-6 w-full gap-y-6 md:gap-y-10'>
          <span className='font-roboto text-[19px] sm:text-[23px] text-center text-dark py-2 w-full'>
            Are you sure?
          </span>

          <div className='flex items-center justify-center gap-5 sm:gap-6 w-full'>
            <Button
              size='sm'
              onClick={() => {
                handleConfirm && handleConfirm();
                handleModalClose();
              }}
            >
              Yes
            </Button>
            <Button
              size='sm'
              color='outline'
              onClick={() => {
                handleModalClose();
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
