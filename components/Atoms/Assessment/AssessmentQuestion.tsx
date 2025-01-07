import {
  TAssessmentQuestionType,
  TAssessmnentQuestion,
  TFetchState,
  TSelectOptions,
} from "@/components/utils/types";
import { handleInputChange } from "@/components/utils/utils";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import Select from "../Select";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import Input from "../Input";
import ParagrahQuestion from "./ParagrahQuestion";
import FileUploadQuestion from "./FileUploadQuestion";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import axiosInstance from "@/components/utils/axiosInstance";
import { AxiosResponse } from "axios";
import { File } from "buffer";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import useFetch from "@/components/utils/hooks/useFetch.hook";
import Button from "../Button";
import { v4 as uuidV4 } from "uuid";
import EachOption from "./EachOption";
import PreviewOption from "./PreviewOption";
import DeleteIcon from "../DeleteIcon";

const question_type_options: TSelectOptions = [
  { value: "multiple_choice", display_value: "Multiple Choice" },
  { value: "paragraph", display_value: "Paragraph" },
  { value: "file_upload", display_value: "File Upload" },
];
const AssessmentQuestion: FC<{
  question_id: string;
  question?: TAssessmnentQuestion;
  mode: "edit" | "preview";
}> = ({ question_id, mode, question }) => {
  const { dispatch, handle_question_config_change } =
    useAssessmentQuestionsContext();
  const attachmentState = useFetch();
  const [questionMode, setQuestionMode] = useState<"edit" | "preview">(mode);
  const [formState, setFormState] = useState<{
    questionText: string;
    questionType: TAssessmentQuestionType;
    questionImage?: string;
    attachmentId?: string;
  }>({
    questionText: "",
    questionType: "multiple_choice",
    questionImage: "",
  });

  /**
   * * Uploads the attachment to the backend
   * @returns the uploaded file URLs and Ids for
   */
  const uploadAttachmentToBackend = async (file: globalThis.File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("type", file.type);
      const response = await axiosInstance.post<
        any,
        AxiosResponse<
          {
            fileUrl: string;
            fileId: string;
          }[]
        >
      >(`/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return undefined;
    }
  };

  /**
   * * Delets the uploaded attachment from the backend
   * @returns the uploaded file URLs and Ids for
   */
  const deleteAttachment = async (id: string) => {
    try {
      await axiosInstance.delete<
        any,
        AxiosResponse<
          {
            fileUrl: string;
            fileId: string;
          }[]
        >
      >(`/files/delete/${id}`);

      return 204;
    } catch (error) {
      return undefined;
    }
  };

  /**
   * * Function responsible for validating the uploaded image
   */
  const handleDeleteAttachment: React.MouseEventHandler<
    HTMLDivElement
  > = async () => {
    if (!formState.attachmentId) return;
    const res = await deleteAttachment(formState.attachmentId);

    if (!res) {
      // todo: display error
      return;
    }

    handleInputChange("attachment", undefined, setFormState);
  };
  /**
   * * Function responsible for validating the uploaded image
   */
  const handleUploadAtachment: React.ChangeEventHandler<
    HTMLInputElement
  > = async ({ target: { files } }) => {
    attachmentState.display_loading();

    if (!files || files?.length < 1) return;

    const file = files[0];

    if (!["png", "jpg", "jpeg"].includes(file.name.split(".").pop() || "")) {
      // todo: display error message
      attachmentState.display_error("File must be of type png, jpg, or jpeg");
      return;
    }

    if (file.size / (1024 * 1024) > 5) {
      // todo: display error message
      attachmentState.display_error("File must be less than or equal to 5mb");
      return;
    }

    const uploaded_file = await uploadAttachmentToBackend(file);

    if (!uploaded_file) {
      // todo: Display error message
      attachmentState.display_error(
        "There was an error while uploading the attachment"
      );
      return;
    }

    // * Update the state object attachment property
    handleInputChange("attachment", uploaded_file[0].fileUrl, setFormState);
    handleInputChange("attachmentId", uploaded_file[0].fileId, setFormState);
    handle_question_config_change(
      question_id,
      "questionImage",
      uploaded_file[0].fileUrl
    );
    attachmentState.display_success("");
  };

  const handleDeleteQuestion = () => {
    // * Delete the uploaded attachment from the DB
    if (formState.attachmentId) deleteAttachment(formState.attachmentId);

    // * Delete the question from the assessment questions state
    dispatch({ type: "REMOVE_QUESTION", payload: question_id });
  };

  useEffect(() => {
    handleInputChange(
      "questionText",
      question?.questionText || "",
      setFormState
    );
    handleInputChange(
      "questionType",
      question?.questionType || "multiple_choice",
      setFormState
    );
    handleInputChange(
      "questionImage",
      question?.questionImage || "",
      setFormState
    );
  }, []);

  if (questionMode === "edit")
    return (
      <>
        <div className="p-6 rounded-xl flex flex-col gap-4 text-subtext bg-white">
          {/* Question  */}
          <div className="w-full flex justify-between gap-4">
            {/* Question description */}
            <input
              type="text"
              name="questionText"
              value={formState.questionText}
              className="text-wrap w-[45%] text-lg px-4 py-2 border-b border-black/30 focus:outline-none focus:border-b focus:border-black"
              placeholder="Enter Question description here"
              onChange={(e) => {
                handleInputChange(e.target.name, e.target.value, setFormState);
                handle_question_config_change(
                  question_id,
                  e.target.name,
                  e.target.value
                );
              }}
            />
            {/* Question config */}
            <div className="flex gap-4 items-center text-subtext text-lg">
              {/* Delete Icon */}
              <div
                onClick={handleDeleteQuestion}
                className="cursor-pointer transition hover:text-red-400"
              >
                <DeleteIcon width={"16"} height={"18"} />
              </div>
              {/* Upload Icon */}
              <label className="block cursor-pointer transition">
                {attachmentState.loading ? (
                  <>
                    <CircularProgress size={"15px"} />
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-image"></i>
                    <input
                      type="file"
                      name="attachment"
                      hidden
                      onChange={handleUploadAtachment}
                    />
                  </>
                )}
              </label>
              {/* Uploaded image */}
              {formState.questionImage && (
                <div
                  className="relative flex items-center gap-2 w-[30px] h-[30px] cursor-pointer"
                  onClick={handleDeleteAttachment}
                >
                  <div className="absolute text-red-400 -top-3 -right-2">
                    <i className="fas fa-xmark"></i>
                  </div>
                  <Image
                    width={30}
                    height={30}
                    src={
                      typeof formState.questionImage === "object"
                        ? URL.createObjectURL(formState.questionImage)
                        : formState.questionImage
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
                  inputSize="sm"
                  options={question_type_options}
                  value={formState.questionType}
                  className="!w-[170px]"
                  onChange={(e) => {
                    handleInputChange(
                      e.target.name,
                      e.target.value,
                      setFormState
                    );
                    handle_question_config_change(
                      question_id,
                      e.target.name,
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
          </div>
          {/* Question response type */}
          <div className="w-full">
            {formState.questionType === "multiple_choice" ? (
              <MultipleChoiceQuestion
                assessment_id=""
                question_id={question_id}
              />
            ) : formState.questionType === "paragraph" ? (
              <ParagrahQuestion />
            ) : (
              <FileUploadQuestion mode="edit" />
            )}
          </div>
        </div>
        {attachmentState.error && (
          <Snackbar
            open={attachmentState.error ? true : false}
            onClose={() => {
              attachmentState.setError(undefined);
            }}
            autoHideDuration={6000}
            // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            // className="!z-[999]"
          >
            <Alert
              severity="error"
              onClose={() => {
                attachmentState.setError(undefined);
              }}
            >
              {attachmentState.error}
            </Alert>
          </Snackbar>
        )}
      </>
    );

  return (
    <>
      {" "}
      <div className="p-6 rounded-xl flex flex-col gap-4 text-subtext bg-white">
        {/* Question  */}
        <div className="w-full flex justify-between gap-4">
          {/* Question description */}
          <span className="text-wrap w-[45%] text-lg px-4 py-2">
            {question?.questionText}
          </span>
        </div>
        {/* Question response */}
        <div className="w-full">
          {question?.questionType === "multiple_choice" ? (
            <div className="flex flex-col gap-3">
              {/* Multiple choice */}
              {question.options?.map((option, i) => (
                <PreviewOption
                  question_id={question_id}
                  option={option}
                  key={i}
                />
              ))}
            </div>
          ) : question?.questionType === "paragraph" ? (
            <>
              {/* Paragraph */}
              <input
                type="text"
                className="text-wrap w-[45%] text-lg px-4 py-2 border-b border-black/30 focus:outline-none focus:border-b focus:border-black"
                placeholder="Enter Question description here"
              />
            </>
          ) : (
            <FileUploadQuestion mode="preview" />
          )}
        </div>
      </div>
    </>
  );
};

export default AssessmentQuestion;
