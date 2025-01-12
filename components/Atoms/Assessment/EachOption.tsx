import {
  TAsseessmentQuestionMode,
  TAsseessmentQuestionOption,
  TAssessmnentQuestion,
} from "@/components/utils/types";
import React, { FC, useEffect, useState } from "react";
import DeleteIcon from "../DeleteIcon";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";

const EachOption: FC<{
  option: TAsseessmentQuestionOption;
  question: TAssessmnentQuestion<"draft">;
  index: number;
  mode: TAsseessmentQuestionMode;
}> = ({ option, question: question, mode, index }) => {
  const [option_content, setOptionContent] = useState(option.content);
  const { dispatch: draft_question_dispatch, handle_question_config_change } =
    useAssessmentQuestionsContext();
  const {
    dispatch: existing_question_dispatch,
    handle_each_question_config_change,
  } = useEachAssessmentQuestionContext();

  const remove_option = (id: string) => {
    // setOptions((prev) => prev.filter((option) => option._id !== id));
    mode === "add" &&
      draft_question_dispatch({
        type: "DELETE_OPTION",
        payload: { question_id: question._id, option: { _id: id } },
      });

    mode === "edit" &&
      existing_question_dispatch({
        type: "DELETE_OPTION",
        payload: id,
      });
  };

  const handle_edit: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    // * Update the input field
    setOptionContent(value);

    // * Update the option in the draft question
    mode === "add" &&
      draft_question_dispatch({
        type: "EDIT_OPTION",
        payload: {
          question_id: question._id,
          option: { _id: option._id, content: value },
        },
      });
    mode === "edit" &&
      existing_question_dispatch({
        type: "EDIT_OPTION",
        payload: { _id: option._id, content: value },
      });
  };

  const handle_corect_answer: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    // * Update the input field
    // setOptionContent(value);

    // * Update the option in the draft question
    mode === "add" &&
      handle_question_config_change(question._id, "correctAnswer", option);
    mode === "edit" &&
      handle_each_question_config_change("correctAnswer", option);
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2 w-full">
        <div className="w-[20px] h-[20px] rounded-full border-[2.5px] border-subtext/20"></div>
        <input
          type="text"
          className="border-none outline-none focus:outline-none text-subtext focus:text-black w-full"
          placeholder={`Enter option ${index} here`}
          value={option_content}
          onChange={handle_edit}
        />
      </div>
      <div className="flex items-center gap-4 text-lg">
        {/* Delete option */}
        <div
          className="cursor-pointer transition"
          onClick={(e) => remove_option(option._id)}
        >
          <DeleteIcon width={"16"} height={"18"} />
        </div>
        <label className="radio">
          <input
            type="radio"
            name={question._id}
            onChange={handle_corect_answer}
            defaultChecked={question.correctAnswer?._id === option?._id}
            value={option._id}
          />
          <span className="checkmark"></span>
        </label>
      </div>
    </div>
  );
};

export default EachOption;
