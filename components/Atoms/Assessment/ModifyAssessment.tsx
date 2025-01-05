import React, { useState } from "react";
import AssessmentTitleHeader from "./TitleHeader";
import AssessmentQuestion from "./AssessmentQuestion";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { v4 as uuidV4 } from "uuid";

const ModifyAssessment = () => {
  const { assessment_questions, dispatch } = useAssessmentQuestionsContext();
  const [adding_question, setAddingQuestion] = useState(false);

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
            question_id={
              question.draft_id ? question.draft_id || "" : question?._id || ""
            }
            question={question as any}
            mode="preview"
          />
        ))}
        {/* Add Question */}
        {adding_question ? (
          <AssessmentQuestion
            question_id={""}
            mode="create"
            handleCancel={() => setAddingQuestion(false)}
          />
        ) : (
          <div
            onClick={() => setAddingQuestion(true)}
            className="rounded-lg bg-white p-4 flex gap-2 justify-center items-center text-subtext cursor-pointer shadow transition hover:scale-[102%]"
          >
            <i className="fas fa-plus"></i>
            <span>Add new Question</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifyAssessment;
