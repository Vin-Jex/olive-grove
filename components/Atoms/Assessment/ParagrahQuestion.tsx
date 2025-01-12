import React, { FC } from "react";
import QuestionMarkInput from "./QuestionMarkInput";
import {
  TAsseessmentQuestionMode,
  TAssessmnentQuestion,
} from "@/components/utils/types";

const ParagrahQuestion: FC<{
  question: TAssessmnentQuestion<"draft">;
  mode: TAsseessmentQuestionMode;
}> = ({ question, mode }) => {
  return (
    <div className="text-subtext flex justify-between items-center gap-4">
      <span>Response goes here...</span>
      {/* Question mark */}
      <QuestionMarkInput question={question} mode={mode} />
    </div>
  );
};

export default ParagrahQuestion;
