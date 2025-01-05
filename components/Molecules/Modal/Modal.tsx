import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  type?: 'verify_email';
  onClose: () => void;
  children: React.ReactNode;
  
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  children,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && type !== 'verify_email') {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, type]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-[60] w-full h-full'
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/[0.7] backdrop-blur-sm transition-opacity duration-300 ease-in-out'
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      ></div>

      {/* Modal content */}
      <div
        ref={modalRef}
        className={`relative max-w-2xl w-full bg-white shadow-lg rounded-lg transform transition-transform duration-300 ease-out max-h-[90vh] overflow-auto ${className}`}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-[1.3rem] right-4 text-gray-500 hover:text-gray-700 focus:outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        <div>{children}</div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;
