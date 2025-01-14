import React, { useState, useEffect, useCallback, useMemo } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import Button from "@/components/Atoms/Button";
import Loader from "@/components/Atoms/Loader";
import { Table } from "@/components/Molecules/Table/Table";
import { CreateOrUpdateDepartmentModal } from "@/components/Molecules/Modal/CustomDepartmentModal";
import { TDepartment } from "@/components/utils/types";
import axiosInstance from "@/components/utils/axiosInstance";
import ErrorUI from "@/components/Atoms/ErrorComponent";
import AdminsWrapper from "@/components/Molecules/Layouts/Admin.Layout";
import toast from "react-hot-toast";
import WarningModal from "@/components/Molecules/Modal/WarningModal";
import { AxiosError } from "axios";
import { Delete, Edit } from "@mui/icons-material";

const initialState = {
  _id: "",
  name: "",
  description: "",
  category: "",
};

const Departments = () => {
  const [isOpen, setIsOpen] = useState({
    edit: false,
    delete: false,
    create: false,
  });
  const [isLoading, setIsLoading] = useState({
    edit: false,
    delete: false,
    create: false,
    fetch: false,
  });

  const [formState, setFormState] = useState<TDepartment>(initialState);
  const [departments, setDepartments] = useState<TDepartment[]>([initialState]);

  const toggleModal = useCallback(
    (type: keyof typeof isOpen, data?: TDepartment) => {
      setFormState(data || initialState);
      setIsOpen((prev) => ({ ...prev, [type]: !prev[type] }));
    },
    []
  );

  const handleDepartments = useCallback(
    (data: TDepartment, action: "create" | "edit" | "delete") => {
      setDepartments((prev) => {
        let updatedData = [...prev];
        switch (action) {
          case "create":
            updatedData = [data, ...updatedData];
            break;
          case "edit":
            const index = updatedData.findIndex(
              (item) => item._id === data._id
            );
            if (index > -1) updatedData[index] = data;
            break;
          case "delete":
            updatedData = updatedData.filter((item) => item._id !== data._id);
            break;
          default:
            break;
        }
        return { ...prev, updatedData };
      });
    },
    []
  );

  const fetchDepartmentsData = useCallback(async () => {
    setIsLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const response = await axiosInstance.get(`/department/all`, {
        withCredentials: true,
      });
      setDepartments(response.data?.data || []);
    } catch (error: any) {
      setDepartments([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  const handleRequest = async (
    url: string,
    method: "post" | "put" | "delete",
    data?: TDepartment
  ) => {
    try {
      const response = await axiosInstance[method](url, data, {
        withCredentials: true,
      });
      const departmentData = response.data?.data;

      if (method === "post") {
        handleDepartments(departmentData, "create");
        await fetchDepartmentsData();
        toast.success(
          response.data?.message || "Department created successfully!"
        );
      }
      if (method === "put") {
        handleDepartments(departmentData, "edit");
        await fetchDepartmentsData();
        toast.success(
          response.data?.message || "Department updated successfully!"
        );
      }
      if (method === "delete") {
        handleDepartments(data!, "delete");
        toast.success(
          response.data?.message || "Department deleted successfully!"
        );
      }
      return true;
    } catch (error: AxiosError | any) {
      const message = error?.response?.data?.message;
      toast.error(message || "Request Failed.");
      return false;
    }
  };

  const createDepartment = (formState: TDepartment) =>
    handleRequest(`/department`, "post", formState);

  const updateDepartment = (formState: TDepartment) =>
    handleRequest(`/department/${formState._id}`, "put", formState);

  const deleteDepartment = async (formState: TDepartment) => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    const success = await handleRequest(
      `/department/${formState._id}`,
      "delete",
      formState
    );

    if (success) {
      toggleModal("delete");
    }
    setIsLoading((prev) => ({ ...prev, delete: false }));
  };

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row);
  };

  const columns = useMemo(
    () => [
      { Header: "Department Name", accessor: "name" },
      { Header: "Department Category", accessor: "category" },
      { Header: "Department Description", accessor: "description" },
    ],
    []
  );

  const menuButtons = useMemo(
    () => [
      {
        title: "Edit",
        icon: (
          <svg
            width='14'
            height='14'
            viewBox='0 0 9 9'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1 8H1.7125L6.6 3.1125L5.8875 2.4L1 7.2875V8ZM0 9V6.875L6.6 0.2875C6.7 0.195833 6.8105 0.125 6.9315 0.075C7.0525 0.025 7.1795 0 7.3125 0C7.44583 0 7.575 0.025 7.7 0.075C7.825 0.125 7.93333 0.2 8.025 0.3L8.7125 1C8.8125 1.09167 8.8855 1.2 8.9315 1.325C8.9775 1.45 9.00033 1.575 9 1.7C9 1.83333 8.977 1.9605 8.931 2.0815C8.885 2.2025 8.81217 2.31283 8.7125 2.4125L2.125 9H0ZM6.2375 2.7625L5.8875 2.4L6.6 3.1125L6.2375 2.7625Z'
              fill='#32A8C4'
            />
          </svg>
        ),
        onClick: (data: any) => {
          toggleModal("edit", data);
        },
      },
      {
        title: "Delete",
        icon: (
          <svg
            width='14'
            height='14'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M2.66675 12C2.30008 12 1.98608 11.8693 1.72475 11.608C1.46341 11.3467 1.33297 11.0329 1.33341 10.6667V2H0.666748V0.666667H4.00008V0H8.00008V0.666667H11.3334V2H10.6667V10.6667C10.6667 11.0333 10.5361 11.3473 10.2747 11.6087C10.0134 11.87 9.69964 12.0004 9.33342 12H2.66675ZM9.33342 2H2.66675V10.6667H9.33342V2ZM4.00008 9.33333H5.33342V3.33333H4.00008V9.33333ZM6.66675 9.33333H8.00008V3.33333H6.66675V9.33333Z'
              fill='#32A8C4'
            />
          </svg>
        ),
        onClick: (data: any) => {
          toggleModal("delete", data);
        },
      },
    ],
    [toggleModal]
  );

  useEffect(() => {
    fetchDepartmentsData();
  }, [fetchDepartmentsData]);

  return (
    <>
      <CreateOrUpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        mode='create'
        handleModalClose={() => toggleModal("create")}
        modalOpen={isOpen.create}
        handleAction={createDepartment}
      />
      <CreateOrUpdateDepartmentModal
        formState={formState}
        setFormState={setFormState}
        mode='update'
        handleModalClose={() => toggleModal("edit")}
        modalOpen={isOpen.edit}
        handleAction={updateDepartment}
      />
      <WarningModal
        modalOpen={isOpen.delete}
        isLoading={isLoading.delete}
        handleModalClose={() => toggleModal("delete")}
        handleConfirm={() => {
          deleteDepartment(formState);
        }}
        content='Are you sure you want to delete this department?'
        subtext='This department will be deleted permanently.'
      />
      <AdminsWrapper
        isPublic={true}
        title='Departments'
        metaTitle='Olive Grove - Departments'
      >
        <div className='space-y-5 h-full'>
          {isLoading.fetch ? (
            <Loader />
          ) : (
            <>
              <div className='flex justify-between items-center'>
                <div>
                  <h1 className='text-lg font-bold'>
                    Explore Your Departments
                  </h1>
                  <p className='text-gray-500'>
                    Manage, edit, and create departments.
                  </p>
                </div>
                <Button
                  size='xs'
                  width='fit'
                  onClick={() => toggleModal("create")}
                >
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

              {departments.length === 0 ? (
                <ErrorUI msg='No department has been created.' status={404} />
              ) : (
                <Table
                  columns={columns}
                  data={departments}
                  onRowClick={handleRowClick}
                  actions={menuButtons}
                />
                // <Table
                //   columns={columns}
                //   data={departments}
                //   onRowClick={handleRowClick}
                //   actions={menuButtons}
                // >
                //   {(data: TDepartment) => (
                //     <EachClass
                //       key={data._id}
                //       data={data}
                //       toogleModalDelete={() => toggleModal("delete", data)}
                //       toogleModalEdit={() => toggleModal("edit", data)}
                //     />
                //   )}
                // </Table>
              )}
            </>
          )}
        </div>
      </AdminsWrapper>
    </>
  );
};

export default withAuth("Admin", Departments);
