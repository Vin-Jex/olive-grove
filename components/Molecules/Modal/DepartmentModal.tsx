import React from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";

type DepartmentModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: () => void;
  type: "lecture" | "assessment";
};

export default function DepartmentModal({
  modalOpen,
  handleModalClose,
  handleAction,
  type,
}: DepartmentModalProps) {
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[751px] bg-white rounded-3xl shadow-lg'
      >
        {/* Header Section */}
        <div className='flex flex-col items-center py-6 md:py-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-3xl'>
          <span className='text-4xl font-semibold font-roboto'>
            {type === "lecture" ? "Physics Lecture" : "Physics Assessment"}
          </span>
          <span className='text-lg mt-2'>
            Learn about Atomic Structure with Mr. Azure Johnson
          </span>
        </div>

        {/* Content Section */}
        <div className='flex flex-col justify-center py-6 md:py-10 px-6 md:px-8 gap-y-6 md:gap-y-8'>
          {/* Description */}
          <div className='text-gray-700 text-base leading-relaxed'>
            <p>
              Atomic structure is a fundamental topic in physics that explores
              the composition of matter at the microscopic level. It involves
              understanding the arrangement of subatomic particles within an
              atom. At the center is the nucleus, comprising positively charged
              protons and neutral neutrons. Electrons, which carry a negative
              charge, orbit the nucleus in defined energy levels.
            </p>
          </div>

          {/* Class Details */}
          <div className='flex flex-col gap-y-2 text-gray-500 text-sm font-medium'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-gray-600'>Teacher:</span>
              Mr. Azure Johnson
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-gray-600'>Duration:</span>
              8:30am - 9:30am
            </div>
          </div>

          {/* Divider */}
          <div className='border-t border-gray-200 my-4'></div>

          {/* Action Button */}
          <div className='flex justify-center'>
            <Button
              size='md'
              onClick={() => {
                handleAction && handleAction();
              }}
              className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all'
            >
              {type === "lecture" ? "Join Lecture" : "Submit Assessment"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
