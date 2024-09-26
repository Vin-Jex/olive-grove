import { FC, useEffect, useState } from "react";
import Tab, { TTabBody } from "../../Molecules/Tab/Tab";
import { TCourse, TSection } from "../../utils/types";
import { useRouter } from "next/router";
import NotFoundError from "../NotFoundError";
import { useRouter as useNavRouter } from "next/navigation";
import { editItem } from "../../utils/course";
import { useCourseContext } from "@/contexts/CourseContext";



export const Topic: FC<{ topic: TSection; lessonId: string }> = ({
  topic,
  lessonId,
}) => {
  const navRouter = useNavRouter();
  const router = useRouter();
  const isActive = router.query.topic === topic._id;
  const { openModal, dispatch, setModalRequestState } = useCourseContext();
  const initialFormData: Omit<TSection, "subsections"> = {
    _id: topic?._id || "",
    title: topic?.title || "",
    topicNote: topic?.topicNote || "",
    topicVideo: topic?.topicVideo,
    youtubeVideo: topic?.youtubeVideo,
    topicImage: topic.topicImage,
    lessonId,
  };

  /**
   * * Function responsible for opening the modal
   */
  const handleOpenModal = () => {
    openModal({
      modalMetadata: {
        formData: initialFormData,
        mode: "edit",
        type: "topic",
        handleAction: (formState) =>
          editItem("topic", setModalRequestState, formState, dispatch, "PUT"),
        handleDelete: (formState) =>
          editItem(
            "topic",
            setModalRequestState,
            formState,
            dispatch,
            "DELETE"
          ),
      },
    });
  };

  return (
    <div
      onClick={() =>
        navRouter.push(
          `/teachers/subjects/${router.query.subjectid}/?topic=${topic._id}`
        )
      }
      className={`flex items-center gap-4 px-3 ${
        isActive ? "text-primary" : "text-[#1E1E1E80]"
      } cursor-pointer`}
    >
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

      {topic.title}
    </div>
  );
};
