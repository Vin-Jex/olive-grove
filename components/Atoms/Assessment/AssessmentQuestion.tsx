import {
  TAssessmentQuestionType,
  TSelectOptions,
} from "@/components/utils/types";
import { handleInputChange } from "@/components/utils/utils";
import Image from "next/image";
import React, { FC, useState } from "react";
import Select from "../Select";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import Input from "../Input";
import ParagrahQuestion from "./ParagrahQuestion";
import FileUploadQuestion from "./FileUploadQuestion";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";

const question_type_options: TSelectOptions = [
  { value: "multiple_choice", display_value: "Multiple Choice" },
  { value: "paragraph", display_value: "Paragraph" },
  { value: "file_upload", display_value: "File Upload" },
];
const AssessmentQuestion: FC<{ question_id: string }> = ({ question_id }) => {
  const { dispatch } = useAssessmentQuestionsContext();
  const [formState, setFormState] = useState<{
    question: string;
    questionType: TAssessmentQuestionType;
    attachment: string | File;
    maxMarks: number | string;
  }>({
    question: "",
    questionType: "multiple_choice",
    attachment: "",
    maxMarks: 0,
  });

  /**
   * * Function responsible for validating the uploaded image
   */
  const handleUploadAtachment: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { files },
  }) => {
    if (!files || files?.length < 1) return;

    const file = files[0];

    if (!["png", "jpg", "jpeg"].includes(file.name.split(".").pop() || "")) {
      // todo: display error message
      return;
    }

    if (file.size / (1024 * 1024) > 5) {
      // todo: display error message
      return;
    }

    // * Update the state object attachment property
    handleInputChange("attachment", file, setFormState);
  };

  const handleDeleteQuestion = () => {
    // * Delete the question from the assessment questions state
    dispatch({ type: "REMOVE_QUESTION", payload: question_id });
  };

  return (
    <div className="p-6 rounded-xl flex flex-col gap-4 text-subtext bg-white border-t-2 border-primary">
      {/* Question  */}
      <div className="w-full flex justify-between gap-4">
        {/* Question description */}
        <input
          type="text"
          className="text-wrap w-[45%] text-lg px-4 py-2 border-b border-black/30 focus:outline-none focus:border-b focus:border-black"
          placeholder="Enter Question description here"
        />
        {/* Question config */}
        <div className="flex gap-4 items-end text-subtext text-lg">
          {/* Delete Icon */}
          <div
            onClick={handleDeleteQuestion}
            className="cursor-pointer transition hover:text-red-400"
          >
            <i className="fas fa-trash"></i>
          </div>
          {/* Upload Icon */}
          <label className="block cursor-pointer transition hover:text-primary">
            <i className="fa-regular fa-image"></i>
            <input
              type="file"
              name="attachment"
              hidden
              onChange={handleUploadAtachment}
            />
          </label>
          {/* Uploaded image */}
          {formState.attachment && (
            <div
              className="relative flex items-center gap-2 w-[30px] h-[30px] cursor-pointer"
              onClick={() =>
                handleInputChange("attachment", undefined, setFormState)
              }
            >
              <div className="absolute  text-red-400 -top-3 -right-2">
                <i className="fas fa-xmark"></i>
              </div>
              <Image
                width={30}
                height={30}
                src={
                  typeof formState.attachment === "object"
                    ? URL.createObjectURL(formState.attachment)
                    : formState.attachment
                }
                alt="Question attachment"
                className="object-contain object-top"
              />
            </div>
          )}
          {/* Question type */}
          <div className="h-[2.5rem] ">
            <Select
              name="questionType"
              inputSize="xs"
              options={question_type_options}
              value={formState.questionType}
              onChange={(e) =>
                handleInputChange(e.target.name, e.target.value, setFormState)
              }
            />
          </div>
          {/* Question mark */}
          <div className="flex max-h-[inherit] flex-col gap-0">
            <span className="text-xs">Mark</span>
            <Input
              name="maxMarks"
              value={formState.maxMarks}
              type="number"
              onChange={(e) =>
                handleInputChange(e.target.name, e.target.value, setFormState)
              }
              className="input !py-1.5 !w-[50px]"
            />
          </div>
        </div>
      </div>
      {/* Question response type */}
      <div className="w-full">
        {formState.questionType === "multiple_choice" ? (
          <MultipleChoiceQuestion assessment_id="" question_id={question_id} />
        ) : formState.questionType === "paragraph" ? (
          <ParagrahQuestion />
        ) : (
          <FileUploadQuestion />
        )}
      </div>
    </div>
  );
};

export default AssessmentQuestion;
