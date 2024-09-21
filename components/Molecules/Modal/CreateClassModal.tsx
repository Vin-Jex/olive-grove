import React, { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import Button, { ButtonProps } from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import TextEditor from "@/components/Atoms/TextEditor";
import File from "@/components/Atoms/File";
import { title } from "process";
import { capitalize } from "@/components/utils/utils";
import { TFetchState } from "@/components/utils/types";

type ClassModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: () => void;
  handleAction?: () => Promise<boolean>;
  type: "class" | "assignment" | "course";
  mode?: "create" | "edit";
  formState: {
    class: string;
    description: string;
    duration: string;
    meetingLink: string;
    video: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      class: string;
      description: string;
      duration: string;
      meetingLink: string;
      video: string;
    }>
  >;
  requestState?: TFetchState<any>;
};

export default function CreateClassModal({
  modalOpen,
  handleModalClose,
  handleAction,
  handleDelete,
  type,
  formState,
  setFormState,
  requestState,
  mode,
}: ClassModalProps) {
  const [selectedImage, setSelectedImage] = useState<
    Blob | null | string | undefined
  >(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<Blob | null | string>(null);

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
    onClick: () => {
      /// * Make the request to handle the form submission
      const result = handleAction && handleAction();

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
        className="w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl"
      >
        <div className="flex justify-between items-center px-7 py-2 mt-7">
          <span className="text-2xl text-dark font-semibold font-roboto capitalize">
            {mode || "Edit"} {type}
          </span>
          <div className="flex items-center justify-center rounded-full cursor-pointer bg-white shadow-lg border h-10 w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="16"
              viewBox="0 0 17 19"
              fill="none"
            >
              <path
                d="M3.29169 18.875C2.71877 18.875 2.22815 18.6708 1.81981 18.2625C1.41148 17.8542 1.20766 17.3639 1.20835 16.7917V3.25H0.166687V1.16667H5.37502V0.125H11.625V1.16667H16.8334V3.25H15.7917V16.7917C15.7917 17.3646 15.5875 17.8552 15.1792 18.2635C14.7709 18.6719 14.2806 18.8757 13.7084 18.875H3.29169ZM13.7084 3.25H3.29169V16.7917H13.7084V3.25ZM5.37502 14.7083H7.45835V5.33333H5.37502V14.7083ZM9.54169 14.7083H11.625V5.33333H9.54169V14.7083Z"
                fill="#32A8C4"
              />
            </svg>
          </div>
        </div>
        <form className="flex flex-col justify-center py-5 md:py-[40px] px-4 md:px-6 w-full space-y-6">
          <Input
            type="text"
            name="class"
            value={formState.class}
            onChange={handleChange}
            placeholder={`${capitalize(type)} Title`}
            required
            className="input"
          />

          <TextEditor
            value={formState.description}
            placeholder={`${capitalize(type)} Description`}
            onChange={(e: any) => {
              setFormState((prevState: any) => ({
                ...prevState,
                description: e,
              }));
            }}
          />

          <Input
            type="time"
            name="duration"
            value={formState.duration}
            onChange={handleChange}
            required
            className="input"
          />

          {type === "class" && (
            <Input
              type="text"
              name="meetingLink"
              value={formState.meetingLink}
              onChange={handleChange}
              placeholder="Meeting Link"
              required
              className="input"
            />
          )}

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
          {requestState?.error && (
            <div className="text-red-500 text-center">
              {requestState?.error}
            </div>
          )}
          <div className="flex items-center space-x-5 w-full">
            <Button size="sm" {...actionProps}>
              {type === "class" ? "Join Class" : "Save"}
            </Button>

            {type === "class" && (
              <Button size="sm" color="outline" {...actionProps}>
                Save
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
