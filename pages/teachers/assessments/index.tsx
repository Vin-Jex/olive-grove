import React, { useState, useEffect, useCallback } from 'react';
import withAuth from '@/components/Molecules/WithAuth';
import TeachersWrapper from '@/components/Molecules/Layouts/Teacher.Layout';
import Button from '@/components/Atoms/Button';
import { useRouter } from 'next/router';
import ErrorUI from '@/components/Atoms/ErrorComponent';
import Loader from '@/components/Atoms/Loader';
import {
  TAcademicWeek,
  TAssessment,
  TAssessmentType,
  TDepartment,
  TCourse,
  TTeacher,
  TErrorStatus,
  THandleSearchChange,
  TErrorState,
} from '@/components/utils/types';
import TeacherCard from '@/components/Molecules/Card/TeacherSubjectCard';
import AsssessmentModal from '@/components/Molecules/Modal/AsssessmentModal';
import { fetchCourses } from '@/components/utils/course';
import axiosInstance from '@/components/utils/axiosInstance';
import { useAuth } from '@/contexts/AuthContext';
import { Add } from '@mui/icons-material';
import Select from '@/components/Atoms/Select';
import SearchInput from '@/components/Atoms/SearchInput';
import toast from 'react-hot-toast';

const Assessments = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<TAssessment<"post">>({
    _id: "",
    course: "",
    assessmentType: "",
    description: "",
    dueDate: "",
    teacher: "",
    academicWeek: "",
    department: "",
    title: "",
    active: false,
  });
  const [searchResults, setSearchResults] = useState<TAssessment<'get'>[]>([]);

  const [apiState, setApiState] = useState({
    courses: { data: [] as TCourse[], loading: false, error: undefined },
    assessments: {
      data: [] as TAssessment<'get'>[],
      loading: false,
      error: undefined as undefined | string | TErrorState,
    },
    academicWeeks: {
      data: [] as TAcademicWeek[],
      loading: false,
      error: undefined as undefined | string | TErrorState,
    },
    assessmentTypes: {
      data: [] as TAssessmentType[],
      loading: false,
      error: undefined as undefined | string | TErrorState,
    },
    departments: {
      data: [] as TDepartment[],
      loading: false,
      error: undefined as undefined | string | TErrorState,
    },
  });

  const setApiData = useCallback(
    (
      key: keyof typeof apiState,
      newState: Partial<(typeof apiState)[keyof typeof apiState]>
    ) => {
      setApiState((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...newState },
      }));
    },
    []
  );

  const clearFormState = () => {
    setFormState({
      course: '',
      assessmentType: '',
      description: '',
      dueDate: '',
      teacher: '',
      academicWeek: '',
      title: '',
      department: '',
      active: false,
    });
  };

  const toggleModalCreate = () => {
    clearFormState();
    setApiData('assessments', {
      loading: false,
      error: undefined,
      data: [],
    });
    setOpenModalCreate(!openModalCreate);
  };

  const toggleModalEdit = (existing_data?: TAssessment<'post'>) => {
    if (openModalEdit) {
      clearFormState();
      setApiData('assessments', {
        loading: false,
        error: undefined,
        data: [],
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalEdit((prev) => !prev);
  };

  const toggleModalDelete = (existing_data?: TAssessment<'post'>) => {
    if (openModalDelete) {
      clearFormState();
      setApiData('assessments', {
        loading: false,
        error: undefined,
        data: [],
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalDelete((prev) => !prev);
  };

  const updateAssessments = useCallback(
    (data: TAssessment<'post'>, mode: 'edit' | 'delete' | 'create') => {
      const old_assessments = [...apiState.assessments.data];

      const academicWeek =
        apiState.academicWeeks.data.find(
          (week) => week._id === data.academicWeek
        ) || ({} as TAcademicWeek);
      const course =
        apiState.courses.data?.find((course) => course._id === data.course) ||
        ({} as TCourse);
      const department =
        apiState.departments.data?.find(
          (class_) => class_._id === data.department
        ) || ({} as TDepartment);
      const assessmentType =
        apiState.assessmentTypes.data?.find(
          (type) => type._id === data.assessmentType
        ) || ({} as TAssessmentType);

      const assessmentData: TAssessment<'get'> = {
        ...data,
        academicWeek,
        course,
        department,
        assessmentType,
        teacher: { name: '' } as TTeacher,
      };

      if (mode === 'edit') {
        const i = old_assessments.findIndex((each) => each._id === data._id);
        if (i < 0) return;

        old_assessments[i] = {
          ...assessmentData,
        };

        setApiData('assessments', {
          data: [...old_assessments],
        });
      }

      if (mode === 'delete') {
        const filtered_assessments = old_assessments.filter(
          (each) => each._id !== data._id
        );

        setApiData('assessments', {
          data: [...filtered_assessments],
        });
      }

      if (mode === 'create') {
        const updated_assessments: TAssessment<'get'>[] = [
          assessmentData,
          ...old_assessments,
        ];
        setApiData('assessments', {
          data: updated_assessments,
        });
      }
    },
    [
      apiState.academicWeeks.data,
      apiState.assessmentTypes.data,
      apiState.assessments.data,
      apiState.courses.data,
      apiState.departments.data,
      setApiData,
    ]
  );

  const editAssessment = useCallback(
    async (formState: TAssessment<'post'>) => {
      try {
        setApiData('assessments', {
          loading: true,
          error: undefined,
        });

        const response = await axiosInstance.put(
          `/assessment/${formState._id}`,
          {
            ...formState,
          }
        );

        const { data } = response;

        setApiData('assessments', {
          loading: true,
          error: undefined,
          data: data?.data,
        });

        updateAssessments(formState, 'edit');

        return true;
      } catch (err: any) {
        setApiData('assessments', {
          loading: true,
          error: undefined,
        });
        toast.error(
          err?.response?.data?.message || 'Failed to update assessment'
        );

        return false;
      }
    },
    [setApiData, updateAssessments]
  );

  const getAssessmentTypes = useCallback(async () => {
    try {
      setApiData('assessmentTypes', { loading: true });
      const response = await axiosInstance.get(`/assessment/type`);
      const { data } = response;
      setApiData('assessmentTypes', { loading: false, data: data?.data });
    } catch (err) {
      setApiData('assessmentTypes', {
        loading: false,
        error: {
          message: 'Failed to load assessments types',
          status: 500,
          state: true,
        },
      });
    }
  }, [setApiData]);

  const getAcademicWeeks = useCallback(async () => {
    try {
      setApiData('academicWeeks', { loading: true, error: undefined });
      const response = await axiosInstance.get(`/academic-weeks`);
      const { data } = response;
      setApiData('academicWeeks', { data: data?.data, loading: false });
    } catch (err) {
      setApiData('academicWeeks', {
        loading: false,
        error: {
          message: 'Failed to load academic weeks',
          status: 500,
          state: true,
        },
      });
    }
  }, [setApiData]);

  const geTClasses = useCallback(async () => {
    try {
      setApiData('departments', { loading: true, error: undefined });
      const response = await axiosInstance.get(`/department/all`);
      const { data } = response;
      setApiData('departments', { data: data?.data, loading: false });
    } catch (err) {
      setApiData('departments', {
        loading: false,
        error: { message: 'Failed to load classes', status: 500, state: true },
      });
    }
  }, [setApiData]);

  const fetchAssessments = useCallback(async () => {
    try {
      setApiData('assessments', { loading: true });
      const response = await axiosInstance.get(`/api/v2/assessments`);
      const { data } = response;
      if (data?.data && data.data.length > 0) {
        setApiData('assessments', { data: data?.data, loading: false });
        setSearchResults(data?.data);
      } else {
        setApiData('assessments', {
          loading: false,
          error: { message: 'No Assessments found', status: 404, state: true },
        });
        setSearchResults([]);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      setApiData('assessments', {
        loading: false,
        error: {
          message:
            status === 404
              ? 'No Assessments found'
              : 'Failed to load assessments.',
          status: status || 500,
          state: true,
        },
      });
      setSearchResults([]);
    }
  }, [setApiData]);

  const createAssessment = useCallback(
    async (formState: TAssessment<'post'>) => {
      try {
        setApiData('assessments', { loading: true });
        delete formState._id;
        const form_data = new FormData();
        form_data.append('teacher', user?.id || '');
        form_data.append('course', formState.course);
        form_data.append('department', formState.department);
        form_data.append('assessmentType', formState.assessmentType);
        form_data.append('academicWeek', formState.academicWeek);
        form_data.append('dueDate', formState.dueDate as string);
        form_data.append('description', formState.description);
        form_data.append('title', formState.title);
        form_data.append('active', true as any);

        const response = await axiosInstance.post(
          `/api/v2/assessments`,
          form_data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const { data } = response;
        setApiData('assessments', {
          data: [...apiState.assessments.data, data?.data],
          loading: false,
        });
        return true;
      } catch (err: any) {
        setApiData('assessments', { loading: false });
        toast.error(
          err.response.data?.message || 'Failed to create assessment'
        );
        return false;
      }
    },
    [apiState.assessments.data, setApiData, user?.id]
  );

  const handleSearchChange: THandleSearchChange<any> = (
    e,
    { setSearchResults, initialData, setSearchValue }
  ) => {
    const inputValue = e.target.value?.toLowerCase();
    setSearchValue(inputValue);

    // Perform filtering based on input value
    const filteredResults = initialData?.filter((result) => {
      // Add checks to prevent null or undefined access errors
      const courseName = result?.title?.toLowerCase() || '';

      return courseName.includes(inputValue?.trim());
    });

    setSearchResults(filteredResults);
  };

  const handleClassFilter: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void = ({ target: { value } }) => {

    if (!value || value.includes('Select class')) return;
    setApiData('assessments', {
      data: [...apiState.assessments.data],
    });

    const filteredResults = apiState.assessments.data.filter(
      (result) => result?.department?._id === value
    );

    setApiData('assessments', {
      data: filteredResults,
    });
  };

  useEffect(() => {
    fetchAssessments();
    getAssessmentTypes();
    fetchCourses();
    getAcademicWeeks();
    geTClasses();
  }, [fetchAssessments, getAssessmentTypes, getAcademicWeeks, geTClasses]);

  return (
    <>
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode='create'
        handleModalClose={toggleModalCreate}
        modalOpen={openModalCreate}
        handleAction={createAssessment}
        requestState={apiState.assessments}
        subjects={
          apiState.courses?.data?.map((course) => ({
            display_value: course?.title ?? "Not Specified",
            value: course?._id ?? "",
          })) ?? []
        }
        assessmentTypes={
          apiState.assessmentTypes?.data?.map((type) => ({
            display_value: type?.name ?? "Not Specified",
            value: type?._id ?? "",
          })) ?? []
        }
        academicWeeks={
          apiState.academicWeeks?.data?.map((type) => ({
            display_value: `Week ${type?.weekNumber ?? 'N/A'}, ${new Date(
              type?.startDate ?? ''
            ).toDateString()} - ${new Date(
              type?.endDate ?? ''
            ).toDateString()}, ${type?.academicYear ?? 'Not Specified'}`,
            value: type?._id ?? '',
          })) ?? []
        }
        assessmenTClasses={
          apiState.departments?.data?.map((type) => ({
            display_value: type?.name ?? 'Not Specified',
            value: type?._id ?? '',
          })) ?? []
        }
      />
      <AsssessmentModal
        formState={formState}
        setFormState={setFormState}
        mode='edit'
        handleModalClose={toggleModalEdit}
        modalOpen={openModalEdit}
        handleAction={editAssessment}
        requestState={apiState.assessments}
        subjects={
          apiState.courses?.data?.map((course) => ({
            display_value: course?.title ?? 'Not Specified',
            value: course?._id ?? '',
          })) ?? []
        }
        assessmentTypes={
          apiState.assessmentTypes?.data?.map((type) => ({
            display_value: type?.name ?? 'Not Specified',
            value: type?._id ?? '',
          })) ?? []
        }
        academicWeeks={
          apiState.academicWeeks?.data?.map((type) => ({
            display_value: `Week ${type?.weekNumber ?? 'N/A'}, ${new Date(
              type?.startDate ?? ''
            ).toDateString()} - ${new Date(
              type?.endDate ?? ''
            ).toDateString()}, ${type?.academicYear ?? 'Not Specified'}`,
            value: type?._id ?? '',
          })) ?? []
        }
        assessmenTClasses={
          apiState.departments?.data?.map((type) => ({
            display_value: type?.name ?? 'Not Specified',
            value: type?._id ?? '',
          })) ?? []
        }
      />
      <TeachersWrapper
        isPublic={false}
        title='Olive Grove - Assessments'
        metaTitle='Olive Grove - Assessments'
      >
        <div className='space-y-5 h-full'>
          {apiState.assessments?.loading ? (
            <div className='h-full w-full'>
              <Loader />
            </div>
          ) : (
            <>
              {!apiState.assessments?.error && (
                <div className='flex items-start justify-start gap-4 flex-col md:justify-between md:flex-row xl:gap-0 xl:items-center'>
                  <div className='flex justify-start items-center gap-4 w-full md:w-auto'>
                    <SearchInput
                      shape='rounded-lg'
                      placeholder='Search for assessment'
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      initialData={apiState.assessments?.data}
                      handleInputChange={handleSearchChange}
                    />

                    <Select
                      options={
                        apiState.departments?.data?.map((type) => ({
                          display_value: type?.name ?? 'Unknown Department',
                          value: type?._id ?? '',
                        })) ?? []
                      }
                      name='department'
                      required
                      onChange={handleClassFilter}
                      placeholder='Department'
                      inputSize='sm'
                      className='!py-3 max-w-[9rem]'
                    />
                  </div>
                  <div>
                    <Button onClick={toggleModalCreate} width='fit' size='xs'>
                      <Add />
                      <span>Create Assessment</span>
                    </Button>
                  </div>
                </div>
              )}

              {apiState.assessments.error ? (
                <div className='w-full flex items-center justify-center'>
                  {typeof apiState.assessments.error === 'object' &&
                    apiState.assessments.error.status && (
                      <ErrorUI
                        msg={apiState.assessments.error.message || undefined}
                        status={
                          apiState.assessments.error.status as TErrorStatus
                        }
                      />
                    )}
                  {typeof apiState.assessments.error === 'string' && (
                    <ErrorUI msg={apiState.assessments.error} status={500} />
                  )}
                </div>
              ) : searchResults.length < 1 ? (
                // 404 image
                <div className='w-full h-[70vh] flex items-center justify-center'>
                  <ErrorUI msg='No assessment found' status={404} />
                </div>
              ) : (
                <div className='mt-4'>
                  {/* Courses */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-7 2xl:gap-10 mt-4'>
                    {searchResults &&
                      searchResults.map((assessment, index) => (
                        <TeacherCard
                          key={index}
                          assessment={assessment}
                          academicWeekDate={
                            (assessment.academicWeek as TAcademicWeek)
                              ?.weekNumber ?? 'Not Specified'
                          }
                          type='assessment'
                          assessmentType={
                            (assessment?.assessmentType as TAssessmentType)
                              ?.name ?? 'Not Specified'
                          }
                          timeline={assessment?.dueDate ?? 'Not Specified'}
                          assessmenTClass={
                            (assessment?.department as TDepartment)?.name ??
                            'Not Specified'
                          }
                          course={(assessment?.course as TCourse)?.title ?? ''}
                          actionClick={() =>
                            toggleModalEdit({
                              ...assessment,
                              academicWeek: assessment.academicWeek?._id ?? '',
                              department: assessment.department?._id ?? '',
                              course: assessment.course?._id ?? '',
                              assessmentType:
                                assessment.assessmentType?._id ?? '',
                              teacher: assessment.teacher?._id ?? '',
                            })
                          }
                          btnLink1={() => {
                            router.push(
                              `/teachers/assessments/questions/${assessment?._id}`
                            );
                          }}
                          btnLink2={() => {
                            toggleModalEdit();
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth('Teacher', Assessments);
