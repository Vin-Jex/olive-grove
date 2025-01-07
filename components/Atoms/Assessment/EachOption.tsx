import { TAsseessmentQuestionOption } from "@/components/utils/types";
import React, { FC, useState } from "react";
import DeleteIcon from "../DeleteIcon";

const EachOption: FC<{
  setCorrectOption: Function;
  edit_option: (a: TAsseessmentQuestionOption) => void;
  remove_option: Function;
  question_id: string;
  option: TAsseessmentQuestionOption;
  correct_option: string;
  index: number;
}> = ({
  edit_option,
  option,
  question_id,
  setCorrectOption,
  correct_option,
  remove_option,
  index,
}) => {
  const [option_content, setOptionContent] = useState(option.content);
  const [prev_timeout, setNewTimeout] = useState<NodeJS.Timeout>();

  const handle_edit: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    // * Update the input field
    setOptionContent(value);

    // * Clear the previous timeout function
    clearTimeout(prev_timeout);

    // * Update the list of options in the next 2 seconds
    const timeout = setTimeout(() => {
      console.log("Value during timneout", value);
      edit_option({ content: value, _id: option._id });
    }, 1000 * 2);

    setNewTimeout(timeout);
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
