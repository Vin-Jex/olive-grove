import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import AssessmentCard from "@/components/Molecules/Card/AssessmentCard";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";
import NotFoundError from "@/components/Atoms/NotFoundError";
import ServerError from "@/components/Atoms/ServerError";
import Loader from "@/components/Atoms/Loader";
import {
  TAssessment,
  TAssessmentType,
  TCourse,
  TFetchState,
} from "@/components/utils/types";
import SwitchContentNav from "@/components/Molecules/Navs/SwitchContentNav";
import TeacherCard from "@/components/Molecules/Card/TeacherSubjectCard";
import AsssessmentModal from "@/components/Molecules/Modal/AsssessmentModal";
import { fetchCourses } from "@/components/utils/course";

const Assessments = () => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<TAssessment>({
    subject: "",
    type: "",
    description: "",
    timeline: "",
    meetingLink: "",
    teacherId: "",
    academicWeekDate: "",
    _id: "",
  });
  const [fetchAssessmentsState, setFetchAssessmentsState] = useState<
    TFetchState<TAssessment[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });
  const [createAssessmentState, setCreateAssessmentState] = useState<
    TFetchState<TAssessment | undefined>
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
      type: "",
      description: "",
      timeline: "",
      meetingLink: "",
      teacherId: "",
      academicWeekDate: "",
      _id: "",
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

  const toogleModalEdit = (existing_data?: TAssessment) => {
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

  const toogleModalDelete = (existing_data?: TAssessment) => {
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
    (data: TAssessment, mode: "edit" | "delete" | "create") => {
      const old_assessments = [...fetchAssessmentsState.data];

      if (mode === "edit") {
        const i = old_assessments.findIndex((each) => each._id === data._id);

        if (i < 0) return;

        old_assessments[i] = {
          ...data,
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
        const updated_assessments = [data, ...old_assessments];
        setFetchAssessmentsState((prev) => ({
          ...prev,
          data: updated_assessments,
        }));
      }
    },
    [fetchAssessmentsState.data]
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

      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");

      const response = await fetch(`${baseUrl}/assessment/type`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        // Display error state
        setFetchAssessmentTypesState((prev) => ({
          ...prev,
          loading: false,
          error: {
            message: "Failed to load assessments.",
            status: 500,
            state: true,
          },
        }));
      }

      const data = await response.json();
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

      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");

      const response = await fetch(`${baseUrl}/teacher/${userId}/assessments`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        // const errorData = await response.json();
        if (
          // response.status === "No lectures found for the provided teacher ID."
          response.status === 404
        ) {
          // Display error state
          setFetchAssessmentsState((prev) => ({
            data: [],
            loading: false,
            error: {
              message: "No assessments found for your profile.",
              status: 404,
              state: true,
            },
          }));
        } else {
          // Display error state
          setFetchAssessmentsState((prev) => ({
            ...prev,
            loading: false,
            error: {
              message: "Failed to load assessments.",
              status: 500,
              state: true,
            },
          }));
        }
        return;
      }

      const data = await response.json();
      // Display data
      setFetchAssessmentsState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err) {
      // Display error state
      setFetchAssessmentsState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "Failed to load assessments.",
          status: 500,
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
  const createAssessment = useCallback(async (formState: TAssessment) => {
    try {
      // Display loading state
      setCreateAssessmentState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");

      delete formState._id;

      const response = await fetch(`${baseUrl}/assessment`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ...formState, teacherId: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: errorData?.data || "Failed to create assessment",
        }));

        return false;
      }

      const data = await response.json();
      // Display data
      setCreateAssessmentState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));

      // Update the list of assessments
      updateAssessments(data?.data, "create");

      return true;
    } catch (err) {
      console.error("ERROR CREATING ASSESSMENT", err);
      // Display error state
      setCreateAssessmentState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to create assessment",
      }));

      return false;
    } finally {
      // Remove loading state
      setCreateAssessmentState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

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
        // Call the reusable getCourses function, passing the setClasses state updater
        const courses = await fetchCourses(filter);

        if (Array.isArray(courses)) {
          // Set the courses state to the fetched list of courses
          setFetchCoursesState({
            data: courses,
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
    async (formState: TAssessment) => {
      try {
        // Display loading state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const userId = Cookies.get("userId");
        const token = Cookies.get("jwt");

        const response = await fetch(
          `${baseUrl}/assessments/${formState._id}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(formState),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // Display error state
          setCreateAssessmentState((prev) => ({
            ...prev,
            loading: false,
            error: errorData?.data || "Failed to update assessment",
          }));

          return false;
        }

        const data = await response.json();
        // Display data
        setCreateAssessmentState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Update the class in the list of assessments
        updateAssessments(formState, "edit");

        return true;
      } catch (err) {
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to update assessment",
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
    async (formState: TAssessment) => {
      try {
        // Display loading state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const userId = Cookies.get("userId");
        const token = Cookies.get("jwt");

        const response = await fetch(
          `${baseUrl}/assessments/${formState._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // Display error state
          setCreateAssessmentState((prev) => ({
            ...prev,
            loading: false,
            error: errorData?.data || "Failed to delete class",
          }));

          return false;
        }

        const data = await response.json();
        // Display data
        setCreateAssessmentState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Remove the class from the list of assessmentss
        updateAssessments(formState, "delete");

        return true;
      } catch (err) {
        // Display error state
        setCreateAssessmentState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to delete class",
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
  }, []);

  return (
    <>
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode="create"
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
      />
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode="edit"
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
      />
      <TeachersWrapper
        title="Assessments"
        metaTitle="Olive Groove ~ Assessments"
      >
        <div className="space-y-5 h-full">
          <>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-lg font-medium text-dark font-roboto">
                  Explore your available assessments.
                </span>
                <span className="text-md text-subtext font-roboto">
                  Manage, edit and create assessments.
                </span>
              </div>
              <Button size="xs" width="fit" onClick={toogleModalCreate}>
                <span>Create Assessment</span>
              </Button>
            </div>

            {fetchAssessmentsState.loading ? (
              <div className="h-full w-full">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-6">
                  {fetchAssessmentsState.data.map((assessment, index) => (
                    <div key={index} className="mt-4 w-full space-y-2">
                      <TeacherCard
                        academicWeekDate={assessment.academicWeekDate}
                        key={index}
                        type="assessment"
                        timeline={assessment.timeline}
                        subject={assessment.subject as TCourse}
                        btnLink1={() => {}}
                        btnLink2={toogleModalEdit}
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
