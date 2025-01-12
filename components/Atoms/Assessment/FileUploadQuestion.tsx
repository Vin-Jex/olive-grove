import React, { FC, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import { handleInputChange } from "@/components/utils/utils";
import {
  TAsseessmentQuestionMode,
  TAssessmentQuestionFileUpload,
  TAssessmnentQuestion,
} from "@/components/utils/types";
import QuestionMarkInput from "./QuestionMarkInput";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";

const FileUploadQuestion: FC<{
  mode: TAsseessmentQuestionMode;
  question: TAssessmnentQuestion<"draft">;
}> = ({ mode, question }) => {
  const { dispatch: draft_question_dispatch } = useAssessmentQuestionsContext();
  const { dispatch: existing_question_dispatch } =
    useEachAssessmentQuestionContext();
  const [form_state, setFormState] = useState<{
    maxFileSize: number;
    maxFiles: number;
    allowedExtensions: string[];
  }>({ maxFiles: 1, maxFileSize: 5, allowedExtensions: [] });

  if (mode === "edit" || mode === "add")
    return (
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col gap-4 w-fit">
          <label className="flex gap-4 items-end">
            <span className="text-nowrap">Maximum number of files</span>
            <Input
              type="number"
              name="maxFiles"
              className="input !py-1.5 !w-[70px]"
              defaultValue={"1"}
              value={form_state.maxFiles}
              onChange={(e) =>
                handleInputChange(e.target.name, e.target.value, setFormState)
              }
            />
          </label>
          <label className="flex gap-4 items-end">
            <span className="text-nowrap">Maximum File size (MB)</span>
            <Input
              type="number"
              name="maxFileSize"
              className="input !py-1.5 !w-[none] !max-w-[70px]"
              defaultValue={"5"}
              value={question.fileRequirements?.maxSizeMB || ""}
              onChange={(e) => {
                handleInputChange(e.target.name, e.target.value, setFormState);
                mode === "add" &&
                  draft_question_dispatch({
                    type: "EDIT_FILE_CONFIG",
                    payload: {
                      question_id: question._id,
                      fileRequirements: {
                        maxSizeMB: e.target.value,
                      },
                    },
                  });
                mode === "edit" &&
                  existing_question_dispatch({
                    type: "EDIT_FILE_CONFIG",
                    payload: {
                      maxSizeMB: e.target.value,
                    },
                  });
              }}
            />
          </label>
        </div>
        {/* Question mark */}
        <QuestionMarkInput mode={mode} question={question} />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {/* Upload btn */}
      <label className="flex rounded-lg border border-subtext p-2 text-xs gap-2 w-fit items-center cursor-pointer transition hover:bg-subtext/5">
        {/* Icon */}
        <svg
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.33398 10.3367V11.1667C1.33398 11.8297 1.59738 12.4656 2.06622 12.9344C2.53506 13.4033 3.17094 13.6667 3.83398 13.6667H12.1673C12.8304 13.6667 13.4662 13.4033 13.9351 12.9344C14.4039 12.4656 14.6673 11.8297 14.6673 11.1667V10.3333M8.00065 9.91667V0.75M8.00065 0.75L10.9173 3.66667M8.00065 0.75L5.08398 3.66667"
            stroke="#1E1E1E"
            stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Upload file</span>
        <input type="file" name="file" hidden />
      </label>
    </div>
  );
};

export default FileUploadQuestion;
