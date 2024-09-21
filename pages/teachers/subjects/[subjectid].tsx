import React, {
  FC,
  ReactNode,
  Reducer,
  ReducerWithoutAction,
  useEffect,
  useReducer,
  useState,
} from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import Img from "@/public/image/student3.png";
import Button from "@/components/Atoms/Button";
import Select from "@/components/Atoms/Select";
import dummy_subject_img from "../../images/olive-groove-subject.png";
import {
  TChapter,
  TCourse,
  TFetchState,
  THandleSearchChange,
  TLesson,
  TResponse,
  TSection,
  TSubject,
  TSubSection,
} from "@/components/utils/types";
import Image from "next/image";
import CreateClassModal from "@/components/Molecules/Modal/CreateClassModal";
import { baseUrl } from "@/components/utils/baseURL";
import { useRouter } from "next/router";
import CourseModal from "@/components/Molecules/Modal/CourseModal";

type courseReducerActionTypes =
  | "FETCHING_COURSE"
  | "ERROR_FETCHING_COURSE"
  | "ADD_COURSE"
  | "CREATE_CHAPTER"
  | "CREATE_LESSON"
  | "CREATE_TOPIC";

type CourseDispatcher = React.Dispatch<{
  type: courseReducerActionTypes;
  payload?: any;
}>;

const courseReducer: Reducer<
  TFetchState<TCourse | undefined>,
  { type: courseReducerActionTypes; payload?: any }
> = (state, action) => {
  if (action.type === "ADD_COURSE") {
    return {
      data: action.payload,
      loading: false,
      error: false,
    };
  }

  if (action.type === "FETCHING_COURSE") {
    return {
      data: undefined,
      loading: true,
      error: false,
    };
  }

  if (action.type === "ERROR_FETCHING_COURSE") {
    return {
      data: undefined,
      loading: false,
      error: action.payload,
    };
  }

  if (action.type === "CREATE_CHAPTER") {
    const modifiedCourse = { ...(state.data || {}) };
    modifiedCourse.chapters?.push({
      _id: action.payload._id || "",
      title: action.payload?.title || "",
      lessons: [],
    });

    return {
      data: modifiedCourse,
      loading: false,
      error: false,
    };
  }

  if (action.type === "CREATE_LESSON") {
    const modifiedCourse = { ...(state.data || {}) };
    const chapterToUpdate = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload.parentId
    );
    chapterToUpdate?.lessons.push({
      _id: action.payload._id || "",
      title: action.payload?.title || "",
      sections: [],
    });

    return {
      data: modifiedCourse,
      loading: false,
      error: false,
    };
  }

  if (action.type === "CREATE_TOPIC") {
    const modifiedCourse = { ...(state.data || {}) };
    const chapterToUpdate = modifiedCourse.chapters?.find(
      (chapter) => chapter._id === action.payload.parentId
    );
    chapterToUpdate?.lessons.push({
      _id: action.payload._id || "",
      title: action.payload?.title || "",
      sections: [],
    });

    return {
      data: modifiedCourse,
      loading: false,
      error: false,
    };
  }

  return { data: state.data, loading: false, error: false };
};

const Course: FC<{ course: TCourse }> = ({ course }) => {
  return <div>Course - {course.title}</div>;
};

const Chapter: FC<{
  chapter: TChapter;
  dispatch: CourseDispatcher;
}> = ({ chapter, dispatch }) => {
  return (
    <>
      <Wrapper type="section" title={chapter.title}>
        {chapter.lessons.map((lesson) => (
          <>
            <Lesson lesson={lesson} dispatch={dispatch} />
          </>
        ))}
        <Add type="lesson" dispatch={dispatch} parentId={chapter._id} />
      </Wrapper>
    </>
  );
};

const Lesson: FC<{
  lesson: TLesson;
  dispatch: CourseDispatcher;
}> = ({ lesson, dispatch }) => {
  return (
    <>
      <Wrapper type="section" title={lesson.title}>
        {lesson.sections.map((section) => (
          <>
            <Topic topic={section} />
          </>
        ))}
        <Add type="topic" dispatch={dispatch} parentId={lesson._id} />
      </Wrapper>
    </>
  );
};

const Topic: FC<{ topic: TSection }> = ({ topic }) => {
  return <div>{topic.title}</div>;
};

