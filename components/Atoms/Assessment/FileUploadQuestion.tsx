import React, { useState } from "react";
import Input from "../Input";
import Select from "../Select";
import { handleInputChange } from "@/components/utils/utils";

const FileUploadQuestion = () => {
  const [form_state, setFormState] = useState<{
    maxFileSize: number;
    maxFiles: number;
    fileSizeSI: "KB" | "MB" | "GB";
  }>({ fileSizeSI: "KB", maxFiles: 1, maxFileSize: 10 });

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
};

export default FileUploadQuestion;
