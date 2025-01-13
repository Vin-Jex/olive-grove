import React, { FC } from "react";
import Input from "../Input";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";
import {
  TAsseessmentQuestionMode,
  TAssessmnentQuestion,
} from "@/components/utils/types";

const QuestionMarkInput: FC<{
  question: TAssessmnentQuestion<"draft">;
  mode: TAsseessmentQuestionMode;
}> = ({ question, mode }) => {
  const { handle_question_config_change } = useAssessmentQuestionsContext();
  const { handle_each_question_config_change } =
    useEachAssessmentQuestionContext();

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-nowrap">Question Mark</span>
      <Input
        name="maxMarks"
        value={question.maxMarks}
        type="number"
        defaultValue={"1"}
        onChange={(e) => {
          mode === "add" &&
            handle_question_config_change(
              question._id,
              e.target.name,
              e.target.value
            );

          mode === "edit" &&
            handle_each_question_config_change(e.target.name, e.target.value);
        }}
        className="input !py-1.5 !w-[50px]"
      />
    </div>
  );
};

export default QuestionMarkInput;
