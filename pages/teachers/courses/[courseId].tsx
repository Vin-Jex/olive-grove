import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import withAuth from '@/components/Molecules/WithAuth';
import TeachersWrapper from '@/components/Molecules/Layouts/Teacher.Layout';
import Button from '@/components/Atoms/Button';
import {
  TDepartment,
  TCourse,
  TFetchState,
  TResponse,
  TErrorStatus,
} from '@/components/utils/types';
import { useRouter } from 'next/router';
import CourseModal from '@/components/Molecules/Modal/CourseModal';
import { useCourseContext } from '@/contexts/CourseContext';
import Loader from '@/components/Atoms/Loader';
import ErrorUI from '@/components/Atoms/ErrorComponent';
import { AnimatePresence } from 'framer';
import { TopicDetails } from '@/components/Atoms/Course/CourseTopicDetails';
import SideBar from '@/components/Atoms/Course/CourseSidebar';
import MobileSideBar from '@/components/Atoms/Course/CourseMobileSideBar';
import { TopicContextProvider } from '@/contexts/TopicContext';
import axiosInstance from '@/components/utils/axiosInstance';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { BackButton } from '@/pages/students/lectures/[courseId]';

const Subject: FC = () => {
  const router = useRouter();
  const { courseId } = useMemo(() => router.query, [router.query]);
  const [userRole, setUserRole] = useState<string>();
  const [showSideBar, setShowSideBar] = useState(false);
  const [classes, seTClasses] = useState<
    TFetchState<TDepartment[] | undefined>
  >({
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

  console.log(course, 'This is the course');

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
          type: 'FETCHING_COURSE',
        });

        // * Get the access token from the cookies
        // * Make an API request to retrieve the list of courses created by this teacher
        const response = await axiosInstance.get(`/courses/${id}`);

        // * Display the list of courses returned by the endpoint
        const responseData = response.data as TResponse<TCourse[]>;
        dispatch({ type: 'ADD_COURSE', payload: responseData.data });
      } catch (error: any) {
        const data = error?.response?.data;
        console.log(data);
        // * If it's a 404 error, display message that courses couldn't be found
        if (error?.response?.status == 404) {
          toast.error(data.message);

          dispatch({
            type: 'ERROR_FETCHING_COURSE',
            payload: { status: 404, message: data.message },
          });
          return;
        }

        // // * If it's any other error code, display default error msg
        toast.error(data.message);
        dispatch({
          type: 'ERROR_FETCHING_COURSE',
          payload: {
            status: data.status,
            message:
              data.message || 'An error occurred while retrieving this course',
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
      request_data.append('title', formState.title);
      request_data.append('description', formState.description || '');
      request_data.append('classId', formState.classId || '');

      typeof formState.courseCover === 'object' &&
        request_data.append('courseCover', formState.courseCover);
      !formState.courseCover && request_data.append('courseCover', '');

      // * Make an API request to retrieve the list of courses created by this teacher
      const response = await axiosInstance.put(
        `/courses/${course.data?._id}`,
        request_data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // * Update the existing data with that returned by the API request
      const responseData = response.data as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      dispatch({ type: 'EDIT_COURSE', payload: responseData.data });

      return true;
    } catch (error: any) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (error?.response?.status == 400) {
        // const data = (await response.json()) as TResponse<any>;
        setModalRequestState({
          data: undefined,
          loading: false,
          error: 'Invalid form data passed',
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setModalRequestState({
        data: undefined,
        loading: false,
        error: 'An error occurred while updating the course',
      });

      return false;
    }
  };

  const handleDeleteCourse = async () => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setModalRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });

      // * Make an API request to delete this course
      const response = await axiosInstance.delete(
        `/courses/${course.data?._id}`
      );

      // * Update the existing data with that returned by the API request
      const responseData = response.data as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      router.push('/teachers/courses');

      return true;
    } catch (error: any) {
      if (error?.response?.status == 404) {
        // const data = (await response.json()) as TResponse<any>;
        setModalRequestState({
          data: undefined,
          loading: false,
          error: 'Course not found',
        });
        router.push('/teachers/courses');
        return false;
      }

      // * If it's a 400 error, display message that the input details are incomplete
      if (error?.response?.status == 400) {
        // const data = (await response.json()) as TResponse<any>;
        setModalRequestState({
          data: undefined,
          loading: false,
          error: 'Error deleting course',
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setModalRequestState({
        data: undefined,
        loading: false,
        error: 'An error occurred while updating the course',
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
          title: course.data?.title || '',
          department: (course.data?.department as any) || '',
          description: course.data?.description || '',
          courseCover: course.data?.courseCover || '',
        },
        mode: 'edit',
        type: 'course',
        handleAction: handleEditCourse,
        handleDelete: handleDeleteCourse,
      },
    });
  };

  /**
   * * Function responsible from retrieving the classes on the platform
   */
  const geTClasses = async (filter?: { query: 'title'; value: string }) => {
    try {
      // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
      seTClasses({
        data: [],
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      // * Make an API request to retrieve the list of classes created by this teacher
      const response = await axiosInstance.get(`/department/all`);

      // * Display the list of classes returned by the endpoint
      const responseData = response.data as TResponse<TDepartment[]>;
      seTClasses({
        data: responseData.data,
        loading: false,
        error: undefined,
      });
    } catch (error: any) {
      console.error(error);
      // * If it's a 404 error, display message that classes couldn't be found
      if (error?.response?.status == 404) {
        seTClasses({
          data: [],
          loading: false,
          error: 'No class found',
        });
        return;
      }

      // * If it's any other error code, display default error msg
      seTClasses({
        data: [],
        loading: false,
        error: 'An error occurred while retrieving classes',
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
    if (courseId) getCourse((courseId as string) || 'nil');
    geTClasses();
  }, [getCourse, courseId]);

  useEffect(() => {
    const role = Cookies.get('role');
    setUserRole(role?.toLocaleLowerCase());
  }, []);

  return (
    <>
      {modal.open && (
        <>
          <CourseModal
            formState={modalFormState || ({} as any)}
            setFormState={setModalFormState || ((() => {}) as any)}
            type={type || 'chapter'}
            handleModalClose={handleCloseModal}
            modalOpen={true}
            mode={mode || 'create'}
            handleAction={handleAction || ((() => {}) as any)}
            handleDelete={handleDelete || ((() => {}) as any)}
            requestState={modalRequestState}
            departments={classes.data?.map((each) => ({
              value: each._id as string,
              display_value: each.name,
            }))}
          />
        </>
      )}

      <TopicContextProvider course={course.data}>
        <TeachersWrapper
          isPublic={false}
          title={`Olive Grove - ${course?.data?.title ?? 'Course'}`}
          metaTitle={`Olive Grove - ${course?.data?.title ?? 'Course'}`}
        >
          <div className='space-y-5 h-full relative'>
            {course.loading ? (
              <Loader />
            ) : course.error ? (
              <div className='w-full h-full flex items-center justify-center'>
                <BackButton />

                {typeof course.error === 'object' &&
                  (course.error.status ? (
                    <ErrorUI
                      msg={course.error.message}
                      status={course.error.status as TErrorStatus}
                    />
                  ) : (
                    <ErrorUI msg={course.error.message} status={404} />
                  ))}
              </div>
            ) : course.data ? (
              <>
                {/* Title */}
                <div className='flex flex-row gap-4 sm:gap-0 sm:flex-row justify-between items-start'>
                  <div className='flex flex-row gap-2 items-center'>
                    {/* Previous page button */}
                    <div
                      className='w-[30px] h-[30px] border border-greyed hover:border-dark flex items-center justify-center rounded-full '
                      onClick={() =>
                        router.push(
                          `/${
                            userRole === 'teacher'
                              ? 'teachers'
                              : userRole === 'student'
                              ? 'students'
                              : 'admin'
                          }/courses`
                        )
                      }
                    >
                      <i className='fas fa-arrow-left text-greyed hover:text-dark'></i>
                    </div>
                    <span className='text-2xl font-medium text-dark font-roboto'>
                      {course.data?.title || 'Loading...'}
                    </span>
                    <span className='absolute right-0 translate-y-1/2'>
                      <span className='text-sm text-subtext'>Courses / </span>
                      <span className='text-sm text-dark font-semibold'>
                        {' '}
                        {course.data?.title}
                      </span>
                    </span>
                  </div>
                  {/* <div className='flex gap-4 items-center'> */}
                  {/* HAMBURGER ICON TO DISPLAY/HIDE SIDEBAR IN MOBILE VIEW */}
                  {/* <div
                      className='rounded-full xl:hidden flex items-center justify-center p-2 border border-primary cursor-pointer transition hover:scale-110'
                      onClick={() => setShowSideBar((prev) => !prev)}
                    >
                      <i
                        className={`fa fa-${
                          showSideBar ? "xmark" : "bars"
                        } text-primary`}
                      ></i>
                    </div>
                    <Button
                      width='fit'
                      size='xs'
                      color='outline'
                      onClick={openEditCourseModal}
                      className='flex gap-1'
                    >
                      <i className='fas fa-pencil'></i> <span>Edit Course</span>
                    </Button>
                  </div> */}
                </div>
                {/* <div className="flex items-stretch gap-4 relative"> */}
                <div className='flex items-stretch gap-4'>
                  {/* SIDEBAR */}
                  <div className='flex-none hidden xl:block'>
                    <SideBar courseId={(courseId as string) || ''} />
                  </div>
                  {/* MOBILE SIDEBAR */}
                  <AnimatePresence>
                    {showSideBar && (
                      <MobileSideBar courseId={(courseId as string) || ''} />
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

export default withAuth('Teacher', Subject);
