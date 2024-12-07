import { TCourseModalFormData } from "@/components/utils/types";
import { editItem } from "@/components/utils/course";
import { TChapter, TCourse, TLesson, TSection } from "@/components/utils/types";
import { useCourseContext } from "@/contexts/CourseContext";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import AddItemSVG from "./AddItemSVG";
import { useTopicContext } from "@/contexts/TopicContext";
import { useAuth } from "@/contexts/AuthContext";

const Wrapper: FC<{
  type: "section" | "add";
  title?: string;
  children?: ReactNode;
  onAdd?: Function;
  existingDetails?: TCourse | TChapter | TLesson | TSection;
  sectionType?: "chapter" | "lesson" | "topic";
  sectionId?: string;
  parentId?: string;
}> = ({
  type,
  title,
  children,
  onAdd,
  existingDetails,
  sectionType,
  sectionId,
  parentId,
}) => {
  const { dispatch, openModal, setModalRequestState } = useCourseContext();
  const { topicDetails } = useTopicContext();
  const [hideChildren, setHideChildren] = useState(true);
  const initialFormData: TCourseModalFormData = {
    _id: existingDetails?._id || "",
    title: existingDetails?.title || "",
    description: existingDetails?.description || "",
    ...(sectionType === "lesson" ? { chapterId: parentId || "" } : {}),
  };
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * * Function responsible for opening the modal
   */
  const handleOpenModal = () => {
    openModal({
      modalMetadata: {
        formData: initialFormData,
        mode: "edit",
        type: sectionType,
        handleAction: (formState) =>
          editItem(
            sectionType || "chapter",
            setModalRequestState,
            formState,
            dispatch,
            "PUT"
          ),
        handleDelete: (formState) =>
          editItem(
            sectionType || "chapter",
            setModalRequestState,
            formState,
            dispatch,
            "DELETE"
          ),
      },
    });
  };

  /**
   * * Function responsible for automatically displaying or hiding the children based on the current topic/lesson
   */
  const toggleChildren = useCallback(() => {
    if (sectionType === "chapter" && topicDetails.topicChapter === sectionId)
      setHideChildren(false);
    if (sectionType === "lesson" && topicDetails.topicLesson === sectionId)
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
      className='w-full rounded border border-[#1E1E1E26] p-3'
      {...(type === "add" && onAdd ? { onClick: () => onAdd() } : {})}
    >
      {/* CLICKABLE SECTION */}
      <div
        className='flex  w-full justify-between items-center cursor-pointer'
        {...(type !== "add"
          ? { onClick: () => setHideChildren((prev) => !prev) }
          : {})}
      >
        <div className='flex gap-4 items-center justify-start'>
          {/* ADD ICON */}
          {type == "add" && <AddItemSVG />}
          {/* EDIT ICON - CHAPTER, LESSON, OR TITLE */}
          {type == "section" && userRole === "Teacher" && (
            <svg
              width='15'
              height='16'
              viewBox='0 0 15 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='transition hover:scale-125 cursor-pointer'
              onClick={handleOpenModal}
            >
              <path
                d='M1.66667 13.8333H2.85417L11 5.6875L9.8125 4.5L1.66667 12.6458V13.8333ZM0 15.5V11.9583L11 0.979167C11.1667 0.826389 11.3508 0.708333 11.5525 0.625C11.7542 0.541667 11.9658 0.5 12.1875 0.5C12.4097 0.5 12.625 0.541667 12.8333 0.625C13.0417 0.708333 13.2222 0.833333 13.375 1L14.5208 2.16667C14.6875 2.31944 14.8092 2.5 14.8858 2.70833C14.9625 2.91667 15.0006 3.125 15 3.33333C15 3.55556 14.9617 3.7675 14.885 3.96917C14.8083 4.17083 14.6869 4.35472 14.5208 4.52083L3.54167 15.5H0ZM10.3958 5.10417L9.8125 4.5L11 5.6875L10.3958 5.10417Z'
                fill='#32A8C4'
              />
            </svg>
          )}
          {type == "add" ? children : title}
        </div>
        {/* CARAT ICON */}
        {type == "section" && (
          <svg
            width='10'
            height='16'
            viewBox='0 0 10 16'
            fill='none'
            className={`transition ${
              hideChildren ? "rotate-0" : "rotate-90"
            } px-2 box-content`}
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M0.860667 1.67665L2.0985 0.439988L8.84067 7.17982C8.94935 7.28782 9.0356 7.41624 9.09445 7.5577C9.15331 7.69916 9.18361 7.85086 9.18361 8.00407C9.18361 8.15729 9.15331 8.30899 9.09445 8.45044C9.0356 8.5919 8.94935 8.72033 8.84067 8.82832L2.0985 15.5717L0.861834 14.335L7.18983 8.00582L0.860667 1.67665Z'
              fill='#1E1E1E'
              fill-opacity='0.8'
            />
          </svg>
        )}
      </div>
      {/* CHAPTER, LESSON CHILDREN, E.G. CHAPTER LESSONS, LESSON TOPICS */}
      {type == "section" && !hideChildren && (
        <div className='mt-3 flex flex-col gap-4'>{children}</div>
      )}
    </div>
  );
};

export default Wrapper;
