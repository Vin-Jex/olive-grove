import React, { ChangeEvent, useEffect, useState } from "react";
import Modal from "./Modal";
import Button, { ButtonProps } from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import TextEditor from "@/components/Atoms/TextEditor";
import File from "@/components/Atoms/File";
import { title } from "process";
import { capitalize } from "@/components/utils/utils";
import {
  TChapter,
  TClass,
  TCourse,
  TCourseModalProps,
  TFetchState,
  TLesson,
  TSection,
} from "@/components/utils/types";
import Select from "@/components/Atoms/Select";
import { CircularProgress } from "@mui/material";
import { Info } from "@mui/icons-material";

export default function CourseModal({
  modalOpen,
  handleModalClose,
  handleAction,
  handleDelete,
  type,
  formState,
  setFormState,
  requestState,
  mode,
  classes,
}: TCourseModalProps) {
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);
  const [is_loading, setIsLoading] = useState({
    saving: false,
    deleting: false,
  });

  const textEditorValue =
    type === "topic" ? "topicNote" : type === "course" ? "description" : "";

  const resetImageField = () => {
    setSelectedImage(null);
    setFileName("");
    setPreviewImage(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, files },
    } = event;
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      // * Update the course cover image or topic video form state
      setFormState((prevState: any) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setSelectedImage(null);
    }
  };

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
        className="w-[80%] sm:w-[70%] md:w-[600px] bg-white backdrop-blur-[10px] rounded-3xl"
      >
        <div className="flex justify-between items-center px-4 mt-[1rem]">
          <span className="text-2xl text-dark font-semibold font-roboto capitalize">
            {capitalize(mode)} {capitalize(type)}
          </span>
        </div>
        <form className="flex flex-col justify-center py-4 my-2 px-4 w-full space-y-6">
          {requestState?.error && (
            <>
              <div className="text-red-500 text-center">
                <Info sx={{ fontSize: "1.1rem" }} className="mt-0.5" />
                {typeof requestState?.error === "string" &&
                  (requestState.error as string)}
              </div>
            </>
          )}
          {type === "course" && (
            <Select
              name="classId"
              options={classes || []}
              required
              placeholder="Select class"
              onChange={handleChange}
            />
          )}
          <Input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder={`${capitalize(type)} Title`}
            required
            className="input !rounded-lg"
          />

          {type === "topic" && (
            <TextEditor
              value={(formState as any)[textEditorValue]}
              placeholder={`${capitalize(type)} ${
                type === "topic"
                  ? "Notes"
                  : type === "course"
                  ? "Description"
                  : ""
              }`}
              onChange={(e: any) => {
                setFormState((prevState: any) => ({
                  ...prevState,
                  [textEditorValue]: e,
                }));
              }}
            />
          )}

          {/* If the modal is that for creating or editing a course */}
          {type === "course" && (
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="input textarea"
            ></textarea>
          )}

          {(type === "topic" || type === "course") && (
            <File
              selectedImage={selectedImage}
              name={type === "topic" ? "topicVideo" : "courseCover"}
              setSelectedImage={setSelectedImage}
              previewImage={previewImage}
              onChange={handleImageChange}
              disabled={false}
              resetImageStates={resetImageField}
              placeholder={
                fileName !== ""
                  ? fileName
                  : type === "topic"
                  ? "Upload Video"
                  : "Upload course image"
              }
              required
              fileName={fileName}
            />
          )}

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
}
