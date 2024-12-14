import { FC, LegacyRef, useEffect, useRef, useState } from "react";
import { TSection, TSubSection } from "../../utils/types";
import { useRouter } from "next/router";
import { useRouter as useNavRouter } from "next/navigation";
import { editItem } from "../../utils/course";
import { useCourseContext } from "@/contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion, Variants } from "framer-motion";


function CheckSvg({ isActive }: { isActive: boolean }) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path

        d='M9 0.5C4.02947 0.5 0 4.52947 0 9.5C0 14.4708 4.02947 18.5 9 18.5C13.9708 18.5 18 14.4708 18 9.5C18 4.52947 13.9708 0.5 9 0.5ZM9 17.3927C4.65778 17.3927 1.125 13.8422 1.125 9.49996C1.125 5.15775 4.65778 1.62496 9 1.62496C13.3422 1.62496 16.875 5.15776 16.875 9.49996C16.875 13.8422 13.3422 17.3927 9 17.3927ZM12.5918 6.20684L7.31136 11.5205L4.93339 9.14253C4.71373 8.92288 4.35767 8.92288 4.13773 9.14253C3.91808 9.36219 3.91808 9.71825 4.13773 9.93791L6.92183 12.7223C7.14148 12.9417 7.49754 12.9417 7.71748 12.7223C7.74279 12.697 7.76447 12.6694 7.78416 12.6407L13.3878 7.00248C13.6072 6.78283 13.6072 6.42676 13.3878 6.20684C13.1678 5.98719 12.8118 5.98719 12.5918 6.20684Z'
        fill={isActive ? '#32A8C4' : '#1E1E1E80'}
      />
    </svg>
  );
}

const tooltip_variants: Variants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

export const Topic: FC<{ topic: TSection | TSubSection; lessonId: string, type: 'section' | 'subsection'; }> = ({
  topic,
  lessonId,
}) => {

  const navRouter = useNavRouter();
  const router = useRouter();
  const isActive = router.query.topic === topic._id;
  const isViewed = topic.viewed;
  const { openModal, dispatch, setModalRequestState } = useCourseContext();
  const initialFormData: Omit<TSection<"post">, "subsections"> = {
    _id: topic?._id || "",
    title: topic?.title || "",
    topicNote: topic?.topicNote || "",

    topicVideo: topic?.topicVideo,
    youtubeVideo: topic?.youtubeVideo,
    topicImage: topic.topicImage,
    lessonId,
  };
  const { user } = useAuth();
  const title_ref = useRef<HTMLDivElement>(null);
  const [display_tooltip, setDisplayTooltip] = useState(false);

  /**
   * * Function responsible for opening the modal
   */
  const handleOpenModal = () => {
    openModal({
      modalMetadata: {
        formData: initialFormData,
        mode: 'edit',
        type: 'topic',
        handleAction: (formState) =>
          editItem('topic', setModalRequestState, formState, dispatch, 'PUT'),
        handleDelete: (formState) =>
          editItem(
            'topic',
            setModalRequestState,
            formState,
            dispatch,
            'DELETE'
          ),
      },
    });
  };

  const tooltipHover: (
    this: HTMLDivElement,
    ev: HTMLElementEventMap["mouseover"]
  ) => any = () => {
    setDisplayTooltip(true);
  };
  const tooltipHoverOut: (
    this: HTMLDivElement,
    ev: HTMLElementEventMap["mouseout"]
  ) => any = () => {
    setDisplayTooltip(false);
  };

  useEffect(() => {
    title_ref.current?.addEventListener("mouseover", tooltipHover);
    title_ref.current?.addEventListener("mouseout", tooltipHoverOut);

    return () => {
      title_ref.current?.removeEventListener("mouseover", tooltipHover);
      title_ref.current?.removeEventListener("mouseout", tooltipHoverOut);
    };
  }, []);

  return (
    <div
      ref={title_ref}
      onClick={() =>
        navRouter.push(
          `/${
            user?.role === 'Student' ? 'students/lectures' : 'teachers/subjects'
          }/${router.query.subjectid ?? router.query.subjectId}/?topic=${
            topic._id
          }`
        )
      }
      className={`flex items-center gap-4 px-3 ${
        isActive ? "text-[#1E1E1E]" : "text-subtext"
      } cursor-pointer relative`}
      // {...(topic.title.length > 18 ? { title: topic.title } : {})}

    >
      {/* Edit Icon */}
      {user?.role === 'Teacher' && (
        <>
          {/* Edit Icon */}
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
              // fill="#32A8C4"
              fill={isActive ? "#32A8C4" : "#1E1E1E80"}
            />
          </svg>
          {/* Check Icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_605_243)">
              <path
                d="M9 0C4.02947 0 0 4.02947 0 9C0 13.9708 4.02947 18 9 18C13.9708 18 18 13.9708 18 9C18 4.02947 13.9708 0 9 0ZM9 16.8927C4.65778 16.8927 1.125 13.3422 1.125 8.99996C1.125 4.65775 4.65778 1.12496 9 1.12496C13.3422 1.12496 16.875 4.65776 16.875 8.99996C16.875 13.3422 13.3422 16.8927 9 16.8927ZM12.5918 5.70684L7.31136 11.0205L4.93339 8.64253C4.71373 8.42288 4.35767 8.42288 4.13773 8.64253C3.91808 8.86219 3.91808 9.21825 4.13773 9.43791L6.92183 12.2223C7.14148 12.4417 7.49754 12.4417 7.71748 12.2223C7.74279 12.197 7.76447 12.1694 7.78416 12.1407L13.3878 6.50248C13.6072 6.28283 13.6072 5.92676 13.3878 5.70684C13.1678 5.48719 12.8118 5.48719 12.5918 5.70684Z"
                fill={isViewed ? "#32A8C4" : "#1E1E1E80"}
                fill-opacity="0.5"

              />
            </g>
            <defs>
              <clipPath id="clip0_605_243">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </>
      )}
      {user?.role === 'Student' && <CheckSvg isActive={isActive} />}

      {topic.title.length > 18 ? `${topic.title.slice(0, 18)}...` : topic.title}

      {/* Tool Tip */}
      {topic.title.length > 18 && (
        <AnimatePresence>
          {display_tooltip && (
            <motion.span
              variants={tooltip_variants}
              initial="initial"
              animate="hover"
              exit="initial"
              className="absolute left-[4rem] top-6 p-1 rounded text-white bg-primary text-xs w-fit text-nowrap"
            >
              {topic.title}
            </motion.span>
          )}
        </AnimatePresence>
      )}

    </div>
  );
};
