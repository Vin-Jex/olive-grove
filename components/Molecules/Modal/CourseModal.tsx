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
  TFetchState,
  TLesson,
  TSection,
} from "@/components/utils/types";
import Select from "@/components/Atoms/Select";

export type TCourseModalFormData =
  | Omit<TCourse, "chapters">
  | Omit<TChapter, "lessons">
  | Omit<TLesson, "sections">
  | Omit<TSection, "subsections">;

type CourseModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: (formData?: TCourseModalFormData) => Promise<boolean>;
  handleAction?: (formData?: TCourseModalFormData) => Promise<boolean>;
  type: "course" | "chapter" | "lesson" | "topic";
  mode: "create" | "edit";
  formState: TCourseModalFormData;
  setFormState: React.Dispatch<React.SetStateAction<TCourseModalFormData>>;
  requestState?: TFetchState<any>;
  classes?: string[];
};

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
}: CourseModalProps) {
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);

  const textEditorValue =
    type === "topic" ? "topicNote" : type === "course" ? "description" : "";

  const resetImageField = () => {
    setSelectedImage(null);
    setFileName("");
    setPreviewImage(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
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
      /// * Make the request to handle the form submission
      const result = handleAction && (await handleAction(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
    },
    disabled: requestState?.loading || false,
  };

  const deleteActionProps: Omit<ButtonProps, "children"> = {
    onClick: async (e) => {
      console.log("Onsubmit: Form state", formState);
      // * Prevent's the page from getting reloaded on submit
      e.preventDefault();
      /// * Make the request to handle the form submission
      const result = handleDelete && (await handleDelete(formState));
      // * If the request was completed successfully, close the modal
      if (result) handleModalClose();
    },
    disabled: requestState?.loading || false,
  };

  useEffect(() => {
    console.log("FORM STATE", formState);
  }, []);

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className="w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl"
      >
        <div className="flex justify-between items-center px-7 py-2 mt-7">
          <span className="text-2xl text-dark font-semibold font-roboto capitalize">
            {capitalize(mode)} {capitalize(type)}
          </span>
        </div>
        <form className="flex flex-col justify-center py-5 md:py-[40px] px-4 md:px-6 w-full space-y-6">
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
            className="input"
          />

          {(type === "topic" || type === "course") && (
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

          {type === "topic" && (
            <File
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              previewImage={previewImage}
              onChange={handleImageChange}
              disabled={false}
              resetImageStates={resetImageField}
              placeholder={fileName !== "" ? fileName : "Upload Video"}
              required
              fileName={fileName}
            />
          )}
          {requestState?.error && (
            <div className="text-red-500 text-center">
              {requestState?.error}
            </div>
          )}
          <div className="flex items-center space-x-5 w-full">
            <Button size="xs" color="outline" {...actionProps}>
              Save
            </Button>
            {handleDelete && (
              <Button size="xs" color="red" {...deleteActionProps}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
