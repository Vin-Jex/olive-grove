import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "@/components/Atoms/Button";

export default function VerificationModal({
  modalOpen,
  handleModalClose,
}: {
  modalOpen: boolean;
  handleModalClose: () => void;
}) {
  return (
    <div>
      <Modal isOpen={modalOpen}>
        <div className='flex flex-col items-center justify-center text-center font-roboto py-5 px-4 md:px-6 space-y-6 w-full'>
          <svg
            width='80'
            height='80'
            viewBox='0 0 110 110'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              width='110'
              height='110'
              rx='55'
              fill='#FF3B3B'
              fillOpacity='0.2'
            />
            <path
              d='M54.9989 31.6992V62.7668M55.193 78.3006V78.689H54.8047V78.3006H55.193Z'
              stroke='#FF3B3B'
              strokeWidth='6'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <div className='flex flex-col space-y-1 w-[95%]'>
            <h2 className='text-xl font-semibold text-dark'>
              You can&apos;t access this page.
            </h2>
            <span className='text-sm text-subtext'>
              You need to verify your account to be able to access this page.
            </span>
          </div>
          <Button
            size='xs'
            onClick={() => {
              handleModalClose();
            }}
          >
            Verify
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export const Modal = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm z-[1000000]'>
      <div className='fixed inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-full text-center'>
          <div className='max-w-md'>
            <div className='transform bg-white p-8 px-12 text-left shadow-xl transition-all rounded-3xl'>
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
