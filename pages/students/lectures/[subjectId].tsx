import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import Button from "@/components/Atoms/Button";
import {
  TChapter,
  TContentId,
  TCourse,
  TErrorState,
  TLesson,
  TResponse,
  TSection,
  TSubSection,
} from "@/components/utils/types";
import { useRouter } from "next/router";
import CourseModal from "@/components/Molecules/Modal/CourseModal";
import { useCourseContext } from "@/contexts/CourseContext";
import Loader from "@/components/Atoms/Loader";
import NotFoundError from "@/components/Atoms/NotFoundError";
import { AnimatePresence } from "framer";
import { TopicDetails } from "@/components/Atoms/Course/CourseTopicDetails";
import SideBar from "@/components/Atoms/Course/CourseSidebar";
import MobileSideBar from "@/components/Atoms/Course/CourseMobileSideBar";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import { baseUrl } from "@/components/utils/baseURL";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/components/utils/axiosInstance";
import { AxiosError } from "axios";
import { TopicContextProvider } from "@/contexts/TopicContext";
import { handleLogout } from "@/components/Molecules/Layouts/Admin.Layout";
import { ChevronLeft } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import PageNotFound from "../PageNotFound";
import EmailVerifyModal from "@/components/Molecules/Modal/EmailVerifyModal";

function collectLinearContentIds(data: TCourse): TContentId {
  const contentIds = [] as TContentId;

  // Helper function to traverse chapters, lessons, sections, and subsections
  function traverseItem(item: TChapter) {
    if (item.lessons) {
      // Traverse lessons
      item.lessons.forEach((lesson: TLesson) => {
        lesson._id &&
          // contentIds.push({ id: lesson._id, isViewed: lesson.viewed! }); // Add lesson ID
          lesson.sections.forEach((section: TSection) => {
            section._id &&
              contentIds.push({ id: section._id, isViewed: section.viewed! }); // Add section ID
            section.subsections.forEach((subsection: TSubSection) => {
              subsection._id &&
                contentIds.push({
                  id: subsection._id,
                  isViewed: subsection.viewed!,
                }); // Add subsection ID
            });
          });
      });
    }
  }

  // Traverse all data items (chapters)

  data?.chapters?.forEach((chapter: TChapter) => {
    traverseItem(chapter);
  }) ?? [];

  return contentIds;
}

