import React, { FC, useEffect, useState } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import Img from "@/public/image/student3.png";
import Button from "@/components/Atoms/Button";
import Select from "@/components/Atoms/Select";
import dummy_subject_img from "../../images/olive-groove-subject.png";
import {
  TCourse,
  TFetchState,
  THandleSearchChange,
  TResponse,
  TSubject,
} from "@/components/utils/types";
import Image from "next/image";
import CreateClassModal from "@/components/Molecules/Modal/CreateClassModal";
import { baseUrl } from "@/components/utils/baseURL";
import coursePlaceholder from "@/images/course-placeholder.png";

const subjects: TCourse[] = [
  {
    image: coursePlaceholder.src,
    title: "AD Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
  {
    image: coursePlaceholder.src,
    title: "BD Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
  {
    image: coursePlaceholder.src,
    title: "CD Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
  {
    image: coursePlaceholder.src,
    title: "DD Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
  {
    image: coursePlaceholder.src,
    title: "ED Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
  {
    image: coursePlaceholder.src,
    title: "FD Mathematics",
    chapters: [] as any,
    _id: "28899",
    description: "This is a demo",
  },
];

class CourseClass implements TCourse {
  constructor(
    public title: string,
    public description: string,
    public _id: string,
    public chapters: any //! Replace with TChapters later
  ) {}
}

const Course: FC<{ course: TCourse }> = ({ course }) => {
  return (
    <div className="flex rounded-lg overflow-hidden flex-col items-center w-full border border-[#1E1E1E33]">
      <div className="w-full h-[225px]">
        <Image
          src={course.image || coursePlaceholder.src}
          width={266}
          height={225}
          className="w-full h-full object-cover"
          alt={course.title}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full space-y-1.5 pt-4 pb-2 px-4">
        <span className="font-semibold font-roboto text-base text-dark leading-3">
          {course.title}
        </span>
        <span className="font-roboto text-base">{0} Lessons</span>
      </div>
    </div>
  );
};

const Subjects = () => {
  const [searchResults, setSearchResults] = useState<TCourse[]>([]);
  const [courses, setCourses] = useState<TFetchState<TCourse[]>>({
    data: [],
    loading: false,
    error: false,
  });
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState({
    class: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });
  const [createCourseRes, setCreateCourseRes] = useState<
    TFetchState<TCourse | undefined>
  >({
    data: undefined,
    loading: false,
    error: false,
  });

  /**
   * * Function responsible from retrieving the courses made by a teacher
   * @param filter The filter object, in the case of retriving courses via a filter, e.g. by their title
   */
  const getCourses = async (filter?: { query: "title"; value: string }) => {
    // * Set the loading state to true, error state to false, and data to an empty list, when the API request is about to be made
    setCourses({
      data: [],
      loading: true,
      error: false,
    });

    // * Make an API request to retrieve the list of courses created by this teacher
    const response = await fetch(
      `${baseUrl}/courses${filter ? `?${filter?.query}=${filter?.value}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 404 error, display message that courses couldn't be found
      if (response.status == 404) {
        const data = (await response.json()) as TResponse<TCourse>;
        setCourses({
          data: [],
          loading: false,
          error: data.message,
        });
        return;
      }

      // * If it's any other error code, display default error msg
      setCourses({
        data: [],
        loading: false,
        error: "An error occurred while retrieving courses",
      });

      setSearchResults([]);
      return;
    }

    // * Display the list of courses returned by the endpoint
    const responseData = (await response.json()) as TResponse<TCourse[]>;
    setCourses({
      data: responseData.data,
      loading: false,
      error: false,
    });
    setSearchResults(responseData.data);
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
   * * Function responsible for creating a new course - Making the API request to the endpoint required to create a Course
   * @returns void
   */
  const createCourse = async () => {
    // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
    setCreateCourseRes({
      data: undefined,
      loading: true,
      error: false,
    });

    // * Make an API request to retrieve the list of courses created by this teacher
    const response = await fetch(`${baseUrl}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formState.class,
        description: formState.description,
      }),
    });

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (response.status == 400) {
        const data = (await response.json()) as TResponse<any>;
        setCreateCourseRes({
          data: undefined,
          loading: false,
          error: data.message,
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

    // * Update the existing data with that returned by the API request
    const responseData = (await response.json()) as TResponse<TCourse>;
    setCreateCourseRes({
      data: responseData.data,
      loading: false,
      error: false,
    });

    // * Add a new course with the details of the newly created course to the list of courses
    const newCourses = [
      ...courses.data,
      new CourseClass(
        responseData.data.title,
        responseData.data.description,
        responseData.data._id,
        []
      ),
    ];

    // * Add the newly created course to the list of courses
    setCourses((prev) => ({
      ...prev,
      data: newCourses,
    }));
    setSearchResults(newCourses);

    return true;
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <CreateClassModal
        formState={formState}
        setFormState={setFormState}
        type="course"
        handleModalClose={() => setOpenModalCreate((prev) => !prev)}
        modalOpen={openModalCreate}
        mode="create"
        handleAction={createCourse}
        requestState={createCourseRes}
      />

      <TeachersWrapper title="Subjects" metaTitle="Olive Groove ~ Subjects">
        <div className="space-y-5">
          {/* Title */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-lg font-medium text-dark font-roboto">
                Subjects
              </span>
              <span className="text-md text-subtext font-roboto">
                View and manage subjects
              </span>
            </div>
            <Button
              onClick={() => setOpenModalCreate((prev) => !prev)}
              width="fit"
              size="sm"
              color="outline"
            >
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
              <span>Create new subject</span>
            </Button>
          </div>

          <div className="space-y-8 !my-12">
            <div className="flex items-start justify-start gap-4 flex-col md:justify-between md:flex-row xl:gap-0 xl:items-center">
              <div className="flex justify-start items-center gap-4 w-full md:w-auto">
                <Select
                  options={["jss 1", "jss 2", "jss 3", "ss 1", "ss 2", "ss 3"]}
                  name="class"
                  required
                />
                <Select
                  options={["physics", "further mathematics"]}
                  name="subject"
                  required
                />
              </div>

              <div className="w-full md:w-[400px]">
                <SearchInput
                  shape="rounded-lg"
                  placeholder="Search for Subjects"
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                  initialData={courses.data}
                  handleInputChange={handleSearchChange}
                />
              </div>
            </div>

            {courses.loading ? (
              <div className="w-full h-full flex items-center justify-center">
                Loading...
              </div>
            ) : courses.error ? (
              <div className="w-full h-full flex items-center justify-center">
                {courses.error}
              </div>
            ) : searchResults.length < 1 ? (
              <div className="w-full h-full flex items-center justify-center">
                No data found...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-5 2xl:gap-7">
                  {searchResults.map((course, i) => (
                    <>
                      <Course course={course} key={i} />
                    </>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Subjects);
