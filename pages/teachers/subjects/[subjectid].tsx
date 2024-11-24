import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import { TCourse, TResponse } from "@/components/utils/types";
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

const Subject: FC = () => {
  const router = useRouter();
  const { subjectid } = useMemo(() => router.query, [router.query]);
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
  const getCourse = useCallback(
    async (id: string) => {
      try {
        // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
        dispatch({
          type: "FETCHING_COURSE",
        });

        // * Get the access token from the cookies
        // * Make an API request to retrieve the list of courses created by this teacher
        const response = await fetch(`${baseUrl}/courses/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
    },
    [dispatch]
  );

  /**
   * * Function responsible for closing the modal and clearing the form state
   */
  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (subjectid) getCourse((subjectid as string) || "nil");
  }, [getCourse, subjectid]);

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

      <TopicContextProvider course={course.data}>
        <TeachersWrapper title='Subjects' metaTitle='Olive Groove ~ Subjects'>
          <div className='space-y-5 h-full'>
            {course.loading ? (
              <Loader />
            ) : course.error ? (
              <div className='w-full h-full flex items-center justify-center'>
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
                <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-start'>
                  <div className='flex flex-row gap-2 items-center'>
                    {/* Previous page button */}
                    <div
                      className='w-[30px] h-[30px] border border-greyed hover:border-dark flex items-center justify-center rounded-full '
                      onClick={() => router.back()}
                    >
                      <i className='fas fa-arrow-left text-greyed hover:text-dark'></i>
                    </div>
                    <span className='text-2xl font-medium text-dark font-roboto'>
                      {course.data?.title || "Loading..."}
                    </span>
                  </div>
                  <div className='flex gap-4 items-center'>
                    {/* HAMBURGER ICON TO DISPLAY/HIDE SIDEBAR IN MOBILE VIEW */}
                    <div
                      className='rounded-full xl:hidden flex items-center justify-center p-2 border border-primary cursor-pointer transition hover:scale-110'
                      onClick={() => setShowSideBar((prev) => !prev)}
                    >
                      <i
                        className={`fa fa-${
                          showSideBar ? "xmark" : "bars"
                        } text-primary`}
                      ></i>
                    </div>
                    <Button width='fit' size='xs' color='outline'>
                      <i className='fas fa-pencil'></i>

                      <span>Edit Course</span>
                    </Button>
                  </div>
                </div>
                <div className='flex items-stretch gap-4 relative'>
                  {/* SIDEBAR */}
                  <div className='flex-none hidden xl:block'>
                    <SideBar courseId={(subjectid as string) || ""} />
                  </div>
                  {/* MOBILE SIDEBAR */}
                  <AnimatePresence>
                    {showSideBar && (
                      <MobileSideBar subjectid={(subjectid as string) || ""} />
                    )}
                  </AnimatePresence>
                  {/* COURSE */}
                  <div className='flex-1'>
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
