import React, { ChangeEvent } from "react";
import Modal from "./Modal";
import Button from "@/components/Atoms/Button";
import Input from "@/components/Atoms/Input";
import TextEditor from "@/components/Atoms/TextEditor";

type ClassModalProps = {
  modalOpen: boolean;
  handleModalClose: () => void;
  handleDelete?: () => void;
  handleAction?: () => void;
  type: "class" | "assignment";
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
};

export default function EditClassModal({
  modalOpen,
  handleModalClose,
  handleAction,
  handleDelete,
  type,
  formState,
  setFormState,
}: ClassModalProps) {
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
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        className="w-[80%] sm:w-[70%] md:w-[751px] bg-white backdrop-blur-[10px] rounded-3xl"
      >
        <div className="flex justify-between items-center px-7 py-2 mt-4">
          <span className="text-2xl text-dark font-semibold font-roboto capitalize">
            Edit {type}
          </span>
          <div className="flex items-center justify-center rounded-full cursor-pointer bg-white border h-10 w-10">
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
            placeholder="Course Title"
            required
            className="input"
          />

          <TextEditor
            value={formState.description}
            placeholder="Class Description"
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

          <div className="flex items-center space-x-5 w-full">
            <Button
              size="xs"
              onClick={() => {
                handleAction && handleAction();
              }}
            >
              {type === "class" ? "Join Lecture" : "Save"}
            </Button>

            {type === "class" && (
              <Button size="xs" color="outline">
                Save
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
