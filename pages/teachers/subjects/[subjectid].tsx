import React, { FC, ReactNode, useEffect, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import {
  TChapter,
  TCourse,
  TFetchState,
  TLesson,
  TResponse,
  TSection,
} from "@/components/utils/types";
import { baseUrl } from "@/components/utils/baseURL";
import { useRouter } from "next/router";
import { useRouter as useNavRouter } from "next/navigation";
import CourseModal, {
  TCourseModalFormData,
} from "@/components/Molecules/Modal/CourseModal";
import Tab, { TTabBody } from "@/components/Molecules/Tab/Tab";
import Cookies from "js-cookie";
import { useCourseContext, TCourseDispatch } from "@/contexts/CourseContext";
import Loader from "@/components/Atoms/Loader";
import NotFoundError from "@/components/Atoms/NotFoundError";
import { AnimatePresence, motion, Variants } from "framer";
import Video from "next-video";

const demoNotes = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tellus lacus, dignissim commodo dictum aliquam, maximus nec mauris. Phasellus sed nisl dignissim erat eleifend congue. Nullam ultricies est a tempus varius. Phasellus vitae massa rutrum, elementum urna sed, volutpat urna. Nam at nulla dui. Suspendisse aliquet metus purus, eget ultrices tellus pharetra eget. Proin dictum urna non aliquet pellentesque. Nunc dapibus gravida justo eu finibus.
<br />
<br />
Duis dapibus purus tristique eros rutrum placerat. Sed et congue augue. Vivamus hendrerit quam vel justo rutrum hendrerit sed a enim. Curabitur a placerat mauris, eu efficitur turpis. Suspendisse tempus, dolor et imperdiet imperdiet, neque nibh mollis dolor, sed laoreet ex lacus id dolor. Aliquam pellentesque nunc ac feugiat tempus. Nulla blandit magna non nulla luctus sollicitudin. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos`;

/**
 * * Function responsible for editing/delite a new chapter/lesson/topic - Making the API request to the endpoint required to edit/delete any of the items
 * @returns void
 */
const editItem = async (
  type: "chapter" | "lesson" | "topic",
  setEditItemRes: React.Dispatch<
    React.SetStateAction<TFetchState<TCourseModalFormData | undefined>>
  >,
  reqData: TCourseModalFormData,
  dispatch: TCourseDispatch,
  method: "PUT" | "DELETE"
) => {
  try {
    // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
    setEditItemRes({
      data: undefined,
      loading: true,
      error: undefined,
    });

    // * Get the access token from the cookies
    const jwt = Cookies.get("jwt");

    // * Make an API request to create this item
    const response = await fetch(
      `${baseUrl}/courses/${
        type === "chapter"
          ? "chapters"
          : type === "lesson"
          ? "lessons"
          : type === "topic"
          ? "section"
          : ""
      }/${reqData._id}`,
      {
        method: method || "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt || "",
        },
        body: JSON.stringify({
          ...reqData,
        }),
      }
    );

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (response.status == 400) {
        const data =
          method === "PUT"
            ? ((await response.json()) as TResponse<TCourse>)
            : { message: undefined };
        setEditItemRes({
          data: undefined,
          loading: false,
          error: data.message,
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setEditItemRes({
        data: undefined,
        loading: false,
        error: `An error occurred while editing the ${type}`,
      });

      console.error("Returned false");
      return false;
    }

    // * Update the existing data with that returned by the API request
    const responseData =
      method === "PUT"
        ? ((await response.json()) as TResponse<TCourseModalFormData>)
        : method === "DELETE"
        ? { data: reqData }
        : { data: undefined };
    setEditItemRes({
      data: responseData.data,
      loading: false,
      error: undefined,
    });

    console.log("Edit data response", responseData, method);

    // * Edit/Delete an existing item (chapter/lesson/topic) with the details of the updated/deleted item to the Course reducer
    dispatch({
      type:
        method === "PUT"
          ? type === "chapter"
            ? "EDIT_CHAPTER"
            : type === "lesson"
            ? "EDIT_LESSON"
            : type === "topic"
            ? "EDIT_TOPIC"
            : "EDIT_CHAPTER"
          : method === "DELETE"
          ? type === "chapter"
            ? "DELETE_CHAPTER"
            : type === "lesson"
            ? "DELETE_LESSON"
            : type === "topic"
            ? "DELETE_TOPIC"
            : "DELETE_CHAPTER"
          : "EDIT_CHAPTER",
      payload: {
        title: responseData.data?.title,
        description: responseData.data?.description,
        _id: responseData.data?._id,
        parentId:
          method === "PUT"
            ? type === "lesson"
              ? responseData.data?.chapterId
              : type === "topic"
              ? responseData.data?.lessonId
              : ""
            : method === "DELETE"
            ? type === "lesson"
              ? reqData?.chapterId
              : type === "topic"
              ? reqData?.lessonId
              : ""
            : "",
      },
    });
    console.log("Adding " + type);

    return true;
  } catch (error) {
    console.error(error);
    setEditItemRes({
      data: undefined,
      loading: false,
      error: "An error occured",
    });

    return false;
  }
};

const TopicVideo: FC<{ url?: string }> = ({ url }) => {
  return (
    <div className="rounded-2xl overflow-hidden max-w-screen-lg">
      <Video
        src={
          url ||
          "https://videos.pexels.com/video-files/9559153/9559153-uhd_2732_1440_25fps.mp4"
        }
        accentColor="#02E7F5"
        primaryColor="#FFFFFF"
        controls={true}
        className="max-w-screen-lg"
        autoPlay
      />
    </div>
  );
};

const TopicDetails: FC<{ course: TCourse }> = ({ course }) => {
  const router = useRouter();
  const { topic } = router.query;
  const [topicDetails, setTopicDetails] = useState<{
    path: [string, string, string];
    topic: TSection;
  }>();

  const tabBody: TTabBody[] = [
    {
      slug: "video",
      content: (
        <TopicVideo
          url={
            topicDetails?.topic?.topicVideo ||
            topicDetails?.topic?.youtubeVideo ||
            ""
          }
        />
      ),
    },
    {
      slug: "notes",
      content: (
        <div
          className="max-h-[80vh] overflow-y-auto rounded-sm px-2"
          dangerouslySetInnerHTML={{
            __html: topicDetails?.topic.topicNote || demoNotes,
          }}
        ></div>
      ),
    },
  ];

  /**
   * * Function responsible for returning the details of the topic to be displayed
   */
  const getTopic = () => {
    // * Loop through each chapter in the course
    for (const chapter of course.chapters) {
      // * Loop through each lesson in each chapter
      for (const lesson of chapter.lessons) {
        // * Search for the topic with the id passed in the query in the list of topics under the current lesson
        const section = lesson.sections.find(
          (section) => section._id === topic
        );

        // * If the topic was found, update the topic details state and break the loop
        if (section) {
          setTopicDetails({
            path: [chapter.title, lesson.title, section?.title],
            topic: section,
          });
          break;
        }
      }
    }
  };

  useEffect(() => {
    getTopic();
  }, [router.asPath]);

  return (
    <>
      {topicDetails ? (
        <div className="flex flex-col w-full gap-4">
          {/* BREADCRUMB */}
          <div className="font-thin flex gap-1 w-full">
            {topicDetails.path.map((crumb, i) => (
              <span key={i}>
                {crumb} {i != topicDetails.path.length - 1 ? "/" : ""}
              </span>
            ))}
          </div>
          {/* TITLE */}
          <div className="text-3xl font-bold">{topicDetails.topic.title}</div>
          {/* TAB */}
          <Tab
            slugs={[
              { name: "topic video", key: "video" },
              { name: "topic notes", key: "notes" },
            ]}
            body={tabBody}
          />
        </div>
      ) : (
        <>
          <NotFoundError msg={"No topic found"} />
        </>
      )}
    </>
  );
};

const Chapter: FC<{
  chapter: TChapter;
}> = ({ chapter }) => {
  return (
    <>
      <Wrapper
        type="section"
        title={chapter.title}
        existingDetails={chapter}
        sectionType="chapter"
      >
        {chapter.lessons.map((lesson) => (
          <>
            <Lesson lesson={lesson} chapterId={chapter._id || ""} />
          </>
        ))}
        <Add type="lesson" parentId={chapter._id || ""} />
      </Wrapper>
    </>
  );
};

const Lesson: FC<{
  lesson: TLesson;
  chapterId: string;
}> = ({ lesson, chapterId }) => {
  return (
    <>
      <Wrapper
        type="section"
        title={lesson.title}
        existingDetails={lesson}
        sectionType="lesson"
        parentId={chapterId}
      >
        {lesson.sections.map((section) => (
          <>
            <Topic topic={section} lessonId={lesson._id || ""} />
          </>
        ))}
        <Add type="topic" parentId={lesson._id || ""} />
      </Wrapper>
    </>
  );
};

const Topic: FC<{ topic: TSection; lessonId: string }> = ({
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
          {type == "section" && (
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

const Add: FC<{
  type: "chapter" | "lesson" | "topic";
  parentId: string;
}> = ({ type, parentId }) => {
  const { dispatch, openModal, setModalRequestState } = useCourseContext();

  /**
   * * Function responsible for creating a new chapter/lesson/topic - Making the API request to the endpoint required to create any of the items
   * @returns void
   */
  const createNew = async (formState: TCourseModalFormData) => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setModalRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      const jwt = Cookies.get("jwt");

      // * Make an API request to create this item
      const response = await fetch(
        `${baseUrl}/courses/${
          type === "chapter"
            ? "chapters"
            : type === "lesson"
            ? "lessons"
            : type === "topic"
            ? "section"
            : ""
        }/${parentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: jwt || "",
          },
          body: JSON.stringify({
            ...formState,
          }),
        }
      );

      // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
      if (!response.ok) {
        // * If it's a 400 error, display message that the input details are incomplete
        if (response.status == 400) {
          const data = (await response.json()) as TResponse<any>;
          setModalRequestState({
            data: undefined,
            loading: false,
            error: data.message,
          });
          return false;
        }

        // * If it's any other error code, display default error msg
        setModalRequestState({
          data: undefined,
          loading: false,
          error: `An error occurred while creating the ${type}`,
        });

        console.error("Returned false");
        return false;
      }

      // * Update the existing data with that returned by the API request
      const responseData = (await response.json()) as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      // * Add a new item (chapter/lesson/topic) with the details of the newly created item to the Course reducer
      dispatch({
        type:
          type === "chapter"
            ? "CREATE_CHAPTER"
            : type === "lesson"
            ? "CREATE_LESSON"
            : type === "topic"
            ? "CREATE_TOPIC"
            : "CREATE_CHAPTER",
        payload: {
          parentId: parentId,
          title: responseData.data.title,
          description: responseData.data.description,
          _id: responseData.data._id,
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      setModalRequestState({
        data: undefined,
        loading: false,
        error: "An error occured",
      });
      return false;
    }
  };

  /**
   * * Function responsible for opening the modal
   */
  const onAdd = () => {
    openModal({
      modalMetadata: {
        formData: {
          title: "",
          description: "",
        },
        mode: "create",
        type: type,
        handleAction: createNew,
      },
    });
  };

  return (
    <>
      <Wrapper type="add" onAdd={onAdd}>
        Add new {type}
      </Wrapper>
    </>
  );
};

