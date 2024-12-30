import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import Button from "@/components/Atoms/Button";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import ServerError from "@/components/Atoms/ServerError";
import Loader from "@/components/Atoms/Loader";
import { Table } from "@/components/Molecules/Table/Table";
import {
  CreateOrUpdateDepartmentModal,
  DeleteDepartmentModal,
} from "@/components/Molecules/Modal/CustomDepartmentModal";
import EachClass from "@/components/Atoms/Class/EachClass";
import { TDepartment, TFetchState } from "@/components/utils/types";
import axiosInstance from "@/components/utils/axiosInstance";

const Departments = () => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<TDepartment>({
    name: "",
    category: "",
    description: "",
    _id: "",
  });
  const [fetchDepartments, setFetchDepartments] = useState<
    TFetchState<TDepartment[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });
  const [createDepartments, setCreateDepartments] = useState<
    TFetchState<TDepartment | undefined>
  >({
    data: { category: "", name: "", description: "" },
    error: undefined,
    loading: false,
  });

  const toogleModalCreate = () => {
    setFormState({ category: "", description: "", name: "", _id: "" });
    setCreateDepartments({
      data: undefined,
      loading: false,
      error: undefined,
    });
    setOpenModalCreate(!openModalCreate);
  };

  const toogleModalEdit = (existing_data?: TDepartment) => {
    if (openModalEdit) {
      setFormState({ category: "", description: "", name: "", _id: "" });
      setCreateDepartments({
        data: undefined,
        loading: false,
        error: undefined,
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalEdit((prev) => !prev);
  };

  const toogleModalDelete = (existing_data?: TDepartment) => {
    if (openModalDelete) {
      setFormState({ category: "", description: "", name: "", _id: "" });
      setCreateDepartments({
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
  const updateClasses = useCallback(
    (data: TDepartment, mode: "edit" | "delete" | "create") => {
      const old_departments = [...fetchDepartments.data];

      if (mode === "edit") {
        const i = old_departments.findIndex((each) => each._id === data._id);

        if (i < 0) return;

        old_departments[i] = {
          ...data,
        };

        setFetchDepartments((prev) => ({
          ...prev,
          data: [...old_departments],
        }));
      }
      if (mode === "delete") {
        const filtered_departments = old_departments.filter(
          (each) => each._id !== data._id
        );
        setFetchDepartments((prev) => ({
          ...prev,
          data: [...filtered_departments],
        }));
      }
      if (mode === "create") {
        setFetchDepartments((prev) => ({
          ...prev,
          data: [data, ...old_departments],
        }));
      }
    },
    [fetchDepartments.data]
  );

  /**
   * Function to create a new class
   */
  const fetchClasses = useCallback(async () => {
    try {
      // Display loading state
      setFetchDepartments((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/department/all`, {
        withCredentials: true,
      });

      const { data } = response;
      // Display data
      setFetchDepartments((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err: any) {
      if (err?.response.status === 404) {
        // Display error state
        setFetchDepartments((prev) => ({
          data: [],
          loading: false,
          error: {
            message: "No departments found for your profile.",
            status: 404,
            state: true,
          },
        }));
      } else {
        // Display error state
        setFetchDepartments((prev) => ({
          ...prev,
          loading: false,
          error: {
            message: "Failed to load departments.",
            status: 500,
            state: true,
          },
        }));
      }
    } finally {
      // Remove loading state
      setFetchDepartments((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to create a new class
   */
  const createClass = useCallback(
    async (formState: TDepartment) => {
      try {
        // Display loading state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        delete formState._id;

        const response = await axiosInstance.post(
          `/departments`,
          {
            ...formState,
          },
          { withCredentials: true }
        );

        const { data } = response;
        // Display data
        setCreateDepartments((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Add the newly created class to the list of departments
        updateClasses(data.data, "create");

        return true;
      } catch (err) {
        console.error("ERROR CREATING CLASS", err);
        // Display error state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to create class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateDepartments((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  /**
   * Function to edit an existing class
   */
  const updateDepartment = useCallback(
    async (formState: TDepartment) => {
      try {
        // Display loading state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.put(
          `/departments/${formState._id}`,
          {
            ...formState,
          },
          { withCredentials: true }
        );

        const { data } = response;
        // Display data
        setCreateDepartments((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Update the class in the list of departments
        updateClasses(formState, "edit");

        return true;
      } catch (err) {
        // Display error state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to update class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateDepartments((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  /**
   * Function to delete an existing class
   */
  const deleteDepartment = useCallback(
    async (formState: TDepartment) => {
      try {
        // Display loading state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.delete(
          `/departments/${formState._id}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;
        // Display data
        setCreateDepartments((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Remove the class from the list of DepartmentsS
        updateClasses(formState, "delete");

        return true;
      } catch (err) {
        // Display error state
        setCreateDepartments((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to delete class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateDepartments((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <>
      <CreateOrUpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        mode='create'
        handleModalClose={toogleModalCreate}
        modalOpen={openModalCreate}
        handleAction={createClass}
        requestState={createDepartments}
      />
      <CreateOrUpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        mode='update'
        handleModalClose={toogleModalEdit}
        modalOpen={openModalEdit}
        requestState={createDepartments}
        handleAction={updateDepartment}
      />
      <DeleteDepartmentModal
        formState={formState}
        handleModalClose={toogleModalDelete}
        modalOpen={openModalDelete}
        requestState={createDepartments}
        handleAction={deleteDepartment}
      />
      <TeachersWrapper
        isPublic={true}
        title='Departments'
        metaTitle='Olive Grove ~ Departments'
      >
        <div className='space-y-5 h-full'>
          {fetchDepartments.loading ? (
            <div className='h-full w-full'>
              <Loader />
            </div>
          ) : (
            <>
              {typeof fetchDepartments.error === "object" &&
              fetchDepartments.error.status === 500 ? (
                <ServerError msg={fetchDepartments.error.message} />
              ) : (
                <>
                  {/* Title */}
                  <div className='flex flex-row items-center justify-between gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-lg font-medium text-dark font-roboto'>
                        Explore your departments
                      </span>
                      <span className='text-md text-subtext font-roboto'>
                        Manage, edit and create departments.
                      </span>
                    </div>
                    <Button size='xs' width='fit' onClick={toogleModalCreate}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z'
                          fill='#FDFDFD'
                        />
                      </svg>
                      <span>Create Department</span>
                    </Button>
                  </div>

                  {/* Course list */}
                  <Table
                    head_columns={[
                      "Class Name",
                      "Class Category",
                      { value: "Actions", className: "!w-auto" },
                    ]}
                    data={fetchDepartments.data}
                  >
                    {(data: TDepartment) => (
                      <EachClass
                        data={data}
                        key={data._id}
                        toogleModalDelete={toogleModalDelete}
                        toogleModalEdit={toogleModalEdit}
                      />
                    )}
                  </Table>
                </>
              )}
            </>
          )}
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Departments);
