import React, { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import Select from "@/components/Atoms/Select";
import { TDepartment, TFetchState } from "@/components/utils/types";
import { CircularProgress } from "@mui/material";
import InputField from "@/components/Atoms/InputField";

type DepartmentsModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleAction?: (formData: TDepartment) => Promise<boolean>;
  mode: "create" | "update";
  formState: TDepartment;
  setFormState: React.Dispatch<React.SetStateAction<TDepartment>>;
};

/**
 * Component for creating or editing a Department
 */
export const CreateOrUpdateDepartmentModal = ({
  modalOpen,
  mode,
  handleModalClose,
  handleAction,
  formState,
  setFormState,
}: DepartmentsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!handleAction) return;

    setIsLoading(true);
    try {
      const result = await handleAction(formState);
      if (result) {
        handleModalClose();
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={handleModalClose}
      className='w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl'
    >
      <div className='flex justify-between items-center px-5 py-2 mt-2'>
        <span className='text-2xl text-dark font-semibold font-roboto capitalize'>
          {mode} Department
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center py-3 px-4 md:px-6 w-full space-y-3'
      >
        <InputField
          type='select'
          name='category'
          label='Department Category'
          placeholder='Department Category'
          onChange={handleChange}
          value={formState.category}
          options={[
            { display_value: "Nursery", value: "Nursery" },
            { display_value: "Primary", value: "Primary" },
            { display_value: "Junior Secondary", value: "Junior Secondary" },
            { display_value: "Senior Secondary", value: "Senior Secondary" },
            { display_value: "Post-Secondary", value: "Post-Secondary" },
            { display_value: "Undergraduate", value: "Undergraduate" },
            { display_value: "Graduate", value: "Graduate" },
            { display_value: "Vocational", value: "Vocational" },
            { display_value: "Adult Education", value: "Adult Education" },
            { display_value: "Online Courses", value: "Online Courses" },
            {
              display_value: "Continuing Education",
              value: "Continuing Education",
            },
            { display_value: "Special Education", value: "Special Education" },
          ]}
          required
          error=''
        />

        <InputField
          type='text'
          name='name'
          value={formState.name}
          onChange={handleChange}
          placeholder='Department Name'
          label='Department Name'
          required
          className='input'
          error=''
        />

        <InputField
          type='textarea'
          name='description'
          value={formState.description}
          onChange={handleChange}
          placeholder='Department Description'
          label='Department Description'
          required
          error=''
        />

        <div className='flex items-center space-x-5 w-full'>
          <Button
            size='xs'
            color='outline'
            type='submit'
            disabled={
              isLoading ||
              formState.description === "" ||
              formState.category === "" ||
              formState.description === ""
            }
          >
            {isLoading ? (
              <CircularProgress size={15} color='inherit' />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
