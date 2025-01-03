import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import NotFoundError from "@/components/Atoms/NotFoundError";
import ServerError from "@/components/Atoms/ServerError";
import Loader from "@/components/Atoms/Loader";
import {
  TAcademicWeek,
  TAssessment,
  TAssessmentType,
  TDepartment,
  TCourse,
  TFetchState,
  TTeacher,
} from "@/components/utils/types";
import TeacherCard from "@/components/Molecules/Card/TeacherSubjectCard";
import AsssessmentModal from "@/components/Molecules/Modal/AsssessmentModal";
import { fetchCourses } from "@/components/utils/course";
import axiosInstance from "@/components/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

const Assessments = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<TAssessment<"post">>({
    subject: "",
    assessmentType: "",
    description: "",
    dueDate: "",
    teacher: "",
    academicWeek: "",
    _id: "",
    class: "",
  });
  const [fetchAssessmentsState, setFetchAssessmentsState] = useState<
    TFetchState<TAssessment<"get">[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });
  const [fetchAcademicWeekState, setFetchAcademicWeekState] = useState<
    TFetchState<TAcademicWeek[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });
  const [createAssessmentState, setCreateAssessmentState] = useState<
    TFetchState<TAssessment<"post"> | undefined>
  >({
    data: undefined,
    error: undefined,
    loading: false,
  });
  const [fetchCoursesState, setFetchCoursesState] = useState<
    TFetchState<TCourse[]>
  >({
    data: [],
    loading: true,
    error: undefined,
  });
  const [fetchClassesState, setFetchClassesState] = useState<
    TFetchState<TDepartment[]>
  >({
    data: [],
    loading: true,
    error: undefined,
  });
  const [fetchAssessmentTypesState, setFetchAssessmentTypesState] = useState<
    TFetchState<TAssessmentType[]>
  >({
    data: [],
    loading: true,
    error: undefined,
  });

  /**
   * Clears the form data
   */
  const clearFormState = () => {
    setFormState({
      subject: "",
      assessmentType: "",
      description: "",
      dueDate: "",
      teacher: "",
      academicWeek: "",
      _id: "",
      class: "",
    });
  };

  const toogleModalCreate = () => {
    clearFormState();
    setCreateAssessmentState({
      data: undefined,
      loading: false,
      error: undefined,
    });
    setOpenModalCreate(!openModalCreate);
  };

  const toogleModalEdit = (existing_data?: TAssessment<"post">) => {
    if (openModalEdit) {
      clearFormState();
      setCreateAssessmentState({
        data: undefined,
        loading: false,
        error: undefined,
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalEdit((prev) => !prev);
  };

  const toogleModalDelete = (existing_data?: TAssessment<"post">) => {
    if (openModalDelete) {
      clearFormState();
      setCreateAssessmentState({
        data: undefined,
        loading: false,
        error: undefined,
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalDelete((prev) => !prev);
  };

  /**
   * Updates/Deletes class in the local state after it has been edited or deleted
   */
  const updateAssessments = useCallback(
    (data: TAssessment<"post">, mode: "edit" | "delete" | "create") => {
      const old_assessments = [...fetchAssessmentsState.data];
      // console.log("Assesment data", data);
      // console.log("Fetched courses", fetchCoursesState.data);
      // console.log(
      //   "Returned course",
      //   fetchCoursesState.data?.find((course) => course._id === data.subject)
      // );
      const assessmentData: TAssessment<"get"> = {
        ...data,
        academicWeek: fetchAcademicWeekState.data?.find(
          (week) => week._id === data.academicWeek
        )!,
        subject: fetchCoursesState.data?.find(
          (course) => course._id === data.subject
        )!,
        class: fetchClassesState.data?.find(
          (class_) => class_._id === data.class
        )!,
        assessmentType: fetchAssessmentTypesState.data?.find(
          (type) => type._id === data.assessmentType
        )!,
        teacher: { name: "Dummy" } as TTeacher,
      };

      if (mode === "edit") {
        const i = old_assessments.findIndex((each) => each._id === data._id);

        if (i < 0) return;

        old_assessments[i] = {
          ...assessmentData,
        };

        setFetchAssessmentsState((prev) => ({
          ...prev,
          data: [...old_assessments],
        }));
      }
      if (mode === "delete") {
        const filtered_assessments = old_assessments.filter(
          (each) => each._id !== data._id
        );
        setFetchAssessmentsState((prev) => ({
          ...prev,
          data: [...filtered_assessments],
        }));
      }
      if (mode === "create") {
        const updated_assessments: TAssessment<"get">[] = [
          assessmentData,
          ...old_assessments,
        ];
        setFetchAssessmentsState((prev) => ({
          ...prev,
          data: updated_assessments,
        }));
      }
    },
    [
      fetchAcademicWeekState.data,
      fetchAssessmentTypesState.data,
      fetchAssessmentsState.data,
      fetchClassesState.data,
      fetchCoursesState.data,
    ]
  );

  /**
   * Function to retrieve the list of assessment types
   */
  const getAssessmentTypes = useCallback(async () => {
    try {
      // Display loading state
      setFetchAssessmentTypesState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/assessment/type`);

      const { data } = response;
      // Display data
      setFetchAssessmentTypesState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err) {
      // Display error state
      setFetchAssessmentTypesState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "Failed to load assessments types",
          status: 500,
          state: true,
        },
      }));
    } finally {
      // Remove loading state
      setFetchAssessmentTypesState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to retrieve the list of academic weeks
   */
  const getAcademicWeeks = useCallback(async () => {
    try {
      // Display loading state
      setFetchAcademicWeekState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/academic-weeks`);

      const { data } = response;
      // Display data
      setFetchAcademicWeekState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err) {
      // Display error state
      setFetchAcademicWeekState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "Failed to load academic weeks",
          status: 500,
          state: true,
        },
      }));
    } finally {
      // Remove loading state
      setFetchAcademicWeekState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to retrieve the list of classes
   */
  const geTClasses = useCallback(async () => {
    try {
      // Display loading state
      setFetchClassesState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/department/all`);

      const { data } = response;
      // Display data
      setFetchClassesState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err) {
      // Display error state
      setFetchClassesState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "Failed to load classes",
          status: 500,
          state: true,
        },
      }));
    } finally {
      // Remove loading state
      setFetchClassesState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to retrieve list of assessments
   */
  const fetchAssessments = useCallback(async () => {
    try {
      // Display loading state
      setFetchAssessmentsState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/api/v2/assessments`);

      const { data } = response;

      // If the list is not epty
      if (data?.data?.length > 0)
        // Display data
        return setFetchAssessmentsState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

      // Display 404 error state
      setFetchAssessmentsState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "No Assessments found",
          status: 404,
          state: true,
        },
      }));
    } catch (err: any) {
      const status = err?.response?.status;

      // Display error state
      setFetchAssessmentsState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message:
            status === 404
              ? "No Assessments found"
              : "Failed to load assessments.",
          status: status || 500,
          state: true,
        },
      }));
    } finally {
      // Remove loading state
      setFetchAssessmentsState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to create a new class
   */
  const createAssessment = useCallback(
    async (formState: TAssessment<"post">) => {
      try {
        // Display loading state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        delete formState._id;

        const form_data = new FormData();

        form_data.append("teacher", user?.id || "");
        form_data.append("course", formState.subject);
        form_data.append("class", formState.class);
        form_data.append("assessmentType", formState.assessmentType);
        form_data.append("academicWeek", formState.academicWeek);
        form_data.append("dueDate", formState.dueDate as string);
        form_data.append("description", formState.description);
        form_data.append("active", true as any);

        const response = await axiosInstance.post(
          `/api/v2/assessments`,
          form_data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const { data } = response;
        // Display data
        setCreateAssessmentState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // * Reset the fetch assessment error state
        setFetchAssessmentsState((prev) => ({
          ...prev,
          error: undefined,
        }));

        // Update the list of assessments
        updateAssessments(data?.data, "create");

        return true;
      } catch (err: any) {
        console.error("ERROR CREATING ASSESSMENT", err);
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || "Failed to create assessment",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateAssessmentState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateAssessments, user?.id]
  );

  /**
   * * Function responsible from retrieving the courses made by a teacher
   * @param filter The filter object, in the case of retriving courses via a filter, e.g. by their title
   */
  const getCourses = useCallback(
    async (filter?: { query: "title"; value: string }) => {
      setFetchCoursesState({
        data: [],
        loading: true,
        error: undefined,
      });

      try {
        // Call the reusable getCourses function, passing the seTClasses state updater
        const courses = await fetchCourses(filter);

        // console.log("Get courses res", courses);

        if (typeof courses === "object") {
          // Set the courses state to the fetched list of courses
          setFetchCoursesState({
            data: courses.data,
            loading: false,
            error: undefined,
          });
        } else {
          setFetchCoursesState({
            data: [],
            loading: false,
            error: courses,
          });
        }
        console.log(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    []
  );

  /**
   * Function to edit an existing class
   */
  const editAssessment = useCallback(
    async (formState: TAssessment<"post">) => {
      try {
        // Display loading state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.put(
          `/assessment/${formState._id}`,
          {
            ...formState,
          }
        );

        const { data } = response;
        // Display data
        setCreateAssessmentState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Update the class in the list of assessments
        updateAssessments(formState, "edit");

        return true;
      } catch (err: any) {
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || "Failed to update assessment",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateAssessmentState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateAssessments]
  );

  /**
   * Function to delete an existing class
   */
  const deleteAssessment = useCallback(
    async (formState: TAssessment<"post">) => {
      try {
        // Display loading state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.delete(
          `/assessments/${formState._id}`
        );

        const { data } = response;
        // Display data
        setCreateAssessmentState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Remove the class from the list of assessmentss
        updateAssessments(formState, "delete");

        return true;
      } catch (err: any) {
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: err?.response?.data?.message || "Failed to delete class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateAssessmentState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateAssessments]
  );

  useEffect(() => {
    fetchAssessments();
    getAssessmentTypes();
    getCourses();
    getAcademicWeeks();
    geTClasses();
  }, [
    fetchAssessments,
    getAssessmentTypes,
    getCourses,
    getAcademicWeeks,
    geTClasses,
  ]);

  return (
    <>
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode='create'
        handleModalClose={toogleModalCreate}
        modalOpen={openModalCreate}
        handleAction={createAssessment}
        requestState={createAssessmentState}
        subjects={
          fetchCoursesState.data.map((course) => ({
            display_value: course.title,
            value: course._id || "",
          })) || []
        }
        assessmentTypes={
          fetchAssessmentTypesState.data?.map((type) => ({
            display_value: type.name,
            value: type._id || "",
          })) || []
        }
        academicWeeks={
          fetchAcademicWeekState.data?.map((type) => ({
            display_value: `Week ${type.weekNumber}, ${new Date(
              type.startDate
            ).toDateString()} - ${new Date(type.endDate).toDateString()}, ${
              type.academicYear
            }`,
            value: type._id || "",
          })) || []
        }
        assessmenTClasses={
          fetchClassesState.data?.map((type) => ({
            display_value: type.name,
            value: type._id || "",
          })) || []
        }
      />
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode='edit'
        handleModalClose={toogleModalEdit}
        modalOpen={openModalEdit}
        handleAction={editAssessment}
        requestState={createAssessmentState}
        subjects={
          fetchCoursesState.data.map((course) => ({
            display_value: course.title,
            value: course._id || "",
          })) || []
        }
        assessmentTypes={
          fetchAssessmentTypesState.data?.map((type) => ({
            display_value: type.name,
            value: type._id || "",
          })) || []
        }
        academicWeeks={
          fetchAcademicWeekState.data?.map((type) => ({
            display_value: `Week ${type.weekNumber}, ${new Date(
              type.startDate
            ).toDateString()} - ${new Date(type.endDate).toDateString()}, ${
              type.academicYear
            }`,
            value: type._id || "",
          })) || []
        }
        assessmenTClasses={
          fetchClassesState.data?.map((type) => ({
            display_value: type.name,
            value: type._id || "",
          })) || []
        }
      />
      <TeachersWrapper
        isPublic={false}
        title='Assessments'
        metaTitle='Olive Grove ~ Assessments'
      >
        <div className='space-y-5 h-full'>
          <>
            <div className='flex flex-row items-center justify-between gap-4'>
              <div className='flex flex-col'>
                <span className='text-lg font-medium text-dark font-roboto'>
                  Explore your available assessments.
                </span>
                <span className='text-md text-subtext font-roboto'>
                  Manage, edit and create assessments.
                </span>
              </div>
              <Button size='xs' width='fit' onClick={toogleModalCreate}>
                <span>Create Assessment</span>
              </Button>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-6">
              {demo_assessments.map((assessment, index) => (
                <div key={index} className="mt-4 w-full space-y-2">
                  <TeacherCard
                    academicWeekDate={
                      (assessment.academicWeek as TAcademicWeek).weekNumber
                    }
                    key={index}
                    type="assessment"
                    teacher={assessment.teacher}
                    assessmentType={(assessment.type as TAssessmentType).name}
                    timeline={assessment.timeline}
                    assessmenTClass={(assessment.class as TClass).name}
                    subject={(assessment.subject as TCourse)?.title || ""}
                    actionClick={() =>
                      toogleModalEdit({
                        ...assessment,
                        academicWeek: assessment.academicWeek._id!,
                        class: assessment.class._id!,
                        subject: assessment.subject._id!,
                        type: assessment.type._id!,
                        teacher: assessment.teacher._id!,
                      })
                    }
                    btnLink1={() => {
                      router.push(
                        `/teachers/assessments/submissions/${assessment._id}`
                      );
                    }}
                    btnLink2={() =>
                      router.push(
                        `/teachers/assessments/questions/${assessment._id}`
                      )
                    }
                  />
                </div>
              ))}
            </div> */}

            {fetchAssessmentsState.loading ? (
              <div className='h-full w-full'>
                <Loader />
              </div>
            ) : fetchAssessmentsState.error ? (
              <>
                {typeof fetchAssessmentsState.error === "object" &&
                  (fetchAssessmentsState.error.status === 404 ? (
                    <NotFoundError msg={fetchAssessmentsState.error.message} />
                  ) : (
                    <ServerError msg={fetchAssessmentsState.error.message} />
                  ))}
              </>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-6'>
                  {fetchAssessmentsState.data.map((assessment, index) => (
                    <div key={index} className='mt-4 w-full space-y-2'>
                      <TeacherCard
                        academicWeekDate={
                          (assessment.academicWeek as TAcademicWeek)?.weekNumber
                        }
                        key={index}
                        type='assessment'
                        teacher={assessment?.teacher}
                        assessmentType={
                          (assessment?.assessmentType as TAssessmentType)?.name
                        }
                        timeline={assessment.dueDate}
                        assessmenTClass={(assessment?.class as TDepartment)?.name}
                        subject={(assessment?.subject as TCourse)?.title || ""}
                        actionClick={() =>
                          toogleModalEdit({
                            ...assessment,
                            academicWeek: assessment.academicWeek._id!,
                            class: assessment.class._id!,
                            subject: assessment.subject._id!,
                            assessmentType: assessment.assessmentType._id!,
                            teacher: assessment.teacher._id!,
                          })
                        }
                        btnLink1={() => {
                          router.push(
                            `/teachers/assessments/submissions/${assessment._id}`
                          );
                        }}
                        btnLink2={() =>
                          router.push(
                            `/teachers/assessments/questions/${assessment._id}`
                          )
                        }
                      />
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

export default withAuth("Teacher", Assessments);
