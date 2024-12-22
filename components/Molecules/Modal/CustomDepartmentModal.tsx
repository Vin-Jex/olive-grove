import React, { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import Button, { ButtonProps } from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import Select from "@/components/Atoms/Select";
import { TDepartment, TFetchState } from "@/components/utils/types";
import { CircularProgress } from "@mui/material";
import { Info } from "@mui/icons-material";

type DepartmentsModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: (formData: TDepartment) => Promise<boolean>;
  requestState?: TFetchState<any>;
  mode: "create" | "update";
  formState: TDepartment;
  setFormState: React.Dispatch<React.SetStateAction<TDepartment>>;
};

/**
 * Component for creating or editing a Department
 * @returns JSX.Element
 */
export const CreateOrUpdateDepartmentModal = ({
  modalOpen,
  mode,
  handleModalClose,
  handleAction,
  requestState,
  formState,
  setFormState,
}: DepartmentsModalProps) => {
  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [is_loading, setIsLoading] = useState({
    saving: false,
    deleting: false,
  });

  const actionProps: Omit<ButtonProps, "children"> = {
    onClick: async (e) => {
      console.log("Onsubmit: Form state", formState);
      // * Prevent's the page from getting reloaded on submit
      e.preventDefault();
      // * Display the saving loading state
      setIsLoading({ saving: true, deleting: false });
      // * Make the request to handle the form submission
      const result = handleAction && (await handleAction(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
      // * Remove the saving loading state
      setIsLoading({ saving: false, deleting: false });
    },
    disabled: requestState?.loading || false,
  };
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='flex justify-between items-center px-7 py-2 mt-4'>
          <span className='text-2xl text-dark font-semibold font-roboto capitalize'>
            {mode} Department
          </span>
        </div>
        <form className='flex flex-col justify-center py-3 md:py-[40px] px-4 md:px-6 w-full space-y-3'>
          {requestState?.error && (
            <>
              <div className='text-red-500 text-center'>
                <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
                {typeof requestState?.error === "string" &&
                  (requestState.error as string)}
              </div>
            </>
          )}
          <Select
            name='category'
            onChange={handleChange}
            value={formState.category}
            options={[
              "Nursery",
              "Primary",
              "Junior Secondary",
              "Senior Secondary",
              "Post-Secondary",
              "Undergraduate",
              "Graduate",
              "Vocational",
              "Adult Education",
              "Online Courses",
              "Continuing Education",
              "Special Education",
            ]}
            placeholder='Department Category'
            required
          />

          <Input
            type='text'
            name='name'
            value={formState.name}
            onChange={handleChange}
            placeholder='department Name'
            required
            className='input'
          />

          <textarea
            name='description'
            value={formState.description}
            onChange={handleChange}
            placeholder='department Description'
            required
            className='input textarea'
          ></textarea>

          <div className='flex items-center space-x-5 w-full'>
            <Button size='xs' color='outline' {...actionProps}>
              {is_loading.saving ? (
                <CircularProgress size={15} color='inherit' />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/**
 * Component for deleting a Department
 * @returns JSX.Element
 */
export const DeleteDepartmentModal = ({
  modalOpen,
  handleModalClose,
  handleAction,
  requestState,
  formState,
}: Omit<DepartmentsModalProps, "setFormState" | "mode">) => {
  const actionProps: Omit<ButtonProps, "children"> = {
    onClick: async (e) => {
      console.log("Ondelete: Form state", formState);
      // * Prevent's the page from getting reloaded on submit
      e.preventDefault();
      // * Make the request to handle the form submission
      const result = handleAction && (await handleAction(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
    },
    disabled: requestState?.loading || false,
  };
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl'
      >
        <div className='w-full px-4 py-4'>
          <div className=''>
            <span className='text-2xl text-red-500 font-semibold font-roboto capitalize'>
              Delete Department
            </span>
          </div>
          {requestState?.error && (
            <>
              <div className='text-red-500 text-center'>
                <Info sx={{ fontSize: "1.1rem" }} className='mt-0.5' />
                {typeof requestState?.error === "string" &&
                  (requestState.error as string)}
              </div>
            </>
          )}
          <div className='text-center text-lg'>
            Are you sure you want to delete this department -{" "}
            <span className='capitalize'>{formState.name}</span>?
          </div>

          <div className='flex items-center space-x-5 mt-4 w-full'>
            <Button
              size='xs'
              color='outline'
              className='text-red-500 !border-red-500 !outline-red-500 hover:bg-red-500'
              {...actionProps}
            >
              {requestState?.loading ? (
                <CircularProgress size={15} color='inherit' />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