const SideBar: FC<{
  courseId: string;
}> = ({ courseId }) => {
  const {
    course: { data: course },
  } = useCourseContext();

  return (
    <div className="gap-4 flex w-80 flex-col max-h-[85vh] overflow-y-auto rounded-sm px-2 ">
      {course?.chapters.map((chapter) => (
        <>
          <Chapter chapter={chapter} key={chapter._id} />
        </>
      ))}
      <Add type="chapter" parentId={courseId} />
    </div>
  );
};

const MobileSideBar: FC<{ subjectid: string }> = ({ subjectid }) => {
  const variants: Variants = {
    start: {
      x: -1000,
    },
    finish: {
      x: 0,
    },
  };

  return (
    <motion.div
      className="flex-none xl:hidden block absolute z-50 p-4 box-content bg-white w-max h-full top-0 left-0"
      initial="start"
      animate="finish"
      exit="start"
      variants={variants}
      transition={{ type: "tween" }}
    >
      <SideBar courseId={subjectid} />
    </motion.div>
  );
};

const Subject = () => {
  const router = useRouter();
  const { subjectid } = router.query;
  const [showSideBar, setShowSideBar] = useState(false);

  const {
    course,
    dispatch,
    modal,
    closeModal,
    modalFormState,
    setModalFormState,
    modalRequestState,
    modalMetadata: { type, mode, handleAction, handleDelete },
  } = useCourseContext();

  /**
   * * Function responsible from retrieving the course with the ID passed
   * @param id The id of the course to be retrieved
   * @returns void
   */
  const getCourse = async (id: string) => {
    try {
      // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
      dispatch({
        type: "FETCHING_COURSE",
      });

      // * Get the access token from the cookies
      const jwt = Cookies.get("jwt");

      // * Make an API request to retrieve the list of courses created by this teacher
      const response = await fetch(`${baseUrl}/courses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt || "",
        },
      });

      // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
      if (!response.ok) {
        // * If it's a 404 error, display message that courses couldn't be found
        if (response.status == 404) {
          const data = (await response.json()) as TResponse<TCourse>;
          dispatch({
            type: "ERROR_FETCHING_COURSE",
            payload: { status: 404, message: data.message },
          });
          return;
        }

        // * If it's any other error code, display default error msg
        dispatch({
          type: "ERROR_FETCHING_COURSE",
          payload: {
            status: response.status,
            message: "An error occurred while retrieving courses",
          },
        });
        return;
      }

      // * Display the list of courses returned by the endpoint
      const responseData = (await response.json()) as TResponse<TCourse[]>;
      dispatch({ type: "ADD_COURSE", payload: responseData.data });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "ERROR_FETCHING_COURSE",
        payload: {
          status: 500,
          message: "An error occurred while retrieving courses",
        },
      });
    }
  };

  /**
   * * Function responsible for closing the modal and clearing the form state
   */
  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (subjectid) getCourse((subjectid as string) || "nil");
  }, [subjectid]);

  return (
    <>
      {modal.open && (
        <>
          <CourseModal
            formState={modalFormState || ({} as any)}
            setFormState={setModalFormState || ((() => {}) as any)}
            type={type || "chapter"}
            handleModalClose={handleCloseModal}
            modalOpen={true}
            mode={mode || "create"}
            handleAction={handleAction || ((() => {}) as any)}
            handleDelete={handleDelete || ((() => {}) as any)}
            requestState={modalRequestState}
          />
        </>
      )}

      <TeachersWrapper title="Subjects" metaTitle="Olive Groove ~ Subjects">
        <div className="space-y-5 h-fit">
          {course.loading ? (
            <Loader />
          ) : course.error ? (
            <div className="w-full h-full flex items-center justify-center">
              {typeof course.error === "object" &&
              course.error.status === 404 ? (
                <>
                  <NotFoundError msg={course.error.message} />
                </>
              ) : (
                course.error.toString()
              )}
            </div>
          ) : course.data ? (
            <>
              {/* Title */}
              <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-2xl font-medium text-dark font-roboto">
                    {course.data?.title || "Loading..."}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  {/* HAMBURGER ICON TO DISPLAY/HIDE SIDEBAR IN MOBILE VIEW */}
                  <div
                    className="rounded-full xl:hidden flex items-center justify-center p-2 border border-primary cursor-pointer transition hover:scale-110"
                    onClick={() => setShowSideBar((prev) => !prev)}
                  >
                    <i
                      className={`fa fa-${
                        showSideBar ? "xmark" : "bars"
                      } text-primary`}
                    ></i>
                  </div>
                  <Button width="fit" size="xs" color="outline">
                    <svg
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.66667 13.8333H2.85417L11 5.6875L9.8125 4.5L1.66667 12.6458V13.8333ZM0 15.5V11.9583L11 0.979167C11.1667 0.826389 11.3508 0.708333 11.5525 0.625C11.7542 0.541667 11.9658 0.5 12.1875 0.5C12.4097 0.5 12.625 0.541667 12.8333 0.625C13.0417 0.708333 13.2222 0.833333 13.375 1L14.5208 2.16667C14.6875 2.31944 14.8092 2.5 14.8858 2.70833C14.9625 2.91667 15.0006 3.125 15 3.33333C15 3.55556 14.9617 3.7675 14.885 3.96917C14.8083 4.17083 14.6869 4.35472 14.5208 4.52083L3.54167 15.5H0ZM10.3958 5.10417L9.8125 4.5L11 5.6875L10.3958 5.10417Z"
                        fill="#1E1E1E"
                      />
                    </svg>

                    <span>Edit Course</span>
                  </Button>
                  <Button width="fit" size="xs" color="blue">
                    <svg
                      width="17"
                      height="14"
                      viewBox="0 0 17 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.33334 3.875V1.33333C9.33334 1.11232 9.42113 0.900358 9.57741 0.744078C9.73369 0.587797 9.94566 0.5 10.1667 0.5C10.3853 0.500921 10.5948 0.587713 10.75 0.741667L16.5833 6.575C16.6614 6.65247 16.7234 6.74464 16.7657 6.84619C16.8081 6.94774 16.8298 7.05666 16.8298 7.16667C16.8298 7.27668 16.8081 7.3856 16.7657 7.48715C16.7234 7.5887 16.6614 7.68086 16.5833 7.75833L10.75 13.5917C10.633 13.7063 10.4848 13.784 10.324 13.8149C10.1631 13.8458 9.99667 13.8286 9.84551 13.7655C9.69434 13.7024 9.56514 13.5961 9.47405 13.4599C9.38296 13.3238 9.33401 13.1638 9.33334 13V10.4167H8.625C7.3084 10.397 6.0033 10.6641 4.80028 11.1995C3.59726 11.7348 2.52514 12.5255 1.65834 13.5167C1.55388 13.6557 1.40852 13.7586 1.24264 13.8109C1.07676 13.8632 0.898673 13.8623 0.733335 13.8083C0.565081 13.7516 0.419363 13.6425 0.317429 13.4971C0.215494 13.3517 0.162674 13.1775 0.16667 13C0.16667 5.4 6.9 4.1 9.33334 3.875ZM8.625 8.73333C9.18235 8.73225 9.73915 8.76844 10.2917 8.84167C10.489 8.8716 10.6689 8.97132 10.7989 9.12272C10.9289 9.27411 11.0003 9.46713 11 9.66667V10.9917L14.8167 7.16667L11 3.34167V4.66667C11 4.88768 10.9122 5.09964 10.7559 5.25592C10.5996 5.4122 10.3877 5.5 10.1667 5.5C9.40834 5.5 3.40834 5.66667 2.10834 10.8583C3.99526 9.46713 6.28069 8.72188 8.625 8.73333Z"
                        fill="white"
                      />
                    </svg>

                    <span>Share Course</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-stretch gap-4 relative">
                {/* SIDEBAR */}
                <div className="flex-none hidden xl:block">
                  <SideBar courseId={(subjectid as string) || ""} />
                </div>
                {/* MOBILE SIDEBAR */}
                <AnimatePresence>
                  {showSideBar && (
                    <MobileSideBar
                      subjectid={(subjectid as string) || ""}
                    ></MobileSideBar>
                  )}
                </AnimatePresence>
                {/* COURSE */}
                <div className="flex-1">
                  <TopicDetails course={course.data} />
                </div>
              </div>
            </>
          ) : (
            <>Nothing...</>
          )}
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Subject);
