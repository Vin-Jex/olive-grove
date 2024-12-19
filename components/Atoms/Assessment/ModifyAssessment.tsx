import React from "react";
import AssessmentTitleHeader from "./TitleHeader";
import AssessmentQuestion from "./AssessmentQuestion";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { v4 as uuidV4 } from "uuid";

const ModifyAssessment = () => {
  const { assessment_questions, dispatch } = useAssessmentQuestionsContext();

  const addQuestion = () => {
    dispatch({ type: "ADD_QUESTION", payload: { _id: uuidV4() } });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Assessment Header */}
      <AssessmentTitleHeader title={"Physics Class"}>
        The questions below are made up of 4 options, choose 1 from the 4
        options for each of the questions and click submit when you are done.
      </AssessmentTitleHeader>
      <div className="w-full flex flex-col gap-6">
        {assessment_questions.data.map((question) => (
          <AssessmentQuestion
            key={question._id}
            question_id={question._id.toString()}
          />
        ))}
        {/* Add Question */}
        <div
          onClick={addQuestion}
          className="rounded-lg bg-white p-4 flex gap-2 justify-center items-center text-subtext cursor-pointer shadow transition hover:scale-[102%]"
        >
          <i className="fas fa-plus"></i>
          <span>Add new Question</span>
        </div>
      </div>
    </div>
  );
};

export default ModifyAssessment;
