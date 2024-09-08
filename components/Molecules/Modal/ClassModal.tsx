import React, { useState } from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";

type ClassModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: () => void;
  type: "class" | "assignment";
};

export default function ClassModal({
  modalOpen,
  handleModalClose,
  handleAction,
  type,
}: ClassModalProps) {
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex flex-col justify-center py-5 md:py-[40px] px-4 md:px-6 w-full gap-y-6 md:gap-y-10'>
          <div className='flex flex-col justify-center gap-1'>
            <span className='text-dark text-3xl font-semibold font-roboto'>
              Physics {type}
            </span>

            <div className='text-subtext text-base font-roboto my-3'>
              Atomic structure is a fundamental topic in physics that explores
              the composition of matter at the microscopic level. It involves
              understanding the arrangement of subatomic particles within an
              atom. At the center is the nucleus, comprising positively charged
              protons and neutral neutrons. Electrons, which carry a negative
              charge, orbit the nucleus in defined energy levels.
            </div>

            <span className='flex gap-1 text-base text-subtext'>
              Teacher: Mr Azure Johnson
            </span>

            <span className='flex gap-1 text-base text-subtext'>
              Duration: 8:30am - 9:30am
            </span>
          </div>

          <div className='flex items-center w-full'>
            <Button
              size='sm'
              onClick={() => {
                handleAction && handleAction();
              }}
            >
              {type === "class" ? "Join Class" : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
