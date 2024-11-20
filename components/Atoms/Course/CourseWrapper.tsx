
import { TCourseModalFormData } from "@/components/utils/types";
import Cookies from "js-cookie";
import { editItem } from "@/components/utils/course";
import { TChapter, TCourse, TLesson, TSection } from "@/components/utils/types";
import { useCourseContext } from "@/contexts/CourseContext";
import { FC, ReactNode, useState } from "react";

const Wrapper: FC<{
  type: "section" | "add";
  title?: string;
  children?: ReactNode;
  onAdd?: Function;
  existingDetails?: TCourse | TChapter | TLesson | TSection;
  sectionType?: "chapter" | "lesson" | "topic";
  parentId?: string;
}> = ({
  type,
  title,
  children,
  onAdd,
  existingDetails,
  sectionType,
  parentId,
}) => {
  const { dispatch, openModal, setModalRequestState } = useCourseContext();
  const [hideChildren, setHideChildren] = useState(true);
  const initialFormData: TCourseModalFormData = {
    _id: existingDetails?._id || "",
    title: existingDetails?.title || "",
    description: existingDetails?.description || "",
    ...(sectionType === "lesson" ? { chapterId: parentId || "" } : {}),
  };

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

  const userRole = Cookies.get("role");

  return (
    <div
      className="w-full rounded border border-[#1E1E1E26] p-3"
      {...(type === "add" && onAdd ? { onClick: () => onAdd() } : {})}
    >
      {/* CLICKABLE SECTION */}
      <div
        className="flex  w-full justify-between items-center cursor-pointer"
        {...(type !== "add"
          ? { onClick: () => setHideChildren((prev) => !prev) }
          : {})}
      >
        <div className="flex gap-4 items-center justify-start">
          {/* ADD ICON */}
          {type == "add" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z"
                fill="#1E1E1E"
              />
            </svg>
          )}
          {/* EDIT ICON - CHAPTER, LESSON, OR TITLE */}
          {type == "section" && userRole === "Teacher" && (
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition hover:scale-125 cursor-pointer"
              onClick={handleOpenModal}
            >
              <path
                d="M1.66667 13.8333H2.85417L11 5.6875L9.8125 4.5L1.66667 12.6458V13.8333ZM0 15.5V11.9583L11 0.979167C11.1667 0.826389 11.3508 0.708333 11.5525 0.625C11.7542 0.541667 11.9658 0.5 12.1875 0.5C12.4097 0.5 12.625 0.541667 12.8333 0.625C13.0417 0.708333 13.2222 0.833333 13.375 1L14.5208 2.16667C14.6875 2.31944 14.8092 2.5 14.8858 2.70833C14.9625 2.91667 15.0006 3.125 15 3.33333C15 3.55556 14.9617 3.7675 14.885 3.96917C14.8083 4.17083 14.6869 4.35472 14.5208 4.52083L3.54167 15.5H0ZM10.3958 5.10417L9.8125 4.5L11 5.6875L10.3958 5.10417Z"
                fill="#32A8C4"
              />
            </svg>
          )}
          {type == "add" ? children : title}
        </div>
        {/* CARAT ICON */}
        {type == "section" && (
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            className={`transition ${
              hideChildren ? "rotate-0" : "rotate-90"
            } px-2 box-content`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.860667 1.67665L2.0985 0.439988L8.84067 7.17982C8.94935 7.28782 9.0356 7.41624 9.09445 7.5577C9.15331 7.69916 9.18361 7.85086 9.18361 8.00407C9.18361 8.15729 9.15331 8.30899 9.09445 8.45044C9.0356 8.5919 8.94935 8.72033 8.84067 8.82832L2.0985 15.5717L0.861834 14.335L7.18983 8.00582L0.860667 1.67665Z"
              fill="#1E1E1E"
              fill-opacity="0.8"
            />
          </svg>
        )}
      </div>
      {/* CHAPTER, LESSON CHILDREN, E.G. CHAPTER LESSONS, LESSON TOPICS */}
      {type == "section" && !hideChildren && (
        <div className="mt-3 flex flex-col gap-4">{children}</div>
      )}
    </div>
  );
};

export default Wrapper;
