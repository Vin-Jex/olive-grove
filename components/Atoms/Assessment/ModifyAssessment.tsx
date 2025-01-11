import React, { FC, useEffect, useState } from "react";
import AssessmentTitleHeader from "./TitleHeader";
import AssessmentQuestion from "./AssessmentQuestion";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { v4 as uuidV4 } from "uuid";
import useAjaxRequest from "use-ajax-request";
import axiosInstance from "@/components/utils/axiosInstance";
import { useRouter } from "next/router";
import { TAssessmnentQuestion } from "@/components/utils/types";
import EachAssessmentQuestionContextProvider from "@/contexts/EachAssessmentQuestionContext";
import QuestionWrapper from "./QuestionWrapper";
import Button from "../Button";

const ModifyAssessment: FC<{
  questions: TAssessmnentQuestion<"preview">[];
}> = ({ questions: existing_questions }) => {
  const router = useRouter();
  const { assessmentId } = router.query;
  const { assessment_questions, dispatch } = useAssessmentQuestionsContext();
  const {
    sendRequest: uploadAssessmentQuestions,
    loading: loadingAssessment,
    error: errorFetchingAssessment,
    data: assessments,
  } = useAjaxRequest<{
    data: { questions: TAssessmnentQuestion<"preview">[] };
  }>({
    config: {},
    instance: axiosInstance,
  });

  const addQuestion = () => {
    dispatch({
      type: "ADD_QUESTION",
      payload: {
        _id: uuidV4(),
        maxMarks: 5,
        questionText: "",
        questionType: "multiple_choice",
        fileRequirements: { allowedExtensions: ["png"], maxSizeMB: 10 },
        correctAnswer: "",
      } as TAssessmnentQuestion,
    });
  };

  const uploadQuestions = async () => {
    const questions_to_submit = assessment_questions.data.map((question) => ({
      ...question,
      options: question.options?.map((option) => option.content),
      correctAnswer: question.correctAnswer?.content || question.correctAnswer,
      fileRequirements: {
        ...question.fileRequirements,
        maxSizeMB: Number(question.fileRequirements?.maxSizeMB),
      },
      maxMarks: Number(question.maxMarks),
      _id: undefined,
    }));

    console.log("QUESTIONS", questions_to_submit);

    await uploadAssessmentQuestions(
      () => {
        dispatch({ type: "CLEAR_QUESTIONS" });
      },
      undefined,
      {
        url: `/api/v2/assessments/${assessmentId}/questions`,
        method: "POST",
        data: { questions: questions_to_submit },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Assessment Header */}
      <AssessmentTitleHeader title={"Physics Class"}>
        The questions below are made up of 4 options, choose 1 from the 4
        options for each of the questions and click submit when you are done.
      </AssessmentTitleHeader>

      <div className="w-full flex flex-col gap-6 py-4 relative">
        {/* Save Question */}
        <div className="w-full sticky top-4 left-0 z-10">
          <Button
            color="blue"
            className="!w-full !max-w-[unset]"
            disabled={assessment_questions.data.length < 1}
            onClick={uploadQuestions}
          >
            Upload Questions
          </Button>
        </div>
        {/* Existing questions */}
        {existing_questions.map((question) => (
          <EachAssessmentQuestionContextProvider
            question={question as any}
            key={question._id}
          >
            <QuestionWrapper />
          </EachAssessmentQuestionContextProvider>
        ))}
        {/* Draft questions */}
        {assessment_questions.data.map((question) => (
          <AssessmentQuestion
            key={question._id}
            question_id={question._id}
            question={question as any}
            mode="add"
          />
        ))}
        {/* Add Question */}
        <div
          onClick={addQuestion}
          className="rounded-lg bg-white p-4 flex gap-2 justify-center items-center text-subtext cursor-pointer shadow"
        >
          <i className="fas fa-plus"></i>
          <span>Add New Question</span>
        </div>
      </div>
    </div>
  );
};

export default ModifyAssessment;
