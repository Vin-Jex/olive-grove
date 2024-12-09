import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import {
  TClass,
  TCourse,
  TFetchState,
  TResponse,
} from "@/components/utils/types";
import { baseUrl } from "@/components/utils/baseURL";
import { useRouter } from "next/router";
import CourseModal from "@/components/Molecules/Modal/CourseModal";
import { useCourseContext } from "@/contexts/CourseContext";
import Loader from "@/components/Atoms/Loader";
import NotFoundError from "@/components/Atoms/NotFoundError";
import { AnimatePresence } from "framer";
import { TopicDetails } from "@/components/Atoms/Course/CourseTopicDetails";
import SideBar from "@/components/Atoms/Course/CourseSidebar";
import MobileSideBar from "@/components/Atoms/Course/CourseMobileSideBar";
import { TopicContextProvider } from "@/contexts/TopicContext";
import axiosInstance from "@/components/utils/axiosInstance";
import ServerError from "@/components/Atoms/ServerError";
import Cookies from "js-cookie";

const Subject: FC = () => {
  const router = useRouter();
  const { subjectid } = useMemo(() => router.query, [router.query]);
  const [userRole, setUserRole] = useState<string>();
  const [showSideBar, setShowSideBar] = useState(false);
  const [classes, setClasses] = useState<TFetchState<TClass[] | undefined>>({
    data: [],
    loading: false,
    error: undefined,
  });
  const {
    course,
    dispatch,
    modal,
    closeModal,
    modalFormState,
    setModalFormState,
    modalRequestState,
    setModalRequestState,
    openModal,
    modalMetadata: { type, mode, handleAction, handleDelete },
  } = useCourseContext();

  /**
   * * Function responsible from retrieving the course with the ID passed
   * @param id The id of the course to be retrieved
   * @returns void
   */
  const getCourse = useCallback(
    async (id: string) => {
      try {
        // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
        dispatch({
          type: "FETCHING_COURSE",
        });

        // * Get the access token from the cookies
        // * Make an API request to retrieve the list of courses created by this teacher
        const response = await axiosInstance.get(`/courses/${id}`);

        // * Display the list of courses returned by the endpoint
        const responseData = response.data as TResponse<TCourse[]>;
        dispatch({ type: "ADD_COURSE", payload: responseData.data });
      } catch (error: any) {
        // * If it's a 404 error, display message that courses couldn't be found
        if (error?.response?.status == 404) {
          const data = error?.response?.data as TResponse<TCourse>;
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
            status: error?.response?.status,
            message: "An error occurred while retrieving this course",
          },
        });
        return;
      }
    },
    [dispatch]
  );

  const handleEditCourse = async (formState?: any) => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setModalRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });

      const request_data = new FormData();

      // * Append the course details to the request body
      request_data.append("title", formState.title);
      request_data.append("description", formState.description || "");
      request_data.append("classId", formState.classId || "");

      typeof formState.courseCover === "object" &&
        request_data.append("courseCover", formState.courseCover);
      !formState.courseCover && request_data.append("courseCover", "");

      // * Make an API request to retrieve the list of courses created by this teacher
      const response = await axiosInstance.put(
        `/courses/${course.data?._id}`,
        request_data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // * Update the existing data with that returned by the API request
      const responseData = response.data as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      dispatch({ type: "EDIT_COURSE", payload: responseData.data });

      return true;
    } catch (error: any) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (error?.response?.status == 400) {
        // const data = (await response.json()) as TResponse<any>;
        setModalRequestState({
          data: undefined,
          loading: false,
          error: "Invalid form data passed",
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setModalRequestState({
        data: undefined,
        loading: false,
        error: "An error occurred while updating the course",
      });

      return false;
    }
  };

  /**
   * * Function responsible for opening the course modal to edit the course
   * */
  const openEditCourseModal = () => {
    openModal({
      modalMetadata: {
        formData: {
          title: course.data?.title || "",
          classId: course.data?.classId || "",
          description: course.data?.description || "",
          courseCover: course.data?.courseCover || "",
        },
        mode: "edit",
        type: "course",
        handleAction: handleEditCourse,
      },
    });
  };

  /**
   * * Function responsible from retrieving the classes on the platform
   */
  const getClasses = async (filter?: { query: "title"; value: string }) => {
    try {
      // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
      setClasses({
        data: [],
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      // * Make an API request to retrieve the list of classes created by this teacher
      const response = await axiosInstance.get(`/classes/all`);

      // * Display the list of classes returned by the endpoint
      const responseData = response.data as TResponse<TClass[]>;
      setClasses({
        data: responseData.data,
        loading: false,
        error: undefined,
      });
    } catch (error: any) {
      console.error(error);
      // * If it's a 404 error, display message that classes couldn't be found
      if (error?.response?.status == 404) {
        setClasses({
          data: [],
          loading: false,
          error: "No class found",
        });
        return;
      }

      // * If it's any other error code, display default error msg
      setClasses({
        data: [],
        loading: false,
        error: "An error occurred while retrieving classes",
      });

      return;
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
    getClasses();
  }, [getCourse, subjectid]);

  useEffect(() => {
    const role = Cookies.get("role");
    setUserRole(role?.toLocaleLowerCase());
  }, []);

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
            classes={classes.data?.map((each) => ({
              value: each._id as string,
              display_value: each.name,
            }))}
          />
        </>
      )}

      <TopicContextProvider course={course.data}>
        <TeachersWrapper
          title="Subjects"
          metaTitle="Olive Groove ~ Subjects"
          className="relative"
        >
          <div className="space-y-5 h-full relative">
            {course.loading ? (
              <Loader />
            ) : course.error ? (
              <div className="w-full h-full flex items-center justify-center">
                {typeof course.error === "object" &&
                  (course.error.status === 404 ? (
                    <>
                      <NotFoundError msg={course.error.message} />
                    </>
                  ) : (
                    <ServerError msg={course.error.message} />
                  ))}
              </div>
            ) : course.data ? (
              <>
                {/* Title */}
                <div className="flex flex-row gap-4 sm:gap-0 sm:flex-row justify-between items-start">
                  <div className="flex flex-row gap-2 items-center">
                    {/* Previous page button */}
                    <div
                      className="w-[30px] h-[30px] border border-greyed hover:border-dark flex items-center justify-center rounded-full "
                      onClick={() =>
                        router.push(
                          `/${
                            userRole === "teacher"
                              ? "teachers"
                              : userRole === "student"
                              ? "students"
                              : "admin"
                          }/subjects`
                        )
                      }
                    >
                      <i className="fas fa-arrow-left text-greyed hover:text-dark"></i>
                    </div>
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
                    <Button
                      width="fit"
                      size="xs"
                      color="outline"
                      onClick={openEditCourseModal}
                    >
                      <i className="fas fa-pencil"></i> <span>Edit Course</span>
                    </Button>
                  </div>
                </div>
                {/* <div className="flex items-stretch gap-4 relative"> */}
                <div className="flex items-stretch gap-4">
                  {/* SIDEBAR */}
                  <div className="flex-none hidden xl:block">
                    <SideBar courseId={(subjectid as string) || ""} />
                  </div>
                  {/* MOBILE SIDEBAR */}
                  <AnimatePresence>
                    {showSideBar && (
                      <MobileSideBar subjectid={(subjectid as string) || ""} />
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
      </TopicContextProvider>
    </>
  );
};

export default withAuth("Teacher", Subject);
