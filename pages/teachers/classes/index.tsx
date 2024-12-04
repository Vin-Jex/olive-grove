import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import Button from "@/components/Atoms/Button";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { baseUrl } from "@/components/utils/baseURL";
import ServerError from "@/components/Atoms/ServerError";
import Loader from "@/components/Atoms/Loader";
import { Table } from "@/components/Molecules/Table/Table";
import {
  CreateOrEditClassModal,
  DeleteClassModal,
} from "@/components/Molecules/Modal/CustomClassModal";
import EachClass from "@/components/Atoms/Class/EachClass";
import { TClass, TFetchState } from "@/components/utils/types";
import axiosInstance from "@/components/utils/axiosInstance";

const Classes = () => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [formState, setFormState] = useState<TClass>({
    name: "",
    category: "",
    description: "",
    _id: "",
  });
  const [fetchClassesState, setFetchClassesState] = useState<
    TFetchState<TClass[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });
  const [createClasseState, setCreateClasseState] = useState<
    TFetchState<TClass | undefined>
  >({
    data: { category: "", name: "", description: "" },
    error: undefined,
    loading: false,
  });

  const toogleModalCreate = () => {
    setFormState({ category: "", description: "", name: "", _id: "" });
    setCreateClasseState({
      data: undefined,
      loading: false,
      error: undefined,
    });
    setOpenModalCreate(!openModalCreate);
  };

  const toogleModalEdit = (existing_data?: TClass) => {
    if (openModalEdit) {
      setFormState({ category: "", description: "", name: "", _id: "" });
      setCreateClasseState({
        data: undefined,
        loading: false,
        error: undefined,
      });
    } else existing_data && setFormState(existing_data);
    setOpenModalEdit((prev) => !prev);
  };

  const toogleModalDelete = (existing_data?: TClass) => {
    if (openModalDelete) {
      setFormState({ category: "", description: "", name: "", _id: "" });
      setCreateClasseState({
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
    (data: TClass, mode: "edit" | "delete" | "create") => {
      const old_classes = [...fetchClassesState.data];

      if (mode === "edit") {
        const i = old_classes.findIndex((each) => each._id === data._id);

        if (i < 0) return;

        old_classes[i] = {
          ...data,
        };

        setFetchClassesState((prev) => ({
          ...prev,
          data: [...old_classes],
        }));
      }
      if (mode === "delete") {
        const filtered_classes = old_classes.filter(
          (each) => each._id !== data._id
        );
        setFetchClassesState((prev) => ({
          ...prev,
          data: [...filtered_classes],
        }));
      }
      if (mode === "create") {
        setFetchClassesState((prev) => ({
          ...prev,
          data: [data, ...old_classes],
        }));
      }
    },
    [fetchClassesState.data]
  );

  /**
   * Function to create a new class
   */
  const fetchClasses = useCallback(async () => {
    try {
      // Display loading state
      setFetchClassesState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const response = await axiosInstance.get(`/classes/all`, {
        withCredentials: true,
      });

      const { data } = response;
      // Display data
      setFetchClassesState((prev) => ({
        data: data?.data,
        loading: false,
        error: undefined,
      }));
    } catch (err: any) {
      if (err?.response.status === 404) {
        // Display error state
        setFetchClassesState((prev) => ({
          data: [],
          loading: false,
          error: {
            message: "No classes found for your profile.",
            status: 404,
            state: true,
          },
        }));
      } else {
        // Display error state
        setFetchClassesState((prev) => ({
          ...prev,
          loading: false,
          error: {
            message: "Failed to load classes.",
            status: 500,
            state: true,
          },
        }));
      }
    } finally {
      // Remove loading state
      setFetchClassesState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Function to create a new class
   */
  const createClass = useCallback(
    async (formState: TClass) => {
      try {
        // Display loading state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        delete formState._id;

        const response = await axiosInstance.post(
          `/classes`,
          {
            ...formState,
          },
          { withCredentials: true }
        );

        const { data } = response;
        // Display data
        setCreateClasseState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Add the newly created class to the list of classes
        updateClasses(data.data, "create");

        return true;
      } catch (err) {
        console.error("ERROR CREATING CLASS", err);
        // Display error state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to create class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateClasseState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  /**
   * Function to edit an existing class
   */
  const editClass = useCallback(
    async (formState: TClass) => {
      try {
        // Display loading state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.put(
          `/classes/${formState._id}`,
          {
            ...formState,
          },
          { withCredentials: true }
        );

        const { data } = response;
        // Display data
        setCreateClasseState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Update the class in the list of classes
        updateClasses(formState, "edit");

        return true;
      } catch (err) {
        // Display error state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to update class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateClasseState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  /**
   * Function to delete an existing class
   */
  const deleteClass = useCallback(
    async (formState: TClass) => {
      try {
        // Display loading state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: true,
          error: undefined,
        }));

        const response = await axiosInstance.delete(
          `/classes/${formState._id}`,
          {
            withCredentials: true,
          }
        );

        const { data } = response;
        // Display data
        setCreateClasseState((prev) => ({
          data: data?.data,
          loading: false,
          error: undefined,
        }));

        // Remove the class from the list of classess
        updateClasses(formState, "delete");

        return true;
      } catch (err) {
        // Display error state
        setCreateClasseState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to delete class",
        }));

        return false;
      } finally {
        // Remove loading state
        setCreateClasseState((prev) => ({ ...prev, loading: false }));
      }
    },
    [updateClasses]
  );

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <>
      <CreateOrEditClassModal
        formState={formState}
        setFormState={setFormState}
        mode="create"
        handleModalClose={toogleModalCreate}
        modalOpen={openModalCreate}
        handleAction={createClass}
        requestState={createClasseState}
      />
      <CreateOrEditClassModal
        formState={formState}
        setFormState={setFormState}
        mode="edit"
        handleModalClose={toogleModalEdit}
        modalOpen={openModalEdit}
        requestState={createClasseState}
        handleAction={editClass}
      />
      <DeleteClassModal
        formState={formState}
        handleModalClose={toogleModalDelete}
        modalOpen={openModalDelete}
        requestState={createClasseState}
        handleAction={deleteClass}
      />
      <TeachersWrapper title="Classes" metaTitle="Olive Groove ~ Classes">
        <div className="space-y-5 h-full">
          {fetchClassesState.loading ? (
            <div className="h-full w-full">
              <Loader />
            </div>
          ) : (
            <>
              {typeof fetchClassesState.error === "object" &&
              fetchClassesState.error.status === 500 ? (
                <ServerError msg={fetchClassesState.error.message} />
              ) : (
                <>
                  {/* Title */}
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-dark font-roboto">
                        Explore your classes
                      </span>
                      <span className="text-md text-subtext font-roboto">
                        Manage, edit and create classes.
                      </span>
                    </div>
                    <Button size="xs" width="fit" onClick={toogleModalCreate}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z"
                          fill="#FDFDFD"
                        />
                      </svg>
                      <span>Create Class</span>
                    </Button>
                  </div>

                  {/* Course list */}
                  <Table
                    head_columns={[
                      "Class Name",
                      "Class Category",
                      { value: "Actions", className: "!w-auto" },
                    ]}
                    data={fetchClassesState.data}
                  >
                    {(data: TClass) => (
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

export default withAuth("Teacher", Classes);
