import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import SwitchContentNav from "@/components/Molecules/Navs/SwitchContentNav";
import TeacherCard from "@/components/Molecules/Card/TeacherSubjectCard";
import Button from "@/components/Atoms/Button";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { baseUrl } from "@/components/utils/baseURL";
import ServerError from "@/components/Atoms/ServerError";
import NotFoundError from "@/components/Atoms/NotFoundError";
import Loader from "@/components/Atoms/Loader";
import LectureModal from "@/components/Molecules/Modal/LectureModal";
import { ILectureData, TCourse, TFetchState } from "@/components/utils/types";
import { fetchCourses } from "@/components/utils/course";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/components/utils/axiosInstance";

const Lectures = () => {
  const [activeItem, setActiveItem] = useState("all courses");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [lectures, setLectures] = useState<ILectureData[]>([]);
  const [lectureId, setLectureId] = useState<string | null>(null);
  const [courses, setCourses] = useState<TFetchState<TCourse[]>>({
    data: [],
    loading: true,
    error: undefined,
  });
  const { user } = useAuth();
  const [formState, setFormState] = useState<{
    subject: string;
    description: string;
    classTime: string;
    meetingLink: string;
    teacher: string;
    academicWeekDate: string;
    recordedLecture?: string;
  }>({
    subject: "",
    description: "",
    classTime: "",
    meetingLink: "",
    teacher: "",
    academicWeekDate: "",
    recordedLecture: "",
  });
  const [isLoading, setIsLoading] = useState({
    saving: false,
    deleting: false,
    fetching: false,
  });

  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");

  const [error, setError] = useState<{ status: 404 | 500; msg: string }>();

  const handleModalEdit = () => {
    setMode("edit");
    setOpenModalEdit(!openModalEdit);
  };

  const handleModalCreate = () => {
    setMode("create");
    setOpenModalCreate(!openModalCreate);
  };

  const getCourses = useCallback(
    async (filter?: { query: "title"; value: string }) => {
      setCourses({
        data: [],
        loading: true,
        error: undefined,
      });

      try {
        // Call the reusable getCourses function, passing the setClasses state updater
        const courses = await fetchCourses(filter);

        if (typeof courses === "object") {
          // Set the courses state to the fetched list of courses
          setCourses({
            data: courses.data,
            loading: false,
            error: undefined,
          });
        } else {
          setCourses({
            data: [],
            loading: false,
            error: courses,
          });
        }
        console.log(courses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    },
    []
  );

  /**
   * Fetches a list of lectures created by a teacher.
   *
   * This function makes an API request to retrieve lectures.
   *
   * @returns A promise that resolves to an array of `ILectureData` objects then updates the loading states or error messages based on the condition that was met.
   */
  const fetchLectures = useCallback(async () => {
    try {
      const userId = user?.id;
      setIsLoading((prevState) => ({ ...prevState, fetching: true }));
      const response = await axiosInstance.get(`/teacher/lectures`);

      const { data } = response;
      console.log("LECTURES: ", data);
      setLectures(data?.data);
    } catch (err) {
      setError({ msg: "Failed to load lectures", status: 500 });
    } finally {
      setIsLoading((prevState) => ({ ...prevState, fetching: false }));
    }
  }, [user?.id]);

  const createOrUpdateLecture = async (
    lectureId?: string,
    mode?: "edit" | "create"
  ): Promise<boolean> => {
    const {
      subject,
      description,
      classTime,
      meetingLink,
      academicWeekDate,
      recordedLecture,
    } = formState;
    const userId = user?.id;

    const lecturePayload = {
      subject,
      description,
      classTime,
      meetingLink,
      teacher: userId,
      academicWeekDate,
      recordedLecture,
    };

    const formData = new FormData();

    for (const key in lecturePayload) {
      formData.append(
        key,
        lecturePayload[key as keyof typeof lecturePayload] as string
      );
    }

    setIsLoading((prevState) => ({ ...prevState, saving: true }));

    try {
      const url = mode === "edit" ? `/lecture/${lectureId}` : `/lecture`;

      const method = mode === "edit" ? "PUT" : "POST";
      const response = await axiosInstance({
        url,
        method,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      const { data } = response;

      // Refresh the list of lectures
      fetchLectures();
      setOpenModalCreate(false);
      return true;
    } catch (err) {
      setError({ msg: "Failed to create/update lecture", status: 500 });
      return false;
    } finally {
      setIsLoading((prevState) => ({ ...prevState, saving: false }));
    }
  };

  const deleteLecture = async (lectureId: string) => {
    setIsLoading({ ...isLoading, deleting: true });

    try {
      await axiosInstance.delete(`/lectures/${lectureId}`);

      fetchLectures();
    } catch (err) {
      setError({ msg: "Failed to delete lecture", status: 500 });
    } finally {
      setIsLoading({ ...isLoading, deleting: false });
    }
  };

  useEffect(() => {
    fetchLectures();
    getCourses();
  }, [fetchLectures, getCourses]);

  return (
    <>
      <LectureModal
        formState={formState}
        setFormState={setFormState}
        type="class"
        handleModalClose={handleModalCreate}
        modalOpen={openModalCreate}
        mode={mode}
        handleAction={() => createOrUpdateLecture(lectureId!)}
        handleDelete={
          mode === "edit" ? () => deleteLecture(lectureId!) : undefined
        }
        courses={courses.data.map((item) => item.title.trim())}
      />

      <TeachersWrapper title="Lectures" metaTitle="Olive Groove ~ Lectures">
        <div className="space-y-5 h-full">
          <>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-dark font-roboto">
                  Explore your available lectures.
                </span>
                <span className="text-md text-subtext font-roboto">
                  Manage, edit and create lecture.
                </span>
              </div>
              <Button size="xs" width="fit" onClick={handleModalCreate}>
                <span>Create Lecture</span>
              </Button>
            </div>

            {isLoading.fetching ? (
              <div className="h-full w-full">
                <Loader />
              </div>
            ) : error ? (
              <>
                {error.status === 404 ? (
                  <NotFoundError msg={error.msg} />
                ) : (
                  <ServerError msg={error.msg} />
                )}
              </>
            ) : (
              <>
                <SwitchContentNav
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  navLink={["all courses", "active courses"]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-6">
                  {activeItem === "all courses"
                    ? lectures.map((lectureItem, index) => (
                        <div key={index} className="mt-4 w-full space-y-2">
                          <span className="text-dark text-xl font-medium capitalize">
                            {new Date(
                              lectureItem.academicWeekDate
                            ).toDateString()}
                          </span>
                          <TeacherCard
                            key={index}
                            academicWeekDate={1}
                            type="lecture"
                            time={new Date(
                              lectureItem.classTime
                            ).toLocaleString()}
                            subject={
                              (lectureItem.subject as TCourse)?.title || ""
                            }
                            lectureTopic={lectureItem.description}
                            btnLink1={() => {}}
                            btnLink2={() => {
                              setLectureId(lectureItem._id);
                              handleModalEdit();
                            }}
                          />
                        </div>
                      ))
                    : lectures
                        .filter((lectureItem) => lectureItem.isActive)
                        .map((lectureItem, index) => (
                          <div key={index} className="mt-4 w-full space-y-2">
                            <span className="text-dark text-xl font-medium capitalize">
                              {new Date(
                                lectureItem.academicWeekDate
                              ).toDateString()}
                            </span>
                            <TeacherCard
                              key={index}
                              academicWeekDate={1}
                              type="lecture"
                              time={new Date(
                                lectureItem.classTime
                              ).toLocaleString()}
                              subject={(lectureItem.subject as TCourse).title}
                              lectureTopic={lectureItem.description}
                              btnLink1={() => {}}
                              btnLink2={() => {
                                setLectureId(lectureItem._id);
                                handleModalEdit();
                              }}
                            />
                            {/* </div> */}
                          </div>
                        ))}
                </div>
              </>
            )}
          </>
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Lectures);
