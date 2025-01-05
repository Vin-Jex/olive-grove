import React, { FC, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import { handleInputChange } from "@/components/utils/utils";
import { TAssessmentQuestionFileUpload } from "@/components/utils/types";

const FileUploadQuestion: FC<{
  mode: "edit" | "preview";
  config?: TAssessmentQuestionFileUpload;
}> = ({ mode, config }) => {
  const [form_state, setFormState] = useState<{
    maxFileSize: number;
    maxFiles: number;
    fileSizeSI: "KB" | "MB" | "GB";
  }>({ fileSizeSI: "KB", maxFiles: 1, maxFileSize: 10 });

  if (mode === "edit")
    return (
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
          <span className="text-nowrap">Maximum File size</span>
          <Input
            type="number"
            name="maxFileSize"
            className="input !py-1.5 !w-[none] !max-w-[70px]"
            defaultValue={"10"}
            value={form_state.maxFileSize}
            onChange={(e) =>
              handleInputChange(e.target.name, e.target.value, setFormState)
            }
          />
          <Select
            name="fileSizeSI"
            options={["KB", "MB", "GB"]}
            className="!max-w-[70px]"
            inputSize="xs"
            value={form_state.fileSizeSI}
            onChange={(e) =>
              handleInputChange(e.target.name, e.target.value, setFormState)
            }
          />
        </label>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {/* Upload btn */}
      <div className="flex rounded-lg border border-subtext p-2 text-xs gap-2 w-fit items-center cursor-pointer transition hover:bg-subtext/5">
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
      </div>
    </div>
  );
};

export default FileUploadQuestion;
