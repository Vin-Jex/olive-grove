import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import CourseDeleteModal from './CourseDeleteModal';
import { PlusOne } from '@mui/icons-material';
import Add from '@/components/Atoms/Course/CourseAddButton';

const SidebarEditModal: FC<{
  modalOpen: boolean;
  chapterId?: string;
  openEditModal?: () => void;
  deleteAction?: () => Promise<boolean>;
  handleModalClose: () => void;
}> = ({
  modalOpen,
  handleModalClose,
  openEditModal,
  chapterId,
  deleteAction,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div>
      <CourseDeleteModal
        handleModalClose={() => setDeleteModalOpen(false)}
        loading={loading}
        modalOpen={deleteModalOpen}
        handleConfirm={async () => {
          setLoading(true);
          try {
            deleteAction && (await deleteAction());
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }}
      />

      <Modal handleClose={handleModalClose} isOpen={modalOpen}>
        <div className=''>
          {chapterId && chapterId.length > 0 && (
            <Add type='subsection' parentId={chapterId} />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal && openEditModal();
              // openEditCourseModal();
            }}
            className='flex gap-2 hover:bg-black/10  pr-14 w-full py-2 pl-3 '
          >
            <svg
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3.33333 13.1667H4.28333L10.8 6.65L9.85 5.7L3.33333 12.2167V13.1667ZM2 14.5V11.6667L10.8 2.88333C10.9333 2.76111 11.0807 2.66667 11.242 2.6C11.4033 2.53333 11.5727 2.5 11.75 2.5C11.9278 2.5 12.1 2.53333 12.2667 2.6C12.4333 2.66667 12.5778 2.76667 12.7 2.9L13.6167 3.83333C13.75 3.95556 13.8473 4.1 13.9087 4.26667C13.97 4.43333 14.0004 4.6 14 4.76667C14 4.94444 13.9693 5.114 13.908 5.27533C13.8467 5.43667 13.7496 5.58378 13.6167 5.71667L4.83333 14.5H2ZM10.3167 6.18333L9.85 5.7L10.8 6.65L10.3167 6.18333Z'
                fill='#1E1E1E'
                fillOpacity='0.6'
              />
            </svg>
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true);
            }}
            className='flex gap-2 pr-14 hover:bg-black/10  rounded-bl-lg rounded-br-lg py-2 pl-3'
          >
            <svg
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.66602 14.5C4.29935 14.5 3.98557 14.3696 3.72468 14.1087C3.46379 13.8478 3.33313 13.5338 3.33268 13.1667V4.5H2.66602V3.16667H5.99935V2.5H9.99935V3.16667H13.3327V4.5H12.666V13.1667C12.666 13.5333 12.5356 13.8473 12.2747 14.1087C12.0138 14.37 11.6998 14.5004 11.3327 14.5H4.66602ZM11.3327 4.5H4.66602V13.1667H11.3327V4.5ZM5.99935 11.8333H7.33268V5.83333H5.99935V11.8333ZM8.66602 11.8333H9.99935V5.83333H8.66602V11.8333Z'
                fill='#1E1E1E'
                fillOpacity='0.6'
              />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SidebarEditModal;

export const Modal = ({
  isOpen,
  children,
  handleClose,
}: {
  isOpen: boolean;
  children: ReactNode;
  handleClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [handleClose, isOpen]);
  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className='transform absolute z-[1000] top-[100%] bg-white text-left shadow-xl rounded-lg transition-all'
    >
      <div>{children}</div>
    </div>
  );
};
