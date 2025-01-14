import { TCourseModalFormData } from '@/components/utils/types';
import { useRouter as useNavRouter } from 'next/navigation';
import { editItem } from '@/components/utils/course';
import { TChapter, TCourse, TLesson, TSection } from '@/components/utils/types';
import { useCourseContext } from '@/contexts/CourseContext';

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import AddItemSVG from './AddItemSVG';
import { useTopicContext } from '@/contexts/TopicContext';
import { useAuth } from '@/contexts/AuthContext';
import SidebarEditModal from '@/components/Molecules/Modal/SidebarEditModal';
import CourseDeleteModal from '@/components/Molecules/Modal/CourseDeleteModal';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { tooltip_variants } from './CourseTopic';
import { useRouter } from 'next/router';

const Wrapper: FC<{
  type: 'section' | 'add';
  title?: string;
  children?: ReactNode;
  isCurrentLesson?: boolean;
  onAdd?: Function;
  existingDetails?: TCourse | TChapter | TLesson | TSection;
  sectionType?: 'chapter' | 'lesson' | 'topic';
  sectionId?: string;
  parentId?: string;
}> = ({
  type,
  title,
  children,
  onAdd,
  isCurrentLesson,
  existingDetails,
  sectionType,
  sectionId,
  parentId,
}) => {
  const navRouter = useNavRouter();
  const router = useRouter();
  const { dispatch, openModal, setModalRequestState } = useCourseContext();
  const { topicDetails } = useTopicContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [hideChildren, setHideChildren] = useState(true);
  const [display_tooltip, setDisplayTooltip] = useState(false);
  const title_ref = useRef<HTMLDivElement>(null);
  const initialFormData: TCourseModalFormData = {
    _id: existingDetails?._id || '',
    title: existingDetails?.title || '',
    description: existingDetails?.description || '',
    availableDate: existingDetails?.availableDate || '',
    topicNote: existingDetails?.topicNote || '',
    isActive: existingDetails?.isActive || false,
    ...(sectionType === 'lesson' ? { chapterId: parentId || '' } : {}),
  };

  const tooltipHover: (
    this: HTMLDivElement,
    ev: HTMLElementEventMap['mouseover']
  ) => any = () => {
    setDisplayTooltip(true);
  };
  const tooltipHoverOut: (
    this: HTMLDivElement,
    ev: HTMLElementEventMap['mouseout']
  ) => any = () => {
    setDisplayTooltip(false);
  };

  useEffect(() => {
    title_ref.current?.addEventListener('mouseover', tooltipHover);
    title_ref.current?.addEventListener('mouseout', tooltipHoverOut);

    return () => {
      title_ref.current?.removeEventListener('mouseover', tooltipHover);
      title_ref.current?.removeEventListener('mouseout', tooltipHoverOut);
    };
  }, []);

  const { user } = useAuth();
  const userRole = user?.role;

  const handleDelete = (formState: TCourseModalFormData) =>
    editItem(
      sectionType || 'chapter',
      setModalRequestState,
      formState || { title: '' },
      dispatch,
      'DELETE'
    );

  /**
   * * Function responsible for opening the modal
   */
  const handleOpenModal = () => {
    openModal({
      modalMetadata: {
        formData: initialFormData,
        mode: 'edit',
        type: sectionType,
        handleAction: (formState) =>
          editItem(
            sectionType || 'chapter',
            setModalRequestState,
            formState,
            dispatch,
            'PUT'
          ),
      },
    });
  };

  /**
   * * Function responsible for automatically displaying or hiding the children based on the current topic/lesson
   */
  const toggleChildren = useCallback(() => {
    if (sectionType === 'chapter' && topicDetails.topicChapter === sectionId)
      setHideChildren(false);
    if (sectionType === 'lesson' && topicDetails.topicLesson === sectionId)
      setHideChildren(false);
  }, [
    sectionId,
    sectionType,
    topicDetails.topicChapter,
    topicDetails.topicLesson,
  ]);

  useEffect(() => {
    toggleChildren();
  }, [toggleChildren]);

  return (
    <div
      className={`w-full rounded-xl ${
        sectionType === 'topic'
          ? 'pl-4 py-4'
          : type === 'add'
          ? 'p-3 pl-4'
          : 'p-4 pl-6'
      }  ${
        isCurrentLesson
          ? 'bg-[#32A8C4] bg-opacity-[5%]'
          : 'border border-[#1E1E1E26]'
      }`}
      {...(type === 'add' && onAdd ? { onClick: () => onAdd() } : {})}
    >
      {/* CLICKABLE SECTION */}
      <div
        className='flex  w-full justify-between items-center cursor-pointer'
        {...(type !== 'add'
          ? {
              onClick: () => {
                navRouter.push(
                  `/${
                    user?.role === 'Student'
                      ? 'students/lectures'
                      : 'teachers/courses'
                  }/${
                    router.query.courseId ?? router.query.courseId
                  }/?topic=${sectionId}`
                );
                setHideChildren((prev) => !prev);
              },
            }
          : {})}
      >
        <div
          className={`flex ${
            type === 'add' ? 'gap-1' : 'gap-4'
          } items-center justify-start text-subtext`}
        >
          {/* ADD ICON */}
          {type == 'add' && <AddItemSVG />}
          {/* EDIT ICON - CHAPTER, LESSON, OR TITLE */}
          {type == 'section' && (
            <div className='relative flex gap-2 items-center'>
              {userRole === 'Teacher' && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setModalOpen(!modalOpen);
                      console.log('click detecetd');
                    }}
                    className='z-50 '
                  >
                    <svg
                      width='4'
                      height='15'
                      viewBox='0 0 4 15'
                      className=''
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M1.99967 0C1.08301 0 0.333008 0.75 0.333008 1.66667C0.333008 2.58333 1.08301 3.33333 1.99967 3.33333C2.91634 3.33333 3.66634 2.58333 3.66634 1.66667C3.66634 0.75 2.91634 0 1.99967 0ZM1.99967 11.6667C1.08301 11.6667 0.333008 12.4167 0.333008 13.3333C0.333008 14.25 1.08301 15 1.99967 15C2.91634 15 3.66634 14.25 3.66634 13.3333C3.66634 12.4167 2.91634 11.6667 1.99967 11.6667ZM1.99967 5.83333C1.08301 5.83333 0.333008 6.58333 0.333008 7.5C0.333008 8.41667 1.08301 9.16667 1.99967 9.16667C2.91634 9.16667 3.66634 8.41667 3.66634 7.5C3.66634 6.58333 2.91634 5.83333 1.99967 5.83333Z'
                        fill='#1E1E1E'
                        fill-opacity='0.6'
                      />
                    </svg>
                  </button>
                  <SidebarEditModal
                    openEditModal={handleOpenModal}
                    deleteAction={() => handleDelete(initialFormData)}
                    handleModalClose={() => setModalOpen(false)}
                    modalOpen={modalOpen}
                  />
                </>
              )}
              <span ref={title_ref} className='pt-1'>
                {type == 'section' && title && title.length > 15
                  ? `${title.slice(0, 15)}...`
                  : title}
              </span>
              {title && title.length > 15 && (
                <AnimatePresence>
                  {display_tooltip && (
                    <motion.span
                      variants={tooltip_variants}
                      initial='initial'
                      animate='hover'
                      exit='initial'
                      className='absolute z-50 left-[4rem] top-6 p-1 rounded text-white bg-primary text-xs w-fit text-nowrap'
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </div>

            // <i className="fas fa-pencil"></i>
          )}

          {type == 'add' && children}
        </div>
        {/* CARAT ICON */}
        {type == 'section' && (
          <svg
            width='10'
            height='16'
            viewBox='0 0 10 16'
            fill='none'
            className={`transition ${
              hideChildren ? 'rotate-0' : 'rotate-90'
            } px-2 box-content`}
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M0.860667 1.67665L2.0985 0.439988L8.84067 7.17982C8.94935 7.28782 9.0356 7.41624 9.09445 7.5577C9.15331 7.69916 9.18361 7.85086 9.18361 8.00407C9.18361 8.15729 9.15331 8.30899 9.09445 8.45044C9.0356 8.5919 8.94935 8.72033 8.84067 8.82832L2.0985 15.5717L0.861834 14.335L7.18983 8.00582L0.860667 1.67665Z'
              fill='#1E1E1E'
              fillOpacity='0.8'
            />
          </svg>
        )}
      </div>
      {/* CHAPTER, LESSON CHILDREN, E.G. CHAPTER LESSONS, LESSON TOPICS */}

      {type == 'section' && !hideChildren && (
        <div className='mt-3 flex flex-col gap-4'>{children}</div>
      )}
    </div>
  );
};

export default Wrapper;
