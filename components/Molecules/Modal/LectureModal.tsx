import React, { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import Button, { ButtonProps } from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import TextEditor from "@/components/Atoms/TextEditor";
import { TFetchState } from "@/components/utils/types";
import File from "@/components/Atoms/File";
import { CircularProgress } from "@mui/material";
import Select from "@/components/Atoms/Select";

type LectureModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: () => void;
  handleAction?: () => Promise<boolean>;
  type: "class" | "assignment" | "course";
  mode?: "create" | "edit" | "delete";
  formState: {
    subject: string;
    description: string;
    classTime: string;
    meetingLink: string;
    teacher: string;
    academicWeekDate: string;
    recordedLecture?: string;
  };
  setFormState: React.Dispatch<
    React.SetStateAction<{
      subject: string;
      description: string;
      classTime: string;
      meetingLink: string;
      teacher: string;
      academicWeekDate: string;
      recordedLecture?: string;
    }>
  >;
  requestState?: TFetchState<any>;
  courses: string[];
};

export default function LectureModal({
  modalOpen,
  handleModalClose,
  handleAction,
  handleDelete,
  type,
  formState,
  setFormState,
  requestState,
  mode,
  courses,
}: LectureModalProps) {
  const [selectedImage, setSelectedImage] = useState<Blob | null | string>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState({
    saving: false,
    deleting: false,
  });

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState((prevState) => ({
        ...prevState,
        recordedLecture: file as unknown as string,
      }));
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const resetImageField = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setFileName("");
  };

  const actionProps: Omit<ButtonProps, "children"> = {
    onClick: async (e) => {
      e.preventDefault();
      const result = await (handleAction && handleAction());
      if (result) handleModalClose();
    },
    disabled: requestState?.loading || false,
  };

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className='w-[80%] sm:w-[70%] md:!w-[800px] !overflow-auto h-[90%] bg-white rounded-3xl shadow-lg'
      >
        {/* Modal Header */}
        <div className='flex justify-between items-center px-4 mt-[1.2rem]'>
          <span className='text-2xl text-dark font-semibold font-roboto capitalize'>
            {mode} {type === "class" ? "Lecture" : type}
          </span>
        </div>

        {/* Modal Content */}
        <form className='flex flex-col justify-center py-4 my-2 px-4 w-full space-y-6'>
          <label className='text-pretty text-subtext text-base flex flex-col gap-y-2'>
            Subject
            <Select
              name='subject'
              options={courses || []}
              required
              placeholder='Select subject'
              onChange={handleChange}
            />
          </label>

          <label className='text-pretty text-subtext text-base flex flex-col gap-y-2'>
            Description
            <TextEditor
              value={formState.description}
              placeholder='Lecture Description'
              onChange={(e: any) =>
                setFormState((prevState) => ({
                  ...prevState,
                  description: e,
                }))
              }
            />
          </label>

          <label className='text-pretty text-subtext text-base flex flex-col gap-y-2'>
            Class Time
            <Input
              type='datetime-local'
              name='classTime'
              value={formState.classTime}
              onChange={handleChange}
              required
              className='input'
              placeholder='Class Time'
            />
          </label>

          <label className='text-pretty text-subtext text-base flex flex-col gap-y-2'>
            Meeting Link
            <Input
              type='text'
              name='meetingLink'
              value={formState.meetingLink}
              onChange={handleChange}
              placeholder='Meeting Link'
              required={type === "class"}
              className='input'
            />
          </label>

          <label className='text-pretty text-subtext text-base flex flex-col gap-y-2'>
            Academic Week Date
            <Input
              type='date'
              name='academicWeekDate'
              value={formState.academicWeekDate}
              onChange={handleChange}
              required
              className='input'
              placeholder='Academic Week Date'
            />
          </label>

          <File
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            previewImage={previewImage}
            onChange={handleImageChange}
            resetImageStates={resetImageField}
            placeholder={fileName !== "" ? fileName : "Upload Video"}
            required
            fileName={fileName}
          />

          {/* Action Buttons */}
          {typeof requestState?.error === "string" && (
            <div className='text-red-500 text-center'>
              {requestState?.error}
            </div>
          )}

          <div className='flex items-center space-x-5 w-full'>
            <Button size='xs' color='outline' {...actionProps}>
              {isLoading.saving ? (
                <CircularProgress size={15} color='inherit' />
              ) : (
                "Save"
              )}
            </Button>
            {handleDelete && (
              <Button
                size='xs'
                color='red'
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                {isLoading.deleting ? (
                  <CircularProgress size={15} color='inherit' />
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
