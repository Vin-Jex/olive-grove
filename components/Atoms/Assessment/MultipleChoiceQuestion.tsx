import {
  TAsseessmentQuestionMode,
  TAsseessmentQuestionOption,
  TAssessmnentQuestion,
} from "@/components/utils/types";
import React, { FC, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import EachOption from "./EachOption";
import Input from "../Input";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { Mode } from "@mui/icons-material";
import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";

const MultipleChoiceQuestion: FC<{
  question: TAssessmnentQuestion<"draft">;
  mode: TAsseessmentQuestionMode;
}> = ({ question, mode }) => {
  const { dispatch: draft_question_dispatch, handle_question_config_change } =
    useAssessmentQuestionsContext();
  const { dispatch: existing_question_dispatch } =
    useEachAssessmentQuestionContext();

  const add_option = () => {
    const option = { _id: uuidV4(), content: undefined };
    mode === "add" &&
      draft_question_dispatch({
        type: "ADD_OPTION",
        payload: {
          question_id: question._id,
          option,
        },
      });
    mode === "edit" &&
      existing_question_dispatch({ type: "ADD_OPTION", payload: option });
  };

  useEffect(() => {
    if (!question.options?.length || question.options?.length < 1) {
      Array.from({ length: 4 }).forEach(() => {
        // mode === "add" &&
        //   draft_question_dispatch({
        //     type: "ADD_OPTION",
        //     payload: {
        //       question_id: question._id,
        //       option: { _id: uuidV4(), content: undefined },
        //     },
        //   });
        // mode === "edit" &&
        //   existing_question_dispatch({
        //     type: "ADD_OPTION",
        //     payload: { _id: uuidV4(), content: undefined },
        //   });
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {question.options?.map((option, i) => (
        <EachOption
          key={option._id}
          option={option}
          question={question as any}
          mode={mode}
          index={i + 1}
        />
      ))}
      <div className="flex gap-4 justify-between">
        {/* Add Option */}
        <span className="text-primary cursor-pointer" onClick={add_option}>
          Add option
        </span>
        {/* Question mark */}
        <div className="flex gap-2 items-center">
          <span className="text-xs text-nowrap">Question Mark</span>
          <Input
            name="maxMarks"
            value={question.maxMarks}
            type="number"
            defaultValue={"1"}
            onChange={(e) =>
              handle_question_config_change(
                question._id,
                e.target.name,
                e.target.value
              )
            }
            className="input !py-1.5 !w-[50px]"
          />
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
