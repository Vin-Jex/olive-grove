import React, { FC } from "react";

const PreviewOption: FC<{ question_id: string; option: string }> = ({
  question_id,
  option,
}) => {
  return (
    <div className="flex gap-3">
      <label className="radio">
        <input type="radio" name={question_id} />
        <span className="checkmark"></span>
      </label>
      <span>{option}</span>
    </div>
  );
};

export default PreviewOption;
