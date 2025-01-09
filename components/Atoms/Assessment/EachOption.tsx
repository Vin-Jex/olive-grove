import {
  TAsseessmentQuestionMode,
  TAsseessmentQuestionOption,
} from "@/components/utils/types";
import React, { FC, useState } from "react";
import DeleteIcon from "../DeleteIcon";
import { useAssessmentQuestionsContext } from "@/contexts/AssessmentQuestionsContext";
import { useEachAssessmentQuestionContext } from "@/contexts/EachAssessmentQuestionContext";

const EachOption: FC<{
  option: TAsseessmentQuestionOption;
  draft_question: TAsseessmentQuestionOption;
  index: number;
  mode: TAsseessmentQuestionMode;
}> = ({ option, draft_question, mode, index }) => {
  const [option_content, setOptionContent] = useState(option.content);
  const { dispatch: draft_question_dispatch, handle_question_config_change } =
    useAssessmentQuestionsContext();
  const { dispatch: existing_question_dispatch } =
    useEachAssessmentQuestionContext();

  const remove_option = (id: string) => {
    // setOptions((prev) => prev.filter((option) => option._id !== id));
    mode === "add" &&
      draft_question_dispatch({
        type: "DELETE_OPTION",
        payload: { question_id: draft_question._id, option: { _id: id } },
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
            name={question_id}
            onChange={(e) => setCorrectOption(e.target.value)}
            defaultChecked={correct_option === option.content}
            value={option._id}
          />
          <span className="checkmark"></span>
        </label>
      </div>
    </div>
  );
};

export default EachOption;