const SubjectDetailsPage: FC = () => {
  const router = useRouter();
  const { subjectId } = useMemo(() => router.query, [router.query]);
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
  const [errorOccured, setErrorOccured] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Course Contents");

  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * * Function responsible from retrieving the course with the ID passed
   * @param id The id of the course to be retrieved
   * @returns void
   */
  const getCourse = useCallback(async (id: string) => {
    try {
      // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
      dispatch({
        type: "FETCHING_COURSE",
      });

      const response = await axiosInstance.get(`${baseUrl}/courses/${id}`);
      console.log(response, "response from axios");

      // * Display the list of courses returned by the endpoint
      const responseData = response.data as TResponse<TCourse[]>;
      console.log(responseData, "this is the response data");
      dispatch({ type: "ADD_COURSE", payload: responseData.data });
    } catch (error: AxiosError | any) {
      if (error.status == 404) {
        dispatch({
          type: "ERROR_FETCHING_COURSE",
          payload: { status: 404, message: error.response.data.message },
        });
        setErrorOccured(true);
        return;
      } else if (error.status == 401) {
        // * if the error status is 401, it means the user is not authenticated, hence redirect the user to the login page
        handleLogout().then(() => router.push("/auth/path/students/login/"));
      }
      // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
      console.error(error);
      dispatch({
        type: "ERROR_FETCHING_COURSE",
        payload: {
          status: error.status,
          message: error.response.data.message,
        },
      });
      if (
        error.response.data.message ===
        "Your account is not verified. Please check your email for the verification code."
      )
        setEmailVerifyModal(true);
      setErrorOccured(true);
    }
  }, [dispatch, router]);

  useEffect(() => {
    const newCourses = collectLinearContentIds(course.data!);
    console.log(newCourses, "linearIds");

    if (newCourses.length === 0) return;

    const lastViewedIndex = newCourses.findLast((course) => course.isViewed);

    // const nextIndexToView =
    //   lastViewedIndex +
    //   1 +
    //   newCourses
    //     .slice(lastViewedIndex + 1)
    //     .findIndex((course) => !course.isViewed);

    console.log(newCourses, "courses data");

    // if (lastViewedIndex !== -1 && lastViewedIndex < newCourses.length - 1) {
    //   const nextCourse = newCourses[nextIndexToView];
    if (lastViewedIndex) {
      router.push(`${router.asPath.split("?")[0]}?topic=${lastViewedIndex.id}`);
    } else {
      //I think we should instead redirect to the first course that has not being viewed instead of the on after the last viewed one.
      newCourses.length > 1 &&
        router.push(`${router.asPath.split("?")[0]}?topic=${newCourses[0].id}`);
    }
  }, [course.data, router]);

  /**
   * * Function responsible for closing the modal and clearing the form state
   */
  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    if (subjectId) getCourse((subjectId as string) || "nil");
  }, [getCourse, subjectId]);

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
        <StudentWrapper
          firstTitle='Courses'
          remark='Manage and get updates on your courses'
          title={`Courses`}
          metaTitle={`Olive Groove ~ ${subjectId}`}
        >
          <div className='space-y-5 max-sm:px-6 max-sm:pt-3 px-12 h-full'>
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
                  <PageNotFound />
                )}
              </div>
            ) : course.data ? (
              <>
                {/* Title */}
                <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-start'>
                  <div className='flex gap-4 mt-6 items-center'>
                    <BackButton />

                    <span className='text-2xl max-sm:text-lg font-medium text-dark font-roboto'>
                      {course.data?.title || "Loading..."}
                    </span>
                  </div>
                  {userRole === "Teacher" && (
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
                        <svg
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M1.66667 13.8333H2.85417L11 5.6875L9.8125 4.5L1.66667 12.6458V13.8333ZM0 15.5V11.9583L11 0.979167C11.1667 0.826389 11.3508 0.708333 11.5525 0.625C11.7542 0.541667 11.9658 0.5 12.1875 0.5C12.4097 0.5 12.625 0.541667 12.8333 0.625C13.0417 0.708333 13.2222 0.833333 13.375 1L14.5208 2.16667C14.6875 2.31944 14.8092 2.5 14.8858 2.70833C14.9625 2.91667 15.0006 3.125 15 3.33333C15 3.55556 14.9617 3.7675 14.885 3.96917C14.8083 4.17083 14.6869 4.35472 14.5208 4.52083L3.54167 15.5H0ZM10.3958 5.10417L9.8125 4.5L11 5.6875L10.3958 5.10417Z'
                            fill='#1E1E1E'
                          />
                        </svg>

                        <span>Edit Course</span>
                      </Button>
                      <Button width='fit' size='xs' color='blue'>
                        <svg
                          width='17'
                          height='14'
                          viewBox='0 0 17 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M9.33334 3.875V1.33333C9.33334 1.11232 9.42113 0.900358 9.57741 0.744078C9.73369 0.587797 9.94566 0.5 10.1667 0.5C10.3853 0.500921 10.5948 0.587713 10.75 0.741667L16.5833 6.575C16.6614 6.65247 16.7234 6.74464 16.7657 6.84619C16.8081 6.94774 16.8298 7.05666 16.8298 7.16667C16.8298 7.27668 16.8081 7.3856 16.7657 7.48715C16.7234 7.5887 16.6614 7.68086 16.5833 7.75833L10.75 13.5917C10.633 13.7063 10.4848 13.784 10.324 13.8149C10.1631 13.8458 9.99667 13.8286 9.84551 13.7655C9.69434 13.7024 9.56514 13.5961 9.47405 13.4599C9.38296 13.3238 9.33401 13.1638 9.33334 13V10.4167H8.625C7.3084 10.397 6.0033 10.6641 4.80028 11.1995C3.59726 11.7348 2.52514 12.5255 1.65834 13.5167C1.55388 13.6557 1.40852 13.7586 1.24264 13.8109C1.07676 13.8632 0.898673 13.8623 0.733335 13.8083C0.565081 13.7516 0.419363 13.6425 0.317429 13.4971C0.215494 13.3517 0.162674 13.1775 0.16667 13C0.16667 5.4 6.9 4.1 9.33334 3.875ZM8.625 8.73333C9.18235 8.73225 9.73915 8.76844 10.2917 8.84167C10.489 8.8716 10.6689 8.97132 10.7989 9.12272C10.9289 9.27411 11.0003 9.46713 11 9.66667V10.9917L14.8167 7.16667L11 3.34167V4.66667C11 4.88768 10.9122 5.09964 10.7559 5.25592C10.5996 5.4122 10.3877 5.5 10.1667 5.5C9.40834 5.5 3.40834 5.66667 2.10834 10.8583C3.99526 9.46713 6.28069 8.72188 8.625 8.73333Z'
                            fill='white'
                          />
                        </svg>

                        <span>Share Course</span>
                      </Button>
                    </div>
                  )}
                </div>
                <div className='flex items-stretch max-sm:flex-col pb-7 gap-4 relative'>
                  {/* SIDEBAR */}
                  <div className='max-md:space-y-6 relative'>
                    <div className='w-full flex gap-0 md:hidden'>
                      {["Course Contents", "Q/A Section"].map((slug, i) => (
                        <>
                          <div
                            className={`px-7 py-2 font-medium text-sm cursor-pointer transition ${
                              activeTab === slug
                                ? "border-primary border-opacity-70 border-b-2 bg-[#32A8C41A] text-primary"
                                : ""
                            }`}
                            onClick={() => setActiveTab(slug)}
                            key={i}
                          >
                            {slug}
                          </div>
                        </>
                      ))}
                    </div>
                    <div className='relative'>
                      <div className='flex-none relative w-full block'>
                        <SideBar courseId={(subjectId as string) || ""} />
                      </div>
                      {/* MOBILE SIDEBAR */}
                      <AnimatePresence>
                        {showSideBar && (
                          <MobileSideBar
                            subjectid={(subjectId as string) || ""}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* COURSE */}
                  <div className='flex-1 max-sm:-order-2'>
                    <TopicDetails course={course.data} />
                  </div>
                </div>
              </>
            ) : (
              <>Nothing...</>
            )}
          </div>

          {course.error && (
            <Snackbar
              open={errorOccured}
              onClose={() => setErrorOccured(false)}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              className='!z-[999]'
            >
              <Alert severity='info' onClose={() => setErrorOccured(false)}>
                {(course.error as TErrorState).message.toString()}
              </Alert>
            </Snackbar>
          )}
        </StudentWrapper>
      </TopicContextProvider>
      {emailVerifyModal && (
        <EmailVerifyModal
          handleModalClose={() => setEmailVerifyModal(false)}
          modalOpen={emailVerifyModal}
        />
      )}
    </>
  );
};

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      size='xs'
      className='p-2 rouded-md !w-6 !h-6 !bg-white'
    >
      <ChevronLeft className='text-black' />
    </Button>
  );
};

export default withAuth("Student", SubjectDetailsPage);