const Wrapper: FC<{
  type: "section" | "add";
  title?: string;
  children?: ReactNode;
  onAdd?: Function;
}> = ({ type, title, children, onAdd }) => {
  const [hideChildren, setHideChildren] = useState(true);

  return (
    <div className="w-full rounded border border-light-dark p-3">
      <div
        className="flex  w-full justify-between items-center cursor-pointer"
        {...(type === "add"
          ? onAdd
            ? { onClick: () => onAdd() }
            : {}
          : { onClick: () => setHideChildren((prev) => !prev) })}
      >
        <div className="flex gap-4 items-center justify-start">
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

          {type == "section" && (
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.83333 15.5C2.37499 15.5 1.98249 15.3367 1.65583 15.01C1.32916 14.6833 1.16611 14.2911 1.16666 13.8333V3H0.333328V1.33333H4.49999V0.5H9.49999V1.33333H13.6667V3H12.8333V13.8333C12.8333 14.2917 12.67 14.6842 12.3433 15.0108C12.0167 15.3375 11.6244 15.5006 11.1667 15.5H2.83333ZM11.1667 3H2.83333V13.8333H11.1667V3ZM4.49999 12.1667H6.16666V4.66667H4.49999V12.1667ZM7.83333 12.1667H9.49999V4.66667H7.83333V12.1667Z"
                fill="#FF3B3B"
              />
            </svg>
          )}
          {type == "add" ? children : title}
        </div>
        {type == "section" && (
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            className={`transition ${hideChildren ? "rotate-0" : "rotate-90"}`}
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
      {type == "section" && !hideChildren && (
        <div className="mt-3 flex flex-col gap-4">{children}</div>
      )}
    </div>
  );
};

const Add: FC<{
  type: "chapter" | "lesson" | "topic";
  parentId: string;
  dispatch: CourseDispatcher;
}> = ({ type, parentId, dispatch }) => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
  });
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [createNewRes, setCreateNewRes] = useState<
    TFetchState<TCourse | undefined>
  >({
    data: undefined,
    loading: false,
    error: false,
  });

  /**
   * * Function responsible for creating a new chapter/lesson/topic - Making the API request to the endpoint required to create any of the items
   * @returns void
   */
  const createNew = async () => {
    // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
    setCreateNewRes({
      data: undefined,
      loading: true,
      error: false,
    });

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
        },
        body: JSON.stringify({
          title: formState.title,
          description: formState.description,
        }),
      }
    );

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (response.status == 400) {
        const data = (await response.json()) as TResponse<any>;
        setCreateNewRes({
          data: undefined,
          loading: false,
          error: data.message,
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setCreateNewRes({
        data: undefined,
        loading: false,
        error: "An error occurred while creating the course",
      });

      console.error("Returned false");
      return false;
    }

    // * Update the existing data with that returned by the API request
    const responseData = (await response.json()) as TResponse<TCourse>;
    setCreateNewRes({
      data: responseData.data,
      loading: false,
      error: false,
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
  };

  const onAdd = () => {
    setOpenModalCreate((prev) => !prev);
  };

  return (
    <>
      {openModalCreate && (
        <CourseModal
          formState={formState}
          setFormState={setFormState}
          type={type}
          handleModalClose={() => setOpenModalCreate((prev) => !prev)}
          modalOpen={openModalCreate}
          mode="create"
          handleAction={createNew}
          requestState={createNewRes}
        />
      )}
      <Wrapper type="add" onAdd={onAdd}>
        Add new {type}
      </Wrapper>
    </>
  );
};

const SideBar: FC<{
  course: TCourse;
  dispatch: CourseDispatcher;
  courseId: string;
}> = ({ course, dispatch, courseId }) => {
  return (
    <div className="flex gap-4 w-80 flex-col">
      {course.chapters.map((chapter) => (
        <>
          <Chapter chapter={chapter} dispatch={dispatch} />
        </>
      ))}
      <Add type="chapter" dispatch={dispatch} parentId={courseId} />
    </div>
  );
};

const Subject = () => {
  const router = useRouter();
  const { subjectid } = router.query;
  const [course, dispatchCourse] = useReducer(courseReducer, {
    data: undefined,
    loading: true,
    error: false,
  });

  /**
   * * Function responsible from retrieving the course with the ID passed
   * @param id The id of the course to be retrieved
   * @returns void
   */
  const getCourse = async (id: string) => {
    // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
    dispatchCourse({
      type: "FETCHING_COURSE",
    });

    // * Make an API request to retrieve the list of courses created by this teacher
    const response = await fetch(`${baseUrl}/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 404 error, display message that courses couldn't be found
      if (response.status == 404) {
        const data = (await response.json()) as TResponse<TCourse>;
        dispatchCourse({
          type: "ERROR_FETCHING_COURSE",
          payload: data.message,
        });
        return;
      }

      // * If it's any other error code, display default error msg
      dispatchCourse({
        type: "ERROR_FETCHING_COURSE",
        payload: "An error occurred while retrieving courses",
      });
      return;
    }

    // * Display the list of courses returned by the endpoint
    const responseData = (await response.json()) as TResponse<TCourse[]>;
    dispatchCourse({ type: "ADD_COURSE", payload: responseData.data });
  };

  useEffect(() => {
    if (subjectid) getCourse((subjectid as string) || "nil");
  }, [subjectid]);

  return (
    <>
      <TeachersWrapper title="Subjects" metaTitle="Olive Groove ~ Subjects">
        <div className="space-y-5">
          {course.loading ? (
            <div className="w-full h-full flex items-center justify-center">
              Loading...
            </div>
          ) : course.error ? (
            <div className="w-full h-full flex items-center justify-center">
              {course.error}
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
                  <Button width="fit" size="sm" color="outline">
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
                  <Button width="fit" size="sm" color="blue">
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

              <div className="flex items-stretch ">
                {/* SIDEBAR */}
                <div className="flex-none">
                  <SideBar
                    course={course.data}
                    dispatch={dispatchCourse}
                    courseId={(subjectid as string) || ""}
                  />
                </div>
                {/* COURSE */}
                <div className="flex-1">
                  <Course course={course.data} />
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
