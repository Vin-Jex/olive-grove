import { TAsseessmentQuestionOption } from "@/components/utils/types";
import React, { FC, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import EachOption from "./EachOption";
import Input from "../Input";

const MultipleChoiceQuestion: FC<{
  assessment_id: string;
  question_id: string;
}> = ({ assessment_id, question_id }) => {
  const [options, setOptions] = useState<TAsseessmentQuestionOption[]>([]);
  const [correct_option, setCorrectOption] = useState("");

  const add_option = () => {
    setOptions((prev) => [...prev, { content: undefined, _id: uuidV4() }]);
  };
  const remove_option = (id: string) => {
    setOptions((prev) => prev.filter((option) => option._id !== id));
  };
  const edit_option = (option: TAsseessmentQuestionOption) => {
    const new_options = [...options];

    const index = options.findIndex((each) => option._id === each._id);

    if (index < 0) return;

    console.log("Option to update", option);

    new_options[index] = { ...option };

    setOptions([...new_options]);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((option, i) => (
        <EachOption
          key={option.content}
          edit_option={edit_option}
          remove_option={remove_option}
          setCorrectOption={setCorrectOption}
          correct_option={correct_option}
          option={option}
          question_id={question_id}
          index={i + 1}
        />
      ))}
      <div className="flex gap-4 justify-between">
        {/* Add Option */}
        <span
          className="text-primary text-lg cursor-pointer"
          onClick={add_option}
        >
          Add option
        </span>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
