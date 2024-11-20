import {
  TAssessment,
  TCourse,
  TModalProps,
  TSelectOptions,
  TSubject,
} from "@/components/utils/types";
import { Info } from "@mui/icons-material";
import React, { ChangeEvent, FC, useState } from "react";
import Modal from "./Modal";
import Select from "@/components/Atoms/Select";
import Input from "@/components/Atoms/Input";
import TextEditor from "@/components/Atoms/TextEditor";
import Button, { ButtonProps } from "@/components/Atoms/Button";
import { CircularProgress } from "@mui/material";

const AsssessmentModal: FC<
  TModalProps<TAssessment<"post">> & {
    subjects: TSelectOptions;
    assessmentTypes: TSelectOptions;
    academicWeeks: TSelectOptions;
    assessmentClasses: TSelectOptions;
  }
> = ({
  modalOpen,
  mode,
  handleModalClose,
  handleAction,
  handleDelete,
  requestState,
  formState,
  setFormState,
  subjects,
  assessmentTypes,
  academicWeeks,
  assessmentClasses,
}) => {
  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    if (name === "timeline") console.log("Date time", value);

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

  const deleteActionProps: Omit<ButtonProps, "children"> = {
    onClick: async (e) => {
      console.log("Onsubmit: Form state", formState);
      // * Prevent's the page from getting reloaded on submit
      e.preventDefault();
      // * Display the deleting loading state
      setIsLoading({ saving: false, deleting: true });
      /// * Make the request to handle the form submission
      const result = handleDelete && (await handleDelete(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
      // * Remove the deleting loading state
      setIsLoading({ saving: false, deleting: false });
    },
    disabled: requestState?.loading || false,
  };
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className="w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl"
      >
        <div className="flex justify-between items-center px-7 py-2 mt-4">
          <span className="text-2xl text-dark font-semibold font-roboto capitalize">
            {mode} Assessment
          </span>
        </div>
        <form className="flex flex-col justify-center py-3 md:py-[40px] px-4 md:px-6 w-full space-y-3">
          {requestState?.error && (
            <>
              <div className="text-red-500 text-center">
                <Info sx={{ fontSize: "1.1rem" }} className="mt-0.5" />
                {typeof requestState?.error === "string" &&
                  (requestState.error as string)}
              </div>
            </>
          )}
          <Select
            name="subject"
            onChange={handleChange}
            value={(formState.subject as string).toLowerCase()}
            options={subjects}
            placeholder="Subject"
            required
          />

          <Select
            name="type"
            onChange={handleChange}
            value={(formState.type as string).toLowerCase()}
            options={assessmentTypes}
            placeholder="Assessment type"
            required
          />

          <Select
            name="academicWeek"
            onChange={handleChange}
            value={(formState.academicWeek as string).toLowerCase()}
            options={academicWeeks}
            placeholder="Academic week"
            required
          />

          <Select
            name="class"
            onChange={handleChange}
            value={(formState.class as string).toLowerCase()}
            options={assessmentClasses}
            placeholder="Class"
            required
          />

          <Input
            type="datetime-local"
            name="timeline"
            value={
              new Date(formState.timeline || Date.now())
                ?.toISOString()
                ?.slice(
                  0,
                  16
                ) /* new Date(formState.timeline).toLocaleString() */
            }
            onChange={handleChange}
            placeholder="Timeline"
            required
            className="input"
          />

          <TextEditor
            value={formState.description || ""}
            onChange={(value: string) =>
              setFormState((props) => ({ ...props, description: value }))
            }
            placeholder="Class Description"
          />

          <div className="flex items-center space-x-5 w-full">
            <Button size="xs" color="outline" {...actionProps}>
              {is_loading.saving ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
            {handleDelete && (
              <Button size="xs" color="red" {...deleteActionProps}>
                {is_loading.deleting ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  "Delete"
                )}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AsssessmentModal;
