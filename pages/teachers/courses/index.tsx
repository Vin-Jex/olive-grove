import React, { FC, useCallback, useEffect, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import Button from "@/components/Atoms/Button";
import Select from "@/components/Atoms/Select";
import {
  TDepartment,
  TCourse,
  TFetchState,
  THandleSearchChange,
  TResponse,
} from "@/components/utils/types";
import { baseUrl } from "@/components/utils/baseURL";
import CourseModal from "@/components/Molecules/Modal/CourseModal";
import Loader from "@/components/Atoms/Loader";
import NotFoundError from "@/components/Atoms/NotFoundError";
import ServerError from "@/components/Atoms/ServerError";
import Course from "@/components/Atoms/Course/EachCourse";
import { CourseClass, fetchCourses } from "@/components/utils/course";
import { Add } from "@mui/icons-material";
import axiosInstance from "@/components/utils/axiosInstance";
import { useCourseContext } from "@/contexts/CourseContext";
import LogoutWarningModal from "@/components/Molecules/Modal/LogoutWarningModal";
import WarningModal from "@/components/Molecules/Modal/WarningModal";

const Subjects: FC = () => {
  const [searchResults, setSearchResults] = useState<TCourse[]>([]);
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
  const [courses, setCourses] = useState<TFetchState<TCourse[]>>({
    data: [],
    loading: true,
    error: undefined,
  });
  const [departments, setDepartments] = useState<
    TFetchState<TDepartment[] | undefined>
  >({
    data: [],
    loading: false,
    error: undefined,
  });
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<Omit<TCourse<"post">, "chapters">>(
    {
      title: "",
      description: "",
      department: "",
      courseCover: undefined,
    }
  );
  const [createCourseRes, setCreateCourseRes] = useState<
    TFetchState<TCourse | undefined>
  >({
    data: undefined,
    loading: false,
    error: undefined,
  });

  /**
   * * Function responsible from retrieving the courses made by a teacher
   * @param filter The filter object, in the case of retriving courses via a filter, e.g. by their title
   */
  const getCourses = useCallback(
    async (filter?: { query: "title"; value: string }) => {
      setCourses({
        data: [],
        loading: true,
        error: undefined,
      });

      try {
        // Call the reusable getCourses function, passing the setDepartments state updater
        const courses = await fetchCourses(filter);

        if (typeof courses === "object") {
          // Set the courses state to the fetched list of courses
          setCourses({
            data: courses.data,
            loading: false,
            error: undefined,
          });
          setSearchResults(courses.data);
        } else {
          const status = isNaN(Number(courses))
            ? "Error retrieving courses"
            : Number(courses);

          console.log("STATUS RES", status);

          // * If courses were not found
          if (status === 404) {
            setCourses({
              data: [],
              loading: false,
              error: { status: 404, message: "No courses found", state: true },
            });
            setSearchResults([]);
            return;
          }

          setCourses({
            data: [],
            loading: false,
            error: status === 500 ? "Error retrieving courses" : courses,
          });
          setSearchResults([]);
        }
        console.log(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    []
  );

  /**
   * * Function responsible from retrieving the departments on the platform
   */
  const getDepartments = async (filter?: { query: "title"; value: string }) => {
    try {
      // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
      setDepartments({
        data: [],
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      // * Make an API request to retrieve the list of departments created by this teacher
      const response = await axiosInstance.get(`/department/all`);

      // * Display the list of departments returned by the endpoint
      const responseData = response.data as TResponse<TDepartment[]>;
      setDepartments({
        data: responseData.data,
        loading: false,
        error: undefined,
      });
    } catch (error: any) {
      console.error(error);
      // * If it's a 404 error, display message that departments couldn't be found
      if (error?.response?.status == 404) {
        setDepartments({
          data: [],
          loading: false,
          error: "No class found",
        });
        return;
      }

      // * If it's any other error code, display default error msg
      setDepartments({
        data: [],
        loading: false,
        error: "An error occurred while retrieving departments",
      });

      return;
    }
  };

  /**
   * * Function responsible for filtering the courses as the user types in the search input
   * @param e The DOM change event
   * @param config The object ontaining functions and variables like, all the courses, function to update the courses list with filtered courses, <etc styleName={}></etc>
   */
  const handleSearchChange: THandleSearchChange<TCourse> = (
    e,
    { setSearchResults, initialData, setSearchValue }
  ) => {
    const inputValue = e.target.value?.toLowerCase();
    setSearchValue(inputValue);

    // Perform filtering based on input value
    const filteredResults = initialData.filter((result) => {
      // Add checks to prevent null or undefined access errors
      const courseName = result?.title?.toLowerCase() || "";

      return courseName.includes(inputValue?.trim());
    });

    setSearchResults(filteredResults);
  };

  /**
   * * Function responsible for filtering the courses by class
   * @param e The DOM change event
   * @param config The object ontaining functions and variables like, all the courses, function to update the courses list with filtered courses, <etc styleName={}></etc>
   */
  const handleClassFilter: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void = ({ target: { value } }) => {
    console.log("Filtered class value", value);

    if (!value || value.includes("Select class"))
      return setSearchResults(courses.data);

    // Perform filtering based on class filter
    const filteredResults = courses.data.filter(
      (result) => result?.department?._id === value
    );

    setSearchResults(filteredResults);
  };

  /**
   * * Function responsible for creating a new course - Making the API request to the endpoint required to create a Course
   * @returns void
   */
  const createCourse = async () => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setCreateCourseRes({
        data: undefined,
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      const request_data = new FormData();

      // * Append the course details to the request body
      request_data.append("title", formState.title);
      request_data.append("description", formState.description || "");
      request_data.append("classId", formState.department || "");

      typeof formState.courseCover === "object" &&
        request_data.append("courseCover", formState.courseCover);
      !formState.courseCover && request_data.append("courseCover", "");

      // * Make an API request to retrieve the list of courses created by this teacher
      const response = await axiosInstance.post(`/courses`, request_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // * Update the existing data with that returned by the API request
      const responseData = response.data as TResponse<TCourse>;
      setCreateCourseRes({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      // * Add a new course with the details of the newly created course to the list of courses
      const newCourses = [
        new CourseClass(
          responseData.data.title,
          responseData.data.description || "",
          responseData.data._id || "",
          (responseData.data.courseCover as string) || "",
          []
        ),
        ...courses.data,
      ];

      // * Add the newly created course to the list of courses
      setCourses((prev) => ({
        error: undefined,
        loading: false,
        data: newCourses,
      }));
      setSearchResults(newCourses);

      return true;
    } catch (error: any) {
      console.log("Error", error);

      // * If it's a 400 error, display message that the input details are incomplete
      if (error?.response?.status == 400) {
        // const data = (await response.json()) as TResponse<any>;
        setCreateCourseRes({
          data: undefined,
          loading: false,
          error: "Invalid form data passed",
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setCreateCourseRes({
        data: undefined,
        loading: false,
        error: "An error occurred while creating the course",
      });

      return false;
    }
  };

  /**
   * * Function responsible for closing the modal and clearing the form state
   */
  const handleCloseModal = () => {
    setFormState({
      title: "",
      department: "",
      description: "",
      courseCover: "",
      topicVideo: "",
    });
    setOpenModalCreate((prev) => !prev);
    setCreateCourseRes({ data: undefined, error: undefined, loading: false });
  };

  useEffect(() => {
    getCourses();
    getDepartments();
  }, [getCourses]);

  return (
    <>
      <CourseModal
        formState={formState}
        setFormState={setFormState}
        type='course'
        handleModalClose={handleCloseModal}
        modalOpen={openModalCreate}
        mode='create'
        handleAction={createCourse}
        requestState={createCourseRes}
        departments={departments.data?.map((each) => ({
          value: each._id as string,
          display_value: each.name,
        }))}
      />
      {modal.open && (
        <>
          {mode === "delete" ? (
            <>
              <WarningModal
                modalOpen={true}
                handleModalClose={closeModal}
                requestState={modalRequestState}
                handleConfirm={handleDelete || (() => undefined)}
                content='Are you sure you want to delete this course?'
                subtext='This action CAN NOT be undone!'
              />
            </>
          ) : (
            <CourseModal
              formState={modalFormState || ({} as any)}
              setFormState={setModalFormState || ((() => {}) as any)}
              type={type || "chapter"}
              handleModalClose={closeModal}
              modalOpen={true}
              mode={mode || "create"}
              handleAction={handleAction || ((() => {}) as any)}
              handleDelete={handleDelete || ((() => {}) as any)}
              requestState={modalRequestState}
              departments={departments.data?.map((each) => ({
                value: each._id as string,
                display_value: each.name,
              }))}
            />
          )}
        </>
      )}

      <TeachersWrapper
        isPublic={false}
        title='Subjects'
        metaTitle='Olive Grove ~ Subjects'
      >
        <div className='h-full'>
          {courses.loading ? (
            <Loader />
          ) : (
            <>
              {/* Title */}
              <div className='flex justify-between items-start'>
                {typeof courses.error === "object" &&
                  courses.error.status === 404 && (
                    <Button
                      onClick={() => setOpenModalCreate((prev) => !prev)}
                      width='fit'
                      size='xs'
                    >
                      <Add />
                      <span>Add subject</span>
                    </Button>
                  )}
              </div>
              {/* Searchbars and select fields */}
              {!courses.error && (
                <div className='flex items-start justify-start gap-4 flex-col md:justify-between md:flex-row xl:gap-0 xl:items-center'>
                  <div className='flex justify-start items-center gap-4 w-full md:w-auto'>
                    <SearchInput
                      shape='rounded-lg'
                      placeholder='Search for Subjects'
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      initialData={courses.data}
                      handleInputChange={handleSearchChange}
                    />
                    <Select
                      options={
                        departments.data?.map((type) => ({
                          display_value: type.name,
                          value: type._id || "",
                        })) || []
                      }
                      name='class'
                      required
                      onChange={handleClassFilter}
                      placeholder='Select class'
                      inputSize='sm'
                      className='!py-3'
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => setOpenModalCreate((prev) => !prev)}
                      width='fit'
                      size='xs'
                    >
                      <Add />
                      <span>Add subject</span>
                    </Button>
                  </div>
                </div>
              )}
              {courses.error ? (
                <div className='w-full flex items-center justify-center'>
                  {typeof courses.error === "object" &&
                    (courses.error.status === 404 ? (
                      <>
                        <NotFoundError msg={courses.error.message} />
                      </>
                    ) : (
                      <>
                        <ServerError msg={courses.error.message} />
                      </>
                    ))}
                  {typeof courses.error === "string" && (
                    <ServerError msg={courses.error} />
                  )}
                </div>
              ) : searchResults.length < 1 ? (
                // 404 image
                <div className='w-full flex items-center justify-center'>
                  <NotFoundError msg='No courses found' />
                </div>
              ) : (
                <>
                  {/* Content */}
                  <div className='mt-4'>
                    {/* Courses */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5 2xl:gap-7 mt-4'>
                      {searchResults &&
                        searchResults.map((course, i) => (
                          <Course course={course} key={i + course.title} />
                        ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Subjects);
