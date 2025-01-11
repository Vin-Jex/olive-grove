import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";
import React, { FC } from "react";
import AssessmentQuestion from "./AssessmentQuestion";

const QuestionWrapper: FC = () => {
  const { question } = useEachAssessmentQuestionContext();
  return (
    <AssessmentQuestion
      question_id={question._id}
      question={question as any}
      mode="preview"
    />
  );
};

export default QuestionWrapper;
