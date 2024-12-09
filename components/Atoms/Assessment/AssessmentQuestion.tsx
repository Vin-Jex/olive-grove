import { TAssessmentQuestionType } from "@/components/utils/types";
import React, { useState } from "react";

const AssessmentQuestion = () => {
  const [formState, setFormState] = useState<{
    question: string;
    assessmentType: TAssessmentQuestionType;
    attachment: string | File;
  }>({
    question: "",
    assessmentType: "multiple choice",
    attachment: "",
  });

  return (
    <div className="p-6 rounded-full bg-white border-t-2 border-primary">
      {/* Question  */}
      <div className="flex justify-between gap-4">
        <input
          type="text"
          className="text-wrap w-[45%] text-lg px-4 py-2 border-b border-black/30 focus:outline-none focus:border-b focus:border-black"
          placeholder="Enter Question description here"
        />
      </div>
    </div>
  );
};

export default AssessmentQuestion;
